const crypto = require('crypto');
const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const LINE_BOT_CHANNEL_SECRET = process.env.LINE_BOT_CHANNEL_SECRET;
const LINE_BOT_CHANNEL_ACCESS_TOKEN = process.env.LINE_BOT_CHANNEL_ACCESS_TOKEN;

function verifySignature(body, signature) {
  if (!LINE_BOT_CHANNEL_SECRET || !signature) return false;
  const hash = crypto.createHmac('sha256', LINE_BOT_CHANNEL_SECRET)
    .update(Buffer.from(JSON.stringify(body)))
    .digest('base64');
  return hash === signature;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!SUPABASE_SERVICE_KEY) return res.status(500).json({ error: 'Service key not set' });

  // Verify LINE signature
  const signature = req.headers['x-line-signature'];
  if (!verifySignature(req.body, signature)) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  const events = req.body.events || [];

  for (const event of events) {
    if (event.type !== 'message' || event.message.type !== 'text') continue;

    const lineUserId = event.source.userId;
    const messageText = event.message.text;
    const replyToken = event.replyToken;

    // Get display name
    let displayName = '';
    if (LINE_BOT_CHANNEL_ACCESS_TOKEN && lineUserId) {
      try {
        const pr = await fetch(`https://api.line.me/v2/bot/profile/${lineUserId}`, {
          headers: { 'Authorization': `Bearer ${LINE_BOT_CHANNEL_ACCESS_TOKEN}` },
        });
        if (pr.ok) {
          const profile = await pr.json();
          displayName = profile.displayName || '';
        }
      } catch (e) {
        console.error('Profile fetch error:', e);
      }
    }

    // Store message in Supabase
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/line_bot_messages`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          line_user_id: lineUserId,
          display_name: displayName,
          message_text: messageText,
          reply_token: replyToken,
          raw_event: event,
          status: 'received',
        }),
      });
    } catch (e) {
      console.error('Message save error:', e);
    }

    // Auto-reply with a simple acknowledgment
    if (LINE_BOT_CHANNEL_ACCESS_TOKEN && replyToken) {
      try {
        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_BOT_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            replyToken,
            messages: [{ type: 'text', text: '感謝您的訊息！我們會盡快回覆。\nThank you! We\'ll get back to you soon.' }],
          }),
        });
      } catch (e) {
        console.error('Reply error:', e);
      }
    }
  }

  // LINE expects 200 OK
  res.status(200).json({ ok: true });
};
