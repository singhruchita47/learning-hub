import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, X, GraduationCap, Loader, BookOpen, Users, TrendingUp, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { useSearch } from "@/context/SearchContext";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

export default function Courses() {
  const { query, setQuery } = useSearch();
  const [, navigate] = useLocation();
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json() as { courses: any[] };
        setCoursesList(data.courses || []);
      } catch {
        setCoursesList([]);
      } finally {
        setLoading(false);
      }
    }
    void loadCourses();
  }, []);

  const filtered = coursesList.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.teacher.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#eef2fb]">
      <div className="mx-auto max-w-[1540px] px-4 py-6 md:px-8 space-y-5">

        {/* ── Page Header ── */}
        <section className="relative overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-sm ring-1 ring-slate-100">
          {/* subtle gradient blob */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-violet-50 to-transparent" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-violet-100/60 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">Student Module</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">My <span className="text-violet-600">Courses</span></h1>
              <p className="mt-1.5 max-w-lg text-xs font-semibold text-slate-400">Active subjects with structured lessons, progress tracking and practice checkpoints.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[
                  { val: coursesList.length || "0", label: "Total Courses", color: "bg-violet-100 text-violet-700 ring-violet-200" },
                  { val: "72%", label: "Avg Progress", color: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
                  { val: "240+", label: "Batchmates", color: "bg-blue-100 text-blue-700 ring-blue-200" },
                  { val: "3", label: "Certificates", color: "bg-amber-100 text-amber-700 ring-amber-200" },
                ].map(({ val, label, color }) => (
                  <span key={label} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black ring-1 ${color}`}>
                    <span className="text-sm font-black">{val}</span> {label}
                  </span>
                ))}
                <div className="relative ml-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input type="search" placeholder="Search courses…" value={query} onChange={(e) => setQuery(e.target.value)}
                    className="h-8 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-7 text-xs font-bold text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                  {query && <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X className="h-3 w-3 text-slate-400" /></button>}
                </div>
              </div>
            </div>
            {/* Cute illustration */}
            <div className="relative ml-6 hidden shrink-0 lg:block">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 shadow-inner">
                <span className="text-5xl select-none">🎓</span>
              </div>
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm shadow-md">✨</div>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              {query ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${query}"` : `Course Catalogue · ${coursesList.length} courses`}
            </h2>
          </div>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-[#6c5ce7]" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filtered.map((course, i) => {
                    const mappedCourse = {
                      id: course.code,
                      title: course.title,
                      teacher: course.teacher,
                      code: course.code,
                      color: course.color,
                      students: course.students,
                      progress: course.progress,
                      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
                    };
                    return (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full cursor-pointer"
                        onClick={() => navigate(`/courses/${course.code}`)}
                      >
                        <CourseCard course={mappedCourse} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-[2rem] bg-white py-20 text-center shadow-md"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#6c5ce7]/10">
                    <GraduationCap className="h-10 w-10 text-[#6c5ce7]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">No courses available</h3>
                  <p className="mt-2 text-sm font-bold text-slate-400">Create courses in the faculty panel to display here.</p>
                  {query && (
                    <button onClick={() => setQuery("")} className="mt-4 rounded-xl bg-[#6c5ce7] px-4 py-2 text-xs font-black text-white">Clear search</button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
