/* CERTCRAM — turning a pasted workbook into a course.

   Calls Claude directly from the browser with the user's own API key. No server
   is involved; the key never leaves this device other than to api.anthropic.com.

   Generation is chunked and resumable. A useful course is roughly 120 questions
   and 100 cards — about 22k output tokens. That would technically fit in one
   response, but a single truncation would lose the whole course, there would be
   no progress to show, and locking the phone halfway through would mean
   starting over. One outline call plus one call per domain fixes all three. */
"use strict";

const AI_MODELS = [
  { id: "claude-opus-5", label: "Claude Opus 5 — best questions", cost: "~$0.60 per course" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 — cheaper, faster", cost: "~$0.15 per course" },
];

/* On Opus 5 thinking is on by default and max_tokens caps thinking plus visible
   output together. The value that works for a small photo response will
   truncate a domain chunk in the middle of its JSON — and with structured
   output a truncation is invalid JSON, not a short but valid course. */
const MAX_TOK_OUTLINE = 4000;
const MAX_TOK_CHUNK = 8000;

/* Anything longer than this gets truncated before sending. Workbooks are pasted
   from PDFs and occasionally arrive with the entire appendix attached. */
const MAX_SOURCE_CHARS = 180000;

const SYS_AUTHOR = `You build exam-preparation material for professional certification exams.

You are given source material: a certification workbook, syllabus, exam guide or topic list. From it you produce study content that drills what the exam actually tests.

Rules that matter:
- Weight everything by what the exam emphasises, not by what is interesting. If the source states domain weightings, use them exactly.
- Write questions in the style of the real exam: scenario-based where the objective allows, four plausible choices, distractors that a half-prepared candidate would genuinely consider. Never write filler options like "none of the above".
- Never reproduce real exam questions, even if the source contains them. Write original items that test the same objective.
- Explanations say why the right answer is right AND why the most tempting wrong answer is wrong.
- Flashcard fronts are a single question or term. Backs are the answer plus why it matters, in one or two sentences.
- Everything in English.`;

/* ═══════════════ SCHEMAS ═══════════════

   The structured-output schema subset supports enum, const, anyOf, $ref and
   additionalProperties. It does NOT support minItems, maxItems, minLength,
   maxLength or numeric bounds — so "exactly twelve cards" and "weights sum to
   one" cannot be enforced here. Counts go in the prompt; enforcement is the
   client-side validator below, with one retry for the shortfall. */

const OUTLINE_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["cert", "exam", "domains", "tasks"],
  properties: {
    cert: {
      type: "object", additionalProperties: false,
      required: ["code", "name", "vendor", "blurb"],
      properties: {
        code: { type: "string", description: "Short exam code, e.g. CCAO-F or HST" },
        name: { type: "string", description: "Full certification name" },
        vendor: { type: "string", description: "Who issues it, e.g. HubSpot Academy" },
        blurb: { type: "string", description: "One sentence, at most 25 words" },
      },
    },
    exam: {
      type: "object", additionalProperties: false,
      required: ["questionCount", "timeLimitMin", "passMode", "passValue", "scaledMax", "multiSelect"],
      properties: {
        questionCount: { type: "integer", description: "Questions on the real exam. Use 60 if the source does not say." },
        timeLimitMin: { type: "integer", description: "Time limit in minutes. Use 90 if the source does not say." },
        passMode: { type: "string", enum: ["scaled", "raw"], description: "raw = N correct out of M; scaled = a scaled score" },
        passValue: { type: "integer", description: "The cut score: correct answers needed, or the scaled cut" },
        scaledMax: { type: "integer", description: "Top of the scaled range, e.g. 1000. Use 0 when passMode is raw." },
        multiSelect: { type: "boolean", description: "Does the real exam use multiple-answer items?" },
      },
    },
    domains: {
      type: "array",
      description: "Between 4 and 8 domains. Weights must sum to exactly 1.",
      items: {
        type: "object", additionalProperties: false,
        required: ["id", "name", "weight", "summary", "keyPoints", "objectives"],
        properties: {
          id: { type: "string", description: "Lowercase slug, 2-8 letters, a-z only, unique across domains" },
          name: { type: "string" },
          weight: { type: "number", description: "Share of the exam as a fraction of 1. All weights sum to exactly 1." },
          summary: { type: "string", description: "What this domain covers, in two or three sentences" },
          keyPoints: { type: "array", items: { type: "string" },
            description: "6 to 10 crib-sheet facts: the things worth reading in the last hour before the exam" },
          objectives: { type: "array", items: { type: "string" },
            description: "3 to 8 concrete testable objectives" },
        },
      },
    },
    tasks: {
      type: "array",
      description: "Practicum or workbook deliverables the candidate must complete and submit. Empty array if the source describes none.",
      items: {
        type: "object", additionalProperties: false,
        required: ["domainId", "title", "minutes", "detail"],
        properties: {
          domainId: { type: "string", description: "Which domain slug this belongs to" },
          title: { type: "string", description: "The deliverable, phrased as an action" },
          minutes: { type: "integer", description: "Realistic minutes to complete" },
          detail: { type: "string", description: "What is actually required, and what good looks like" },
        },
      },
    },
  },
};

const CHUNK_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["domainId", "cards", "questions"],
  properties: {
    domainId: { type: "string" },
    cards: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: ["f", "b", "x"],
        properties: {
          f: { type: "string", description: "Front: one question or term, at most 20 words" },
          b: { type: "string", description: "Back: the answer plus why it matters, at most 45 words" },
          x: { type: "integer", enum: [1, 2, 3], description: "1 plain recall, 2 applied, 3 subtle or commonly confused" },
        },
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: ["s", "c", "a", "e", "x"],
        properties: {
          s: { type: "string", description: "The stem. Scenario-based wherever the objective allows." },
          c: { type: "array", items: { type: "string" }, description: "Exactly 4 choices. Distractors must be plausible." },
          a: { type: "array", items: { type: "integer" },
            description: "Zero-based indices of the correct choices. Exactly one unless the exam uses multi-answer items." },
          e: { type: "string", description: "Why the answer is right and why the best distractor is wrong. At most 50 words." },
          x: { type: "integer", enum: [1, 2, 3] },
        },
      },
    },
  },
};

/* ═══════════════ THE CALL ═══════════════ */

/* One Messages API call returning parsed structured output.
   Throws Error with a message written for a human. */
async function claudeCall({ systemBlocks, user, schema, maxTokens, effort }) {
  const key = (state.aiKey || "").trim();
  if (!key) throw new Error("No API key yet. Add one in Settings.");

  const body = {
    model: state.aiModel || "claude-opus-5",
    max_tokens: maxTokens,
    system: systemBlocks,
    output_config: { effort, format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: user }],
  };

  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        // Required for the API to accept a call made straight from a browser.
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error("Could not reach Claude. Check your connection.");
  }

  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).error?.message || ""; } catch (e) { /* nothing to read */ }
    if (res.status === 401) throw new Error("That API key was rejected. Check it in Settings.");
    if (res.status === 403) throw new Error("That key is not allowed to use the selected model.");
    if (res.status === 429) { const err = new Error("Rate limited by Anthropic."); err.retryable = true; throw err; }
    if (res.status === 400 && /credit|balance/i.test(detail)) throw new Error("Your Anthropic account is out of credit.");
    if (res.status >= 500) { const err = new Error("Claude is not responding right now."); err.retryable = true; throw err; }
    throw new Error("The request failed (" + res.status + ")" + (detail ? ": " + detail : "."));
  }

  const data = await res.json();
  // stop_reason must be read before content: on a refusal, content is empty,
  // and on a truncation the JSON is invalid rather than merely short.
  if (data.stop_reason === "refusal") throw new Error("Claude declined to generate from that source material.");
  if (data.stop_reason === "max_tokens") throw new Error("The reply was cut off. Try a shorter section of the workbook.");

  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  if (!text.trim()) throw new Error("Claude returned nothing. Try again.");
  try { return JSON.parse(text); }
  catch (e) { throw new Error("Could not read Claude's reply. Try again."); }
}

/* Losing chunk six of eight to a transient 429 is a bad experience even with
   resume, so retryable failures get two backed-off attempts before surfacing. */
async function claudeRetry(opts) {
  const waits = [5000, 15000];
  for (let attempt = 0; ; attempt++) {
    try { return await claudeCall(opts); }
    catch (e) {
      if (!e.retryable || attempt >= waits.length) throw e;
      await new Promise(r => setTimeout(r, waits[attempt]));
    }
  }
}

/* The workbook is sent on every call. Marking it as a cache breakpoint makes
   the second and later calls read it at a fraction of the input price — the
   difference between roughly $0.60 and roughly $2 for a seven-domain course.
   The blocks must be byte-identical across calls for the cache to hit. */
function systemBlocks(source) {
  return [
    { type: "text", text: SYS_AUTHOR, cache_control: { type: "ephemeral" } },
    { type: "text", text: "SOURCE MATERIAL:\n\n" + source, cache_control: { type: "ephemeral" } },
  ];
}

/* ═══════════════ VALIDATION ═══════════════

   The schema guarantees shape, not sense. Everything below is the difference
   between a course that drills correctly and one that trains wrong answers. */

function validateOutline(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Claude's outline was unusable. Try again.");
  const doms = Array.isArray(raw.domains) ? raw.domains : [];
  const seen = new Set();
  const clean = [];
  for (const d of doms) {
    const id = String((d && d.id) || "").toLowerCase().replace(/[^a-z]/g, "").slice(0, 8);
    const name = txt(d && d.name, 90);
    const w = Number(d && d.weight);
    if (!id || !name || seen.has(id) || !Number.isFinite(w) || w <= 0) continue;
    seen.add(id);
    clean.push({
      id, name, weight: w,
      summary: txt(d.summary, 600),
      keyPoints: strList(d.keyPoints, 12, 300),
      objectives: strList(d.objectives, 10, 200),
    });
  }
  if (clean.length < 2) throw new Error("Claude could not find enough distinct topics in that material.");
  if (clean.length > 10) clean.length = 10;

  // Weights are asked to sum to one but nothing can enforce it, so renormalize.
  const sum = clean.reduce((t, d) => t + d.weight, 0);
  clean.forEach(d => { d.weight = d.weight / sum; });

  return { cert: raw.cert || {}, exam: raw.exam || {}, domains: clean, tasks: Array.isArray(raw.tasks) ? raw.tasks : [] };
}

/* Reject and repair, never trust. Each rule below corresponds to a way a
   generated item would actively mistrain someone. */
function validateChunk(raw, domain, wantCards, wantQuestions, seenStems, multiSelect) {
  const cards = [];
  for (const c of (Array.isArray(raw && raw.cards) ? raw.cards : [])) {
    const f = txt(c && c.f, 240), b = txt(c && c.b, 700);
    if (!f || !b) continue;
    cards.push({ d: domain.id, f, b, x: int(c.x, 1, 3, 2) });
  }

  const questions = [];
  for (const q of (Array.isArray(raw && raw.questions) ? raw.questions : [])) {
    const s = txt(q && q.s, 700);
    if (!s) continue;
    const key = s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    if (seenStems.has(key)) continue;                       // duplicate across chunks

    const choices = strList(q.c, 6, 400);
    if (choices.length !== 4) continue;                     // the graders assume four
    if (new Set(choices.map(t => t.toLowerCase())).size !== 4) continue;   // a repeated choice

    let a = Array.isArray(q.a) ? q.a : [q.a];
    a = [...new Set(a.map(n => Math.round(Number(n))))].filter(n => Number.isFinite(n) && n >= 0 && n < 4);
    if (!a.length || a.length === 4) continue;              // no answer, or everything is right
    if (a.length > 1 && !multiSelect) continue;             // multi-answer on a single-answer exam

    seenStems.add(key);
    questions.push({ d: domain.id, s, c: choices, a: a.sort((m, n) => m - n), e: txt(q.e, 900), x: int(q.x, 1, 3, 2) });
  }

  // A chunk that came back well under the ask gets one delta attempt. Below the
  // threshold twice, we take what we have rather than loop.
  const short = cards.length < wantCards * 0.7 || questions.length < wantQuestions * 0.7;
  return {
    cards, questions, short,
    needCards: Math.max(0, wantCards - cards.length),
    needQuestions: Math.max(0, wantQuestions - questions.length),
  };
}

/* ═══════════════ PROMPTS ═══════════════ */

const OUTLINE_PROMPT = `Read the source material and produce the exam outline.

Identify between 4 and 8 domains. Weight each by how much of the exam it represents — use the source's own stated weightings if it gives them, otherwise infer from how much space and emphasis each topic receives. The weights must sum to exactly 1.

For each domain write a short summary, 6 to 10 crib-sheet key points (the things worth re-reading in the final hour before the exam), and 3 to 8 testable objectives.

If the source describes a practicum, workbook activities or anything the candidate must complete and submit, list those under tasks. If it describes none, return an empty array.

If the source states the exam format — number of questions, time limit, pass mark — use it exactly. Where it is silent, use sensible defaults and say so in the blurb.`;

function chunkPrompt(domain, wantCards, wantQuestions, outline, avoid) {
  let p = `Write study material for one domain of the ${outline.cert.name || "certification"}.

DOMAIN: ${domain.name} (${Math.round(domain.weight * 100)}% of the exam)
${domain.summary ? "SCOPE: " + domain.summary + "\n" : ""}${domain.objectives.length ? "OBJECTIVES:\n- " + domain.objectives.join("\n- ") + "\n" : ""}
Produce exactly ${wantCards} flashcards and exactly ${wantQuestions} multiple-choice questions covering these objectives.

Every question must have exactly 4 choices${outline.exam.multiSelect ? " and may occasionally have more than one correct answer" : " and exactly one correct answer"}. Spread the correct answer across all four positions rather than favouring any one. Vary difficulty: roughly a third plain recall, a third applied, a third subtle distinctions a half-prepared candidate would get wrong.

Set domainId to "${domain.id}".`;
  if (avoid && avoid.length) {
    p += `\n\nDo not repeat any of these stems that are already written:\n- ` + avoid.slice(-40).join("\n- ");
  }
  return p;
}

/* ═══════════════ THE PIPELINE ═══════════════ */

/* How many items a domain gets. Roughly twice the exam's question count in
   total, so mock papers can sample without immediately repeating. */
function budgetFor(domain, outline, domainCount) {
  const q = clamp(Math.round(2 * (outline.exam.questionCount || 60) * domain.weight), 6, 22);
  const c = clamp(Math.round(q * 0.8), 5, 18);
  return { wantQuestions: q, wantCards: c };
}

/* Generate a course, resuming from state.gen if a previous run was interrupted.
   onProgress(step, total, label) drives the progress list in the modal. */
async function generateCourse(source, onProgress) {
  /* source === null means "resume the stored job". The material is kept on the
     job itself, because the cached system block has to be byte-identical across
     every call for the prompt cache to hit, and a resumed run makes those calls
     in a fresh page load. The job is cleared on success, so the material does
     not linger in storage. */
  let src;
  if (source === null) {
    if (!state.gen || !state.gen.source) throw new Error("There is nothing to resume.");
    src = state.gen.source;
  } else {
    src = String(source).slice(0, MAX_SOURCE_CHARS);
    if (src.trim().length < 200) throw new Error("That is too short to build a course from. Paste the workbook or syllabus text.");
    // Starting from different material means the stored outline no longer applies.
    if (state.gen && state.gen.source !== src) state.gen = null;
  }

  const job = state.gen || (state.gen = {
    id: uid("g"), started: Date.now(), source: src, outline: null, chunks: {},
  });

  const sys = systemBlocks(src);

  if (!job.outline) {
    onProgress(0, 1, "Reading the source material");
    job.outline = validateOutline(await claudeRetry({
      systemBlocks: sys, user: OUTLINE_PROMPT, schema: OUTLINE_SCHEMA,
      maxTokens: MAX_TOK_OUTLINE, effort: "high",
    }));
    save();
  }

  const outline = job.outline;
  const doms = outline.domains;
  const total = doms.length + 1;
  const multiSelect = !!(outline.exam && outline.exam.multiSelect);

  // Stems already written, so a resumed run does not duplicate what it has.
  const seenStems = new Set();
  for (const id of Object.keys(job.chunks)) {
    for (const q of job.chunks[id].questions || []) {
      seenStems.add(q.s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim());
    }
  }

  /* Sequential, not parallel: one browser key hits rate limits fast, and a
     partial failure inside a parallel batch is far harder to resume cleanly. */
  for (let i = 0; i < doms.length; i++) {
    const d = doms[i];
    onProgress(i + 1, total, d.name);
    if (job.chunks[d.id]) continue;

    const { wantCards, wantQuestions } = budgetFor(d, outline, doms.length);
    const raw = await claudeRetry({
      systemBlocks: sys, user: chunkPrompt(d, wantCards, wantQuestions, outline, [...seenStems]),
      schema: CHUNK_SCHEMA, maxTokens: MAX_TOK_CHUNK, effort: "medium",
    });
    let v = validateChunk(raw, d, wantCards, wantQuestions, seenStems, multiSelect);

    /* A chunk that came back light gets one top-up call. If that call fails we
       keep what the first one produced rather than losing the domain: a short
       chunk is worth far more than nothing, and discarding it would also cost a
       full re-generation of this domain on resume. */
    if (v.short) {
      try {
        const top = await claudeRetry({
          systemBlocks: sys,
          user: chunkPrompt(d, Math.max(1, v.needCards), Math.max(1, v.needQuestions), outline, [...seenStems]),
          schema: CHUNK_SCHEMA, maxTokens: MAX_TOK_CHUNK, effort: "medium",
        });
        const extra = validateChunk(top, d, v.needCards, v.needQuestions, seenStems, multiSelect);
        v = { cards: v.cards.concat(extra.cards), questions: v.questions.concat(extra.questions) };
      } catch (e) {
        if (!v.cards.length && !v.questions.length) throw e;   // nothing to salvage
      }
    }

    job.chunks[d.id] = { cards: v.cards, questions: v.questions };
    save();   // persist after every domain — this is the whole resume mechanism
  }

  onProgress(total, total, "Assembling");
  const course = assembleCourse(job);
  if (!course) throw new Error("The generated material did not contain enough usable questions.");

  // A regenerated course replaces the previous version of itself rather than
  // accumulating duplicates in the library.
  aiCourses = aiCourses.filter(c => c.id !== course.id).concat([course]);
  try { saveAiCourses(); }
  catch (e) {
    aiCourses = aiCourses.filter(c => c.id !== course.id);
    throw new Error("Not enough storage for another generated course. Delete one in Certs first.");
  }
  CERT.setAi(aiCourses);

  state.gen = null;
  save();
  return course;
}

function assembleCourse(job) {
  const o = job.outline;
  const base = String(o.cert.code || o.cert.name || "course").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 24);
  const id = "ai-" + (base || "course");

  const cards = [], questions = [];
  for (const d of o.domains) {
    const ch = job.chunks[d.id];
    if (!ch) continue;
    cards.push(...ch.cards);
    questions.push(...ch.questions);
  }

  const domIds = new Set(o.domains.map(d => d.id));
  const tasks = (o.tasks || []).map(t => ({
    d: domIds.has(t && t.domainId) ? t.domainId : o.domains[0].id,
    title: txt(t && t.title, 200), minutes: int(t && t.minutes, 5, 480, 30), detail: txt(t && t.detail, 800),
  })).filter(t => t.title);

  return normalizeCourse({
    id, built: dkey(),
    cert: o.cert, exam: o.exam,
    domains: o.domains, cards, questions, tasks,
  }, "ai");
}

/* A resumable job, for the "resume generating" prompt in the Certs view. */
function pendingGeneration() {
  if (!state.gen || !state.gen.outline) return null;
  const doms = state.gen.outline.domains;
  const done = doms.filter(d => state.gen.chunks[d.id]).length;
  if (done >= doms.length) return null;
  return { name: state.gen.outline.cert.name || "course", done, total: doms.length };
}
