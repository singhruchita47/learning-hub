import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Trophy, Clock, TrendingUp } from "lucide-react";

const float = (delay = 0) => ({
  animate: { y: [0, -7, 0] },
  transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay },
});

export default function HeroSection() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 60%, #ede9fe 100%)" }}
    >
      {/* Subtle top-right accent */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 65%)",
        }}
      />
      {/* Bottom-left accent */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 px-8 py-10 md:px-14 md:py-12">

        {/* ── LEFT: Text ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="flex-1 space-y-7"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            6 classes ongoing today
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]" style={{ color: "#1e1b4b" }}>
              Welcome Back,{" "}
              <span style={{ color: "#4338ca" }}>Arjun!</span>
            </h1>
            <p className="text-base md:text-lg font-medium leading-relaxed max-w-md" style={{ color: "#4b5563" }}>
              Keep learning and achieve your goals today. You have{" "}
              <span className="font-bold" style={{ color: "#1e1b4b" }}>2 upcoming deadlines</span> this week.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="rounded-full px-8 font-bold text-white border-0 shadow-lg"
                style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)", boxShadow: "0 8px 24px rgba(67,56,202,0.3)" }}
              >
                Continue Learning →
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-bold bg-white hover:bg-indigo-50 border-indigo-200"
                style={{ color: "#4338ca" }}
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </motion.div>
          </div>

          {/* Quick numbers */}
          <div className="flex flex-wrap gap-8 pt-1">
            {[
              { label: "Courses", value: "11" },
              { label: "Quizzes Done", value: "24" },
              { label: "Certificates", value: "3" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold" style={{ color: "#1e1b4b" }}>{s.value}</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Photo + floating badges ── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-1 flex items-center justify-center relative min-h-[300px] md:min-h-[360px]"
        >
          {/* Decorative circle behind photo */}
          <div
            className="absolute h-64 w-64 md:h-72 md:w-72 rounded-full"
            style={{ background: "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 100%)" }}
          />

          {/* Student photo */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10 h-60 w-60 md:h-72 md:w-72 overflow-hidden rounded-full border-4 border-white shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efd?w=560&h=560&fit=crop&auto=format"
              alt="Student learning"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Badge: top-left — Course progress */}
          <motion.div {...float(0)} className="absolute top-2 left-2 md:left-6">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg border border-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100">
                <BookOpen className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800 leading-tight">Data Structures</p>
                <p className="text-[10px] text-gray-400 font-medium">85% complete</p>
              </div>
            </div>
          </motion.div>

          {/* Badge: top-right — Rank */}
          <motion.div {...float(1.1)} className="absolute top-4 right-0 md:right-4">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg border border-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800 leading-tight">Rank #3</p>
                <p className="text-[10px] text-gray-400 font-medium">Leaderboard</p>
              </div>
            </div>
          </motion.div>

          {/* Badge: bottom-right — Deadline */}
          <motion.div {...float(0.6)} className="absolute bottom-6 right-0 md:right-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg border border-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100">
                <Clock className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800 leading-tight">Due in 2 days</p>
                <p className="text-[10px] text-gray-400 font-medium">Database Exam</p>
              </div>
            </div>
          </motion.div>

          {/* Badge: bottom-left — Progress pill */}
          <motion.div {...float(1.8)} className="absolute bottom-4 left-0 md:left-4">
            <div
              className="flex items-center gap-2 rounded-2xl px-3 py-2 shadow-lg"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <TrendingUp className="h-4 w-4 text-white" />
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">72% Overall</p>
                <p className="text-[10px] text-indigo-200 font-medium">Progress</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
