"use client";

import { Tex } from "@/components/Tex";
import { ToolPanel } from "./ToolPanel";

/**
 * The reference sheet the digital SAT provides for the whole Math section.
 * Contents match the published sheet - these are the only formulas a student
 * is given, which is exactly why it is worth showing: everything else has to
 * be recalled.
 */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" } as const;

const CIRCLE = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <circle cx="32" cy="28" r="20" {...S} />
    <line x1="32" y1="28" x2="52" y2="28" {...S} />
    <circle cx="32" cy="28" r="1.8" fill="currentColor" stroke="none" />
    <text x="41" y="24" fontSize="9" fill="currentColor" fontStyle="italic">r</text>
  </svg>
);

const RECT = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <rect x="10" y="14" width="48" height="28" {...S} />
    <text x="31" y="52" fontSize="9" fill="currentColor" fontStyle="italic">l</text>
    <text x="61" y="31" fontSize="9" fill="currentColor" fontStyle="italic">w</text>
  </svg>
);

const TRI = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <path d="M8 44 L60 44 L38 12 Z" {...S} />
    <line x1="38" y1="12" x2="38" y2="44" strokeDasharray="3 3" {...S} />
    <path d="M38 39 h5 v5" {...S} />
    <text x="31" y="53" fontSize="9" fill="currentColor" fontStyle="italic">b</text>
    <text x="41" y="30" fontSize="9" fill="currentColor" fontStyle="italic">h</text>
  </svg>
);

const PYTH = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <path d="M12 44 L56 44 L12 12 Z" {...S} />
    <path d="M12 39 h5 v5" {...S} />
    <text x="30" y="53" fontSize="9" fill="currentColor" fontStyle="italic">a</text>
    <text x="4" y="31" fontSize="9" fill="currentColor" fontStyle="italic">b</text>
    <text x="38" y="26" fontSize="9" fill="currentColor" fontStyle="italic">c</text>
  </svg>
);

const T306090 = (
  <svg viewBox="0 0 78 56" aria-hidden="true">
    <path d="M14 44 L62 44 L14 16 Z" {...S} />
    <path d="M14 39 h5 v5" {...S} />
    <text x="30" y="53" fontSize="8.5" fill="currentColor">x√3</text>
    <text x="4" y="33" fontSize="8.5" fill="currentColor" fontStyle="italic">x</text>
    <text x="40" y="26" fontSize="8.5" fill="currentColor">2x</text>
    <text x="49" y="41" fontSize="7" fill="currentColor">30°</text>
    <text x="17" y="24" fontSize="7" fill="currentColor">60°</text>
  </svg>
);

const T454590 = (
  <svg viewBox="0 0 78 56" aria-hidden="true">
    <path d="M16 44 L60 44 L16 12 Z" {...S} />
    <path d="M16 39 h5 v5" {...S} />
    <text x="33" y="53" fontSize="8.5" fill="currentColor" fontStyle="italic">s</text>
    <text x="7" y="31" fontSize="8.5" fill="currentColor" fontStyle="italic">s</text>
    <text x="40" y="24" fontSize="8.5" fill="currentColor">s√2</text>
    <text x="45" y="41" fontSize="7" fill="currentColor">45°</text>
  </svg>
);

const BOX = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <path d="M12 20 h34 v22 h-34 Z" {...S} />
    <path d="M12 20 l10-8 h34 l-10 8" {...S} />
    <path d="M46 42 l10-8 v-22" {...S} />
    <text x="27" y="52" fontSize="8.5" fill="currentColor" fontStyle="italic">l</text>
    <text x="50" y="48" fontSize="8.5" fill="currentColor" fontStyle="italic">w</text>
    <text x="4" y="33" fontSize="8.5" fill="currentColor" fontStyle="italic">h</text>
  </svg>
);

const CYL = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <ellipse cx="34" cy="14" rx="17" ry="6" {...S} />
    <path d="M17 14 v28 a17 6 0 0 0 34 0 V14" {...S} />
    <line x1="34" y1="14" x2="51" y2="14" {...S} />
    <text x="39" y="11" fontSize="8.5" fill="currentColor" fontStyle="italic">r</text>
    <text x="55" y="32" fontSize="8.5" fill="currentColor" fontStyle="italic">h</text>
  </svg>
);

const SPHERE = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <circle cx="34" cy="28" r="19" {...S} />
    <ellipse cx="34" cy="28" rx="19" ry="6.5" strokeDasharray="3 3" {...S} />
    <line x1="34" y1="28" x2="53" y2="28" {...S} />
    <text x="41" y="24" fontSize="8.5" fill="currentColor" fontStyle="italic">r</text>
  </svg>
);

const CONE = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <path d="M34 10 L53 42 A19 6.5 0 0 1 15 42 Z" {...S} />
    <ellipse cx="34" cy="42" rx="19" ry="6.5" strokeDasharray="3 3" {...S} />
    <line x1="34" y1="10" x2="34" y2="42" strokeDasharray="3 3" {...S} />
    <line x1="34" y1="42" x2="53" y2="42" {...S} />
    <text x="37" y="28" fontSize="8.5" fill="currentColor" fontStyle="italic">h</text>
    <text x="42" y="52" fontSize="8.5" fill="currentColor" fontStyle="italic">r</text>
  </svg>
);

const PYRAMID = (
  <svg viewBox="0 0 70 56" aria-hidden="true">
    <path d="M34 10 L14 38 L44 44 Z" {...S} />
    <path d="M34 10 L56 32 L44 44" {...S} />
    <path d="M14 38 L26 30 L56 32" strokeDasharray="3 3" {...S} />
    <path d="M26 30 L34 10" strokeDasharray="3 3" {...S} />
    <line x1="34" y1="10" x2="34" y2="35" strokeDasharray="3 3" {...S} />
    <text x="37" y="28" fontSize="8.5" fill="currentColor" fontStyle="italic">h</text>
  </svg>
);

const CARDS: { fig: React.ReactNode; tex: string[]; wide?: boolean }[] = [
  { fig: CIRCLE, tex: ["A=\\pi r^2", "C=2\\pi r"] },
  { fig: RECT, tex: ["A=\\ell w"] },
  { fig: TRI, tex: ["A=\\tfrac{1}{2}bh"] },
  { fig: PYTH, tex: ["c^2=a^2+b^2"] },
  // No caption: the real reference sheet labels these with the side lengths
  // drawn on the triangle itself, and a caption only crowds the card.
  { fig: T306090, tex: [], wide: true },
  { fig: T454590, tex: [], wide: true },
  { fig: BOX, tex: ["V=\\ell wh"] },
  { fig: CYL, tex: ["V=\\pi r^2h"] },
  { fig: SPHERE, tex: ["V=\\tfrac{4}{3}\\pi r^3"] },
  { fig: CONE, tex: ["V=\\tfrac{1}{3}\\pi r^2h"] },
  { fig: PYRAMID, tex: ["V=\\tfrac{1}{3}\\ell wh"] },
];

const FACTS = [
  "The number of degrees of arc in a circle is $360$.",
  "The number of radians of arc in a circle is $2\\pi$.",
  "The sum of the measures in degrees of the angles of a triangle is $180$.",
];

export function ReferenceSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ToolPanel
      open={open}
      onClose={onClose}
      title="Reference"
      width={430}
      height={560}
      initial={{ x: 24, y: 140 }}
      className="bb-ref"
    >
      <div className="bb-ref-grid">
        {CARDS.map((c, i) => (
          <div key={i} className={`bb-ref-card${c.wide ? " wide" : ""}`}>
            <div className="bb-ref-fig">{c.fig}</div>
            <div className="bb-ref-tex">
              {c.tex.map((t, j) => <Tex key={j} s={`$${t}$`} />)}
            </div>
          </div>
        ))}
      </div>
      <ul className="bb-ref-facts">
        {FACTS.map((f, i) => <li key={i}><Tex s={f} /></li>)}
      </ul>
    </ToolPanel>
  );
}
