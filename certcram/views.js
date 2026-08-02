/* CERTCRAM — Today, Certs and Settings.
   The drill loop lives in drill.js and the exam in mock.js. */
"use strict";

/* ═══════════════ TODAY ═══════════════ */

function renderToday(wrap) {
  const certs = enrolledList();
  if (!certs.length) return renderEmptyToday(wrap);

  const plan = ensurePlan();
  const next = nextPlanItem();
  const remaining = planRemaining();
  const done = plan.items.length - plan.items.filter(i => !planItemDone(i.id)).length;

  wrap.innerHTML = `
    ${plan.notices && plan.notices.length ? plan.notices.map(n => `
      <div class="card accent">
        <div class="card-kicker signal">Needs a decision</div>
        <h3>Your mock will not fit today</h3>
        <p class="muted tiny" style="margin-top:0.5rem">${esc(n.text)}</p>
        <div class="ob-actions">
          <button class="btn small" data-longday="${esc(n.fix.dateKey)}" data-mins="${n.fix.minutes}">Set aside ${esc(fmtMin(n.fix.minutes))} today</button>
          <button class="btn ghost small" data-dismiss-notice="1">Not today</button>
        </div>
      </div>`).join("") : ""}

    <div class="section-title">Today · ${esc(fmtMin(plan.minutes))} planned<span class="st-line"></span></div>
    ${plan.items.length ? `
      <div class="card">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:1rem">
          <div>
            <div class="card-kicker" style="margin:0">${done} of ${plan.items.length} blocks done</div>
            <div class="tiny faint">${remaining > 0 ? esc(fmtMin(remaining)) + " left · " + esc(fmtMin(minutesToday())) + " studied" : "All done today"}</div>
          </div>
          ${state.streak.days > 1 ? `<div class="mono tiny" style="color:var(--warn)">${state.streak.days}-day streak</div>` : ""}
        </div>
        <div style="margin-top:0.8rem">${pbar(plan.items.length ? done / plan.items.length : 0, done === plan.items.length ? "pass" : "")}</div>
        ${next ? `<button class="btn wide big" id="startNext" style="margin-top:1.1rem">${esc(shortLabel(next))}</button>` : ""}
      </div>

      ${plan.items.map(planItemCard).join("")}
    ` : `
      <div class="card">
        <h3>Nothing scheduled</h3>
        <p class="muted tiny" style="margin-top:0.5rem">${certs.some(c => c.examDate)
          ? "Everything due is done and no exam is close enough to warrant more. Free study is available under the Study tab."
          : "None of your certifications has an exam date yet, so nothing is being scheduled. Set a date under Certs and a plan appears."}</p>
      </div>
    `}

    <div class="section-title">Where you stand<span class="st-line"></span></div>
    <div class="grid-2">
      ${certs.map(certCountdownCard).join("")}
    </div>

    ${installPrompt()}
  `;

  bindPlanItemButtons(wrap);
  const sn = $("#startNext", wrap);
  if (sn && next) sn.onclick = () => startPlanItem(next.id);

  $$("[data-longday]", wrap).forEach(b => b.onclick = () => {
    state.longDays[b.dataset.longday] = Number(b.dataset.mins);
    ensurePlan(true);
    switchView("today");
  });
  $$("[data-dismiss-notice]", wrap).forEach(b => b.onclick = () => {
    state.plan.notices = [];
    save();
    switchView("today");
  });
  $$("[data-cert]", wrap).forEach(b => b.onclick = () => switchView("certs"));
}

/* The big button says what you are about to do and how long it takes. The full
   block label lists every domain involved, which wraps to three lines on a
   phone and stops reading like a button. */
function shortLabel(item) {
  const kind = {
    cards: "Start flashcards", quiz: "Start quiz", mock: "Start mock exam",
    review: "Review your mistakes", keypoints: "Read the key points", task: "Practicum step",
  }[item.kind] || "Start";
  return kind + " · " + fmtMin(item.minutes);
}

function renderEmptyToday(wrap) {
  wrap.innerHTML = `
    <div class="card accent">
      <div class="card-kicker signal">Start here</div>
      <h2>Add what you are sitting</h2>
      <p class="muted" style="margin:0.7rem 0 0">Pick a built-in course, or paste the workbook for anything else and it will be built into one. Then set an exam date, and the plan builds itself around whichever exam is closest and whichever domains you are weakest in.</p>
      <div class="ob-actions"><button class="btn" id="goCerts">Choose a certification</button></div>
    </div>`;
  $("#goCerts", wrap).onclick = () => switchView("certs");
}

function certCountdownCard(e) {
  const c = e.course;
  const days = e.examDate ? daysBetween(dkey(), e.examDate) : null;
  const r = readinessCached(c);
  const cls = r.pPass >= 0.75 ? "pass" : r.pPass >= 0.4 ? "warn" : "fail";
  const untestedNote = r.untestedWeight > 0.05
    ? `${pct(r.untestedWeight)} of this exam has never been tested`
    : `${pct(r.coverage)} of the exam weight measured`;

  return `
    <div class="card">
      <div class="card-kicker">${esc(c.cert.vendor || "")}${e.mode !== "active" ? " · " + esc(e.mode) : ""}</div>
      <h3>${esc(c.cert.name)}</h3>
      <div class="tiny faint" style="margin-top:0.2rem">
        ${e.examDate ? esc(prettyDate(e.examDate)) + " · " + esc(relDays(days)) : "No exam date set"}
      </div>
      <div style="margin:1.1rem 0 0.2rem">
        ${gauge(r.pPass, pct(r.pPass), "chance of passing", cls)}
      </div>
      <div class="tiny faint center" style="margin-top:0.6rem">
        Expected score ${esc(pct(r.expected))} · needs ${esc(pct(r.needFrac))}
      </div>
      <div class="tiny" style="margin-top:0.5rem;color:var(--${r.untestedWeight > 0.05 ? "fail" : "ink-faint"})">${esc(untestedNote)}</div>
      ${r.calibrated ? "" : `<div class="tiny faint" style="margin-top:0.4rem">Estimated from self-generated questions, not calibrated against the real exam.</div>`}
      <button class="btn ghost small" data-cert="${esc(e.id)}" style="margin-top:0.9rem">Breakdown</button>
    </div>`;
}

/* iOS evicts localStorage for sites that are not installed to the home screen
   after about a week without a visit. A week is the entire prep window, so this
   prompt is load-bearing rather than a nicety. */
function installPrompt() {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  if (standalone) return "";
  return `
    <div class="card flat" style="border-style:dashed;margin-top:1.5rem">
      <div class="card-kicker">On your phone</div>
      <p class="tiny muted" style="margin-top:0.3rem">Add this to your home screen — Share, then <strong>Add to Home Screen</strong>. Safari clears storage for sites you have not opened in about a week, and installed apps are exempt. It also makes it work offline.</p>
    </div>`;
}

/* ═══════════════ CERTS ═══════════════ */

function renderCerts(wrap) {
  const all = CERT.all();
  const pending = pendingGeneration();

  wrap.innerHTML = `
    ${pending ? `
      <div class="card accent">
        <div class="card-kicker signal">Unfinished</div>
        <h3>Resume building ${esc(pending.name)}</h3>
        <p class="muted tiny" style="margin-top:0.4rem">${pending.done} of ${pending.total} domains written. Nothing is lost — it picks up where it stopped.</p>
        <div class="ob-actions">
          <button class="btn small" id="resumeGen">Resume</button>
          <button class="btn ghost small" id="dropGen">Discard</button>
        </div>
      </div>` : ""}

    <div class="card accent">
      <div class="card-kicker signal">Any certification</div>
      <h3>Build a course from your material</h3>
      <p class="muted tiny" style="margin-top:0.4rem">Paste a workbook, syllabus or exam guide and it becomes a weighted course with flashcards, questions and a practicum checklist. Or just name the exam and let Claude work from what it knows about the blueprint.</p>
      <div class="ob-actions">
        <button class="btn small" id="genWorkbook">Paste material</button>
        <button class="btn ghost small" id="genName">Name an exam</button>
      </div>
    </div>

    <div class="section-title">Your certifications<span class="st-line"></span></div>
    ${all.length ? all.map(certLibraryCard).join("") : `<div class="card"><p class="muted">No courses installed.</p></div>`}
  `;

  $("#genWorkbook", wrap).onclick = () => openGenerateModal("workbook");
  $("#genName", wrap).onclick = () => openGenerateModal("name");
  const rg = $("#resumeGen", wrap);
  if (rg) rg.onclick = () => openGenerateModal("resume");
  const dg = $("#dropGen", wrap);
  if (dg) dg.onclick = () => { state.gen = null; save(); switchView("certs"); };

  $$("[data-enroll]", wrap).forEach(b => b.onclick = () => {
    const id = b.dataset.enroll;
    if (state.enrolled[id]) delete state.enrolled[id];
    else state.enrolled[id] = { examDate: null, mode: "active", added: Date.now() };
    ensurePlan(true);
    switchView("certs");
  });

  $$("[data-date]", wrap).forEach(inp => inp.onchange = () => {
    const e = state.enrolled[inp.dataset.date];
    if (!e) return;
    e.examDate = isDateKey(inp.value) ? inp.value : null;
    ensurePlan(true);
    switchView("certs");
  });

  $$("[data-mode]", wrap).forEach(sel => sel.onchange = () => {
    const e = state.enrolled[sel.dataset.mode];
    if (!e) return;
    e.mode = MODES.includes(sel.value) ? sel.value : "active";
    ensurePlan(true);
    switchView("certs");
  });

  $$("[data-detail]", wrap).forEach(b => b.onclick = () => showCertDetail(CERT.byId(b.dataset.detail)));
  $$("[data-delete]", wrap).forEach(b => b.onclick = () => {
    const c = CERT.byId(b.dataset.delete);
    askConfirm("Delete this generated course?",
      `"${c.cert.name}" and all progress on it are removed. Built-in courses are not affected.`,
      "Delete", () => {
        aiCourses = aiCourses.filter(x => x.id !== c.id);
        try { saveAiCourses(); } catch (e) { /* removal only shrinks it */ }
        CERT.setAi(aiCourses);
        delete state.enrolled[c.id];
        delete state.prog[c.id];
        invalidateReadiness(c.id);
        ensurePlan(true);
        switchView("certs");
      }, true);
  });
}

function certLibraryCard(c) {
  const e = state.enrolled[c.id];
  const r = e ? readinessCached(c) : null;
  return `
    <div class="card">
      <div class="card-kicker">${esc(c.cert.vendor || "")} · ${c.questions.length} questions · ${c.cards.length} cards${c.source === "ai" ? " · generated" : ""}</div>
      <h3>${esc(c.cert.name)}</h3>
      ${c.cert.blurb ? `<p class="tiny muted" style="margin-top:0.4rem">${esc(c.cert.blurb)}</p>` : ""}
      <div class="tiny faint" style="margin-top:0.5rem">
        ${c.exam.questionCount} questions · ${esc(fmtMin(c.exam.timeLimitMin))} · pass at ${esc(pct(passFrac(c)))}
        ${(c.tasks || []).length ? " · " + c.tasks.length + "-step practicum" : ""}
      </div>

      ${e ? `
        <div class="grid-2" style="margin-top:1rem;gap:0.7rem">
          <label class="field" style="margin:0">
            <span>Exam date</span>
            <input type="date" data-date="${esc(c.id)}" value="${esc(e.examDate || "")}">
          </label>
          <label class="field" style="margin:0">
            <span>Mode</span>
            <select data-mode="${esc(c.id)}">
              <option value="active"${e.mode === "active" ? " selected" : ""}>Active — full plan</option>
              <option value="maintenance"${e.mode === "maintenance" ? " selected" : ""}>Maintenance — reviews only</option>
              <option value="paused"${e.mode === "paused" ? " selected" : ""}>Paused — no time</option>
            </select>
          </label>
        </div>
        <div style="margin-top:0.4rem">${pbar(r.coverage, r.coverage > 0.7 ? "pass" : "warn", "measured " + pct(r.coverage), pct(r.pPass) + " chance of passing")}</div>
      ` : ""}

      <div class="ob-actions" style="margin-top:0.9rem">
        <button class="btn ${e ? "ghost " : ""}small" data-enroll="${esc(c.id)}">${e ? "Remove from plan" : "Add to my plan"}</button>
        <button class="btn ghost small" data-detail="${esc(c.id)}">Domains</button>
        ${c.source === "ai" ? `<button class="btn ghost small" data-delete="${esc(c.id)}">Delete</button>` : ""}
      </div>
    </div>`;
}

/* The 80/20 table for one certification: every domain, its exam weight, what
   has been measured, and what the engine would spend the next hour on. */
function showCertDetail(course) {
  if (!course) return;
  const rows = domainPriority(course);
  const total = rows.reduce((t, r) => t + r.priority, 0) || 1;
  const r = readinessCached(course);
  const p = prog(course.id);
  const tasks = course.tasks || [];

  openModal(`
    <div class="card-kicker signal">${esc(course.cert.code)}</div>
    <h2>${esc(course.cert.name)}</h2>
    <div class="tiny faint" style="margin-top:0.4rem">
      ${esc(pct(r.pPass))} chance of passing · expected ${esc(pct(r.expected))} against a ${esc(pct(r.needFrac))} pass mark
    </div>
    ${r.untested.length ? `<div class="tiny" style="margin-top:0.6rem;color:var(--fail)">Never tested: ${esc(r.untested.join(", "))}. That part of the estimate is a guess.</div>` : ""}

    <div class="section-title" style="margin-top:1.5rem">Where the next hour goes<span class="st-line"></span></div>
    ${rows.map(row => {
      const tag = domainTag(row, row.target);
      const share = row.priority / total;
      return `
      <div class="dom-row">
        <div class="dom-name">${esc(row.domain.name)}</div>
        <div class="dom-weight">${esc(pct(row.domain.weight))} of exam</div>
        <div class="dom-bar" style="margin-top:0.35rem">
          ${pbar(share, share > 0.25 ? "fail" : share > 0.12 ? "warn" : "pass",
                 Math.round(share * 60) + " min of an hour", "")}
        </div>
        <div class="dom-weight" style="grid-column:1/-1;margin-top:0.2rem">
          <span class="dom-tag ${tag.cls}">${esc(tag.label)}</span>
          ${row.n ? " · " + row.correct + "/" + row.n + " answered" : ""}
        </div>
      </div>`;
    }).join("")}

    ${tasks.length ? `
      <div class="section-title" style="margin-top:1.5rem">Practicum<span class="st-line"></span></div>
      ${tasks.map(t => `
        <label class="dom-row" style="cursor:pointer">
          <div class="dom-name">
            <input type="checkbox" data-task="${esc(t.id)}" ${(p.t || {})[t.id] ? "checked" : ""} style="width:auto;margin-right:0.6rem">
            ${esc(t.title)}
          </div>
          <div class="dom-weight">${esc(fmtMin(t.minutes))}</div>
          ${t.detail ? `<div class="tiny faint" style="grid-column:1/-1;margin-top:0.2rem">${esc(t.detail)}</div>` : ""}
        </label>`).join("")}
    ` : ""}

    <div class="ob-actions"><button class="btn ghost" id="dtClose">Close</button></div>`);

  $("#dtClose").onclick = closeModal;
  $$("[data-task]").forEach(cb => cb.onchange = () => {
    if (!p.t) p.t = {};
    if (cb.checked) p.t[cb.dataset.task] = true; else delete p.t[cb.dataset.task];
    ensurePlan(true);
    save();
  });
}

/* ═══════════════ GENERATION MODAL ═══════════════ */

function openGenerateModal(mode) {
  if (!(state.aiKey || "").trim()) {
    return openModal(`
      <div class="card-kicker signal">API key needed</div>
      <h2>Add your Anthropic key first</h2>
      <p class="muted tiny" style="margin:0.7rem 0 1.2rem">Building a course calls Claude directly from this browser with your own key. It is stored on this device only and goes nowhere but api.anthropic.com. A course costs roughly $0.15 to $0.60 depending on the model.</p>
      <div class="ob-actions"><button class="btn" id="goSettings">Open Settings</button></div>`),
      ($("#goSettings").onclick = () => { closeModal(); switchView("settings"); });
  }

  if (mode === "resume") return runGeneration(null);

  const isName = mode === "name";
  openModal(`
    <div class="card-kicker signal">${isName ? "From a name" : "From your material"}</div>
    <h2>${isName ? "Which exam?" : "Paste the material"}</h2>
    <p class="muted tiny" style="margin:0.6rem 0 1rem">${isName
      ? "Give the exact certification name. Claude writes the course from what it knows about that exam's published blueprint — useful, but weaker than pasting the real workbook, and the app will label it as such."
      : "Paste the workbook, syllabus or exam guide. The more of the official structure it contains — domain names, weightings, learning objectives — the better the weighting comes out, and weighting is what drives everything else."}</p>
    <label class="field">
      <span>${isName ? "Certification name" : "Source material"}</span>
      ${isName
        ? `<input type="text" id="genInput" placeholder="e.g. HubSpot Certified Trainer">`
        : `<textarea id="genInput" placeholder="Paste here…"></textarea>`}
    </label>
    <div class="field-hint">Model: ${esc((AI_MODELS.find(m => m.id === state.aiModel) || AI_MODELS[0]).label)} · ${esc((AI_MODELS.find(m => m.id === state.aiModel) || AI_MODELS[0]).cost)}</div>
    <div class="ob-actions"><button class="btn" id="genGo">Build the course</button></div>`);

  $("#genGo").onclick = () => {
    const v = $("#genInput").value.trim();
    if (isName && v.length < 3) return toast("⚠️", "Needs a name", "Type the certification name.");
    if (!isName && v.length < 200) return toast("⚠️", "Too short", "Paste more of the workbook — at least a few paragraphs.");
    runGeneration(isName
      ? `Certification: ${v}\n\nNo workbook was supplied. Build the course from the published exam blueprint for this certification as you understand it: its official domains, their weightings, and their stated learning objectives. If you are unsure of the exact weightings, use your best estimate and say so in the blurb.`
      : v);
  };
}

/* Generation runs behind a modal that shows every domain as it lands, because
   eight sequential calls take a couple of minutes and a spinner with no detail
   reads as a hang. */
async function runGeneration(source) {
  const started = Date.now();
  openModal(`
    <div class="card-kicker signal">Building</div>
    <h2>Writing your course</h2>
    <p class="muted tiny" style="margin:0.6rem 0 1.2rem">One call reads the material and works out the domain weighting, then one call per domain writes its cards and questions. Progress is saved after each — closing this loses nothing.</p>
    <div id="genLog"></div>`, () => { /* closing the modal does not cancel the run */ });

  const log = $("#genLog");
  const seen = [];
  const onProgress = (step, total, label) => {
    seen[step] = label;
    if (!log || !document.body.contains(log)) return;
    log.innerHTML = seen.map((l, i) => `
      <div class="gen-row">
        <span class="${i < step ? "ok" : "pending"}">${i < step ? "✓" : "•"}</span>
        <span>${esc(l)}</span>
      </div>`).join("") + (step < total ? `<div class="gen-row"><span class="spin"></span><span class="faint">working…</span></div>` : "");
  };

  try {
    // source === null resumes the stored job, which carries its own material.
    const course = await generateCourse(source, onProgress);

    state.enrolled[course.id] = state.enrolled[course.id] || { examDate: null, mode: "active", added: Date.now() };
    ensurePlan(true);
    save();

    closeModal();
    toast("✓", "Course built", `${course.cert.name} — ${course.questions.length} questions across ${course.domains.length} domains.`, 7000);
    switchView("certs");
    showCertDetail(course);
  } catch (e) {
    closeModal();
    const resumable = !!pendingGeneration();
    openModal(`
      <div class="card-kicker signal">Stopped</div>
      <h2>Could not finish</h2>
      <p class="muted" style="margin:0.7rem 0 1.2rem">${esc(e.message || String(e))}</p>
      ${resumable ? `<p class="tiny faint">Everything written so far is saved. Resume from the Certs tab.</p>` : ""}
      <div class="ob-actions"><button class="btn ghost" id="genErrClose">Close</button></div>`);
    $("#genErrClose").onclick = () => { closeModal(); switchView("certs"); };
  } finally {
    logMinutes(0);
    void started;
  }
}

/* ═══════════════ SETTINGS ═══════════════ */

function renderSettings(wrap) {
  const model = AI_MODELS.find(m => m.id === state.aiModel) || AI_MODELS[0];
  const kb = Math.round(aiCoursesBytes() / 1024);

  wrap.innerHTML = `
    <div class="section-title">Study<span class="st-line"></span></div>
    <div class="card">
      <label class="field">
        <span>Minutes per day</span>
        <input type="number" id="sMinutes" min="10" max="300" step="5" value="${state.minutesPerDay}">
        <div class="field-hint">Everything is allocated inside this budget. Be honest — an over-booked plan gets ignored.</div>
      </label>
      <label class="field">
        <span>Your name</span>
        <input type="text" id="sName" value="${esc(state.name)}" placeholder="Optional">
      </label>
    </div>

    <div class="section-title">Reminders<span class="st-line"></span></div>
    <div class="card">
      <label class="field">
        <span>Daily nudge</span>
        <input type="time" id="sReminder" value="${esc(state.reminderTime)}">
        <div class="field-hint">Only fires while the app is open or in the background. A phone cannot wake a web app that is fully closed — use the calendar export below for something that will.</div>
      </label>
      <div class="chip-row">
        <button class="chip${state.remindersOn ? " selected" : ""}" id="sRemToggle">${state.remindersOn ? "Reminders on" : "Reminders off"}</button>
        <button class="chip" id="sIcs">Export to calendar (.ics)</button>
      </div>
    </div>

    <div class="section-title">Claude API<span class="st-line"></span></div>
    <div class="card">
      <label class="field">
        <span>API key</span>
        <input type="password" id="sKey" value="${esc(state.aiKey)}" placeholder="sk-ant-…" autocomplete="off">
        <div class="field-hint">Stored in this browser only, and sent nowhere but api.anthropic.com. It <strong>is</strong> included in the backup export below — treat that file as a secret.</div>
      </label>
      <label class="field">
        <span>Model</span>
        <select id="sModel">
          ${AI_MODELS.map(m => `<option value="${esc(m.id)}"${m.id === state.aiModel ? " selected" : ""}>${esc(m.label)}</option>`).join("")}
        </select>
        <div class="field-hint">${esc(model.cost)}</div>
      </label>
      <div class="tiny faint">Generated courses on this device: ${kb} kB${kb > 1200 ? " — close to the limit, delete one before generating another" : ""}</div>
    </div>

    <div class="section-title">Your data<span class="st-line"></span></div>
    <div class="card">
      <p class="tiny muted">Nothing syncs between devices. If you study on the phone and the laptop, this file is the only bridge.</p>
      <div class="chip-row" style="margin-top:0.9rem">
        <button class="chip" id="sExport">Export backup</button>
        <button class="chip" id="sImport">Import backup</button>
        <button class="chip" id="sReset">Reset everything</button>
      </div>
      <div class="tiny faint" style="margin-top:0.9rem" id="sVersion">Version —</div>
    </div>
  `;

  $("#sMinutes", wrap).onchange = e => {
    state.minutesPerDay = int(e.target.value, 10, 300, 60);
    ensurePlan(true); save(); switchView("settings");
  };
  $("#sName", wrap).onchange = e => { state.name = String(e.target.value).slice(0, 60); save(); refreshTopbar(); };
  $("#sReminder", wrap).onchange = e => { state.reminderTime = e.target.value || "07:00"; save(); };
  $("#sKey", wrap).onchange = e => { state.aiKey = e.target.value.trim(); save(); };
  $("#sModel", wrap).onchange = e => { state.aiModel = e.target.value; save(); switchView("settings"); };

  $("#sRemToggle", wrap).onclick = async () => {
    if (!state.remindersOn) {
      const ok = await requestNotifyPermission();
      if (!ok) return toast("⚠️", "Notifications blocked", "Allow them in your browser settings, or use the calendar export instead.");
    }
    state.remindersOn = !state.remindersOn;
    save();
    switchView("settings");
  };
  $("#sIcs", wrap).onclick = exportIcs;

  $("#sExport", wrap).onclick = exportBackup;
  $("#sImport", wrap).onclick = pickBackupFile;
  $("#sReset", wrap).onclick = () => askConfirm(
    "Reset everything?",
    "All progress, exam dates, generated courses and your API key are deleted from this device. Export a backup first if you are not sure.",
    "Delete it all",
    () => {
      try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(COURSES_KEY); } catch (e) { /* nothing to do */ }
      location.reload();
    }, true);

  swVersion().then(v => {
    const el = $("#sVersion");
    if (el && v) el.textContent = "Version " + v.cache + " · built " + v.built;
  });
}

/* Import goes through a file picker rather than a paste box: backups contain an
   API key, and a textarea full of one is easy to leave on screen. */
function pickBackupFile() {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = "application/json,.json";
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        importBackup(String(rd.result));
        toast("✓", "Backup restored", "Progress and courses are back.");
      } catch (e) {
        toast("⚠️", "Import failed", e.message, 8000);
      }
    };
    rd.readAsText(f);
  };
  inp.click();
}
