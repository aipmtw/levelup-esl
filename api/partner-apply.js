const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaXBkZXBibHRmYmZ4bmpqZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUxMjgsImV4cCI6MjA4OTEzMTEyOH0.yEoDps8Fni0x5CKOCsL5zdj0n4if32fr0UGXcdsEfSo';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { name, school, target_age, line_id, teaching_approach, email } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'partner-' + Date.now();

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/partners`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        slug,
        name,
        school: school || '',
        target_age: target_age || '',
        line_id: line_id || '',
        teaching_approach: teaching_approach || '',
        email: email || '',
        status: 'pending',
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Partner apply error:', err);
      return res.status(502).json({ error: 'Save failed' });
    }

    res.json({ ok: true, slug });
  } catch (err) {
    console.error('Partner apply error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
