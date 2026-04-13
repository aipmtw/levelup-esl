const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaXBkZXBibHRmYmZ4bmpqZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUxMjgsImV4cCI6MjA4OTEzMTEyOH0.yEoDps8Fni0x5CKOCsL5zdj0n4if32fr0UGXcdsEfSo';

module.exports = async (req, res) => {
  const headers = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };
  const slug = req.query.slug;

  if (slug) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/features?slug=eq.${slug}&limit=1`, { headers });
    const d = await r.json();
    return res.json(d[0] || null);
  }

  const r = await fetch(`${SUPABASE_URL}/rest/v1/features?select=id,slug,title,date,tags&order=date.desc&limit=50`, { headers });
  const d = await r.json();
  res.json(d);
};
