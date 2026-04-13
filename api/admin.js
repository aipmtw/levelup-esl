module.exports = async (req, res) => {
  const ADMIN_PASS = process.env.ADMIN_PASS || 'aipm2026';
  const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  const pass = req.query.pass || req.headers['x-admin-pass'];
  if (pass !== ADMIN_PASS) return res.status(401).json({ error: 'unauthorized' });

  if (!SERVICE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not set' });

  const days = parseInt(req.query.days) || 7;
  const since = new Date(Date.now() - days * 86400000).toISOString();

  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/esl_events?created_at=gte.${since}&order=created_at.desc&limit=1000`,
      {
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
        },
      }
    );
    if (!r.ok) {
      const err = await r.text();
      return res.status(502).json({ error: err });
    }
    const events = await r.json();

    // Aggregate stats
    const visitors = {};
    const levelViews = {};
    const audioPlays = {};
    const audioCompletes = {};
    const assessments = {};

    events.forEach(e => {
      const vid = (e.ip || 'unknown') + '|' + (e.user_agent || '').substring(0, 80);
      if (!visitors[vid]) visitors[vid] = { ip: e.ip, ua: e.user_agent, events: 0, levels: new Set(), first: e.created_at };
      visitors[vid].events++;
      if (e.level_id) visitors[vid].levels.add(e.level_id);

      if (e.event_type === 'view' && e.level_id) levelViews[e.level_id] = (levelViews[e.level_id] || 0) + 1;
      if (e.event_type === 'audio_play' && e.level_id) audioPlays[e.level_id] = (audioPlays[e.level_id] || 0) + 1;
      if (e.event_type === 'audio_complete' && e.level_id) audioCompletes[e.level_id] = (audioCompletes[e.level_id] || 0) + 1;
      if (e.event_type === 'assess' && e.level_id) {
        if (!assessments[e.level_id]) assessments[e.level_id] = { easy: 0, ok: 0, hard: 0 };
        if (e.self_assess) assessments[e.level_id][e.self_assess] = (assessments[e.level_id][e.self_assess] || 0) + 1;
      }
    });

    const visitorList = Object.values(visitors).map(v => ({
      ip: v.ip,
      device: parseDevice(v.ua),
      events: v.events,
      levels: [...v.levels],
      first_seen: v.first,
    }));

    res.json({
      period: `Last ${days} days`,
      total_events: events.length,
      unique_visitors: visitorList.length,
      level_views: levelViews,
      audio_plays: audioPlays,
      audio_completes: audioCompletes,
      assessments,
      visitors: visitorList.slice(0, 50),
      raw_recent: events.slice(0, 20),
    });
  } catch (e) {
    console.error('Admin error:', e);
    res.status(500).json({ error: 'server error' });
  }
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
