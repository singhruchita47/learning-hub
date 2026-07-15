import { useState, useEffect } from "react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import {
  Radio, Plus, Video, Users, Clock, CalendarDays,
  Loader, Link2, ChevronDown, PlayCircle, StopCircle, CheckCircle2, Trash2
} from "lucide-react";

interface LiveClass {
  id: string;
  subject: string;
  courseCode: string;
  topic: string;
  meetLink: string;
  scheduledAt: string;
  duration: number;
  status: "scheduled" | "live" | "ended";
}

const COURSES = [
  { code: "CS301", name: "Data Structures" },
  { code: "CS302", name: "Database Management" },
  { code: "CS303", name: "Operating Systems" },
  { code: "CS401", name: "Machine Learning" },
];

function formatDateTime(dt: string) {
  return new Date(dt).toLocaleString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_STYLES = {
  scheduled: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400", label: "Scheduled" },
  live:      { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", label: "🔴 Live Now" },
  ended:     { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-300", label: "Ended" },
};

const BLANK = { subject: COURSES[0].name, courseCode: COURSES[0].code, topic: "", meetLink: "", scheduledAt: "", duration: 60 };

const API_BASE = ACADEMIC_API_BASE;

export default function AdminLiveClasses() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "live" | "scheduled" | "ended">("all");

  const user = (() => {
    try {
      const saved = localStorage.getItem("learningHubUser");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  })();

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_BASE}/live-classes`);
      if (res.ok) {
        const data = await res.json();
        const apiClasses = data.liveClasses.map((c: any) => ({
          id: c._id,
          subject: c.title,
          courseCode: c.courseCode,
          topic: c.title,
          meetLink: c.meetingUrl,
          scheduledAt: c.startsAt,
          duration: 60,
          status: c.status || "scheduled"
        }));
        setClasses(apiClasses);
      }
    } catch {}
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  async function scheduleClass() {
    if (!form.topic.trim() || !form.scheduledAt) { return; }
    setSaving(true);
    
    try {
      const res = await fetch(`${API_BASE}/live-classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.topic,
          courseCode: form.courseCode,
          facultyId: user?.name || "Admin",
          startsAt: form.scheduledAt,
          meetingUrl: form.meetLink
        })
      });
      if (res.ok) {
        fetchClasses();
      }
    } catch {}

    setForm({ ...BLANK });
    setShowForm(false);
    setSaving(false);
  }

  async function toggleStatus(id: string) {
    const cls = classes.find(c => c.id === id);
    if (!cls) return;
    let newStatus = "scheduled";
    if (cls.status === "scheduled") newStatus = "live";
    if (cls.status === "live") newStatus = "ended";
    
    setClasses(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));

    try {
      await fetch(`${API_BASE}/live-classes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {}
  }

  async function deleteClass(id: string) {
    // We don't have a DELETE endpoint in the backend for live-classes yet, so we just remove locally for now, 
    // or we could add a DELETE endpoint. For now, local hide.
    setClasses(prev => prev.filter(c => c.id !== id));
  }

  const filtered = classes.filter(c => filter === "all" || c.status === filter);
  const liveCount = classes.filter(c => c.status === "live").length;
  const scheduledCount = classes.filter(c => c.status === "scheduled").length;

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Hero Banner ── */}
        <section className="rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-6 shadow-xl shadow-violet-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">Admin live sessions</p>
              <h1 className="mt-1 text-2xl font-black text-slate-900">Live Classes</h1>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Schedule, manage and broadcast live class sessions for your students.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {[
                { val: liveCount, label: "Live Now", color: liveCount > 0 ? "text-emerald-600" : "text-slate-400" },
                { val: scheduledCount, label: "Scheduled", color: "text-amber-600" },
                { val: classes.filter(c => c.status === "ended").length, label: "Completed", color: "text-slate-500" },
              ].map(({ val, label, color }) => (
                <div key={label} className="rounded-2xl bg-white/85 px-4 py-2 text-center shadow-sm border border-slate-100">
                  <p className={`text-xl font-black ${color}`}>{val}</p>
                  <p className="text-[10px] font-bold text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter tabs */}
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1 gap-1 shadow-sm">
            {(["all", "live", "scheduled", "ended"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-black capitalize transition cursor-pointer ${
                  filter === tab ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-violet-600"
                }`}
              >
                {tab === "live" ? "🔴 Live" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(v => !v)}
            className="ml-auto flex h-11 items-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancel" : "Schedule Class"}
          </button>
        </div>

        {/* ── Schedule Form ── */}
        {showForm && (
          <section className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f3ff] text-violet-600">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800">Schedule New Class</h2>
                <p className="text-xs font-semibold text-slate-400">Fill in the session details below</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Course */}
              <label className="grid gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Course</span>
                <select
                  value={form.courseCode}
                  onChange={e => {
                    const c = COURSES.find(c => c.code === e.target.value)!;
                    setForm(prev => ({ ...prev, courseCode: c.code, subject: c.name }));
                  }}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white cursor-pointer"
                >
                  {COURSES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                </select>
              </label>

              {/* Topic */}
              <label className="grid gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Topic / Title</span>
                <input
                  value={form.topic}
                  onChange={e => setForm(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g. Binary Trees & Traversals"
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                />
              </label>

              {/* Meet Link */}
              <label className="grid gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Meet Link</span>
                <input
                  value={form.meetLink}
                  onChange={e => setForm(prev => ({ ...prev, meetLink: e.target.value }))}
                  placeholder="https://meet.google.com/…"
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                />
              </label>

              {/* Duration */}
              <label className="grid gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Duration (mins)</span>
                <input
                  type="number"
                  value={form.duration}
                  onChange={e => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  min={15} max={240} step={15}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition"
                />
              </label>

              {/* Schedule Date */}
              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Date & Time</span>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={e => setForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                />
              </label>
            </div>

            <button
              onClick={scheduleClass}
              disabled={saving}
              className="flex h-11 items-center gap-2 rounded-2xl bg-violet-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-200 hover:bg-violet-700 transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
              {saving ? "Scheduling…" : "Schedule Class"}
            </button>
          </section>
        )}

        {/* ── Classes List ── */}
        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
            <Radio className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-black text-slate-400">No classes for this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(cls => {
              const s = STATUS_STYLES[cls.status];
              return (
                <div
                  key={cls.id}
                  className={`overflow-hidden rounded-[2rem] border bg-white shadow-sm transition-all hover:shadow-md ${
                    cls.status === "live" ? "border-emerald-200 shadow-emerald-100/50" : "border-slate-150"
                  }`}
                >
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left Info */}
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.bg} border ${s.border}`}>
                        <Video className={`h-5 w-5 ${s.text}`} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black ${s.bg} ${s.text} ${s.border}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${cls.status === "live" ? "animate-pulse" : ""}`} />
                            {s.label}
                          </span>
                          <span className="rounded-lg bg-violet-50 border border-violet-100 px-2.5 py-0.5 text-[10px] font-black text-violet-700">{cls.courseCode}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900">{cls.topic}</h3>
                        <p className="mt-0.5 text-xs font-bold text-slate-400">{cls.subject}</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDateTime(cls.scheduledAt)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {cls.duration} mins</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {cls.meetLink && (
                        <a
                          href={cls.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 text-xs font-black text-blue-700 hover:bg-blue-100 transition"
                        >
                          <Link2 className="h-3.5 w-3.5" /> Join Link
                        </a>
                      )}

                      {cls.status === "scheduled" && (
                        <button
                          onClick={() => toggleStatus(cls.id)}
                          className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                        >
                          <PlayCircle className="h-3.5 w-3.5" /> Go Live
                        </button>
                      )}
                      {cls.status === "live" && (
                        <button
                          onClick={() => toggleStatus(cls.id)}
                          className="flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                        >
                          <StopCircle className="h-3.5 w-3.5" /> End Class
                        </button>
                      )}
                      {cls.status === "ended" && (
                        <span className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                        </span>
                      )}

                      <button
                        onClick={() => deleteClass(cls.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
