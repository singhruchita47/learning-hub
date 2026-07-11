import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Radio,
  Search,
  Send,
  Star,
  Users,
  Video,
} from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const courses = [
  { code: "CS301", title: "Data Structures", students: 48, progress: 72, color: "#7130a1" },
  { code: "CS302", title: "Database Systems", students: 41, progress: 58, color: "#0ea5e9" },
  { code: "CS303", title: "Operating Systems", students: 35, progress: 45, color: "#10b981" },
];

const submissions = [
  ["Ruchita Singh", "Binary Tree Implementation", "Submitted", "CS301"],
  ["Priya Sharma", "SQL Normalization Lab", "Pending review", "CS302"],
  ["Rahul Verma", "Process Scheduling Quiz", "Submitted", "CS303"],
];

const API_BASE = ACADEMIC_API_BASE;

type ApiSubmission = {
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

type ApiQuizAttempt = {
  _id: string;
  quizTitle: string;
  studentId: string;
  score: number;
  total: number;
  createdAt: string;
};

type ApiNotification = {
  _id: string;
  title: string;
  message: string;
  type: "assignment" | "quiz" | "class" | "general";
  createdAt: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${color}18`, color }}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}

export default function FacultyDashboard({
  user,
  initialTab = "overview",
}: {
  user: { name: string };
  onLogout?: () => void;
  initialTab?: "overview" | "courses" | "classes" | "notices";
}) {
  const activeTab = initialTab;
  const [notice, setNotice] = useState("");
  const [apiSubmissions, setApiSubmissions] = useState<ApiSubmission[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<ApiQuizAttempt[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [facultyDataStatus, setFacultyDataStatus] = useState<"loading" | "ready" | "offline">("loading");

  useEffect(() => {
    let mounted = true;

    async function loadFacultyData() {
      setFacultyDataStatus("loading");
      const [submissionResult, quizResult, notificationResult] = await Promise.allSettled([
        fetchJson<{ submissions: ApiSubmission[] }>(`${API_BASE}/assignment-submissions`),
        fetchJson<{ attempts: ApiQuizAttempt[] }>(`${API_BASE}/quiz-attempts`),
        fetchJson<{ notifications: ApiNotification[] }>(`${API_BASE}/notifications?audience=faculty`),
      ]);

      if (!mounted) return;

      if (submissionResult.status === "fulfilled") setApiSubmissions(submissionResult.value.submissions);
      if (quizResult.status === "fulfilled") setQuizAttempts(quizResult.value.attempts);
      if (notificationResult.status === "fulfilled") setNotifications(notificationResult.value.notifications);

      setFacultyDataStatus(
        submissionResult.status === "fulfilled" || quizResult.status === "fulfilled" || notificationResult.status === "fulfilled"
          ? "ready"
          : "offline",
      );
    }

    void loadFacultyData();
    return () => {
      mounted = false;
    };
  }, []);

  const reviewItems = useMemo(() => apiSubmissions.slice(0, 6), [apiSubmissions]);
  const markItems = useMemo(() => quizAttempts.slice(0, 6), [quizAttempts]);

  async function sendNotice() {
    if (!notice.trim()) return;
    const payload = {
      title: "Faculty notice",
      message: notice.trim(),
      audience: "student",
      type: "general",
    };

    try {
      await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Local demo still clears the text if API is unavailable.
    } finally {
      setNotice("");
    }
  }

  return (
    <div className="min-h-screen bg-[#eef2fb]">
      <main className="mx-auto max-w-[1540px] px-4 py-6 md:px-8">
        <section className="mb-6 overflow-hidden rounded-[2rem] bg-[#263676] p-7 text-white shadow-xl shadow-[#263676]/20">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f97316]">Faculty Profile</p>
              <h1 className="mt-2 text-5xl font-black tracking-tight">Welcome, {user.name.split(" ")[0]}</h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/70">
                Manage students, publish tests, review assignment submissions, schedule live classes, and track academic activity.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["B.Tech CSE", "Semester 4", "SGSU Faculty"].map((item) => (
                  <span key={item} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-black">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-black text-white/80">Today's Live Class</p>
              <h2 className="mt-3 text-2xl font-black">Data Structures Lab</h2>
              <p className="mt-2 text-sm font-semibold text-white/65">09:30 AM - 10:30 AM</p>
              <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#f97316] text-sm font-black text-white">
                <Radio className="h-4 w-4" />
                Start Live Now
              </button>
            </div>
          </div>
        </section>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Active students" value="156" icon={Users} color="#7130a1" />
              <StatCard label="Courses" value="4" icon={BookOpen} color="#0ea5e9" />
              <StatCard label="Pending review" value={String(reviewItems.length || 12)} icon={ClipboardList} color="#f97316" />
              <StatCard
                label="Avg score"
                value={
                  markItems.length
                    ? `${Math.round((markItems.reduce((sum, item) => sum + item.score / Math.max(item.total, 1), 0) / markItems.length) * 100)}%`
                    : "78%"
                }
                icon={Star}
                color="#6366f1"
              />
            </div>

            {facultyDataStatus === "offline" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                Backend is not running right now, so faculty data is showing demo fallback. Start API server to load MongoDB data.
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950">Recent Submissions</h2>
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <div className="space-y-3">
                  {(reviewItems.length
                    ? reviewItems.map((item) => [
                        item.studentId,
                        item.assignment?.title ?? "Assignment submission",
                        item.feedback ? "Reviewed" : "Pending review",
                        item.assignment?.courseCode ?? "LMS",
                      ])
                    : submissions
                  ).map(([student, title, status, code]) => (
                    <div key={`${student}-${title}`} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7130a1] text-xs font-black text-white">
                        {student.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-900">{title}</p>
                        <p className="text-xs font-bold text-slate-500">{student} - {code}</p>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">{status}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
                <h2 className="mb-4 text-xl font-black text-slate-950">Academic Timeline</h2>
                {[
                  ["Today", "Publish quiz result", ClipboardList],
                  ["Tomorrow", "DBMS live lecture", Video],
                  ["Friday", "Assignment feedback", FileText],
                ].map(([day, title, Icon]) => (
                  <div key={title as string} className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 last:mb-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{title as string}</p>
                      <p className="text-xs font-bold text-slate-500">{day as string}</p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </motion.div>
        )}

        {activeTab === "courses" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <section key={course.code} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white" style={{ background: course.color }}>
                    {course.code.slice(-2)}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">{course.students} students</span>
                </div>
                <h2 className="text-2xl font-black text-slate-950">{course.title}</h2>
                <p className="mt-1 text-sm font-black" style={{ color: course.color }}>{course.code}</p>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs font-black text-slate-500">
                    <span>Syllabus progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button className="h-11 rounded-2xl border border-slate-200 text-xs font-black text-slate-600">Upload Video</button>
                  <button className="h-11 rounded-2xl border border-slate-200 text-xs font-black text-slate-600">Add Notes</button>
                </div>
              </section>
            ))}
          </motion.div>
        )}

        {activeTab === "classes" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 text-xl font-black text-slate-950">Schedule Live Class</h2>
              <div className="grid gap-3">
                <input className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none" placeholder="Class topic" />
                <div className="grid gap-3 md:grid-cols-2">
                  <input type="date" className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none" />
                  <input type="time" className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none" />
                </div>
                <button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#263676] text-sm font-black text-white">
                  <CalendarClock className="h-4 w-4" />
                  Schedule Class
                </button>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 text-xl font-black text-slate-950">Upcoming</h2>
              {["Binary Trees Lab", "SQL Transactions", "OS Scheduling"].map((title) => (
                <div key={title} className="mb-3 rounded-2xl bg-slate-50 p-4 last:mb-0">
                  <p className="text-sm font-black text-slate-900">{title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Live session - 45 min</p>
                </div>
              ))}
            </section>
          </motion.div>
        )}

        {activeTab === "notices" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 text-xl font-black text-slate-950">Send Notice</h2>
              <textarea
                value={notice}
                onChange={(event) => setNotice(event.target.value)}
                rows={5}
                placeholder="Write announcement for students..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold outline-none"
              />
              <button
                onClick={sendNotice}
                className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7130a1] px-6 text-sm font-black text-white"
              >
                <Send className="h-4 w-4" />
                Send to Students
              </button>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-950">
                <Bell className="h-5 w-5 text-violet-600" />
                Faculty Notifications
              </h2>
              <div className="space-y-3">
                {notifications.length > 0 ? notifications.map((item) => (
                  <article key={item._id} className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-black text-slate-950">{item.title}</h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-violet-700">{item.type}</span>
                    </div>
                    <p className="text-xs font-bold leading-5 text-slate-600">{item.message}</p>
                    <p className="mt-2 text-[11px] font-black text-slate-400">{new Date(item.createdAt).toLocaleString("en-IN")}</p>
                  </article>
                )) : (
                  <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-6 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-violet-500" />
                    <p className="text-sm font-black text-violet-800">No new notifications</p>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
