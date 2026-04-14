# markluce.ai/audrey — 現況觀察

觀察自線上 `markluce.ai/audrey` 頁面。

## 目前做到什麼
- 「AI 孩子英文學習小腳本」 — 依以下輸入產生一分鐘英文腳本（80–120 字）：
  - 興趣關鍵字（預設 chips：恐龍、冰淇淋、太空船、忍者、小貓、樂高）。
  - 孩子年齡。
  - CEFR 等級（A1 / A2 / B1）。
- 內建 TTS。可複製到剪貼簿。
- 英中雙語輸出（英文 + 繁體中文）。
- 必須 LINE 登入。
- 有「Prototype」標籤。

## 目前還沒做的
- 沒有插畫。
- 沒有多頁繪本。
- 沒有離線 PWA／素材包。
- 沒有日文。
- 沒有合作夥伴私人工作區（客戶清單、白名單、每位孩子的備註）。
- 沒有定價、沒有合作夥伴歸因。

## 合作夥伴背景
Audrey 是一位**有兩個自己 0–12 歲孩子的職場家長**，擁有既有的**家長社交圈**。她不只是在賣 — 她本人就是目標客群。她的示範作品就是為自己孩子做的繪本。詳見 [`../partners/audrey-zh.md`](../partners/audrey-zh.md)。

## M1 影響
- Audrey 目前的頁面是兒童繪本引擎的**種子**。互動模式 + LINE 登入 + 繁中 TTS + 年齡／等級問卷都已經被驗證。
- M1 升級：
  1. 一分鐘腳本 → **多頁插畫故事書**（10–20 頁）。
  2. 加上插畫流程（gpt-image-1 + style-lock + 參考圖）。
  3. 加上 **PWA 交付**，綁定 LINE 帳號（[`../tech/pwa-offline-zh.md`](../tech/pwa-offline-zh.md)）。
  4. 加上次要 `.zip` 包（PDF + 圖片 + MP3 + `meta.json`）。
  5. 加上日文為選購語言（繁中為基礎 + 英 + 日）。
  6. 建立合作夥伴**公開頁 + 私人工作區**雙介面架構（[`../partners/partner-page-spec-zh.md`](../partners/partner-page-spec-zh.md)）。
  7. 透過 LINE Login `state` 參數做合作夥伴歸因。
