/* CERTCRAM — spaced repetition, tuned for exams rather than for life.

   This is a modified Leitner ladder, not SM-2. SM-2 is the right algorithm when
   the goal is to remember something indefinitely at minimum review cost. It is
   the wrong one here, for four concrete reasons:

     1. Its unit of time is a day and its first two intervals are hardcoded to 1
        and 6. A card learned on day 1 and graded well three times is due on day
        2, then day 8. With an exam on day 7 it cannot schedule the third review
        at all. That is structural, not a tuning problem.
     2. Its ease factor needs five or more reviews per card to move away from the
        2.5 default. In a one-week window most cards get two to four, so every
        ease factor in the deck would still be ~2.5 on exam day — SM-2 degenerates
        into a fixed schedule with extra bookkeeping.
     3. Different objective. SM-2 minimizes total reviews subject to long-term
        retention. Cramming maximizes retention at one instant and does not care
        about day 30. The right policy is front-loaded and terminates at the exam.
     4. Robustness. A box is an integer clamped to a known range. An ease factor
        is a float that can arrive from a corrupt import as 0 or negative, and
        then the due date is Infinity or NaN — a card that either never appears
        or never leaves.

   The ladder below is measured in minutes, and its first three steps are
   intra-day. With one hour of study a day, the only way a card gets four
   exposures in a week is if some of them happen inside a single sitting. */
"use strict";

/* Box → base interval in minutes. Box 0 means "again this session". */
const BOX_MIN = [1, 12, 50, 240, 1440, 2880, 5760];   // 1 m, 12 m, 50 m, 4 h, 1 d, 2 d, 4 d
const MAX_BOX = BOX_MIN.length - 1;

/* Grades from the flashcard buttons. */
const GRADE = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };

/* Intrinsic difficulty multiplier. A subtle, commonly-confused item comes back
   sooner than a plain recall item sitting in the same box. */
const DIFF_MULT = { 1: 1.15, 2: 1.0, 3: 0.78 };

/* The horizon at which the ladder runs exactly as authored. Shorter than this
   and intervals compress; longer and they stretch. */
const HORIZON_NEUTRAL_DAYS = 14;

/* Reschedule one card after a grade.

   `examTime` is epoch ms for this course's exam, or null when no date is set.
   Everything except the exam cap is ordinary Leitner; the cap is the whole
   difference between this and a normal SRS. */
function schedule(st, x, grade, nowMs, examTime) {
  let b = st.box | 0;
  if (grade === GRADE.AGAIN) { b = 0; st.lapses = (st.lapses | 0) + 1; }
  else if (grade === GRADE.HARD) { b = Math.max(0, b - 1); }
  else if (grade === GRADE.EASY) { b = Math.min(MAX_BOX, b + 2); }
  else { b = Math.min(MAX_BOX, b + 1); }

  let mins = BOX_MIN[b] * (DIFF_MULT[x] || 1);

  // Each failure permanently compresses this card's schedule. A card you have
  // missed three times is not the same card as one you have never missed, even
  // once they are both sitting in box 3.
  mins *= Math.pow(0.82, Math.min(4, st.lapses | 0));

  /* Horizon scaling. The same ladder cannot serve a one-week cram and a
     two-month runway, so it is stretched or compressed by how long is actually
     left. Two weeks is the neutral point: seven days out roughly halves every
     interval so cards recycle several times a day, sixty days out stretches
     them into ordinary spaced repetition, and no exam date leaves the ladder
     as authored. */
  if (examTime) {
    const daysLeft = (examTime - nowMs) / 864e5;
    mins *= clamp(daysLeft / HORIZON_NEUTRAL_DAYS, 0.3, 2.5);
  }

  /* The cram cap. Never schedule a card past the exam, and always leave room
     for at least one more look: taking 45% of the remaining window guarantees
     two further exposures. Without this, a card graded "easy" on day 5 of a
     seven-day run gets a four-day interval and is never seen again. */
  if (examTime) {
    const leftMin = Math.max(0, (examTime - nowMs) / 60000);
    mins = Math.min(mins, Math.max(1, leftMin * 0.45));
  }

  // Jitter, so a batch learned together does not return as a wall.
  mins *= 0.88 + Math.random() * 0.24;

  st.box = b;
  st.due = nowMs + Math.round(mins * 60000);
  st.reps = (st.reps | 0) + 1;
  st.ts = nowMs;
  return st;
}

/* A fresh card record. Unseen cards are not stored until first graded, so an
   untouched course costs zero bytes of progress. */
const newCardState = () => ({ box: 0, due: 0, reps: 0, lapses: 0, ts: 0 });

/* How overdue a card is, relative to the interval it was given. A card 10
   minutes late off a 12-minute interval is far more urgent than one 10 minutes
   late off four days, and a flat "now - due" would rank them the other way. */
function overdueFactor(st, now) {
  if (!st || !st.reps) return 2.5;            // unseen: interleave with strongly-overdue reviews
  const window = Math.max(6e4, BOX_MIN[st.box | 0] * 6e4);
  return clamp((now - st.due) / window, 0, 3);
}

/* Item-level priority inside an already-chosen domain. */
function cardScore(card, st, domainPriority, now) {
  const weak = 1 - (st ? (st.box | 0) : 0) / MAX_BOX;
  const lapse = 1 + 0.3 * Math.min(3, st ? (st.lapses | 0) : 0);
  const diff = 0.85 + 0.15 * (card.x || 2);
  return domainPriority * (0.5 + overdueFactor(st, now)) * (0.4 + weak) * lapse * diff;
}

/* Is this card due right now? Unseen cards are due by definition. */
function isDue(courseId, card, now) {
  const st = cardState(courseId, card.id);
  return !st || !st.reps || st.due <= now;
}

/* Build the card queue for a study block.

   Two rules the boxes cannot express, both mandatory:

   Final-day sweep — on the exam day and the day before, force-queue every card
   that has lapsed three times or is still sitting in box 0 or 1, regardless of
   its due date. Those are precisely the cards that will cost marks, and the
   ladder will happily have parked one four days out.

   New-card throttle — introducing sixty new cards on day six produces sixty
   box-0 cards with no time to mature, and they crowd out everything that was
   already working. Intake is capped against the days remaining. */
function buildCardQueue(courseId, domainPriorities, limit, daysLeft) {
  const course = CERT.byId(courseId);
  if (!course) return [];
  const now = Date.now();
  const p = prog(courseId);
  const finalDays = daysLeft !== null && daysLeft <= 1;

  const pool = course.cards.filter(card => {
    const st = p.c[card.id];
    if (!st || !st.reps) return true;                                  // unseen
    if (finalDays && ((st.lapses | 0) >= 3 || (st.box | 0) <= 1)) return true;  // sweep
    return st.due <= now;                                              // due
  });

  const scored = pool.map(card => ({
    card,
    st: p.c[card.id] || null,
    score: cardScore(card, p.c[card.id], domainPriorities[card.d] || 0.01, now),
  })).sort((a, b) => b.score - a.score);

  const maxNew = daysLeft === null ? 20 : Math.max(4, 12 * Math.max(1, daysLeft));
  let taken = 0, newTaken = 0;
  const out = [];
  for (const row of scored) {
    if (taken >= limit) break;
    const unseen = !row.st || !row.st.reps;
    if (unseen && newTaken >= maxNew) continue;
    out.push(row.card);
    taken++;
    if (unseen) newTaken++;
  }
  return out;
}

/* Question queue for a quiz block. Same domain weighting, but the recency rule
   is different: a question you answered correctly two hours ago teaches nothing
   if it comes straight back, so correct answers are suppressed for 48 hours
   while wrong ones are eligible immediately. */
function buildQuestionQueue(courseId, domainPriorities, limit, domainId = null) {
  const course = CERT.byId(courseId);
  if (!course) return [];
  const now = Date.now();
  const p = prog(courseId);

  const pool = liveQuestions(course).filter(q => {
    if (domainId && q.d !== domainId) return false;
    const st = p.q[q.id];
    if (!st || !st.n) return true;
    const gotItLast = st.c === st.n;                     // never missed it
    return !(gotItLast && now - st.ts < 48 * 3600e3);
  });

  const scored = pool.map(q => {
    const st = p.q[q.id];
    const unseen = !st || !st.n;
    const acc = unseen ? 0 : st.c / st.n;
    const recency = unseen ? 1.6 : clamp((now - st.ts) / (24 * 3600e3), 0, 2);
    const diff = 0.85 + 0.15 * (q.x || 2);
    return { q, score: (domainPriorities[q.d] || 0.01) * (1.4 - acc) * (0.6 + recency) * diff };
  }).sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(r => r.q);
}

/* Sample a mock paper: questions drawn per domain in proportion to exam weight,
   preferring the least recently seen so consecutive mocks are not identical. */
function sampleMock(courseId, count) {
  const course = CERT.byId(courseId);
  if (!course) return [];
  const p = prog(courseId);
  const live = liveQuestions(course);

  // Questions per domain, largest-remainder so the total lands exactly on count.
  const quotas = course.domains.map(d => ({ d, exact: d.weight * count, k: 0 }));
  quotas.forEach(q => { q.k = Math.floor(q.exact); });
  let short = count - quotas.reduce((t, q) => t + q.k, 0);
  quotas.sort((a, b) => (b.exact - b.k) - (a.exact - a.k));
  for (let i = 0; short > 0 && quotas.length; i++, short--) quotas[i % quotas.length].k++;

  const out = [];
  for (const q of quotas) {
    const pool = live.filter(x => x.d === q.d.id)
      .sort((a, b) => ((p.q[a.id] && p.q[a.id].ts) || 0) - ((p.q[b.id] && p.q[b.id].ts) || 0));
    out.push(...pool.slice(0, q.k));
  }

  // Short domains leave gaps; backfill from whatever is left so the paper is
  // the promised length rather than quietly shorter.
  if (out.length < count) {
    const have = new Set(out.map(x => x.id));
    const rest = live.filter(x => !have.has(x.id))
      .sort((a, b) => ((p.q[a.id] && p.q[a.id].ts) || 0) - ((p.q[b.id] && p.q[b.id].ts) || 0));
    out.push(...rest.slice(0, count - out.length));
  }

  return shuffle(out);
}

/* Fisher-Yates. Question order must vary between mocks or the third one is
   answered from memory of the sequence rather than the material. */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
