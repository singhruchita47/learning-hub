import { useState } from "react";
import { CheckCircle2, Clock, FileQuestion, Send, Sparkles, X, Eye, Edit3, Trash2, BookOpen, Brain } from "lucide-react";
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
  const [testMarks, setTestMarks] = useState("100");
  const [published, setPublished] = useState(false);

  // AI Generation States
  const [aiCount, setAiCount] = useState("5");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<Question[]>([]);
  const [aiTopic, setAiTopic] = useState("");
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

  // Per-category question counts for display
  const gkCount = questionBank.filter((q) => (q.category ?? "") === "GK Question").length;
  const aptitudeCount = questionBank.filter((q) => (q.category ?? "") === "Quantitative Aptitude").length;
  const reasoningCount = questionBank.filter((q) => (q.category ?? "") === "Reasoning").length;
  const englishCount = questionBank.filter((q) => (q.category ?? "") === "English").length;

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
      marks: Number(testMarks),
      questions: selectedQuestions,
    });

    setSelectedIds([]);
    setQuestionLimit("10");
    setTestDate("");
    setStartTime("");
    setDurationMinutes("30");
    setTestMarks("100");
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
          topic: aiTopic,
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
        questionText: `AI generated sample question on ${aiTopic || selectedCategory} topic #${idx + 1}`,
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
    <>
      {/* ── Question Bank Stats Banner ── */}
      <div className="rounded-[1.5rem] border border-violet-100 bg-gradient-to-r from-violet-50/80 via-indigo-50/60 to-emerald-50/50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-violet-600" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Question Bank</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-[11px] font-black text-blue-700">
              <Brain className="h-3 w-3" />
              GK: {questionsLoading ? "..." : gkCount} questions
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-[11px] font-black text-emerald-700">
              <FileQuestion className="h-3 w-3" />
              Aptitude: {questionsLoading ? "..." : aptitudeCount} questions
            </span>
            {reasoningCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-[11px] font-black text-orange-700">
                Reasoning: {reasoningCount}
              </span>
            )}
            {englishCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 border border-pink-200 px-3 py-1 text-[11px] font-black text-pink-700">
                English: {englishCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_450px]">
        {/* ── Left Column: Test Creator Control Panel ── */}
        <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm space-y-5">
        
        {/* Header and Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-800">Custom Test Creator</h3>
            <p className="text-xs font-bold text-slate-400">Select questions and set test details.</p>
          </div>
          <button
            type="button"
            onClick={() => void reloadQuestions()}
            disabled={questionsLoading}
            className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-50 cursor-pointer"
          >
            {questionsLoading ? "Loading..." : "Reload Bank"}
          </button>
        </div>

        {questionsError && (
          <div className="rounded-xl border border-amber-250 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
            Dynamic API offline: fallback questions enabled.
          </div>
        )}

        {/* AI Generate Section */}
        <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-tight">AI Question Generator</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Generate high-quality questions for {selectedCategory} instantly.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <input
                type="text"
                placeholder="Enter specific topic (e.g. 'Indian Rivers', 'Time and Work')"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="h-9 w-full rounded-xl border border-violet-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-violet-400"
              />
              <div className="flex items-center justify-between gap-3">
                <select
                  value={aiCount}
                  onChange={(e) => setAiCount(e.target.value)}
                  className="h-9 rounded-xl border border-violet-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                </select>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={aiGenerating}
                  className="flex h-9 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-black text-white hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
                >
                  {aiGenerating ? "Generating..." : "Generate AI"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subject dropdown & limit row */}
        <div className="grid gap-4 md:grid-cols-2">
          
          {/* Dropdown for subject choice as requested */}
          <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Select Subject:
            <select
              value={selectedCategory}
              onChange={(e) => changeCategory(e.target.value as QuestionCategory)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
            >
              {subjectOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Quick selection limit:
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max={categoryQuestions.length}
                value={questionLimit}
                onChange={(event) => setQuestionLimit(event.target.value)}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-violet-350 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={selectQuestionCount}
                disabled={categoryQuestions.length === 0}
                className="h-11 rounded-xl bg-slate-900 px-3 text-xs font-extrabold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                Auto Select
              </button>
            </div>
          </label>
        </div>

        {/* Date, Time & Marks Settings */}
        <div className="grid gap-4 md:grid-cols-4 border-t border-slate-100 pt-4">
          <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Test Date
            <input
              type="date"
              value={testDate}
              onChange={(event) => setTestDate(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-violet-350 focus:bg-white transition cursor-pointer"
            />
          </label>
          <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Start Time
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-violet-350 focus:bg-white transition cursor-pointer"
            />
          </label>
          <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Duration (min)
            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-violet-350 focus:bg-white transition"
            />
          </label>
          <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Total Marks
            <input
              type="number"
              min="1"
              value={testMarks}
              onChange={(event) => setTestMarks(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-violet-350 focus:bg-white transition"
            />
          </label>
        </div>

        {/* Question Bank Checklist (Compact) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Checklist ({categoryQuestions.length} questions available)</p>
            <span className="rounded-full bg-violet-50 border border-violet-100 px-2 py-0.5 text-[9px] font-black text-violet-600">{selectedCategory}</span>
          </div>
          <div className="max-h-[220px] space-y-2 overflow-y-auto rounded-2xl border border-slate-150 bg-slate-50/50 p-3 [scrollbar-width:thin]">
            {categoryQuestions.map((question) => {
              const isSelected = selectedIds.includes(question.id);
              return (
                <div
                  key={question.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border p-2.5 transition-all ${
                    isSelected ? "border-emerald-250 bg-white shadow-sm" : "border-transparent bg-transparent hover:bg-white"
                  }`}
                >
                  <label className="flex cursor-pointer gap-2.5 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleQuestion(question.id)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 accent-emerald-600"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                        {question.questionText}
                      </p>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveDetailQuestion(question);
                      setShowDetailModal(true);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shrink-0 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}

            {categoryQuestions.length === 0 && (
              <div className="py-6 text-center text-xs font-bold text-slate-400">
                No questions available. Generate with AI or reload bank.
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          disabled={!canPublish}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-black text-white hover:bg-emerald-700 shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          {published ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {published ? "Test Published successfully!" : "Publish Test Module"}
        </button>

      </section>

      {/* ── Right Column: Test Preview & Review Panel ── */}
      <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-450">Test Live Review Panel</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-black text-emerald-600 border border-emerald-100">
              {selectedQuestions.length} QUESTIONS SELECTED
            </span>
          </div>

          {/* Metadata preview card */}
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 mb-4 grid grid-cols-2 gap-3.5 text-left">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Subject Category</p>
              <p className="text-xs font-black text-slate-800 mt-0.5">{selectedCategory}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Scheduled Date & Time</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {testDate ? `${new Date(testDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at ${startTime || "00:00"}` : "Not Scheduled"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Duration Limits</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{durationMinutes} Minutes</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Questions Count</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{selectedQuestions.length} Questions</p>
            </div>
          </div>

          {/* Scrollable Questions list preview */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Selected Questions Review List</p>
            <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1 border border-slate-100 rounded-2xl p-2.5 [scrollbar-width:thin]">
              {selectedQuestions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-slate-100 bg-white p-3 space-y-2 text-left">
                  <p className="text-xs font-extrabold text-slate-800 leading-snug">
                    {idx + 1}. {q.questionText}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = opt === q.correctAnswer;
                      return (
                        <span
                          key={oIdx}
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold border truncate ${
                            isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-455"
                          }`}
                          title={opt}
                        >
                          {opt} {isCorrect && "✓"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}

              {selectedQuestions.length === 0 && (
                <div className="py-12 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Select questions from the left checklist to preview test sheet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info inside preview */}
        <div className="text-[10px] font-semibold text-slate-400 text-center mt-6">
          This preview matches the student-facing exam interface format.
        </div>
      </section>

    </div>

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

    </>
  );
}
