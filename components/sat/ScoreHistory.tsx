"use client";

import { SIIT_CUTOFF } from "@/lib/sat/spec";
import type { SatAttempt } from "@/lib/profile";

/**
 * Estimated section scores over time, against the two SIIT cutoffs.
 *
 * The whole point of the SAT route into SIIT is a pair of thresholds, so the
 * thresholds are drawn as lines rather than left for the reader to infer.
 * Hand-rolled SVG, matching the idiom already used in app/dashboard/page.tsx -
 * no chart library.
 */

const W = 440, H = 170, PAD_L = 34, PAD_R = 8, PAD_T = 8, PAD_B = 22;
const LO = 200, HI = 800;

const y = (score: number) => PAD_T + (HI - score) / (HI - LO) * (H - PAD_T - PAD_B);

export function ScoreHistory({ attempts }: { attempts: SatAttempt[] }) {
  // oldest first, and only sittings that produced a scaled score
  const scored = attempts
    .filter((a) => a.rw?.scaled !== undefined || a.math?.scaled !== undefined)
    .slice(0, 8)
    .reverse();

  if (scored.length === 0) {
    return (
      <p className="empty" style={{ margin: "12px 0 0" }}>
        Sit a full section or a full test and your estimated scores will be plotted here against
        SIIT&apos;s Math {SIIT_CUTOFF.math} and Reading &amp; Writing {SIIT_CUTOFF.rw}.
      </p>
    );
  }

  // inset the series so the first point does not sit on top of the axis labels
  const X0 = PAD_L + 10, X1 = W - PAD_R - 10, span = X1 - X0;
  const x = (i: number) => X0 + (scored.length === 1 ? span / 2 : (i * span) / (scored.length - 1));

  const series = ([["math", "var(--teal)"], ["rw", "var(--pur)"]] as const).map(([key, colour]) => ({
    key, colour,
    cutoff: SIIT_CUTOFF[key],
    points: scored
      .map((a, i) => ({ i, score: a[key]?.scaled }))
      .filter((pt): pt is { i: number; score: number } => pt.score !== undefined),
  }));

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", marginTop: 12 }} role="img"
        aria-label="Estimated SAT section scores over time against the SIIT cutoffs">
        {[200, 400, 600, 800].map((g) => (
          <g key={g}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(g)} y2={y(g)} stroke="var(--line)" strokeWidth="1" />
            <text x={PAD_L - 6} y={y(g) + 3} textAnchor="end" fontSize="9" fill="var(--mut)">{g}</text>
          </g>
        ))}

        {/* the two thresholds this whole feature exists for */}
        {series.map(({ key, cutoff }) => (
          <g key={`t-${key}`}>
            <line className="sat-target" x1={PAD_L} x2={W - PAD_R} y1={y(cutoff)} y2={y(cutoff)} />
            <text x={W - PAD_R} y={y(cutoff) - 4} textAnchor="end" fontSize="9" fill="var(--mut)">
              SIIT {key === "math" ? "Math" : "R&W"} {cutoff}
            </text>
          </g>
        ))}

        {series.map(({ key, colour, cutoff, points }) => (
          <g key={key}>
            {points.length > 1 && (
              <polyline fill="none" stroke={colour} strokeWidth="2" strokeLinejoin="round"
                points={points.map((pt) => `${x(pt.i)},${y(pt.score)}`).join(" ")} />
            )}
            {points.map((pt) => (
              <circle key={pt.i} cx={x(pt.i)} cy={y(pt.score)} r="4.5"
                fill={pt.score >= cutoff ? "var(--grn)" : "var(--red)"} stroke={colour} strokeWidth="1.5">
                <title>{`${key === "math" ? "Math" : "Reading and Writing"}: about ${pt.score} (SIIT wants ${cutoff})`}</title>
              </circle>
            ))}
          </g>
        ))}

        {scored.map((a, i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--mut)">
            {a.formId}
          </text>
        ))}
      </svg>

      <div className="pal-legend" style={{ marginTop: 4 }}>
        <span><i className="lg" style={{ background: "var(--teal)", borderColor: "var(--teal)" }} /> Math</span>
        <span><i className="lg" style={{ background: "var(--pur)", borderColor: "var(--pur)" }} /> Reading &amp; Writing</span>
        <span><i className="lg" style={{ background: "var(--grn)", borderColor: "var(--grn)" }} /> clears the cutoff</span>
        <span><i className="lg" style={{ background: "var(--red)", borderColor: "var(--red)" }} /> short of it</span>
      </div>
      <p className="sub" style={{ textAlign: "left", margin: "8px 0 0", fontSize: ".8rem" }}>
        Dashed lines are SIIT&apos;s minimums. All plotted scores are estimates, so treat a point
        sitting right on a line as not yet clear of it.
      </p>
    </>
  );
}
