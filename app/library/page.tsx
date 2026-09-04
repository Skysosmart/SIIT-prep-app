"use client";

import { useState } from "react";
import { FORMULAS, LIB_CATS } from "@/lib/formulas";
import { useProfile } from "@/lib/profile";
import { Tex } from "@/components/Tex";
import { SearchIcon } from "@/components/bits";

export default function Library() {
  const { p, toggleFav } = useProfile();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const needle = q.trim().toLowerCase();
  const list = FORMULAS.filter((f) =>
    (cat === "All" || (cat === "★" ? p.favs.includes(f.name) : f.cat === cat)) &&
    (!needle || f.name.toLowerCase().includes(needle) || f.cat.toLowerCase().includes(needle)),
  );

  return (
    <div className="view">
      <span className="kicker">Formula Library</span>
      <h2 style={{ fontSize: "1.8rem", margin: "6px 0 4px" }}>Every formula, one page</h2>
      <p className="sub">Browse by category or search. Star the ones you keep forgetting.</p>
      <div className="filters">
        <div className="search" style={{ maxWidth: 420 }}>
          <SearchIcon />
          <input type="search" placeholder="Search formula…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search formulas" />
        </div>
      </div>
      <div className="lib">
        <aside className="side">
          <button className={cat === "All" ? "on" : ""} onClick={() => setCat("All")}>All formulas</button>
          <button className={cat === "★" ? "on" : ""} onClick={() => setCat("★")}>★ Favorites</button>
          {LIB_CATS.map((c) => (
            <button key={c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
          ))}
        </aside>
        <div className="grid g2">
          {list.length === 0 && (
            <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--mut)" }}>
              No formulas found{cat === "★" ? " — star a formula to save it here" : ""}.
            </div>
          )}
          {list.map((f) => {
            const fav = p.favs.includes(f.name);
            return (
              <div className="card fcard hov" key={f.name}>
                <div className="top">
                  <div>
                    <span className="cat">{f.cat}</span>
                    <div className="nm">{f.name}</div>
                  </div>
                  <button className={`fav${fav ? " on" : ""}`} onClick={() => toggleFav(f.name)}
                    aria-label={`${fav ? "Remove from" : "Add to"} favorites`}>
                    {fav ? "★" : "☆"}
                  </button>
                </div>
                <div className="fm"><Tex s={f.tex} block /></div>
                <div className="use"><b>When to use:</b> <Tex s={f.use} /></div>
                <div className="exm">Example: <Tex s={f.example} /></div>
                <div className="meta">
                  <span className={`tag ${f.diff}`}>{f.diff === "med" ? "Medium" : f.diff === "easy" ? "Easy" : "Hard"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
