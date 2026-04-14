# TTS — Azure Neural TTS

**已鎖定。** Azure Neural TTS 是 markluce.ai 的預設 TTS。

## 為什麼選 Azure（而不是 ElevenLabs 當基礎）
- premium 等級中成本最低 — 可大規模運作、符合 B2B 毛利結構。
- 繁中 + 日文支援強（ElevenLabs 對亞洲語言較弱）。
- 內建朗讀風格。
- ElevenLabs v3 保留作為**高階加購**，讓合作夥伴轉售給終端使用者（「Pro 朗讀」加購）。讓 Mark 的基礎成本維持平穩，同時給合作夥伴差異化空間。

## 各語言聲音

### 繁中（基礎）— 只用 `zh-TW-*` 聲音
- `zh-TW-HsiaoChenNeural` — 主力，溫暖、適合說故事。
- `zh-TW-HsiaoYuNeural` — 備選，較年輕。

**嚴禁使用任何 `zh-CN-*` 聲音。** 繁體中文內容必須使用 `zh-TW-*`，確保語調與用字符合台灣繁中習慣。

### 日文（選購）
- `ja-JP-NanamiNeural` — 主力，兒童友善、自然。
- `ja-JP-AoiNeural` — 備選，明亮／年輕。

### 英文（選購／Arita 舊介面預設）
- 既有的 `en-US-AvaNeural`（Ava）與 `en-US-AndrewNeural`（Andrew） — 已在 `markluce.ai/arita` 運作。
- 為兒童繪本加上朗讀風格聲音（例如 `en-US-JennyNeural`，搭配 narration style）。

## 風格
- 兒童繪本優先使用朗讀／溫和風格（`style="storytelling"` / `style="gentle"`）。
- 成人家教對話使用中性風格。

## 使用模式
- 在產生繪本時為每頁預先合成 MP3。
- 依 `(page_text_hash, voice, style)` 做快取 — 相同頁不重複合成。
- 在離線包中以每頁一檔提供；可選的 `full.mp3` 含章節標記。

## Premium 加購（ElevenLabs v3）
- 合作夥伴可在 CMS 切換。
- 每次產生成本轉嫁（或由合作夥伴作為 premium 方案吸收）。
- 介面一致 — 後端 provider 切換即可。
