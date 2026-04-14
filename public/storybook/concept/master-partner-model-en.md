# Master partner model — two-tier partnership

## The idea
Mark keeps his **direct billing relationships to a small number of master partners** — initially **three**: Audrey, Arita, and Amy. Forever (or at least for a long time). They become **master partners**. Each of them can recruit, coach, and sublet the platform to **sub-partners** who run the same kid-book PWA business under their own social network but sit under Audrey's or Arita's umbrella.

Mark's customer list stays tiny. Revenue scales through Audrey's and Arita's sub-networks.

## Why this is good for Mark
- **Support surface stays at 2.** Mark only answers messages from Audrey and Arita. Sub-partners are coached by their master partner, not by Mark.
- **Quality control outsourced to master partners.** Audrey and Arita are the ones with real customer relationships — they're the best filter for who should be allowed to run the product. Bad sub-partner = master partner's problem to fix.
- **Incentive alignment.** Audrey and Arita earn from their sub-networks however they negotiate it. Mark stays out of the middle.
- **Mark's revenue scales.** Per-generation billing to master partners rolls up ALL sub-partner usage. Master partners will naturally upgrade to higher tiers as their sub-networks grow.
- **No MLM ickiness** if kept **strictly two-tier**. No sub-sub-sub. No recruitment commissions paid by Mark. Real value = real books sold to real parents.

## Why this is good for Audrey and Arita
- They become **small platform operators** themselves, not just content creators.
- Their existing social networks (Audrey's parent circles, Arita's teacher network) become recruiting grounds for like-minded sub-partners.
- They earn from their recruits however they want — Mark doesn't dictate the split.
- They build a moat: the sub-network depends on them, not on Mark directly.

## Why this is good for sub-partners
- **Lower barrier to entry.** They don't need to negotiate terms with Mark. They join under an existing master partner's wing.
- **Real coaching.** Master partner has done it, knows what works, shows them the ropes.
- **Shared templates and learnings.** Master partner can share their proven book templates, questionnaire variants, pricing experiments.

## Architecture — strict two-tier

```
Mark (platform owner)
  │
  ├── master partner: Audrey   (4–12, working-parent channel)
  │     ├── sub-partner: e.g. "Mei, school-mom friend"
  │     ├── sub-partner: e.g. "Jenny, preschool teacher"
  │     └── sub-partner: ...
  │
  ├── master partner: Arita    (4–12, kid-teacher channel)
  │     ├── sub-partner: e.g. "Lin, fellow English tutor"
  │     └── sub-partner: ...
  │
  └── master partner: Amy      (0–3, new-parent channel — Mark's daughter, see family-governance)
        ├── sub-partner: e.g. "a friend from her baby-group"
        └── sub-partner: ...
```

**Two tiers only.** Sub-partners cannot recruit their own sub-sub-partners. If a sub-partner outgrows their master (rare, deliberate), they can be **graduated to master partner** status with Mark's approval — but that's a promotion, not a new tier.

## What Mark provides to master partners
- **Sub-partner management** in the master's private workspace — create sub-slugs, invite sub-partners, revoke.
- **Nested attribution** — LINE Login `state` carries `{master_slug}/{sub_slug}`, rolled up at billing time.
- **Sub-partner CMS** — sub-partner edits their own public page under the master's namespace, within the limits the master sets.
- **Template inheritance** — sub-partner forks from master's custom templates (not just Mark's base templates).
- **Usage rollup** — master's billing dashboard shows sub-partner usage; Mark invoices the master for the combined total.
- **Coaching kit** — Mark gives Audrey and Arita a ready-made coaching playbook (how to onboard a sub-partner, how to split revenue, how to handle support).

## Namespaces

### Master partner public page
`app.markluce.ai/audrey` — Audrey's own storefront. Her target market, her demo books, her list price, her LINE group.

### Sub-partner public page (two options, pick one)
- **Option A — path:** `app.markluce.ai/audrey/mei` — reads like "Mei, hosted by Audrey".
- **Option B — flat slug with parent metadata:** `app.markluce.ai/mei` with a footer "part of Audrey's network".

**Recommendation: Option A (path).** Keeps the hierarchy visible, reinforces master-partner brand, makes attribution trivial, and makes "graduation" a clean URL migration (`/audrey/mei` → `/mei`) when a sub-partner earns master status.

## Billing
- **Mark bills master partners only.** Same fee structure as today (per-generation infra fee with tiers).
- **Generation rollup:** a sub-partner's generations count toward the master's tier quota and unit rate.
- **Master-to-sub billing is off-platform.** Audrey decides how to charge Mei — revenue share, flat fee, nothing, whatever. Mark doesn't see that money.
- **Dispute fallback:** Mark reserves the right to directly support a sub-partner if a master partner disappears or misbehaves. Rare escalation path only.

## Tier impact
Master-partner capability is a **feature gate**, added to the Growth and Pro tiers. Starter tier does not allow recruiting sub-partners.

| Tier | Master capability | Typical usage |
|---|---|---|
| Starter | ❌ | Solo operator, no sub-partners. |
| Growth | ✅ up to N sub-partners (e.g. 5) | Master operator with a small network. |
| Pro | ✅ unlimited sub-partners | Full master-partner business mode. |

Audrey and Arita are expected to land on **Pro** once they recruit.

## Risks and mitigations
| Risk | Mitigation |
|---|---|
| MLM / pyramid-scheme optics | Strictly two-tier. No Mark-paid recruitment commissions. Real product = real books. |
| Master partner becomes a bottleneck / disappears | Escalation path: Mark can support sub-partners directly in an emergency. Sub-partners keep their customer data in their own private workspace. |
| Bad sub-partner damages master's brand | Master partner has revoke authority over sub-partners in their own workspace. |
| Pricing confusion (master and sub both set list prices?) | Suggested range is set by the platform. Master and sub each pick within it. Attribution is sticky, so each end user sees one price. |
| Cannibalization between master and sub | Geographic / niche separation is the master's job to enforce (Audrey's sub-partners shouldn't target the same preschools Audrey targets). Mark provides no tooling for this; masters resolve it socially. |

## What "selling language material in PWAs" means in this model
The **unit of value** stays the same: a personalized multi-page illustrated kid book in Traditional Chinese (+ English, + optional Japanese), delivered as a LINE-account-gated PWA. See [`../product/kid-book-spec-en.md`](../product/kid-book-spec-en.md).

The **channels** multiply: Audrey's own parent circle, Arita's teacher-student-parent triangles, and every sub-partner's independent social network. Same product, more mouths.

## Graduation path (rare, deliberate)
A sub-partner who:
- Has built a substantial independent customer base under their master's umbrella,
- Has a proven track record (book quality, customer satisfaction, on-time delivery),
- Has their master's blessing,
- Gets Mark's approval after a review call,

can be **graduated to master partner** themselves. URL migrates from `/audrey/mei` to `/mei`. Their sub-partners (if any had somehow appeared under them — not currently allowed) stay with the old master or re-attach. This is expected to be rare — the whole point of the model is to keep Mark's direct customer count very small.
