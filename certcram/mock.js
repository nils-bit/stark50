/* CERTCRAM — timed mock exams.

   A mock is the only thing that calibrates the readiness estimate against
   reality, so it mirrors the real paper: the same question count, the same
   clock, the same scoring, no explanations until the end.

   The in-flight exam lives in state.session and is saved after every answer. A
   120-minute paper on a phone will be interrupted — by a call, by the screen
   locking, by the tab being evicted — and losing an hour of work to that would
   mean nobody ever sits one. */
"use strict";

let mockTimer = null;

function startMock(courseId, kind, planItemId = null) {
  const course = CERT.byId(courseId);
  if (!course) return;
  const cfg = course.mock[kind] || course.mock.half;
  const qs = sampleMock(courseId, cfg.count);

  if (qs.length < 3) {
    toast("⚠️", "Not enough questions", "This course does not have enough usable questions for a mock yet.");
    return;
  }

  state.session = {
    kind: "mock", id: uid("mk"), courseId, mockKind: kind, planItemId,
    qIds: qs.map(q => q.id), answers: {}, idx: 0,
    startedAt: Date.now(), limitMs: cfg.minutes * 60000,
  };
  save();
  switchView("mock");
}

const mockActive = () => !!(state.session && state.session.kind === "mock");

/* Elapsed time is always derived from the wall clock, never accumulated from
   interval ticks. iOS Safari throttles background timers to about 1 Hz and
   stops them entirely when the tab is hidden, so an accumulator would undercount
   by minutes across a two-hour paper — in the candidate's favour, which makes
   the mock useless as a rehearsal. */
const mockElapsed = () => Date.now() - state.session.startedAt;
const mockLeft = () => Math.max(0, state.session.limitMs - mockElapsed());

/* ═══════════════ VIEW ═══════════════ */

function renderMock(wrap) {
  if (mockActive()) return renderMockPaper(wrap);

  const last = [...state.mocks].reverse();
  const certs = enrolledList();

  wrap.innerHTML = `
    <div class="card">
      <div class="card-kicker signal">Why this matters</div>
      <h2>A mock is the only honest input</h2>
      <p class="muted tiny" style="margin-top:0.6rem">Flashcards measure recognition. A timed paper under the real clock measures whether you pass. Until you sit one, your readiness score is mostly inference from small samples.</p>
    </div>

    <div class="section-title">Sit a paper<span class="st-line"></span></div>
    ${certs.length ? certs.map(e => {
      const c = e.course;
      const r = readinessCached(c);
      return `
      <div class="card">
        <div class="card-kicker">${esc(c.cert.vendor || "")} · pass at ${esc(pct(passFrac(c)))}</div>
        <h3>${esc(c.cert.name)}</h3>
        <div class="tiny faint" style="margin-top:0.35rem">Real exam: ${c.exam.questionCount} questions in ${esc(fmtMin(c.exam.timeLimitMin))}</div>
        <div class="chip-row" style="margin-top:0.9rem">
          <button class="chip" data-mock="quick" data-course="${esc(c.id)}">Quick · ${c.mock.quick.count} Q / ${c.mock.quick.minutes} min</button>
          <button class="chip" data-mock="half" data-course="${esc(c.id)}">Half · ${c.mock.half.count} Q / ${c.mock.half.minutes} min</button>
          <button class="chip" data-mock="full" data-course="${esc(c.id)}">Full · ${c.mock.full.count} Q / ${c.mock.full.minutes} min</button>
        </div>
        <div class="tiny faint" style="margin-top:0.7rem">Current estimate: ${esc(pct(r.pPass))} chance of passing</div>
      </div>`;
    }).join("") : `<div class="card"><p class="muted">Add a certification first, from the <strong>Certs</strong> tab.</p></div>`}

    ${last.length ? `
      <div class="section-title">Past papers<span class="st-line"></span></div>
      ${last.slice(0, 8).map(m => {
        const c = CERT.byId(m.courseId);
        const passed = m.correct >= m.need;
        return `
        <div class="card">
          <div class="card-kicker">${esc(prettyDate(m.date))} · ${esc(m.kind)} · ${esc(c ? c.cert.code : "")}</div>
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:1rem">
            <h3 style="color:var(--${passed ? "pass" : "fail"})">${esc(c ? formatScore(c, m.correct, m.total) : m.correct + "/" + m.total)}</h3>
            <span class="tiny faint">${m.correct}/${m.total} correct · needed ${m.need}</span>
          </div>
          <button class="btn ghost small" data-review="${esc(m.id)}" style="margin-top:0.8rem">See breakdown</button>
        </div>`;
      }).join("")}
    ` : ""}
  `;

  $$("[data-mock]", wrap).forEach(b => b.onclick = () => {
    const c = CERT.byId(b.dataset.course);
    const cfg = c.mock[b.dataset.mock];
    askConfirm(
      `Start a ${cfg.minutes}-minute paper?`,
      `${cfg.count} questions under a real clock. The timer keeps running if you close the app, exactly like the real exam.`,
      "Start the clock",
      () => startMock(c.id, b.dataset.mock));
  });
  $$("[data-review]", wrap).forEach(b => b.onclick = () => showMockResult(state.mocks.find(m => m.id === b.dataset.review)));
}

/* ═══════════════ THE PAPER ═══════════════ */

function renderMockPaper(wrap) {
  const s = state.session;
  const course = CERT.byId(s.courseId);
  if (!course) { state.session = null; save(); return switchView("mock"); }

  if (mockLeft() <= 0) return finishMock(true);

  const q = course.questions.find(x => x.id === s.qIds[s.idx]);
  if (!q) { s.idx = Math.min(s.idx, s.qIds.length - 1); return finishMock(false); }

  const picked = s.answers[q.id] || [];
  const multi = q.a.length > 1;
  const answeredCount = Object.keys(s.answers).length;

  wrap.innerHTML = `
    <div class="exam-bar">
      <div>
        <div class="card-kicker" style="margin:0">${esc(course.cert.code)} · question ${s.idx + 1} of ${s.qIds.length}</div>
        <div class="tiny faint">${answeredCount} answered</div>
      </div>
      <div class="exam-clock${mockLeft() < 300000 ? " low" : ""}" id="examClock">${fmtClock(mockLeft() / 1000)}</div>
    </div>
    ${pbar(answeredCount / s.qIds.length)}

    <div class="card" style="margin-top:1.1rem">
      <p style="font-size:1.02rem">${esc(q.s)}</p>
      ${multi ? `<div class="tiny faint" style="margin-top:0.5rem">Select all that apply.</div>` : ""}
    </div>

    <div>
      ${q.c.map((choice, i) => `
        <button class="opt${picked.includes(i) ? " correct" : ""}" data-opt="${i}">
          <span class="opt-key">${"ABCD"[i] || i + 1}</span>${esc(choice)}
        </button>`).join("")}
    </div>

    <div class="ob-actions" style="margin-top:0.8rem">
      <button class="btn ghost" id="mPrev" ${s.idx === 0 ? "disabled" : ""}>Previous</button>
      <button class="btn" id="mNext">${s.idx + 1 >= s.qIds.length ? "Review and submit" : "Next"}</button>
    </div>
    <div style="margin-top:1.4rem">
      <button class="btn ghost small" id="mSubmit">Submit now</button>
      <button class="btn ghost small" id="mAbandon">Abandon paper</button>
    </div>
  `;

  $$("[data-opt]", wrap).forEach(b => b.onclick = () => {
    const i = Number(b.dataset.opt);
    const cur = s.answers[q.id] || [];
    if (multi) {
      s.answers[q.id] = cur.includes(i) ? cur.filter(x => x !== i) : cur.concat([i]);
      if (!s.answers[q.id].length) delete s.answers[q.id];
    } else {
      s.answers[q.id] = [i];
    }
    save();     // every answer persisted: a lost hour means nobody sits a second one
    switchView("mock");
  });

  $("#mPrev", wrap).onclick = () => { s.idx = Math.max(0, s.idx - 1); save(); switchView("mock"); };
  $("#mNext", wrap).onclick = () => {
    if (s.idx + 1 >= s.qIds.length) return confirmSubmit();
    s.idx++; save(); switchView("mock");
  };
  $("#mSubmit", wrap).onclick = confirmSubmit;
  $("#mAbandon", wrap).onclick = () => askConfirm(
    "Abandon this paper?",
    "Nothing is recorded and your readiness estimate does not change.",
    "Abandon", () => { stopMockClock(); state.session = null; save(); switchView("mock"); }, true);

  startMockClock();
}

function confirmSubmit() {
  const s = state.session;
  const unanswered = s.qIds.length - Object.keys(s.answers).length;
  askConfirm(
    "Submit this paper?",
    unanswered ? `${unanswered} question${unanswered === 1 ? "" : "s"} left blank. Blanks score zero, exactly as on the real exam.`
               : "All questions answered.",
    "Submit", () => finishMock(false));
}

/* The clock re-renders only its own element. Re-rendering the whole view every
   second would fight the user's scroll position and drop taps. */
function startMockClock() {
  stopMockClock();
  mockTimer = setInterval(() => {
    if (!mockActive()) return stopMockClock();
    const el = $("#examClock");
    if (!el) return;
    const left = mockLeft();
    el.textContent = fmtClock(left / 1000);
    el.classList.toggle("low", left < 300000);
    if (left <= 0) finishMock(true);
  }, 1000);
}
function stopMockClock() {
  if (mockTimer) clearInterval(mockTimer);
  mockTimer = null;
}

/* ═══════════════ SCORING ═══════════════ */

function finishMock(timedOut) {
  const s = state.session;
  if (!s) return;
  stopMockClock();
  const course = CERT.byId(s.courseId);
  if (!course) { state.session = null; save(); return switchView("mock"); }

  const byDomain = {};
  const wrongIds = [];
  let correct = 0;

  for (const qid of s.qIds) {
    const q = course.questions.find(x => x.id === qid);
    if (!q) continue;
    const picked = s.answers[qid] || [];
    const ok = picked.length > 0 && isCorrect(q, picked);
    if (ok) correct++; else wrongIds.push(qid);

    const row = byDomain[q.d] || (byDomain[q.d] = { n: 0, c: 0 });
    row.n++; if (ok) row.c++;

    // A mock's answers feed the same posteriors as a drill, because they are
    // the same evidence — better evidence, in fact, since they were produced
    // under time pressure.
    recordAnswer(s.courseId, q, ok);
  }

  const total = s.qIds.length;
  const need = Math.ceil(total * passFrac(course));
  const result = {
    id: s.id, courseId: s.courseId, kind: s.mockKind, date: dkey(),
    startedAt: s.startedAt, elapsedMs: mockElapsed(), timedOut: !!timedOut,
    correct, total, need, byDomain, wrongIds, reviewed: false,
  };

  state.mocks.push(result);
  if (state.mocks.length > MAX_MOCKS) state.mocks = state.mocks.slice(-MAX_MOCKS);
  if (s.planItemId) markPlanItemDone(s.planItemId);
  state.session = null;

  invalidateReadiness(s.courseId);
  logMinutes(result.elapsedMs);
  // A mock moves every posterior at once, so the rest of today's plan is now
  // built on stale inputs. This is the one mid-day regeneration that is right.
  ensurePlan(true);
  save();

  showMockResult(result);
  switchView("mock");
}

function showMockResult(m) {
  if (!m) return;
  const course = CERT.byId(m.courseId);
  if (!course) return;
  const passed = m.correct >= m.need;
  const r = readinessCached(course);

  const rows = course.domains.map(d => {
    const row = m.byDomain[d.id];
    if (!row || !row.n) return "";
    const frac = row.c / row.n;
    const cls = frac >= passFrac(course) ? "pass" : frac >= passFrac(course) - 0.15 ? "warn" : "fail";
    return `
      <div class="dom-row">
        <div class="dom-name">${esc(d.name)}</div>
        <div class="dom-weight">${row.c}/${row.n}</div>
        <div class="dom-bar">${pbar(frac, cls)}</div>
      </div>`;
  }).join("");

  openModal(`
    <div class="card-kicker signal">${esc(m.kind)} paper · ${esc(fmtMin(m.elapsedMs / 60000))}${m.timedOut ? " · time expired" : ""}</div>
    <h2>${passed ? "Pass" : "Not yet"}</h2>
    <div class="result-score ${passed ? "pass" : "fail"}" style="margin:0.8rem 0 0.2rem">${esc(formatScore(course, m.correct, m.total))}</div>
    <div class="tiny faint">${m.correct} of ${m.total} correct · needed ${m.need} (${esc(pct(passFrac(course)))})</div>

    <div class="section-title" style="margin-top:1.6rem">By domain<span class="st-line"></span></div>
    ${rows || `<p class="faint tiny">No per-domain data.</p>`}

    <div class="card flat" style="margin-top:1.2rem;padding:0">
      <div class="tiny faint">Updated estimate: <strong style="color:var(--ink)">${esc(pct(r.pPass))}</strong> chance of passing the real exam${r.calibrated ? "" : " (from self-generated questions, so treat it as indicative)"}.</div>
    </div>

    <div class="ob-actions">
      ${m.wrongIds.length ? `<button class="btn" id="mkReview">Review ${m.wrongIds.length} mistakes</button>` : ""}
      <button class="btn ghost" id="mkClose">Close</button>
    </div>`);

  $("#mkClose").onclick = closeModal;
  const rev = $("#mkReview");
  if (rev) rev.onclick = () => {
    const qs = m.wrongIds.map(id => course.questions.find(q => q.id === id)).filter(Boolean);
    m.reviewed = true;
    save();
    closeModal();
    startDrill("quiz", course.id, qs, { label: "Mock mistakes" });
  };
}
