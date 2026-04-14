# markluce.ai/audrey — current state review

Observations from the live `markluce.ai/audrey` page.

## What it does today
- "AI 孩子英文學習小腳本" — generates a **1-minute English script** (80–120 words) from:
  - Interest keyword (preset chips: dinosaurs, ice cream, spaceships, ninjas, kittens, LEGOs).
  - Child age.
  - CEFR level (A1 / A2 / B1).
- Built-in TTS. Copy-to-clipboard.
- Bilingual output (English + Traditional Chinese).
- LINE login required.
- "Prototype" badge.

## What it does not do yet
- No illustrations.
- No multi-page books.
- No offline PWA / bundle.
- No Japanese.
- No private partner workspace (customer list, allowlists, per-kid notes).
- No pricing, no partner attribution.

## Partner profile
Audrey is a **working parent with two of her own 0–12 kids** and an existing **parent social circle**. She is not just selling — she's the target customer herself. Her demo works are literally books for her own kids. See [`../partners/audrey-en.md`](../partners/audrey-en.md).

## Implications for M1
- Audrey's current page is the **seed** of the kid-book engine. The engagement pattern + LINE login + Traditional-Chinese TTS + age/level questionnaire are already proven.
- M1 lift:
  1. Evolve 1-minute script → **multi-page illustrated storybook** (10–20 pages).
  2. Add illustration pipeline (gpt-image-1 + style-lock + reference image).
  3. Add **PWA delivery** with LINE-account gating ([`../tech/pwa-offline-en.md`](../tech/pwa-offline-en.md)).
  4. Add `.zip` secondary bundle (PDF + images + MP3 + `meta.json`).
  5. Add Japanese as optional language (zh-TW baseline + en + ja).
  6. Formalize partner **public page + private workspace** split ([`../partners/partner-page-spec-en.md`](../partners/partner-page-spec-en.md)).
  7. Partner attribution via LINE Login `state` param.
