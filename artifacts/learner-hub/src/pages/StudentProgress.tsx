import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Award, Calendar, BookOpen, Target, CheckCircle2 } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const MOCK_GPA_DATA = [
  { semester: "Sem 1", sgpa: 8.5, cgpa: 8.5 },
  { semester: "Sem 2", sgpa: 8.9, cgpa: 8.7 },
  { semester: "Sem 3", sgpa: 9.1, cgpa: 8.8 },
  { semester: "Sem 4", sgpa: 9.4, cgpa: 9.0 },
];

const MOCK_ATTENDANCE_DATA = [
  { month: "Aug", present: 22, absent: 2 },
  { month: "Sep", present: 20, absent: 4 },
  { month: "Oct", present: 23, absent: 1 },
  { month: "Nov", present: 19, absent: 3 },
];

const MOCK_SKILLS = [
  { skill: "Data Structures", level: 90 },
  { skill: "Web Dev", level: 85 },
  { skill: "Machine Learning", level: 70 },
  { skill: "Algorithms", level: 80 },
];

export default function StudentProgress() {
  const [loading, setLoading] = useState(true);

  // In a real scenario, we'd fetch these from the API.
  // Using mock data here for the UI demonstration as requested.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto space-y-6">
      {/* Title Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Progress</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Track your academic growth and performance metrics over time.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 shadow-sm">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-black text-emerald-700">Top 10% of Batch</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Current CGPA", value: "9.0", icon: Award, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Overall Attendance", value: "89%", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Courses Completed", value: "12", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Goals Reached", value: "8/10", icon: Target, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* GPA Trend Chart */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-800 mb-6">Academic Trajectory (GPA)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_GPA_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} domain={[7, 10]} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="sgpa" name="SGPA" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cgpa" name="CGPA" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Area Chart */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-800 mb-6">Monthly Attendance Trends</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ATTENDANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="present" name="Present Days" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Radar / Bar */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-black text-slate-800 mb-6">Core Competencies Mastery</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SKILLS} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#475569' }} width={140} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Bar dataKey="level" name="Mastery (%)" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
