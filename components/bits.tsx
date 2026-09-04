import { Flame, Search } from "lucide-react";
import type { Topic } from "@/lib/topics";

export const TopicChip = ({ t }: { t: Topic }) => (
  <span className="tchip" style={{ background: t.color }}>{t.glyph}</span>
);

export const DiffTag = ({ d }: { d: string }) => {
  const cls = d === "Easy" || d === "easy" ? "easy" : d === "Hard" || d === "hard" ? "hard" : "med";
  const label = d === "med" ? "Medium" : d[0].toUpperCase() + d.slice(1);
  return <span className={`tag ${cls}`}>{label}</span>;
};

export const SearchIcon = () => <Search size={16} aria-hidden="true" />;

/** Streak flame — filled Lucide flame in the app's amber. */
export const StreakFlame = ({ size = 18 }: { size?: number }) => (
  <Flame size={size} fill="currentColor" strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--amb)" }} />
);
