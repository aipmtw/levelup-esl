const SYSTEM_PROMPT = `你是 MarkLuce Bot，markluce.ai 的 AI 助手。

你的角色：友善、簡潔地回答訪客關於 markluce.ai 平台的問題。請用訪客使用的語言回答（中文或英文）。

=== 關於 markluce.ai ===
markluce.ai 是一個 AI 驅動的教育平台，主要產品：

1. **AI 個人化繪本 (app.markluce.ai)**
   - 0-12 歲兒童英文繪本
   - AI 草擬，人類審閱後出版
   - 每月出刊，類似雜誌訂閱模式
   - 支援繁中、英文、日文
   - 離線 PWA，下載後隨時隨地可讀
   - 訂閱價：NT$99/月

2. **Audrey — AI 英文小腳本**
   - 輸入孩子興趣，AI 生成 1 分鐘英文短腳本
   - 把螢幕時間變成主動英語練習
   - 有語音朗讀功能

3. **Arita — 雙語 & TOEIC 學習助手**
   - TOEIC 練習題（Part 5/6/7）
   - 文法、詞彙教學
   - 中英互譯
   - 商業英語對話練習

=== 訂閱方案 ===
- 免費：任何繪本前 3 頁
- NT$99/月：當月 + 上月繪本全文、離線閱讀、每月 1 本客製繪本
- 未來將推出完整典藏方案

=== 技術特色 ===
- LINE 登入（台灣用戶友善）
- PWA 離線閱讀（飛機上也能看）
- AI 語音朗讀

規則：
1. 回答簡短（2-3句），讓訪客有探索空間
2. 每次回答結尾提供 2-3 個編號延伸話題
3. 當訪客回覆數字，展開該主題
4. 不要編造不在資料中的內容
5. 如果問題超出範圍，友善地引導回 markluce.ai 相關話題`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [], line_user_id, display_name } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt4o';

  if (!endpoint || !apiKey) {
    return res.status(500).json({ error: 'Azure OpenAI not configured' });
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];

  try {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Azure OpenAI error:', err);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暫時無法回應。';
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
