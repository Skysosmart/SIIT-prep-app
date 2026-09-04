"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type User = { id: string; email: string; name: string; provider: "email" | "google" };

type AuthCtx = {
  user: User | null;
  ready: boolean;          // finished the initial /me check
  hasBackend: boolean;     // server API present (Vercel, not static Pages)
  googleEnabled: boolean;  // GOOGLE_CLIENT_ID configured
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const hasBackend = process.env.NEXT_PUBLIC_HAS_API === "1";
const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE === "1";

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
async function errText(res: Response): Promise<string> {
  try { return ((await res.json()) as { error?: string }).error ?? `Error ${res.status}`; }
  catch { return `Error ${res.status}`; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!hasBackend) { setReady(true); return; }
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      setUser(res.ok ? ((await res.json()) as { user: User | null }).user : null);
    } catch { setUser(null); }
    finally { setReady(true); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const signup = async (name: string, email: string, password: string) => {
    const res = await post("/api/auth/signup", { name, email, password });
    if (!res.ok) throw new Error(await errText(res));
    await refresh();
  };
  const login = async (email: string, password: string) => {
    const res = await post("/api/auth/login", { email, password });
    if (!res.ok) throw new Error(await errText(res));
    await refresh();
  };
  const logout = async () => {
    await post("/api/auth/logout", {});
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, ready, hasBackend, googleEnabled, signup, login, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
