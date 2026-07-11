import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BellRing,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Library,
  LineChart,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import ActivityCharts from "@/components/ActivityCharts";
import StudyResources from "@/components/StudyResources";

const quickCards = [
  {
    title: "My Course",
    subtitle: "Data Structures",
    detail: "82% complete",
    action: "Open lessons",
    href: "/courses",
    icon: BookOpen,
    color: "from-[#263676] to-[#7130a1]",
  },
  {
    title: "Quiz",
    subtitle: "Trees and Heaps",
    detail: "12 min checkpoint",
    action: "Attempt quiz",
    href: "/quizzes",
    icon: ClipboardCheck,
    color: "from-[#0f766e] to-[#14b8a6]",
  },
  {
    title: "Study Resources",
    subtitle: "CSE notes and PDFs",
    detail: "5 new files",
    action: "Browse files",
    href: "/resources",
    icon: Library,
    color: "from-[#f97316] to-[#fb923c]",
  },
];

const announcements = [
  { title: "SGSU digital campus orientation", tag: "Today", tone: "bg-[#7130a1]/10 text-[#7130a1]" },
  { title: "Data Structures assignment deadline updated", tag: "Due soon", tone: "bg-[#f97316]/10 text-[#c2410c]" },
  { title: "Live class: Database normalization basics", tag: "09:30 AM", tone: "bg-emerald-50 text-emerald-700" },
];

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f97316]">{label}</p>
      <h2 className="mt-1 text-2xl font-black text-slate-950">{title}</h2>
    </div>
  );
}

function DashboardCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function StudentFigure() {
  return (
    <div className="relative hidden min-h-[280px] items-center justify-center lg:flex">
      <div className="absolute h-56 w-72 rounded-[2rem] border border-[#7130a1]/10 bg-white/70 shadow-2xl" style={{ transform: "rotateX(58deg) rotateZ(-34deg)" }} />
      <div className="absolute h-44 w-60 rounded-[2rem] bg-gradient-to-br from-[#f97316] via-[#7130a1] to-[#263676] shadow-2xl" style={{ transform: "rotateX(58deg) rotateZ(-34deg)" }} />
      <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white text-[#7130a1] shadow-2xl">
        <GraduationCap className="h-16 w-16" />
      </div>
      <div className="absolute right-8 top-12 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#263676] shadow-xl">+XP</div>
      <div className="absolute bottom-14 left-8 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#f97316] shadow-xl">Quiz</div>
      <div className="absolute bottom-8 right-14 rounded-2xl bg-white px-4 py-3 text-sm font-black text-emerald-700 shadow-xl">Live</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#eef2fb]">
      <div className="mx-auto max-w-[1540px] px-4 py-6 md:px-8">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#263676]">B.Tech CSE - Semester 4</p>
          <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Student Dashboard</h1>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white bg-white/80 px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <Sparkles className="h-4 w-4 text-[#f97316]" />
            Role-based access active for student modules
          </div>
          <span className="text-sm font-black text-[#263676]">SGSU LMS</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <DashboardCard className="overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f8f4ff_55%,#eef6ff_100%)]">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="p-2 md:p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7130a1]">Good evening, student</p>
                <h2 className="mt-4 text-5xl font-black leading-tight text-slate-950">
                  Today at <span className="text-[#7130a1]">SGSU Learn</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-slate-600">
                  A focused view of your batch, active courses, quiz attempts, announcements, learning activity, and study resources.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {["CSE 4A", "09:30 AM class", "Rank #7"].map((item) => (
                    <span key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <StudentFigure />
            </div>
          </DashboardCard>

          <DashboardCard>
            <SectionTitle label="My Batch" title="CSE 4A - Semester 4" />
            <div className="rounded-2xl border border-[#7130a1]/15 bg-[#7130a1]/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7130a1] text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-slate-950">B.Tech CSE - Semester 4</p>
                  <p className="text-sm font-bold text-slate-500">Mentor: Dr. Meera Rao</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["64", "Students"],
                ["94%", "Attendance"],
                ["#7", "Your rank"],
                ["1720", "Batch avg XP"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-black text-slate-950">{value}</p>
                  <p className="text-xs font-black text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <DashboardCard key={card.title}>
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{card.title}</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">{card.subtitle}</h3>
                <p className="mt-2 text-sm font-bold text-slate-500">{card.detail}</p>
                <Link
                  href={card.href}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#263676] px-5 text-sm font-black text-white shadow-lg shadow-[#263676]/20 transition hover:bg-[#7130a1]"
                >
                  {card.action}
                </Link>
              </DashboardCard>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <DashboardCard>
            <SectionTitle label="Learning Activity" title="Weekly progress" />
            <ActivityCharts />
          </DashboardCard>

          <div className="grid gap-6">
            <DashboardCard>
              <SectionTitle label="Announcements" title="Latest notices" />
              <div className="space-y-3">
                {announcements.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <BellRing className="h-4 w-4 text-[#f97316]" />
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black ${item.tone}`}>{item.tag}</span>
                    </div>
                    <p className="text-sm font-black leading-6 text-slate-800">{item.title}</p>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard>
              <SectionTitle label="Next Class" title="Live learning" />
              <div className="flex items-center gap-3 rounded-2xl bg-[#263676] p-4 text-white">
                <PlayCircle className="h-9 w-9 text-[#f97316]" />
                <div>
                  <p className="font-black">Data Structures Lab</p>
                  <p className="text-sm font-semibold text-white/70">Today, 09:30 AM</p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <StudyResources />
          <DashboardCard>
            <SectionTitle label="Planner" title="This week" />
            <div className="space-y-3">
              {[
                ["Assignment", "Graph traversal lab", "Today, 11:59 PM", FileText],
                ["Quiz", "Aptitude checkpoint", "Tomorrow", ClipboardCheck],
                ["Class", "Operating System revision", "Friday", CalendarClock],
              ].map(([type, title, time, Icon]) => (
                <div key={title as string} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7130a1]/10 text-[#7130a1]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">{type as string}</p>
                    <p className="truncate text-sm font-black text-slate-900">{title as string}</p>
                  </div>
                  <span className="text-xs font-black text-[#f97316]">{time as string}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
