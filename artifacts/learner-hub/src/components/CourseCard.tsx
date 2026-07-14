import { motion } from "framer-motion";
import { Download, ExternalLink, FileText, PlayCircle, Video } from "lucide-react";
import { useLocation } from "wouter";

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

const accents = ["#6c5ce7", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function CourseCard({ course }: CourseCardProps) {
  const [, navigate] = useLocation();

  // Robust hashing to get a valid accent color index from course code/id string
  const hash = Array.from(course.id || "").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const accent = accents[hash % accents.length];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between gap-4 h-full"
    >
      <button
        type="button"
        onClick={() => navigate(`/courses/${course.id}`)}
        className="block w-full text-left focus:outline-none"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${accent}15` }}>
            <FileText className="h-5 w-5" style={{ color: accent }} />
          </div>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider" style={{ color: accent, background: `${accent}15` }}>
            Course
          </span>
        </div>

        <h3 className="line-clamp-1 text-base font-extrabold leading-snug text-slate-800 group-hover:text-violet-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="mt-2 line-clamp-1 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <span className="font-mono font-bold text-indigo-500">{course.code}</span>
          <span>·</span>
          <span>{course.teacher}</span>
          <span>·</span>
          <span className="text-emerald-600 font-bold">{course.progress}%</span>
        </p>

        <div className="mt-3.5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-950">
          <div className="relative aspect-[16/8]">
            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover opacity-60 transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-slate-950/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-violet-600 shadow-lg transform transition duration-300 group-hover:scale-110">
                <PlayCircle className="h-5 w-5 fill-violet-600 text-white" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-black text-slate-800">
              Preview lesson
            </div>
          </div>
        </div>
      </button>

      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(`/courses/${course.id}`)}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl text-xs font-black text-white shadow-sm hover:shadow-md transition"
          style={{ background: `linear-gradient(135deg, ${accent}, #6c5ce7)` }}
        >
          <Video className="h-4 w-4" />
          Open Course
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition bg-white shadow-sm"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition bg-white shadow-sm"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}
