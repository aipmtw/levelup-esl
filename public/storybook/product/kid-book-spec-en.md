# Kid book spec

## Product shape
A multi-page illustrated storybook, personalized per child, with narration. Delivered as a **per-book PWA** (LINE-account gated, offline-capable) with a secondary `.zip` export.

## Target
**Age 0–12.** Primary (and only) target market for markluce.ai.

## Age tiers
- **0–3** — 6–8 pages, 1 sentence/page, very simple vocabulary, large illustrations.
- **4–6** — 10–12 pages, 2–3 sentences/page, simple dialogue, repeating character.
- **7–9** — 12–16 pages, short paragraphs, basic plot arc.
- **10–12** — 16–20 pages, chapter-lite, richer vocabulary, moral/theme.

## Languages
- **Traditional Chinese (zh-TW / zh-Hant)** — baseline, always included. Must be Traditional, never Simplified. LLM prompt explicitly enforces Taiwan locale.
- **English (en)** — required for both Audrey and Arita.
- **Japanese (ja-JP)** — optional add-on.

When multiple languages are selected, each page shows text in all chosen languages (stacked) and each language gets its own narration MP3.

## Questionnaire inputs
- Child's **name** (used as main character).
- **Age** (determines tier).
- **Interests** (1–3 topics).
- **Goal/theme** (optional).
- **Language mix** (zh-TW always on; add en / ja).
- **Art style** (from partner's forked style set).
- **Narration voice** (from partner's forked voice set).
- **Parent notes** (Arita's channel: things to emphasize / avoid; vocabulary focus; learning goal).

## Generation pipeline
1. **Story writer** (LLM, Traditional Chinese strictly enforced) — structured page list.
2. **Illustration** — gpt-image-1 with style-lock + reference image for main-character consistency.
3. **Narration** — Azure Neural TTS, `zh-TW-*` voices for Chinese (Traditional locale), en and ja voices for others.
4. **Renderer** — HTML → PDF. Text rendered outside illustration.
5. **PWA builder** — per-book manifest, service worker, cached assets, LINE-account gate. See [`../tech/pwa-offline-en.md`](../tech/pwa-offline-en.md).
6. **Bundler** — secondary `.zip` per [`offline-bundle-spec-en.md`](offline-bundle-spec-en.md).

## Human review gate — non-negotiable
Every book must be **reviewed and approved by the assigned partner** before delivery. AI drafts, partner signs off. See [`review-workflow-en.md`](review-workflow-en.md). Books show an AI co-editor credit + named human reviewer on the credits page — see [`credits-attribution-en.md`](credits-attribution-en.md).

## Outputs
- **Primary:** per-book PWA, LINE-account gated, offline-capable (airplane mode). Only delivered after partner approval.
- **Secondary:** `.zip` raw bundle (PDF + images + MP3 + meta.json) for redistribution/printing. Same approval gate.
