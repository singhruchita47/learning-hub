import { useLocation } from "wouter";
import { Search, Filter, X } from "lucide-react";
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
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Courses</h1>
          <p className="text-muted-foreground mt-1">
            {query ? (
              <span>Showing <span className="font-semibold text-foreground">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} for "<span className="font-semibold text-primary">{query}</span>"</span>
            ) : (
              `Browse and manage your ${courses.length} enrolled courses.`
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, teacher, code…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg bg-white pl-8 pr-8 shadow-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-2.5 top-2.5">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button variant="outline" className="bg-white gap-2 shadow-sm rounded-lg shrink-0">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full flex justify-center"
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
