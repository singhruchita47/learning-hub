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
    <main className="min-h-screen bg-gradient-to-br from-[#eef2fb] via-[#f0edff] to-[#fdf4ff] px-4 py-6 md:px-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-black text-white shadow-2xl transition-all ${toast.ok ? "bg-emerald-500" : "bg-rose-500"}`}>
          {toast.ok ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#34428c] via-[#4a35ad] to-[#7b35ad] p-8 text-white shadow-2xl shadow-[#7b35ad]/30">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffb347]/80">Student Module</p>
              <h1 className="mt-2 text-4xl font-black">My Attendance</h1>
              <p className="mt-2 text-sm font-semibold text-white/70">
                Mark today's attendance for each subject and track your history.
              </p>
              <p className="mt-3 text-xs font-bold text-white/50">
                📅 Today: {formatDate(TODAY)}
              </p>
            </div>
            {/* Overall stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: overallPresent, label: "Present", color: "text-emerald-300" },
                { val: overallTotal, label: "Total", color: "text-blue-300" },
                { val: `${overallPct}%`, label: "Overall", color: overallPct >= 75 ? "text-emerald-300" : "text-rose-300" },
              ].map(({ val, label, color }) => (
                <div key={label} className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                  <p className={`text-2xl font-black ${color}`}>{val}</p>
                  <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs font-black text-white/70">
              <span>Attendance Progress</span>
              <span>{overallPct}% {overallPct >= 75 ? "✅ Safe" : "⚠️ Low"}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className={`h-full rounded-full transition-all duration-700 ${overallPct >= 75 ? "bg-emerald-400" : "bg-rose-400"}`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] font-bold text-white/40">75% minimum required by university</p>
          </div>
        </section>

        {/* Mark Today's Attendance */}
        <section className="mb-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
            <Clock className="h-5 w-5 text-[#7b35ad]" />
            Mark Today's Attendance
          </h2>
          {courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400 font-bold">
              No courses found. Please ask your faculty to add courses.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const todayRec = getTodayRecord(course.code);
                const stats = getStats(course.code);
                const isMarkingPresent = marking === course.code + "present";
                const isMarkingAbsent = marking === course.code + "absent";

                return (
                  <div
                    key={course._id}
                    className={`group relative overflow-hidden rounded-[1.5rem] border-2 bg-white p-5 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 ${
                      todayRec?.status === "present"
                        ? "border-emerald-200 bg-emerald-50/50"
                        : todayRec?.status === "absent"
                        ? "border-rose-200 bg-rose-50/50"
                        : "border-slate-100"
                    }`}
                  >
                    {/* Status glow */}
                    {todayRec && (
                      <div className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full ${todayRec.status === "present" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                        {todayRec.status === "present" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                    )}

                    <div className="flex items-start gap-3 pr-10">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7b35ad]/10 text-[#7b35ad]">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-[#7b35ad]">{course.code}</p>
                        <h3 className="mt-0.5 text-sm font-black text-slate-900 leading-tight">{course.title}</h3>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2">
                        <div
                          className={`h-full rounded-full ${stats.pct >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                          style={{ width: `${stats.pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-black ${stats.pct >= 75 ? "text-emerald-600" : "text-rose-600"}`}>
                        {stats.pct}%
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-bold text-slate-400">{stats.present}/{stats.total} classes attended</p>

                    {/* Today's status */}
                    {todayRec ? (
                      <div className={`mt-4 rounded-xl px-3 py-2 text-center text-xs font-black ${todayRec.status === "present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {todayRec.status === "present" ? "✅ Present Today" : "❌ Absent Today"} — {new Date(todayRec.markedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    ) : (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => markAttendance(course.code, "present")}
                          disabled={!!marking}
                          className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-black text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                          {isMarkingPresent ? "⏳..." : "✅ Present"}
                        </button>
                        <button
                          onClick={() => markAttendance(course.code, "absent")}
                          disabled={!!marking}
                          className="flex-1 rounded-xl bg-rose-100 py-2.5 text-xs font-black text-rose-600 transition hover:bg-rose-200 disabled:opacity-60"
                        >
                          {isMarkingAbsent ? "⏳..." : "❌ Absent"}
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
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <CalendarDays className="h-5 w-5 text-[#7b35ad]" />
              Attendance History
            </h2>
            {/* Filter */}
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-black text-slate-700 outline-none focus:border-[#7b35ad]/40 focus:ring-2 focus:ring-[#7b35ad]/10"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.title}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-black text-slate-500">No history yet</p>
              <p className="mt-1 text-xs font-bold text-slate-400">Start marking attendance to see your records here.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Date</th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Course</th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Marked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...filteredHistory].reverse().map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-black text-slate-700">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-600">{r.courseCode}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black ${r.status === "present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {r.status === "present" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {r.status === "present" ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-400">
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
