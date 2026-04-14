# Image generation

## M1 — gpt-image-1 + style-lock
- **Model:** gpt-image-1.
- **Consistency:** "style lock" prompt template + **one reference image per book** (the main character), reused across all 10–20 pages.
- **Text outside the image** — do NOT bake page text into illustrations. The renderer (HTML → PDF) lays text over or next to the image. This keeps multilingual editions trivial (same image, three text overlays).
- Fast enough and cheap enough to start. Character drift is acceptable for M1.

## Upgrade path — Flux + per-character LoRA
- When partners are paying and need strict character consistency across many books.
- Tooling: fal.ai or Replicate for hosted Flux + LoRA training.
- Train a small LoRA per book's main character from a handful of seed generations.
- Swap into the pipeline without changing the renderer or bundler.

## Style sets
- Shipped as partner-forkable templates (watercolor, flat cartoon, 3D toy, pencil sketch, etc.).
- Each style = a prompt fragment + recommended reference images + color palette.
- Partner picks one or more styles and can further tweak the prompt fragment.

## Cost control
- One reference image + N page generations per book.
- Cache by `(prompt_hash, style_hash)` when safe.
- Failed generations retry up to 2x; log and surface to partner analytics.
