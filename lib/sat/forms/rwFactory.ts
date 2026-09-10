/**
 * Shared authoring helpers for the Reading and Writing banks.
 *
 * R&W is entirely multiple choice - there are no grid-ins outside Math - and
 * every item carries its OWN passage, unlike the OSP English bank in
 * lib/english.ts where five questions share one long passage.
 */

import type { SatLevel, SatMcq } from "../types";

export type RwDomain = "craft" | "info" | "conv" | "expr";

export const R = (
  id: number, domain: RwDomain, level: SatLevel, answer: 0 | 1 | 2 | 3,
  passage: string, q: string, choices: [string, string, string, string],
  skill: string, explain: string, figure?: string,
): SatMcq => ({
  id, section: "rw", kind: "mcq", domain, level, answer, passage, q, choices, skill, explain, figure,
});

/** Pretest variant: shown to the student, excluded from the raw score and from routing. */
export const RP = (...a: Parameters<typeof R>): SatMcq => ({ ...R(...a), pretest: true });
