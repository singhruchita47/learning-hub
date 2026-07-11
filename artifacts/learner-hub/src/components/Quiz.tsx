import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

interface Question {
  q: string;
  opts: string[];
  ans: number;
}

interface QuizProps {
  title: string;
  color: string;
  qBank: Question[];
  onBack: () => void;
}

export default function Quiz({ title, color, qBank, onBack }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(() => Array(qBank.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = qBank[currentIndex];
  const answeredCount = selectedAnswers.filter((answer) => answer !== null).length;
  const allAnswered = qBank.length > 0 && answeredCount === qBank.length;
  const pct = qBank.length > 0 ? Math.round((score / qBank.length) * 100) : 0;

  function handleSelect(optionIndex: number) {
    if (submitted) return;
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  }

  async function handleSubmit() {
    const finalScore = selectedAnswers.reduce<number>((total, answer, questionIndex) => {
      return answer === qBank[questionIndex].ans ? total + 1 : total;
    }, 0);
    setScore(finalScore);
    setSubmitted(true);

    try {
      await fetch(`${ACADEMIC_API_BASE}/quiz-attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizTitle: title,
          studentId: "student-demo-rs",
          score: finalScore,
          total: qBank.length,
          answers: qBank.map((question, questionIndex) => {
            const selected = selectedAnswers[questionIndex];
            return {
              questionText: question.q,
              selectedAnswer: selected === null ? "" : question.opts[selected],
              correctAnswer: question.opts[question.ans],
              isCorrect: selected === question.ans,
            };
          }),
        }),
      });
    } catch {
      // Local UI still works when the API server is not running.
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setSelectedAnswers(Array(qBank.length).fill(null));
    setSubmitted(false);
    setScore(0);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7130a1]">Test submitted</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950">{title}</h1>
            </div>
            <div className="rounded-2xl bg-[#263676] px-6 py-4 text-white">
              <p className="text-xs font-black uppercase tracking-wider text-white/60">Final Score</p>
              <p className="text-3xl font-black">{score}/{qBank.length} <span className="text-lg">({pct}%)</span></p>
            </div>
          </div>

          <div className="space-y-4">
            {qBank.map((question, questionIndex) => {
              const selected = selectedAnswers[questionIndex];
              const isCorrect = selected === question.ans;
              return (
                <section
                  key={question.q}
                  className={`rounded-3xl border p-5 shadow-sm ${
                    isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="text-lg font-black leading-7 text-slate-950">Q{questionIndex + 1}. {question.q}</h2>
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
                      isCorrect ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                    }`}>
                      {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {question.opts.map((option, optionIndex) => (
                      <div
                        key={option}
                        className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                          optionIndex === question.ans
                            ? "border-emerald-300 bg-white text-emerald-700"
                            : optionIndex === selected
                              ? "border-red-300 bg-white text-red-700"
                              : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </div>
                    ))}
                  </div>
                  {!isCorrect && (
                    <p className="mt-3 text-sm font-black text-emerald-700">
                      Correct answer: {question.opts[question.ans]}
                    </p>
                  )}
                </section>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleRetry} className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700">
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
            <button onClick={onBack} className="h-12 rounded-2xl bg-[#263676] px-6 text-sm font-black text-white">
              Back to quizzes
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <header className="flex h-[92px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950">{title}</h1>
          <p className="mt-1 text-sm font-black text-slate-500">Question {currentIndex + 1} of {qBank.length}</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-xl font-black text-slate-950 shadow-sm">
          <Clock className="h-5 w-5 text-[#7130a1]" />
          Time Left: 04:59
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-h-0 items-center justify-center overflow-hidden px-8 py-6">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1040px]"
          >
            <h2 className="mb-8 text-2xl font-black leading-snug text-slate-950 xl:text-[2rem]">
              Q{currentIndex + 1}. {currentQuestion.q}
            </h2>
            <div className="space-y-5">
              {currentQuestion.opts.map((option, optionIndex) => {
                const selected = selectedAnswers[currentIndex] === optionIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(optionIndex)}
                    className={`flex min-h-[74px] w-full items-center gap-5 rounded-xl border bg-white px-7 py-4 text-left text-lg font-black shadow-sm transition xl:text-xl ${
                      selected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-300 bg-white text-slate-400"
                    }`}>
                      {selected ? "✓" : ""}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>

        <aside className="border-l border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-black text-slate-950">Question Palette</h2>
          <div className="grid grid-cols-4 gap-2">
            {qBank.map((_, index) => {
              const answered = selectedAnswers[index] !== null;
              const active = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-12 rounded-xl border text-base font-black ${
                    active
                      ? "border-[#2563eb] bg-white text-slate-950 ring-2 ring-[#2563eb]/25"
                      : answered
                        ? "border-[#168568] bg-[#168568] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-7 flex items-center gap-6 text-sm font-bold text-slate-500">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#168568]" />Answered</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-slate-300 bg-slate-50" />Pending</span>
          </div>
          <p className="mt-7 text-lg font-black text-slate-700">{answeredCount} of {qBank.length} answered</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[#168568]" style={{ width: `${(answeredCount / qBank.length) * 100}%` }} />
          </div>
        </aside>
      </div>

      <footer className="flex h-[84px] shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.06)]">
        <div className="flex gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            className="h-12 rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-800 disabled:opacity-50"
          >
            {"<- Previous"}
          </button>
          <button
            type="button"
            disabled={currentIndex === qBank.length - 1}
            onClick={() => setCurrentIndex((index) => Math.min(qBank.length - 1, index + 1))}
            className="h-12 rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-800 disabled:opacity-50"
          >
            {"Next ->"}
          </button>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="h-12 rounded-xl bg-[#047857] px-8 text-sm font-black text-white shadow-lg shadow-[#047857]/20 disabled:cursor-not-allowed disabled:opacity-45"
          style={allAnswered ? { background: color } : undefined}
        >
          Submit Test
        </button>
      </footer>
    </main>
  );
}
