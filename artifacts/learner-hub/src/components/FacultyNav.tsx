import { Bell, BookOpen, ClipboardList, Code2, FileCheck2, HelpCircle, Home, LogOut, Radio, Search, Trophy, UserCheck, ChevronRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { useSearch } from "@/context/SearchContext";

const API_BASE = ACADEMIC_API_BASE;

type ApiNotification = {
  _id: string;
  title: string;
  message: string;
  createdAt?: string;
  readBy?: string[];
};

const facultyLinks = [
  { href: "/",                          label: "Overview",              icon: Home,          color: "text-violet-600",  bg: "bg-violet-50"  },
  { href: "/faculty/courses",           label: "Courses",               icon: BookOpen,      color: "text-blue-600",    bg: "bg-blue-50"    },
  { href: "/faculty/classes",           label: "Live Classes",          icon: Radio,         color: "text-emerald-600", bg: "bg-emerald-50" },
  { href: "/faculty/create-assignment", label: "Assignments",           icon: ClipboardList, color: "text-rose-600",    bg: "bg-rose-50"    },
  { href: "/faculty/create-test",       label: "Create Test",           icon: HelpCircle,    color: "text-amber-600",   bg: "bg-amber-50"   },
  { href: "/faculty/submissions",       label: "Submissions",           icon: FileCheck2,    color: "text-indigo-600",  bg: "bg-indigo-50"  },
  { href: "/faculty/quiz-marks",        label: "Quiz Marks",            icon: Trophy,        color: "text-orange-600",  bg: "bg-orange-50"  },
  { href: "/faculty/coding-questions",  label: "Coding Questions",      icon: Code2,         color: "text-cyan-600",    bg: "bg-cyan-50"    },
  { href: "/faculty/attendance",        label: "Attendance",            icon: UserCheck,     color: "text-teal-600",    bg: "bg-teal-50"    },
  { href: "/faculty/notices",           label: "Notices",               icon: Bell,          color: "text-pink-600",    bg: "bg-pink-50"    },
];

export default function FacultyNav({
  name,
  onLogout,
  children,
}: {
  name: string;
  onLogout?: () => void;
  children?: React.ReactNode;
}) {
  const [path] = useLocation();
  const { query, setQuery } = useSearch();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = (() => {
    try {
      const saved = localStorage.getItem("learningHubUser");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  })();
  const userId = user?.email ?? user?.id ?? "faculty-demo";
  const unreadCount = notifications.filter((item) => !(item.readBy ?? []).includes(userId)).length;

  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    let mounted = true;
    async function loadNotifications() {
      try {
        const response = await fetch(`${API_BASE}/notifications?audience=faculty`);
        if (!response.ok) return;
        const data = await response.json() as { notifications?: ApiNotification[] };
        if (mounted) setNotifications(data.notifications ?? []);
      } catch { /* ignore */ }
    }
    void loadNotifications();
    const timer = window.setInterval(loadNotifications, 12000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, []);

  async function openNotifications() {
    setShowNotifications((c) => !c);
    await Promise.allSettled(
      notifications
        .filter((item) => !(item.readBy ?? []).includes(userId))
        .map((item) =>
          fetch(`${API_BASE}/notifications/${item._id}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          })
        )
    );
    setNotifications((c) =>
      c.map((item) => ({ ...item, readBy: Array.from(new Set([...(item.readBy ?? []), userId])) }))
    );
  }

  return (
    <div className="flex min-h-screen bg-[#eef2fb]">

      {/* ── Sidebar ── */}
      <aside className={`fixed left-0 top-0 z-30 h-screen bg-white shadow-lg shadow-slate-200/60 border-r border-slate-100 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      } hidden lg:flex`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-md shadow-violet-600/30">
            SG
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">Faculty Panel</p>
            <p className="text-[10px] font-bold text-slate-400">SGSU Workspace</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {facultyLinks.map(({ href, label, icon: Icon, color, bg }) => {
            const isActive = path === href || (href !== "/" && path.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-300/40"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive ? "bg-white/20" : bg
                  }`}>
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : color}`} />
                  </div>
                  <span className="text-xs font-black">{label}</span>
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Profile + Logout at bottom */}
        <div className="border-t border-slate-100 p-4 space-y-2 shrink-0">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-xs font-black text-white shadow">
              {initials || "FC"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-slate-900">{name}</p>
              <p className="text-[10px] font-bold text-slate-400">Faculty Member</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100 transition"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
        sidebarOpen ? "lg:pl-64" : "lg:pl-0"
      }`}>

        {/* Top Navbar */}
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-4">

            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-violet-50 hover:text-violet-600 transition"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students, submissions, tests..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={openNotifications}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-violet-50 hover:text-violet-600 transition"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-black text-slate-900">Notifications</p>
                      <p className="text-xs font-bold text-slate-400">Submissions and quiz updates</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2">
                      {notifications.length > 0 ? notifications.slice(0, 8).map((item) => (
                        <article key={item._id} className="rounded-xl p-3 hover:bg-violet-50 transition">
                          <p className="text-sm font-black text-slate-900">{item.title}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500 leading-relaxed">{item.message}</p>
                          {item.createdAt && (
                            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {new Date(item.createdAt).toLocaleString("en-IN")}
                            </p>
                          )}
                        </article>
                      )) : (
                        <div className="p-6 text-center">
                          <p className="text-sm font-black text-slate-700">No notifications yet</p>
                          <p className="mt-1 text-xs font-bold text-slate-400">Student submissions will appear here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-black text-white">
                  {initials || "FC"}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="text-xs font-black text-slate-900">{name}</p>
                  <p className="text-[10px] font-bold text-slate-400">Faculty</p>
                </div>
              </div>

              {/* Logout mobile */}
              <button
                onClick={onLogout}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 text-xs font-black text-red-600 hover:bg-red-100 transition lg:hidden"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
