import { Link, useLocation } from "wouter";
import { 
  BarChart2, BookOpen, Users, LogOut, 
  Settings, LayoutDashboard, Calendar,
  Trophy, BookMarked, UserCheck, CheckCircle2,
  TrendingUp, Megaphone, Link2, Award, Search, Code2, ClipboardList
} from "lucide-react";

export default function AdminNav({ name, onLogout, children }: { name: string, onLogout: () => void, children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/reports", label: "Reports", icon: TrendingUp },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/quiz-coding", label: "Quiz & Coding", icon: Code2 },
    { href: "/admin/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/admin/allocations", label: "Allocations", icon: Link2 },
    { href: "/admin/placements", label: "Students", icon: Users },
    { href: "/admin/curriculum", label: "Curriculum", icon: BookMarked },
    { href: "/admin/attendance", label: "Attendance", icon: UserCheck },
    { href: "/admin/calendar", label: "Calendar", icon: Calendar },
    { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/admin/badges", label: "Badges", icon: Award },
    { href: "/admin/system", label: "System", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#eef2fb]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-150 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="px-4 py-3 md:px-8">
          <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4">
            
            {/* Logo area */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-500/30">
                SG
              </div>
              <div className="hidden leading-tight sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-base font-black text-slate-900">Admin Control</p>
                  <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-black text-violet-600">COMMAND</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">SGSU Digital</p>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-6 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <input 
                type="text" 
                placeholder="Search students, courses, settings..." 
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-violet-300 focus:ring-4 focus:ring-violet-100 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
                <kbd className="h-5 rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-bold text-slate-400 shadow-sm">Ctrl</kbd>
                <kbd className="h-5 rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-bold text-slate-400 shadow-sm">K</kbd>
              </div>
            </div>

            {/* Right Profile & Actions */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-black text-white">
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden leading-tight sm:block text-left">
                  <p className="text-xs font-black text-slate-900">{name}</p>
                  <p className="text-[10px] font-bold text-slate-400">Administrator</p>
                </div>
              </div>

              <button 
                onClick={onLogout}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-red-50 bg-red-50 px-3 text-xs font-black text-red-650 hover:bg-red-100 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── Secondary Nav row with Horizontal links ── */}
        <div className="border-t border-slate-100 bg-white px-4 md:px-8 py-2 overflow-x-auto no-scrollbar">
          <div className="mx-auto max-w-[1540px]">
            <nav className="flex items-center gap-1.5 py-0.5">
              {links.map((link) => {
                const isActive = location === link.href || (location === "/" && link.href === "/admin/dashboard");
                return (
                  <Link key={link.href} href={link.href}>
                    <a className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all cursor-pointer shrink-0 ${
                      isActive 
                        ? "bg-violet-600 text-white shadow-md shadow-violet-300/40" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                      <link.icon className="h-4 w-4" />
                      <span className="text-xs font-black">{link.label}</span>
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
