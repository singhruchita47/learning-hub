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
    <div className="flex min-h-screen flex-col bg-[#eef2fb]">
      
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-150 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="px-4 py-3 md:px-8">
          <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4">
            
            {/* Logo area */}
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-500/30">
                SG
              </div>
              <div className="hidden leading-tight sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-base font-black text-slate-900">Faculty Panel</p>
                  <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-black text-violet-600">WORKSPACE</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">SGSU Digital Campus</p>
              </div>
            </Link>

            {/* Search */}
            <div className="relative flex-1 max-w-md hidden md:block">
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
            <div className="flex shrink-0 items-center gap-3">
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={openNotifications}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-violet-50 hover:text-violet-600 transition cursor-pointer"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
                    <div className="border-b border-slate-100 px-4 py-3 text-left">
                      <p className="text-sm font-black text-slate-900">Notifications</p>
                      <p className="text-xs font-bold text-slate-400">Submissions and quiz updates</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2 text-left">
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

              {/* Profile details */}
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-black text-white">
                  {initials || "FC"}
                </div>
                <div className="hidden leading-tight sm:block text-left">
                  <p className="text-xs font-black text-slate-900">{name}</p>
                  <p className="text-[10px] font-bold text-slate-400">Faculty Member</p>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-red-50 bg-red-50 px-3 text-xs font-black text-red-600 hover:bg-red-100 transition cursor-pointer"
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
              {facultyLinks.map(({ href, label, icon: Icon, color, bg }) => {
                const isActive = path === href || (href !== "/" && path.startsWith(href));
                return (
                  <Link key={href} href={href}>
                    <div className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-300/40"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : color}`} />
                      <span className="text-[10px] font-black">{label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main content area ── */}
      <main className="min-w-0 flex-1">
        {children}
      </main>

    </div>
  );
}
