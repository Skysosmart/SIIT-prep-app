"use client";

import { useState } from "react";
import { MAX_LEN, gridInputError } from "@/lib/sat/grid";

/**
 * Student-produced response entry, mirroring the digital SAT's answer grid.
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
    <div className={`grid-in${msg ? " bad" : ""}`}>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        disabled={disabled}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        maxLength={MAX_LEN + 1}
        placeholder="Answer"
        aria-label="Your answer"
      />
      {value !== "" && (
        <button type="button" className="btn btn-g btn-sm" onClick={() => set("")} disabled={disabled}>
          Clear
        </button>
      )}
      <span className="grid-in-msg">
        {msg ?? `Fraction or decimal, up to ${MAX_LEN} characters. No % or $ signs.`}
      </span>
    </div>
  );
}
