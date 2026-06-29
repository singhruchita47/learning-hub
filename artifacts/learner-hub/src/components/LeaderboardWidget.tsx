import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { leaderboard } from "@/data/leaderboard";

export default function LeaderboardWidget() {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-500 fill-yellow-500/20";
      case 2: return "text-slate-400 fill-slate-400/20";
      case 3: return "text-amber-700 fill-amber-700/20";
      default: return "text-transparent";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Top Learners
        </h2>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {leaderboard.slice(0, 5).map((user, i) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-muted/50"
          >
            <div className="relative flex items-center justify-center w-6">
              {user.rank <= 3 ? (
                <Medal className={`h-6 w-6 ${getMedalColor(user.rank)}`} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">{user.rank}</span>
              )}
            </div>
            
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">{user.initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.major}</p>
            </div>
            
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {user.xp}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <Button variant="ghost" className="mt-4 w-full text-primary hover:text-primary hover:bg-primary/5" asChild>
        <Link href="/leaderboard">View Full Leaderboard</Link>
      </Button>
    </motion.div>
  );
}
