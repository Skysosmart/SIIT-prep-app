"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * A floating, draggable tool window - the shell Bluebook uses for its
 * Calculator and Reference panels.
 *
 * Stays MOUNTED while closed (hidden with the `hidden` attribute) so that
 * whatever lives inside keeps its state: the Desmos instance must not be torn
 * down and rebuilt every time the student closes the calculator, or their
 * expressions vanish mid-question.
 */
export function ToolPanel({
  open,
  onClose,
  title,
  initial,
  width,
  height,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Opening position, viewport px. Defaults to a sensible right-hand slot. */
  initial?: { x: number; y: number };
  width: number;
  height: number;
  className?: string;
  children: ReactNode;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  // Position on first open, once the viewport size is actually known.
  useEffect(() => {
    if (!open || pos) return;
    const x = initial?.x ?? Math.max(12, window.innerWidth - width - 40);
    const y = initial?.y ?? 140;
    setPos(clamp(x, y, width, height));
  }, [open, pos, initial, width, height]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!pos) return;
    // Let buttons inside the header (the close button) work normally.
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    setPos(clamp(e.clientX - d.dx, e.clientY - d.dy, width, height));
  }, [width, height]);

  const onPointerUp = () => { drag.current = null; };

  // Keep the panel on screen when the window shrinks.
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y, width, height) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [width, height]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`bb-tool ${className}`}
      // Stay hidden until the opening position is known, or the panel would
      // flash at the top-left corner for one frame.
      hidden={!open || !pos}
      style={{ left: pos?.x ?? 0, top: pos?.y ?? 0, width, height }}
      role="dialog"
      aria-label={title}
    >
      <div
        className="bb-tool-head"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="bb-tool-grip" aria-hidden="true" />
        <b>{title}</b>
        <button type="button" className="bb-tool-x" onClick={onClose} aria-label={`Close ${title}`}>
          <X size={16} />
        </button>
      </div>
      <div className="bb-tool-body">{children}</div>
    </div>
  );
}

function clamp(x: number, y: number, w: number, h: number) {
  const maxX = Math.max(8, window.innerWidth - w - 8);
  const maxY = Math.max(8, window.innerHeight - h - 8);
  return { x: Math.min(Math.max(8, x), maxX), y: Math.min(Math.max(8, y), maxY) };
}
