/**
 * First-visit routing.
 *
 * `/welcome` is the exam-booklet cover. It used to be where AuthGate sent
 * signed-out visitors; with accounts gone it is shown once, on a first visit,
 * and skipped for anyone who has been here before.
 *
 * "Been here before" means either the flag below, or an existing profile - so
 * a returning player is never bounced through the cover just because the flag
 * was cleared.
 */

const SEEN = "siit-seen-welcome";
const PROFILE = "siit-math-arena-profile";

/**
 * null when localStorage cannot be read at all (private mode, blocked storage).
 * Callers must treat null as "do not redirect", so a visitor is never trapped
 * on the cover by storage that silently refuses to remember the visit.
 */
export function hasVisitedBefore(): boolean | null {
  try {
    return Boolean(localStorage.getItem(SEEN) || localStorage.getItem(PROFILE));
  } catch {
    return null;
  }
}

export function markVisited(): void {
  try { localStorage.setItem(SEEN, "1"); } catch { /* nothing to do */ }
}
