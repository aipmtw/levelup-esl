# 8-week MVP sprint plan

Suggested breakdown for the AIA AIPM training capstone. Optimistic target: demoable end-to-end flow by week 8. Conservative target: solid partial demo + clear path to finish.

> **Definition of done for MVP:** Audrey can fill a questionnaire for her 6-year-old, the AI drafts a 10–12 page bilingual (zh-TW + en) book, Audrey reviews and approves it, the PWA is generated and installable on her phone via LINE login, the PWA plays offline in airplane mode, and the book cover shows "Reviewed by Audrey · Co-edited with Luce". That's the capstone demo.

---

## Week 0 (pre-sprint, before AIA class starts)

Do this BEFORE the 8-week training clock starts, because waiting on DNS / account setup during a sprint week is a waste:

- [ ] Cloudflare account set up, `markluce.ai` DNS on Cloudflare
- [ ] LINE Developer account + `markluce.ai` channel created
- [ ] Supabase free project created (`markluce-mvp`)
- [ ] Vercel account linked to `aipmtw` GitHub org
- [ ] OpenAI account with billing set up (~$20 prepaid)
- [ ] Azure Cognitive Services account with Neural TTS enabled
- [ ] `biz-plan-app/` repo created (sibling to `biz-plan/`), Next.js 14 scaffolded with TypeScript + Tailwind + shadcn/ui
- [ ] Local dev environment verified: `npm run dev` shows a hello-world page

---

## Week 1 — Foundation (auth + DB + empty frontend)

**Goal:** A Group 2 member can click "Sign in with LINE" on a test page and successfully auth, with their profile row created in Supabase.

**Tasks:**
- [ ] Run the schema SQL from `supabase-setup.md` (create tables + RLS policies)
- [ ] Install `@supabase/supabase-js` + `@supabase/ssr` in the Next.js project
- [ ] Build the three LINE auth routes (`start`, `callback`, `logout`) per `line-login-setup.md`
- [ ] Wire the Supabase-LINE bridge (synthetic email pattern is fine for MVP)
- [ ] Test the full login flow locally
- [ ] Deploy to Vercel, connect `app.markluce.ai` subdomain, test login in production
- [ ] Verify `profiles.first_touch_partner_slug` is sticky

**Deliverable:** A deployed `https://app.markluce.ai` with a working LINE login button. No content yet, just auth.

**Success criteria:**
- Audrey can log in from her phone via LINE
- Her profile appears in `public.profiles` with the right `line_user_id`
- RLS is enforced (verified by trying to read another user's profile and getting nothing)

---

## Week 2 — Partner pages + reviewer dashboard shell

**Goal:** Audrey can visit `app.markluce.ai/audrey` and see her own partner page. Her admin dashboard at `app.markluce.ai/audrey/admin` shows an empty "pending review" queue.

**Tasks:**
- [ ] Build the partner public page route `app/[slug]/page.tsx`
  - Render headline, pitch, brand color, demo works list (empty for now), LINE group link, CTA
  - Data from `public.partners.public_page_config` JSONB
- [ ] Build the partner admin dashboard route `app/[slug]/admin/page.tsx` — gated by auth + `profiles.role in ('master', 'sub')`
  - Show "pending review" queue (empty)
  - Show "books" tab (empty)
  - Show "kids" tab (empty)
- [ ] Build the "reviewer badge" component (reusable, shown on book covers later)
- [ ] Seed Audrey as a master partner (run the seed SQL from `supabase-setup.md`)

**Deliverable:** Audrey can see her own partner page and admin dashboard live in production.

---

## Week 3 — Questionnaire flow

**Goal:** Audrey fills out a questionnaire for her 6-year-old and the data is saved in Supabase (no AI generation yet — that's next week).

**Tasks:**
- [ ] Build the questionnaire form `app/[slug]/new-book/page.tsx`
  - Fields: child name, age, interests (chips), theme, language mix (checkbox), art style, narration voice, parent notes
  - Multi-step form (one question per step is fine for MVP)
  - Hard-coded presets for art style and voice (no CMS yet)
- [ ] Build the "environment photo upload" component — enforces: max 5MB, jpeg/png only, **no face detection required at MVP** (trust the partner to only upload environment photos), upload to `raw-uploads` bucket with a clear 24h-deletion notice
- [ ] On submit, save to `books` (status=draft) + `kid_profiles`
- [ ] Verify RLS — a different partner can't see Audrey's draft

**Deliverable:** Audrey can fill the form, upload an environment photo, and see a "draft created" confirmation page.

---

## Week 4 — AI pipeline (draft story + illustrations + narration)

**Goal:** When Audrey submits the questionnaire, the backend generates a complete draft book and marks it as `pending_review`.

**Tasks:**
- [ ] Write Edge Function `draft-story` — calls OpenAI GPT-4 with Traditional Chinese enforcement prompt, returns structured `{ pages: [ {text_zh, text_en, scene_description}, ... ] }`
- [ ] Write Edge Function `cartoonify-photo` — takes the raw environment photo from `raw-uploads` bucket, calls gpt-image-1 with cartoon-style prompt, saves result to `cartoon-refs/{partner_slug}/{kid_profile_id}.jpg`, deletes the raw photo
- [ ] Write Edge Function `generate-illustrations` — for each page, calls gpt-image-1 with style-lock prompt + cartoon reference, saves to `book-assets/{partner_slug}/{book_id}/pages/page-NN.jpg`
- [ ] Write Edge Function `generate-narration` — calls Azure Neural TTS for each page text, saves MP3s to `book-assets/{partner_slug}/{book_id}/audio/{lang}/page-NN.mp3`
- [ ] Wire questionnaire submit → trigger all four functions in sequence → update `books.status = 'pending_review'`
- [ ] Handle failures — retry once, then show error in admin queue

**Deliverable:** Submitting the form produces a real book draft with text + illustrations + audio, all visible in Supabase Storage.

**Risks:**
- OpenAI / Azure rate limits
- Edge Function 60s timeout (parallelize illustration gen, or split into multiple functions)
- Image quality varies — may need prompt tuning

---

## Week 5 — Review UI + approve gate

**Goal:** Audrey opens a pending book, reads each page side-by-side with the illustration and hears the narration, edits text if needed, and clicks approve.

**Tasks:**
- [ ] Build the book review page `app/[slug]/admin/books/[book_id]/review/page.tsx`
  - Side-by-side page viewer (text + image + audio player)
  - Inline text edit for each language
  - "Regenerate this illustration" button (calls `generate-illustrations` for one page)
  - "Regenerate narration" (calls `generate-narration` for one page)
  - Approve button — guarded behind a modal confirmation
- [ ] Write Edge Function `approve-book` — sets status=approved, stamps `reviewer_*` fields, computes HMAC signature over content+reviewer, writes to `audit_log`
- [ ] Build the reviewer badge + credits page — both rendered dynamically from DB on the PWA front cover
- [ ] Test the full flow: fill questionnaire → wait for generation → open review UI → make a small text edit → approve

**Deliverable:** Audrey can complete a full questionnaire → review → approve cycle for one book.

---

## Week 6 — PWA generation + LINE-gated install

**Goal:** The approved book becomes an installable PWA with Audrey's name on the cover, gated by LINE login, cached for offline.

**Tasks:**
- [ ] Build the per-book PWA reader route `app/[slug]/book/[book_id]/page.tsx`
  - Server component — fetches book from DB (auth-aware)
  - Renders cover + pages + audio controls
  - Includes a dynamic `manifest.json` at `/[slug]/book/[book_id]/manifest.json`
- [ ] Add service worker registration in the reader route
- [ ] Service worker caches all book assets on first load
- [ ] Sealed-token pattern: after successful LINE login, server writes a signed long-lived token to IndexedDB, the service worker reads it on subsequent launches to verify offline access
- [ ] Check allowlist: the server confirms the logged-in user's LINE user id is in `pwa_allowlists` before serving the book
- [ ] Test the install flow on an iPhone (Add to Home Screen) and Android (Chrome Install)
- [ ] Test airplane mode: after first install, put the phone in airplane mode and open the PWA — it should still play

**Deliverable:** Audrey can install her book as a PWA on her phone, hand it to her 6-year-old in airplane mode, and the book plays.

**This week is the highest-risk week.** Service worker + offline + auth caching is the most technically demanding work in the whole MVP. Budget buffer time.

---

## Week 7 — Polish + capstone demo prep

**Goal:** The demo is rehearsable end-to-end. All edges sanded. Visual polish added. Presentation deck drafted.

**Tasks:**
- [ ] End-to-end rehearsal: Audrey generates a new book from scratch, reviews, approves, installs, plays on her kid's device
- [ ] Fix UX rough edges — loading states, error messages, "review notes" field on the book cover
- [ ] Polish the partner public page for Audrey — good headline, demo work thumbnail, CTA button
- [ ] Write the compliance checklist document — mark which items from `ai-attribution-compliance-en.md` are implemented, which are deferred
- [ ] Draft the capstone presentation slides
  - Problem + market
  - Product one-sentence + key biz logic
  - Architecture diagram
  - Live demo section (Audrey's kid playing the book)
  - What's next (M2 roadmap)
- [ ] Record a backup video of the demo (in case live demo has a network glitch)

**Deliverable:** Full demo rehearsal recorded successfully. Slides drafted.

---

## Week 8 — Capstone demo

**Goal:** Deliver a capstone demo the group is proud of.

**Tasks:**
- [ ] Morning-of checklist: verify Vercel + Supabase + LINE OAuth all green
- [ ] Audrey generates one fresh book on stage (live) — OR uses the pre-generated demo book if live generation is too risky
- [ ] Demo flow:
  1. 1 min: problem + product one-sentence
  2. 2 min: Audrey shows her partner public page at `app.markluce.ai/audrey`
  3. 2 min: fills questionnaire, hits submit
  4. 3 min: explains architecture while waiting for generation (show the review UI with a pre-generated draft instead of waiting live)
  5. 2 min: opens the review UI, makes one edit, approves
  6. 3 min: Audrey's 6-year-old plays the book live, with the phone in airplane mode
  7. 2 min: key biz logic (AI + human review) + what's next
- [ ] Q&A from the audience

**Stretch**: if time and budget allow, prepare take-home books for one or two other Group 2 members (per the "invitation to Group 2 members" section in the pitch doc).

---

## Risk hotspots to budget buffer for

| Risk | Mitigation |
|---|---|
| Service worker + offline in Week 6 is harder than expected | Start a throwaway prototype in Week 5 alongside the review UI; don't make Week 6 the first time you touch PWA code |
| OpenAI / Azure quality issues in Week 4 | Week 3 questionnaire work should be designed to allow quick iteration on prompts |
| LINE-Supabase bridge is fiddly in Week 1 | Budget 2 days for this alone; if stuck on day 3, use a simpler pattern (session cookies with manually-issued JWTs) |
| Audrey's 6-year-old doesn't like the book on demo day | Have 2–3 backup books ready, different themes, tested with the kid during Week 7 rehearsals |
| Time pressure causes team to cut privacy compliance | **Don't.** Privacy is the product's moat. If something else must be cut, cut illustration quality or narration polish, not the consent flow or photo-deletion policy |

---

## What NOT to do during the 8 weeks

- Don't build the master-partner / sub-partner nesting (M2)
- Don't build the billing / invoicing dashboard (M2)
- Don't try to support Amy or Arita's scenarios simultaneously — Audrey only (stretch goals after Audrey works)
- Don't build multi-device PWA sync
- Don't build a parent-facing portal separate from the partner-owned flow
- Don't deploy to a custom domain for each partner — `app.markluce.ai/audrey` path-based only
- Don't build Chinese Simplified fallback — reject Simplified explicitly
- Don't build the `.zip` raw bundle — PWA only for MVP
- Don't implement the master-partner two-tier billing rollup — Audrey pays Mark directly, offline, as a single-partner invoice
