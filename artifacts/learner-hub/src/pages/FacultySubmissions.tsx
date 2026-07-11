import { useEffect, useState } from "react";
import { Download, FileCheck2, Search } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

type Submission = {
  _id: string;
  studentId: string;
  fileName: string;
  note?: string;
  feedback?: string;
  marks?: number;
  createdAt: string;
  assignment?: {
    title?: string;
    courseCode?: string;
    dueDate?: string;
  };
};

export default function FacultySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "offline">("loading");
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [markDrafts, setMarkDrafts] = useState<Record<string, string>>({});

  function loadSubmissions() {
    setStatus("loading");
    fetch(`${API_BASE}/assignment-submissions`)
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json();
      })
      .then((data: { submissions: Submission[] }) => {
        setSubmissions(data.submissions);
        setStatus("ready");
      })
      .catch(() => setStatus("offline"));
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function saveFeedback(submissionId: string) {
    const feedback = feedbackDrafts[submissionId] ?? "";
    const marks = markDrafts[submissionId] ? Number(markDrafts[submissionId]) : undefined;

    const response = await fetch(`${API_BASE}/assignment-submissions/${submissionId}/feedback`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback, marks }),
    });

    if (response.ok) {
      loadSubmissions();
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">Faculty review center</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-950">Student Submissions</h1>
              <p className="mt-2 text-sm font-bold text-slate-600">Review assignment uploads, notes, marks, and feedback status.</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
              <FileCheck2 className="h-7 w-7" />
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-slate-950">Assignment Checks</h2>
            <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500">
              <Search className="h-4 w-4" />
              Search submissions
            </div>
          </div>

          {status === "offline" && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
              Backend offline hai. API server start karoge toh MongoDB submissions yahan live aayenge.
            </div>
          )}

          <div className="grid gap-4">
            {submissions.length > 0 ? submissions.map((item) => {
              const feedbackValue = feedbackDrafts[item._id] ?? item.feedback ?? "";
              const markValue = markDrafts[item._id] ?? (item.marks ? String(item.marks) : "");

              return (
              <article key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{item.assignment?.title ?? "Assignment submission"}</h3>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {item.studentId} - {item.assignment?.courseCode ?? "LMS"} - {new Date(item.createdAt).toLocaleString("en-IN")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-600">File: {item.fileName}</p>
                    {item.note && <p className="mt-1 text-xs font-bold text-slate-500">Student note: {item.note}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                      Marks: {item.marks ?? "Pending"}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${
                      item.feedback ? "bg-indigo-50 text-indigo-700" : "bg-orange-50 text-orange-700"
                    }`}>
                      {item.feedback ? "Feedback sent" : "Need feedback"}
                    </span>
                    <button className="flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white">
                      <Download className="h-4 w-4" />
                      View File
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 rounded-2xl border border-violet-100 bg-white p-4 md:grid-cols-[140px_1fr_auto] md:items-end">
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Marks</span>
                    <input
                      type="number"
                      value={markValue}
                      onChange={(event) => setMarkDrafts((current) => ({ ...current, [item._id]: event.target.value }))}
                      placeholder="0"
                      className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Faculty feedback</span>
                    <textarea
                      value={feedbackValue}
                      onChange={(event) => setFeedbackDrafts((current) => ({ ...current, [item._id]: event.target.value }))}
                      placeholder="Write feedback for this student..."
                      rows={2}
                      className="resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => saveFeedback(item._id)}
                    className="h-11 rounded-xl bg-violet-600 px-5 text-xs font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
                  >
                    Save Feedback
                  </button>
                </div>
              </article>
            );
            }) : (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-10 text-center">
                <p className="text-sm font-black text-violet-800">No submissions yet</p>
                <p className="mt-1 text-xs font-bold text-violet-500">Student assignment uploads will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
