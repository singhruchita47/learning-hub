import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  Award, Bell, BookOpen, CalendarDays, ClipboardList,
  Code2, FileText, HelpCircle, LayoutDashboard, Library,
  LogOut, Radio, Search, Trophy, UserCheck, Users, Sparkles, X,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

type ApiNotification = {
  _id: string;
  title: string;
  message: string;
  type?: string;
  createdAt?: string;
  readBy?: string[];
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/",                color: "text-violet-600",  activeBg: "from-violet-600 to-indigo-600" },
  { icon: BookOpen,        label: "Courses",         href: "/courses",         color: "text-blue-600",    activeBg: "from-blue-600 to-cyan-600"     },
  { icon: Library,         label: "Resources",       href: "/resources",       color: "text-indigo-600",  activeBg: "from-indigo-600 to-violet-600" },
  { icon: Radio,           label: "Classes",         href: "/classes",         color: "text-emerald-600", activeBg: "from-emerald-600 to-teal-600"  },
  { icon: ClipboardList,   label: "Assignments",     href: "/assignments",     color: "text-rose-600",    activeBg: "from-rose-600 to-pink-600"     },
  { icon: HelpCircle,      label: "Quizzes",         href: "/quizzes",         color: "text-purple-600",  activeBg: "from-purple-600 to-violet-600" },
  { icon: Code2,           label: "Coding",          href: "/coding-practice", color: "text-cyan-600",    activeBg: "from-cyan-600 to-blue-600"     },
  { icon: CalendarDays,    label: "Calendar",        href: "/calendar",        color: "text-sky-600",     activeBg: "from-sky-600 to-blue-600"      },
  { icon: Trophy,          label: "Leaderboard",     href: "/leaderboard",     color: "text-orange-600",  activeBg: "from-orange-500 to-amber-500"  },
  { icon: Users,           label: "Community",       href: "/community",       color: "text-teal-600",    activeBg: "from-teal-600 to-emerald-600"  },
  { icon: Award,           label: "Certificates",    href: "/certificates",    color: "text-yellow-600",  activeBg: "from-yellow-500 to-orange-500" },
  { icon: FileText,        label: "AI Resume",       href: "/resume-generator",color: "text-fuchsia-600", activeBg: "from-fuchsia-600 to-pink-600"  },
];

type NavbarUser = { id?: string; name: string; email?: string };

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((i) => i[0]).join("").toUpperCase() || "RS";
}

export default function Navbar({ user, onLogout }: { user?: NavbarUser; onLogout?: () => void }) {
  const { query, setQuery } = useSearch();
  const [location] = useLocation();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const userId = user?.email ?? user?.id ?? "student-demo-rs";
  const unreadCount = notifications.filter((item) => !(item.readBy ?? []).includes(userId)).length;
  const displayName = user?.name ?? "Ruchita Singh";
  const initials = getInitials(displayName);

  useEffect(() => {
    let mounted = true;
    async function loadNotifications() {
      try {
        const response = await fetch(`${API_BASE}/notifications?audience=student`);
        if (!response.ok) return;
        const data = await response.json() as { notifications?: ApiNotification[] };
        if (mounted) setNotifications(data.notifications ?? []);
      } catch { /* quiet */ }
    }
    void loadNotifications();
    const timer = window.setInterval(loadNotifications, 12000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, []);

  async function markNotificationsRead() {
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
    <header className="sticky top-0 z-30 bg-white shadow-md shadow-slate-200/60 border-b border-slate-100">

      {/* ── Top Row ── */}
      <div className="px-4 md:px-8 pt-3 pb-2">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-500/30">
              LH
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-base font-black text-slate-900">Learner Hub</p>
                <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-black text-violet-600">BETA</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400">SGSU Digital Campus</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="relative hidden w-full max-w-xl md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, resources, quizzes..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-2.5">

            {/* Attendance shortcut */}
            <Link
              href="/attendance"
              title="My Attendance"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <UserCheck className="h-4.5 w-4.5" />
            </Link>

            {/* AI Resume shortcut */}
            <Link
              href="/resume-generator"
              title="AI Resume Builder"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:text-fuchsia-600"
            >
              <Sparkles className="h-4 w-4" />
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={markNotificationsRead}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-13 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-black text-slate-900">Notifications</p>
                      <p className="text-xs font-bold text-slate-400">Assignments, feedback & classes</p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">{unreadCount} new</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length > 0 ? notifications.slice(0, 8).map((item) => (
                      <article key={item._id} className="rounded-xl p-3 transition hover:bg-violet-50">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                          <div>
                            <p className="text-sm font-black text-slate-900">{item.title}</p>
                            <p className="mt-0.5 text-xs font-semibold leading-relaxed text-slate-500">{item.message}</p>
                            {item.createdAt && (
                              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {new Date(item.createdAt).toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    )) : (
                      <div className="p-6 text-center">
                        <Bell className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                        <p className="text-sm font-black text-slate-700">No notifications yet</p>
                        <p className="mt-1 text-xs font-bold text-slate-400">New assignments and feedback will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User profile pill */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-[10px] font-black text-white shadow">
                {initials}
              </div>
              <div className="hidden leading-tight lg:block">
                <p className="text-xs font-black text-slate-900">{displayName}</p>
                <p className="text-[10px] font-bold text-slate-400">Student</p>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Search ── */}
      <div className="px-4 pb-2 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* ── Nav Links Row ── */}
      <div className="border-t border-slate-100 bg-white px-4 md:px-8">
        <div className="mx-auto max-w-[1540px]">
          <nav className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex h-9 shrink-0 items-center gap-2 rounded-xl px-3.5 text-xs font-black transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${item.activeBg} text-white shadow-md`
                      : `text-slate-500 hover:bg-slate-50 hover:text-slate-800`
                  }`}
                >
                  <item.icon className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : item.color}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
}
