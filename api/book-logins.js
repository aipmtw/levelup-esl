const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

module.exports = async (req, res) => {
  const ADMIN_PASS = process.env.ADMIN_PASS || 'aipm2026';
  const pass = req.query.pass || req.headers['x-admin-pass'];
  if (pass !== ADMIN_PASS) return res.status(401).json({ error: 'unauthorized' });
  if (!SUPABASE_SERVICE_KEY) return res.status(500).json({ error: 'Service key not set' });

  const slug = req.query.slug || '';
  const days = parseInt(req.query.days) || 30;
  const since = new Date(Date.now() - days * 86400000).toISOString();

  let url = `${SUPABASE_URL}/rest/v1/book_logins?created_at=gte.${since}&order=created_at.desc&limit=500`;
  if (slug) url += `&book_slug=eq.${encodeURIComponent(slug)}`;

  const r = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });

  if (!r.ok) return res.status(502).json({ error: await r.text() });
  const logins = await r.json();

  // Aggregate
  const users = {};
  logins.forEach(l => {
    const key = l.line_user_id;
    if (!users[key]) {
      users[key] = {
        line_user_id: l.line_user_id,
        display_name: l.display_name,
        picture_url: l.picture_url,
        logins: 0,
        books: new Set(),
        ips: new Set(),
        devices: new Set(),
        first: l.created_at,
        last: l.created_at,
      };
    }
    users[key].logins++;
    users[key].books.add(l.book_slug);
    if (l.ip) users[key].ips.add(l.ip);
    users[key].devices.add(parseDevice(l.user_agent));
    if (l.created_at < users[key].first) users[key].first = l.created_at;
    if (l.created_at > users[key].last) users[key].last = l.created_at;
  });

  const userList = Object.values(users).map(u => ({
    ...u,
    books: [...u.books],
    ips: [...u.ips],
    devices: [...u.devices],
  })).sort((a, b) => b.last.localeCompare(a.last));

  res.json({
    total_logins: logins.length,
    unique_users: userList.length,
    period: `Last ${days} days`,
    users: userList,
    recent: logins.slice(0, 30),
  });
};

function parseDevice(ua) {
  if (!ua) return 'Unknown';
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android/i.test(ua)) return 'Android';
  if (/Mac/i.test(ua)) return 'Mac';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}
