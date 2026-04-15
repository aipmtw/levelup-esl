const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaXBkZXBibHRmYmZ4bmpqZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUxMjgsImV4cCI6MjA4OTEzMTEyOH0.yEoDps8Fni0x5CKOCsL5zdj0n4if32fr0UGXcdsEfSo';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pass');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const headers = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' };

  // GET — read config (public)
  if (req.method === 'GET') {
    const key = req.query.key;
    const url = key
      ? `${SUPABASE_URL}/rest/v1/site_config?key=eq.${encodeURIComponent(key)}&limit=1`
      : `${SUPABASE_URL}/rest/v1/site_config?order=key`;
    const r = await fetch(url, { headers });
    const data = await r.json();
    if (key) return res.json({ ok: true, value: data[0]?.value || null });
    return res.json({ ok: true, config: data });
  }

  // POST — update config (admin only)
  if (req.method === 'POST') {
    const pass = req.headers['x-admin-pass'] || req.body?.pass;
    if (pass !== (process.env.ADMIN_PASS || 'aipm2026')) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const { key, value } = req.body;
    if (!key || !value) return res.status(400).json({ error: 'key and value required' });

    const r = await fetch(`${SUPABASE_URL}/rest/v1/site_config?key=eq.${encodeURIComponent(key)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ value, updated_at: new Date().toISOString() }),
    });
    const data = await r.json();
    return res.json({ ok: true, data });
  }

  res.status(405).json({ error: 'GET or POST' });
};
