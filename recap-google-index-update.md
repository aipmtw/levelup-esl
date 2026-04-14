# Google 搜尋結果更新紀錄
**日期：** 2026-04-14
**網站：** https://markluce.ai

---

## 問題

Google 搜尋 `markluce.ai` 顯示的是舊版內容：

> **台灣人工智慧學校經理人AI PM 班同學牆**
> markluce.ai
> 1. 考試當天要準備什麼？ 2. 考試時間和題數是多少？...

網站已全面改版為專案 showcase hub，但 Google 仍顯示舊的「同學牆」頁面。

---

## 原因

Google 的索引快取仍保留舊版頁面內容，包含：
- 舊標題：`台灣人工智慧學校 經理人 AI PM 班同學牆`
- 舊 meta description：`台灣人工智慧學校 經理人 AI PM 班第一期 同學自我介紹牆`

---

## 處理步驟

### Step 1：更新 meta description

舊：
```html
<meta name="description" content="MarkLuce.ai — AI-powered solutions by 馬克路思科技有限公司" />
```

新：
```html
<meta name="description" content="MarkLuce.ai — 用 AI 打造的產品與工具。AI Dev Brief、深度文章、ESL 英語平台、AI Agents 目錄、個人化語言繪本等專案，每個都是 AI 協作的成果。馬克路思科技。" />
```

### Step 2：Google Search Console 驗證

1. 進入 https://search.google.com/search-console/welcome
2. 選擇 URL prefix → `https://markluce.ai`
3. 選擇 HTML tag 驗證方式
4. 在首頁 `<head>` 加入新的驗證 meta tag：
   ```html
   <meta name="google-site-verification" content="SLVu6VIgdnnSc6KsmnAwAikPUWQHuFrnSbk6Zi1Bmps" />
   ```
5. 部署後點擊 Verify → 驗證成功

### Step 3：嘗試清除快取

- 進入 Removals 工具：https://search.google.com/search-console/removals
- 發現 Google 已移除「Clear cached URL」功能
- 訊息顯示：`Cache updates are no longer available. You can still request snippet updates.`

### Step 4：Request Indexing

1. 進入 URL Inspection
2. 輸入 `https://markluce.ai`
3. 確認 Google 仍顯示舊的 crawled page（標題為「同學牆」）
4. 點擊 **Request Indexing**
5. 收到確認：`URL was added to a priority crawl queue`

---

## 目前狀態

| 項目 | 狀態 |
|------|------|
| 首頁 meta description | 已更新並部署 |
| Google Search Console 驗證 | 已通過 |
| Request Indexing | 已提交，等待 Google 重新爬取（預計 1-3 天） |
| 舊快取清除 | Google 已不支援手動清除，需等重新爬取後自動更新 |

---

## 注意事項

- Google 的 Removals 工具在 2026 年已不再提供 cache 清除功能
- 更新搜尋結果摘要（snippet）的最有效方式是 Request Indexing
- 確保 meta description 具體描述網站內容，避免 Google 自行抓取頁面隨機文字
- 提交後不需重複提交，多次提交不會改變優先順序

---

*紀錄者：Claude Opus 4.6 · 2026-04-14*
