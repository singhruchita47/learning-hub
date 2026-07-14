import { useEffect, useState } from "react";
import { Plus, Users, BookOpen, BarChart2 } from "lucide-react";
import { ACADEMIC_API_BASE, API_ROOT } from "@/lib/api";

const ADMIN_API_BASE = `${API_ROOT}/admin`;

interface Course {
  _id?: string;
  code: string;
  title: string;
  teacher: string;
  students?: number;
  progress?: number;
  status?: string;
}

export default function AdminCourses({ adminName }: { adminName: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculties, setFaculties] = useState<{name: string, _id: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add course state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ code: "", title: "", themeColor: "Purple (#7130a1)", teacher: "" });
  const [addSaving, setAddSaving] = useState(false);

  useEffect(() => {
    void loadCourses();
    void loadFaculties();
  }, []);

  async function loadFaculties() {
    try {
      const res = await fetch(`${ADMIN_API_BASE}/users`);
      const data = await res.json() as { users: any[] };
      const facultyUsers = (data.users || []).filter(u => u.role === "faculty");
      setFaculties(facultyUsers);
      if (facultyUsers.length > 0) {
        setNewForm(prev => ({ ...prev, teacher: facultyUsers[0].name }));
      }
    } catch {
      // Ignore errors for now
    }
  }

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await fetch(`${ADMIN_API_BASE}/courses`);
      const data = await res.json() as { courses: Course[] };
      setCourses(data.courses || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  async function addCourse() {
    if (!newForm.code.trim() || !newForm.title.trim()) return;
    setAddSaving(true);
    try {
      await fetch(`${ACADEMIC_API_BASE}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newForm, teacher: newForm.teacher || adminName, students: 0, progress: 0 }),
      });
      setShowAddForm(false);
      setNewForm({ code: "", title: "", themeColor: "Purple (#7130a1)", teacher: faculties.length > 0 ? faculties[0].name : "" });
      void loadCourses();
    } catch {
      alert("Failed to create course.");
    } finally {
      setAddSaving(false);
    }
  }

  // Group courses by faculty
  const facultyStats = courses.reduce((acc, course) => {
    acc[course.teacher] = (acc[course.teacher] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Courses & Faculty</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Track faculty uploads and manage institution-wide courses.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition shadow-md shadow-violet-200"
        >
          <Plus className="h-4.5 w-4.5" /> Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Total Courses</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{courses.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Active Faculty</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{Object.keys(facultyStats).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BarChart2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Avg. Progress</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {courses.length ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) : 0}%
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <div className="h-4 w-1 rounded-full bg-violet-600" />
          <h3 className="text-sm font-black text-slate-900">Course Registry</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-sm font-bold text-slate-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-slate-400">No courses found in the system.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Course Code & Title</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Instructor</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Enrolled Students</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Overall Progress</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id || course.code} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-5 py-4">
                    <div className="font-black text-violet-600">{course.code}</div>
                    <div className="font-bold text-slate-900">{course.title}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {course.teacher.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{course.teacher}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      course.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      course.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {course.status || 'approved'}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-600">{course.students || 0}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${course.progress || 0}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{course.progress || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <h2 className="mb-1 text-xl font-black text-slate-900">Create New Course</h2>
            <p className="mb-6 text-xs font-semibold text-slate-500">Add a new course to the university registry.</p>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS101"
                  value={newForm.code}
                  onChange={(e) => setNewForm({ ...newForm, code: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Programming"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Theme Color</label>
                <select
                  value={newForm.themeColor}
                  onChange={(e) => setNewForm({ ...newForm, themeColor: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  <option>Purple (#7130a1)</option>
                  <option>Blue (#3b82f6)</option>
                  <option>Green (#10b981)</option>
                  <option>Rose (#f43f5e)</option>
                  <option>Orange (#f97316)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Assign Faculty</label>
                <select
                  value={newForm.teacher}
                  onChange={(e) => setNewForm({ ...newForm, teacher: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  {faculties.length === 0 && <option value="">No faculty available</option>}
                  {faculties.map((f) => (
                    <option key={f._id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={addCourse}
                disabled={addSaving}
                className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition disabled:opacity-50"
              >
                {addSaving ? "Creating..." : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
