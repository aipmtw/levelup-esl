# Partner surfaces — public page + private workspace

Each partner has **two distinct surfaces** on markluce.ai. This split applies to Audrey, Arita, and every future partner.

## 1. Public page — `app.markluce.ai/{slug}`
Visible to the world. Purpose: introduce the partner's target market and their ad wording. This is the partner's **storefront**.

### URL pattern
- `app.markluce.ai/{partner-slug}` — e.g. `/audrey`, `/arita`.
- Slug is unique, lowercase, `[a-z0-9-]`.

### Public CMS fields (partner-editable, visible to everyone)
- **Headline** (Traditional Chinese / English / Japanese variants).
- **Target market description** — who the partner serves.
- **Ad copy / pitch** — 2–3 sentence value prop, in partner's voice.
- **Brand color** — single primary hex.
- **Logo / avatar** — optional image upload.
- **Demo works** — public showcase list (thumbnail + title + link to demo book).
- **CTA button** — label + action (sign in, join LINE group, start questionnaire).
- **LINE group link** — partner's own group URL.
- **List price per book / per age tier** — partner picks a specific value within the platform's suggested range. Displayed publicly with label like "建議零售價 / Suggested list price". See [`../pricing/list-price-en.md`](../pricing/list-price-en.md).
- **Discount callout** — free text explaining that partner-channel discounts may apply, e.g. "加入 LINE 群取得會員報價".

### Platform-controlled on public page
- URL, routing, auth, infra.
- Shared template inventory (partners fork; don't edit base templates).
- Footer: "Powered by markluce.ai".

## 2. Private workspace — `app.markluce.ai/{slug}/admin`
Visible **only to the partner** (and to Mark as global admin). Purpose: manage customers, books, allowlists, pricing, notes. This is the partner's **back office**.

### Private fields
- **Customer list** — end-user profiles (LINE user IDs, display names, tags, parent contacts). Per-partner. Never visible to other partners.
- **Per-kid notes** — for Arita's channel: parent consultation records, learning goals, what worked / didn't.
- **Book inventory** — every book this partner has generated, with metadata, PWA status, allowlist, revoke controls.
- **PWA allowlists** — which LINE user IDs can install which books. Per-book editable.
- **Actual transacted price per customer** — partner optionally records the real price they charged each end user (off-platform transaction). Private analytics compares actual vs list price, shows discount distribution. Mark never sees this.
- **Private analytics** — usage per book, per customer, per month.
- **Parent-consultation questionnaire responses** — Arita's channel: incoming forms from parents.

### Access control
- Partner signs in via LINE (same login).
- Partner role unlocks `/admin` for their own slug only.
- **Strict isolation:** one partner cannot see another partner's workspace.
- Mark has global admin across all slugs.

## Attribution
- LINE Login redirect includes `state={slug}`.
- First-touch partner slug is persisted on the user record forever.
- Generations and billable events tag the originating partner.

## For every future partner
New partners (after Audrey + Arita) get the same two-surface setup:
- Public page they edit via CMS — target market + ad copy visible to everyone.
- Private workspace they manage their own customers in — isolated from other partners.
- No new code per partner. Everything is config.
