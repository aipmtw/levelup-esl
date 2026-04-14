# Credits & attribution — AI co-editor + human reviewer

## The rule
Every book ships with attribution visible in **three places**, in decreasing order of prominence:

1. **On the PWA front cover** — reviewer badge + AI co-editor line, visible before the reader even opens the book.
2. **On a dedicated credits page** — at the front or back of the book, readable by parents and kids, listing the human reviewer + AI co-editor + AI provider/model details + narration engine.
3. **In `meta.json`** — structured data, machine-readable, cryptographically signed so the attribution cannot be silently changed later.

Every book attributes:

1. **The human reviewer (parent / teacher partner)** — always named. This is the gatekeeper. Required.
2. **The AI co-editor** — named (default: "Luce") or anonymous. Required.
3. **The specific AI services and models used** — provider + model name, stamped at generation time. Required.
4. **The child** as the inspiration (optional, parent's choice).

This is not fine print. It is designed to be read by end users, and it is the core trust signal that separates markluce.ai from pure-AI competitors.

## Why attribution on the cover (not just inside)
Mark's requirement: **家長或老師把關是重要的一環, 明確體現在 pwa 的封面**.

The reviewer is the whole value proposition. Hiding them on an inside credits page buries the one thing parents and gift recipients should see first. Putting the reviewer on the cover:

- **Makes the gatekeeper role visible before the book is even opened.** A parent in a LINE group sees the PWA install prompt and immediately sees "Reviewed by Audrey" — that's the trust moment.
- **Reinforces the partner's brand on every book.** Free brand exposure on every cover shared.
- **Forces honesty about AI.** "Co-created with Luce (AI)" on the cover means nobody can claim this was purely human-authored or purely machine-generated. The truth is visible.
- **Aligns with emerging transparency norms** (EU AI Act Article 50, industry best practices on AI disclosure for consumer-facing content).

## Cover-level display spec

Every PWA cover (and the PDF cover in the `.zip` bundle) must include the following elements, positioned for visibility but not overwhelming the illustration:

### Required cover elements
1. **Book title** (biggest).
2. **Child's name as hero** (second biggest) — e.g. "Mei's Dragon Adventure".
3. **Reviewer badge** — small pill-style tag near the top or bottom corner:
   - Template: `審閱 · Reviewed by {partner_display_name}`
   - Example: `審閱 · Reviewed by Audrey Liu`
   - For sub-partners under a master: `審閱 · Reviewed by Mei Chen (Audrey's network)`
   - For Arita's teacher channel: `審閱 · Teacher Arita Lin`
4. **AI co-editor line** — small italic text at the bottom:
   - Template: `Co-created with {ai_name} · AI co-editor`
   - Default: `Co-created with Luce · AI co-editor`
5. **Platform mark** — tiny `markluce.ai` at the very bottom edge (footer-style).

### Cover manifest icon
The installable app icon (from the PWA manifest) also gets a **tiny reviewer initial badge** overlaid on the corner — e.g. Audrey's books have a small "A" circle in the bottom-right. This is visible even when the PWA is closed on the home screen. Over time, parents recognize the reviewer just from the icon.

## Credits page — content template (inside the book)

### English version
```
Created with love for {child_name}

✍ Story drafted by:     {ai_name or "AI co-editor"}
                        {provider} · {model name} · {model version}
🎨 Illustrations by:    {provider} · {image model name} · {version}
🔊 Narration by:        Azure Neural TTS · {voice name} · {locale}

✅ Reviewed and          {Partner display name}
   approved by:          {Partner role — e.g. "Audrey — mother of Ethan & Lily" / "Arita — English teacher"}
                        {Approval date}
                        Partner signature: {short hash}

Personalized for {child_name} on {creation_date}
markluce.ai · book_id {short_id}
```

### Traditional Chinese version
```
為 {child_name} 精心製作

✍ 故事草擬：     {ai_name 或「AI 共同編輯」}
                {提供者} · {模型名稱} · {模型版本}
🎨 插畫：        {提供者} · {圖像模型} · {版本}
🔊 朗讀：        Azure Neural TTS · {聲音名稱} · {locale}

✅ 審閱與簽核：   {合作夥伴顯示名稱}
                {合作夥伴角色 — 例如「Audrey — 兩個孩子的媽」／「Arita — 英語老師」}
                {簽核日期}
                合作夥伴簽章：{短 hash}

於 {生成日期} 為 {child_name} 個人化
markluce.ai · book_id {short_id}
```

### Japanese version (when ja enabled)
Similar structure; labels translated to Japanese.

## AI provider and model attribution — the details

### Principle
Each AI service contributing to the book is named in the credits with **provider + model name**, as that service was configured at generation time. The name is **stamped at generation time** into `meta.json`, so old books keep their old stamps even after Mark upgrades to newer models.

### Example (typical M1 configuration)
```
✍ Story drafted by:     Luce · OpenAI · GPT-class LLM
🎨 Illustrations by:    OpenAI · gpt-image-1
🔊 Narration (zh-TW):   Microsoft Azure Neural TTS · zh-TW-HsiaoChenNeural
🔊 Narration (en):      Microsoft Azure Neural TTS · en-US-AvaNeural
```

### Why "GPT-class LLM" rather than a specific version
LLM versioning changes frequently, and some providers rename or deprecate models. We stamp the actual model ID at generation time in `meta.json` (authoritative, machine-readable), but on the human-facing credits page we use a slightly softer label like "GPT-class LLM" or "large language model (OpenAI)" — honest, stable, and robust to version churn.

Partners can toggle between two display modes in their workspace:
- **Stable mode (default):** "Story drafted by OpenAI large language model"
- **Precise mode:** "Story drafted by OpenAI GPT-4o (2024-xx)"

Precise mode is for partners / customers who want exact model provenance (e.g. for legal/academic/enterprise use cases). Default is stable mode because it ages better.

## `meta.json` — AI services schema

Extends the existing schema:

```json
{
  "ai_services": [
    {
      "role": "story",
      "provider": "OpenAI",
      "model_family": "GPT",
      "model_id": "gpt-4o-2024-xx-xx",
      "stamped_at": "2026-04-15T10:12:00+08:00"
    },
    {
      "role": "illustration",
      "provider": "OpenAI",
      "model_family": "gpt-image",
      "model_id": "gpt-image-1",
      "stamped_at": "2026-04-15T10:13:00+08:00"
    },
    {
      "role": "narration",
      "provider": "Microsoft Azure",
      "model_family": "Neural TTS",
      "model_id": "zh-TW-HsiaoChenNeural",
      "stamped_at": "2026-04-15T10:14:00+08:00"
    }
  ],
  "co_editor": {
    "mode": "named",
    "display_name": "Luce",
    "engine_version": "markluce.ai/1.0.0"
  },
  "reviewer": {
    "partner_slug": "audrey",
    "display_name": "Audrey Liu",
    "role": "mother of Ethan & Lily",
    "line_user_id_hash": "sha256:…",
    "approved_at": "2026-04-15T10:23:00+08:00",
    "signature": "hmac:…"
  }
}
```

## Compliance with AI service provider policies

Mark's requirement: **請確認是否合乎 ai service provider policy**.

Based on current (2024–2025) published terms of use of the providers we use, our approach of (a) naming the provider + model and (b) clearly disclosing AI involvement to end users **is compliant and in fact aligns with best practice**. Full details in [`../tech/ai-attribution-compliance-en.md`](../tech/ai-attribution-compliance-en.md).

Summary:
- **OpenAI (GPT, gpt-image-1):** commercial use allowed; attribution not required but permitted; plain-text mention of "OpenAI" and the model name is allowed as long as we do not imply OpenAI endorses the product. ✅
- **Microsoft Azure (Neural TTS):** commercial use allowed; attribution not required but permitted; stating "Azure Neural TTS" in credits is standard industry practice. ✅
- **Any future provider (Flux, ElevenLabs, etc.):** check their specific ToS at the time of integration. Pattern is usually the same — commercial use OK, attribution optional but allowed, no false endorsement claims.

**All attribution must be factual and non-endorsing.** We can say "Illustrations by OpenAI gpt-image-1". We must NOT say "Endorsed by OpenAI" or use OpenAI's logo in a way that implies partnership.

**Mark should re-verify compliance with current ToS at actual launch**, because AI provider policies change frequently.

## What's NOT in credits

- The end-user parent's real name is not printed (they can opt in to "with love from {parent}", default off).
- The LINE user ID is never printed in plaintext — only a salted hash for verification.
- Mark's personal name does not appear on books — the platform brand is markluce.ai, not Mark.
- AI provider logos are NOT used (we cite them in plain text only, per their brand guidelines).

## Why a visible credits page

- **Honesty.** Parents deserve to know AI was involved. Hiding it would be a trust-destroying surprise later.
- **Quality signal.** "Reviewed and approved by Audrey Liu" is a trust marker. "AI-generated" alone is not.
- **Liability alignment.** The person whose name appears as reviewer is the one who signs off and stands behind the content.
- **Brand building.** Every book in circulation reinforces the partner's name to the end user and to everyone the end user shows it to.

## Credits page — content template

### English version
```
Created with love for {child_name}

Story by:       {AI name or "AI co-editor"}
Illustrations:  {AI name or "AI co-editor"}
Narration:      Azure Neural TTS
Reviewed &      {Partner display name}
approved by:    {Partner role — e.g. "Audrey — parent of Ethan & Lily" / "Arita — English teacher"}
                {Approval date}

Personalized for {child_name} on {creation_date}
Powered by markluce.ai
```

### Traditional Chinese version
```
為 {child_name} 精心製作

故事撰寫：    {AI name 或「AI 共同編輯」}
插畫：        {AI name 或「AI 共同編輯」}
朗讀：        Azure Neural TTS
審閱與簽核：   {合作夥伴顯示名稱}
              {合作夥伴角色 — 例如「Audrey — 兩個孩子的媽」／「Arita — 英語老師」}
              {簽核日期}

於 {生成日期} 為 {child_name} 個人化
Powered by markluce.ai
```

### Japanese version (when ja enabled)
```
{child_name} のために心を込めて

ストーリー：  {AI name or「AI 共同編集」}
イラスト：    {AI name or「AI 共同編集」}
ナレーション：Azure Neural TTS
監修・承認：  {Partner display name}
              {Partner role}
              {承認日}

{生成日} に {child_name} のために個人化
Powered by markluce.ai
```

## AI co-editor naming — three options

Partners can pick one of three attribution styles, set in their private workspace. Default = **option B** (named engine).

### Option A — Anonymous "AI co-editor"
```
Story by: AI co-editor
```
- **Pro:** maximum honesty, no branding tricks, clearly labels AI involvement.
- **Con:** cold, impersonal, doesn't help brand affinity. Feels like a disclaimer.
- **When to pick:** conservative markets, partners who want to keep the AI element minimal.

### Option B — Named engine "Luce" (my recommendation)
```
Story by: Luce (AI co-editor, markluce.ai)
```
- **Luce** is the soft storytelling persona of the markluce.ai engine. Warm, short, gender-neutral, pronounces cleanly in English / Traditional Chinese / Japanese.
- In zh-TW it can appear as **露西** (Lùxī) or simply **Luce**.
- In ja-JP it can appear as **ルーチェ** (Rūche) or **ルーシー** (Rūshī).
- **Pro:** gives the engine a friendly face, makes the AI feel like a character rather than a black box, reinforces markluce.ai brand across every book that ships regardless of which partner sold it.
- **Pro:** natural pairing in copy — "Co-created by **Luce** and **Audrey**" reads warmly. "Luce wrote the story, Audrey checked every page."
- **Con:** slight anthropomorphization of AI (some people dislike this).
- **When to pick:** default. Works for the vast majority of end users.

### Option C — Partner's own mascot
Partner names their own AI helper character. E.g. Audrey calls hers "Booky" (小書), Arita calls hers "Lingo" (小語).
- **Pro:** partner-branded, each partner feels more unique.
- **Pro:** lets partners build their own IP around the character.
- **Con:** fragmented, no platform-wide recognition.
- **When to pick:** established partners who want to differentiate. Probably not day-one for Audrey/Arita.

## My recommendation
- **Default:** Option B, "Luce".
- **Branding rationale:** Luce lives inside the name markluce.ai — you are literally already using it. Parents and kids will remember "Luce" far more easily than "the markluce.ai engine". It gives Mark a mascot asset he can later extend (Luce stickers, Luce intro video, "Luce wrote a book for you!" push notification copy).
- **Fallback to Option A** for any partner who explicitly wants to de-emphasize the AI element.
- **Option C** is available but not pushed at launch — earn it, don't build it speculatively.

## What's in `meta.json`

Add these fields to the schema (see [`offline-bundle-spec-en.md`](offline-bundle-spec-en.md)):

```json
{
  "co_editor": {
    "mode": "named | anonymous | partner_mascot",
    "display_name": "Luce",
    "engine": "markluce.ai/{semver}"
  },
  "reviewer": {
    "partner_slug": "audrey",
    "display_name": "Audrey Liu",
    "role": "parent of Ethan & Lily",
    "line_user_id_hash": "sha256:…",
    "approved_at": "2026-04-15T10:23:00+08:00",
    "signature": "hmac:…"
  },
  "review_notes": "Audrey 備註：Mei 特別喜歡恐龍，我選了暴龍當主角"
}
```

`line_user_id_hash` and `signature` let future disputes verify that the named reviewer really did approve this exact content. The hash protects the reviewer's LINE user ID from being exposed in plaintext to end users.

## Public-facing copy on partner pages

Partner public pages get a line in the footer / about section:

> 本平台所有繪本由 AI 共同編輯，並由 {partner name} 親自審閱簽核後交付。
> All books on this page are co-edited with AI and personally reviewed and approved by {partner name} before delivery.

This sets the expectation upfront — no one is surprised when they see Luce credited inside the book.

## What's NOT in credits

- The end-user parent's real name is not printed (they can opt in to "with love from {parent}", default off).
- The LINE user ID is never printed in plaintext.
- Mark's personal name does not appear on books — the platform brand is markluce.ai, not Mark. Mark's name lives on `pricing/partner-terms-*.md` and business contracts, not on end-user-facing books.
