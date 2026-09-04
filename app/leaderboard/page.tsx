"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Share2, Trophy, RefreshCw, Users } from "lucide-react";
import { useProfile, rank } from "@/lib/profile";
import { StreakFlame } from "@/components/bits";
import { hasSupabase, fetchScores, submitScore, playerId, playerName, setPlayerName, type ScoreRow } from "@/lib/leaderboard";

const AV = ["#14B8A6", "#38BDF8", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#0EA5E9", "#F472B6"];
const PODIUM_H = [164, 132, 110];
const PODIUM_C = ["#F5B301", "#C0C7D4", "#CD8B4E"];
const PODIUM_ORDER = [1, 0, 2]; // silver, gold, bronze layout

export default function Leaderboard() {
  const { p, ready } = useProfile();
  const acc = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;

  const [rows, setRows] = useState<ScoreRow[] | null>(null);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [myId, setMyId] = useState("");

  const refresh = useCallback(async (submitFirst: boolean, asName: string) => {
    setBusy(true);
    setErr("");
    try {
      if (submitFirst && asName) await submitScore(asName, p);
      setRows(await fetchScores());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not reach the leaderboard.");
    } finally {
      setBusy(false);
    }
  }, [p]);

  useEffect(() => {
    if (!hasSupabase() || !ready) return;
    const n = playerName();
    setName(n);
    setMyId(playerId());
    void refresh(Boolean(n), n);
  }, [ready, refresh]);

  const join = async () => {
    const n = draft.trim();
    if (n.length < 2) { setErr("Pick a name with at least 2 characters."); return; }
    setPlayerName(n);
    setName(n);
    await refresh(true, n);
  };

  /* ── No backend configured: local-only view ─────────────────────────── */
  if (!hasSupabase()) {
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
        <div className="card" style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Share2 size={20} style={{ color: "var(--pur)", flex: "none" }} aria-hidden="true" />
          <p style={{ margin: 0, fontSize: ".92rem", color: "var(--mut)", flex: 1, minWidth: 220 }}>
            This build has no Supabase keys, so the shared leaderboard is off. Add
            <code> NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> at
            build time to turn it on (see supabase/schema.sql).
          </p>
          <Link href="/practice" className="btn btn-p btn-sm">Play a quiz</Link>
        </div>
      </div>
    );
  }

  /* ── Shared leaderboard ─────────────────────────────────────────────── */
  const podium = (rows ?? []).slice(0, 3);

  return (
    <div className="view">
      <span className="kicker">Leaderboard</span>
      <div className="sec-h" style={{ marginTop: 6 }}>
        <h2 style={{ fontSize: "1.8rem" }}>Arena rankings</h2>
        <button className="btn btn-g btn-sm" onClick={() => refresh(Boolean(name), name)} disabled={busy}>
          <RefreshCw size={14} className={busy ? "spin" : undefined} /> Refresh
        </button>
      </div>
      <p className="sub">Everyone playing SIIT Math Arena, ranked by XP. Your score syncs when you open this page.</p>

      {!name && (
        <div className="card" style={{ margin: "20px 0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Users size={20} style={{ color: "var(--teal-d)", flex: "none" }} aria-hidden="true" />
          <span style={{ fontWeight: 700 }}>Join the board:</span>
          <input
            className="name-input"
            placeholder="Your nickname…"
            maxLength={20}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && join()}
            aria-label="Nickname"
          />
          <button className="btn btn-p btn-sm" onClick={join} disabled={busy}>Join with {p.xp.toLocaleString()} XP</button>
        </div>
      )}

      {err && <p style={{ color: "var(--red)", fontSize: ".9rem" }}>{err}</p>}
      {rows === null && !err && <p className="empty" style={{ margin: "30px 0" }}>Loading rankings…</p>}

      {rows !== null && rows.length > 0 && (
        <>
          <div className="podium">
            {PODIUM_ORDER.map((i) => {
              const r = podium[i];
              if (!r) return null;
              const me = r.player_id === myId;
              return (
                <div className="pod" key={r.player_id}>
                  <span className="av" style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 8px",
                    display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.3rem", color: "#fff",
                    background: me ? "var(--teal)" : AV[(i + 2) % AV.length] }}>{r.name[0]?.toUpperCase()}</span>
                  <div className="nm">{r.name}{me ? " (you)" : ""}</div>
                  <div className="xps">{r.xp.toLocaleString()} XP</div>
                  <div className="bar" style={{ height: PODIUM_H[i],
                    background: `linear-gradient(180deg, ${PODIUM_C[i]}, color-mix(in srgb, ${PODIUM_C[i]} 70%, #000))` }}>{i + 1}</div>
                </div>
              );
            })}
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Rank</th><th>Student</th><th>XP</th><th>Quizzes</th><th>Accuracy</th><th>Streak</th></tr></thead>
              <tbody>
                {rows.map((r, i) => {
                  const me = r.player_id === myId;
                  return (
                    <tr key={r.player_id} className={me ? "me" : ""}>
                      <td>{i + 1}</td>
                      <td>
                        <span className="av-s" style={{ background: me ? "var(--teal)" : AV[i % AV.length] }}>{r.name[0]?.toUpperCase()}</span>
                        {r.name}{me && <> <span className="tag n">you</span></>}
                      </td>
                      <td>{r.xp.toLocaleString()}</td>
                      <td>{r.quizzes}</td>
                      <td>{r.accuracy}%</td>
                      <td><StreakFlame size={14} /> {r.streak}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {rows !== null && rows.length === 0 && (
        <div className="card" style={{ marginTop: 20, textAlign: "center", color: "var(--mut)" }}>
          Nobody on the board yet - {name ? "play a quiz and refresh" : "pick a nickname above"} to claim first place.
        </div>
      )}

      <div className="card" style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <Share2 size={20} style={{ color: "var(--pur)", flex: "none" }} aria-hidden="true" />
        <p style={{ margin: 0, fontSize: ".92rem", color: "var(--mut)", flex: 1, minWidth: 220 }}>
          {name
            ? <>Playing as <b style={{ color: "var(--ink)" }}>{name}</b> · {acc}% accuracy. Send friends the site link so they can join the board.</>
            : "Scores sync from this device under your nickname. Send friends the site link so they can join."}
        </p>
        <Link href="/practice" className="btn btn-p btn-sm">Play a quiz</Link>
      </div>
    </div>
  );
}
