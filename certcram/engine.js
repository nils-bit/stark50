/* CERTCRAM — the 80/20 engine.

   Two numbers drive the whole app:

     domainPriority()  what to study next, ranked by weighted marks at risk
     readiness()       the probability of actually passing, honestly estimated

   Both model each domain's true accuracy as a Beta posterior rather than as a
   raw percentage. That is what lets the app tell the difference between "you
   scored 50% on this" and "you have never opened this" — a raw average cannot,
   and it is exactly the distinction that decides where an hour should go. */
"use strict";

/* Safety margin above the pass line. Aiming at the cut score means passing half
   the time; aiming five points above it means passing. */
const TARGET_MARGIN = 0.06;

/* Weight on uncertainty in the priority score. Tuned so that an untested domain
   outranks a domain measured about fifteen points below target — which is the
   behaviour that makes this an 80/20 engine rather than a weakness-chaser. */
const LAMBDA = 0.7;

/* Attempts before a domain counts as measured rather than guessed at. */
const N_MEASURED = 12;

/* Beta prior. (2,2) is weakly informative: mean 0.5, but with enough spread
   that an untested domain carries visible uncertainty into everything. */
const PRIOR_A = 2, PRIOR_B = 2;

/* Generated question banks are calibrated to themselves, not to the real exam,
   so observed ability on them is shrunk toward chance. */
const KAPPA_AI = 0.82;

/* Chance level on a four-choice question. */
const CHANCE = 0.25;

/* Posterior for one domain. */
function posterior(courseId, domainId) {
  const st = prog(courseId).d[domainId] || { n: 0, c: 0, ts: 0 };
  const a = PRIOR_A + st.c;
  const b = PRIOR_B + (st.n - st.c);
  const mean = a / (a + b);
  const sd = Math.sqrt((a * b) / ((a + b) * (a + b) * (a + b + 1)));
  return { a, b, mean, sd, n: st.n, correct: st.c, ts: st.ts };
}

/* Rank domains by weighted expected marks lost, plus a bonus for uncertainty.

     P(d) = weight · [ max(0, target − mean) + λ·sd ] · staleness

   The uncertainty term is the part that matters. An untested 15%-weight domain
   is a bigger threat than a measured-weak 21%-weight domain, because you do not
   yet know how bad it is and finding out is cheap. Once a dozen questions have
   been answered its sd collapses and it demotes itself if it turns out fine. */
function domainPriority(course, target = null) {
  const T = target === null ? Math.min(0.95, passFrac(course) + TARGET_MARGIN) : target;
  const now = Date.now();

  return course.domains.map(d => {
    const po = posterior(course.id, d.id);
    // Staleness nudge, capped at three days so an ignored domain surfaces again
    // without letting one untouched week dominate everything else.
    const staleDays = po.ts ? Math.min(3, (now - po.ts) / 864e5) : 3;
    const rho = 1 + 0.15 * staleDays;
    const p = d.weight * (Math.max(0, T - po.mean) + LAMBDA * po.sd) * rho;
    return { domain: d, ...po, target: T, priority: p };
  }).sort((a, b) => b.priority - a.priority);
}

/* Normalized {domainId: priority} for the queue builders in srs.js. */
function priorityMap(course) {
  const rows = domainPriority(course);
  const total = rows.reduce((t, r) => t + r.priority, 0) || 1;
  const out = {};
  for (const r of rows) out[r.domain.id] = r.priority / total;
  return out;
}

/* How well covered a domain is, for the UI's untouched/weak/solid tag. */
function domainTag(po, target) {
  if (!po.n) return { cls: "untouched", label: "untested" };
  if (po.n < N_MEASURED) return { cls: "weak", label: po.n + " answered" };
  return po.mean >= target ? { cls: "solid", label: pct(po.mean) } : { cls: "weak", label: pct(po.mean) };
}

/* ═══════════════ READINESS ═══════════════

   A weighted average of accuracies is not a readiness score. It ignores two
   things that decide whether someone passes:

     1. Untested domains are guesswork, not a 50% you have earned.
     2. A 60-question exam is a small sample. A true 78% ability against a 75%
        cut still fails roughly a quarter of the time. That gap is exam-day
        luck, and it is real.

   So: sample each domain's ability from its Beta posterior, run the binomial
   draw for that domain's share of the paper, and count how often the simulated
   candidate clears the line. */

/* Beta(a,b) for integer shape parameters, via two Erlang sums. a and b here are
   always integers (2 + correct, 2 + wrong), so this is exact and needs no
   rejection loop. */
function rgammaInt(k) {
  let s = 0;
  for (let i = 0; i < k; i++) s -= Math.log(1 - Math.random());
  return s;
}
function rbeta(a, b) {
  const x = rgammaInt(a);
  return x / (x + rgammaInt(b));
}

function readiness(course, sims = 2000) {
  const N = course.exam.questionCount;
  const need = passRaw(course);
  const kappa = course.source === "ai" ? KAPPA_AI : 1.0;

  // Questions of the paper each domain owns, largest-remainder so the parts sum
  // to N exactly rather than to 59 or 61.
  const parts = course.domains.map(d => {
    const po = posterior(course.id, d.id);
    return { d, po, exact: d.weight * N, k: 0 };
  });
  parts.forEach(p => { p.k = Math.floor(p.exact); });
  let short = N - parts.reduce((t, p) => t + p.k, 0);
  const byRemainder = parts.slice().sort((a, b) => (b.exact - b.k) - (a.exact - a.k));
  for (let i = 0; short > 0; i++, short--) byRemainder[i % byRemainder.length].k++;

  let passes = 0, totalRight = 0;
  for (let i = 0; i < sims; i++) {
    let right = 0;
    for (const p of parts) {
      // Shrink toward chance: on a generated bank, and always for the portion
      // of ability that has not actually been demonstrated.
      const theta = CHANCE + kappa * (rbeta(p.po.a, p.po.b) - CHANCE);
      for (let q = 0; q < p.k; q++) if (Math.random() < theta) right++;
    }
    totalRight += right;
    if (right >= need) passes++;
  }

  // Coverage: how much of the exam's weight has actually been measured.
  let coverage = 0, untestedWeight = 0;
  const untested = [];
  for (const p of parts) {
    coverage += p.d.weight * Math.min(1, p.po.n / N_MEASURED);
    if (!p.po.n) { untestedWeight += p.d.weight; untested.push(p.d.name); }
  }

  return {
    pPass: passes / sims,
    expected: totalRight / sims / N,
    needFrac: need / N,
    need, total: N,
    coverage, untestedWeight, untested,
    calibrated: course.source !== "ai",
  };
}

/* Readiness is ~15 ms for 2000 sims across seven domains — cheap, but not cheap
   enough to run on every card grade. Cached per course and invalidated whenever
   an answer, a mock or an import changes the posteriors. */
const readyCache = new Map();
function readinessCached(course) {
  const hit = readyCache.get(course.id);
  if (hit) return hit;
  const r = readiness(course);
  readyCache.set(course.id, r);
  return r;
}
const invalidateReadiness = courseId => {
  if (courseId) readyCache.delete(courseId); else readyCache.clear();
};

/* ═══════════════ RECORDING ═══════════════ */

/* One graded flashcard. Cards do not feed the domain posterior: a self-reported
   "I knew that" is not evidence of exam performance, and mixing it into the
   same statistic as answered questions would make readiness a measure of
   confidence rather than of accuracy. */
function recordCard(courseId, card, grade) {
  const p = prog(courseId);
  const st = p.c[card.id] || (p.c[card.id] = newCardState());
  const e = state.enrolled[courseId];
  schedule(st, card.x, grade, Date.now(), e && e.examDate ? examMs(e.examDate) : null);
  bumpLog("cards", 1);
  save();
}

/* One answered question. This is the only thing that moves readiness. */
function recordAnswer(courseId, question, correct) {
  const p = prog(courseId);
  const q = p.q[question.id] || (p.q[question.id] = { n: 0, c: 0, ts: 0 });
  q.n++; if (correct) q.c++; q.ts = Date.now();

  const d = domStat(courseId, question.d);
  d.n++; if (correct) d.c++; d.ts = Date.now();

  invalidateReadiness(courseId);
  bumpLog("questions", 1);
  save();
}

/* Grade an answer. Multi-select is all-or-nothing, the way the real exams
   score it — partial credit would flatter the readiness estimate. */
function isCorrect(question, picked) {
  const a = question.a, p = [...new Set(picked)].sort((m, n) => m - n);
  return a.length === p.length && a.every((v, i) => v === p[i]);
}

/* Flag a question whose answer key looks wrong. Generated keys are unverified,
   and a wrong one trains the wrong answer while poisoning the domain posterior
   in the direction that matters most. Flagged questions leave every queue. */
function flagQuestion(qid) {
  state.flagged[qid] = true;
  const q = CERT.questionById(qid);
  if (q) {
    const courseId = String(qid).split(":")[0];
    invalidateReadiness(courseId);
  }
  save();
}

/* ═══════════════ PACE ═══════════════

   Every minutes-to-items conversion in plan.js reads state.pace. Seeded with
   plausible defaults and then replaced by measurement, because a plan built on
   someone else's speed over-books every day until it gets ignored. */
function updatePace(kind, itemCount, elapsedMs) {
  if (!itemCount || !(elapsedMs > 0)) return;
  const measured = clamp(elapsedMs / 60000 / itemCount, 0.03, 6);
  const key = kind === "quiz" ? "quizQ" : kind === "new" ? "newCard" : "revCard";
  const prior = state.pace[key];
  // EWMA at 0.3 — fast enough to adapt within a couple of sessions, slow enough
  // that one interrupted block does not rewrite the whole plan.
  state.pace[key] = prior * 0.7 + measured * 0.3;
  state.pace.samples++;
  save();
}

/* ═══════════════ LOG & STREAK ═══════════════ */

function bumpLog(field, n) {
  const k = dkey();
  const row = state.log[k] || (state.log[k] = { minutes: 0, cards: 0, questions: 0 });
  row[field] = (row[field] || 0) + n;

  if (state.streak.last !== k) {
    const gap = state.streak.last ? daysBetween(state.streak.last, k) : null;
    state.streak.days = gap === 1 ? state.streak.days + 1 : 1;
    state.streak.last = k;
  }
}

function logMinutes(ms) {
  const k = dkey();
  const row = state.log[k] || (state.log[k] = { minutes: 0, cards: 0, questions: 0 });
  row.minutes = clamp(row.minutes + ms / 60000, 0, 1440);
}

/* Minutes studied today, for the Today view's progress ring. */
const minutesToday = () => (state.log[dkey()] || {}).minutes || 0;
