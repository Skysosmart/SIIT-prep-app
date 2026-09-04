"use client";

import Link from "next/link";
import { useState } from "react";
import { TOPICS } from "@/lib/topics";
import { questionsForTopic } from "@/lib/questions";
import { useProfile } from "@/lib/profile";
import { TopicChip, DiffTag, SearchIcon } from "@/components/bits";

export default function Practice() {
  const { p } = useProfile();
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<"math" | "eng">("math");
  const [diff, setDiff] = useState("All");

  const list = TOPICS.filter((t) =>
    t.subject === subject &&
    (diff === "All" || t.diff === diff) &&
    (!q.trim() || t.name.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <div className="view">
      <span className="kicker">Practice by topic</span>
      <h2 style={{ fontSize: "1.8rem", marginTop: 6 }}>Drill a single topic</h2>
      <p className="sub">Untimed practice with instant feedback. For the real thing, try the <Link href="/exam" style={{ color: "var(--teal-d)", fontWeight: 700 }}>timed mock exam</Link>.</p>
      <div className="subject-tabs">
        <button className={`subject-tab${subject === "math" ? " on" : ""}`} onClick={() => setSubject("math")}>Mathematics</button>
        <button className={`subject-tab${subject === "eng" ? " on" : ""}`} onClick={() => setSubject("eng")}>English</button>
      </div>
      <div className="filters">
        <div className="search">
          <SearchIcon />
          <input type="search" placeholder="Search topics…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search topics" />
        </div>
        {["All", "Easy", "Medium", "Hard"].map((f) => (
          <button key={f} className={`chip${diff === f ? " on" : ""}`} onClick={() => setDiff(f)}>{f}</button>
        ))}
      </div>
      <div className="grid g3">
        {list.length === 0 && (
          <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--mut)" }}>
            No topics match. Clear a filter or try another search.
          </div>
        )}
        {list.map((t) => (
          <div className="card hov" key={t.id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <TopicChip t={t} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <b style={{ fontSize: "1.05rem" }}>{t.name}</b>
                <div style={{ fontSize: ".82rem", color: "var(--mut)" }}>{questionsForTopic(t.id).length} questions</div>
              </div>
            </div>
            <div className="meta">
              <DiffTag d={t.diff} />
              <span className={`tag ${t.core ? "core" : "extra"}`}>{t.core ? "Core" : "Extra"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 16px" }}>
              <div className="pbar" style={{ flex: 1 }}><span style={{ width: `${p.prog[t.id] ?? 0}%` }} /></div>
              <span style={{ fontSize: ".8rem", color: "var(--mut)", fontVariantNumeric: "tabular-nums" }}>{p.prog[t.id] ?? 0}%</span>
            </div>
            <Link href={`/quiz?topic=${t.id}`} className="btn btn-p btn-sm">Practice</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
