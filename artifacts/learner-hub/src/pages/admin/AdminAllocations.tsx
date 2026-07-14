import { useState, useEffect } from "react";
import { Link2, Users, BookOpen, GraduationCap, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMIC_API_BASE } from "@/lib/api";

export default function AdminAllocations() {
  const [students, setStudents] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [facStudent, setFacStudent] = useState("");
  const [facFaculty, setFacFaculty] = useState("");
  const [courseFaculty, setCourseFaculty] = useState("");
  const [courseCourse, setCourseCourse] = useState("");

  const [logs, setLogs] = useState<{id: number; type: string; text: string; time: string}[]>([]);

  useEffect(() => {
    fetch(`${ACADEMIC_API_BASE}/admin/users`)
      .then(r => r.json())
      .then(d => {
        if (d.users) {
          setStudents(d.users.filter((u: any) => u.role === "student"));
          setFaculty(d.users.filter((u: any) => u.role === "faculty"));
        }
      })
      .catch(() => {});
      
    fetch(`${ACADEMIC_API_BASE}/admin/courses`)
      .then(r => r.json())
      .then(d => {
        if (d.courses) setCourses(d.courses);
      })
      .catch(() => {});
  }, []);

  const handleAssignStudent = async () => {
    if (!facStudent || !facFaculty) return;
    try {
      await fetch(`${ACADEMIC_API_BASE}/admin/users/${facStudent}/mentor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId: facFaculty })
      });
      const sName = students.find(s => s._id === facStudent)?.name;
      const fName = faculty.find(f => f._id === facFaculty)?.name;
      setLogs(p => [{ id: Date.now(), type: "Student-Faculty", text: `Assigned ${sName} to ${fName}`, time: "Just now" }, ...p]);
    } catch {}
    setFacStudent("");
    setFacFaculty("");
  };

  const handleAssignCourse = async () => {
    if (!courseFaculty || !courseCourse) return;
    try {
      await fetch(`${ACADEMIC_API_BASE}/admin/courses/${courseCourse}/faculty`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facultyId: courseFaculty })
      });
      const fName = faculty.find(f => f._id === courseFaculty)?.name;
      const cName = courses.find(c => c._id === courseCourse)?.name;
      setLogs(p => [{ id: Date.now(), type: "Faculty-Course", text: `Assigned ${fName} to ${cName}`, time: "Just now" }, ...p]);
    } catch {}
    setCourseFaculty("");
    setCourseCourse("");
  };

  return (
    <div className="flex-1 px-4 md:px-8 py-6 max-w-[1540px] mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Allocations & Assignments</h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">Assign faculty to courses, and map students to their respective mentors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Assignment Forms */}
        <div className="space-y-6">
          
          {/* Faculty to Course */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Assign Faculty to Course</h3>
                <p className="text-[10px] font-bold text-slate-400">Map a professor to teach a subject</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Select Faculty</label>
                <select value={courseFaculty} onChange={(e) => setCourseFaculty(e.target.value)} className="w-full text-sm font-bold text-slate-700 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 bg-slate-50/50">
                  <option value="">-- Choose Faculty --</option>
                  {faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Select Course</label>
                <select value={courseCourse} onChange={(e) => setCourseCourse(e.target.value)} className="w-full text-sm font-bold text-slate-700 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 bg-slate-50/50">
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title} ({c.code})</option>)}
                </select>
              </div>
              <Button onClick={handleAssignCourse} disabled={!courseFaculty || !courseCourse} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-bold shadow-md shadow-blue-200 gap-2">
                <Link2 className="h-4 w-4" /> Create Course Assignment
              </Button>
            </div>
          </div>

          {/* Student to Faculty (Mentor) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                <GraduationCap className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Assign Student to Mentor</h3>
                <p className="text-[10px] font-bold text-slate-400">Map a student to a faculty guide</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Select Student</label>
                <select value={facStudent} onChange={(e) => setFacStudent(e.target.value)} className="w-full text-sm font-bold text-slate-700 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-violet-500 bg-slate-50/50">
                  <option value="">-- Choose Student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} {s.branch ? `(${s.branch})` : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Select Faculty Mentor</label>
                <select value={facFaculty} onChange={(e) => setFacFaculty(e.target.value)} className="w-full text-sm font-bold text-slate-700 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500 bg-slate-50/50">
                  <option value="">-- Choose Faculty --</option>
                  {faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                </select>
              </div>
              <Button onClick={handleAssignStudent} disabled={!facStudent || !facFaculty} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 font-bold shadow-md shadow-violet-200 gap-2">
                <Link2 className="h-4 w-4" /> Create Mentor Assignment
              </Button>
            </div>
          </div>

        </div>

        {/* Right Column: Assignment Logs */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <History className="h-5 w-5 text-slate-600" />
            <h3 className="text-base font-extrabold text-slate-800">Recent Assignments Log</h3>
          </div>
          
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 items-start relative">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{log.text}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      log.type === "Faculty-Course" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-10 text-sm font-bold text-slate-400">
                No recent assignments found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
