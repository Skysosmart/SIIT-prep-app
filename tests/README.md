# Tests

Covers the SAT feature (`lib/sat/`). The rest of the app has no tests; these
exist because 294 hand-authored questions and a scoring model are easy to break
silently while editing content.

```bash
npm test          # the suites below
npm run typecheck # types only, fastest signal
npm run build     # also runs validateForm on every form (see below)
npm run test:math # optional, needs Python + sympy
```

## What runs where

| Gate | Catches |
|---|---|
| `npm run build` | A form that breaks the blueprint. `next.config.ts` imports `lib/sat/forms`, whose `validateForms` throws - so a bad module size, domain quota, question order, difficulty mix or malformed figure **fails the build**. |
| `npm test` | Everything the build cannot check: grader rules, routing, scoring curves, content integrity, autosave. |
| `npm run test:math` | Whether the math is right *and* whether the right choice is marked. |

## The suites

- **`grid.test.ts`** - student-produced response entry and grading. The fill-the-grid
  rule is the subtlest logic here: `2/3` must be entered as `.6666` or `.6667`, and
  `.66` is wrong.
- **`validate.test.ts`** - the build gate itself. Each case mutates a real form and
  asserts that validation rejects it. If these pass, the build gate has teeth.
- **`adaptive.test.ts`** - routing in both directions and independently per section,
  pretest exclusion, and the scoring curves. Includes the claim that matters for
  admission: SIIT's Math 620 is unreachable on the easier module 2.
- **`forms.test.ts`** - content integrity. 294 unique ids, one original passage per
  R&W item, no content shared between the two papers, theme-safe figures.
- **`progress.test.ts`** - autosave round-trip, six-hour expiry, corrupt data.
- **`verify-math.py`** - re-derives all 132 math answers with sympy, encoding each
  question from its prose rather than from the authored key, then compares the result
  against **the answer actually marked correct in the bank**. 99 of the 132 have a
  numeric marked answer and are cross-checked that way, so a correct question with the
  wrong choice index is caught; the other 33 have expression-valued choices
  (`$x^2 - 8x + 16$`, `$(3, 5)$`) that cannot be compared numerically, and for those
  only the mathematics is verified. Separate from `npm test` because JavaScript has no
  computer algebra system.

## Why it is built this way

No test framework is installed. The runner is Node's built-in `node:test`, and the
TypeScript compiler is already a devDependency. `npm test` compiles `lib/sat` and
`tests` to `.test-build` (gitignored) and runs the result - Node cannot resolve the
extensionless relative imports the source uses, so compiling is simpler than
reworking every import.
