"use client";

import katex from "katex";
import { useMemo } from "react";

// Lucide "arrow-right", inlined so prose arrows match the app's icon set.
const ARROW_SVG =
  '<svg class="lucide-inline" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="then"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/**
 * Renders a string that mixes prose and $...$ math segments.
 * `block` renders a single display-mode formula (whole string is LaTeX).
 * A literal → in prose becomes a Lucide arrow-right icon.
 */
export function Tex({ s, block = false, className }: { s: string; block?: boolean; className?: string }) {
  const html = useMemo(() => {
    const render = (tex: string, displayMode: boolean) =>
      katex.renderToString(tex, { throwOnError: false, displayMode });
    if (block) return render(s, true);
    // split on $...$ (unescaped)
    return s
      .split(/(\$[^$]+\$)/g)
      .map((seg) =>
        seg.startsWith("$") && seg.endsWith("$")
          ? render(seg.slice(1, -1), false)
          : seg
              .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
              .replace(/→/g, ARROW_SVG),
      )
      .join("");
  }, [s, block]);

  return block
    ? <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
    : <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
