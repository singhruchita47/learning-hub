import { Link, useLocation } from "wouter";
import { Search, Bell, MessageSquare, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Resources", href: "/resources" },
    { label: "Quizzes", href: "/quizzes" },
    { label: "Assignments", href: "/assignments" },
    { label: "Community", href: "/community" },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
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
            <span className="font-bold">LH</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">Learner Hub</span>
        </Link>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full rounded-full bg-muted/50 pl-8 focus-visible:bg-white" />
        </div>
        
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive border-2 border-white" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-2 ring-primary/10">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">AS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
