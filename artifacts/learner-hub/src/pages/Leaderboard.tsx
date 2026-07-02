import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Medal, Flame, Star, Trophy } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Alex Johnson",  initials: "AJ", major: "Computer Science",      xp: 9650, streak: 15, badges: 18, isYou: false },
  { rank: 2, name: "Priya Sharma",  initials: "PS", major: "Information Technology", xp: 9220, streak: 12, badges: 14, isYou: false },
  { rank: 3, name: "Rohan Mehta",   initials: "RM", major: "Computer Science",       xp: 8750, streak: 8,  badges: 11, isYou: false },
  { rank: 4, name: "Ananya Vorma",  initials: "AV", major: "Data Science",           xp: 8420, streak: 10, badges: 9,  isYou: false },
  { rank: 5, name: "Dev Patel",     initials: "DP", major: "Cyber Security",         xp: 7980, streak: 6,  badges: 8,  isYou: false },
  { rank: 6, name: "Sneha Reddy",   initials: "SR", major: "Computer Science",       xp: 7650, streak: 9,  badges: 7,  isYou: false },
  { rank: 7, name: "Arjun Singh",   initials: "AS", major: "Computer Science",       xp: 7320, streak: 7,  badges: 6,  isYou: true  },
  { rank: 8, name: "Vikram Kumar",  initials: "VK", major: "AI & ML",               xp: 6980, streak: 4,  badges: 5,  isYou: false },
  { rank: 9, name: "Mohit Joshi",   initials: "MJ", major: "Data Science",           xp: 6540, streak: 3,  badges: 4,  isYou: false },
  { rank: 10, name: "Ritu Singh",   initials: "RI", major: "Cyber Security",         xp: 6200, streak: 5,  badges: 3,  isYou: false },
];

const tabs = ["This Week", "This Month", "All Time"];

const podiumConfig = [
  { rank: 2, h: "h-36", gradientFrom: "#CBD5E1", gradientTo: "#94A3B8", textColor: "#475569", label: "2nd", icon: <Medal className="h-6 w-6" /> },
  { rank: 1, h: "h-48", gradientFrom: "#FDE68A", gradientTo: "#F59E0B", textColor: "#92400E", label: "1st", icon: <Crown  className="h-6 w-6" /> },
  { rank: 3, h: "h-28", gradientFrom: "#FED7AA", gradientTo: "#FB923C", textColor: "#7C2D12", label: "3rd", icon: <Medal className="h-6 w-6" /> },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState(0);

  const top3 = [leaderboardData[1], leaderboardData[0], leaderboardData[2]]; // [2nd, 1st, 3rd]
  const rest = leaderboardData.slice(3);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1100px] mx-auto animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-amber-500" />
          <h1 className="text-4xl font-extrabold text-foreground">Leaderboard</h1>
          <Trophy className="h-8 w-8 text-amber-500" />
        </div>
        <p className="text-muted-foreground font-medium">This Week's Rankings</p>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 mt-5">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === i ? "bg-primary text-white shadow-md shadow-primary/30" : "text-muted-foreground hover:bg-muted"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Podium ── */}
      <div className="flex items-end justify-center gap-4 mb-10 px-4">
        {podiumConfig.map((pod, i) => {
          const player = top3[i];
          const isGold = pod.rank === 1;
          return (
            <motion.div
              key={pod.rank}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col items-center"
              style={{ flex: isGold ? "0 0 180px" : "0 0 150px" }}
            >
              {/* Floating avatar */}
              <div className="relative mb-3">
                <div className={`flex items-center justify-center rounded-full border-4 border-white shadow-xl font-extrabold text-white ${
                  isGold ? "h-16 w-16 text-lg" : "h-12 w-12 text-sm"
                }`} style={{ background: `linear-gradient(135deg, ${pod.gradientFrom}, ${pod.gradientTo})`, color: pod.textColor }}>
                  {player.initials}
                </div>
                {isGold && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Crown className="h-6 w-6 text-amber-500 fill-amber-400 drop-shadow" />
                  </div>
                )}
              </div>

              {/* Podium card */}
              <div
                className={`w-full rounded-2xl flex flex-col items-center justify-end pb-5 pt-4 shadow-lg ${pod.h}`}
                style={{ background: `linear-gradient(180deg, ${pod.gradientFrom}66 0%, ${pod.gradientFrom}cc 100%)`, border: `1px solid ${pod.gradientFrom}80` }}
              >
                <div className="flex items-center justify-center mb-1" style={{ color: pod.textColor }}>
                  {pod.icon}
                </div>
                <p className={`font-extrabold text-slate-800 text-center leading-tight ${isGold ? "text-base" : "text-sm"}`}>
                  {player.name.split(" ")[0]}
                </p>
                <p className="text-sm font-extrabold text-slate-700 mt-0.5">{player.xp.toLocaleString()} XP</p>
                <div className="flex items-center gap-1 mt-1.5 rounded-full bg-white/60 px-2 py-0.5">
                  <Flame className="h-3 w-3 text-orange-500 fill-orange-400" />
                  <span className="text-xs font-bold text-slate-600">{player.streak}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Rankings Table ── */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_120px_100px_80px] px-5 py-3 border-b border-gray-100 bg-slate-50">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Rank</span>
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Student</span>
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Score</span>
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center">Streak</span>
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center">Badges</span>
        </div>

        {rest.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className={`grid grid-cols-[60px_1fr_120px_100px_80px] items-center px-5 py-3.5 border-b border-gray-50 last:border-0 transition-colors ${
              entry.isYou ? "bg-primary/[0.05]" : "hover:bg-slate-50/70"
            }`}
          >
            <span className={`font-extrabold ${entry.isYou ? "text-primary" : "text-slate-400"}`}>#{entry.rank}</span>

            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-sm ${
                entry.isYou ? "bg-primary" : "bg-slate-300"
              }`}>
                {entry.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${entry.isYou ? "text-primary" : "text-slate-800"}`}>{entry.name}</span>
                  {entry.isYou && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">YOU</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium">{entry.major}</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-sm font-extrabold ${entry.isYou ? "text-primary" : "text-slate-700"}`}>
                {entry.xp.toLocaleString()} XP
              </span>
            </div>

            <div className="flex items-center justify-center gap-1">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-400" />
              <span className="text-sm font-bold text-slate-600">{entry.streak}</span>
            </div>

            <div className="flex items-center justify-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-600">{entry.badges}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Rank callout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-5 flex items-center justify-between rounded-2xl border-2 border-primary/20 bg-primary/5 px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-extrabold">AS</div>
          <div>
            <p className="text-sm font-extrabold text-foreground">Your Current Position</p>
            <p className="text-xs text-muted-foreground">Keep learning to climb the ranks!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-primary">#7</div>
          <div className="text-xs font-bold text-muted-foreground">7,320 XP</div>
        </div>
      </motion.div>
    </div>
  );
}
