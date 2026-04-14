const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

const SYSTEM_PROMPT = `你是一位資深的產品經理與技術顧問。使用者會給你一個產品構想，你需要生成一份完整的 MVP（最小可行產品）規劃書。

請用繁體中文回答，並嚴格按照以下 JSON 格式回傳（不要加任何 markdown 標記或多餘文字）：

{
  "summary": "產品的總結描述（2-3 句話，比使用者的描述更完整清楚）",
  "target_users": "目標用戶的詳細描述（包含人口特徵、行為特徵、痛點）",
  "core_features": ["功能1：簡短描述", "功能2：簡短描述", ...],
  "user_stories": [
    {"role": "角色", "action": "想做的事", "benefit": "帶來的好處"},
    ...
  ],
  "tech_stack": {
    "frontend": "推薦的前端技術",
    "backend": "推薦的後端技術",
    "database": "推薦的資料庫",
    "deployment": "推薦的部署方案"
  },
  "landing_page": {
    "headline": "吸引人的標題",
    "subheadline": "副標題說明",
    "cta": "行動呼籲按鈕文字"
  },
  "timeline": [
    {"phase": "階段名稱", "duration": "預估時間", "tasks": ["任務1", "任務2"]},
    ...
  ],
  "competitive_landscape": [
    {"name": "競品名稱", "comparison": "與本產品的比較分析"},
    ...
  ]
}

規則：
1. core_features 列出 5-8 個最關鍵的 MVP 功能，不要過多
2. user_stories 列出 4-6 個最重要的用戶故事
3. tech_stack 要根據專案特性推薦合適的技術，考慮開發速度和可擴展性
4. timeline 分 3-4 個階段，總時間控制在 4-8 週
5. competitive_landscape 列出 3-5 個相關競品或替代方案
6. 所有內容使用繁體中文
7. 只回傳 JSON，不要任何其他文字`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, project_name, description, target_audience, problem } = req.body;

  if (!user_id || !project_name || !description) {
    return res.status(400).json({ error: '請填寫必填欄位' });
  }

  // Check if user already has an MVP
  try {
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/mvps?user_id=eq.${encodeURIComponent(user_id)}&select=slug&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    if (!checkRes.ok) {
      console.error('Supabase check error:', await checkRes.text());
      return res.status(500).json({ error: '資料庫錯誤' });
    }
    const existing = await checkRes.json();
    if (existing && existing.length > 0) {
      return res.status(409).json({
        error: '你已經建立過一份 MVP',
        existing_slug: existing[0].slug,
      });
    }
  } catch (err) {
    console.error('Check error:', err);
    return res.status(500).json({ error: '資料庫錯誤' });
  }

  // Generate slug
  const projectSlug = slugify(project_name);
  const slug = user_id + '-' + projectSlug;

  // Call Azure OpenAI
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt4o';

  if (!endpoint || !apiKey) {
    return res.status(500).json({ error: 'Azure OpenAI not configured' });
  }

  const userMessage = `專案名稱：${project_name}
一句話描述：${description}
目標用戶：${target_audience || '未指定'}
要解決的核心問題：${problem || '未指定'}`;

  try {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;
    const aiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.text();
      console.error('Azure OpenAI error:', err);
      return res.status(502).json({ error: 'AI 服務錯誤' });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '';

    // Parse JSON from response (strip markdown code fences if present)
    let output;
    try {
      const cleaned = rawContent.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
      output = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, 'Raw:', rawContent);
      return res.status(502).json({ error: 'AI 回應格式錯誤，請重試' });
    }

    // Save to Supabase
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/mvps`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        user_id,
        slug,
        project_name,
        input: { description, target_audience, problem },
        output,
      }),
    });

    if (!insertRes.ok) {
      const insertErr = await insertRes.text();
      console.error('Supabase insert error:', insertErr);
      return res.status(500).json({ error: '儲存失敗' });
    }

    res.json({ ok: true, slug });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: '內部錯誤' });
  }
};
