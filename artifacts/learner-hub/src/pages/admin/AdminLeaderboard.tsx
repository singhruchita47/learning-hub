import { useState } from "react";
import { Trophy, Medal, Star, ShieldAlert } from "lucide-react";

export default function AdminLeaderboard() {
  const [students, setStudents] = useState([
    { id: 1, name: "Rohan Sharma", rank: 1, points: 9450, branch: "Computer Science", badges: 5 },
    { id: 2, name: "Ayesha Khan", rank: 2, points: 8900, branch: "Information Tech", badges: 4 },
    { id: 3, name: "Vikram Singh", rank: 3, points: 8200, branch: "Electronics", badges: 4 },
    { id: 4, name: "Priya Patel", rank: 4, points: 7950, branch: "Computer Science", badges: 3 },
    { id: 5, name: "Karan Johar", rank: 5, points: 7500, branch: "Mechanical", badges: 2 },
  ]);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leaderboard Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Monitor top performing students and award custom badges.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition shadow-md shadow-violet-200">
          <Star className="h-4.5 w-4.5" /> Award Badge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <Trophy className="h-6 w-6" />
            <h3 className="text-sm font-black uppercase tracking-wider">Rank #1</h3>
          </div>
          <div className="text-3xl font-black">{students[0].name}</div>
          <div className="mt-1 text-sm font-bold opacity-90">{students[0].branch} • {students[0].points} pts</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-300 to-slate-400 p-6 text-white shadow-lg shadow-slate-400/20">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <Medal className="h-6 w-6" />
            <h3 className="text-sm font-black uppercase tracking-wider">Rank #2</h3>
          </div>
          <div className="text-3xl font-black">{students[1].name}</div>
          <div className="mt-1 text-sm font-bold opacity-90">{students[1].branch} • {students[1].points} pts</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-700 to-amber-900 p-6 text-white shadow-lg shadow-amber-900/20">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <Medal className="h-6 w-6" />
            <h3 className="text-sm font-black uppercase tracking-wider">Rank #3</h3>
          </div>
          <div className="text-3xl font-black">{students[2].name}</div>
          <div className="mt-1 text-sm font-bold opacity-90">{students[2].branch} • {students[2].points} pts</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="h-4 w-1 rounded-full bg-violet-600" />
          <h3 className="text-sm font-black text-slate-900">Institution Leaderboard</h3>
        </div>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Rank</th>
              <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Student Name</th>
              <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase">Branch</th>
              <th className="text-center px-5 py-3 text-xs font-black text-slate-500 uppercase">Points</th>
              <th className="text-center px-5 py-3 text-xs font-black text-slate-500 uppercase">Badges</th>
              <th className="text-right px-5 py-3 text-xs font-black text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                <td className="px-5 py-4">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl font-black ${
                    s.rank === 1 ? "bg-amber-100 text-amber-600" :
                    s.rank === 2 ? "bg-slate-100 text-slate-600" :
                    s.rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-violet-50 text-violet-600"
                  }`}>
                    #{s.rank}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-slate-900">{s.name}</td>
                <td className="px-5 py-4 font-semibold text-slate-500">{s.branch}</td>
                <td className="px-5 py-4 text-center font-black text-violet-600">{s.points}</td>
                <td className="px-5 py-4 text-center font-black text-slate-700">
                  <div className="flex items-center justify-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {s.badges}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-slate-400 hover:text-red-600 transition" title="Penalty / Deduct Points">
                    <ShieldAlert className="h-4.5 w-4.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
