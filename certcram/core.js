/* CERTCRAM — core helpers.
   DOM shorthands, dates, escaping, toasts and the single global modal.
   Everything here is dependency-free and loads first. */
"use strict";

/* ═══════════════ DOM ═══════════════ */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

/* Every string that reaches innerHTML goes through this. That is not paranoia
   here: course content is written by a model reading text the user pasted from
   an arbitrary source, so a workbook containing <img src=x onerror=...> can
   round-trip through generation into the DOM. The Anthropic API key lives in
   localStorage on this same origin, so one injection reads the key. */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, m =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

/* ═══════════════ NUMBERS ═══════════════ */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* Coerce anything to a finite number in range, with a fallback. Used all over
   normalizeState — a NaN that reaches the scheduler produces a due date that is
   neither past nor future, and the card silently vanishes from every queue. */
function num(v, lo, hi, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? clamp(n, lo, hi) : fallback;
}
function int(v, lo, hi, fallback) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? clamp(n, lo, hi) : fallback;
}

let uidSeq = 0;
const uid = (p = "i") => p + Date.now().toString(36) + (uidSeq++).toString(36);

/* ═══════════════ DATES ═══════════════ */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/* Local-time date key. Deliberately not toISOString(): that converts to UTC, so
   anyone studying after 22:00 in Stockholm would have their session logged
   against tomorrow and break the streak. */
function dkey(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/* "2026-08-09" -> Date at local midnight, or null if the string is junk. */
function fromKey(k) {
  if (!DATE_RE.test(String(k || ""))) return null;
  const [y, m, d] = k.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? dt : null;
}

const isDateKey = k => fromKey(k) !== null;

/* Whole days from one date key to another. Positive means `to` is in the
   future. Both are local midnights, so daylight-saving shifts cannot make this
   return 0.96 days and round the wrong way. */
function daysBetween(fromK, toK) {
  const a = fromKey(fromK), b = fromKey(toK);
  if (!a || !b) return null;
  return Math.round((b - a) / 864e5);
}

/* Exam deadline in epoch ms. An exam "on 9 Aug" is studied for until the end of
   8 Aug at the earliest, so the deadline is that day's 09:00 — sitting an exam
   before then is possible but you would not be revising at 04:00. */
function examMs(dateKey) {
  const d = fromKey(dateKey);
  if (!d) return null;
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}

function prettyDate(k) {
  const d = fromKey(k);
  if (!d) return "—";
  return DAYS[d.getDay()].slice(0, 3) + " " + d.getDate() + " " + MONTHS[d.getMonth()];
}

/* "in 5 days" / "tomorrow" / "today" / "3 days ago" */
function relDays(n) {
  if (n === null) return "no date set";
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n < 0) return Math.abs(n) + (n === -1 ? " day ago" : " days ago");
  return "in " + n + " days";
}

/* 95 -> "1 h 35 min", 45 -> "45 min" */
function fmtMin(m) {
  m = Math.round(m);
  if (m < 60) return m + " min";
  const h = Math.floor(m / 60), r = m % 60;
  return r ? h + " h " + r + " min" : h + " h";
}

/* Seconds -> "07:23" for the mock exam clock. */
function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const mm = String(m).padStart(2, "0"), ss = String(s).padStart(2, "0");
  return h ? h + ":" + mm + ":" + ss : mm + ":" + ss;
}

const pct = v => Math.round(v * 100) + "%";

/* ═══════════════ TOASTS ═══════════════ */

/* ms = 0 means the toast stays until dismissed — used for the update prompt and
   for storage failures, which must not scroll past unread. */
function toast(icon, title, body = "", ms = 4200, action = null) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<strong>${esc(icon)} ${esc(title)}</strong>${body ? esc(body) : ""}`;
  if (action) {
    const b = document.createElement("button");
    b.className = "t-btn";
    b.textContent = action.label;
    b.onclick = () => { el.remove(); action.fn(); };
    el.appendChild(b);
  }
  $("#toasts").appendChild(el);
  if (ms > 0) setTimeout(() => el.remove(), ms);
  return el;
}

/* ═══════════════ MODAL ═══════════════ */

let modalOnClose = null;

function openModal(html, onClose = null) {
  modalOnClose = onClose;
  $("#modal").innerHTML = `<button class="modal-close" id="modalX" aria-label="Close">✕</button>` + html;
  $("#modalBackdrop").classList.remove("hidden");
  $("#modalX").onclick = closeModal;
  return $("#modal");
}

function closeModal() {
  if ($("#modalBackdrop").classList.contains("hidden")) return;
  $("#modalBackdrop").classList.add("hidden");
  const fn = modalOnClose;
  modalOnClose = null;
  if (fn) fn();
}

$("#modalBackdrop").addEventListener("click", e => { if (e.target.id === "modalBackdrop") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* Confirm dialog. Native confirm() is blocked inside installed PWAs on iOS. */
function askConfirm(title, body, confirmLabel, onYes, danger = false) {
  openModal(`
    <div class="card-kicker signal">Confirm</div>
    <h2>${esc(title)}</h2>
    <p class="muted" style="margin:0.6rem 0 1.4rem">${esc(body)}</p>
    <div class="ob-actions">
      <button class="btn ${danger ? "fail" : ""}" id="cfYes">${esc(confirmLabel)}</button>
      <button class="btn ghost" id="cfNo">Cancel</button>
    </div>`);
  $("#cfYes").onclick = () => { closeModal(); onYes(); };
  $("#cfNo").onclick = closeModal;
}

/* ═══════════════ SMALL RENDER HELPERS ═══════════════ */

/* A progress bar with an optional right-hand label. cls picks the semantic
   colour: "" (signal), "pass", "warn", "fail". */
function pbar(frac, cls = "", left = "", right = "") {
  const w = clamp(Math.round(frac * 100), 0, 100);
  const meta = left || right
    ? `<div class="pbar-meta"><span>${esc(left)}</span><span>${esc(right)}</span></div>` : "";
  return `<div class="pbar"><div class="${cls}" style="width:${w}%"></div></div>${meta}`;
}

/* Half-circle gauge for readiness. Hand-rolled SVG — a chart library would be
   the only dependency in the project, for one shape. */
function gauge(frac, label, sub, cls = "") {
  const R = 52, C = Math.PI * R;
  const off = C * (1 - clamp(frac, 0, 1));
  const stroke = cls === "pass" ? "var(--pass)" : cls === "warn" ? "var(--warn)" : cls === "fail" ? "var(--fail)" : "var(--signal)";
  return `
    <div class="center">
      <svg viewBox="0 0 128 74" style="width:100%;max-width:190px;overflow:visible">
        <path d="M12 66 A52 52 0 0 1 116 66" fill="none" stroke="var(--panel-2)" stroke-width="10" stroke-linecap="round"/>
        <path d="M12 66 A52 52 0 0 1 116 66" fill="none" stroke="${stroke}" stroke-width="10" stroke-linecap="round"
              stroke-dasharray="${C}" stroke-dashoffset="${off}" style="transition:stroke-dashoffset .5s ease"/>
      </svg>
      <div class="big-num" style="margin-top:-1.1rem">${esc(label)}</div>
      <div class="tiny faint" style="margin-top:0.3rem">${esc(sub)}</div>
    </div>`;
}
