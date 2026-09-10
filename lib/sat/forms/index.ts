/**
 * The SAT form registry.
 *
 * `validateForms` runs at module scope, so it executes during `next build`'s
 * prerender: a form that breaks the blueprint FAILS THE BUILD rather than
 * shipping. This is the deliberate substitute for a test suite in a repo that
 * has neither tests nor a linter.
 */

import type { SatForm } from "../types";
import { validateForms } from "../validate";
import { FORM_A_RW } from "./formA-rw";
import { FORM_A_MATH } from "./formA-math";
import { FORM_B_RW } from "./formB-rw";
import { FORM_B_MATH } from "./formB-math";

const FORM_A: SatForm = {
  id: "A",
  name: "Form A",
  blurb: "Built to the September blueprint.",
  rw: FORM_A_RW,
  math: FORM_A_MATH,
};

const FORM_B: SatForm = {
  id: "B",
  name: "Form B",
  blurb: "A second full-length paper, same blueprint.",
  rw: FORM_B_RW,
  math: FORM_B_MATH,
};

export const SAT_FORMS: SatForm[] = validateForms([FORM_A, FORM_B]);

export const formById = (id: string) => SAT_FORMS.find((f) => f.id === id) ?? SAT_FORMS[0];

/** Every authored item, for the result page's review lookup. */
export const SAT_BY_ID = new Map(
  SAT_FORMS.flatMap((f) =>
    (["rw", "math"] as const).flatMap((s) =>
      (["m1", "lower", "upper"] as const).flatMap((slot) => f[s][slot].map((q) => [q.id, q] as const)),
    ),
  ),
);
