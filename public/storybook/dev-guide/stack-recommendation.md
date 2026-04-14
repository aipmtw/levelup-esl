# Stack recommendation

## The stack (locked)

| Layer | Choice | Version | Why |
|---|---|---|---|
| Frontend framework | **Next.js** (App Router, TypeScript) | 14+ | Best Supabase integration, great PWA support, Vercel-native |
| Runtime | Node.js | 20 LTS | |
| Language | TypeScript | 5+ strict mode | |
| Styling | **Tailwind CSS** | 3+ | Fast, common, great for MVP |
| UI primitives | **shadcn/ui** | latest | Copy-paste components, no runtime dependency |
| Database | **Supabase** (Postgres 15+) | | RLS-friendly, generous free tier |
| Auth | **LINE Login v2.1 (OIDC)** → bridged to Supabase JWT | | Only auth method |
| Storage | **Supabase Storage** | | Book assets (images, mp3s), encrypted at rest |
| Background jobs | **Supabase Edge Functions** (Deno) | | AI pipeline orchestration |
| LLM | **OpenAI API** (GPT-4-class) | | Traditional Chinese via prompt |
| Image generation | **OpenAI `gpt-image-1`** | | Style-lock for character consistency |
| TTS | **Azure Cognitive Services — Neural TTS** | | `zh-TW-*` voices only |
| Hosting | **Vercel** | Free tier for MVP | Next.js-native, auto HTTPS |
| DNS | Existing markluce.ai registrar (Cloudflare recommended) | | `app.markluce.ai` subdomain → Vercel |
| Payment | **NONE** — all billing offline | | Bank transfer / LINE Pay / cash |

## Why Next.js (and not SvelteKit, Remix, Nuxt, etc.)

- **Largest Supabase ecosystem.** Supabase's first-party auth helpers are Next.js-first. `@supabase/ssr` gives you SSR-safe auth out of the box.
- **PWA patterns are well-documented.** next-pwa plugin exists, and App Router supports service worker registration natively.
- **Vercel deployment is one command.** `vc` CLI + GitHub integration = zero-config prod deploys.
- **TypeScript support is rock-solid.** No rough edges.
- **Large hire pool** (in case Mark ever wants to bring someone on to help build it).

### Alternatives briefly considered and rejected

- **SvelteKit** — leaner and faster, but Supabase integration is second-class. MVP isn't the time to fight tooling.
- **Remix** — great DX, but smaller ecosystem and weaker Supabase story than Next.js.
- **Pure React + Vite** — fast to start, but you'd rebuild SSR + routing by hand. Not worth it.
- **Astro** — great for content sites but overkill for an authenticated app with heavy interactivity.

## Why Supabase (and not Firebase, PlanetScale, Neon, custom Postgres)

- **Row Level Security (RLS)** — the partner isolation model maps directly to Postgres RLS policies. One `partner_id` column + one policy = enforced isolation. No app-layer auth code to write.
- **Built-in auth with JWT** — we bridge LINE Login into a Supabase JWT once per session, then every DB call is automatically scoped by RLS. Huge security win.
- **Storage + DB in one system** — book assets (PDFs, JPGs, MP3s) live in Supabase Storage, keyed by the same `partner_id`, with matching RLS policies. No cross-system sync headaches.
- **Edge Functions** — for AI pipeline orchestration (OpenAI, Azure calls that can't run client-side because of API keys). Deno-based, deployed alongside the DB, scales automatically.
- **Free tier is generous enough for MVP** — 500 MB database, 1 GB storage, 2 GB bandwidth. Enough to ship a capstone demo without any billing setup.
- **Self-hostable later** — if markluce.ai ever needs to move off Supabase-the-service, Supabase is open source. Not a trap.

### Alternatives briefly considered and rejected

- **Firebase** — Google ecosystem, NoSQL (Firestore) doesn't fit our relational partner/book/reviewer schema. Auth story is Google-first, awkward for LINE bridging.
- **Custom Postgres + Auth0** — more setup, more to maintain, no storage integration.
- **PlanetScale / Neon** — DB only, no storage/auth/edge functions. Would need to glue 3–4 services together.

## Why OpenAI for both LLM and images

- **Single vendor, single API key, single billing account.** Simpler than mixing Anthropic + Stability + ElevenLabs for MVP.
- **gpt-image-1 supports reference images** — critical for cartoonifying environment photos and maintaining style consistency.
- **Traditional Chinese quality is good** — GPT-4 class models handle zh-TW well with explicit prompt instructions.
- **Rate limits are manageable at MVP scale** — Mark is generating ~10–30 books total over 8 weeks.

Future upgrade path: swap gpt-image-1 for Flux + per-character LoRA when character consistency becomes a priority (M2+). The pipeline is designed to be provider-agnostic via the `ai_services[]` stamp in `meta.json`.

## Why Azure Neural TTS (not ElevenLabs for baseline)

- **Cheapest premium tier** — ~$16 / 1M characters. Generous enough that MVP book narration costs pennies per book.
- **Best zh-TW quality** — Microsoft's HsiaoChen / HsiaoYu voices are specifically tuned for Taiwan locale. ElevenLabs is weaker on Traditional Chinese.
- **Japanese quality is also excellent** — Nanami and Aoi voices for ja-JP are among the best available.
- **Storytelling style prosets built in** — `style="storytelling"` / `style="gentle"` work well for kid books.

ElevenLabs is reserved as a partner-configurable premium upsell in later milestones, not the baseline.

## Why offline payment (and not Stripe)

- **Taiwan market reality** — partners prefer bank transfer / LINE Pay / cash for small-scale B2B settlements.
- **No payment compliance** — no PCI-DSS, no Strong Customer Authentication, no chargebacks, no refund-flow UX. The platform records usage and emits invoices; humans handle the money.
- **二聯/三聯 GUI invoicing** — Taiwan 統一發票 needs local software or a manual workflow. Stripe doesn't solve this.
- **Faster MVP** — skipping payment integration saves 1–2 weeks of the 8-week sprint.

Self-serve billing lands in M2 if M1 succeeds, still probably **not** through a gateway — more likely a Taiwan-specific payment provider (綠界 / 藍新) only when volume justifies it.

## Estimated cost for MVP (8 weeks)

| Item | Cost |
|---|---|
| Vercel (Hobby tier) | **$0** |
| Supabase (Free tier) | **$0** |
| OpenAI API (~20 books × ~$0.50 each in LLM + gpt-image-1) | **~$10** |
| Azure Neural TTS (~20 books × ~1000 chars each = 20k chars) | **~$0.30** |
| Domain (markluce.ai already owned) | **$0** incremental |
| Total out-of-pocket for MVP | **~$10–15 USD** |

If the MVP goes well and real partners start generating real books, OpenAI usage is the main variable cost. Everything else scales with Vercel / Supabase paid tiers ($20/mo each) only when free-tier limits are exceeded.

## Not chosen — explicitly avoided

- **Kubernetes / custom Docker hosting** — unnecessary for MVP, adds ops burden
- **Microservices** — single Next.js app is fine
- **GraphQL** — REST + Supabase client is simpler for MVP scope
- **Redux / Zustand / global state** — Next.js server components + Supabase realtime handles most state
- **Custom CMS** — partner public page config lives in the DB as JSON, rendered by Next.js pages
- **Auth0 / Clerk** — Supabase Auth + LINE OIDC bridge handles this without the extra service
- **Sentry / Datadog at MVP** — add when there's something to monitor
- **CI/CD platforms beyond Vercel + GitHub Actions** — Vercel handles preview deploys automatically
