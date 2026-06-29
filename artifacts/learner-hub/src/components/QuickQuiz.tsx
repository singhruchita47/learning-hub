import { motion } from "framer-motion";
import { HelpCircle, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { quizzes } from "@/data/quizzes";

const difficultyStyle: Record<string, string> = {
  Easy:   "text-emerald-600 bg-emerald-50 border border-emerald-200",
  Medium: "text-amber-600  bg-amber-50  border border-amber-200",
  Hard:   "text-red-600    bg-red-50    border border-red-200",
};

export default function QuickQuiz() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white p-5 shadow-lg border border-primary/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <HelpCircle className="h-4 w-4 text-amber-500" />
          </div>
          Quick Quizzes
        </h2>
        <Link href="/quizzes" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Compact list */}
      <div className="flex flex-col gap-2">
        {quizzes.slice(0, 5).map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all"
          >
            {/* Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 bg-primary/10">
              <HelpCircle className="h-4 w-4 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                {quiz.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <BookOpen className="h-2.5 w-2.5" /> {quiz.questions}Q
                </span>
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" /> {quiz.time}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${difficultyStyle[quiz.difficulty] ?? ""}`}>
                  {quiz.difficulty}
                </span>
              </div>
            </div>

            {/* Start button */}
            <Button
              size="sm"
              className="h-7 shrink-0 rounded-full px-3 text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors shadow-none"
            >
              Start
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
