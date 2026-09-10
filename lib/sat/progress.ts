/**
 * In-progress autosave for a SAT sitting.
 *
 * A full test is 144 minutes of wall clock, far too much to lose to an
 * accidental refresh. localStorage (not session) so it survives a closed tab;
 * a saved run older than MAX_AGE_MS is discarded.
 *
 * `endAt` is an absolute timestamp, so time spent away still counts against the
 * module - reloading the page is not a way to pause a timed test.
 */

import type { Route, SatAnswer, SatMode, SatSectionId } from "./types";

const KEY = "siit-sat-progress";
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

export type SavedRun = {
  v: 1;
  formId: string;
  mode: SatMode;
  startSection: SatSectionId;
  stage: "module-intro" | "run" | "break";
  legIdx: number;
  cur: number;
  endAt: number;
  startedAt: number;
  savedAt: number;
  routes: Partial<Record<SatSectionId, Route>>;
  answers: Record<number, SatAnswer>;
  flags: Record<number, boolean>;
};

export function readSavedRun(): SavedRun | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as SavedRun;
    if (r.v !== 1 || Date.now() - r.savedAt > MAX_AGE_MS) { localStorage.removeItem(KEY); return null; }
    return r;
  } catch { return null; }
}

export function writeSavedRun(run: SavedRun): void {
  try { localStorage.setItem(KEY, JSON.stringify(run)); } catch { /* quota or private mode */ }
}

export function clearSavedRun(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

/** Query string that resumes a saved run, for a link on the hub. */
export const resumeHref = (r: SavedRun) =>
  `/sat/test?form=${r.formId}&mode=${r.mode}${r.mode === "full" ? "" : `&section=${r.startSection}`}`;

export const describeRun = (r: SavedRun) =>
  `Form ${r.formId} · ${r.mode === "full" ? "full test" : r.mode === "section" ? "full section" : "single module"}`;
