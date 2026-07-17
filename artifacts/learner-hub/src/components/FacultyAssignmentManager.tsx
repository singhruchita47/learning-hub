import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, CheckSquare2, ChevronDown, Code2, FileText, MessageSquareText, Send } from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";
import { easyCodingQuestions } from "@/data/codingQuestions";

export default function FacultyAssignmentManager() {
  const { assignments, addAssignment, addAssignmentFeedback, publishCodingQuestions, publishedCodingQuestions } = useAcademic();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showCodingQuestions, setShowCodingQuestions] = useState(false);
  const [selectedCodingIds, setSelectedCodingIds] = useState<string[]>(() =>
    publishedCodingQuestions.map((question) => question.id),
  );
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [marksDrafts, setMarksDrafts] = useState<Record<string, string>>({});

  function handleCreateAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !dueDate) return;

    addAssignment({
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
  }

  function toggleCodingQuestion(questionId: string) {
    setSelectedCodingIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  }

  function handlePublishCodingQuestions() {
    const selectedQuestions = easyCodingQuestions.filter((question) => selectedCodingIds.includes(question.id));
    publishCodingQuestions(selectedQuestions);
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-slate-900">Faculty Assignment Tools</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Create tasks for students and leave feedback after they upload work.
        </p>
      </div>

      <form onSubmit={handleCreateAssignment} className="grid gap-3 rounded-2xl border border-gray-100 bg-slate-50 p-4 lg:grid-cols-[1fr_1.4fr_180px_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Assignment title"
          className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Instructions"
          className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </form>

      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
        <button
          type="button"
          onClick={() => setShowCodingQuestions((current) => !current)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Code2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-slate-950">Coding</span>
              <span className="block text-xs font-semibold text-slate-500">Select coding questions, then publish them for students.</span>
            </span>
          </span>
          <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${showCodingQuestions ? "rotate-180" : ""}`} />
        </button>

        {showCodingQuestions && (
          <div className="mt-4">
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                <CheckSquare2 className="h-4 w-4 text-indigo-600" />
                {selectedCodingIds.length}/{easyCodingQuestions.length} coding questions selected
              </span>
              <button
                type="button"
                disabled={selectedCodingIds.length === 0}
                onClick={handlePublishCodingQuestions}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-extrabold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send className="h-4 w-4" />
                Publish Selected
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {easyCodingQuestions.map((question, index) => {
                const selected = selectedCodingIds.includes(question.id);
                return (
                  <label
                    key={question.id}
                    className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
                      selected ? "border-indigo-200 bg-white ring-2 ring-indigo-100" : "border-gray-100 bg-white hover:border-indigo-100"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleCodingQuestion(question.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <p className="text-xs font-extrabold text-indigo-600">Coding Q{index + 1}</p>
                          <h3 className="mt-1 text-sm font-extrabold text-slate-900">{question.title}</h3>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                        Easy
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-6 text-slate-600">{question.description}</p>
                    <div className="mt-3 grid gap-2 text-xs font-bold text-slate-600 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <span className="block text-slate-400">Input</span>
                        {question.inputTestCase}
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <span className="block text-slate-400">Output</span>
                        {question.expectedOutput}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {assignments.map((assignment) => {
          const draft = feedbackDrafts[assignment.id] ?? assignment.feedback ?? "";
          return (
            <article key={assignment.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">{assignment.title}</h3>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">{assignment.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                      Due {assignment.dueDate}
                    </span>
                    <span className={assignment.submittedFileName ? "text-emerald-600" : "text-amber-600"}>
                      {assignment.submittedFileName ? `Submitted: ${assignment.submittedFileName}` : "Waiting for upload"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm">
                <label className="mb-3 flex items-center gap-2 text-xs font-black text-indigo-800">
                  <MessageSquareText className="h-4 w-4 text-indigo-600" />
                  Evaluate & Feedback
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <textarea
                    value={draft}
                    onChange={(event) =>
                      setFeedbackDrafts((current) => ({
                        ...current,
                        [assignment.id]: event.target.value,
                      }))
                    }
                    placeholder="Write constructive feedback for the student..."
                    className="min-h-[80px] flex-1 resize-none rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                  />
                  <div className="flex w-full flex-col gap-2 sm:w-32 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksDrafts[assignment.id] ?? assignment.marks ?? ""}
                      onChange={(event) =>
                        setMarksDrafts((current) => ({
                          ...current,
                          [assignment.id]: event.target.value,
                        }))
                      }
                      placeholder="Marks / 100"
                      className="h-11 w-full rounded-xl border border-indigo-100 bg-white px-3 text-center text-sm font-black text-indigo-900 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                    />
                    <button
                      type="button"
                      onClick={() => addAssignmentFeedback(assignment.id, draft, marksDrafts[assignment.id] ? Number(marksDrafts[assignment.id]) : undefined)}
                      className="h-11 w-full rounded-xl bg-indigo-600 px-4 text-xs font-black text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                    >
                      Save Evaluation
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
