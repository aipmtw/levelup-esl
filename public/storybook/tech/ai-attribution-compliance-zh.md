# AI 服務提供者歸屬 — 合規檢查

## 摘要
markluce.ai 使用第三方 AI 服務（OpenAI 提供文字與圖像、Microsoft Azure 提供 TTS）來草擬繪本內容。我們在書的 credits 頁上以提供者 + 模型名稱歸屬每項服務，並在 PWA 封面上揭露 AI 參與。本文件記錄合規分析，並標示 Mark 在實際上線前需要重新確認的事項。

> **⚠️ 重要：** 本分析反映撰寫當下對公開政策的理解。AI 服務提供者政策變動頻繁。**Mark 必須在上線前重新確認當時條款**，若有任何爭議應由律師審視具體條款。本文件不構成法律意見。

## 我們要回答的問題
1. 我們**可以**在賣給終端使用者的商業產品中使用 OpenAI／Azure 的輸出嗎？
2. 我們**可以**在給使用者看的 credits 中具名 OpenAI／Azure 作為提供者嗎？
3. 我們**可以**為兒童（0–12 歲）生成個人化內容嗎？
4. 我們**必須**做歸屬，還是可選？
5. 我們**不可以**做什麼？

## OpenAI — GPT 類 LLM + gpt-image-1

### 商業使用
**✅ 允許。** OpenAI 服務條款明確允許透過 API 產生的輸出用於商業用途。使用者擁有自己生成的輸出，受 OpenAI 使用政策約束。

### Credits 中的歸屬
**✅ 允許，非必要。** OpenAI 不強制歸屬，但允許使用者陳述內容是以他們的服務生成。純文字 credits 如「Story drafted by OpenAI large language model」或「Illustrations by OpenAI gpt-image-1」是業界標準且合規。

### 內容限制（我們必須避免的）
OpenAI 的使用政策禁止：
- 將未成年人性化或傷害未成年人的內容 — **對我們特別關鍵，因為使用者是 0–12 歲**。我們的審閱關卡（每本書都要合作夥伴簽核）就是專門為捕捉這個類別的任何意外輸出設計的。
- 不允許的類別：仇恨、騷擾、暴力、自殘、惡意軟體、詐騙、政治說服等。這些都不在我們產品範圍內（個人化兒童繪本）。
- 未經同意模仿真人 — 我們以**上傳即卡通化**規則處理（見 [`image-upload-privacy-zh.md`](image-upload-privacy-zh.md)）與合作夥伴審閱。
- 宣稱 OpenAI 背書產品 — 我們**絕對不可以**說「Endorsed by OpenAI」，也不可以以暗示合作的方式使用 OpenAI 的 logo。

### 名稱使用
**✅ 純文字允許，logo 受限。** 我們可以在 credits 中寫「OpenAI」。未經許可不可使用 OpenAI 的 logo、品牌標記或商業外觀。我們的預設是純文字 — 不用 logo。

### 兒童內容
OpenAI 不禁止兒童內容；它禁止涉及兒童的有害內容。經人類合作夥伴審閱的、年齡合適的個人化故事書是完全允許的。合作夥伴審閱關卡是我們的安全網。

### 合規範例
```
✍ Story drafted by: Luce · OpenAI large language model
🎨 Illustrations by: OpenAI · gpt-image-1
```
純文字。無 logo。無背書宣稱。事實。✅

---

## Microsoft Azure — Neural TTS

### 商業使用
**✅ 允許。** Azure Cognitive Services（包含 Neural TTS）是專門為商業使用而賣的商業產品。音訊輸出可嵌入賣給終端使用者的產品中。

### Credits 中的歸屬
**✅ 允許，非必要。** Microsoft 不要求 Azure TTS 音訊有歸屬，但允許。在 credits 中寫「Azure Neural TTS」或「Microsoft Azure Neural TTS · zh-TW-HsiaoChenNeural」完全合規。

### 內容限制
- **禁止未經本人明確同意並驗證的真人語音複製。** 我們只使用 Microsoft 預製的標準神經語音（Hsiao-Chen、Nanami、Ava 等） — 不做自訂語音複製。✅
- 禁止用於即時冒充、詐騙或有害應用。
- Azure 有「負責任 AI」指南，**建議**向終端使用者揭露 AI 合成。我們明確的 credits 符合這個方向。✅

### 名稱使用
**✅ 純文字可以，logo 受限。** 與 OpenAI 相同 — 我們在 credits 中用純文字「Microsoft Azure Neural TTS」，不用 logo。

### 兒童內容
無限制。Neural TTS 常用於兒童教育產品。

### 合規範例
```
🔊 Narration: Microsoft Azure Neural TTS · zh-TW-HsiaoChenNeural
```
純文字。事實。無 logo。無背書宣稱。✅

---

## 整合時需重新確認的未來提供者
- **Black Forest Labs Flux**（透過 fal.ai／Replicate） — 若加入 Flux 做角色一致性（見 [`image-gen-zh.md`](image-gen-zh.md)），重新確認 BFL 的商業授權條款（Flux free、Flux Pro、Flux Ultra 不同）。
- **ElevenLabs v3** — 若加入作為 premium TTS 加購，重新確認他們的內容政策（比 Azure 對語音複製更嚴格）與商業等級條款。
- **任何新 LLM 提供者** — 相同模式：商業使用、歸屬規則、兒童安全規則。

## 我們的「合規即設計」選擇

1. **每本書都經合作夥伴審閱關卡。** 不論哪個提供者，這個關卡能捕捉任何違反任何提供者內容政策的 AI 輸出。
2. **相片上傳時即卡通化。** 上傳的真人（尤其是兒童）相片會轉成卡通風格，所以我們絕不生成真實未成年人的照片級影像。見 [`image-upload-privacy-zh.md`](image-upload-privacy-zh.md)。
3. **只用純文字歸屬。** 無 logo、無背書宣稱、無品牌誤用。
4. **在生成時即時標記模型 ID。** `meta.json` 精確記錄哪個模型版本產出內容，可追溯。
5. **預設穩定模式顯示。** 給人類看的 credits 使用耐久的柔軟標籤（「GPT 類 LLM」）；精確模式是合作夥伴選擇性開啟的。
6. **行銷素材中不使用 AI 提供者的商標。** 合作夥伴頁面不會把「Powered by OpenAI」當成行銷宣稱 — 只在個別書的 credits 中以事實形式出現。

## M1 上線前 Mark 必須做的事
1. 重新閱讀當時的 OpenAI 服務條款、使用政策與品牌指南，確認沒有影響上述內容的變動。
2. 對 Microsoft Azure AI Services 條款做同樣檢查。
3. 請台灣律師簡要審視歸屬格式與卡通化流程是否符合個資法。
4. 決定是否要向 OpenAI／Microsoft 商業帳戶尋求明確書面確認 — 非必要，但若 Mark 想要額外法律確定性可做。
5. 把本文件當成活的合規檢查清單持續更新。

## 有疑慮時
預設往**更多歸屬、更少 logo 使用、更多人類審閱、更多使用者揭露**的方向走。每個 AI 提供者的政策都朝這個方向發展。站在業界透明度平均值以上的一側是法律資產。
