# AIA Executive AIPM Class, Cohort 1 · Group 2
## Capstone Group Demo — Candidate Topic Pitch (internal)

**Original idea from:** **Audrey** (Group 2 teammate)
**Pitch write-up / champion:** Mark (Group 2 teammate)
**To:** Group 2 members
**Purpose:** Take Audrey's original idea, turn it into a pitch for the group to discuss, and decide together whether this becomes our 8-week capstone demo
**Scope:** **Concept and training-fit only**, not the full business model. Full background shared after group agrees on the topic.

---

## The one sentence

> **0–12 year old personalized language books, reviewed by parents (or teachers).**

A bit more: AI drafts every book, a parent or teacher reviews and approves it page by page, and it ships as a **LINE-login-gated PWA** in three languages (Traditional Chinese baseline + English + optional Japanese).

**The key differentiator:** this is not another pure-AI book factory. Every book ships only after a **named human reviewer** signs off. The AI is the co-editor (nicknamed **Luce**), the reviewer is a real parent or teacher, and both are credited prominently on the book cover.

---

## Why this topic fits an 8-week AIPM capstone

| Dimension | Why it works |
|---|---|
| **End-to-end AI product** | Covers LLM (story), image gen (illustrations), TTS (narration), PWA (delivery), OAuth (LINE login), partner CMS. Enough technical breadth to split cleanly across a multi-person group. |
| **Real users already exist** | **Audrey, the teammate who brought this idea, is herself a working parent of 6yo and 10yo kids** — a living target customer inside our own group. Plus Mark's daughter (with a 1yo son) and Mark's English-teacher friend Arita (her public tool `markluce.ai/arita` is positioned around TOEIC prep, but in practice she actually teaches kids). **Three different parent-AND-teacher scenarios** with real people available for user interviews and feedback. Not hypothetical users. |
| **Core insight is "human in the loop"** | AI drafts → human approves → ship. This may be the single most important lesson to implement once in an AIPM program: AI × human review > pure AI. |
| **Shippable MVP in 8 weeks** | Minimum viable slice is very clean: 1 partner × 1 real kid × 1 book × 1 language × 1 PWA. All the interesting AI orchestration fits inside that demo. |
| **Privacy, compliance, and ethics are baked in** | Photo cartoonification on upload, parent consent form, partner attribution, AI provider ToS check. Most AI training projects skip this; this topic is designed around it. |
| **Locally relevant** | Traditional Chinese hard requirement, LINE login native, 二聯/三聯 invoicing, Taiwan partner economics. Matches the AIA class's actual market context. |
| **Memorable capstone demo** | "We made a book for Mark's grandson and he couldn't stop playing it" is an unforgettable final-demo moment. |

---

## Work areas this topic will cover (open invitation, not role assignments)

Below are the work areas this topic will touch during the 8 weeks. **This is not a role assignment — it's an invitation.** Every group member is welcome to pick any one (or several) of these areas based on their own interests, strengths, or things they want to learn, and contribute as a **real collaborative partner**, not an assigned subordinate.

Multiple people working the same area is fine. One person spanning several areas is fine. An area waiting until someone wants to pick it up is also fine. This is 8 weeks of co-creation, not a Gantt chart.

- **PM perspective** — target market, user interviews, user flows, capstone demo script
- **AI engineering** — LLM prompt design, image-gen integration, TTS integration, model selection
- **Frontend / PWA** — questionnaire flow, review interface, offline PWA, parent-facing reader
- **Compliance / privacy** — photo cartoonification flow, consent form, 個資法 review, AI ToS compliance checklist
- **UX / design** — Luce character visual, book layout, cover attribution badges, partner public page
- **Business / operations** — partner model design, offline-payment scenarios, list price, demo deck packaging

---

## Suggested MVP demo scope (draft, for group discussion)

> To avoid overreach in 8 weeks, I'd cut hard to the smallest viable slice.

### 🎯 Primary MVP: Audrey's own scenario (easiest to verify, zero coordination cost)

- **1 partner / reviewer:** **Audrey herself** (Group 2 teammate, original ideator, mother of a 6-year-old)
- **1 real kid:** Audrey's **6-year-old** (real user, directly observable by the entire group)
- **1 book:** **4–6 tier, Traditional Chinese + English bilingual, 10–12 pages**, with 1 cartoonified reference image generated from an uploaded photo Audrey provides
- **1 PWA:** LINE login, offline-capable, cover prominently showing "Reviewed by Audrey" and "Co-edited with Luce (AI)"
- **1 complete flow:** Audrey fills the parent questionnaire → AI drafts → Audrey reviews and edits page by page → approves → PWA delivered → **her 6-year-old actually plays it for the group / for the capstone demo**

### Why Audrey's scenario is the primary MVP

1. **Easiest to verify** — Audrey is in the group, her 6-year-old is a real living child, and the whole group will hear her first-hand feedback every week for 8 weeks. No external coordination required.
2. **Zero coordination cost** — no waiting for Mark's daughter (non-teammate) to align with training schedule; no third-hand feedback relayed through Mark. Audrey is in every group meeting.
3. **Original ideator is the primary user** — the idea came from Audrey, and she has the most direct emotional stake in the demo's success. Nobody will review more carefully than she will.
4. **6-year-old is the demoable age** — 4–6 tier books have a real plot arc (unlike 0–3 books which are just single words), but are not as complex as 7–9+ chapter books. The sweet spot that can be built well in 8 weeks AND can show a real child's reading reaction on stage at the capstone.
5. **zh-TW + English bilingual hits the core value prop** — what Taiwan working parents care most about is bilingual exposure, and this demo book showcases exactly that.

### 🌱 Stretch goals (only if MVP finishes with time to spare)

> All of these are **optional**. It's totally fine if the primary MVP fills all 8 weeks.

- **Second book for Audrey:** a 10–12 tier book for her 10-year-old, showcasing the cross-tier language level-up (see `book-lifecycle` concept).
- **A second book with a group member's own scenario:** invite other Group 2 members (per the "Invitation to Group 2 members" section above) to bring their own scenario — real or hypothetical — so the demo has multiple reviewers, multiple age tiers, multiple use cases.
- **0–3 or teacher-scenario showcase:** if a group member has a fitting scenario, add one 0–3 tier book (showing the lowest age) or one teacher-reviewed teaching-aid book (showing the teacher channel). Mark's daughter and Arita are available as fallbacks — but **only if no group member has their own scenario**, because an in-group teammate's lived scenario is easier to verify than any external person's.

---

## Invitation to Group 2 members — real or hypothetical scenarios welcome

Beyond Audrey, Arita, and Mark's daughter, **we warmly invite every Group 2 member to bring their own scenario** to make the demo richer, the user interviews wider, and the capstone story deeper.

### Roles you might fit
- **Parent** of a 0–12 year old (your own child)
- **Teacher** of 0–12 year olds (school teacher, cram-school teacher, enrichment teacher, private tutor)
- **Grandparent** (want to make a book for a grandchild)
- **Uncle / aunt** (want to make a book for a niece or nephew)
- **Family member or friend of someone with a 0–12 kid**, and you'd like to make a book as a gift (baby shower, birthday, new-baby welcome, first day of school, graduation keepsake, etc.)
- **Expecting parent** (a prenatal-gift book, or the first book for a newborn-to-be)

If you have any real-life role that fits, you're welcome to join as a real reviewer.

### Gift scenarios are fully legitimate
This product does NOT have to be sold to people you personally know — **giving a book as a gift to a friend's kid** is a first-class supported use case. If you want to make a personalized book for:

- A colleague's newborn
- Your cousin's kids
- A friend's kid who's starting primary school
- A neighbor's child as a community gesture

...that absolutely counts for the training demo, and it's one of the core use cases we want to showcase.

### Don't want to share your real situation? A hypothetical scenario is fine — we respect privacy
If for any reason you **don't want to disclose your actual family details** (kid's age, your teaching role, family relationships, etc.), no problem at all:

- You can prepare a **hypothetical scenario** to participate in the demo (e.g. "suppose I have a 5-year-old niece named Lily")
- We won't ask which parts are real and which aren't
- The review flow, questionnaire flow, and PWA delivery all work identically for hypothetical scenarios — the demo still holds up
- **Privacy is paramount.** Nobody in this group is required to disclose family details they're not comfortable sharing.

### Why we want more members to bring scenarios

- **More real / semi-real users** = more solid user research, more persuasive capstone demo
- **More diverse edge cases** = the product design gets pushed to be more robust (0yo infant vs 12yo upper-elementary, gift scenario vs self-use scenario, parent reviewer vs teacher reviewer)
- **Stronger member engagement** = everyone has their own "my demo book", and at the capstone every member can step up and say "this one is mine"
- **Social connection** = when training ends, each member walks out with a gift book they can actually give to a real family member or friend

---

## 8 core questions for group feedback

1. **Is 8 weeks the right scope?** Should we cut it smaller? Or can we be more ambitious?
2. **Is the MVP slice the right pick?** Which partner scenario (Amy / Audrey / Arita) is the best starting point for the demo?
3. **Real users vs simulated:** during training, do we involve the real partners (Audrey / Arita / Amy) for feedback, or use simulated personas?
4. **Model selection:** is single-provider OpenAI enough for M1, or should we show multi-provider integration?
5. **Is the role split workable?** Does the 6-role breakdown above fit the group's skills and interests?
6. **Success criteria:** should the capstone grade emphasize "technical completeness", "business narrative", or "user reaction" — or a balance of all three?
7. **Risks and blockers:** what's the biggest risk you see? (Mine: photo cartoonification may be harder than it looks; the partner review UI is easy to do ugly; under 8-week pressure, the privacy compliance work is the first thing people would cut, which would ruin the topic's whole point.)
8. **Does the topic actually excite you?** Honestly, is this worth 8 weeks of evenings and weekends? If not, I'd rather know now.

---

## Next steps

1. **This week:** group members individually review this pitch, give feedback on the 8 questions above in the group LINE.
2. **Next group meeting:** based on feedback, decide whether to formally adopt as the capstone topic, and begin role-split.
3. **If adopted:** Mark shares the full background material (biz plan, technical decisions, compliance analysis) into a private group repo, and we begin Sprint 0.
4. **If not adopted:** this pitch is withdrawn; we propose another topic or take up a different member's idea.

---

## Important clarification

- This is a **training project candidate**, not a product launch.
- The 8-week goal is **for every group member to learn something** and deliver a capstone demo they can be proud of — not to ship and make money.
- **The original idea came from Audrey.** This pitch just turns her thought into a shared-format document for the group to discuss. Mark's role is to champion it through our group's topic-selection process. If the group doesn't pick it, neither Audrey nor Mark will mind; if the group does pick it, Audrey is naturally the idea's originator.
- Everything produced during training is group-shared output (all members, not just Audrey and Mark).
- After training ends, any group members who want to continue the idea into a real-business version are welcome to — but that is post-training, optional, and not part of this capstone.

---

**Looking forward to your feedback — let's discuss openly in the group LINE.**

> Special thanks to **Audrey** for bringing this idea to the group — it's a rare topic that has real business potential, solid training value, AND the makings of a capstone demo people will actually remember.
