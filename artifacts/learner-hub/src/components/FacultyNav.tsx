import { Bell, BookOpen, ClipboardList, Code2, FileCheck2, HelpCircle, Home, LogOut, Radio, Search, Trophy } from "lucide-react";
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
  { href: "/", label: "Overview", icon: Home },
  { href: "/faculty/courses", label: "Courses", icon: BookOpen },
  { href: "/faculty/classes", label: "Live Classes", icon: Radio },
  { href: "/faculty/notices", label: "Notices", icon: Bell },
  { href: "/faculty/create-assignment", label: "Create Assignment", icon: ClipboardList },
  { href: "/faculty/create-test", label: "Create Test", icon: HelpCircle },
  { href: "/faculty/submissions", label: "Student Submissions", icon: FileCheck2 },
  { href: "/faculty/quiz-marks", label: "Quiz Marks", icon: Trophy },
  { href: "/faculty/coding-questions", label: "Create Coding Question", icon: Code2 },
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
  const unreadCount = notifications.filter((item) => !(item.readBy ?? []).includes("faculty-demo")).length;
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      try {
        const response = await fetch(`${API_BASE}/notifications?audience=faculty`);
        if (!response.ok) return;
        const data = await response.json() as { notifications?: ApiNotification[] };
        if (mounted) setNotifications(data.notifications ?? []);
      } catch {
        // Ignore API downtime in the navbar.
      }
    }

    void loadNotifications();
    const timer = window.setInterval(loadNotifications, 12000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  async function openNotifications() {
    setShowNotifications((current) => !current);
    await Promise.allSettled(
      notifications
        .filter((item) => !(item.readBy ?? []).includes("faculty-demo"))
        .map((item) =>
          fetch(`${API_BASE}/notifications/${item._id}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "faculty-demo" }),
          }),
        ),
    );
    setNotifications((current) =>
      current.map((item) => ({ ...item, readBy: Array.from(new Set([...(item.readBy ?? []), "faculty-demo"])) })),
    );
  }

  return (
    <div className="min-h-screen bg-[#eef2fb]">
      <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-600/20">
              SG
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-black text-slate-950">Faculty Panel</p>
              <p className="text-xs font-bold text-slate-500">SGSU academic workspace</p>
            </div>
          </Link>

          <div className="relative hidden w-full max-w-xl md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students, submissions, tests..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-200 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={openNotifications}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-black text-slate-950">Faculty Notifications</p>
                    <p className="text-xs font-bold text-slate-500">Submissions and quiz updates</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length > 0 ? notifications.slice(0, 8).map((item) => (
                      <article key={item._id} className="rounded-2xl p-3 hover:bg-violet-50">
                        <p className="text-sm font-black text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{item.message}</p>
                        {item.createdAt && (
                          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
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

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-xs font-black text-white">
                {initials || "FC"}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-black text-slate-950">{name}</p>
                <p className="text-[11px] font-bold text-slate-500">Faculty Profile</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 text-xs font-black text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-72 shrink-0 border-r border-violet-100 bg-white/95 p-4 shadow-xl shadow-violet-100/70 lg:block">
          <p className="mb-3 px-3 text-xs font-black uppercase tracking-[0.18em] text-violet-500">Faculty tools</p>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {facultyLinks.map((item) => {
            const Icon = item.icon;
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  type="button"
                className={`flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-sm font-black transition ${
                    active
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
