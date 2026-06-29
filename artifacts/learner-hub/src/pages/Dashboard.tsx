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
  "AI & ML", "Programming", "Cloud & DevOps", "Mathematics", "Networking", "Software Engineering",
];

function SectionLabel({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`h-5 w-1 rounded-full ${light ? "bg-white/60" : "bg-primary"}`} />
      <h2 className={`text-base font-extrabold tracking-tight ${light ? "text-white/90" : "text-foreground"}`}>
        {children}
      </h2>
      <div className={`flex-1 h-px ${light ? "bg-white/20" : "bg-border"}`} />
    </div>
  );
}

interface BandProps {
  children: React.ReactNode;
  bg: string;
  className?: string;
}
function Band({ children, bg, className = "" }: BandProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`w-full py-10 px-4 md:px-8 lg:px-12 ${className}`}
      style={{ background: bg }}
    >
      <div className="max-w-[1520px] mx-auto">
        {children}
      </div>
    </motion.section>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col pb-16">

      {/* ── 1. Hero — dark navy ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full pt-6 pb-0 px-4 md:px-8 lg:px-12"
        style={{ background: "#f0f5ff" }}
      >
        <div className="max-w-[1520px] mx-auto">
          <HeroSection />
        </div>
      </motion.section>

      {/* ── 2. Stats — clean white ── */}
      <Band bg="#ffffff">
        <SectionLabel>Your Progress At a Glance</SectionLabel>
        <StatCards />
      </Band>

      {/* ── 3. Courses — soft blue-grey ── */}
      <Band bg="#f0f5ff">
        <SectionLabel>My Courses</SectionLabel>
        <CourseAccess />
      </Band>

      {/* ── 4. Schedule & Rankings — light slate ── */}
      <Band bg="#f8fafc">
        <SectionLabel>Schedule & Rankings</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarWidget />
          <LeaderboardWidget />
        </div>
      </Band>

      {/* ── 5. Resources & Practice — soft violet ── */}
      <Band bg="#faf5ff">
        <SectionLabel>Resources & Practice</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyResources />
          <QuickQuiz />
        </div>
      </Band>

      {/* ── 6. Announcements — warm cream ── */}
      <Band bg="#fffbeb">
        <SectionLabel>Announcements</SectionLabel>
        <Announcements />
      </Band>

      {/* ── 7. Activity — soft teal-green ── */}
      <Band bg="#f0fdf4">
        <SectionLabel>Learning Activity</SectionLabel>
        <ActivityCharts />
      </Band>

      {/* ── 8. Deadlines — soft rose ── */}
      <Band bg="#fff1f2">
        <SectionLabel>Upcoming Deadlines</SectionLabel>
        <DeadlinesTimeline />
      </Band>

      {/* ── 9. Categories — deep navy footer feel ── */}
      <Band bg="#0f172a" className="!py-12">
        <SectionLabel light>Browse by Category</SectionLabel>
        <div
          className="flex gap-3 overflow-x-auto pb-2 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05, backgroundColor: "#1e3a8a" }}
              className="snap-start shrink-0 rounded-full border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white cursor-pointer transition-all"
            >
              {cat}
            </motion.div>
          ))}
        </div>
      </Band>

    </div>
  );
}
