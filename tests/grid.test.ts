/**
 * Student-produced response (grid-in) entry and grading.
 *
 * These rules are the subtlest logic in the SAT feature and the easiest to
 * regress, because "close enough" is wrong on the real test: 2/3 must be
 * entered as .6666 or .6667, and .66 is marked incorrect.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { acceptedFormsHint, gradeGrid, gridInputError, parseGrid } from "../lib/sat/grid";

test("equivalent forms of the same value are all accepted", () => {
  for (const entry of ["2.5", "5/2", "10/4", "2.50"]) {
    assert.equal(gradeGrid(entry, ["5/2"]), true, `${entry} should equal 5/2`);
  }
  for (const entry of ["1/2", ".5", "0.5", "2/4", "5/10"]) {
    assert.equal(gradeGrid(entry, ["1/2"]), true, `${entry} should equal 1/2`);
  }
});

test("illegal entries are refused as they are typed", () => {
  const cases: [string, string][] = [
    ["50%", "percent sign"],
    ["$4", "currency"],
    ["1,000", "comma"],
    ["1 1/2", "mixed number"],
    ["1.5/2", "decimal point and slash together"],
    ["123456", "six characters for a positive answer"],
    ["-123456", "seven characters with a sign"],
    ["2..5", "two decimal points"],
    ["1/2/3", "two slashes"],
    ["4-", "sign after the first character"],
    ["1/0", "zero denominator"],
  ];
  for (const [entry, why] of cases) {
    assert.notEqual(gridInputError(entry), null, `${entry} should be refused: ${why}`);
  }
});

test("the grid budget is 5 characters, or 6 when the answer is negative", () => {
  assert.equal(gridInputError("12345"), null);
  assert.equal(gridInputError("-12345"), null, "a sign buys a sixth character");
  assert.notEqual(gridInputError("123456"), null);
  assert.equal(gradeGrid("-4", ["-4"]), true);
});

test("a value that does not fit must FILL the grid, truncated or rounded", () => {
  // 2/3 = .6666... -> four decimals fit, and truncating and rounding differ
  assert.equal(gradeGrid(".6666", ["2/3"]), true, "truncated");
  assert.equal(gradeGrid(".6667", ["2/3"]), true, "rounded");
  assert.equal(gradeGrid("2/3", ["2/3"]), true, "the fraction itself");
  assert.equal(gradeGrid(".66", ["2/3"]), false, "too short - does not fill the grid");
  assert.equal(gradeGrid(".667", ["2/3"]), false, "still does not fill the grid");

  // 4/3 = 1.333... -> the integer digit costs one, so only three decimals fit,
  // and rounding does NOT change the last digit here
  assert.equal(gradeGrid("1.333", ["4/3"]), true);
  assert.equal(gradeGrid("1.334", ["4/3"]), false, "1.3333 rounds to 1.333, not 1.334");
  assert.equal(gradeGrid("1.33", ["4/3"]), false);

  // the sign is paid for by the sixth character, so the decimals still fit
  assert.equal(gradeGrid("-.6666", ["-2/3"]), true);
  assert.equal(gradeGrid("-.6667", ["-2/3"]), true);
});

test("a value that terminates inside the grid is accepted only exactly", () => {
  assert.equal(gradeGrid(".125", ["1/8"]), true);
  assert.equal(gradeGrid(".12", ["1/8"]), false);
  assert.equal(gradeGrid("0", ["0"]), true);
  assert.equal(gradeGrid("12", ["12"]), true);
});

test("an item may accept several distinct values", () => {
  assert.equal(gradeGrid("7", ["7", "8", "9"]), true);
  assert.equal(gradeGrid("9", ["7", "8", "9"]), true);
  assert.equal(gradeGrid("10", ["7", "8", "9"]), false);
});

test("incomplete input parses to null rather than throwing", () => {
  for (const entry of ["", "-", ".", "5/"]) {
    assert.equal(parseGrid(entry), null, `"${entry}" is not yet a value`);
  }
});

test("the feedback hint lists the fill-the-grid forms, and only when they are needed", () => {
  assert.equal(acceptedFormsHint(["2/3"]), "2/3, .6666, .6667");
  assert.equal(acceptedFormsHint(["4/3"]), "4/3, 1.333");
  assert.equal(acceptedFormsHint(["5/2"]), "5/2", "2.5 terminates, so there is nothing to add");
});
