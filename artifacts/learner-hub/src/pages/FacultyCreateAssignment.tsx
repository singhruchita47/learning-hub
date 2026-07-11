import { useState } from "react";
import { CalendarDays, ClipboardList, Send } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

export default function FacultyCreateAssignment() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseCode: "CS301",
  });
  const [status, setStatus] = useState("");

  async function createAssignment() {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      setStatus("Please fill title, instructions, and due date.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, facultyId: "faculty-demo" }),
      });
      if (!response.ok) throw new Error("Unable to save assignment");
      setForm({ title: "", description: "", dueDate: "", courseCode: "CS301" });
      setStatus("Assignment created and sent to student Assignment module.");
    } catch {
      setStatus("Backend offline: start API server to save assignment in MongoDB.");
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">Faculty assignment module</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Create Assignment</h1>
          <p className="mt-2 text-sm font-bold text-slate-600">
            Create student tasks and publish them directly into the student Assignment page.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Assignment Details</h2>
              <p className="text-sm font-bold text-slate-500">Title, instructions, course, and due date.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Assignment title"
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Instructions / description"
              rows={5}
              className="resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={form.courseCode}
                onChange={(event) => setForm((current) => ({ ...current, courseCode: event.target.value }))}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option value="CS301">CS301 - Data Structures</option>
                <option value="CS302">CS302 - Database Systems</option>
                <option value="CS303">CS303 - Operating Systems</option>
              </select>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>
            {status && <p className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">{status}</p>}
            <button
              type="button"
              onClick={createAssignment}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white shadow-lg shadow-violet-600/20"
            >
              <Send className="h-4 w-4" />
              Publish Assignment
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
