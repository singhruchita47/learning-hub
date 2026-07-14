import { useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import FacultyNav from "@/components/FacultyNav";
import AdminNav from "@/components/AdminNav";
import Login from "@/pages/Login";
import { SearchProvider } from "@/context/SearchContext";
import { AcademicProvider } from "@/context/AcademicContext";

// Pages
import Dashboard from "@/pages/Dashboard";
import FacultyDashboard from "@/pages/FacultyDashboard";
import FacultyCodingQuestions from "@/pages/FacultyCodingQuestions";
import FacultyCreateAssignment from "@/pages/FacultyCreateAssignment";
import FacultyCreateTest from "@/pages/FacultyCreateTest";
import FacultyQuizMarks from "@/pages/FacultyQuizMarks";
import FacultySubmissions from "@/pages/FacultySubmissions";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminPlacements from "@/pages/admin/AdminPlacements";
import AdminCurriculum from "@/pages/admin/AdminCurriculum";
import AdminAttendance from "@/pages/admin/AdminAttendance";
import AdminCalendar from "@/pages/admin/AdminCalendar";
import AdminLeaderboard from "@/pages/admin/AdminLeaderboard";
import AdminReports from "@/pages/admin/AdminReports";
import AdminSystem from "@/pages/admin/AdminSystem";
import AdminAnnouncements from "@/pages/admin/AdminAnnouncements";
import AdminAllocations from "@/pages/admin/AdminAllocations";
import AdminBadges from "@/pages/admin/AdminBadges";
import AdminQuizCoding from "@/pages/admin/AdminQuizCoding";
import AdminAssignments from "@/pages/admin/AdminAssignments";
import CourseViewer from "@/pages/CourseViewer";
import Courses from "@/pages/Courses";
import Resources from "@/pages/Resources";
import Quizzes from "@/pages/Quizzes";
import CodingPractice from "@/pages/CodingPractice";
import Assignments from "@/pages/Assignments";
import Community from "@/pages/Community";
import Leaderboard from "@/pages/Leaderboard";
import Calendar from "@/pages/Calendar";
import Classes from "@/pages/Classes";
import Certificates from "@/pages/Certificates";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Feedback from "@/pages/Feedback";
import ResumeGenerator from "@/pages/ResumeGenerator";
import WebDevPlayer from "@/pages/WebDevPlayer";
import StudentAttendance from "@/pages/StudentAttendance";
import FacultyAttendance from "@/pages/FacultyAttendance";
import FacultyCourses from "@/pages/FacultyCourses";
import FacultyLiveClasses from "@/pages/FacultyLiveClasses";

const queryClient = new QueryClient();

type Role = "student" | "faculty" | "admin";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

function HomeDashboard({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  if (user.role === "faculty") return <FacultyDashboard user={user} onLogout={onLogout} />;
  if (user.role === "admin")   return <AdminDashboard user={user} onLogout={onLogout} />;
  return <Dashboard />;
}

function Layout({ children, user, onLogout }: { children: React.ReactNode; user: AuthUser; onLogout: () => void }) {
  const isStudent = user.role === "student";
  const [path] = useLocation();
  const isFocusedAttempt =
    path.startsWith("/quizzes/") ||
    path.startsWith("/coding-practice/") ||
    path.startsWith("/courses/");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <div className="flex min-h-screen flex-col">
        {isStudent && !isFocusedAttempt && <Navbar user={user} onLogout={onLogout} />}
        <main className="min-h-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function FacultyLayout({ children, user, onLogout }: { children: React.ReactNode; user: AuthUser; onLogout: () => void }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <FacultyNav name={user.name} onLogout={onLogout}>
        {children}
      </FacultyNav>
    </Layout>
  );
}

function AdminLayout({ children, user, onLogout }: { children: React.ReactNode; user: AuthUser; onLogout: () => void }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <AdminNav name={user.name} onLogout={onLogout}>
        {children}
      </AdminNav>
    </Layout>
  );
}

function Router({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  if (user.role === "faculty") {
    return (
      <FacultyLayout user={user} onLogout={onLogout}>
        <Switch>
          <Route path="/" component={() => <FacultyDashboard user={user} onLogout={onLogout} />} />
          <Route path="/faculty/courses" component={FacultyCourses} />
          <Route path="/faculty/classes" component={FacultyLiveClasses} />
          <Route path="/faculty/notices" component={() => <FacultyDashboard user={user} onLogout={onLogout} initialTab="notices" />} />
          <Route path="/faculty/create-assignment" component={FacultyCreateAssignment} />
          <Route path="/faculty/create-test" component={FacultyCreateTest} />
          <Route path="/faculty/submissions" component={FacultySubmissions} />
          <Route path="/assignments" component={FacultySubmissions} />
          <Route path="/faculty/quiz-marks" component={FacultyQuizMarks} />
          <Route path="/faculty/coding-questions" component={FacultyCodingQuestions} />
          <Route path="/faculty/analytics" component={() => <FacultyDashboard user={user} onLogout={onLogout} />} />
          <Route path="/faculty/attendance" component={FacultyAttendance} />
          <Route component={NotFound} />
        </Switch>
      </FacultyLayout>
    );
  }

  if (user.role === "admin") {
    return (
      <AdminLayout user={user} onLogout={onLogout}>
        <Switch>
          <Route path="/" component={() => <AdminDashboard user={user} onLogout={onLogout} />} />
          <Route path="/admin/dashboard" component={() => <AdminDashboard user={user} onLogout={onLogout} />} />
          <Route path="/admin/reports" component={AdminReports} />
          <Route path="/admin/system" component={AdminSystem} />
          <Route path="/admin/announcements" component={AdminAnnouncements} />
          <Route path="/admin/allocations" component={AdminAllocations} />
          <Route path="/admin/courses" component={() => <AdminCourses adminName={user.name} />} />
          <Route path="/admin/placements" component={AdminPlacements} />
          <Route path="/admin/curriculum" component={AdminCurriculum} />
          <Route path="/admin/attendance" component={AdminAttendance} />
          <Route path="/admin/calendar" component={AdminCalendar} />
          <Route path="/admin/leaderboard" component={AdminLeaderboard} />
          <Route path="/admin/badges" component={AdminBadges} />
          <Route path="/admin/quiz-coding" component={AdminQuizCoding} />
          <Route path="/admin/assignments" component={AdminAssignments} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <Switch>
        <Route path="/" component={() => <HomeDashboard user={user} onLogout={onLogout} />} />
        <Route path="/courses/web-dev" component={WebDevPlayer} />
        <Route path="/courses/:id" component={CourseViewer} />
        <Route path="/courses" component={Courses} />
        <Route path="/resources" component={Resources} />
        <Route path="/quizzes/:quizId" component={Quizzes} />
        <Route path="/quizzes" component={Quizzes} />
        <Route path="/coding-practice/:problemId" component={CodingPractice} />
        <Route path="/coding-practice" component={CodingPractice} />
        <Route path="/assignments" component={() => <Assignments role={user.role} />} />
        <Route path="/classes" component={Classes} />
        <Route path="/community" component={Community} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/attendance" component={StudentAttendance} />
        <Route path="/certificates" component={Certificates} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/resume-generator" component={ResumeGenerator} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = window.localStorage.getItem("learningHubUser");
    if (!saved) return null;

    try {
      return JSON.parse(saved) as AuthUser;
    } catch {
      window.localStorage.removeItem("learningHubUser");
      return null;
    }
  });

  function handleLogin(nextUser: AuthUser) {
    window.localStorage.setItem("learningHubUser", JSON.stringify(nextUser));
    window.history.pushState({}, "", import.meta.env.BASE_URL || "/");
    setUser(nextUser);
  }

  function handleLogout() {
    window.localStorage.removeItem("learningHubUser");
    window.history.pushState({}, "", import.meta.env.BASE_URL || "/");
    setUser(null);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SearchProvider>
          <AcademicProvider user={user}>
            {user ? (
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router user={user} onLogout={handleLogout} />
              </WouterRouter>
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </AcademicProvider>
          <Toaster />
        </SearchProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
