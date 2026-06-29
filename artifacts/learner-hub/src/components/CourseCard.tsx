import { motion } from "framer-motion";
import { PlayCircle, Clock } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    teacher: string;
    code: string;
    progress: number;
    color: string;
    image?: string;
  };
}

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

export default function CourseCard({ course }: CourseCardProps) {
  const pc = progressColor(course.color);
  const isComplete = course.progress === 100;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: `0 20px 48px ${pc}22` }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative flex w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100"
    >
      {/* Course image */}
      <div className="relative h-[120px] w-full overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className={`h-full w-full ${course.color}`} />
        )}
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Course code pill */}
        <div className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1">
          <span className="text-[10px] font-bold text-white tracking-wider">{course.code}</span>
        </div>

        {/* Completion badge */}
        {isComplete && (
          <div className="absolute top-3 right-3 rounded-full bg-emerald-500 px-2 py-0.5 flex items-center gap-1">
            <span className="text-[10px] font-bold text-white">✓ Done</span>
          </div>
        )}

        {/* Progress indicator on image */}
        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke={pc}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - course.progress / 100)}`}
            />
          </svg>
          <span className="absolute text-[9px] font-extrabold" style={{ color: pc }}>{course.progress}%</span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4 gap-3">
        <div>
          <h3 className="text-sm font-extrabold leading-tight text-foreground line-clamp-1 mb-0.5">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium line-clamp-1">{course.teacher}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-muted-foreground">Progress</span>
            <span style={{ color: pc }}>{course.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${course.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: pc }}
            />
          </div>
        </div>

        {/* Footer */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${pc}dd, ${pc})`, boxShadow: `0 4px 14px ${pc}33` }}
        >
          <PlayCircle className="h-4 w-4" />
          {isComplete ? "Review" : "Continue"}
        </motion.button>
      </div>
    </motion.div>
  );
}
