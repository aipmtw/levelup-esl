# PWA 離線交付

**兒童繪本的主要交付格式。** 每本生成的繪本都以**獨立 PWA**（Progressive Web App）形式出貨，每本有獨一無二的名稱，綁定指定 LINE 帳號，首次啟動授權後可完全離線播放。

## 為什麼用 PWA（不只是 zip）
- **飛航模式** — 家長在飛機／長途旅行前先載入，小孩在無網路下玩好幾個小時。
- **每本獨立身分** — 可安裝的應用名稱獨一無二（「小美的恐龍冒險」、「太郎的太空冒險」），小孩在桌面看到的是那本特定繪本，不是一個通用閱讀器。
- **夥伴控制** — 合作夥伴把 PWA 指派給一個或多個 LINE 帳號，只有白名單帳號能安裝／播放。
- **授權可離線續命** — LINE auth token 在首次啟動時快取，之後離線啟動時在本機驗證。

## 每本書的 PWA 命名
- 每本書有**獨一無二的 PWA 名稱**，由書名 + 孩子名字組合而成。例如：`Lily's Dinosaur Adventure`、`太郎のうちゅうぼうけん`、`小美的恐龍冒險`。
- 合作夥伴在發布前可在 CMS 修改名稱。
- 獨立 URL：`app.markluce.ai/{partner-slug}/book/{book-id}` — 同時作為 PWA 的 `start_url`。

## Manifest（每本書自動產生）
```json
{
  "name": "小美的恐龍冒險",
  "short_name": "恐龍冒險",
  "start_url": "/audrey/book/abc123",
  "display": "standalone",
  "background_color": "#fff8e1",
  "theme_color": "#ff6f61",
  "icons": [
    { "src": "/audrey/book/abc123/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/audrey/book/abc123/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "lang": "zh-TW",
  "dir": "ltr"
}
```

應用圖示從繪本主角的參考圖自動生成。

## Service worker 快取策略
- **首次啟動（需網路，已授權）：** service worker 預先快取所有資源：
  - HTML 外殼、CSS、JS
  - 每頁插畫（`pages/page-NN.jpg`）
  - 朗讀音訊（`audio/{lang}/page-NN.mp3`）
  - `meta.json`
  - LINE 驗證 token（加密，僅限本 PWA）
- **後續啟動：** service worker 從快取提供所有資源，不需網路。
- 書本素材採**快取優先**策略（不會變動）；未來任何同步／遙測走**僅限網路**策略，離線時優雅降級。

## LINE 帳號綁定

### 安裝時（需網路）
1. 家長在裝置上開啟 `app.markluce.ai/{slug}/book/{book-id}`。
2. 必須 LINE Login — 授權流程在線上完成。
3. 後端檢查本書的**白名單**：這位 LINE 使用者 ID 是否被指派到本書？
4. 是：service worker 安裝、資源快取、寫入一個**長期封存 token** 到 IndexedDB（由 Mark 平台金鑰簽署，綁定本 LINE user ID + book ID + 過期時間）。
5. 否：拒絕安裝，顯示明確錯誤訊息。

### 離線啟動時
1. PWA 開啟，service worker 從快取提供外殼。
2. 從 IndexedDB 讀取封存 token。
3. 本機驗證 token 簽章 + 過期時間 + 綁定關係（LINE user ID 必須與 token 封存時一致）。
4. 通過：繪本播放，無需網路。
5. 過期或遭竄改：顯示「請連線重新驗證」，要求線上再驗證。

### Token 有效期
- **預設：** 90 天。足以支援真實的離線使用（旅行、山區、「阿嬤家」），同時短到足以在濫用時撤銷。
- **刷新：** PWA 只要在線上，就會在背景靜默刷新封存 token。
- **夥伴覆寫：** 合作夥伴 CMS 可以針對每本書設定更短或更長的 TTL（例如試用贈品 7 天、付費永久版 365 天）。

## 合作夥伴控制項（在 CMS）
- **白名單** — 允許安裝本 PWA 的 LINE user ID 清單（或顯示名稱解析為 ID）。
- **每帳號最大安裝數** — 通常 1–3 台裝置。
- **TTL** — 離線 token 可保有效的時間長度。
- **撤銷** — 合作夥伴可從 CMS 撤銷存取權；PWA 下次上線時就被封鎖。
- **可轉讓？** — 切換是否允許轉贈給另一個 LINE 帳號（預設關閉）。

## 與 `.zip` 包的關係
`.zip` 原始素材包（PDF + 圖片 + MP3 + `meta.json`）仍然產出，作為**次要輸出**：
- 給需要再分發或**列印**實體本的合作夥伴用。
- 給想要永久未綁定典藏檔的家長（通常只在高階方案／Premium SKU 提供）。
- zip **沒有存取控制** — 下載後就流出去了。重視綁定的合作夥伴只用 PWA。

## M1 範圍
- 每本書產生 PWA（含 manifest + service worker + 快取資源）。
- 以封存 token 做 LINE 帳號綁定。
- 預設 90 天 TTL。
- 合作夥伴 CMS：白名單、撤銷、TTL 覆寫。
- 支援 iOS Safari（加入主畫面）與 Android Chrome（安裝）。

## M2 後續
- 多裝置閱讀進度同步（有網路時）。
- 背景資源刷新，當出版新版次時。
- 更豐富的遙測資料給合作夥伴（小孩重播最多的頁是哪幾頁）。
