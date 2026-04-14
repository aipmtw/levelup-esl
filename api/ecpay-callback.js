const crypto = require('crypto');

const MERCHANT_ID = process.env.ECPAY_MERCHANT_ID || '3002607';
const HASH_KEY = process.env.ECPAY_HASH_KEY || 'pwFHCqoQZGmho4w6';
const HASH_IV = process.env.ECPAY_HASH_IV || 'EkRm7iFT261dpevs';

// E-Invoice credentials (separate from payment)
const INV_MERCHANT_ID = process.env.ECPAY_INV_MERCHANT_ID || '2000132';
const INV_HASH_KEY = process.env.ECPAY_INV_HASH_KEY || 'ejCk326UnaZWKisg';
const INV_HASH_IV = process.env.ECPAY_INV_HASH_IV || 'q9jcZX8Ib9LM8wYk';
const INV_URL = process.env.ECPAY_INV_URL || 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Issue';

const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ---- CheckMacValue verification ----
function genCheckMacValue(params) {
  const copy = { ...params };
  delete copy.CheckMacValue;

  const sorted = Object.keys(copy)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const qs = sorted.map(k => `${k}=${copy[k]}`).join('&');
  const raw = `HashKey=${HASH_KEY}&${qs}&HashIV=${HASH_IV}`;

  let encoded = encodeURIComponent(raw).toLowerCase();
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

// ---- E-Invoice AES helpers ----
function invEncrypt(data) {
  const encoded = encodeURIComponent(JSON.stringify(data));
  const cipher = crypto.createCipheriv('aes-128-cbc', INV_HASH_KEY, INV_HASH_IV);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(encoded, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function invDecrypt(encryptedData) {
  const decipher = crypto.createDecipheriv('aes-128-cbc', INV_HASH_KEY, INV_HASH_IV);
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decodeURIComponent(decrypted));
}

// ---- Issue B2C e-invoice ----
async function issueInvoice(tradeNo, amount, itemName, customerEmail) {
  const invoiceData = {
    MerchantID: INV_MERCHANT_ID,
    RelateNumber: tradeNo,
    CustomerEmail: customerEmail || '',
    CustomerPhone: '',
    Print: '0',
    Donation: '0',
    CarrierType: '',
    CarrierNum: '',
    TaxType: '1',
    SalesAmount: amount,
    InvType: '07',
    vat: '1',
    Items: [{
      ItemSeq: 1,
      ItemName: itemName || 'AI繪本',
      ItemCount: 1,
      ItemWord: '本',
      ItemPrice: amount,
      ItemTaxType: '1',
      ItemAmount: amount,
    }],
  };

  const timestamp = Math.floor((Date.now() + 8 * 3600000) / 1000);

  const body = {
    PlatformID: '',
    MerchantID: INV_MERCHANT_ID,
    RqHeader: { Timestamp: timestamp },
    Data: invEncrypt(invoiceData),
  };

  try {
    const r = await fetch(INV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await r.json();
    if (result.TransCode === 1 && result.Data) {
      const decoded = invDecrypt(result.Data);
      console.log('Invoice issued:', decoded);
      return decoded;
    } else {
      console.error('Invoice error:', result);
      return { error: result.TransMsg || 'Invoice issue failed' };
    }
  } catch (e) {
    console.error('Invoice request error:', e);
    return { error: e.message };
  }
}

// ---- Grant book access ----
async function grantBooks(lineUserId, bookSlugs) {
  if (!SUPABASE_SERVICE_KEY || !bookSlugs.length) return;

  // Look up book IDs from slugs
  const slugFilter = bookSlugs.map(s => `slug.eq.${encodeURIComponent(s)}`).join(',');
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/books?or=(${slugFilter})&select=id,slug`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
    });
    const books = await r.json();

    for (const book of books) {
      await fetch(`${SUPABASE_URL}/rest/v1/user_books`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          line_user_id: lineUserId,
          book_id: book.id,
          source: 'purchase',
        }),
      });
    }
  } catch (e) { console.error('Grant books error:', e); }
}

// ---- Grant subscription ----
async function grantSubscription(lineUserId) {
  if (!SUPABASE_SERVICE_KEY) return;
  const expiresAt = new Date(Date.now() + 30 * 24 * 3600000).toISOString();
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        line_user_id: lineUserId,
        plan: 'monthly',
        started_at: new Date().toISOString(),
        expires_at: expiresAt,
        status: 'active',
      }),
    });
  } catch (e) { console.error('Subscription grant error:', e); }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('POST only');

  const params = req.body;
  if (!params || !params.MerchantTradeNo) {
    return res.status(400).send('0|Invalid');
  }

  // Verify CheckMacValue
  const expected = genCheckMacValue(params);
  if (params.CheckMacValue !== expected) {
    console.error('CheckMacValue mismatch:', { received: params.CheckMacValue, expected });
    return res.status(400).send('0|CheckMacValue Error');
  }

  const tradeNo = params.MerchantTradeNo;
  const rtnCode = parseInt(params.RtnCode);
  const amount = parseInt(params.TradeAmt);
  const lineUserId = params.CustomField1 || '';
  const productType = params.CustomField2 || '';
  const bookSlugs = (params.CustomField3 || '').split(',').filter(Boolean);

  // Update purchase record
  if (SUPABASE_SERVICE_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/purchases?trade_no=eq.${tradeNo}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          ecpay_trade_no: params.TradeNo || '',
          status: rtnCode === 1 ? 'paid' : 'failed',
          rtn_code: rtnCode,
          rtn_msg: params.RtnMsg || '',
          payment_type: params.PaymentType || '',
          paid_at: params.PaymentDate || null,
        }),
      });
    } catch (e) { console.error('Purchase update error:', e); }
  }

  // If payment successful
  if (rtnCode === 1) {
    // 1. Issue e-invoice
    const itemName = productType === 'subscription' ? 'AI繪本月訂閱' :
      bookSlugs.length ? bookSlugs.map(s => `繪本:${s}`).join('#') : 'AI繪本';

    const invResult = await issueInvoice(tradeNo, amount, itemName, '');

    // Update purchase with invoice info
    if (SUPABASE_SERVICE_KEY && invResult && !invResult.error) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/purchases?trade_no=eq.${tradeNo}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            invoice_no: invResult.InvoiceNo || '',
            invoice_date: invResult.InvoiceDate || '',
          }),
        });
      } catch (e) { console.error('Invoice update error:', e); }
    }

    // 2. Grant access
    if (productType === 'subscription') {
      await grantSubscription(lineUserId);
    } else if (bookSlugs.length) {
      await grantBooks(lineUserId, bookSlugs);
    }
  }

  // ECPay expects exactly this response
  res.send('1|OK');
};
