import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "./profile";

/**
 * Shared leaderboard backed by Supabase. Works only when the site is built
 * with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY; without
 * them the leaderboard page falls back to the local-only view.
 */
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY_ = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const hasSupabase = (): boolean => URL_.length > 0 && KEY_.length > 0;

let client: SupabaseClient | null = null;
function sb(): SupabaseClient {
  client ??= createClient(URL_, KEY_);
  return client;
}

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

export async function fetchScores(limit = 50): Promise<ScoreRow[]> {
  const { data, error } = await sb()
    .from("scores")
    .select("*")
    .order("xp", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as ScoreRow[];
}

/** Upsert this player's current stats under their saved nickname. */
export async function submitScore(name: string, p: Profile): Promise<void> {
  const accuracy = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;
  const { error } = await sb().from("scores").upsert({
    player_id: playerId(),
    name: name.trim().slice(0, 20),
    xp: p.xp,
    quizzes: p.quizzes,
    accuracy,
    streak: p.streakDays,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
