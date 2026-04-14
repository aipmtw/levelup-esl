const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaXBkZXBibHRmYmZ4bmpqZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUxMjgsImV4cCI6MjA4OTEzMTEyOH0.yEoDps8Fni0x5CKOCsL5zdj0n4if32fr0UGXcdsEfSo';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = req.query.slug;
  if (!slug) {
    return res.status(400).json({ error: 'slug is required' });
  }

  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/mvps?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
      {
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${ANON_KEY}`,
        },
      }
    );

    if (!r.ok) {
      console.error('Supabase fetch error:', await r.text());
      return res.status(502).json({ error: '資料庫錯誤' });
    }

    const rows = await r.json();
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: '找不到此 MVP' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get MVP error:', err);
    res.status(500).json({ error: '內部錯誤' });
  }
};
