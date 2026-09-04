"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { TopicId } from "./topics";
import { localToday, localYesterday } from "./daily";

export type QuizTopic = TopicId | "daily";
export type QuizRecord = { topic: QuizTopic; score: string; acc: number; date: string };

export type Profile = {
  xp: number;
  quizzes: number;
  answered: number;
  correct: number;
  streakDays: number;
  lastPlayed: string | null;   // local date (day precision)
  favs: string[];              // formula names
  prog: Partial<Record<TopicId, number>>; // best accuracy % per topic
  hist: QuizRecord[];
  daily: { last: string | null; streak: number }; // daily-challenge completions
  flash: string[];             // formula names mastered in flashcard mode
  exams: ExamHistory[];        // completed mock exams
};

export type ExamHistory = { date: string; correct: number; total: number; timeSec: number };

const EMPTY: Profile = {
  xp: 0, quizzes: 0, answered: 0, correct: 0,
  streakDays: 0, lastPlayed: null, favs: [], prog: {}, hist: [],
  daily: { last: null, streak: 0 },
  flash: [],
  exams: [],
};

const KEY = "siit-math-arena-profile";

export type QuizSummary = {
  topic: QuizTopic;
  right: number;
  total: number;
  xp: number;               // includes any daily bonus
  bonus?: number;           // daily first-completion bonus, if earned
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
  markFlash: (name: string, known: boolean) => void;
  resetFlash: () => void;
  recordExam: (r: { correct: number; total: number; timeSec: number }) => void;
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
    } catch { /* corrupted or unavailable storage - start fresh */ }
    setReady(true);
  }, []);

  const save = (next: Profile) => {
    setP(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full/blocked */ }
  };

  const finishQuiz = (s: QuizSummary) => {
    const today = localToday();
    const yesterday = localYesterday();
    const streakDays =
      p.lastPlayed === today ? p.streakDays
      : p.lastPlayed === yesterday ? p.streakDays + 1
      : 1;
    const acc = Math.round((100 * s.right) / s.total);
    const isDaily = s.topic === "daily";
    const daily = isDaily && (s.bonus ?? 0) > 0
      ? { last: today, streak: p.daily.last === yesterday ? p.daily.streak + 1 : 1 }
      : p.daily;
    save({
      ...p,
      xp: p.xp + s.xp,
      quizzes: p.quizzes + 1,
      answered: p.answered + s.total,
      correct: p.correct + s.right,
      streakDays,
      lastPlayed: today,
      daily,
      prog: isDaily ? p.prog : { ...p.prog, [s.topic]: Math.max(p.prog[s.topic as TopicId] ?? 0, acc) },
      hist: [{ topic: s.topic, score: `${s.right}/${s.total}`, acc, date: today }, ...p.hist].slice(0, 12),
    });
  };

  const toggleFav = (name: string) =>
    save({ ...p, favs: p.favs.includes(name) ? p.favs.filter((f) => f !== name) : [...p.favs, name] });

  const markFlash = (name: string, known: boolean) =>
    save({ ...p, flash: known ? [...new Set([...p.flash, name])] : p.flash.filter((f) => f !== name) });

  const resetFlash = () => save({ ...p, flash: [] });

  const recordExam = (r: { correct: number; total: number; timeSec: number }) => {
    const today = localToday();
    // an exam earns XP too: 5 per correct answer
    save({
      ...p,
      xp: p.xp + r.correct * 5,
      streakDays: p.lastPlayed === today ? p.streakDays
        : p.lastPlayed === localYesterday() ? p.streakDays + 1 : 1,
      lastPlayed: today,
      exams: [{ date: today, correct: r.correct, total: r.total, timeSec: r.timeSec }, ...p.exams].slice(0, 20),
    });
  };

  return (
    <ProfileCtx.Provider value={{ p, ready, finishQuiz, toggleFav, markFlash, resetFlash, recordExam }}>
      {children}
    </ProfileCtx.Provider>
  );
}

export function useProfile(): Ctx {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
