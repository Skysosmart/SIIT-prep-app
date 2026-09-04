"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { topicById } from "@/lib/topics";
import { QUESTIONS } from "@/lib/questions";
import { Tex } from "@/components/Tex";
import type { QuizSummary } from "@/lib/profile";

export default function Review() {
  const [s, setS] = useState<QuizSummary | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("siit-last-quiz");
      if (raw) setS(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
  const wrong = s ? s.results.filter((r) => !r.ok) : [];

  if (!s || wrong.length === 0) {
    return (
      <div className="view" style={{ textAlign: "center" }}>
        <h2>No mistakes to review</h2>
        <p className="sub" style={{ margin: "12px auto 20px" }}>
          {s ? "Perfect round — nothing to fix here." : "Play a quiz first, then come back to review what you missed."}
        </p>
        <Link href="/practice" className="btn btn-p">Practice a topic</Link>
      </div>
    );
  }

  const topic = topicById(s.topic);

  return (
    <div className="view rv">
      <span className="kicker">Review mistakes · {topic.name}</span>
      <h2 style={{ fontSize: "1.8rem", margin: "6px 0 20px" }}>{wrong.length} to master</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {wrong.map((r, idx) => {
          const q = byId.get(r.qid);
          if (!q) return null;
          return (
            <div className="card" key={idx}>
              <b><Tex s={q.q} /></b>
              <div className="pair">
                <div className="box wrong">
                  <span className="lb">Your answer</span>
                  {r.pickedIdx >= 0 ? <Tex s={q.choices[r.pickedIdx]} /> : <i style={{ color: "var(--mut)" }}>Ran out of time</i>}
                </div>
                <div className="box right">
                  <span className="lb">Correct answer</span>
                  <Tex s={q.choices[q.answer]} />
                </div>
              </div>
              <div style={{ fontSize: "1.05rem", marginBottom: 6 }}>
                <span className="tag n" style={{ marginRight: 10 }}>{q.formula}</span>
              </div>
              <p style={{ color: "var(--mut)", fontSize: ".92rem", margin: "6px 0 14px" }}><Tex s={q.explain} /></p>
              <Link href={`/quiz?topic=${q.topic}`} className="btn btn-g btn-sm">Practice Similar Question</Link>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 26 }}>
        <Link href={`/quiz?topic=${s.topic}`} className="btn btn-p">Retry Quiz</Link>
      </div>
    </div>
  );
}
