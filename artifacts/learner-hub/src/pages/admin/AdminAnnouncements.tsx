import { useState, useEffect } from "react";
import { Megaphone, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMIC_API_BASE } from "@/lib/api";

export default function AdminAnnouncements() {
  const [annText, setAnnText] = useState("");
  const [annTarget, setAnnTarget] = useState("All");
  const [annTitle, setAnnTitle] = useState("");
  const [annSent, setAnnSent] = useState(false);
  const [pastAnn, setPastAnn] = useState<any[]>([]);
  const [facultyNotices, setFacultyNotices] = useState<any[]>([]);

  useEffect(() => {
    fetchAnnouncements();
    fetchFacultyNotices();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/admin/announcements`);
      const data = await res.json();
      if (data.announcements) setPastAnn(data.announcements);
    } catch {}
  };

  const fetchFacultyNotices = async () => {
    try {
      // Faculty manual notices are sent with audience=student and type=general
      const res = await fetch(`${ACADEMIC_API_BASE}/notifications?audience=student`);
      const data = await res.json();
      if (data.notifications) {
        // Faculty activities (notices, assignments, classes) generally target students
        setFacultyNotices(data.notifications);
      }
    } catch {}
  };

  const sendAnn = async () => {
    if (!annText.trim() || !annTitle.trim()) return;
    try {
      await fetch(`${ACADEMIC_API_BASE}/admin/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: annTitle,
          message: annText,
          audience: annTarget,
          type: "Info"
        })
      });
      fetchAnnouncements();
    } catch {}
    
    setAnnText("");
    setAnnTitle("");
    setAnnSent(true);
    setTimeout(() => setAnnSent(false), 3000);
  };

  return (
    <div className="flex-1 px-4 md:px-8 py-6 max-w-[1540px] mx-auto w-full">
      <div className="space-y-7">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Announcements</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">Broadcast important updates to students, faculty, or all users.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2"><Megaphone className="h-5 w-5 text-violet-600" /> Send Global Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Target Audience</label>
                <select value={annTarget} onChange={(e) => setAnnTarget(e.target.value)} className="w-full text-sm font-bold text-slate-700 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-violet-500">
                  <option value="All">All Users</option>
                  <option value="Students">Students Only</option>
                  <option value="Faculty">Faculty Only</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Title</label>
                <input
                  type="text"
                  value={annTitle} onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="E.g., Platform Maintenance"
                  className="w-full text-sm font-semibold rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Message Content</label>
                <textarea
                  value={annText} onChange={(e) => setAnnText(e.target.value)}
                  placeholder="Type announcement here..."
                  className="w-full text-sm font-semibold rounded-xl border border-slate-200 px-3 py-2.5 min-h-[140px] outline-none focus:border-violet-500 resize-none"
                />
              </div>
              <Button onClick={sendAnn} disabled={!annText.trim() || !annTitle.trim()} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 font-bold shadow-md shadow-violet-200 transition-all active:scale-[0.98]">
                {annSent ? "✓ Sent Successfully" : "Broadcast Message"}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-800">Past Announcements</h3>
            <div className="flex flex-col gap-3">
              {pastAnn.map((a) => (
                <div key={a._id || a.id} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50"><Bell className="h-5 w-5 text-violet-600" /></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{a.message || a.text}</p>
                    <div className="flex gap-2 mt-1.5 text-[10px] font-bold text-slate-400">
                      <span className="text-violet-600 uppercase">→ {a.audience || a.target}</span><span>·</span>
                      <span>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : a.time}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-600 shrink-0">✓ Sent</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-extrabold text-slate-800 mt-6">Faculty Notices</h3>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {facultyNotices.length > 0 ? facultyNotices.map((n) => (
                <div key={n._id || Math.random()} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-slate-50 p-5 shadow-sm">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{n.message}</p>
                    <div className="flex gap-2 mt-1.5 text-[10px] font-bold text-slate-400">
                      <span className="text-violet-600 uppercase">Target: {n.audience || "student"}</span><span>·</span>
                      <span>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Recent"}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-xs font-bold text-slate-400 border border-dashed rounded-xl p-4 text-center">No faculty notices yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
