# 作者與歸屬 — AI 共同編輯 + 人類審閱者

## 規則
每本書的歸屬顯示於**三個位置**，由顯著度遞減：

1. **在 PWA 封面上** — 審閱者徽章 + AI 共同編輯行，讀者還沒打開書就能看到。
2. **在專屬 credits 頁上** — 在書的前或後，家長與孩子都能閱讀，列出人類審閱者 + AI 共同編輯 + AI 提供者／模型細節 + 朗讀引擎。
3. **在 `meta.json` 中** — 結構化資料、機器可讀、加密簽章，讓歸屬資訊不能事後被悄悄變更。

每本書歸屬：

1. **人類審閱者（家長／老師合作夥伴）** — 一律具名。這就是把關人。必備。
2. **AI 共同編輯** — 具名（預設「Luce」）或匿名。必備。
3. **使用的具體 AI 服務與模型** — 提供者 + 模型名稱，在生成時即時標記。必備。
4. **孩子**作為靈感來源（選填，家長決定）。

這不是小字。它就是要給終端使用者看的，而且它正是把 markluce.ai 與純 AI 競爭者區分開來的核心信任訊號。

## 為什麼封面上也要有歸屬（不只在內頁）
Mark 的要求：**家長或老師把關是重要的一環，明確體現在 PWA 的封面**。

審閱者就是整個價值主張。把她埋在內頁的 credits 中，等於把家長與收禮者最應該第一眼看到的東西藏起來。把審閱者放在封面上：

- **在書還沒打開之前，就讓把關角色可見。** 家長在 LINE 群裡看到 PWA 安裝提示，第一眼就看到「審閱：Audrey」 — 那就是信任瞬間。
- **強化合作夥伴在每本書上的品牌曝光。** 每本分享出去的書都是免費品牌曝光。
- **強迫對 AI 的誠實揭露。** 封面上的「與 Luce（AI 共同編輯）共同創作」意味著沒人能宣稱這是純人類寫成或純機器生成。真相可見。
- **符合新興的透明度規範**（歐盟 AI 法第 50 條、業界對消費端 AI 內容揭露的最佳實務）。

## 封面顯示規格

每個 PWA 封面（以及 `.zip` 包中的 PDF 封面）都必須包含下列元素，位置要顯眼但不蓋過插畫：

### 必備封面元素
1. **書名**（最大）。
2. **孩子的名字作為主角**（第二大） — 例如「小美的龍冒險」。
3. **審閱者徽章** — 在上或下角的小藥丸標籤：
   - 範本：`審閱 · Reviewed by {合作夥伴顯示名稱}`
   - 範例：`審閱 · Reviewed by Audrey Liu`
   - 主合作夥伴旗下的子合作夥伴：`審閱 · Reviewed by Mei Chen（Audrey 的網絡）`
   - Arita 老師通路：`審閱 · Arita 老師`
4. **AI 共同編輯行** — 底部的小字斜體：
   - 範本：`Co-created with {ai_name} · AI co-editor`
   - 預設：`Co-created with Luce · AI co-editor`
5. **平台標示** — 底邊最角落的小字 `markluce.ai`（頁尾樣式）。

### 封面 manifest 圖示
PWA manifest 的可安裝應用圖示也會帶一個**小小的審閱者姓名首字徽章**疊在角落 — 例如 Audrey 審閱的書在右下角有一個小 "A" 圓圈。即使 PWA 關閉在主畫面，這個徽章仍然可見。時間久了家長光看圖示就認得出審閱者。

## Credits 頁 — 內容範本（書的內頁）

### 繁體中文版
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

### 英文版
```
Created with love for {child_name}

✍ Story drafted by:     {ai_name or "AI co-editor"}
                        {provider} · {model name} · {model version}
🎨 Illustrations by:    {provider} · {image model name} · {version}
🔊 Narration by:        Azure Neural TTS · {voice name} · {locale}

✅ Reviewed and          {Partner display name}
   approved by:          {Partner role}
                        {Approval date}
                        Partner signature: {short hash}

Personalized for {child_name} on {creation_date}
markluce.ai · book_id {short_id}
```

## AI 提供者與模型歸屬 — 細節

### 原則
每項參與繪本生成的 AI 服務都在 credits 中以**提供者 + 模型名稱**具名，按照生成時的設定。名稱在**生成時即時寫入** `meta.json`，即使 Mark 日後升級模型，舊書仍保留舊的標記。

### 典型 M1 設定範例
```
✍ 故事草擬：     Luce · OpenAI · GPT 類 LLM
🎨 插畫：        OpenAI · gpt-image-1
🔊 朗讀（繁中）：Microsoft Azure Neural TTS · zh-TW-HsiaoChenNeural
🔊 朗讀（英）：  Microsoft Azure Neural TTS · en-US-AvaNeural
```

### 為什麼寫「GPT 類 LLM」而不是具體版本
LLM 版本變動頻繁，有些提供者會改名或停用模型。我們在 `meta.json` 中在生成時寫下實際的模型 ID（權威資料、機器可讀），但在給人類看的 credits 頁上用稍微柔軟一點的標籤如「GPT 類 LLM」或「OpenAI 大型語言模型」 — 誠實、穩定、對版本變動有韌性。

合作夥伴可以在工作區切換兩種顯示模式：
- **穩定模式（預設）：** 「故事由 OpenAI 大型語言模型草擬」
- **精確模式：** 「故事由 OpenAI GPT-4o（2024-xx）草擬」

精確模式給想要確切模型溯源的合作夥伴／客戶（例如法律／學術／企業用途）。預設為穩定模式，因為耐得住時間。

## `meta.json` — AI 服務 schema

擴充現有 schema：

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
    "role": "兩個孩子的媽",
    "line_user_id_hash": "sha256:…",
    "approved_at": "2026-04-15T10:23:00+08:00",
    "signature": "hmac:…"
  }
}
```

## AI 服務提供者政策合規

Mark 的要求：**請確認是否合乎 AI service provider policy**。

依據我們使用的提供者目前（2024–2025）公開的服務條款，我們（a）具名提供者與模型、（b）對終端使用者清楚揭露 AI 參與的作法**是合規的，而且實際上符合業界最佳實務**。完整細節見 [`../tech/ai-attribution-compliance-zh.md`](../tech/ai-attribution-compliance-zh.md)。

摘要：
- **OpenAI（GPT、gpt-image-1）：** 允許商業使用；不要求但允許歸屬；在不暗示 OpenAI 背書產品的前提下，可以在純文字中提到「OpenAI」與模型名稱。✅
- **Microsoft Azure（Neural TTS）：** 允許商業使用；不要求但允許歸屬；在 credits 中寫「Azure Neural TTS」是業界標準做法。✅
- **任何未來的提供者（Flux、ElevenLabs 等）：** 在整合時檢查他們具體的 ToS。模式通常相同 — 允許商業使用、歸屬是可選的但允許、不得作虛假背書宣稱。

**所有歸屬都必須是事實且非背書性。** 可以寫「Illustrations by OpenAI gpt-image-1」。**不可以**寫「Endorsed by OpenAI」，也不可以以暗示合作的方式使用 OpenAI 的 logo。

**Mark 應在實際上線時重新確認與當時 ToS 的合規**，因為 AI 提供者政策變動頻繁。

## credits 中**不**會出現的

- 終端使用者家長的真實姓名不會印上去（可選擇加入「獻給 {家長名字}」，預設關閉）。
- LINE user ID 絕不以明文印上 — 只印加鹽 hash 用於驗證。
- Mark 的個人名字不出現在書上 — 平台品牌是 markluce.ai，不是 Mark。
- AI 提供者的 logo **不使用**（只以純文字引用，符合他們的品牌指南）。
