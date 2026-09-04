import { QUESTIONS, type Question } from "./questions";
import { shuffle } from "./engine";
import type { TopicId } from "./topics";

/**
 * OSP/SIIT-style mock exam: two timed sections (Mathematics, English),
 * multiple choice, answer any order, flag for review, no feedback until
 * the whole paper is submitted. Original questions in the real format.
 */
export type SectionId = "math" | "eng" | "phys";

export type ExamSection = {
  id: SectionId;
  name: string;
  topics: TopicId[];
  count: number;
  minutes: number;
};

// Real OSP structure: three sequential sections, each with its own 1-hour timer.
export const EXAM_SECTIONS: ExamSection[] = [
  { id: "math", name: "Mathematics", topics: ["set","alg","fun","geo","trg","seq","prb","sta","mat","cpx","vec","cal"], count: 45, minutes: 60 },
  { id: "phys", name: "Physics",     topics: ["mec","ele","wav","thm","mod"], count: 30, minutes: 60 },
  { id: "eng",  name: "English",     topics: ["gra","voc","err","rea"], count: 75, minutes: 60 },
];

export const EXAM_TOTAL_MIN = EXAM_SECTIONS.reduce((s, x) => s + x.minutes, 0);
export const EXAM_TOTAL_Q = EXAM_SECTIONS.reduce((s, x) => s + x.count, 0);

export type ExamQuestion = {
  q: Question;
  order: number[];      // shuffled choice order
  correctAt: number;    // index in `order` of the correct answer
  section: SectionId;
};

/** Build a fresh randomized paper: N questions per section, choices shuffled. */
export function buildExam(): ExamQuestion[] {
  const out: ExamQuestion[] = [];
  for (const sec of EXAM_SECTIONS) {
    const pool = QUESTIONS.filter((q) => sec.topics.includes(q.topic));
    // reading questions travel with their passage; keep them but still sample
    const picked = shuffle(pool).slice(0, Math.min(sec.count, pool.length));
    // group reading questions by passage so they appear together
    picked.sort((a, b) => (a.passage ?? "").localeCompare(b.passage ?? ""));
    for (const q of picked) {
      const order = shuffle(q.choices.map((_, idx) => idx));
      out.push({ q, order, correctAt: order.indexOf(q.answer), section: sec.id });
    }
  }
  return out;
}

export type ExamResult = {
  date: string;
  total: number;
  correct: number;
  perSection: { id: SectionId; name: string; correct: number; total: number }[];
  answers: { qid: number; picked: number; correct: boolean }[]; // picked = choice index, -1 = blank
  timeSec: number;
};
