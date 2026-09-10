/**
 * Student-produced response (grid-in) entry and grading.
 *
 * Mirrors the real digital SAT rules:
 *  - answers fit in 5 characters, 6 if the answer is negative
 *  - fractions and decimals are both accepted, and equivalent forms are equal
 *    (1/2, .5, 0.5, 2/4 are all the same answer)
 *  - no mixed numbers, no percent or currency symbols, no commas
 *  - a value that does not fit must FILL the grid: truncated or rounded at the
 *    last digit that fits, so 2/3 is .6666 or .6667 - but never .66
 *
 * Everything is compared as an exact rational; no floating-point equality.
 */

export type Rational = { n: number; d: number };

/** Characters available to a positive answer. A negative answer gets one more. */
export const MAX_LEN = 5;

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

const reduce = ({ n, d }: Rational): Rational => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};

const eq = (a: Rational, b: Rational) => a.n * b.d === b.n * a.d;
const toNum = ({ n, d }: Rational) => n / d;

/**
 * Live validation while the student types. Returns a message when the entry is
 * already illegal, or null when it is legal (possibly still incomplete).
 */
export function gridInputError(raw: string): string | null {
  if (raw === "") return null;
  const neg = raw.startsWith("-");
  const budget = neg ? MAX_LEN + 1 : MAX_LEN;
  if (raw.length > budget)
    return `Answers fit in ${MAX_LEN} characters (${MAX_LEN + 1} with a minus sign).`;
  if (/[^0-9./-]/.test(raw))
    return "Use digits, one decimal point or one slash, and a leading minus sign only.";
  if (raw.lastIndexOf("-") > 0) return "A minus sign can only lead the answer.";

  const body = neg ? raw.slice(1) : raw;
  if ((body.match(/\./g) ?? []).length > 1) return "Only one decimal point.";
  if ((body.match(/\//g) ?? []).length > 1) return "Only one slash.";
  if (body.includes(".") && body.includes("/"))
    return "Enter a fraction or a decimal - mixed numbers are not accepted.";
  if (body.startsWith("/")) return "A fraction needs a numerator.";
  if (/\/0+$/.test(body)) return "A fraction cannot have a denominator of zero.";
  return null;
}

/** Parse a legal entry to an exact rational. Returns null for illegal or incomplete input. */
export function parseGrid(raw: string): Rational | null {
  if (gridInputError(raw)) return null;
  const s = raw.trim();
  if (s === "" || s === "-") return null;

  const neg = s.startsWith("-");
  const body = neg ? s.slice(1) : s;
  let r: Rational;

  if (body.includes("/")) {
    const [a, b] = body.split("/");
    if (a === "" || b === "") return null;               // still typing "5/"
    const n = Number(a), d = Number(b);
    if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) return null;
    r = { n, d };
  } else {
    const dot = body.indexOf(".");
    if (dot === -1) {
      const n = Number(body);
      if (!Number.isInteger(n)) return null;
      r = { n, d: 1 };
    } else {
      const frac = body.slice(dot + 1);
      const digits = body.slice(0, dot) + frac;
      if (digits === "") return null;                    // still typing "."
      const n = Number(digits);
      if (!Number.isInteger(n)) return null;
      r = { n, d: 10 ** frac.length };
    }
  }
  return reduce({ n: neg ? -r.n : r.n, d: r.d });
}

/**
 * How many decimal places fit for this value, once the sign, the point and the
 * integer digits are paid for. A leading zero may be dropped (".6666"), so an
 * integer part of 0 costs nothing.
 */
function decimalsThatFit(value: number): number {
  const whole = Math.floor(Math.abs(value));
  const wholeDigits = whole === 0 ? 0 : String(whole).length;
  return MAX_LEN - 1 - wholeDigits;   // the sign is paid for by the extra 6th character
}

/** The truncated and rounded forms the fill-the-grid rule accepts for a target. */
function fillForms(t: Rational): Rational[] {
  const k = decimalsThatFit(toNum(t));
  if (k < 0) return [];
  const p = 10 ** k;
  const v = toNum(t);
  const truncated = Math.trunc(v * p);
  const rounded = Math.round(Math.abs(v * p)) * Math.sign(v || 1);
  return [reduce({ n: truncated, d: p }), reduce({ n: rounded, d: p })];
}

/** Grade an entry against the authored accepted forms. */
export function gradeGrid(raw: string, accept: string[]): boolean {
  const got = parseGrid(raw);
  if (!got) return false;
  for (const a of accept) {
    const target = parseGrid(a);
    if (!target) continue;
    if (eq(got, target)) return true;
    if (fillForms(target).some((f) => eq(got, f))) return true;
  }
  return false;
}

/** Feedback copy: the forms a student could have entered. */
export function acceptedFormsHint(accept: string[]): string {
  const forms = new Set<string>();
  for (const a of accept) {
    forms.add(a);
    const target = parseGrid(a);
    if (!target) continue;
    const k = decimalsThatFit(toNum(target));
    if (k < 0) continue;
    // Only worth mentioning when the value does NOT terminate inside the grid -
    // for 5/2 there is nothing to say beyond "2.5", but 2/3 needs .6666/.6667.
    if (Number.isInteger(toNum(target) * 10 ** k)) continue;
    for (const f of fillForms(target)) {
      const s = (f.n / f.d).toFixed(k).replace(/^(-?)0\./, "$1.");
      if (s !== a) forms.add(s);
    }
  }
  return [...forms].join(", ");
}
