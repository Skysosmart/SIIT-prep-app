/**
 * The digital SAT blueprint, as published by College Board.
 *
 * Sources:
 *  - satsuite.collegeboard.org/sat/whats-on-the-test/structure
 *  - satsuite.collegeboard.org/media/pdf/digital-sat-test-spec-overview.pdf
 */

import type { Route, SatDomain, SatLevel, SatSectionId, SatSlot } from "./types";

export const SAT_SPEC = {
  rw: {
    name: "Reading and Writing",
    short: "R&W",
    perModule: 27,   // 25 operational + 2 pretest
    operational: 25,
    minutes: 32,
  },
  math: {
    name: "Math",
    short: "Math",
    perModule: 22,   // 20 operational + 2 pretest
    operational: 20,
    minutes: 35,
  },
} as const;

export const SECTION_ORDER: SatSectionId[] = ["rw", "math"];

/** A 10-minute break sits between the two sections. */
export const BREAK_MIN = 10;

/** 64 + 70 = 134 min of testing; 144 min wall clock once the break is counted. */
export const TESTING_MIN = SECTION_ORDER.reduce((s, id) => s + SAT_SPEC[id].minutes * 2, 0);
export const WALL_MIN = TESTING_MIN + BREAK_MIN;
export const TOTAL_Q = SECTION_ORDER.reduce((s, id) => s + SAT_SPEC[id].perModule * 2, 0);
export const OPERATIONAL_Q = SECTION_ORDER.reduce((s, id) => s + SAT_SPEC[id].operational * 2, 0);

/**
 * Multistage adaptive routing.
 *
 * College Board does NOT publish the routing cutoff - the real test uses an
 * ability estimate, not a raw count. This is a deliberate approximation, kept
 * as a single tunable constant so it is easy to find and adjust.
 *
 * Counted over OPERATIONAL items only (25 R&W / 20 Math), and evaluated
 * independently per section: a student can be routed to the harder R&W
 * module 2 and the easier Math module 2 in the same sitting.
 */
export const LEVEL_WEIGHT: Record<SatLevel, number> = { E: 1.0, M: 1.25, H: 1.5 };

/**
 * Fraction of the maximum weighted module-1 score needed to reach the harder
 * module 2. TUNE HERE AND NOWHERE ELSE.
 */
export const ROUTE_CUTOFF: Record<SatSectionId, number> = { rw: 0.6, math: 0.6 };

/**
 * Weighting a hard item above an easy one is the cheapest honest nod toward
 * IRT: it moves in the same direction the real engine does, without pretending
 * to have item parameters we do not have.
 */
export function routeFor(
  section: SatSectionId,
  m1: readonly { level: SatLevel }[],
  correct: readonly boolean[],
  pretest: readonly boolean[],
): Route {
  let got = 0, max = 0;
  m1.forEach((item, i) => {
    if (pretest[i]) return;              // pretest items never affect routing
    const w = LEVEL_WEIGHT[item.level];
    max += w;
    if (correct[i]) got += w;
  });
  return max > 0 && got / max >= ROUTE_CUTOFF[section] ? "upper" : "lower";
}

/** SIIT admission minimums (Admission Criteria, admissions.siit.tu.ac.th). */
export const SIIT_CUTOFF = { math: 620, rw: 400 } as const;

export type DomainMeta = {
  id: SatDomain;
  section: SatSectionId;
  name: string;
  /** Skill/knowledge testing points, for authoring reference and the score report. */
  skills: string[];
  /** Share of the section, from the published question distribution. */
  share: string;
  /** Allowed item count per MODULE, derived from that share. Enforced by validateForm. */
  band: [number, number];
};

/** R&W domains are listed in the order the real test presents them. */
export const DOMAINS: DomainMeta[] = [
  { id: "craft", section: "rw", name: "Craft and Structure", share: "~28%", band: [6, 9],
    skills: ["Words in Context", "Text Structure and Purpose", "Cross-Text Connections"] },
  { id: "info", section: "rw", name: "Information and Ideas", share: "~26%", band: [6, 8],
    skills: ["Central Ideas and Details", "Command of Evidence", "Inferences"] },
  { id: "conv", section: "rw", name: "Standard English Conventions", share: "~26%", band: [5, 8],
    skills: ["Boundaries", "Form, Structure, and Sense"] },
  { id: "expr", section: "rw", name: "Expression of Ideas", share: "~20%", band: [4, 6],
    skills: ["Rhetorical Synthesis", "Transitions"] },
  { id: "alg", section: "math", name: "Algebra", share: "~35%", band: [7, 9],
    skills: ["Linear equations in one variable", "Linear equations in two variables", "Linear functions",
             "Systems of two linear equations", "Linear inequalities"] },
  { id: "adv", section: "math", name: "Advanced Math", share: "~35%", band: [7, 9],
    skills: ["Equivalent expressions", "Nonlinear equations and systems", "Nonlinear functions"] },
  { id: "psda", section: "math", name: "Problem-Solving and Data Analysis", share: "~15%", band: [2, 4],
    skills: ["Ratios, rates, proportional relationships, and units", "Percentages",
             "One-variable data", "Two-variable data and scatterplots", "Probability",
             "Inference from sample statistics and margin of error", "Evaluating statistical claims"] },
  { id: "geo", section: "math", name: "Geometry and Trigonometry", share: "~15%", band: [2, 4],
    skills: ["Area and volume", "Lines, angles, and triangles", "Right triangles and trigonometry", "Circles"] },
];

export const domainsOf = (s: SatSectionId) => DOMAINS.filter((d) => d.section === s);
export const domainName = (id: SatDomain) => DOMAINS.find((d) => d.id === id)?.name ?? id;

/** R&W blocks appear in this exact order. Enforced by validateForm. */
export const RW_DOMAIN_ORDER: SatDomain[] = ["craft", "info", "conv", "expr"];

/** Share of a math module that must be student-produced response. */
export const SPR_SHARE: [number, number] = [0.2, 0.3];

export const LEVEL_RANK: Record<SatLevel, number> = { E: 0, M: 1, H: 2 };

/**
 * Exact per-module composition. These numbers are chosen so the SECTION totals
 * land inside every published band:
 *   R&W operational 14/12/14/10 of 50 = 28% / 24% / 28% / 20%
 *   Math operational 14/14/6/6 of 40  = 35% / 35% / 15% / 15%
 */
export const MODULE_QUOTA: Record<SatSectionId, { domain: SatDomain; count: number; pretest: number }[]> = {
  rw: [
    { domain: "craft", count: 8, pretest: 1 },
    { domain: "info",  count: 7, pretest: 1 },
    { domain: "conv",  count: 7, pretest: 0 },
    { domain: "expr",  count: 5, pretest: 0 },
  ],
  math: [
    { domain: "alg",  count: 8, pretest: 1 },
    { domain: "adv",  count: 7, pretest: 0 },
    { domain: "psda", count: 4, pretest: 1 },
    { domain: "geo",  count: 3, pretest: 0 },
  ],
};

export const PRETEST_PER_MODULE = 2;

/** Difficulty mix per module slot. Validator allows +/-2 items. */
export const LEVEL_MIX: Record<SatSlot, Record<SatLevel, number>> = {
  m1:     { E: 0.35, M: 0.40, H: 0.25 },
  lower:  { E: 0.55, M: 0.35, H: 0.10 },
  upper:  { E: 0.10, M: 0.35, H: 0.55 },
};


/** Grid-ins per math module. ~25% of the section. */
export const SPR_PER_MODULE: [number, number] = [4, 7];

export const LEVEL_RANK_ORDER: SatLevel[] = ["E", "M", "H"];
