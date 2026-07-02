import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, ClipboardList, CheckCircle2, XCircle,
  PlusCircle, Send, Video, FileText, Bell, BarChart2, Radio,
  ChevronRight, Upload, Star, Edit2, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const tabs = [
  { id: "overview",      label: "Overview",        icon: BarChart2 },
  { id: "courses",       label: "My Courses",       icon: BookOpen },
  { id: "assignments",   label: "Assignments",      icon: ClipboardList },
  { id: "announcements", label: "Announcements",    icon: Bell },
  { id: "liveclass",     label: "Live Class",       icon: Radio },
];

const stats = [
  { label: "Active Students", value: "156", icon: Users,         color: "#10B981", bg: "#ECFDF5" },
  { label: "Assigned Courses", value: "4",  icon: BookOpen,      color: "#6366F1", bg: "#EEF2FF" },
  { label: "Pending Grading",  value: "12", icon: ClipboardList, color: "#F59E0B", bg: "#FFFBEB" },
  { label: "Avg. Class Score", value: "78%",icon: Star,          color: "#EF4444", bg: "#FEF2F2" },
];

const mockStudents = [
  { id: 1, name: "Arjun Singh",   roll: "CS2021001", course: "Data Structures" },
  { id: 2, name: "Priya Sharma",  roll: "CS2021002", course: "Data Structures" },
  { id: 3, name: "Rahul Verma",   roll: "CS2021003", course: "Database Systems" },
  { id: 4, name: "Anjali Gupta",  roll: "CS2021004", course: "Data Structures" },
  { id: 5, name: "Vikram Patel",  roll: "CS2021005", course: "Database Systems" },
  { id: 6, name: "Deepak Kumar",  roll: "CS2021006", course: "Data Structures" },
  { id: 7, name: "Sneha Reddy",   roll: "CS2021007", course: "Database Systems" },
  { id: 8, name: "Mohit Joshi",   roll: "CS2021008", course: "Data Structures" },
];

const mockSubmissions = [
  { id: 1, student: "Arjun Singh",  title: "Binary Tree Implementation", course: "CS301", submitted: "Jun 28", grade: "" },
  { id: 2, student: "Priya Sharma", title: "SQL Query Optimization",      course: "CS302", submitted: "Jun 27", grade: "" },
  { id: 3, student: "Rahul Verma",  title: "Linked List Reversal",        course: "CS301", submitted: "Jun 27", grade: "" },
  { id: 4, student: "Anjali Gupta", title: "ER Diagram Design",           course: "CS302", submitted: "Jun 26", grade: "" },
  { id: 5, student: "Vikram Patel", title: "Sorting Algorithms Analysis", course: "CS301", submitted: "Jun 25", grade: "" },
];

const myCourses = [
  { id: "c1", code: "CS301", title: "Data Structures & Algorithms", enrolled: 48, progress: 72, color: "#4F46E5" },
  { id: "c2", code: "CS302", title: "Database Management Systems",  enrolled: 41, progress: 58, color: "#0EA5E9" },
  { id: "c3", code: "CS303", title: "Operating Systems",            enrolled: 35, progress: 45, color: "#10B981" },
  { id: "c4", code: "CS401", title: "Machine Learning Basics",      enrolled: 29, progress: 30, color: "#8B5CF6" },
];

const pastAnnouncements = [
  { id: 1, title: "Assignment 3 deadline extended to July 8th", course: "CS301", time: "2 days ago", sent: true },
  { id: 2, title: "Midterm exam syllabus posted on portal", course: "CS302", time: "4 days ago", sent: true },
];

export default function FacultyDashboard({ user }: { user: { name: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [attendance, setAttendance] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(mockStudents.map((s) => [s.id, Math.random() > 0.3]))
  );
  const [grades, setGrades] = useState<Record<number, string>>(Object.fromEntries(mockSubmissions.map(s => [s.id, s.grade])));
  const [savedGrades, setSavedGrades] = useState<Set<number>>(new Set());
  const [annTitle, setAnnTitle] = useState("");
  const [annCourse, setAnnCourse] = useState("CS301");
  const [annBody, setAnnBody] = useState("");
  const [announcements, setAnnouncements] = useState(pastAnnouncements);
  const [annSent, setAnnSent] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [createAssignTitle, setCreateAssignTitle] = useState("");
  const [createAssignCourse, setCreateAssignCourse] = useState("CS301");
  const [createAssignDue, setCreateAssignDue] = useState("");
  const [assignCreated, setAssignCreated] = useState(false);

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const toggleAttendance = (id: number) => setAttendance((p) => ({ ...p, [id]: !p[id] }));

  const sendAnnouncement = () => {
    if (!annTitle.trim()) return;
    setAnnouncements((p) => [{ id: Date.now(), title: annTitle, course: annCourse, time: "just now", sent: true }, ...p]);
    setAnnTitle(""); setAnnBody(""); setAnnSent(true);
    setTimeout(() => setAnnSent(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-7"
        style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 60%, #a7f3d0 100%)" }}>
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 mb-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Faculty Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome, <span className="text-emerald-600">{user.name.split(" ")[0]}!</span></h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Manage courses, track students, and grade assignments.</p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <div className="text-center"><div className="text-2xl font-extrabold text-slate-900">{presentCount}/{mockStudents.length}</div><div className="text-xs text-slate-500 font-medium">Present Today</div></div>
            <div className="h-10 w-px bg-emerald-200" />
            <div className="text-center"><div className="text-2xl font-extrabold text-slate-900">{myCourses.length}</div><div className="text-xs text-slate-500 font-medium">Active Courses</div></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full border-b border-gray-100 bg-white px-4 md:px-8 lg:px-12">
        <div className="max-w-[1520px] mx-auto flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 md:px-8 lg:px-12 py-7 max-w-[1520px] mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-7">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {stats.map((s) => (
                    <div key={s.label} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ background: s.bg }}>
                        <s.icon className="h-5 w-5" style={{ color: s.color }} />
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                      <div className="absolute bottom-0 left-0 h-1 w-1/2 rounded-b-2xl" style={{ background: s.color }} />
                    </div>
                  ))}
                </div>
                {/* Attendance quick view */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-1 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-extrabold text-foreground">Today's Attendance</h3>
                    <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">{presentCount}/{mockStudents.length} Present</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {mockStudents.map((s) => (
                      <div key={s.id} onClick={() => toggleAttendance(s.id)} className="flex items-center gap-2 rounded-xl border border-gray-100 p-2.5 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: attendance[s.id] ? "#10B981" : "#94A3B8" }}>
                          {s.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{s.name.split(" ")[0]}</p>
                          <p className={`text-[10px] font-semibold ${attendance[s.id] ? "text-emerald-500" : "text-red-400"}`}>{attendance[s.id] ? "Present" : "Absent"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Pending grading */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-1 rounded-full bg-indigo-500" />
                    <h3 className="text-sm font-extrabold text-foreground">Pending Grades</h3>
                    <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">{mockSubmissions.length} Submissions</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {mockSubmissions.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                        <ClipboardList className="h-4 w-4 text-indigo-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{sub.title}</p>
                          <p className="text-[10px] text-slate-500">{sub.student} · {sub.submitted}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input value={grades[sub.id]} onChange={(e) => { setSavedGrades(p => { const n = new Set(p); n.delete(sub.id); return n; }); setGrades(p => ({ ...p, [sub.id]: e.target.value })); }}
                            placeholder="Grade" className="w-20 h-7 text-xs rounded-lg" />
                          <Button size="sm" onClick={() => setSavedGrades(p => new Set([...p, sub.id]))} disabled={!grades[sub.id]}
                            className={`h-7 px-2.5 rounded-lg text-xs font-bold ${savedGrades.has(sub.id) ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}>
                            {savedGrades.has(sub.id) ? "✓" : "Save"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── MY COURSES ── */}
            {activeTab === "courses" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-slate-800">My Courses</h2>
                  <Button onClick={() => setShowCreateCourse(!showCreateCourse)} size="sm" className="gap-2 rounded-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white">
                    <PlusCircle className="h-4 w-4" /> Create Course
                  </Button>
                </div>
                <AnimatePresence>
                  {showCreateCourse && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-sm font-extrabold text-slate-700 mb-3">New Course Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <Input value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="Course title (e.g. Advanced Python)" className="bg-white" />
                        <Input value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} placeholder="Course code (e.g. CS405)" className="bg-white" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setShowCreateCourse(false)} className="rounded-lg font-bold bg-emerald-500 text-white" disabled={!newCourseTitle}>Create</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowCreateCourse(false)} className="rounded-lg font-bold">Cancel</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {myCourses.map((course) => (
                    <div key={course.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold text-white" style={{ background: course.color }}>
                          {course.code.slice(-3)}
                        </div>
                        <div className="flex gap-1">
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <p className="text-sm font-extrabold text-slate-800 mb-0.5">{course.title}</p>
                      <p className="text-xs font-mono font-bold mb-3" style={{ color: course.color }}>{course.code}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Users className="h-3.5 w-3.5" />{course.enrolled} students
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-semibold"><span className="text-slate-500">Syllabus Progress</span><span style={{ color: course.color }}>{course.progress}%</span></div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
                        </div>
                      </div>
                      <div className="flex gap-1.5 mt-3">
                        <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-bold text-slate-600 hover:border-gray-300"><Video className="h-3 w-3" /> Upload Video</button>
                        <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-bold text-slate-600 hover:border-gray-300"><FileText className="h-3 w-3" /> Add Notes</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ASSIGNMENTS & QUIZZES ── */}
            {activeTab === "assignments" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Create Assignment */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><PlusCircle className="h-4 w-4 text-indigo-500" /> Create Assignment / Quiz</h3>
                    <div className="space-y-3">
                      <Input value={createAssignTitle} onChange={(e) => setCreateAssignTitle(e.target.value)} placeholder="Assignment title..." />
                      <select value={createAssignCourse} onChange={(e) => setCreateAssignCourse(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
                        {myCourses.map((c) => <option key={c.id} value={c.code}>{c.code} – {c.title}</option>)}
                      </select>
                      <Input type="date" value={createAssignDue} onChange={(e) => setCreateAssignDue(e.target.value)} className="text-sm" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => { if (createAssignTitle) { setAssignCreated(true); setCreateAssignTitle(""); setTimeout(() => setAssignCreated(false), 3000); } }}
                          className={`flex-1 rounded-xl font-bold text-white ${assignCreated ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                          {assignCreated ? "✓ Created!" : "Create"}
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl font-bold flex-1 gap-1"><Upload className="h-3.5 w-3.5" /> Upload File</Button>
                      </div>
                    </div>
                  </div>
                  {/* Monitor Submissions */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><ClipboardList className="h-4 w-4 text-emerald-500" /> Monitor Submissions</h3>
                    <div className="flex flex-col gap-2">
                      {mockSubmissions.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-600">{sub.student.split(" ").map(n => n[0]).join("")}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{sub.title}</p>
                            <p className="text-[10px] text-slate-500">{sub.student} · {sub.submitted}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Input value={grades[sub.id]} onChange={(e) => { setSavedGrades(p => { const n = new Set(p); n.delete(sub.id); return n; }); setGrades(p => ({ ...p, [sub.id]: e.target.value })); }}
                              placeholder="Grade" className="w-18 h-7 text-xs rounded-lg" />
                            <Button size="sm" onClick={() => setSavedGrades(p => new Set([...p, sub.id]))} disabled={!grades[sub.id]}
                              className={`h-7 px-2 rounded-lg text-xs font-bold ${savedGrades.has(sub.id) ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}>
                              {savedGrades.has(sub.id) ? <CheckCircle2 className="h-3.5 w-3.5" /> : "Save"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Upload Results */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2"><Upload className="h-4 w-4 text-amber-500" /> Upload Results</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm text-slate-400 hover:border-primary/30 cursor-pointer transition-colors">
                      Drop result CSV/Excel file here or <span className="text-primary font-bold">click to browse</span>
                    </div>
                    <Button className="rounded-xl font-bold shrink-0 gap-2"><Upload className="h-4 w-4" /> Upload</Button>
                  </div>
                </div>
                {/* Student Feedback Summary */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Star className="h-4 w-4 text-amber-400" /> Student Feedback Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[{ label: "Content Quality", score: 4.3 }, { label: "Teaching Style", score: 4.7 }, { label: "Course Pace", score: 3.9 }, { label: "Overall", score: 4.5 }].map((f) => (
                      <div key={f.label} className="text-center rounded-xl bg-slate-50 p-3">
                        <div className="text-2xl font-extrabold text-amber-500">{f.score}</div>
                        <div className="flex justify-center my-1">{[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s <= Math.round(f.score) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />)}</div>
                        <div className="text-xs font-semibold text-slate-500">{f.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── ANNOUNCEMENTS ── */}
            {activeTab === "announcements" && (
              <div className="space-y-5 max-w-2xl">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-violet-500" /> Send Announcement</h3>
                  <div className="space-y-3">
                    <Input value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="Announcement title..." />
                    <select value={annCourse} onChange={(e) => setAnnCourse(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="All">All Courses</option>
                      {myCourses.map((c) => <option key={c.id} value={c.code}>{c.code} – {c.title}</option>)}
                    </select>
                    <textarea value={annBody} onChange={(e) => setAnnBody(e.target.value)} placeholder="Write your announcement..."
                      rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <Button onClick={sendAnnouncement} disabled={!annTitle.trim()}
                      className={`w-full rounded-xl font-bold gap-2 ${annSent ? "bg-emerald-500" : ""}`}>
                      <Send className="h-4 w-4" />{annSent ? "Sent Successfully!" : "Send to Students"}
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-700 mb-3">Past Announcements</h3>
                  <div className="flex flex-col gap-2.5">
                    {announcements.map((a) => (
                      <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                          <Bell className="h-4 w-4 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{a.title}</p>
                          <div className="flex gap-2 mt-0.5 text-xs text-slate-400"><span className="font-mono font-bold text-indigo-500">{a.course}</span><span>·</span><span>{a.time}</span></div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shrink-0">✓ Sent</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── LIVE CLASS ── */}
            {activeTab === "liveclass" && (
              <div className="space-y-5 max-w-2xl">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100"><Radio className="h-6 w-6 text-red-500" /></div>
                    <div><h3 className="text-base font-extrabold text-slate-800">Start Live Class</h3><p className="text-xs text-slate-500">Begin an instant live session for your students</p></div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:outline-none">
                      {myCourses.map((c) => <option key={c.id}>{c.code} – {c.title}</option>)}
                    </select>
                    <Input placeholder="Session topic (e.g. Binary Trees - Lecture 8)" />
                  </div>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
                    <Radio className="h-5 w-5" /> Start Live Now
                  </motion.button>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4">Schedule Future Class</h3>
                  <div className="space-y-3">
                    <Input placeholder="Class topic..." />
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="date" />
                      <Input type="time" />
                    </div>
                    <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                      {myCourses.map((c) => <option key={c.id}>{c.code}</option>)}
                    </select>
                    <Button className="w-full rounded-xl font-bold gap-2"><ChevronRight className="h-4 w-4" /> Schedule Class</Button>
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-gray-200 bg-slate-50/50 p-5">
                  <h3 className="text-sm font-extrabold text-slate-600 mb-3">Upcoming Scheduled Sessions</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { topic: "Sorting Algorithms – CS301", date: "Jul 4, 10:00 AM" },
                      { topic: "SQL Transactions – CS302", date: "Jul 5, 2:00 PM" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3">
                        <Radio className="h-4 w-4 text-red-400 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-700">{s.topic}</p>
                          <p className="text-[10px] text-slate-400">{s.date}</p>
                        </div>
                        <button className="text-xs font-bold text-red-400 hover:text-red-500">Cancel</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
