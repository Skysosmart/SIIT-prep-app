"use client";

import Link from "next/link";
import { TOPICS } from "@/lib/topics";
import { QUESTIONS, questionsForTopic } from "@/lib/questions";
import { useProfile } from "@/lib/profile";
import { localToday, dailyLabel, DAILY_BONUS_XP } from "@/lib/daily";
import { Star, ChevronRight } from "lucide-react";
import { TopicChip, StreakFlame } from "@/components/bits";

function DailyBanner() {
  const { p } = useProfile();
  const today = localToday();
  const done = p.daily.last === today;
  return (
    <div className="daily-banner">
      <span className="db-star" aria-hidden="true"><Star size={20} fill="currentColor" /></span>
      <div className="db-body">
        <b>Daily Challenge · {dailyLabel(today)}</b>
        <span className="db-sub">
          {done
            ? <>Completed today ✓ · <StreakFlame size={14} /> {p.daily.streak}-day streak - come back tomorrow for the next set.</>
            : <>10 questions, 10 topics - the same set for everyone. Finish it for +{DAILY_BONUS_XP} bonus XP.</>}
        </span>
      </div>
      <Link href="/quiz?daily=1" className={`btn btn-sm ${done ? "btn-g" : "btn-pur"}`}>
        {done ? "Practice again" : "Play today's 10"} <ChevronRight size={15} />
      </Link>
    </div>
  );
}

export default function Home() {
  const { p } = useProfile();
  const acc = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;
  const cont = TOPICS
    .filter((t) => (p.prog[t.id] ?? 0) > 0 && (p.prog[t.id] ?? 0) < 100)
    .sort((a, b) => (p.prog[b.id] ?? 0) - (p.prog[a.id] ?? 0))
    .slice(0, 3);

  return (
    <div className="view">
      <section className="hero">
        <span className="float" style={{ top: "14%", right: "8%", fontSize: "2.6rem" }}>∫ eˣ dx</span>
        <span className="float" style={{ bottom: "16%", right: "22%", fontSize: "1.8rem" }}>sin²θ + cos²θ = 1</span>
        <span className="float" style={{ top: "55%", right: "6%", fontSize: "1.5rem" }}>Δ = b² − 4ac</span>
        <span className="kicker">SIIT entrance-exam practice</span>
        <h1>Master SIIT Math. <span className="accent">One formula at a time.</span></h1>
        <p>
          Timed formula quizzes built from a real SIIT question bank - {QUESTIONS.length} questions
          across {TOPICS.length} topics. Race the clock, keep your streak alive, and turn every
          formula into a reflex.
        </p>
        <div className="cta">
          <Link href="/practice" className="btn btn-p btn-big">Start Quiz</Link>
          <Link href="/library" className="btn btn-hero btn-big">Review Formulas</Link>
        </div>
      </section>

      <DailyBanner />

      <div className="stats">
        <div className="stat"><span className="lb">Topics</span><div className="v">{TOPICS.length}</div></div>
        <div className="stat"><span className="lb">Questions</span><div className="v">{QUESTIONS.length}<small> in bank</small></div></div>
        <div className="stat"><span className="lb">Best Score</span><div className="v">{acc}<small>% accuracy</small></div></div>
        <div className="stat flame"><span className="lb">Current Streak</span><div className="v"><StreakFlame size={24} /> {p.streakDays}<small> {p.streakDays === 1 ? "day" : "days"}</small></div></div>
      </div>

      {cont.length > 0 && (
        <>
          <div className="sec-h"><h2>Continue practicing</h2><Link href="/dashboard" className="btn btn-g btn-sm">View dashboard</Link></div>
          <div className="grid g3">
            {cont.map((t) => (
              <div className="card hov" key={t.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <TopicChip t={t} />
                  <div><b>{t.name}</b><div style={{ fontSize: ".82rem", color: "var(--mut)" }}>{p.prog[t.id]}% mastered</div></div>
                </div>
                <div className="pbar" style={{ margin: "14px 0" }}><span style={{ width: `${p.prog[t.id]}%` }} /></div>
                <Link href={`/quiz?topic=${t.id}`} className="btn btn-p btn-sm">Continue</Link>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="sec-h"><h2>Pick a topic</h2><Link href="/practice" className="btn btn-g btn-sm">See all</Link></div>
      <div className="grid g3">
        {TOPICS.map((t) => (
          <Link key={t.id} href={`/quiz?topic=${t.id}`} className="card hov" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <TopicChip t={t} />
            <div style={{ minWidth: 0 }}>
              <b>{t.name}</b>
              <div style={{ fontSize: ".82rem", color: "var(--mut)" }}>{questionsForTopic(t.id).length} questions · {t.diff}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
