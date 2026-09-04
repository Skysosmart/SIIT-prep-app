import type { Question } from "./questions";

export type Mode = "recall" | "fill" | "calc" | "mixed";
export type Diff = "easy" | "med" | "hard";

export const MODES: { id: Mode; name: string; desc: string }[] = [
  { id: "recall", name: "Formula Recall", desc: "Spot the correct formula among lookalikes" },
  { id: "fill",   name: "Fill the Missing Formula", desc: "Complete the blanked-out part" },
  { id: "calc",   name: "Calculation", desc: "Apply the formula to a quick computation" },
  { id: "mixed",  name: "Mixed Mode", desc: "Everything, shuffled — exam style" },
];

// Difficulty scales each question's PDF timer (20s or 30s base).
export const DIFFS: Record<Diff, { name: string; scale: number }> = {
  easy: { name: "Easy", scale: 1.5 },
  med:  { name: "Medium", scale: 1 },
  hard: { name: "Hard", scale: 0.75 },
};

export const QUIZ_LENGTH = 10;

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Points for a correct answer: 100 base + up to 40 time bonus + streak bonus (cap 50). */
export function scoreFor(timeLeft: number, timeTotal: number, streakBefore: number): number {
  return 100 + Math.round((40 * timeLeft) / timeTotal) + Math.min(50, streakBefore * 10);
}

export const xpFor = (points: number) => Math.round(points / 10);

/** Pick quiz questions for a topic + mode, falling back to the full topic bank if the mode has too few. */
export function pickQuestions(bank: Question[], mode: Mode): Question[] {
  const pool = mode === "mixed" ? bank : bank.filter((q) => q.kind === mode);
  const usable = pool.length >= 4 ? pool : bank;
  return shuffle(usable).slice(0, Math.min(QUIZ_LENGTH, usable.length));
}
