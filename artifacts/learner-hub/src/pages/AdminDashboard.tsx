import { useState, useEffect } from "react";
import { Users, BookOpen, AlertTriangle, Link as LinkIcon, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMIC_API_BASE, API_ROOT } from "@/lib/api";

const ADMIN_API_BASE = `${API_ROOT}/admin`;

const analyticsCards = [
  { label: "Total Registrations", value: "1,248", change: "+12%", icon: Users,         color: "#6366F1", bg: "#EEF2FF" },
  { label: "Faculty Members",     value: "24",    change: "+2",   icon: Users,         color: "#10B981", bg: "#ECFDF5" },
  { label: "Active Courses",      value: "89",    change: "+5",   icon: BookOpen,      color: "#3B82F6", bg: "#EFF6FF" },
  { label: "System Alerts",       value: "3",     change: "!",    icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB" },
];

export default function AdminDashboard({ user }: { user: { name: string }; onLogout?: () => void }) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  // Add User State
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", role: "student", branch: "", course: "", enrollmentYear: "" });
  const [addSaving, setAddSaving] = useState(false);
  const [addedCredentials, setAddedCredentials] = useState<{email: string, password: string, role: string} | null>(null);

  useEffect(() => {
    fetch(`${ADMIN_API_BASE}/users`)
      .then(r => r.json())
      .then(d => { if (d.users) setUsersList(d.users); })
      .catch(() => {});
    fetch(`${ADMIN_API_BASE}/courses`)
      .then(r => r.json())
      .then(d => { if (d.courses) setCoursesList(d.courses); })
      .catch(() => {});
  }, []);

  const toggleBan = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";
    setUsersList(usersList.map(u => u._id === id ? { ...u, status: newStatus } : u));
    try {
      await fetch(`${ADMIN_API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {}
  };

  const handleApprove = async (id: string) => {
    setCoursesList(coursesList.map(c => c._id === id ? { ...c, status: "approved" } : c));
    try {
      await fetch(`${ADMIN_API_BASE}/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" })
      });
    } catch {}
  };

  const handleCreateUser = async () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) {
      alert("Name, email, and password are required.");
      return;
    }
    setAddSaving(true);
    try {
      const res = await fetch(`${ADMIN_API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      
      setAddedCredentials({
        email: newUserForm.email,
        password: newUserForm.password,
        role: newUserForm.role,
      });
      setUsersList([data.user, ...usersList]);
      setNewUserForm({ name: "", email: "", password: "", role: "student", branch: "", course: "", enrollmentYear: "" });
      setShowAddUser(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Main welcome row ── */}
      <div className="px-4 pt-6 md:px-8 max-w-[1540px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Control Center</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Welcome back, {user.name.split(" ")[0]}! Manage users, courses, and monitor platform activity.</p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0 bg-white rounded-3xl p-4 border border-slate-150 shadow-sm">
            <div className="text-center">
              <div className="text-xl font-black text-slate-900">{usersList.filter(u => u.status === "active").length}</div>
              <div className="text-[10px] text-slate-400 font-bold">Active Users</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-xl font-black text-amber-600">{coursesList.filter(c => c.status === "pending").length}</div>
              <div className="text-[10px] text-slate-400 font-bold">Pending Approvals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 md:px-8 py-6 max-w-[1540px] mx-auto w-full">
        <div className="space-y-7">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {analyticsCards.map((card) => (
              <div key={card.label} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: card.bg }}>
                    <card.icon className="h-5 w-5" style={{ color: card.color }} />
                  </div>
                  <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ color: card.color, background: card.bg }}>{card.change}</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{card.value}</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</div>
                <div className="absolute bottom-0 left-0 h-1 w-1/2 rounded-b-2xl" style={{ background: card.color }} />
              </div>
            ))}
          </div>
          {/* User table */}
          {addedCredentials && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 mb-4 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-emerald-900">User Created Successfully!</h4>
                <p className="text-xs font-semibold text-emerald-700 mt-1">Please copy and share these credentials securely with the {addedCredentials.role}. They will need them to log in.</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="bg-white px-3 py-2 rounded-lg border border-emerald-100 text-sm font-bold text-slate-800">
                    <span className="text-xs text-slate-400 block mb-0.5 uppercase tracking-wider">Email (ID)</span>
                    {addedCredentials.email}
                  </div>
                  <div className="bg-white px-3 py-2 rounded-lg border border-emerald-100 text-sm font-bold text-slate-800">
                    <span className="text-xs text-slate-400 block mb-0.5 uppercase tracking-wider">Password</span>
                    {addedCredentials.password}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => setAddedCredentials(null)} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                Dismiss
              </Button>
            </div>
          )}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2"><div className="h-4 w-1 rounded-full bg-violet-500" /><h3 className="text-sm font-extrabold">User Management</h3></div>
              <Button size="sm" onClick={() => setShowAddUser(true)} className="bg-violet-600 hover:bg-violet-700 text-white h-8 text-xs px-3 shadow-md">
                <Plus className="h-3.5 w-3.5 mr-1" /> Create User
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase">User</th>
                <th className="text-left px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase hidden sm:table-cell">Role / Mentor</th>
                <th className="text-center px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase">Status</th>
                <th className="text-center px-5 py-2.5 text-xs font-extrabold text-slate-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {usersList.slice(0, 10).map((u) => {
                  const status = u.status;
                  return (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3"><div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${u.role === "faculty" ? "bg-emerald-500" : "bg-indigo-500"}`}>
                          {u.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-xs font-semibold text-slate-800">{u.name}</span>
                      </div></td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${u.role === "faculty" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{status}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Button size="sm" variant={status === "active" ? "destructive" : "default"} onClick={() => toggleBan(u._id, status)} className="h-7 text-[10px] font-bold">
                          {status === "active" ? "Ban Access" : "Restore Access"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pending Course Approvals */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50">
              <div className="flex items-center gap-2"><div className="h-4 w-1 rounded-full bg-amber-500" /><h3 className="text-sm font-extrabold text-slate-800">Course Approvals</h3></div>
            </div>
            <div className="divide-y divide-gray-50">
              {coursesList.filter(c => c.status === "pending").map((course) => {
                return (
                  <div key={course._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">{course.title}</h4>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-indigo-500" /> {course.teacher || "Faculty"}</span>
                        <span>•</span>
                        <span>{course.code}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-slate-600">Review</Button>
                      <Button size="sm" onClick={() => handleApprove(course._id)} className="h-8 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm">
                        Approve
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Create User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <h2 className="mb-1 text-xl font-black text-slate-900">Create System User</h2>
            <p className="mb-6 text-xs font-semibold text-slate-500">Generate credentials for a new student or faculty member.</p>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Email (Login ID)</label>
                <input
                  type="email"
                  placeholder="e.g. john@learning.hub"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Set Password</label>
                <input
                  type="text"
                  placeholder="Minimum 6 characters"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {newUserForm.role === "student" && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={newUserForm.branch}
                      onChange={(e) => setNewUserForm({ ...newUserForm, branch: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Course</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech"
                      value={newUserForm.course}
                      onChange={(e) => setNewUserForm({ ...newUserForm, course: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={newUserForm.enrollmentYear}
                      onChange={(e) => setNewUserForm({ ...newUserForm, enrollmentYear: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowAddUser(false)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={addSaving}
                className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition disabled:opacity-50"
              >
                {addSaving ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
