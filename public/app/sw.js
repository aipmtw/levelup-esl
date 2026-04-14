const CACHE_NAME = 'storybook-v1';
const SHELL_URLS = [
  '/app/',
  '/app/index.html',
  '/app/reader.html',
  '/app/manifest.json',
];

// ---- Install: cache app shell ----
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

// ---- Activate: clean old caches ----
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k.startsWith('storybook-')).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ---- Fetch: network-first for HTML, cache-first for assets ----
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and API requests
  if (e.request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;

  // HTML: network-first
  if (e.request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Assets (images, audio, etc.): cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (r.ok && url.pathname.startsWith('/app/')) {
          const clone = r.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return r;
      });
    })
  );
});

// ---- Message handler: book download ----
self.addEventListener('message', e => {
  if (e.data?.type === 'DOWNLOAD_BOOK') {
    downloadBook(e.data.slug, e.data.pages);
  }
});

async function downloadBook(slug, pages) {
  const bc = new BroadcastChannel('book-download');
  const total = pages.length;
  let done = 0;

  try {
    // Open IndexedDB for encrypted content
    const db = await openDB();
    const cache = await caches.open(CACHE_NAME);

    // Get encryption key from API
    let encKey = null;
    try {
      const keyRes = await fetch(`/api/book-key?book_id=${slug}`);
      if (keyRes.ok) {
        const keyData = await keyRes.json();
        if (keyData.key) {
          const rawKey = Uint8Array.from(atob(keyData.key), c => c.charCodeAt(0));
          encKey = await crypto.subtle.importKey('raw', rawKey.slice(0, 32), 'AES-GCM', false, ['encrypt', 'decrypt']);
        }
      }
    } catch (err) {
      console.log('No encryption key, caching unencrypted');
    }

    for (const page of pages) {
      // Download and cache images
      if (page.image_url) {
        try {
          const imgRes = await fetch(page.image_url);
          if (imgRes.ok) {
            if (encKey) {
              // Encrypt and store in IndexedDB
              const buf = await imgRes.arrayBuffer();
              const encrypted = await encryptData(encKey, buf);
              await putDB(db, `${slug}-img-${page.page_num}`, encrypted);
            } else {
              await cache.put(new Request(page.image_url), imgRes);
            }
          }
        } catch (err) { console.error('Image download error:', err); }
      }

      // Download and cache audio
      for (const audioUrl of [page.audio_zh_url, page.audio_en_url]) {
        if (audioUrl) {
          try {
            const aRes = await fetch(audioUrl);
            if (aRes.ok) {
              if (encKey) {
                const buf = await aRes.arrayBuffer();
                const encrypted = await encryptData(encKey, buf);
                await putDB(db, `${slug}-audio-${page.page_num}-${audioUrl.includes('zh') ? 'zh' : 'en'}`, encrypted);
              } else {
                await cache.put(new Request(audioUrl), aRes);
              }
            }
          } catch (err) { console.error('Audio download error:', err); }
        }
      }

      done++;
      bc.postMessage({ slug, progress: done / total, done: false });
    }

    // Store page text data in IndexedDB
    const pageData = pages.map(p => ({ page_num: p.page_num, text_zh: p.text_zh, text_en: p.text_en, image_url: p.image_url, audio_zh_url: p.audio_zh_url, audio_en_url: p.audio_en_url }));
    if (encKey) {
      const enc = new TextEncoder();
      const encrypted = await encryptData(encKey, enc.encode(JSON.stringify(pageData)));
      await putDB(db, `${slug}-pages`, encrypted);
    } else {
      await putDB(db, `${slug}-pages`, JSON.stringify(pageData));
    }

    bc.postMessage({ slug, progress: 1, done: true });
  } catch (err) {
    console.error('Download error:', err);
    bc.postMessage({ slug, progress: 0, done: false, error: err.message });
  }
}

// ---- AES-GCM Encryption ----
async function encryptData(key, data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  // Prepend IV to ciphertext
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  return result.buffer;
}

async function decryptData(key, data) {
  const arr = new Uint8Array(data);
  const iv = arr.slice(0, 12);
  const ciphertext = arr.slice(12);
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
}

// ---- IndexedDB helpers ----
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('storybook-offline', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('content');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function putDB(db, key, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('content', 'readwrite');
    tx.objectStore('content').put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getDB(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('content', 'readonly');
    const req = tx.objectStore('content').get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
