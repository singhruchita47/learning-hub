import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, X, GraduationCap, Loader, CheckCircle2, BookOpen, Users, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/context/SearchContext";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

function getStudent() {
  try {
    const s = localStorage.getItem("learningHubUser");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function Courses() {
  const { query, setQuery } = useSearch();
  const [, navigate] = useLocation();
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const student = getStudent();

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

  // Load already-enrolled courses from API or localStorage
  useEffect(() => {
    if (!student) return;
    const studentId = student.id || student.email;

    // Load from localStorage for instant display
    const saved = localStorage.getItem(`enrolledCourses_${studentId}`);
    if (saved) {
      try { setEnrolledIds(new Set(JSON.parse(saved))); } catch {}
    }

    // Sync from API
    fetch(`${API_BASE}/courses/enrolled/${encodeURIComponent(studentId)}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        if (!data) return;
        const ids = new Set<string>((data.enrollments || []).map((e: any) => e.courseId));
        setEnrolledIds(ids);
        localStorage.setItem(`enrolledCourses_${studentId}`, JSON.stringify([...ids]));
      })
      .catch(() => {});
  }, [student?.id]);

  const handleEnroll = async (course: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!student) { alert("Please log in to enroll."); return; }
    const courseId = course._id;
    if (enrolledIds.has(courseId)) return;

    setEnrolling(courseId);
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id || student.email, studentName: student.name }),
      });
      if (res.ok || res.status === 409) {
        const updated = new Set(enrolledIds).add(courseId);
        setEnrolledIds(updated);
        localStorage.setItem(`enrolledCourses_${student.id || student.email}`, JSON.stringify([...updated]));
        // Refresh course list to get updated student count
        const r2 = await fetch(`${API_BASE}/courses`);
        const d2 = await r2.json() as { courses: any[] };
        setCoursesList(d2.courses || []);
      } else {
        alert("Enrollment failed. Please try again.");
      }
    } catch {
      alert("Could not connect to server.");
    } finally {
      setEnrolling(null);
    }
  };

  const filtered = coursesList.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (c.title || "").toLowerCase().includes(q) ||
      (c.teacher || "").toLowerCase().includes(q) ||
      (c.code || "").toLowerCase().includes(q)
    );
  });

  const enrolledCourses = filtered.filter(c => enrolledIds.has(c._id));
  const availableCourses = filtered.filter(c => !enrolledIds.has(c._id));

  const colorFor = (course: any) => course.color || "#6c5ce7";

  const CourseCardCustom = ({ course, enrolled }: { course: any; enrolled: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${enrolled ? "border-violet-200 ring-1 ring-violet-200" : "border-slate-100"}`}
      onClick={() => navigate(`/courses/${course.code}`)}
    >
      {/* Color strip */}
      <div className="h-2 w-full" style={{ background: colorFor(course) }} />

      <div className="p-5">
        {/* Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white" style={{ background: colorFor(course) }}>
            {course.code}
          </span>
          {enrolled ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Enrolled
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500">
              <Users className="h-3 w-3" /> {course.students || 0} students
            </span>
          )}
        </div>

        <h3 className="mb-1 text-sm font-black text-slate-900 leading-snug group-hover:text-violet-700 transition-colors">{course.title}</h3>
        <p className="text-[11px] font-semibold text-slate-400">{course.teacher || "Faculty"}</p>

        {/* Enroll / Enrolled button */}
        <button
          onClick={(e) => handleEnroll(course, e)}
          disabled={enrolled || enrolling === course._id}
          className={`mt-4 w-full rounded-xl py-2.5 text-xs font-black transition-all ${
            enrolled
              ? "bg-emerald-50 text-emerald-700 cursor-default"
              : enrolling === course._id
              ? "bg-violet-100 text-violet-500 cursor-wait"
              : "bg-[#6c5ce7] text-white hover:bg-[#5b4bd5] shadow-md shadow-violet-200 hover:shadow-violet-300"
          }`}
        >
          {enrolled ? "✓ Already Enrolled" : enrolling === course._id ? "Enrolling..." : "Enroll Now"}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Courses</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Browse all available courses and enroll to start learning.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: "Total Courses",   value: coursesList.length || "0", txt: "text-[#6c5ce7]", icon: BookOpen },
            { label: "Enrolled By You", value: enrolledIds.size,          txt: "text-emerald-600", icon: UserCheck },
            { label: "Available",       value: Math.max(0, coursesList.length - enrolledIds.size), txt: "text-blue-600", icon: Users },
          ].map(({ label, value, txt, icon: Icon }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex items-center gap-4 min-h-[90px]">
              <Icon className={`h-8 w-8 ${txt} shrink-0`} />
              <div>
                <span className="text-3xl font-black text-slate-900">{value}</span>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-[#6c5ce7]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-[2rem] bg-white py-20 text-center shadow-sm border border-slate-100/50">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#6c5ce7]/10">
                  <GraduationCap className="h-10 w-10 text-[#6c5ce7]" />
                </div>
                <h3 className="text-xl font-black text-slate-900">No courses available</h3>
                <p className="mt-2 text-sm font-bold text-slate-400">Faculty needs to create courses first.</p>
                {query && <button onClick={() => setQuery("")} className="mt-4 rounded-xl bg-[#6c5ce7] px-4 py-2 text-xs font-black text-white">Clear search</button>}
              </motion.div>
            ) : (
              <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

                {/* Enrolled courses section */}
                {enrolledCourses.length > 0 && (
                  <div>
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> My Enrolled Courses ({enrolledCourses.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {enrolledCourses.map(c => <CourseCardCustom key={c._id} course={c} enrolled={true} />)}
                    </div>
                  </div>
                )}

                {/* Available courses section */}
                {availableCourses.length > 0 && (
                  <div>
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-400">
                      <BookOpen className="h-4 w-4" /> Available to Enroll ({availableCourses.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {availableCourses.map(c => <CourseCardCustom key={c._id} course={c} enrolled={false} />)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
