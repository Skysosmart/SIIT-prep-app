import { PHYSICS_FORMULAS } from "./physicsFormulas";

export type Formula = {
  cat: string;
  name: string;
  tex: string;          // display-mode LaTeX
  use: string;          // when to use
  example: string;      // short worked example ($..$ allowed)
  diff: "easy" | "med" | "hard";
  subject?: "math" | "phys"; // defaults to math
};

export const MATH_CATS = [
  "Sets & Logic", "Algebra", "Quadratic", "Exponents & Logs", "Functions",
  "Geometry", "Trigonometry", "Sequences", "Probability", "Statistics",
  "Matrices", "Complex Numbers", "Vectors", "Limits", "Derivatives", "Integration",
] as const;

export const PHYS_CATS = [
  "Kinematics", "Forces & Motion", "Energy & Power", "Momentum",
  "Circular & Rotation", "Gravitation", "SHM & Waves", "Optics",
  "Thermal & Gases", "Electricity", "Magnetism", "Fluids", "Modern Physics",
] as const;

// legacy alias (math library page)
export const LIB_CATS = MATH_CATS;

export const FORMULAS: Formula[] = [
  { cat: "Sets & Logic", name: "De Morgan's Laws", tex: "(A\\cup B)'=A'\\cap B'\\qquad (A\\cap B)'=A'\\cup B'",
    use: "Simplifying complements of combined sets or logic statements.", example: "$\\neg(p\\vee q)\\equiv\\neg p\\wedge\\neg q$", diff: "easy" },
  { cat: "Sets & Logic", name: "Inclusion–Exclusion", tex: "n(A\\cup B)=n(A)+n(B)-n(A\\cap B)",
    use: "Counting elements when two sets overlap.", example: "$18+14-6=26$ students take math or physics.", diff: "easy" },
  { cat: "Algebra", name: "Difference of Squares", tex: "a^2-b^2=(a-b)(a+b)",
    use: "Fast factoring when both terms are perfect squares.", example: "$x^2-9=(x-3)(x+3)$", diff: "easy" },
  { cat: "Algebra", name: "Vieta's Formulas", tex: "r_1+r_2=-\\frac{b}{a}\\qquad r_1r_2=\\frac{c}{a}",
    use: "Getting root sums and products without solving the quadratic.", example: "$2x^2-7x+3$: sum $=\\frac{7}{2}$, product $=\\frac{3}{2}$", diff: "med" },
  { cat: "Quadratic", name: "Quadratic Formula", tex: "x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}",
    use: "Solving any $ax^2+bx+c=0$, factorable or not.", example: "$x^2-5x+6=0\\Rightarrow x=2,\\,3$", diff: "med" },
  { cat: "Quadratic", name: "Discriminant", tex: "\\Delta=b^2-4ac",
    use: "Predicting root type: $\\Delta>0$ two real, $\\Delta=0$ one repeated, $\\Delta<0$ none real.", example: "$x^2+x+1$: $\\Delta=-3$ → no real roots", diff: "easy" },
  { cat: "Exponents & Logs", name: "Laws of Exponents", tex: "a^m a^n=a^{m+n}\\qquad (a^m)^n=a^{mn}",
    use: "Combining powers with the same base.", example: "$2^3\\cdot 2^4=2^7=128$", diff: "easy" },
  { cat: "Exponents & Logs", name: "Change of Base", tex: "\\log_b x=\\frac{\\ln x}{\\ln b}",
    use: "Evaluating logs with any base on a calculator.", example: "$\\log_2 10=\\frac{\\ln 10}{\\ln 2}\\approx 3.32$", diff: "med" },
  { cat: "Functions", name: "Composite Function", tex: "(f\\circ g)(x)=f(g(x))",
    use: "Chaining functions; setting up the chain rule.", example: "$f(x)=2x+1,\\;g(x)=x^2$: $(f\\circ g)(3)=19$", diff: "med" },
  { cat: "Functions", name: "Average Rate of Change", tex: "\\frac{f(b)-f(a)}{b-a}",
    use: "Slope of the secant line between two points on a graph.", example: "$f(x)=x^2$ from 1 to 3: $\\frac{9-1}{2}=4$", diff: "med" },
  { cat: "Geometry", name: "Distance & Midpoint", tex: "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}\\qquad M=\\left(\\tfrac{x_1+x_2}{2},\\tfrac{y_1+y_2}{2}\\right)",
    use: "Length and midpoint between two points in the plane.", example: "$(0,0)$ to $(3,4)$: $d=5$", diff: "easy" },
  { cat: "Geometry", name: "Circle Equation", tex: "(x-h)^2+(y-k)^2=r^2",
    use: "Reading center $(h,k)$ and radius $r$; signs flip inside the brackets.", example: "$(x-4)^2+(y+2)^2=25$: center $(4,-2)$, $r=5$", diff: "easy" },
  { cat: "Trigonometry", name: "Pythagorean Identity", tex: "\\sin^2\\theta+\\cos^2\\theta=1",
    use: "Converting between sin and cos; simplifying identities.", example: "$\\sin\\theta=\\frac{3}{5}\\Rightarrow\\cos\\theta=\\pm\\frac{4}{5}$", diff: "easy" },
  { cat: "Trigonometry", name: "Law of Cosines", tex: "c^2=a^2+b^2-2ab\\cos C",
    use: "Solving triangles with two sides and the included angle.", example: "$a=3,b=4,C=90°$: $c=5$", diff: "med" },
  { cat: "Sequences", name: "Arithmetic nth Term & Sum", tex: "a_n=a_1+(n-1)d\\qquad S_n=\\frac{n}{2}(a_1+a_n)",
    use: "Any term or partial sum with constant difference $d$.", example: "$2,5,8,\\dots$: $a_{10}=2+9\\cdot 3=29$", diff: "easy" },
  { cat: "Sequences", name: "Geometric Series", tex: "a_n=a_1r^{n-1}\\qquad S_\\infty=\\frac{a_1}{1-r}\\;(|r|<1)",
    use: "Terms and infinite sums with common ratio $r$.", example: "$a_1=3,r=\\frac{1}{2}$: $S_\\infty=6$", diff: "med" },
  { cat: "Probability", name: "Addition Rule", tex: "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",
    use: "Probability that at least one of two events occurs.", example: "$0.4+0.5-0.2=0.7$", diff: "easy" },
  { cat: "Probability", name: "Permutations & Combinations", tex: "{}_nP_r=\\frac{n!}{(n-r)!}\\qquad {}_nC_r=\\frac{n!}{r!(n-r)!}",
    use: "Counting arrangements (order matters) vs selections (order doesn't).", example: "$_5C_2=10$ ways to pick 2 of 5", diff: "med" },
  { cat: "Statistics", name: "Mean & Weighted Mean", tex: "\\bar{x}=\\frac{\\sum x_i}{n}\\qquad \\bar{x}=\\frac{\\sum f_ix_i}{\\sum f_i}",
    use: "The balancing point of a data set, plain or frequency-weighted.", example: "$(2+4+8+10)/4=6$", diff: "easy" },
  { cat: "Statistics", name: "Z-score", tex: "z=\\frac{x-\\mu}{\\sigma}",
    use: "How many standard deviations a value sits from the mean.", example: "$z=2,\\mu=50,\\sigma=5\\Rightarrow x=60$", diff: "med" },
  { cat: "Matrices", name: "2×2 Determinant", tex: "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc",
    use: "Invertibility test; nonzero $\\det$ means an inverse exists.", example: "rows $(2\\;1),(3\\;4)$: $\\det=5$", diff: "easy" },
  { cat: "Matrices", name: "2×2 Inverse", tex: "A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}",
    use: "Solving $AX=B$ when $\\det A\\ne 0$.", example: "Swap $a,d$; negate $b,c$; divide by $\\det$.", diff: "hard" },
  { cat: "Complex Numbers", name: "Modulus & Conjugate", tex: "|a+bi|=\\sqrt{a^2+b^2}\\qquad \\overline{a+bi}=a-bi",
    use: "Distance from the origin; rationalizing complex denominators.", example: "$|3+4i|=5$, $(2+i)(2-i)=5$", diff: "easy" },
  { cat: "Complex Numbers", name: "Powers of i", tex: "i^2=-1\\qquad i^{n+4}=i^n",
    use: "Reducing any power of $i$ via the 4-cycle $i,-1,-i,1$.", example: "$i^{15}=i^3=-i$", diff: "med" },
  { cat: "Vectors", name: "Dot Product", tex: "\\vec{a}\\cdot\\vec{b}=|\\vec{a}||\\vec{b}|\\cos\\theta=a_1b_1+a_2b_2",
    use: "Angle between vectors; perpendicular exactly when it equals 0.", example: "$\\langle 1,2\\rangle\\cdot\\langle 3,4\\rangle=11$", diff: "med" },
  { cat: "Vectors", name: "Magnitude & Unit Vector", tex: "|\\vec{v}|=\\sqrt{x^2+y^2}\\qquad \\hat{v}=\\frac{\\vec{v}}{|\\vec{v}|}",
    use: "Length of a vector and the direction-only version of it.", example: "$|\\langle 3,4\\rangle|=5$", diff: "easy" },
  { cat: "Limits", name: "Standard Trig Limits", tex: "\\lim_{x\\to 0}\\frac{\\sin x}{x}=1\\qquad \\lim_{x\\to 0}\\frac{\\tan x}{x}=1",
    use: "Evaluating trig limits; deriving $(\\sin x)'=\\cos x$.", example: "$\\lim\\frac{\\sin 3x}{x}=3$", diff: "med" },
  { cat: "Limits", name: "Rational Limits at Infinity", tex: "\\deg P<\\deg Q\\Rightarrow 0\\qquad \\deg P=\\deg Q\\Rightarrow\\frac{a_{\\text{lead}}}{b_{\\text{lead}}}",
    use: "End behavior of $P(x)/Q(x)$ by comparing degrees.", example: "$\\frac{2x^2+1}{5x^2-3}\\to\\frac{2}{5}$", diff: "hard" },
  { cat: "Derivatives", name: "Power Rule", tex: "\\frac{d}{dx}x^n=nx^{n-1}",
    use: "Differentiating polynomials term by term.", example: "$(x^7)'=7x^6$", diff: "easy" },
  { cat: "Derivatives", name: "Product & Chain Rules", tex: "(uv)'=u'v+uv'\\qquad [f(g(x))]'=f'(g(x))\\,g'(x)",
    use: "Differentiating products and nested functions.", example: "$(x\\sin x)'=\\sin x+x\\cos x$", diff: "med" },
  { cat: "Integration", name: "Power Rule (Integrals)", tex: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\;(n\\ne -1)\\qquad \\int\\frac{1}{x}\\,dx=\\ln|x|+C",
    use: "Antiderivatives of polynomial terms, plus the $n=-1$ special case.", example: "$\\int x^2\\,dx=\\frac{x^3}{3}+C$", diff: "easy" },
  { cat: "Integration", name: "Fundamental Theorem", tex: "\\int_a^b f(x)\\,dx=F(b)-F(a)",
    use: "Evaluating definite integrals from any antiderivative $F$.", example: "$\\int_0^1 2x\\,dx=1^2-0^2=1$", diff: "med" },
];

// Math formulas above tag as subject "math" by default.
export const MATH_FORMULAS: Formula[] = FORMULAS.map((f) => ({ ...f, subject: "math" as const }));
export const ALL_FORMULAS: Formula[] = [...MATH_FORMULAS, ...PHYSICS_FORMULAS];
