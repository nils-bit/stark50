/* STARK50 synkserver — Cloudflare Worker.

   Lagrar EN krypterad blob per användare. Servern vet inte vad den innehåller:
   klienten krypterar med AES-GCM innan den skickar, och nyckeln härleds ur en
   hemlighet som aldrig lämnar telefonen. Det som skickas hit är bearer-token,
   som är härledd åt ett annat håll ur samma hemlighet — den går inte att
   dekryptera med.

   API:
     GET  /v1/state   → { rev, blob } | { rev: 0, blob: null } om inget finns
     PUT  /v1/state   body { rev, blob } → { rev } | 409 { rev, blob } vid krock
     GET  /v1/health  → { ok: true }

   rev är ett heltal som räknas upp vid varje skrivning. Klienten skickar det
   rev den senast såg; stämmer det inte har någon annan enhet hunnit före och
   klienten får 409 med serverns aktuella innehåll för att slå ihop och skicka igen. */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS },
  });

/* Jämförelse i konstant tid — en vanlig === läcker hur många tecken som stämde
   via svarstiden, och tokens är korta nog att det spelar roll. */
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* Token är SHA-256(syncKey + ":auth") i hex, satt som secret vid deploy.
   Servern lagrar alltså aldrig något som kan dekryptera blobben. */
function authed(request, env) {
  const expected = env.SYNC_TOKEN;
  if (!expected) return false;
  const header = request.headers.get("Authorization") || "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  return !!m && safeEqual(m[1].trim().toLowerCase(), expected.trim().toLowerCase());
}

const KEY = "state";
const MAX_BYTES = 2 * 1024 * 1024; // KV klarar 25 MB; 2 är gott om plats för år av loggar

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (url.pathname === "/v1/health") return json({ ok: true });
    if (url.pathname !== "/v1/state") return json({ error: "not_found" }, 404);
    if (!env.STARK50) return json({ error: "kv_not_bound" }, 500);
    if (!authed(request, env)) return json({ error: "unauthorized" }, 401);

    if (request.method === "GET") {
      const stored = await env.STARK50.get(KEY, { type: "json" });
      return json(stored ? { rev: stored.rev, blob: stored.blob } : { rev: 0, blob: null });
    }

    if (request.method === "PUT") {
      let body;
      try { body = await request.json(); }
      catch (e) { return json({ error: "bad_json" }, 400); }

      const rev = Number(body && body.rev);
      const blob = body && body.blob;
      if (!Number.isInteger(rev) || rev < 0) return json({ error: "bad_rev" }, 400);
      if (typeof blob !== "string" || !blob) return json({ error: "bad_blob" }, 400);
      if (blob.length > MAX_BYTES) return json({ error: "too_large" }, 413);

      const stored = await env.STARK50.get(KEY, { type: "json" });
      const current = stored ? stored.rev : 0;
      // Krock: någon annan enhet har skrivit sedan klienten läste. Skicka
      // tillbaka det aktuella så klienten kan slå ihop och försöka igen.
      if (current !== rev) return json({ error: "conflict", rev: current, blob: stored ? stored.blob : null }, 409);

      const next = current + 1;
      await env.STARK50.put(KEY, JSON.stringify({ rev: next, blob }));
      return json({ rev: next });
    }

    return json({ error: "method_not_allowed" }, 405);
  },
};
