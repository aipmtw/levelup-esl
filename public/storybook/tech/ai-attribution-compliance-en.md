# AI service provider attribution — compliance check

## Summary
markluce.ai uses third-party AI services (OpenAI for text + images, Microsoft Azure for TTS) to draft book content. We attribute each service by provider + model name on the book credits page, and we disclose AI involvement on the PWA cover. This doc documents the compliance analysis and flags what Mark should re-verify at actual launch.

> **⚠️ Important:** This analysis reflects publicly-available policies as understood at the time of writing. AI service provider policies change frequently. **Mark must re-verify current terms before launch** and should have a lawyer review the specific clauses if any dispute arises. Nothing in this doc is legal advice.

## The questions we're answering
1. Are we **allowed** to use OpenAI / Azure outputs in a commercial product sold to end users?
2. Are we **allowed** to name OpenAI / Azure as the providers in user-facing credits?
3. Are we **allowed** to generate personalized content for children (age 0–12)?
4. Are we **required** to attribute, or is it optional?
5. What are we **not** allowed to do?

## OpenAI — GPT-class LLMs + gpt-image-1

### Commercial use
**✅ Allowed.** OpenAI's Terms of Use explicitly permit commercial use of outputs generated through their API. Users own the output they generate, subject to OpenAI's usage policies.

### Attribution in credits
**✅ Allowed, not required.** OpenAI does not mandate attribution, but it permits users to state that content was generated with their services. Plain-text credits like "Story drafted by OpenAI large language model" or "Illustrations by OpenAI gpt-image-1" are standard and compliant.

### Content restrictions (what we must avoid)
OpenAI's usage policies prohibit:
- Content that sexualizes or harms minors — **critical for us since our users are 0–12**. Our review gate (partner approval on every book) is specifically designed to catch any inadvertent output in this category.
- Disallowed content categories: hate, harassment, violence, self-harm, malware, fraud, political persuasion, etc. None of these are in our product scope (personalized kid storybooks).
- Impersonating real people without consent — we handle this with our **cartoonification-on-upload** rule (see [`image-upload-privacy-en.md`](image-upload-privacy-en.md)) and partner review.
- Claiming OpenAI endorses the product — we must NEVER say "Endorsed by OpenAI" or use OpenAI's logos in a way that implies partnership.

### Name usage
**✅ Allowed in plain text, restricted for logos.** We can write "OpenAI" in credits. We cannot use OpenAI's logo, brand marks, or trade dress without permission. Our default is plain-text only — no logos.

### For children's content
OpenAI does not ban content for children; it bans harmful content involving children. Personalized age-appropriate storybooks reviewed by a human partner are squarely permitted. The partner review gate is our safety net.

### Practical compliant example
```
✍ Story drafted by: Luce · OpenAI large language model
🎨 Illustrations by: OpenAI · gpt-image-1
```
Plain text. No logo. No endorsement claim. Factual. ✅

---

## Microsoft Azure — Neural TTS

### Commercial use
**✅ Allowed.** Azure Cognitive Services (which includes Neural TTS) is a commercial product sold specifically for commercial use. Audio output can be embedded in products sold to end users.

### Attribution in credits
**✅ Allowed, not required.** Microsoft does not require attribution for Azure TTS audio, but permits it. Stating "Azure Neural TTS" or "Microsoft Azure Neural TTS · zh-TW-HsiaoChenNeural" in credits is fully compliant.

### Content restrictions
- **No voice cloning of real people** without their explicit consent and verification. We only use Microsoft's pre-built standard neural voices (Hsiao-Chen, Nanami, Ava, etc.) — never custom voice cloning. ✅
- No use in real-time impersonation, fraud, or harmful applications.
- Azure has "responsible AI" guidelines that **recommend** disclosing AI synthesis to end users. Our explicit credits are aligned with this. ✅

### Name usage
**✅ Plain text OK, logos restricted.** Same as OpenAI — we use plain text "Microsoft Azure Neural TTS" in credits, no logos.

### For children's content
No restriction. Neural TTS is routinely used in education products for children.

### Practical compliant example
```
🔊 Narration: Microsoft Azure Neural TTS · zh-TW-HsiaoChenNeural
```
Plain text. Factual. No logo. No endorsement claim. ✅

---

## Future providers to re-check at integration time
- **Black Forest Labs Flux** (via fal.ai / Replicate) — if we add Flux for character consistency (see [`image-gen-en.md`](image-gen-en.md)), re-check BFL's commercial license terms (different between Flux free, Flux Pro, Flux Ultra).
- **ElevenLabs v3** — if we add as premium TTS upsell, re-check their content policy (stricter than Azure on voice cloning) and commercial tier terms.
- **Any new LLM provider** — same pattern: commercial use, attribution rules, children-safety rules.

## Our compliance-by-design choices

1. **Partner review gate on every book.** This catches any AI output that would violate any provider's content policies, regardless of which provider.
2. **Cartoonification on photo upload.** Uploaded photos of real people (especially children) are transformed to cartoon style, so we never generate photorealistic imagery of real minors. See [`image-upload-privacy-en.md`](image-upload-privacy-en.md).
3. **Plain-text attribution only.** No logos, no endorsement claims, no brand misuse.
4. **Stamp model IDs at generation time.** `meta.json` records exactly which model version produced the content, for traceability.
5. **Stable-mode display by default.** Human-facing credits use soft labels ("GPT-class LLM") that age well; precise mode is opt-in for partners who need exact version labels.
6. **No AI provider trademarks in marketing.** Partner pages do not say "Powered by OpenAI" as a marketing claim — only in credits on individual books, factually.

## What Mark must do before M1 launch
1. Re-read the current OpenAI Terms of Use, Usage Policies, and Brand Guidelines (last updated by OpenAI) and confirm nothing has changed that affects the above.
2. Same for Microsoft Azure AI Services terms.
3. Have a Taiwanese lawyer briefly review the attribution format and the cartoonification flow against 個資法.
4. Decide whether to seek explicit written confirmation from OpenAI / Microsoft business accounts — not required, but useful if Mark wants extra legal certainty.
5. Keep this doc updated as a living compliance checklist.

## When in doubt
Default to **more attribution, less logo usage, more human review, more user disclosure**. Every AI provider's policies trend in this direction. Being on the transparent side of the industry averages is a legal asset.
