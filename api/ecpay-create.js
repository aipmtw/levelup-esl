const crypto = require('crypto');

// ECPay credentials (staging defaults, override with env vars for production)
const MERCHANT_ID = process.env.ECPAY_MERCHANT_ID || '3002607';
const HASH_KEY = process.env.ECPAY_HASH_KEY || 'pwFHCqoQZGmho4w6';
const HASH_IV = process.env.ECPAY_HASH_IV || 'EkRm7iFT261dpevs';
const ECPAY_URL = process.env.ECPAY_URL || 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const COOKIE_SECRET = process.env.LINE_COOKIE_SECRET || 'markluce-line-2026';

// ---- Auth helper ----
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

// ---- ECPay CheckMacValue ----
function genCheckMacValue(params) {
  const copy = { ...params };
  delete copy.CheckMacValue;

  const sorted = Object.keys(copy)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const qs = sorted.map(k => `${k}=${copy[k]}`).join('&');
  const raw = `HashKey=${HASH_KEY}&${qs}&HashIV=${HASH_IV}`;

  let encoded = encodeURIComponent(raw).toLowerCase();

  // .NET URL encode compatibility
  encoded = encoded
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')');

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();
}

// ---- Pricing ----
const PRICING = {
  single: { amount: 99, desc: 'AI繪本單本購買' },
  bundle3: { amount: 249, desc: 'AI繪本三本組合包' },
  subscription: { amount: 249, desc: 'AI繪本月訂閱無限閱讀' },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Auth
  let token = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/ml_auth=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const { product_type, book_slugs } = req.body;
  // product_type: 'single', 'bundle3', 'subscription'
  // book_slugs: array of slugs for single/bundle

  const pricing = PRICING[product_type];
  if (!pricing) return res.status(400).json({ error: 'Invalid product_type. Use: single, bundle3, subscription' });

  if (product_type === 'single' && (!book_slugs || !book_slugs.length)) {
    return res.status(400).json({ error: 'book_slugs required for single purchase' });
  }
  if (product_type === 'bundle3' && (!book_slugs || book_slugs.length !== 3)) {
    return res.status(400).json({ error: 'Exactly 3 book_slugs required for bundle' });
  }

  // Generate unique trade number (max 20 chars)
  const tradeNo = 'ML' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

  // Format date: yyyy/MM/dd HH:mm:ss (Taiwan time, GMT+8)
  const now = new Date(Date.now() + 8 * 3600000);
  const tradeDate = now.toISOString().replace('T', ' ').replace(/-/g, '/').substring(0, 19);

  // Item name
  let itemName = pricing.desc;
  if (book_slugs?.length) {
    itemName = book_slugs.map(s => `繪本:${s}`).join('#');
  }

  // Store pending purchase in Supabase
  if (SUPABASE_SERVICE_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/purchases`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          trade_no: tradeNo,
          line_user_id: user.userId,
          product_type,
          book_slugs: book_slugs || [],
          amount: pricing.amount,
          status: 'pending',
        }),
      });
    } catch (e) { console.error('Purchase record error:', e); }
  }

  // Build ECPay form params
  const baseUrl = process.env.BASE_URL || 'https://markluce.ai';
  const params = {
    MerchantID: MERCHANT_ID,
    MerchantTradeNo: tradeNo,
    MerchantTradeDate: tradeDate,
    PaymentType: 'aio',
    TotalAmount: pricing.amount,
    TradeDesc: encodeURIComponent('AI繪本書架購買'),
    ItemName: itemName,
    ReturnURL: `${baseUrl}/api/ecpay-callback`,
    OrderResultURL: `${baseUrl}/app/purchase-result.html`,
    ChoosePayment: 'ALL',
    EncryptType: 1,
    NeedExtraPaidInfo: 'Y',
    CustomField1: user.userId,
    CustomField2: product_type,
    CustomField3: (book_slugs || []).join(','),
  };

  params.CheckMacValue = genCheckMacValue(params);

  // Return an auto-submit HTML form (ECPay requires browser POST)
  const formHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>前往付款...</title></head>
<body>
<form id="ecpay" method="POST" action="${ECPAY_URL}">
${Object.entries(params).map(([k, v]) => `<input type="hidden" name="${k}" value="${v}">`).join('\n')}
</form>
<script>document.getElementById('ecpay').submit();</script>
</body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(formHtml);
};
