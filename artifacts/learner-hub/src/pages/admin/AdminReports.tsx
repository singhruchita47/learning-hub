import { Download, Clock, CheckCircle2, Activity, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const enrollmentData = [
  { month: "Jan", students: 180 }, { month: "Feb", students: 220 }, { month: "Mar", students: 260 },
  { month: "Apr", students: 310 }, { month: "May", students: 380 }, { month: "Jun", students: 420 },
  { month: "Jul", students: 480 },
];
const activityData = [
  { day: "Mon", logins: 320, submissions: 45 }, { day: "Tue", logins: 290, submissions: 62 },
  { day: "Wed", logins: 450, submissions: 88 }, { day: "Thu", logins: 380, submissions: 72 },
  { day: "Fri", logins: 410, submissions: 95 }, { day: "Sat", logins: 150, submissions: 20 },
  { day: "Sun", logins: 90,  submissions: 12 },
];

export default function AdminReports() {
  return (
    <div className="flex-1 px-4 md:px-8 py-6 max-w-[1540px] mx-auto w-full">
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Reports</h2>
          <Button size="sm" className="gap-2 rounded-xl font-bold border-slate-200" variant="outline"><Download className="h-4 w-4" /> Export Report</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4">Student Enrollment Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="students" stroke="#6366F1" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4">Weekly Platform Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="logins" fill="#6366F1" radius={[6, 6, 0, 0]} name="Logins" />
                <Bar dataKey="submissions" fill="#10B981" radius={[6, 6, 0, 0]} name="Submissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { label: "Avg. Session Time", value: "42 min", icon: Clock, color: "#6366F1" },
            { label: "Course Completion Rate", value: "68%", icon: CheckCircle2, color: "#10B981" },
            { label: "Daily Active Users", value: "427", icon: Activity, color: "#F59E0B" },
            { label: "New Registrations (Week)", value: "+34", icon: UserPlus, color: "#8B5CF6" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-2" style={{ background: `${m.color}18` }}>
                <m.icon className="h-5 w-5" style={{ color: m.color }} />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{m.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
