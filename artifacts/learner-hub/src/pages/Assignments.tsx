import { ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import FacultyAssignmentManager from "@/components/FacultyAssignmentManager";
import StudentAssignmentsPanel from "@/components/StudentAssignmentsPanel";

export default function Assignments({ role = "student" }: { role?: "student" | "faculty" | "admin" }) {
  return (
    <div className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1200px] space-y-5">

        {/* ── Page Header ── */}
        <section className="relative overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-sm ring-1 ring-slate-100">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-violet-50 to-transparent" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-violet-100/50 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">Student Module</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">Assign<span className="text-violet-600">ments</span></h1>
              <p className="mt-1.5 text-xs font-semibold text-slate-400">Track, submit and review your pending and completed assignments.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { val: "2",  label: "Pending",    color: "bg-rose-100 text-rose-600 ring-rose-200"           },
                  { val: "1",  label: "Submitted",   color: "bg-emerald-100 text-emerald-700 ring-emerald-200"  },
                  { val: "50", label: "Marks Today",  color: "bg-indigo-100 text-indigo-700 ring-indigo-200"    },
                ].map(({ val, label, color }) => (
                  <span key={label} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black ring-1 ${color}`}>
                    <span className="text-sm font-black">{val}</span> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration */}
            <div className="relative ml-6 hidden shrink-0 lg:block">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 shadow-inner">
                <span className="text-5xl select-none">📋</span>
              </div>
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-sm shadow-md">✅</div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        {role === "faculty" ? (
          <FacultyAssignmentManager />
        ) : (
          <StudentAssignmentsPanel />
        )}
      </div>
    </div>
  );
}
