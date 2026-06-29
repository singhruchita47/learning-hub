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
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-primary/5 border border-primary/5"
    >
      <div className={`h-24 w-full ${course.color} bg-gradient-to-br from-white/10 to-black/10 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="text-4xl font-bold text-white/20 tracking-tighter mix-blend-overlay">{course.code}</span>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground">{course.code}</span>
        </div>
        
        <h3 className="mb-1 text-lg font-bold leading-tight text-foreground line-clamp-1">{course.title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{course.teacher}</p>
        
        <div className="mt-auto space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{course.progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${course.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${course.color.replace('bg-', 'bg-')}`} 
                style={{ backgroundColor: `var(--${course.color.split('-')[1]})` }} // Fallback approximation
              />
            </div>
          </div>
          
          <Button className="w-full gap-2 rounded-xl group-hover:shadow-md transition-all" asChild>
            <Link href={`/courses/${course.id}`}>
              <PlayCircle className="h-4 w-4" />
              Continue
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
