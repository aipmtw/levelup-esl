const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, project_name, description, target_audience, problem, source_url } = req.body;

  if (!user_id || !project_name || !description) {
    return res.status(400).json({ error: '請填寫必填欄位' });
  }

  if (!SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Service key not configured' });
  }

  // Check if user already has an MVP
  try {
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/mvps?user_id=eq.${encodeURIComponent(user_id)}&select=slug,status&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    const existing = await checkRes.json();
    if (existing && existing.length > 0) {
      return res.status(409).json({
        error: '你已經提交過一份 MVP 請求',
        existing_slug: existing[0].slug,
        status: existing[0].status,
      });
    }
  } catch (err) {
    console.error('Check error:', err);
    return res.status(500).json({ error: '資料庫錯誤' });
  }

  // Generate slug
  const projectSlug = slugify(project_name);
  const slug = user_id + '-' + projectSlug;

  // Save request to Supabase (status: pending, no AI call)
  try {
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
        source_url: source_url || null,
        input: { description, target_audience, problem },
        output: {},
        status: 'pending',
      }),
    });

    if (!insertRes.ok) {
      const insertErr = await insertRes.text();
      console.error('Supabase insert error:', insertErr);
      return res.status(500).json({ error: '儲存失敗' });
    }

    res.json({ ok: true, slug, status: 'pending' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: '內部錯誤' });
  }
};
