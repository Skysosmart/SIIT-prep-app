export type TopicId =
  | "set" | "alg" | "fun" | "geo" | "trg" | "seq"
  | "prb" | "sta" | "mat" | "cpx" | "vec" | "cal"
  | "gra" | "voc" | "err" | "rea";

export type Subject = "math" | "eng";

export type Topic = {
  id: TopicId;
  name: string;
  glyph: string;      // small glyph shown in the topic chip
  color: string;
  diff: "Easy" | "Medium" | "Hard";
  core: boolean;
  subject: Subject;
};

export const TOPICS: Topic[] = [
  // ── Mathematics ────────────────────────────────────────────────
  { id: "set", name: "Sets & Logic",       glyph: "A∩B",   color: "#F472B6", diff: "Easy",   core: true,  subject: "math" },
  { id: "alg", name: "Algebra",            glyph: "x²",    color: "#14B8A6", diff: "Easy",   core: true,  subject: "math" },
  { id: "fun", name: "Functions",          glyph: "ƒ(x)",  color: "#38BDF8", diff: "Medium", core: true,  subject: "math" },
  { id: "geo", name: "Geometry",           glyph: "△",     color: "#F59E0B", diff: "Medium", core: true,  subject: "math" },
  { id: "trg", name: "Trigonometry",       glyph: "sin θ", color: "#8B5CF6", diff: "Medium", core: true,  subject: "math" },
  { id: "seq", name: "Sequences & Series", glyph: "Σ",     color: "#0EA5E9", diff: "Medium", core: false, subject: "math" },
  { id: "prb", name: "Probability",        glyph: "P(A)",  color: "#EF4444", diff: "Medium", core: true,  subject: "math" },
  { id: "sta", name: "Statistics",         glyph: "x̄, σ",  color: "#A855F7", diff: "Easy",   core: false, subject: "math" },
  { id: "mat", name: "Matrices",           glyph: "aᵢⱼ",   color: "#10B981", diff: "Hard",   core: false, subject: "math" },
  { id: "cpx", name: "Complex Numbers",    glyph: "i²",    color: "#6366F1", diff: "Hard",   core: false, subject: "math" },
  { id: "vec", name: "Vectors",            glyph: "⟨x,y⟩", color: "#06B6D4", diff: "Medium", core: false, subject: "math" },
  { id: "cal", name: "Calculus",           glyph: "∫dx",   color: "#F43F5E", diff: "Hard",   core: true,  subject: "math" },
  // ── English ────────────────────────────────────────────────────
  { id: "gra", name: "Grammar",            glyph: "a/an",  color: "#F97316", diff: "Medium", core: true,  subject: "eng" },
  { id: "voc", name: "Vocabulary",         glyph: "abc",   color: "#84CC16", diff: "Medium", core: true,  subject: "eng" },
  { id: "err", name: "Error Spotting",     glyph: "A–D",   color: "#D946EF", diff: "Hard",   core: false, subject: "eng" },
  { id: "rea", name: "Reading",            glyph: "¶",     color: "#0891B2", diff: "Medium", core: true,  subject: "eng" },
];

export const topicById = (id: string): Topic =>
  TOPICS.find((t) => t.id === id) ?? TOPICS[0];
