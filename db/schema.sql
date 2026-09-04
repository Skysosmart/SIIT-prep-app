-- Leaderboard table for SIIT PREP (Neon / any Postgres).
-- The API auto-creates this on first request, so running it manually is optional.

create table if not exists scores (
  player_id uuid primary key,
  name text not null check (char_length(name) between 2 and 20),
  xp integer not null default 0 check (xp >= 0),
  quizzes integer not null default 0 check (quizzes >= 0),
  accuracy integer not null default 0 check (accuracy between 0 and 100),
  streak integer not null default 0 check (streak >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists scores_xp_idx on scores (xp desc);
