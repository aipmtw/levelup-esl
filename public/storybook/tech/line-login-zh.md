# LINE Login

## 建置
- **LINE Login v2.1**（OIDC）。
- 共用 channel 在 **markluce** provider 下。
- 單一 LINE channel 處理所有合作夥伴 slug — 歸因透過 `state` 參數而非獨立 channel。

## 合作夥伴歸因
- 使用者在 `app.markluce.ai/{slug}` 點擊登入時，重導 URL 帶入 `state={slug}`（或含 `{slug}` 的簽章 token）。
- 回呼時解出 slug，寫到使用者紀錄作為**首次接觸合作夥伴**。
- 首次接觸具黏性 — 之後使用者造訪其他合作夥伴頁也不會被覆寫。
- 後續所有生成與計費事件都標記此合作夥伴，用於分析與計費。

## Scopes
- `profile` — 顯示名稱 + 頭像。
- `openid` — 穩定的使用者 ID。
- `email` 選用（LINE Login 只在預先驗證時才回 email）。

## Sessions
- OIDC callback 後使用標準伺服器端 session。
- Token 刷新依 LINE 規格處理。

## 合作夥伴／管理角色
- 終端使用者 = 預設。
- 合作夥伴 = 解鎖自己 slug 的 `/admin`（onboarding 時由 Mark 手動設定）。
- 管理者（Mark） = 全域。

## PWA 白名單整合
- 每本書的白名單記錄 LINE user ID（從 OIDC `sub`）。
- PWA 安裝時後端驗證：這位 LINE user ID 是否在本書的白名單上？
- 詳見 [`pwa-offline-zh.md`](pwa-offline-zh.md)。
