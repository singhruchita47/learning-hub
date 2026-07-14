import { useState, useEffect } from "react";
import { ClipboardList, FileCheck2, CalendarDays, Send, Image, Loader, X, Download, Search } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

type Tab = "create" | "submissions";

type Submission = {
  _id: string;
  studentId: string;
  fileName: string;
  fileUrl?: string;
  note?: string;
  feedback?: string;
  marks?: number;
  createdAt: string;
  assignment?: { title?: string; courseCode?: string; dueDate?: string };
};

export default function AdminAssignments() {
  const [tab, setTab] = useState<Tab>("create");

  // ── Create Assignment State ──
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", courseCode: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [createStatus, setCreateStatus] = useState("");

  // ── Submissions State ──
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subStatus, setSubStatus] = useState<"loading" | "ready" | "offline">("loading");
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [markDrafts, setMarkDrafts] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Load courses on mount
  useEffect(() => {
    fetch(`${API_BASE}/courses`)
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        if (data?.courses) {
          setCoursesList(data.courses);
          if (data.courses.length > 0)
            setForm(prev => ({ ...prev, courseCode: data.courses[0].code }));
        }
      })
      .catch(() => {});
  }, []);

  // Load submissions when tab switches to submissions
  useEffect(() => {
    if (tab === "submissions") loadSubmissions();
  }, [tab]);

  function loadSubmissions() {
    setSubStatus("loading");
    fetch(`${API_BASE}/assignment-submissions`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: { submissions: Submission[] }) => {
        setSubmissions(data.submissions);
        setSubStatus("ready");
      })
      .catch(() => setSubStatus("offline"));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => { setImageUrl(reader.result as string); setUploadingImage(false); };
    reader.onerror = () => { alert("Error reading file."); setUploadingImage(false); };
    reader.readAsDataURL(file);
  }

  async function createAssignment() {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate || !form.courseCode) {
      setCreateStatus("Please fill title, instructions, course, and due date.");
      return;
    }
    try {
      const user = (() => { try { return JSON.parse(localStorage.getItem("learningHubUser") || "null"); } catch { return null; } })();
      const facultyId = user?.email ?? user?.id ?? "admin";
      const res = await fetch(`${API_BASE}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl, facultyId }),
      });
      if (!res.ok) throw new Error();
      setForm({ title: "", description: "", dueDate: "", courseCode: coursesList[0]?.code || "" });
      setImageUrl("");
      setCreateStatus("✅ Assignment published to student dashboard!");
    } catch {
      setCreateStatus("❌ Failed to publish. Check API server.");
    }
  }

  async function saveFeedback(submissionId: string) {
    const feedback = feedbackDrafts[submissionId] ?? "";
    const marks = markDrafts[submissionId] ? Number(markDrafts[submissionId]) : undefined;
    const res = await fetch(`${API_BASE}/assignment-submissions/${submissionId}/feedback`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback, marks }),
    });
    if (res.ok) loadSubmissions();
  }

  const filteredSubmissions = submissions.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.studentId.toLowerCase().includes(q) ||
      (s.assignment?.title ?? "").toLowerCase().includes(q) ||
      (s.assignment?.courseCode ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Hero Banner ── */}
        <section className="rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">Admin Control Center</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">
                Assignments &amp; <span className="text-violet-600">Submissions</span>
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Create assignments for students and review their uploaded submissions with marks &amp; feedback.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
              <ClipboardList className="h-7 w-7" />
            </div>
          </div>
        </section>

        {/* ── Tab Switcher ── */}
        <div className="flex gap-3">
          <button
            onClick={() => setTab("create")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition shadow-sm ${
              tab === "create"
                ? "bg-violet-600 text-white shadow-violet-300/40"
                : "bg-white text-slate-500 border border-slate-200 hover:border-violet-200 hover:text-violet-600"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Create Assignment
          </button>
          <button
            onClick={() => setTab("submissions")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition shadow-sm ${
              tab === "submissions"
                ? "bg-violet-600 text-white shadow-violet-300/40"
                : "bg-white text-slate-500 border border-slate-200 hover:border-violet-200 hover:text-violet-600"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            Student Submissions
            {submissions.length > 0 && (
              <span className="ml-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">
                {submissions.length}
              </span>
            )}
          </button>
        </div>

        {/* ══════════════ CREATE ASSIGNMENT TAB ══════════════ */}
        {tab === "create" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_450px]">

            {/* Left: Form */}
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800">Assignment Details</h2>
                    <p className="text-xs font-bold text-slate-400">Fill in the task fields below.</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Assignment title"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                  />
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Instructions / description"
                    rows={4}
                    className="resize-none w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Course:
                      <select
                        value={form.courseCode}
                        onChange={e => setForm(p => ({ ...p, courseCode: e.target.value }))}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                      >
                        {coursesList.length > 0
                          ? coursesList.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)
                          : <option value="">No courses yet</option>
                        }
                      </select>
                    </label>

                    <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Due Date:
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          value={form.dueDate}
                          onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                        />
                      </div>
                    </label>
                  </div>

                  {/* Image attachment */}
                  <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-4 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Attach Reference Photo</p>
                    <div className="flex items-center gap-3">
                      <input type="file" id="admin-assign-img" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      <label htmlFor="admin-assign-img"
                        className="flex h-10 px-4 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs font-black text-slate-600 gap-2 shadow-sm transition">
                        {uploadingImage ? <Loader className="h-4 w-4 animate-spin text-violet-600" /> : <Image className="h-4 w-4 text-violet-600" />}
                        {uploadingImage ? "Uploading..." : "Choose Image File"}
                      </label>
                      {imageUrl && (
                        <button onClick={() => setImageUrl("")} className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition cursor-pointer">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {createStatus && (
                    <p className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3 text-xs font-bold text-violet-700">{createStatus}</p>
                  )}
                </div>
              </div>

              <button
                onClick={createAssignment}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-xs font-black text-white hover:bg-violet-700 shadow-md transition cursor-pointer"
              >
                <Send className="h-4 w-4" /> Publish Assignment
              </button>
            </section>

            {/* Right: Live Preview */}
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">Live Student Preview</h2>
                  </div>
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[9px] font-black text-violet-600 border border-violet-100">DRAFT MODE</span>
                </div>

                <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-black text-violet-700 uppercase border border-violet-100">
                      {form.courseCode || "CS301"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ⏰ Due: {form.dueDate ? new Date(form.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not Set"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-snug truncate">
                      {form.title || "Untitled Assignment"}
                    </h3>
                    <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed whitespace-pre-wrap min-h-[60px] max-h-[140px] overflow-y-auto">
                      {form.description || "Instructions will appear here as you type..."}
                    </p>
                  </div>
                  {imageUrl ? (
                    <div className="rounded-xl overflow-hidden border border-slate-150 max-h-[180px] bg-slate-50">
                      <img src={imageUrl} alt="Reference" className="max-w-full max-h-[180px] object-cover w-full" />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400 font-semibold">
                      🖼️ No reference photo attached
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Student Upload Area (Preview)</p>
                  <div className="flex h-10 w-full items-center justify-center rounded-xl bg-white border border-dashed border-slate-200 text-xs text-slate-400 font-bold">
                    📂 Drop submission files here
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 text-center mt-6">
                This preview matches the student-facing dashboard layout.
              </p>
            </section>
          </div>
        )}

        {/* ══════════════ SUBMISSIONS TAB ══════════════ */}
        {tab === "submissions" && (
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-black text-slate-950">Student Submissions</h2>
              <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500 min-w-[240px]">
                <Search className="h-4 w-4 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by student, course..."
                  className="bg-transparent outline-none text-xs font-bold text-slate-700 w-full placeholder:text-slate-400"
                />
              </div>
            </div>

            {subStatus === "offline" && (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                Backend offline. Submissions will appear once API server is running.
              </div>
            )}
            {subStatus === "loading" && (
              <div className="flex h-40 items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-violet-500" />
              </div>
            )}

            <div className="grid gap-4">
              {filteredSubmissions.length > 0 ? filteredSubmissions.map(item => {
                const feedbackValue = feedbackDrafts[item._id] ?? item.feedback ?? "";
                const markValue = markDrafts[item._id] ?? (item.marks ? String(item.marks) : "");
                return (
                  <article key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-950">{item.assignment?.title ?? "Assignment submission"}</h3>
                        <p className="mt-1 text-sm font-bold text-slate-500">
                          {item.studentId} · {item.assignment?.courseCode ?? "LMS"} · {new Date(item.createdAt).toLocaleString("en-IN")}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-slate-600">File: {item.fileName}</p>
                        {item.note && <p className="mt-1 text-xs font-bold text-slate-500">Note: {item.note}</p>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                          Marks: {item.marks ?? "Pending"}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${item.feedback ? "bg-indigo-50 text-indigo-700" : "bg-orange-50 text-orange-700"}`}>
                          {item.feedback ? "Feedback sent" : "Needs feedback"}
                        </span>
                        {item.fileUrl ? (
                          <a href={item.fileUrl} target="_blank" rel="noreferrer"
                            className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black text-white hover:bg-slate-800">
                            <Download className="h-4 w-4" /> View File
                          </a>
                        ) : (
                          <button onClick={() => window.open(item.fileName, "_blank")}
                            className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black text-white hover:bg-slate-800">
                            <Download className="h-4 w-4" /> View File
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 rounded-2xl border border-violet-100 bg-white p-4 md:grid-cols-[140px_1fr_auto] md:items-end">
                      <label className="grid gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Marks</span>
                        <input
                          type="number"
                          value={markValue}
                          onChange={e => setMarkDrafts(p => ({ ...p, [item._id]: e.target.value }))}
                          placeholder="0"
                          className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Feedback</span>
                        <textarea
                          value={feedbackValue}
                          onChange={e => setFeedbackDrafts(p => ({ ...p, [item._id]: e.target.value }))}
                          placeholder="Write feedback for this student..."
                          rows={2}
                          className="resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                        />
                      </label>
                      <button
                        onClick={() => saveFeedback(item._id)}
                        className="h-11 rounded-xl bg-violet-600 px-5 text-xs font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 cursor-pointer"
                      >
                        Save Feedback
                      </button>
                    </div>
                  </article>
                );
              }) : subStatus === "ready" && (
                <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-10 text-center">
                  <p className="text-sm font-black text-violet-800">No submissions yet</p>
                  <p className="mt-1 text-xs font-bold text-violet-500">Student assignment uploads will appear here.</p>
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
