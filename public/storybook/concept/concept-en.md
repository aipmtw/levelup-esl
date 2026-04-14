# Concept — English

## Primary target market

**Kids age 0–12.** Parents of young children in Traditional-Chinese-speaking markets (Taiwan first, HK / overseas diaspora next, Japan as adjacency).

**Languages:**
- **Traditional Chinese (zh-TW / zh-Hant) — baseline, always included. Must be Traditional, never Simplified.**
- **English (en) — required add-on for Mark's flagship product.**
- **Japanese (ja-JP) — optional add-on.**

> **Hard rule:** every zh touchpoint — UI, TTS voice, LLM output, generated book text — must be **Traditional Chinese**. Simplified Chinese is out of scope. LLM prompts must explicitly instruct "Traditional Chinese, zh-TW, Taiwan locale". TTS uses `zh-TW-*` voices only.

## The platform (markluce.ai, owned by Mark)

markluce.ai is **Mark's first business** and the domain stays Mark's. The biz model itself — engine + partner pattern — is designed to be **licensable or resaleable under a different brand domain later**. See [`future-domain-en.md`](future-domain-en.md).

- A **foundation service** that generates personalized content for partners to sell:
  - **Kid specialized books** — multi-page illustrated storybooks, age 0–12, zh-TW Traditional baseline, with optional English and/or Japanese.
  - **Basic templates** — questionnaire templates, book layouts, page count/age tiers, narration voices, art styles — that partners can fork and customize.
- **Shared infra:** LINE Login, Azure Neural TTS, image generation, LLM story writer, book renderer, PWA + offline bundle exporter.
- **Partner pages** at `app.markluce.ai/{partner-slug}` — each partner owns their copy, style, demo works, and LINE group link.
- Mark **does not sell to end users** and does not take small-amount consumer payments. Mark bills partners.

## The partners (first three — all in-target, different channels)

Three master partners sell kid books in the 0–12 range with zh-TW Traditional baseline + English + optional Japanese. They differ in **how they reach end users** and which age band they specialize in.

### Audrey — working-parent / peer-community channel
- **Background:** Audrey is a professional full-time worker with **two of her own kids in the 0–12 range**. She has her own **social circles of fellow parents**.
- **Channel:** word-of-mouth within her parent social circles + her own LINE group. Peer-to-peer, parent-to-parent trust.
- **Product angle:** personalized books for her own kids first, then for friends' kids, then broader.

### Arita — teacher / 1-to-1-with-parents channel
- **Background:** Arita is an English teacher who **already has her own kid students in the 0–12 range**.
- **Channel:** she designs personalized teaching material for each specific student, **after discussing with the kid's parents**. Teacher-as-curator, parent-as-approver.
- **Product angle:** each book is a custom teaching aid — targeted to one student's level, interests, and learning goal agreed with the parent. Higher-touch than Audrey's peer channel, higher perceived value per book.

(Arita's older adult-learner tooling on `markluce.ai/arita` is kept as an experimental secondary surface but is **not** the main M1 focus. M1 focuses on Arita's kid-teacher product.)

### Amy — new-parent / 0–3 specialist channel
- **Background:** Amy is **Mark's daughter** with a **1-year-old son** (Mark's grandson). She is already an existing paying customer of physical personalized kid books, so she knows the category firsthand.
- **Channel:** her new-parent social circle — first-time moms, baby-shower friends, parents of 0–3 toddlers. Peer-to-peer, trust-dense. She uses the product on her own son every day, and her friends see it in real use.
- **Age specialty:** 0–3 tier, where Audrey and Arita are weaker. Amy fills the coverage gap.
- **Family governance:** the father-daughter relationship is handled explicitly with guardrails — see [`../partners/family-governance-en.md`](../partners/family-governance-en.md). Amy is billed and treated exactly like Audrey and Arita.

All three master partners develop their own social circles with this product, and all partner payment is settled **offline** — Mark invoices, partners pay via bank transfer / LINE Pay / cash. Platform does no online billing. See [`../pricing/partner-terms-en.md`](../pricing/partner-terms-en.md).

### Partner age-tier coverage matrix — no gaps, no overlap

Each partner markets to the age band they **authentically live in** and to the social circle that matches their **own life stage**. This is critical for credibility: parents buy from someone they see as a peer, not from someone pretending to understand them.

| Age tier | Amy (new parent, 1yo son) | Audrey (working parent, 6yo & 10yo) | Arita (kid English teacher) |
|---|---|---|---|
| **0–3** | ✅ **primary** — her son lives here | ❌ past this phase | ~ via teacher perspective, low priority |
| **4–6** | ❌ | ✅ **primary** — her 6yo lives here | ✅ core teaching age |
| **7–9** | ❌ | ✅ bridges her two kids' ages | ✅ core teaching age |
| **10–12** | ❌ | ✅ **primary** — her 10yo lives here | ✅ upper teaching age |

**Social status / life-stage positioning:**
- **Amy** sells to other **new parents** in the baby-toddler phase. She hangs out in baby groups, baby-shower chats, first-time-parent LINE groups. Peer-to-peer trust is maximum because she is literally in the same phase as her customers.
- **Audrey** sells to other **full-time-working parents of elementary-age kids**. She hangs out in school-parent LINE groups, after-school-pickup chat circles, working-mom peer networks. Time-poor, income-stable, bilingual-education-invested.
- **Arita** sells to **parents who have hired her as a kid English teacher**. Her relationship is professional-warm (teacher-to-parent), 1:1 custom consultation, higher per-book price because each book is a custom teaching aid.

None of the three is competing with the others. A new-mom friend of Amy's will never be a customer of Audrey's. A first-grade classmate's mom of Audrey's 6yo will never be a customer of Amy's. A student of Arita's will never be a customer of either — because the student's parent already picked Arita as their teacher. The segmentation is honest and natural.

## Revenue model

**B2B only.** Mark bills partners. No direct end-user billing. Fee structure: **per-generation infra fee with tiers — higher tier unlocks better unit rate + benefits.** See [`../pricing/partner-terms-en.md`](../pricing/partner-terms-en.md).

## Offline — PWA-first (must-have)

Every generated book is delivered as a **Progressive Web App (PWA)** with a unique per-book name, **gated to assigned LINE accounts**. Scenario: parent pre-loads the book on a device online, then hands it to the kid in **airplane mode** (plane, car, no wifi) and it still plays.

- **First launch (online):** LINE login required, partner's allowlist checked, assets + auth token cached locally.
- **Subsequent launches (offline ok):** cached LINE token validates locally; book plays fully offline — text, images, narration audio, all from service worker cache.
- **Partner control:** partner assigns the PWA to one or more LINE accounts (the parent's account). Only those accounts can install/play.
- Secondary export: a **`.zip`** with PDF + images + MP3 + `meta.json` for partners who want to redistribute or print.

See [`../tech/pwa-offline-en.md`](../tech/pwa-offline-en.md) and [`../product/offline-bundle-spec-en.md`](../product/offline-bundle-spec-en.md).

## How it works (end-user flow)

1. Parent lands on partner page `app.markluce.ai/audrey`.
2. Signs in via LINE Login (attribution carries `state={slug}`).
3. Answers a short questionnaire (child's name, age, interests, goal, language mix, style).
4. Platform generates text (age-appropriate, zh-TW baseline + chosen languages) + illustrations (consistent main character) + narration audio (Azure Neural TTS).
5. Parent gets a **personalized PWA** — installs on phone/tablet, LINE-account-locked, playable offline in airplane mode.
6. Optionally downloads the `.zip` raw bundle for printing or redistribution.
