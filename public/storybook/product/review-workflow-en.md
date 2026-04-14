# Review & approval workflow — human-in-the-loop

## Core rule
**Every book sold must be reviewed and approved by a human partner before delivery.** AI drafts it; the partner approves it. No book reaches an end user without a partner sign-off on record.

This is non-negotiable. It is how quality, brand, and liability are protected — for Mark, for the partners, and for the end-user parents who are trusting the product with their kids.

## Why

1. **Quality.** LLMs hallucinate, illustrations drift, translations slip. A human who knows the child + parent + context catches things automation can't.
2. **Liability alignment.** If something in a book is wrong — factual error, culturally insensitive phrase, age-inappropriate image — the **partner who signed off** bears the reputation hit with their end user. That's correct, because they know the end user and Mark doesn't. Moving the decision to the human who has the relationship is both fair and protective of Mark.
3. **Trust signal to end users.** Parents are told clearly: "this was written with AI assistance and reviewed page-by-page by [Audrey / Arita / sub-partner]". That line is the whole product — it's not "AI slop auto-generated to order", it's "a specific human you know curated this for your kid, with AI help".
4. **Traceability.** Every approval is logged: who approved, what they approved, what they edited, when. Disputes are resolvable.

## Workflow — state machine

```
[questionnaire submitted]
        │
        ▼
   ┌──────────┐
   │  DRAFT   │  ← LLM writes story, image gen runs, TTS renders, PWA/zip are BUILT but not DELIVERED
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │ PENDING  │  ← sits in reviewing partner's "pending review" queue
   │  REVIEW  │     partner can: read, listen, page through, edit text, regenerate image,
   └────┬─────┘     swap voice, reject, or approve
        │
        ├── REJECT ──→ DISCARDED (partner tells end user it didn't work; no charge from Mark)
        │
        ├── EDIT  ───→ back to DRAFT for regen with fixes, loop again
        │
        └── APPROVE ──┐
                      ▼
              ┌──────────────┐
              │  APPROVED    │  ← partner's signature locked onto meta.json, credits page generated
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  DELIVERED   │  ← PWA installable by end user, zip download enabled
              └──────────────┘
```

## Who reviews what

### Audrey (master partner) — solo channel
Audrey reviews every book generated in her Audrey-branded channel. She is the sole reviewer.

### Arita (master partner) — solo channel
Same. Arita reviews every book in her Arita-branded channel.

### Sub-partner under Audrey or Arita
**Default:** the sub-partner reviews their own books. They are the human on record.

**Optional master override:** a master partner can toggle "require my second sign-off on this sub-partner's books" in their private workspace. Use cases:
- Brand-new sub-partner still learning the craft — master double-checks for the first 10 books.
- Sub-partner serving especially sensitive audiences — master wants a safety net.
- Trust restored → master flips the toggle off and sub-partner approves solo again.

When second sign-off is enabled, the flow becomes `DRAFT → PENDING REVIEW (sub) → APPROVED BY SUB → PENDING REVIEW (master) → APPROVED BY MASTER → DELIVERED`. Both signatures are recorded.

### Emergency Mark override
Mark has no routine review role. He has a **global admin override** for emergency support only (e.g. master partner disappeared and a student's book is stuck). Any use of this override is logged and visible to the affected partner.

## Partner review tools (in private workspace)

- **Pending review queue** — list of drafts waiting on this partner, sorted oldest-first.
- **Side-by-side view** — original questionnaire input, LLM draft text, generated illustration, current TTS audio, per language.
- **Inline edits:**
  - Edit text per page per language (Traditional Chinese strictly enforced on zh fields).
  - Regenerate a single illustration with a new prompt fragment.
  - Swap narration voice.
  - Reorder pages.
  - Delete a page.
- **Approve / reject / request regeneration.**
- **Approval notes** — free text comment that ships to end user (optional, e.g. "Audrey 備註：Mei 特別喜歡恐龍，我選了暴龍當主角").
- **Audit log** — every state change, who did it, when.

## What "approved" means technically

When the partner clicks approve:
1. `meta.json` gets stamped with `approved_by`, `approved_at`, `approver_line_user_id`, `approver_signature` (cryptographic HMAC over the content bound to the approver's identity).
2. The credits page of the book ([`credits-attribution-en.md`](credits-attribution-en.md)) is rendered with the approver's display name.
3. The PWA manifest is published with the book's `start_url` active.
4. The `.zip` (if enabled) becomes downloadable.
5. The end user is notified via LINE OA message: "Audrey 老師已完成審閱，小美的繪本準備好了 →".

## Edge cases

**Partner takes too long to review.**
- SLA expectation (partner's own commitment, not Mark's): 48 hours.
- Platform nudges: reminder at 24h, reminder at 48h.
- Past 72h, end user sees "審閱中，請稍候" with the partner's name visible so they know who to ping.
- Mark does not step in. This is a partner's customer relationship.

**Partner rejects after drafting.**
- Draft is marked DISCARDED.
- Generation infra cost is still billable to the partner (Mark already spent the compute).
- Partner's choice whether to redo or refund the end user — off-platform, not Mark's problem.

**Partner wants to edit post-delivery.**
- A delivered book can be **revised** → new version number, re-enters PENDING REVIEW, re-approved, re-delivered. Old PWA is replaced by new PWA at the same start_url; end user gets a notification.
- Revisions are tracked in version history.

**Partner is on vacation, backlog builds up.**
- Partner sets a "on vacation until {date}" flag. New questionnaires on that partner's page show "目前暫停接單至 {date}".
- No silent build-up of angry end users.

## M1 scope
Build the DRAFT → PENDING REVIEW → APPROVED → DELIVERED state machine end-to-end, with the review tools above (inline text edit, image regen, voice swap, approve/reject). Second sign-off toggle and revisions can wait for M2 if tight.

## M2 follow-ups
- Master-partner second sign-off enforcement UI.
- Post-delivery revisions with version history.
- Batch approve (partner can approve multiple similar books at once if they pass a spot check).
- Approval templates ("auto-approve if LLM confidence > X and no sensitive-word hits") — still always human-signed, but the human can signal a lighter-touch mode for routine work.
