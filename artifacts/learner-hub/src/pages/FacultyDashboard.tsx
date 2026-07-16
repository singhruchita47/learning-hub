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

function FacultyIllustration() {
  return (
    <div className="relative flex h-full min-h-[160px] items-center justify-center select-none pointer-events-none">
      {/* Floating Badges */}
      <div className="absolute -top-2 left-0 z-10 rounded-2xl bg-white px-3 py-1.5 shadow-sm border border-slate-100 flex items-center gap-1.5 scale-90">
        <span className="text-blue-500 text-xs">📝</span>
        <div className="text-[9px] leading-tight">
          <p className="font-extrabold text-slate-800">New Submissions</p>
          <p className="font-semibold text-slate-400">12 Pending</p>
        </div>
      </div>
      <div className="absolute top-4 right-0 z-10 rounded-2xl bg-white px-3 py-1.5 shadow-sm border border-slate-100 flex items-center gap-1.5 scale-90">
        <span className="text-sm">📅</span>
        <div className="text-[9px] leading-tight">
          <p className="font-extrabold text-amber-600">Next Class</p>
          <p className="font-semibold text-slate-400">In 2 hours</p>
        </div>
      </div>

      {/* SVG Illustration */}
      <div className="relative z-0 w-48 h-48 lg:w-[200px] lg:h-[200px] mt-2 lg:mt-0 rounded-full overflow-hidden shadow-[0_10px_30px_rgba(108,_92,_231,_0.15)] ring-4 ring-white bg-[#f8f7ff] flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#ede9fe" opacity="0.5" />
          {/* Laptop/Screen */}
          <rect x="50" y="70" width="100" height="70" rx="4" fill="#1e293b" />
          <rect x="55" y="75" width="90" height="55" rx="2" fill="#0ea5e9" />
          <path d="M40 140 L160 140 A5 5 0 0 1 165 145 L165 148 A2 2 0 0 1 163 150 L37 150 A2 2 0 0 1 35 148 L35 145 A5 5 0 0 1 40 140 Z" fill="#94a3b8" />
          <rect x="90" y="142" width="20" height="3" rx="1" fill="#cbd5e1" />
          {/* Chart on screen */}
          <rect x="65" y="100" width="10" height="20" rx="1" fill="#fff" opacity="0.8" />
          <rect x="85" y="90" width="10" height="30" rx="1" fill="#fff" opacity="0.8" />
          <rect x="105" y="110" width="10" height="10" rx="1" fill="#fff" opacity="0.8" />
          <rect x="125" y="80" width="10" height="40" rx="1" fill="#fff" opacity="0.8" />
          {/* Floating Elements */}
          <path d="M40 50 L42 40 L52 38 L42 36 L40 26 L38 36 L28 38 L38 40 Z" fill="#fbbf24"/>
          <path d="M150 70 L151.5 62 L159 60.5 L151.5 59 L150 51 L148.5 59 L141 60.5 L148.5 62 Z" fill="#a78bfa"/>
          <circle cx="160" cy="120" r="4" fill="#38bdf8"/>
          <circle cx="30" cy="130" r="5" fill="#f472b6"/>
        </svg>
      </div>
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
  const [classCustomLink, setClassCustomLink] = useState("");
  const [scheduledList, setScheduledList] = useState<any[]>([]);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseColor, setNewCourseColor] = useState("#7130a1");
  const [newCourseBranch, setNewCourseBranch] = useState("All Branches");
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
    if (!classTopic.trim() || !classDate || !classTime || !classCustomLink.trim()) {
      alert("Please fill in topic, date, time, and meeting link");
      return;
    }
    const startsAt = new Date(`${classDate}T${classTime}`).toISOString();
    const meetingUrl = classCustomLink.trim();
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
        setClassCustomLink("");
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
      branch: newCourseBranch,
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

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* ── Hero Banner ── */}
            <section className="relative overflow-hidden rounded-[2rem] bg-[#f3f0ff] p-6 md:p-8 shadow-sm border border-purple-100/40 mb-6">
              <div className="relative grid lg:grid-cols-[1fr_240px] gap-6 items-center">
                <div>
                  <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-violet-100 border border-violet-200 px-3.5 py-1.5 text-xs font-bold text-violet-800">
                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                    Faculty Dashboard
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black leading-tight text-slate-900 tracking-tight">
                    Welcome back,<br />
                    <span className="text-violet-600">{user.name}!</span>
                  </h1>

                  <p className="mt-4 max-w-md text-sm font-semibold text-slate-500 leading-relaxed">
                    Manage students, publish tests, review submissions, schedule live classes and track academic activity.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-lg bg-violet-100 px-4 py-2 text-xs font-black text-violet-700 ring-1 ring-violet-200">
                      SGSU Faculty
                    </span>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <FacultyIllustration />
                </div>
              </div>
            </section>

            {/* ── Premium Stat Cards (Horizontal Balance) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {[
                { label: "Attendance",          value: `${attendanceList.length || 42}`, sub: "Checked in", icon: Users,         from: "from-violet-500",  to: "to-indigo-600", shadow: "shadow-violet-200/50", txt: "text-violet-600", bg: "bg-violet-50" },
                { label: "Courses",             value: "4",                              sub: "Running",    icon: BookOpen,      from: "from-blue-500",    to: "to-cyan-500",   shadow: "shadow-blue-200/50",  txt: "text-blue-600", bg: "bg-blue-50"   },
                { label: "Reviews",             value: String(reviewItems.length || 12), sub: "Waiting",    icon: ClipboardList, from: "from-rose-500",   to: "to-pink-500",   shadow: "shadow-rose-200/50",  txt: "text-rose-600", bg: "bg-rose-50"  },
                { label: "Avg Score",           value: markItems.length ? `${Math.round((markItems.reduce((sum, item) => sum + item.score / Math.max(item.total, 1), 0) / markItems.length) * 100)}%` : "78%", sub: "Average",   icon: Star, from: "from-emerald-500", to: "to-teal-500", shadow: "shadow-emerald-200/50", txt: "text-emerald-600", bg: "bg-emerald-50" },
              ].map(({ label, value, sub, icon: Icon, from, to, shadow, txt, bg }) => (
                <div key={label} className="group relative overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${txt} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${txt} bg-slate-50 px-2 py-1 rounded-lg border border-slate-100`}>{sub}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                  </div>
                  {/* Subtle Accent Line */}
                  <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${from} ${to} transition-all duration-500 group-hover:w-full`} />
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
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* ── Title and Config Row ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Courses Administration</h1>
                <p className="text-xs font-semibold text-slate-400 mt-1">Manage active subjects, enroll students, and upload study assets.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddCourseModalOpen(true)}
                className="rounded-2xl bg-[#6c5ce7] px-5 py-2.5 text-xs font-black text-white hover:bg-[#584ac2] shadow-sm transition shrink-0 cursor-pointer"
              >
                + Create Course
              </button>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Total Courses", value: coursesList.length || "0", txt: "text-[#6c5ce7]" },
                { label: "Avg Students",  value: `${coursesList.length ? Math.round(coursesList.reduce((sum, c) => sum + (c.students || 0), 0) / coursesList.length) : "0"}`, txt: "text-blue-650" },
                { label: "Faculty Owner",  value: "SGSU Faculty", txt: "text-amber-500" },
              ].map(({ label, value, txt }) => (
                <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px]">
                  <span className={`text-4xl font-black ${txt}`}>{value}</span>
                  <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
                </div>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
              {coursesList.map((course) => (
                <section
                  key={course.code}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-slate-150/70 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    {/* Top Row: Icon and Status Badge */}
                    <div className="flex items-center justify-between mb-4.5">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black text-white shadow-sm transition-transform duration-300 group-hover:rotate-3"
                        style={{
                          background: `linear-gradient(135deg, ${course.color}dd, ${course.color})`,
                        }}
                      >
                        {course.code.slice(-2)}
                      </div>
                      
                      {/* Active Status Badge */}
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                        Active
                      </span>
                    </div>

                    {/* Title & Code */}
                    <h2 className="text-base font-black text-slate-800 leading-snug group-hover:text-[#6c5ce7] transition-colors line-clamp-1">
                      {course.title}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-wider mt-0.5" style={{ color: course.color }}>
                      {course.code}
                    </p>

                    {/* Stats & Progress Row */}
                    <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100/60 pt-3">
                      <span>👥 {course.students || 0} Students</span>
                      <span style={{ color: course.color }}>📊 {course.progress}% progress</span>
                    </div>

                    {/* Small progress line */}
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 mt-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${course.progress}%`,
                          background: course.color
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setUploadCourseCode(course.code);
                        setResCategory("Video Lectures");
                        setResFormat("Video");
                        setResType("url");
                        setUploadModalOpen(true);
                      }}
                      className="h-9 rounded-xl border border-slate-150 text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-1 cursor-pointer hover:border-slate-300"
                    >
                      🎥 Video
                    </button>
                    <button
                      onClick={() => {
                        setUploadCourseCode(course.code);
                        setResCategory("Lecture Notes");
                        setResFormat("PDF");
                        setResType("file");
                        setUploadModalOpen(true);
                      }}
                      className="h-9 rounded-xl border border-slate-150 text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-1 cursor-pointer hover:border-slate-300"
                    >
                      📄 Notes
                    </button>
                  </div>
                </section>
              ))}

              {/* Add Course plus card */}
              <button
                onClick={() => setAddCourseModalOpen(true)}
                className="group relative overflow-hidden rounded-[1.75rem] border border-dashed border-slate-250 hover:border-[#6c5ce7] bg-white/40 hover:bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 flex flex-col justify-center items-center min-h-[220px] gap-2.5 cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-[#6c5ce7] transition-transform group-hover:scale-110 duration-300">
                  <span className="text-xl font-black">+</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-800 group-hover:text-[#6c5ce7] transition-colors">Create Subject</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1 max-w-[160px] mx-auto">Launch new classroom module.</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "classes" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* ── Title and Config Row ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Virtual Classrooms</h1>
                <p className="text-xs font-semibold text-slate-400 mt-1">Schedule live virtual lectures, start Jitsi video meetings, and manage logs.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-850 shadow-sm shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Classroom Server Live</span>
              </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Scheduled Lectures", value: scheduledList.length || "0", txt: "text-blue-650" },
                { label: "Meeting Provider",  value: "Jitsi Meet", txt: "text-[#6c5ce7]" },
                { label: "Status Status",    value: "Online",     txt: "text-emerald-600" },
              ].map(({ label, value, txt }) => (
                <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px]">
                  <span className={`text-4xl font-black ${txt}`}>{value}</span>
                  <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
                </div>
              ))}
            </div>

            {/* Main panels */}
            <div className="grid gap-6 lg:grid-cols-[1fr_420px] pt-2">
              <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-black text-slate-800">Schedule Live Class</h2>
                <div className="grid gap-4.5">
                  <input
                    value={classTopic}
                    onChange={(e) => setClassTopic(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                    placeholder="Class topic (e.g. Binary Trees)"
                  />
                  <div className="grid gap-4 md:grid-cols-3">
                    <select
                      value={classCourse}
                      onChange={(e) => setClassCourse(e.target.value)}
                      className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                    >
                      <option value="CS301">CS301 (Data Structures)</option>
                      <option value="CS302">CS302 (Database Systems)</option>
                      <option value="CS303">CS303 (Operating Systems)</option>
                    </select>
                    <input
                      type="date"
                      value={classDate}
                      onChange={(e) => setClassDate(e.target.value)}
                      className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                    />
                    <input
                      type="time"
                      value={classTime}
                      onChange={(e) => setClassTime(e.target.value)}
                      className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                    />
                  </div>
                  <input
                    value={classCustomLink}
                    onChange={(e) => setClassCustomLink(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                    placeholder="Meeting Link (e.g. Zoom, Google Meet)"
                  />
                  <button
                    onClick={handleScheduleClass}
                    className="mt-2 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6c5ce7] text-sm font-black text-white hover:bg-[#584ac2] shadow-sm transition cursor-pointer"
                  >
                    <CalendarClock className="h-4.5 w-4.5" />
                    Schedule Class
                  </button>
                </div>
              </section>

              <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-black text-slate-800">Scheduled Live Classes</h2>
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {scheduledList.length > 0 ? (
                    scheduledList.map((item) => (
                      <div key={item._id} className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-slate-900 leading-tight truncate">{item.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{item.courseCode} · {item.status}</p>
                          <p className="text-xs font-bold text-slate-500 mt-2">Starts: {new Date(item.startsAt).toLocaleString("en-IN")}</p>
                        </div>
                        <button
                          onClick={() => window.open(item.meetingUrl || "https://meet.jit.si/sgsu-virtual-classroom", "_blank")}
                          className="rounded-xl bg-violet-100 text-violet-750 px-3.5 py-2 text-xs font-black hover:bg-violet-200 transition shrink-0 cursor-pointer"
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
            </div>
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

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                Target Branch:
                <select
                  value={newCourseBranch}
                  onChange={(e) => setNewCourseBranch(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold"
                >
                  <option value="All Branches">All Branches</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
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
