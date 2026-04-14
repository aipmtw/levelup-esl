const LINE_CHANNEL_ID = '2009738746';
const LINE_CHANNEL_SECRET = '030f5af9d09f93db8983cd76b6200df8';
const crypto = require('crypto');

const COOKIE_SECRET = process.env.LINE_COOKIE_SECRET || 'markluce-line-2026';

function signToken(payload) {
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', COOKIE_SECRET).update(data).digest('hex');
  return Buffer.from(data).toString('base64') + '.' + sig;
}

module.exports = async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  // state contains the return URL
  const returnUrl = state || '/';

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://markluce.ai/api/line-auth',
        client_id: LINE_CHANNEL_ID,
        client_secret: LINE_CHANNEL_SECRET,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('LINE token error:', err);
      return res.status(502).json({ error: 'LINE authentication failed' });
    }

    const tokens = await tokenRes.json();

    // Get user profile
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` },
    });

    if (!profileRes.ok) {
      return res.status(502).json({ error: 'Failed to get LINE profile' });
    }

    const profile = await profileRes.json();

    // Create signed token cookie
    const token = signToken({
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || '',
      iat: Date.now(),
      exp: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
    });

    // Set cookie (accessible across markluce.ai and subdomains)
    res.setHeader('Set-Cookie', [
      `ml_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${90 * 24 * 60 * 60}`,
      `ml_user=${encodeURIComponent(profile.displayName)}; Path=/; Secure; SameSite=Lax; Max-Age=${90 * 24 * 60 * 60}`,
    ]);

    // Redirect back to the originating app
    // If returnUrl is a full URL (external app), append token as query param
    if (returnUrl.startsWith('http')) {
      const url = new URL(returnUrl);
      url.searchParams.set('ml_token', token);
      url.searchParams.set('ml_user', profile.displayName);
      return res.redirect(302, url.toString());
    }

    // Internal redirect
    res.redirect(302, returnUrl);
  } catch (err) {
    console.error('LINE auth error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
