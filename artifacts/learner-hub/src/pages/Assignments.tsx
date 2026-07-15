import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";
import FacultyAssignmentManager from "@/components/FacultyAssignmentManager";
import StudentAssignmentsPanel from "@/components/StudentAssignmentsPanel";

export default function Assignments({ role = "student" }: { role?: "student" | "faculty" | "admin" }) {
  const { assignments, reloadAssignments } = useAcademic();
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    void reloadAssignments();
  }, [reloadAssignments]);

  const pendingCount = assignments.filter(a => !a.submittedFileName).length;
  const gradedCount = assignments.filter(a => a.feedback).length;

  return (
    <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Title and Alert Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignments</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Track, submit, and review your assignments.</p>
          </div>
          {role === "student" && pendingCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs font-bold text-amber-800 shadow-sm shrink-0">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>{pendingCount} assignments pending</span>
            </div>
          )}
        </div>

        {role === "student" && (
          <>
            {/* ── Stats Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Total",   value: assignments.length, txt: "text-[#6c5ce7]" },
                { label: "Pending", value: pendingCount,       txt: "text-amber-500" },
                { label: "Graded",  value: gradedCount,        txt: "text-emerald-600" },
              ].map(({ label, value, txt }) => (
                <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px] text-center">
                  <span className="text-4xl font-black text-slate-900">{value}</span>
                  <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
                </div>
              ))}
            </div>

            {/* ── Filter Tabs ── */}
            <div className="flex flex-wrap gap-2.5">
              {["All", "Pending", "Submitted", "Graded"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                        : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Content ── */}
        {role === "faculty" ? (
          <FacultyAssignmentManager />
        ) : (
          <StudentAssignmentsPanel filter={activeTab} />
        )}
      </div>
    </div>
  );
}
