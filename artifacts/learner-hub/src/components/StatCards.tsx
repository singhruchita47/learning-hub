import { motion } from "framer-motion";
import { BookOpen, Calendar, Target, GraduationCap } from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Overall Progress",
    value: 72,
    display: "72%",
    subtitle: "Keep up the great work!",
    icon: Target,
    gradient: "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)",
    iconBg: "rgba(79,70,229,0.12)",
    iconColor: "#4F46E5",
    accent: "#4F46E5",
    accentLight: "#EEF2FF",
    type: "progress",
  },
  {
    id: 2,
    title: "Ongoing Classes",
    value: 6,
    display: "6",
    subtitle: "You have 6 classes in progress",
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    iconBg: "rgba(16,185,129,0.12)",
    iconColor: "#10B981",
    accent: "#10B981",
    accentLight: "#ECFDF5",
    type: "number",
    unit: "Active",
  },
  {
    id: 3,
    title: "Upcoming Exams",
    value: 2,
    display: "2",
    subtitle: "Next: Database Systems",
    icon: Calendar,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    iconBg: "rgba(245,158,11,0.12)",
    iconColor: "#F59E0B",
    accent: "#F59E0B",
    accentLight: "#FFFBEB",
    type: "number",
    unit: "Exams",
  },
  {
    id: 4,
    title: "Total Credits",
    value: 20,
    display: "20",
    subtitle: "Across 8 courses",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    iconBg: "rgba(124,58,237,0.12)",
    iconColor: "#7C3AED",
    accent: "#7C3AED",
    accentLight: "#F5F3FF",
    type: "number",
    unit: "Credits",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          whileHover={{ y: -4, boxShadow: `0 20px 40px ${stat.accent}22` }}
          className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 cursor-pointer transition-shadow"
        >
          {/* Background gradient blob */}
          <div
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10"
            style={{ background: stat.gradient }}
          />

          {/* Top row: icon + value */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: stat.iconBg }}
            >
              <stat.icon className="h-5 w-5" style={{ color: stat.iconColor }} />
            </div>

            {stat.type === "progress" ? (
              /* Circular progress */
              <div className="relative h-14 w-14">
                <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke={stat.accentLight} strokeWidth="4" />
                  <motion.circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke={stat.accent}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - stat.value / 100) }}
                    transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 + index * 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold" style={{ color: stat.accent }}>{stat.value}%</span>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl px-3 py-1 text-xs font-bold"
                style={{ background: stat.accentLight, color: stat.accent }}
              >
                {stat.unit}
              </div>
            )}
          </div>

          {/* Bottom: big number + label */}
          <div>
            <motion.div
              className="text-4xl font-extrabold text-foreground leading-none mb-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
            >
              {stat.display}
            </motion.div>
            <div className="text-sm font-bold text-foreground mb-1">{stat.title}</div>
            <div className="text-xs text-muted-foreground font-medium">{stat.subtitle}</div>
          </div>

          {/* Bottom accent bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
            style={{ background: stat.gradient }}
            initial={{ width: 0 }}
            animate={{ width: "40%" }}
            transition={{ duration: 1, delay: 0.6 + index * 0.08 }}
          />
        </motion.div>
      ))}
    </div>
  );
}
