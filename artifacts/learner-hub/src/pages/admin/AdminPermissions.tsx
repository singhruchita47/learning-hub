import { useState, useEffect } from "react";
import { ShieldCheck, Save, Loader, ShieldAlert, Check, X } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const ALL_PERMISSIONS = {
  admin: [
    { id: "manage_users", label: "Manage Users" },
    { id: "manage_courses", label: "Manage Courses" },
    { id: "view_reports", label: "View Reports" },
    { id: "manage_permissions", label: "Manage Permissions" },
    { id: "manage_timetable", label: "Manage Timetable" },
    { id: "manage_announcements", label: "Manage Announcements" },
  ],
  faculty: [
    { id: "create_courses", label: "Create Courses" },
    { id: "create_assignments", label: "Create Assignments" },
    { id: "mark_attendance", label: "Mark Attendance" },
    { id: "view_submissions", label: "View Submissions" },
    { id: "schedule_classes", label: "Schedule Live Classes" },
  ],
  student: [
    { id: "view_courses", label: "View Courses" },
    { id: "submit_assignments", label: "Submit Assignments" },
    { id: "view_grades", label: "View Grades & CGPA" },
    { id: "participate_forum", label: "Participate in Forum" },
    { id: "view_timetable", label: "View Timetable" },
  ]
};

type Role = "admin" | "faculty" | "student";
type PermissionsMap = Record<Role, string[]>;

export default function AdminPermissions() {
  const [permissions, setPermissions] = useState<PermissionsMap>({ admin: [], faculty: [], student: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Role | null>(null);

  useEffect(() => {
    fetch(`${ACADEMIC_API_BASE}/permissions`)
      .then(r => r.json())
      .then(d => {
        if (d.permissions) setPermissions(d.permissions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const togglePermission = (role: Role, permId: string) => {
    setPermissions(prev => {
      const rolePerms = prev[role] || [];
      if (rolePerms.includes(permId)) {
        return { ...prev, [role]: rolePerms.filter(p => p !== permId) };
      } else {
        return { ...prev, [role]: [...rolePerms, permId] };
      }
    });
  };

  const handleSave = async (role: Role) => {
    setSaving(role);
    try {
      await fetch(`${ACADEMIC_API_BASE}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, permissions: permissions[role] })
      });
      // Optionally show a toast here
    } catch {}
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Role Permissions</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Configure feature access control for students, faculty, and admins.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 shadow-sm">
          <ShieldAlert className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-black text-indigo-700">Strict Enforcement Active</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {(["admin", "faculty", "student"] as Role[]).map(role => (
          <div key={role} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                role === "admin" ? "bg-rose-50 text-rose-600" :
                role === "faculty" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
              }`}>
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 capitalize">{role}s</h2>
                <p className="text-xs font-bold text-slate-400">Manage {role} capabilities</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-6">
              {ALL_PERMISSIONS[role].map(perm => {
                const isEnabled = permissions[role]?.includes(perm.id);
                return (
                  <button
                    key={perm.id}
                    onClick={() => togglePermission(role, perm.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isEnabled 
                        ? "border-violet-200 bg-violet-50 hover:bg-violet-100" 
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100 opacity-70"
                    }`}
                  >
                    <span className={`text-sm font-bold ${isEnabled ? "text-violet-900" : "text-slate-600"}`}>
                      {perm.label}
                    </span>
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isEnabled ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-400"
                    }`}>
                      {isEnabled ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              disabled={saving === role}
              onClick={() => handleSave(role)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition-all ${
                role === "admin" ? "bg-rose-600 hover:bg-rose-700 text-white" :
                role === "faculty" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
              } disabled:opacity-50 shadow-sm`}
            >
              {saving === role ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save {role.charAt(0).toUpperCase() + role.slice(1)} Config
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
