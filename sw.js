/* STARK50 service worker — offline-cache med uppdateringar som faktiskt slår igenom.

   Den tidigare versionen var cache-first för allt, inklusive app.js och index.html.
   En installerad hemskärms-PWA läste då alltid ur cachen och ny kod kom fram först
   när en ny sw.js råkade hinna installeras — vilket Safari letar efter som mest en
   gång per dygn. Appskalet hämtas därför nu från nätet först, med cachen som
   reserv när nätet är borta eller långsamt. */
const CACHE = "stark50-v7";
const BUILD = "2026-07-28";
const NET_TIMEOUT = 3000; // ms innan vi ger upp och tar cachen — offline ska kännas snabbt
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest"];

/* Filer som ändras vid varje release. Ikoner och liknande ligger utanför och
   fortsätter serveras cache-first. */
const SHELL = /\/(index\.html|app\.js|styles\.css|manifest\.webmanifest)$|\/$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

/* Klick på en notis: fokusera appen om den redan är öppen, öppna den annars. */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) if ("focus" in c) return c.focus();
      if (self.clients.openWindow) return self.clients.openWindow("./index.html");
    })
  );
});

/* Appen frågar vilken version som faktiskt kör — svaret visas i Inställningar.
   sw.js äger versionssträngen; inget behöver hållas i synk på två ställen. */
self.addEventListener("message", e => {
  if (e.data && e.data.type === "version" && e.ports[0]) {
    e.ports[0].postMessage({ cache: CACHE, built: BUILD });
  }
});

function putInCache(req, res) {
  const copy = res.clone();
  caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
}

/* Nätet först, men aldrig mer än NET_TIMEOUT — sedan tar cachen över.
   Kommer nätsvaret senare uppdaterar det ändå cachen inför nästa start.
   Vet enheten redan att den är offline hoppar vi över väntan helt: en telefon i
   flygplansläge ska starta appen lika snabbt som förut. */
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
      if (cached) done(cached);
      else done(Response.error());
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
  if (url.origin !== self.location.origin) return; // typsnitt m.m. sköter sig själva
  const isShell = e.request.mode === "navigate" || SHELL.test(url.pathname);
  e.respondWith(isShell ? networkFirst(e.request) : cacheFirst(e.request));
});
