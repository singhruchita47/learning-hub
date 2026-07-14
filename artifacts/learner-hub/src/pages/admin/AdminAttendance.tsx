import { useEffect, useState } from "react";
import { UserCheck, Search, Filter, Download } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  date: string;
  status: "present" | "absent";
  markedAt: string;
}

export default function AdminAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchAttendance();
  }, []);

  async function fetchAttendance() {
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/attendance`);
      if (res.ok) {
        const data = await res.json() as { attendance: AttendanceRecord[] };
        setRecords(data.attendance || []);
      }
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  const presentCount = records.filter(r => r.status === "present").length;
  const absentCount = records.filter(r => r.status === "absent").length;
  const total = presentCount + absentCount;
  const attendanceRate = total === 0 ? 0 : Math.round((presentCount / total) * 100);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Attendance</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Monitor student attendance across all courses and faculties.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition shadow-sm">
          <Download className="h-4.5 w-4.5" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Average Attendance</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{attendanceRate}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Total Present Marks</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{presentCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Total Absent Marks</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{absentCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-violet-600" />
            <h3 className="text-sm font-black text-slate-900">Recent Attendance Logs</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student..."
                className="h-8 rounded-lg border border-slate-200 pl-8 pr-3 text-xs font-bold outline-none focus:border-violet-400"
              />
            </div>
            <button className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-sm font-bold text-slate-400">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-slate-400">No attendance records found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Student Name</th>
                <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Email/ID</th>
                <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Course</th>
                <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3 font-bold text-slate-900">{r.studentName || "Unknown"}</td>
                  <td className="px-5 py-3 font-semibold text-slate-500">{r.studentId}</td>
                  <td className="px-5 py-3 font-black text-violet-600">{r.courseCode}</td>
                  <td className="px-5 py-3 font-bold text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                      r.status === "present" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
