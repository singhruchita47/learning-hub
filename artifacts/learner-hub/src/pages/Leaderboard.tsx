import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Medal, Star } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Alex",        initials: "AJ", major: "Computer Science",  xp: 9650, streak: 15, badges: 18, isYou: false },
  { rank: 2, name: "Priya",       initials: "PS", major: "Data Structures",   xp: 9220, streak: 12, badges: 14, isYou: false },
  { rank: 3, name: "Rohan",       initials: "RM", major: "Database Systems",  xp: 8750, streak: 8,  badges: 11, isYou: false },
  { rank: 4, name: "Ananya Varma",initials: "AV", major: "Data Science",      xp: 8420, streak: 10, badges: 9,  isYou: false },
  { rank: 5, name: "Dev Patel",    initials: "DP", major: "Cyber Security",    xp: 7980, streak: 6,  badges: 8,  isYou: false },
  { rank: 6, name: "Sneha Reddy",  initials: "SR", major: "Computer Science",  xp: 7650, streak: 9,  badges: 7,  isYou: false },
  { rank: 7, name: "Arjun Singh",  initials: "AS", major: "Computer Science",  xp: 7320, streak: 7,  badges: 6,  isYou: true  },
];

const tabs = ["This Week", "This Month", "All Time"];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState(0);

  const rest = leaderboardData.slice(3);

  return (
    <main className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1000px] space-y-5">

        {/* ── Heading Row ── */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
            <span>🏆</span> Leaderboard <span>🏆</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400">This Week's Rankings</p>
        </div>

        {/* ── Tabs selector ── */}
        <div className="flex justify-center">
          <div className="flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`h-8 rounded-full px-4 text-[11px] font-black transition-all ${
                  activeTab === i ? "bg-violet-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3D Podium Layout ── */}
        <div className="flex items-end justify-center gap-8 pt-8 pb-12 max-w-4xl mx-auto">

          {/* 2nd Place (Priya) */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative mb-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-450 text-xl font-black text-slate-700 bg-white ring-4 ring-white shadow-md">
                PS
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-black text-slate-700 shadow">2</span>
            </div>
            <div className="w-full bg-[#e8eaf2] rounded-t-[3rem] p-6 flex flex-col items-center justify-center border-t border-x border-slate-200 shadow-inner h-56">
              <Medal className="h-10 w-10 text-slate-400" />
              <p className="mt-4 text-xl font-black text-slate-800">Priya</p>
              <p className="text-base font-bold text-slate-500">9,220 XP</p>
              <span className="mt-4 rounded-full bg-white px-4 py-1.5 text-sm font-black text-rose-500 shadow-sm flex items-center gap-2 border border-rose-50">
                🔥 12
              </span>
            </div>
          </div>

          {/* 1st Place (Alex) */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative mb-6">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl">👑</span>
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-amber-400 text-3xl font-black text-amber-800 bg-white ring-[6px] ring-white shadow-xl">
                AJ
              </div>
              <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-base font-black text-white shadow-lg">1</span>
            </div>
            <div className="w-full bg-[#fdf5d6] rounded-t-[3.5rem] p-8 flex flex-col items-center justify-center border-t border-x border-amber-250 shadow-inner h-72">
              <Crown className="h-14 w-14 text-amber-500" />
              <p className="mt-4 text-3xl font-black text-slate-800">Alex</p>
              <p className="text-lg font-bold text-slate-500">9,650 XP</p>
              <span className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-black text-rose-500 shadow-md flex items-center gap-2 border border-rose-50">
                🔥 15
              </span>
            </div>
          </div>

          {/* 3rd Place (Rohan) */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative mb-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-600 text-xl font-black text-amber-850 bg-white ring-4 ring-white shadow-md">
                RM
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 text-sm font-black text-white shadow">3</span>
            </div>
            <div className="w-full bg-[#fcead8] rounded-t-[3rem] p-6 flex flex-col items-center justify-center border-t border-x border-orange-200 shadow-inner h-48">
              <Medal className="h-10 w-10 text-amber-700" />
              <p className="mt-4 text-xl font-black text-slate-800">Rohan</p>
              <p className="text-base font-bold text-slate-500">8,750 XP</p>
              <span className="mt-4 rounded-full bg-white px-4 py-1.5 text-sm font-black text-rose-500 shadow-sm flex items-center gap-2 border border-rose-50">
                🔥 8
              </span>
            </div>
          </div>

        </div>

        {/* ── Rank List Table ── */}
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100/50">
          <div className="grid grid-cols-[80px_1fr_120px_120px_120px] items-center border-b border-slate-100 bg-slate-50/50 px-8 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Rank</span>
            <span>Student</span>
            <span className="text-right">Score</span>
            <span className="text-center">Streak</span>
            <span className="text-center">Badges</span>
          </div>

          <div className="divide-y divide-slate-100">
            {rest.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-[80px_1fr_120px_120px_120px] items-center px-8 py-6 transition hover:bg-slate-50/60 ${
                  entry.isYou ? "bg-violet-50/40 text-violet-900 border-y border-violet-100/40" : ""
                }`}
              >
                <span className={`text-base font-black ${entry.isYou ? "text-violet-600" : "text-slate-400"}`}>
                  #{entry.rank}
                </span>
                
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-[1.25rem] text-sm font-black text-white shadow-sm ${
                    entry.isYou ? "bg-violet-600" : "bg-slate-350 bg-slate-200 text-slate-650"
                  }`}>
                    {entry.initials}
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-800 flex items-center gap-2">
                      {entry.name}
                      {entry.isYou && (
                        <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="text-sm font-bold text-slate-400 mt-1">{entry.major}</p>
                  </div>
                </div>

                <p className={`text-right text-base font-black ${entry.isYou ? "text-violet-600" : "text-slate-700"}`}>
                  {entry.xp.toLocaleString()} XP
                </p>
                
                <p className="flex items-center justify-center gap-1.5 text-base font-black text-rose-500">
                  <Flame className="h-5 w-5 fill-rose-100 text-rose-500" /> {entry.streak}
                </p>
                
                <p className="flex items-center justify-center gap-1.5 text-base font-black text-indigo-500">
                  <Star className="h-5 w-5 fill-indigo-50 text-indigo-500" /> {entry.badges}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
