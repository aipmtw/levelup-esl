module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaXBkZXBibHRmYmZ4bmpqZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUxMjgsImV4cCI6MjA4OTEzMTEyOH0.yEoDps8Fni0x5CKOCsL5zdj0n4if32fr0UGXcdsEfSo';

  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  const userAgent = req.headers['user-agent'] || '';
  const body = req.body || {};

  const row = {
    session_id: body.session_id || null,
    ip,
    user_agent: userAgent,
    event_type: body.event_type,
    level_id: body.level_id || null,
    topic_id: body.topic_id || null,
    audio_lang: body.audio_lang || null,
    audio_voice: body.audio_voice || null,
    audio_completed: body.audio_completed || false,
    self_assess: body.self_assess || null,
    extra: body.extra || null,
  };

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/esl_events`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      const err = await r.text();
      console.error('Supabase insert error:', err);
      return res.status(502).json({ error: 'tracking failed' });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('Track error:', e);
    res.status(500).json({ error: 'server error' });
  }
};
