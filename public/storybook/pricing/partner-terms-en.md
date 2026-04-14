# Partner terms — B2B only

## Core principle
**Mark bills partners. Mark does not collect from end users.**

- No direct-to-consumer billing by markluce.ai.
- No small-ticket end-user payments handled by Mark.
- Each partner owns their end-user relationship and chooses their own monetization (paid community, subscription, per-book, sponsorship, free, etc.).
- Mark's revenue comes entirely from partner fees.

## Why
- Mark is not interested in B2C billing ops (refunds, chargebacks, tax handling across small amounts, support tickets).
- Partners already have audiences — they can monetize however fits their community.
- B2B billing is simpler, higher-margin, and keeps Mark focused on the engine + partner success.

## Fee structure (locked)
**Per-generation infra fee, with tiers. Higher tier = better benefits.**

- **Primary meter:** per-generation infra fee. Partners pay for what they generate (TTS / LLM / image-gen / bundling). Usage-linked by design — no large flat commitment required to start.
- **Tiers** sit on top of the meter and unlock benefits as partners grow:
  - **Better per-generation unit rate** (volume discount).
  - **Feature gates** — CMS depth, analytics, premium voices (ElevenLabs), Flux+LoRA custom characters, white-label options.
  - **Support level** — from shared channel up to priority / direct-with-Mark.
- Partners are **free to start at the lowest tier** and pay purely per-generation. Upgrading only makes sense once volume or feature needs justify it — which means higher tiers naturally sell themselves as partners scale.

See [`partner-tiers-en.md`](partner-tiers-en.md) for tier benefits.

Explicitly **not** used:
- ❌ No flat monthly seat fee that's independent of usage.
- ❌ No revenue share on partners' end-user revenue. Mark does not touch end-user money.

## Payment — all partner settlements happen offline (locked)
**The platform does not process payments from partners.** Usage is metered inside the platform (generation counts + tier unit rate), Mark issues an invoice to each partner, and the partner pays offline through a Taiwan-normal channel:

- Bank transfer (ATM / online banking / ACH to Mark's designated account).
- LINE Pay direct transfer.
- Cash in person (reasonable for small amounts, especially family/close-circle partners like Amy).
- Any other mutually-agreed method.

Mark's platform records: usage, invoiced amount, paid/unpaid status, payment date, method, Mark's own reconciliation notes. **No online payment gateway, no credit card processing, no Stripe, no subscription auto-charge.** This keeps infra simple, fees zero, and matches how small-scale B2B works in Taiwan.

This applies to **all partners**, including Amy (who is Mark's daughter — see [`../partners/family-governance-en.md`](../partners/family-governance-en.md)). Even family settles through the same offline flow so that invoices and records stay consistent with other partners.

## Invoicing — 統一發票 (Taiwan GUI)
Mark can issue Taiwan's standard **統一發票 (Government Uniform Invoice / GUI)** in either of two formats, depending on the partner's needs:

### 二聯式發票 — 2-copy invoice (consumer receipt)
- For partners who are **individual consumers** or **non-VAT-registered small operators**.
- Two copies: seller's stub (存根聯) + buyer's receipt (收執聯).
- The displayed price is **tax-inclusive** (5% 營業稅 baked in).
- The buyer **cannot** claim input VAT credit. Simpler — no VAT number needed.
- Typical use: Amy as an individual, Audrey if she operates personally without a company.

### 三聯式發票 — 3-copy invoice (business receipt with VAT deduction)
- For partners who operate as a **business entity** with a **統一編號 (GUI number / Taiwan VAT registration)**.
- Three copies: seller's stub (存根聯) + buyer's accounting copy (報帳聯) + buyer's VAT deduction copy (扣抵聯).
- The price is stated **tax-exclusive**, with 5% 營業稅 listed separately.
- The buyer **can** claim the 5% as input VAT credit (進項稅額扣抵), which effectively refunds the VAT through their own business tax filing.
- Typical use: Arita if she operates as a registered 工作室 / 獨資商號 / limited company; any future partner with a real 統編.

**Partner declares which format at onboarding.** A partner can switch formats later if their business registration status changes (e.g. Arita incorporates) — just tell Mark and the next invoice uses the new format.

### Practical consequence
- For **二聯** partners, the platform shows unit rates **tax-inclusive** — "what you see is what you pay".
- For **三聯** partners, the platform shows unit rates **tax-exclusive**, with "+5% 營業稅 另計" noted — they'll see +5% on the invoice but can reclaim it via their own tax filing.
- Either way Mark receives the same net after tax; the partner's experience differs based on whether they can reclaim.

## Out of scope for M1
- **Self-serve billing.** Manual invoicing is fine — Audrey, Arita, and Amy are hand-held. Mark issues invoices (二聯 or 三聯 per partner), partner pays offline.
- Self-serve billing + automated metering + automatic invoice generation lands in **M2** (still no online payment — still offline settlement, just with less manual work at invoice time).

## What Mark commits to in return
- Running and improving the engine.
- Onboarding support and template forks.
- Analytics and usage dashboards.
- LINE OA bot template + group setup guide.
- Direct support channel during early partnership.
- Help **running** the partner's business — promo support, templates, review of copy, etc.
