import { motion } from "framer-motion";
import { Link } from "wouter";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    teacher: string;
    code: string;
    progress: number;
    color: string;
    icon?: string;
  };
}

const courseIcons: Record<string, JSX.Element> = {
  "DS": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <circle cx="20" cy="30" r="10" fill="white" opacity="0.25"/>
      <circle cx="40" cy="18" r="10" fill="white" opacity="0.3"/>
      <circle cx="60" cy="30" r="10" fill="white" opacity="0.25"/>
      <circle cx="40" cy="42" r="10" fill="white" opacity="0.2"/>
      <line x1="20" y1="30" x2="40" y2="18" stroke="white" strokeWidth="2.5" opacity="0.6"/>
      <line x1="40" y1="18" x2="60" y2="30" stroke="white" strokeWidth="2.5" opacity="0.6"/>
      <line x1="60" y1="30" x2="40" y2="42" stroke="white" strokeWidth="2.5" opacity="0.6"/>
      <line x1="40" y1="42" x2="20" y2="30" stroke="white" strokeWidth="2.5" opacity="0.6"/>
    </svg>
  ),
  "DB": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <ellipse cx="40" cy="16" rx="28" ry="10" fill="white" opacity="0.3"/>
      <rect x="12" y="16" width="56" height="10" fill="white" opacity="0.15"/>
      <ellipse cx="40" cy="26" rx="28" ry="10" fill="white" opacity="0.2"/>
      <rect x="12" y="26" width="56" height="10" fill="white" opacity="0.15"/>
      <ellipse cx="40" cy="36" rx="28" ry="10" fill="white" opacity="0.25"/>
      <ellipse cx="40" cy="36" rx="28" ry="10" fill="white" opacity="0.1"/>
    </svg>
  ),
  "OS": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="10" y="10" width="60" height="40" rx="6" fill="white" opacity="0.2"/>
      <rect x="16" y="16" width="48" height="28" rx="3" fill="white" opacity="0.2"/>
      <rect x="20" y="20" width="14" height="4" rx="2" fill="white" opacity="0.6"/>
      <rect x="20" y="28" width="20" height="4" rx="2" fill="white" opacity="0.4"/>
      <rect x="20" y="36" width="10" height="4" rx="2" fill="white" opacity="0.5"/>
      <circle cx="55" cy="28" r="8" fill="white" opacity="0.25"/>
      <circle cx="55" cy="28" r="4" fill="white" opacity="0.4"/>
    </svg>
  ),
  "CN": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <circle cx="40" cy="30" r="20" stroke="white" strokeWidth="2" opacity="0.4" fill="none"/>
      <path d="M20 30 Q40 10 60 30 Q40 50 20 30Z" stroke="white" strokeWidth="2" opacity="0.3" fill="none"/>
      <line x1="40" y1="10" x2="40" y2="50" stroke="white" strokeWidth="2" opacity="0.3"/>
      <line x1="20" y1="30" x2="60" y2="30" stroke="white" strokeWidth="2" opacity="0.3"/>
    </svg>
  ),
  "AI": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <circle cx="40" cy="30" r="12" fill="white" opacity="0.3"/>
      <circle cx="40" cy="30" r="6" fill="white" opacity="0.5"/>
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <line key={i} x1="40" y1="30"
          x2={40 + 22 * Math.cos(angle * Math.PI / 180)}
          y2={30 + 22 * Math.sin(angle * Math.PI / 180)}
          stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      ))}
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <circle key={i}
          cx={40 + 22 * Math.cos(angle * Math.PI / 180)}
          cy={30 + 22 * Math.sin(angle * Math.PI / 180)}
          r="3" fill="white" opacity="0.6"/>
      ))}
    </svg>
  ),
  "ML": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <polyline points="10,50 22,35 34,42 46,22 58,28 70,10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" fill="none"/>
      <circle cx="10" cy="50" r="4" fill="white" opacity="0.7"/>
      <circle cx="22" cy="35" r="4" fill="white" opacity="0.7"/>
      <circle cx="34" cy="42" r="4" fill="white" opacity="0.7"/>
      <circle cx="46" cy="22" r="4" fill="white" opacity="0.7"/>
      <circle cx="58" cy="28" r="4" fill="white" opacity="0.7"/>
      <circle cx="70" cy="10" r="4" fill="white" opacity="0.7"/>
    </svg>
  ),
  "PY": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <text x="12" y="44" fontSize="38" fontWeight="bold" fill="white" opacity="0.35" fontFamily="monospace">Py</text>
      <rect x="52" y="12" width="20" height="4" rx="2" fill="white" opacity="0.5"/>
      <rect x="52" y="20" width="14" height="4" rx="2" fill="white" opacity="0.4"/>
      <rect x="52" y="28" width="18" height="4" rx="2" fill="white" opacity="0.3"/>
    </svg>
  ),
  "JAVA": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <text x="10" y="46" fontSize="36" fontWeight="bold" fill="white" opacity="0.3" fontFamily="serif">J</text>
      <rect x="36" y="12" width="34" height="4" rx="2" fill="white" opacity="0.5"/>
      <rect x="36" y="22" width="24" height="4" rx="2" fill="white" opacity="0.4"/>
      <rect x="36" y="32" width="30" height="4" rx="2" fill="white" opacity="0.3"/>
      <rect x="36" y="42" width="18" height="4" rx="2" fill="white" opacity="0.4"/>
    </svg>
  ),
  "CC": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <path d="M15 30 Q15 12 40 12 Q65 12 65 30 Q65 48 40 48 Q15 48 15 30Z" stroke="white" strokeWidth="2" opacity="0.4" fill="white" fillOpacity="0.1"/>
      <circle cx="40" cy="24" r="6" fill="white" opacity="0.5"/>
      <rect x="28" y="33" width="24" height="3" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="32" y="40" width="16" height="3" rx="1.5" fill="white" opacity="0.4"/>
    </svg>
  ),
  "CS": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="12" y="14" width="56" height="36" rx="6" fill="white" opacity="0.15" stroke="white" strokeWidth="1.5" strokeOpacity="0.4"/>
      <path d="M24 28 L30 34 L24 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <line x1="34" y1="40" x2="48" y2="40" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  "SE": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="10" y="18" width="60" height="30" rx="4" fill="white" opacity="0.15" stroke="white" strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="18" y="10" width="14" height="10" rx="3" fill="white" opacity="0.4"/>
      <rect x="34" y="10" width="14" height="10" rx="3" fill="white" opacity="0.4"/>
      <rect x="50" y="10" width="14" height="10" rx="3" fill="white" opacity="0.4"/>
      <line x1="25" y1="20" x2="25" y2="28" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="41" y1="20" x2="41" y2="28" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="57" y1="20" x2="57" y2="28" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="25" y1="28" x2="57" y2="28" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="41" y1="28" x2="41" y2="38" stroke="white" strokeWidth="2" opacity="0.5"/>
    </svg>
  ),
};

function CourseIllustration({ code }: { code: string }) {
  return courseIcons[code] || courseIcons["DS"];
}

export default function CourseCard({ course }: CourseCardProps) {
  const progressColor = course.color.includes('blue') ? '#4F46E5'
    : course.color.includes('green') ? '#10B981'
    : course.color.includes('purple') ? '#7C3AED'
    : course.color.includes('orange') ? '#F59E0B'
    : course.color.includes('red') ? '#EF4444'
    : course.color.includes('cyan') ? '#06B6D4'
    : course.color.includes('pink') ? '#EC4899'
    : '#4F46E5';

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(79,70,229,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100"
    >
      {/* Course illustration header */}
      <div className={`relative h-[110px] w-full ${course.color} overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 opacity-60" style={{background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)"}} />
        <div className="w-4/5 h-4/5 relative z-10">
          <CourseIllustration code={course.code} />
        </div>
        {/* Course code pill */}
        <div className="absolute top-3 left-3 rounded-full bg-black/20 backdrop-blur-sm px-2.5 py-1">
          <span className="text-[10px] font-bold text-white tracking-wider">{course.code}</span>
        </div>
        {/* Progress ring hint */}
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <span className="text-[10px] font-extrabold text-white">{course.progress}%</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 gap-3">
        <div>
          <h3 className="text-sm font-extrabold leading-tight text-foreground line-clamp-1">{course.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{course.teacher}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Progress</span>
            <span style={{ color: progressColor }}>{course.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${course.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: progressColor }}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${progressColor}dd, ${progressColor})` }}
          onClick={() => {}}
        >
          <PlayCircle className="h-4 w-4" />
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}
