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

const accents = ["#6D5DF6", "#0EA5E9", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

export default function CourseCard({ course }: CourseCardProps) {
  const [, navigate] = useLocation();
  const accent = accents[Number(course.id) % accents.length];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group rounded-[1.15rem] border border-slate-200 bg-white p-3 shadow-md shadow-slate-200/70"
    >
      <button type="button" onClick={() => navigate(`/courses/${course.id}`)} className="block w-full text-left">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${accent}16` }}>
            <FileText className="h-5 w-5" style={{ color: accent }} />
          </div>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-black" style={{ color: accent, background: `${accent}16` }}>
            Video
          </span>
        </div>

        <h3 className="line-clamp-1 text-base font-black leading-tight text-slate-950">{course.title}</h3>
        <p className="mt-1.5 line-clamp-1 text-[11px] font-bold text-slate-500">
          <span className="font-black text-[#4038ff]">{course.code}</span>
          <span className="mx-2">.</span>
          {course.teacher}
          <span className="mx-2">.</span>
          {course.progress}% complete
        </p>

        <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-100 bg-slate-950">
          <div className="relative aspect-[16/7]">
            {course.image && <img src={course.image} alt={course.title} className="h-full w-full object-cover opacity-55" loading="lazy" />}
            <div className="absolute inset-0 bg-gradient-to-br from-[#34428c]/70 to-slate-950/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#7b35ad] shadow-xl">
                <PlayCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-1.5 left-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-black text-slate-800">
              Preview lesson
            </div>
          </div>
        </div>
      </button>

      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(`/courses/${course.id}`)}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-black text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${accent}, #7b35ad)` }}
        >
          <Video className="h-4 w-4" />
          Open Course
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-[#7b35ad]/30 hover:text-[#7b35ad]">
          <Download className="h-3.5 w-3.5" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-[#7b35ad]/30 hover:text-[#7b35ad]">
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  );
}
