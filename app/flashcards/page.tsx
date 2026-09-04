"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import { RotateCcw, Check, RefreshCw, ChevronRight, Layers } from "lucide-react";
import { FORMULAS, LIB_CATS } from "@/lib/formulas";
import { shuffle } from "@/lib/engine";
import { useProfile } from "@/lib/profile";
import { Tex } from "@/components/Tex";

export default function Flashcards() {
  const { p, ready, markFlash, resetFlash } = useProfile();
  const [cat, setCat] = useState("All");
  const [round, setRound] = useState(0);      // bump to reshuffle
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [againNames, setAgainNames] = useState<string[]>([]);
  // the deck is shuffled randomly, so render it only on the client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // when the card changes we snap the flip back instantly - otherwise the next
  // card's answer side is visible while the un-flip animation plays
  const [snap, setSnap] = useState(false);
  useEffect(() => {
    if (!snap) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)));
    return () => cancelAnimationFrame(id);
  }, [snap]);

  const pool = useMemo(
    () => FORMULAS.filter((f) => cat === "All" || f.cat === cat),
    [cat],
  );
  // deck = unmastered cards, shuffled per round (mastered set frozen at round start)
  const deck = useMemo(() => {
    const unmastered = pool.filter((f) => !p.flash.includes(f.name) || againNames.includes(f.name));
    return shuffle(unmastered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, round, ready]);

  const card = deck[i];
  const masteredInCat = pool.filter((f) => p.flash.includes(f.name)).length;

  const advance = useCallback((known: boolean) => {
    if (!card) return;
    markFlash(card.name, known);
    if (!known) setAgainNames((a) => [...new Set([...a, card.name])]);
    setSnap(true);
    setFlipped(false);
    if (i + 1 >= deck.length) {
      // round over: rebuild the deck from whatever is still unmastered
      setAgainNames([]);
      setRound((r) => r + 1);
      setI(0);
    } else {
      setI(i + 1);
    }
  }, [card, deck.length, i, markFlash]);

  // keyboard: space/enter flips, 1 = again, 2 = got it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); }
      else if (flipped && e.key === "1") advance(false);
      else if (flipped && e.key === "2") advance(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, advance]);

  const pickCat = (c: string) => { setCat(c); setI(0); setSnap(true); setFlipped(false); setAgainNames([]); setRound((r) => r + 1); };

  return (
    <div className="view">
      <span className="kicker">Flashcards</span>
      <div className="sec-h" style={{ marginTop: 6 }}>
        <h2 style={{ fontSize: "1.8rem" }}>Formula flashcards</h2>
        <span className="tag n" style={{ fontSize: ".85rem", padding: "6px 14px" }}>
          <Layers size={13} aria-hidden="true" /> {masteredInCat}/{pool.length} mastered
        </span>
      </div>
      <p className="sub">
        Flip the card, then be honest: <b>Again</b> keeps it in the deck, <b>Got it</b> retires it.
        Space flips · 1 = Again · 2 = Got it.
      </p>
      <div className="filters">
        {["All", ...LIB_CATS].map((c) => (
          <button key={c} className={`chip${cat === c ? " on" : ""}`} onClick={() => pickCat(c)}>{c}</button>
        ))}
      </div>

      {!mounted ? (
        <div className="fc-stage"><div className="fc-meta">Shuffling deck…</div></div>
      ) : !card ? (
        <div className="card" style={{ maxWidth: 560, margin: "40px auto", textAlign: "center", padding: 40 }}>
          <h3 style={{ fontSize: "1.4rem" }}>Deck cleared! 🎓</h3>
          <p className="sub" style={{ margin: "12px auto 20px" }}>
            You&apos;ve mastered {cat === "All" ? "every formula" : `all of ${cat}`}. Review again any time.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-p" onClick={() => { resetFlash(); setRound((r) => r + 1); setI(0); }}>
              <RefreshCw size={16} /> Restart all decks
            </button>
            <Link href="/practice" className="btn btn-g">Take a quiz <ChevronRight size={16} /></Link>
          </div>
        </div>
      ) : (
        <div className="fc-stage">
          <div className="fc-meta">Card {i + 1} of {deck.length}{cat !== "All" && <> · {cat}</>}</div>
          <button
            className={`fc${flipped ? " flipped" : ""}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? "Show prompt" : "Reveal formula"}
          >
            <span className={`fc-inner${snap ? " snap" : ""}`}>
              <span className="fc-face fc-front">
                <span className="fc-cat">{card.cat}</span>
                <span className="fc-name">{card.name}</span>
                <span className="fc-hint">What&apos;s the formula? Tap to flip</span>
              </span>
              <span className="fc-face fc-back">
                <span className="fc-math"><Tex s={card.tex} block /></span>
                <span className="fc-use"><Tex s={card.use} /></span>
                <span className="fc-ex">Example: <Tex s={card.example} /></span>
              </span>
            </span>
          </button>
          <div className="fc-actions">
            <button className="btn btn-g" disabled={!flipped} onClick={() => advance(false)}>
              <RotateCcw size={16} /> Again
            </button>
            <button className="btn btn-p" disabled={!flipped} onClick={() => advance(true)}>
              <Check size={17} /> Got it
            </button>
          </div>
          <div className="pbar" style={{ maxWidth: 420, margin: "18px auto 0" }}>
            <span style={{ width: `${(100 * masteredInCat) / Math.max(1, pool.length)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
