import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, AlertTriangle, BarChart2, Settings, Bell, Shield,
  CheckCircle2, XCircle, Ban, Edit2, UserPlus, Clock, Star, Megaphone,
  CalendarDays, Download, RefreshCw, PlusCircle, TrendingUp, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import DashboardTopBar from "@/components/DashboardTopBar";
import BookHeroArt from "@/components/BookHeroArt";

const tabs = [
  { id: "overview",      label: "Overview",        icon: BarChart2 },
  { id: "reports",       label: "Reports",          icon: TrendingUp },
  { id: "system",        label: "System",           icon: Settings },
  { id: "badges",        label: "Badges & Roles",   icon: Star },
  { id: "announcements", label: "Announcements",    icon: Megaphone },
];

const analyticsCards = [
  { label: "Total Registrations", value: "1,248", change: "+12%", icon: Users,         color: "#6366F1", bg: "#EEF2FF" },
  { label: "Faculty Members",     value: "24",    change: "+2",   icon: Users,         color: "#10B981", bg: "#ECFDF5" },
  { label: "Active Courses",      value: "89",    change: "+5",   icon: BookOpen,      color: "#3B82F6", bg: "#EFF6FF" },
  { label: "System Alerts",       value: "3",     change: "!",    icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB" },
];

const mockUsers = [
  { id: 1, name: "Arjun Singh",    email: "arjun@lh.edu",   role: "student", status: "active",  joined: "Jan 2024" },
  { id: 2, name: "Priya Sharma",   email: "priya@lh.edu",   role: "student", status: "active",  joined: "Jan 2024" },
  { id: 3, name: "Dr. Sarah Chen", email: "sarah@lh.edu",   role: "faculty", status: "active",  joined: "Aug 2023" },
  { id: 4, name: "Rahul Verma",    email: "rahul@lh.edu",   role: "student", status: "banned",  joined: "Feb 2024" },
  { id: 5, name: "Prof. Wilson",   email: "wilson@lh.edu",  role: "faculty", status: "active",  joined: "Aug 2022" },
  { id: 6, name: "Anjali Gupta",   email: "anjali@lh.edu",  role: "student", status: "active",  joined: "Mar 2024" },
];

const approvalQueue = [
  { id: 1, title: "Advanced React Patterns",  instructor: "Dr. Sarah Chen",  dept: "CS",     submitted: "Jun 28", credits: 4 },
  { id: 2, title: "Quantum Computing Basics", instructor: "Prof. Feynman",   dept: "Physics",submitted: "Jun 27", credits: 3 },
  { id: 3, title: "Ethical AI & Society",     instructor: "Dr. Kate Smith",  dept: "AI/ML",  submitted: "Jun 26", credits: 3 },
];

const enrollmentData = [
  { month: "Jan", students: 180 }, { month: "Feb", students: 220 }, { month: "Mar", students: 260 },
  { month: "Apr", students: 310 }, { month: "May", students: 380 }, { month: "Jun", students: 420 },
  { month: "Jul", students: 480 },
];
const activityData = [
  { day: "Mon", logins: 320, submissions: 45 }, { day: "Tue", logins: 290, submissions: 62 },
  { day: "Wed", logins: 450, submissions: 88 }, { day: "Thu", logins: 380, submissions: 72 },
  { day: "Fri", logins: 410, submissions: 95 }, { day: "Sat", logins: 150, submissions: 20 },
  { day: "Sun", logins: 90,  submissions: 12 },
];

const badges = [
  { id: 1, name: "🏆 Top Learner",     color: "#F59E0B", holders: 15, desc: "Awarded to students in top 10%" },
  { id: 2, name: "🔥 Streak Master",   color: "#EF4444", holders: 32, desc: "Maintained 30-day learning streak" },
  { id: 3, name: "⭐ Quiz Champion",   color: "#6366F1", holders: 28, desc: "Scored 95%+ in 5 quizzes" },
  { id: 4, name: "📚 Course Finisher", color: "#10B981", holders: 87, desc: "Completed 3 or more courses" },
  { id: 5, name: "🤝 Mentor",          color: "#8B5CF6", holders: 8,  desc: "Helped 10+ peers in community" },
];

const systemLogs = [
  { id: 1, type: "warning", msg: "High memory usage on server-02 (87%)", time: "5 min ago" },
  { id: 2, type: "info",    msg: "Scheduled DB backup completed successfully", time: "1 hr ago" },
  { id: 3, type: "error",   msg: "Email service timeout for 3 notifications", time: "2 hrs ago" },
  { id: 4, type: "info",    msg: "New faculty registration: Prof. Anjali Mehta", time: "3 hrs ago" },
  { id: 5, type: "warning", msg: "API rate limit approaching for SMS service", time: "5 hrs ago" },
];

const logConfig: Record<string, { bg: string; color: string; icon: typeof CheckCircle2 }> = {
  warning: { bg: "bg-amber-50 border-amber-200", color: "text-amber-600", icon: AlertTriangle },
  error:   { bg: "bg-red-50 border-red-200",     color: "text-red-600",   icon: XCircle },
  info:    { bg: "bg-blue-50 border-blue-200",   color: "text-blue-600",  icon: CheckCircle2 },
};

export default function AdminDashboard({ user, onLogout }: { user: { name: string }; onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>(Object.fromEntries(mockUsers.map(u => [u.id, u.status])));
  const [courseStatuses, setCourseStatuses] = useState<Record<number, string>>(Object.fromEntries(approvalQueue.map(c => [c.id, "pending"])));
  const [annText, setAnnText] = useState("");
  const [annTarget, setAnnTarget] = useState("All");
  const [annSent, setAnnSent] = useState(false);
  const [pastAnn, setPastAnn] = useState([
    { id: 1, text: "Platform maintenance on July 10 from 2-4 AM", target: "All", time: "3 days ago" },
    { id: 2, text: "New grading policy effective from July 1st", target: "Faculty", time: "5 days ago" },
  ]);

  const toggleBan = (id: number) => setUserStatuses(p => ({ ...p, [id]: p[id] === "banned" ? "active" : "banned" }));

  const sendAnn = () => {
    if (!annText.trim()) return;
    setPastAnn(p => [{ id: Date.now(), text: annText, target: annTarget, time: "just now" }, ...p]);
    setAnnText(""); setAnnSent(true);
    setTimeout(() => setAnnSent(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardTopBar name={user.name} role="Admin" accent="violet" onLogout={onLogout} />

      {/* Hero */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-7"
        style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 60%, #ddd6fe 100%)" }}>
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 mb-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />Admin Command Center
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome, <span className="text-violet-600">{user.name.split(" ")[0]}!</span></h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Manage users, courses, and monitor platform activity.</p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <BookHeroArt accent="violet" />
            <div className="rounded-2xl border border-violet-200 bg-white/70 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center gap-5">
                <div className="text-center"><div className="text-2xl font-extrabold text-slate-900">{mockUsers.filter(u => userStatuses[u.id] === "active").length}</div><div className="text-xs text-slate-500 font-medium">Active Users</div></div>
                <div className="h-10 w-px bg-violet-200" />
                <div className="text-center"><div className="text-2xl font-extrabold text-amber-600">{approvalQueue.filter(c => courseStatuses[c.id] === "pending").length}</div><div className="text-xs text-slate-500 font-medium">Pending Approvals</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full border-b border-gray-100 bg-white px-4 md:px-8 lg:px-12">
        <div className="max-w-[1520px] mx-auto flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id ? "border-violet-500 text-violet-600" : "border-transparent text-slate-500 hover:text-slate-700"
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
                  {analyticsCards.map((card) => (
                    <div key={card.label} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: card.bg }}>
                          <card.icon className="h-5 w-5" style={{ color: card.color }} />
                        </div>
                        <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ color: card.color, background: card.bg }}>{card.change}</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">{card.value}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</div>
                      <div className="absolute bottom-0 left-0 h-1 w-1/2 rounded-b-2xl" style={{ background: card.color }} />
                    </div>
                  ))}
                </div>
                {/* User table */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2"><div className="h-4 w-1 rounded-full bg-violet-500" /><h3 className="text-sm font-extrabold">User Management</h3></div>
                    <Button size="sm" className="h-8 rounded-full text-xs font-bold gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"><UserPlus className="h-3.5 w-3.5" /> Add User</Button>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 bg-slate-50">
                      <th className="text-left px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase">User</th>
                      <th className="text-left px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase hidden md:table-cell">Email</th>
                      <th className="text-left px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase hidden sm:table-cell">Role</th>
                      <th className="text-center px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase">Status</th>
                      <th className="text-center px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase">Actions</th>
                    </tr></thead>
                    <tbody>
                      {mockUsers.map((u) => {
                        const status = userStatuses[u.id];
                        return (
                          <tr key={u.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3"><div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${u.role === "faculty" ? "bg-emerald-500" : "bg-indigo-500"}`}>
                                {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-xs font-semibold text-slate-800">{u.name}</span>
                            </div></td>
                            <td className="px-5 py-3 text-xs text-slate-500 hidden md:table-cell">{u.email}</td>
                            <td className="px-5 py-3 hidden sm:table-cell">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${u.role === "faculty" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>{u.role}</span>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                                {status === "active" ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Ban className="h-2.5 w-2.5" />}{status}
                              </span>
                            </td>
                            <td className="px-5 py-3"><div className="flex items-center justify-center gap-1.5">
                              <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"><Edit2 className="h-3.5 w-3.5" /></button>
                              <button onClick={() => toggleBan(u.id)} className={`flex h-7 w-7 items-center justify-center rounded-lg ${status === "banned" ? "bg-emerald-50 text-emerald-500 hover:bg-emerald-100" : "bg-red-50 text-red-400 hover:bg-red-100"}`}>
                                {status === "banned" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                              </button>
                            </div></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Course Approval Queue */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4"><div className="h-4 w-1 rounded-full bg-amber-500" /><h3 className="text-sm font-extrabold">Course Approval Queue</h3></div>
                  <div className="flex flex-col gap-2.5">
                    {approvalQueue.map((course) => {
                      const status = courseStatuses[course.id];
                      return (
                        <div key={course.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${status === "approved" ? "border-emerald-200 bg-emerald-50/50" : status === "rejected" ? "border-red-200 bg-red-50/50" : "border-gray-100 bg-white"}`}>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{course.title}</p>
                            <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                              <span>{course.instructor}</span><span>·</span><span className="font-semibold text-indigo-600">{course.dept}</span><span>·</span><span>{course.credits} credits</span>
                            </div>
                          </div>
                          {status === "pending" ? (
                            <div className="flex gap-2 shrink-0">
                              <Button size="sm" onClick={() => setCourseStatuses(p => ({ ...p, [course.id]: "approved" }))} className="h-8 rounded-lg text-xs font-bold bg-emerald-500 text-white">Approve</Button>
                              <Button size="sm" variant="outline" onClick={() => setCourseStatuses(p => ({ ...p, [course.id]: "rejected" }))} className="h-8 rounded-lg text-xs font-bold text-red-500 border-red-200">Reject</Button>
                            </div>
                          ) : (
                            <span className={`rounded-full px-3 py-1 text-xs font-bold shrink-0 ${status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                              {status === "approved" ? "✓ Approved" : "✕ Rejected"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── REPORTS ── */}
            {activeTab === "reports" && (
              <div className="space-y-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-slate-800">Analytics & Reports</h2>
                  <Button size="sm" className="gap-2 rounded-full font-bold" variant="outline"><Download className="h-4 w-4" /> Export Report</Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-4">Student Enrollment Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={enrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                        <Line type="monotone" dataKey="students" stroke="#6366F1" strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-4">Weekly Platform Activity</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                        <Bar dataKey="logins" fill="#6366F1" radius={[6, 6, 0, 0]} name="Logins" />
                        <Bar dataKey="submissions" fill="#10B981" radius={[6, 6, 0, 0]} name="Submissions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {[
                    { label: "Avg. Session Time", value: "42 min", icon: Clock, color: "#6366F1" },
                    { label: "Course Completion Rate", value: "68%", icon: CheckCircle2, color: "#10B981" },
                    { label: "Daily Active Users", value: "427", icon: Activity, color: "#F59E0B" },
                    { label: "New Registrations (Week)", value: "+34", icon: UserPlus, color: "#8B5CF6" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-2" style={{ background: `${m.color}18` }}>
                        <m.icon className="h-5 w-5" style={{ color: m.color }} />
                      </div>
                      <div className="text-xl font-extrabold text-slate-900">{m.value}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SYSTEM ── */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Schedule Lecture */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-500" /> Schedule Lecture</h3>
                    <div className="space-y-3">
                      <Input placeholder="Lecture title..." />
                      <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:outline-none">
                        <option>Assign to faculty...</option>
                        <option>Dr. Sarah Chen</option>
                        <option>Prof. Wilson</option>
                        <option>Dr. Alan Turing</option>
                      </select>
                      <div className="grid grid-cols-2 gap-3">
                        <Input type="date" />
                        <Input type="time" />
                      </div>
                      <Button className="w-full rounded-xl font-bold gap-2 bg-blue-600 hover:bg-blue-700 text-white"><CalendarDays className="h-4 w-4" /> Schedule</Button>
                    </div>
                  </div>
                  {/* Assign Teacher/Student */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> Assign Teacher / Student</h3>
                    <div className="space-y-3">
                      <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                        <option>Select course...</option>
                        <option>CS301 – Data Structures</option>
                        <option>CS302 – Database Systems</option>
                        <option>CS401 – Machine Learning</option>
                      </select>
                      <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                        <option>Assign faculty...</option>
                        <option>Dr. Sarah Chen</option>
                        <option>Prof. Wilson</option>
                        <option>Dr. Alan Turing</option>
                      </select>
                      <Input placeholder="Student roll number or email..." />
                      <Button className="w-full rounded-xl font-bold gap-2 bg-violet-600 hover:bg-violet-700 text-white"><UserPlus className="h-4 w-4" /> Assign</Button>
                    </div>
                  </div>
                </div>
                {/* System Activity Monitor */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-500" /> System Activity Log</h3>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {systemLogs.map((log) => {
                      const cfg = logConfig[log.type];
                      return (
                        <div key={log.id} className={`flex items-start gap-3 rounded-xl border p-3 ${cfg.bg}`}>
                          <cfg.icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
                          <div className="flex-1"><p className={`text-xs font-semibold ${cfg.color}`}>{log.msg}</p><p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Security & Data Backup */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-red-500" /> Security & Data Backup</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Last Backup", value: "6 hrs ago", color: "#10B981" },
                      { label: "SSL Expiry", value: "89 days",   color: "#6366F1" },
                      { label: "Active Sessions", value: "427", color: "#F59E0B" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-gray-100 bg-slate-50 p-3 text-center">
                        <div className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 rounded-xl font-bold gap-1.5"><Download className="h-3.5 w-3.5" /> Backup Now</Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-xl font-bold gap-1.5 text-red-500 border-red-200 hover:bg-red-50"><Shield className="h-3.5 w-3.5" /> Security Audit</Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── BADGES & ROLES ── */}
            {activeTab === "badges" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-slate-800">Badges & Leaderboard Control</h2>
                  <Button size="sm" className="gap-2 rounded-full font-bold bg-amber-500 hover:bg-amber-600 text-white"><PlusCircle className="h-4 w-4" /> Create Badge</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">{badge.name.split(" ")[0]}</div>
                        <div className="flex gap-1.5">
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500"><Edit2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <p className="text-sm font-extrabold text-slate-800">{badge.name.split(" ").slice(1).join(" ")}</p>
                      <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-extrabold" style={{ background: badge.color }}>{badge.holders}</div>
                        <span className="text-xs font-semibold text-slate-500">{badge.holders} holders</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4">Manually Assign Badge</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input placeholder="Student email or roll number..." className="flex-1" />
                    <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:outline-none sm:w-48">
                      {badges.map((b) => <option key={b.id}>{b.name}</option>)}
                    </select>
                    <Button className="rounded-xl font-bold shrink-0 gap-2"><Star className="h-4 w-4" /> Assign Badge</Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── ANNOUNCEMENTS ── */}
            {activeTab === "announcements" && (
              <div className="space-y-5 max-w-2xl">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Megaphone className="h-4 w-4 text-violet-500" /> System-Wide Announcement</h3>
                  <div className="space-y-3">
                    <textarea value={annText} onChange={(e) => setAnnText(e.target.value)} placeholder="Write your announcement for the platform..."
                      rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <select value={annTarget} onChange={(e) => setAnnTarget(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none">
                      <option>All</option><option>Students</option><option>Faculty</option>
                    </select>
                    <Button onClick={sendAnn} disabled={!annText.trim()}
                      className={`w-full rounded-xl font-bold gap-2 ${annSent ? "bg-emerald-500" : ""}`}>
                      <Bell className="h-4 w-4" />{annSent ? "Announcement Sent!" : "Send to " + annTarget}
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-700 mb-3">Past Announcements</h3>
                  <div className="flex flex-col gap-2.5">
                    {pastAnn.map((a) => (
                      <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100"><Megaphone className="h-4 w-4 text-violet-600" /></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">{a.text}</p>
                          <div className="flex gap-2 mt-0.5 text-xs text-slate-400">
                            <span className="font-bold text-violet-600">→ {a.target}</span><span>·</span><span>{a.time}</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shrink-0">✓ Sent</span>
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
