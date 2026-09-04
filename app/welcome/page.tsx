"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Timer, Layers, BookOpen, LineChart, Trophy, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { QUESTIONS } from "@/lib/questions";
import { TOPICS } from "@/lib/topics";

const SEEN_KEY = "siit-seen-welcome";

const FEATURES = [
  { icon: Timer, title: "Full mock exam", body: "A timed OSP-style paper: three sequential sections (Math, Physics, English), each on its own one-hour clock." },
  { icon: GraduationCap, title: "All three subjects", body: `${QUESTIONS.length}+ practice questions across ${TOPICS.length} topics, from algebra and calculus to mechanics, optics, grammar, and reading.` },
  { icon: Layers, title: "Flashcards", body: "Master every formula with spaced-repetition flip cards for both Math and Physics." },
  { icon: BookOpen, title: "Formula library", body: "Every formula you need, LaTeX-rendered, with when-to-use notes and worked examples." },
  { icon: LineChart, title: "Progress that follows you", body: "XP, streaks, exam results, and mastery sync to your account across every device." },
  { icon: Trophy, title: "Compete & stay sharp", body: "Daily challenges, a live leaderboard, and score sharing to keep the momentum going." },
];

export default function Welcome() {
  const router = useRouter();
  const { user, ready } = useAuth();

  // already logged in? skip straight to the app
  useEffect(() => { if (ready && user) router.replace("/"); }, [ready, user, router]);

  const enterAsGuest = () => {
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    router.push("/");
  };
  const markSeen = () => { try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ } };

  return (
    <div className="view welcome">
      <section className="wl-hero">
        <span className="wl-badge"><span className="wl-mark">∑</span> SIIT PREP</span>
        <h1>Get into SIIT.<br /><span className="accent">One focused session at a time.</span></h1>
        <p>
          The complete prep platform for the SIIT / OSP entrance exam - a realistic timed mock exam,
          {" "}{QUESTIONS.length}+ original practice questions, flashcards, and a formula library for
          Mathematics, Physics, and English.
        </p>
        <div className="wl-cta">
          <Link href="/login?mode=signup" className="btn btn-p btn-big" onClick={markSeen}>Create free account <ArrowRight size={18} /></Link>
          <Link href="/login" className="btn btn-hero btn-big" onClick={markSeen}>Sign in</Link>
        </div>
        <button className="wl-guest" onClick={enterAsGuest}>or explore without an account</button>
      </section>

      <div className="wl-stats">
        <div><b>{QUESTIONS.length}+</b><span>practice questions</span></div>
        <div><b>3</b><span>exam subjects</span></div>
        <div><b>{TOPICS.length}</b><span>topics covered</span></div>
        <div><b>150</b><span>question mock exam</span></div>
      </div>

      <h2 className="wl-h2">Everything you need to be exam-ready</h2>
      <div className="wl-features">
        {FEATURES.map((f) => (
          <div className="wl-feature" key={f.title}>
            <span className="wl-ficon"><f.icon size={22} /></span>
            <b>{f.title}</b>
            <p>{f.body}</p>
          </div>
        ))}
      </div>

      <section className="wl-final">
        <h2>Ready to start?</h2>
        <p>Create a free account to save your progress and pick up where you left off on any device.</p>
        <ul className="wl-perks">
          <li><Check size={16} /> Free forever</li>
          <li><Check size={16} /> Progress synced everywhere</li>
          <li><Check size={16} /> No card required</li>
        </ul>
        <Link href="/login?mode=signup" className="btn btn-p btn-big" onClick={markSeen}>Create your account <ArrowRight size={18} /></Link>
      </section>
    </div>
  );
}
