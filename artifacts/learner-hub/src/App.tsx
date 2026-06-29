import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

// Pages
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Resources from "@/pages/Resources";
import Quizzes from "@/pages/Quizzes";
import Assignments from "@/pages/Assignments";
import Community from "@/pages/Community";
import Leaderboard from "@/pages/Leaderboard";
import Calendar from "@/pages/Calendar";
import Certificates from "@/pages/Certificates";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 md:pl-20 min-w-0">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/courses" component={Courses} />
        <Route path="/resources" component={Resources} />
        <Route path="/quizzes" component={Quizzes} />
        <Route path="/assignments" component={Assignments} />
        <Route path="/community" component={Community} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/certificates" component={Certificates} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
