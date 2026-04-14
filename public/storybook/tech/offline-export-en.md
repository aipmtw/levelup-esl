# Offline export pipeline

Implements [`../product/offline-bundle-spec.md`](../product/offline-bundle-spec.md).

## Components

### 1. PDF renderer
- HTML + CSS template → PDF via headless Chromium (Playwright) or a PDF lib (pdfkit / wkhtmltopdf).
- Templates per age tier (0–3 / 4–6 / 7–9 / 10–12).
- Text laid out **beside or beneath** the illustration (not baked in).
- Multilingual: one PDF containing stacked language blocks, or separate PDFs per language — decide per partner preference (default: stacked, single PDF).

### 2. Image export
- Raw page illustrations saved as `pages/page-NN.jpg` at print-quality resolution.
- Partners/parents can reuse for printing, crafts, reposting.

### 3. Audio export
- Per-page MP3 from Azure TTS → `audio/{lang}/page-NN.mp3`.
- Optional concatenated `full.mp3` with chapter markers (ID3 chapter frames or separate `chapters.json`).
- Consistent bitrate (128 kbps mono narration is fine).

### 4. Bundler
- Zip packager builds the tree from [`../product/offline-bundle-spec.md`](../product/offline-bundle-spec.md).
- Writes `meta.json` with the schema from that spec.
- Returns a signed download URL (24–72h TTL).
- Partner can also trigger a re-download later from the admin panel.

## EPUB3 (M2, fast-follow)
- Same assets, wrapped in EPUB3 container.
- Media overlay (SMIL) for synced text-audio highlight.
- Intended for proper e-readers and accessibility.

## Storage
- Bundles stored in blob storage, keyed by `book_id`.
- Lifecycle: keep forever at M1 (partners may want to re-download). Revisit retention policy in M2.
