import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, CheckCircle2, AlertTriangle, Upload, X, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const assignments = [
  { id: "1", title: "Binary Tree Implementation",       course: "CS301", due: "Jul 5, 2026",   status: "pending",   grade: null,  points: 20, desc: "Implement a binary tree with insert, delete, and traversal methods in Python." },
  { id: "2", title: "SQL Query Optimization",           course: "CS302", due: "Jul 3, 2026",   status: "submitted", grade: null,  points: 15, desc: "Optimize the provided SQL queries for performance using indexes and joins." },
  { id: "3", title: "Process Scheduling Simulation",   course: "CS303", due: "Jun 28, 2026",  status: "graded",    grade: 88,    points: 25, desc: "Build a simulation of FCFS, SJF, and Round Robin scheduling algorithms." },
  { id: "4", title: "Network Topology Design",         course: "CS304", due: "Jun 20, 2026",  status: "graded",    grade: 92,    points: 20, desc: "Design a network topology for a university campus with detailed documentation." },
  { id: "5", title: "ER Diagram & Normalization",      course: "CS302", due: "Jul 10, 2026",  status: "pending",   grade: null,  points: 15, desc: "Create an ER diagram for a hospital management system and normalize to 3NF." },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  pending:   { label: "Pending",   color: "#F59E0B", bg: "#FFFBEB", icon: Clock },
  submitted: { label: "Submitted", color: "#3B82F6", bg: "#EFF6FF", icon: Upload },
  graded:    { label: "Graded",    color: "#10B981", bg: "#ECFDF5", icon: CheckCircle2 },
};

export default function Assignments() {
  const [submitId, setSubmitId] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(assignments.map((a) => [a.id, a.status]))
  );
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "submitted" | "graded">("all");

  const filtered = assignments.filter((a) => activeTab === "all" || statuses[a.id] === activeTab);
  const pendingCount = assignments.filter((a) => statuses[a.id] === "pending").length;

  const handleSubmit = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "submitted" }));
    setSubmitId(null);
    setFileName("");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">Track, submit, and review your assignments.</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">{pendingCount} assignment{pendingCount > 1 ? "s" : ""} pending</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Total", value: assignments.length, color: "#4F46E5" },
          { label: "Pending", value: assignments.filter(a => statuses[a.id] === "pending").length, color: "#F59E0B" },
          { label: "Graded", value: assignments.filter(a => statuses[a.id] === "graded").length, color: "#10B981" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "submitted", "graded"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize transition-all ${
              activeTab === tab ? "bg-primary text-white shadow-md shadow-primary/25" : "bg-white border border-gray-200 text-slate-600 hover:border-primary/40"
            }`}>{tab}</button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((a, i) => {
          const cfg = statusConfig[statuses[a.id]];
          const isSubmitOpen = submitId === a.id;
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: cfg.bg }}>
                    <cfg.icon className="h-5 w-5" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">{a.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-lg">{a.desc}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                      <span className="font-mono font-bold text-indigo-600">{a.course}</span>
                      <div className="flex items-center gap-1 text-slate-500"><CalendarDays className="h-3 w-3" />Due {a.due}</div>
                      <div className="flex items-center gap-1 text-slate-500"><FileText className="h-3 w-3" />{a.points} pts</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {statuses[a.id] === "graded" && (
                    <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                      <span className="text-sm font-extrabold text-emerald-700">{a.grade}/{a.points}</span>
                    </div>
                  )}
                  <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  {statuses[a.id] === "pending" && (
                    <Button size="sm" onClick={() => setSubmitId(isSubmitOpen ? null : a.id)}
                      className="h-8 rounded-lg text-xs font-bold gap-1.5 bg-primary text-white">
                      <Upload className="h-3.5 w-3.5" /> Submit
                    </Button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isSubmitOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-100 bg-slate-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Input placeholder="Enter file name or link..." value={fileName} onChange={(e) => setFileName(e.target.value)}
                        className="flex-1 h-9 text-sm rounded-lg" />
                      <Button size="sm" onClick={() => handleSubmit(a.id)} disabled={!fileName}
                        className="h-9 rounded-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white">Confirm Submit</Button>
                      <button onClick={() => setSubmitId(null)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:text-slate-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
