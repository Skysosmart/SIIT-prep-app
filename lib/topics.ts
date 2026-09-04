export type TopicId =
  | "set" | "alg" | "fun" | "geo" | "trg" | "seq"
  | "prb" | "sta" | "mat" | "cpx" | "vec" | "cal";

export type Topic = {
  id: TopicId;
  name: string;
  glyph: string;      // small math glyph shown in the topic chip
  color: string;
  diff: "Easy" | "Medium" | "Hard";
  core: boolean;
};

export const TOPICS: Topic[] = [
  { id: "set", name: "Sets & Logic",       glyph: "A∩B",   color: "#F472B6", diff: "Easy",   core: true },
  { id: "alg", name: "Algebra",            glyph: "x²",    color: "#14B8A6", diff: "Easy",   core: true },
  { id: "fun", name: "Functions",          glyph: "ƒ(x)",  color: "#38BDF8", diff: "Medium", core: true },
  { id: "geo", name: "Geometry",           glyph: "△",     color: "#F59E0B", diff: "Medium", core: true },
  { id: "trg", name: "Trigonometry",       glyph: "sin θ", color: "#8B5CF6", diff: "Medium", core: true },
  { id: "seq", name: "Sequences & Series", glyph: "Σ",     color: "#0EA5E9", diff: "Medium", core: false },
  { id: "prb", name: "Probability",        glyph: "P(A)",  color: "#EF4444", diff: "Medium", core: true },
  { id: "sta", name: "Statistics",         glyph: "x̄, σ",  color: "#A855F7", diff: "Easy",   core: false },
  { id: "mat", name: "Matrices",           glyph: "aᵢⱼ",   color: "#10B981", diff: "Hard",   core: false },
  { id: "cpx", name: "Complex Numbers",    glyph: "i²",    color: "#6366F1", diff: "Hard",   core: false },
  { id: "vec", name: "Vectors",            glyph: "⟨x,y⟩", color: "#06B6D4", diff: "Medium", core: false },
  { id: "cal", name: "Calculus",           glyph: "∫dx",   color: "#F43F5E", diff: "Hard",   core: true },
];

export const topicById = (id: string): Topic =>
  TOPICS.find((t) => t.id === id) ?? TOPICS[0];
