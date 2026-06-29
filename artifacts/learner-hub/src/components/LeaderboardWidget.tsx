import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { leaderboard } from "@/data/leaderboard";

const rankMeta = [
  { bg: "from-yellow-400 to-amber-500", text: "text-white", badge: "bg-yellow-500", glow: "0 4px 20px rgba(245,158,11,0.4)", label: "🥇" },
  { bg: "from-slate-400 to-slate-500", text: "text-white", badge: "bg-slate-500", glow: "0 4px 20px rgba(100,116,139,0.35)", label: "🥈" },
  { bg: "from-amber-700 to-orange-800", text: "text-white", badge: "bg-amber-700", glow: "0 4px 20px rgba(180,83,9,0.3)", label: "🥉" },
];

export default function LeaderboardWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white shadow-xl border border-primary/5 h-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          Top Learners
        </h2>
        <Link href="/leaderboard" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          View All →
        </Link>
      </div>

      {/* Top 3 podium mini */}
      <div className="flex items-end justify-center gap-3 px-6 pb-4 pt-1">
        {/* 2nd place */}
        {leaderboard[1] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <Avatar className="h-10 w-10 ring-2 ring-slate-400 ring-offset-1">
              <AvatarFallback className="text-xs font-extrabold bg-gradient-to-br from-slate-400 to-slate-500 text-white">{leaderboard[1].initials}</AvatarFallback>
            </Avatar>
            <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">🥈 2nd</div>
            <div className="h-10 w-16 rounded-t-lg bg-gradient-to-t from-slate-200 to-slate-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-500">{leaderboard[1].xp}</span>
            </div>
          </motion.div>
        )}
        {/* 1st place */}
        {leaderboard[0] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-yellow-400 ring-offset-2 shadow-lg" style={{ boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}>
                <AvatarFallback className="text-sm font-extrabold bg-gradient-to-br from-yellow-400 to-amber-500 text-white">{leaderboard[0].initials}</AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">👑</div>
            </div>
            <div className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">🥇 1st</div>
            <div className="h-14 w-16 rounded-t-lg bg-gradient-to-t from-yellow-200 to-yellow-50 flex items-center justify-center">
              <span className="text-[10px] font-bold text-yellow-700">{leaderboard[0].xp}</span>
            </div>
          </motion.div>
        )}
        {/* 3rd place */}
        {leaderboard[2] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex flex-col items-center gap-1"
          >
            <Avatar className="h-9 w-9 ring-2 ring-amber-700 ring-offset-1">
              <AvatarFallback className="text-xs font-extrabold bg-gradient-to-br from-amber-700 to-orange-800 text-white">{leaderboard[2].initials}</AvatarFallback>
            </Avatar>
            <div className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">🥉 3rd</div>
            <div className="h-7 w-16 rounded-t-lg bg-gradient-to-t from-orange-200 to-orange-50 flex items-center justify-center">
              <span className="text-[10px] font-bold text-orange-700">{leaderboard[2].xp}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Full list */}
      <div className="flex-1 divide-y divide-gray-50 px-4 pb-4">
        {leaderboard.slice(0, 5).map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ backgroundColor: "#F8FAFC" }}
            className="flex items-center gap-3 py-2.5 px-2 rounded-xl cursor-pointer transition-colors"
          >
            {/* Rank */}
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold
              ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-100 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
              {i < 3 ? ['🥇','🥈','🥉'][i] : user.rank}
            </div>

            <Avatar className="h-8 w-8 border border-gray-100">
              <AvatarFallback className="text-[10px] font-extrabold bg-primary/10 text-primary">{user.initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-foreground truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate font-medium">{user.major}</p>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm font-extrabold text-primary">{user.xp}</span>
              <span className="text-[10px] text-muted-foreground font-medium">XP</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5 font-bold rounded-xl" asChild>
          <Link href="/leaderboard">View Full Leaderboard →</Link>
        </Button>
      </div>
    </motion.div>
  );
}
