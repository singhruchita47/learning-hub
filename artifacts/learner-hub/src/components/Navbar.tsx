import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, MessageSquare, Menu, LogOut, ChevronDown, CheckCircle2, BookOpen, Trophy, Calendar, Megaphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearch } from "@/context/SearchContext";

interface AuthUser {
  name: string;
  role: "student" | "faculty" | "admin";
}

const roleColors: Record<string, string> = {
  student: "bg-primary/10 text-primary",
  faculty: "bg-emerald-100 text-emerald-700",
  admin:   "bg-violet-100 text-violet-700",
};

const notifications = [
  { id: 1, icon: Calendar,     text: "Midterm Schedule Released",         sub: "Check your exam timetable",   time: "2 min ago",  read: false, color: "text-blue-500",   bg: "bg-blue-50" },
  { id: 2, icon: CheckCircle2, text: "Assignment 3 graded — CS302",        sub: "You scored 88/100",           time: "1 hr ago",   read: false, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: 3, icon: Trophy,       text: "You moved to Rank #3!",              sub: "Leaderboard updated",         time: "3 hrs ago",  read: false, color: "text-amber-500",  bg: "bg-amber-50" },
  { id: 4, icon: Megaphone,    text: "New announcement from Dr. Chen",     sub: "Assignment deadline extended", time: "Yesterday",  read: true,  color: "text-violet-500", bg: "bg-violet-50" },
  { id: 5, icon: BookOpen,     text: "Python Course: Module 4 unlocked",   sub: "Continue your learning",      time: "2 days ago", read: true,  color: "text-indigo-500", bg: "bg-indigo-50" },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Navbar({ user, onLogout }: { user?: AuthUser; onLogout?: () => void }) {
  const [location] = useLocation();
  const { query, setQuery } = useSearch();
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(
    new Set(notifications.filter((n) => n.read).map((n) => n.id))
  );

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAllRead = () => setReadIds(new Set(notifications.map((n) => n.id)));
  const markRead = (id: number) => setReadIds((prev) => new Set([...prev, id]));

  const navLinks = [
    { label: "Dashboard",   href: "/" },
    { label: "Courses",     href: "/courses" },
    { label: "Resources",   href: "/resources" },
    { label: "Quizzes",     href: "/quizzes" },
    { label: "Assignments", href: "/assignments" },
    { label: "Community",   href: "/community" },
  ];

  const initials  = user ? getInitials(user.name) : "AS";
  const avatarClass = user ? (roleColors[user.role] ?? roleColors.student) : roleColors.student;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`text-lg font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white md:hidden">
            <span className="font-bold text-xs">LH</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground hidden sm:inline-block">Learner Hub</span>
        </Link>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}
            className={`text-sm font-semibold transition-colors hover:text-primary relative ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
            {link.label}
            {location === link.href && (
              <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global search */}
        <div className="relative hidden sm:block w-44 lg:w-56">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full bg-muted/50 pl-8 focus-visible:bg-white text-sm"
          />
        </div>

        {/* Notification dropdown */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-extrabold text-white border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-2xl border border-border/50 p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
              <div>
                <p className="text-sm font-extrabold text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground font-medium">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs font-bold text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-border/30">
              {notifications.map((notif) => {
                const isRead = readIds.has(notif.id);
                return (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors ${!isRead ? "bg-primary/[0.03]" : ""}`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5 ${notif.bg}`}>
                      <notif.icon className={`h-4 w-4 ${notif.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-tight ${isRead ? "font-medium text-foreground/70" : "font-bold text-foreground"}`}>
                        {notif.text}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{notif.sub}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{notif.time}</p>
                    </div>
                    {!isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border/50 text-center">
              <button className="text-xs font-bold text-primary hover:underline">View all notifications</button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted/60 transition-colors outline-none">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-2 ring-primary/15">
                <AvatarFallback className={`text-xs font-extrabold ${avatarClass}`}>{initials}</AvatarFallback>
              </Avatar>
              {user && (
                <span className="hidden md:block text-sm font-bold text-foreground max-w-[90px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border border-border/50">
            {user && (
              <>
                <div className="px-3 py-2.5">
                  <p className="text-sm font-extrabold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize font-medium">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer font-medium">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer font-medium">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive cursor-pointer font-semibold">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
