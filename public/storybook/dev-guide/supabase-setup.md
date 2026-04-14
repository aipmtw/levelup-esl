# Supabase setup

## Step 1 — Create project

1. Go to https://supabase.com and sign up (use the `aipmtw` GitHub account for consistency)
2. New project → name: `markluce-mvp` → region: **Singapore** (closest to Taiwan, lowest latency)
3. Set a strong database password and save it to a password manager
4. Wait 1–2 minutes for provisioning
5. Note the three values from **Project Settings → API**:
   - **Project URL** — e.g. `https://xxxxx.supabase.co`
   - **anon public key** (safe to expose in frontend)
   - **service_role key** (server-only, NEVER ship to client)

Add them to `.env.local` in your Next.js project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Step 2 — Database schema

Run this SQL in the **SQL Editor** (Supabase dashboard → SQL Editor → New query).

```sql
-- === Extensions ===
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- === Enums ===
create type partner_tier as enum ('starter', 'growth', 'pro');
create type partner_role as enum ('master', 'sub', 'end_user');
create type book_status as enum ('draft', 'pending_review', 'approved', 'delivered', 'revoked');
create type age_tier as enum ('0-3', '4-6', '7-9', '10-12');

-- === Users ===
-- Supabase auth.users is managed by Supabase Auth.
-- We use a profile table to extend it with LINE login attribution.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  line_user_id text unique,
  display_name text not null,
  first_touch_partner_slug text,
  role partner_role not null default 'end_user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- === Partners ===
create table public.partners (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  display_name text not null,
  role_description text,
  tier partner_tier not null default 'starter',
  parent_partner_id uuid references public.partners(id),
  owner_user_id uuid references public.profiles(id) not null,
  public_page_config jsonb not null default '{}'::jsonb,
  brand_color text default '#ff6f61',
  line_group_url text,
  list_price_nt numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partners_owner_idx on public.partners(owner_user_id);
create index partners_slug_idx on public.partners(slug);
create index partners_parent_idx on public.partners(parent_partner_id);

-- === End-user kid profiles (private per partner) ===
create table public.kid_profiles (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  parent_line_user_id text not null,
  kid_name text not null,
  kid_age int check (kid_age >= 0 and kid_age <= 12),
  interests text[],
  notes text,
  cartoon_reference_storage_path text, -- points to Supabase Storage
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index kid_profiles_partner_idx on public.kid_profiles(partner_id);

-- === Books ===
create table public.books (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  kid_profile_id uuid references public.kid_profiles(id) on delete set null,
  title_zh text not null,
  title_en text,
  title_ja text,
  age_tier age_tier not null,
  languages text[] not null default array['zh-TW']::text[],
  page_count int,
  complexity_level int check (complexity_level >= 1 and complexity_level <= 10),
  theme text,
  status book_status not null default 'draft',
  pwa_name text,                 -- unique display name for the PWA
  pwa_start_url text,
  zh_locale text not null default 'zh-Hant' check (zh_locale = 'zh-Hant'),
  ai_services jsonb not null default '[]'::jsonb,
  co_editor_name text not null default 'Luce',
  reviewer_display_name text,
  reviewer_line_user_id_hash text,
  reviewer_signature text,
  approved_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index books_partner_idx on public.books(partner_id);
create index books_kid_idx on public.books(kid_profile_id);
create index books_status_idx on public.books(status);

-- === Book pages ===
create table public.book_pages (
  id uuid primary key default uuid_generate_v4(),
  book_id uuid not null references public.books(id) on delete cascade,
  page_number int not null,
  text_zh text not null,
  text_en text,
  text_ja text,
  illustration_storage_path text,
  audio_zh_storage_path text,
  audio_en_storage_path text,
  audio_ja_storage_path text,
  scene_description text,
  created_at timestamptz not null default now(),
  unique(book_id, page_number)
);

create index book_pages_book_idx on public.book_pages(book_id);

-- === PWA allowlists ===
create table public.pwa_allowlists (
  book_id uuid not null references public.books(id) on delete cascade,
  line_user_id text not null,
  added_by_user_id uuid not null references public.profiles(id),
  ttl_days int not null default 90,
  added_at timestamptz not null default now(),
  primary key (book_id, line_user_id)
);

-- === Audit log ===
create table public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid references public.partners(id),
  user_id uuid references public.profiles(id),
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index audit_partner_idx on public.audit_log(partner_id);
create index audit_created_idx on public.audit_log(created_at desc);

-- === Updated-at triggers ===
create or replace function update_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger partners_updated_at before update on public.partners
  for each row execute function update_updated_at();
create trigger kid_profiles_updated_at before update on public.kid_profiles
  for each row execute function update_updated_at();
create trigger books_updated_at before update on public.books
  for each row execute function update_updated_at();
```

## Step 3 — Row Level Security (RLS)

Enable RLS on every partner-owned table. Partners must only see their own data.

```sql
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.kid_profiles enable row level security;
alter table public.books enable row level security;
alter table public.book_pages enable row level security;
alter table public.pwa_allowlists enable row level security;
alter table public.audit_log enable row level security;

-- profiles: users can read/write their own profile only
create policy "profiles self read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles self update"
  on public.profiles for update
  using (auth.uid() = id);

-- partners: the owner (partner user) can read/write their own partner row.
-- Everyone can READ partner rows (needed for public pages).
create policy "partners public read"
  on public.partners for select
  using (true);

create policy "partners owner write"
  on public.partners for all
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- kid_profiles: only readable/writable by the owning partner
create policy "kid_profiles partner isolation"
  on public.kid_profiles for all
  using (
    partner_id in (
      select id from public.partners where owner_user_id = auth.uid()
    )
  )
  with check (
    partner_id in (
      select id from public.partners where owner_user_id = auth.uid()
    )
  );

-- books: partner isolation; public read when status = 'delivered'
create policy "books partner write"
  on public.books for all
  using (
    partner_id in (
      select id from public.partners where owner_user_id = auth.uid()
    )
  )
  with check (
    partner_id in (
      select id from public.partners where owner_user_id = auth.uid()
    )
  );

create policy "books public read delivered"
  on public.books for select
  using (status = 'delivered');

-- book_pages: inherit from parent book
create policy "book_pages partner write"
  on public.book_pages for all
  using (
    book_id in (
      select id from public.books
      where partner_id in (
        select id from public.partners where owner_user_id = auth.uid()
      )
    )
  );

create policy "book_pages public read when delivered"
  on public.book_pages for select
  using (
    book_id in (select id from public.books where status = 'delivered')
  );

-- pwa_allowlists: only the owning partner can read/write
create policy "pwa_allowlists partner isolation"
  on public.pwa_allowlists for all
  using (
    book_id in (
      select id from public.books
      where partner_id in (
        select id from public.partners where owner_user_id = auth.uid()
      )
    )
  );

-- audit_log: partners can read their own audit events
create policy "audit_log partner read"
  on public.audit_log for select
  using (
    partner_id in (
      select id from public.partners where owner_user_id = auth.uid()
    )
  );
```

## Step 4 — Storage buckets

In **Storage** (dashboard → Storage → New bucket):

| Bucket | Public? | Purpose |
|---|---|---|
| `book-assets` | **Private** | Generated book images and audio files, per book |
| `cartoon-refs` | **Private** | Cartoonified environment references per kid_profile |
| `raw-uploads` | **Private + 24h TTL lifecycle** | Short-lived raw photo bucket — auto-delete after 24h |

### Raw-uploads lifecycle policy

Supabase Storage doesn't support TTL natively, but you can enforce it with a scheduled Edge Function. Add a cron-style Edge Function that runs hourly and deletes any object in `raw-uploads` older than 24 hours.

```typescript
// supabase/functions/cleanup-raw-uploads/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const { data: files } = await supabase.storage.from('raw-uploads').list('', { limit: 1000 })
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const toDelete = (files || [])
    .filter(f => new Date(f.created_at) < cutoff)
    .map(f => f.name)
  if (toDelete.length > 0) {
    await supabase.storage.from('raw-uploads').remove(toDelete)
  }
  return new Response(JSON.stringify({ deleted: toDelete.length }))
})
```

Schedule it with **pg_cron** (Supabase supports it natively):

```sql
select cron.schedule(
  'cleanup-raw-uploads-hourly',
  '0 * * * *',
  $$select net.http_post(
    url := 'https://xxxxx.supabase.co/functions/v1/cleanup-raw-uploads',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  )$$
);
```

### Storage RLS

Apply policies per bucket via the dashboard → Storage → Policies:

```sql
-- book-assets: partner isolation via path prefix convention {partner_slug}/...
create policy "book-assets partner read"
  on storage.objects for select
  using (
    bucket_id = 'book-assets' AND
    (storage.foldername(name))[1] IN (
      select slug from public.partners where owner_user_id = auth.uid()
    )
  );

create policy "book-assets partner write"
  on storage.objects for insert
  with check (
    bucket_id = 'book-assets' AND
    (storage.foldername(name))[1] IN (
      select slug from public.partners where owner_user_id = auth.uid()
    )
  );
```

Apply similar policies to `cartoon-refs`. `raw-uploads` should only be accessible by the service role (not anon).

## Step 5 — Edge Functions (AI pipeline)

Edge Functions are Deno-based serverless functions that run on Supabase's infrastructure, adjacent to the DB. They're how you call OpenAI and Azure TTS without exposing API keys to the client.

Create a `supabase/functions/` directory in your Next.js project. Install the Supabase CLI locally:

```bash
npm install -g supabase
supabase login
supabase link --project-ref xxxxx
```

Functions you'll want for M1:

| Function | Purpose |
|---|---|
| `draft-story` | Takes questionnaire → calls OpenAI → returns structured `{ pages: [...] }` |
| `generate-illustrations` | Takes page list → calls gpt-image-1 → saves to Storage, returns paths |
| `generate-narration` | Takes page list + voices → calls Azure TTS → saves MP3s to Storage |
| `cartoonify-photo` | Takes raw uploaded photo → calls gpt-image-1 with cartoon prompt → saves result to `cartoon-refs`, deletes raw |
| `approve-book` | Sets status=approved, computes HMAC signature, stamps ai_services + reviewer fields |
| `cleanup-raw-uploads` | Hourly cron to delete raw photos older than 24h |

### Environment variables for Edge Functions

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set AZURE_SPEECH_KEY=...
supabase secrets set AZURE_SPEECH_REGION=southeastasia
supabase secrets set PARTNER_SIGNATURE_SECRET=$(openssl rand -hex 32)
```

Deploy:
```bash
supabase functions deploy draft-story
supabase functions deploy generate-illustrations
# ... etc
```

## Step 6 — Seed data for development

Create a seed script that sets up Audrey as the primary test partner.

```sql
-- === Seed: Audrey as the primary test partner ===
-- Run this ONCE after creating Audrey's auth.users entry (via LINE login in dev)

-- Replace 'AUDREY_AUTH_UID' with the actual uuid from auth.users after she logs in via LINE
insert into public.profiles (id, line_user_id, display_name, role)
values ('AUDREY_AUTH_UID', 'AUDREY_LINE_USER_ID', 'Audrey', 'master')
on conflict (id) do update set role = 'master';

insert into public.partners (slug, display_name, role_description, tier, owner_user_id, brand_color)
values (
  'audrey',
  'Audrey',
  '6 歲和 10 歲孩子的職場家長',
  'pro',
  'AUDREY_AUTH_UID',
  '#ff9f43'
);
```

For Amy and Arita, same pattern with different slugs / roles.

## Testing RLS locally

Supabase's SQL Editor runs as the postgres superuser, which bypasses RLS. To test RLS properly:

1. Sign into your Next.js dev app as Audrey (via LINE login)
2. Try to read another partner's `kid_profiles` via the client SDK
3. You should get an empty array (not an error) — that's RLS working correctly

```typescript
// In a dev-only test page:
const { data, error } = await supabase
  .from('kid_profiles')
  .select('*')
// If Audrey can see other partners' kids, RLS is broken.
```

## Common pitfalls

- **Forgetting to enable RLS** — the default is RLS disabled. Always `alter table ... enable row level security` on every table.
- **Using the service_role key in the browser** — it bypasses RLS entirely. Only use it in server code (Edge Functions or Next.js server routes).
- **Storage path doesn't include partner slug** — breaks the storage RLS policy. Convention: `{partner_slug}/{book_id}/{page_number}.jpg`.
- **Edge Function timeout** — default is 60 seconds. If your OpenAI call takes longer, chunk the work or use background jobs (Supabase Queues, not in free tier).
- **Free tier limits** — 500 MB DB, 1 GB storage, 2 GB egress. Plenty for MVP, but don't store raw photos or enormous audio files; compress MP3s to 128 kbps mono.
