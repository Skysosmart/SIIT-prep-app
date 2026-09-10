/**
 * Digital SAT practice - Form A, Reading and Writing.
 *
 * Split one file per module: 27 items with their own passages runs to roughly
 * 400 lines each, and a single 1,200-line file is unpleasant to edit.
 *
 * ALL items and ALL passages are ORIGINAL, written from scratch for this app.
 * No College Board material, no excerpted or adapted published text.
 */

import type { SatSectionForm } from "../types";
import { FORM_A_RW_M1 } from "./formA-rw-m1";
import { FORM_A_RW_LOWER } from "./formA-rw-lower";
import { FORM_A_RW_UPPER } from "./formA-rw-upper";

export const FORM_A_RW: SatSectionForm = {
  m1: FORM_A_RW_M1,
  lower: FORM_A_RW_LOWER,
  upper: FORM_A_RW_UPPER,
};
