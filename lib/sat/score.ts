/**
 * ESTIMATED section and total scores.
 *
 * The real SAT scales with item response theory: your score depends on which
 * questions you got right, weighted by each item's measured difficulty. We only
 * have a raw count, so this is an approximation and is always presented as a
 * range with an "Estimated" label - never as "your SAT score".
 *
 * The shape is taken from an official College Board raw-to-scaled conversion
 * table (scoring-sat-practice-test-6-digital.pdf), which itself publishes a
 * score RANGE per raw score rather than a single number.
 *
 * The lower-route cap and upper-route floor are the whole point of multistage
 * adaptivity, so they live visibly in the data rather than in a fudge factor.
 */

import type { Route, SatSectionId } from "./types";
import { SAT_SPEC } from "./spec";

type Anchor = [raw: number, scaled: number];

// Raw ranges are 0-50 (R&W) and 0-40 (Math): operational items only.
const CURVES: Record<SatSectionId, Record<Route, Anchor[]>> = {
  rw: {
    lower: [[0, 200], [10, 330], [25, 450], [40, 550], [50, 600]],
    upper: [[0, 380], [10, 450], [25, 570], [40, 700], [50, 800]],
  },
  math: {
    lower: [[0, 200], [10, 340], [20, 450], [32, 540], [40, 590]],
    upper: [[0, 370], [10, 450], [20, 560], [32, 690], [40, 800]],
  },
};

export const rawMax = (s: SatSectionId) => SAT_SPEC[s].operational * 2;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Piecewise-linear interpolation over the anchors, rounded to the SAT's 10-point grid. */
export function scaled(s: SatSectionId, route: Route, raw: number): number {
  const pts = CURVES[s][route];
  const x = clamp(raw, 0, rawMax(s));
  let v = pts[pts.length - 1][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (x <= x1) { v = y0 + ((x - x0) / (x1 - x0)) * (y1 - y0); break; }
  }
  return clamp(Math.round(v / 10) * 10, 200, 800);
}

/** The uncertainty we are honest about: roughly a College Board score range. */
export const BAND = 40;

export function band(s: SatSectionId, route: Route, raw: number): [number, number] {
  const v = scaled(s, route, raw);
  return [clamp(v - BAND, 200, 800), clamp(v + BAND, 200, 800)];
}

export const total = (rw: number, math: number) => clamp(rw + math, 400, 1600);

export const ESTIMATE_NOTE =
  "Estimated score. The real SAT scales with item response theory using each question's " +
  "measured difficulty, so treat this as a range, not a number.";
