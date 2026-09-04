"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { TopicId } from "./topics";
import { localToday, localYesterday } from "./daily";
import { useAuth } from "./auth-client";

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

/** Combine two profiles keeping the best of each (used to merge device + account). */
export function mergeProfiles(a: Profile, b: Profile): Profile {
  const uniqBy = <T,>(arr: T[], key: (t: T) => string) => {
    const seen = new Set<string>();
    return arr.filter((x) => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; });
  };
  const prog: Profile["prog"] = { ...a.prog };
  for (const [k, v] of Object.entries(b.prog)) {
    const id = k as TopicId;
    prog[id] = Math.max(prog[id] ?? 0, v ?? 0);
  }
  const newer = (b.lastPlayed ?? "") >= (a.lastPlayed ?? "") ? b : a;
  return {
    xp: Math.max(a.xp, b.xp),
    quizzes: Math.max(a.quizzes, b.quizzes),
    answered: Math.max(a.answered, b.answered),
    correct: Math.max(a.correct, b.correct),
    streakDays: Math.max(a.streakDays, b.streakDays),
    lastPlayed: newer.lastPlayed,
    favs: [...new Set([...a.favs, ...b.favs])],
    flash: [...new Set([...a.flash, ...b.flash])],
    prog,
    daily: (b.daily.last ?? "") >= (a.daily.last ?? "")
      ? { last: b.daily.last, streak: Math.max(a.daily.streak, b.daily.streak) }
      : { last: a.daily.last, streak: Math.max(a.daily.streak, b.daily.streak) },
    hist: uniqBy([...b.hist, ...a.hist], (h) => `${h.date}|${h.topic}|${h.score}`).slice(0, 12),
    exams: uniqBy([...b.exams, ...a.exams], (e) => `${e.date}|${e.correct}|${e.total}|${e.timeSec}`).slice(0, 20),
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [p, setP] = useState<Profile>(EMPTY);
  const [ready, setReady] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setP({ ...EMPTY, ...JSON.parse(raw) });
    } catch { /* corrupted or unavailable storage - start fresh */ }
    setReady(true);
  }, []);

  // debounced push of the current profile to the server (when signed in)
  const pushToServer = (next: Profile) => {
    if (!user) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      void fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: next }),
      }).catch(() => { /* offline - localStorage still holds it */ });
    }, 800);
  };

  const save = (next: Profile) => {
    setP(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full/blocked */ }
    pushToServer(next);
  };

  // on login: pull the account profile, merge with local, save the union
  useEffect(() => {
    if (!authReady || !ready) return;
    if (user && lastUserId.current !== user.id) {
      lastUserId.current = user.id;
      (async () => {
        try {
          const res = await fetch("/api/progress", { cache: "no-store" });
          if (!res.ok) return;
          const server = ((await res.json()) as { data: Profile | null }).data;
          const merged = server ? mergeProfiles(p, { ...EMPTY, ...server }) : p;
          save(merged);
        } catch { /* keep local */ }
      })();
    } else if (!user) {
      lastUserId.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authReady, ready]);

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
