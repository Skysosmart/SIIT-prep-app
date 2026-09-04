"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, ChevronLeft, ChevronRight, Clock, X, CheckCircle2 } from "lucide-react";
import { buildExam, EXAM_SECTIONS, EXAM_TOTAL_MIN, EXAM_TOTAL_Q, type ExamQuestion, type ExamResult } from "@/lib/exam";
import { useProfile } from "@/lib/profile";
import { Tex } from "@/components/Tex";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function ExamPage() {
  const router = useRouter();
  const { recordExam } = useProfile();

  const [stage, setStage] = useState<"intro" | "run">("intro");
  const [paper, setPaper] = useState<ExamQuestion[]>([]);
  const [picks, setPicks] = useState<number[]>([]);   // choice index per question, -1 = blank
  const [flags, setFlags] = useState<boolean[]>([]);
  const [cur, setCur] = useState(0);
  const [secsLeft, setSecsLeft] = useState(EXAM_TOTAL_MIN * 60);
  const t0 = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stopTimer = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  useEffect(() => stopTimer, []);

  const start = () => {
    const p = buildExam();
    setPaper(p);
    setPicks(new Array(p.length).fill(-1));
    setFlags(new Array(p.length).fill(false));
    setCur(0);
    setSecsLeft(EXAM_TOTAL_MIN * 60);
    t0.current = performance.now();
    setStage("run");
    stopTimer();
    timer.current = setInterval(() => setSecsLeft((s) => Math.max(0, s - 1)), 1000);
  };

  const submit = useCallback(() => {
    stopTimer();
    const perSection = EXAM_SECTIONS.map((sec) => {
      const idxs = paper.map((q, i) => ({ q, i })).filter((x) => x.q.section === sec.id);
      const correct = idxs.filter((x) => picks[x.i] === paper[x.i].correctAt).length;
      return { id: sec.id, name: sec.name, correct, total: idxs.length };
    });
    const correct = perSection.reduce((s, x) => s + x.correct, 0);
    const result: ExamResult = {
      date: new Date().toISOString().slice(0, 10),
      total: paper.length,
      correct,
      perSection,
      answers: paper.map((q, i) => ({ qid: q.q.id, picked: picks[i], correct: picks[i] === q.correctAt })),
      timeSec: Math.round((performance.now() - t0.current) / 1000),
    };
    try { sessionStorage.setItem("siit-last-exam", JSON.stringify(result)); } catch { /* ignore */ }
    recordExam(result);
    router.push("/exam/result");
  }, [paper, picks, recordExam, router]);

  // auto-submit when time runs out
  useEffect(() => {
    if (stage === "run" && secsLeft <= 0) submit();
  }, [secsLeft, stage, submit]);

  // keyboard: 1-6 select, arrows navigate, F flag
  useEffect(() => {
    if (stage !== "run") return;
    const onKey = (e: KeyboardEvent) => {
      const q = paper[cur];
      const n = q?.q.choices.length ?? 4;
      const k = Number(e.key);
      if (k >= 1 && k <= n) setPicks((a) => a.map((v, i) => (i === cur ? k - 1 : v)));
      else if (e.key === "ArrowRight") setCur((c) => Math.min(paper.length - 1, c + 1));
      else if (e.key === "ArrowLeft") setCur((c) => Math.max(0, c - 1));
      else if (e.key.toLowerCase() === "f") setFlags((a) => a.map((v, i) => (i === cur ? !v : v)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, cur, paper]);

  const answered = useMemo(() => picks.filter((v) => v >= 0).length, [picks]);

  if (stage === "intro") {
    return (
      <div className="view lobby">
        <div className="card" style={{ padding: 36 }}>
          <span className="kicker">Mock Exam</span>
          <h2 style={{ fontSize: "1.7rem", margin: "6px 0 4px" }}>OSP-style Entrance Exam</h2>
          <p className="sub" style={{ margin: "10px auto 0" }}>
            A full timed simulation of the SIIT entrance paper - two sections, no feedback until you
            submit, just like the real thing. Questions are original, written in the exam&apos;s format.
          </p>
          <div className="exam-facts">
            {EXAM_SECTIONS.map((s) => (
              <div key={s.id} className="exam-fact">
                <b>{s.name}</b>
                <span>{s.count} questions · {s.minutes} min</span>
              </div>
            ))}
            <div className="exam-fact tot">
              <b>Total</b>
              <span>{EXAM_TOTAL_Q} questions · {EXAM_TOTAL_MIN} min</span>
            </div>
          </div>
          <ul className="exam-rules">
            <li>One shared timer for the whole paper - budget your time.</li>
            <li>Answer in any order; flag hard ones and come back.</li>
            <li>No answers are revealed until you submit.</li>
            <li>Keys: 1-6 to answer · ← → to move · F to flag.</li>
          </ul>
          <button className="btn btn-p btn-big" onClick={start}>Start Exam</button>
          <div style={{ marginTop: 14 }}><Link href="/" className="btn btn-g btn-sm"><ChevronLeft size={15} /> Back home</Link></div>
        </div>
      </div>
    );
  }

  const q = paper[cur];
  const mm = Math.floor(secsLeft / 60);
  const ss = String(secsLeft % 60).padStart(2, "0");
  const low = secsLeft < 300;
  const secName = EXAM_SECTIONS.find((s) => s.id === q.section)?.name;
  // does this question share its passage with the previous one? (hide repeat)
  const showPassage = q.q.passage && (cur === 0 || paper[cur - 1].q.passage !== q.q.passage);

  return (
    <div className="view exam">
      <div className="exam-bar">
        <span className={`exam-timer${low ? " low" : ""}`}><Clock size={16} /> {mm}:{ss}</span>
        <span className="exam-prog">{secName} · Q{cur + 1}/{paper.length}</span>
        <span className="exam-count">{answered}/{paper.length} answered</span>
        <button className="btn btn-p btn-sm" onClick={() => {
          if (window.confirm(`Submit the exam? You've answered ${answered} of ${paper.length}.`)) submit();
        }}>Submit</button>
      </div>

      <div className="exam-grid">
        <div className="exam-main">
          {mounted && (
            <div className="qbox" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span className="qk">Question {cur + 1}</span>
                <button className={`flagbtn${flags[cur] ? " on" : ""}`} onClick={() => setFlags((a) => a.map((v, i) => (i === cur ? !v : v)))}>
                  <Flag size={14} fill={flags[cur] ? "currentColor" : "none"} /> {flags[cur] ? "Flagged" : "Flag"}
                </button>
              </div>
              {showPassage && <div className="passage"><Tex s={q.q.passage!} /></div>}
              <div className="qt" style={{ fontSize: "1.15rem" }}><Tex s={q.q.q} /></div>
              <div className="exam-answers">
                {q.order.map((choiceIdx, pos) => (
                  <button
                    key={pos}
                    className={`exam-ans${picks[cur] === pos ? " sel" : ""}`}
                    onClick={() => setPicks((a) => a.map((v, i) => (i === cur ? pos : v)))}
                  >
                    <span className="exam-letter">{LETTERS[pos]}</span>
                    <span className="exam-body"><Tex s={q.q.choices[choiceIdx]} /></span>
                  </button>
                ))}
              </div>
              <div className="exam-nav">
                <button className="btn btn-g" disabled={cur === 0} onClick={() => setCur((c) => c - 1)}>
                  <ChevronLeft size={16} /> Previous
                </button>
                {picks[cur] >= 0 && (
                  <button className="btn btn-g btn-sm" onClick={() => setPicks((a) => a.map((v, i) => (i === cur ? -1 : v)))}>
                    <X size={14} /> Clear
                  </button>
                )}
                <button className="btn btn-p" disabled={cur === paper.length - 1} onClick={() => setCur((c) => c + 1)}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="exam-palette">
          <b style={{ fontSize: ".85rem" }}>Question navigator</b>
          {EXAM_SECTIONS.map((sec) => {
            const items = paper.map((qq, i) => ({ qq, i })).filter((x) => x.qq.section === sec.id);
            if (!items.length) return null;
            return (
              <div key={sec.id} style={{ marginTop: 12 }}>
                <div className="pal-sec">{sec.name}</div>
                <div className="pal-grid">
                  {items.map(({ i }) => {
                    let cls = "pal-cell";
                    if (i === cur) cls += " cur";
                    else if (flags[i]) cls += " flag";
                    else if (picks[i] >= 0) cls += " done";
                    return (
                      <button key={i} className={cls} onClick={() => setCur(i)} aria-label={`Question ${i + 1}`}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="pal-legend">
            <span><i className="lg done" /> Answered</span>
            <span><i className="lg flag" /> Flagged</span>
            <span><i className="lg" /> Blank</span>
          </div>
          <button className="btn btn-p btn-sm" style={{ width: "100%", marginTop: 14 }}
            onClick={() => { if (window.confirm(`Submit the exam? You've answered ${answered} of ${paper.length}.`)) submit(); }}>
            <CheckCircle2 size={16} /> Submit exam
          </button>
        </aside>
      </div>
    </div>
  );
}
