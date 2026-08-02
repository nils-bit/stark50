/* CERTCRAM — state and persistence.

   Two localStorage keys, deliberately, against the usual one-blob convention:

     cc_state_v1    progress, plan, preferences, API key   ~80 kB
     cc_courses_v1  workbook-generated courses only        0–1.5 MB

   save() runs on every card grade — roughly sixty times an hour. Progress alone
   serializes in well under a millisecond. Fold three ~93 kB generated courses
   into the same blob and every grade writes ~380 kB synchronously on the main
   thread, which on a mid-range phone is 8–20 ms landing right in the middle of
   a card-flip. Courses are written once at generation; progress is written
   constantly. Opposite write profiles, different keys.

   Built-in courses live in courses/*.js and cost zero localStorage. */
"use strict";

const STORE_KEY = "cc_state_v1";
const COURSES_KEY = "cc_courses_v1";

/* Browsers count UTF-16 code units, so a JSON string costs roughly 2 bytes per
   character of quota. 1.5 MB of quota is about eight generated courses. */
const COURSES_QUOTA = 1.5e6;

let state;          // assigned in boot(), not here — normalizeState needs the course registry
let aiCourses = []; // generated courses, loaded from COURSES_KEY

const MODES = ["active", "maintenance", "paused"];

function defaultState() {
  return {
    v: 1,
    onboarded: false,
    name: "",

    aiKey: "",
    aiModel: "claude-opus-5",

    /* Enrolled certifications, keyed by course id.
       examDate may be null — an undated cert sits in the library and is given
       no minutes by the planner until a date exists. */
    enrolled: {},   // { "hubspot-trainer": { examDate: "2026-08-09", mode: "active", added: 0 } }

    minutesPerDay: 60,
    /* Days where a longer sitting is available. A 120-minute mock cannot fit in
       a 60-minute day, so without this the planner would silently never schedule
       a full-length mock and readiness would never get its best input. */
    longDays: {},   // { "2026-08-07": 150 }

    reminderTime: "07:00",
    remindersOn: false,

    /* Measured throughput, minutes per item, updated as an EWMA after every
       session. Every minutes-to-items conversion in plan.js reads this. A plan
       built on someone else's pace over-books every day until it is ignored. */
    pace: { newCard: 0.55, revCard: 0.13, quizQ: 0.75, samples: 0 },

    /* All mutable study state. Courses stay immutable; this is keyed by their ids.
         d[domainId] = { n, c, ts }                  attempts, correct, last touched
         c[cardId]   = { box, due, reps, lapses, ts }
         q[qId]      = { n, c, ts }                                                */
    prog: {},

    mocks: [],      // capped at MAX_MOCKS
    plan: null,     // today's generated plan, see plan.js
    session: null,  // in-flight drill, for crash recovery
    gen: null,      // in-flight AI generation job, for resume
    flagged: {},    // { qId: true } — suspected-wrong answer keys, excluded everywhere

    streak: { last: "", days: 0 },
    log: {},        // { "2026-08-02": { minutes, cards, questions } }
    fired: { date: "", keys: [] },   // reminder de-dupe, per day
  };
}

const MAX_MOCKS = 20;
const GEN_TTL = 24 * 3600e3;   // a generation job older than a day is stale
const SESSION_TTL = 6 * 3600e3;

/* ═══════════════ NORMALIZE ═══════════════

   Run on both load() and import(). Its job is to guarantee that no value
   downstream can be NaN, out of range, or point at something that no longer
   exists. Most of these clamps look pedantic; each one corresponds to a real
   failure mode noted inline. */
function normalizeState(raw) {
  const d = defaultState();
  const s = Object.assign(d, raw && typeof raw === "object" ? raw : {});

  // Object.assign is shallow, so every nested object is merged on its own or a
  // partial backup would leave half the sub-keys undefined.
  s.pace = Object.assign(defaultState().pace, s.pace && typeof s.pace === "object" ? s.pace : {});
  s.streak = Object.assign(defaultState().streak, s.streak && typeof s.streak === "object" ? s.streak : {});
  s.fired = Object.assign(defaultState().fired, s.fired && typeof s.fired === "object" ? s.fired : {});
  for (const k of ["enrolled", "longDays", "prog", "flagged", "log"]) {
    if (!s[k] || typeof s[k] !== "object" || Array.isArray(s[k])) s[k] = {};
  }
  if (!Array.isArray(s.mocks)) s.mocks = [];

  s.name = String(s.name || "").slice(0, 60);
  s.aiKey = String(s.aiKey || "");
  s.aiModel = AI_MODELS.some(m => m.id === s.aiModel) ? s.aiModel : "claude-opus-5";
  s.onboarded = !!s.onboarded;
  s.remindersOn = !!s.remindersOn;
  if (!/^\d{2}:\d{2}$/.test(s.reminderTime)) s.reminderTime = "07:00";

  // 0 would divide by zero in the cert allocator; a huge value over-books forever.
  s.minutesPerDay = int(s.minutesPerDay, 10, 300, 60);

  // 0 here means Math.floor(minutes / 0) === Infinity items in a session queue.
  s.pace.newCard = num(s.pace.newCard, 0.05, 6, 0.55);
  s.pace.revCard = num(s.pace.revCard, 0.03, 6, 0.13);
  s.pace.quizQ = num(s.pace.quizQ, 0.05, 6, 0.75);
  s.pace.samples = int(s.pace.samples, 0, 1e6, 0);

  // Long days: junk keys and absurd budgets both dropped.
  for (const k of Object.keys(s.longDays)) {
    const v = int(s.longDays[k], 30, 480, null);
    if (!isDateKey(k) || v === null) delete s.longDays[k];
    else s.longDays[k] = v;
  }

  /* Enrolments. An unparseable examDate would give examMs() === NaN, and the
     scheduler's exam cap would then produce NaN due dates for every card in
     that course — cards that are neither due nor not-due. Drop the date rather
     than the enrolment, so the cert stays in the library. */
  for (const id of Object.keys(s.enrolled)) {
    const e = s.enrolled[id];
    if (!e || typeof e !== "object" || !CERT.byId(id)) { delete s.enrolled[id]; continue; }
    if (!isDateKey(e.examDate)) e.examDate = null;
    if (!MODES.includes(e.mode)) e.mode = "active";
    e.added = num(e.added, 0, 4e12, 0);
  }

  /* Progress. Orphans accumulate forever otherwise: delete a generated course,
     regenerate it, and the old card states stay in localStorage for good. */
  for (const cid of Object.keys(s.prog)) {
    const course = CERT.byId(cid);
    if (!course) { delete s.prog[cid]; continue; }
    const p = s.prog[cid];
    if (!p || typeof p !== "object") { delete s.prog[cid]; continue; }
    for (const k of ["d", "c", "q"]) if (!p[k] || typeof p[k] !== "object") p[k] = {};

    const domIds = new Set(course.domains.map(x => x.id));
    for (const did of Object.keys(p.d)) {
      if (!domIds.has(did)) { delete p.d[did]; continue; }
      const st = p.d[did];
      st.n = int(st.n, 0, 1e6, 0);
      st.c = int(st.c, 0, 1e6, 0);
      // c > n gives a negative Beta shape parameter, and the readiness sampler
      // then loops or returns NaN. This is the single most important clamp here.
      st.c = Math.min(st.c, st.n);
      st.ts = num(st.ts, 0, 4e12, 0);
    }

    const cardIds = new Set(course.cards.map(x => x.id));
    for (const id of Object.keys(p.c)) {
      if (!cardIds.has(id)) { delete p.c[id]; continue; }
      const st = p.c[id];
      // BOX_MIN[box] === undefined gives due = NaN and the card leaves every queue.
      st.box = int(st.box, 0, MAX_BOX, 0);
      st.due = num(st.due, 0, 4e12, Date.now());
      st.reps = int(st.reps, 0, 1e5, 0);
      st.lapses = int(st.lapses, 0, 1e5, 0);
      st.ts = num(st.ts, 0, 4e12, 0);
    }

    const qIds = new Set(course.questions.map(x => x.id));
    for (const id of Object.keys(p.q)) {
      if (!qIds.has(id)) { delete p.q[id]; continue; }
      const st = p.q[id];
      st.n = int(st.n, 0, 1e5, 0);
      st.c = int(st.c, 0, 1e5, 0);
      st.c = Math.min(st.c, st.n);
      st.ts = num(st.ts, 0, 4e12, 0);
    }
  }

  // Flags on questions that no longer exist.
  for (const qid of Object.keys(s.flagged)) {
    if (!s.flagged[qid] || !CERT.questionById(qid)) delete s.flagged[qid];
  }

  // Mocks: newest kept, orphans dropped.
  s.mocks = s.mocks
    .filter(m => m && typeof m === "object" && CERT.byId(m.courseId))
    .slice(-MAX_MOCKS);

  // A plan for another day, or one referencing deleted content, is regenerated.
  if (s.plan && (typeof s.plan !== "object" || s.plan.date !== dkey() || !Array.isArray(s.plan.items)
      || s.plan.items.some(i => !CERT.byId(i.courseId)))) {
    s.plan = null;
  }
  if (s.plan) {
    const ids = new Set(s.plan.items.map(i => i.id));
    s.plan.done = (Array.isArray(s.plan.done) ? s.plan.done : []).filter(x => ids.has(x));
  }

  const now = Date.now();
  if (s.session && (typeof s.session !== "object" || !(now - num(s.session.started, 0, 4e12, 0) < SESSION_TTL))) s.session = null;
  if (s.gen && (typeof s.gen !== "object" || typeof s.gen.chunks !== "object"
      || !(now - num(s.gen.started, 0, 4e12, 0) < GEN_TTL))) s.gen = null;

  // Log: drop junk keys, clamp counters.
  for (const k of Object.keys(s.log)) {
    if (!isDateKey(k) || !s.log[k] || typeof s.log[k] !== "object") { delete s.log[k]; continue; }
    s.log[k].minutes = num(s.log[k].minutes, 0, 1440, 0);
    s.log[k].cards = int(s.log[k].cards, 0, 1e5, 0);
    s.log[k].questions = int(s.log[k].questions, 0, 1e5, 0);
  }

  s.streak.days = int(s.streak.days, 0, 1e4, 0);
  if (!isDateKey(s.streak.last)) { s.streak.last = ""; s.streak.days = 0; }
  if (!isDateKey(s.fired.date)) { s.fired.date = ""; s.fired.keys = []; }
  if (!Array.isArray(s.fired.keys)) s.fired.keys = [];

  return s;
}

/* ═══════════════ LOAD / SAVE ═══════════════ */

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (e) { /* corrupt or unreadable — start clean rather than white-screen */ }
  return normalizeState(null);
}

/* Unlike a demo app, this one must not throw out of a click handler when the
   quota is hit: that would wedge the UI mid-session with no explanation. */
let quotaWarned = false;
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    quotaWarned = false;
  } catch (e) {
    if (!quotaWarned) {
      quotaWarned = true;
      toast("⚠️", "Could not save progress",
        "Storage is full. Export a backup from Settings, then delete a generated course.", 0);
    }
  }
}

/* ═══════════════ AI COURSE STORAGE ═══════════════ */

function loadAiCourses() {
  let list = [];
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (e) { list = []; }
  if (!Array.isArray(list)) list = [];
  // A course that fails validation is dropped here rather than left in the
  // picker to render an empty quiz.
  return list.map(c => normalizeCourse(c, "ai")).filter(Boolean);
}

function saveAiCourses() {
  const s = JSON.stringify(aiCourses);
  if (s.length * 2 > COURSES_QUOTA) throw new Error("QUOTA_COURSES");
  try { localStorage.setItem(COURSES_KEY, s); }
  catch (e) { throw new Error("QUOTA_COURSES"); }
}

function aiCoursesBytes() {
  try { return (localStorage.getItem(COURSES_KEY) || "").length * 2; } catch (e) { return 0; }
}

/* ═══════════════ BACKUP ═══════════════ */

/* One file round-trips both keys. Studying happens on the phone and the laptop
   and nothing syncs between them, so this is the only bridge that exists. */
function exportBackup() {
  const blob = new Blob([JSON.stringify({
    app: "certcram", v: 1, exported: new Date().toISOString(),
    state, courses: aiCourses,
  }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "certcram-backup-" + dkey() + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* Import validates by actually rendering, and rolls back if that throws. A
   backup that parses but breaks the app is worse than one that is rejected. */
function importBackup(text) {
  let data;
  try { data = JSON.parse(text); }
  catch (e) { throw new Error("That file is not valid JSON."); }
  if (!data || typeof data !== "object" || !data.state) throw new Error("That does not look like a CERTCRAM backup.");

  const prevState = state, prevCourses = aiCourses;
  try {
    aiCourses = (Array.isArray(data.courses) ? data.courses : []).map(c => normalizeCourse(c, "ai")).filter(Boolean);
    CERT.setAi(aiCourses);
    state = normalizeState(data.state);
    switchView("today");
  } catch (e) {
    state = prevState;
    aiCourses = prevCourses;
    CERT.setAi(aiCourses);
    switchView("today");
    throw new Error("That backup could not be loaded, so nothing was changed.");
  }
  save();
  try { saveAiCourses(); } catch (e) { /* progress is restored either way */ }
}

/* ═══════════════ PROGRESS ACCESSORS ═══════════════ */

/* Lazily create the progress record for a course. Called from the study loop,
   so it must never allocate more than once per course. */
function prog(courseId) {
  let p = state.prog[courseId];
  if (!p) p = state.prog[courseId] = { d: {}, c: {}, q: {} };
  return p;
}
const cardState = (courseId, id) => prog(courseId).c[id] || null;
function domStat(courseId, domainId) {
  const p = prog(courseId);
  return p.d[domainId] || (p.d[domainId] = { n: 0, c: 0, ts: 0 });
}

/* The certs the planner is allowed to consider: enrolled, not paused, and with
   a course still installed. */
function enrolledList() {
  return Object.keys(state.enrolled)
    .map(id => ({ id, ...state.enrolled[id], course: CERT.byId(id) }))
    .filter(e => e.course);
}

function todayMinutes(dateKey = dkey()) {
  return state.longDays[dateKey] || state.minutesPerDay;
}
