"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem } from "lucide-react";
import { useProfile } from "@/lib/profile";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice" },
  { href: "/library", label: "Formula Library" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/dashboard", label: "Profile" },
];

export function NavBar() {
  const path = usePathname();
  const { p } = useProfile();
  const active = (href: string) => {
    if (href === "/") return path === "/";
    if (href === "/practice") return ["/practice", "/quiz", "/results", "/review"].some((s) => path.startsWith(s));
    return path.startsWith(href);
  };
  return (
    <nav className="top">
      <div className="nav-in">
        <Link href="/" className="logo"><span className="mark">∑</span>SIIT Math Arena</Link>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`nav-a${active(l.href) ? " on" : ""}`}>{l.label}</Link>
        ))}
        <span className="xp-pill"><Gem size={14} aria-hidden="true" /> {p.xp.toLocaleString()} XP</span>
      </div>
    </nav>
  );
}
