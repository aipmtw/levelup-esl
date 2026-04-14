# 離線包規格

兒童繪本以兩種方式交付：

1. **主要：每本獨立 PWA** — LINE 帳號綁定、可離線。詳見 [`../tech/pwa-offline-zh.md`](../tech/pwa-offline-zh.md)。
2. **次要：`.zip` 原始素材包** — 下方描述。無存取控制；可再分發；用於列印與夥伴再分享。

兩者都在生成時同時產出。合作夥伴在 CMS 中切換每本書要提供哪一種。

## `.zip` 結構

```
{book-id}.zip
├── book.pdf                  # 可直接列印的規範視覺檔
├── pages/
│   ├── page-01.jpg
│   ├── page-02.jpg
│   └── ...                   # 每頁插畫原始檔，可再利用／列印
├── audio/
│   ├── zh-TW/
│   │   ├── page-01.mp3       # 繁體中文朗讀，每頁一檔
│   │   └── ...
│   ├── en/
│   │   ├── page-01.mp3
│   │   └── ...
│   └── ja-JP/                # 只有在繪本包含日文時才有
│       ├── page-01.mp3
│       └── ...
└── meta.json                 # schema 見下
```

## `meta.json` schema

```json
{
  "book_id": "string (uuid)",
  "pwa_url": "https://app.markluce.ai/{slug}/book/{book-id}",
  "pwa_name": "string — 本書獨特的 PWA 顯示名稱",
  "title": {
    "zh-TW": "string（繁體中文）",
    "en": "string | null",
    "ja-JP": "string | null"
  },
  "child_name": "string",
  "age_tier": "0-3 | 4-6 | 7-9 | 10-12",
  "languages": ["zh-TW", "en", "ja-JP"],
  "zh_locale": "zh-Hant",
  "partner_slug": "string",
  "created_at": "ISO-8601 timestamp",
  "page_count": "number",
  "art_style": "string",
  "voices": {
    "zh-TW": "zh-TW-HsiaoChenNeural",
    "en": "en-US-AvaNeural",
    "ja-JP": "ja-JP-NanamiNeural"
  },
  "platform_version": "markluce.ai/{semver}"
}
```

**注意 `zh_locale: "zh-Hant"`** — 明確標示為繁體中文。使用此包的消費端可以驗證這個欄位。

## `.zip` 的使用情境
- **隨選列印：** 合作夥伴把 `book.pdf` 送到印刷店印成實體紀念本。
- **合作夥伴再分發：** 透過 LINE 群、email、雲端硬碟再分享 — 不會打到 Mark 的伺服器。
- **典藏：** 家長即使 PWA token 過期或被撤銷，仍可保有永久副本。

## 什麼時候提供哪一種
- **0–3 / 4–6 分級預設：** 只給 PWA（嚴格綁定、飛航模式播放符合幼兒使用情境）。
- **7–9 / 10–12 分級預設：** PWA 主 + zip 選購（大孩子也適合紙本版）。
- **Arita 老師通路：** PWA + zip（家長常希望搭配教材有紙本紀念）。
- **任何分級的 Premium SKU：** PWA + zip，全部解鎖。
