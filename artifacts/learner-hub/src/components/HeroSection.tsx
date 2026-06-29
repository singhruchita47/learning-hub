import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { GraduationCap, BookOpen, Trophy, Clock } from "lucide-react";

const floatAnim = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

export default function HeroSection() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: "linear-gradient(135deg, #bfcbff 0%, #d4c8ff 45%, #c2b0ff 100%)",
      }}
    >
      {/* Soft glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -left-12 h-40 w-40 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }} />
      </div>

      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #312e81 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-8 py-10 md:px-14 md:py-14">

        {/* ── LEFT: Text content ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-white/30 text-indigo-900 backdrop-blur-sm border border-white/40">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            6 classes ongoing today
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-950 leading-[1.1]">
              Welcome Back,{" "}
              <span className="text-indigo-700">Arjun</span>{" "}
              <span>👋</span>
            </h1>
            <p className="text-base md:text-lg text-indigo-800/80 max-w-lg leading-relaxed font-medium">
              Keep learning and achieve your goals today. You have{" "}
              <span className="font-bold text-indigo-900">2 upcoming deadlines</span> this week.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="rounded-full px-8 text-base font-bold bg-indigo-700 hover:bg-indigo-800 text-white shadow-lg shadow-indigo-900/25 border-0"
              >
                Continue Learning →
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base font-bold bg-white/50 hover:bg-white/80 backdrop-blur-sm border-white/60 text-indigo-900"
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </motion.div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 pt-2">
            {[
              { label: "Courses Enrolled", value: "11" },
              { label: "Quizzes Done", value: "24" },
              { label: "Certificates", value: "3" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-indigo-900">{s.value}</div>
                <div className="text-xs font-semibold text-indigo-700/80 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Floating cards illustration ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="flex-1 flex items-center justify-center relative min-h-[280px] md:min-h-[320px]"
        >
          {/* Central circle */}
          <div className="absolute h-52 w-52 rounded-full bg-white/20 backdrop-blur-sm border border-white/40" />
          <div className="absolute h-64 w-64 rounded-full border border-white/25 border-dashed animate-spin" style={{ animationDuration: "18s" }} />

          {/* Center icon */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/60 backdrop-blur-md shadow-xl border border-white/70">
            <GraduationCap className="h-12 w-12 text-indigo-700" />
          </div>

          {/* Floating card — top left */}
          <motion.div {...floatAnim} transition={{ ...floatAnim.transition, delay: 0 }}
            className="absolute -top-2 left-4 md:left-8 flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur-sm px-4 py-2.5 shadow-lg border border-white/60"
          >
            <div className="h-8 w-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Data Structures</p>
              <p className="text-[10px] text-gray-500 font-medium">85% complete</p>
            </div>
          </motion.div>

          {/* Floating card — right */}
          <motion.div {...floatAnim} transition={{ ...floatAnim.transition, delay: 1.2 }}
            className="absolute top-1/4 -right-2 md:right-0 flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur-sm px-4 py-2.5 shadow-lg border border-white/60"
          >
            <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Rank #3</p>
              <p className="text-[10px] text-gray-500 font-medium">Leaderboard</p>
            </div>
          </motion.div>

          {/* Floating card — bottom right */}
          <motion.div {...floatAnim} transition={{ ...floatAnim.transition, delay: 0.6 }}
            className="absolute bottom-4 right-4 md:right-6 flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur-sm px-4 py-2.5 shadow-lg border border-white/60"
          >
            <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Due in 2 days</p>
              <p className="text-[10px] text-gray-500 font-medium">Database Exam</p>
            </div>
          </motion.div>

          {/* Floating card — bottom left */}
          <motion.div {...floatAnim} transition={{ ...floatAnim.transition, delay: 1.8 }}
            className="absolute bottom-4 left-2 md:left-6 flex items-center gap-2 rounded-2xl bg-indigo-700/90 backdrop-blur-sm px-4 py-2.5 shadow-lg"
          >
            <span className="text-lg">🎯</span>
            <div>
              <p className="text-xs font-bold text-white">72% Overall</p>
              <p className="text-[10px] text-indigo-200 font-medium">Progress</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
