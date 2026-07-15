import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, X } from "lucide-react";
import type { PublishedTest } from "@/context/AcademicContext";
import { reviewAnswerWithGemini } from "@/services/geminiReview";

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

import { createPortal } from "react-dom";

export default function ExamPage({ test, onExit }: { test: PublishedTest; onExit: () => void }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(test.durationMinutes * 60);
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () =>
      test.questions.reduce((total, question) => {
        return selectedAnswers[question.id] === question.correctAnswer ? total + 1 : total;
      }, 0),
    [selectedAnswers, test.questions],
  );

  useEffect(() => {
    if (submitted) return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setSubmitted(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [submitted]);

  return createPortal(
    <main className="fixed inset-0 z-[9999] overflow-y-auto bg-white text-slate-900 w-screen h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-600">Proctored Exam</p>
            <h1 className="mt-1 text-xl font-extrabold text-slate-950">{test.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-red-600">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg font-extrabold">{formatTimer(remainingSeconds)}</span>
            </div>
            <button
              type="button"
              onClick={onExit}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
              aria-label="Exit exam"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {submitted && (
          <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-center">
            <p className="text-sm font-bold text-emerald-700">Final Score</p>
            <p className="mt-1 text-4xl font-extrabold text-emerald-700">
              {score}/{test.questions.length}
            </p>
          </div>
        )}

        <div className="space-y-5">
          {test.questions.map((question, questionIndex) => {
            const selected = selectedAnswers[question.id];
            const isCorrect = submitted && selected === question.correctAnswer;
            const isWrong = submitted && selected && selected !== question.correctAnswer;

            return (
              <article
                key={question.id}
                className={`rounded-3xl border p-6 shadow-sm ${
                  isCorrect
                    ? "border-emerald-200 bg-emerald-50"
                    : isWrong
                      ? "border-red-200 bg-red-50"
                      : "border-gray-100 bg-white"
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <h2 className="text-lg font-extrabold leading-7 text-slate-950">
                    {questionIndex + 1}. {question.questionText}
                  </h2>
                  {submitted && (
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {isCorrect ? "Correct" : "Wrong"}
                    </span>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {question.options.map((option) => {
                    const isSelected = selected === option;
                    const showCorrect = submitted && option === question.correctAnswer;
                    const showWrong = submitted && isSelected && option !== question.correctAnswer;

                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition-all ${
                          showCorrect
                            ? "border-emerald-300 bg-white text-emerald-700"
                            : showWrong
                              ? "border-red-300 bg-white text-red-700"
                              : isSelected
                                ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 bg-white text-slate-700 hover:border-indigo-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={isSelected}
                          disabled={submitted}
                          onChange={() =>
                            setSelectedAnswers((current) => ({
                              ...current,
                              [question.id]: option,
                            }))
                          }
                          className="h-4 w-4 accent-indigo-600"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>

                {isWrong && (
                  <p className="mt-4 text-sm font-bold text-emerald-700">
                    Correct answer: {question.correctAnswer}
                  </p>
                )}

                {/* Gemini smart review hook:
                    Call reviewAnswerWithGemini(question, selected) after submit if you want
                    AI feedback per answer. It posts to /api/gemini-review so the API key
                    stays on your backend instead of being exposed in the browser.
                    Example:
                    if (submitted && selected) {
                      const review = await reviewAnswerWithGemini(question, selected);
                    }
                */}
              </article>
            );
          })}
        </div>

        {!submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-base font-extrabold text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            <CheckCircle2 className="h-5 w-5" />
            Submit Test
          </button>
        ) : (
          <button
            type="button"
            onClick={onExit}
            className="mt-8 h-12 w-full rounded-2xl border border-gray-200 bg-white text-base font-extrabold text-slate-700 transition-all hover:bg-slate-50"
          >
            Back to Quiz Module
          </button>
        )}
      </section>
    </main>,
    document.body
  );
}
