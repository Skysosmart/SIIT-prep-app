/**
 * Digital SAT practice - Form A, Math.
 *
 * ALL items are ORIGINAL, written from scratch for this app against the
 * published College Board blueprint (lib/sat/spec.ts). No College Board
 * material, no excerpted or adapted published questions.
 *
 * Order is AUTHORED order and is load-bearing: every multiple-choice item
 * first, then the grid-ins, each run easiest-to-hardest, domains mixed - which
 * is how the real digital SAT math module is arranged. Do not sort this array.
 * Choice order is also authored and must never be shuffled.
 *
 * ids 5301-5599.
 */

import type { SatMcq, SatSectionForm, SatSpr } from "../types";
import { M, MP, S } from "./mathFactory";

// ---------------------------------------------------------------------------
// Module 1 - the fixed broad mix every student sees first.
// 8 Algebra / 7 Advanced Math / 4 Problem-Solving and Data Analysis / 3 Geometry.
// ---------------------------------------------------------------------------
const M1: (SatMcq | SatSpr)[] = [
  // -- multiple choice, easiest first --------------------------------------
  M(5301, "alg", "E", 1,
    "If $3x + 7 = 22$, what is the value of $x$?",
    ["3", "5", "7", "15"],
    "Linear equations in one variable",
    "Subtract 7 from both sides to get $3x = 15$, then divide by 3: $x = 5$."),

  M(5302, "alg", "E", 0,
    "The function $f$ is defined by $f(x) = 4x - 9$. What is the value of $f(5)$?",
    ["11", "$-9$", "20", "29"],
    "Linear functions",
    "Substitute 5 for $x$: $f(5) = 4(5) - 9 = 20 - 9 = 11$."),

  M(5303, "psda", "E", 0,
    "A jacket originally priced at 1,200 baht is on sale for 15% off. What is the sale price, in baht?",
    ["1,020", "1,050", "1,150", "1,185"],
    "Percentages",
    "A 15% discount leaves 85% of the price: $0.85 \\times 1200 = 1020$ baht."),

  M(5304, "adv", "E", 0,
    "Which expression is equivalent to $(x + 3)(x - 5)$?",
    ["$x^2 - 2x - 15$", "$x^2 + 2x - 15$", "$x^2 - 15$", "$x^2 - 8x - 15$"],
    "Equivalent expressions",
    "Expand: $x^2 - 5x + 3x - 15 = x^2 - 2x - 15$."),

  M(5305, "geo", "E", 1,
    "In a triangle, two of the angles measure $40^\\circ$ and $75^\\circ$. What is the measure of the third angle?",
    ["$55^\\circ$", "$65^\\circ$", "$75^\\circ$", "$115^\\circ$"],
    "Lines, angles, and triangles",
    "The three angles of a triangle sum to $180^\\circ$, so the third is $180 - 40 - 75 = 65^\\circ$.",
    '<svg viewBox="0 0 220 150" stroke="currentColor" fill="none" stroke-width="2" role="img"><polygon points="30,120 195,120 90,25" /><text x="48" y="112" fill="currentColor" stroke="none" font-size="12">40&#176;</text><text x="163" y="112" fill="currentColor" stroke="none" font-size="12">75&#176;</text><text x="84" y="45" fill="currentColor" stroke="none" font-size="12">?</text></svg>'),

  MP(5306, "alg", "E", 0,
    "The equation $2x + 5y = 20$ represents a line in the $xy$-plane. What is the $y$-intercept of this line?",
    ["$(0, 4)$", "$(0, 5)$", "$(10, 0)$", "$(0, 20)$"],
    "Linear equations in two variables",
    "The $y$-intercept is where $x = 0$. Then $5y = 20$, so $y = 4$ and the point is $(0, 4)$."),

  M(5307, "alg", "M", 2,
    "If $x + y = 12$ and $x - y = 4$, what is the value of $x$?",
    ["4", "6", "8", "16"],
    "Systems of two linear equations in two variables",
    "Adding the two equations eliminates $y$: $2x = 16$, so $x = 8$."),

  M(5308, "adv", "M", 0,
    "What are the solutions to $x^2 - 6x + 8 = 0$?",
    ["$x = 2$ and $x = 4$", "$x = -2$ and $x = -4$", "$x = 1$ and $x = 8$", "$x = -1$ and $x = -8$"],
    "Nonlinear equations in one variable",
    "Factor: $x^2 - 6x + 8 = (x - 2)(x - 4)$, so $x = 2$ or $x = 4$."),

  M(5309, "psda", "M", 2,
    "A machine fills 250 bottles in 8 minutes at a constant rate. At this rate, how many bottles does it fill in 60 minutes?",
    ["1,650", "1,750", "1,875", "2,000"],
    "Ratios, rates, proportional relationships, and units",
    "The rate is $250 \\div 8 = 31.25$ bottles per minute, and $31.25 \\times 60 = 1875$ bottles."),

  M(5310, "adv", "M", 0,
    "A population of bacteria doubles every 3 hours. If the population is 500 when $t = 0$, which function gives the population after $t$ hours?",
    ["$P(t) = 500(2)^{t/3}$", "$P(t) = 500(2)^{3t}$", "$P(t) = 500(3)^{t/2}$", "$P(t) = 500 + \\dfrac{2t}{3}$"],
    "Nonlinear functions",
    "Doubling every 3 hours means the exponent counts 3-hour periods, so it is $t/3$. Check $t = 3$: $500(2)^1 = 1000$."),

  M(5311, "alg", "M", 0,
    "Which value of $x$ satisfies $-3x + 4 > 13$?",
    ["$x = -4$", "$x = -2$", "$x = 0$", "$x = 3$"],
    "Linear inequalities in one or two variables",
    "Subtract 4: $-3x > 9$. Dividing by $-3$ reverses the inequality, giving $x < -3$. Of the choices only $-4$ is less than $-3$."),

  M(5312, "geo", "M", 0,
    "A circle in the $xy$-plane has the equation $(x - 2)^2 + (y + 3)^2 = 49$. What is the radius of the circle?",
    ["7", "24.5", "49", "$\\sqrt{2}$"],
    "Circles",
    "In the form $(x - h)^2 + (y - k)^2 = r^2$, the right side is $r^2$. Since $r^2 = 49$, the radius is $r = 7$."),

  M(5313, "adv", "M", 1,
    "At how many points do the graphs of $y = x^2$ and $y = 4x - 4$ intersect?",
    ["Zero", "Exactly one", "Exactly two", "Infinitely many"],
    "Nonlinear equations in two variables and systems of equations",
    "Set them equal: $x^2 = 4x - 4$, so $x^2 - 4x + 4 = 0$, which factors as $(x - 2)^2 = 0$. The repeated root $x = 2$ means the line is tangent to the parabola - one intersection point."),

  M(5314, "adv", "H", 0,
    "Which expression is equivalent to $\\dfrac{2x^2 + 5x - 3}{x + 3}$, where $x \\neq -3$?",
    ["$2x - 1$", "$2x + 1$", "$2x - 3$", "$x - 1$"],
    "Equivalent expressions",
    "Factor the numerator: $2x^2 + 5x - 3 = (2x - 1)(x + 3)$. Cancelling $x + 3$ leaves $2x - 1$."),

  M(5315, "alg", "H", 0,
    "A technician charges a fixed call-out fee plus an hourly rate. The total cost $C$, in baht, for $h$ hours of work is given by $C = 450h + 800$. Which of the following is the best interpretation of the number 450 in this context?",
    ["The cost increases by 450 baht for each additional hour worked.",
     "The call-out fee is 450 baht.",
     "The total cost is 450 baht when no hours are worked.",
     "The technician works for 450 hours."],
    "Linear functions",
    "450 multiplies $h$, so it is the rate of change: each additional hour adds 450 baht. The fixed call-out fee is the constant term, 800."),

  MP(5316, "psda", "H", 0,
    "A random sample of 400 students at a large university reported a mean study time of 14.2 hours per week, with an associated margin of error of 0.8 hours at the 95% confidence level. Which conclusion is most appropriate?",
    ["It is plausible that the mean study time for all students at the university is between 13.4 and 15.0 hours.",
     "Every student at the university studies between 13.4 and 15.0 hours per week.",
     "The mean study time for all students at the university is exactly 14.2 hours.",
     "No conclusion about the university can be drawn, because only 400 students were surveyed."],
    "Inference from sample statistics and margin of error",
    "A margin of error gives a plausible interval for the population MEAN: $14.2 \\pm 0.8$, that is 13.4 to 15.0 hours. It says nothing about individual students, and a properly drawn random sample does support an inference about the whole population."),

  M(5317, "adv", "H", 0,
    "What is the sum of all values of $x$ that satisfy $|2x - 5| = 9$?",
    ["5", "7", "9", "14"],
    "Nonlinear equations in one variable",
    "An absolute value equation splits in two: $2x - 5 = 9$ gives $x = 7$, and $2x - 5 = -9$ gives $x = -2$. Their sum is $7 + (-2) = 5$."),

  // -- student-produced response, easiest first ----------------------------
  S(5318, "alg", "E", ["7"],
    "If $5x - 8 = 27$, what is the value of $x$?",
    "Linear equations in one variable",
    "Add 8 to both sides: $5x = 35$. Divide by 5: $x = 7$."),

  S(5319, "psda", "E", ["100"],
    "In a survey of 250 people, 40% reported that they commute by train. How many of the people surveyed reported that they commute by train?",
    "Percentages",
    "$0.40 \\times 250 = 100$ people."),

  S(5320, "alg", "M", ["7/6"],
    "If $6x + 5 = 12$, what is the value of $x$?",
    "Linear equations in one variable",
    "Subtract 5: $6x = 7$, so $x = \\dfrac{7}{6}$. The grid accepts the fraction 7/6, or the decimal filled to the last digit that fits: 1.166 or 1.167. A shorter decimal such as 1.16 is marked wrong."),

  S(5321, "geo", "M", ["8"],
    "In a right triangle, one leg has length 6 and the hypotenuse has length 10. What is the length of the other leg?",
    "Right triangles and trigonometry",
    "By the Pythagorean theorem, $6^2 + b^2 = 10^2$, so $b^2 = 100 - 36 = 64$ and $b = 8$.",
    '<svg viewBox="0 0 210 150" stroke="currentColor" fill="none" stroke-width="2" role="img"><polygon points="35,120 180,120 35,25" /><polyline points="35,106 49,106 49,120" stroke-width="1.4" /><text x="105" y="140" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">?</text><text x="18" y="75" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">6</text><text x="130" y="60" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">10</text></svg>'),

  S(5322, "adv", "H", ["1/2", ".5"],
    "The function $f$ is defined by $f(x) = 2x^2 - 7x + 3$. What is the smaller of the two values of $x$ for which $f(x) = 0$?",
    "Nonlinear equations in one variable",
    "Factor: $2x^2 - 7x + 3 = (2x - 1)(x - 3)$, so $x = \\dfrac{1}{2}$ or $x = 3$. The smaller value is $\\dfrac{1}{2}$, which you may enter as 1/2 or .5."),
];

// ---------------------------------------------------------------------------
// Module 2, LOWER route - reached when module 1 went badly. Same blueprint,
// same 22 items, but weighted toward the easy end (E 12 / M 8 / H 2).
// ---------------------------------------------------------------------------
const M2_LOWER: (SatMcq | SatSpr)[] = [
  M(5401, "alg", "E", 1,
    "If $x + 9 = 17$, what is the value of $x$?",
    ["6", "8", "17", "26"],
    "Linear equations in one variable",
    "Subtract 9 from both sides: $x = 8$."),

  M(5402, "alg", "E", 2,
    "The function $f$ is defined by $f(x) = 3x + 2$. What is the value of $f(4)$?",
    ["9", "12", "14", "20"],
    "Linear functions",
    "Substitute 4 for $x$: $f(4) = 3(4) + 2 = 14$."),

  M(5403, "psda", "E", 1,
    "A recipe uses 3 cups of flour for every 2 cups of sugar. If a baker uses 12 cups of flour, how many cups of sugar are needed?",
    ["6", "8", "9", "18"],
    "Ratios, rates, proportional relationships, and units",
    "Set up the proportion $\\dfrac{3}{2} = \\dfrac{12}{s}$. Cross-multiplying gives $3s = 24$, so $s = 8$."),

  M(5404, "adv", "E", 0,
    "Which expression is equivalent to $x^2 + 7x + 12$?",
    ["$(x + 3)(x + 4)$", "$(x + 2)(x + 6)$", "$(x + 1)(x + 12)$", "$(x - 3)(x - 4)$"],
    "Equivalent expressions",
    "Look for two numbers that multiply to 12 and add to 7: 3 and 4. So $x^2 + 7x + 12 = (x+3)(x+4)$."),

  M(5405, "geo", "E", 2,
    "A rectangle has a length of 9 centimeters and a width of 4 centimeters. What is its area, in square centimeters?",
    ["13", "26", "36", "72"],
    "Area and volume",
    "Area of a rectangle is length times width: $9 \\times 4 = 36$."),

  MP(5406, "alg", "E", 2,
    "If $2x = 18$, what is the value of $5x$?",
    ["23", "36", "45", "90"],
    "Linear equations in one variable",
    "From $2x = 18$, $x = 9$. Then $5x = 5(9) = 45$."),

  M(5407, "adv", "E", 1,
    "The function $f$ is defined by $f(x) = x^2 - 1$. What is the value of $f(3)$?",
    ["5", "8", "9", "10"],
    "Nonlinear functions",
    "Substitute 3: $f(3) = 3^2 - 1 = 9 - 1 = 8$."),

  MP(5408, "psda", "E", 2,
    "What is 25% of 160?",
    ["4", "32", "40", "64"],
    "Percentages",
    "$0.25 \\times 160 = 40$. A quarter of 160 is 40."),

  M(5409, "alg", "E", 2,
    "Which of the following points lies on the line $y = 2x - 1$ in the $xy$-plane?",
    ["$(1, 3)$", "$(2, 2)$", "$(3, 5)$", "$(4, 6)$"],
    "Linear equations in two variables",
    "Test each point. For $(3, 5)$: $2(3) - 1 = 5$, which matches. The others do not satisfy the equation."),

  M(5410, "adv", "E", 0,
    "Which expression is equivalent to $3(x + 4) - 2x$?",
    ["$x + 12$", "$x + 4$", "$5x + 12$", "$x + 7$"],
    "Equivalent expressions",
    "Distribute first: $3x + 12 - 2x$. Combining like terms gives $x + 12$."),

  M(5411, "alg", "M", 2,
    "If $\\dfrac{x}{4} + 3 = 7$, what is the value of $x$?",
    ["4", "10", "16", "28"],
    "Linear equations in one variable",
    "Subtract 3: $\\dfrac{x}{4} = 4$. Multiply both sides by 4: $x = 16$."),

  M(5412, "adv", "M", 1,
    "What are the solutions to $x^2 - 9 = 0$?",
    ["$x = 3$ only", "$x = 3$ and $x = -3$", "$x = 9$ and $x = -9$", "$x = 81$"],
    "Nonlinear equations in one variable",
    "$x^2 = 9$ has two solutions, since both $3^2$ and $(-3)^2$ equal 9. Forgetting the negative root is the most common slip here."),

  M(5413, "psda", "M", 2,
    "A car travels 180 kilometers in 3 hours. At this constant rate, how far will it travel in 5 hours?",
    ["240", "270", "300", "360"],
    "Ratios, rates, proportional relationships, and units",
    "The rate is $180 \\div 3 = 60$ kilometers per hour, and $60 \\times 5 = 300$ kilometers."),

  M(5414, "geo", "M", 3,
    "The perimeter of a square is 36 centimeters. What is the area of the square, in square centimeters?",
    ["9", "18", "72", "81"],
    "Area and volume",
    "A square's perimeter is four times its side, so the side is $36 \\div 4 = 9$. The area is $9^2 = 81$."),

  M(5415, "alg", "M", 2,
    "If $3x - 5 = 2x + 4$, what is the value of $x$?",
    ["$-1$", "1", "9", "$-9$"],
    "Linear equations in one variable",
    "Subtract $2x$ from both sides: $x - 5 = 4$. Add 5: $x = 9$."),

  M(5416, "adv", "M", 2,
    "The function $g$ is defined by $g(x) = 2^x$. What is the value of $g(5)$?",
    ["10", "25", "32", "64"],
    "Nonlinear functions",
    "$g(5) = 2^5 = 32$. Note that $2^5$ is not $2 \\times 5$."),

  M(5417, "adv", "H", 0,
    "If $x + \\dfrac{1}{x} = 5$, what is the value of $x^2 + \\dfrac{1}{x^2}$?",
    ["23", "25", "27", "10"],
    "Equivalent expressions",
    "Square both sides: $\\left(x + \\dfrac{1}{x}\\right)^2 = x^2 + 2 + \\dfrac{1}{x^2} = 25$. Subtracting the middle term 2 gives $x^2 + \\dfrac{1}{x^2} = 23$."),

  S(5418, "alg", "E", ["17"],
    "If $x - 6 = 11$, what is the value of $x$?",
    "Linear equations in one variable",
    "Add 6 to both sides: $x = 17$."),

  S(5419, "psda", "E", ["120"],
    "A store sells 8 identical shirts for a total of 960 baht. At this rate, what is the price of one shirt, in baht?",
    "Ratios, rates, proportional relationships, and units",
    "$960 \\div 8 = 120$ baht per shirt."),

  S(5420, "alg", "M", ["15"],
    "If $\\dfrac{2x}{5} = 6$, what is the value of $x$?",
    "Linear equations in one variable",
    "Multiply both sides by 5: $2x = 30$. Divide by 2: $x = 15$."),

  S(5421, "geo", "M", ["13"],
    "A right triangle has legs of length 5 and 12. What is the length of its hypotenuse?",
    "Right triangles and trigonometry",
    "By the Pythagorean theorem, $5^2 + 12^2 = 25 + 144 = 169$, and $\\sqrt{169} = 13$.",
    '<svg viewBox="0 0 210 150" stroke="currentColor" fill="none" stroke-width="2" role="img"><polygon points="35,120 180,120 35,25" /><polyline points="35,106 49,106 49,120" stroke-width="1.4" /><text x="105" y="140" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">12</text><text x="18" y="75" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">5</text><text x="130" y="60" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">?</text></svg>'),

  S(5422, "adv", "H", ["4"],
    "The function $f$ is defined by $f(x) = x^2 - 4x + 3$. What is the sum of the two values of $x$ for which $f(x) = 0$?",
    "Nonlinear equations in one variable",
    "Factor: $x^2 - 4x + 3 = (x - 1)(x - 3)$, so the solutions are $x = 1$ and $x = 3$, and their sum is 4."),
];

// ---------------------------------------------------------------------------
// Module 2, UPPER route - reached when module 1 went well. Same blueprint,
// same 22 items, weighted toward the hard end (E 2 / M 8 / H 12). This is the
// only route that can reach the top of the scale, which is why SIIT's Math 620
// is out of reach without it.
// ---------------------------------------------------------------------------
const M2_UPPER: (SatMcq | SatSpr)[] = [
  M(5501, "alg", "E", 1,
    "If $5x = 45$, what is the value of $x$?",
    ["5", "9", "40", "225"],
    "Linear equations in one variable",
    "Divide both sides by 5: $x = 9$."),

  M(5502, "adv", "E", 0,
    "Which expression is equivalent to $(2x)^3$?",
    ["$8x^3$", "$6x^3$", "$2x^3$", "$6x$"],
    "Equivalent expressions",
    "The exponent applies to the whole product: $(2x)^3 = 2^3 \\cdot x^3 = 8x^3$. Only cubing the $x$ is the common error."),

  MP(5503, "alg", "M", 1,
    "In the $xy$-plane, the line $y = mx + 4$ passes through the point $(2, 10)$. What is the value of $m$?",
    ["2", "3", "4", "6"],
    "Linear equations in two variables",
    "Substitute the point: $10 = m(2) + 4$, so $2m = 6$ and $m = 3$."),

  MP(5504, "psda", "M", 1,
    "The mean of five numbers is 14. Four of the numbers are 10, 12, 16, and 18. What is the fifth number?",
    ["12", "14", "16", "20"],
    "One-variable data: distributions and measures of center and spread",
    "A mean of 14 across five numbers means the total is $5 \\times 14 = 70$. The four known numbers sum to 56, so the fifth is $70 - 56 = 14$."),

  M(5505, "adv", "M", 1,
    "What is the sum of the solutions to $x^2 - 7x + 10 = 0$?",
    ["5", "7", "10", "$-7$"],
    "Nonlinear equations in one variable",
    "Factoring gives $(x - 2)(x - 5) = 0$, so the solutions are 2 and 5 and their sum is 7. (For $x^2 + bx + c$, the sum of the roots is always $-b$.)"),

  M(5506, "geo", "M", 0,
    "A circle has a circumference of $12\\pi$. What is the area of the circle?",
    ["$36\\pi$", "$12\\pi$", "$144\\pi$", "$6\\pi$"],
    "Circles",
    "From $C = 2\\pi r = 12\\pi$, the radius is $r = 6$. Then $A = \\pi r^2 = 36\\pi$."),

  M(5507, "alg", "M", 0,
    "If $2x + 3y = 18$ and $y = 2x$, what is the value of $x$?",
    ["$\\dfrac{9}{4}$", "$\\dfrac{4}{9}$", "2", "3"],
    "Systems of two linear equations in two variables",
    "Substitute $y = 2x$ into the first equation: $2x + 3(2x) = 8x = 18$, so $x = \\dfrac{9}{4}$."),

  M(5508, "adv", "M", 1,
    "If $3^{x} = 81$, what is the value of $x$?",
    ["3", "4", "27", "243"],
    "Nonlinear equations in one variable",
    "Write 81 as a power of 3: $81 = 3^4$, so $x = 4$."),

  M(5509, "alg", "H", 0,
    "In the $xy$-plane, the line $y = 3x + b$ passes through the point $(-2, 1)$. What is the $y$-intercept of the line?",
    ["$(0, 7)$", "$(0, -5)$", "$(0, 1)$", "$(0, -7)$"],
    "Linear equations in two variables",
    "Substitute the point: $1 = 3(-2) + b = -6 + b$, so $b = 7$. In $y = mx + b$, $b$ is the $y$-intercept, giving $(0, 7)$."),

  M(5510, "adv", "H", 0,
    "Which expression is equivalent to $\\dfrac{x^2 - 9}{x^2 + 6x + 9}$, where $x \\neq -3$?",
    ["$\\dfrac{x - 3}{x + 3}$", "$\\dfrac{x + 3}{x - 3}$", "$\\dfrac{x - 9}{x + 9}$", "$\\dfrac{1}{x + 3}$"],
    "Equivalent expressions",
    "Factor both parts: the numerator is a difference of squares, $(x-3)(x+3)$, and the denominator is a perfect square, $(x+3)^2$. Cancelling one $(x+3)$ leaves $\\dfrac{x-3}{x+3}$."),

  M(5511, "psda", "H", 0,
    "A researcher surveys 200 randomly selected residents of a city and finds that 62% support building a new park, with a margin of error of 4 percentage points. Which statement is best supported by these results?",
    ["It is plausible that between 58% and 66% of all residents of the city support the park.",
     "Exactly 62% of all residents of the city support the park.",
     "Between 58% and 66% of the 200 residents surveyed support the park.",
     "No conclusion about the city's residents can be drawn from a sample of 200."],
    "Inference from sample statistics and margin of error",
    "The margin of error gives a plausible interval for the POPULATION value: $62\\% \\pm 4\\%$, that is 58% to 66%. The sample percentage itself is known exactly (62%), and a random sample does support an inference about the whole city."),

  M(5512, "alg", "H", 2,
    "A gym charges a one-time joining fee plus a fixed monthly fee. A member who has paid for 6 months has paid 4,700 baht in total, and a member who has paid for 10 months has paid 7,100 baht in total. What is the monthly fee, in baht?",
    ["400", "500", "600", "700"],
    "Linear functions",
    "The extra 4 months cost $7{,}100 - 4{,}700 = 2{,}400$ baht, so the monthly fee is $2{,}400 \\div 4 = 600$ baht. (The joining fee is then $4{,}700 - 6(600) = 1{,}100$ baht.)"),

  M(5513, "adv", "H", 0,
    "The function $f$ is defined by $f(x) = 2(x - 3)^2 + 5$. What is the minimum value of $f(x)$?",
    ["5", "3", "$-3$", "2"],
    "Nonlinear functions",
    "The squared term $2(x-3)^2$ is never negative and equals 0 when $x = 3$. So the smallest possible value of $f$ is $0 + 5 = 5$, reached at $x = 3$."),

  M(5514, "geo", "H", 0,
    "In a right triangle, one acute angle measures $\\theta$. The side opposite $\\theta$ has length 7 and the hypotenuse has length 25. What is the value of $\\cos\\theta$?",
    ["$\\dfrac{24}{25}$", "$\\dfrac{7}{25}$", "$\\dfrac{7}{24}$", "$\\dfrac{25}{24}$"],
    "Right triangles and trigonometry",
    "First find the adjacent side: $\\sqrt{25^2 - 7^2} = \\sqrt{625 - 49} = \\sqrt{576} = 24$. Then $\\cos\\theta = \\dfrac{\\text{adjacent}}{\\text{hypotenuse}} = \\dfrac{24}{25}$.",
    '<svg viewBox="0 0 210 150" stroke="currentColor" fill="none" stroke-width="2" role="img"><polygon points="35,120 180,120 35,25" /><polyline points="35,106 49,106 49,120" stroke-width="1.4" /><text x="105" y="140" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">?</text><text x="18" y="75" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">7</text><text x="130" y="60" fill="currentColor" stroke="none" font-size="13" text-anchor="middle">25</text><text x="150" y="112" fill="currentColor" stroke="none" font-size="12">&#952;</text></svg>'),

  M(5515, "alg", "H", 0,
    "Which of the following describes all solutions to $|x - 4| < 3$?",
    ["$1 < x < 7$", "$x < 1$ or $x > 7$", "$-7 < x < -1$", "$x < 7$"],
    "Linear inequalities in one or two variables",
    "An absolute value less than 3 means the expression lies between $-3$ and 3: $-3 < x - 4 < 3$. Adding 4 throughout gives $1 < x < 7$."),

  M(5516, "adv", "H", 0,
    "The functions $f$ and $g$ are defined by $f(x) = x^2$ and $g(x) = 2x - 1$. What is the value of $f(g(3))$?",
    ["25", "17", "11", "36"],
    "Nonlinear functions",
    "Work from the inside out: $g(3) = 2(3) - 1 = 5$, then $f(5) = 5^2 = 25$. Evaluating in the other order would give $g(f(3)) = 17$, which is the trap."),

  M(5517, "psda", "H", 0,
    "In a group of 80 students, 45 study French, 35 study German, and 12 study both languages. How many of the students study neither language?",
    ["12", "20", "24", "32"],
    "Two-variable data: models and scatterplots",
    "Students studying at least one language: $45 + 35 - 12 = 68$ (subtracting the 12 counted twice). So $80 - 68 = 12$ study neither."),

  S(5518, "alg", "M", ["12"],
    "If $\\dfrac{3x}{4} = 9$, what is the value of $x$?",
    "Linear equations in one variable",
    "Multiply both sides by 4: $3x = 36$. Divide by 3: $x = 12$."),

  S(5519, "psda", "M", ["600"],
    "A shirt is discounted by 20%, giving a sale price of 480 baht. What was the original price, in baht?",
    "Percentages",
    "The sale price is 80% of the original, so $0.80p = 480$ and $p = 480 \\div 0.80 = 600$ baht. Adding 20% back to 480 gives 576, which is the common wrong answer."),

  S(5520, "alg", "H", ["7/2", "3.5"],
    "If $5x + 2 = 3x + 9$, what is the value of $x$?",
    "Linear equations in one variable",
    "Subtract $3x$: $2x + 2 = 9$. Subtract 2: $2x = 7$, so $x = \\dfrac{7}{2}$. You may enter 7/2 or 3.5."),

  S(5521, "geo", "H", ["144"],
    "A right circular cylinder has a radius of 4 and a height of 9. The volume of the cylinder is $k\\pi$. What is the value of $k$?",
    "Area and volume",
    "The volume is $\\pi r^2 h = \\pi(4^2)(9) = 144\\pi$, so $k = 144$.",
    '<svg viewBox="0 0 200 160" stroke="currentColor" fill="none" stroke-width="2" role="img"><ellipse cx="100" cy="35" rx="45" ry="15" /><ellipse cx="100" cy="125" rx="45" ry="15" /><line x1="55" y1="35" x2="55" y2="125" /><line x1="145" y1="35" x2="145" y2="125" /><line x1="100" y1="35" x2="145" y2="35" stroke-dasharray="4 3" stroke-width="1.4" /><text x="120" y="30" fill="currentColor" stroke="none" font-size="12">4</text><text x="160" y="85" fill="currentColor" stroke="none" font-size="12">9</text></svg>'),

  S(5522, "adv", "H", ["1/3"],
    "The function $f$ is defined by $f(x) = 3x^2 - 10x + 3$. What is the smaller of the two values of $x$ for which $f(x) = 0$?",
    "Nonlinear equations in one variable",
    "Factor: $3x^2 - 10x + 3 = (3x - 1)(x - 3)$, so $x = \\dfrac{1}{3}$ or $x = 3$. The smaller is $\\dfrac{1}{3}$. As a decimal it repeats, so the grid must be filled: .3333."),
];

export const FORM_A_MATH: SatSectionForm = {
  m1: M1,
  lower: M2_LOWER,
  upper: M2_UPPER,
};
