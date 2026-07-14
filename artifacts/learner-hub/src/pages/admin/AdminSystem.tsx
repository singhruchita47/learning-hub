import { Globe, Shield, Activity, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  { id: 1, name: "🏆 Top Learner",     color: "#F59E0B", holders: 15, desc: "Awarded to students in top 10%" },
  { id: 2, name: "🔥 Streak Master",   color: "#EF4444", holders: 32, desc: "Maintained 30-day learning streak" },
  { id: 3, name: "⭐ Quiz Champion",   color: "#6366F1", holders: 28, desc: "Scored 95%+ in 5 quizzes" },
  { id: 4, name: "📚 Course Finisher", color: "#10B981", holders: 87, desc: "Completed 3 or more courses" },
  { id: 5, name: "🤝 Mentor",          color: "#8B5CF6", holders: 8,  desc: "Helped 10+ peers in community" },
];

export default function AdminSystem() {
  return (
    <div className="flex-1 px-4 md:px-8 py-6 max-w-[1540px] mx-auto w-full">
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System & Roles</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Configure platform settings, manage roles, and review badges.</p>
          </div>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold">Save Changes</Button>
        </div>
        
        {/* System Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2"><Globe className="h-4 w-4 text-violet-500" /> Platform Defaults</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Academic Year</label>
                <select className="w-full text-sm font-semibold rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-violet-500">
                  <option>2025-2026</option>
                  <option>2024-2025</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Current Semester</label>
                <select className="w-full text-sm font-semibold rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-violet-500">
                  <option>Fall / Odd Sem</option>
                  <option>Spring / Even Sem</option>
                </select>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /> Security & Access</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-bold text-slate-800">Maintenance Mode</p>
                  <p className="text-xs text-slate-400">Lock out all non-admin users</p>
                </div>
                <input type="checkbox" className="toggle toggle-sm toggle-error" />
              </div>
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-bold text-slate-800">Open Registration</p>
                  <p className="text-xs text-slate-400">Allow students to sign up freely</p>
                </div>
                <input type="checkbox" className="toggle toggle-sm toggle-success" defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800">Role Management</h3>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-2 rounded-xl font-bold"><Plus className="h-4 w-4" /> Add Role</Button>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-extrabold text-slate-500">
                <tr><th className="px-5 py-3 rounded-tl-2xl">Role Name</th><th className="px-5 py-3">Permissions</th><th className="px-5 py-3">Users Count</th><th className="px-5 py-3 rounded-tr-2xl"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { role: "Super Admin", perm: "Full Access", users: 2, color: "text-red-600 bg-red-50" },
                  { role: "Faculty HOD", perm: "Manage Dept, Courses", users: 14, color: "text-violet-600 bg-violet-50" },
                  { role: "Faculty", perm: "Manage Own Courses", users: 156, color: "text-blue-600 bg-blue-50" },
                  { role: "Student Representative", perm: "View Analytics, Post", users: 45, color: "text-emerald-600 bg-emerald-50" },
                ].map((r) => (
                  <tr key={r.role} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-bold text-slate-800">{r.role}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.color}`}>{r.perm}</span></td>
                    <td className="px-5 py-3 font-semibold text-slate-600">{r.users}</td>
                    <td className="px-5 py-3 text-right"><Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-violet-600">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badges Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-800">Available Badges</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl mx-auto mb-3" style={{ background: `${badge.color}15` }}>
                  <Star className="h-6 w-6" style={{ color: badge.color }} />
                </div>
                <h4 className="text-sm font-black text-slate-800">{badge.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-bold">{badge.holders} holders</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
