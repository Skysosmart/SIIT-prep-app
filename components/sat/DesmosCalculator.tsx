"use client";

import { useEffect, useRef, useState } from "react";
import { ToolPanel } from "./ToolPanel";

/**
 * The built-in graphing calculator, which on the real digital SAT *is* Desmos -
 * College Board embeds the Desmos graphing calculator inside Bluebook. This
 * loads the same product through Desmos's public calculator API.
 *
 * The API key below is the demo key Desmos publishes in its own documentation
 * for free/unpartnered use. Override it with NEXT_PUBLIC_DESMOS_API_KEY.
 */
const API_KEY = process.env.NEXT_PUBLIC_DESMOS_API_KEY || "dcb31709b452b1cf9dc26972add0fda6";
const SRC = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${API_KEY}`;

type DesmosGlobal = {
  GraphingCalculator: (
    el: HTMLElement,
    opts?: Record<string, unknown>,
  ) => { destroy: () => void; resize: () => void };
};

/** Module-level so the ~1MB script is fetched at most once per page load. */
let loader: Promise<DesmosGlobal> | null = null;

function loadDesmos(): Promise<DesmosGlobal> {
  const existing = (window as unknown as { Desmos?: DesmosGlobal }).Desmos;
  if (existing) return Promise.resolve(existing);
  loader ??= new Promise<DesmosGlobal>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => {
      const d = (window as unknown as { Desmos?: DesmosGlobal }).Desmos;
      if (d) resolve(d);
      else { loader = null; reject(new Error("script loaded but Desmos was not defined")); }
    };
    s.onerror = () => { loader = null; reject(new Error("network")); };
    document.head.appendChild(s);
  });
  return loader;
}

export function DesmosCalculator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const host = useRef<HTMLDivElement | null>(null);
  const calc = useRef<{ destroy: () => void; resize: () => void } | null>(null);
  const started = useRef(false);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  /**
   * Built lazily on first open - the container needs a real size before Desmos
   * measures it, and a student who never opens the calculator should never pay
   * for the download.
   *
   * The "have we started" flag is a ref, NOT the `state` above, and `state` is
   * deliberately absent from the dependency list. Keying this effect on a
   * value it sets itself makes it tear itself down: setState("loading") would
   * re-run the effect, whose cleanup cancels the in-flight load, and the
   * calculator would never appear.
   */
  useEffect(() => {
    if (!open || started.current || !host.current) return;
    started.current = true;
    let cancelled = false;
    setState("loading");
    loadDesmos()
      .then((Desmos) => {
        if (cancelled || !host.current) return;
        calc.current = Desmos.GraphingCalculator(host.current, {
          keypad: true,
          expressions: true,
          settingsMenu: true,
          zoomButtons: true,
          expressionsTopbar: true,
          border: false,
          lockViewport: false,
          autosize: true,
          // Bluebook's build has no "share"/"save" affordances.
          images: false,
          folders: false,
          notes: false,
        });
        setState("ready");
      })
      .catch(() => { if (!cancelled) { started.current = false; setState("error"); } });
    return () => { cancelled = true; };
  }, [open]);

  // Desmos measures its container on creation; re-measure whenever it is shown.
  useEffect(() => {
    if (open && state === "ready") {
      const t = setTimeout(() => calc.current?.resize(), 30);
      return () => clearTimeout(t);
    }
  }, [open, state]);

  useEffect(() => () => { calc.current?.destroy(); calc.current = null; }, []);

  // Desmos gives its expression list a fixed ~320px, so a narrow panel leaves
  // the graph a useless sliver. 620 keeps roughly half the width for the plot.
  return (
    <ToolPanel open={open} onClose={onClose} title="Calculator" width={620} height={580} className="bb-calc">
      <div ref={host} className="bb-calc-host" />
      {state === "loading" && <p className="bb-tool-note">Loading the graphing calculator…</p>}
      {state === "error" && (
        <p className="bb-tool-note bb-tool-note-bad">
          The graphing calculator could not load. It is fetched from Desmos, so it needs a
          network connection - the rest of the test works offline.
        </p>
      )}
    </ToolPanel>
  );
}
