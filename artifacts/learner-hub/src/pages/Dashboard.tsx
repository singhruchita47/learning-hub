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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-5 w-1 rounded-full bg-primary" />
      <h2 className="text-base font-extrabold text-foreground tracking-tight">{children}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const categories = [
  "Computer Science", "Information Technology", "Data Science", "Cyber Security",
  "AI & ML", "Programming", "Cloud & DevOps", "Mathematics", "Networking", "Software Engineering"
];

export default function Dashboard() {
  return (
    <div className="flex flex-col px-4 md:px-8 lg:px-10 pt-6 pb-16 max-w-[1600px] mx-auto space-y-12">

      {/* ── Section 1: Hero ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroSection />
      </motion.section>

      {/* ── Section 2: Stats ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>Your Progress At a Glance</SectionLabel>
        <StatCards />
      </motion.section>

      {/* ── Section 3: Courses ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>My Courses</SectionLabel>
        <CourseAccess />
      </motion.section>

      {/* ── Section 4: Calendar + Leaderboard ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>Schedule & Rankings</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarWidget />
          <LeaderboardWidget />
        </div>
      </motion.section>

      {/* ── Section 5: Study Resources + Quick Quiz ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>Resources & Practice</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyResources />
          <QuickQuiz />
        </div>
      </motion.section>

      {/* ── Section 6: Announcements ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>Announcements</SectionLabel>
        <Announcements />
      </motion.section>

      {/* ── Section 7: Activity Charts ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>Learning Activity</SectionLabel>
        <ActivityCharts />
      </motion.section>

      {/* ── Section 8: Deadlines ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>Upcoming Deadlines</SectionLabel>
        <DeadlinesTimeline />
      </motion.section>

      {/* ── Section 9: Course Categories ── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SectionLabel>Browse by Category</SectionLabel>
        <div
          className="flex gap-3 overflow-x-auto pb-2 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.04 }}
              className="snap-start shrink-0 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:shadow-md cursor-pointer transition-all"
            >
              {category}
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
