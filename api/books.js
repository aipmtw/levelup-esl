const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaXBkZXBibHRmYmZ4bmpqZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUxMjgsImV4cCI6MjA4OTEzMTEyOH0.yEoDps8Fni0x5CKOCsL5zdj0n4if32fr0UGXcdsEfSo';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { age, demo, status } = req.query;
  let url = `${SUPABASE_URL}/rest/v1/books?order=created_at.desc&select=id,slug,title_zh,title_en,age_tier,languages,page_count,cover_url,price_ntd,is_demo,partner_slug,status`;

  if (age) url += `&age_tier=eq.${encodeURIComponent(age)}`;
  if (demo === 'true') url += '&is_demo=eq.true';
  if (status) url += `&status=eq.${encodeURIComponent(status)}`;
  else url += '&status=eq.published';

  try {
    const r = await fetch(url, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      },
    });

    if (!r.ok) {
      console.error('Books fetch error:', await r.text());
      return res.status(502).json({ error: 'Fetch failed' });
    }

    const books = await r.json();
    res.json({ ok: true, books });
  } catch (err) {
    console.error('Books error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
