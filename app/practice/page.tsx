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
  const [scope, setScope] = useState("All");
  const [diff, setDiff] = useState("All");

  const list = TOPICS.filter((t) =>
    (scope === "All" || (scope === "Core") === t.core) &&
    (diff === "All" || t.diff === diff) &&
    (!q.trim() || t.name.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <div className="view">
      <span className="kicker">Practice</span>
      <h2 style={{ fontSize: "1.8rem", marginTop: 6 }}>Choose your practice test</h2>
      <p className="sub">Every topic maps to a section of the SIIT entrance exam. Progress reflects your best accuracy per topic.</p>
      <div className="filters">
        <div className="search">
          <SearchIcon />
          <input type="search" placeholder="Search topics…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search topics" />
        </div>
        {["All", "Core", "Extra"].map((f) => (
          <button key={f} className={`chip${scope === f ? " on" : ""}`} onClick={() => setScope(f)}>{f}</button>
        ))}
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
