/**
 * Digital SAT question model.
 *
 * Deliberately separate from the OSP `Question` type in lib/questions.ts: the
 * SAT mode is a self-contained full-test simulator (no topic drills), so
 * nothing here needs a `TopicId` and the OSP registry stays untouched.
 *
 * All SAT content in this app is ORIGINAL, written from scratch against the
 * published College Board blueprint. Real administered SAT forms are not
 * publicly released and released items are copyrighted; nothing is copied.
 */

export type SatSectionId = "rw" | "math";

/** Per-item difficulty. Drives module assembly and the R&W easiest-first order. */
export type SatLevel = "E" | "M" | "H";

/** Which module 2 the student is routed to after module 1. */
export type Route = "lower" | "upper";

export type SatDomain =
  // Reading and Writing, in the order the real test presents them
  | "craft" // Craft and Structure
  | "info"  // Information and Ideas
  | "conv"  // Standard English Conventions
  | "expr"  // Expression of Ideas
  // Math
  | "alg"   // Algebra
  | "adv"   // Advanced Math
  | "psda"  // Problem-Solving and Data Analysis
  | "geo";  // Geometry and Trigonometry

type SatBase = {
  id: number;
  section: SatSectionId;
  domain: SatDomain;
  /** Skill/knowledge testing point, e.g. "Transitions". Shown in the score report. */
  skill: string;
  level: SatLevel;
  q: string;
  explain: string;
  /** R&W stimulus: an original 25-150 word passage, unique to this question. */
  passage?: string;
  /** Inline <svg> or <table> fragment. See components/SatFigure.tsx. */
  figure?: string;
  /** Unscored pretest item: shown to the student, excluded from raw score AND routing. */
  pretest?: true;
};

/** Multiple choice. Options are presented A-D in the order authored - never shuffled. */
export type SatMcq = SatBase & {
  kind: "mcq";
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
};

/** Student-produced response (grid-in). `accept[0]` is the canonical display form. */
export type SatSpr = SatBase & {
  kind: "spr";
  accept: string[];
};

export type SatQuestion = SatMcq | SatSpr;

export const isSpr = (q: SatQuestion): q is SatSpr => q.kind === "spr";

/** The three module slots that must exist per section: one fixed, two routed. */
export type SatSlot = "m1" | Route;

export type SatSectionForm = {
  m1: SatQuestion[];
  lower: SatQuestion[];
  upper: SatQuestion[];
};

export type SatForm = {
  id: "A" | "B";
  name: string;
  blurb: string;
  rw: SatSectionForm;
  math: SatSectionForm;
};

export const SLOTS: SatSlot[] = ["m1", "lower", "upper"];

/** What the student entered. Kept raw so the review can explain a formatting miss. */
export type SatAnswer =
  | { kind: "mc"; picked: 0 | 1 | 2 | 3 | -1 }
  | { kind: "spr"; raw: string };

export type SatSectionOutcome = {
  raw: number;        // operational correct only
  of: number;         // 50 (rw) / 40 (math), or the module size in "module" mode
  /** Absent when a single module was sat on its own: there was nothing to route to. */
  route?: Route;
  /** Absent for the same reason - half a section cannot honestly be scaled to 200-800. */
  scaled?: number;
  m1Raw?: number;
  m1Of?: number;
  byDomain: { domain: SatDomain; correct: number; total: number }[];
};

export type SatMode = "full" | "section" | "module";

export type SatAttemptResult = {
  date: string;
  formId: "A" | "B";
  mode: SatMode;
  rw?: SatSectionOutcome;
  math?: SatSectionOutcome;
  total?: number;     // 400-1600, only when both sections were taken
  timeSec: number;
  answers: { qid: number; ok: boolean; pretest: boolean; given: SatAnswer }[];
};
