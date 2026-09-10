"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Coffee, Flag, X } from "lucide-react";
import { Tex } from "@/components/Tex";
import { GridIn } from "@/components/sat/GridIn";
import { SatFigure } from "@/components/sat/SatFigure";
import { formById } from "@/lib/sat/forms";
import { BREAK_MIN, SAT_SPEC } from "@/lib/sat/spec";
import { isCorrect, moduleTally, outcomeFor, routeAfterModule1 } from "@/lib/sat/grade";
import { total as totalScore } from "@/lib/sat/score";
import { useProfile } from "@/lib/profile";
import { clearSavedRun, readSavedRun, writeSavedRun, type SavedRun } from "@/lib/sat/progress";
import type {
  Route, SatAnswer, SatAttemptResult, SatMode, SatQuestion, SatSectionId,
} from "@/lib/sat/types";

const LETTERS = ["A", "B", "C", "D"];

type Leg = { section: SatSectionId; stage: 1 | 2 };

function legsFor(mode: SatMode, section: SatSectionId): Leg[] {
  if (mode === "module") return [{ section, stage: 1 }];
  if (mode === "section") return [{ section, stage: 1 }, { section, stage: 2 }];
  return [
    { section: "rw", stage: 1 }, { section: "rw", stage: 2 },
    { section: "math", stage: 1 }, { section: "math", stage: 2 },
  ];
}

function SatTest() {
  const router = useRouter();
  const params = useSearchParams();
  const { recordSatTest } = useProfile();

  const form = formById(params.get("form") ?? "A");
  const mode = (params.get("mode") ?? "module") as SatMode;
  const startSection = (params.get("section") ?? "math") as SatSectionId;
  const legs = useMemo(() => legsFor(mode, startSection), [mode, startSection]);

  const [stage, setStage] = useState<"intro" | "module-intro" | "run" | "break">("intro");
  const [legIdx, setLegIdx] = useState(0);
  const [items, setItems] = useState<SatQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, SatAnswer>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [routes, setRoutes] = useState<Partial<Record<SatSectionId, Route>>>({});
  const [cur, setCur] = useState(0);
  const [endAt, setEndAt] = useState(0);
  const [left, setLeft] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t0 = useRef(0);          // epoch ms, not performance.now(), so a reload keeps it
  const restored = useRef(false);

  useEffect(() => setMounted(true), []);

  // Restore an interrupted run, but only if it belongs to this URL.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const r = readSavedRun();
    if (!r || r.formId !== form.id || r.mode !== mode) return;
    if (mode !== "full" && r.startSection !== startSection) return;
    const l = legsFor(r.mode, r.startSection)[r.legIdx];
    if (!l) return;
    const slot = l.stage === 1 ? "m1" : (r.routes[l.section] ?? "lower");
    setItems(form[l.section][slot]);
    setLegIdx(r.legIdx);
    setCur(r.cur);
    setRoutes(r.routes);
    setAnswers(r.answers);
    setFlags(r.flags);
    setEndAt(r.endAt);
    t0.current = r.startedAt;
    setStage(r.stage);
  }, [form, mode, startSection]);

  // Autosave. Skipped on the intro screen, where there is nothing to lose.
  useEffect(() => {
    if (!mounted || stage === "intro" || t0.current === 0) return;
    const run: SavedRun = {
      v: 1, formId: form.id, mode, startSection, stage, legIdx, cur, endAt,
      startedAt: t0.current, savedAt: Date.now(), routes, answers, flags,
    };
    writeSavedRun(run);
  }, [mounted, stage, legIdx, cur, endAt, routes, answers, flags, form.id, mode, startSection]);

  const leg = legs[legIdx];
  const spec = leg ? SAT_SPEC[leg.section] : SAT_SPEC.math;

  /**
   * Deadline-based, NOT a per-second counter. Browsers throttle timers in
   * background tabs, so an interval that decrements drifts badly over a
   * 32-minute module. Recomputing from a fixed deadline cannot drift.
   */
  useEffect(() => {
    if (stage !== "run" && stage !== "break") return;
    const tick = () => setLeft(Math.max(0, Math.round((endAt - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [stage, endAt]);

  const beginLeg = useCallback((idx: number, route: Partial<Record<SatSectionId, Route>>) => {
    const l = legs[idx];
    const slot = l.stage === 1 ? "m1" : (route[l.section] ?? "lower");
    setItems(form[l.section][slot]);
    setLegIdx(idx);
    setCur(0);
    setEndAt(Date.now() + SAT_SPEC[l.section].minutes * 60_000);
    setStage("run");
  }, [form, legs]);

  const submit = useCallback((finalRoutes: Partial<Record<SatSectionId, Route>>, given: Record<number, SatAnswer>) => {
    const timeSec = Math.round((Date.now() - t0.current) / 1000);
    const touched = [...new Set(legs.map((l) => l.section))];
    const result: SatAttemptResult = {
      date: new Date().toISOString().slice(0, 10),
      formId: form.id,
      mode,
      timeSec,
      answers: [],
    };

    const reviewed: SatQuestion[] = [];
    for (const section of touched) {
      const route = finalRoutes[section];
      if (mode === "module" || !route) {
        const m1 = form[section].m1;
        reviewed.push(...m1);
        result[section] = moduleTally(m1, given);
      } else {
        reviewed.push(...form[section].m1, ...form[section][route]);
        result[section] = outcomeFor(form, section, route, given);
      }
    }
    if (mode === "full" && result.rw?.scaled && result.math?.scaled)
      result.total = totalScore(result.rw.scaled, result.math.scaled);

    result.answers = reviewed.map((q) => ({
      qid: q.id,
      ok: isCorrect(q, given[q.id]),
      pretest: q.pretest === true,
      given: given[q.id] ?? (q.kind === "mcq" ? { kind: "mc", picked: -1 } : { kind: "spr", raw: "" }),
    }));

    clearSavedRun();
    try { sessionStorage.setItem("siit-last-sat", JSON.stringify(result)); } catch { /* ignore */ }
    recordSatTest({
      date: result.date, formId: result.formId, mode: result.mode, timeSec,
      rw: result.rw && { raw: result.rw.raw, of: result.rw.of, route: result.rw.route, scaled: result.rw.scaled },
      math: result.math && { raw: result.math.raw, of: result.math.of, route: result.math.route, scaled: result.math.scaled },
      total: result.total,
    });
    router.push("/sat/result");
  }, [form, legs, mode, recordSatTest, router]);

  const finishLeg = useCallback(() => {
    let nextRoutes = routes;
    if (leg?.stage === 1 && mode !== "module") {
      // The route is decided here, from module 1 only. The student is NOT told.
      nextRoutes = { ...routes, [leg.section]: routeAfterModule1(leg.section, items, answers) };
      setRoutes(nextRoutes);
    }
    const next = legIdx + 1;
    if (next >= legs.length) { submit(nextRoutes, answers); return; }
    if (legs[next].section !== leg.section) { setLegIdx(next); setEndAt(Date.now() + BREAK_MIN * 60_000); setStage("break"); }
    else { setLegIdx(next); setStage("module-intro"); }
  }, [answers, items, leg, legIdx, legs, mode, routes, submit]);

  // Timer expiry: a module locks, a break auto-advances.
  // `left` alone is not enough - it is still 0 from the previous leg on the
  // render where a new deadline is set, which would submit the module the
  // instant it opened. Check the clock itself.
  useEffect(() => {
    if (endAt === 0 || left > 0 || Date.now() < endAt) return;
    if (stage === "run") finishLeg();
    else if (stage === "break") { setStage("module-intro"); setEndAt(0); }
  }, [left, stage, endAt, finishLeg]);

  // keyboard, inside a running module only
  useEffect(() => {
    if (stage !== "run") return;
    const onKey = (ev: KeyboardEvent) => {
      const q = items[cur];
      if (!q) return;
      if (document.activeElement?.tagName === "INPUT") return;   // grid-in has focus
      const k = Number(ev.key);
      if (q.kind === "mcq" && k >= 1 && k <= 4) pick(q, (k - 1) as 0 | 1 | 2 | 3);
      else if (ev.key === "ArrowRight") setCur((c) => Math.min(items.length - 1, c + 1));
      else if (ev.key === "ArrowLeft") setCur((c) => Math.max(0, c - 1));
      else if (ev.key.toLowerCase() === "f") setFlags((f) => ({ ...f, [q.id]: !f[q.id] }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, cur, items]);

  const pick = (q: SatQuestion, picked: 0 | 1 | 2 | 3 | -1) =>
    setAnswers((a) => ({ ...a, [q.id]: { kind: "mc", picked } }));
  const type = (q: SatQuestion, raw: string) =>
    setAnswers((a) => ({ ...a, [q.id]: { kind: "spr", raw } }));

  const answered = items.filter((q) => {
    const a = answers[q.id];
    return a && (a.kind === "mc" ? a.picked >= 0 : a.raw.trim() !== "");
  }).length;

  const start = () => { t0.current = Date.now(); setLegIdx(0); setStage("module-intro"); };

  // ── intro ──────────────────────────────────────────────────────
  if (stage === "intro") {
    const label = mode === "full" ? "Full practice test"
      : mode === "section" ? `${SAT_SPEC[startSection].name} section`
      : `${SAT_SPEC[startSection].name} module 1`;
    return (
      <div className="view lobby">
        <div className="card" style={{ padding: 36 }}>
          <span className="kicker">Digital SAT · {form.name}</span>
          <h2 style={{ fontSize: "1.8rem", margin: "6px 0 4px" }}>{label}</h2>
          <p className="sub" style={{ margin: "10px auto 0" }}>
            Timed exactly like the real digital SAT. Questions are original, written to the College
            Board blueprint.
          </p>
          <div className="exam-facts">
            {legs.map((l, i) => (
              <div key={i} className="exam-fact">
                <b>{SAT_SPEC[l.section].short} module {l.stage}</b>
                <span>{SAT_SPEC[l.section].perModule} questions · {SAT_SPEC[l.section].minutes} min</span>
              </div>
            ))}
            {mode === "full" && <div className="exam-fact"><b>Break</b><span>{BREAK_MIN} min</span></div>}
          </div>
          <ul className="exam-rules">
            <li>Each module is timed separately and cannot be paused.</li>
            {mode !== "module" && <li>How you do on module 1 decides which module 2 you get - the real test does not tell you which, and neither does this.</li>}
            <li>Within a module, answer in any order and flag questions for review.</li>
            <li>There is no penalty for a wrong answer, so never leave one blank.</li>
            {startSection === "math" && <li>A calculator is allowed for the whole Math section.</li>}
            <li>Nothing is revealed until the whole test is submitted.</li>
          </ul>
          <button className="btn btn-p btn-big" onClick={start}>Start</button>
          <div style={{ marginTop: 14 }}>
            <Link href="/sat" className="btn btn-g btn-sm"><ChevronLeft size={15} /> Back</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── break ──────────────────────────────────────────────────────
  if (stage === "break") {
    const mm = Math.floor(left / 60);
    const ss = String(left % 60).padStart(2, "0");
    return (
      <div className="view lobby">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <span className="kicker">Break</span>
          <h2 style={{ fontSize: "1.6rem", margin: "8px 0 18px" }}>
            <Coffee size={20} style={{ verticalAlign: "-3px" }} /> {BREAK_MIN}-minute break
          </h2>
          <div className="sat-pause">{mm}:{ss}</div>
          <p className="sub" style={{ margin: "18px auto 22px" }}>
            The Reading and Writing section is finished and locked. The Math section begins when the
            break ends, or as soon as you choose to continue.
          </p>
          <button className="btn btn-p btn-big" onClick={() => { setStage("module-intro"); setEndAt(0); }}>
            Continue now <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── module intro ───────────────────────────────────────────────
  if (stage === "module-intro") {
    return (
      <div className="view lobby">
        <div className="card" style={{ padding: 36, textAlign: "center" }}>
          <span className="kicker">Module {legIdx + 1} of {legs.length}</span>
          <h2 style={{ fontSize: "2rem", margin: "8px 0 6px" }}>{spec.name} · Module {leg.stage}</h2>
          <div className="lobby-facts">
            <span><b>{spec.perModule}</b> questions</span>
            <span><b>{spec.minutes}</b> minutes</span>
          </div>
          <p className="sub" style={{ margin: "8px auto 22px" }}>
            The timer starts when you begin and cannot be paused. When it reaches zero this module
            locks{legIdx + 1 < legs.length ? " and the next one starts" : " and the test is submitted"}.
          </p>
          <button className="btn btn-p btn-big" onClick={() => beginLeg(legIdx, routes)}>
            Begin module <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── run ────────────────────────────────────────────────────────
  const q = items[cur];
  if (!q) return <div className="view" />;
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");
  const low = left < 120;
  const ans = answers[q.id];
  const last = legIdx + 1 >= legs.length;
  const finishLabel = last ? "Submit test" : "Finish module";
  const confirmFinish = () => {
    if (window.confirm(`${last ? "Submit the test" : "Finish this module"}? You've answered ${answered} of ${items.length}. You cannot return to it.`))
      finishLeg();
  };

  return (
    <div className="view exam">
      <div className="exam-bar">
        <span className={`exam-timer${low ? " low" : ""}`}><Clock size={16} /> {mm}:{ss}</span>
        <span className="exam-prog">{spec.name} · Module {leg.stage}</span>
        <span className="exam-count">{answered}/{items.length} answered</span>
        <button className="btn btn-p btn-sm" onClick={confirmFinish}>{finishLabel}</button>
      </div>

      <div className="exam-grid">
        <div className="exam-main">
          {mounted && (
            <div className="qbox" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span className="qk">Question {cur + 1} of {items.length}</span>
                <button className={`flagbtn${flags[q.id] ? " on" : ""}`}
                  onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}>
                  <Flag size={14} fill={flags[q.id] ? "currentColor" : "none"} /> {flags[q.id] ? "Flagged" : "Flag"}
                </button>
              </div>
              {q.passage && <div className="passage"><Tex s={q.passage} /></div>}
              <div className="qt" style={{ fontSize: "1.15rem" }}><Tex s={q.q} /></div>
              {q.figure && <SatFigure html={q.figure} />}

              {q.kind === "mcq" ? (
                <div className="exam-answers">
                  {/* Authored order. The real SAT never shuffles choices, and neither do we. */}
                  {q.choices.map((choice, i) => (
                    <button key={i} className={`exam-ans${ans?.kind === "mc" && ans.picked === i ? " sel" : ""}`}
                      onClick={() => pick(q, i as 0 | 1 | 2 | 3)}>
                      <span className="exam-letter">{LETTERS[i]}</span>
                      <span className="exam-body"><Tex s={choice} /></span>
                    </button>
                  ))}
                </div>
              ) : (
                <GridIn value={ans?.kind === "spr" ? ans.raw : ""} onChange={(v) => type(q, v)} />
              )}

              <div className="exam-nav">
                <button className="btn btn-g" disabled={cur === 0} onClick={() => setCur((c) => c - 1)}>
                  <ChevronLeft size={16} /> Previous
                </button>
                {q.kind === "mcq" && ans?.kind === "mc" && ans.picked >= 0 && (
                  <button className="btn btn-g btn-sm" onClick={() => pick(q, -1)}><X size={14} /> Clear</button>
                )}
                <button className="btn btn-p" disabled={cur === items.length - 1} onClick={() => setCur((c) => c + 1)}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="exam-palette">
          <b style={{ fontSize: ".85rem" }}>{spec.short} module {leg.stage}</b>
          <div className="pal-grid" style={{ marginTop: 10 }}>
            {items.map((it, n) => {
              const a = answers[it.id];
              const done = a && (a.kind === "mc" ? a.picked >= 0 : a.raw.trim() !== "");
              let cls = "pal-cell";
              if (n === cur) cls += " cur";
              else if (flags[it.id]) cls += " flag";
              else if (done) cls += " done";
              return <button key={it.id} className={cls} onClick={() => setCur(n)} aria-label={`Question ${n + 1}`}>{n + 1}</button>;
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

// useSearchParams needs a Suspense boundary or the static export build fails.
export default function SatTestPage() {
  return <Suspense fallback={<div className="view" />}><SatTest /></Suspense>;
}
