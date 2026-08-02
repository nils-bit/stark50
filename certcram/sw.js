/* CERTCRAM service worker — offline first, but updates that actually land.

   Cache-first for everything is the obvious choice and the wrong one for the
   app shell: an installed home-screen PWA then reads its own code out of the
   cache forever, and a new version only arrives when the browser happens to
   notice a changed sw.js — which Safari looks for at most once a day. So the
   shell and the course files come from the network first, with the cache as the
   fallback when the network is slow or absent. */

const CACHE = "certcram-v1";
const BUILD = "2026-08-02";
const NET_TIMEOUT = 3000;   // ms before giving up and serving the cache

const ASSETS = [
  "./", "./index.html", "./styles.css", "./manifest.webmanifest",
  "./core.js", "./state.js", "./course.js", "./srs.js", "./engine.js",
  "./plan.js", "./ai.js", "./drill.js", "./mock.js", "./views.js",
  "./onboarding.js", "./app.js",
  "./courses/hubspot-trainer.js", "./courses/hubspot-revops.js", "./courses/ccao-f.js",
  "./icon-192.png", "./icon-512.png",
];

/* Files that change on every release. Icons and anything else stay cache-first. */
const SHELL = /\.js$|\.css$|\/(index\.html|manifest\.webmanifest)$|\/$/;

self.addEventListener("install", e => {
  // addAll rejects the whole install if any single file 404s, which would leave
  // the app with no worker at all. Cache them individually instead.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      // Only our own caches. Another app on the same origin must keep its own.
      .then(keys => Promise.all(keys.filter(k => k.startsWith("certcram-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Tapping a study reminder focuses the app if it is already open. */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) if ("focus" in c) return c.focus();
      if (self.clients.openWindow) return self.clients.openWindow("./index.html");
    })
  );
});

/* The app asks which version is actually running; the answer shows in Settings.
   The worker owns the string, so nothing is kept in sync in two places. */
self.addEventListener("message", e => {
  if (e.data && e.data.type === "version" && e.ports[0]) {
    e.ports[0].postMessage({ cache: CACHE, built: BUILD });
  }
});

function putInCache(req, res) {
  const copy = res.clone();
  caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
}

/* Network first, but never waiting longer than NET_TIMEOUT before falling back.
   A late network response still refreshes the cache for next launch. When the
   device already knows it is offline the wait is skipped entirely — a phone in
   aeroplane mode should open as fast as it ever did. */
function networkFirst(req) {
  if (self.navigator && self.navigator.onLine === false) return cacheFirst(req);
  return caches.match(req).then(cached => new Promise(resolve => {
    let settled = false;
    const done = r => { if (!settled) { settled = true; resolve(r); } };
    const timer = cached ? setTimeout(() => done(cached), NET_TIMEOUT) : null;
    fetch(req).then(res => {
      if (res && res.ok) putInCache(req, res);
      clearTimeout(timer);
      done(res);
    }).catch(() => {
      clearTimeout(timer);
      done(cached || Response.error());
    });
  }));
}

function cacheFirst(req) {
  return caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res && res.ok) putInCache(req, res);
    return res;
  }).catch(() => cached || Response.error()));
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Fonts and the Anthropic API look after themselves.
  if (url.origin !== self.location.origin) return;
  const isShell = e.request.mode === "navigate" || SHELL.test(url.pathname);
  e.respondWith(isShell ? networkFirst(e.request) : cacheFirst(e.request));
});
