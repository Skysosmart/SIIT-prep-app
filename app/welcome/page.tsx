"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { EXAM_SECTIONS } from "@/lib/exam";
import { Tex } from "@/components/Tex";

const YEAR = 2027; // SIIT/OSP admission cycle referenced on the exam header

export default function Welcome() {
  const router = useRouter();
  const { user, ready } = useAuth();
  useEffect(() => { if (ready && user) router.replace("/"); }, [ready, user, router]);

  return (
    <div className="view wl">
      {/* exam-booklet header strip */}
      <header className="wl-head">
        <span className="wl-inst"><span className="wl-sigma">∑</span> SIIT PREP</span>
        <span className="wl-code">OSP ENTRANCE EXAMINATION · PRACTICE EDITION · {YEAR}</span>
      </header>

      <section className="wl-top">
        <div className="wl-left">
          <h1>Sit the SIIT<br />entrance exam<br />before you sit it.</h1>
          <p>
            A faithful practice edition of the OSP paper: three timed sections, {" "}
            original questions in the real format, and the tools to close every gap
            between now and exam day.
          </p>
          <div className="wl-cta">
            <Link href="/login?mode=signup" className="btn btn-p btn-big">Register to begin <ArrowRight size={18} /></Link>
            <Link href="/login" className="btn btn-line btn-big">I have an account</Link>
          </div>
          <p className="wl-note">Registration is free. Your progress is saved to your candidate account.</p>
        </div>

        {/* specimen question card, styled like the real exam */}
        <aside className="wl-specimen" aria-label="Specimen question">
          <div className="wl-spec-head">
            <span>SPECIMEN · MATHEMATICS</span><span>Q1</span>
          </div>
          <div className="wl-spec-q">Which expression gives the roots of <Tex s="$ax^2+bx+c=0$" />?</div>
          <ol className="wl-spec-opts">
            <li><span>A</span><Tex s="$x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$" /></li>
            <li className="pick"><span>B</span><Tex s="$x=\dfrac{-b\pm\sqrt{b^2+4ac}}{2a}$" /></li>
            <li><span>C</span><Tex s="$x=\dfrac{b\pm\sqrt{b^2-4ac}}{2a}$" /></li>
            <li><span>D</span><Tex s="$x=\dfrac{-b\pm\sqrt{4ac-b^2}}{2a}$" /></li>
          </ol>
          <div className="wl-spec-foot">Answer, then move on — no feedback until you submit.</div>
        </aside>
      </section>

      {/* exam structure, as a real contents/instructions table */}
      <section className="wl-paper">
        <h2>The paper</h2>
        <table className="wl-struct">
          <thead>
            <tr><th>#</th><th>Section</th><th>Questions</th><th>Time</th></tr>
          </thead>
          <tbody>
            {EXAM_SECTIONS.map((s, i) => (
              <tr key={s.id}>
                <td className="wl-num">{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.count}</td>
                <td>{s.minutes} min</td>
              </tr>
            ))}
            <tr className="wl-total">
              <td></td><td>Full paper</td>
              <td>{EXAM_SECTIONS.reduce((a, s) => a + s.count, 0)}</td>
              <td>{EXAM_SECTIONS.reduce((a, s) => a + s.minutes, 0)} min</td>
            </tr>
          </tbody>
        </table>
        <p className="wl-also">
          Beyond the mock paper: topic-by-topic practice with instant feedback, formula
          flashcards for Maths and Physics, a searchable formula library, daily challenges,
          and a class leaderboard — all tracked in your account.
        </p>
      </section>

      <section className="wl-enter">
        <div>
          <b>Ready when you are.</b>
          <span>Create a candidate account to start the paper and keep your progress.</span>
        </div>
        <Link href="/login?mode=signup" className="btn btn-p btn-big">Register to begin <ArrowRight size={18} /></Link>
      </section>
    </div>
  );
}
