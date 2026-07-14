import { useState, useEffect } from "react";
import { Plus, Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import { API_ROOT } from "@/lib/api";

const ADMIN_API = `${API_ROOT}/admin`;

interface StudentDetail {
  id: string;
  studentName: string;
  branch: string;
  course: string;
  enrollmentYear: string;
  status: "Active" | "Graduated" | "On Leave";
}

export default function AdminPlacements() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${ADMIN_API}/users`);
      const data = await res.json();
      if (data.users) {
        setStudents(data.users.filter((u: any) => u.role === "student"));
      }
    } catch {}
    setLoading(false);
  };
  
  const [branches, setBranches] = useState<string[]>(["Computer Science", "Information Tech", "Electronics", "Mechanical"]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  
  const [newStudent, setNewStudent] = useState<Omit<StudentDetail, "id">>({
    studentName: "", branch: "Computer Science", course: "B.Tech", enrollmentYear: "2024", status: "Active"
  });
  const [newBranch, setNewBranch] = useState("");

  const [addMode, setAddMode] = useState<"single" | "bulk">("single");
  const [bulkData, setBulkData] = useState("");

  const handleAddStudent = async () => {
    if (!newStudent.studentName || !newStudent.course) return;
    try {
      const res = await fetch(`${ADMIN_API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStudent.studentName,
          email: `${newStudent.studentName.toLowerCase().replace(/\s+/g, ".")}@learning.hub`,
          password: "student123",
          role: "student",
          branch: newStudent.branch,
          course: newStudent.course,
          enrollmentYear: newStudent.enrollmentYear
        })
      });
      if (res.ok) {
        fetchStudents();
      }
    } catch {}
    setShowAddModal(false);
    setNewStudent({ studentName: "", branch: branches[0], course: "B.Tech", enrollmentYear: "2024", status: "Active" });
  };

  const handleBulkAdd = async () => {
    if (!bulkData.trim()) return;
    try {
      const lines = bulkData.split("\n").map(l => l.trim()).filter(Boolean);
      const usersToInsert = lines.map(line => {
        const [name, branch, course, enrollmentYear] = line.split(",").map(s => s.trim());
        return { name, branch, course, enrollmentYear };
      });
      
      const res = await fetch(`${ADMIN_API}/users/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: usersToInsert })
      });
      if (res.ok) fetchStudents();
    } catch {}
    setShowAddModal(false);
    setBulkData("");
    setAddMode("single");
  };

  const handleAddBranch = () => {
    if (!newBranch.trim() || branches.includes(newBranch)) return;
    setBranches([...branches, newBranch]);
    setShowBranchModal(false);
    setNewBranch("");
  };

  return (
    <div className="flex-1 px-4 md:px-8 py-6 max-w-[1540px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Students &amp; Bulk Import</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Manage student enrollments, branches, and bulk import from CSV.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBranchModal(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-200 transition"
          >
            <TrendingUp className="h-4.5 w-4.5" /> Add Branch
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition shadow-md shadow-violet-200"
          >
            <Plus className="h-4.5 w-4.5" /> Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Total Students</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{students.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Courses Enrolled</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{new Set(students.map(s => s.course)).size}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500">Active Branches</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{branches.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <div className="h-4 w-1 rounded-full bg-violet-600" />
          <h3 className="text-sm font-black text-slate-900">Student Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Branch</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3 text-center">Enrollment Year</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-5 text-center text-xs font-bold text-slate-500">Loading...</td></tr>
              ) : students.length > 0 ? students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-50/50 transition border-b border-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-700">
                        {student.name ? student.name.substring(0, 2).toUpperCase() : "?"}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{student.name}</div>
                        <div className="text-[10px] font-bold text-slate-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {student.branch || "N/A"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[10px] font-black text-slate-700">{student.course || "N/A"}</td>
                  <td className="px-5 py-4 text-center text-[10px] font-bold text-slate-500">{student.enrollmentYear || "N/A"}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      student.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      student.status === "banned" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {student.status || "active"}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-5 text-center text-xs font-bold text-slate-500">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <h2 className="mb-1 text-xl font-black text-slate-900">Add Students</h2>
            <div className="flex gap-4 mb-6 mt-2 border-b border-slate-100 pb-2">
              <button onClick={() => setAddMode("single")} className={`text-sm font-bold pb-2 border-b-2 transition ${addMode === "single" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-400 hover:text-slate-600"}`}>Single Entry</button>
              <button onClick={() => setAddMode("bulk")} className={`text-sm font-bold pb-2 border-b-2 transition ${addMode === "bulk" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-400 hover:text-slate-600"}`}>Bulk Upload</button>
            </div>
            
            {addMode === "single" ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Student Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newStudent.studentName}
                    onChange={e => setNewStudent({...newStudent, studentName: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Branch</label>
                  <select
                    value={newStudent.branch}
                    onChange={e => setNewStudent({...newStudent, branch: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500"
                  >
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Course</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech"
                      value={newStudent.course}
                      onChange={e => setNewStudent({...newStudent, course: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Enrollment Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={newStudent.enrollmentYear}
                      onChange={e => setNewStudent({...newStudent, enrollmentYear: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">CSV Data</label>
                  <p className="text-[10px] text-slate-400 font-semibold mb-2">Format: Name, Branch, Course, Year (one per line)</p>
                  <textarea
                    rows={6}
                    placeholder="John Doe, Computer Science, B.Tech, 2024&#10;Jane Smith, Electronics, M.Tech, 2023"
                    value={bulkData}
                    onChange={e => setBulkData(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500 resize-none font-mono"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 transition">Cancel</button>
              <button onClick={addMode === "single" ? handleAddStudent : handleBulkAdd} className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition">
                {addMode === "single" ? "Add Student" : "Upload Bulk"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl">
            <h2 className="mb-1 text-xl font-black text-slate-900">Add New Branch</h2>
            <p className="mb-6 text-xs font-semibold text-slate-500">Create a new academic branch.</p>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Branch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Civil Engineering"
                  value={newBranch}
                  onChange={e => setNewBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowBranchModal(false)} className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 transition">Cancel</button>
              <button onClick={handleAddBranch} className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-black text-white hover:bg-slate-900 transition">Save Branch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
