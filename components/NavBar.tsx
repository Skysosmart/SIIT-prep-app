"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem } from "lucide-react";
import { useProfile } from "@/lib/profile";

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
      </div>
    </nav>
  );
}
