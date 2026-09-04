/** Tiny Web Audio sound effects — synthesized, no audio files, offline-friendly. */

let ctx: AudioContext | null = null;
const KEY = "siit-sound";

export function soundOn(): boolean {
  try { return localStorage.getItem(KEY) !== "off"; } catch { return true; }
}
export function setSoundOn(on: boolean): void {
  try { localStorage.setItem(KEY, on ? "on" : "off"); } catch { /* ignore */ }
}

function ac(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g).connect(c.destination);
  o.start(start);
  o.stop(start + dur + 0.05);
}

/** Rising chime; adds a third, higher note when a streak (≥3) is alive. */
export function playCorrect(streak = 1): void {
  if (!soundOn()) return;
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  tone(c, 523.25, t, 0.12, "triangle", 0.18);          // C5
  tone(c, 783.99, t + 0.09, 0.16, "triangle", 0.18);   // G5
  if (streak >= 3) tone(c, 1046.5, t + 0.18, 0.2, "triangle", 0.16); // C6
}

/** Short descending buzz. */
export function playWrong(): void {
  if (!soundOn()) return;
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(220, t);
  o.frequency.exponentialRampToValueAtTime(110, t + 0.25);
  g.gain.setValueAtTime(0.14, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.35);
}
