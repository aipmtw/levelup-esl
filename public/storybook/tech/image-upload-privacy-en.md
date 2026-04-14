# Image upload — cartoonification + privacy

## The feature
Partners (and, through partners, parents) can upload **photos as source material** for a personalized book — a photo of the child, a sibling, a pet, a favorite toy, the family home, etc. The platform uses these as reference for illustrations **but every uploaded photo is cartoonified before use**. The raw photo is never shipped in a book, and is deleted shortly after processing.

This gives us:
- **Much better character consistency** — the cartoon of Mei actually looks like Mei (in cartoon style), not a random stock-looking kid.
- **Reusable character references** — once Mei's cartoon exists, it can be used across every future book for her, giving multi-year series consistency.
- **Privacy compliance** — no raw photos of real children stored long-term, no photorealistic AI imagery of minors generated, no violation of 個資法 or international child privacy laws.
- **Policy compliance with image-gen providers** — transforming-to-cartoon sidesteps "don't generate photorealistic images of real people" restrictions.

## The hard rule
> **Every uploaded photo is cartoonified on upload. The raw photo is deleted within 24 hours (default) or immediately after processing (preferred). Only the cartoon-style reference is retained, in the partner's private workspace, bound to one specific child.**

No exceptions. No "just this once raw photo". No storing raw photos in the partner's workspace. No sending raw photos of children to any system downstream of the cartoonification step.

## Why cartoonify (the three reasons, in order of importance)

### 1. Privacy for real children
Real children's photos are sensitive personal data under Taiwan 個資法, GDPR (if ever serving EU), COPPA (if ever serving US under-13), and APPI (Japan). Storing raw photos creates legal risk and a breach liability. Cartoonifying immediately:
- Removes biometric data (facial geometry) from what's stored
- Makes the stored reference non-identifying in isolation
- Aligns with data minimization principles (keep only what's needed)

### 2. Compliance with AI image-gen provider policies
OpenAI's usage policies (and similar policies from Flux, other providers) restrict generating **photorealistic imagery of real people**, especially minors. Transforming to cartoon style **first**, then using the cartoon as reference for book illustrations, sidesteps these restrictions — we're not asking the model to recreate a real person's face, we're asking it to draw a cartoon character that was derived from a reference.

See [`ai-attribution-compliance-en.md`](ai-attribution-compliance-en.md) for the full provider policy analysis.

### 3. Better creative output
Honestly, cartoonified characters look BETTER in illustrated kid books than photo-realistic insertions. Kid books are a cartoon medium; a cartoon character blends; a photorealistic face inserted into a cartoon looks wrong. Form follows medium.

## Upload flow (technical)

```
Partner / parent clicks "upload photo"
        │
        ▼
┌───────────────────┐
│ Consent gate      │ ← Explicit consent form (see below). Blocks upload
│                   │   if not signed. Records consent in audit log.
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Upload to         │ ← Short-lived bucket, 24h max TTL, encrypted at rest,
│ processing bucket │   access logged, no long-term storage
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Cartoonification  │ ← gpt-image-1 (or equivalent) with cartoon-style prompt,
│                   │   photo as reference input. Output: single cartoon character
│                   │   sheet (face + body + distinguishing traits).
└─────────┬─────────┘
          │
          ├──────────────► RAW PHOTO DELETED (immediately preferred, 24h max)
          │
          ▼
┌───────────────────┐
│ Cartoon reference │ ← Stored in partner's private workspace, bound to one
│ stored            │   specific child profile. NOT shared across children or
│                   │   across partners.
└─────────┬─────────┘
          │
          ▼
    Reusable for all future book generations for this child
```

## Consent form — what the parent/partner must agree to

Before any photo upload, a consent screen displays (in the language the partner's public page is set to, defaulting to zh-TW Traditional):

```
照片使用同意書

我同意 markluce.ai 平台以我上傳的照片作為
[孩子姓名] 個人化繪本的參考素材。

我理解並同意：

☐ 上傳的原始照片會在處理後立即（或最遲 24 小時內）從伺服器刪除。
☐ 平台會將原始照片轉換為卡通風格的角色參考，絕不儲存或使用原始照片
   於後續生成。
☐ 卡通參考檔只儲存在 [合作夥伴名稱] 的私人工作區，僅用於為 [孩子姓名]
   生成繪本。絕不與其他合作夥伴共用，絕不用於 AI 模型訓練。
☐ 我可以隨時要求 [合作夥伴名稱] 或 markluce.ai 刪除卡通參考檔，刪除
   後不可復原。
☐ 我是此照片中孩子的法定監護人或已獲得法定監護人的明確同意。
☐ 照片內容不包含任何暴力、裸露、或其他不適合兒童產品的素材。

[合作夥伴] 已向我說明上述條款。

簽署人：____________________  日期：____________________

Photo Upload Consent

I consent to markluce.ai using my uploaded photo as reference material for
personalized books for [child name].

I understand and agree:

☐ The raw photo will be deleted from the server immediately after processing
  (and no later than 24 hours).
☐ The platform will convert the raw photo into a cartoon-style character
  reference. The raw photo is never stored or used for anything else.
☐ The cartoon reference is stored only in [Partner name]'s private workspace,
  used only for generating books for [child name]. Never shared with other
  partners. Never used for AI model training.
☐ I may request [Partner name] or markluce.ai to delete the cartoon reference
  at any time. Deletion is irreversible.
☐ I am the legal guardian of the child in the photo, or I have obtained the
  legal guardian's explicit consent.
☐ The photo contains no violence, nudity, or other material inappropriate
  for children's products.

[Partner] has explained the above terms to me.

Signed: ____________________  Date: ____________________
```

Consent is recorded in `meta.json` and in the partner's private audit log, linked to the child profile. Revoking consent triggers deletion of the cartoon reference and any books that depend on it (the books remain as historical copies with a note "created from a now-revoked reference").

## What kinds of photos partners can accept

### ✅ Allowed
- The child's own face (with legal-guardian consent).
- Siblings and pets (with guardian consent for siblings).
- Family home, child's room, favorite toys, favorite foods.
- Landscapes and places meaningful to the child (grandparents' house, local park, favorite restaurant).
- Drawings the child made (child's own art used as inspiration).

### ❌ Forbidden
- Photos of children who are NOT the customer's own (e.g. classmates without those children's parents' consent).
- Photos of identifiable third parties (neighbors, teachers) without their consent.
- Any photos containing violence, nudity, alcohol, weapons, or other content inappropriate for a children's book.
- Any copyrighted material the user does not own (e.g. a photo of a Disney character, a photo of a movie poster).
- Any photo the partner or parent does not have the legal right to use.

Partner review gate catches most of these anyway (see [`../product/review-workflow-en.md`](../product/review-workflow-en.md)), but the consent form + upload policy are the first line of defense.

## Storage & retention policy

### Raw photos (before cartoonification)
- **Location:** short-lived processing bucket only.
- **Encryption:** at rest (AES-256) and in transit (TLS 1.3).
- **TTL:** preferred = immediate delete after successful cartoonification. Hard max = 24 hours from upload.
- **Access:** only the automated cartoonification pipeline. No human (including Mark) can view raw uploads.
- **Logging:** every upload event logged with timestamp, partner_slug, child_profile_id, consent_hash.

### Cartoon references (after cartoonification)
- **Location:** partner's private workspace, bound to a specific child profile.
- **Encryption:** at rest (AES-256).
- **Retention:** kept as long as the child profile exists. Deleted immediately when the parent/partner requests deletion.
- **Access:** only the partner who owns the workspace (plus Mark as global admin, with the same no-snooping rule as all private data — see [`../partners/family-governance-en.md`](../partners/family-governance-en.md) for the Amy-specific case, same spirit applies to all).
- **Not used for AI training:** contractually and technically excluded from any training / fine-tuning pipeline.

### Audit log
Every upload + cartoonification + deletion is logged in a tamper-evident audit log that the partner can review at any time. Parents can request a copy of the audit log for their child's uploads.

## Partner responsibilities
Partners are the first line of defense. They must:
1. **Explain the consent form to the parent in person or in writing** before uploading.
2. **Obtain signed consent** (electronic checkbox is fine if the partner confirms identity via LINE user ID).
3. **Verify the parent is the legal guardian** of the child in the photo.
4. **Reject uploads** that contain inappropriate content, third parties without consent, or copyrighted material.
5. **Delete references on request** without delay or pushback.

Partners who repeatedly violate upload policy may have their master-partner status revoked by Mark. This is in the partner agreement.

## Mark's responsibilities
1. **Provide secure upload infrastructure** that meets the spec above.
2. **Audit the cartoonification pipeline** to confirm raw photos are deleted as promised.
3. **Review policies annually** against current regulations (個資法, GDPR, COPPA, APPI if applicable).
4. **Offer a clear parent-facing privacy page** in zh-TW, en, and ja-JP.
5. **Respond to deletion requests within 72 hours** of receiving them.

## M1 scope
- Upload flow with consent gate, short-lived bucket, cartoonification step, raw delete.
- One cartoon reference per child, reusable across that child's books.
- Partner-level audit log.

## M2 follow-ups
- Multiple cartoon references per child (child + sibling + pet as separate reference sheets).
- Character evolution (cartoon reference "ages" alongside the child — Mei at 3 looks different from Mei at 7).
- Parent-facing privacy portal where parents can view and delete their own uploads directly (bypassing partner intermediary).
