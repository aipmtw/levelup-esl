# 技術架構與流程圖
## AI 智能競品分析系統 — CompetitorLens

---

## 1. 系統架構總覽

```mermaid
graph TB
    subgraph DataSources["數據來源"]
        WEB[公開網頁/競品官網]
        APP[App Store 評論]
        SOCIAL[社群媒體<br/>PTT/Dcard/FB]
        ECOM[電商平台<br/>蝦皮/Momo/PChome]
        GOV[政府公開資料]
    end

    subgraph Ingestion["資料擷取層"]
        CRAWLER[LLM 智慧爬蟲<br/>Playwright + 排程]
        API_FETCH[API 資料擷取<br/>RSS/公開 API]
    end

    subgraph Processing["RAG 知識庫 + 處理層"]
        EMBED[文本嵌入<br/>Embedding Model]
        VECTOR[(向量資料庫<br/>Supabase pgvector)]
        CHUNK[文件分塊<br/>Chunking Engine]
        LLM[LLM 分析引擎<br/>Claude API]
    end

    subgraph Output["產出層"]
        DAILY[每日摘要<br/>3-5 則重點]
        WEEKLY[週報<br/>PDF/網頁]
        ALERT[即時警報<br/>價格/新聞]
        DASHBOARD[互動式儀表板]
    end

    subgraph Delivery["推播通道"]
        LINE_BOT[LINE Bot]
        EMAIL[Email]
        WEB_APP[Web App]
    end

    WEB --> CRAWLER
    APP --> API_FETCH
    SOCIAL --> CRAWLER
    ECOM --> CRAWLER
    GOV --> API_FETCH

    CRAWLER --> CHUNK
    API_FETCH --> CHUNK
    CHUNK --> EMBED
    EMBED --> VECTOR
    VECTOR --> LLM

    LLM --> DAILY
    LLM --> WEEKLY
    LLM --> ALERT
    LLM --> DASHBOARD

    DAILY --> LINE_BOT
    DAILY --> EMAIL
    WEEKLY --> WEB_APP
    ALERT --> LINE_BOT
    DASHBOARD --> WEB_APP
```

---

## 2. RAG 知識庫架構

```mermaid
graph LR
    subgraph Ingestion["資料進入"]
        RAW[原始資料<br/>HTML/JSON/Text]
        CLEAN[資料清洗<br/>去噪/標準化]
        CHUNK2[智慧分塊<br/>按語意段落]
    end

    subgraph Storage["儲存"]
        META[(結構化資料庫<br/>Supabase Postgres)]
        VEC[(向量資料庫<br/>pgvector)]
    end

    subgraph Retrieval["檢索與生成"]
        QUERY[用戶查詢/排程觸發]
        SEARCH[語意搜尋<br/>Similarity Search]
        CONTEXT[上下文組裝<br/>Top-K 結果]
        GEN[LLM 生成<br/>Claude API]
        OUTPUT2[結構化產出<br/>摘要/比較表/警報]
    end

    RAW --> CLEAN --> CHUNK2
    CHUNK2 --> META
    CHUNK2 --> VEC

    QUERY --> SEARCH
    VEC --> SEARCH
    SEARCH --> CONTEXT
    META --> CONTEXT
    CONTEXT --> GEN
    GEN --> OUTPUT2
```

---

## 3. 每日摘要生成流程

```mermaid
sequenceDiagram
    participant CRON as 排程器<br/>(每日 06:00)
    participant CRAWLER as 爬蟲引擎
    participant DB as Supabase
    participant LLM as Claude API
    participant LINE as LINE Bot
    participant USER as 用戶

    CRON->>CRAWLER: 觸發每日爬取
    CRAWLER->>CRAWLER: 爬取所有追蹤競品
    CRAWLER->>DB: 儲存原始資料 + 嵌入向量
    CRON->>DB: 查詢昨日 vs 今日差異
    DB->>LLM: 傳送差異資料 + 歷史上下文
    LLM->>LLM: 生成摘要 + 情緒分析
    LLM->>DB: 儲存每日摘要
    DB->>LINE: 推播摘要給訂閱用戶
    LINE->>USER: 收到每日競品快訊
    USER->>LINE: 回覆數字查看詳情
    LINE->>DB: 查詢詳細報告
    DB->>LINE: 回傳完整分析
```

---

## 4. RPA 工作流 — 競品價格監測

```mermaid
graph TD
    START([每 6 小時觸發]) --> CHECK{檢查追蹤清單}
    CHECK --> |有更新目標| SCRAPE[Playwright 爬取商品頁]
    CHECK --> |無更新| END1([結束])

    SCRAPE --> PARSE[解析價格/規格/庫存]
    PARSE --> COMPARE{與上次比較}
    COMPARE --> |價格變動 > 5%| ALERT[觸發即時警報]
    COMPARE --> |規格變更| ALERT
    COMPARE --> |無顯著變化| STORE[儲存快照]

    ALERT --> NOTIFY[推播 LINE + Email]
    ALERT --> STORE
    STORE --> ANALYZE[LLM 分析趨勢]
    ANALYZE --> REPORT[更新儀表板數據]
    REPORT --> END2([結束])
```

---

## 5. 技術選型

| 層級 | 技術 | 選擇原因 |
|------|------|---------|
| **前端** | Next.js / Vercel | 快速部署、SSR 支援 |
| **後端 API** | Vercel Serverless Functions | 免維護、自動擴展 |
| **資料庫** | Supabase (Postgres + pgvector) | 結構化 + 向量搜尋一體化 |
| **LLM** | Claude API (Anthropic) | 最佳中文理解、長上下文 |
| **爬蟲** | Playwright + Node.js | 支援動態頁面、JavaScript 渲染 |
| **排程** | Vercel Cron / GitHub Actions | 免費、可靠 |
| **推播** | LINE Messaging API | 台灣用戶最常用的通訊平台 |
| **嵌入模型** | Voyage AI / OpenAI Embeddings | 高品質中文嵌入 |
| **部署** | Vercel Pro | 統一託管、自動 CI/CD |

---

## 6. 資料流架構

```mermaid
flowchart LR
    A[公開數據源] -->|爬蟲/API| B[資料清洗]
    B -->|結構化| C[(Supabase Postgres)]
    B -->|嵌入| D[(pgvector 向量庫)]
    C -->|差異比對| E[變更偵測]
    D -->|語意搜尋| F[RAG 檢索]
    E --> G[Claude API]
    F --> G
    G -->|生成| H[摘要/報告/警報]
    H -->|推播| I[LINE/Email/Web]
```
