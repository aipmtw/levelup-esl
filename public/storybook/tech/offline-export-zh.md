# 離線匯出流程

實作 [`../product/offline-bundle-spec-zh.md`](../product/offline-bundle-spec-zh.md)。主要交付是 PWA（詳見 [`pwa-offline-zh.md`](pwa-offline-zh.md)）；本文件涵蓋次要的 `.zip` 包產出。

## 組件

### 1. PDF 渲染器
- HTML + CSS 模板 → 以 headless Chromium（Playwright）或 PDF 程式庫（pdfkit / wkhtmltopdf）產出 PDF。
- 依年齡分級有不同模板（0–3 / 4–6 / 7–9 / 10–12）。
- 文字排在插畫**旁邊或下方**（不烤進圖裡）。
- 多語：單一 PDF 疊排多語區塊，或每語一份 PDF — 依合作夥伴偏好決定（預設：疊排、單一 PDF）。

### 2. 圖片匯出
- 每頁插畫以印刷品質解析度存成 `pages/page-NN.jpg`。
- 合作夥伴／家長可再用於列印、手作、再張貼。

### 3. 音訊匯出
- 由 Azure TTS 產出每頁 MP3 → `audio/{lang}/page-NN.mp3`。
- 可選的串接 `full.mp3`，含章節標記（ID3 chapter frames 或獨立 `chapters.json`）。
- 一致位元率（128 kbps 單聲道朗讀即可）。

### 4. 打包器
- zip 打包器依 [`../product/offline-bundle-spec-zh.md`](../product/offline-bundle-spec-zh.md) 的樹狀結構打包。
- 寫入 `meta.json`，schema 見該文件。
- 回傳簽章下載 URL（TTL 24–72 小時）。
- 合作夥伴稍後也可從管理面板重新觸發下載。

## 儲存
- 素材包存於 blob 儲存，以 `book_id` 為 key。
- 生命週期：M1 永久保留（合作夥伴可能想重新下載）。M2 再評估保留政策。

## 與 PWA 的關係
PWA 是主要交付，素材包是次要。兩者都在生成時一次產出。合作夥伴在 CMS 切換要提供哪一種，或兩者都提供。
