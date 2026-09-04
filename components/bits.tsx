import type { Topic } from "@/lib/topics";

export const TopicChip = ({ t }: { t: Topic }) => (
  <span className="tchip" style={{ background: t.color }}>{t.glyph}</span>
);

export const DiffTag = ({ d }: { d: string }) => {
  const cls = d === "Easy" || d === "easy" ? "easy" : d === "Hard" || d === "hard" ? "hard" : "med";
  const label = d === "med" ? "Medium" : d[0].toUpperCase() + d.slice(1);
  return <span className={`tag ${cls}`}>{label}</span>;
};

export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
