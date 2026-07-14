import { useState, useEffect } from "react";
import {
  Users, CalendarDays, CheckCircle2, XCircle, BarChart3,
  Save, BookOpen, ChevronDown, ClipboardList
} from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const COURSES = [
  { code: "CS301", name: "Data Structures" },
  { code: "CS302", name: "Database Management" },
  { code: "CS303", name: "Operating Systems" },
  { code: "CS401", name: "Machine Learning" },
];

const MOCK_STUDENTS = [
  { id: "22BCS1001", name: "Rahul Sharma" },
  { id: "22BCS1002", name: "Priya Gupta" },
  { id: "22BCS1003", name: "Amit Patel" },
  { id: "22BCS1004", name: "Simran Kaur" },
  { id: "22BCS1005", name: "Rohit Verma" },
  { id: "22BCS1006", name: "Neha Singh" },
  { id: "22BCS1007", name: "Arjun Das" },
  { id: "22BCS1008", name: "Meera Nair" },
  { id: "22BCS1009", name: "Kunal Joshi" },
  { id: "22BCS1010", name: "Ankita Rao" },
  { id: "22BCS1011", name: "Dev Mehta" },
  { id: "22BCS1012", name: "Ritika Sen" },
];

type AttendanceMap = Record<string, "present" | "absent">;
type SavedSession = { course: string; date: string; attendance: AttendanceMap };

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function FacultyAttendance() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0].code);
  const [attendance, setAttendance] = useState<AttendanceMap>(() => {
    const init: AttendanceMap = {};
    MOCK_STUDENTS.forEach(s => { init[s.id] = "present"; });
    return init;
  });
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [viewMode, setViewMode] = useState<"mark" | "history">("mark");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const presentCount = Object.values(attendance).filter(v => v === "present").length;
  const absentCount = Object.values(attendance).filter(v => v === "absent").length;
  const pct = Math.round((presentCount / MOCK_STUDENTS.length) * 100);

  const user = (() => {
    try {
      const saved = localStorage.getItem("learningHubUser");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  })();

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/attendance`);
      if (res.ok) {
        const data = await res.json();
        setSavedSessions(data.attendance || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  function markAll(status: "present" | "absent") {
    const next: AttendanceMap = {};
    MOCK_STUDENTS.forEach(s => { next[s.id] = status; });
    setAttendance(next);
  }

  function toggle(id: string) {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === "present" ? "absent" : "present" }));
  }

  async function saveAttendance() {
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: selectedCourse,
          date: selectedDate,
          attendance,
          facultyId: user?.name || "Faculty"
        })
      });
      if (res.ok) {
        fetchAttendance();
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      }
    } catch {}
  }

  const courseInfo = COURSES.find(c => c.code === selectedCourse)!;

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Hero Banner — same style as other faculty pages ── */}
        <section className="rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-6 shadow-xl shadow-violet-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">Faculty attendance module</p>
              <h1 className="mt-1 text-2xl font-black text-slate-900">Attendance Management</h1>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Mark, save and review class attendance for any course and date.
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {[
                { val: COURSES.length, label: "Courses", color: "text-violet-700" },
                { val: MOCK_STUDENTS.length, label: "Students", color: "text-indigo-700" },
                { val: savedSessions.length, label: "Saved", color: "text-emerald-600" },
              ].map(({ val, label, color }) => (
                <div key={label} className="rounded-2xl bg-white/85 px-4 py-2 text-center shadow-sm border border-slate-100">
                  <p className={`text-xl font-black ${color}`}>{val}</p>
                  <p className="text-[10px] font-bold text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Controls Row ── */}
        <section className="rounded-[2rem] border border-slate-150 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">

            {/* Date Picker */}
            <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Date
              <div className="flex items-center gap-2 h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700">
                <CalendarDays className="h-4 w-4 text-violet-500 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-transparent outline-none font-bold text-slate-700 cursor-pointer"
                />
              </div>
            </label>

            {/* Course Selector */}
            <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Course
              <div className="flex items-center gap-2 h-10 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <BookOpen className="h-4 w-4 text-violet-500 shrink-0" />
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-4"
                >
                  {COURSES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none h-3 w-3 text-slate-400" />
              </div>
            </label>

            {/* View Toggle */}
            <div className="ml-auto flex items-end">
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
                {(["mark", "history"] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-black transition cursor-pointer ${
                      viewMode === mode
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-violet-600"
                    }`}
                  >
                    {mode === "mark" ? "📝 Mark Attendance" : "📋 History"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs font-bold text-slate-400">
            📅 {formatDate(selectedDate)} &nbsp;·&nbsp; {courseInfo.code} — {courseInfo.name}
          </p>
        </section>

        {/* ── MARK ATTENDANCE MODE ── */}
        {viewMode === "mark" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* ── Left: Student List ── */}
            <section className="rounded-[2rem] border border-slate-150 bg-white shadow-sm overflow-hidden flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f3ff] text-violet-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-800">Student List</h2>
                    <p className="text-[10px] font-bold text-slate-400">{MOCK_STUDENTS.length} students enrolled</p>
                  </div>
                </div>
                {/* Mark All buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => markAll("present")}
                    className="flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> All Present
                  </button>
                  <button
                    onClick={() => markAll("absent")}
                    className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" /> All Absent
                  </button>
                </div>
              </div>

              {/* Student Rows */}
              <div className="divide-y divide-slate-100 flex-1">
                {MOCK_STUDENTS.map((student, idx) => {
                  const isPresent = attendance[student.id] === "present";
                  return (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between px-6 py-3 transition-colors ${
                        isPresent ? "hover:bg-slate-50/60" : "bg-rose-50/20 hover:bg-rose-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white shadow-sm ${
                          isPresent ? "bg-violet-500" : "bg-slate-300"
                        }`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{student.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">{student.id} &nbsp;·&nbsp; #{idx + 1}</p>
                        </div>
                      </div>

                      {/* Toggle Button */}
                      <button
                        onClick={() => toggle(student.id)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-black transition-all border cursor-pointer ${
                          isPresent
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                        }`}
                      >
                        {isPresent ? (
                          <><CheckCircle2 className="h-3.5 w-3.5" /> Present</>
                        ) : (
                          <><XCircle className="h-3.5 w-3.5" /> Absent</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Right: Summary + Save ── */}
            <div className="space-y-4">

              {/* Live Summary Card */}
              <section className="rounded-[2rem] border border-slate-150 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-800">Live Summary</h3>
                </div>

                {/* Present / Absent Count */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                    <p className="text-3xl font-black text-emerald-600">{presentCount}</p>
                    <p className="text-[9px] font-black uppercase text-emerald-500 tracking-wider mt-0.5">Present</p>
                  </div>
                  <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-center">
                    <p className="text-3xl font-black text-rose-600">{absentCount}</p>
                    <p className="text-[9px] font-black uppercase text-rose-500 tracking-wider mt-0.5">Absent</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="mb-1.5 flex justify-between text-[10px] font-black">
                    <span className="text-slate-400">Attendance Rate</span>
                    <span className={pct >= 75 ? "text-emerald-600" : "text-rose-600"}>{pct}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400 text-right">
                    {pct >= 75 ? "✅ Good attendance" : "⚠️ Below 75%"}
                  </p>
                </div>

                {/* Absent Students */}
                {absentCount > 0 && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-rose-500 mb-2">Absent Students</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto [scrollbar-width:thin]">
                      {MOCK_STUDENTS.filter(s => attendance[s.id] === "absent").map(s => (
                        <div key={s.id} className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-1.5">
                          <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                          <span className="text-xs font-bold text-rose-700 truncate">{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Save Button */}
              <button
                onClick={saveAttendance}
                className={`w-full flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-lg transition-all cursor-pointer ${
                  saveStatus === "saved"
                    ? "bg-emerald-500 shadow-emerald-200"
                    : "bg-violet-600 shadow-violet-200/60 hover:bg-violet-700"
                }`}
              >
                {saveStatus === "saved" ? (
                  <><CheckCircle2 className="h-5 w-5" /> Attendance Saved!</>
                ) : (
                  <><Save className="h-5 w-5" /> Save Attendance</>
                )}
              </button>

              {saveStatus === "saved" && (
                <p className="text-center text-[10px] font-bold text-emerald-600">
                  ✅ Session recorded for {selectedCourse} · {selectedDate}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── HISTORY MODE ── */}
        {viewMode === "history" && (
          <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f3ff] text-violet-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800">Saved Sessions</h2>
                <p className="text-xs font-semibold text-slate-400">{savedSessions.length} session{savedSessions.length !== 1 ? "s" : ""} recorded</p>
              </div>
            </div>

            {savedSessions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-14 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-black text-slate-400">No sessions saved yet</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">Switch to Mark Attendance and save a session to see it here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedSessions.map((session) => {
                  const key = `${session.course}_${session.date}`;
                  const expanded = expandedSession === key;
                  const present = Object.values(session.attendance).filter(v => v === "present").length;
                  const absent = Object.values(session.attendance).filter(v => v === "absent").length;
                  const total = present + absent;
                  const sessionPct = Math.round((present / total) * 100);
                  const course = COURSES.find(c => c.code === session.course);

                  return (
                    <div key={key} className="overflow-hidden rounded-[1.5rem] border border-slate-150 bg-white shadow-sm">
                      {/* Session Header */}
                      <button
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition text-left cursor-pointer"
                        onClick={() => setExpandedSession(expanded ? null : key)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5f3ff] text-violet-600 shrink-0 text-xs font-black">
                            📋
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{session.course} — {course?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{formatDate(session.date)}</p>
                          </div>
                          <div className="hidden sm:flex gap-3 ml-2">
                            <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-700">{present} Present</span>
                            <span className="rounded-full bg-rose-50 border border-rose-100 px-2.5 py-0.5 text-[10px] font-black text-rose-600">{absent} Absent</span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${sessionPct >= 75 ? "bg-violet-50 border-violet-100 text-violet-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>{sessionPct}%</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400 shrink-0">{expanded ? "▲ Hide" : "▼ View"}</span>
                      </button>

                      {/* Expanded Detail Table */}
                      {expanded && (
                        <div className="border-t border-slate-100 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                  <th className="px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Student</th>
                                  <th className="px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Roll No.</th>
                                  <th className="px-5 py-2.5 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {MOCK_STUDENTS.map(student => {
                                  const isPresent = session.attendance[student.id] === "present";
                                  return (
                                    <tr key={student.id} className={`${isPresent ? "hover:bg-slate-50/50" : "bg-rose-50/20 hover:bg-rose-50/40"} transition`}>
                                      <td className="px-5 py-2.5 font-black text-slate-800">{student.name}</td>
                                      <td className="px-5 py-2.5 font-semibold text-slate-400">{student.id}</td>
                                      <td className="px-5 py-2.5 text-right">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black border ${
                                          isPresent
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                            : "bg-rose-50 text-rose-600 border-rose-100"
                                        }`}>
                                          {isPresent ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                          {isPresent ? "Present" : "Absent"}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}
