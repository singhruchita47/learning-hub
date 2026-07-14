import { useEffect, useState } from "react";
import { UserCheck, Search, Filter, Download, Users, UsersIcon, Check, X, ShieldAlert } from "lucide-react";
import { API_ROOT } from "@/lib/api";

interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  date: string;
  status: "present" | "absent";
  markedAt: string;
}

interface FacultyUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface FacultyAttendanceRecord {
  _id: string;
  facultyId: string;
  facultyName: string;
  date: string;
  status: "present" | "absent";
  markedAt: string;
}

export default function AdminAttendance() {
  const [activeTab, setActiveTab] = useState<"students" | "faculty">("students");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Student state
  const [studentRecords, setStudentRecords] = useState<AttendanceRecord[]>([]);

  // Faculty state
  const [facultyList, setFacultyList] = useState<FacultyUser[]>([]);
  const [facultyRecords, setFacultyRecords] = useState<FacultyAttendanceRecord[]>([]);
  const [updatingFacultyId, setUpdatingFacultyId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    void loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "students") {
        const res = await fetch(`${API_ROOT}/attendance`);
        if (res.ok) {
          const data = await res.json() as { attendance: AttendanceRecord[] };
          setStudentRecords(data.attendance || []);
        }
      } else {
        // Load faculty users & their attendance
        const [usersRes, attRes] = await Promise.all([
          fetch(`${API_ROOT}/admin/users`),
          fetch(`${API_ROOT}/attendance/faculty?date=${todayStr}`)
        ]);

        if (usersRes.ok) {
          const uData = await usersRes.json() as { users: any[] };
          const fac = (uData.users || []).filter(u => u.role === "faculty");
          setFacultyList(fac);
        }

        if (attRes.ok) {
          const aData = await attRes.json() as { attendance: FacultyAttendanceRecord[] };
          setFacultyRecords(aData.attendance || []);
        }
      }
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
    }
  }

  // Student Stats
  const studentPresentCount = studentRecords.filter(r => r.status === "present").length;
  const studentAbsentCount = studentRecords.filter(r => r.status === "absent").length;
  const studentTotal = studentPresentCount + studentAbsentCount;
  const studentAttendanceRate = studentTotal === 0 ? 0 : Math.round((studentPresentCount / studentTotal) * 100);

  // Faculty Stats (For today)
  const facultyPresentCount = facultyList.filter(f => {
    const record = facultyRecords.find(r => r.facultyId === f.email);
    return record?.status === "present";
  }).length;
  const facultyAbsentCount = facultyList.filter(f => {
    const record = facultyRecords.find(r => r.facultyId === f.email);
    return record?.status === "absent";
  }).length;
  const facultyUnmarkedCount = facultyList.length - (facultyPresentCount + facultyAbsentCount);

  // Student Export
  function handleStudentExport() {
    if (studentRecords.length === 0) {
      alert("No attendance records found to export.");
      return;
    }
    const headers = ["Student ID", "Student Name", "Course Code", "Date", "Status", "Marked At"];
    const csvRows = [
      headers.join(","),
      ...studentRecords.map(r => [
        `"${(r.studentId || "").replace(/"/g, '""')}"`,
        `"${(r.studentName || "").replace(/"/g, '""')}"`,
        `"${(r.courseCode || "").replace(/"/g, '""')}"`,
        `"${r.date}"`,
        `"${r.status}"`,
        `"${new Date(r.markedAt).toLocaleString()}"`
      ].join(","))
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_attendance_report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Faculty Export
  function handleFacultyExport() {
    if (facultyList.length === 0) {
      alert("No faculty members found to export.");
      return;
    }
    const headers = ["Faculty Email", "Faculty Name", "Date", "Status", "Marked At"];
    const csvRows = [
      headers.join(","),
      ...facultyList.map(f => {
        const record = facultyRecords.find(r => r.facultyId === f.email);
        const status = record?.status || "unmarked";
        const markedAt = record?.markedAt ? new Date(record.markedAt).toLocaleString() : "N/A";
        return [
          `"${f.email.replace(/"/g, '""')}"`,
          `"${f.name.replace(/"/g, '""')}"`,
          `"${todayStr}"`,
          `"${status}"`,
          `"${markedAt}"`
        ].join(",");
      })
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faculty_attendance_report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Mark Faculty Attendance
  async function handleMarkFaculty(faculty: FacultyUser, status: "present" | "absent") {
    setUpdatingFacultyId(faculty.email);
    try {
      const res = await fetch(`${API_ROOT}/attendance/faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: faculty.email,
          facultyName: faculty.name,
          date: todayStr,
          status
        })
      });
      if (res.ok) {
        // Reload today's records
        const attRes = await fetch(`${API_ROOT}/attendance/faculty?date=${todayStr}`);
        if (attRes.ok) {
          const aData = await attRes.json() as { attendance: FacultyAttendanceRecord[] };
          setFacultyRecords(aData.attendance || []);
        }
      }
    } catch {
      alert("Failed to record attendance.");
    } finally {
      setUpdatingFacultyId(null);
    }
  }

  const filteredStudents = studentRecords.filter(r => 
    (r.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.studentId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.courseCode || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = facultyList.filter(f => 
    (f.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Attendance</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Monitor & mark attendance across all students and faculty members.</p>
        </div>
        <button
          onClick={activeTab === "students" ? handleStudentExport : handleFacultyExport}
          className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <Download className="h-4.5 w-4.5" /> Export {activeTab === "students" ? "Student" : "Faculty"} Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => { setActiveTab("students"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-black transition-all border-b-2 ${activeTab === "students" ? "border-violet-600 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          Student Attendance
        </button>
        <button
          onClick={() => { setActiveTab("faculty"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-black transition-all border-b-2 ${activeTab === "faculty" ? "border-violet-600 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          Faculty Attendance (Today)
        </button>
      </div>

      {/* Stats Cards */}
      {activeTab === "students" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-500">Average Attendance</h3>
            </div>
            <p className="text-3xl font-black text-slate-900">{studentAttendanceRate}%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-500">Total Present Marks</h3>
            </div>
            <p className="text-3xl font-black text-slate-900">{studentPresentCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <div className="h-3 w-3 rounded-full bg-red-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-500">Total Absent Marks</h3>
            </div>
            <p className="text-3xl font-black text-slate-900">{studentAbsentCount}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-500">Total Faculty Members</h3>
            </div>
            <p className="text-3xl font-black text-slate-900">{facultyList.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-500">Faculty Present Today</h3>
            </div>
            <p className="text-3xl font-black text-slate-900">{facultyPresentCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <div className="h-3 w-3 rounded-full bg-red-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-500">Faculty Absent Today</h3>
            </div>
            <p className="text-3xl font-black text-slate-900">{facultyAbsentCount}</p>
          </div>
        </div>
      )}

      {/* List section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-violet-600" />
            <h3 className="text-sm font-black text-slate-900">
              {activeTab === "students" ? "Recent Student Attendance Logs" : "Faculty Presence Checklist"}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === "students" ? "Search student or course..." : "Search faculty..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 pl-8 pr-3 text-xs font-bold outline-none focus:border-violet-400 w-44 md:w-60"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-sm font-bold text-slate-400">Loading records...</div>
        ) : activeTab === "students" ? (
          filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-sm font-bold text-slate-400">No student attendance records found.</div>
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
                {filteredStudents.map((r) => (
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
          )
        ) : (
          filteredFaculty.length === 0 ? (
            <div className="p-8 text-center text-sm font-bold text-slate-400">No faculty members found. Create faculty users first.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Faculty Name</th>
                  <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Email ID</th>
                  <th className="text-center px-5 py-3 text-xs font-black text-slate-500 uppercase">Today's Status</th>
                  <th className="text-right px-5 py-3 text-xs font-black text-slate-500 uppercase">Mark Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((f) => {
                  const record = facultyRecords.find(r => r.facultyId === f.email);
                  const isPresent = record?.status === "present";
                  const isAbsent = record?.status === "absent";
                  const isUpdating = updatingFacultyId === f.email;

                  return (
                    <tr key={f.id} className="border-b border-slate-55 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{f.name}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-500">{f.email}</td>
                      <td className="px-5 py-3.5 text-center">
                        {isPresent ? (
                          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                            Present
                          </span>
                        ) : isAbsent ? (
                          <span className="rounded-md bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600">
                            Absent
                          </span>
                        ) : (
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                            Unmarked
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            disabled={isUpdating}
                            onClick={() => handleMarkFaculty(f, "present")}
                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-black transition-colors ${
                              isPresent
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-250"
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" /> Present
                          </button>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleMarkFaculty(f, "absent")}
                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-black transition-colors ${
                              isAbsent
                                ? "bg-red-600 text-white shadow-sm"
                                : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-250"
                            }`}
                          >
                            <X className="h-3.5 w-3.5" /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
