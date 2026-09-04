"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RefreshCw, ChevronRight } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";
import { topicById } from "@/lib/topics";
import { Tex } from "@/components/Tex";
import type { ExamResult } from "@/lib/exam";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function ExamResultPage() {
  const [r, setR] = useState<ExamResult | null>(null);
  const [ringOn, setRingOn] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("siit-last-exam");
      if (raw) setR(JSON.parse(raw));
    } catch { /* ignore */ }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setRingOn(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!r) {
    return (
      <div className="view" style={{ textAlign: "center" }}>
        <h2>No exam to show</h2>
        <p className="sub" style={{ margin: "12px auto 20px" }}>Take a mock exam first and your report will appear here.</p>
        <Link href="/exam" className="btn btn-p">Start a mock exam</Link>
      </div>
    );
  }

  const pct = Math.round((100 * r.correct) / r.total);
  const C = 2 * Math.PI * 80;
  const off = C * (1 - pct / 100);
  const mm = Math.floor(r.timeSec / 60);
  const ss = String(r.timeSec % 60).padStart(2, "0");
  const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
  const verdict = pct >= 80 ? "Excellent - exam ready!" : pct >= 60 ? "Solid - keep sharpening." : "Good start - more practice needed.";

  return (
    <div className="view res">
      <span className="kicker">Mock exam complete</span>
      <h2 style={{ fontSize: "2rem", margin: "8px 0 24px" }}>{verdict}</h2>
      <div className="ring-wrap">
        <svg width="190" height="190" viewBox="0 0 190 190" aria-hidden="true">
          <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--teal)" /><stop offset="1" stopColor="var(--cyan)" /></linearGradient></defs>
          <circle className="ring-bg" cx="95" cy="95" r="80" fill="none" strokeWidth="14" />
          <circle className="ring-fg" cx="95" cy="95" r="80" fill="none" strokeWidth="14"
            strokeDasharray={C} strokeDashoffset={ringOn ? off : C} />
        </svg>
        <div className="ring-num"><div><div className="big">{r.correct}/{r.total}</div><div className="sm">{pct}% overall</div></div></div>
      </div>
      <div className="res-stats">
        {r.perSection.map((s) => (
          <div className="stat" key={s.id}>
            <span className="lb">{s.name}</span>
            <div className="v">{s.correct}/{s.total}<small> {Math.round((100 * s.correct) / s.total)}%</small></div>
          </div>
        ))}
        <div className="stat"><span className="lb">Time used</span><div className="v">{mm}:{ss}</div></div>
        <div className="stat"><span className="lb">XP earned</span><div className="v" style={{ color: "var(--pur)" }}>+{r.correct * 5}</div></div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
        <Link href="/exam" className="btn btn-p"><RefreshCw size={16} /> Retake exam</Link>
        <button className="btn btn-pur" onClick={() => setShowReview((v) => !v)}>
          {showReview ? "Hide" : "Review"} all answers
        </button>
        <Link href="/practice" className="btn btn-g">Practice weak areas <ChevronRight size={16} /></Link>
      </div>

      {showReview && (
        <div className="rv" style={{ marginTop: 20, textAlign: "left" }}>
          {r.answers.map((a, idx) => {
            const q = byId.get(a.qid);
            if (!q) return null;
            return (
              <div className="card" key={idx} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <b style={{ fontSize: ".78rem", color: "var(--mut)" }}>Q{idx + 1} · {topicById(q.topic).name}</b>
                  <span className={`tag ${a.correct ? "easy" : "hard"}`}>{a.correct ? "Correct" : a.picked < 0 ? "Blank" : "Wrong"}</span>
                </div>
                <div style={{ margin: "8px 0" }}><Tex s={q.q} /></div>
                <div style={{ fontSize: ".95rem", color: "var(--grn)", fontWeight: 700 }}>
                  Correct: {LETTERS[q.answer]}. <Tex s={q.choices[q.answer]} />
                </div>
                <p style={{ color: "var(--mut)", fontSize: ".9rem", margin: "8px 0 0" }}><Tex s={q.explain} /></p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
