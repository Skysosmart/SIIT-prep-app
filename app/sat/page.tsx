"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, PlayCircle, Target, X } from "lucide-react";
import { ScoreHistory } from "@/components/sat/ScoreHistory";
import { clearSavedRun, describeRun, readSavedRun, resumeHref, type SavedRun } from "@/lib/sat/progress";
import { SAT_FORMS } from "@/lib/sat/forms";
import { availableModes } from "@/lib/sat/validate";
import { BREAK_MIN, SAT_SPEC, SIIT_CUTOFF, TOTAL_Q, WALL_MIN } from "@/lib/sat/spec";
import { useProfile } from "@/lib/profile";

export default function SatHub() {
  const { p } = useProfile();
  // Two independent papers. Sitting Form B after Form A gives a second reading
  // that is not just a reshuffle of questions already seen.
  const [formId, setFormId] = useState(SAT_FORMS[0].id);
  const form = SAT_FORMS.find((f) => f.id === formId) ?? SAT_FORMS[0];
  const modes = availableModes(form);
  const taken = (id: string) => p.satTests.filter((t) => t.formId === id).length;

  // localStorage is not available during the static prerender, so read it after mount.
  const [saved, setSaved] = useState<SavedRun | null>(null);
  useEffect(() => setSaved(readSavedRun()), []);

  return (
    <div className="view">
      <span className="kicker">Digital SAT</span>
      <h1 style={{ fontSize: "2rem", margin: "6px 0 4px" }}>SAT practice</h1>
      <p className="sub" style={{ margin: "0 0 8px" }}>
        SIIT accepts SAT scores instead of its own entrance exam. The bar is{" "}
        <b>Math {SIIT_CUTOFF.math}</b> and <b>Reading &amp; Writing {SIIT_CUTOFF.rw}</b> - Math is the
        real hurdle, so that is where this starts.
      </p>

      <div className="exam-facts">
        <div className="exam-fact"><b>{SAT_SPEC.rw.perModule * 2} + {SAT_SPEC.math.perModule * 2}</b><span>R&amp;W + Math questions</span></div>
        <div className="exam-fact"><b>2 modules</b><span>per section, adaptive</span></div>
        <div className="exam-fact"><b>{BREAK_MIN} min</b><span>break between sections</span></div>
        <div className="exam-fact tot"><b>{TOTAL_Q} questions</b><span>{Math.floor(WALL_MIN / 60)}h {WALL_MIN % 60}m</span></div>
      </div>

      {saved && (
        <div className="card" style={{ marginTop: 18, borderColor: "var(--amb)", background: "var(--amb-t)" }}>
          <b>You have a test in progress</b>
          <p className="sub" style={{ textAlign: "left", margin: "6px 0 12px" }}>
            {describeRun(saved)}, saved {new Date(saved.savedAt).toLocaleString()}. The module clock
            has kept running, exactly as it would on the real test.
          </p>
          <div className="exam-nav" style={{ marginTop: 0 }}>
            <Link className="btn btn-p" href={resumeHref(saved)}><PlayCircle size={16} /> Resume</Link>
            <button className="btn btn-g btn-sm" onClick={() => { clearSavedRun(); setSaved(null); }}>
              <X size={14} /> Discard
            </button>
          </div>
        </div>
      )}

      <h2 className="sec-h" style={{ marginTop: 26 }}>Choose a paper</h2>
      <div className="subject-tabs">
        {SAT_FORMS.map((f) => (
          <button key={f.id} className={`subject-tab${f.id === formId ? " on" : ""}`} onClick={() => setFormId(f.id)}>
            {f.name}
          </button>
        ))}
      </div>
      <p className="sub" style={{ textAlign: "left", margin: "8px 0 0" }}>
        {form.blurb} Every question in {form.name} is different from the other paper, so a second
        sitting is a fresh test rather than a reshuffle.
        {taken(form.id) > 0 && ` You have sat this paper ${taken(form.id)} time${taken(form.id) === 1 ? "" : "s"}.`}
      </p>

      <h2 className="sec-h" style={{ marginTop: 22 }}>Start a test</h2>
      <div className="grid g2">
        <div className="card">
          <b>Math module 1</b>
          <p className="sub" style={{ textAlign: "left", margin: "6px 0 12px" }}>
            One real {SAT_SPEC.math.minutes}-minute, {SAT_SPEC.math.perModule}-question module, grid-ins
            included. The fastest way to find out where you stand.
          </p>
          {modes.module.math
            ? <Link className="btn btn-p" href={`/sat/test?form=${form.id}&mode=module&section=math`}>Begin <ChevronRight size={16} /></Link>
            : <span className="tag n">Not authored yet</span>}
        </div>

        <div className="card">
          <b>Full Math section</b>
          <p className="sub" style={{ textAlign: "left", margin: "6px 0 12px" }}>
            Both modules with real adaptive routing, an estimated 200-800 Math score, and how it sits
            against SIIT&apos;s {SIIT_CUTOFF.math}.
          </p>
          {modes.section.math
            ? <Link className="btn btn-p" href={`/sat/test?form=${form.id}&mode=section&section=math`}>Begin <ChevronRight size={16} /></Link>
            : <span className="tag n">Coming in phase 2</span>}
        </div>

        <div className="card">
          <b>Full Reading &amp; Writing section</b>
          <p className="sub" style={{ textAlign: "left", margin: "6px 0 12px" }}>
            {SAT_SPEC.rw.perModule * 2} questions across two adaptive modules, each with its own passage.
          </p>
          {modes.section.rw
            ? <Link className="btn btn-p" href={`/sat/test?form=${form.id}&mode=section&section=rw`}>Begin <ChevronRight size={16} /></Link>
            : <span className="tag n">Coming in phase 3</span>}
        </div>

        <div className="card">
          <b>Full practice test</b>
          <p className="sub" style={{ textAlign: "left", margin: "6px 0 12px" }}>
            Both sections back to back with the {BREAK_MIN}-minute break, and an estimated total out of 1600.
          </p>
          {modes.full
            ? <Link className="btn btn-p" href={`/sat/test?form=${form.id}&mode=full`}>Begin <ChevronRight size={16} /></Link>
            : <span className="tag n">Coming in phase 3</span>}
        </div>
      </div>

      <h2 className="sec-h" style={{ marginTop: 26 }}>Progress toward the SIIT cutoffs</h2>
      <div className="card">
        <ScoreHistory attempts={p.satTests} />
      </div>

      <h2 className="sec-h" style={{ marginTop: 26 }}>Your attempts</h2>
      {p.satTests.length === 0 ? (
        <div className="empty">No SAT attempts yet. Sit the Math module above to get a baseline.</div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>What</th><th>Raw</th><th>Est. score</th></tr>
            </thead>
            <tbody>
              {p.satTests.map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>Form {t.formId} · {t.mode === "full" ? "Full test" : t.mode === "section" ? "Section" : "Module"}</td>
                  <td>
                    {[t.rw && `R&W ${t.rw.raw}/${t.rw.of}`, t.math && `Math ${t.math.raw}/${t.math.of}`]
                      .filter(Boolean).join(" · ")}
                  </td>
                  <td>
                    {t.total ? `~${t.total}` :
                      [t.rw?.scaled && `R&W ~${t.rw.scaled}`, t.math?.scaled && `Math ~${t.math.scaled}`]
                        .filter(Boolean).join(" · ") || <span className="tag n">not scaled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="sub" style={{ marginTop: 18, fontSize: ".85rem" }}>
        <Target size={14} style={{ verticalAlign: "-2px" }} /> Scores here are estimates. Questions are
        original, written to the published College Board blueprint - real administered SAT forms are
        not released.
      </p>
    </div>
  );
}
