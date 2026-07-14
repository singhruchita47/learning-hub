import { useState, useEffect } from "react";
import { BookMarked, Plus, Edit2, Layers, Loader, GraduationCap } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

export default function AdminCurriculum() {
  const branches = ["Computer Science", "Information Tech", "Electronics", "Mechanical"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const [activeBranch, setActiveBranch] = useState(branches[0]);
  const [activeSem, setActiveSem] = useState(4);
  const [facultyCourses, setFacultyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ACADEMIC_API_BASE}/courses`)
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        if (data?.courses) setFacultyCourses(data.courses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Static base subjects always shown
  const staticSubjects = [
    { code: "CS401", title: "Data Structures & Algorithms", credits: 4, type: "Core", teacher: "" },
    { code: "CS402", title: "Operating Systems",            credits: 4, type: "Core", teacher: "" },
    { code: "CS403", title: "Computer Networks",            credits: 3, type: "Core", teacher: "" },
    { code: "CS404", title: "Web Development",              credits: 3, type: "Elective", teacher: "" },
  ];

  // Map faculty courses to subject format
  const facultySubjects = facultyCourses.map(c => ({
    code: c.code,
    title: c.title,
    credits: 3,
    type: "Faculty",
    teacher: c.teacher || "",
  }));

  // Combine all — show static + faculty courses
  const allSubjects = [...staticSubjects, ...facultySubjects];
  const totalCredits = allSubjects.reduce((s, c) => s + (c.credits || 3), 0);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Curriculum Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Define syllabus, subjects, and credits for all branches.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition shadow-md shadow-violet-200">
          <Plus className="h-4.5 w-4.5" /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-500 uppercase mb-4">Select Branch</h3>
            <div className="space-y-2">
              {branches.map(b => (
                <button
                  key={b}
                  onClick={() => setActiveBranch(b)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeBranch === b
                      ? "bg-violet-50 text-violet-700 border border-violet-100"
                      : "text-slate-600 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  {b}
                  {activeBranch === b && <Layers className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-500 uppercase mb-4">Select Semester</h3>
            <div className="grid grid-cols-4 gap-2">
              {semesters.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSem(s)}
                  className={`h-10 rounded-xl text-sm font-black transition-all ${
                    activeSem === s
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Courses Summary */}
          {facultyCourses.length > 0 && (
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 shadow-sm">
              <h3 className="text-xs font-black text-violet-700 uppercase mb-3">
                🎓 Faculty Courses ({facultyCourses.length})
              </h3>
              <div className="space-y-2">
                {facultyCourses.map(c => (
                  <div key={c._id} className="rounded-xl bg-white border border-violet-100 px-3 py-2">
                    <p className="text-xs font-black text-violet-700">{c.code}</p>
                    <p className="text-[11px] font-semibold text-slate-600 truncate">{c.title}</p>
                    {c.teacher && <p className="text-[10px] text-slate-400">{c.teacher}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h2 className="text-lg font-black text-slate-900">{activeBranch}</h2>
              <p className="text-xs font-bold text-slate-500">Semester {activeSem} Curriculum</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold">
              <div className="text-slate-500">Total Credits: <span className="text-violet-600 font-black">{totalCredits}</span></div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-violet-500" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase">Subject Code</th>
                  <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase">Title</th>
                  <th className="text-center px-6 py-3 text-xs font-black text-slate-500 uppercase">Credits</th>
                  <th className="text-center px-6 py-3 text-xs font-black text-slate-500 uppercase">Type</th>
                  <th className="text-right px-6 py-3 text-xs font-black text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allSubjects.map((sub) => (
                  <tr key={sub.code} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-black text-violet-600">{sub.code}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          sub.type === "Faculty" ? "bg-amber-50 text-amber-600" : "bg-violet-50 text-violet-600"
                        }`}>
                          {sub.type === "Faculty"
                            ? <GraduationCap className="h-4 w-4" />
                            : <BookMarked className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{sub.title}</p>
                          {sub.teacher && <p className="text-[11px] font-semibold text-slate-400">{sub.teacher}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-slate-700">{sub.credits}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                        sub.type === "Core"    ? "bg-emerald-50 text-emerald-600" :
                        sub.type === "Faculty" ? "bg-amber-50 text-amber-600" :
                                                 "bg-blue-50 text-blue-600"
                      }`}>
                        {sub.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-violet-600 transition">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {facultyCourses.length === 0 && !loading && (
            <div className="px-6 py-4 text-center">
              <p className="text-xs font-semibold text-slate-400">No faculty courses yet. Faculty can create courses from their dashboard.</p>
            </div>
          )}

          <div className="p-6 mt-auto">
            <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-bold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition bg-slate-50/50 flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add Another Subject to Semester {activeSem}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
