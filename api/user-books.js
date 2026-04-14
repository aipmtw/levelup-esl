const crypto = require('crypto');
const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const COOKIE_SECRET = process.env.LINE_COOKIE_SECRET || 'markluce-line-2026';

function verifyToken(token) {
  if (!token) return null;
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;
  const data = Buffer.from(b64, 'base64').toString();
  const expected = crypto.createHmac('sha256', COOKIE_SECRET).update(data).digest('hex');
  if (sig !== expected) return null;
  const payload = JSON.parse(data);
  if (payload.exp && payload.exp < Date.now()) return null;
  return payload;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  if (!SUPABASE_SERVICE_KEY) return res.status(500).json({ error: 'Service key not set' });

  // Auth: check ml_auth cookie or Authorization header
  let token = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/ml_auth=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Login required' });

  try {
    const url = `${SUPABASE_URL}/rest/v1/user_books?line_user_id=eq.${encodeURIComponent(user.userId)}&select=book_id,granted_at,source,books(slug,title_zh,title_en,cover_url,page_count,is_demo)`;

    const r = await fetch(url, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!r.ok) {
      console.error('User books error:', await r.text());
      return res.status(502).json({ error: 'Fetch failed' });
    }

    const userBooks = await r.json();
    res.json({ ok: true, user: { userId: user.userId, displayName: user.displayName }, books: userBooks });
  } catch (err) {
    console.error('User books error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
