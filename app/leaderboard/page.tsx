"use client";

import { useState } from "react";
import { useProfile } from "@/lib/profile";

const AV = ["#14B8A6", "#38BDF8", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#0EA5E9", "#F472B6"];

// Demo classmates — swap for real friends' scores if you ever add a backend.
const BOARD = {
  week: [
    { n: "Praew", xp: 2140, q: 21, s: 9 }, { n: "Beam", xp: 1980, q: 18, s: 7 },
    { n: "First", xp: 1720, q: 16, s: 11 }, { n: "Mild", xp: 1510, q: 14, s: 5 },
    { n: "Bank", xp: 1340, q: 12, s: 6 }, { n: "Ploy", xp: 1180, q: 11, s: 4 },
    { n: "Ice", xp: 960, q: 9, s: 3 }, { n: "Nong", xp: 720, q: 8, s: 2 },
  ],
  all: [
    { n: "First", xp: 12840, q: 132, s: 23 }, { n: "Praew", xp: 11710, q: 120, s: 19 },
    { n: "Ploy", xp: 9430, q: 98, s: 15 }, { n: "Beam", xp: 8990, q: 91, s: 17 },
    { n: "Ice", xp: 7420, q: 80, s: 12 }, { n: "Mild", xp: 6880, q: 74, s: 9 },
    { n: "Bank", xp: 5310, q: 60, s: 8 }, { n: "Nong", xp: 4150, q: 47, s: 7 },
  ],
};

type Row = { n: string; xp: number; q: number; s: number; me?: boolean };

const PODIUM_H = [164, 132, 110];
const PODIUM_C = ["#F5B301", "#C0C7D4", "#CD8B4E"];

export default function Leaderboard() {
  const { p } = useProfile();
  const [tab, setTab] = useState<"week" | "all">("week");

  const base = BOARD[tab];
  const rows: Row[] = [...base, { n: "You", xp: p.xp, q: p.quizzes, s: p.streakDays, me: true }]
    .sort((a, b) => b.xp - a.xp);
  const color = (r: Row, i: number) => (r.me ? "var(--teal)" : AV[i % AV.length]);
  const podium = rows.slice(0, 3);
  const podiumOrder = [1, 0, 2]; // silver, gold, bronze layout

  return (
    <div className="view">
      <span className="kicker">Leaderboard</span>
      <div className="sec-h" style={{ marginTop: 6 }}>
        <h2 style={{ fontSize: "1.8rem" }}>Arena rankings</h2>
        <div className="tabs">
          <button className={tab === "week" ? "on" : ""} onClick={() => setTab("week")}>Weekly</button>
          <button className={tab === "all" ? "on" : ""} onClick={() => setTab("all")}>All-Time</button>
        </div>
      </div>
      <div className="podium">
        {podiumOrder.map((rankIdx) => {
          const r = podium[rankIdx];
          if (!r) return null;
          return (
            <div className="pod" key={r.n}>
              <span className="av" style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 8px",
                display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.3rem", color: "#fff",
                background: color(r, rankIdx + 2) }}>{r.n[0]}</span>
              <div className="nm">{r.n}</div>
              <div className="xps">{r.xp.toLocaleString()} XP</div>
              <div className="bar" style={{ height: PODIUM_H[rankIdx],
                background: `linear-gradient(180deg, ${PODIUM_C[rankIdx]}, color-mix(in srgb, ${PODIUM_C[rankIdx]} 70%, #000))` }}>
                {rankIdx + 1}
              </div>
            </div>
          );
        })}
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Rank</th><th>Student</th><th>XP</th><th>Quizzes</th><th>Streak</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.n} className={r.me ? "me" : ""}>
                <td>{i + 1}</td>
                <td>
                  <span className="av-s" style={{ background: color(r, i) }}>{r.n[0]}</span>
                  {r.n}{r.me && <> <span className="tag n">you</span></>}
                </td>
                <td>{r.xp.toLocaleString()}</td>
                <td>{r.q}</td>
                <td>🔥 {r.s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
