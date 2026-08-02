/* CERTCRAM — the course registry.

   A course is immutable content. Nothing in here is ever mutated by studying —
   all mutable state lives in state.prog, keyed by the ids assigned below. That
   separation is what lets built-in courses live in JS files outside
   localStorage while generated ones live inside it, with one renderer for both.

   Course shape (short keys, because a generated course is stringified into
   localStorage and long keys cost ~18% of the payload across 120 questions):

     { id, schema, source, built, cert:{code,name,vendor,blurb},
       exam:{questionCount,timeLimitMin,passMode,passValue,scaledMax,multiSelect},
       domains:[{id,name,weight,summary,keyPoints[],objectives[]}],
       cards:[{id,d,x,f,b}],                       f=front b=back x=difficulty 1-3
       questions:[{id,d,x,s,c[],a[],e}],           s=stem c=choices a=answer idxs e=why
       tasks:[{id,d,title,minutes,detail}],        practicum deliverables
       mock:{full,half,quick} }                                                   */
"use strict";

/* Course files load after this one and push their raw objects here. boot()
   registers them, which is what validates and normalizes each one. Declared on
   window explicitly so the course files cannot run before it exists. */
window.CERT_COURSES = window.CERT_COURSES || [];

const CERT = (() => {
  const builtin = [];
  let ai = [];
  let index = new Map();

  function reindex() {
    index = new Map();
    for (const c of builtin.concat(ai)) index.set(c.id, c);
  }

  return {
    /* Called by each courses/*.js at load time. A course that fails validation
       is skipped with a console warning rather than taking the app down. */
    register(raw) {
      const c = normalizeCourse(raw, "builtin");
      if (!c) { console.warn("CERTCRAM: skipped invalid built-in course", raw && raw.id); return; }
      builtin.push(c);
      reindex();
    },
    setAi(list) { ai = list || []; reindex(); },
    all() { return builtin.concat(ai); },
    builtin() { return builtin.slice(); },
    ai() { return ai.slice(); },
    byId(id) { return index.get(id) || null; },
    domainOf(course, id) { return course.domains.find(d => d.id === id) || null; },
    cardById(id) {
      const c = index.get(String(id).split(":")[0]);
      return c ? c.cards.find(x => x.id === id) || null : null;
    },
    questionById(id) {
      const c = index.get(String(id).split(":")[0]);
      return c ? c.questions.find(x => x.id === id) || null : null;
    },
  };
})();

/* ═══════════════ NORMALIZE ═══════════════

   Applied to built-in and generated courses alike, so "one renderer handles
   both" is enforced in code rather than by convention. Returns null for a
   course with nothing usable in it.

   IDs are assigned here, never taken from the source. A model generating a
   course in eight separate calls will reuse and collide ids; authored content
   drifts as it is edited. Reassigning unconditionally makes both safe. */
function normalizeCourse(raw, source) {
  if (!raw || typeof raw !== "object") return null;

  const id = String(raw.id || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!id) return null;

  const c = {
    id,
    schema: 1,
    source: source === "ai" ? "ai" : "builtin",
    built: String(raw.built || dkey()).slice(0, 10),
    cert: {
      code: txt(raw.cert && raw.cert.code, 24) || id.toUpperCase(),
      name: txt(raw.cert && raw.cert.name, 90) || id,
      vendor: txt(raw.cert && raw.cert.vendor, 60),
      blurb: txt(raw.cert && raw.cert.blurb, 240),
    },
    /* Where the domain weights came from, when they are not all official.
       These weights drive the entire study plan, so a course built on inferred
       ones has to say so somewhere the user actually looks — not only in a
       comment at the top of the file. */
    weightsNote: txt(raw.weightsNote, 400),
  };

  const ex = raw.exam || {};
  c.exam = {
    questionCount: int(ex.questionCount, 10, 300, 60),
    timeLimitMin: int(ex.timeLimitMin, 5, 480, 90),
    passMode: ex.passMode === "raw" ? "raw" : "scaled",
    passValue: int(ex.passValue, 1, 100000, 720),
    scaledMax: int(ex.scaledMax, 0, 100000, 1000),
    multiSelect: !!ex.multiSelect,
    note: txt(ex.note, 200),
  };
  if (c.exam.passMode === "raw") {
    c.exam.scaledMax = 0;
    c.exam.passValue = clamp(c.exam.passValue, 1, c.exam.questionCount);
  } else if (c.exam.scaledMax <= 0) {
    c.exam.scaledMax = 1000;
  }

  /* Domains. Duplicate slugs would silently merge two domains' statistics, so
     later duplicates are dropped rather than renamed. */
  const seen = new Set();
  c.domains = (Array.isArray(raw.domains) ? raw.domains : []).map(d => {
    const did = String((d && d.id) || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
    if (!did || seen.has(did) || !d || !txt(d.name, 90)) return null;
    seen.add(did);
    return {
      id: did,
      name: txt(d.name, 90),
      weight: num(d.weight, 0, 1, 0),
      summary: txt(d.summary, 600),
      keyPoints: strList(d.keyPoints, 24, 300),
      objectives: strList(d.objectives, 12, 200),
    };
  }).filter(Boolean).filter(d => d.weight > 0);

  if (!c.domains.length) return null;

  // Renormalize so weights sum to exactly 1 — authors typo, and models are
  // asked for a sum of 1 but the schema cannot enforce it.
  const wsum = c.domains.reduce((t, d) => t + d.weight, 0);
  c.domains.forEach(d => { d.weight = d.weight / wsum; });

  const domIds = new Set(c.domains.map(d => d.id));

  /* Cards. Index-based ids are stable as long as order is stable, which is what
     lets progress survive a course file being edited to fix a typo. */
  c.cards = (Array.isArray(raw.cards) ? raw.cards : []).map(x => {
    if (!x || !domIds.has(x.d)) return null;
    const f = txt(x.f, 240), b = txt(x.b, 700);
    if (!f || !b) return null;
    return { d: x.d, x: int(x.x, 1, 3, 2), f, b };
  }).filter(Boolean);
  c.cards.forEach((x, i) => { x.id = id + ":" + x.d + ":c" + i; });

  /* Questions. Everything that could mistrain the user is dropped outright: a
     question with an out-of-range answer index, or a multi-select item on a
     single-answer exam, teaches the wrong thing and poisons the domain
     posterior in the direction that matters. */
  const stems = new Set();
  c.questions = (Array.isArray(raw.questions) ? raw.questions : []).map(x => {
    if (!x || !domIds.has(x.d)) return null;
    const s = txt(x.s, 700);
    if (!s) return null;
    const key = s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    if (stems.has(key)) return null;

    const choices = strList(x.c, 6, 400);
    if (choices.length < 2) return null;
    if (new Set(choices.map(t => t.toLowerCase())).size !== choices.length) return null;

    let a = Array.isArray(x.a) ? x.a : [x.a];
    a = [...new Set(a.map(n => Math.round(Number(n))))].filter(n => Number.isFinite(n) && n >= 0 && n < choices.length);
    if (!a.length || a.length === choices.length) return null;
    if (a.length > 1 && !c.exam.multiSelect) return null;

    stems.add(key);
    return { d: x.d, x: int(x.x, 1, 3, 2), s, c: choices, a: a.sort((m, n) => m - n), e: txt(x.e, 900) };
  }).filter(Boolean);
  c.questions.forEach((x, i) => { x.id = id + ":" + x.d + ":q" + i; });

  if (!c.questions.length) return null;

  /* Practicum deliverables — non-quizzable, excluded from readiness, tracked as
     a checklist. HubSpot Certified Trainer is gated on these, not on the quiz. */
  c.tasks = (Array.isArray(raw.tasks) ? raw.tasks : []).map(t => {
    if (!t || !txt(t.title, 200)) return null;
    return {
      d: domIds.has(t.d) ? t.d : c.domains[0].id,
      title: txt(t.title, 200),
      minutes: int(t.minutes, 5, 480, 30),
      detail: txt(t.detail, 800),
    };
  }).filter(Boolean);
  c.tasks.forEach((t, i) => { t.id = id + ":t" + i; });

  /* Mock sizes. A full mock can never ask for more questions than exist, or the
     exam renderer runs out mid-paper. */
  const full = Math.min(c.exam.questionCount, c.questions.length);
  c.mock = {
    full: { count: full, minutes: c.exam.timeLimitMin },
    half: { count: Math.max(6, Math.round(full / 2)), minutes: Math.round(c.exam.timeLimitMin / 2) },
    quick: { count: Math.max(5, Math.min(15, full)), minutes: Math.max(8, Math.round(c.exam.timeLimitMin / 5)) },
  };

  return c;
}

/* ═══════════════ FIELD COERCION ═══════════════ */

/* Trim, cap length, and strip angle brackets. esc() already protects the DOM,
   but stripping here means a stored course can never carry markup at all —
   belt and braces, because this content originates in a pasted file. */
function txt(v, max) {
  return String(v == null ? "" : v).replace(/[<>]/g, "").trim().slice(0, max);
}

function strList(v, maxItems, maxLen) {
  if (!Array.isArray(v)) return [];
  return v.map(x => txt(x, maxLen)).filter(Boolean).slice(0, maxItems);
}

/* ═══════════════ DERIVED ═══════════════ */

const cardsInDomain = (course, did) => course.cards.filter(c => c.d === did);
const questionsInDomain = (course, did) => course.questions.filter(q => q.d === did);

/* Questions available to drill or examine: flagged ones are excluded
   everywhere, because a wrong answer key trains the wrong answer. */
const liveQuestions = course => course.questions.filter(q => !state.flagged[q.id]);

/* The raw number of correct answers this exam needs. Both pass modes collapse
   to this, so the mock scorer and the readiness model share one comparison. */
function passRaw(course) {
  const N = course.exam.questionCount;
  return course.exam.passMode === "raw"
    ? Math.min(course.exam.passValue, N)
    : Math.ceil(N * (course.exam.passValue / course.exam.scaledMax));
}

/* Fraction of questions needed to pass — the line every readiness dial is drawn against. */
const passFrac = course => passRaw(course) / course.exam.questionCount;

/* Present a raw correct count in the exam's own units, so the mock result reads
   the way the real score report will. */
function formatScore(course, correct, total) {
  if (course.exam.passMode === "raw") return correct + " / " + total;
  const scaled = Math.round(course.exam.scaledMax * (correct / Math.max(1, total)));
  return String(clamp(scaled, 100, course.exam.scaledMax));
}
