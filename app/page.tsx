"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TOPICS } from "@/lib/topics";
import { QUESTIONS, questionsForTopic } from "@/lib/questions";
import { useProfile } from "@/lib/profile";
import { useAuth } from "@/lib/auth-client";
import { localToday, dailyLabel, DAILY_BONUS_XP } from "@/lib/daily";
import { Star, ChevronRight } from "lucide-react";
import { TopicChip, StreakFlame } from "@/components/bits";

/** First-time, signed-out visitors see the welcome page before the app. */
function useWelcomeGate() {
  const router = useRouter();
  const { user, ready, hasBackend } = useAuth();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (!hasBackend) { setChecked(true); return; }   // static mirror: no gate
    if (!ready) return;
    let seen = false;
    try { seen = localStorage.getItem("siit-seen-welcome") === "1"; } catch { /* ignore */ }
    if (!user && !seen) router.replace("/welcome");
    else setChecked(true);
  }, [user, ready, hasBackend, router]);
  return checked;
}

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
  const gateReady = useWelcomeGate();
  const acc = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;
  const cont = TOPICS
    .filter((t) => (p.prog[t.id] ?? 0) > 0 && (p.prog[t.id] ?? 0) < 100)
    .sort((a, b) => (p.prog[b.id] ?? 0) - (p.prog[a.id] ?? 0))
    .slice(0, 3);

  // hold render until the gate decides (avoids a flash of the app before redirect)
  if (!gateReady) return <div className="view" style={{ minHeight: "60vh" }} />;

  return (
    <div className="view">
      <section className="hero">
        <span className="float" style={{ top: "14%", right: "8%", fontSize: "2.6rem" }}>∫ eˣ dx</span>
        <span className="float" style={{ bottom: "16%", right: "22%", fontSize: "1.8rem" }}>sin²θ + cos²θ = 1</span>
        <span className="float" style={{ top: "55%", right: "6%", fontSize: "1.5rem" }}>Δ = b² − 4ac</span>
        <span className="kicker">SIIT / OSP entrance-exam prep</span>
        <h1>Ace the SIIT exam. <span className="accent">Math · Physics · English.</span></h1>
        <p>
          A full OSP-style mock exam across all three exam subjects, plus {QUESTIONS.length} practice
          questions in {TOPICS.length} topics. Sit the timed paper, then drill your weak spots until they&apos;re a reflex.
        </p>
        <div className="cta">
          <Link href="/exam" className="btn btn-p btn-big">Take Mock Exam</Link>
          <Link href="/practice" className="btn btn-hero btn-big">Practice by Topic</Link>
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

      {([["math","Mathematics topics"],["phys","Physics topics"],["eng","English topics"]] as const).map(([subj, heading]) => (
        <div key={subj}>
          <div className="sec-h">
            <h2>{heading}</h2>
            <Link href="/practice" className="btn btn-g btn-sm">See all</Link>
          </div>
          <div className="grid g3">
            {TOPICS.filter((t) => t.subject === subj).map((t) => (
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
      ))}
    </div>
  );
}
