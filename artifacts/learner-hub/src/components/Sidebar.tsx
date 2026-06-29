import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  ClipboardList, 
  HelpCircle, 
  CalendarDays, 
  Trophy, 
  Users, 
  Award, 
  User, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
];

const bottomNavItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center border-r bg-white py-6 md:flex">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
        <span className="font-bold text-lg">LH</span>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-4 w-full">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={item.href} className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                  )}
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-4 w-full">
        {bottomNavItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={item.href} className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive mt-2">
              <LogOut className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-destructive">
            Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
