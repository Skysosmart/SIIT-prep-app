/**
 * Multistage adaptive routing, grading, and the estimated 200-800 scale.
 *
 * The claim that matters for admission is at the bottom: the easier module 2
 * cannot reach SIIT's Math 620, so routing up is not optional.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { SAT_FORMS } from "../lib/sat/forms";
import { isCorrect, moduleTally, outcomeFor, routeAfterModule1, sectionItems } from "../lib/sat/grade";
import { rawMax, scaled, total } from "../lib/sat/score";
import { SIIT_CUTOFF } from "../lib/sat/spec";
import type { SatAnswer, SatQuestion, SatSectionId } from "../lib/sat/types";

const form = SAT_FORMS[0];

const answerAll = (items: SatQuestion[], right: boolean): Record<number, SatAnswer> =>
  Object.fromEntries(items.map((q) => [q.id,
    q.kind === "mcq"
      ? { kind: "mc", picked: right ? q.answer : ((q.answer + 1) % 4) } as SatAnswer
      : { kind: "spr", raw: right ? q.accept[0] : "999" } as SatAnswer]));

test("pretest items are shown but never scored", () => {
  const m1 = form.math.m1;
  assert.equal(m1.length, 22, "22 questions are presented");
  assert.equal(moduleTally(m1, answerAll(m1, true)).of, 20, "only 20 of them count");
  const pretestOnly = Object.fromEntries(
    m1.filter((q) => q.pretest).map((q) => [q.id,
      q.kind === "mcq" ? { kind: "mc", picked: q.answer } as SatAnswer
                       : { kind: "spr", raw: q.accept[0] } as SatAnswer]));
  assert.equal(moduleTally(m1, pretestOnly).raw, 0, "getting only the pretest items right scores nothing");
});

test("a blank paper scores zero without crashing", () => {
  assert.equal(moduleTally(form.math.m1, {}).raw, 0);
});

test("the grid-in rules apply through the real grading path", () => {
  const twoThirds = form.math.m1.find((q) => q.kind === "spr" && q.accept[0] === "7/6")!;
  assert.equal(isCorrect(twoThirds, { kind: "spr", raw: "7/6" }), true);
  assert.equal(isCorrect(twoThirds, { kind: "spr", raw: "1.166" }), true);
  assert.equal(isCorrect(twoThirds, { kind: "spr", raw: "1.16" }), false, "does not fill the grid");
});

test("module 1 routes in both directions, and pretest items do not sway it", () => {
  for (const section of ["rw", "math"] as SatSectionId[]) {
    const m1 = form[section].m1;
    assert.equal(routeAfterModule1(section, m1, answerAll(m1, true)), "upper");
    assert.equal(routeAfterModule1(section, m1, {}), "lower");
    const pretestOnly = Object.fromEntries(
      m1.filter((q) => q.pretest).map((q) => [q.id,
        q.kind === "mcq" ? { kind: "mc", picked: q.answer } as SatAnswer
                         : { kind: "spr", raw: q.accept[0] } as SatAnswer]));
    assert.equal(routeAfterModule1(section, m1, pretestOnly), "lower",
      "pretest items must be excluded from routing");
  }
});

test("the two sections route independently within one sitting", () => {
  const mixed = { ...answerAll(form.rw.m1, true), ...answerAll(form.math.m1, false) };
  assert.equal(routeAfterModule1("rw", form.rw.m1, mixed), "upper");
  assert.equal(routeAfterModule1("math", form.math.m1, mixed), "lower");
});

test("a section is 44 or 54 shown, 40 or 50 scored", () => {
  assert.equal(sectionItems(form, "math", "upper").length, 44);
  assert.equal(sectionItems(form, "rw", "upper").length, 54);
  assert.equal(rawMax("math"), 40);
  assert.equal(rawMax("rw"), 50);
});

test("a perfect section scales to 800 and a blank one to 200", () => {
  for (const section of ["rw", "math"] as SatSectionId[]) {
    const perfect = { ...answerAll(form[section].m1, true), ...answerAll(form[section].upper, true) };
    const best = outcomeFor(form, section, "upper", perfect);
    assert.equal(best.raw, rawMax(section));
    assert.equal(best.scaled, 800);
    assert.equal(outcomeFor(form, section, "lower", {}).scaled, 200);
  }
  assert.equal(total(800, 800), 1600);
  assert.equal(total(200, 200), 400);
});

test("every scoring curve is monotone and stays inside 200-800", () => {
  for (const section of ["rw", "math"] as SatSectionId[]) {
    for (const route of ["lower", "upper"] as const) {
      let previous = -1;
      for (let raw = 0; raw <= rawMax(section); raw++) {
        const v = scaled(section, route, raw);
        assert.ok(v >= previous, `${section}/${route} dips at raw ${raw}`);
        assert.ok(v >= 200 && v <= 800, `${section}/${route} leaves the scale at raw ${raw}`);
        previous = v;
      }
    }
  }
});

test("SIIT's Math 620 is unreachable on the easier module 2", () => {
  const ceiling = scaled("math", "lower", rawMax("math"));
  assert.ok(ceiling < SIIT_CUTOFF.math,
    `the lower route tops out at ${ceiling}, which must stay below ${SIIT_CUTOFF.math}`);
  const needed = [...Array(rawMax("math") + 1).keys()]
    .find((raw) => scaled("math", "upper", raw) >= SIIT_CUTOFF.math);
  assert.ok(needed !== undefined, "but it must be reachable on the harder route");
});

test("SIIT's R&W 400 sits near the floor and is reachable on either route", () => {
  for (const route of ["lower", "upper"] as const) {
    const needed = [...Array(rawMax("rw") + 1).keys()]
      .find((raw) => scaled("rw", route, raw) >= SIIT_CUTOFF.rw);
    assert.ok(needed !== undefined, `R&W ${SIIT_CUTOFF.rw} should be reachable on the ${route} route`);
  }
});
