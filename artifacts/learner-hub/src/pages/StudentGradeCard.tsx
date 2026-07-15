import { useState, useEffect, useRef } from "react";
import { Download, Printer, GraduationCap, Award, FileSpreadsheet, Loader } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { useAcademic } from "@/context/AcademicContext";

const API_BASE = ACADEMIC_API_BASE;

export default function StudentGradeCard() {
  const { publishedTests } = useAcademic();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = (() => {
    try {
      const saved = localStorage.getItem("learningHubUser");
      return saved ? JSON.parse(saved) : { name: "Student", email: "student@demo.com", role: "student" };
    } catch {
      return { name: "Student", email: "student@demo.com", role: "student" };
    }
  })();
  const studentId = user?.email ?? user?.id ?? "demo";

  useEffect(() => {
    async function fetchData() {
      try {
        const [subRes, quizRes] = await Promise.all([
          fetch(`${API_BASE}/assignment-submissions`),
          fetch(`${API_BASE}/quiz-attempts`)
        ]);
        if (subRes.ok) {
          const sData = await subRes.json();
          setSubmissions(sData.submissions?.filter((s: any) => s.studentId === studentId) || []);
        }
        if (quizRes.ok) {
          const qData = await quizRes.json();
          setQuizAttempts(qData.attempts?.filter((q: any) => q.userId === studentId) || []);
        }
      } catch {
        // error handling
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  // Calculations for Grade Card
  let totalScore = 0;
  let totalMaxScore = 0;

  const quizGrades = quizAttempts.map(q => {
    const test = publishedTests.find(t => t.id === q.quizId);
    const title = test?.title || `Quiz ${q.quizId}`;
    const course = (test as any)?.courseCode || "General";
    totalScore += q.score || 0;
    totalMaxScore += q.total || 0;
    return { title, course, score: q.score, total: q.total, type: "Quiz", isGraded: true };
  });

  const assignmentGrades = submissions.map(s => {
    const title = s.assignment?.title || "Assignment";
    const course = s.assignment?.courseCode || "General";
    const score = s.marks || 0;
    const max = 10; // assuming assignments are out of 10 for display
    if (s.marks) {
      totalScore += score;
      totalMaxScore += max;
    }
    return { title, course, score, total: max, type: "Assignment", isGraded: !!s.marks };
  });

  const allGrades = [...quizGrades, ...assignmentGrades].sort((a, b) => a.course.localeCompare(b.course));
  const percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
  
  let gradeLetter = "N/A";
  let gpa = "0.0";
  if (percentage >= 90) { gradeLetter = "A+"; gpa = "4.0"; }
  else if (percentage >= 80) { gradeLetter = "A"; gpa = "3.6"; }
  else if (percentage >= 70) { gradeLetter = "B+"; gpa = "3.2"; }
  else if (percentage >= 60) { gradeLetter = "B"; gpa = "2.8"; }
  else if (percentage >= 50) { gradeLetter = "C"; gpa = "2.0"; }
  else if (totalMaxScore > 0) { gradeLetter = "D"; gpa = "1.0"; }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef2fb]">
        <Loader className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-[1000px] space-y-6 print:space-y-0">
        
        {/* Controls - Hidden in print */}
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Grade Card</h1>
            <p className="text-sm font-bold text-slate-500">View and download your official academic transcript.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition shadow-lg shadow-violet-200"
          >
            <Printer className="h-4.5 w-4.5" /> Print / PDF
          </button>
        </div>

        {/* ── Official Grade Card Paper ── */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl print:border-none print:shadow-none print:p-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 print:pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">SGSU Learner Hub</h2>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Official Academic Transcript</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Date of Issue</p>
              <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-8 py-6 print:py-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Student Name</p>
              <p className="text-lg font-black text-slate-900">{user.name}</p>
              <p className="text-xs font-bold text-slate-500">{user.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Program & Enrollment</p>
              <p className="text-sm font-bold text-slate-800">B.Tech - Computer Science</p>
              <p className="text-xs font-bold text-slate-500">Current Semester: 4th</p>
            </div>
          </div>

          {/* GPA Summary */}
          <div className="mb-8 flex items-center justify-between rounded-2xl bg-slate-50 p-6 border border-slate-200 print:bg-white print:border-slate-800 print:rounded-none">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cumulative GPA</p>
                <p className="text-3xl font-black text-slate-900">{gpa}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Final Grade</p>
              <p className="text-3xl font-black text-violet-600">{gradeLetter} <span className="text-sm text-slate-400">({percentage}%)</span></p>
            </div>
          </div>

          {/* Detailed Grades */}
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-800">Detailed Assessment Scores</h3>
            {allGrades.length > 0 ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 print:border-slate-800">
                    <th className="py-3 px-2 font-black uppercase tracking-wider text-slate-500 text-[10px]">Course</th>
                    <th className="py-3 px-2 font-black uppercase tracking-wider text-slate-500 text-[10px]">Assessment Title</th>
                    <th className="py-3 px-2 font-black uppercase tracking-wider text-slate-500 text-[10px]">Type</th>
                    <th className="py-3 px-2 text-right font-black uppercase tracking-wider text-slate-500 text-[10px]">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                  {allGrades.map((g, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition print:hover:bg-transparent">
                      <td className="py-3 px-2 font-black text-slate-800">{g.course}</td>
                      <td className="py-3 px-2 font-bold text-slate-600">{g.title}</td>
                      <td className="py-3 px-2">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 print:bg-transparent print:p-0">
                          {g.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-black text-slate-900">
                        {g.type === "Assignment" && !g.isGraded ? (
                          <span className="text-amber-500 text-xs">Pending Review</span>
                        ) : (
                          `${g.score} / ${g.total}`
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-800">
                    <td colSpan={3} className="py-4 px-2 font-black text-slate-900 text-right uppercase tracking-wider">Total Evaluated Score</td>
                    <td className="py-4 px-2 text-right font-black text-slate-900">{totalScore} / {totalMaxScore}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center print:border-none print:bg-transparent">
                <FileSpreadsheet className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm font-black text-slate-500">No assessments completed yet.</p>
                <p className="mt-1 text-xs font-bold text-slate-400">Complete quizzes and assignments to generate your grade card.</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="mt-12 border-t border-slate-200 pt-6 text-center print:mt-16 print:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400">This document is electronically generated and serves as an official academic record.</p>
            <p className="text-[10px] font-bold text-slate-400">Learning Hub LMS System © {new Date().getFullYear()}</p>
          </div>

        </section>

      </div>
    </main>
  );
}
