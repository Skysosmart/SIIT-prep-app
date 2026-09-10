# SIIT Math Arena

A Kahoot-inspired quiz website for SIIT entrance-exam math prep — timed formula quizzes,
a searchable formula library, XP/streak tracking, a leaderboard, and a student dashboard.

**157 questions** across 12 topics, transcribed from the SIIT Math Formula question bank
(Sets & Logic → Calculus), rendered with real LaTeX (KaTeX).

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
`next.config.ts`, so a malformed form **fails `npm run build`**. That is
deliberate: it is the only automated gate in a repo with no test framework.
Run `npm run typecheck` for the fast signal.

## Stack

- Next.js 15 (App Router, static export) + TypeScript
- KaTeX for math rendering
- Plain CSS design tokens (light + dark themes), no UI framework
- Progress persisted in `localStorage` — no accounts, no backend

## How to play

Pick a topic → choose a mode (Formula Recall / Fill the Missing Formula / Calculation / Mixed)
and difficulty (scales the timer) → answer with clicks or keys **1–4** → review mistakes and
retry. Correct answers earn points (speed + streak bonuses) and XP toward your rank.
