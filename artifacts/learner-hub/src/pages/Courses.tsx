import { useLocation } from "wouter";
import { Search, Filter, X, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";
import { useSearch } from "@/context/SearchContext";

export default function Courses() {
  const { query, setQuery } = useSearch();
  const [, navigate] = useLocation();

  const filtered = courses.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.teacher.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-[1700px] animate-in fade-in duration-500 p-4 md:p-5 lg:p-6">
      <div className="mb-6 overflow-hidden rounded-[1.75rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-6 text-slate-950 shadow-xl shadow-[#7b35ad]/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff7a21]">SGSU course library</p>
            <h1 className="mt-2 text-4xl font-black">My Courses</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
              Continue your active subjects with structured lessons, video playlists, progress, and practice checkpoints.
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/85 text-[#7b35ad] shadow-sm">
            <GraduationCap className="h-9 w-9" />
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Course catalogue</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {query ? (
              <span>Showing <span className="font-semibold text-foreground">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} for "<span className="font-semibold text-primary">{query}</span>"</span>
            ) : (
              `Browse and manage your ${courses.length} enrolled courses.`
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, teacher, code…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-2xl bg-white pl-10 pr-8 shadow-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-2.5 top-2.5">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button variant="outline" className="shrink-0 gap-2 rounded-2xl bg-white shadow-sm">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full"
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground text-sm mb-4">No courses match "<span className="font-semibold">{query}</span>"</p>
            <Button variant="outline" onClick={() => setQuery("")} className="rounded-full">Clear search</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
