# M1 — first milestone

## Goal
Ship the kid-book engine as a real product targeting 0–12. Formalize partner public page + private workspace. Onboard Audrey (working-parent channel) and Arita (kid-teacher channel) as the first paying partners.

## Deliverables

1. **Multi-page illustrated storybook engine** (kid-book only, both partners share it)
   - 10–20 pages per book, age tiers 0–3 / 4–6 / 7–9 / 10–12.
   - Character consistency via gpt-image-1 + style-lock + reference image.
   - Text rendered outside illustrations.

2. **Language mix (Traditional Chinese strictly enforced)**
   - **Traditional Chinese (zh-TW / zh-Hant)** — baseline, always. LLM prompt, TTS voices, and generated text must all be Traditional. No Simplified anywhere.
   - **English** — required add-on.
   - **Japanese** — optional add-on.

3. **Demo book generation**
   - Short demo in English (required).
   - Short demo in Japanese (required).
   - Traditional Chinese always included in both.

4. **PWA delivery (primary)** — per [`../tech/pwa-offline-en.md`](../tech/pwa-offline-en.md)
   - Per-book unique PWA name + manifest + service worker.
   - LINE-account gating via sealed token.
   - 90-day default offline TTL.
   - Partner controls: allowlist, revoke, TTL override.
   - iOS Safari + Android Chrome install support.

5. **`.zip` bundle export (secondary)** — per [`../product/offline-bundle-spec-en.md`](../product/offline-bundle-spec-en.md)
   - `book.pdf` + `pages/page-NN.jpg` + `audio/{lang}/page-NN.mp3` + `meta.json` (with `zh_locale: "zh-Hant"`).

6. **Partner public page** `app.markluce.ai/{slug}` — per [`../partners/partner-page-spec-en.md`](../partners/partner-page-spec-en.md)
   - CMS: headline, target market description, ad copy, brand color, demo works, CTA, LINE group link, pricing note.
   - Multilingual (zh-TW Traditional / en / ja-JP variants).

7. **Partner private workspace** `app.markluce.ai/{slug}/admin`
   - Customer list (per-partner, strictly isolated).
   - Per-kid notes (parent consultation for Arita's channel).
   - Book inventory + PWA allowlist + revoke.
   - Private analytics.
   - Parent-consultation questionnaire (Arita).

8. **Partner attribution**
   - LINE Login redirect carries `state={slug}`.
   - First-touch sticky; tagged on all generations + billable events.

9. **Fee structure live**
   - Per-generation infra fee with tiers (Starter / Growth / Pro).
   - Manual monthly invoicing. Usage metering dashboard for Mark.
   - Self-serve billing deferred to M2.

10. **Arita's adult legacy surface** — leave as-is, no M1 work.

## Out of scope for M1 (→ M2)
- EPUB3 export.
- Self-serve billing + automated metering.
- Flux + per-character LoRA.
- Arita adult lesson-series / progress tracking.
- Custom domains / white-label partner pages.
- Multi-device PWA sync.
