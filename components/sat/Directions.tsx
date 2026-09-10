"use client";

import type { SatSectionId } from "@/lib/sat/types";

/**
 * The section directions Bluebook keeps behind the "Directions" disclosure,
 * plus the student-produced response rules and the examples table that the
 * real app shows alongside every grid-in question.
 *
 * Wording follows the published directions closely because the formatting
 * rules ARE the content here - a paraphrase would teach the wrong rule.
 */

const SPR_EXAMPLES: [string, string, string][] = [
  ["3.5", "3.5, 3.50, 7/2", "3 1/2, 31/2"],
  ["2/3", "2/3, .6666, .6667, 0.6666, 0.6667", "0.66, .66"],
  ["-1/3", "-1/3, -.3333, -0.333", "-.33, -0.33"],
];

export function Directions({ section, spr }: { section: SatSectionId; spr: boolean }) {
  return (
    <div className="bb-dir">
      {section === "math" ? (
        <>
          <h2>Directions</h2>
          <p>
            The questions in this section address a number of important math skills. Use of a
            calculator is permitted for all questions. A reference sheet, calculator, and these
            directions can be accessed throughout the test.
          </p>
          <p><b>Unless otherwise indicated:</b></p>
          <ul>
            <li>All variables and expressions represent real numbers.</li>
            <li>Figures provided are drawn to scale.</li>
            <li>All figures lie in a plane.</li>
            <li>
              The domain of a given function <i>f</i> is the set of all real numbers <i>x</i> for
              which <i>f</i>(<i>x</i>) is a real number.
            </li>
          </ul>
          <p>
            For <b>multiple-choice questions</b>, solve each problem and choose the correct answer
            from the choices provided. Each multiple-choice question has a single correct answer.
          </p>
          <p>
            For <b>student-produced response questions</b>, solve each problem and enter your
            answer as described below.
          </p>
        </>
      ) : (
        <>
          <h2>Directions</h2>
          <p>
            The questions in this section address a number of important reading and writing skills.
            Each question includes one or more passages, which may include a table or graph. Read
            each passage and question carefully, and then choose the best answer to the question
            based on the passage or passages.
          </p>
          <p>
            All questions in this section are multiple-choice with four answer choices. Each
            question has a single best answer.
          </p>
        </>
      )}

      {spr && (
        <>
          <h3>Student-produced response directions</h3>
          <ul>
            <li>If you find <b>more than one correct answer</b>, enter only one answer.</li>
            <li>
              You can enter up to 5 characters for a <b>positive</b> answer and up to 6 characters
              (including the negative sign) for a <b>negative</b> answer.
            </li>
            <li>
              If your answer is a <b>fraction</b> that doesn&rsquo;t fit in the provided space,
              enter the decimal equivalent.
            </li>
            <li>
              If your answer is a <b>decimal</b> that doesn&rsquo;t fit in the provided space,
              enter it by truncating or rounding at the fourth digit.
            </li>
            <li>
              If your answer is a <b>mixed number</b> (such as 3½), enter it as an improper
              fraction (7/2) or its decimal equivalent (3.5).
            </li>
            <li>
              Don&rsquo;t enter <b>symbols</b> such as a percent sign, comma, or dollar sign.
            </li>
          </ul>

          <p className="bb-dir-exh">Examples</p>
          <table className="bb-dir-tab">
            <thead>
              <tr>
                <th>Answer</th>
                <th>Acceptable ways to enter answer</th>
                <th>Unacceptable: will NOT receive credit</th>
              </tr>
            </thead>
            <tbody>
              {SPR_EXAMPLES.map(([a, ok, no]) => (
                <tr key={a}>
                  <td>{a}</td>
                  <td>{ok}</td>
                  <td>{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
