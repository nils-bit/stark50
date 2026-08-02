/* CERTCRAM — the daily plan generator.

   Three nested allocations:
     1. minutes across certifications, by deadline pressure
     2. minutes across domains within a certification, by 80/20 priority
     3. minutes into blocks, by how far through the prep window you are

   Mock anchors are placed before any of that, because a full-length mock does
   not fit inside an ordinary study day and would otherwise never be scheduled
   at all — leaving the readiness estimate permanently uncalibrated. */
"use strict";

/* Phase mix as a function of how much of the prep window is left. Early on the
   job is to build a base; in the middle, to drill; at the end, to simulate the
   real thing and fix what it exposes. */
function phaseMix(fracLeft) {
  if (fracLeft > 0.6) return { cards: 0.50, quiz: 0.40, review: 0.10 };
  if (fracLeft > 0.3) return { cards: 0.32, quiz: 0.53, review: 0.15 };
  return { cards: 0.20, quiz: 0.60, review: 0.20 };
}

/* Blocks shorter than this are noise — five separate four-minute blocks read as
   busywork and get skipped. Anything under the floor is folded into the largest
   block for that certification instead. */
const MIN_BLOCK = 5;
const MIN_CERT_SLICE = 10;

/* ═══════════════ HOW MUCH WORK IS LEFT ═══════════════ */

/* Minutes of work outstanding for one certification, in the user's measured
   pace. This is the numerator of the deadline-pressure ratio. */
function needMinutes(course) {
  const pace = state.pace;
  const now = Date.now();
  const p = prog(course.id);
  let m = 0;

  for (const card of course.cards) {
    const st = p.c[card.id];
    if (!st || !st.reps) m += pace.newCard;
    else if (st.due <= now) m += pace.revCard;
  }

  for (const d of course.domains) {
    const po = posterior(course.id, d.id);
    // Reaching the measurement floor is work in itself — you cannot close a gap
    // you have not measured.
    m += Math.max(0, N_MEASURED - po.n) * pace.quizQ;
    // Then the work of actually closing it, scaled by how much of the exam the
    // domain is worth.
    const target = Math.min(0.95, passFrac(course) + TARGET_MARGIN);
    m += Math.max(0, target - po.mean) * 100 * d.weight * pace.quizQ * 2;
  }

  for (const t of course.tasks || []) {
    if (!p.t || !p.t[t.id]) m += t.minutes;
  }

  return m;
}

/* ═══════════════ MOCK ANCHORS ═══════════════ */

/* How long the whole prep window is, measured from when the certification was
   added. Used to work out how far through it we are, which sets the phase mix
   and decides when each mock is due. Falls back to a week — the shape of the
   plan should not depend on a missing timestamp. */
function windowDays(enrolment) {
  if (!enrolment.examDate) return 7;
  const addedKey = enrolment.added ? dkey(new Date(enrolment.added)) : null;
  const span = addedKey ? daysBetween(addedKey, enrolment.examDate) : null;
  return Math.max(1, span === null || span < 1 ? 7 : span);
}

/* Which mock, if any, belongs on this date for this certification.

   The full-length mock is anchored at exam minus two days, never minus one: a
   mock you have no time to remediate is a diagnostic, not a study session. */
function mockAnchor(course, enrolment, dateKey) {
  const examDate = enrolment.examDate;
  if (!examDate) return null;
  const left = daysBetween(dateKey, examDate);
  if (left === null || left < 0) return null;

  const already = kind => state.mocks.some(m => m.courseId === course.id && m.kind === kind);

  if (left === 2 && !already("full")) return { kind: "full", ...course.mock.full };
  if (left === 1 && !already("full") && !already("half")) return { kind: "half", ...course.mock.half };

  const frac = left / windowDays(enrolment);
  if (frac <= 0.5 && !already("half") && left >= 3) return { kind: "half", ...course.mock.half };
  if (frac <= 0.7 && !already("quick") && !already("half")) return { kind: "quick", ...course.mock.quick };
  return null;
}

/* ═══════════════ ACROSS CERTIFICATIONS ═══════════════ */

function allocateCerts(dateKey) {
  const budget = todayMinutes(dateKey);

  let rows = enrolledList()
    .filter(e => e.mode !== "paused" && e.examDate)
    .map(e => {
      const days = daysBetween(dateKey, e.examDate);
      return { e, days, need: needMinutes(e.course) };
    })
    // An exam that has already happened stops consuming time.
    .filter(r => r.days !== null && r.days >= 0);

  if (!rows.length) return [];

  rows.forEach(r => {
    r.pressure = r.need / Math.max(1, r.days);
    // Maintenance mode: due reviews only, no new material, and it can never
    // claim more than a small slice however far behind it is.
    if (r.e.mode === "maintenance") r.pressure = Math.min(r.pressure, 8);
  });

  const total = rows.reduce((t, r) => t + r.pressure, 0) || 1;
  let out = rows.map(r => ({ r, min: budget * r.pressure / total }));

  /* Deadline lockout. An exam inside 48 hours takes at least 60% of the day
     whatever the proportional split says — a cert two weeks out has time to
     recover from a bad day and one sitting on Thursday does not. */
  const urgent = out.filter(o => o.r.days <= 2);
  const rest = out.filter(o => o.r.days > 2);
  if (urgent.length && rest.length && urgent.reduce((t, o) => t + o.min, 0) < 0.6 * budget) {
    const uT = urgent.reduce((t, o) => t + o.r.pressure, 0) || 1;
    const rT = rest.reduce((t, o) => t + o.r.pressure, 0) || 1;
    urgent.forEach(o => { o.min = 0.6 * budget * o.r.pressure / uT; });
    rest.forEach(o => { o.min = 0.4 * budget * o.r.pressure / rT; });
  }

  /* Anti-fragmentation. Three certifications sharing one hour usually produces
     a two-certification day, with the third dropped — which is correct, and is
     why maintenance mode exists as an explicit choice rather than a surprise. */
  out.forEach(o => { o.min = Math.round(o.min / 5) * 5; });
  const biggest = out.reduce((m, o) => (o.min > m.min ? o : m), out[0]);
  out.forEach(o => { if (o !== biggest && o.min < MIN_CERT_SLICE) { biggest.min += o.min; o.min = 0; } });

  return out.filter(o => o.min > 0);
}

/* ═══════════════ BUILD THE DAY ═══════════════ */

function buildDayPlan(dateKey = dkey()) {
  const budget = todayMinutes(dateKey);
  const slices = allocateCerts(dateKey);
  const items = [];
  const notices = [];

  for (const slice of slices) {
    const { e, days } = slice.r;
    const course = e.course;
    let minutes = slice.min;

    /* Mock anchor first. If a full mock does not fit in today's budget, say so
       rather than silently skipping it — a skipped mock is the difference
       between a calibrated readiness score and a guess. */
    const anchor = mockAnchor(course, e, dateKey);
    if (anchor) {
      if (anchor.minutes <= budget) {
        items.push({
          id: uid("m"), kind: "mock", courseId: course.id, minutes: anchor.minutes,
          mockKind: anchor.kind, count: anchor.count,
          label: anchor.kind === "full" ? "Full mock exam" : anchor.kind === "half" ? "Half mock" : "Quick mock",
        });
        minutes = Math.max(0, minutes - anchor.minutes);
      } else {
        notices.push({
          courseId: course.id,
          text: `Your ${anchor.minutes}-minute ${course.cert.code} mock needs a longer day than today's ${budget} minutes.`,
          fix: { dateKey, minutes: anchor.minutes + 10 },
        });
      }
    }

    if (minutes < MIN_BLOCK) continue;

    /* Phase mix from how far through the window we are. */
    const mix = phaseMix(clamp((days === null ? 7 : days) / windowDays(e), 0, 1));

    const prios = domainPriority(course);
    const priosMap = priorityMap(course);
    const prioTotal = prios.reduce((t, r) => t + r.priority, 0) || 1;

    const cardMin = minutes * mix.cards;
    const quizMin = minutes * mix.quiz;
    const reviewMin = minutes * mix.review;

    /* Cards go in one block covering the top domains — flipping cards is a
       single activity and splitting it into three named blocks is theatre. */
    if (cardMin >= MIN_BLOCK) {
      const perCard = 0.6 * state.pace.newCard + 0.4 * state.pace.revCard;
      const count = Math.max(1, Math.floor(cardMin / Math.max(0.05, perCard)));
      const cards = buildCardQueue(course.id, priosMap, count, days);
      if (cards.length) {
        const doms = [...new Set(cards.map(c => c.d))];
        items.push({
          id: uid("c"), kind: "cards", courseId: course.id, minutes: Math.round(cardMin),
          cardIds: cards.map(c => c.id), domainIds: doms,
          label: "Flashcards · " + doms.slice(0, 2).map(id => CERT.domainOf(course, id).name).join(", ")
                 + (doms.length > 2 ? ` +${doms.length - 2}` : ""),
        });
      }
    }

    /* Quiz blocks are split by domain, because that is where the 80/20 story is
       legible: "12 minutes on Governance, you have never tested it". */
    if (quizMin >= MIN_BLOCK) {
      let remaining = quizMin;
      const blocks = [];
      for (const row of prios) {
        if (remaining < MIN_BLOCK) break;
        const share = Math.round(quizMin * row.priority / prioTotal);
        if (share < MIN_BLOCK) continue;
        const take = Math.min(share, remaining);
        const count = Math.max(1, Math.floor(take / Math.max(0.05, state.pace.quizQ)));
        const qs = buildQuestionQueue(course.id, priosMap, count, row.domain.id);
        if (!qs.length) continue;
        blocks.push({
          id: uid("q"), kind: "quiz", courseId: course.id, minutes: Math.round(take),
          domainId: row.domain.id, questionIds: qs.map(q => q.id),
          label: "Quiz · " + row.domain.name,
          why: row.n === 0
            ? `Never tested, and ${pct(row.domain.weight)} of the exam`
            : `${pct(row.mean)} correct so far, ${pct(row.domain.weight)} of the exam`,
        });
        remaining -= take;
      }
      // Anything left over joins the highest-priority block rather than
      // becoming a three-minute stub.
      if (blocks.length && remaining >= 1) blocks[0].minutes += Math.round(remaining);
      items.push(...blocks);
    }

    /* Review: the key-points crib sheet for the weakest domain, or the misses
       from the most recent mock if there is one to remediate. */
    if (reviewMin >= MIN_BLOCK) {
      const lastMock = [...state.mocks].reverse().find(m => m.courseId === course.id && m.wrongIds && m.wrongIds.length);
      if (lastMock && !lastMock.reviewed) {
        items.push({
          id: uid("r"), kind: "review", courseId: course.id, minutes: Math.round(reviewMin),
          mockId: lastMock.id, label: "Review your mock mistakes",
          why: `${lastMock.wrongIds.length} questions you got wrong`,
        });
      } else if (prios.length) {
        items.push({
          id: uid("r"), kind: "keypoints", courseId: course.id, minutes: Math.round(reviewMin),
          domainId: prios[0].domain.id, label: "Key points · " + prios[0].domain.name,
          why: "The 80/20 crib sheet for your weakest domain",
        });
      }
    }

    /* Practicum deliverables are real work with real deadlines and are not
       quizzable, so they are scheduled as their own blocks. */
    const pending = (course.tasks || []).filter(t => !(prog(course.id).t || {})[t.id]);
    if (pending.length && days !== null && days <= 4) {
      const t = pending[0];
      items.push({
        id: uid("t"), kind: "task", courseId: course.id, minutes: Math.min(t.minutes, 30),
        taskId: t.id, label: "Practicum · " + t.title,
        why: `Due before the exam · ${pending.length} left`,
      });
    }
  }

  return { date: dateKey, minutes: budget, generated: Date.now(), items, notices, done: [] };
}

/* Rebuild when the day rolls over, when the inputs change, or after a mock —
   a mock moves every posterior at once. Never mid-session: a plan that
   reshuffles while it is being worked is the fastest way to stop trusting it. */
function ensurePlan(force = false) {
  if (force || !state.plan || state.plan.date !== dkey()) {
    const done = state.plan && state.plan.date === dkey() ? state.plan.done : [];
    state.plan = buildDayPlan();
    // Completions survive a regeneration only if the item still exists.
    const ids = new Set(state.plan.items.map(i => i.id));
    state.plan.done = done.filter(x => ids.has(x));
    save();
  }
  return state.plan;
}

const planItemDone = id => !!(state.plan && state.plan.done.includes(id));

function markPlanItemDone(id) {
  if (!state.plan || state.plan.done.includes(id)) return;
  state.plan.done.push(id);
  save();
}

/* Minutes of today's plan still outstanding. */
function planRemaining() {
  if (!state.plan) return 0;
  return state.plan.items.filter(i => !planItemDone(i.id)).reduce((t, i) => t + i.minutes, 0);
}

/* The single highest-yield thing to do right now — the answer the Today view
   leads with, and the target of its one big button. */
function nextPlanItem() {
  if (!state.plan) return null;
  return state.plan.items.find(i => !planItemDone(i.id)) || null;
}
