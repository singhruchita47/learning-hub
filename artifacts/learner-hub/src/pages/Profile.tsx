import { useState, useEffect } from "react";
import { User, Save, GraduationCap, Building, Calendar, Mail } from "lucide-react";
import { API_ROOT } from "@/lib/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    branch: "",
    course: "",
    enrollmentYear: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("learningHubUser");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Fetch full user details from admin users endpoint
      fetch(`${API_ROOT}/admin/users`)
        .then((r) => r.json())
        .then((data) => {
          if (data.users) {
            const currentUser = data.users.find((u: any) => u.email === parsed.email);
            if (currentUser) {
              setUser(currentUser);
              setFormData({
                branch: currentUser.branch || "",
                course: currentUser.course || "",
                enrollmentYear: currentUser.enrollmentYear || "",
              });
            } else {
              setUser(parsed);
            }
          }
        })
        .catch(() => setUser(parsed));
    }
  }, []);

  const handleSave = async () => {
    if (!user || !user._id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_ROOT}/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      alert("An error occurred while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1000px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Profile</h1>
        <p className="text-sm font-semibold text-slate-400 mt-1">Manage your personal information and academic details.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Profile Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/50 flex flex-col items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-black text-white shadow-xl shadow-violet-200 mb-5">
            {user.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : "U"}
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-1">{user.name}</h2>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
            user.role === 'faculty' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {user.role}
          </span>

          <div className="mt-8 w-full space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              {user.email}
            </div>
            {user.role === "student" && (
              <>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Building className="h-4 w-4 text-slate-400" />
                  {user.branch || "Branch N/A"}
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  {user.course || "Course N/A"}
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Batch {user.enrollmentYear || "N/A"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900">Academic Details</h3>
            {user.role === "student" && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-black text-violet-600 hover:text-violet-700 transition"
              >
                Edit Details
              </button>
            )}
          </div>

          {user.role !== "student" ? (
            <p className="text-sm font-semibold text-slate-500">Academic details are only applicable for students.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Branch</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. CSE"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Course Program</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g. B.Tech"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Enrollment Year</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.enrollmentYear}
                  onChange={(e) => setFormData({ ...formData, enrollmentYear: e.target.value })}
                  placeholder="e.g. 2024"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        branch: user.branch || "",
                        course: user.course || "",
                        enrollmentYear: user.enrollmentYear || "",
                      });
                    }}
                    className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-black text-slate-600 hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-black text-white hover:bg-violet-700 transition disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
