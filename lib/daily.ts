import { TOPICS, type Topic, type TopicId } from "./topics";
import { QUESTIONS, questionsForTopic, type Question } from "./questions";

/** Local calendar date (not UTC) so the challenge flips at the player's midnight. */
export function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function localYesterday(): string {
  const d = new Date(Date.now() - 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const DAILY_BONUS_XP = 50;
export const DAILY_SIZE = 10;

/** Pseudo-topic used for display on the lobby / chips. */
export const DAILY_TOPIC: Topic = {
  id: "alg" as TopicId, // never used for lookups; display only
  name: "Daily Challenge",
  glyph: "★",
  color: "linear-gradient(135deg,#8B5CF6,#38BDF8)",
  diff: "Medium",
  core: true,
  subject: "math",
};

// Deterministic PRNG so every player gets the same daily set.
function seedFromDate(date: string): number {
  let h = 2166136261;
  for (const c of date) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a: number): () => number {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The day's 10 questions: topics shuffled by the date seed, one question
 * drawn per topic. Same date → same set for everyone.
 */
export function dailyQuestions(date: string): Question[] {
  const rnd = mulberry32(seedFromDate(date));
  const ids = TOPICS.map((t) => t.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, DAILY_SIZE).map((id) => {
    const bank = questionsForTopic(id);
    return bank[Math.floor(rnd() * bank.length)] ?? QUESTIONS[0];
  });
}

/** Human-friendly date for headers, e.g. "Thursday, Sep 4". */
export function dailyLabel(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
