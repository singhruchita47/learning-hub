import { Link, useLocation } from "wouter";
import { Search, Bell, MessageSquare, Menu, LogOut, ChevronDown } from "lucide-react";
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

interface AuthUser {
  name: string;
  role: "student" | "faculty" | "admin";
}

const roleColors: Record<string, string> = {
  student: "bg-primary/10 text-primary",
  faculty: "bg-emerald-100 text-emerald-700",
  admin:   "bg-violet-100 text-violet-700",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Navbar({ user, onLogout }: { user?: AuthUser; onLogout?: () => void }) {
  const [location] = useLocation();

  const navLinks = [
    { label: "Dashboard",  href: "/" },
    { label: "Courses",    href: "/courses" },
    { label: "Resources",  href: "/resources" },
    { label: "Quizzes",    href: "/quizzes" },
    { label: "Assignments",href: "/assignments" },
    { label: "Community",  href: "/community" },
  ];

  const initials = user ? getInitials(user.name) : "AS";
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
                <Link key={link.href} href={link.href} className={`text-lg font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
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
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-semibold transition-colors hover:text-primary relative
              ${location === link.href ? "text-primary" : "text-muted-foreground"}
            `}
          >
            {link.label}
            {location === link.href && (
              <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block w-44 lg:w-56">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full rounded-full bg-muted/50 pl-8 focus-visible:bg-white text-sm" />
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive border-2 border-white" />
        </Button>

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
            <DropdownMenuItem
              onClick={onLogout}
              className="text-destructive focus:text-destructive cursor-pointer font-semibold"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
