/* CERTCRAM — the drill loop.

   One screen, one item, two taps. Everything here is built for a thumb: the
   answer buttons sit at the bottom of the viewport, targets are large, and
   nothing important lives in the top third of a phone screen. */
"use strict";

let drill = null;

/* Start a block. `items` are card or question objects already chosen by the
   80/20 queue builders — this module never decides what to study, only how. */
function startDrill(kind, courseId, items, opts = {}) {
  if (!items || !items.length) {
    toast("✓", "Nothing due", "That block has no cards or questions waiting.");
    return;
  }
  drill = {
    kind, courseId, items,
    idx: 0, started: Date.now(), itemStarted: Date.now(),
    correct: 0, answered: 0, newSeen: 0,
    revealed: false, picked: [], checked: false,
    planItemId: opts.planItemId || null,
    label: opts.label || (kind === "cards" ? "Flashcards" : "Quiz"),
  };
  switchView("study");
}

const drillActive = () => !!drill;

function endDrill(completed) {
  if (!drill) return;
  const elapsed = Date.now() - drill.started;
  logMinutes(elapsed);

  // Pace is measured, not assumed. Only a block that was actually finished
  // teaches anything about speed — an abandoned one measures interruption.
  if (completed && drill.idx > 0) {
    updatePace(drill.kind === "quiz" ? "quiz" : (drill.newSeen > drill.idx / 2 ? "new" : "rev"), drill.idx, elapsed);
  }
  if (completed && drill.planItemId) markPlanItemDone(drill.planItemId);

  const summary = drill.kind === "quiz"
    ? { correct: drill.correct, total: drill.answered }
    : { correct: 0, total: drill.idx };
  const kind = drill.kind;
  drill = null;
  save();
  return { kind, ...summary };
}

/* ═══════════════ VIEW ═══════════════ */

function renderStudy(wrap) {
  if (drill) return drill.kind === "cards" ? renderCardDrill(wrap) : renderQuizDrill(wrap);
  renderStudyChooser(wrap);
}

/* No block running: offer today's plan, then a free-choice list. */
function renderStudyChooser(wrap) {
  const plan = ensurePlan();
  const pending = plan.items.filter(i => !planItemDone(i.id) && i.kind !== "mock");
  const certs = enrolledList().filter(e => e.mode !== "paused");

  wrap.innerHTML = `
    ${pending.length ? `
      <div class="section-title">From today's plan<span class="st-line"></span></div>
      ${pending.map(planItemCard).join("")}
    ` : `
      <div class="card">
        <div class="card-kicker signal">All clear</div>
        <h2>Today's plan is done</h2>
        <p class="muted tiny" style="margin-top:0.5rem">Anything below is extra credit. Extra reps on a domain you have already measured well are the lowest-yield thing you can do — but they are not nothing.</p>
      </div>
    `}

    <div class="section-title">Free study<span class="st-line"></span></div>
    ${certs.length ? certs.map(e => {
      const prios = domainPriority(e.course);
      return `
      <div class="card">
        <div class="card-kicker">${esc(e.course.cert.vendor || "")}</div>
        <h3>${esc(e.course.cert.name)}</h3>
        <div class="chip-row" style="margin-top:0.9rem">
          <button class="chip" data-free="cards" data-course="${esc(e.id)}">Flashcards, top priority</button>
          <button class="chip" data-free="quiz" data-course="${esc(e.id)}">Quiz, top priority</button>
        </div>
        <div class="tiny faint" style="margin-top:0.7rem">Highest yield right now: <strong>${esc(prios[0].domain.name)}</strong> — ${esc(prios[0].n === 0 ? "never tested" : pct(prios[0].mean) + " correct")}, ${esc(pct(prios[0].domain.weight))} of the exam</div>
      </div>`;
    }).join("") : `<div class="card"><p class="muted">No certifications added yet. Add one from the <strong>Certs</strong> tab.</p></div>`}
  `;

  bindPlanItemButtons(wrap);
  $$("[data-free]", wrap).forEach(b => b.onclick = () => {
    const course = CERT.byId(b.dataset.course);
    const e = state.enrolled[b.dataset.course];
    const days = e && e.examDate ? daysBetween(dkey(), e.examDate) : null;
    const pm = priorityMap(course);
    if (b.dataset.free === "cards") {
      startDrill("cards", course.id, buildCardQueue(course.id, pm, 20, days), { label: "Flashcards" });
    } else {
      startDrill("quiz", course.id, buildQuestionQueue(course.id, pm, 15), { label: "Quiz" });
    }
  });
}

/* ═══════════════ FLASHCARDS ═══════════════ */

function renderCardDrill(wrap) {
  const card = drill.items[drill.idx];
  const course = CERT.byId(drill.courseId);
  const domain = CERT.domainOf(course, card.d);
  const st = cardState(drill.courseId, card.id);
  const isNew = !st || !st.reps;

  wrap.innerHTML = `
    <div class="drill-head">
      <div>
        <div class="card-kicker signal">${esc(course.cert.code)} · ${esc(domain ? domain.name : "")}</div>
        <div class="drill-meta">${drill.idx + 1} / ${drill.items.length}${isNew ? " · NEW" : st.lapses ? " · MISSED " + st.lapses + "×" : ""}</div>
      </div>
      <button class="btn ghost small" id="quitDrill">End</button>
    </div>
    ${pbar(drill.idx / drill.items.length)}

    <div class="flash" id="flashCard" style="margin-top:1.1rem">
      <div class="flash-front">${esc(card.f)}</div>
      ${drill.revealed ? `<div class="flash-back">${esc(card.b)}</div>` : ""}
      ${drill.revealed ? "" : `<div class="flash-hint">TAP TO REVEAL</div>`}
    </div>

    ${drill.revealed ? `
      <div class="grid-2 keep-2" style="margin-top:1.1rem;gap:0.6rem">
        <button class="btn fail" id="gAgain">Missed it</button>
        <button class="btn pass" id="gGood">Got it</button>
      </div>
      <div class="grid-2 keep-2" style="margin-top:0.6rem;gap:0.6rem">
        <button class="btn ghost" id="gHard">Shaky</button>
        <button class="btn ghost" id="gEasy">Too easy</button>
      </div>
    ` : `
      <button class="btn wide big" id="reveal" style="margin-top:1.1rem">Show answer</button>
    `}
  `;

  $("#quitDrill", wrap).onclick = () => {
    const r = endDrill(false);
    toast("⏸", "Block ended", r.total ? `${r.total} cards this round.` : "");
    switchView("today");
  };

  const reveal = () => { drill.revealed = true; switchView("study"); };
  if (!drill.revealed) {
    $("#reveal", wrap).onclick = reveal;
    $("#flashCard", wrap).onclick = reveal;
  } else {
    const grade = g => {
      if (!st || !st.reps) drill.newSeen++;
      recordCard(drill.courseId, card, g);
      nextItem();
    };
    $("#gAgain", wrap).onclick = () => grade(GRADE.AGAIN);
    $("#gHard", wrap).onclick = () => grade(GRADE.HARD);
    $("#gGood", wrap).onclick = () => grade(GRADE.GOOD);
    $("#gEasy", wrap).onclick = () => grade(GRADE.EASY);
  }
}

/* ═══════════════ QUIZ ═══════════════ */

function renderQuizDrill(wrap) {
  const q = drill.items[drill.idx];
  const course = CERT.byId(drill.courseId);
  const domain = CERT.domainOf(course, q.d);
  const multi = q.a.length > 1;
  const right = drill.checked && isCorrect(q, drill.picked);

  wrap.innerHTML = `
    <div class="drill-head">
      <div>
        <div class="card-kicker signal">${esc(course.cert.code)} · ${esc(domain ? domain.name : "")}</div>
        <div class="drill-meta">${drill.idx + 1} / ${drill.items.length}${drill.answered ? " · " + drill.correct + "/" + drill.answered + " correct" : ""}</div>
      </div>
      <button class="btn ghost small" id="quitDrill">End</button>
    </div>
    ${pbar(drill.idx / drill.items.length)}

    <div class="card" style="margin-top:1.1rem">
      <p style="font-size:1.02rem">${esc(q.s)}</p>
      ${multi ? `<div class="tiny faint" style="margin-top:0.5rem">Select all that apply.</div>` : ""}
    </div>

    <div id="opts">
      ${q.c.map((choice, i) => {
        let cls = "opt";
        if (drill.checked) {
          if (q.a.includes(i)) cls += " correct";
          else if (drill.picked.includes(i)) cls += " wrong";
          else cls += " dim";
        } else if (drill.picked.includes(i)) cls += " correct";
        return `<button class="${cls}" data-opt="${i}"><span class="opt-key">${"ABCD"[i] || i + 1}</span>${esc(choice)}</button>`;
      }).join("")}
    </div>

    ${drill.checked ? `
      <div class="why"><strong>${right ? "Correct." : "Not quite."}</strong> ${esc(q.e || "")}</div>
      <div class="ob-actions">
        <button class="btn" id="nextQ">${drill.idx + 1 >= drill.items.length ? "Finish" : "Next question"}</button>
        <button class="btn ghost small" id="flagQ">Answer key looks wrong</button>
      </div>
    ` : `
      <button class="btn wide big" id="checkQ" style="margin-top:0.6rem" ${drill.picked.length ? "" : "disabled"}>Check answer</button>
    `}
  `;

  $("#quitDrill", wrap).onclick = () => {
    const r = endDrill(false);
    toast("⏸", "Block ended", r.total ? `${r.correct}/${r.total} correct.` : "");
    switchView("today");
  };

  if (!drill.checked) {
    $$("[data-opt]", wrap).forEach(b => b.onclick = () => {
      const i = Number(b.dataset.opt);
      if (multi) {
        drill.picked = drill.picked.includes(i) ? drill.picked.filter(x => x !== i) : drill.picked.concat([i]);
      } else {
        drill.picked = [i];
      }
      switchView("study");
    });
    $("#checkQ", wrap).onclick = () => {
      if (!drill.picked.length) return;
      drill.checked = true;
      const ok = isCorrect(q, drill.picked);
      drill.answered++;
      if (ok) drill.correct++;
      recordAnswer(drill.courseId, q, ok);
      switchView("study");
    };
  } else {
    $("#nextQ", wrap).onclick = nextItem;
    /* Generated answer keys are unverified. A wrong key trains the wrong answer
       and drags the domain posterior in the direction that matters most, so
       flagging pulls the question out of every queue and out of readiness. */
    $("#flagQ", wrap).onclick = () => {
      flagQuestion(q.id);
      toast("⚑", "Question flagged", "It will not appear in drills, mocks or your readiness estimate again.");
      nextItem();
    };
  }
}

/* ═══════════════ ADVANCE ═══════════════ */

function nextItem() {
  drill.idx++;
  drill.revealed = false;
  drill.picked = [];
  drill.checked = false;
  drill.itemStarted = Date.now();

  if (drill.idx >= drill.items.length) {
    const r = endDrill(true);
    showDrillSummary(r);
    return;
  }
  switchView("study");
}

function showDrillSummary(r) {
  const body = r.kind === "quiz"
    ? `<div class="big-num">${r.correct} / ${r.total}</div>
       <p class="muted tiny" style="margin-top:0.5rem">${r.total ? pct(r.correct / r.total) + " correct this block." : ""}</p>`
    : `<div class="big-num">${r.total}</div>
       <p class="muted tiny" style="margin-top:0.5rem">cards reviewed. Missed ones come back within the hour.</p>`;

  openModal(`
    <div class="card-kicker signal">Block complete</div>
    <h2>Nice.</h2>
    <div style="margin:1.2rem 0">${body}</div>
    <div class="ob-actions">
      <button class="btn" id="sumNext">Back to today</button>
    </div>`);
  $("#sumNext").onclick = () => { closeModal(); switchView("today"); };
}

/* ═══════════════ PLAN ITEM CARDS ═══════════════
   Shared by Today and Study — one definition, so a block looks and behaves the
   same wherever it is offered. */

function planItemCard(item) {
  const course = CERT.byId(item.courseId);
  if (!course) return "";
  const done = planItemDone(item.id);
  const icon = { cards: "▤", quiz: "◇", mock: "⏱", review: "↺", keypoints: "★", task: "✓" }[item.kind] || "•";
  return `
    <div class="card${done ? "" : " accent"}" style="${done ? "opacity:.5" : ""}">
      <div class="card-kicker">${esc(course.cert.code)} · ${esc(fmtMin(item.minutes))}</div>
      <h3>${esc(icon)} ${esc(item.label)}</h3>
      ${item.why ? `<div class="tiny faint" style="margin-top:0.35rem">${esc(item.why)}</div>` : ""}
      <div class="ob-actions" style="margin-top:1rem">
        ${done
          ? `<span class="tiny faint">Done</span>`
          : `<button class="btn small" data-start="${esc(item.id)}">Start</button>
             <button class="btn ghost small" data-skip="${esc(item.id)}">Skip</button>`}
      </div>
    </div>`;
}

function bindPlanItemButtons(wrap) {
  $$("[data-start]", wrap).forEach(b => b.onclick = () => startPlanItem(b.dataset.start));
  $$("[data-skip]", wrap).forEach(b => b.onclick = () => {
    markPlanItemDone(b.dataset.skip);
    switchView(currentView);
  });
}

/* Turn a plan item into a running block. */
function startPlanItem(id) {
  const item = state.plan && state.plan.items.find(i => i.id === id);
  if (!item) return;
  const course = CERT.byId(item.courseId);
  if (!course) return;

  if (item.kind === "cards") {
    const cards = item.cardIds.map(cid => course.cards.find(c => c.id === cid)).filter(Boolean);
    startDrill("cards", course.id, cards, { planItemId: id, label: item.label });

  } else if (item.kind === "quiz") {
    const qs = item.questionIds.map(qid => course.questions.find(q => q.id === qid)).filter(Boolean)
      .filter(q => !state.flagged[q.id]);
    startDrill("quiz", course.id, qs, { planItemId: id, label: item.label });

  } else if (item.kind === "mock") {
    startMock(course.id, item.mockKind, id);

  } else if (item.kind === "review") {
    const mock = state.mocks.find(m => m.id === item.mockId);
    const qs = (mock ? mock.wrongIds : []).map(qid => course.questions.find(q => q.id === qid)).filter(Boolean);
    if (mock) { mock.reviewed = true; save(); }
    startDrill("quiz", course.id, qs, { planItemId: id, label: item.label });

  } else if (item.kind === "keypoints") {
    showKeyPoints(course, item.domainId, id);

  } else if (item.kind === "task") {
    showTask(course, item.taskId, id);
  }
}

/* The crib sheet: one domain's key points on one screen, which is what actually
   gets read in the last hour before an exam. */
function showKeyPoints(course, domainId, planItemId) {
  const d = CERT.domainOf(course, domainId);
  if (!d) return;
  openModal(`
    <div class="card-kicker signal">${esc(course.cert.code)} · ${esc(pct(d.weight))} of the exam</div>
    <h2>${esc(d.name)}</h2>
    ${d.summary ? `<p class="muted" style="margin:0.7rem 0 1rem">${esc(d.summary)}</p>` : ""}
    <ul style="padding-left:1.1rem;line-height:1.7">
      ${d.keyPoints.map(k => `<li>${esc(k)}</li>`).join("") || `<li class="faint">No key points written for this domain.</li>`}
    </ul>
    <div class="ob-actions"><button class="btn" id="kpDone">Read it</button></div>`);
  $("#kpDone").onclick = () => {
    if (planItemId) markPlanItemDone(planItemId);
    closeModal();
    switchView("today");
  };
}

/* A practicum deliverable. Not quizzable, so it is a checklist item with a
   deadline — which for HubSpot Certified Trainer is the actual gate. */
function showTask(course, taskId, planItemId) {
  const t = (course.tasks || []).find(x => x.id === taskId);
  if (!t) return;
  const p = prog(course.id);
  if (!p.t) p.t = {};
  openModal(`
    <div class="card-kicker signal">${esc(course.cert.code)} · practicum</div>
    <h2>${esc(t.title)}</h2>
    <p class="muted" style="margin:0.7rem 0 1rem">${esc(t.detail)}</p>
    <div class="tiny faint">Estimated ${esc(fmtMin(t.minutes))}</div>
    <div class="ob-actions">
      <button class="btn" id="taskDone">Mark complete</button>
      <button class="btn ghost" id="taskLater">Later</button>
    </div>`);
  $("#taskDone").onclick = () => {
    p.t[t.id] = true;
    if (planItemId) markPlanItemDone(planItemId);
    save();
    closeModal();
    toast("✓", "Practicum step done", t.title);
    switchView("today");
  };
  $("#taskLater").onclick = closeModal;
}
