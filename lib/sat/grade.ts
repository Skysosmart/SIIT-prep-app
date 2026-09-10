/**
 * Grading a SAT sitting: answer checking, routing input, and section outcomes.
 *
 * Kept out of the runner component so the rules are testable and so the
 * pretest/operational distinction lives in exactly one place. Pretest items
 * are shown to the student but excluded from BOTH the raw score and routing,
 * exactly as on the real test.
 */

import type {
  Route, SatAnswer, SatForm, SatQuestion, SatSectionId, SatSectionOutcome,
} from "./types";
import { SAT_SPEC, routeFor } from "./spec";
import { gradeGrid } from "./grid";
import { scaled } from "./score";

export function isCorrect(q: SatQuestion, a: SatAnswer | undefined): boolean {
  if (!a) return false;
  if (q.kind === "mcq") return a.kind === "mc" && a.picked === q.answer;
  return a.kind === "spr" && gradeGrid(a.raw, q.accept);
}

export const isBlank = (a: SatAnswer | undefined): boolean =>
  !a || (a.kind === "mc" ? a.picked < 0 : a.raw.trim() === "");

/** The module-1 result decides which module 2 the student sees. */
export function routeAfterModule1(
  section: SatSectionId,
  m1: SatQuestion[],
  answers: Record<number, SatAnswer>,
): Route {
  return routeFor(
    section,
    m1,
    m1.map((q) => isCorrect(q, answers[q.id])),
    m1.map((q) => q.pretest === true),
  );
}

/** Both modules of a section, in order, once the route is known. */
export const sectionItems = (form: SatForm, section: SatSectionId, route: Route): SatQuestion[] =>
  [...form[section].m1, ...form[section][route]];

export function outcomeFor(
  form: SatForm,
  section: SatSectionId,
  route: Route,
  answers: Record<number, SatAnswer>,
): SatSectionOutcome {
  const m1 = form[section].m1;
  const all = sectionItems(form, section, route);
  const operational = all.filter((q) => !q.pretest);
  const raw = operational.filter((q) => isCorrect(q, answers[q.id])).length;

  const byDomain = [...new Set(operational.map((q) => q.domain))].map((domain) => {
    const items = operational.filter((q) => q.domain === domain);
    return { domain, correct: items.filter((q) => isCorrect(q, answers[q.id])).length, total: items.length };
  });

  const m1Operational = m1.filter((q) => !q.pretest);
  return {
    route,
    raw,
    of: SAT_SPEC[section].operational * 2,
    scaled: scaled(section, route, raw),
    m1Raw: m1Operational.filter((q) => isCorrect(q, answers[q.id])).length,
    m1Of: m1Operational.length,
    byDomain,
  };
}

/**
 * A single module sat on its own. There is no second module to route to, so
 * the score is reported over that module only and is NOT scaled - a scaled
 * score from half a section would be misleading.
 */
export function moduleTally(items: SatQuestion[], answers: Record<number, SatAnswer>) {
  const operational = items.filter((q) => !q.pretest);
  return {
    raw: operational.filter((q) => isCorrect(q, answers[q.id])).length,
    of: operational.length,
    byDomain: [...new Set(operational.map((q) => q.domain))].map((domain) => {
      const group = operational.filter((q) => q.domain === domain);
      return { domain, correct: group.filter((q) => isCorrect(q, answers[q.id])).length, total: group.length };
    }),
  };
}
