import { useState } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, AlertTriangle, BookOpen, Edit2, Ban, UserPlus, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const analyticsCards = [
  { label: "Total Registrations", value: "1,248", change: "+12%", icon: Users, color: "#6366F1", bg: "#EEF2FF" },
  { label: "Faculty Members", value: "24", change: "+2", icon: GraduationCap, color: "#10B981", bg: "#ECFDF5" },
  { label: "Active Courses", value: "89", change: "+5", icon: BookOpen, color: "#3B82F6", bg: "#EFF6FF" },
  { label: "System Alerts", value: "3", change: "!", icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB" },
];

const mockUsers = [
  { id: 1, name: "Arjun Singh",    email: "arjun@lh.edu",   role: "student", status: "active",  joined: "Jan 2024" },
  { id: 2, name: "Priya Sharma",   email: "priya@lh.edu",   role: "student", status: "active",  joined: "Jan 2024" },
  { id: 3, name: "Dr. Sarah Chen", email: "sarah@lh.edu",   role: "faculty", status: "active",  joined: "Aug 2023" },
  { id: 4, name: "Rahul Verma",    email: "rahul@lh.edu",   role: "student", status: "banned",  joined: "Feb 2024" },
  { id: 5, name: "Prof. Wilson",   email: "wilson@lh.edu",  role: "faculty", status: "active",  joined: "Aug 2022" },
  { id: 6, name: "Anjali Gupta",   email: "anjali@lh.edu",  role: "student", status: "active",  joined: "Mar 2024" },
  { id: 7, name: "Dr. Alan Turing",email: "alan@lh.edu",    role: "faculty", status: "active",  joined: "Jun 2023" },
  { id: 8, name: "Vikram Patel",   email: "vikram@lh.edu",  role: "student", status: "active",  joined: "Apr 2024" },
];

const approvalQueue = [
  { id: 1, title: "Advanced React Patterns",    instructor: "Dr. Sarah Chen",  dept: "CS", submitted: "Jun 28", credits: 4 },
  { id: 2, title: "Quantum Computing Basics",   instructor: "Prof. Feynman",   dept: "Physics", submitted: "Jun 27", credits: 3 },
  { id: 3, title: "Ethical AI & Society",       instructor: "Dr. Kate Smith",  dept: "AI/ML", submitted: "Jun 26", credits: 3 },
  { id: 4, title: "DevOps & CI/CD Pipeline",    instructor: "Prof. Werner V.", dept: "Cloud", submitted: "Jun 25", credits: 4 },
];

export default function AdminDashboard({ user }: { user: { name: string } }) {
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>(
    Object.fromEntries(mockUsers.map((u) => [u.id, u.status]))
  );
  const [courseStatuses, setCourseStatuses] = useState<Record<number, "pending" | "approved" | "rejected">>(
    Object.fromEntries(approvalQueue.map((c) => [c.id, "pending"]))
  );

  const toggleBan = (id: number) =>
    setUserStatuses((prev) => ({ ...prev, [id]: prev[id] === "banned" ? "active" : "banned" }));

  const approveReject = (id: number, action: "approved" | "rejected") =>
    setCourseStatuses((prev) => ({ ...prev, [id]: action }));

  return (
    <div className="flex flex-col pb-16">

      {/* ── Hero Banner ── */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-8"
        style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 60%, #ddd6fe 100%)" }}>
        <div className="max-w-[1520px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                Admin Command Center
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Welcome, <span className="text-violet-600">{user.name.split(" ")[0]}!</span>
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm font-medium">Manage users, courses, and monitor platform activity.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-slate-900">{mockUsers.filter(u => userStatuses[u.id] === "active").length}</div>
                <div className="text-xs text-slate-500 font-medium">Active Users</div>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-amber-600">{approvalQueue.filter(c => courseStatuses[c.id] === "pending").length}</div>
                <div className="text-xs text-slate-500 font-medium">Pending Approvals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Analytics Cards ── */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 bg-white">
        <div className="max-w-[1520px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {analyticsCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: card.bg }}>
                    <card.icon className="h-5 w-5" style={{ color: card.color }} />
                  </div>
                  <span className="text-xs font-bold rounded-full px-2 py-0.5"
                    style={{ color: card.color, background: card.bg }}>
                    {card.change}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{card.value}</div>
                <div className="text-sm font-semibold text-slate-500 mt-0.5">{card.label}</div>
                <div className="absolute bottom-0 left-0 h-1 w-2/5 rounded-b-2xl" style={{ background: card.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── User Management Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="w-full px-4 md:px-8 lg:px-12 py-8 bg-slate-50"
      >
        <div className="max-w-[1520px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-1 rounded-full bg-violet-500" />
            <h2 className="text-base font-extrabold text-foreground">User Management</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <Button size="sm" className="h-8 rounded-full text-xs font-bold gap-1.5 bg-violet-600 hover:bg-violet-700 text-white">
              <UserPlus className="h-3.5 w-3.5" /> Add User
            </Button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="text-center px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((u, i) => {
                  const status = userStatuses[u.id];
                  const isFaculty = u.role === "faculty";
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${isFaculty ? "bg-emerald-500" : "bg-indigo-500"}`}>
                            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-semibold text-slate-800 text-xs">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs hidden md:table-cell">{u.email}</td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${isFaculty ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell">{u.joined}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                          {status === "active" ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => toggleBan(u.id)}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${status === "banned" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                          >
                            {status === "banned" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ── Course Approval Queue ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="w-full px-4 md:px-8 lg:px-12 py-8 bg-white"
      >
        <div className="max-w-[1520px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-1 rounded-full bg-amber-500" />
            <h2 className="text-base font-extrabold text-foreground">Course Approval Queue</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              {Object.values(courseStatuses).filter(s => s === "pending").length} Pending
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {approvalQueue.map((course, i) => {
              const status = courseStatuses[course.id];
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm transition-all ${
                    status === "approved" ? "border-emerald-200 bg-emerald-50/50" :
                    status === "rejected" ? "border-red-200 bg-red-50/50" :
                    "border-gray-100 bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      status === "approved" ? "bg-emerald-100" : status === "rejected" ? "bg-red-100" : "bg-amber-100"
                    }`}>
                      {status === "approved" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> :
                       status === "rejected" ? <XCircle className="h-5 w-5 text-red-500" /> :
                       <Clock className="h-5 w-5 text-amber-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{course.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>{course.instructor}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="font-semibold text-indigo-600">{course.dept}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{course.credits} credits</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>Submitted {course.submitted}</span>
                      </div>
                    </div>
                  </div>

                  {status === "pending" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" onClick={() => approveReject(course.id, "approved")}
                        className="h-8 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-4">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => approveReject(course.id, "rejected")}
                        className="h-8 rounded-lg text-xs font-bold border-red-200 text-red-500 hover:bg-red-50 px-4">
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                      {status === "approved" ? "✓ Approved" : "✕ Rejected"}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
