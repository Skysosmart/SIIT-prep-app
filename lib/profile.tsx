"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { TopicId } from "./topics";

export type QuizRecord = { topic: TopicId; score: string; acc: number; date: string };

export type Profile = {
  xp: number;
  quizzes: number;
  answered: number;
  correct: number;
  streakDays: number;
  lastPlayed: string | null;   // ISO date (day precision)
  favs: string[];              // formula names
  prog: Partial<Record<TopicId, number>>; // best accuracy % per topic
  hist: QuizRecord[];
};

const EMPTY: Profile = {
  xp: 0, quizzes: 0, answered: 0, correct: 0,
  streakDays: 0, lastPlayed: null, favs: [], prog: {}, hist: [],
};

const KEY = "siit-math-arena-profile";

export type QuizSummary = {
  topic: TopicId;
  right: number;
  total: number;
  xp: number;
  score: number;
  bestStreak: number;
  timeSec: number;
  results: {
    qid: number;
    ok: boolean;
    pickedIdx: number; // -1 = timed out
  }[];
  mode: string;
  diff: string;
};

type Ctx = {
  p: Profile;
  ready: boolean;
  finishQuiz: (s: QuizSummary) => void;
  toggleFav: (name: string) => void;
};

const ProfileCtx = createContext<Ctx | null>(null);

export function rank(xp: number): string {
  return xp < 500 ? "Rookie" : xp < 1500 ? "Challenger" : xp < 3000 ? "Formula Ace" : "SIIT Ready";
}
export const nextRankAt = (xp: number) => (xp < 500 ? 500 : xp < 1500 ? 1500 : xp < 3000 ? 3000 : null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Profile>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setP({ ...EMPTY, ...JSON.parse(raw) });
    } catch { /* corrupted or unavailable storage — start fresh */ }
    setReady(true);
  }, []);

  const save = (next: Profile) => {
    setP(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full/blocked */ }
  };

  const finishQuiz = (s: QuizSummary) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streakDays =
      p.lastPlayed === today ? p.streakDays
      : p.lastPlayed === yesterday ? p.streakDays + 1
      : 1;
    const acc = Math.round((100 * s.right) / s.total);
    save({
      ...p,
      xp: p.xp + s.xp,
      quizzes: p.quizzes + 1,
      answered: p.answered + s.total,
      correct: p.correct + s.right,
      streakDays,
      lastPlayed: today,
      prog: { ...p.prog, [s.topic]: Math.max(p.prog[s.topic] ?? 0, acc) },
      hist: [{ topic: s.topic, score: `${s.right}/${s.total}`, acc, date: today }, ...p.hist].slice(0, 12),
    });
  };

  const toggleFav = (name: string) =>
    save({ ...p, favs: p.favs.includes(name) ? p.favs.filter((f) => f !== name) : [...p.favs, name] });

  return (
    <ProfileCtx.Provider value={{ p, ready, finishQuiz, toggleFav }}>
      {children}
    </ProfileCtx.Provider>
  );
}

export function useProfile(): Ctx {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
