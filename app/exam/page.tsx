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

  const [stage, setStage] = useState<"intro" | "section-intro" | "run">("intro");
  const [paper, setPaper] = useState<ExamQuestion[]>([]);
  const [picks, setPicks] = useState<number[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [secIdx, setSecIdx] = useState(0);          // which section we're in
  const [cur, setCur] = useState(0);                // absolute question index in paper
  const [secsLeft, setSecsLeft] = useState(0);
  const t0 = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stopTimer = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  useEffect(() => stopTimer, []);

  // start index of each section within the paper
  const ranges = useMemo(() => {
    const r: { start: number; end: number }[] = [];
    let i = 0;
    for (const sec of EXAM_SECTIONS) {
      const n = paper.filter((q) => q.section === sec.id).length;
      r.push({ start: i, end: i + n });
      i += n;
    }
    return r;
  }, [paper]);

  const start = () => {
    const p = buildExam();
    setPaper(p);
    setPicks(new Array(p.length).fill(-1));
    setFlags(new Array(p.length).fill(false));
    setSecIdx(0);
    t0.current = performance.now();
    setStage("section-intro");
  };

  const beginSection = (idx: number) => {
    setSecIdx(idx);
    setCur(ranges[idx].start);
    setSecsLeft(EXAM_SECTIONS[idx].minutes * 60);
    setStage("run");
    stopTimer();
    timer.current = setInterval(() => setSecsLeft((s) => Math.max(0, s - 1)), 1000);
  };

  const submit = useCallback((allPicks: number[]) => {
    stopTimer();
    const perSection = EXAM_SECTIONS.map((sec) => {
      const items = paper.map((q, i) => ({ q, i })).filter((x) => x.q.section === sec.id);
      const correct = items.filter((x) => allPicks[x.i] === paper[x.i].correctAt).length;
      return { id: sec.id, name: sec.name, correct, total: items.length };
    });
    const correct = perSection.reduce((s, x) => s + x.correct, 0);
    const result: ExamResult = {
      date: new Date().toISOString().slice(0, 10),
      total: paper.length, correct, perSection,
      answers: paper.map((q, i) => ({ qid: q.q.id, picked: allPicks[i], correct: allPicks[i] === q.correctAt })),
      timeSec: Math.round((performance.now() - t0.current) / 1000),
    };
    try { sessionStorage.setItem("siit-last-exam", JSON.stringify(result)); } catch { /* ignore */ }
    recordExam(result);
    router.push("/exam/result");
  }, [paper, recordExam, router]);

  const finishSection = useCallback(() => {
    stopTimer();
    if (secIdx + 1 >= EXAM_SECTIONS.length) submit(picks);
    else { setSecIdx(secIdx + 1); setStage("section-intro"); }
  }, [secIdx, picks, submit]);

  // section timer expiry -> auto-advance
  useEffect(() => {
    if (stage === "run" && secsLeft <= 0) finishSection();
  }, [secsLeft, stage, finishSection]);

  // keyboard within a section
  useEffect(() => {
    if (stage !== "run") return;
    const { start: s, end: e } = ranges[secIdx];
    const onKey = (ev: KeyboardEvent) => {
      const q = paper[cur];
      const n = q?.q.choices.length ?? 4;
      const k = Number(ev.key);
      if (k >= 1 && k <= n) setPicks((a) => a.map((v, i) => (i === cur ? k - 1 : v)));
      else if (ev.key === "ArrowRight") setCur((c) => Math.min(e - 1, c + 1));
      else if (ev.key === "ArrowLeft") setCur((c) => Math.max(s, c - 1));
      else if (ev.key.toLowerCase() === "f") setFlags((a) => a.map((v, i) => (i === cur ? !v : v)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, cur, paper, ranges, secIdx]);

  const sectionItems = useMemo(
    () => (paper.length ? paper.map((q, i) => ({ q, i })).filter((x) => x.i >= ranges[secIdx].start && x.i < ranges[secIdx].end) : []),
    [paper, ranges, secIdx],
  );
  const answeredInSec = sectionItems.filter((x) => picks[x.i] >= 0).length;

  // ── intro ──────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="view lobby">
        <div className="card" style={{ padding: 36 }}>
          <span className="kicker">Mock Exam</span>
          <h2 style={{ fontSize: "1.8rem", margin: "6px 0 4px" }}>OSP-style Entrance Exam</h2>
          <p className="sub" style={{ margin: "10px auto 0" }}>
            A full timed simulation of the SIIT entrance paper - three sections, each with its own
            one-hour timer, taken in order. Questions are original, written in the exam&apos;s format.
          </p>
          <div className="exam-facts">
            {EXAM_SECTIONS.map((s, n) => (
              <div key={s.id} className="exam-fact">
                <b>{n + 1}. {s.name}</b>
                <span>{s.count} questions · {s.minutes} min</span>
              </div>
            ))}
            <div className="exam-fact tot"><b>Total</b><span>{EXAM_TOTAL_Q} questions · {EXAM_TOTAL_MIN} min</span></div>
          </div>
          <ul className="exam-rules">
            <li>Sections are timed separately and taken in order.</li>
            <li>When a section&apos;s hour ends it locks and the next begins.</li>
            <li>Within a section, answer in any order and flag for review.</li>
            <li>No answers are revealed until the whole exam is submitted.</li>
          </ul>
          <button className="btn btn-p btn-big" onClick={start}>Start Exam</button>
          <div style={{ marginTop: 14 }}><Link href="/" className="btn btn-g btn-sm"><ChevronLeft size={15} /> Back home</Link></div>
        </div>
      </div>
    );
  }

  // ── between-section intro ───────────────────────────────────────
  if (stage === "section-intro") {
    const sec = EXAM_SECTIONS[secIdx];
    return (
      <div className="view lobby">
        <div className="card" style={{ padding: 36, textAlign: "center" }}>
          <span className="kicker">Section {secIdx + 1} of {EXAM_SECTIONS.length}</span>
          <h2 style={{ fontSize: "2rem", margin: "8px 0 6px" }}>{sec.name}</h2>
          <div className="lobby-facts">
            <span><b>{sec.count}</b> questions</span>
            <span><b>{sec.minutes}</b> minutes</span>
          </div>
          <p className="sub" style={{ margin: "8px auto 22px" }}>
            The timer starts when you begin and cannot be paused. When it reaches zero this section
            locks{secIdx + 1 < EXAM_SECTIONS.length ? " and the next section starts" : " and the exam is submitted"}.
          </p>
          <button className="btn btn-p btn-big" onClick={() => beginSection(secIdx)}>
            Begin {sec.name} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── run ─────────────────────────────────────────────────────────
  const q = paper[cur];
  const sec = EXAM_SECTIONS[secIdx];
  const mm = Math.floor(secsLeft / 60);
  const ss = String(secsLeft % 60).padStart(2, "0");
  const low = secsLeft < 120;
  const showPassage = q.q.passage && (cur === ranges[secIdx].start || paper[cur - 1]?.q.passage !== q.q.passage);
  const lastSection = secIdx + 1 >= EXAM_SECTIONS.length;
  const finishLabel = lastSection ? "Submit exam" : `Finish ${sec.name}`;
  const confirmFinish = () => {
    if (window.confirm(`${lastSection ? "Submit the exam" : `Finish the ${sec.name} section`}? You've answered ${answeredInSec} of ${sectionItems.length}.${lastSection ? "" : " You cannot return to it."}`)) finishSection();
  };

  return (
    <div className="view exam">
      <div className="exam-bar">
        <span className={`exam-timer${low ? " low" : ""}`}><Clock size={16} /> {mm}:{ss}</span>
        <span className="exam-prog">Section {secIdx + 1}/{EXAM_SECTIONS.length} · {sec.name}</span>
        <span className="exam-count">{answeredInSec}/{sectionItems.length} answered</span>
        <button className="btn btn-p btn-sm" onClick={confirmFinish}>{finishLabel}</button>
      </div>

      <div className="exam-grid">
        <div className="exam-main">
          {mounted && (
            <div className="qbox" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span className="qk">Question {cur - ranges[secIdx].start + 1} of {sectionItems.length}</span>
                <button className={`flagbtn${flags[cur] ? " on" : ""}`} onClick={() => setFlags((a) => a.map((v, i) => (i === cur ? !v : v)))}>
                  <Flag size={14} fill={flags[cur] ? "currentColor" : "none"} /> {flags[cur] ? "Flagged" : "Flag"}
                </button>
              </div>
              {showPassage && <div className="passage"><Tex s={q.q.passage!} /></div>}
              <div className="qt" style={{ fontSize: "1.15rem" }}><Tex s={q.q.q} /></div>
              <div className="exam-answers">
                {q.order.map((choiceIdx, pos) => (
                  <button key={pos} className={`exam-ans${picks[cur] === pos ? " sel" : ""}`}
                    onClick={() => setPicks((a) => a.map((v, i) => (i === cur ? pos : v)))}>
                    <span className="exam-letter">{LETTERS[pos]}</span>
                    <span className="exam-body"><Tex s={q.q.choices[choiceIdx]} /></span>
                  </button>
                ))}
              </div>
              <div className="exam-nav">
                <button className="btn btn-g" disabled={cur === ranges[secIdx].start} onClick={() => setCur((c) => c - 1)}>
                  <ChevronLeft size={16} /> Previous
                </button>
                {picks[cur] >= 0 && (
                  <button className="btn btn-g btn-sm" onClick={() => setPicks((a) => a.map((v, i) => (i === cur ? -1 : v)))}>
                    <X size={14} /> Clear
                  </button>
                )}
                <button className="btn btn-p" disabled={cur === ranges[secIdx].end - 1} onClick={() => setCur((c) => c + 1)}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="exam-palette">
          <b style={{ fontSize: ".85rem" }}>{sec.name} navigator</b>
          <div className="pal-grid" style={{ marginTop: 10 }}>
            {sectionItems.map(({ i }, n) => {
              let cls = "pal-cell";
              if (i === cur) cls += " cur";
              else if (flags[i]) cls += " flag";
              else if (picks[i] >= 0) cls += " done";
              return <button key={i} className={cls} onClick={() => setCur(i)} aria-label={`Question ${n + 1}`}>{n + 1}</button>;
            })}
          </div>
          <div className="pal-legend">
            <span><i className="lg done" /> Answered</span>
            <span><i className="lg flag" /> Flagged</span>
            <span><i className="lg" /> Blank</span>
          </div>
          <button className="btn btn-p btn-sm" style={{ width: "100%", marginTop: 14 }} onClick={confirmFinish}>
            <CheckCircle2 size={16} /> {finishLabel}
          </button>
        </aside>
      </div>
    </div>
  );
}
