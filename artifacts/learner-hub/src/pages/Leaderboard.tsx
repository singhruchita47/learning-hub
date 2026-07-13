import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Medal, Search, Star, Trophy, Zap, TrendingUp, Users, Award } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Priya Sharma",  initials: "PS", major: "Data Structures",  xp: 9650, streak: 15, badges: 18, isYou: false },
  { rank: 2, name: "Rohan Mehta",   initials: "RM", major: "Database Systems",  xp: 9220, streak: 12, badges: 14, isYou: false },
  { rank: 3, name: "Ruchita Singh", initials: "RS", major: "Computer Science",  xp: 8750, streak: 8,  badges: 11, isYou: true  },
  { rank: 4, name: "Ananya Verma",  initials: "AV", major: "Data Science",      xp: 8420, streak: 10, badges: 9,  isYou: false },
  { rank: 5, name: "Dev Patel",     initials: "DP", major: "Cyber Security",    xp: 7980, streak: 6,  badges: 8,  isYou: false },
  { rank: 6, name: "Sneha Reddy",   initials: "SR", major: "Computer Science",  xp: 7650, streak: 9,  badges: 7,  isYou: false },
  { rank: 7, name: "Arjun Singh",   initials: "AS", major: "AI & ML",           xp: 7320, streak: 7,  badges: 6,  isYou: false },
];

const tabs = ["This Week", "This Month", "All Time"];

const podiumColors = [
  { bg: "from-violet-500 to-indigo-600",  shadow: "shadow-violet-300/50", badge: "bg-violet-50 text-violet-700",  ring: "ring-violet-400" },
  { bg: "from-slate-400 to-slate-500",    shadow: "shadow-slate-300/50",  badge: "bg-slate-50 text-slate-600",   ring: "ring-slate-400" },
  { bg: "from-emerald-400 to-teal-500",   shadow: "shadow-emerald-300/50",badge: "bg-emerald-50 text-emerald-700",ring: "ring-emerald-400" },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQ, setSearchQ] = useState("");

  const top  = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3).filter(e =>
    !searchQ || e.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1300px] space-y-6">

        {/* ── Page Header ── */}
        <section className="relative overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-sm ring-1 ring-slate-100">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-violet-50 to-transparent" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-violet-100/50 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Student Module</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">Leader<span className="text-violet-600">board</span></h1>
              <p className="mt-1.5 text-xs font-semibold text-slate-400">Track XP, streaks, badges and your current batch rank.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[
                  { val: leaderboardData.length, label: "Students",   color: "bg-violet-100 text-violet-700 ring-violet-200"   },
                  { val: "9,650",               label: "Top XP",      color: "bg-indigo-100 text-indigo-700 ring-indigo-200"   },
                  { val: "15",                  label: "Top Streak",  color: "bg-rose-100 text-rose-600 ring-rose-200"         },
                  { val: "18",                  label: "Badges",      color: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
                ].map(({ val, label, color }) => (
                  <span key={label} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black ring-1 ${color}`}>
                    <span className="text-sm font-black">{val}</span> {label}
                  </span>
                ))}
                <div className="relative ml-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search students…"
                    className="h-8 w-40 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
              </div>
            </div>
            <div className="relative ml-6 hidden shrink-0 lg:block">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 shadow-inner">
                <span className="text-5xl select-none">🏆</span>
              </div>
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-sm shadow-md">🔥</div>
            </div>
          </div>
        </section>

        {/* ── Tab + your rank ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`h-9 rounded-xl px-4 text-xs font-black transition ${
                  activeTab === i ? "bg-[#6c5ce7] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-[#6c5ce7]/20 bg-white px-5 py-2.5 shadow-sm">
            <Zap className="h-4 w-4 text-[#6c5ce7]" />
            <span className="text-sm font-black text-[#6c5ce7]">Your Rank: #3 · 8,750 XP</span>
          </div>
        </div>

        {/* ── Podium Top 3 ── */}
        <section className="grid gap-5 md:grid-cols-3">
          {top.map((player, index) => {
            const colors = podiumColors[index];
            return (
              <motion.article
                key={player.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-[1.75rem] bg-white shadow-xl ${colors.shadow} ${
                  player.isYou ? `ring-2 ${colors.ring}` : ""
                }`}
              >
                {/* gradient top strip */}
                <div className={`h-2 w-full bg-gradient-to-r ${colors.bg}`} />

                <div className="p-6">
                  {/* crown / medal */}
                  <div className="absolute right-5 top-5">
                    {index === 0
                      ? <Crown className="h-8 w-8 text-violet-500 drop-shadow-md" />
                      : <Medal className={`h-7 w-7 ${index === 1 ? "text-slate-400" : "text-emerald-500"}`} />}
                  </div>

                  {/* Avatar */}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${colors.bg} text-xl font-black text-white shadow-lg`}>
                    {player.initials}
                  </div>
                  {player.isYou && (
                    <span className="mt-2 inline-block rounded-full bg-[#6c5ce7]/10 px-2 py-0.5 text-[10px] font-black text-[#6c5ce7]">You</span>
                  )}

                  <p className="mt-4 text-xs font-black text-slate-400">Rank #{player.rank}</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">{player.name}</h2>
                  <p className="mt-0.5 text-xs font-bold text-slate-500">{player.major}</p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { val: player.xp.toLocaleString(), label: "XP",     color: "text-[#6c5ce7]", bg: "bg-[#6c5ce7]/8" },
                      { val: player.streak,              label: "Streak",  color: "text-orange-600", bg: "bg-orange-50" },
                      { val: player.badges,              label: "Badges",  color: "text-emerald-600",bg: "bg-emerald-50" },
                    ].map(({ val, label, color, bg }) => (
                      <div key={label} className={`rounded-2xl ${bg} p-3 text-center`}>
                        <p className={`text-base font-black ${color}`}>{val}</p>
                        <p className="text-[9px] font-black text-slate-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* ── Rest of Leaderboard ── */}
        <section className="overflow-hidden rounded-[1.75rem] bg-white shadow-lg">
          <div className="grid grid-cols-[60px_1fr_120px_100px_90px] border-b border-slate-100 bg-[#f8f7ff] px-5 py-3">
            {["Rank", "Student", "XP", "Streak", "Badges"].map(h => (
              <span key={h} className="text-xs font-black uppercase tracking-wider text-slate-400 last:text-center [&:nth-child(3)]:text-right [&:nth-child(4)]:text-center">{h}</span>
            ))}
          </div>

          {rest.length === 0 ? (
            <div className="py-12 text-center text-sm font-bold text-slate-400">No students found.</div>
          ) : rest.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`grid grid-cols-[60px_1fr_120px_100px_90px] items-center border-b border-slate-50 px-5 py-4 last:border-0 transition hover:bg-violet-50 ${
                entry.isYou ? "bg-violet-50/60" : ""
              }`}
            >
              <span className={`text-sm font-black ${entry.isYou ? "text-[#6c5ce7]" : "text-slate-400"}`}>#{entry.rank}</span>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6c5ce7] text-xs font-black text-white shadow-md">
                  {entry.initials}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{entry.name}{entry.isYou && <span className="ml-2 rounded-full bg-[#6c5ce7]/10 px-1.5 py-0.5 text-[9px] font-black text-[#6c5ce7]">You</span>}</p>
                  <p className="text-xs font-bold text-slate-400">{entry.major}</p>
                </div>
              </div>
              <p className="text-right text-sm font-black text-[#6c5ce7]">{entry.xp.toLocaleString()}</p>
              <p className="flex items-center justify-center gap-1 text-sm font-black text-rose-500">
                <Flame className="h-4 w-4 fill-rose-400" /> {entry.streak}
              </p>
              <p className="flex items-center justify-center gap-1 text-sm font-black text-indigo-500">
                <Star className="h-4 w-4 fill-indigo-400" /> {entry.badges}
              </p>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
}
