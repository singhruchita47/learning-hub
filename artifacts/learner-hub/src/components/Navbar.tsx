import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Code2,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Library,
  LogOut,
  Radio,
  Search,
  Trophy,
  Users,
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
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Library, label: "Resources", href: "/resources" },
  { icon: Radio, label: "Classes", href: "/classes" },
  { icon: ClipboardList, label: "Assignments", href: "/assignments" },
  { icon: HelpCircle, label: "Quizzes", href: "/quizzes" },
  { icon: Code2, label: "Coding Practice", href: "/coding-practice" },
  { icon: CalendarDays, label: "Calendar", href: "/calendar" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: FileText, label: "AI Resume", href: "/resume-generator" },
];

type NavbarUser = {
  name: string;
  email?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase() || "RS";
}

export default function Navbar({ user, onLogout }: { user?: NavbarUser; onLogout?: () => void }) {
  const { query, setQuery } = useSearch();
  const [location] = useLocation();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((item) => !(item.readBy ?? []).includes("student-demo-rs")).length;
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
      } catch {
        // Keep the navbar quiet if the API is offline.
      }
    }

    void loadNotifications();
    const timer = window.setInterval(loadNotifications, 12000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  async function markNotificationsRead() {
    setShowNotifications((current) => !current);

    await Promise.allSettled(
      notifications
        .filter((item) => !(item.readBy ?? []).includes("student-demo-rs"))
        .map((item) =>
          fetch(`${API_BASE}/notifications/${item._id}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "student-demo-rs" }),
          }),
        ),
    );

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        readBy: Array.from(new Set([...(item.readBy ?? []), "student-demo-rs"])),
      })),
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="border-b border-[#34428c]/10 bg-[#34428c] px-4 py-2 text-white md:px-8">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-black">
            <span className="rounded-md bg-[#ff7a21] px-2 py-1">SGSU</span>
            <span className="hidden sm:inline">Scope Global Skills University LMS</span>
          </div>
          <div className="hidden items-center gap-6 text-xs font-black md:flex">
            <span>Exam</span>
            <span>Result</span>
            <span>Notices</span>
            <span>Student Grievance</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7a21] to-[#7b35ad] text-sm font-black text-white shadow-lg shadow-[#7b35ad]/20">
                SG
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-base font-black text-[#34428c]">SGSU Learning Hub</p>
                <p className="text-[11px] font-bold text-slate-500">Digital campus workspace</p>
              </div>
            </Link>

            <div className="relative hidden w-full max-w-xl md:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses, resources, quizzes..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7b35ad]/40 focus:bg-white focus:ring-4 focus:ring-[#7b35ad]/10"
              />
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={markNotificationsRead}
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#34428c] shadow-sm transition hover:border-[#7b35ad]/30 hover:text-[#7b35ad]"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-13 z-50 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-black text-slate-950">Notifications</p>
                      <p className="text-xs font-bold text-slate-500">Assignments, notices, feedback, and classes</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2">
                      {notifications.length > 0 ? notifications.slice(0, 8).map((item) => (
                        <article key={item._id} className="rounded-2xl p-3 transition hover:bg-violet-50">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-violet-500" />
                            <div>
                              <p className="text-sm font-black text-slate-900">{item.title}</p>
                              <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{item.message}</p>
                              {item.createdAt && (
                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                                  {new Date(item.createdAt).toLocaleString("en-IN")}
                                </p>
                              )}
                            </div>
                          </div>
                        </article>
                      )) : (
                        <div className="p-6 text-center">
                          <p className="text-sm font-black text-slate-700">No notifications yet</p>
                          <p className="mt-1 text-xs font-bold text-slate-400">New assignments and feedback will appear here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7b35ad] text-xs font-black text-white">
                  {initials}
                </div>
                <div className="hidden leading-tight lg:block">
                  <p className="text-sm font-black text-slate-900">{displayName}</p>
                  <p className="text-[11px] font-bold text-slate-500">Student</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#34428c] px-4 text-xs font-black text-white shadow-lg shadow-[#34428c]/20 transition hover:bg-[#7b35ad]"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <div className="relative md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold text-slate-800 outline-none"
            />
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-xs font-black transition-all ${
                    isActive
                      ? "bg-[#7b35ad] text-white shadow-lg shadow-[#7b35ad]/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#7b35ad]/25 hover:bg-[#7b35ad]/5 hover:text-[#7b35ad]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
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
