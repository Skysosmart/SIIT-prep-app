import { Pool } from "pg";

/** Shared Postgres pool (Neon in production). Null when DATABASE_URL is unset. */
let pool: Pool | null = null;
let schemaReady = false;

export function db(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  pool ??= new Pool({
    connectionString: url,
    max: 1,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
  });
  return pool;
}

/** Create all tables once per warm instance. */
export async function ensureSchema(p: Pool): Promise<void> {
  if (schemaReady) return;
  await p.query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      email text unique not null,
      name text not null,
      password_hash text,
      google_sub text unique,
      provider text not null default 'email',
      created_at timestamptz not null default now()
    );
    create table if not exists profiles (
      user_id uuid primary key references users(id) on delete cascade,
      data jsonb not null default '{}'::jsonb,
      updated_at timestamptz not null default now()
    );
    create table if not exists scores (
      player_id uuid primary key,
      name text not null,
      xp integer not null default 0,
      quizzes integer not null default 0,
      accuracy integer not null default 0,
      streak integer not null default 0,
      updated_at timestamptz not null default now()
    );
    create index if not exists scores_xp_idx on scores (xp desc);
  `);
  schemaReady = true;
}
