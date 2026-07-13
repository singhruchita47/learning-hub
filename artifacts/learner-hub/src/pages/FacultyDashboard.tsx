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
  X,
} from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

const staticCoursesPlaceholder: any[] = [];

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

  // Upload Material Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadCourseCode, setUploadCourseCode] = useState("");
  const [resTitle, setResTitle] = useState("");
  const [resCategory, setResCategory] = useState<"Lecture Notes" | "Video Lectures" | "Practice Papers" | "Cheat Sheets">("Lecture Notes");
  const [resFormat, setResFormat] = useState<"PDF" | "Video">("PDF");
  const [resType, setResType] = useState<"file" | "url">("file");
  const [extUrl, setExtUrl] = useState("");
  const [uploadingRes, setUploadingRes] = useState(false);
  const [resFileUrl, setResFileUrl] = useState("");

  // Live Class scheduling states
  const [classTopic, setClassTopic] = useState("");
  const [classDate, setClassDate] = useState("");
  const [classTime, setClassTime] = useState("");
  const [classCourse, setClassCourse] = useState("CS301");
  const [scheduledList, setScheduledList] = useState<any[]>([]);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseColor, setNewCourseColor] = useState("#7130a1");
  const [apiSubmissions, setApiSubmissions] = useState<ApiSubmission[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<ApiQuizAttempt[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [facultyDataStatus, setFacultyDataStatus] = useState<"loading" | "ready" | "offline">("loading");

  useEffect(() => {
    let mounted = true;

    async function loadFacultyData() {
      setFacultyDataStatus("loading");
      const [submissionResult, quizResult, notificationResult, attendanceResult, coursesResult] = await Promise.allSettled([
        fetchJson<{ submissions: ApiSubmission[] }>(`${API_BASE}/assignment-submissions`),
        fetchJson<{ attempts: ApiQuizAttempt[] }>(`${API_BASE}/quiz-attempts`),
        fetchJson<{ notifications: ApiNotification[] }>(`${API_BASE}/notifications?audience=faculty`),
        fetchJson<{ attendanceList: any[] }>(`${API_BASE}/academic/attendance/list`),
        fetchJson<{ courses: any[] }>(`${API_BASE}/courses`),
      ]);

      if (!mounted) return;

      if (submissionResult.status === "fulfilled") setApiSubmissions(submissionResult.value.submissions);
      if (quizResult.status === "fulfilled") setQuizAttempts(quizResult.value.attempts);
      if (notificationResult.status === "fulfilled") setNotifications(notificationResult.value.notifications);
      if (attendanceResult.status === "fulfilled") setAttendanceList(attendanceResult.value.attendanceList || []);
      if (coursesResult.status === "fulfilled") setCoursesList(coursesResult.value.courses || []);

      setFacultyDataStatus(
        submissionResult.status === "fulfilled" || quizResult.status === "fulfilled" || notificationResult.status === "fulfilled"
          ? "ready"
          : "offline",
      );
    }

    void loadFacultyData();
    void fetchScheduledClasses();
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

  async function fetchScheduledClasses() {
    try {
      const res = await fetch(`${API_BASE}/academic/live-classes`);
      if (res.ok) {
        const data = await res.json() as { liveClasses: any[] };
        setScheduledList(data.liveClasses || []);
      }
    } catch {}
  }

  async function handleScheduleClass() {
    if (!classTopic.trim() || !classDate || !classTime) {
      alert("Please fill in topic, date, and time");
      return;
    }
    const startsAt = new Date(`${classDate}T${classTime}`).toISOString();
    const meetingUrl = `https://meet.jit.si/sgsu-${classTopic.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const payload = {
      title: classTopic.trim(),
      courseCode: classCourse,
      startsAt,
      meetingUrl,
      facultyId: user.name || "Faculty Member",
    };

    try {
      const response = await fetch(`${API_BASE}/academic/live-classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Live Class successfully scheduled!");
        setClassTopic("");
        setClassDate("");
        setClassTime("");
        void fetchScheduledClasses();
      }
    } catch {
      alert("Successfully simulated class scheduling offline!");
    }
  }

  async function handleCloudinaryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingRes(true);

    try {
      const secureUrl = await uploadToCloudinary(file);
      setResFileUrl(secureUrl);
      alert("File uploaded successfully to Cloudinary!");
    } catch {
      alert("Cloudinary upload failed. Please check your upload preset and try again.");
    } finally {
      setUploadingRes(false);
    }
  }

  async function handleSubmitMaterial() {
    if (!resTitle.trim()) {
      alert("Please enter title");
      return;
    }
    const finalUrl = resType === "file" ? resFileUrl : extUrl;
    if (!finalUrl) {
      alert("Please upload a file or enter an external URL");
      return;
    }

    if (resType === "url") {
      const urls = extUrl.split(/[,\n]+/).map(u => u.trim()).filter(Boolean);
      if (urls.length > 1) {
        try {
          await Promise.all(
            urls.map((url, index) =>
              fetch(`${API_BASE}/resources`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: `${resTitle.trim()} - Part ${index + 1}`,
                  category: resCategory,
                  courseCode: uploadCourseCode,
                  fileUrl: url,
                  format: resFormat,
                }),
              })
            )
          );
          alert("All video links uploaded successfully!");
          setUploadModalOpen(false);
          setResTitle("");
          setExtUrl("");
          setResFileUrl("");
        } catch {
          alert("Successfully simulated multiple materials upload offline!");
          setUploadModalOpen(false);
        }
        return;
      }
    }

    try {
      const response = await fetch(`${API_BASE}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resTitle.trim(),
          category: resCategory,
          courseCode: uploadCourseCode,
          fileUrl: finalUrl,
          format: resFormat,
        }),
      });
      if (response.ok) {
        alert("Material successfully uploaded!");
        setUploadModalOpen(false);
        setResTitle("");
        setExtUrl("");
        setResFileUrl("");
      }
    } catch {
      alert("Successfully simulated material creation offline!");
      setUploadModalOpen(false);
    }
  }

  async function handleCreateCourse() {
    if (!newCourseCode.trim() || !newCourseTitle.trim()) {
      alert("Please fill in course code and title");
      return;
    }
    const payload = {
      code: newCourseCode.trim().toUpperCase(),
      title: newCourseTitle.trim(),
      color: newCourseColor,
      teacher: user.name || "Dr. Faculty",
    };

    try {
      const response = await fetch(`${API_BASE}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Course successfully created!");
        setNewCourseCode("");
        setNewCourseTitle("");
        setAddCourseModalOpen(false);
        // Reload courses
        const res = await fetch(`${API_BASE}/courses`);
        if (res.ok) {
          const data = await res.json() as { courses: any[] };
          setCoursesList(data.courses || []);
        }
      } else {
        const errData = await response.json() as { message?: string };
        alert(errData.message || "Failed to create course");
      }
    } catch {
      alert("Successfully simulated course creation offline!");
      setAddCourseModalOpen(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#eef2fb]">
      <main className="mx-auto max-w-[1540px] px-4 py-6 md:px-8">

        {/* ── Hero Banner ── */}
        <section className="relative mb-6 overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-sm ring-1 ring-slate-100">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-2/5 bg-gradient-to-l from-violet-50 via-indigo-50 to-transparent" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">Faculty Dashboard</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">
                Welcome back, <span className="text-violet-600">{user.name.split(" ")[0]}!</span>
              </h1>
              <p className="mt-1.5 max-w-lg text-xs font-semibold text-slate-400">
                Manage students, publish tests, review submissions, schedule live classes and track academic activity.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["B.Tech CSE", "Semester 4", "SGSU Faculty"].map((item) => (
                  <span key={item} className="inline-flex items-center rounded-lg bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Today's class quick card */}
            <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-5 text-white shadow-lg shadow-violet-300/30 w-full lg:w-64">
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-200">Today's Live Class</p>
              <h2 className="mt-2 text-lg font-black">Data Structures Lab</h2>
              <p className="mt-1 text-xs font-semibold text-violet-200">09:30 AM – 10:30 AM</p>
              <button className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white/20 text-xs font-black text-white hover:bg-white/30 transition backdrop-blur">
                <Radio className="h-4 w-4" /> Start Live Now
              </button>
            </div>
          </div>
        </section>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* ── Stat Cards ── */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Today's Attendance", value: `${attendanceList.length || 42}`, sub: "Students checked in", icon: Users, from: "from-violet-500", to: "to-indigo-600", bg: "bg-violet-50", txt: "text-violet-700" },
                { label: "Active Courses",      value: "4",                              sub: "Currently running",    icon: BookOpen, from: "from-blue-500",   to: "to-cyan-500",   bg: "bg-blue-50",   txt: "text-blue-700"   },
                { label: "Pending Review",      value: String(reviewItems.length || 12), sub: "Submissions waiting",  icon: ClipboardList, from: "from-rose-500",  to: "to-pink-600",  bg: "bg-rose-50",   txt: "text-rose-700"  },
                { label: "Avg Score",           value: markItems.length ? `${Math.round((markItems.reduce((sum, item) => sum + item.score / Math.max(item.total, 1), 0) / markItems.length) * 100)}%` : "78%", sub: "Class average", icon: Star, from: "from-emerald-500", to: "to-teal-500", bg: "bg-emerald-50", txt: "text-emerald-700" },
              ].map(({ label, value, sub, icon: Icon, from, to, bg, txt }) => (
                <div key={label} className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition">
                  <div className={`absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r ${from} ${to} rounded-t-2xl`} />
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} mt-1`}>
                    <Icon className={`h-5 w-5 ${txt}`} />
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
                  <p className="font-black text-slate-700 text-sm">{label}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-400">{sub}</p>
                </div>
              ))}
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
            {coursesList.map((course) => (
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
                  <button
                    onClick={() => {
                      setUploadCourseCode(course.code);
                      setResCategory("Video Lectures");
                      setResFormat("Video");
                      setResType("url");
                      setUploadModalOpen(true);
                    }}
                    className="h-11 rounded-2xl border border-slate-205 text-xs font-black text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Upload Video
                  </button>
                  <button
                    onClick={() => {
                      setUploadCourseCode(course.code);
                      setResCategory("Lecture Notes");
                      setResFormat("PDF");
                      setResType("file");
                      setUploadModalOpen(true);
                    }}
                    className="h-11 rounded-2xl border border-slate-205 text-xs font-black text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Add Notes
                  </button>
                </div>
              </section>
            ))}

            {/* Add Course plus card */}
            <button
              onClick={() => setAddCourseModalOpen(true)}
              className="rounded-[1.75rem] border-2 border-dashed border-slate-350 hover:border-violet-500 bg-white/50 hover:bg-white p-6 shadow-md transition-all flex flex-col items-center justify-center min-h-[220px] text-slate-500 hover:text-violet-600 gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 hover:bg-violet-50 text-2xl font-black">
                +
              </span>
              <p className="text-sm font-black uppercase tracking-wider">Add New Course</p>
            </button>
          </motion.div>
        )}

        {activeTab === "classes" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 text-xl font-black text-slate-950">Schedule Live Class</h2>
              <div className="grid gap-3">
                <input
                  value={classTopic}
                  onChange={(e) => setClassTopic(e.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none shadow-sm focus:border-indigo-300"
                  placeholder="Class topic (e.g. Binary Trees)"
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <select
                    value={classCourse}
                    onChange={(e) => setClassCourse(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-indigo-300"
                  >
                    <option value="CS301">CS301 (Data Structures)</option>
                    <option value="CS302">CS302 (Database Systems)</option>
                    <option value="CS303">CS303 (Operating Systems)</option>
                  </select>
                  <input
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-indigo-300"
                  />
                  <input
                    type="time"
                    value={classTime}
                    onChange={(e) => setClassTime(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-indigo-300"
                  />
                </div>
                <button
                  onClick={handleScheduleClass}
                  className="mt-2 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#263676] text-sm font-black text-white hover:bg-[#1a2552] transition-all"
                >
                  <CalendarClock className="h-4 w-4" />
                  Schedule Class
                </button>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 text-xl font-black text-slate-950">Scheduled Live Classes</h2>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {scheduledList.length > 0 ? (
                  scheduledList.map((item) => (
                    <div key={item._id} className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight">{item.title}</p>
                        <p className="text-[10px] font-black text-slate-450 uppercase mt-0.5">{item.courseCode} · {item.status}</p>
                        <p className="text-xs font-bold text-slate-500 mt-2">Starts: {new Date(item.startsAt).toLocaleString("en-IN")}</p>
                      </div>
                      <button
                        onClick={() => window.open(item.meetingUrl || "https://meet.jit.si/sgsu-virtual-classroom", "_blank")}
                        className="rounded-xl bg-violet-100 text-violet-700 px-3 py-1.5 text-xs font-black hover:bg-violet-200 transition-all shrink-0"
                      >
                        Start Meeting
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">
                    No classes scheduled yet.
                  </div>
                )}
              </div>
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
      {/* Upload Material Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-white w-full max-w-[500px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="border-b border-gray-100 p-5 bg-gradient-to-r from-violet-50 to-white flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-violet-850 uppercase tracking-widest">Upload Material: {uploadCourseCode}</h4>
              <button onClick={() => setUploadModalOpen(false)} className="rounded-full hover:bg-slate-100 p-1.5 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                Material Title:
                <input
                  type="text"
                  placeholder="e.g. Tree Traversals Lecture 1"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-violet-300"
                />
              </label>

              <div className="grid gap-4 grid-cols-2">
                <label className="grid gap-1 text-xs font-bold text-slate-700">
                  Folder Category:
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as any)}
                    className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Video Lectures">Video Lectures</option>
                    <option value="Practice Papers">Practice Papers</option>
                    <option value="Cheat Sheets">Cheat Sheets</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-bold text-slate-700">
                  Resource Format:
                  <select
                    value={resFormat}
                    onChange={(e) => setResFormat(e.target.value as any)}
                    className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold"
                  >
                    <option value="PDF">PDF / Document</option>
                    <option value="Video">Video Playlist / File</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-4 border-t border-slate-100 pt-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-750">
                  <input
                    type="radio"
                    name="resType"
                    checked={resType === "file"}
                    onChange={() => setResType("file")}
                    className="accent-violet-600"
                  />
                  File Upload
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-750">
                  <input
                    type="radio"
                    name="resType"
                    checked={resType === "url"}
                    onChange={() => setResType("url")}
                    className="accent-violet-600"
                  />
                  External URL / Link
                </label>
              </div>

              {resType === "file" ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
                  <input
                    type="file"
                    id="res-file-picker"
                    className="hidden"
                    onChange={handleCloudinaryUpload}
                    accept={resFormat === "Video" ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.gif"}
                  />
                  <label htmlFor="res-file-picker" className="cursor-pointer space-y-2 block">
                    <div className="text-2xl text-violet-600">📤</div>
                    <p className="text-xs font-extrabold text-slate-700 hover:text-violet-600">
                      {uploadingRes ? "Uploading to Cloudinary..." : resFileUrl ? "Change selected file" : "Select file to upload"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-450">Supports PDFs, Videos and Images</p>
                  </label>
                  {resFileUrl && (
                    <p className="mt-2 text-[10px] font-bold text-emerald-600 truncate">
                      Uploaded URL: {resFileUrl}
                    </p>
                  )}
                </div>
              ) : (
                <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                  External URL / Playlist Link:
                  <input
                    type="text"
                    placeholder="e.g. https://www.youtube.com/playlist?list=..."
                    value={extUrl}
                    onChange={(e) => setExtUrl(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-violet-300"
                  />
                </label>
              )}

              <button
                type="button"
                onClick={handleSubmitMaterial}
                disabled={uploadingRes}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-black text-white hover:bg-violet-700 disabled:opacity-50 shadow-md shadow-violet-100"
              >
                {uploadingRes ? "Processing file upload..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {addCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-white w-full max-w-[450px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="border-b border-gray-100 p-5 bg-gradient-to-r from-violet-50 to-white flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-850 uppercase tracking-widest">Create New Course</h4>
              <button onClick={() => setAddCourseModalOpen(false)} className="rounded-full hover:bg-slate-100 p-1.5 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                Course Code:
                <input
                  type="text"
                  placeholder="e.g. CS301"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-violet-300"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                Course Title:
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-violet-300"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                Theme Color:
                <select
                  value={newCourseColor}
                  onChange={(e) => setNewCourseColor(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold"
                >
                  <option value="#7130a1">Purple (#7130a1)</option>
                  <option value="#0ea5e9">Sky Blue (#0ea5e9)</option>
                  <option value="#10b981">Green (#10b981)</option>
                  <option value="#ef4444">Red (#ef4444)</option>
                  <option value="#f59e0b">Orange (#f59e0b)</option>
                </select>
              </label>

              <button
                type="button"
                onClick={handleCreateCourse}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-black text-white hover:bg-violet-700 shadow-md shadow-violet-100"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
