"use client";

/**
 * Renders a question's inline <svg> or <table> fragment.
 *
 * Uses dangerouslySetInnerHTML on first-party TypeScript literals - the same
 * thing components/Tex.tsx already does for every question string in the app.
 * Figures are authored with `stroke="currentColor"` and no hardcoded colours,
 * so they follow the theme for free. lib/sat/validate.ts shape-checks the
 * markup at build time, because a malformed fragment renders silently.
 */
export function SatFigure({ html }: { html: string }) {
  return <figure className="sat-fig" dangerouslySetInnerHTML={{ __html: html }} />;
}
