"use client";

import Link from "next/link";
import { Share2, Trophy } from "lucide-react";
import { useProfile, rank } from "@/lib/profile";
import { StreakFlame } from "@/components/bits";

export default function Leaderboard() {
  const { p } = useProfile();
  const acc = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;

  return (
    <div className="view">
      <span className="kicker">Leaderboard</span>
      <h2 style={{ fontSize: "1.8rem", margin: "6px 0 4px" }}>Arena rankings</h2>
      <p className="sub">
        Scores live on each device, so right now this board is all you. Challenge friends with
        the Share Score button after a quiz and compare results.
      </p>

      <div className="podium" style={{ marginTop: 34 }}>
        <div className="pod">
          <span className="av" style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 8px",
            display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.3rem", color: "#fff",
            background: "var(--teal)" }}>Y</span>
          <div className="nm">You</div>
          <div className="xps">{p.xp.toLocaleString()} XP · {rank(p.xp)}</div>
          <div className="bar" style={{ height: 164, background: "linear-gradient(180deg,#F5B301,color-mix(in srgb,#F5B301 70%,#000))" }}>
            <Trophy size={28} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Rank</th><th>Student</th><th>XP</th><th>Quizzes</th><th>Accuracy</th><th>Streak</th></tr></thead>
          <tbody>
            <tr className="me">
              <td>1</td>
              <td><span className="av-s" style={{ background: "var(--teal)" }}>Y</span>You <span className="tag n">you</span></td>
              <td>{p.xp.toLocaleString()}</td>
              <td>{p.quizzes}</td>
              <td>{acc}%</td>
              <td><StreakFlame size={14} /> {p.streakDays}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <Share2 size={20} style={{ color: "var(--pur)", flex: "none" }} aria-hidden="true" />
        <p style={{ margin: 0, fontSize: ".92rem", color: "var(--mut)", flex: 1, minWidth: 220 }}>
          Want real rivals here? Finish a quiz and hit <b style={{ color: "var(--ink)" }}>Share Score</b> -
          friends who beat you can send their grids right back.
        </p>
        <Link href="/practice" className="btn btn-p btn-sm">Play a quiz</Link>
      </div>
    </div>
  );
}
