import { useState } from "react";
import { CalendarDays, Send } from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";

export default function FacultyAssignmentCreator() {
  const { addAssignment, assignments } = useAcademic();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!title.trim() || !description.trim() || !dueDate) return;

    addAssignment({
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Assignment Creator</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Create an assignment and send it into the shared student view.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-600">
          {assignments.length} live
        </span>
      </div>

      <div className="grid gap-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Assignment title"
          className="h-11 rounded-xl border border-gray-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description or submission instructions"
          rows={4}
          className="resize-none rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />

        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Due Date
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </label>

        <button
          type="button"
          onClick={handleSend}
          disabled={!title.trim() || !description.trim() || !dueDate}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {sent ? "Sent to Students" : "Send to Students"}
        </button>
      </div>
    </section>
  );
}
