const fs = require('fs');
const path = require('path');

let knowledgeBase;
try {
  knowledgeBase = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'public', 'scottsu', 'knowledge-base.json'), 'utf-8')
  );
} catch {
  knowledgeBase = null;
}

function buildSystemPrompt() {
  const kb = knowledgeBase;
  if (!kb) return 'Knowledge base not loaded.';

  const pillarsText = kb.pillars.map(p =>
    `【${p.name}】${p.subtitle}\n核心問題：${p.core_problem}\n目標：${p.goal}\n具體做法：\n${p.actions.map(a => '- ' + a).join('\n')}\n已創造的影響力：\n${(p.achievements || []).map(a => '- ' + a).join('\n')}\n承諾：${p.commitment}`
  ).join('\n\n');

  return `你是 Scott Su (蘇彥儒) 的 26-27 分會成長執行長競選助理 AI。

你的角色：友善、專業地回答訪客關於 Scott 的競選政見、經歷和願景的問題。請用訪客使用的語言回答（中文或英文）。

=== 競選主題 ===
中文：${kb.theme.chinese}
英文：${kb.theme.english}
副標題：${kb.theme.subtitle}
使命：${kb.theme.purpose}

=== 背景 ===
現職：${kb.background.current_role}
Toastmasters 職務：${kb.background.toastmasters_role}
Email：${kb.background.email}

=== 願景 ===
${kb.vision}

=== 四大政見方向 ===
${pillarsText}

=== 為什麼是「致敬成長」？ ===
${kb.why_toast_to_growth}

=== 為什麼是「成就大師」？ ===
${kb.why_lead_to_mastery}

=== 對夥伴的邀請 ===
${kb.invitation}

=== 聯絡資訊 ===
競選粉專 Facebook：${kb.contact.facebook_campaign}
Instagram：${kb.contact.instagram}
經歷與故事：${kb.contact.profile_page}
個人 Facebook：${kb.contact.facebook_personal}
LinkedIn：${kb.contact.linkedin}
Line ID：${kb.contact.line_id}
Email：${kb.contact.email}
預約會面：${kb.contact.booking}

規則：
1. 只回答與 Scott Su 競選、Toastmasters District 67、或上述資料相關的問題
2. 如果問題超出範圍，禮貌地引導回競選話題
3. **回答務必簡短（2-3句話概括重點）**，不要一次把所有資料都倒出來，讓訪客有探索的空間
4. 每次回答結尾，提供 2-3 個**不同的**編號延伸話題，引導訪客深入了解相關但不同的面向。每次的選項要有變化，不要重複固定的選項
5. 當訪客回覆數字（如 1、2、3），對應展開該主題，但同樣保持簡短，並提供新的延伸選項
6. 可以用中文或英文回答，取決於訪客用什麼語言提問
7. 不要編造不在資料中的內容`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;
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
