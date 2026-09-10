/**
 * In-progress autosave. A full sitting is 144 minutes of wall clock, so losing
 * it to a refresh is the worst non-scoring failure this feature can have.
 */

import "./helpers/local-storage";   // must precede the module under test
import test from "node:test";
import assert from "node:assert/strict";
import { rawStore } from "./helpers/local-storage";
import {
  clearSavedRun, describeRun, readSavedRun, resumeHref, writeSavedRun, type SavedRun,
} from "../lib/sat/progress";

const run = (over: Partial<SavedRun> = {}): SavedRun => ({
  v: 1, formId: "A", mode: "full", startSection: "rw", stage: "run", legIdx: 2, cur: 7,
  endAt: Date.now() + 600_000, startedAt: Date.now() - 900_000, savedAt: Date.now(),
  routes: { rw: "upper" },
  answers: { 5001: { kind: "mc", picked: 2 } },
  flags: { 5002: true },
  ...over,
});

test("a saved run survives the round trip intact", () => {
  rawStore.clear();
  assert.equal(readSavedRun(), null, "nothing saved yet");
  writeSavedRun(run());
  const back = readSavedRun();
  assert.ok(back);
  assert.equal(back.legIdx, 2);
  assert.equal(back.cur, 7);
  assert.equal(back.stage, "run");
  assert.equal(back.routes.rw, "upper", "the decided route must survive, or module 2 changes");
  assert.deepEqual(back.answers[5001], { kind: "mc", picked: 2 });
  assert.equal(back.flags[5002], true);
});

test("clearSavedRun removes it", () => {
  rawStore.clear();
  writeSavedRun(run());
  clearSavedRun();
  assert.equal(readSavedRun(), null);
});

test("a run older than six hours is discarded, and deleted rather than left to rot", () => {
  rawStore.clear();
  writeSavedRun(run({ savedAt: Date.now() - 7 * 60 * 60 * 1000 }));
  assert.equal(readSavedRun(), null);
  assert.equal(rawStore.size, 0);
});

test("an unknown schema version is discarded", () => {
  rawStore.clear();
  writeSavedRun(run({ v: 99 as 1 }));
  assert.equal(readSavedRun(), null);
});

test("corrupt data returns null instead of throwing", () => {
  rawStore.clear();
  rawStore.set("siit-sat-progress", "{not json");
  assert.equal(readSavedRun(), null);
});

test("resume links carry exactly the parameters the runner needs", () => {
  assert.equal(resumeHref(run()), "/sat/test?form=A&mode=full",
    "a full test has no single section to name");
  assert.equal(resumeHref(run({ mode: "section", startSection: "math" })),
    "/sat/test?form=A&mode=section&section=math");
  assert.equal(describeRun(run()), "Form A · full test");
});
