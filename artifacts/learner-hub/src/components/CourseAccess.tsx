import { motion } from "framer-motion";
import { ArrowRight, BookOpen, PlayCircle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import CourseCard from "./CourseCard";
import { courses } from "@/data/courses";

const progressColor = (color: string) => {
  if (color.includes('indigo')) return '#4F46E5';
  if (color.includes('emerald') || color.includes('green')) return '#10B981';
  if (color.includes('violet') || color.includes('purple')) return '#7C3AED';
  if (color.includes('amber') || color.includes('yellow')) return '#F59E0B';
  if (color.includes('red') || color.includes('rose')) return '#EF4444';
  if (color.includes('blue')) return '#3B82F6';
  if (color.includes('orange')) return '#F97316';
  if (color.includes('cyan')) return '#06B6D4';
  return '#4F46E5';
};

export default function CourseAccess() {
  const remaining = courses.slice(5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white shadow-lg border border-primary/5 p-5 gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          My Course Access
        </h2>
        <Link href="/courses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Horizontal scroll carousel — first 5 courses */}
      <div
        className="flex overflow-x-auto gap-4 snap-x pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.slice(0, 5).map((course) => (
          <div key={course.id} className="snap-start shrink-0">
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Compact list — remaining courses fill the dead space */}
      <div>
        <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">
          More Courses
        </p>
        <div className="grid grid-cols-2 gap-2">
          {remaining.map((course, i) => {
            const pc = progressColor(course.color);
            const done = course.progress === 100;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ backgroundColor: "#F8FAFC" }}
                className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-3 py-2 transition-colors cursor-pointer group"
              >
                {/* Color dot */}
                <div
                  className="h-8 w-8 shrink-0 rounded-lg overflow-hidden"
                  style={{ background: `${pc}20`, border: `1.5px solid ${pc}30` }}
                >
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full" style={{ background: pc }} />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </p>
                  {/* Mini progress bar */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${course.progress}%`, backgroundColor: pc }}
                      />
                    </div>
                    <span className="text-[9px] font-bold shrink-0" style={{ color: pc }}>
                      {course.progress}%
                    </span>
                  </div>
                </div>

                {/* Action icon */}
                {done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
