# Offline bundle spec

Kid books are delivered two ways:

1. **Primary: per-book PWA** — LINE-account gated, offline-capable. See [`../tech/pwa-offline-en.md`](../tech/pwa-offline-en.md).
2. **Secondary: `.zip` raw bundle** — described below. No access control; redistributable; used for printing and partner re-sharing.

Both are produced at generation time. Partners pick which to offer per book (CMS toggle).

## `.zip` layout

```
{book-id}.zip
├── book.pdf                  # print-ready, canonical visual artifact
├── pages/
│   ├── page-01.jpg
│   └── ...                   # raw illustrations, reusable/printable
├── audio/
│   ├── zh-TW/
│   │   ├── page-01.mp3       # Traditional Chinese narration
│   │   └── ...
│   ├── en/
│   │   └── ...
│   └── ja-JP/                # only if the book includes ja
│       └── ...
└── meta.json                 # see schema below
```

## `meta.json` schema

```json
{
  "book_id": "string (uuid)",
  "pwa_url": "https://app.markluce.ai/{slug}/book/{book-id}",
  "pwa_name": "string — unique PWA display name for this book",
  "title": {
    "zh-TW": "string (Traditional Chinese)",
    "en": "string | null",
    "ja-JP": "string | null"
  },
  "child_name": "string",
  "age_tier": "0-3 | 4-6 | 7-9 | 10-12",
  "languages": ["zh-TW", "en", "ja-JP"],
  "zh_locale": "zh-Hant",
  "partner_slug": "string",
  "created_at": "ISO-8601 timestamp",
  "page_count": "number",
  "art_style": "string",
  "voices": {
    "zh-TW": "zh-TW-HsiaoChenNeural",
    "en": "en-US-AvaNeural",
    "ja-JP": "ja-JP-NanamiNeural"
  },
  "platform_version": "markluce.ai/{semver}"
}
```

**Note `zh_locale: "zh-Hant"`** — explicitly Traditional Chinese, verifiable.

## Use cases for the `.zip`
- **Print-on-demand:** partner sends `book.pdf` to a print shop for a physical keepsake.
- **Partner re-distribution:** through their LINE group, email, or cloud drive — no hit on Mark's servers.
- **Archive:** parents keep a permanent copy even if the PWA token expires or is revoked.

## When to offer which
- **0–3 / 4–6 tiers:** PWA only (strict gating, airplane-mode playback fits young-kid usage).
- **7–9 / 10–12 tiers:** PWA primary + zip optional.
- **Arita teacher channel:** PWA + zip (parents often want a printed keepsake with the teaching aid).
- **Premium SKU at any tier:** PWA + zip, unlocked.
