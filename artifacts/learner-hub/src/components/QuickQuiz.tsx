import { motion } from "framer-motion";
import { HelpCircle, ArrowRight, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { quizzes } from "@/data/quizzes";

export default function QuickQuiz() {
  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'text-emerald-500 bg-emerald-500/10';
      case 'Medium': return 'text-amber-500 bg-amber-500/10';
      case 'Hard': return 'text-red-500 bg-red-500/10';
      default: return 'text-primary bg-primary/10';
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
          <HelpCircle className="h-5 w-5 text-primary" />
          Quick Quizzes
        </h2>
        <Link href="/quizzes" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {quizzes.slice(0, 4).map((quiz, i) => (
          <motion.div 
            key={quiz.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
          >
            <div className="flex items-start gap-4 mb-3 sm:mb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1 sm:mt-0">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{quiz.title}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {quiz.questions} Qs</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {quiz.time}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] uppercase tracking-wider ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full sm:w-auto rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
              Start
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
