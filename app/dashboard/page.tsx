"use client";

import Link from "next/link";
import { TOPICS, topicById } from "@/lib/topics";
import { useProfile, rank, nextRankAt } from "@/lib/profile";
import { localToday, DAILY_BONUS_XP } from "@/lib/daily";
import { Star, Sparkles } from "lucide-react";
import { TopicChip, StreakFlame } from "@/components/bits";

export default function Dashboard() {
  const { p } = useProfile();
  const acc = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;
  const mastered = TOPICS.filter((t) => (p.prog[t.id] ?? 0) >= 70).length;
  const weakest = TOPICS.slice().sort((a, b) => (p.prog[a.id] ?? 0) - (p.prog[b.id] ?? 0)).slice(0, 3);
  const hist = p.hist.slice(0, 7).reverse();
  const next = nextRankAt(p.xp);
  const W = 440, H = 140;
  const bw = W / Math.max(hist.length, 1);

  return (
    <div className="view">
      <span className="kicker">Student dashboard</span>
      <h2 style={{ fontSize: "1.8rem", margin: "6px 0 4px" }}>Welcome back, challenger <Sparkles size={22} style={{ color: "var(--amb)" }} aria-hidden="true" /></h2>
      <p className="sub">
        You&apos;re a <b style={{ color: "var(--pur)" }}>{rank(p.xp)}</b> with {p.xp.toLocaleString()} XP.
        {p.quizzes ? " Keep the streak alive." : " Play your first quiz to start climbing."}
      </p>
      <div className="stats">
        <div className="stat flame"><span className="lb">Daily streak</span><div className="v"><StreakFlame size={24} /> {p.streakDays}<small> {p.streakDays === 1 ? "day" : "days"}</small></div></div>
        <div className="stat"><span className="lb">Overall accuracy</span><div className="v">{acc}<small>%</small></div></div>
        <div className="stat"><span className="lb">Questions answered</span><div className="v">{p.answered.toLocaleString()}</div></div>
        <div className="stat"><span className="lb">Topics mastered</span><div className="v">{mastered}<small> / {TOPICS.length}</small></div></div>
      </div>
      <div className="dash-g" style={{ marginTop: 16 }}>
        <div className="card">
          <b>Accuracy — recent quizzes</b>
          {hist.length === 0 ? (
            <p className="empty" style={{ margin: "14px 0 0" }}>No quizzes yet — your progress chart will grow here.</p>
          ) : (
            <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: "100%", marginTop: 12 }} role="img" aria-label="Bar chart of recent quiz accuracy">
              {[25, 50, 75, 100].map((g) => (
                <line key={g} x1="0" x2={W} y1={H - (H * g) / 100} y2={H - (H * g) / 100} stroke="var(--line)" strokeWidth="1" />
              ))}
              {hist.map((r, i) => {
                const bh = Math.max(2, (H * r.acc) / 100);
                const fill = r.acc >= 70 ? "var(--teal)" : r.acc >= 50 ? "var(--cyan)" : "var(--red)";
                return (
                  <g key={i}>
                    <rect x={i * bw + bw * 0.18} y={H - bh} width={bw * 0.64} height={bh} rx="7" fill={fill} opacity="0.9" />
                    <text x={i * bw + bw / 2} y={H + 16} textAnchor="middle" fontSize="10" fill="var(--mut)">{r.acc}%</text>
                  </g>
                );
              })}
            </svg>
          )}
          <div className="sec-h" style={{ margin: "18px 0 10px" }}><b>Recent quiz history</b></div>
          {p.hist.length === 0 ? (
            <p className="empty">Finished quizzes will be listed here.</p>
          ) : (
            <div className="tbl-wrap hist-tbl">
              <table>
                <thead><tr><th>Topic</th><th>Score</th><th>Accuracy</th><th>Date</th></tr></thead>
                <tbody>
                  {p.hist.slice(0, 6).map((r, i) => (
                    <tr key={i}>
                      <td>{r.topic === "daily" ? <><Star size={13} fill="var(--pur)" style={{ color: "var(--pur)" }} aria-hidden="true" /> Daily Challenge</> : topicById(r.topic).name}</td>
                      <td>{r.score}</td>
                      <td><span className={`tag ${r.acc >= 70 ? "easy" : r.acc >= 50 ? "med" : "hard"}`}>{r.acc}%</span></td>
                      <td style={{ color: "var(--mut)" }}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <b><Star size={15} fill="var(--pur)" style={{ color: "var(--pur)" }} aria-hidden="true" /> Daily Challenge</b>
            <p style={{ fontSize: ".88rem", color: "var(--mut)", margin: "8px 0 14px" }}>
              {p.daily.last === localToday()
                ? <>Done today ✓ · <StreakFlame size={14} /> {p.daily.streak}-day streak. Next set at midnight.</>
                : p.daily.streak > 0
                  ? <><StreakFlame size={14} /> {p.daily.streak}-day streak on the line — today&apos;s set is waiting (+{DAILY_BONUS_XP} XP).</>
                  : <>10 questions across 10 topics, same for everyone. +{DAILY_BONUS_XP} XP on completion.</>}
            </p>
            {p.daily.last !== localToday() && (
              <Link href="/quiz?daily=1" className="btn btn-pur btn-sm">Play today&apos;s 10</Link>
            )}
          </div>
          <div className="card">
            <b>Weakest topics</b>
            <div className="mini-list" style={{ marginTop: 14 }}>
              {weakest.map((t) => (
                <div className="mini" key={t.id}>
                  <TopicChip t={t} />
                  <div className="grow">
                    <div className="nm">{t.name}</div>
                    <div className="pbar" style={{ marginTop: 5 }}><span style={{ width: `${p.prog[t.id] ?? 0}%` }} /></div>
                  </div>
                  <span style={{ fontSize: ".8rem", color: "var(--mut)", fontVariantNumeric: "tabular-nums" }}>{p.prog[t.id] ?? 0}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: "linear-gradient(135deg, var(--pur-t), var(--cyan-t))", borderColor: "var(--pur)" }}>
            <b>Recommended practice</b>
            <p style={{ fontSize: ".88rem", color: "var(--mut)", margin: "8px 0 14px" }}>
              {p.quizzes
                ? `Your ${weakest[0].name} accuracy is lowest — a Formula Recall run is the fastest way up.`
                : `Start with ${weakest[0].name} — a short Formula Recall run is the easiest way in.`}
            </p>
            <Link href={`/quiz?topic=${weakest[0].id}`} className="btn btn-pur btn-sm">Practice {weakest[0].name}</Link>
          </div>
          <div className="card">
            <b>Next rank</b>
            <p style={{ fontSize: ".88rem", color: "var(--mut)", margin: "8px 0 10px" }}>
              {next ? `${(next - p.xp).toLocaleString()} XP to ${rank(next)}` : "Top rank reached — defend it!"}
            </p>
            <div className="pbar">
              <span style={{ width: `${Math.min(100, (100 * p.xp) / 3000)}%`, background: "linear-gradient(90deg, var(--pur), var(--cyan))" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
