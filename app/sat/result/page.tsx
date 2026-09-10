"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, RefreshCw } from "lucide-react";
import { Tex } from "@/components/Tex";
import { SatFigure } from "@/components/sat/SatFigure";
import { SAT_BY_ID } from "@/lib/sat/forms";
import { SAT_SPEC, SIIT_CUTOFF, domainName } from "@/lib/sat/spec";
import { BAND, ESTIMATE_NOTE } from "@/lib/sat/score";
import { acceptedFormsHint } from "@/lib/sat/grid";
import type { SatAttemptResult, SatSectionId, SatSectionOutcome } from "@/lib/sat/types";

const LETTERS = ["A", "B", "C", "D"];

function SectionCard({ id, o }: { id: SatSectionId; o: SatSectionOutcome }) {
  const cutoff = SIIT_CUTOFF[id];
  const clears = o.scaled !== undefined && o.scaled >= cutoff;
  const short = o.scaled !== undefined && !clears ? cutoff - o.scaled : 0;
  return (
    <div className="card">
      <span className="kicker">{SAT_SPEC[id].name}</span>
      {o.scaled !== undefined ? (
        <>
          <div className="sat-score">~{o.scaled}</div>
          <div className="meta">
            <span className="tag med">Estimated</span>
            <span>range {Math.max(200, o.scaled - BAND)}&ndash;{Math.min(800, o.scaled + BAND)}</span>
          </div>
          <div className="sat-verdict">
            <span className={`tag ${clears ? "easy" : "hard"}`}>
              {clears ? `Clears SIIT's ${cutoff}` : `${short} short of SIIT's ${cutoff}`}
            </span>
            {clears && o.scaled - cutoff < BAND && (
              <span className="tag n">Inside the estimate&apos;s margin &mdash; aim for a {BAND}-point cushion</span>
            )}
          </div>
        </>
      ) : (
        <div className="sat-score">{o.raw}<span style={{ fontSize: "1.2rem", color: "var(--mut)" }}>/{o.of}</span></div>
      )}

      <div className="meta" style={{ marginTop: 10 }}>
        <span>{o.raw} of {o.of} scored questions correct</span>
        {o.route && <span className="tag n">module 2: {o.route === "upper" ? "harder" : "easier"} route</span>}
        {o.m1Raw !== undefined && <span>module 1: {o.m1Raw}/{o.m1Of}</span>}
      </div>

      {/* .tbl-wrap scrolls horizontally: "Problem-Solving and Data Analysis" is
          wider than a 390px screen. */}
      <div className="tbl-wrap" style={{ marginTop: 14, background: "transparent", border: 0, boxShadow: "none" }}>
        <table className="sat-domains">
          <thead><tr><th style={{ textAlign: "left" }}>Domain</th><th>Correct</th></tr></thead>
          <tbody>
            {o.byDomain.map((d) => (
              <tr key={d.domain}>
                <td>{domainName(d.domain)}</td>
                <td>{d.correct}/{d.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SatResultPage() {
  const [r, setR] = useState<SatAttemptResult | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("siit-last-sat");
      if (raw) setR(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  if (!r) {
    return (
      <div className="view" style={{ textAlign: "center" }}>
        <h2>No test to show</h2>
        <p className="sub" style={{ margin: "12px auto 20px" }}>
          Sit a SAT practice test first and your report will appear here.
        </p>
        <Link href="/sat" className="btn btn-p">Go to SAT practice</Link>
      </div>
    );
  }

  const mm = Math.floor(r.timeSec / 60);
  const pretests = r.answers.filter((a) => a.pretest).length;

  return (
    <div className="view">
      <span className="kicker">Form {r.formId} · {r.mode === "full" ? "Full test" : r.mode === "section" ? "Section" : "Single module"}</span>
      <h1 style={{ fontSize: "2rem", margin: "6px 0 4px" }}>
        {r.total ? <>Estimated total ~{r.total}<span style={{ fontSize: "1.1rem", color: "var(--mut)" }}> / 1600</span></> : "Your report"}
      </h1>
      <p className="sub" style={{ margin: "0 0 6px" }}>{mm} minutes.{" "}
        {pretests > 0 && (
          <>{pretests} of the questions you saw were unscored <b>pretest</b> items, exactly as on the
          real test &mdash; they appear in the review below but not in your raw score.</>
        )}
      </p>

      <div className="grid g2" style={{ marginTop: 18 }}>
        {r.rw && <SectionCard id="rw" o={r.rw} />}
        {r.math && <SectionCard id="math" o={r.math} />}
      </div>

      {(r.rw?.scaled !== undefined || r.math?.scaled !== undefined) && (
        <p className="sub" style={{ marginTop: 16, fontSize: ".85rem" }}>{ESTIMATE_NOTE}</p>
      )}

      <div className="exam-nav" style={{ marginTop: 22 }}>
        <Link href="/sat" className="btn btn-p"><RefreshCw size={16} /> Take another</Link>
        <button className="btn btn-g" onClick={() => setShowReview((v) => !v)}>
          {showReview ? "Hide" : "Review every question"} <ChevronRight size={16} />
        </button>
      </div>

      {showReview && (
        <div className="rv" style={{ marginTop: 18 }}>
          {r.answers.map((a, n) => {
            const q = SAT_BY_ID.get(a.qid);
            if (!q) return null;
            return (
              <div key={a.qid} className="card" style={{ marginBottom: 14, textAlign: "left" }}>
                <div className="meta">
                  <span className="qk">Question {n + 1}</span>
                  <span className={`tag ${a.ok ? "easy" : "hard"}`}>{a.ok ? "Correct" : "Incorrect"}</span>
                  {a.pretest && <span className="tag n">unscored pretest</span>}
                  <span className="tag n">{domainName(q.domain)} · {q.skill}</span>
                </div>
                {q.passage && <div className="passage"><Tex s={q.passage} /></div>}
                <div className="qt" style={{ fontSize: "1.02rem", marginTop: 8 }}><Tex s={q.q} /></div>
                {q.figure && <SatFigure html={q.figure} />}

                {q.kind === "mcq" ? (
                  <div className="exam-answers" style={{ marginTop: 12 }}>
                    {q.choices.map((c, i) => {
                      const picked = a.given.kind === "mc" && a.given.picked === i;
                      const right = i === q.answer;
                      return (
                        <div key={i} className={`exam-ans${right ? " sel" : ""}`} style={picked && !right ? { borderColor: "var(--red)" } : undefined}>
                          <span className="exam-letter">{LETTERS[i]}</span>
                          <span className="exam-body"><Tex s={c} /></span>
                          {right && <span className="tag easy">answer</span>}
                          {picked && !right && <span className="tag hard">you</span>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="meta" style={{ marginTop: 12 }}>
                    <span>You entered: <b>{a.given.kind === "spr" && a.given.raw ? a.given.raw : "(blank)"}</b></span>
                    <span className="tag easy">Accepted: {acceptedFormsHint(q.accept)}</span>
                  </div>
                )}

                <p className="sub" style={{ textAlign: "left", marginTop: 10 }}><Tex s={q.explain} /></p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
