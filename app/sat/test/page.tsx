"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeftRight, ChevronUp, Coffee, Eye, EyeOff,
  Calculator as CalcIcon, MoreVertical, X,
} from "lucide-react";
import { Tex } from "@/components/Tex";
import { GridIn } from "@/components/sat/GridIn";
import { SatFigure } from "@/components/sat/SatFigure";
import { Directions } from "@/components/sat/Directions";
import { DesmosCalculator } from "@/components/sat/DesmosCalculator";
import { ReferenceSheet } from "@/components/sat/ReferenceSheet";
import { formById } from "@/lib/sat/forms";
import { BREAK_MIN, SAT_SPEC } from "@/lib/sat/spec";
import { isCorrect, moduleTally, outcomeFor, routeAfterModule1 } from "@/lib/sat/grade";
import { total as totalScore } from "@/lib/sat/score";
import { useProfile } from "@/lib/profile";
import { playerName } from "@/lib/leaderboard";
import { clearSavedRun, readSavedRun, writeSavedRun, type SavedRun } from "@/lib/sat/progress";
import type {
  Route, SatAnswer, SatAttemptResult, SatMode, SatQuestion, SatSectionId,
} from "@/lib/sat/types";

const LETTERS = ["A", "B", "C", "D"];

/** The real test always numbers Reading and Writing first. */
const SECTION_NO: Record<SatSectionId, number> = { rw: 1, math: 2 };

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

  // ── Bluebook chrome state ────────────────────────────────────────
  // Struck-out choices are a scratch annotation, deliberately NOT autosaved:
  // SavedRun is a versioned schema with tests against it, and losing crossed-out
  // choices on a resume costs the student nothing.
  const [struck, setStruck] = useState<Record<number, boolean[]>>({});
  const [elimOn, setElimOn] = useState(false);
  const [dirOpen, setDirOpen] = useState(false);
  const [timerHidden, setTimerHidden] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [onReview, setOnReview] = useState(false);
  const [split, setSplit] = useState(50);          // left-pane width, %
  const [name, setName] = useState("");
  const splitRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setName(playerName()), []);

  /**
   * The Bluebook shell is position:fixed and scrolls its own panes, so the
   * document behind it must not scroll too - otherwise a trackpad flick moves
   * the page under a fixed overlay and leaves a dead scrollbar.
   */
  useEffect(() => {
    if (stage !== "run") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [stage]);

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
    setOnReview(false);
    setDirOpen(false);
    setNavOpen(false);
    setStruck({});
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

  const pick = useCallback((q: SatQuestion, picked: 0 | 1 | 2 | 3 | -1) =>
    setAnswers((a) => ({ ...a, [q.id]: { kind: "mc", picked } })), []);
  const type = (q: SatQuestion, raw: string) =>
    setAnswers((a) => ({ ...a, [q.id]: { kind: "spr", raw } }));

  const toggleStrike = (q: SatQuestion, i: number) =>
    setStruck((s) => {
      const row = s[q.id] ? [...s[q.id]] : [false, false, false, false];
      row[i] = !row[i];
      return { ...s, [q.id]: row };
    });

  // keyboard, inside a running module only
  useEffect(() => {
    if (stage !== "run" || onReview) return;
    const onKey = (ev: KeyboardEvent) => {
      const q = items[cur];
      if (!q) return;
      const el = ev.target as HTMLElement | null;
      // Grid-in, and anything inside a floating tool (Desmos has its own fields).
      if (el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.closest(".bb-tool")) return;
      if (document.activeElement?.tagName === "INPUT") return;
      const k = Number(ev.key);
      if (q.kind === "mcq" && k >= 1 && k <= 4) pick(q, (k - 1) as 0 | 1 | 2 | 3);
      else if (ev.key === "ArrowRight") setCur((c) => Math.min(items.length - 1, c + 1));
      else if (ev.key === "ArrowLeft") setCur((c) => Math.max(0, c - 1));
      else if (ev.key.toLowerCase() === "m") setFlags((f) => ({ ...f, [q.id]: !f[q.id] }));
      else if (ev.key.toLowerCase() === "c") setCalcOpen((v) => !v);
      else if (ev.key.toLowerCase() === "r") setRefOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, cur, items, onReview, pick]);

  // Close the header/footer popovers on any outside click.
  useEffect(() => {
    if (!moreOpen && !navOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest(".bb-pop") && !el.closest(".bb-tool-btn") && !el.closest(".bb-qnav-btn")) {
        setMoreOpen(false); setNavOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [moreOpen, navOpen]);

  // Split-pane divider.
  const onDividerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDividerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !splitRef.current) return;
    const r = splitRef.current.getBoundingClientRect();
    const pct = ((e.clientX - r.left) / r.width) * 100;
    setSplit(Math.min(72, Math.max(28, pct)));
  };
  const onDividerUp = () => { dragging.current = false; };

  const isDone = useCallback((it: SatQuestion) => {
    const a = answers[it.id];
    return !!a && (a.kind === "mc" ? a.picked >= 0 : a.raw.trim() !== "");
  }, [answers]);

  const answered = items.filter(isDone).length;
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
            Timed exactly like the real digital SAT, in the same on-screen format. Questions are
            original, written to the College Board blueprint.
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
            <li>Within a module, answer in any order, mark questions for review, and cross out choices you have ruled out.</li>
            <li>There is no penalty for a wrong answer, so never leave one blank.</li>
            {startSection === "math" && <li>The Desmos graphing calculator and the reference sheet are available for the whole Math section.</li>}
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

  // ── run: Bluebook-format test surface ──────────────────────────
  const q = items[cur];
  if (!q) return <div className="view" />;

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");
  const low = left < 300;                       // Bluebook warns at five minutes
  const ans = answers[q.id];
  const rows = struck[q.id] ?? [false, false, false, false];
  const last = legIdx + 1 >= legs.length;
  const finishLabel = last ? "Submit test" : "Finish module";
  const isMath = leg.section === "math";

  const confirmFinish = () => {
    if (window.confirm(`${last ? "Submit the test" : "Finish this module"}? You've answered ${answered} of ${items.length}. You cannot return to it.`))
      finishLeg();
  };
  const goNext = () => {
    if (onReview) { confirmFinish(); return; }
    if (cur === items.length - 1) { setOnReview(true); return; }
    setCur((c) => c + 1);
  };
  const goBack = () => {
    if (onReview) { setOnReview(false); return; }
    setCur((c) => Math.max(0, c - 1));
  };

  const leftPane = dirOpen
    ? <Directions section={leg.section} spr={q.kind === "spr"} />
    : q.passage
      ? <div className="bb-passage"><Tex s={q.passage} /></div>
      : null;
  const hasSplit = !onReview && leftPane !== null;

  return (
    <div className="bb-root">
      {/* ── header ─────────────────────────────────────────────── */}
      <header className="bb-top">
        <div className="bb-top-l">
          <h1>Section {SECTION_NO[leg.section]}, Module {leg.stage}: {spec.name}</h1>
          <button
            className={`bb-dir-btn${dirOpen ? " on" : ""}`}
            onClick={() => setDirOpen((v) => !v)}
            aria-expanded={dirOpen}
          >
            Directions <ChevronUp size={16} className={dirOpen ? "" : "flip"} />
          </button>
        </div>

        <div className="bb-top-c">
          {timerHidden ? (
            <button className="bb-hide" onClick={() => setTimerHidden(false)}>
              <Eye size={14} /> Show
            </button>
          ) : (
            <>
              <div className={`bb-clock${low ? " low" : ""}`} aria-live="off">{mm}:{ss}</div>
              <button className="bb-hide" onClick={() => setTimerHidden(true)}>
                <EyeOff size={14} /> Hide
              </button>
            </>
          )}
        </div>

        <div className="bb-top-r">
          {isMath && (
            <>
              <button className={`bb-tool-btn${calcOpen ? " on" : ""}`} onClick={() => setCalcOpen((v) => !v)}>
                <CalcIcon size={20} /><span>Calculator</span>
              </button>
              <button className={`bb-tool-btn${refOpen ? " on" : ""}`} onClick={() => setRefOpen((v) => !v)}>
                <span className="bb-ref-glyph" aria-hidden="true">x²</span><span>Reference</span>
              </button>
            </>
          )}
          <div className="bb-more-wrap">
            <button className={`bb-tool-btn${moreOpen ? " on" : ""}`} onClick={() => setMoreOpen((v) => !v)}>
              <MoreVertical size={20} /><span>More</span>
            </button>
            {moreOpen && (
              <div className="bb-pop bb-pop-more">
                <button onClick={() => { setHelpOpen(true); setMoreOpen(false); }}>Keyboard shortcuts</button>
                <button onClick={() => { setTimerHidden((v) => !v); setMoreOpen(false); }}>
                  {timerHidden ? "Show" : "Hide"} timer
                </button>
                <button onClick={() => { setMoreOpen(false); confirmFinish(); }}>{finishLabel}</button>
                <button
                  className="bad"
                  onClick={() => {
                    setMoreOpen(false);
                    if (window.confirm("Leave the test? Your progress is saved and you can resume from the SAT page."))
                      router.push("/sat");
                  }}
                >
                  Exit without finishing
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="bb-practice">THIS IS A PRACTICE TEST</div>

      {/* ── body ───────────────────────────────────────────────── */}
      <main className="bb-body">
        {!mounted ? null : onReview ? (
          <div className="bb-review">
            <h2>Check Your Work</h2>
            <p>
              On test day you cannot move on until time expires. Here you can finish the module as
              soon as you are ready. Marked questions and blanks are called out below.
            </p>
            <div className="bb-legend">
              <span><i className="bb-lg cur" /> Current</span>
              <span><i className="bb-lg blank" /> Unanswered</span>
              <span><i className="bb-lg done" /> Answered</span>
              <span><Bookmark size={13} className="bb-lg-bm" /> For Review</span>
            </div>
            <div className="bb-grid">
              {items.map((it, n) => (
                <button
                  key={it.id}
                  className={`bb-cell${isDone(it) ? " done" : " blank"}`}
                  onClick={() => { setOnReview(false); setCur(n); }}
                  aria-label={`Question ${n + 1}`}
                >
                  {n + 1}
                  {flags[it.id] && <Bookmark size={11} className="bb-cell-bm" fill="currentColor" />}
                </button>
              ))}
            </div>
            <p className="bb-review-sum">
              {answered} of {items.length} answered
              {items.length - answered > 0 && ` · ${items.length - answered} blank`}
            </p>
          </div>
        ) : hasSplit ? (
          <div className="bb-split" ref={splitRef}>
            <ScrollPane width={`${split}%`}>{leftPane}</ScrollPane>
            <div
              className="bb-divider"
              role="separator"
              aria-orientation="vertical"
              onPointerDown={onDividerDown}
              onPointerMove={onDividerMove}
              onPointerUp={onDividerUp}
              onPointerCancel={onDividerUp}
            >
              <span className="bb-divider-grip" aria-hidden="true">
                <ChevronsLeftRight size={13} />
              </span>
            </div>
            <section className="bb-pane bb-pane-q" style={{ width: `${100 - split}%` }}>
              <QuestionBlock
                q={q} n={cur + 1} ans={ans} rows={rows} elimOn={elimOn}
                flagged={!!flags[q.id]}
                onFlag={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
                onElim={() => setElimOn((v) => !v)}
                onPick={pick} onType={type} onStrike={toggleStrike}
              />
            </section>
          </div>
        ) : (
          <div className="bb-single">
            <QuestionBlock
              q={q} n={cur + 1} ans={ans} rows={rows} elimOn={elimOn}
              flagged={!!flags[q.id]}
              onFlag={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
              onElim={() => setElimOn((v) => !v)}
              onPick={pick} onType={type} onStrike={toggleStrike}
            />
          </div>
        )}
      </main>

      {/* ── footer ─────────────────────────────────────────────── */}
      <footer className="bb-bottom">
        <div className="bb-name">{name || "Student"}</div>

        <div className="bb-qnav">
          <button className="bb-qnav-btn" onClick={() => setNavOpen((v) => !v)} aria-expanded={navOpen}>
            {onReview ? "Review" : `Question ${cur + 1} of ${items.length}`}
            <ChevronUp size={15} className={navOpen ? "flip" : ""} />
          </button>
          {navOpen && (
            <div className="bb-pop bb-pop-nav">
              <div className="bb-pop-nav-head">
                <b>{spec.name}: Module {leg.stage}</b>
                <button onClick={() => setNavOpen(false)} aria-label="Close"><X size={15} /></button>
              </div>
              <div className="bb-legend">
                <span><i className="bb-lg cur" /> Current</span>
                <span><i className="bb-lg blank" /> Unanswered</span>
                <span><Bookmark size={13} className="bb-lg-bm" /> For Review</span>
              </div>
              <div className="bb-grid">
                {items.map((it, n) => (
                  <button
                    key={it.id}
                    className={`bb-cell${n === cur && !onReview ? " cur" : isDone(it) ? " done" : " blank"}`}
                    onClick={() => { setCur(n); setOnReview(false); setNavOpen(false); }}
                    aria-label={`Question ${n + 1}`}
                  >
                    {n + 1}
                    {flags[it.id] && <Bookmark size={11} className="bb-cell-bm" fill="currentColor" />}
                  </button>
                ))}
              </div>
              <button
                className="bb-pop-review"
                onClick={() => { setOnReview(true); setNavOpen(false); }}
              >
                Go to Review Page
              </button>
            </div>
          )}
        </div>

        <div className="bb-moves">
          <button className="bb-back" onClick={goBack} disabled={!onReview && cur === 0}>Back</button>
          <button className="bb-next" onClick={goNext}>{onReview ? finishLabel : "Next"}</button>
        </div>
      </footer>

      {/* ── floating tools ─────────────────────────────────────── */}
      {isMath && <DesmosCalculator open={calcOpen} onClose={() => setCalcOpen(false)} />}
      {isMath && <ReferenceSheet open={refOpen} onClose={() => setRefOpen(false)} />}

      {helpOpen && (
        <div className="bb-modal" role="dialog" aria-label="Keyboard shortcuts">
          <div className="bb-modal-card">
            <h3>Keyboard shortcuts</h3>
            <dl>
              <div><dt>1 – 4</dt><dd>Choose answer A – D</dd></div>
              <div><dt>← →</dt><dd>Previous / next question</dd></div>
              <div><dt>M</dt><dd>Mark for review</dd></div>
              {isMath && <div><dt>C</dt><dd>Calculator</dd></div>}
              {isMath && <div><dt>R</dt><dd>Reference sheet</dd></div>}
              <div><dt>Esc</dt><dd>Close a tool panel</dd></div>
            </dl>
            <button className="bb-next" onClick={() => setHelpOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * A scrolling pane that surfaces Bluebook's "More Below" pill when its content
 * runs past the fold - without it, a student reading directions or a passage
 * has no way to tell that the text is clipped rather than finished.
 */
function ScrollPane({ width, children }: { width: string; children: React.ReactNode }) {
  const el = useRef<HTMLElement | null>(null);
  const [more, setMore] = useState(false);

  const measure = useCallback(() => {
    const n = el.current;
    if (!n) return;
    setMore(n.scrollHeight - n.scrollTop - n.clientHeight > 8);
  }, []);

  // Re-measure on mount, on resize, and whenever the content itself changes.
  useEffect(() => {
    const n = el.current;
    if (!n) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(n);
    for (const c of Array.from(n.children)) ro.observe(c);
    return () => ro.disconnect();
  }, [measure, children]);

  return (
    <div className="bb-scroll" style={{ width }}>
      <section className="bb-pane" ref={el} onScroll={measure}>{children}</section>
      {more && (
        <button
          className="bb-more-below"
          onClick={() => el.current?.scrollBy({ top: el.current.clientHeight * 0.85, behavior: "smooth" })}
        >
          <ChevronDown size={14} /> More Below
        </button>
      )}
    </div>
  );
}

/** The question stem, choices or grid-in, and its Bluebook header row. */
function QuestionBlock({
  q, n, ans, rows, elimOn, flagged, onFlag, onElim, onPick, onType, onStrike,
}: {
  q: SatQuestion;
  n: number;
  ans: SatAnswer | undefined;
  rows: boolean[];
  elimOn: boolean;
  flagged: boolean;
  onFlag: () => void;
  onElim: () => void;
  onPick: (q: SatQuestion, i: 0 | 1 | 2 | 3 | -1) => void;
  onType: (q: SatQuestion, raw: string) => void;
  onStrike: (q: SatQuestion, i: number) => void;
}) {
  return (
    <article className="bb-q">
      <div className="bb-qhead">
        <span className="bb-qnum">{n}</span>
        <button className={`bb-mark${flagged ? " on" : ""}`} onClick={onFlag}>
          <Bookmark size={16} fill={flagged ? "currentColor" : "none"} />
          {flagged ? "Marked for Review" : "Mark for Review"}
        </button>
        {q.kind === "mcq" && (
          <button
            className={`bb-elim${elimOn ? " on" : ""}`}
            onClick={onElim}
            aria-pressed={elimOn}
            title="Cross out answer choices you have ruled out"
          >
            <span className="bb-elim-glyph">ABC</span>
          </button>
        )}
      </div>

      <div className="bb-stem"><Tex s={q.q} /></div>
      {q.figure && <SatFigure html={q.figure} />}

      {q.kind === "mcq" ? (
        <div className="bb-choices">
          {/* Authored order. The real SAT never shuffles choices, and neither do we. */}
          {q.choices.map((choice, i) => {
            const picked = ans?.kind === "mc" && ans.picked === i;
            const out = rows[i];
            return (
              <div key={i} className="bb-choice-row">
                <button
                  className={`bb-choice${picked ? " sel" : ""}${out ? " out" : ""}`}
                  onClick={() => (picked ? onPick(q, -1) : onPick(q, i as 0 | 1 | 2 | 3))}
                  aria-pressed={picked}
                >
                  <span className="bb-letter">{LETTERS[i]}</span>
                  <span className="bb-choice-body"><Tex s={choice} /></span>
                </button>
                {elimOn && (
                  <button
                    className={`bb-strike${out ? " on" : ""}`}
                    onClick={() => onStrike(q, i)}
                    aria-label={`${out ? "Restore" : "Cross out"} choice ${LETTERS[i]}`}
                  >
                    {LETTERS[i]}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <GridIn value={ans?.kind === "spr" ? ans.raw : ""} onChange={(v) => onType(q, v)} />
      )}
    </article>
  );
}

// useSearchParams needs a Suspense boundary or the static export build fails.
export default function SatTestPage() {
  return <Suspense fallback={<div className="view" />}><SatTest /></Suspense>;
}
