# LINE Login setup

Goal: users sign in with LINE, the app receives their LINE user ID + display name, attribution tracks which partner's page they came from, and the session is bridged into a Supabase JWT so all downstream DB calls are authenticated and RLS-scoped.

## Step 1 — Create a LINE provider + channel

1. Go to https://developers.line.biz/console/ and sign in with a LINE account.
2. Create a **Provider** named `markluce` (or similar). A provider groups channels and represents the business entity.
3. Inside that provider, click **Create a new channel** → select **LINE Login**.
4. Fill in:
   - **Channel name:** `markluce.ai`
   - **Channel description:** `0–12 year old personalized language books`
   - **App types:** **Web app** (check)
   - **Email:** your contact
   - **Privacy policy URL / Terms of service URL:** Optional for M1; required before going live. Use `https://app.markluce.ai/privacy` and `https://app.markluce.ai/terms` as placeholders.
5. Agree to terms → Create.

## Step 2 — Configure the channel

After creation, the channel dashboard shows a few tabs. Key things to do:

### Basic settings
- Note the **Channel ID** and **Channel secret** — you'll need both in your `.env.local`.
- **OpenID Connect:** should be enabled by default. Confirm it is.

### LINE Login settings
- **Callback URL** — this is the redirect URI after successful login. Add ALL of these (LINE lets you register multiple):
  - `http://localhost:3000/api/auth/line/callback` (local dev)
  - `https://biz-plan-app-*.vercel.app/api/auth/line/callback` (Vercel preview; use the exact pattern your Vercel gives you)
  - `https://app.markluce.ai/api/auth/line/callback` (production)
- **Scopes:** check the boxes for:
  - `profile` — gets user's display name, user ID, profile picture
  - `openid` — gets stable user ID + OIDC id_token
  - `email` (optional) — only if you need their email; typically not needed for MVP

### Email permission
LINE only returns email if the user has pre-verified it AND you've requested the `email` scope AND you have a separate approval. Don't depend on email for MVP. Use `line_user_id` as the canonical identity.

## Step 3 — Add environment variables

Add to `.env.local` in your Next.js project:

```bash
LINE_CHANNEL_ID=1234567890
LINE_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
LINE_CALLBACK_URL=http://localhost:3000/api/auth/line/callback
# In Vercel production:
# LINE_CALLBACK_URL=https://app.markluce.ai/api/auth/line/callback
```

## Step 4 — Implement the OIDC flow in Next.js

Three routes needed:

### `/api/auth/line/start` — redirect user to LINE

```typescript
// app/api/auth/line/start/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET(req: NextRequest) {
  const partnerSlug = req.nextUrl.searchParams.get('slug') || ''
  const state = randomBytes(16).toString('hex') + ':' + partnerSlug
  const nonce = randomBytes(16).toString('hex')

  // Store state + nonce in a short-lived cookie for later verification
  const response = NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?` +
    new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINE_CHANNEL_ID!,
      redirect_uri: process.env.LINE_CALLBACK_URL!,
      state,
      scope: 'profile openid',
      nonce,
    }).toString()
  )
  response.cookies.set('line_auth_state', state, { httpOnly: true, sameSite: 'lax', maxAge: 600 })
  response.cookies.set('line_auth_nonce', nonce, { httpOnly: true, sameSite: 'lax', maxAge: 600 })
  return response
}
```

### `/api/auth/line/callback` — handle LINE's redirect back

```typescript
// app/api/auth/line/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const expectedState = req.cookies.get('line_auth_state')?.value

  if (!code || state !== expectedState) {
    return NextResponse.json({ error: 'invalid state' }, { status: 400 })
  }

  // Extract partner slug from state
  const partnerSlug = state.split(':')[1] || null

  // Exchange code for LINE tokens
  const tokenResp = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.LINE_CALLBACK_URL!,
      client_id: process.env.LINE_CHANNEL_ID!,
      client_secret: process.env.LINE_CHANNEL_SECRET!,
    }),
  })
  const tokens = await tokenResp.json()
  const { id_token, access_token } = tokens

  // Decode id_token to get the LINE user id (sub)
  const [, payloadBase64] = id_token.split('.')
  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString())
  const lineUserId = payload.sub

  // Get profile for display name
  const profileResp = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  const profile = await profileResp.json()
  const displayName = profile.displayName

  // Bridge into Supabase: create or update an auth user + profile row
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Use LINE user id as Supabase external identifier
  const email = `${lineUserId}@line.local`  // synthetic email, never sent
  const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { line_user_id: lineUserId, display_name: displayName },
  })
  // If already exists, fetch instead
  // ... (handle "user already exists" error case)

  // Upsert profile
  await supabaseAdmin.from('profiles').upsert({
    id: user.user!.id,
    line_user_id: lineUserId,
    display_name: displayName,
    first_touch_partner_slug: partnerSlug,
  }, { onConflict: 'id', ignoreDuplicates: false })

  // Generate a Supabase session for this user
  const { data: sessionData } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })
  // Redirect user to a page that consumes the magic link and sets the session cookie
  // OR use admin.signInWithEmailOtp pattern

  // For MVP, simplest: set a signed cookie with the access_token yourself
  // and read it in server components via supabase.auth.getUser()
  // (Supabase's SSR helpers handle this if configured correctly)

  const response = NextResponse.redirect(new URL(`/${partnerSlug || ''}`, req.url))
  // ... set session cookies using @supabase/ssr helpers
  return response
}
```

> **Note:** the Supabase-LINE bridge is the trickiest part of M1. There are multiple patterns:
> 1. **Synthetic email** approach (shown above) — use `{line_user_id}@line.local` as the Supabase identity. Simple but feels hacky.
> 2. **Custom JWT signing** — sign your own JWT using Supabase's JWT secret and set the session cookie directly. More control but more code.
> 3. **Supabase "sign in with ID token" (OIDC)** — Supabase Auth has an `signInWithIdToken` method that accepts OIDC tokens from configured providers. LINE isn't a built-in provider but you may be able to register it via Supabase's custom OAuth provider feature (in Auth → Providers → Custom).
>
> For MVP, start with pattern 1 or 2 and move to 3 if it proves cleaner.

### `/api/auth/line/logout`

```typescript
// app/api/auth/line/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', req.url))
}
```

## Step 5 — Partner attribution via `state` param

The whole point of putting `{slug}` in the `state` parameter is to record which partner's page the user came from. Usage:

1. User clicks "Sign in with LINE" on `app.markluce.ai/audrey`
2. Button links to `/api/auth/line/start?slug=audrey`
3. The start route puts `audrey` into the `state` param sent to LINE
4. LINE redirects back to `/api/auth/line/callback` with the same `state`
5. The callback extracts `audrey` from `state` and writes it into `profiles.first_touch_partner_slug`
6. First-touch is **sticky** — once set, it's never overwritten. If the user later visits `app.markluce.ai/arita`, their profile still shows Audrey as the first-touch partner.

## Step 6 — Roles

After a user has been created via LINE login, manually upgrade specific users to partner/master roles:

```sql
update public.profiles
set role = 'master'
where line_user_id = 'U_audrey_line_id';

insert into public.partners (slug, display_name, tier, owner_user_id)
values ('audrey', 'Audrey', 'pro', (select id from public.profiles where line_user_id = 'U_audrey_line_id'));
```

In production, this happens through an admin UI; for MVP, manual SQL is fine.

## Step 7 — Testing the flow

1. Run Next.js locally (`npm run dev`)
2. Open `http://localhost:3000/test-partner?slug=audrey`
3. Click "Sign in with LINE"
4. LINE screen appears, you approve
5. Redirect back to `http://localhost:3000/audrey`
6. Check Supabase dashboard:
   - `auth.users` has a new row
   - `public.profiles` has a matching row with `first_touch_partner_slug = 'audrey'`
7. Logout, log back in from a different partner URL — verify `first_touch_partner_slug` doesn't change (sticky first-touch)

## Common pitfalls

- **Callback URL mismatch** — LINE is strict. Even a trailing slash difference will reject the request. Register the exact URLs.
- **State parameter not verified** — skipping state verification = CSRF vulnerability. Always compare against the cookie.
- **LINE user id vs email as primary key** — use `line_user_id` as the canonical identity, not email. LINE only returns email if pre-verified.
- **Cookie settings broken on production** — local dev uses `http://localhost`, production uses `https://app.markluce.ai`. Cookie `sameSite: 'lax'` works for OAuth redirects; `secure: true` required in prod.
- **Next.js 14 App Router vs Pages Router** — the code above is for App Router (`app/api/auth/line/callback/route.ts`). If you're on Pages Router, the handler shape is different.

## Required reading

- LINE Login v2.1 docs: https://developers.line.biz/en/docs/line-login/
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase + Next.js SSR helpers: https://supabase.com/docs/guides/auth/server-side/nextjs
