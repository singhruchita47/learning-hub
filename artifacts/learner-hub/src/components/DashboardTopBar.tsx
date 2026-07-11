import { Bell, LogOut, Search } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

interface DashboardTopBarProps {
  name: string;
  role: "Faculty" | "Admin";
  accent: "emerald" | "violet";
  onLogout?: () => void;
}

const accentClasses = {
  emerald: "bg-emerald-600 shadow-emerald-600/20",
  violet: "bg-violet-600 shadow-violet-600/20",
};

export default function DashboardTopBar({ name, role, accent, onLogout }: DashboardTopBarProps) {
  const { query, setQuery } = useSearch();
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl md:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-4">
        <div className="relative hidden w-full max-w-xl md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search students, courses, assignments..."
            className="h-11 w-full rounded-2xl border border-gray-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div className="relative block flex-1 md:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="h-10 w-full rounded-2xl border border-gray-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-lg ${accentClasses[accent]}`}>
              {initials || role.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-extrabold text-slate-900">{name}</p>
              <p className="text-[11px] font-semibold text-slate-500">{role} Profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-xs font-extrabold text-red-600 transition-all hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
