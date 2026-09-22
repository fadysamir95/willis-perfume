/* ============================================================
   Willi's Perfume — Service Worker (PWA)
   ------------------------------------------------------------
   Strategy:
   - Navigations (HTML pages): network-first, fall back to the
     cached homepage when offline.
   - Static assets (css/js/images): stale-while-revalidate —
     served instantly from cache, refreshed in the background.
   - Cross-origin (Google Fonts): stale-while-revalidate too.
   Bump VERSION to force a full cache refresh after every deploy.
   ============================================================ */
const VERSION = "willis-v5";
const CACHE_NAME = "willis-static-" + VERSION;

/* Core assets precached for instant offline startup */
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/collection.html",
  "/featured.html",
  "/contact.html",
  "/style.css",
  "/app.js",
  "/i18n.js",
  "/site-config.js",
  "/manifest.webmanifest",
  "/images/logo.webp",
  "/images/favicon-32x32.png",
  "/images/apple-touch-icon.png",
  "/images/icon-192.png",
  "/images/icon-512.png",
  "/images/og-image.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    /* Cross-origin (fonts): stale-while-revalidate */
    event.respondWith(
      caches.match(req).then(cached =>
        cached || fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
      )
    );
    return;
  }

  /* Same-origin */
  if (req.mode === "navigate") {
    /* Network-first for pages so deploys/data updates show immediately */
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then(cached =>
            cached ||
            caches.match("/").then(home => home || caches.match("/index.html"))
          )
        )
    );
    return;
  }

  /* Static assets: stale-while-revalidate */
  event.respondWith(
    caches.match(req).then(cached => {
      const refresh = fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || refresh;
    })
  );
});