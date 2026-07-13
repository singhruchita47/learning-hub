import { useState } from "react";
import { CheckCircle2, Clock, FileQuestion, Send, Sparkles, X, Eye, Edit3, Trash2 } from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";
import { ACADEMIC_API_BASE } from "@/lib/api";

type QuestionCategory = "GK Question" | "Quantitative Aptitude" | "Reasoning" | "English";

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  category?: "GK Question" | "Quantitative Aptitude" | "Reasoning" | "English";
}

export default function FacultyTestCreator() {
  const {
    questionBank,
    questionsLoading,
    questionsError,
    reloadQuestions,
    publishTest,
    publishedTests,
    addQuestionsToBank,
  } = useAcademic();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>("GK Question");
  const [questionLimit, setQuestionLimit] = useState("10");
  const [testDate, setTestDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [published, setPublished] = useState(false);

  // AI Generation States
  const [aiCount, setAiCount] = useState("5");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editOptions, setEditOptions] = useState<string[]>(["", "", "", ""]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState("");

  // Question Detail Modal States
  const [activeDetailQuestion, setActiveDetailQuestion] = useState<Question | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  // Generate Questions via AI Route
  async function handleAiGenerate() {
    setAiGenerating(true);
    try {
      const response = await fetch(`${ACADEMIC_API_BASE}/ai/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedCategory,
          count: Number(aiCount),
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");
      const data = (await response.json()) as { questions: Question[] };
      setAiQuestions(data.questions || []);
      setShowAiPreview(true);
    } catch (err) {
      alert("Error generating questions with AI. Using local fallback.");
      // Local mock fallback if api fails
      const fallbacks: Question[] = Array.from({ length: Number(aiCount) }).map((_, idx) => ({
        id: Date.now() + idx,
        questionText: `AI generated sample question on ${selectedCategory} topic #${idx + 1}`,
        options: ["Option A details", "Option B details", "Option C details", "Option D details"],
        correctAnswer: "Option A details",
        category: selectedCategory,
      }));
      setAiQuestions(fallbacks);
      setShowAiPreview(true);
    } finally {
      setAiGenerating(false);
    }
  }

  function startEditing(index: number) {
    const q = aiQuestions[index];
    setEditingIndex(index);
    setEditQuestionText(q.questionText);
    setEditOptions([...q.options]);
    setEditCorrectAnswer(q.correctAnswer);
  }

  function saveEdit(index: number) {
    setAiQuestions((current) =>
      current.map((q, idx) =>
        idx === index
          ? {
              ...q,
              questionText: editQuestionText,
              options: [...editOptions],
              correctAnswer: editCorrectAnswer,
            }
          : q
      )
    );
    setEditingIndex(null);
  }

  function deleteAiQuestion(index: number) {
    setAiQuestions((current) => current.filter((_, idx) => idx !== index));
  }

  function finalizeAiQuestions() {
    addQuestionsToBank(aiQuestions);
    setShowAiPreview(false);
    setAiQuestions([]);
    alert("Successfully added AI questions to the Question Bank!");
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Custom Test Creator</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Choose a subject, select or generate questions, then set schedule to publish.
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
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          Dynamic API unavailable. Using local fallback questions. {questionsError}
        </div>
      )}

      {/* AI Generate Section */}
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">AI Question Assistant</h4>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Generate high-quality questions for {selectedCategory} instantly.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-700">
              Count:
              <select
                value={aiCount}
                onChange={(e) => setAiCount(e.target.value)}
                className="rounded-lg border border-violet-200 bg-white px-2 py-1 text-xs font-bold"
              >
                <option value="3">3 Questions</option>
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
              </select>
            </label>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={aiGenerating}
              className="flex h-9 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-black text-white hover:bg-violet-750 disabled:opacity-50"
            >
              {aiGenerating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
        </div>
      </div>

      {/* Subject Filter Section */}
      <div className="grid gap-3 lg:grid-cols-[1fr_260px_auto]">
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
            className="h-11 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300"
          />
        </label>

        <button
          type="button"
          onClick={selectQuestionCount}
          disabled={categoryQuestions.length === 0}
          className="flex h-11 items-center justify-center self-end rounded-xl bg-slate-950 px-5 text-sm font-extrabold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
        >
          Select Questions
        </button>
      </div>

      {/* Date & Time Settings */}
      <div className="grid gap-3 md:grid-cols-3 border-t border-gray-100 pt-5">
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Test Date
          <input
            type="date"
            value={testDate}
            onChange={(event) => setTestDate(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Start Time
          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Duration (minutes)
          <input
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-300"
          />
        </label>
      </div>

      {/* Question Bank Select List */}
      <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-2xl border border-gray-100 bg-slate-50 p-3">
        {categoryQuestions.map((question) => {
          const isSelected = selectedIds.includes(question.id);
          return (
            <div
              key={question.id}
              className={`flex items-start justify-between gap-3 rounded-xl border p-3 transition-all ${
                isSelected ? "border-emerald-200 bg-white shadow-sm" : "border-transparent bg-transparent hover:bg-white"
              }`}
            >
              <label className="flex cursor-pointer gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleQuestion(question.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 accent-emerald-600"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-slate-900 leading-snug">
                    {question.questionText}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    {question.category && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-700">
                        {question.category}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-400">
                      Options: {question.options.length}
                    </span>
                  </div>
                </div>
              </label>

              {/* View details action trigger */}
              <button
                type="button"
                onClick={() => {
                  setActiveDetailQuestion(question);
                  setShowDetailModal(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition-all shrink-0"
                title="Preview details"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        {categoryQuestions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm font-bold text-slate-500">
            {isExternalSubject
              ? `${selectedCategory} source is empty. Generate questions with AI above to add them here.`
              : `No ${selectedCategory} questions loaded. Click Generate with AI above or Reload.`}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handlePublish}
        disabled={!canPublish}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
      >
        {published ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {published ? "Test Published" : "Publish Test"}
      </button>

      {/* FOOTER WIDGETS */}
      <div className="grid gap-3 text-xs font-semibold text-slate-500 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <FileQuestion className="h-4 w-4 text-emerald-500" />
          Students receive only selected questions.
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-500" />
          Timer uses the published duration.
        </span>
      </div>

      {/* -------------------- AI PREVIEW MODAL SCREEN -------------------- */}
      {showAiPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex flex-col rounded-3xl bg-white w-full max-w-[800px] max-h-[85vh] shadow-2xl border border-violet-100 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 bg-gradient-to-r from-violet-50 to-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <h3 className="text-base font-extrabold text-slate-950">AI Question Generation Preview</h3>
              </div>
              <button
                onClick={() => setShowAiPreview(false)}
                className="rounded-full hover:bg-slate-100 p-1.5 text-slate-400 hover:text-slate-950 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {aiQuestions.map((q, idx) => {
                const isEditing = editingIndex === idx;

                return (
                  <div key={q.id || idx} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                          Question Text:
                          <textarea
                            value={editQuestionText}
                            onChange={(e) => setEditQuestionText(e.target.value)}
                            className="rounded-xl border border-slate-200 p-2 text-xs font-semibold w-full"
                            rows={3}
                          />
                        </label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {editOptions.map((opt, oIdx) => (
                            <label key={oIdx} className="grid gap-1 text-xs font-bold text-slate-600">
                              Option {oIdx + 1}:
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...editOptions];
                                  updated[oIdx] = e.target.value;
                                  setEditOptions(updated);
                                }}
                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold"
                              />
                            </label>
                          ))}
                        </div>
                        <label className="grid gap-1 text-xs font-bold text-slate-750">
                          Correct Answer Option Content:
                          <select
                            value={editCorrectAnswer}
                            onChange={(e) => setEditCorrectAnswer(e.target.value)}
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold"
                          >
                            {editOptions.map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>
                                {opt || `Empty Option ${oIdx + 1}`}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEdit(idx)}
                            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                          >
                            Save Updates
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-extrabold text-slate-900 leading-snug">
                            {idx + 1}. {q.questionText}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditing(idx)}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                              title="Edit"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAiQuestion(idx)}
                              className="rounded-lg border border-rose-200 p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = opt === q.correctAnswer;
                            return (
                              <span
                                key={oIdx}
                                className={`rounded-xl px-2.5 py-2 text-xs font-semibold border ${
                                  isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-100 text-slate-600"
                                }`}
                              >
                                {opt} {isCorrect && "✓"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {aiQuestions.length === 0 && (
                <p className="text-center text-xs font-bold text-slate-400 py-6">All questions have been cleared.</p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-500">
                {aiQuestions.length} AI question{aiQuestions.length > 1 ? "s" : ""} ready.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiPreview(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Discard All
                </button>
                <button
                  type="button"
                  disabled={aiQuestions.length === 0}
                  onClick={finalizeAiQuestions}
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-black text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  Finalize and Add to Bank
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- QUESTION BANK DETAIL MODAL PREVIEW -------------------- */}
      {showDetailModal && activeDetailQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-white w-full max-w-[500px] shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="border-b border-gray-100 p-5 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-emerald-800 uppercase tracking-widest">Question Details</h4>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setActiveDetailQuestion(null);
                }}
                className="rounded-full hover:bg-slate-100 p-1.5 text-slate-400 hover:text-slate-950 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Text</p>
                <p className="text-base font-extrabold text-slate-900 mt-1">{activeDetailQuestion.questionText}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Options Checklist</p>
                <div className="grid gap-2">
                  {activeDetailQuestion.options.map((opt, idx) => {
                    const isCorrect = opt === activeDetailQuestion.correctAnswer;
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl px-3.5 py-3 text-xs font-semibold border ${
                          isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold" : "bg-slate-50 border-slate-100 text-slate-600"
                        }`}
                      >
                        <span className="mr-1.5">{idx + 1}.</span> {opt} {isCorrect && <span className="ml-2 bg-emerald-600 text-white text-[9px] rounded-full px-1.5 py-0.5">CORRECT</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeDetailQuestion.category && (
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-slate-400">Category:</span>
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">{activeDetailQuestion.category}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
