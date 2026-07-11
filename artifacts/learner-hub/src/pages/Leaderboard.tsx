import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Medal, Search, Star, Trophy } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Priya Sharma", initials: "PS", major: "Data Structures", xp: 9650, streak: 15, badges: 18, isYou: false },
  { rank: 2, name: "Rohan Mehta", initials: "RM", major: "Database Systems", xp: 9220, streak: 12, badges: 14, isYou: false },
  { rank: 3, name: "Ruchita Singh", initials: "RS", major: "Computer Science", xp: 8750, streak: 8, badges: 11, isYou: true },
  { rank: 4, name: "Ananya Verma", initials: "AV", major: "Data Science", xp: 8420, streak: 10, badges: 9, isYou: false },
  { rank: 5, name: "Dev Patel", initials: "DP", major: "Cyber Security", xp: 7980, streak: 6, badges: 8, isYou: false },
  { rank: 6, name: "Sneha Reddy", initials: "SR", major: "Computer Science", xp: 7650, streak: 9, badges: 7, isYou: false },
  { rank: 7, name: "Arjun Singh", initials: "AS", major: "AI & ML", xp: 7320, streak: 7, badges: 6, isYou: false },
];

const tabs = ["This Week", "This Month", "All Time"];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState(0);
  const top = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1300px]">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 text-slate-950 shadow-xl shadow-[#7b35ad]/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff7a21]">SGSU performance board</p>
              <h1 className="mt-2 text-4xl font-black">Leaderboard</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                Track XP, quiz rank, coding streaks, badges, and your current learning position.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b35ad]/55" />
              <input
                placeholder="Search students..."
                className="h-12 w-full rounded-2xl border border-[#d8c8ff] bg-white/80 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`h-10 rounded-xl px-4 text-sm font-black transition ${
                  activeTab === index ? "bg-[#7b35ad] text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-[#7b35ad]/15 bg-white px-5 py-3 text-sm font-black text-[#7b35ad] shadow-sm">
            Your Rank: #3 - 8,750 XP
          </div>
        </div>

        <section className="mb-6 grid gap-5 md:grid-cols-3">
          {top.map((player, index) => {
            const gold = index === 0;
            const color = gold ? "#f59e0b" : index === 1 ? "#64748b" : "#ff7a21";
            return (
              <motion.article
                key={player.rank}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`relative overflow-hidden rounded-[1.75rem] border bg-white p-5 shadow-lg shadow-slate-200/60 ${
                  player.isYou ? "border-[#7b35ad]/30" : "border-slate-200"
                }`}
              >
                <div className="absolute right-5 top-5">
                  {gold ? <Crown className="h-8 w-8 text-amber-500" /> : <Medal className="h-8 w-8" style={{ color }} />}
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-black text-white shadow-lg" style={{ background: color }}>
                  {player.initials}
                </div>
                <p className="mt-5 text-sm font-black text-slate-400">Rank #{player.rank}</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">{player.name}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{player.major}</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-lg font-black text-[#7b35ad]">{player.xp.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-slate-400">XP</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-lg font-black text-[#ff7a21]">{player.streak}</p>
                    <p className="text-[10px] font-black text-slate-400">Streak</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-lg font-black text-emerald-600">{player.badges}</p>
                    <p className="text-[10px] font-black text-slate-400">Badges</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="grid grid-cols-[70px_1fr_130px_110px_100px] border-b border-slate-100 bg-slate-50 px-5 py-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Rank</span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Student</span>
            <span className="text-right text-xs font-black uppercase tracking-wider text-slate-400">XP</span>
            <span className="text-center text-xs font-black uppercase tracking-wider text-slate-400">Streak</span>
            <span className="text-center text-xs font-black uppercase tracking-wider text-slate-400">Badges</span>
          </div>

          {rest.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.04 }}
              className="grid grid-cols-[70px_1fr_130px_110px_100px] items-center border-b border-slate-50 px-5 py-4 last:border-0 hover:bg-slate-50"
            >
              <span className="font-black text-slate-400">#{entry.rank}</span>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#34428c] text-xs font-black text-white">
                  {entry.initials}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{entry.name}</p>
                  <p className="text-xs font-bold text-slate-500">{entry.major}</p>
                </div>
              </div>
              <p className="text-right text-sm font-black text-[#7b35ad]">{entry.xp.toLocaleString()}</p>
              <p className="flex items-center justify-center gap-1 text-sm font-black text-[#ff7a21]">
                <Flame className="h-4 w-4" />
                {entry.streak}
              </p>
              <p className="flex items-center justify-center gap-1 text-sm font-black text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                {entry.badges}
              </p>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
}
