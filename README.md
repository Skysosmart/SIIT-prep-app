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

## Shared leaderboard (Neon Postgres)

The Vercel deployment runs `/api/scores` (Next API route + `pg`) against a
Neon database. One-time setup:

1. Create a free database at https://neon.tech and copy the connection string.
2. **Vercel** → Project → Settings → Environment Variables → add
   `DATABASE_URL` = that connection string → Redeploy.
3. Done - the API creates the `scores` table automatically
   (schema also in `db/schema.sql`). Never commit the connection string.

Players pick a nickname on the Leaderboard page; stats upsert per device.
The GitHub Pages build is fully static (the workflow strips `app/api`), so
its leaderboard falls back to a local-only view and links to the main site.

## Stack

- Next.js 15 (App Router, static export) + TypeScript
- KaTeX for math rendering
- Plain CSS design tokens (light + dark themes), no UI framework
- Progress persisted in `localStorage` — no backend

## How to play

Pick a topic → choose a mode (Formula Recall / Fill the Missing Formula / Calculation / Mixed)
and difficulty (scales the timer) → answer with clicks or keys **1–4** → review mistakes and
retry. Correct answers earn points (speed + streak bonuses) and XP toward your rank.
