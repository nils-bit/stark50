# CERTCRAM

An offline-first study app for certification exams. It works out which domains
carry the most marks, measures which ones you are actually weak in, and spends
every minute you have where those two overlap.

Built as a zero-dependency static PWA: no build step, no npm, no framework.
Clone it, open `index.html`, add it to your phone's home screen.

---

## Why it exists

Most study apps let you drill whatever you feel like drilling, which is
reliably the material you already know. If you have an hour a day and an exam
next week, full coverage is not available and the only thing that works is
ruthless prioritisation.

Four ideas do the work:

**The 80/20 engine.** Each domain's true accuracy is modelled as a Beta
posterior rather than a raw percentage, so the app can tell the difference
between *"you scored 50% on this"* and *"you have never opened this"*. Priority
is `weight × [max(0, target − mean) + 0.7 × sd]`. The uncertainty term is what
makes it an 80/20 engine rather than a weakness-chaser: an untested 15%-weight
domain outranks a measured-weak 21%-weight domain, because you do not yet know
how bad it is and finding out is cheap. After a dozen questions its uncertainty
collapses and it demotes itself if it turns out fine.

**Readiness that will not flatter you.** A weighted average of your accuracies
ignores two things that decide whether you pass: untested domains are guesswork,
and a 60-question exam is a small sample. So readiness is a Monte Carlo — sample
each domain's ability from its posterior, run the binomial draw for that
domain's share of the paper, count how often the simulated candidate clears the
line. With nothing studied it reports about 2%, not 50%, and the headline always
carries its caveat: *"56% of this exam has never been tested."*

**Spaced repetition tuned for exams, not for life.** SM-2 quantises intervals in
days and hardcodes its first two to 1 and 6, so a card learned on day 1 is next
due on day 8 — it cannot schedule a third review before a Friday exam. CERTCRAM
uses a Leitner ladder measured in minutes, scaled by your actual horizon and
capped so no interval ever lands after the exam. Seven days out, intervals
roughly halve and cards recycle several times a day; sixty days out they stretch
into ordinary spaced repetition.

**Anything can become a course.** Paste a workbook, syllabus or exam guide and
Claude turns it into a weighted course with flashcards, questions and a
practicum checklist. Generation is chunked — one call for the outline, one per
domain — and saved after every domain, so closing your phone halfway through
loses nothing.

---

## Running it

Any static file server:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

To reach it from your phone on the same network, use your laptop's LAN address.
Note that service workers and offline mode need a secure context — `localhost`
counts, a bare LAN IP over plain HTTP does not.

### GitHub Pages

Settings → Pages → deploy from a branch, pick the branch and `/` (root). Every
path in the app is relative, so it works from a subdirectory without changes —
which is how it is currently deployed, alongside STARK50 at `/certcram/`.
Nothing needs building.

**Sharing an origin with another PWA.** `caches` is scoped per origin, not per
service-worker scope, so a sibling app whose `activate` handler deletes every
cache it does not recognise will silently wipe this one. STARK50's worker is
filtered to its own `stark50-` prefix for exactly that reason. If you deploy
CERTCRAM next to anything else, check that app's cache-purge filter too.

---

## Your data

Everything lives in this browser's `localStorage`, on this device. There is no
account, no server and no sync. Two keys:

| Key | Holds | Size |
|---|---|---|
| `cc_state_v1` | progress, plan, preferences, API key | ~80 kB |
| `cc_courses_v1` | workbook-generated courses | 0–1.5 MB |

They are split because `save()` runs on every card grade — around sixty times an
hour. Progress serialises in well under a millisecond; folding ~93 kB generated
courses into the same blob would put 8–20 ms of synchronous main-thread work in
the middle of every card flip. Built-in courses live in `courses/*.js`, are
cached by the service worker, and cost no storage at all.

Studying on the phone and the laptop are separate universes. **Settings →
Export backup** is the only bridge, and it round-trips both keys in one file.

Two things worth knowing:

- On iOS, Safari clears storage for sites you have not opened in about a week —
  and a week is the entire prep window. Add it to your home screen; installed
  apps are exempt.
- The backup file contains your API key. Treat it as a secret.

### The API key

Course generation calls Claude directly from your browser with your own
`sk-ant-…` key. It is stored on the device and sent nowhere but
`api.anthropic.com`. A generated course costs roughly $0.15–$0.60 depending on
the model; the workbook is sent as a cached prompt prefix so the per-domain
calls read it at a fraction of the input price.

---

## The built-in courses

| Course | Domains | Cards | Questions | Pass mark |
|---|---|---|---|---|
| HubSpot Certified Trainer | 5 | 50 | 46 | 45 / 60, plus a graded practicum |
| HubSpot Revenue Operations | 5 | 40 | 37 | 45 / 60 |
| Claude Certified Associate — Foundations | 7 | 58 | 46 | 720 / 1000 |

All content is original, written from published exam guides and official course
outlines. Nothing here reproduces a real exam question — that would breach every
certification NDA and would not help you anyway, since the point is to drill the
objective rather than memorise an item.

**Domain weightings are not all official.** Five of the seven CCAO-F weights come
from Anthropic's published exam guide; the remaining ~22% is split across two
domains as an estimate. HubSpot does not publish numeric blueprints, so both
HubSpot courses infer weights from the relative depth of the published lessons.
Since these weights are literally the scheduler's input, correct them in
`courses/*.js` if you have better numbers — the app renormalises whatever you
give it.

Generated courses are marked as such throughout, and their readiness estimate is
deliberately shrunk toward chance: a bank the app wrote itself from a syllabus it
also summarised is weaker evidence than a real one.

---

## Layout

```
index.html            app shell; ordered <script> tags
core.js               DOM/date helpers, escaping, toasts, modal
state.js              two-key persistence + the defensive normalizeState
course.js             course registry and validation
srs.js                the Leitner ladder and the queue builders
engine.js             posteriors, 80/20 priority, Monte Carlo readiness
plan.js               the daily plan generator
ai.js                 chunked workbook → course generation
drill.js              flashcard and quiz loop
mock.js               timed mock exams
views.js              Today, Certs, Settings
onboarding.js         first-run step machine
app.js                boot, routing, reminders, .ics export
sw.js                 offline cache, network-first shell
courses/*.js          course content
```

Classic scripts in one shared scope, loaded in dependency order. No ES modules:
nothing here needs them and they would complicate both the service worker's
asset list and opening the app straight off disk.

---

## Adding a course by hand

Copy any file in `courses/`, adjust it, and add a `<script>` tag to
`index.html` and an entry to `ASSETS` in `sw.js`. `normalizeCourse()` validates
everything on load — weights are renormalised to sum to 1, IDs are reassigned,
and questions with an out-of-range answer key, a duplicate stem or four
identical choices are dropped rather than allowed to train the wrong answer.
