/* CERTCRAM — first run.

   Everything is collected into a draft and only written to state on the last
   step. A half-finished onboarding that got interrupted should leave no trace
   rather than a partly-configured app that behaves strangely. */
"use strict";

let ob = null;

function startOnboarding() {
  ob = {
    step: 0,
    draft: {
      name: "",
      minutesPerDay: 60,
      picked: [],                 // course ids
      dates: {},                  // { courseId: "2026-08-09" }
      reminderTime: "07:00",
      remindersOn: false,
    },
  };
  $("#onboarding").classList.remove("hidden");
  $("#app").classList.add("hidden");
  renderOb();
}

const OB_STEPS = [obHero, obYou, obPick, obDates, obReminders, obSummary];

/* Handlers are bound before the element is in the document, so the step builds
   a detached node rather than writing a string into place. */
function renderOb() {
  const el = $("#obInner");
  el.innerHTML = "";
  el.appendChild(OB_STEPS[ob.step]());
  const dots = document.createElement("div");
  dots.className = "ob-dots";
  dots.innerHTML = OB_STEPS.map((_, i) => `<div class="ob-dot${i <= ob.step ? " on" : ""}"></div>`).join("");
  el.appendChild(dots);
  el.scrollTop = 0;
  window.scrollTo(0, 0);
}

function obStep(html) {
  const div = document.createElement("div");
  div.className = "ob-step";
  div.innerHTML = html;
  return div;
}
const obNext = () => { ob.step++; renderOb(); };
const obBack = () => { ob.step = Math.max(0, ob.step - 1); renderOb(); };

/* ─────────── 1. what this is ─────────── */

function obHero() {
  const el = obStep(`
    <div class="ob-kicker">CERTCRAM</div>
    <h1>Pass the exam, not the syllabus.</h1>
    <p class="ob-lead">You do not have time to learn everything on the blueprint. This works out which domains carry the most marks, measures which ones you are actually weak in, and spends every minute you have where those two overlap.</p>
    <p class="ob-lead tiny">It runs offline, on your phone and your laptop. Nothing leaves your device except what you choose to send to Claude.</p>
    <div class="ob-actions"><button class="btn big" id="obGo">Set it up</button></div>`);
  el.querySelector("#obGo").onclick = obNext;
  return el;
}

/* ─────────── 2. you ─────────── */

function obYou() {
  const el = obStep(`
    <div class="ob-kicker">Step 1 of 5</div>
    <h1>How much time have you got?</h1>
    <p class="ob-lead">Be honest rather than aspirational. Everything is allocated inside this budget, and a plan that over-books gets ignored by the second day.</p>
    <label class="field">
      <span>Minutes per day</span>
      <input type="number" id="obMin" min="10" max="300" step="5" value="${ob.draft.minutesPerDay}">
    </label>
    <label class="field">
      <span>Your name (optional)</span>
      <input type="text" id="obName" value="${esc(ob.draft.name)}" placeholder="Nils">
    </label>
    <div class="ob-actions">
      <button class="btn" id="obNext">Continue</button>
      <button class="btn ghost" id="obBack">Back</button>
    </div>`);
  el.querySelector("#obNext").onclick = () => {
    ob.draft.minutesPerDay = int(el.querySelector("#obMin").value, 10, 300, 60);
    ob.draft.name = String(el.querySelector("#obName").value || "").slice(0, 60);
    obNext();
  };
  el.querySelector("#obBack").onclick = obBack;
  return el;
}

/* ─────────── 3. which certifications ─────────── */

function obPick() {
  const all = CERT.all();
  const el = obStep(`
    <div class="ob-kicker">Step 2 of 5</div>
    <h1>What are you sitting?</h1>
    <p class="ob-lead">Pick any that apply. You can add more later, including anything not listed — paste its workbook and a course gets built from it.</p>
    <div>
      ${all.map(c => `
        <button class="opt${ob.draft.picked.includes(c.id) ? " correct" : ""}" data-pick="${esc(c.id)}">
          <strong>${esc(c.cert.name)}</strong>
          <div class="tiny faint" style="margin-top:0.2rem">${esc(c.cert.vendor || "")} · ${c.exam.questionCount} questions · pass at ${esc(pct(passFrac(c)))}</div>
        </button>`).join("")}
    </div>
    <div class="ob-actions">
      <button class="btn" id="obNext">Continue</button>
      <button class="btn ghost" id="obBack">Back</button>
    </div>`);

  el.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => {
    const id = b.dataset.pick;
    ob.draft.picked = ob.draft.picked.includes(id) ? ob.draft.picked.filter(x => x !== id) : ob.draft.picked.concat([id]);
    renderOb();
  });
  el.querySelector("#obNext").onclick = obNext;
  el.querySelector("#obBack").onclick = obBack;
  return el;
}

/* ─────────── 4. exam dates ─────────── */

function obDates() {
  if (!ob.draft.picked.length) { ob.step++; return OB_STEPS[ob.step](); }

  const el = obStep(`
    <div class="ob-kicker">Step 3 of 5</div>
    <h1>When are they?</h1>
    <p class="ob-lead">The dates drive everything. An exam next week gets a compressed, aggressive schedule; one two months out gets proper spaced repetition. Leave a date blank and that certification sits in your library taking no time until you set one.</p>
    ${ob.draft.picked.map(id => {
      const c = CERT.byId(id);
      return `
      <label class="field">
        <span>${esc(c.cert.name)}</span>
        <input type="date" data-date="${esc(id)}" value="${esc(ob.draft.dates[id] || "")}" min="${esc(dkey())}">
      </label>`;
    }).join("")}
    <div class="ob-actions">
      <button class="btn" id="obNext">Continue</button>
      <button class="btn ghost" id="obBack">Back</button>
    </div>`);

  el.querySelectorAll("[data-date]").forEach(inp => inp.onchange = () => {
    if (isDateKey(inp.value)) ob.draft.dates[inp.dataset.date] = inp.value;
    else delete ob.draft.dates[inp.dataset.date];
  });
  el.querySelector("#obNext").onclick = obNext;
  el.querySelector("#obBack").onclick = obBack;
  return el;
}

/* ─────────── 5. reminders ─────────── */

function obReminders() {
  const el = obStep(`
    <div class="ob-kicker">Step 4 of 5</div>
    <h1>A nudge each day?</h1>
    <p class="ob-lead">A browser can only remind you while it is open or in the background — it cannot wake a web app that has been fully closed. For something that definitely fires, export the plan to your calendar from Settings.</p>
    <label class="field">
      <span>Nudge me at</span>
      <input type="time" id="obTime" value="${esc(ob.draft.reminderTime)}">
    </label>
    <div class="chip-row">
      <button class="chip${ob.draft.remindersOn ? " selected" : ""}" id="obRem">${ob.draft.remindersOn ? "Yes, remind me" : "No reminders"}</button>
    </div>
    <div class="ob-actions">
      <button class="btn" id="obNext">Continue</button>
      <button class="btn ghost" id="obBack">Back</button>
    </div>`);

  el.querySelector("#obRem").onclick = async () => {
    if (!ob.draft.remindersOn) {
      const ok = await requestNotifyPermission();
      if (!ok) { toast("⚠️", "Notifications blocked", "You can still use the calendar export."); return; }
    }
    ob.draft.remindersOn = !ob.draft.remindersOn;
    renderOb();
  };
  el.querySelector("#obNext").onclick = () => {
    ob.draft.reminderTime = el.querySelector("#obTime").value || "07:00";
    obNext();
  };
  el.querySelector("#obBack").onclick = obBack;
  return el;
}

/* ─────────── 6. commit ─────────── */

function obSummary() {
  const picked = ob.draft.picked.map(id => CERT.byId(id)).filter(Boolean);
  const soonest = ob.draft.picked
    .map(id => ob.draft.dates[id]).filter(isDateKey)
    .sort()[0] || null;

  const el = obStep(`
    <div class="ob-kicker">Step 5 of 5</div>
    <h1>Ready.</h1>
    <p class="ob-lead">${picked.length
      ? `${picked.length} certification${picked.length === 1 ? "" : "s"}, ${ob.draft.minutesPerDay} minutes a day${soonest ? `, first exam ${esc(relDays(daysBetween(dkey(), soonest)))}` : ""}.`
      : "Nothing added yet — you can pick a course or paste a workbook from the Certs tab."}</p>

    ${picked.length ? `
      <div class="card">
        ${picked.map(c => `
          <div class="dom-row">
            <div class="dom-name">${esc(c.cert.name)}</div>
            <div class="dom-weight">${esc(ob.draft.dates[c.id] ? prettyDate(ob.draft.dates[c.id]) : "no date")}</div>
          </div>`).join("")}
      </div>` : ""}

    <p class="ob-lead tiny">Your first session will be mostly questions you have not seen. That is deliberate — the app cannot tell what you are weak at until it has measured you, and until then it treats every domain as an unknown worth testing.</p>

    <div class="ob-actions">
      <button class="btn big" id="obDone">Start studying</button>
      <button class="btn ghost" id="obBack">Back</button>
    </div>`);

  el.querySelector("#obDone").onclick = commitOnboarding;
  el.querySelector("#obBack").onclick = obBack;
  return el;
}

function commitOnboarding() {
  const d = ob.draft;
  state.name = d.name;
  state.minutesPerDay = d.minutesPerDay;
  state.reminderTime = d.reminderTime;
  state.remindersOn = d.remindersOn;
  for (const id of d.picked) {
    if (!CERT.byId(id)) continue;
    state.enrolled[id] = {
      examDate: isDateKey(d.dates[id]) ? d.dates[id] : null,
      mode: "active",
      added: Date.now(),
    };
  }
  state.onboarded = true;
  ob = null;
  ensurePlan(true);
  save();

  $("#onboarding").classList.add("hidden");
  $("#app").classList.remove("hidden");
  switchView("today");
}
