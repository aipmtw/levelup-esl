# PWA offline delivery

**Primary delivery format for kid books.** Each generated book ships as a per-book **Progressive Web App** with a unique name, gated to assigned LINE accounts, playable fully offline after first-launch auth.

## Why PWA (not just a zip)
- **Airplane mode** — parent pre-loads the book before a flight / road trip, kid plays it with zero internet for hours.
- **Per-book identity** — unique installable app name ("Lily's Dinosaur Adventure", "太郎的太空冒險"), so kids see the specific book on their home screen, not a generic reader.
- **Partner control** — partner assigns the PWA to one or more LINE accounts. Only allowlisted accounts can install/play.
- **Auth survives offline** — LINE auth token is cached on first launch and validated locally on subsequent offline launches.

## Per-book PWA naming
- Each generated book gets a **unique PWA name** derived from the book title + child's name. E.g. `Lily's Dinosaur Adventure`, `太郎のうちゅうぼうけん`, `小美的恐龍冒險`.
- The name is partner-controllable at creation time (partner's CMS lets them rename before publishing).
- Unique URL: `app.markluce.ai/{partner-slug}/book/{book-id}` — also acts as the PWA's start_url.

## Manifest (generated per book)
```json
{
  "name": "小美的恐龍冒險",
  "short_name": "恐龍冒險",
  "start_url": "/audrey/book/abc123",
  "display": "standalone",
  "background_color": "#fff8e1",
  "theme_color": "#ff6f61",
  "icons": [
    { "src": "/audrey/book/abc123/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/audrey/book/abc123/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "lang": "zh-TW",
  "dir": "ltr"
}
```

The app icon is auto-generated from the book's main character reference image.

## Service worker caching strategy
- **On first launch (online, authed):** service worker pre-caches all assets for the book:
  - HTML shell, CSS, JS
  - Page illustrations (`pages/page-NN.jpg`)
  - Narration audio (`audio/{lang}/page-NN.mp3`)
  - `meta.json`
  - LINE auth validation token (encrypted, scoped to this PWA)
- **On subsequent launches:** service worker serves everything from cache. No network required.
- **Cache-first** for book assets (they never change). **Network-only** for any future sync/telemetry (fails gracefully offline).

## LINE-account gating

### At install time (online)
1. Parent opens `app.markluce.ai/{slug}/book/{book-id}` on their device.
2. LINE Login required — auth flow runs online.
3. Backend checks the book's **allowlist**: is this LINE user ID assigned to this book?
4. If yes: service worker installs, assets cache, a **long-lived sealed token** is written to IndexedDB (signed by Mark's platform key, bound to this LINE user ID + this book ID + an expiry).
5. If no: install refused with a clear error.

### At offline launch
1. PWA opens, service worker serves cached shell.
2. App reads the sealed token from IndexedDB.
3. Locally verifies token signature + expiry + binding (LINE user ID must match what the token was sealed for).
4. If valid: book plays. No network needed.
5. If expired or tampered: app shows "please connect to re-verify" and requires online re-auth.

### Token lifetime
- **Default:** 90 days. Long enough for real offline use (travel, cabins, "grandma's house"); short enough to revoke abuse.
- **Refresh:** whenever the PWA is online, it silently refreshes the sealed token in the background.
- **Partner override:** partner CMS can set a shorter or longer TTL per book (e.g. 7 days for trial giveaways, 365 days for paid permanent copies).

## Partner controls (in CMS)
- **Allowlist** — list of LINE user IDs (or LINE display names resolved to IDs) allowed to install this PWA.
- **Max installs per account** — typically 1–3 devices.
- **TTL** — how long the offline token stays valid without re-auth.
- **Revoke** — partner can revoke access from the CMS; next online launch blocks the PWA.
- **Transferable?** — toggle to allow re-gifting to a different LINE account (default off).

## Relationship to the `.zip` bundle
The `.zip` raw bundle (PDF + images + MP3 + `meta.json`) is still produced as a **secondary export**:
- For partners who want to redistribute or **print** physical copies.
- For parents who want a permanent un-gated archive (usually only offered at higher tiers / premium SKUs).
- Zip has **no access control** — once downloaded, it's in the wild. Partners who care about gating use the PWA only.

## M1 scope
- Generate per-book PWA with manifest + service worker + cached assets.
- LINE-account gating via sealed token.
- 90-day default TTL.
- Partner CMS: allowlist, revoke, TTL override.
- Works on iOS Safari (Add to Home Screen) and Android Chrome (Install).

## M2 follow-ups
- Multi-device sync of reading progress (when online).
- Background asset refresh when a new edition is published.
- Richer telemetry for partners (which pages the kid replayed most).
