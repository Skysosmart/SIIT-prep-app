"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-client";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, ready, hasBackend, googleEnabled, login, signup } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(params.get("mode") === "signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(params.get("error") ?? "");

  useEffect(() => { if (ready && user) router.replace("/dashboard"); }, [ready, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "signup") await signup(name, email, password);
      else await login(email, password);
      router.replace("/dashboard");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!hasBackend) {
    return (
      <div className="view auth-wrap">
        <div className="card auth-card">
          <h2 style={{ fontSize: "1.5rem" }}>Accounts live on the main site</h2>
          <p className="sub" style={{ margin: "12px 0 18px" }}>
            This static mirror can&apos;t handle sign-in. Open the full app to create an account and sync your progress.
          </p>
          <a className="btn btn-p" href="https://siit-prep.zarutech.dev/login">Go to siit-prep.zarutech.dev</a>
        </div>
      </div>
    );
  }

  return (
    <div className="view auth-wrap">
      <div className="card auth-card">
        <div className="auth-mark">∑</div>
        <h2 style={{ fontSize: "1.6rem", textAlign: "center" }}>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="sub" style={{ textAlign: "center", margin: "8px auto 20px" }}>
          {mode === "login" ? "Sign in to sync your progress across devices." : "Save your XP, streaks, and results to every device."}
        </p>

        {googleEnabled && (
          <>
            <a className="btn btn-g auth-google" href={`${base}/api/auth/google`}>
              <GoogleIcon /> Continue with Google
            </a>
            <div className="auth-or"><span>or</span></div>
          </>
        )}

        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && (
            <label className="auth-field">
              <UserIcon size={16} />
              <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </label>
          )}
          <label className="auth-field">
            <Mail size={16} />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          <label className="auth-field">
            <Lock size={16} />
            <input type="password" placeholder={mode === "signup" ? "Password (8+ characters)" : "Password"} value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
          </label>
          {err && <p className="auth-err">{err}</p>}
          <button className="btn btn-p" type="submit" disabled={busy} style={{ width: "100%" }}>
            {mode === "login" ? <><LogIn size={16} /> Sign in</> : <><UserPlus size={16} /> Create account</>}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(""); }}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
        <p style={{ textAlign: "center", marginTop: 4 }}>
          <Link href="/welcome" className="sub" style={{ fontSize: ".85rem" }}>← Back to intro</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginInner /></Suspense>;
}
