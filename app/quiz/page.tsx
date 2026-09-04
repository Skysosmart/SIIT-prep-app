"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { topicById } from "@/lib/topics";
import { questionsForTopic, type Question } from "@/lib/questions";
import { MODES, DIFFS, type Mode, type Diff, shuffle, scoreFor, xpFor, pickQuestions } from "@/lib/engine";
import { Triangle, Diamond, Circle, Square, Pentagon, Hexagon, ChevronRight, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { playCorrect, playWrong, soundOn, setSoundOn } from "@/lib/sound";
import { useProfile, type QuizSummary } from "@/lib/profile";
import { dailyQuestions, dailyLabel, localToday, DAILY_TOPIC, DAILY_BONUS_XP } from "@/lib/daily";
import { Tex } from "@/components/Tex";
import { TopicChip, StreakFlame } from "@/components/bits";

type PlayQ = { q: Question; order: number[]; correctAt: number };

const GLYPHS = [Triangle, Diamond, Circle, Square, Pentagon, Hexagon];
const TICK_MS = 100;

const kindLabel = (k: Question["kind"]) =>
  k === "recall" ? "Formula recall" : k === "fill" ? "Fill the missing formula" : "Calculation";

function QuizInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { p, finishQuiz } = useProfile();
  const daily = params.get("daily") === "1";
  const today = localToday();
  const topic = daily ? DAILY_TOPIC : topicById(params.get("topic") ?? "alg");
  const bank = daily ? dailyQuestions(today) : questionsForTopic(topic.id);
  const dailyDone = daily && p.daily.last === today;

  const [stage, setStage] = useState<"lobby" | "play">("lobby");
  const [mode, setMode] = useState<Mode>("mixed");
  const [diff, setDiff] = useState<Diff>("med");
  const [snd, setSnd] = useState(true);
  useEffect(() => setSnd(soundOn()), []);
  const toggleSnd = () => { setSoundOn(!snd); setSnd(!snd); };

  const [qs, setQs] = useState<PlayQ[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [xp, setXp] = useState(0);
  const [picked, setPicked] = useState<number | null>(null); // null = unanswered, -1 = timed out
  const [lastPts, setLastPts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1);

  const results = useRef<QuizSummary["results"]>([]);
  const t0 = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeTotal = useRef(1);
  const answeredRef = useRef(false);

  const stopTimer = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  useEffect(() => stopTimer, []);

  function runTimer() {
    stopTimer();
    timer.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - TICK_MS / 1000));
    }, TICK_MS);
  }

  // timeout: runs after render, so it sees the current question, not a stale closure
  useEffect(() => {
    if (stage === "play" && timeLeft <= 0 && !answeredRef.current) answer(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, stage]);

  function beginQuestion(total: number) {
    answeredRef.current = false;
    timeTotal.current = total;
    setTimeLeft(total);
    setPicked(null);
    runTimer();
  }

  function start() {
    const picked = daily ? shuffle(bank) : pickQuestions(bank, mode);
    const play = picked.map((q) => {
      const order = shuffle(q.choices.map((_, idx) => idx));
      return { q, order, correctAt: order.indexOf(q.answer) };
    });
    results.current = [];
    t0.current = performance.now();
    setQs(play); setI(0); setScore(0); setStreak(0); setBest(0); setXp(0); setLastPts(0);
    setStage("play");
    beginQuestion(Math.round(play[0].q.timer * DIFFS[diff].scale));
  }

  function answer(pos: number) {
    if (answeredRef.current || qs.length === 0) return;
    answeredRef.current = true;
    stopTimer();
    const cur = qs[i];
    const ok = pos === cur.correctAt;
    results.current.push({ qid: cur.q.id, ok, pickedIdx: pos < 0 ? -1 : cur.order[pos] });
    if (ok) {
      playCorrect(streak + 1);
      const pts = scoreFor(timeLeft, timeTotal.current, streak);
      setLastPts(pts);
      setScore((s) => s + pts);
      setXp((x) => x + xpFor(pts));
      setStreak((s) => { const n = s + 1; setBest((b) => Math.max(b, n)); return n; });
    } else {
      playWrong();
      setStreak(0);
    }
    setPicked(pos);
  }

  function next() {
    if (picked === null) return;
    if (i + 1 >= qs.length) { finish(); return; }
    const nextIdx = i + 1;
    setI(nextIdx);
    beginQuestion(Math.round(qs[nextIdx].q.timer * DIFFS[diff].scale));
  }

  function finish() {
    const right = results.current.filter((r) => r.ok).length;
    const bonus = daily && !dailyDone ? DAILY_BONUS_XP : 0;
    const summary: QuizSummary = {
      topic: daily ? "daily" : topic.id, right, total: qs.length,
      xp: xp + bonus, bonus, score, bestStreak: best,
      timeSec: Math.round((performance.now() - t0.current) / 1000),
      results: results.current, mode, diff,
    };
    try { sessionStorage.setItem("siit-last-quiz", JSON.stringify(summary)); } catch { /* ignore */ }
    finishQuiz(summary);
    router.push("/results");
  }

  // keyboard: 1–4 answers, Enter/Space advances
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (stage !== "play") return;
      const n = qs[i]?.q.choices.length ?? 4;
      const k = Number(e.key);
      if (picked === null && k >= 1 && k <= n) answer(k - 1);
      else if (picked !== null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, picked, i, qs, streak, timeLeft]);

  if (stage === "lobby" && daily) {
    return (
      <div className="view lobby">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><TopicChip t={topic} /></div>
          <span className="kicker">Daily Challenge · {dailyLabel(today)}</span>
          <h2 style={{ fontSize: "1.7rem", margin: "6px 0 4px" }}>Today&apos;s 10</h2>
          <p className="sub" style={{ margin: "10px auto 0" }}>
            One question from each of 10 topics — the same set for every player today.
          </p>
          <div className="lobby-facts">
            <span><b>{bank.length}</b> questions</span>
            <span><b>10</b> topics</span>
            <span>Bonus <b>+{DAILY_BONUS_XP} XP</b></span>
          </div>
          {dailyDone ? (
            <p style={{ margin: "6px 0 20px" }}>
              <span className="tag easy" style={{ fontSize: ".82rem", padding: "6px 14px" }}>
                Completed today ✓ · <StreakFlame size={13} /> {p.daily.streak}-day streak
              </span>
              <span style={{ display: "block", color: "var(--mut)", fontSize: ".85rem", marginTop: 10 }}>
                This run is just practice — the bonus comes back tomorrow.
              </span>
            </p>
          ) : (
            <p style={{ color: "var(--mut)", fontSize: ".88rem", margin: "6px 0 20px" }}>
              Finish for +{DAILY_BONUS_XP} bonus XP and to keep your daily-challenge streak alive.
            </p>
          )}
          <button className="btn btn-pur btn-big" onClick={start}>Start Today&apos;s Challenge <ChevronRight size={20} /></button>
          <div style={{ marginTop: 14 }}><Link href="/" className="btn btn-g btn-sm"><ArrowLeft size={15} /> Back home</Link></div>
        </div>
      </div>
    );
  }

  if (stage === "lobby") {
    const n = mode === "mixed" ? Math.min(10, bank.length) : Math.min(10, Math.max(4, bank.filter((q) => q.kind === mode).length));
    const avgTimer = Math.round(20 * DIFFS[diff].scale);
    return (
      <div className="view lobby">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><TopicChip t={topic} /></div>
          <span className="kicker">Quiz lobby</span>
          <h2 style={{ fontSize: "1.7rem", margin: "6px 0 4px" }}>{topic.name}</h2>
          <div className="lobby-facts">
            <span><b>{n}</b> questions</span>
            <span>Difficulty <b>{DIFFS[diff].name}</b></span>
            <span>~<b>{avgTimer}s</b> per question</span>
          </div>
          <div className="opt-row" role="group" aria-label="Quiz mode">
            {MODES.map((m) => (
              <button key={m.id} className={`opt${mode === m.id ? " on" : ""}`} onClick={() => setMode(m.id)}>
                <div className="t">{m.name}</div><div className="d">{m.desc}</div>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
            {(Object.keys(DIFFS) as Diff[]).map((k) => (
              <button key={k} className={`chip${diff === k ? " on" : ""}`} onClick={() => setDiff(k)}>
                {DIFFS[k].name} · ×{DIFFS[k].scale} time
              </button>
            ))}
          </div>
          <button className="btn btn-p btn-big" onClick={start}>Start Game <ChevronRight size={20} /></button>
          <div style={{ marginTop: 14 }}><Link href="/practice" className="btn btn-g btn-sm"><ArrowLeft size={15} /> Back to topics</Link></div>
        </div>
      </div>
    );
  }

  const cur = qs[i];
  const q = cur.q;
  const frac = timeLeft / timeTotal.current;
  const ok = picked !== null && picked === cur.correctAt;

  return (
    <div className="view qshell">
      <div className="qtop">
        <span className="qn">Question {i + 1}<span>/{qs.length}</span></span>
        <span className="stk"><span className={`flame${streak >= 3 ? " hot" : ""}`}><StreakFlame size={17} /></span>{streak}</span>
        <span className="sc">{score.toLocaleString()} pts</span>
        <button className="sndbtn" onClick={toggleSnd} aria-label={snd ? "Mute sounds" : "Unmute sounds"}>
          {snd ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </div>
      <div className={`tbar${frac < 0.3 ? " low" : ""}`}><span style={{ width: `${100 * frac}%` }} /></div>
      <div className="qbox">
        <span className="qk">{daily ? topicById(q.topic).name : topic.name} · {kindLabel(q.kind)}</span>
        <div className="qt qm"><Tex s={q.q} /></div>
        <div className="answers">
          {cur.order.map((choiceIdx, pos) => {
            const Glyph = GLYPHS[pos];
            let cls = `ans c${pos}`;
            if (picked !== null) {
              if (pos === cur.correctAt) cls += " hit";
              else if (pos === picked) cls += " miss";
              else cls += " dim";
            }
            return (
              <button key={pos} className={cls} disabled={picked !== null} onClick={() => answer(pos)}>
                <span className="glyph"><Glyph size={16} fill="currentColor" aria-hidden="true" /></span>
                <span className="body"><Tex s={q.choices[choiceIdx]} /></span>
                <span className="key">{pos + 1}</span>
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`fb ${ok ? "ok" : "no"}`}>
            <div className="verdict">
              {ok
                ? <>Correct! {streak >= 3 && <><StreakFlame size={15} /> {streak} in a row!</>}</>
                : picked === -1 ? "Time's up!" : "Not quite."}
            </div>
            <div className="cf">{q.formula}: <Tex s={q.choices[q.answer]} /></div>
            <div className="ex">{q.explain && <Tex s={q.explain} />}</div>
            <div className="row">
              {ok
                ? <span className="xp-pop">+{lastPts} pts · +{xpFor(lastPts)} XP</span>
                : <span style={{ color: "var(--mut)", fontSize: ".85rem" }}>No points — you&apos;ll get it next time.</span>}
              <button className="btn btn-p" onClick={next}>{i + 1 >= qs.length ? "See results" : "Next question"} <ChevronRight size={17} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizInner />
    </Suspense>
  );
}
