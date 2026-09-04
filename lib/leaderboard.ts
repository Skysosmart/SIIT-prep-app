import type { Profile } from "./profile";

/**
 * Shared leaderboard client. Talks to /api/scores, which exists only on
 * server deployments (Vercel + Neon). Static GitHub Pages builds set
 * NEXT_PUBLIC_HAS_API="" and fall back to the local-only view.
 */
export const hasBackend = (): boolean => process.env.NEXT_PUBLIC_HAS_API === "1";

export type ScoreRow = {
  player_id: string;
  name: string;
  xp: number;
  quizzes: number;
  accuracy: number;
  streak: number;
  updated_at: string;
};

const ID_KEY = "siit-player-id";
const NAME_KEY = "siit-player-name";

export function playerId(): string {
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return "00000000-0000-4000-8000-000000000000";
  }
}

export function playerName(): string {
  try { return localStorage.getItem(NAME_KEY) ?? ""; } catch { return ""; }
}
export function setPlayerName(name: string): void {
  try { localStorage.setItem(NAME_KEY, name); } catch { /* ignore */ }
}

async function parseError(res: Response): Promise<string> {
  try { return ((await res.json()) as { error?: string }).error ?? `Request failed (${res.status}).`; }
  catch { return `Request failed (${res.status}).`; }
}

export async function fetchScores(): Promise<ScoreRow[]> {
  const res = await fetch("/api/scores", { cache: "no-store" });
  if (!res.ok) throw new Error(await parseError(res));
  return ((await res.json()) as { rows: ScoreRow[] }).rows;
}

/** Upsert this player's current stats under their saved nickname. */
export async function submitScore(name: string, p: Profile): Promise<void> {
  const accuracy = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;
  const res = await fetch("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerId: playerId(),
      name,
      xp: p.xp,
      quizzes: p.quizzes,
      accuracy,
      streak: p.streakDays,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
