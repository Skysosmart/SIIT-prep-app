"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { topicById } from "@/lib/topics";
import { QUESTIONS } from "@/lib/questions";
import { useProfile, rank, type QuizSummary } from "@/lib/profile";

const KIND_NAMES: Record<string, string> = { recall: "Formula recall", fill: "Fill the blank", calc: "Calculation" };

function readLastQuiz(): QuizSummary | null {
  try {
    const raw = sessionStorage.getItem("siit-last-quiz");
    return raw ? (JSON.parse(raw) as QuizSummary) : null;
  } catch { return null; }
}

export default function Results() {
  const { p } = useProfile();
  const [s, setS] = useState<QuizSummary | null>(null);
  const [ringOn, setRingOn] = useState(false);

  useEffect(() => {
    setS(readLastQuiz());
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setRingOn(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!s) {
    return (
      <div className="view" style={{ textAlign: "center" }}>
        <h2>No quiz finished yet</h2>
        <p className="sub" style={{ margin: "12px auto 20px" }}>Play a quiz first — your results will show up here.</p>
        <Link href="/practice" className="btn btn-p">Start practicing</Link>
      </div>
    );
  }

  const isDaily = s.topic === "daily";
  const topicName = isDaily ? "Daily Challenge" : topicById(s.topic).name;
  const retryHref = isDaily ? "/quiz/?daily=1" : `/quiz?topic=${s.topic}`;
  const acc = Math.round((100 * s.right) / s.total);
  const C = 2 * Math.PI * 80;
  const off = C * (1 - acc / 100);
  const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
  const kinds = (["recall", "fill", "calc"] as const)
    .map((k) => {
      const rs = s.results.filter((r) => byId.get(r.qid)?.kind === k);
      return rs.length ? { k, n: rs.length, ok: rs.filter((r) => r.ok).length } : null;
    })
    .filter(Boolean) as { k: string; n: number; ok: number }[];
  const wrongFormulas = [...new Set(s.results.filter((r) => !r.ok).map((r) => byId.get(r.qid)?.formula).filter(Boolean))] as string[];
  const mm = Math.floor(s.timeSec / 60);
  const ss = String(s.timeSec % 60).padStart(2, "0");

  return (
    <div className="view res">
      <span className="kicker">Quiz complete · {topicName}</span>
      <h2 style={{ fontSize: "2rem", margin: "8px 0 24px" }}>
        {acc >= 80 ? "Outstanding!" : acc >= 60 ? "Solid run!" : "Keep grinding!"}
      </h2>
      <div className="ring-wrap">
        <svg width="190" height="190" viewBox="0 0 190 190" aria-hidden="true">
          <defs>
            <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--teal)" /><stop offset="1" stopColor="var(--cyan)" />
            </linearGradient>
          </defs>
          <circle className="ring-bg" cx="95" cy="95" r="80" fill="none" strokeWidth="14" />
          <circle className="ring-fg" cx="95" cy="95" r="80" fill="none" strokeWidth="14"
            strokeDasharray={C} strokeDashoffset={ringOn ? off : C} />
        </svg>
        <div className="ring-num"><div><div className="big">{s.right}/{s.total}</div><div className="sm">{acc}% accuracy</div></div></div>
      </div>
      <div className="res-stats">
        <div className="stat"><span className="lb">Time spent</span><div className="v">{mm}:{ss}</div></div>
        <div className="stat flame"><span className="lb">Best streak</span><div className="v">🔥 {s.bestStreak}</div></div>
        <div className="stat">
          <span className="lb">XP earned</span>
          <div className="v" style={{ color: "var(--pur)" }}>+{s.xp}</div>
          {(s.bonus ?? 0) > 0 && <span className="tag extra" style={{ marginTop: 4, display: "inline-block" }}>incl. +{s.bonus} daily bonus</span>}
        </div>
        <div className="stat"><span className="lb">Rank</span><div className="v" style={{ fontSize: "1.15rem", lineHeight: 2 }}>{rank(p.xp)}</div></div>
      </div>
      <div className="grid g2" style={{ textAlign: "left" }}>
        <div className="card">
          <b>Performance by question type</b>
          <div className="brk" style={{ marginTop: 14 }}>
            {kinds.map((x) => (
              <div className="row" key={x.k}>
                <span style={{ color: "var(--mut)" }}>{KIND_NAMES[x.k]}</span>
                <div className="pbar"><span style={{ width: `${(100 * x.ok) / x.n}%` }} /></div>
                <b>{x.ok}/{x.n}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <b>Formulas you should review</b>
          {wrongFormulas.length ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {wrongFormulas.map((f) => <span key={f} className="tag n" style={{ fontSize: ".82rem", padding: "6px 12px" }}>{f}</span>)}
              </div>
              <p style={{ fontSize: ".85rem", color: "var(--mut)", marginBottom: 0 }}>Find each one in the Formula Library, then retry.</p>
            </>
          ) : (
            <p style={{ color: "var(--mut)", fontSize: ".9rem" }}>Nothing! You nailed every formula this round. 🎯</p>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
        <Link href={retryHref} className="btn btn-p">Retry Quiz</Link>
        {wrongFormulas.length > 0 && <Link href="/review" className="btn btn-pur">Review Mistakes</Link>}
        <Link href="/practice" className="btn btn-g">Next Topic ▸</Link>
      </div>
    </div>
  );
}
