# Domain + DNS setup

**Do this first.** DNS propagation takes 1–6 hours, so kicking it off early unblocks the Vercel deployment step later.

## The plan

- **`markluce.ai`** — existing, stays pointed at whatever it currently points at. No change.
- **`app.markluce.ai`** — new subdomain, pointed at Vercel for the MVP Next.js app.
- All partner pages live under `app.markluce.ai/{partner-slug}` (path-based routing inside Next.js, not subdomains).

## Prerequisite: Cloudflare as DNS provider (recommended)

If `markluce.ai` is not already on Cloudflare, move it there first. Cloudflare is recommended because:
- **Free DNS** with fast propagation
- **Automatic HTTPS** via Universal SSL
- **Free DDoS + bot protection**
- **Easy Vercel integration** — set CNAME, that's it
- **Analytics** included free tier

### Transfer steps if currently elsewhere
1. Create a free Cloudflare account at https://dash.cloudflare.com/sign-up
2. Click "Add a site" → enter `markluce.ai`
3. Cloudflare will scan existing DNS records and give you two nameservers to set at your current registrar
4. Update nameservers at your current registrar to point at Cloudflare's NS
5. Wait for propagation (minutes to hours)
6. Cloudflare dashboard will show "Active" once complete

Existing DNS records for the current `markluce.ai` site will be carried over by Cloudflare's scan — verify the A / AAAA / CNAME records look right before activating.

## Add `app.markluce.ai` subdomain → Vercel

### Step 1 — Add domain in Vercel project
1. In Vercel dashboard, open your `biz-plan-app` project (create it if it doesn't exist yet — requires the project to be imported from GitHub first)
2. Settings → Domains → Add → `app.markluce.ai`
3. Vercel will show you one of two instructions:
   - Usually: **Add a CNAME record** pointing `app` → `cname.vercel-dns.com`
   - Sometimes: **Add an A record** pointing `app` → a specific IP

### Step 2 — Add the DNS record in Cloudflare
1. Cloudflare dashboard → `markluce.ai` → DNS → Records → Add record
2. Type: **CNAME**
3. Name: **app**
4. Target: **cname.vercel-dns.com**
5. Proxy status: **DNS only** (orange cloud OFF) — **critical**, because Vercel handles its own SSL and proxying through Cloudflare will conflict
6. TTL: Auto
7. Save

### Step 3 — Verify
```bash
# From any terminal:
dig app.markluce.ai
# Should show a CNAME record pointing at cname.vercel-dns.com
```

Back in Vercel, the domain status should flip from "Invalid Configuration" to "Valid Configuration" within minutes. Vercel will auto-issue a Let's Encrypt SSL cert.

### Step 4 — Confirm HTTPS works
Open `https://app.markluce.ai` in a browser. You should see either the Vercel default page, or your Next.js app if it's already deployed. Verify the lock icon.

## Why path-based partner routing (`app.markluce.ai/audrey`) not wildcard subdomain (`audrey.markluce.ai`)

- **Simpler DNS** — one CNAME, not a wildcard
- **Simpler SSL** — Vercel's auto-cert covers one hostname
- **Simpler auth** — one LINE Login channel, one redirect URI, `state={slug}` for attribution
- **Simpler analytics** — all partner traffic shows up as `app.markluce.ai` in one analytics account
- **Upgrade path preserved** — if a partner ever wants their own subdomain in M2+, adding `audrey.markluce.ai` as an additional CNAME later is trivial

## Environment-specific URLs

| Environment | URL | Purpose |
|---|---|---|
| Local dev | `http://localhost:3000` | During development |
| Vercel preview (per branch) | `biz-plan-app-*-aipmtw.vercel.app` | Auto-generated on every PR |
| Production | `https://app.markluce.ai` | The real thing |

Configure LINE Login redirect URIs to include all three (see [`line-login-setup.md`](line-login-setup.md) step 4).

## Common pitfalls

- **Cloudflare proxy enabled (orange cloud ON)** — will break Vercel's SSL. Must be OFF for the `app` subdomain.
- **Existing A record conflicting with new CNAME** — Cloudflare requires these to be distinct. Delete any pre-existing `app` record first.
- **Vercel domain "pending verification"** for more than 1 hour — usually means the CNAME target is wrong, or Cloudflare proxy is on. Re-check.
- **Mixed content warnings** — all assets must be served over HTTPS. Don't mix `http://` and `https://` in code.

## What this doesn't cover

- **Mail records (MX, SPF, DKIM)** — if you want to send email from `@markluce.ai`, set up a separate email service (Google Workspace, Fastmail, etc.) and configure DNS accordingly. Not needed for MVP (LINE OA handles all partner↔end-user notifications).
- **Subdomain for API** — not needed for MVP. Supabase has its own subdomain (`xxx.supabase.co`), and the Next.js app hits it directly from the client or server routes.
