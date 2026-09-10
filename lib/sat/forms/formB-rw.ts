/**
 * Digital SAT practice - Form B, Reading and Writing.
 *
 * ALL items and ALL passages are ORIGINAL, written from scratch for this app.
 * No College Board material, no excerpted or adapted published text.
 */

import type { SatSectionForm } from "../types";
import { FORM_B_RW_M1 } from "./formB-rw-m1";
import { FORM_B_RW_LOWER } from "./formB-rw-lower";
import { FORM_B_RW_UPPER } from "./formB-rw-upper";

export const FORM_B_RW: SatSectionForm = {
  m1: FORM_B_RW_M1,
  lower: FORM_B_RW_LOWER,
  upper: FORM_B_RW_UPPER,
};
