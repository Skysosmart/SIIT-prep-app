-- SIIT Math Arena leaderboard schema.
-- Run this once in your Supabase project: SQL Editor -> New query -> paste -> Run.

create table if not exists public.scores (
  player_id uuid primary key,
  name text not null check (char_length(name) between 2 and 20),
  xp integer not null default 0 check (xp >= 0),
  quizzes integer not null default 0 check (quizzes >= 0),
  accuracy integer not null default 0 check (accuracy between 0 and 100),
  streak integer not null default 0 check (streak >= 0),
  updated_at timestamptz not null default now()
);

alter table public.scores enable row level security;

-- Anonymous friends-leaderboard policies: anyone with the anon key can read,
-- join, and update a row. Fine for a classmate leaderboard; don't store
-- anything sensitive here.
create policy "read scores"   on public.scores for select using (true);
create policy "insert scores" on public.scores for insert with check (true);
create policy "update scores" on public.scores for update using (true) with check (true);

create index if not exists scores_xp_idx on public.scores (xp desc);
