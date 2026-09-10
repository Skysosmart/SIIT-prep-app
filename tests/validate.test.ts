/**
 * The blueprint gate.
 *
 * This repo has no linter and, before these tests, no test framework - so
 * validateForm is imported from next.config.ts and a violation fails the BUILD.
 * These tests check the gate still has teeth: each case must throw.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { SAT_FORMS } from "../lib/sat/forms";
import { availableModes, validateForms } from "../lib/sat/validate";
import type { SatForm, SatMcq, SatSpr } from "../lib/sat/types";

const clone = (): SatForm => structuredClone(SAT_FORMS[0]);
const rejects = (mutate: (f: SatForm) => void, why: string) => {
  const f = clone();
  mutate(f);
  assert.throws(() => validateForms([f]), /SAT form/, `should have been rejected: ${why}`);
};

test("the authored forms pass validation", () => {
  assert.doesNotThrow(() => validateForms(structuredClone(SAT_FORMS)));
});

test("module size and pretest count are enforced", () => {
  rejects((f) => { f.math.m1.pop(); }, "a module one item short");
  rejects((f) => { f.math.m1[0].pretest = true; }, "a third pretest item");
});

test("ids must be unique and inside the form's range", () => {
  rejects((f) => { f.math.m1[3].id = f.math.m1[0].id; }, "a duplicate id");
  rejects((f) => { f.math.m1[0].id = 7777; }, "an id outside the Form A range");
});

test("the domain quota matches the published question distribution", () => {
  rejects((f) => { f.math.m1[0].domain = "geo"; }, "a broken domain quota");
});

test("question order is enforced, because the runner never sorts", () => {
  rejects((f) => { const a = f.math.m1[0]; f.math.m1[0] = f.math.m1[16]; f.math.m1[16] = a; },
    "difficulty going backwards");
  rejects((f) => { const spr = f.math.m1.pop()!; f.math.m1.unshift(spr); },
    "a grid-in before the multiple-choice items");
  rejects((f) => { const block = f.rw.m1.splice(0, 8); f.rw.m1.push(...block); },
    "R&W domain blocks out of the mandated order");
});

test("difficulty mix must match the slot", () => {
  rejects((f) => { f.math.m1.forEach((i) => { i.level = "H"; }); }, "an all-hard module 1");
});

test("an item's own content is checked", () => {
  rejects((f) => { (f.math.m1[21] as SatSpr).accept = ["50%"]; },
    "a grid-in whose own answer is not enterable on the grid");
  rejects((f) => { const q = f.math.m1[0] as SatMcq; q.choices[1] = q.choices[0]; },
    "duplicate answer choices");
  rejects((f) => { f.math.m1[0].figure = "<div>nope</div>"; }, "a figure that is not svg or table");
  rejects((f) => { f.math.m1[0].figure = "<svg><circle r='2'</svg>"; },
    "a figure with unbalanced angle brackets");
  rejects((f) => { f.rw.m1[0].passage = "far too short"; }, "an R&W passage under 25 words");
  rejects((f) => { delete f.rw.m1[0].passage; }, "an R&W item with no passage at all");
});

test("availableModes only offers what has actually been authored", () => {
  for (const f of SAT_FORMS) {
    const m = availableModes(f);
    assert.equal(m.full, true, `${f.name} should offer the full test`);
    assert.equal(m.section.rw && m.section.math, true);
  }
  const half = clone();
  half.rw.upper = [];
  assert.equal(availableModes(half).full, false, "a half-built section cannot be sat as a full test");
  assert.equal(availableModes(half).module.rw, true, "but its module 1 still can");
});
