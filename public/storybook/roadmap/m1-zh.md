# M1 — 第一個里程碑

## 目標
以真實產品方式出貨兒童繪本引擎，鎖定 0–12 歲。建立合作夥伴公開頁 + 私人工作區雙介面。讓 Audrey（職場家長通路）與 Arita（兒童老師通路）成為首批付費合作夥伴。

## 交付項目

1. **多頁插畫故事書引擎**（只做兒童繪本，兩位夥伴共用）
   - 每本 10–20 頁，年齡分級 0–3 / 4–6 / 7–9 / 10–12。
   - 以 gpt-image-1 + style-lock + 參考圖確保主角一致。
   - 文字在插畫外渲染。

2. **語言組合（嚴格執行繁體中文）**
   - **繁體中文（zh-TW / zh-Hant）** — 基礎，恆常。LLM prompt、TTS 語音、生成文字都必須是繁體。任何地方不得出現簡體。
   - **英文** — 必備加購。
   - **日文** — 選購加購。

3. **示範繪本生成**
   - 英文短篇示範（必備）。
   - 日文短篇示範（必備）。
   - 兩者都一定包含繁體中文。

4. **PWA 交付（主要）** — 依 [`../tech/pwa-offline-zh.md`](../tech/pwa-offline-zh.md)
   - 每本書獨特的 PWA 名稱 + manifest + service worker。
   - 以封存 token 綁定 LINE 帳號。
   - 預設 90 天離線 TTL。
   - 合作夥伴控制：白名單、撤銷、TTL 覆寫。
   - 支援 iOS Safari + Android Chrome 安裝。

5. **`.zip` 素材包匯出（次要）** — 依 [`../product/offline-bundle-spec-zh.md`](../product/offline-bundle-spec-zh.md)
   - `book.pdf` + `pages/page-NN.jpg` + `audio/{lang}/page-NN.mp3` + `meta.json`（含 `zh_locale: "zh-Hant"`）。

6. **合作夥伴公開頁** `app.markluce.ai/{slug}` — 依 [`../partners/partner-page-spec-zh.md`](../partners/partner-page-spec-zh.md)
   - CMS：主標題、目標市場描述、廣告文案、品牌色、示範作品、CTA、LINE 群連結、定價說明。
   - 多語（繁中／英／日）。

7. **合作夥伴私人工作區** `app.markluce.ai/{slug}/admin`
   - 客戶清單（每位夥伴自己持有，嚴格隔離）。
   - 每位孩子的備註（Arita 通路的家長諮詢）。
   - 繪本庫存 + PWA 白名單 + 撤銷。
   - 私人分析。
   - 家長諮詢問卷（Arita 用）。

8. **合作夥伴歸因**
   - LINE Login 重導帶 `state={slug}`。
   - 首次接觸為準；所有生成與計費事件都加上此標籤。

9. **收費結構上線**
   - 每次生成基礎設施費 + 分級（Starter / Growth / Pro）。
   - 手動月結。Mark 有一個使用量儀表板。
   - 自助計費延後到 M2。

10. **Arita 成人舊介面** — 維持現狀，M1 不動。

## M1 不做（→ M2）
- EPUB3 匯出。
- 自助計費 + 自動計量。
- Flux + 每角色 LoRA。
- Arita 成人課程系列／進度追蹤。
- 客製網域／白牌合作夥伴頁面。
- 多裝置 PWA 同步。
