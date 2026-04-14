# TTS — Azure Neural TTS

**Decision locked.** Azure Neural TTS is the default for markluce.ai.

## Why Azure (not ElevenLabs as baseline)
- Lowest cost in the premium tier — reliable at scale, best fit for B2B margin structure.
- Strong zh-TW + ja-JP support (ElevenLabs is weaker on Asian languages).
- Storytelling styles built in.
- ElevenLabs v3 is reserved as a **premium upsell** partners can resell to their end users ("Pro Narration" add-on). Keeps Mark's baseline cost flat while giving partners a differentiator.

## Voices per language

### zh-TW (baseline)
- `zh-TW-HsiaoChenNeural` — primary, warm, storytelling-capable.
- `zh-TW-HsiaoYuNeural` — alternate, younger tone.

### ja-JP (optional)
- `ja-JP-NanamiNeural` — primary, child-friendly, natural.
- `ja-JP-AoiNeural` — alternate, brighter/younger.

### en (optional / Arita default)
- Existing `en-US-AvaNeural` (Ava) and `en-US-AndrewNeural` (Andrew) — already wired on `markluce.ai/arita`.
- Add a storytelling voice for kid books (e.g. `en-US-JennyNeural` with narration style).

## Styles
- Prefer storytelling / narration styles where available (`style="storytelling"` / `style="gentle"`) for kid books.
- Neutral style for adult tutor sessions.

## Usage pattern
- Generate per-page MP3s during book creation.
- Cache by `(page_text_hash, voice, style)` — identical pages don't re-synthesize.
- Ship per-page files in the offline bundle; optional combined `full.mp3` with chapter markers.

## Premium upsell (ElevenLabs v3)
- Partner-configurable in CMS.
- Per-generation cost passes through (or partner absorbs as a premium tier).
- Same interface — only the backend provider swaps.
