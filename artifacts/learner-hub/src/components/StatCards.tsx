import { motion } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import { BookOpen, Calendar, Target, GraduationCap } from "lucide-react";

export default function StatCards() {
  const stats = [
    {
      id: 1,
      title: "Overall Progress",
      value: "72%",
      subtitle: "Across all courses",
      icon: Target,
      gradient: "from-blue-500 to-indigo-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      type: "progress",
    },
    {
      id: 2,
      title: "Ongoing Classes",
      value: "6",
      subtitle: "You have 6 classes in progress",
      icon: BookOpen,
      gradient: "from-emerald-400 to-green-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      type: "number",
    },
    {
      id: 3,
      title: "Upcoming Exams",
      value: "2",
      subtitle: "Next: Database Systems",
      icon: Calendar,
      gradient: "from-amber-400 to-orange-500",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      type: "number",
    },
    {
      id: 4,
      title: "Total Credits",
      value: "20",
      subtitle: "Across 8 courses",
      icon: GraduationCap,
      gradient: "from-purple-500 to-violet-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      type: "number",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border border-primary/5"
        >
          <div className="absolute right-0 top-0 -z-10 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br opacity-20 blur-2xl" />
          
          <div className="flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            {stat.type === "progress" && (
              <div className="h-14 w-14">
                <svg viewBox="0 0 36 36" className="h-full w-full circular-chart">
                  <path
                    className="stroke-muted fill-none stroke-[3]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className={`fill-none stroke-[3] stroke-primary`}
                    strokeDasharray="100, 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - parseInt(stat.value) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="fill-foreground text-[8px] font-bold" textAnchor="middle">
                    {stat.value}
                  </text>
                </svg>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            {stat.type === "number" && (
              <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
