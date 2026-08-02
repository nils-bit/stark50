/* CERTCRAM — boot, navigation, reminders and calendar export. */
"use strict";

/* ═══════════════ NAVIGATION ═══════════════ */

const VIEW_TITLES = { today: "Today", study: "Study", mock: "Mock exam", certs: "Certs", settings: "Settings" };
const VIEWS = { today: renderToday, study: renderStudy, mock: renderMock, certs: renderCerts, settings: renderSettings };

let currentView = "today";

function switchView(v) {
  if (!VIEWS[v]) v = "today";

  /* A running block owns the screen. Letting a nav tap silently abandon a
     half-finished mock — or a drill whose grades have not been recorded — is
     the kind of data loss that stops people trusting the app. */
  if (v !== "study" && drillActive() && currentView === "study") {
    return askConfirm("Leave this block?", "Your answers so far are saved. The rest of the block is dropped.",
      "Leave", () => { endDrill(false); switchView(v); });
  }
  if (v !== "mock" && mockActive() && currentView === "mock") {
    return askConfirm("Leave the exam?", "The clock keeps running. Come back to the Mock tab to carry on.",
      "Leave", () => { stopMockClock(); currentView = v; paintView(v); });
  }

  currentView = v;
  paintView(v);
}

function paintView(v) {
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  $("#topbarTitle").textContent = VIEW_TITLES[v];
  refreshTopbar();

  const wrap = $("#viewWrap");
  // Restart the fade so a view change reads as a change, not a repaint.
  wrap.style.animation = "none";
  void wrap.offsetHeight;
  wrap.style.animation = "";
  wrap.innerHTML = "";
  VIEWS[v](wrap);
}

function refreshTopbar() {
  const d = new Date();
  $("#topbarDate").textContent = DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];

  const soonest = enrolledList()
    .filter(e => e.examDate && e.mode !== "paused")
    .map(e => ({ e, days: daysBetween(dkey(), e.examDate) }))
    .filter(r => r.days !== null && r.days >= 0)
    .sort((a, b) => a.days - b.days)[0];

  $("#topbarUser").textContent = soonest
    ? soonest.e.course.cert.code + " " + relDays(soonest.days)
    : (state.name || "");
}

$$(".nav-btn").forEach(b => b.onclick = () => switchView(b.dataset.view));

/* ═══════════════ NOTIFICATIONS ═══════════════ */

async function requestNotifyPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try { return (await Notification.requestPermission()) === "granted"; }
  catch (e) { return false; }
}

/* Notifications go through the service worker registration. iOS does not
   support the Notification constructor at all inside an installed PWA, so the
   constructor is only a desktop fallback. */
function notify(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if (navigator.serviceWorker && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready
      .then(reg => reg.showNotification(title, { body, icon: "icon-192.png", badge: "icon-192.png", tag: "certcram" }))
      .catch(() => { try { new Notification(title, { body }); } catch (e) { /* nothing else to try */ } });
  } else {
    try { new Notification(title, { body }); } catch (e) { /* nothing else to try */ }
  }
}

/* ═══════════════ REMINDERS ═══════════════

   A foreground poll, not a scheduled push. A web app cannot be woken once it is
   fully closed, so this only fires while the app is open or backgrounded — the
   .ics export below exists because of that limitation, not alongside it. */

const REMINDER_TICK = 30000;
const CATCHUP_MIN = 180;   // a nudge missed by up to three hours still fires

function checkReminders() {
  if (!state || !state.onboarded || !state.remindersOn) return;

  const today = dkey();
  if (state.fired.date !== today) { state.fired = { date: today, keys: [] }; save(); }

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [h, m] = state.reminderTime.split(":").map(Number);
  const diff = nowMin - (h * 60 + m);
  if (!(diff >= 0 && diff <= CATCHUP_MIN)) return;
  if (state.fired.keys.includes("daily")) return;

  state.fired.keys.push("daily");
  save();

  const plan = ensurePlan();
  const left = planRemaining();
  if (!left) return;

  const next = nextPlanItem();
  notify("Study time — " + fmtMin(left) + " planned",
    next ? next.label : "Open CERTCRAM to start.");
  toast("◉", "Today's plan is ready", fmtMin(left) + " across " + plan.items.length + " blocks.", 8000,
    { label: "Start now", fn: () => switchView("today") });
}

/* An exam tomorrow is worth saying out loud once, at first open on the day. */
function checkExamWarnings() {
  const today = dkey();
  for (const e of enrolledList()) {
    if (!e.examDate || e.mode === "paused") continue;
    const days = daysBetween(today, e.examDate);
    if (days !== 0 && days !== 1) continue;
    const key = "exam:" + e.id + ":" + days;
    if (state.fired.keys.includes(key)) continue;
    state.fired.keys.push(key);
    save();
    const r = readinessCached(e.course);
    toast(days === 0 ? "⚑" : "⏳",
      e.course.cert.code + (days === 0 ? " is today" : " is tomorrow"),
      pct(r.pPass) + " estimated chance of passing. " +
      (r.untestedWeight > 0.05 ? "Untested: " + r.untested.join(", ") + "." : "Review your key points."),
      0);
  }
}

/* ═══════════════ CALENDAR EXPORT ═══════════════

   The reminder loop above cannot fire when the app is closed, which is most of
   the time. A calendar entry can. Daily study blocks recur until the exam, and
   each exam gets its own all-day entry. */

function exportIcs() {
  const certs = enrolledList().filter(e => e.examDate && e.mode !== "paused");
  if (!certs.length) return toast("⚠️", "Nothing to export", "Set an exam date on at least one certification first.");

  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CERTCRAM//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:CERTCRAM study plan",
  ];

  const stamp = icsStamp(new Date());
  const [rh, rm] = state.reminderTime.split(":").map(Number);

  for (const e of certs) {
    const exam = fromKey(e.examDate);
    const start = new Date();
    start.setHours(rh, rm, 0, 0);
    if (start < new Date()) start.setDate(start.getDate() + 1);

    const until = new Date(exam);
    until.setHours(0, 0, 0, 0);

    // Stable UIDs, so re-exporting updates the existing entries rather than
    // stacking a second copy of the whole plan on top of the first.
    lines.push(
      "BEGIN:VEVENT",
      "UID:certcram-study-" + e.id + "@certcram.app",
      "DTSTAMP:" + stamp,
      "DTSTART:" + icsStamp(start),
      "DTEND:" + icsStamp(new Date(start.getTime() + state.minutesPerDay * 60000)),
      "RRULE:FREQ=DAILY;UNTIL=" + icsStamp(until),
      "SUMMARY:" + icsEsc("Study · " + e.course.cert.code),
      "DESCRIPTION:" + icsEsc(state.minutesPerDay + " minutes. Open CERTCRAM for today's blocks."),
      "BEGIN:VALARM", "TRIGGER:-PT5M", "ACTION:DISPLAY",
      "DESCRIPTION:" + icsEsc("Study · " + e.course.cert.code), "END:VALARM",
      "END:VEVENT");

    lines.push(
      "BEGIN:VEVENT",
      "UID:certcram-exam-" + e.id + "@certcram.app",
      "DTSTAMP:" + stamp,
      "DTSTART;VALUE=DATE:" + e.examDate.replace(/-/g, ""),
      "SUMMARY:" + icsEsc("EXAM · " + e.course.cert.name),
      "DESCRIPTION:" + icsEsc("Pass mark " + pct(passFrac(e.course)) + ". " + (e.course.exam.note || "")),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY",
      "DESCRIPTION:" + icsEsc("Exam tomorrow · " + e.course.cert.code), "END:VALARM",
      "END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.map(foldIcs).join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "certcram.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("✓", "Calendar file downloaded", "Open it to add the plan to your calendar.");
}

const icsStamp = d =>
  d.getUTCFullYear() + String(d.getUTCMonth() + 1).padStart(2, "0") + String(d.getUTCDate()).padStart(2, "0")
  + "T" + String(d.getUTCHours()).padStart(2, "0") + String(d.getUTCMinutes()).padStart(2, "0")
  + String(d.getUTCSeconds()).padStart(2, "0") + "Z";

const icsEsc = s => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/* RFC 5545 caps a line at 75 octets. Folding by character count would split a
   multi-byte character down the middle, so this counts bytes and only ever
   breaks between whole code points. */
function foldIcs(line) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out = [];
  let cur = "", bytes = 0, limit = 75;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > limit) { out.push(cur); cur = " "; bytes = 1; limit = 75; }
    cur += ch; bytes += n;
  }
  if (cur) out.push(cur);
  return out.join("\r\n");
}

/* ═══════════════ SERVICE WORKER ═══════════════ */

/* The worker owns the version string, so nothing has to be kept in sync in two
   places. Resolves to null when there is no worker (a plain file:// open). */
function swVersion() {
  return new Promise(resolve => {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return resolve(null);
    const ch = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 1200);
    ch.port1.onmessage = e => { clearTimeout(timer); resolve(e.data); };
    navigator.serviceWorker.controller.postMessage({ type: "version" }, [ch.port2]);
  });
}

/* A new version is installed alongside the running one. Say so; never reload
   under someone's fingers — they might be ninety minutes into a mock. */
window.onAppUpdate = () => {
  toast("↻", "Update ready", "Reload to pick up the new version.", 0,
    { label: "Reload now", fn: () => location.reload() });
};

/* ═══════════════ BOOT ═══════════════ */

function boot() {
  /* Course files run before this and push their raw objects onto CERT_COURSES.
     Registering validates and normalizes each one, so the registry must be
     populated before load() — normalizeState drops progress for courses that do
     not exist, and an empty registry would drop all of it. */
  for (const raw of (window.CERT_COURSES || [])) CERT.register(raw);

  aiCourses = loadAiCourses();
  CERT.setAi(aiCourses);
  state = load();

  if (!state.onboarded) {
    startOnboarding();
    return;
  }

  $("#onboarding").classList.add("hidden");
  $("#app").classList.remove("hidden");

  ensurePlan();

  // A mock that was in flight when the tab died resumes on its own clock.
  switchView(mockActive() ? "mock" : "today");

  checkExamWarnings();
  checkReminders();
  setInterval(checkReminders, REMINDER_TICK);

  /* Coming back to a backgrounded app is the moment the day may have rolled
     over, a reminder may be due, and a mock's clock has moved on. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    checkReminders();
    if (state.plan && state.plan.date !== dkey()) { ensurePlan(true); checkExamWarnings(); }
    if (currentView === "mock" && mockActive()) switchView("mock");
    else refreshTopbar();
  });
}

/* If boot throws with saved data, retry once from empty state so Export and
   Reset stay reachable rather than leaving a white screen and no way out. */
function init() {
  try {
    boot();
  } catch (e) {
    console.error("CERTCRAM boot failed", e);
    try {
      const stashed = localStorage.getItem(STORE_KEY);
      state = normalizeState(null);
      aiCourses = [];
      CERT.setAi([]);
      $("#onboarding").classList.add("hidden");
      $("#app").classList.remove("hidden");
      switchView("settings");
      toast("⚠️", "Something went wrong loading your data",
        stashed ? "Your saved progress could not be read. Export a backup before resetting." : "Starting fresh.", 0);
    } catch (e2) {
      document.body.innerHTML =
        '<pre style="padding:2rem;font-family:monospace;color:#e8eaf0;background:#14161c">'
        + "CERTCRAM could not start.\n\n" + esc(String(e2 && e2.message || e2)) + "</pre>";
    }
  }
}

init();
