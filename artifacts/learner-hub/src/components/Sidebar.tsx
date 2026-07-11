import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Award,
  BookOpen,
  CalendarDays,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Library,
  LogOut,
  MessageSquarePlus,
  Settings,
  Trophy,
  User,
  Users,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Library, label: "Resources", href: "/resources" },
  { icon: ClipboardList, label: "Assignments", href: "/assignments" },
  { icon: HelpCircle, label: "Quizzes", href: "/quizzes" },
  { icon: CalendarDays, label: "Calendar", href: "/calendar" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: MessageSquarePlus, label: "Feedback", href: "/feedback" },
];

const bottomNavItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const [location] = useLocation();
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOpen = isPinnedOpen || isHovered;
  const drawerClass = isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-52 shadow-sm";
  const labelClass = isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2";

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsPinnedOpen(true)}
      className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-hidden border-r border-gray-100 bg-white py-5 transition-all duration-300 ease-out ${drawerClass}`}
    >
      <div className="mb-7 flex items-center justify-between px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-primary/20">
            LH
          </div>
          <div className={`min-w-0 transition-all duration-200 ${labelClass}`}>
            <p className="truncate text-sm font-extrabold text-slate-900">Learning Hub</p>
            <p className="truncate text-[11px] font-semibold text-slate-500">Dashboard</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsPinnedOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-primary/10 hover:text-primary"
          aria-label={isPinnedOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <LayoutDashboard className="h-5 w-5" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4 pr-3 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`relative flex h-11 items-center justify-between gap-3 rounded-2xl px-3 transition-all duration-200 ${
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {isActive && <span className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-white/80" />}
              <span className={`truncate text-sm font-bold transition-all duration-200 ${labelClass}`}>{item.label}</span>
              <item.icon className="h-5 w-5 shrink-0" />
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-gray-100 px-4 pt-4">
        <div className="flex flex-col gap-2">
        {bottomNavItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex h-11 items-center justify-between gap-3 rounded-2xl px-3 transition-all duration-200 ${
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <span className={`truncate text-sm font-bold transition-all duration-200 ${labelClass}`}>{item.label}</span>
              <item.icon className="h-5 w-5 shrink-0" />
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex h-11 items-center justify-between gap-3 rounded-2xl px-3 text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <span className={`truncate text-sm font-bold transition-all duration-200 ${labelClass}`}>Log Out</span>
          <LogOut className="h-5 w-5 shrink-0" />
        </button>
        </div>
      </div>
    </aside>
  );
}
