"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, KeyRound } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { MIN_PASSWORD_LENGTH, passwordProblem } from "@/lib/password-policy";

type Status = { hasPassword: boolean; provider: "email" | "google"; needsCurrent: boolean };

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Set or change the account password.
 *
 * Doubles as the recovery flow: there is no reset email, so a user who has
 * forgotten their password signs in with Google - which proves they own the
 * address - and sets a new one here without needing the old one.
 */
export function PasswordCard() {
  const { user, hasBackend } = useAuth();
  const [status, setStatus] = useState<Status | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${base}/api/auth/password`, { cache: "no-store" });
      if (r.ok) setStatus(await r.json());
    } catch { /* offline or static build */ }
  }, []);

  useEffect(() => { if (hasBackend && user) void load(); }, [hasBackend, user, load]);

  if (!hasBackend || !user || !status) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setDone("");
    const problem = passwordProblem(next);
    if (problem) { setErr(problem); return; }
    if (next !== confirm) { setErr("The two passwords do not match."); return; }
    setBusy(true);
    try {
      const r = await fetch(`${base}/api/auth/password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Could not update the password."); return; }
      setCurrent(""); setNext(""); setConfirm("");
      setDone(data.hadPassword ? "Password updated." : "Password set. You can now sign in with your email too.");
      await load();
    } catch {
      setErr("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <b><KeyRound size={15} style={{ verticalAlign: "-2px" }} /> {status.hasPassword ? "Change your password" : "Set a password"}</b>
      <p className="sub" style={{ textAlign: "left", margin: "6px 0 12px" }}>
        {status.hasPassword
          ? status.needsCurrent
            ? "Enter your current password, then choose a new one."
            : "You are signed in with Google, which confirms this is your account - so you can set a new password without the old one. This is how to recover a forgotten password."
          : "Your account signs in with Google. Adding a password lets you sign in either way."}
      </p>

      <form onSubmit={submit} className="pw-form">
        {status.needsCurrent && (
          <input type="password" placeholder="Current password" value={current} autoComplete="current-password"
            onChange={(e) => setCurrent(e.target.value)} required />
        )}
        <input type="password" placeholder={`New password (${MIN_PASSWORD_LENGTH}+ characters)`} value={next}
          autoComplete="new-password" onChange={(e) => setNext(e.target.value)} required />
        <input type="password" placeholder="Confirm new password" value={confirm} autoComplete="new-password"
          onChange={(e) => setConfirm(e.target.value)} required />
        <button className="btn btn-p" type="submit" disabled={busy}>
          {busy ? "Saving..." : status.hasPassword ? "Update password" : "Set password"}
        </button>
      </form>

      {err && <p className="tag hard" style={{ marginTop: 10, display: "inline-block" }}>{err}</p>}
      {done && <p className="tag easy" style={{ marginTop: 10, display: "inline-block" }}><Check size={13} /> {done}</p>}
    </div>
  );
}
