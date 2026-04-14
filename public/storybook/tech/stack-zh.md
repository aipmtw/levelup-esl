# 技術堆疊

共用基礎設施的高階盤點。各組件細節在同目錄下其他文件。

## 授權
- **LINE Login v2.1**（OIDC） — [`line-login-zh.md`](line-login-zh.md)。

## AI／生成
- **LLM 故事撰寫** — 為兒童繪本產出結構化頁清單。嚴格執行繁體中文（Taiwan locale）。
- **圖像生成** — 現階段 gpt-image-1 + style-lock；未來升級路徑是 Flux + 每角色 LoRA。詳見 [`image-gen-zh.md`](image-gen-zh.md)。
- **TTS** — Azure Neural TTS（繁中／英／日）。ElevenLabs v3 作為 premium 加購。詳見 [`tts-azure-zh.md`](tts-azure-zh.md)。

## 渲染／匯出
- **繪本渲染器** — HTML → PDF（EPUB3 留到 M2）。文字在插畫外渲染。
- **PWA 建置** — 每本書獨立 PWA，綁定 LINE 帳號，可離線。詳見 [`pwa-offline-zh.md`](pwa-offline-zh.md)。
- **離線打包** — `.zip` 次要輸出，規格見 [`../product/offline-bundle-spec-zh.md`](../product/offline-bundle-spec-zh.md)。詳見 [`offline-export-zh.md`](offline-export-zh.md)。

## 平台
- **合作夥伴公開頁** `app.markluce.ai/{slug}` — 每位夥伴的文案、風格、示範作品。
- **合作夥伴私人工作區** `app.markluce.ai/{slug}/admin` — 客戶清單、每位孩子的備註、PWA 白名單、繪本庫存、私人分析。嚴格隔離。
- **合作夥伴管理／計費** — 使用量儀表板（M1 手動月結 → M2 自助）。
- **共用模板清單** — 問卷、版型、聲音、插畫風格。夥伴分支使用。

## Mark 不做的
- 終端使用者社群 — 每位合作夥伴經營自己的 **LINE 群組**。Mark 只提供 OA 機器人範本 + 建置指南。
- 終端使用者計費 — 不在範圍內。
