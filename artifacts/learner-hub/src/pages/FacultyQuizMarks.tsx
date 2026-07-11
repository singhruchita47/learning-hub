import { useEffect, useMemo, useState } from "react";
import { BarChart3, Medal, Search } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

type QuizAttempt = {
  _id: string;
  quizTitle: string;
  studentId: string;
  score: number;
  total: number;
  createdAt: string;
};

export default function FacultyQuizMarks() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "offline">("loading");

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/quiz-attempts`)
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json();
      })
      .then((data: { attempts: QuizAttempt[] }) => {
        if (!mounted) return;
        setAttempts(data.attempts);
        setStatus("ready");
      })
      .catch(() => mounted && setStatus("offline"));

    return () => {
      mounted = false;
    };
  }, []);

  const average = useMemo(() => {
    if (!attempts.length) return 0;
    const value = attempts.reduce((sum, item) => sum + item.score / Math.max(item.total, 1), 0) / attempts.length;
    return Math.round(value * 100);
  }, [attempts]);

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">Assessment analytics</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-950">Quiz Marks</h1>
              <p className="mt-2 text-sm font-bold text-slate-600">Track student quiz attempts, score percentage, and submitted test history.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/85 px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-black text-violet-700">{attempts.length}</p>
                <p className="text-xs font-bold text-slate-500">Attempts</p>
              </div>
              <div className="rounded-2xl bg-white/85 px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-black text-indigo-700">{average || "--"}%</p>
                <p className="text-xs font-bold text-slate-500">Average</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-slate-950">Submitted Tests</h2>
            <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500">
              <Search className="h-4 w-4" />
              Search marks
            </div>
          </div>

          {status === "offline" && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
              Backend offline hai. Quiz submissions MongoDB se tab aayenge jab API server running hoga.
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {attempts.length > 0 ? attempts.map((item) => {
              const percent = Math.round((item.score / Math.max(item.total, 1)) * 100);
              return (
                <article key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{item.quizTitle}</h3>
                      <p className="mt-1 text-sm font-bold text-slate-500">{item.studentId}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <Medal className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-violet-700">{item.score}/{item.total}</p>
                      <p className="text-xs font-bold text-slate-500">{new Date(item.createdAt).toLocaleString("en-IN")}</p>
                    </div>
                    <p className="text-xl font-black text-slate-900">{percent}%</p>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${percent}%` }} />
                  </div>
                </article>
              );
            }) : (
              <div className="col-span-full rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-10 text-center">
                <BarChart3 className="mx-auto mb-3 h-8 w-8 text-violet-500" />
                <p className="text-sm font-black text-violet-800">No quiz marks yet</p>
                <p className="mt-1 text-xs font-bold text-violet-500">Student test scores will appear after submissions.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
