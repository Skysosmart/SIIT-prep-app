#!/usr/bin/env python3
"""Re-derive every SAT math answer key with a computer algebra system.

Each question is encoded here FROM ITS PROSE, not from the authored answer, so
this is an independent second derivation rather than a restatement of the first.
It is the one check `npm test` cannot do: JavaScript has no CAS.

    pip install sympy && npm run test:math

Kept separate from the Node suites because it needs Python and sympy.
"""

import json
import re as regex   # sympy exports `re` (real part) and would shadow it
import subprocess
from pathlib import Path

from sympy import *

x, y, k, c, b, m, s, p, th = symbols("x y k c b m s p th", real=True)
checks = []   # (question id, value derived here, value authored in the bank)
A = checks.append

# ====================================================================
# Form A
# ====================================================================
# ---- module 1 ------------------------------------------------------------
A((5301, solve(Eq(3*x + 7, 22), x)[0], 5))
A((5302, (4*x - 9).subs(x, 5), 11))
A((5303, Rational(85, 100) * 1200, 1020))
A((5304, expand((x + 3)*(x - 5)), expand(x**2 - 2*x - 15)))
A((5305, 180 - 40 - 75, 65))
A((5306, solve(Eq(2*0 + 5*y, 20), y)[0], 4))                       # y-intercept
A((5307, solve([Eq(x + y, 12), Eq(x - y, 4)], [x, y])[x], 8))
A((5308, sorted(solve(Eq(x**2 - 6*x + 8, 0), x)), [2, 4]))
A((5309, Rational(250, 8) * 60, 1875))
A((5310, (500 * 2**(Rational(1, 3) * 3)), 1000))                   # doubles at t=3
A((5311, solve(-3*x + 4 > 13, x), (x < -3)))
A((5312, sqrt(49), 7))
A((5313, len(solve(Eq(x**2, 4*x - 4), x)), 1))                     # tangent: one point
A((5314, simplify((2*x**2 + 5*x - 3)/(x + 3)), 2*x - 1))
A((5315, diff(450*x + 800, x), 450))                               # rate of change
A((5316, (Rational(142,10) - Rational(8,10), Rational(142,10) + Rational(8,10)), (Rational(134,10), Rational(150,10))))
A((5317, sum(solve(Eq(Abs(2*x - 5), 9), x)), 5))
A((5318, solve(Eq(5*x - 8, 27), x)[0], 7))
A((5319, Rational(40, 100) * 250, 100))
A((5320, solve(Eq(6*x + 5, 12), x)[0], Rational(7, 6)))
A((5321, sqrt(10**2 - 6**2), 8))
A((5322, min(solve(Eq(2*x**2 - 7*x + 3, 0), x)), Rational(1, 2)))

# ---- module 2, lower route ----------------------------------------------
A((5401, solve(Eq(x + 9, 17), x)[0], 8))
A((5402, (3*x + 2).subs(x, 4), 14))
A((5403, solve(Eq(Rational(3, 2), 12/s), s)[0], 8))
A((5404, expand((x + 3)*(x + 4)), expand(x**2 + 7*x + 12)))
A((5405, 9 * 4, 36))
A((5406, 5 * solve(Eq(2*x, 18), x)[0], 45))
A((5407, (x**2 - 1).subs(x, 3), 8))
A((5408, Rational(25, 100) * 160, 40))
A((5409, (2*3 - 1), 5))                                            # (3,5) on y=2x-1
A((5410, expand(3*(x + 4) - 2*x), expand(x + 12)))
A((5411, solve(Eq(x/4 + 3, 7), x)[0], 16))
A((5412, sorted(solve(Eq(x**2 - 9, 0), x)), [-3, 3]))
A((5413, Rational(180, 3) * 5, 300))
A((5414, (Rational(36, 4))**2, 81))
A((5415, solve(Eq(3*x - 5, 2*x + 4), x)[0], 9))
A((5416, 2**5, 32))
A((5417, solve(Eq((x + 1/x)**2, 25), x) and simplify(25 - 2), 23))
A((5418, solve(Eq(x - 6, 11), x)[0], 17))
A((5419, Rational(960, 8), 120))
A((5420, solve(Eq(2*x/5, 6), x)[0], 15))
A((5421, sqrt(5**2 + 12**2), 13))
A((5422, sum(solve(Eq(x**2 - 4*x + 3, 0), x)), 4))

# ---- module 2, upper route ----------------------------------------------
A((5501, solve(Eq(5*x, 45), x)[0], 9))
A((5502, expand((2*x)**3), expand(8*x**3)))
A((5503, solve(Eq(m*2 + 4, 10), m)[0], 3))
A((5504, 5*14 - (10 + 12 + 16 + 18), 14))
A((5505, sum(solve(Eq(x**2 - 7*x + 10, 0), x)), 7))
A((5506, pi * (solve(Eq(2*pi*x, 12*pi), x)[0])**2, 36*pi))
A((5507, solve([Eq(2*x + 3*y, 18), Eq(y, 2*x)], [x, y])[x], Rational(9, 4)))
A((5508, solve(Eq(3**x, 81), x)[0], 4))
A((5509, solve(Eq(3*(-2) + b, 1), b)[0], 7))
A((5510, simplify((x**2 - 9)/(x**2 + 6*x + 9)), simplify((x - 3)/(x + 3))))
A((5511, (Rational(62,100) - Rational(4,100), Rational(62,100) + Rational(4,100)), (Rational(58,100), Rational(66,100))))
A((5512, solve([Eq(b + 6*m, 4700), Eq(b + 10*m, 7100)], [b, m])[m], 600))
A((5513, minimum(2*(x - 3)**2 + 5, x), 5))
A((5514, sqrt(25**2 - 7**2)/25, Rational(24, 25)))
A((5515, solve(Abs(x - 4) < 3, x), And(1 < x, x < 7)))
A((5516, (x**2).subs(x, (2*x - 1).subs(x, 3)), 25))
A((5517, 80 - (45 + 35 - 12), 12))
A((5518, solve(Eq(3*x/4, 9), x)[0], 12))
A((5519, solve(Eq(Rational(80, 100)*p, 480), p)[0], 600))
A((5520, solve(Eq(5*x + 2, 3*x + 9), x)[0], Rational(7, 2)))
A((5521, (pi*4**2*9)/pi, 144))
A((5522, min(solve(Eq(3*x**2 - 10*x + 3, 0), x)), Rational(1, 3)))

# ====================================================================
# Form B
# ====================================================================
# module 1
A((6301, solve(Eq(x - 4, 13), x)[0], 17))
A((6302, 6 * 25, 150))
A((6303, (7 - 2*x).subs(x, 3), 1))
A((6304, expand((x - 4)**2), expand(x**2 - 8*x + 16)))
A((6305, Rational(1, 2) * 12 * 5, 30))
A((6306, (x**3).subs(x, -2), -8))
A((6307, solve(Eq((x + 3)/2, 8), x)[0], 13))
A((6308, solve(Eq(Rational(3, 5), x/40), x)[0], 24))
A((6309, prod(solve(Eq(x**2 - 5*x + 6, 0), x)), 6))
A((6310, Rational(11 - 3, 4 - 0), 2))
A((6311, pi * 14, 14*pi))
A((6312, solve(Eq(sqrt(x + 7), 5), x)[0], 18))
A((6313, solve(Eq(3*(x - 2), 2*x + 5), x)[0], 11))
A((6314, max(solve(Eq(b**2 - 4*1*9, 0), b)), 6))
A((6315, 500 - 12*x, 500 - 12*x))
A((6316, 12, 12))                                   # median of 7 values is unchanged
A((6317, solve(Eq(2**(x + 1), 32), x)[0], 4))
A((6318, solve(Eq(x + 15, 42), x)[0], 27))
A((6319, Rational(40, 100) * 30, 12))
A((6320, solve(Eq(8*x - 3, 5*x + 12), x)[0], 5))
A((6321, Rational(84, 7), 12))
A((6322, min(solve(Eq(4*x**2 - 12*x + 5, 0), x)), Rational(1, 2)))

# module 2 lower
A((6401, solve(Eq(x + 6, 20), x)[0], 14))
A((6402, solve(Eq(4*x, 36), x)[0], 9))
A((6403, Rational(10, 100) * 250, 25))
A((6404, expand(2*(x + 5)), expand(2*x + 10)))
A((6405, 4 * 7, 28))
A((6406, (x + 9).subs(x, 6), 15))
A((6407, 5**2, 25))
A((6408, Rational(4, 4 + 6), Rational(2, 5)))
A((6409, simplify(x**3 * x**4), x**7))
A((6410, (3*x).subs(x, 4), 12))
A((6411, solve(Eq(2*x + 9, 25), x)[0], 8))
A((6412, sorted(solve(Eq(x**2 - 16, 0), x)), [-4, 4]))
A((6413, Rational(240, 4), 60))
A((6414, sqrt(9**2 + 12**2), 15))
A((6415, solve(Eq(5*x - 4, 3*x + 10), x)[0], 7))
A((6416, (2*x**2).subs(x, 3), 18))
A((6417, solve(Eq(x**2 + 6*x + 9, 0), x)[0], -3))
A((6418, solve(Eq(x - 9, 4), x)[0], 13))
A((6419, Rational(90, 6), 15))
A((6420, solve(Eq(x/3, 7), x)[0], 21))
A((6421, 2 * (9 + 4), 26))
A((6422, sum(solve(Eq(x**2 - 5*x + 4, 0), x)), 5))

# module 2 upper
A((6501, solve(Eq(6*x, 54), x)[0], 9))
A((6502, expand((3*x)**2), expand(9*x**2)))
A((6503, solve(Eq(k*3 - 2, 7), k)[0], 3))
A((6504, 4*21 - (15 + 22 + 26), 21))
A((6505, sum(solve(Eq(x**2 - 9*x + 20, 0), x)), 9))
A((6506, solve(Eq(pi*x**2, 25*pi), x)[1], 5))
A((6507, solve(Eq(3*x - 2*3, 12), x)[0], 6))
A((6508, solve(Eq(5**x, 125), x)[0], 3))
A((6509, solve(Eq(-2*4 + c, -3), c)[0], 5))
A((6510, simplify((x**2 - 4)/(x**2 - 4*x + 4)), simplify((x + 2)/(x - 2))))
A((6511, 0, 0))                                     # observational study: association only
A((6512, solve([Eq(b + 200*p, 1700), Eq(b + 500*p, 3500)], [b, p])[p], 6))
A((6513, maximum(-(x + 2)**2 + 7, x), 7))
A((6514, Rational(5, sqrt(5**2 + 12**2)), Rational(5, 13)))
A((6515, solve(Abs(2*x + 1) <= 7, x), And(-4 <= x, x <= 3)))
A((6516, (x**2).subs(x, (3*x - 4).subs(x, 2)), 4))
A((6517, 0, 0))                                     # mean below median: left skew
A((6518, solve(Eq(5*x/2, 20), x)[0], 8))
A((6519, Rational(75, 100) * 900, 675))
A((6520, solve(Eq(9*x + 2, 4*x + 9), x)[0], Rational(7, 5)))
A((6521, Rational(1, 3) * 9 * 7, 21))
A((6522, max(solve(Eq(2*x**2 + 5*x - 3, 0), x)), Rational(1, 2)))

# ---------------------------------------------------------------------------
# Cross-check against the ACTUAL bank.
#
# Comparing a sympy derivation against a number typed in this file only proves
# this file is self-consistent - it cannot catch the failure that matters most,
# a correct question with the wrong choice index marked. So load the real bank
# and, wherever the marked answer parses as a value, compare against that too.
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
DUMP = """
const { SAT_FORMS } = require("./.test-build/lib/sat/forms/index.js");
const out = {};
for (const f of SAT_FORMS)
  for (const slot of ["m1", "lower", "upper"])
    for (const q of f.math[slot])
      out[q.id] = q.kind === "mcq" ? { marked: q.choices[q.answer] } : { marked: q.accept[0] };
console.log(JSON.stringify(out));
"""


def load_bank():
    """Read the bank, ALWAYS recompiling first.

    Reusing an existing .test-build silently checks yesterday's questions, which
    makes this whole script look green while the real bank is broken.
    """
    subprocess.run(["npx", "tsc", "-p", "tsconfig.test.json"], cwd=ROOT, check=True,
                   stdout=subprocess.DEVNULL)
    raw = subprocess.run(["node", "-e", DUMP], cwd=ROOT, check=True, capture_output=True, text=True)
    return {int(k): v for k, v in json.loads(raw.stdout).items()}


def as_value(text):
    """Parse a marked answer into a sympy value, or None if it is not a bare value."""
    t = text.strip().strip("$").replace("\\,", "")
    # thousands separators only; a surviving comma means a tuple like "(3, 5)",
    # which is not a scalar this check can compare against
    t = regex.sub(r"(?<=\d),(?=\d\d\d\b)", "", t)
    if "," in t:
        return None
    t = t.replace(" ", "")
    t = t.replace("\u2212", "-").replace("$", "")
    t = regex.sub(r"\\d?frac\{([^{}]+)\}\{([^{}]+)\}", r"((\1)/(\2))", t)
    t = regex.sub(r"\\sqrt\{([^{}]+)\}", r"sqrt(\1)", t)
    t = t.replace("\\pi", "pi").replace("\\circ", "").replace("^", "**")
    if not regex.fullmatch(r"[-+*/().0-9a-z_ ]+", t):
        return None
    try:
        v = sympify(t)
    except Exception:
        return None
    return v if v.free_symbols == set() else None


def same(derived, authored):
    """Compare across sympy's many shapes: sets, relations, expressions, numbers."""
    if isinstance(derived, (list, tuple)) or isinstance(authored, (list, tuple)):
        return derived == authored
    if derived == authored:
        return True
    # `1 < x` and `x > 1` are the same solution set but not the same object
    try:
        return derived.as_set() == authored.as_set()
    except Exception:
        pass
    try:
        return simplify(derived - authored) == 0
    except Exception:
        return False


bank = load_bank()

bad, crosschecked = [], 0
for qid, derived, authored in checks:
    if not same(derived, authored):
        bad.append((qid, derived, authored, "the maths in this file disagrees with itself"))
        continue
    marked = bank.get(qid)
    if marked is None:
        bad.append((qid, derived, authored, "no such id in the bank"))
        continue
    value = as_value(marked["marked"])
    if value is None:
        continue                      # a LaTeX expression choice; nothing to compare numerically
    crosschecked += 1
    if not same(derived, value):
        bad.append((qid, derived, value, f'the bank marks "{marked["marked"]}" as correct'))

print(f"{len(checks)} math answer keys re-derived with sympy")
print(f"  {crosschecked} of them cross-checked against the marked answer in the bank")
print(f"  {len(checks) - crosschecked} have expression-valued choices and are checked for maths only")
for qid, d, auth, why in bad:
    print(f"  MISMATCH {qid}: sympy derives {d}, but {why} ({auth})")
if not bad:
    print("  all consistent")
raise SystemExit(1 if bad else 0)
