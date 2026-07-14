import { useState, useEffect } from "react";
import { Award, Flame, Medal, Gift, Star, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMIC_API_BASE } from "@/lib/api";

const availableBadges = [
  { id: "b1", name: "Top Coder", icon: "💻", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "b2", name: "Star Mentor", icon: "⭐", color: "text-amber-500", bg: "bg-amber-50" },
  { id: "b3", name: "100 Day Streak", icon: "🔥", color: "text-orange-500", bg: "bg-orange-50" },
  { id: "b4", name: "Innovation Award", icon: "💡", color: "text-violet-500", bg: "bg-violet-50" },
];

export default function AdminBadges() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  
  const [awardsLog, setAwardsLog] = useState<{id: number; user: string; badge: string; time: string}[]>([
    { id: 1, user: "Arjun Singh", badge: "100 Day Streak", time: "2 hours ago" },
    { id: 2, user: "Dr. Sarah Chen", badge: "Star Mentor", time: "1 day ago" },
  ]);

  useEffect(() => {
    fetch(`${ACADEMIC_API_BASE}/admin/users`)
      .then(r => r.json())
      .then(d => {
        if (d.users) setUsers(d.users);
      })
      .catch(() => {});
  }, []);

  const handleAward = async () => {
    if (!selectedUser || !selectedBadge) return;
    try {
      await fetch(`${ACADEMIC_API_BASE}/admin/users/${selectedUser}/badge`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badge: selectedBadge })
      });
      const uName = users.find(u => u._id === selectedUser)?.name;
      const bName = availableBadges.find(b => b.id === selectedBadge)?.name;
      setAwardsLog(p => [{ id: Date.now(), user: uName || "", badge: bName || "", time: "Just now" }, ...p]);
    } catch {}
    setSelectedUser("");
    setSelectedBadge("");
  };

  return (
    <div className="flex-1 px-4 md:px-8 py-6 max-w-[1540px] mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Rewards & Streaks</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">Award badges and track login streaks for students and faculty.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Award Badge Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <Gift className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Award a Badge</h3>
                <p className="text-[10px] font-bold text-slate-400">Recognize achievements</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Select User</label>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full text-sm font-bold text-slate-700 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-orange-500 bg-slate-50/50">
                  <option value="">-- Choose User --</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Select Badge</label>
                <select value={selectedBadge} onChange={(e) => setSelectedBadge(e.target.value)} className="w-full text-sm font-bold text-slate-700 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-orange-500 bg-slate-50/50">
                  <option value="">-- Choose Badge --</option>
                  {availableBadges.map(b => <option key={b.id} value={b.id}>{b.icon} {b.name}</option>)}
                </select>
              </div>
              <Button onClick={handleAward} disabled={!selectedUser || !selectedBadge} className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-11 font-bold shadow-md shadow-orange-200 gap-2">
                <Medal className="h-4 w-4" /> Grant Badge
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <History className="h-5 w-5 text-slate-600" />
              <h3 className="text-base font-extrabold text-slate-800">Recent Awards</h3>
            </div>
            
            <div className="space-y-4">
              {awardsLog.map((log) => (
                <div key={log.id} className="flex gap-3 items-start relative">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800"><span className="text-violet-600">{log.user}</span> received</p>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {log.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {awardsLog.length === 0 && (
                <div className="text-center py-10 text-sm font-bold text-slate-400">
                  No recent awards found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Streaks and Badge Types */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableBadges.map(b => (
              <div key={b.id} className={`rounded-2xl border border-slate-100 ${b.bg} p-4 text-center shadow-sm`}>
                <div className="text-3xl mb-2">{b.icon}</div>
                <h4 className={`text-xs font-black ${b.color}`}>{b.name}</h4>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <Flame className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-black text-slate-900">Active Streaks Leaderboard</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3 text-center">Current Streak</th>
                    <th className="px-5 py-3 text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[...users].sort((a,b) => (b.streak || 0) - (a.streak || 0)).map((s, index) => (
                    <tr key={s._id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{s.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{s.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-black">
                          <Flame className="h-4 w-4" /> {s.streak || 0} Days
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-slate-500">
                        {new Date(s.lastActive || Date.now()).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
