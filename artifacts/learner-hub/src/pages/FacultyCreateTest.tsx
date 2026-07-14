import { useState } from "react";
import { HelpCircle, Play, Square, CheckCircle, Clock } from "lucide-react";
import FacultyTestCreator from "@/components/FacultyTestCreator";
import { useAcademic } from "@/context/AcademicContext";

export default function FacultyCreateTest() {
  const { publishedTests } = useAcademic();
  const [activeTests, setActiveTests] = useState<Set<string>>(new Set());
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());
  const [selectedReportTest, setSelectedReportTest] = useState<string | null>(null);

  function startConducting(id: string) {
    setActiveTests((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setCompletedTests((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function endConducting(id: string) {
    setActiveTests((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setCompletedTests((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  // Mock student reports for conducted tests
  const mockStudentsReport = [
    { name: "Rahul Sharma", roll: "22BCS1004", score: "4/5", status: "Present", timeTaken: "12 mins" },
    { name: "Simran Kaur", roll: "22BCS1089", score: "5/5", status: "Present", timeTaken: "9 mins" },
    { name: "Amit Patel", roll: "22BCS1142", score: "3/5", status: "Present", timeTaken: "18 mins" },
    { name: "Priya Das", roll: "22BCS1067", score: "—", status: "Absent", timeTaken: "—" },
  ];

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        
        {/* Header */}
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-6 shadow-xl shadow-violet-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">Faculty test module</p>
              <h1 className="mt-1 text-2xl font-black text-slate-955">Create & Conduct Test</h1>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Select subject questions, set schedule, publish and conduct exams for students.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
              <HelpCircle className="h-6 w-6" />
            </div>
          </div>
        </section>

        {/* Test Creator Workspace */}
        <FacultyTestCreator />

        {/* ── Conduct & Manage Tests Section ── */}
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Test Conduct & Monitoring Center</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Manage published tests, trigger live exam sessions, and track results.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publishedTests.length > 0 ? (
              publishedTests.map((test) => {
                const isLive = activeTests.has(test.id);
                const isCompleted = completedTests.has(test.id);
                const isScheduled = !isLive && !isCompleted;

                return (
                  <div
                    key={test.id}
                    className={`rounded-[1.75rem] border p-5 flex flex-col justify-between transition-all bg-white relative overflow-hidden ${
                      isLive 
                        ? "border-emerald-300 shadow-lg shadow-emerald-50/50" 
                        : isCompleted
                        ? "border-slate-200 opacity-90"
                        : "border-slate-150 shadow-sm"
                    }`}
                  >
                    {isLive && (
                      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 border border-emerald-100 text-[9px] font-black text-emerald-600 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        LIVE EXAM
                      </div>
                    )}
                    {isCompleted && (
                      <div className="absolute right-4 top-4 rounded-full bg-slate-50 px-2.5 py-0.5 border border-slate-200 text-[9px] font-black text-slate-500">
                        COMPLETED
                      </div>
                    )}
                    {isScheduled && (
                      <div className="absolute right-4 top-4 rounded-full bg-blue-50 px-2.5 py-0.5 border border-blue-100 text-[9px] font-black text-blue-600">
                        SCHEDULED
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400">Published Test</span>
                        <h3 className="text-base font-black text-slate-800 mt-0.5 leading-snug line-clamp-1">{test.title}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-[10px] bg-slate-50/50 rounded-xl p-3 border border-slate-100 text-left">
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Date & Time</span>
                          <p className="font-semibold text-slate-655 mt-0.5">{test.testDate || "Not Set"} · {test.startTime || "00:00"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Duration</span>
                          <p className="font-semibold text-slate-655 mt-0.5">{test.durationMinutes} Mins</p>
                        </div>
                        <div className="col-span-2 border-t border-slate-100 pt-1.5">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Questions</span>
                          <p className="font-semibold text-slate-655 mt-0.5">{test.questions?.length ?? 0} MCQ Problems</p>
                        </div>
                      </div>
                    </div>

                    {/* Conduct Actions */}
                    <div className="mt-5 flex gap-2 border-t border-slate-50 pt-4">
                      {isScheduled && (
                        <button
                          type="button"
                          onClick={() => startConducting(test.id)}
                          className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-black text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5" /> Start Exam Live
                        </button>
                      )}

                      {isLive && (
                        <button
                          type="button"
                          onClick={() => endConducting(test.id)}
                          className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-xs font-black text-white hover:bg-slate-850 shadow-sm transition cursor-pointer"
                        >
                          <Square className="h-3.5 w-3.5" /> End Exam Session
                        </button>
                      )}

                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => setSelectedReportTest(selectedReportTest === test.id ? null : test.id)}
                          className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-black text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> 
                          {selectedReportTest === test.id ? "Hide Results" : "View Results"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
                <p className="text-xs font-black text-slate-400">No published tests available to conduct.</p>
                <p className="mt-1 text-[10px] font-bold text-slate-400">Select questions above and schedule a test to begin.</p>
              </div>
            )}
          </div>

          {/* Results table drawer if selected */}
          {selectedReportTest && (
            <div className="rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-indigo-50/10 via-white to-violet-50/20 p-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center justify-between border-b border-indigo-50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-800">
                    Exam Performance Report: {publishedTests.find(t => t.id === selectedReportTest)?.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReportTest(null)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                >
                  Close Report
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-150 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Roll Number</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Time Taken</th>
                      <th className="p-3 text-right">Score achieved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudentsReport.map((student, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                        <td className="p-3 font-bold text-slate-800">{student.name}</td>
                        <td className="p-3 font-semibold text-slate-500">{student.roll}</td>
                        <td className="p-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black border uppercase tracking-wider ${
                            student.status === "Present" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-500">{student.timeTaken}</td>
                        <td className="p-3 font-black text-slate-800 text-right">{student.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
