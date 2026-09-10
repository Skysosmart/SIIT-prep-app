/**
 * First-visit routing.
 *
 * "/" sends a brand-new visitor to the exam-booklet cover at /welcome, once.
 * The failure that matters is trapping someone there forever: if storage
 * cannot be read, the visit can never be remembered, so the redirect must be
 * skipped rather than repeated.
 */

import "./helpers/local-storage";   // must precede the module under test
import test from "node:test";
import assert from "node:assert/strict";
import { rawStore } from "./helpers/local-storage";
import { hasVisitedBefore, markVisited } from "../lib/firstVisit";

const withBrokenStorage = (body: () => void) => {
  const real = (globalThis as { localStorage?: unknown }).localStorage;
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem() { throw new Error("storage disabled"); },
    setItem() { throw new Error("storage disabled"); },
    removeItem() { throw new Error("storage disabled"); },
  };
  try { body(); } finally { (globalThis as { localStorage?: unknown }).localStorage = real; }
};

test("a brand-new visitor has not been here before", () => {
  rawStore.clear();
  assert.equal(hasVisitedBefore(), false);
});

test("seeing the cover is remembered, so it is shown only once", () => {
  rawStore.clear();
  markVisited();
  assert.equal(hasVisitedBefore(), true);
});

test("an existing profile counts as a previous visit", () => {
  rawStore.clear();
  // the flag was cleared, but this player clearly has been here
  rawStore.set("siit-math-arena-profile", JSON.stringify({ xp: 120 }));
  assert.equal(hasVisitedBefore(), true,
    "a returning player must not be bounced through the cover again");
});

test("unreadable storage returns null so the caller skips the redirect", () => {
  withBrokenStorage(() => {
    assert.equal(hasVisitedBefore(), null,
      "null, not false - false would redirect on every single visit");
  });
});

test("marking a visit never throws, even when storage refuses", () => {
  withBrokenStorage(() => { assert.doesNotThrow(() => markVisited()); });
});
