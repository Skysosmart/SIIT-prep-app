/**
 * Shared authoring helpers for the Math banks.
 *
 * Extracted when Form B was added: the factories were previously inline in
 * formA-math.ts, and two copies would have been two places to fix a bug.
 */

import type { SatLevel, SatMcq, SatSpr } from "../types";

export type MathDomain = "alg" | "adv" | "psda" | "geo";

export const M = (
  id: number, domain: MathDomain, level: SatLevel, answer: 0 | 1 | 2 | 3,
  q: string, choices: [string, string, string, string],
  skill: string, explain: string, figure?: string,
): SatMcq => ({ id, section: "math", kind: "mcq", domain, level, answer, q, choices, skill, explain, figure });

export const S = (
  id: number, domain: MathDomain, level: SatLevel, accept: string[],
  q: string, skill: string, explain: string, figure?: string,
): SatSpr => ({ id, section: "math", kind: "spr", domain, level, accept, q, skill, explain, figure });

/** Pretest variants: shown to the student, excluded from the raw score and from routing. */
export const MP = (...a: Parameters<typeof M>): SatMcq => ({ ...M(...a), pretest: true });
export const SP = (...a: Parameters<typeof S>): SatSpr => ({ ...S(...a), pretest: true });
