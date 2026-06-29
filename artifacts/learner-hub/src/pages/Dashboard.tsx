import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import StatCards from "@/components/StatCards";
import CalendarWidget from "@/components/CalendarWidget";
import CourseAccess from "@/components/CourseAccess";
import LeaderboardWidget from "@/components/LeaderboardWidget";
import StudyResources from "@/components/StudyResources";
import QuickQuiz from "@/components/QuickQuiz";
import Announcements from "@/components/Announcements";
import ActivityCharts from "@/components/ActivityCharts";
import DeadlinesTimeline from "@/components/DeadlinesTimeline";

const categories = [
  "Computer Science", "Information Technology", "Data Science", "Cyber Security", 
  "AI & ML", "Programming", "Cloud & DevOps", "Mathematics", "Networking", "Software Engineering"
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Row */}
      <StatCards />

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[380px]">
        <div className="col-span-1 lg:col-span-3 h-full">
          <CalendarWidget />
        </div>
        <div className="col-span-1 lg:col-span-6 h-full overflow-hidden">
          <CourseAccess />
        </div>
        <div className="col-span-1 lg:col-span-3 h-full">
          <LeaderboardWidget />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyResources />
        <QuickQuiz />
      </div>

      {/* Fourth Row */}
      <Announcements />

      {/* Fifth Row */}
      <ActivityCharts />

      {/* Sixth Row */}
      <DeadlinesTimeline />

      {/* Footer Categories */}
      <div className="mt-8 pb-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Course Categories</h3>
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x px-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((category, i) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="snap-start shrink-0 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:shadow-sm cursor-pointer transition-all"
            >
              {category}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
