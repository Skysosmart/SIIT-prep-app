"use client";

import { useState } from "react";
import { MAX_LEN, gridInputError } from "@/lib/sat/grid";
import { Tex } from "@/components/Tex";

/**
 * Student-produced response entry, styled like Bluebook's: a single ruled box
 * with a live "Answer Preview" underneath, which is how the real app tells a
 * student what it is actually going to grade.
 *
 * Illegal keystrokes are refused outright rather than accepted and marked, so
 * the field can never hold something the grader would reject on a technicality.
 */
export function GridIn({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [msg, setMsg] = useState<string | null>(null);

  const set = (next: string) => {
    if (next === "") { setMsg(null); onChange(""); return; }
    const err = gridInputError(next);
    if (err) { setMsg(err); return; }   // refuse the keystroke
    setMsg(null);
    onChange(next);
  };

  return (
    <div className="bb-spr">
      <div className={`bb-spr-box${msg ? " bad" : ""}`}>
        <input
          value={value}
          onChange={(e) => set(e.target.value)}
          disabled={disabled}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          maxLength={MAX_LEN + 1}
          aria-label="Your answer"
        />
      </div>

      <p className="bb-spr-preview">
        <b>Answer Preview:</b>
        {value.trim() !== "" && (
          <span className="bb-spr-val"><Tex s={`$${texOf(value)}$`} /></span>
        )}
      </p>

      {msg && <p className="bb-spr-msg" role="alert">{msg}</p>}
    </div>
  );
}

/**
 * Bluebook echoes the entry back as typeset math, so a fraction is shown
 * stacked. Rendering it is the whole point of the preview: it is how a student
 * catches that "1/2x" was read as a fraction and not as half of x.
 *
 * Safe to interpolate into LaTeX: gridInputError has already rejected anything
 * outside digits, one dot, one slash and a leading minus.
 */
function texOf(raw: string): string {
  const s = raw.trim();
  const neg = s.startsWith("-");
  const sign = neg ? "-" : "";
  const body = neg ? s.slice(1) : s;
  if (body.includes("/")) {
    const [n, d] = body.split("/");
    if (n && d) return `${sign}\\frac{${n}}{${d}}`;
  }
  return sign + body;
}
