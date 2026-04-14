# markluce.ai/arita — current state review

Observations from the live `markluce.ai/arita` page.

## What it does today
- "雙語 & TOEIC 學習助手" — AI English tutor for **adult learners**:
  - TOEIC Parts 5 / 6 / 7
  - Business English
  - zh-TW ↔ en translation
  - Role-play conversation
- LINE login required.
- Chatbot pinned bottom-right for Q&A.
- TTS with voice pick (Ava / Andrew).
- Random prompt suggestions.
- Languages: Traditional Chinese + English. No ja-JP yet.

## Direction shift
Arita's M1 focus is **her kid-teacher product**, not this adult-learner surface. See [`../partners/arita-en.md`](../partners/arita-en.md). The adult surface stays online as a secondary experimental v1, but M1 investment goes into the kid-book engine shared with Audrey.

## Implications for M1
- **Adult surface:** keep as-is. No M1 work. (Domain focus switch, lesson-series format, progress tracking → all deferred.)
- **Kid-teacher product (new):**
  1. Arita uses the same kid-book engine as Audrey.
  2. Arita's CMS adds a **parent consultation questionnaire** template she sends before generating each book.
  3. Private workspace tracks her students, parent notes, per-book allowlists.
  4. PWA gated to the specific student's family LINE account(s).
  5. Templates tuned for teaching-aid use (vocabulary highlight, comprehension questions, parent notes section).
  6. Partner attribution via LINE Login `state` param.
