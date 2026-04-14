const crypto = require('crypto');
const PLATFORM_SECRET = process.env.PLATFORM_SECRET || process.env.LINE_COOKIE_SECRET || 'markluce-line-2026';
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

  const { book_id } = req.query;
  if (!book_id) return res.status(400).json({ error: 'book_id required' });

  // Auth
  let token = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/ml_auth=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Login required' });

  // Derive AES-GCM key via HMAC(PLATFORM_SECRET, userId:bookId)
  const keyMaterial = crypto.createHmac('sha256', PLATFORM_SECRET)
    .update(`${user.userId}:${book_id}`)
    .digest('base64');

  res.json({ ok: true, key: keyMaterial });
};
