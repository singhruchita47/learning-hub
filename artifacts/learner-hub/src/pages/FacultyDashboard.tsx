import { useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, ClipboardList, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  { label: "Active Students", value: "156", icon: Users, color: "#10B981", bg: "#ECFDF5" },
  { label: "Assigned Courses", value: "4", icon: BookOpen, color: "#6366F1", bg: "#EEF2FF" },
  { label: "Pending Assignments", value: "12", icon: ClipboardList, color: "#F59E0B", bg: "#FFFBEB" },
];

const mockStudents = [
  { id: 1, name: "Arjun Singh",    roll: "CS2021001", course: "Data Structures" },
  { id: 2, name: "Priya Sharma",   roll: "CS2021002", course: "Data Structures" },
  { id: 3, name: "Rahul Verma",    roll: "CS2021003", course: "Database Systems" },
  { id: 4, name: "Anjali Gupta",   roll: "CS2021004", course: "Data Structures" },
  { id: 5, name: "Vikram Patel",   roll: "CS2021005", course: "Database Systems" },
  { id: 6, name: "Deepak Kumar",   roll: "CS2021006", course: "Data Structures" },
  { id: 7, name: "Sneha Reddy",    roll: "CS2021007", course: "Database Systems" },
  { id: 8, name: "Mohit Joshi",    roll: "CS2021008", course: "Data Structures" },
];

const mockSubmissions = [
  { id: 1, student: "Arjun Singh",  title: "Binary Tree Implementation",  course: "CS301", submitted: "Jun 28", grade: "" },
  { id: 2, student: "Priya Sharma", title: "SQL Query Optimization",       course: "CS302", submitted: "Jun 27", grade: "" },
  { id: 3, student: "Rahul Verma",  title: "Linked List Reversal",         course: "CS301", submitted: "Jun 27", grade: "" },
  { id: 4, student: "Anjali Gupta", title: "ER Diagram Design",            course: "CS302", submitted: "Jun 26", grade: "" },
  { id: 5, student: "Vikram Patel", title: "Sorting Algorithms Analysis",  course: "CS301", submitted: "Jun 25", grade: "" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function FacultyDashboard({ user }: { user: { name: string } }) {
  const [attendance, setAttendance] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(mockStudents.map((s) => [s.id, Math.random() > 0.3]))
  );
  const [grades, setGrades] = useState<Record<number, string>>(
    Object.fromEntries(mockSubmissions.map((s) => [s.id, s.grade]))
  );
  const [savedGrades, setSavedGrades] = useState<Set<number>>(new Set());

  const toggleAttendance = (id: number) =>
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));

  const saveGrade = (id: number) => setSavedGrades((prev) => new Set([...prev, id]));

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="flex flex-col pb-16 space-y-0">

      {/* ── Hero Banner ── */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-8"
        style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 60%, #a7f3d0 100%)" }}>
        <div className="max-w-[1520px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Faculty Portal
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Welcome, <span className="text-emerald-600">{user.name.split(" ")[0]}!</span>
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm font-medium">Manage your classes, track attendance, and grade assignments.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-slate-900">{presentCount}/{mockStudents.length}</div>
                <div className="text-xs text-slate-500 font-medium">Present Today</div>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-slate-900">4</div>
                <div className="text-xs text-slate-500 font-medium">Courses Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 bg-white">
        <div className="max-w-[1520px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                  <div className="text-sm font-semibold text-slate-500 mt-0.5">{s.label}</div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-2/5 rounded-b-2xl" style={{ background: s.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Attendance Tracker ── */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full px-4 md:px-8 lg:px-12 py-8 bg-slate-50"
      >
        <div className="max-w-[1520px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-1 rounded-full bg-emerald-500" />
            <h2 className="text-base font-extrabold text-foreground">Attendance Tracker</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              {presentCount} / {mockStudents.length} Present
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Roll No.</th>
                  <th className="text-left px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider hidden md:table-cell">Course</th>
                  <th className="text-center px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((student, i) => {
                  const present = attendance[student.id];
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                            style={{ background: present ? "#10B981" : "#94A3B8" }}>
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-semibold text-slate-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs hidden sm:table-cell">{student.roll}</td>
                      <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{student.course}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          present ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                        }`}>
                          {present ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {present ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => toggleAttendance(student.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                            present
                              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                        >
                          Mark {present ? "Absent" : "Present"}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ── Assignment & Grading Portal ── */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full px-4 md:px-8 lg:px-12 py-8 bg-white"
      >
        <div className="max-w-[1520px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-1 rounded-full bg-indigo-500" />
            <h2 className="text-base font-extrabold text-foreground">Assignment & Grading Portal</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              {mockSubmissions.length} Pending
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {mockSubmissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{sub.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="font-medium">{sub.student}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="font-mono font-semibold text-indigo-600">{sub.course}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>Submitted {sub.submitted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <Input
                      value={grades[sub.id]}
                      onChange={(e) => {
                        setSavedGrades((prev) => { const n = new Set(prev); n.delete(sub.id); return n; });
                        setGrades((prev) => ({ ...prev, [sub.id]: e.target.value }));
                      }}
                      placeholder="Grade (A+, 95…)"
                      className="w-36 h-8 text-xs rounded-lg border-gray-200"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => saveGrade(sub.id)}
                    disabled={!grades[sub.id]}
                    className={`h-8 rounded-lg text-xs font-bold px-3 ${
                      savedGrades.has(sub.id)
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {savedGrades.has(sub.id) ? "✓ Saved" : "Save Grade"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
