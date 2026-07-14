import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, BookOpen, CalendarDays, TrendingUp, ChevronDown } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API = ACADEMIC_API_BASE.replace("/academic", "");

interface Course {
  _id: string;
  title: string;
  code: string;
}

interface AttendanceRecord {
  _id: string;
  courseCode: string;
  date: string;
  status: "present" | "absent";
  markedAt: string;
}

function getUser() {
  try {
    const saved = localStorage.getItem("learningHubUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const TODAY = new Date().toISOString().slice(0, 10);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

export default function StudentAttendance() {
  const user = getUser();
  const studentId = user?.email ?? user?.id ?? "student-demo";
  const studentName = user?.name ?? "Student";

  const [courses, setCourses] = useState<Course[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [marking, setMarking] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch(`${ACADEMIC_API_BASE}/courses`)
      .then((r) => r.json())
      .then((d: { courses?: Course[] }) => setCourses(d.courses || []))
      .catch(() => {});

    fetch(`${API}/attendance/student/${encodeURIComponent(studentId)}`)
      .then((r) => r.json())
      .then((d: { attendance?: AttendanceRecord[] }) => setRecords(d.attendance || []))
      .catch(() => {});
  }, [studentId]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function markAttendance(courseCode: string, status: "present" | "absent") {
    setMarking(courseCode + status);
    try {
      const res = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, studentName, courseCode, date: TODAY, status }),
      });
      if (res.ok) {
        const d = await res.json() as { record: AttendanceRecord };
        setRecords((prev) => {
          const idx = prev.findIndex((r) => r.courseCode === courseCode && r.date === TODAY);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = d.record;
            return updated;
          }
          return [...prev, d.record];
        });
        showToast(status === "present" ? "✅ Attendance marked as Present!" : "❌ Marked Absent", status === "present");
      }
    } catch {
      showToast("Server offline. Try again.", false);
    } finally {
      setMarking(null);
    }
  }

  function getTodayRecord(courseCode: string) {
    return records.find((r) => r.courseCode === courseCode && r.date === TODAY);
  }

  function getStats(courseCode: string) {
    const courseRecords = records.filter((r) => r.courseCode === courseCode);
    const present = courseRecords.filter((r) => r.status === "present").length;
    const total = courseRecords.length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, total, pct };
  }

  const overallPresent = records.filter((r) => r.status === "present").length;
  const overallTotal = records.length;
  const overallPct = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 0;

  const filteredHistory = selectedCourse === "all"
    ? records
    : records.filter((r) => r.courseCode === selectedCourse);

  return (
    <main className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-black text-white shadow-2xl transition-all ${toast.ok ? "bg-emerald-500" : "bg-rose-500"}`}>
          {toast.ok ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Title and Date Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Attendance</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Mark today's attendance for each subject and track your history.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-50 border border-violet-200 px-4 py-2.5 text-xs font-bold text-violet-850 shadow-sm shrink-0">
            <span>📅</span>
            <span>Today: {formatDate(TODAY)}</span>
          </div>
        </div>

        {/* ── Stats Cards Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: "Present Days", value: overallPresent, txt: "text-emerald-600" },
            { label: "Total Days",   value: overallTotal,   txt: "text-blue-600" },
            { label: "Overall Attendance", value: `${overallPct}%`, txt: overallPct >= 75 ? "text-emerald-600" : "text-rose-500", extra: overallPct >= 75 ? "✅ Safe" : "⚠️ Low" },
          ].map(({ label, value, txt, extra }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px] relative">
              <span className={`text-4xl font-black ${txt}`}>{value}</span>
              <span className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                {label}
                {extra && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${overallPct >= 75 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-500 border border-rose-100"}`}>
                    {extra}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Mark Today's Attendance */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-base font-black text-slate-800">
            <Clock className="h-5 w-5 text-violet-500" />
            Today's Checkpoints
          </h2>
          {courses.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400 font-extrabold text-sm">
              No courses found. Please ask your faculty to add courses.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const todayRec = getTodayRecord(course.code);
                const stats = getStats(course.code);
                const isMarkingPresent = marking === course.code + "present";
                const isMarkingAbsent = marking === course.code + "absent";

                return (
                  <div
                    key={course._id}
                    className={`group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                      todayRec?.status === "present"
                        ? "border-emerald-250 bg-emerald-50/10"
                        : todayRec?.status === "absent"
                        ? "border-rose-250 bg-rose-50/10"
                        : "border-slate-100"
                    }`}
                  >
                    {/* Status badge */}
                    {todayRec && (
                      <div className={`absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full ${todayRec.status === "present" ? "bg-emerald-100 text-emerald-650" : "bg-rose-150 text-rose-650"}`}>
                        {todayRec.status === "present" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                    )}

                    <div className="flex items-start gap-3 pr-10">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-violet-500">{course.code}</p>
                        <h3 className="mt-1 text-sm font-extrabold text-slate-800 leading-snug">{course.title}</h3>
                      </div>
                    </div>

                    {/* Stats progress */}
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2">
                        <div
                          className={`h-full rounded-full ${stats.pct >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                          style={{ width: `${stats.pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-black ${stats.pct >= 75 ? "text-emerald-650" : "text-rose-500"}`}>
                        {stats.pct}%
                      </span>
                    </div>
                    <p className="mt-1.5 text-[10px] font-bold text-slate-400">{stats.present}/{stats.total} classes attended</p>

                    {/* Check-in controls */}
                    {todayRec ? (
                      <div className={`mt-5 rounded-2xl px-4 py-2.5 text-center text-xs font-black ${todayRec.status === "present" ? "bg-emerald-100/50 text-emerald-700 border border-emerald-200/20" : "bg-rose-100/50 text-rose-700 border border-rose-200/20"}`}>
                        {todayRec.status === "present" ? "✅ Marked Present" : "❌ Marked Absent"} — {new Date(todayRec.markedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    ) : (
                      <div className="mt-5 flex gap-2.5">
                        <button
                          onClick={() => markAttendance(course.code, "present")}
                          disabled={!!marking}
                          className="flex-1 rounded-2xl bg-emerald-500 py-3 text-xs font-black text-white hover:bg-emerald-650 transition disabled:opacity-65 cursor-pointer"
                        >
                          {isMarkingPresent ? "..." : "Present"}
                        </button>
                        <button
                          onClick={() => markAttendance(course.code, "absent")}
                          disabled={!!marking}
                          className="flex-1 rounded-2xl bg-rose-50 border border-rose-200 py-3 text-xs font-black text-rose-600 hover:bg-rose-100 transition disabled:opacity-65 cursor-pointer"
                        >
                          {isMarkingAbsent ? "..." : "Absent"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* History */}
        <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-base font-black text-slate-800">
              <CalendarDays className="h-5 w-5 text-violet-500" />
              Attendance Log
            </h2>
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-xs font-black text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition cursor-pointer"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.title}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-black text-slate-500">No log entries found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                    <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Date</th>
                    <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Course</th>
                    <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Marked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...filteredHistory].reverse().map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-xs font-black text-slate-700">{formatDate(r.date)}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-650">{r.courseCode}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${r.status === "present" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                          {r.status === "present" ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-400">
                        {new Date(r.markedAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
