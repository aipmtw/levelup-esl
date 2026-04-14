# What we sell — the one-sentence version

markluce.ai sells exactly one thing:

> **Specialized language books, personalized per child, delivered as LINE-gated Progressive Web Apps (PWAs), in three languages — Traditional Chinese, English, Japanese — to a small number of partners who resell or gift them inside their own social circles.**

Everything else in this repo is in service of that one sentence.

## ⭐ The key business logic — AI creates, human reviews

This is the single rule that defines the business and differentiates it from every pure-AI competitor:

> **The AI drafts every book. The buying partner (or their authorized sub-partner) reviews and approves every book before it is delivered. No book ships without a human sign-off.**

This is not a feature. It is not a workflow detail. It is **the business model**. Every other decision in the plan flows from it:

- **Why partners exist at all** — they are not just distributors; they are the **quality gate** and the **trust interface** to end users. Without them, this business is just another AI tool.
- **Why price can be higher than pure-AI alternatives** — a human curated this book specifically for your kid. Pure-AI competitors cannot charge as much because nobody signed off.
- **Why liability sits on the partner** — the person who signed off is accountable. Mark built the tool; the partner approved the specific content. This split is fair, defensible, and scalable.
- **Why end users trust the product** — they are buying from a specific named human they already know (Audrey, Arita, Amy, or a sub-partner), not from a faceless AI vendor.
- **Why the credits page shows both** — "Co-created by **Luce** (AI co-editor) and **Audrey** (reviewed and approved)". Honest, memorable, legally clean.
- **Why sub-partners are coached by master partners** — the review skill is not automatable; it has to be passed person-to-person.

If anyone ever suggests "let's auto-approve low-risk books to speed things up" or "let's let AI approve itself when confidence is high" — **the answer is no**. Auto-approved books destroy the whole value proposition. A rubber-stamped approval is worse than no approval. The partner MUST read every book.

See [`../product/review-workflow-en.md`](../product/review-workflow-en.md) for the state machine and [`../product/credits-attribution-en.md`](../product/credits-attribution-en.md) for how the co-editor / reviewer credit is displayed.

---

## Decomposed

### 1. The unit of sale — a **specialized language book**
- **Specialized** = personalized per child, age-tier-appropriate (0–12), built around the child's name, age, interests, and any parent-supplied notes.
- **Language book** = the point of the book is **language exposure and learning**. Not general entertainment, not a personality test, not a diary, not a coloring book.

### 2. The languages — exactly three
- **Traditional Chinese (zh-TW / zh-Hant)** — baseline, always included. Must be Traditional, never Simplified.
- **English (en)** — required add-on.
- **Japanese (ja-JP)** — optional add-on.

No other languages at launch. No Simplified Chinese at all.

### 3. The container — a **per-book PWA**
- Installable on phone/tablet with a unique per-book app name (e.g. "小美的恐龍冒險", "Ethan's Dinosaur Adventure").
- Works in **airplane mode** after first-launch authentication — parent pre-loads, kid plays anywhere.
- Each book has a permanent URL: `app.markluce.ai/{partner-slug}/book/{book-id}` — also the PWA `start_url`.
- Secondary `.zip` bundle (PDF + images + MP3 + `meta.json`) produced on the same generation run, for partners who want to redistribute or print.

### 4. The gate — **LINE login, nothing else**
- The only authentication mechanism for installing and playing a book.
- Partner assigns each book to one or more LINE accounts (allowlist).
- 90-day default offline TTL on the LINE-auth token, refreshed silently whenever online.
- No username/password, no email magic link, no Google/Apple sign-in alternatives.

### 5. The channel — **partners only**
- **Three master partners** (as of today):
  - **Amy** — 0–3 tier, new-parent social circle
  - **Audrey** — 4–12 tier, working-parent school-community circle
  - **Arita** — 4–12 tier, kid English teacher 1:1 parent circle
- Each master partner can recruit sub-partners from their own social network. See [`master-partner-model-en.md`](master-partner-model-en.md).
- **No direct-to-end-user sales by Mark.** Mark never takes money from a parent.

### 6. How partners use it — **two supported use cases**
1. **Sell.** Partner prices the book, takes payment from the end user through their own off-platform channel (bank transfer, LINE Pay, cash, in-person). See [`../pricing/list-price-en.md`](../pricing/list-price-en.md).
2. **Gift.** Partner generates a book and gives it to a friend / student / family member without charging. Baby-shower gift, birthday keepsake, first-day-of-school present, teacher appreciation, new-cousin welcome, etc.

**Either way, Mark bills the partner the same way:** per-generation infra fee at the partner's tier unit rate. What the partner does with the book downstream (sell at a price, discount, or give away free) is the partner's business and does not affect Mark's invoice.

### 7. Every book has a human reviewer
AI (co-editor **Luce**, the markluce.ai engine persona) drafts. The assigned partner reads, edits if needed, and signs off before delivery. No exceptions. See [`../product/review-workflow-en.md`](../product/review-workflow-en.md).

---

## What we do NOT sell

To keep the focus tight, here's what's **out of scope** — now and at M1:

- ❌ **Not selling AI tool access.** We do not sell API credits, LLM prompts, image-gen quota, or raw engine access to developers.
- ❌ **Not selling generic kid content.** Coloring books, puzzle books, quiz books, personality-test books — none of these. Language books only.
- ❌ **Not selling adult content.** No adult language learning, no TOEIC courseware, no corporate training material. (Arita's legacy adult-learner page on `markluce.ai/arita` is kept live as a secondary experimental surface, not the product being sold.)
- ❌ **Not selling in other languages.** No Korean, Spanish, French, German. No Simplified Chinese. Just zh-TW, en, ja-JP.
- ❌ **Not selling subscriptions, memberships, or streaming access.** Each book is a one-shot generation, delivered as a permanent PWA installable on the end user's device.
- ❌ **Not selling physical books.** Partners can print from the `.zip` bundle if they want to offer a printed version, but that's the partner's side business — markluce.ai's product is the PWA.
- ❌ **Not selling direct to end users.** Mark has zero B2C surface. Every end user comes through a partner.

---

## Why this crisp boundary matters

Every time someone (partner, Mark himself, a future investor, a future employee) suggests adding something to the product, run it through this sentence:

> *"Is it a specialized language book delivered as a LINE-gated PWA in one of the three languages, sold or gifted through a partner?"*

If yes → fits.
If no → does not fit, belongs in a different product or a different plan.

Drift is the enemy at this stage. The plan is small, the target is clear, the product is one sentence. Protect that.
