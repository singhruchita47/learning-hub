import { useState, useEffect } from "react";
import { Users, CalendarDays, CheckCircle2, BarChart3, ChevronDown, RefreshCw } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API = ACADEMIC_API_BASE.replace("/academic", "");

interface AttendanceSummary {
  courseCode: string;
  presentCount: number;
  students: string[];
}

interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  date: string;
  status: "present" | "absent";
  markedAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

const COLORS = [
  "from-[#7b35ad] to-[#34428c]",
  "from-[#34428c] to-[#3b82f6]",
  "from-[#f59e0b] to-[#ef4444]",
  "from-[#10b981] to-[#0ea5e9]",
  "from-[#ec4899] to-[#8b5cf6]",
];

export default function FacultyAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  async function fetchData(date: string) {
    setLoading(true);
    try {
      const [sumRes, recRes] = await Promise.all([
        fetch(`${API}/attendance/faculty-summary?date=${date}`),
        fetch(`${API}/attendance?date=${date}`),
      ]);
      const sumData = await sumRes.json() as { summary?: AttendanceSummary[] };
      const recData = await recRes.json() as { attendance?: AttendanceRecord[] };
      setSummary(sumData.summary || []);
      setAllRecords(recData.attendance || []);
    } catch {
      setSummary([]);
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchData(selectedDate);
  }, [selectedDate]);

  const totalPresent = summary.reduce((acc, s) => acc + s.presentCount, 0);
  const courses = [...new Set(allRecords.map((r) => r.courseCode))];
  const activeCourseRecords = activeCourse
    ? allRecords.filter((r) => r.courseCode === activeCourse)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eef2fb] via-[#f0edff] to-[#fdf4ff] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1200px]">

        {/* Header */}
        <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#263676] via-[#34428c] to-[#4a35ad] p-8 text-white shadow-2xl shadow-[#34428c]/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffb347]/80">Faculty Panel</p>
              <h1 className="mt-2 text-4xl font-black">Attendance Dashboard</h1>
              <p className="mt-2 text-sm font-semibold text-white/70">
                Real-time attendance monitoring across all courses.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {[
                { val: summary.length, label: "Courses Active", color: "text-blue-300" },
                { val: totalPresent, label: "Total Present", color: "text-emerald-300" },
                { val: allRecords.filter(r => r.status === "absent").length, label: "Absent", color: "text-rose-300" },
              ].map(({ val, label, color }) => (
                <div key={label} className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                  <p className={`text-2xl font-black ${color}`}>{val}</p>
                  <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date selector */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2">
              <CalendarDays className="h-4 w-4 text-white/70" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-sm font-black text-white outline-none [color-scheme:dark]"
              />
            </div>
            <button
              onClick={() => fetchData(selectedDate)}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-black text-white transition hover:bg-white/25 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <p className="text-xs font-bold text-white/50">📅 {formatDate(selectedDate)}</p>
          </div>
        </section>

        {/* Course cards */}
        {summary.length === 0 && !loading ? (
          <div className="mb-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-14 text-center">
            <Users className="mx-auto h-14 w-14 text-slate-300" />
            <p className="mt-4 text-lg font-black text-slate-500">No attendance data</p>
            <p className="mt-2 text-sm font-bold text-slate-400">Students haven't marked attendance for this date yet.</p>
          </div>
        ) : (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summary.map((s, i) => {
              const pct = s.presentCount > 0 ? Math.min(100, Math.round((s.presentCount / Math.max(s.presentCount, 1)) * 100)) : 0;
              return (
                <button
                  key={s.courseCode}
                  onClick={() => setActiveCourse(activeCourse === s.courseCode ? null : s.courseCode)}
                  className={`group relative overflow-hidden rounded-[1.5rem] p-6 text-left text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl ${activeCourse === s.courseCode ? "ring-4 ring-white/30" : ""} bg-gradient-to-br ${COLORS[i % COLORS.length]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white/70">{s.courseCode}</p>
                      <p className="mt-1 text-3xl font-black">{s.presentCount}</p>
                      <p className="text-xs font-bold text-white/70">students present</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    {s.students.slice(0, 3).map((name) => (
                      <div key={name} className="flex items-center gap-2 text-xs font-bold text-white/80">
                        <div className="h-2 w-2 rounded-full bg-white/60" />
                        {name}
                      </div>
                    ))}
                    {s.students.length > 3 && (
                      <p className="text-xs font-black text-white/50">+{s.students.length - 3} more...</p>
                    )}
                  </div>

                  <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-white/40">
                    {activeCourse === s.courseCode ? "▲ Click to collapse" : "▼ Click to see details"}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Expanded course detail */}
        {activeCourse && (
          <section className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                <BarChart3 className="h-5 w-5 text-[#7b35ad]" />
                {activeCourse} — Detailed Attendance
              </h2>
              <span className="rounded-full bg-[#7b35ad]/10 px-3 py-1 text-xs font-black text-[#7b35ad]">
                {activeCourseRecords.length} records
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Student ID</th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Marked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCourseRecords.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-black text-slate-800">{r.studentName}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-500">{r.studentId}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black ${r.status === "present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {r.status === "present" ? <CheckCircle2 className="h-3 w-3" /> : "✗"}
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-400">
                        {new Date(r.markedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                  {activeCourseRecords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs font-bold text-slate-400">
                        No records for this course on {selectedDate}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* All records table */}
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-900">
            <Users className="h-5 w-5 text-[#7b35ad]" />
            All Records — {formatDate(selectedDate)}
          </h2>
          {allRecords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <p className="text-sm font-black text-slate-400">No attendance records for this date.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allRecords.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-black text-slate-800">{r.studentName}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-[#7b35ad]/10 px-2 py-0.5 text-xs font-black text-[#7b35ad]">{r.courseCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black ${r.status === "present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {r.status === "present" ? "✅ Present" : "❌ Absent"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-400">
                        {new Date(r.markedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
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
