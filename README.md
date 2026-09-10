# SIIT Math Arena

A Kahoot-inspired quiz website for SIIT entrance-exam prep — timed formula quizzes,
a searchable formula library, XP/streak tracking, a leaderboard, and a student dashboard.

**557 questions** across 21 topics — Math 357 (Sets & Logic → Calculus), English 135,
Physics 65 — transcribed from the SIIT question banks and rendered with real LaTeX (KaTeX).
A further **294 original SAT items** live under `/sat` (see below).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy

Pushing to `main` builds a static export and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`. One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

Live site: https://skysosmart.github.io/SIIT-prep-app/

## SAT practice (`/sat`)

SIIT admits on SAT scores as an alternative to its own entrance exam - the bar is
**Math 620** and **Evidence-Based Reading and Writing 400** - so the app also
simulates the digital SAT.

- Real structure: two modules per section (R&W 27 q / 32 min, Math 22 q / 35 min),
  a 10-minute break, 2 unscored pretest items per module, fixed A-D choice order.
- **Multistage adaptive**: module 1 decides whether you get the harder or easier
  module 2, independently for each section. The routing cutoff is an
  approximation - College Board publishes neither the cutoff nor item
  parameters - and lives in one constant, `ROUTE_CUTOFF` in `lib/sat/spec.ts`.
- **Grid-ins**: ~25% of Math is student-produced response, graded on exact
  rationals with the real fill-the-grid rule (2/3 accepts `.6666`/`.6667`, not `.66`).
- Scores are **estimated** 200-800 per section and shown as a range against the
  SIIT cutoffs. The real test scales with item response theory, which cannot be
  reproduced from a raw count.

**Two full-length papers.** Form A and Form B are independent: 294 authored
questions in total, no shared ids, no shared passages, no shared math questions.
Each paper is 147 items (66 Math, 81 R&W) because module 2 exists in both an
easier and a harder version; a student sees 98 in one sitting. Pick a paper on
`/sat`.

All SAT questions and passages are **original**, written from scratch to the
published blueprint. Real administered SAT forms are not publicly released.

There are no accounts: all progress, including SAT attempts, lives in the
browser's `localStorage`. An interrupted sitting is autosaved there
(`lib/sat/progress.ts`) and offered for resume on `/sat`. The module clock keeps running while you are away -
reloading is not a way to pause a timed test - and a save older than six hours is
discarded.

`lib/sat/validate.ts` enforces the blueprint - module sizes, domain quotas,
question order, difficulty mix, grid-legal answers - and is imported from
`next.config.ts`, so a malformed form **fails `npm run build`**.

Alongside it, `npm test` runs 45 tests on Node's built-in `node:test` (no test
framework is installed) covering the grader, routing, scoring curves, content
integrity and autosave, and `npm run test:math` re-derives every SAT math answer
with sympy. See `tests/README.md`. Run `npm run typecheck` for the fast signal.

### On-screen format

The runner reproduces Bluebook, the real digital SAT app: a full-screen shell with
the section/module title and a `Directions` disclosure, a centred countdown that can
be hidden, the practice-test banner, a numbered question header with **Mark for
Review** and the **ABC** answer-eliminator, a resizable split pane for passages and
directions, the question navigator, and a *Check Your Work* review page before the
module is submitted.

The Math section carries the same two tools the real test does:

- **Calculator** — the Desmos graphing calculator, which is what College Board
  actually embeds in Bluebook, loaded through Desmos's public calculator API. It
  needs a network connection; the rest of the test works offline. The bundled key
  is Desmos's published demo key - set `NEXT_PUBLIC_DESMOS_API_KEY` to use your own.
- **Reference** — the published SAT reference sheet, the only formulas the real
  test hands you.

## Stack

- Next.js 15 (App Router, static export) + TypeScript
- KaTeX for math rendering
- Plain CSS design tokens (light + dark themes), no UI framework
- Progress persisted in `localStorage` — no accounts, no backend

## How to play

Pick a topic → choose a mode (Formula Recall / Fill the Missing Formula / Calculation / Mixed)
and difficulty (scales the timer) → answer with clicks or keys **1–6** → review mistakes and
retry. Correct answers earn points (speed + streak bonuses) and XP toward your rank.

In the SAT runner the keys are **1–4** to answer, **←/→** to move, **M** to mark for
review, and **C** / **R** for the calculator and reference sheet.
