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

## Shared leaderboard (Supabase)

The leaderboard can sync scores between players. One-time setup:

1. Create a free project at https://supabase.com → **New project**.
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
3. Grab **Project Settings → API**: the Project URL and the `anon` public key.
4. Add both as environment variables wherever the site builds:
   - **Vercel**: Project → Settings → Environment Variables →
     `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then redeploy.
   - **GitHub Pages**: repo Settings → Secrets and variables → Actions → add the
     same two names as repository secrets.

Without the variables the leaderboard falls back to a local-only view.
Players pick a nickname on the Leaderboard page; scores upsert per device.

## Stack

- Next.js 15 (App Router, static export) + TypeScript
- KaTeX for math rendering
- Plain CSS design tokens (light + dark themes), no UI framework
- Progress persisted in `localStorage` — no backend

## How to play

Pick a topic → choose a mode (Formula Recall / Fill the Missing Formula / Calculation / Mixed)
and difficulty (scales the timer) → answer with clicks or keys **1–4** → review mistakes and
retry. Correct answers earn points (speed + streak bonuses) and XP toward your rank.
