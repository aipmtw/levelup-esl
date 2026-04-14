const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const ADMIN_PASS = process.env.ADMIN_PASS || 'aipm2026';
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  const pass = req.headers['x-admin-pass'] || req.body?.pass;
  if (pass !== ADMIN_PASS) return res.status(401).json({ error: 'unauthorized' });
  if (!SERVICE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not set' });

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    // If the RPC function doesn't exist, fall back to pg_query via management API
    if (!r.ok) {
      // Try the Supabase SQL endpoint (available on hosted projects)
      const r2 = await fetch(`${SUPABASE_URL}/pg`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!r2.ok) {
        const err = await r2.text();
        return res.status(502).json({ error: 'SQL execution failed', detail: err });
      }
      const data = await r2.json();
      return res.json({ ok: true, result: data });
    }

    const data = await r.json();
    res.json({ ok: true, result: data });
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ error: err.message });
  }
};
