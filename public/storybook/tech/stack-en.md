# Tech stack

High-level inventory of shared infra. Details per component in sibling docs.

## Auth
- **LINE Login v2.1** (OIDC) — [`line-login.md`](line-login.md).

## AI / generation
- **LLM story writer** — structured page output for kid books, lesson generator for English tutor.
- **Image generation** — gpt-image-1 + style-lock today; Flux + per-character LoRA upgrade path. See [`image-gen.md`](image-gen.md).
- **TTS** — Azure Neural TTS (zh-TW / en / ja-JP). ElevenLabs v3 as premium upsell. See [`tts-azure.md`](tts-azure.md).

## Rendering / export
- **Book renderer** — HTML → PDF (and EPUB3 in M2). Text rendered outside the image.
- **Offline bundler** — zip packager per [`../product/offline-bundle-spec.md`](../product/offline-bundle-spec.md). See [`offline-export.md`](offline-export.md).

## Platform
- **Partner pages** at `app.markluce.ai/{slug}` — each partner's own copy, style, demo works.
- **Partner CMS** — edit copy, upload demo works, edit CTAs, set LINE group link.
- **Partner admin** — analytics, billing (manual invoicing M1 → self-serve M2).
- **Shared template inventory** — questionnaires, layouts, voices, art styles. Partners fork.

## Not built by Mark
- End-user communities — each partner runs their own **LINE group**. Mark provides OA bot template + setup guide only.
- End-user billing — out of scope. Each partner charges end users however they like.
