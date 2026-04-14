const SUPABASE_URL = 'https://reipdepbltfbfxnjjegy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaXBkZXBibHRmYmZ4bmpqZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUxMjgsImV4cCI6MjA4OTEzMTEyOH0.yEoDps8Fni0x5CKOCsL5zdj0n4if32fr0UGXcdsEfSo';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { book_id, slug } = req.query;

  try {
    let bookId = book_id;

    // If slug provided, look up book_id first
    if (!bookId && slug) {
      const br = await fetch(`${SUPABASE_URL}/rest/v1/books?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`, {
        headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` },
      });
      if (!br.ok) return res.status(502).json({ error: 'Book lookup failed' });
      const books = await br.json();
      if (!books.length) return res.status(404).json({ error: 'Book not found' });
      bookId = books[0].id;
    }

    if (!bookId) return res.status(400).json({ error: 'book_id or slug required' });

    const url = `${SUPABASE_URL}/rest/v1/book_pages?book_id=eq.${bookId}&order=page_num.asc&select=page_num,text_zh,text_en,image_url,audio_zh_url,audio_en_url`;

    const r = await fetch(url, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` },
    });

    if (!r.ok) {
      console.error('Book pages fetch error:', await r.text());
      return res.status(502).json({ error: 'Fetch failed' });
    }

    const pages = await r.json();
    res.json({ ok: true, book_id: bookId, pages });
  } catch (err) {
    console.error('Book pages error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
