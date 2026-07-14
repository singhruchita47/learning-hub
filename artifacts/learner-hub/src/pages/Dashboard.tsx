import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  BookOpen, ClipboardCheck, Library, Target, Trophy,
  ArrowRight, PlayCircle, Clock, CheckCircle2,
  TrendingUp, CalendarDays, Award, Zap, Flame
} from "lucide-react";
import ActivityCharts from "@/components/ActivityCharts";
import { ACADEMIC_API_BASE } from "@/lib/api";

const quickCards = [
  { title: "Web Development",  sub: "Full Stack Masterclass",  pct: 85, href: "/courses/web-dev", icon: BookOpen,      color: "from-violet-500 to-indigo-600",  ring: "ring-violet-200", txt: "text-violet-600" },
  { title: "Data Structures",  sub: "DSA & Algorithms",        pct: 60, href: "/courses/1",       icon: ClipboardCheck, color: "from-emerald-500 to-teal-600",   ring: "ring-emerald-200",txt: "text-emerald-600"},
  { title: "Database Systems", sub: "RDBMS Foundations",       pct: 45, href: "/courses/2",       icon: Library,       color: "from-rose-500 to-pink-600",       ring: "ring-rose-200",   txt: "text-rose-600" },
];

const announcements = [
  { title: "SGSU digital campus orientation", tag: "Today",    bg: "bg-violet-50", txt: "text-violet-700", dot: "bg-violet-500" },
  { title: "Data Structures assignment deadline updated", tag: "Due soon", bg: "bg-rose-50", txt: "text-rose-600", dot: "bg-rose-500" },
  { title: "Live class: Database normalization basics", tag: "09:30 AM", bg: "bg-emerald-50", txt: "text-emerald-700", dot: "bg-emerald-500" },
];

const weekPlan = [
  { type: "Assignment", title: "Graph traversal lab",      time: "Today",    icon: ClipboardCheck, from: "from-rose-500",    to: "to-pink-500" },
  { type: "Quiz",       title: "Aptitude checkpoint",      time: "Tomorrow", icon: Zap,            from: "from-amber-500",   to: "to-orange-500" },
  { type: "Class",      title: "Operating System revision",time: "Friday",   icon: CalendarDays,   from: "from-violet-500",  to: "to-indigo-500" },
];

function CircularProgress({ pct }: { pct: number }) {
  const r = 36; const circ = 2 * Math.PI * r;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#e0e7ff" strokeWidth="7" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="url(#grad)" strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <text x="44" y="49" textAnchor="middle" fill="#4f46e5" fontSize="15" fontWeight="900">{pct}%</text>
    </svg>
  );
}

function StudentIllustration() {
  return (
    <div className="relative flex h-full min-h-[260px] items-center justify-center select-none pointer-events-none">
      {/* Floating Badges */}
      
      {/* 1. Data Structures Badge */}
      <div className="absolute -top-4 left-4 z-10 rounded-2xl bg-white px-4 py-2.5 shadow-md border border-slate-100 flex items-center gap-2">
        <span className="text-blue-500">📖</span>
        <div className="text-[10px] leading-tight">
          <p className="font-extrabold text-slate-800">Data Structures</p>
          <p className="font-semibold text-slate-400">85% complete</p>
        </div>
      </div>

      {/* 2. Rank #3 Leaderboard Badge */}
      <div className="absolute top-8 right-6 z-10 rounded-2xl bg-white px-4 py-2.5 shadow-md border border-slate-100 flex items-center gap-2">
        <span className="text-base">🏆</span>
        <div className="text-[10px] leading-tight">
          <p className="font-extrabold text-amber-600">Rank #3</p>
          <p className="font-semibold text-slate-400">Leaderboard</p>
        </div>
      </div>

      {/* 3. Progress Badge */}
      <div className="absolute bottom-6 left-0 z-10 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 shadow-lg shadow-indigo-500/20 text-white flex items-center gap-2">
        <span className="text-sm">🔥</span>
        <div className="text-[10px] leading-tight">
          <p className="font-extrabold">2,450 XP</p>
          <p className="font-semibold text-violet-100">Level 12 Scholar</p>
        </div>
      </div>

      {/* 4. Due in 2 days Badge */}
      <div className="absolute bottom-4 right-2 z-10 rounded-2xl bg-white px-4 py-2.5 shadow-md border border-slate-100/80 flex items-center gap-2">
        <span className="text-red-500">⏰</span>
        <div className="text-[10px] leading-tight">
          <p className="font-extrabold text-red-600">Due in 2 days</p>
          <p className="font-semibold text-slate-400">Database Exam</p>
        </div>
      </div>

      {/* 5. Mini check badge */}
      <div className="absolute top-24 right-4 z-10 rounded-xl bg-white px-2 py-1.5 shadow-sm border border-slate-100 flex items-center gap-1.5">
        <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <span className="text-[10px] font-black">✓</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-6 rounded bg-slate-200" />
          <div className="h-1 w-4 rounded bg-slate-200" />
        </div>
      </div>

      {/* Bookish Cartoon SVG Illustration (Larger size) */}
      <div className="relative z-0 w-80 h-80 lg:w-[320px] lg:h-[320px] mt-4 lg:mt-0 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(108,_92,_231,_0.2)] ring-8 ring-white bg-[#f8f7ff] flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Glow */}
          <circle cx="100" cy="100" r="80" fill="#ede9fe" opacity="0.5" />
          
          {/* Stack of Books */}
          <g transform="translate(40, 70)">
            {/* Bottom Book */}
            <path d="M10 70 L110 70 A5 5 0 0 1 115 75 L115 85 A5 5 0 0 1 110 90 L10 90 A5 5 0 0 1 5 85 L5 75 A5 5 0 0 1 10 70 Z" fill="#4f46e5"/>
            <path d="M5 75 L115 75" stroke="#3730a3" strokeWidth="2"/>
            <rect x="10" y="75" width="105" height="10" fill="#fff"/>
            <path d="M15 75 L15 85" stroke="#e2e8f0" strokeWidth="2"/>
            <path d="M25 75 L25 85" stroke="#e2e8f0" strokeWidth="2"/>
            
            {/* Middle Book 1 */}
            <path d="M15 50 L105 50 A5 5 0 0 1 110 55 L110 65 A5 5 0 0 1 105 70 L15 70 A5 5 0 0 1 10 65 L10 55 A5 5 0 0 1 15 50 Z" fill="#06b6d4"/>
            <path d="M10 55 L110 55" stroke="#0891b2" strokeWidth="2"/>
            <rect x="15" y="55" width="95" height="10" fill="#fff"/>
            <path d="M20 55 L20 65" stroke="#e2e8f0" strokeWidth="2"/>
            
            {/* Middle Book 2 */}
            <path d="M20 30 L100 30 A5 5 0 0 1 105 35 L105 45 A5 5 0 0 1 100 50 L20 50 A5 5 0 0 1 15 45 L15 35 A5 5 0 0 1 20 30 Z" fill="#f59e0b"/>
            <path d="M15 35 L105 35" stroke="#d97706" strokeWidth="2"/>
            <rect x="20" y="35" width="85" height="10" fill="#fff"/>
            <path d="M25 35 L25 45" stroke="#e2e8f0" strokeWidth="2"/>

            {/* Top Book */}
            <path d="M25 10 L95 10 A5 5 0 0 1 100 15 L100 25 A5 5 0 0 1 95 30 L25 30 A5 5 0 0 1 20 25 L20 15 A5 5 0 0 1 25 10 Z" fill="#ec4899"/>
            <path d="M20 15 L100 15" stroke="#db2777" strokeWidth="2"/>
            <rect x="25" y="15" width="75" height="10" fill="#fff"/>
            <path d="M30 15 L30 25" stroke="#e2e8f0" strokeWidth="2"/>
          </g>

          {/* Apple/Fruit on top */}
          <g transform="translate(90, 60)">
            <circle cx="10" cy="10" r="12" fill="#ef4444"/>
            <path d="M10 10 Q15 -5 20 0" stroke="#166534" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M10 10 Q5 -5 0 0" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <circle cx="6" cy="6" r="3" fill="#fff" opacity="0.4"/>
          </g>

          {/* Floating Elements (Stars & Pencil) */}
          <path d="M40 50 L42 40 L52 38 L42 36 L40 26 L38 36 L28 38 L38 40 Z" fill="#fbbf24"/>
          <path d="M150 70 L151.5 62 L159 60.5 L151.5 59 L150 51 L148.5 59 L141 60.5 L148.5 62 Z" fill="#a78bfa"/>
          <circle cx="160" cy="120" r="4" fill="#38bdf8"/>
          <circle cx="30" cy="130" r="5" fill="#f472b6"/>
        </svg>
      </div>
    </div>
  );
}


export default function Dashboard() {
  const [student, setStudent]         = useState<any>(null);
  const [dynamicCourses, setDynamicCourses] = useState<any[]>([]);
  const overallPct = 72;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("learningHubUser");
      if (saved) setStudent(JSON.parse(saved));
    } catch { /* empty */ }
    fetch(`${ACADEMIC_API_BASE}/courses`)
      .then(r => r.json())
      .then((d: { courses?: any[] }) => { if (d.courses) setDynamicCourses(d.courses); })
      .catch(() => {});
  }, []);

  const firstName = student?.name?.split(" ")[0] ?? "Student";
  const courses = dynamicCourses.length > 0
    ? dynamicCourses.slice(0, 3).map((c, i) => ({
        title: c.code, sub: c.title, pct: c.progress ?? 50,
        href: `/courses/${c.code}`,
        icon: [BookOpen, ClipboardCheck, Library][i % 3],
        color: quickCards[i % 3].color,
        ring: quickCards[i % 3].ring,
        txt: quickCards[i % 3].txt,
      }))
    : quickCards;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 space-y-5">

        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[#f3f0ff] p-8 md:p-12 shadow-sm border border-purple-100/40 animate-in fade-in duration-500">
          <div className="relative grid lg:grid-cols-[1fr_360px] gap-8 items-center">
            <div>
              {/* Top Badge */}
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50/70 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-[#312e81]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                6 classes ongoing today
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-slate-900 tracking-tight">
                Welcome Back,<br />
                <span className="text-blue-600">{firstName}!</span>
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-md text-sm font-semibold text-slate-500 leading-relaxed">
                Keep learning and achieve your goals today. You have{" "}
                <span className="font-black text-slate-800">2 upcoming deadlines</span> this week.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-3.5">
                <Link href="/courses"
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-200">
                  Continue Learning →
                </Link>
                <Link href="/courses"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 shadow-sm transition duration-200">
                  Browse Courses
                </Link>
              </div>
              {/* Stats */}
              <div className="mt-12 flex gap-10">
                {[
                  { val: 11, label: "Courses" },
                  { val: 24, label: "Quizzes Done" },
                  { val: 3, label: "Certificates" },
                ].map(({ val, label }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <p className="text-3xl font-black text-slate-900 leading-none">{val}</p>
                    <p className="text-xs font-bold text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

            </div>
            <div className="hidden lg:block">
              <StudentIllustration />
            </div>
          </div>
        </section>

        {/* ── Progress At a Glance ── */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
            <span className="h-5 w-1 rounded-full bg-violet-600" />
            Your Progress At a Glance
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Overall */}
            <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100">
                  <Target className="h-5 w-5 text-violet-600" />
                </div>
                <CircularProgress pct={overallPct} />
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900">{overallPct}%</p>
              <p className="font-black text-slate-700">Overall Progress</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">Keep up the great work!</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-violet-100">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600" style={{ width: `${overallPct}%` }} />
              </div>
            </div>

            {/* Ongoing Classes */}
            <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-black text-emerald-700">Active</span>
              </div>
              <p className="mt-4 text-4xl font-black text-slate-900">{courses.length || 6}</p>
              <p className="font-black text-slate-700">Ongoing Classes</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">{courses.length || 6} classes in progress</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-emerald-100">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: "70%" }} />
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100">
                  <CalendarDays className="h-5 w-5 text-amber-600" />
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-black text-amber-700">Exams</span>
              </div>
              <p className="mt-4 text-4xl font-black text-slate-900">2</p>
              <p className="font-black text-slate-700">Upcoming Exams</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">Next: Database Systems</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-amber-100">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: "40%" }} />
              </div>
            </div>

            {/* Credits */}
            <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100">
                  <Award className="h-5 w-5 text-cyan-600" />
                </div>
                <span className="rounded-full bg-cyan-100 px-3 py-0.5 text-[10px] font-black text-cyan-700">Credits</span>
              </div>
              <p className="mt-4 text-4xl font-black text-slate-900">20</p>
              <p className="font-black text-slate-700">Total Credits</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">Across 8 courses</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-cyan-100">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Courses + Announcements ── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Courses */}
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">My Courses</h2>
              <Link href="/courses" className="flex items-center gap-1 text-xs font-black text-violet-600 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {courses.map((c) => {
                const Icon = c.icon;
                return (
                  <Link key={c.title} href={c.href}
                    className="group flex items-center gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-transparent transition hover:ring-violet-200 hover:bg-violet-50/50 hover:shadow-sm">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{c.sub}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200">
                          <div className={`h-1.5 rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.pct}%` }} />
                        </div>
                        <span className={`text-[11px] font-black ${c.txt}`}>{c.pct}%</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 transition shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Announcements + Next Class */}
          <div className="space-y-5">
            <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
              <h2 className="mb-4 text-lg font-black text-slate-900">Announcements</h2>
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.title} className={`flex items-start gap-3 rounded-2xl ${a.bg} p-3`}>
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 leading-relaxed">{a.title}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black ${a.txt} bg-white/70`}>{a.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100">
              <h2 className="mb-3 text-base font-black text-slate-900">Next Live Class</h2>
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white shadow-lg shadow-violet-500/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black">Data Structures Lab</p>
                  <p className="flex items-center gap-1 text-xs font-semibold text-violet-200">
                    <Clock className="h-3 w-3" /> Today, 09:30 AM
                  </p>
                </div>
                <Link href="/classes" className="ml-auto rounded-xl bg-white/20 px-3 py-1.5 text-[11px] font-black text-white hover:bg-white/30 transition">
                  Join
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Activity + Planner ── */}
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-black text-slate-900">Weekly Activity</h2>
            </div>
            <ActivityCharts />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <div className="mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-black text-slate-900">This Week</h2>
            </div>
            <div className="space-y-3">
              {weekPlan.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.from} ${item.to} text-white shadow-sm`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.type}</p>
                      <p className="text-sm font-black text-slate-900 truncate">{item.title}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">{item.time}</span>
                  </div>
                );
              })}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/leaderboard" className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 hover:bg-amber-100 transition">
                  <Trophy className="h-3.5 w-3.5" /> Rank #7
                </Link>
                <Link href="/assignments" className="flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-black text-violet-700 hover:bg-violet-100 transition">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 2 Due
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
