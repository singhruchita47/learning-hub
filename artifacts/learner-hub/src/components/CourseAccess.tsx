import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";
import CourseCard from "./CourseCard";
import { courses } from "@/data/courses";

export default function CourseAccess() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col h-full"
    >
      <div className="mb-4 flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          My Course Access
        </h2>
        <Link href="/courses" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-1 overflow-x-auto pb-4 gap-4 px-2 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {courses.slice(0, 5).map(course => (
          <div key={course.id} className="snap-start h-full">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
