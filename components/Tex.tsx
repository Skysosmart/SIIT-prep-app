"use client";

import katex from "katex";
import { useMemo } from "react";

/**
 * Renders a string that mixes prose and $...$ math segments.
 * `block` renders a single display-mode formula (whole string is LaTeX).
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
          : seg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      )
      .join("");
  }, [s, block]);

  return block
    ? <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
    : <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
