"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem, LogIn } from "lucide-react";
import { useProfile } from "@/lib/profile";
import { useAuth } from "@/lib/auth-client";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/exam", label: "Mock Exam" },
  { href: "/practice", label: "Practice" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/library", label: "Formula Library" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/dashboard", label: "Profile" },
];

export function NavBar() {
  const path = usePathname();
  const { p } = useProfile();
  const { user, hasBackend, ready } = useAuth();

  // On the gated site, hide the app nav until the user is signed in.
  if (hasBackend && ready && !user) return null;
  const active = (href: string) => {
    if (href === "/") return path === "/";
    if (href === "/exam") return path.startsWith("/exam");
    if (href === "/practice") return ["/practice", "/quiz", "/results", "/review"].some((s) => path.startsWith(s));
    return path.startsWith(href);
  };
  return (
    <nav className="top">
      <div className="nav-in">
        <Link href="/" className="logo"><span className="mark">∑</span>SIIT PREP</Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`nav-a${active(l.href) ? " on" : ""}`}>{l.label}</Link>
          ))}
        </div>
        <Link href="/dashboard" className="xp-pill" title="View your profile">
          <Gem size={14} aria-hidden="true" /> {p.xp.toLocaleString()} XP
        </Link>
        {hasBackend && (user
          ? <Link href="/dashboard" className="nav-user" title={user.email}><span className="nav-avatar">{user.name[0]?.toUpperCase()}</span></Link>
          : <Link href="/login" className="nav-a" style={{ display: "flex", alignItems: "center", gap: 5 }}><LogIn size={15} /> Sign in</Link>
        )}
      </div>
    </nav>
  );
}
