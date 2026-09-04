import { NextResponse } from "next/server";
import { Pool } from "pg";

/**
 * Shared leaderboard API, backed by Postgres (Neon in production).
 * GET  /api/scores        -> top 50 rows by XP
 * POST /api/scores        -> upsert one player's stats
 *
 * Requires DATABASE_URL. This route only exists on server deployments
 * (Vercel); the GitHub Pages workflow strips it before its static build.
 */
export const dynamic = "force-dynamic";

let pool: Pool | null = null;
let ensured = false;

function db(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  pool ??= new Pool({
    connectionString: url,
    max: 1,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
  });
  return pool;
}

async function ensureSchema(p: Pool): Promise<void> {
  if (ensured) return;
  await p.query(`
    create table if not exists scores (
      player_id uuid primary key,
      name text not null check (char_length(name) between 2 and 20),
      xp integer not null default 0 check (xp >= 0),
      quizzes integer not null default 0 check (quizzes >= 0),
      accuracy integer not null default 0 check (accuracy between 0 and 100),
      streak integer not null default 0 check (streak >= 0),
      updated_at timestamptz not null default now()
    )`);
  ensured = true;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clamp = (n: unknown, max: number) =>
  Math.max(0, Math.min(max, Math.round(Number(n) || 0)));

export async function GET() {
  const p = db();
  if (!p) return NextResponse.json({ error: "Leaderboard not configured (DATABASE_URL missing)." }, { status: 503 });
  try {
    await ensureSchema(p);
    const { rows } = await p.query(
      "select player_id, name, xp, quizzes, accuracy, streak, updated_at from scores order by xp desc limit 50",
    );
    return NextResponse.json({ rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const p = db();
  if (!p) return NextResponse.json({ error: "Leaderboard not configured (DATABASE_URL missing)." }, { status: 503 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const playerId = String(body.playerId ?? "");
  const name = String(body.name ?? "").trim().slice(0, 20);
  if (!UUID_RE.test(playerId)) return NextResponse.json({ error: "Invalid player id." }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });

  try {
    await ensureSchema(p);
    await p.query(
      `insert into scores (player_id, name, xp, quizzes, accuracy, streak, updated_at)
       values ($1, $2, $3, $4, $5, $6, now())
       on conflict (player_id) do update
         set name = excluded.name, xp = excluded.xp, quizzes = excluded.quizzes,
             accuracy = excluded.accuracy, streak = excluded.streak, updated_at = now()`,
      [playerId, name, clamp(body.xp, 10_000_000), clamp(body.quizzes, 1_000_000),
       clamp(body.accuracy, 100), clamp(body.streak, 100_000)],
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error." }, { status: 500 });
  }
}
