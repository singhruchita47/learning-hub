import { useState } from "react";
import { CheckCircle2, Clock, FileQuestion, Send } from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";

type QuestionCategory = "GK Question" | "Quantitative Aptitude" | "Reasoning" | "English";

export default function FacultyTestCreator() {
  const { questionBank, questionsLoading, questionsError, reloadQuestions, publishTest, publishedTests } = useAcademic();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>("GK Question");
  const [questionLimit, setQuestionLimit] = useState("10");
  const [testDate, setTestDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [published, setPublished] = useState(false);

  const subjectOptions: QuestionCategory[] = ["GK Question", "Quantitative Aptitude", "Reasoning", "English"];
  const selectedQuestions = questionBank.filter((question) => selectedIds.includes(question.id));
  const categoryQuestions = questionBank.filter((question) => {
    const fallbackCategory = question.id <= Math.ceil(questionBank.length / 2) ? "GK Question" : "Quantitative Aptitude";
    return (question.category ?? fallbackCategory) === selectedCategory;
  });
  const canPublish = selectedQuestions.length > 0 && testDate && startTime && Number(durationMinutes) > 0;
  const isExternalSubject = selectedCategory === "Reasoning" || selectedCategory === "English";

  function changeCategory(category: QuestionCategory) {
    setSelectedCategory(category);
    setSelectedIds([]);
  }

  function toggleQuestion(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function selectQuestionCount() {
    const count = Math.max(1, Math.min(Number(questionLimit) || 1, categoryQuestions.length));
    setSelectedIds(categoryQuestions.slice(0, count).map((question) => question.id));
  }

  function handlePublish() {
    if (!canPublish) return;

    publishTest({
      title: `${selectedCategory} Test ${publishedTests.length + 1}`,
      testDate,
      startTime,
      durationMinutes: Number(durationMinutes),
      questions: selectedQuestions,
    });

    setSelectedIds([]);
    setQuestionLimit("10");
    setTestDate("");
    setStartTime("");
    setDurationMinutes("30");
    setPublished(true);
    window.setTimeout(() => setPublished(false), 2200);
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Custom Test Creator</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Choose a subject, then select how many questions to publish.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void reloadQuestions()}
            disabled={questionsLoading}
            className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-extrabold text-emerald-600 transition-all hover:bg-emerald-50 disabled:opacity-50"
          >
            {questionsLoading ? "Loading..." : "Reload API Questions"}
          </button>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
            {selectedQuestions.length}/{categoryQuestions.length} selected
          </span>
        </div>
      </div>

      {questionsError && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          Dynamic API unavailable. Using local fallback questions. {questionsError}
        </div>
      )}

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_260px_auto]">
        <div className="rounded-2xl border border-gray-100 bg-slate-50 p-2">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {subjectOptions.map((category) => {
              const count = questionBank.filter((question) => {
                const fallbackCategory = question.id <= Math.ceil(questionBank.length / 2) ? "GK Question" : "Quantitative Aptitude";
                return (question.category ?? fallbackCategory) === category;
              }).length;
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => changeCategory(category)}
                  className={`rounded-xl px-4 py-3 text-left transition-all ${
                    isActive ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  <span className="block text-sm font-extrabold">{category}</span>
                  <span className={`mt-1 block text-xs font-bold ${isActive ? "text-white/80" : "text-slate-400"}`}>
                    {count} questions available
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          How many questions?
          <input
            type="number"
            min="1"
            max={categoryQuestions.length}
            value={questionLimit}
            onChange={(event) => setQuestionLimit(event.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <button
          type="button"
          onClick={selectQuestionCount}
          disabled={categoryQuestions.length === 0}
          className="flex h-11 items-center justify-center self-end rounded-xl bg-slate-950 px-5 text-sm font-extrabold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Select Questions
        </button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Test Date
          <input
            type="date"
            value={testDate}
            onChange={(event) => setTestDate(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Start Time
          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Duration (minutes)
          <input
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-2xl border border-gray-100 bg-slate-50 p-3">
        {categoryQuestions.map((question) => {
          const isSelected = selectedIds.includes(question.id);
          return (
            <label
              key={question.id}
              className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-all ${
                isSelected ? "border-emerald-200 bg-white shadow-sm" : "border-transparent bg-transparent hover:bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleQuestion(question.id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 accent-emerald-600"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-900">
                  {question.id}. {question.questionText}
                </p>
                {question.category && (
                  <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-600">
                    {question.category}
                  </p>
                )}
                <div className="mt-2 grid gap-1 sm:grid-cols-2">
                  {question.options.map((option) => (
                    <span key={option} className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-500">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
              {isSelected && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />}
            </label>
          );
        })}

        {categoryQuestions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm font-bold text-slate-500">
            {isExternalSubject
              ? `${selectedCategory} source is unavailable. The GitHub URL returned 404, so add questions to public/new_questions.json or update the source URL.`
              : `No ${selectedCategory} questions loaded yet. Click Reload API Questions.`}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handlePublish}
        disabled={!canPublish}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {published ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {published ? "Test Published" : "Publish Test"}
      </button>

      <div className="mt-4 grid gap-3 text-xs font-semibold text-slate-500 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <FileQuestion className="h-4 w-4 text-emerald-500" />
          Students receive only selected questions.
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-500" />
          Timer uses the published duration.
        </span>
      </div>
    </section>
  );
}
