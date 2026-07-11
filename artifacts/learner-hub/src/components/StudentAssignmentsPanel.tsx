import { useEffect, useState } from "react";
import { CalendarDays, FileText, MessageSquareText, Upload } from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StudentAssignmentsPanel() {
  const { assignments, reloadAssignments, submitAssignment } = useAcademic();
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    void reloadAssignments();
  }, [reloadAssignments]);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Assignments</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Upload submissions and view faculty feedback.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-600">
          {assignments.length} assigned
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assignments.map((assignment) => (
          <article key={assignment.id} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">{assignment.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-slate-600">
              {assignment.description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
              <CalendarDays className="h-4 w-4 text-indigo-500" />
              Due {formatDate(assignment.dueDate)}
            </div>

            {assignment.submittedFileName && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                Uploaded: {assignment.submittedFileName}
                {assignment.studentNote && (
                  <p className="mt-1 text-emerald-800">Your note: {assignment.studentNote}</p>
                )}
              </div>
            )}

            {assignment.feedback && (
              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <p className="mb-1 flex items-center gap-2 text-xs font-extrabold text-amber-700">
                  <MessageSquareText className="h-4 w-4" />
                  Faculty Feedback
                </p>
                <p className="text-sm font-medium leading-6 text-slate-700">{assignment.feedback}</p>
              </div>
            )}

            <textarea
              value={notes[assignment.id] ?? ""}
              onChange={(event) => setNotes((current) => ({ ...current, [assignment.id]: event.target.value }))}
              placeholder="Add a note for faculty..."
              rows={2}
              className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />

            <label className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-indigo-700">
              <Upload className="h-4 w-4" />
              {assignment.submittedFileName ? "Replace File" : "Upload"}
              <input
                type="file"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) submitAssignment(assignment.id, file.name, notes[assignment.id] ?? "");
                }}
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
