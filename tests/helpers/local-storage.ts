/**
 * Minimal localStorage for the autosave tests.
 *
 * Imported for its side effect and must appear BEFORE the module under test, so
 * the stub exists by the time lib/sat/progress touches it.
 */
const store = new Map<string, string>();

(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
};

/** Direct access, for asserting that a stale entry was actually deleted. */
export const rawStore = store;
