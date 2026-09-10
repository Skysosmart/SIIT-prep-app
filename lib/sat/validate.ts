/**
 * Build-time gate for SAT forms.
 *
 * This repo has no test framework and no linter - `next build` is the only
 * gate. `validateForm` is imported at module scope by lib/sat/forms/index.ts,
 * so it runs during the prerender and a malformed form FAILS THE BUILD rather
 * than shipping a test that quietly breaks the blueprint.
 */

import type { SatForm, SatQuestion, SatSectionId, SatSlot } from "./types";
import { SLOTS } from "./types";
import {
  LEVEL_MIX, LEVEL_RANK, MODULE_QUOTA, PRETEST_PER_MODULE,
  RW_DOMAIN_ORDER, SAT_SPEC, SPR_PER_MODULE,
} from "./spec";
import { gridInputError, parseGrid } from "./grid";

const ID_RANGE: Record<"A" | "B", [number, number]> = { A: [5001, 5999], B: [6001, 6999] };

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function validateForm(form: SatForm, seen: Set<number> = new Set()): void {
  const fail: (where: string, msg: string) => never = (where, msg) => {
    throw new Error(`SAT form ${form.id} / ${where}: ${msg}`);
  };

  for (const section of ["rw", "math"] as SatSectionId[]) {
    const spec = SAT_SPEC[section];
    for (const slot of SLOTS) {
      const items = form[section][slot];
      const at = `${section}.${slot}`;

      // A slot that is empty has not been authored yet. Skip it rather than
      // failing the build - `availableModes` below is what stops a half-built
      // form being offered as a full test.
      if (items.length === 0) continue;

      // 1. module size
      if (items.length !== spec.perModule)
        fail(at, `expected ${spec.perModule} items, found ${items.length}`);

      // 2. pretest count
      const pretests = items.filter((i) => i.pretest).length;
      if (pretests !== PRETEST_PER_MODULE)
        fail(at, `expected ${PRETEST_PER_MODULE} pretest items, found ${pretests}`);

      items.forEach((it, idx) => {
        const where = `${at}[${idx}] id ${it.id}`;

        // 3. ids: unique across every form, inside this form's range
        if (seen.has(it.id)) fail(where, "duplicate id");
        seen.add(it.id);
        const [lo, hi] = ID_RANGE[form.id];
        if (it.id < lo || it.id > hi) fail(where, `id outside form ${form.id} range ${lo}-${hi}`);
        if (it.section !== section) fail(where, `section is "${it.section}", expected "${section}"`);

        // 9. R&W passages
        if (section === "rw") {
          if (!it.passage) fail(where, "R&W item has no passage");
          const w = words(it.passage);
          if (w < 25 || w > 150) fail(where, `passage is ${w} words, expected 25-150`);
        }

        // 10. figures - dangerouslySetInnerHTML fails silently, so shape-check here
        if (it.figure !== undefined) {
          const f = it.figure.trim();
          if (!f.startsWith("<svg") && !f.startsWith("<table"))
            fail(where, "figure must start with <svg or <table");
          if ((f.match(/</g) ?? []).length !== (f.match(/>/g) ?? []).length)
            fail(where, "figure has unbalanced angle brackets");
        }

        // 11. an SPR item's own canonical answer must be enterable on the grid
        if (it.kind === "spr") {
          if (it.accept.length === 0) fail(where, "spr item accepts nothing");
          it.accept.forEach((a) => {
            const err = gridInputError(a);
            if (err) fail(where, `accepted form "${a}" is not grid-legal: ${err}`);
            if (!parseGrid(a)) fail(where, `accepted form "${a}" does not parse`);
          });
        }

        // 12. four distinct choices
        if (it.kind === "mcq") {
          if (it.choices.length !== 4) fail(where, "multiple-choice item needs exactly 4 choices");
          if (new Set(it.choices).size !== 4) fail(where, "multiple-choice item has duplicate choices");
        }
      });

      // 4. domain quotas
      for (const quota of MODULE_QUOTA[section]) {
        const n = items.filter((i) => i.domain === quota.domain).length;
        if (n !== quota.count)
          fail(at, `domain "${quota.domain}" has ${n} items, blueprint wants ${quota.count}`);
      }

      // 5 / 6. ordering
      if (section === "rw") {
        const blocks = items.map((i) => i.domain);
        const order = RW_DOMAIN_ORDER.filter((d) => blocks.includes(d));
        let cursor = 0;
        blocks.forEach((d, idx) => {
          const pos = order.indexOf(d);
          if (pos < cursor) fail(at, `item ${idx} (${d}) breaks the domain block order ${order.join(" -> ")}`);
          cursor = pos;
        });
        // easiest-first inside each block
        for (const d of order) {
          const run = items.filter((i) => i.domain === d);
          run.forEach((it, i) => {
            if (i > 0 && LEVEL_RANK[it.level] < LEVEL_RANK[run[i - 1].level])
              fail(at, `domain "${d}" difficulty goes backwards at id ${it.id}`);
          });
        }
      } else {
        // real digital SAT: every multiple-choice item, then the grid-ins
        const firstSpr = items.findIndex((i) => i.kind === "spr");
        if (firstSpr !== -1 && items.slice(firstSpr).some((i) => i.kind === "mcq"))
          fail(at, "grid-in items must all come after the multiple-choice items");
        const runs = [items.filter((i) => i.kind === "mcq"), items.filter((i) => i.kind === "spr")];
        for (const run of runs) {
          run.forEach((it, i) => {
            if (i > 0 && LEVEL_RANK[it.level] < LEVEL_RANK[run[i - 1].level])
              fail(at, `difficulty goes backwards at id ${it.id}`);
          });
        }
        // 7. grid-in share
        const spr = items.filter((i) => i.kind === "spr").length;
        const [sLo, sHi] = SPR_PER_MODULE;
        if (spr < sLo || spr > sHi)
          fail(at, `${spr} grid-in items, expected ${sLo}-${sHi}`);
      }

      // 8. difficulty mix per slot, +/-2 items
      const mix = LEVEL_MIX[slot as SatSlot];
      (["E", "M", "H"] as const).forEach((lv) => {
        const want = mix[lv] * items.length;
        const got = items.filter((i) => i.level === lv).length;
        if (Math.abs(got - want) > 2)
          fail(at, `${got} "${lv}" items, blueprint wants about ${want.toFixed(1)} (+/-2)`);
      });
    }
  }
}

/** Validate every form together, so ids are checked for collisions across forms. */
export function validateForms(forms: SatForm[]): SatForm[] {
  const seen = new Set<number>();
  for (const f of forms) validateForm(f, seen);
  return forms;
}

/** Items in authored order. NEVER sorts, NEVER shuffles choices - both are load-bearing. */
export const moduleItems = (form: SatForm, section: SatSectionId, slot: SatSlot): SatQuestion[] =>
  form[section][slot];

/** What a form can actually be sat as, given which modules have been authored. */
export function availableModes(form: SatForm) {
  const done = (section: SatSectionId, slot: SatSlot) => form[section][slot].length > 0;
  const sectionReady = (section: SatSectionId) =>
    done(section, "m1") && done(section, "lower") && done(section, "upper");
  return {
    full: sectionReady("rw") && sectionReady("math"),
    section: { rw: sectionReady("rw"), math: sectionReady("math") },
    module: { rw: done("rw", "m1"), math: done("math", "m1") },
  };
}
