import type { TopicId } from "./topics";

/**
 * Question bank transcribed from SIIT_Kahoot_Formula_Game.pdf (144 questions,
 * answers cross-checked against the answer key on pp. 23–25) plus 13 custom
 * fill-in-the-blank questions (ids 201+) for "Fill the Missing Formula" mode.
 *
 * Strings mix prose and LaTeX: wrap math in $...$. Fill questions blank a
 * part of the formula with \boxed{?}.
 */
export type Question = {
  id: number;
  topic: TopicId;
  kind: "recall" | "fill" | "calc";
  timer: number;              // seconds, from the PDF (scaled by difficulty)
  tag: "core" | "extra";
  q: string;                  // question text ($..$ for math)
  choices: string[];          // 4 choices (original bank) or 6 (practice packs)
  answer: number;             // index into choices
  formula: string;            // name of the underlying formula/idea/concept
  explain: string;
  passage?: string;           // reading-comprehension passage shown above the question
};

const Q = (
  id: number, topic: TopicId, kind: Question["kind"], timer: number,
  tag: Question["tag"], answer: number, q: string,
  choices: string[], formula: string, explain: string,
): Question => ({ id, topic, kind, timer, tag, answer, q, choices, formula, explain });

const BASE_QUESTIONS: Question[] = [
  // ── 1. Sets & Logic (Q1–12) ─────────────────────────────────────────────
  Q(1,"set","calc",20,"core",3,"If $n(A)=5$, how many elements are in $\\mathcal{P}(A)$?",
    ["$10$","$16$","$25$","$32$"],"Power set size","$|\\mathcal{P}(A)|=2^n=2^5=32$ - each element is in or out."),
  Q(2,"set","recall",20,"core",1,"Which identity is correct for set difference $A-B$?",
    ["$A\\cup B'$","$A\\cap B'$","$A'\\cap B$","$A'\\cup B$"],"Set difference","$A-B$ keeps elements of $A$ that are not in $B$: $A\\cap B'$."),
  Q(3,"set","calc",30,"core",1,"If $n(A)=18$, $n(B)=14$, and $n(A\\cap B)=6$, find $n(A\\cup B)$.",
    ["$20$","$26$","$32$","$38$"],"Inclusion–exclusion","$n(A\\cup B)=18+14-6=26$ - subtract the double-counted overlap."),
  Q(4,"set","recall",20,"core",1,"Which is De Morgan's law for $(A\\cup B)'$?",
    ["$A'\\cup B'$","$A'\\cap B'$","$A\\cap B$","$A\\cup B$"],"De Morgan's laws","Complement flips union to intersection: $(A\\cup B)'=A'\\cap B'$."),
  Q(5,"set","calc",20,"core",1,"If $n(A)=4$ and $n(B)=3$, what is $n(A\\times B)$?",
    ["$7$","$12$","$16$","$64$"],"Cartesian product","Each of 4 elements pairs with each of 3: $4\\times 3=12$."),
  Q(6,"set","recall",20,"core",1,"If $A\\cup B=A$, which statement must be true?",
    ["$A\\subseteq B$","$B\\subseteq A$","$A=B=\\varnothing$","$A\\cap B=\\varnothing$"],"Subset from union","The union adds nothing new, so every element of $B$ is already in $A$."),
  Q(7,"set","recall",20,"core",1,"Which statement is logically equivalent to $p\\Rightarrow q$?",
    ["$p\\vee q$","$\\neg p\\vee q$","$p\\wedge\\neg q$","$\\neg p\\wedge q$"],"Implication as disjunction","$p\\Rightarrow q\\equiv\\neg p\\vee q$ - false only when $p$ is true and $q$ false."),
  Q(8,"set","recall",20,"core",1,"When is $p\\Rightarrow q$ false?",
    ["Only when $p=T,\\,q=T$","Only when $p=T,\\,q=F$","Only when $p=F,\\,q=T$","Only when $p=F,\\,q=F$"],"Truth table of implication","An implication fails only when a true premise leads to a false conclusion."),
  Q(9,"set","recall",20,"core",2,"Which is equivalent to the contrapositive of $p\\Rightarrow q$?",
    ["$q\\Rightarrow p$","$\\neg p\\Rightarrow\\neg q$","$\\neg q\\Rightarrow\\neg p$","$p\\Rightarrow\\neg q$"],"Contrapositive","Swap and negate both sides; the contrapositive is logically equivalent."),
  Q(10,"set","recall",20,"core",2,"Negate $\\forall x\\,P(x)$.",
    ["$\\forall x\\,\\neg P(x)$","$\\exists x\\,P(x)$","$\\exists x\\,\\neg P(x)$","$\\neg\\exists x\\,\\neg P(x)$"],"Quantifier negation","\"Not all\" means \"there exists one that fails\": $\\exists x\\,\\neg P(x)$."),
  Q(11,"set","recall",20,"core",1,"Which is always true?",
    ["$p\\wedge\\neg p$","$p\\vee\\neg p$","$p\\Rightarrow\\neg p$","$p\\Leftrightarrow\\neg p$"],"Law of excluded middle","$p\\vee\\neg p$ is a tautology - one of the two must hold."),
  Q(12,"set","recall",30,"core",1,"For three sets, why is $n(A\\cap B\\cap C)$ added back in inclusion–exclusion?",
    ["It was never counted","It was subtracted too many times","It is always zero","It equals the universal set"],"Inclusion–exclusion (3 sets)","The triple overlap gets subtracted three times by the pairwise terms, so it must be restored once."),

  // ── 2. Algebra (Q13–24) ────────────────────────────────────────────────
  Q(13,"alg","recall",20,"core",1,"Expand $(a+b)^2$.",
    ["$a^2+b^2$","$a^2+2ab+b^2$","$a^2-ab+b^2$","$2a^2+2b^2$"],"Binomial square","The middle term doubles the cross product: $(a+b)^2=a^2+2ab+b^2$."),
  Q(14,"alg","recall",20,"core",2,"Factor $a^2-b^2$.",
    ["$(a-b)^2$","$(a+b)^2$","$(a-b)(a+b)$","$(a-b)(a^2+ab+b^2)$"],"Difference of squares","Multiply back to check: $(a-b)(a+b)=a^2-b^2$."),
  Q(15,"alg","recall",20,"core",0,"Factor $a^3-b^3$.",
    ["$(a-b)(a^2+ab+b^2)$","$(a+b)(a^2-ab+b^2)$","$(a-b)^3$","$(a-b)(a^2-ab+b^2)$"],"Difference of cubes","Difference of cubes: $a^3-b^3=(a-b)(a^2+ab+b^2)$ - note the $+ab$."),
  Q(16,"alg","recall",30,"core",1,"What is the quadratic formula for $ax^2+bx+c=0$?",
    ["$\\dfrac{b\\pm\\sqrt{b^2-4ac}}{2a}$","$\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$","$\\dfrac{-b\\pm\\sqrt{b^2+4ac}}{a}$","$\\dfrac{-b\\pm\\sqrt{4ac-b^2}}{2a}$"],"Quadratic formula","Memorize the signs: $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$."),
  Q(17,"alg","recall",20,"core",1,"For $ax^2+bx+c=0$, what does $\\Delta=0$ mean?",
    ["No real roots","One repeated real root","Two distinct real roots","Infinitely many roots"],"Discriminant","$\\Delta=b^2-4ac=0$ makes the $\\pm\\sqrt{\\Delta}$ term vanish - one repeated root."),
  Q(18,"alg","calc",30,"core",2,"Find the axis of symmetry of $y=2x^2-8x+1$.",
    ["$x=-2$","$x=1$","$x=2$","$x=4$"],"Axis of symmetry","$x=\\frac{-b}{2a}=\\frac{8}{4}=2$."),
  Q(19,"alg","calc",30,"core",2,"If roots of $2x^2-7x+3=0$ are $r_1,r_2$, find $r_1+r_2$.",
    ["$-\\dfrac{7}{2}$","$\\dfrac{3}{2}$","$\\dfrac{7}{2}$","$3$"],"Vieta's formulas","Sum of roots $=-\\frac{b}{a}=\\frac{7}{2}$ - no need to solve."),
  Q(20,"alg","calc",30,"core",0,"If roots of $3x^2+5x-2=0$ are $r_1,r_2$, find $r_1r_2$.",
    ["$-\\dfrac{2}{3}$","$\\dfrac{2}{3}$","$-\\dfrac{5}{3}$","$\\dfrac{5}{3}$"],"Vieta's formulas","Product of roots $=\\frac{c}{a}=-\\frac{2}{3}$."),
  Q(21,"alg","recall",20,"core",2,"If $P(x)$ is divided by $x-3$, which value gives the remainder?",
    ["$P(-3)$","$P(0)$","$P(3)$","$P(1)$"],"Remainder theorem","Dividing by $x-a$ leaves remainder $P(a)$; here $a=3$."),
  Q(22,"alg","recall",20,"core",1,"If $P(5)=0$, what follows?",
    ["$x+5$ is a factor","$x-5$ is a factor","$5x-1$ is a factor","$P(x)$ has no real roots"],"Factor theorem","A root at $x=5$ means $(x-5)$ divides $P(x)$ exactly."),
  Q(23,"alg","calc",30,"core",2,"What is the remainder when $P(x)=x^2+2x+4$ is divided by $x-2$?",
    ["$4$","$8$","$12$","$16$"],"Remainder theorem","$P(2)=4+4+4=12$."),
  Q(24,"alg","calc",30,"core",1,"If $x_1,x_2,x_3$ are roots of $2x^3-3x^2+5x-7=0$, find $x_1+x_2+x_3$.",
    ["$-\\dfrac{3}{2}$","$\\dfrac{3}{2}$","$\\dfrac{5}{2}$","$\\dfrac{7}{2}$"],"Vieta's formulas (cubic)","Sum of roots $=-\\frac{b}{a}=\\frac{3}{2}$."),

  // ── 3. Absolute Value (Q25–27) ─────────────────────────────────────────
  Q(25,"alg","calc",20,"core",1,"Solve $|x|<4$.",
    ["$x<-4$ or $x>4$","$-4<x<4$","$x>4$","$x\\le 4$"],"Absolute value inequality","$|x|<a$ means $x$ is within $a$ of zero: $-4<x<4$."),
  Q(26,"alg","calc",30,"core",0,"Solve $|x-3|\\le 2$.",
    ["$1\\le x\\le 5$","$-5\\le x\\le -1$","$x\\le 1$ or $x\\ge 5$","$-2\\le x\\le 2$"],"Absolute value inequality","$x$ stays within 2 of 3: $3-2\\le x\\le 3+2$."),
  Q(27,"alg","recall",20,"core",1,"Which identity is always true?",
    ["$\\sqrt{x^2}=x$","$\\sqrt{x^2}=|x|$","$|x|=x$ for all $x$","$|x|^2=|x|$"],"Root of a square","$\\sqrt{x^2}$ is never negative, so it equals $|x|$, not $x$."),

  // ── 4. Inequalities (Q28–30) ───────────────────────────────────────────
  Q(28,"alg","calc",30,"core",1,"Solve $(x-2)(x-5)<0$.",
    ["$x<2$ or $x>5$","$2<x<5$","$x>5$","$x<2$"],"Sign analysis","A product is negative between its roots: $2<x<5$."),
  Q(29,"alg","recall",20,"core",1,"What happens to an inequality sign when multiplying both sides by $-3$?",
    ["It stays the same","It reverses","It becomes an equality","It disappears"],"Inequality rules","Multiplying or dividing by a negative number flips the inequality."),
  Q(30,"alg","calc",20,"core",1,"Solve $2x-7>5$.",
    ["$x>1$","$x>6$","$x<6$","$x>12$"],"Linear inequality","$2x>12$, so $x>6$."),

  // ── 5. Exponents (Q31–35) ──────────────────────────────────────────────
  Q(31,"alg","calc",20,"core",0,"Simplify $a^3a^5$.",
    ["$a^8$","$a^{15}$","$a^2$","$2a^8$"],"Product of powers","Same base multiplied → add exponents: $3+5=8$."),
  Q(32,"alg","calc",20,"core",1,"Simplify $\\dfrac{a^7}{a^2}$.",
    ["$a^9$","$a^5$","$a^{14}$","$a^{7/2}$"],"Quotient of powers","Same base divided → subtract exponents: $7-2=5$."),
  Q(33,"alg","calc",20,"core",1,"Simplify $(a^3)^4$.",
    ["$a^7$","$a^{12}$","$4a^3$","$a^{81}$"],"Power of a power","Power of a power → multiply exponents: $3\\cdot 4=12$."),
  Q(34,"alg","recall",20,"core",1,"What is $a^{-3}$?",
    ["$-a^3$","$\\dfrac{1}{a^3}$","$\\dfrac{1}{3a}$","$a^3$"],"Negative exponent","A negative exponent means reciprocal, not a negative value."),
  Q(35,"alg","recall",20,"core",1,"Write $a^{3/2}$ in radical form.",
    ["$\\sqrt[3]{a^2}$","$\\sqrt{a^3}$","$\\dfrac{a^3}{2}$","$3\\sqrt{a}$"],"Rational exponents","$a^{m/n}=\\sqrt[n]{a^m}$: denominator is the root index."),

  // ── 6. Radicals (Q36–37) ───────────────────────────────────────────────
  Q(36,"alg","calc",30,"core",0,"Simplify $\\sqrt{50}$.",
    ["$5\\sqrt{2}$","$10\\sqrt{5}$","$25\\sqrt{2}$","$2\\sqrt{25}$"],"Simplifying radicals","$\\sqrt{50}=\\sqrt{25\\cdot 2}=5\\sqrt{2}$."),
  Q(37,"alg","calc",20,"core",1,"Rationalize $\\dfrac{1}{\\sqrt{5}}$.",
    ["$\\dfrac{1}{5\\sqrt{5}}$","$\\dfrac{\\sqrt{5}}{5}$","$\\sqrt{5}$","$\\dfrac{5}{\\sqrt{5}}$"],"Rationalizing","Multiply top and bottom by $\\sqrt{5}$: $\\frac{\\sqrt5}{5}$."),

  // ── 7. Logarithms (Q38–42) ─────────────────────────────────────────────
  Q(38,"alg","recall",20,"core",1,"Convert $\\log_2 8=3$ to exponential form.",
    ["$8^2=3$","$2^3=8$","$3^2=8$","$2^8=3$"],"Log ↔ exponential","$\\log_b y=x$ means $b^x=y$: base stays the base."),
  Q(39,"alg","recall",20,"core",1,"Which law is correct?",
    ["$\\log(ab)=\\log a\\,\\log b$","$\\log(ab)=\\log a+\\log b$","$\\log(a+b)=\\log a+\\log b$","$\\log(a/b)=\\log a+\\log b$"],"Log product rule","Logs turn products into sums: $\\log(ab)=\\log a+\\log b$."),
  Q(40,"alg","calc",20,"core",1,"Simplify $\\log_3 27$.",
    ["$2$","$3$","$6$","$9$"],"Evaluating logs","$3^3=27$, so $\\log_3 27=3$."),
  Q(41,"alg","recall",20,"core",1,"What is $\\log_a(a^x)$?",
    ["$a$","$x$","$1$","$\\log_a x$"],"Log inverse property","Log base $a$ undoes $a^{(\\cdot)}$, leaving the exponent $x$."),
  Q(42,"alg","recall",20,"core",1,"Which is the change-of-base formula for $\\log_b x$?",
    ["$\\dfrac{\\ln b}{\\ln x}$","$\\dfrac{\\ln x}{\\ln b}$","$\\ln x-\\ln b$","$\\ln(xb)$"],"Change of base","$\\log_b x=\\frac{\\ln x}{\\ln b}$ - the argument goes on top."),

  // ── 8. Growth (Q43–44) ─────────────────────────────────────────────────
  Q(43,"alg","recall",20,"extra",2,"Which formula represents continuous compounding?",
    ["$A=P(1+rt)$","$A=P(1+r)^t$","$A=Pe^{rt}$","$A=P+rt$"],"Continuous compounding","Continuous growth uses the exponential: $A=Pe^{rt}$."),
  Q(44,"alg","recall",30,"extra",1,"For $A=A_0e^{kt}$, what is the doubling time?",
    ["$\\dfrac{k}{\\ln 2}$","$\\dfrac{\\ln 2}{k}$","$2k$","$\\ln(2k)$"],"Doubling time","Set $e^{kt}=2$ and solve: $t=\\frac{\\ln 2}{k}$."),

  // ── 9. Functions (Q45–51) ──────────────────────────────────────────────
  Q(45,"fun","calc",30,"core",2,"If $f(x)=2x+1$ and $g(x)=x^2$, find $(f\\circ g)(3)$.",
    ["$10$","$18$","$19$","$37$"],"Composite function","Inside first: $g(3)=9$, then $f(9)=2\\cdot 9+1=19$."),
  Q(46,"fun","calc",30,"core",0,"If $f(x)=3x-4$, find $f^{-1}(x)$.",
    ["$\\dfrac{x+4}{3}$","$3x+4$","$\\dfrac{x-4}{3}$","$\\dfrac{4-x}{3}$"],"Inverse function","Swap $x$ and $y$ in $y=3x-4$, then solve: $y=\\frac{x+4}{3}$."),
  Q(47,"fun","calc",20,"core",1,"What restriction applies to $f(x)=\\dfrac{1}{x-5}$?",
    ["$x\\ne 0$","$x\\ne 5$","$x>5$","$x\\ge 5$"],"Domain (rational)","The denominator can't be zero: $x-5\\ne 0$."),
  Q(48,"fun","calc",20,"core",1,"What is the domain condition for $\\sqrt{2x-6}$?",
    ["$2x-6>0$","$2x-6\\ge 0$","$2x-6\\ne 0$","$2x-6\\le 0$"],"Domain (root)","The radicand must be non-negative - zero is allowed under a square root."),
  Q(49,"fun","calc",20,"core",1,"What is the domain condition for $\\log(x+4)$?",
    ["$x+4\\ge 0$","$x+4>0$","$x+4\\ne 0$","$x+4<0$"],"Domain (log)","Logs need a strictly positive argument - zero is not allowed."),
  Q(50,"fun","recall",20,"extra",1,"What does $y=f(x-3)$ do to the graph of $y=f(x)$?",
    ["Shift left 3","Shift right 3","Shift up 3","Shift down 3"],"Graph translation","Subtracting inside the argument shifts the graph right - opposite of intuition."),
  Q(51,"fun","recall",20,"core",1,"Which formula gives average rate of change from $x=a$ to $x=b$?",
    ["$\\dfrac{f(a)+f(b)}{a+b}$","$\\dfrac{f(b)-f(a)}{b-a}$","$f'(a)$","$f(b)-f(a)$"],"Average rate of change","It's the slope of the secant line between the two points."),

  // ── 10. Coordinate Geometry (Q52–56) ───────────────────────────────────
  Q(52,"geo","calc",20,"core",1,"Find the slope through $(1,2)$ and $(5,10)$.",
    ["$1$","$2$","$4$","$8$"],"Slope formula","$m=\\frac{10-2}{5-1}=\\frac{8}{4}=2$."),
  Q(53,"geo","calc",20,"core",1,"Find the distance between $(0,0)$ and $(3,4)$.",
    ["$4$","$5$","$6$","$7$"],"Distance formula","$d=\\sqrt{3^2+4^2}=5$ - the classic 3-4-5 triangle."),
  Q(54,"geo","calc",20,"core",0,"Find the midpoint of $(2,6)$ and $(8,10)$.",
    ["$(5,8)$","$(6,8)$","$(5,16)$","$(10,16)$"],"Midpoint formula","Average each coordinate: $\\left(\\frac{2+8}{2},\\frac{6+10}{2}\\right)=(5,8)$."),
  Q(55,"geo","calc",20,"core",3,"If a line has slope $2$, what is the slope of a perpendicular line?",
    ["$2$","$-2$","$\\dfrac{1}{2}$","$-\\dfrac{1}{2}$"],"Perpendicular slopes","Perpendicular slopes are negative reciprocals: $m_1m_2=-1$."),
  Q(56,"geo","recall",20,"core",1,"Which is point-slope form?",
    ["$y=mx+c$","$y-y_1=m(x-x_1)$","$Ax+By=C$","$x^2+y^2=r^2$"],"Point-slope form","Built directly from one known point and the slope."),

  // ── 11. Circle (Q57–58) ────────────────────────────────────────────────
  Q(57,"geo","calc",20,"core",2,"What is the center of $(x-4)^2+(y+2)^2=25$?",
    ["$(4,2)$","$(-4,2)$","$(4,-2)$","$(-4,-2)$"],"Circle equation","Signs flip: $(x-h)^2+(y-k)^2=r^2$ has center $(h,k)=(4,-2)$."),
  Q(58,"geo","recall",20,"core",2,"For $(x-h)^2+(y-k)^2=r^2$, what does $r$ represent?",
    ["Slope","Diameter","Radius","Area"],"Circle equation","$r$ is the radius - the right side is $r^2$, not $r$."),

  // ── 12. Geometry (Q59–64) ──────────────────────────────────────────────
  Q(59,"geo","calc",20,"core",0,"Area of a triangle with base $10$ and height $6$?",
    ["$30$","$60$","$16$","$120$"],"Triangle area","$A=\\frac{1}{2}bh=\\frac{1}{2}\\cdot 10\\cdot 6=30$."),
  Q(60,"geo","recall",20,"core",1,"Circumference of a circle of radius $r$?",
    ["$\\pi r^2$","$2\\pi r$","$\\pi d^2$","$4\\pi r^2$"],"Circumference","$C=2\\pi r$; $\\pi r^2$ is the area."),
  Q(61,"geo","recall",20,"core",0,"Volume of a cylinder?",
    ["$\\pi r^2h$","$2\\pi rh$","$\\dfrac{1}{3}\\pi r^2h$","$\\dfrac{4}{3}\\pi r^3$"],"Cylinder volume","Base area times height: $V=\\pi r^2 h$."),
  Q(62,"geo","recall",20,"extra",2,"Volume of a sphere?",
    ["$4\\pi r^2$","$\\pi r^2h$","$\\dfrac{4}{3}\\pi r^3$","$\\dfrac{1}{3}\\pi r^3$"],"Sphere volume","$V=\\frac{4}{3}\\pi r^3$; $4\\pi r^2$ is the surface area."),
  Q(63,"geo","calc",30,"extra",1,"Sum of interior angles of a hexagon?",
    ["$540°$","$720°$","$900°$","$1080°$"],"Polygon angle sum","$(n-2)\\cdot 180°=(6-2)\\cdot 180°=720°$."),
  Q(64,"geo","recall",20,"core",1,"Pythagorean theorem?",
    ["$a+b=c$","$a^2+b^2=c^2$","$a^2-b^2=c$","$2a+2b=c^2$"],"Pythagorean theorem","In a right triangle, the legs' squares sum to the hypotenuse squared."),

  // ── 13. Trigonometry (Q65–78) ──────────────────────────────────────────
  Q(65,"trg","calc",20,"core",2,"Convert $60°$ to radians.",
    ["$\\dfrac{\\pi}{6}$","$\\dfrac{\\pi}{4}$","$\\dfrac{\\pi}{3}$","$\\dfrac{2\\pi}{3}$"],"Degrees to radians","Multiply by $\\frac{\\pi}{180}$: $60°=\\frac{\\pi}{3}$."),
  Q(66,"trg","calc",20,"core",1,"What is $\\sin 30°$?",
    ["$0$","$\\dfrac{1}{2}$","$\\dfrac{\\sqrt{2}}{2}$","$\\dfrac{\\sqrt{3}}{2}$"],"Special angles","From the 30-60-90 triangle: $\\sin 30°=\\frac{1}{2}$."),
  Q(67,"trg","calc",20,"core",0,"What is $\\cos 60°$?",
    ["$\\dfrac{1}{2}$","$\\dfrac{\\sqrt{2}}{2}$","$\\dfrac{\\sqrt{3}}{2}$","$1$"],"Special angles","$\\cos 60°=\\sin 30°=\\frac{1}{2}$ - cofunctions of complementary angles."),
  Q(68,"trg","calc",20,"core",2,"What is $\\tan 45°$?",
    ["$0$","$\\dfrac{1}{2}$","$1$","$\\sqrt{3}$"],"Special angles","At $45°$ sine equals cosine, so their ratio is 1."),
  Q(69,"trg","recall",20,"core",1,"Which identity is correct?",
    ["$\\sin^2x-\\cos^2x=1$","$\\sin^2x+\\cos^2x=1$","$\\tan^2x+\\sec^2x=1$","$\\sin x+\\cos x=1$"],"Pythagorean identity","From the unit circle: $\\sin^2x+\\cos^2x=1$ for every $x$."),
  Q(70,"trg","recall",20,"core",1,"Which identity equals $\\tan x$?",
    ["$\\dfrac{\\cos x}{\\sin x}$","$\\dfrac{\\sin x}{\\cos x}$","$\\dfrac{1}{\\sin x}$","$\\dfrac{1}{\\cos x}$"],"Tangent identity","$\\tan x=\\frac{\\sin x}{\\cos x}$; the reciprocal is $\\cot x$."),
  Q(71,"trg","recall",20,"core",1,"Which is the double-angle formula for $\\sin 2x$?",
    ["$\\sin^2x+\\cos^2x$","$2\\sin x\\cos x$","$\\sin x+\\cos x$","$2\\sin^2x-1$"],"Double angle (sine)","$\\sin 2x=2\\sin x\\cos x$; $2\\cos^2 x - 1$ belongs to $\\cos 2x$."),
  Q(72,"trg","recall",30,"core",0,"Which is a power-reduction identity?",
    ["$\\sin^2x=\\dfrac{1-\\cos 2x}{2}$","$\\sin^2x=1-\\cos x$","$\\sin 2x=\\sin^2x$","$\\cos 2x=\\cos x+2$"],"Power reduction","Rearranged from $\\cos 2x=1-2\\sin^2x$."),
  Q(73,"trg","recall",20,"extra",0,"If $\\theta$ is in radians, what is arc length?",
    ["$s=r\\theta$","$s=\\pi r^2$","$s=2\\pi r$","$s=\\dfrac{1}{2}r^2\\theta$"],"Arc length","Radians make it simple: $s=r\\theta$."),
  Q(74,"trg","recall",20,"extra",1,"If $\\theta$ is in radians, what is sector area?",
    ["$r\\theta$","$\\dfrac{1}{2}r^2\\theta$","$\\pi r^2$","$2\\pi r\\theta$"],"Sector area","$A=\\frac{1}{2}r^2\\theta$ - like $\\pi r^2$ scaled by $\\frac{\\theta}{2\\pi}$."),
  Q(75,"trg","recall",30,"extra",2,"Law of Cosines for side $c$?",
    ["$c^2=a^2+b^2+2ab\\cos C$","$c=a+b-2ab\\cos C$","$c^2=a^2+b^2-2ab\\cos C$","$c^2=a^2-b^2$"],"Law of Cosines","Generalizes Pythagoras - at $C=90°$ the cosine term vanishes."),
  Q(76,"trg","recall",20,"extra",1,"Triangle area using sides $a,b$ and included angle $C$?",
    ["$ab\\sin C$","$\\dfrac{1}{2}ab\\sin C$","$\\dfrac{1}{2}ab\\cos C$","$a+b+c$"],"Trig area formula","$A=\\frac{1}{2}ab\\sin C$ - half the parallelogram."),
  Q(77,"trg","calc",30,"extra",0,"What is the period of $y=\\sin(3x)$?",
    ["$\\dfrac{2\\pi}{3}$","$3\\pi$","$\\dfrac{\\pi}{3}$","$6\\pi$"],"Period","Period $=\\frac{2\\pi}{|b|}=\\frac{2\\pi}{3}$ - larger $b$ squeezes the wave."),
  Q(78,"trg","calc",20,"extra",3,"What is the amplitude of $y=-5\\cos(2x)+1$?",
    ["$-5$","$1$","$2$","$5$"],"Amplitude","Amplitude is $|a|=|-5|=5$ - always positive."),

  // ── 14. Sequences (Q79–83) ─────────────────────────────────────────────
  Q(79,"seq","recall",20,"core",1,"For an arithmetic sequence, $a_n=\\,?$",
    ["$a_1r^{n-1}$","$a_1+(n-1)d$","$\\dfrac{n}{2}(a_1+a_n)$","$a_1+nd$"],"Arithmetic nth term","Start at $a_1$ and take $n-1$ steps of size $d$."),
  Q(80,"seq","recall",20,"core",0,"For an arithmetic series, $S_n=\\,?$",
    ["$\\dfrac{n}{2}(a_1+a_n)$","$a_1r^{n-1}$","$\\dfrac{a_1}{1-r}$","$n(a_1+d)$"],"Arithmetic series sum","Average of first and last term, times the count."),
  Q(81,"seq","recall",20,"core",1,"For a geometric sequence, $a_n=\\,?$",
    ["$a_1+(n-1)d$","$a_1r^{n-1}$","$a_1r^n$","$\\dfrac{a_1}{1-r}$"],"Geometric nth term","Multiply by $r$ a total of $n-1$ times - the exponent is $n-1$, not $n$."),
  Q(82,"seq","recall",20,"core",1,"When does an infinite geometric series converge?",
    ["$r>1$","$|r|<1$","$r=1$","$r<-1$"],"Geometric convergence","Terms must shrink: $|r|<1$."),
  Q(83,"seq","calc",30,"core",2,"If $a_1=3$ and $r=\\dfrac{1}{2}$, find $S_\\infty$.",
    ["$3$","$4$","$6$","$9$"],"Infinite geometric sum","$S_\\infty=\\frac{a_1}{1-r}=\\frac{3}{1/2}=6$."),

  // ── 15. Summation (Q84–85) ─────────────────────────────────────────────
  Q(84,"seq","recall",20,"core",1,"What is $\\sum_{k=1}^{n}k$?",
    ["$n^2$","$\\dfrac{n(n+1)}{2}$","$\\dfrac{n(n-1)}{2}$","$2n$"],"Sum of first n integers","Gauss's formula: pair first with last."),
  Q(85,"seq","recall",30,"core",1,"What is $\\sum_{k=1}^{n}k^2$?",
    ["$\\dfrac{n(n+1)}{2}$","$\\dfrac{n(n+1)(2n+1)}{6}$","$n^2$","$\\left[\\dfrac{n(n+1)}{2}\\right]^2$"],"Sum of squares","$\\sum k^2=\\frac{n(n+1)(2n+1)}{6}$; the squared bracket is $\\sum k^3$."),

  // ── 16. Counting (Q86–90) ──────────────────────────────────────────────
  Q(86,"prb","recall",20,"core",1,"What is $0!\\,$?",
    ["$0$","$1$","Undefined","$-1$"],"Factorial","By definition $0!=1$ - there is one way to arrange nothing."),
  Q(87,"prb","recall",20,"core",1,"Which formula is permutation $_nP_r$?",
    ["$\\dfrac{n!}{r!(n-r)!}$","$\\dfrac{n!}{(n-r)!}$","$\\dfrac{r!}{n!}$","$n^r$"],"Permutations","Order matters, so no $r!$ in the denominator."),
  Q(88,"prb","recall",20,"core",0,"Which formula is combination $_nC_r$?",
    ["$\\dfrac{n!}{r!(n-r)!}$","$\\dfrac{n!}{(n-r)!}$","$\\dfrac{r!}{(n-r)!}$","$(n-r)!$"],"Combinations","Divide permutations by $r!$ since order inside the group is irrelevant."),
  Q(89,"prb","calc",20,"core",2,"How many arrangements of the letters in MATH?",
    ["$4$","$12$","$24$","$16$"],"Permutations","4 distinct letters: $4!=24$."),
  Q(90,"prb","calc",30,"core",1,"How many distinct arrangements of AABC?",
    ["$24$","$12$","$8$","$6$"],"Permutations with repetition","$\\frac{4!}{2!}=12$ - divide out the identical A's."),

  // ── 17. Probability (Q91–94) ───────────────────────────────────────────
  Q(91,"prb","recall",20,"core",1,"What is $P(A^c)$?",
    ["$P(A)$","$1-P(A)$","$1+P(A)$","$\\dfrac{1}{P(A)}$"],"Complement rule","Probabilities of an event and its complement sum to 1."),
  Q(92,"prb","recall",20,"core",1,"If events $A,B$ are independent, what is $P(A\\cap B)$?",
    ["$P(A)+P(B)$","$P(A)P(B)$","$P(A)-P(B)$","$1-P(A)P(B)$"],"Independence","Independent events multiply: $P(A\\cap B)=P(A)P(B)$."),
  Q(93,"prb","recall",20,"core",1,"What is $P(A|B)$?",
    ["$\\dfrac{P(A\\cup B)}{P(B)}$","$\\dfrac{P(A\\cap B)}{P(B)}$","$P(A)P(B)$","$P(A)+P(B)$"],"Conditional probability","Restrict the sample space to $B$: divide the joint probability by $P(B)$."),
  Q(94,"prb","calc",30,"core",1,"If $P(A)=0.4$, $P(B)=0.5$, $P(A\\cap B)=0.2$, find $P(A\\cup B)$.",
    ["$0.3$","$0.7$","$0.9$","$1.1$"],"Addition rule","$0.4+0.5-0.2=0.7$ - subtract the overlap."),

  // ── 18. Binomial (Q95–96) ──────────────────────────────────────────────
  Q(95,"prb","recall",20,"extra",0,"For $X\\sim B(n,p)$, what is $E(X)$?",
    ["$np$","$n(1-p)$","$np(1-p)$","$\\sqrt{np(1-p)}$"],"Binomial mean","Expected successes $=$ trials $\\times$ success rate: $np$."),
  Q(96,"prb","recall",20,"extra",1,"For $X\\sim B(n,p)$, variance is?",
    ["$np$","$np(1-p)$","$\\sqrt{np(1-p)}$","$n+p$"],"Binomial variance","$\\mathrm{Var}=np(1-p)$; its square root is the SD."),

  // ── 19. Statistics (Q97–112) ───────────────────────────────────────────
  Q(97,"sta","calc",20,"extra",1,"Mean of $2,4,8,10$?",
    ["$5$","$6$","$7$","$8$"],"Mean","$(2+4+8+10)/4=24/4=6$."),
  Q(98,"sta","recall",20,"extra",0,"Which formula gives the mean?",
    ["$\\dfrac{\\sum x}{n}$","$\\sum xn$","$\\dfrac{n}{\\sum x}$","$\\sum x^2$"],"Mean","Total divided by count."),
  Q(99,"sta","recall",20,"extra",1,"For frequency data, mean is?",
    ["$\\dfrac{\\sum f}{\\sum x}$","$\\dfrac{\\sum fx}{\\sum f}$","$\\dfrac{\\sum x}{\\sum f}$","$\\sum fx$"],"Weighted mean","Weight each value by its frequency, divide by total frequency."),
  Q(100,"sta","calc",20,"extra",2,"What is the range of $3,7,8,15$?",
    ["$8$","$10$","$12$","$15$"],"Range","Max minus min: $15-3=12$."),
  Q(101,"sta","calc",20,"extra",2,"What is the mid-range of $3$ and $15$?",
    ["$6$","$8$","$9$","$12$"],"Mid-range","Average of the extremes: $(3+15)/2=9$."),
  Q(102,"sta","recall",20,"extra",1,"Which quartile equals the median?",
    ["$Q_1$","$Q_2$","$Q_3$","$Q_4$"],"Quartiles","The median splits the data in half - that's $Q_2$."),
  Q(103,"sta","recall",20,"extra",1,"What is $IQR$?",
    ["$Q_1+Q_3$","$Q_3-Q_1$","$Q_2-Q_1$","$Q_3/Q_1$"],"Interquartile range","The middle 50% spread: $Q_3-Q_1$."),
  Q(104,"sta","recall",20,"extra",0,"Which is the lower outlier fence?",
    ["$Q_1-1.5\\,IQR$","$Q_1+1.5\\,IQR$","$Q_3-1.5\\,IQR$","$Q_3+1.5\\,IQR$"],"Outlier fences","Go $1.5\\,IQR$ below $Q_1$ (and above $Q_3$ for the upper fence)."),
  Q(105,"sta","recall",20,"extra",1,"Population variance uses which denominator?",
    ["$n-1$","$N$","$N-1$","$\\sqrt{N}$"],"Population variance","The full population divides by $N$; samples use $n-1$."),
  Q(106,"sta","recall",20,"extra",2,"Sample variance uses which denominator?",
    ["$n$","$n+1$","$n-1$","$\\sqrt{n}$"],"Sample variance","Bessel's correction: dividing by $n-1$ removes bias."),
  Q(107,"sta","recall",20,"extra",1,"Which formula is a z-score?",
    ["$z=\\dfrac{x+\\mu}{\\sigma}$","$z=\\dfrac{x-\\mu}{\\sigma}$","$z=\\dfrac{\\mu-x}{\\sigma^2}$","$z=x\\sigma-\\mu$"],"Z-score","How many SDs $x$ sits from the mean: $(x-\\mu)/\\sigma$."),
  Q(108,"sta","calc",30,"extra",3,"If $z=2$, $\\mu=50$, $\\sigma=5$, find $x$.",
    ["$40$","$45$","$55$","$60$"],"Z-score","$x=\\mu+z\\sigma=50+2\\cdot 5=60$."),
  Q(109,"sta","recall",20,"extra",0,"Coefficient of variation as a percentage?",
    ["$\\dfrac{SD}{\\bar{x}}\\times 100$","$SD\\cdot\\bar{x}$","$\\dfrac{\\bar{x}}{SD}$","$SD-\\bar{x}$"],"Coefficient of variation","Relative spread: SD as a fraction of the mean."),
  Q(110,"sta","recall",20,"extra",1,"Geometric mean of $a,b$?",
    ["$\\dfrac{a+b}{2}$","$\\sqrt{ab}$","$\\dfrac{2}{1/a+1/b}$","$ab$"],"Geometric mean","$\\sqrt{ab}$; the fraction with reciprocals is the harmonic mean."),
  Q(111,"sta","recall",30,"extra",2,"Harmonic mean of $x_1,\\dots,x_n$?",
    ["$\\dfrac{\\sum x}{n}$","$\\sqrt[n]{\\prod x_i}$","$\\dfrac{n}{\\sum 1/x_i}$","$\\sum x_i^2$"],"Harmonic mean","Count over the sum of reciprocals - used for average rates."),
  Q(112,"sta","recall",20,"extra",1,"Expected value of a discrete random variable is?",
    ["$\\sum P(x)$","$\\sum xP(x)$","$\\sum x^2$","$1-P(x)$"],"Expected value","Weight each outcome by its probability: $E(X)=\\sum xP(x)$."),

  // ── 20. Matrices (Q113–116) ────────────────────────────────────────────
  Q(113,"mat","recall",20,"core",1,"Determinant of $\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$?",
    ["$ac-bd$","$ad-bc$","$ab-cd$","$a+d-b-c$"],"2×2 determinant","Main diagonal product minus anti-diagonal: $ad-bc$."),
  Q(114,"mat","recall",20,"core",1,"When does a $2\\times 2$ matrix have an inverse?",
    ["$ad-bc=0$","$ad-bc\\ne 0$","$a=d$","$b=c$"],"Invertibility","Nonzero determinant means the matrix is invertible."),
  Q(115,"mat","recall",20,"extra",0,"Inverse of $A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ begins with which scalar?",
    ["$\\dfrac{1}{ad-bc}$","$ad-bc$","$\\dfrac{1}{a+d}$","$\\dfrac{1}{ab-cd}$"],"Matrix inverse","$A^{-1}=\\frac{1}{\\det A}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$."),
  Q(116,"mat","recall",20,"core",1,"What is the identity matrix $I_2$?",
    ["$\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$","$\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$","$\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$","$\\begin{pmatrix}0&0\\\\0&0\\end{pmatrix}$"],"Identity matrix","Ones on the diagonal, zeros elsewhere: $AI=A$."),

  // ── 21. Complex Numbers (Q117–120) ─────────────────────────────────────
  Q(117,"cpx","recall",20,"core",1,"What is $i^2$?",
    ["$1$","$-1$","$i$","$-i$"],"Imaginary unit","By definition $i=\\sqrt{-1}$, so $i^2=-1$."),
  Q(118,"cpx","calc",20,"core",3,"What is $i^{15}$?",
    ["$1$","$-1$","$i$","$-i$"],"Powers of i","Powers cycle every 4: $i^{15}=i^{12}\\cdot i^3=i^3=-i$."),
  Q(119,"cpx","calc",20,"core",2,"Conjugate of $3+4i$?",
    ["$3+4i$","$-3-4i$","$3-4i$","$-3+4i$"],"Complex conjugate","Flip only the sign of the imaginary part."),
  Q(120,"cpx","calc",20,"core",2,"Magnitude of $3+4i$?",
    ["$3$","$4$","$5$","$7$"],"Complex modulus","$|3+4i|=\\sqrt{3^2+4^2}=5$."),

  // ── 22. Vectors (Q121–126) ─────────────────────────────────────────────
  Q(121,"vec","calc",20,"core",2,"Magnitude of $\\langle 3,4\\rangle$?",
    ["$3$","$4$","$5$","$7$"],"Vector magnitude","$|\\vec v|=\\sqrt{3^2+4^2}=5$ - Pythagoras in component form."),
  Q(122,"vec","recall",20,"core",1,"Unit vector in direction of $\\vec{v}$?",
    ["$|\\vec{v}|\\vec{v}$","$\\dfrac{\\vec{v}}{|\\vec{v}|}$","$\\dfrac{|\\vec{v}|}{\\vec{v}}$","$\\vec{v}^2$"],"Unit vector","Divide the vector by its own length to normalize it."),
  Q(123,"vec","calc",20,"extra",2,"Dot product $\\langle 1,2\\rangle\\cdot\\langle 3,4\\rangle$?",
    ["$8$","$10$","$11$","$14$"],"Dot product","Multiply matching components and add: $1\\cdot 3+2\\cdot 4=11$."),
  Q(124,"vec","recall",20,"extra",0,"Two nonzero vectors are perpendicular when?",
    ["$\\vec{a}\\cdot\\vec{b}=0$","$\\vec{a}\\times\\vec{b}=0$","$|\\vec{a}|=|\\vec{b}|$","$\\vec{a}=\\vec{b}$"],"Perpendicularity test","$\\cos 90°=0$, so the dot product vanishes."),
  Q(125,"vec","recall",20,"core",1,"Magnitude of cross product is?",
    ["$|a||b|\\cos\\theta$","$|a||b|\\sin\\theta$","$|a|+|b|$","$|a|-|b|$"],"Cross product magnitude","$|\\vec a\\times\\vec b|=|a||b|\\sin\\theta$ - the parallelogram area."),
  Q(126,"vec","recall",20,"extra",1,"Area of triangle formed by vectors $\\vec{a},\\vec{b}$?",
    ["$|\\vec{a}\\times\\vec{b}|$","$\\dfrac{1}{2}|\\vec{a}\\times\\vec{b}|$","$\\vec{a}\\cdot\\vec{b}$","$\\dfrac{1}{2}\\vec{a}\\cdot\\vec{b}$"],"Triangle area (vectors)","Half the parallelogram spanned by the two vectors."),

  // ── 23. Limits (Q127–131) ──────────────────────────────────────────────
  Q(127,"cal","calc",20,"core",2,"Evaluate $\\lim_{x\\to 2}(3x+1)$.",
    ["$5$","$6$","$7$","$8$"],"Direct substitution","Polynomials are continuous: plug in $x=2$ to get $7$."),
  Q(128,"cal","recall",20,"core",1,"What is $\\lim_{x\\to 0}\\dfrac{\\sin x}{x}$?",
    ["$0$","$1$","$\\infty$","Does not exist"],"Standard sine limit","For small $x$ (radians), $\\sin x\\approx x$, so the ratio → 1."),
  Q(129,"cal","recall",20,"core",1,"What is $\\lim_{x\\to 0}\\dfrac{\\tan x}{x}$?",
    ["$0$","$1$","$-1$","$\\infty$"],"Standard tangent limit","$\\frac{\\tan x}{x}=\\frac{\\sin x}{x}\\cdot\\frac{1}{\\cos x}\\to 1\\cdot 1$."),
  Q(130,"cal","recall",20,"extra",0,"For $\\dfrac{P(x)}{Q(x)}$ as $x\\to\\infty$, if $\\deg P<\\deg Q$, the limit is usually?",
    ["$0$","$1$","$\\infty$","Ratio of constant terms"],"Rational limits at infinity","The denominator outgrows the numerator, driving the ratio to 0."),
  Q(131,"cal","recall",20,"extra",1,"If numerator and denominator have the same degree as $x\\to\\infty$, use?",
    ["Ratio of constant terms","Ratio of leading coefficients","Sum of leading coefficients","Product of degrees"],"Rational limits at infinity","Equal degrees → the leading terms dominate."),

  // ── 24. Derivatives (Q132–139) ─────────────────────────────────────────
  Q(132,"cal","recall",30,"core",0,"Definition of $f'(x)$?",
    ["$\\lim_{h\\to 0}\\dfrac{f(x+h)-f(x)}{h}$","$\\dfrac{f(x+h)+f(x)}{h}$","$\\int f(x)\\,dx$","$f(x+1)-f(x)$"],"Derivative definition","The limit of the difference quotient - instantaneous rate of change."),
  Q(133,"cal","calc",20,"core",0,"$\\dfrac{d}{dx}(x^7)=\\,?$",
    ["$7x^6$","$x^6$","$7x^7$","$6x^7$"],"Power rule","Bring the exponent down, reduce it by one."),
  Q(134,"cal","calc",20,"core",2,"$\\dfrac{d}{dx}(5)=\\,?$",
    ["$5$","$1$","$0$","$x$"],"Constant rule","Constants don't change - their rate of change is 0."),
  Q(135,"cal","recall",20,"extra",1,"Product rule?",
    ["$(fg)'=f'g'$","$(fg)'=f'g+fg'$","$(fg)'=f+g$","$(fg)'=fg$"],"Product rule","Differentiate one factor at a time and add."),
  Q(136,"cal","recall",20,"extra",1,"Chain rule for $f(g(x))$?",
    ["$f'(x)+g'(x)$","$f'(g(x))\\,g'(x)$","$f(g'(x))$","$f'(x)g(x)$"],"Chain rule","Outside derivative at the inside, times the inside derivative."),
  Q(137,"cal","recall",20,"extra",1,"$\\dfrac{d}{dx}\\sin x=\\,?$",
    ["$-\\sin x$","$\\cos x$","$-\\cos x$","$\\sec^2x$"],"Trig derivatives","$(\\sin x)'=\\cos x$; the minus appears when differentiating cosine."),
  Q(138,"cal","recall",20,"extra",2,"$\\dfrac{d}{dx}\\ln x=\\,?$",
    ["$x$","$\\ln x$","$\\dfrac{1}{x}$","$e^x$"],"Log derivative","$(\\ln x)'=\\frac{1}{x}$ for $x>0$."),
  Q(139,"cal","recall",30,"extra",1,"Equation of tangent line at $x=a$?",
    ["$y=f'(a)x$","$y-f(a)=f'(a)(x-a)$","$y=f(a)+a$","$y=ax+f'(a)$"],"Tangent line","Point-slope form using the point $(a,f(a))$ and slope $f'(a)$."),

  // ── 25. Integration (Q140–144) ─────────────────────────────────────────
  Q(140,"cal","recall",20,"core",1,"$\\int x^n\\,dx$ for $n\\ne -1$?",
    ["$nx^{n-1}+C$","$\\dfrac{x^{n+1}}{n+1}+C$","$x^{n+1}+C$","$\\ln|x|+C$"],"Power rule (integrals)","Raise the exponent by one and divide by it - the reverse of differentiating."),
  Q(141,"cal","recall",20,"extra",1,"$\\int\\dfrac{1}{x}\\,dx=\\,?$",
    ["$\\dfrac{1}{x^2}+C$","$\\ln|x|+C$","$e^x+C$","$x+C$"],"Log integral","The missing $n=-1$ case of the power rule."),
  Q(142,"cal","recall",20,"core",1,"$\\int\\cos x\\,dx=\\,?$",
    ["$-\\sin x+C$","$\\sin x+C$","$\\cos x+C$","$-\\cos x+C$"],"Trig integrals","The antiderivative of cosine is sine (check by differentiating)."),
  Q(143,"cal","recall",20,"core",1,"$\\int\\sin x\\,dx=\\,?$",
    ["$\\cos x+C$","$-\\cos x+C$","$\\sin x+C$","$-\\sin x+C$"],"Trig integrals","$(-\\cos x)'=\\sin x$ - the minus sign lives here."),
  Q(144,"cal","recall",30,"core",1,"Fundamental Theorem: $\\int_a^b f(x)\\,dx=\\,?$",
    ["$F(a)+F(b)$","$F(b)-F(a)$","$f(b)-f(a)$","$F(a)-F(b)$"],"Fundamental Theorem of Calculus","Evaluate the antiderivative at the ends: upper minus lower."),

  // ── Custom fill-in-the-blank questions (ids 201+) ──────────────────────
  Q(201,"set","fill",20,"core",0,"Complete: a set with $n$ elements has how many subsets? $\\;|\\mathcal{P}(S)|=2^{\\boxed{?}}$",
    ["$n$","$n-1$","$n^2$","$2n$"],"Power set size","Each element is in or out - two choices each, so $2^n$ subsets."),
  Q(202,"alg","fill",20,"core",0,"Complete the expansion: $(a+b)^2=a^2+\\boxed{?}+b^2$",
    ["$2ab$","$ab$","$a^2b^2$","$2a+2b$"],"Binomial square","The middle term doubles the cross product."),
  Q(203,"alg","fill",30,"core",0,"Complete the quadratic formula: $x=\\dfrac{-b\\pm\\sqrt{\\boxed{?}}}{2a}$",
    ["$b^2-4ac$","$b^2+4ac$","$4ac-b^2$","$b-4ac$"],"Quadratic formula","The discriminant $b^2-4ac$ sits under the root."),
  Q(204,"fun","fill",20,"core",0,"Complete the vertex formula: $x=\\dfrac{-b}{\\boxed{?}}$",
    ["$2a$","$a$","$2c$","$4a$"],"Axis of symmetry","For $y=ax^2+bx+c$, the axis is $x=-b/2a$."),
  Q(205,"geo","fill",20,"core",0,"Complete the distance formula: $d=\\sqrt{(x_2-x_1)^2+\\boxed{?}}$",
    ["$(y_2-y_1)^2$","$(y_2+y_1)^2$","$y_2-y_1$","$(x_2+x_1)^2$"],"Distance formula","Pythagoras on the coordinate differences."),
  Q(206,"trg","fill",20,"core",0,"Complete the compound angle: $\\sin(A+B)=\\sin A\\cos B+\\boxed{?}$",
    ["$\\cos A\\sin B$","$\\sin A\\sin B$","$\\cos A\\cos B$","$\\tan A\\tan B$"],"Sine addition formula","The \"sine keeps both functions\" pattern: $\\sin A\\cos B+\\cos A\\sin B$."),
  Q(207,"seq","fill",20,"core",0,"Complete the arithmetic term: $a_n=a_1+(\\boxed{?})\\,d$",
    ["$n-1$","$n$","$n+1$","$2n$"],"Arithmetic nth term","From $a_1$ you take $n-1$ steps, not $n$."),
  Q(208,"prb","fill",20,"core",0,"Complete conditional probability: $P(A\\,|\\,B)=\\dfrac{P(A\\cap B)}{\\boxed{?}}$",
    ["$P(B)$","$P(A)$","$P(A\\cup B)$","$1-P(B)$"],"Conditional probability","Divide by the probability of the given event $B$."),
  Q(209,"sta","fill",20,"core",0,"Complete the z-score: $z=\\dfrac{x-\\mu}{\\boxed{?}}$",
    ["$\\sigma$","$\\mu$","$n$","$\\sigma^2$"],"Z-score","Standardize by dividing by the standard deviation $\\sigma$."),
  Q(210,"mat","fill",20,"core",0,"Complete the inverse: $A^{-1}=\\dfrac{1}{\\det A}\\cdot\\boxed{?}$",
    ["$\\operatorname{adj}A$","$A^T$","$A^2$","$-A$"],"Matrix inverse","Adjugate over determinant; exists only when $\\det A\\ne 0$."),
  Q(211,"vec","fill",20,"core",0,"Complete the magnitude: $|\\vec{v}|=\\sqrt{x^2+\\boxed{?}}$",
    ["$y^2$","$y$","$2y$","$x^2$"],"Vector magnitude","Pythagoras in component form: $\\sqrt{x^2+y^2}$."),
  Q(212,"cpx","fill",20,"core",0,"Complete the modulus: $|a+bi|=\\sqrt{a^2+\\boxed{?}}$",
    ["$b^2$","$b$","$i^2$","$2ab$"],"Complex modulus","Distance from the origin: $\\sqrt{a^2+b^2}$."),
  Q(213,"cal","fill",20,"core",0,"Complete the product rule: $(uv)'=u'v+\\boxed{?}$",
    ["$uv'$","$u'v'$","$uv$","$u+v'$"],"Product rule","Differentiate one factor at a time and add: $u'v+uv'$."),
];

import { PACK_QUESTIONS } from "./packs";
import { ENGLISH_QUESTIONS } from "./english";
import { PHYSICS_QUESTIONS } from "./physics";
import { TOPICS, type Subject } from "./topics";

export const QUESTIONS: Question[] = [...BASE_QUESTIONS, ...PACK_QUESTIONS, ...ENGLISH_QUESTIONS, ...PHYSICS_QUESTIONS];

export const questionsForTopic = (topic: TopicId) =>
  QUESTIONS.filter((q) => q.topic === topic);

const SUBJECT_OF = new Map<TopicId, Subject>(TOPICS.map((t) => [t.id, t.subject]));

export const questionsForSubject = (subject: Subject) =>
  QUESTIONS.filter((q) => SUBJECT_OF.get(q.topic) === subject);
