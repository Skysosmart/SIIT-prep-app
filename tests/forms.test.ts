/**
 * Content integrity across both papers.
 *
 * All 294 items are original, hand-authored TypeScript. These checks guard the
 * properties that are easy to break while editing content and invisible until
 * a student hits them.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { SAT_BY_ID, SAT_FORMS, formById } from "../lib/sat/forms";
import { SAT_SPEC } from "../lib/sat/spec";
import type { SatForm, SatQuestion } from "../lib/sat/types";

const itemsOf = (f: SatForm): SatQuestion[] =>
  (["rw", "math"] as const).flatMap((s) => (["m1", "lower", "upper"] as const).flatMap((k) => f[s][k]));

const everything = SAT_FORMS.flatMap(itemsOf);

test("two papers, 147 items each, 294 in total", () => {
  assert.equal(SAT_FORMS.length, 2);
  assert.deepEqual(SAT_FORMS.map((f) => f.id), ["A", "B"]);
  for (const f of SAT_FORMS) assert.equal(itemsOf(f).length, 147, `${f.name}`);
  assert.equal(everything.length, 294);
});

test("a student sees 98 questions in one sitting", () => {
  for (const f of SAT_FORMS) {
    const shown = f.rw.m1.length + f.rw.upper.length + f.math.m1.length + f.math.upper.length;
    assert.equal(shown, 98, `${f.name}`);
  }
});

test("every id is unique across both papers and reachable for review", () => {
  assert.equal(new Set(everything.map((q) => q.id)).size, 294, "duplicate ids break the review lookup");
  assert.equal(SAT_BY_ID.size, 294);
  for (const q of everything) assert.equal(SAT_BY_ID.get(q.id), q);
});

test("the two papers share no content, so a second sitting is a fresh test", () => {
  const [a, b] = SAT_FORMS.map(itemsOf);
  const idsA = new Set(a.map((q) => q.id));
  assert.ok(b.every((q) => !idsA.has(q.id)), "shared ids");

  const passagesA = new Set(a.filter((q) => q.passage).map((q) => q.passage));
  assert.ok(b.filter((q) => q.passage).every((q) => !passagesA.has(q.passage)), "shared passages");

  const mathA = new Set(a.filter((q) => q.section === "math").map((q) => q.q));
  assert.ok(b.filter((q) => q.section === "math").every((q) => !mathA.has(q.q)), "shared math questions");

  // R&W stems ARE meant to repeat: the real test uses one fixed prompt per
  // question type. Anything else repeating would be reused content.
  const stemsA = new Set(a.map((q) => q.q));
  const shared = [...new Set(b.map((q) => q.q).filter((s) => stemsA.has(s)))];
  for (const stem of shared) {
    assert.match(stem, /^(Which choice|According to the text)/,
      `"${stem.slice(0, 60)}" repeats across forms but is not a standard prompt`);
  }
});

test("every Reading and Writing item carries its own original passage", () => {
  for (const f of SAT_FORMS) {
    for (const slot of ["m1", "lower", "upper"] as const) {
      const module = f.rw[slot];
      assert.equal(module.length, SAT_SPEC.rw.perModule, `${f.name} rw.${slot} size`);
      assert.ok(module.every((q) => q.kind === "mcq"), "R&W has no grid-ins");
      const passages = module.map((q) => q.passage);
      assert.ok(passages.every(Boolean), `${f.name} rw.${slot}: an item has no passage`);
      assert.equal(new Set(passages).size, module.length,
        `${f.name} rw.${slot}: passages must be one per question, not shared`);
      for (const p of passages) {
        const words = p!.trim().split(/\s+/).length;
        assert.ok(words >= 25 && words <= 150, `a passage is ${words} words`);
      }
    }
  }
});

test("math modules are sized right and roughly a quarter grid-in", () => {
  for (const f of SAT_FORMS) {
    for (const slot of ["m1", "lower", "upper"] as const) {
      const module = f.math[slot];
      assert.equal(module.length, SAT_SPEC.math.perModule, `${f.name} math.${slot} size`);
      const spr = module.filter((q) => q.kind === "spr").length;
      assert.ok(spr >= 4 && spr <= 7, `${f.name} math.${slot}: ${spr} grid-ins`);
      assert.ok(module.slice(-spr).every((q) => q.kind === "spr"),
        "grid-ins come last, as on the real test");
    }
  }
});

test("figures are theme-safe, so they work in light and dark mode", () => {
  const figured = everything.filter((q) => q.figure);
  assert.ok(figured.length >= 8, `only ${figured.length} figures authored`);
  for (const q of figured) {
    const f = q.figure!;
    assert.ok(f.startsWith("<svg") || f.startsWith("<table"), `item ${q.id}: unexpected markup`);
    assert.equal((f.match(/</g) ?? []).length, (f.match(/>/g) ?? []).length, `item ${q.id}: unbalanced`);
    if (f.startsWith("<svg")) {
      assert.match(f, /currentColor/, `item ${q.id}: an SVG must draw in currentColor`);
      // strip numeric entities first - &#176; (the degree sign) is not a colour
      const withoutEntities = f.replace(/&#\d+;/g, "");
      assert.doesNotMatch(withoutEntities, /#[0-9a-fA-F]{3,8}\b/,
        `item ${q.id}: a hardcoded colour would not invert in dark mode`);
    }
  }
});

test("formById resolves both papers and falls back safely", () => {
  assert.equal(formById("A").id, "A");
  assert.equal(formById("B").id, "B");
  assert.equal(formById("nonsense").id, "A", "an unknown form must not crash the runner");
});
