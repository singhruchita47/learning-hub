import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Trophy, Clock, TrendingUp } from "lucide-react";

const float = (delay = 0) => ({
  animate: { y: [0, -8, 0] },
  transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" as const, delay },
});

function CartoonBoy() {
  return (
    <svg viewBox="0 0 420 370" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">


      {/* ── Book stack (left) ── */}
      {/* Book 1 bottom */}
      <rect x="48" y="270" width="88" height="52" rx="7" fill="#1d4ed8" />
      <rect x="48" y="270" width="11" height="52" rx="5" fill="#1e3a8a" />
      <rect x="64" y="284" width="55" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="64" y="293" width="38" height="4" rx="2" fill="white" opacity="0.3" />
      {/* Book 2 */}
      <rect x="54" y="232" width="78" height="42" rx="7" fill="#374151" />
      <rect x="54" y="232" width="11" height="42" rx="5" fill="#1f2937" />
      <rect x="69" y="244" width="46" height="4" rx="2" fill="#93c5fd" opacity="0.5" />
      <rect x="69" y="253" width="32" height="4" rx="2" fill="#93c5fd" opacity="0.35" />
      {/* Book 3 top */}
      <rect x="60" y="200" width="66" height="36" rx="7" fill="#0ea5e9" />
      <rect x="60" y="200" width="11" height="36" rx="5" fill="#0284c7" />
      <rect x="75" y="210" width="40" height="4" rx="2" fill="white" opacity="0.5" />
      <rect x="75" y="219" width="28" height="4" rx="2" fill="white" opacity="0.35" />

      {/* ── Pencil ── */}
      <g transform="rotate(-18, 148, 190)">
        <rect x="140" y="130" width="10" height="100" rx="4" fill="#fbbf24" />
        <polygon points="140,130 150,130 145,112" fill="#fef3c7" />
        <rect x="140" y="225" width="10" height="10" rx="2" fill="#ef4444" />
        <rect x="141" y="232" width="8" height="4" rx="1" fill="#fecaca" />
      </g>

      {/* ── Legs (cross-legged) ── */}
      <ellipse cx="176" cy="308" rx="36" ry="20" fill="#1e3a5f" />
      <ellipse cx="244" cy="308" rx="36" ry="20" fill="#1e3a5f" />
      <ellipse cx="210" cy="316" rx="24" ry="14" fill="#172d4e" />
      {/* Shoes */}
      <ellipse cx="148" cy="318" rx="16" ry="9" fill="#111827" />
      <ellipse cx="272" cy="318" rx="16" ry="9" fill="#111827" />

      {/* ── Torso / Hoodie ── */}
      <rect x="162" y="218" width="96" height="82" rx="22" fill="#1d4ed8" />
      {/* Hoodie pocket */}
      <rect x="193" y="275" width="34" height="20" rx="8" fill="#1e3a8a" />
      {/* Hoodie zipper line */}
      <line x1="210" y1="225" x2="210" y2="265" stroke="#1e40af" strokeWidth="2.5" />

      {/* ── Left arm ── */}
      <path d="M166 232 Q132 255 128 288" stroke="#1d4ed8" strokeWidth="26" strokeLinecap="round" fill="none" />
      {/* Left hand */}
      <circle cx="128" cy="290" r="13" fill="#fbbf24" />

      {/* ── Right arm ── */}
      <path d="M254 232 Q288 255 290 288" stroke="#1d4ed8" strokeWidth="26" strokeLinecap="round" fill="none" />
      {/* Right hand */}
      <circle cx="290" cy="290" r="13" fill="#fbbf24" />

      {/* ── Laptop ── */}
      {/* Screen */}
      <rect x="134" y="238" width="152" height="96" rx="10" fill="#0f172a" />
      <rect x="134" y="238" width="152" height="96" rx="10" stroke="#334155" strokeWidth="2" />
      <rect x="142" y="246" width="136" height="80" rx="6" fill="#111827" />
      {/* Screen code lines */}
      <rect x="150" y="254" width="60" height="5" rx="2" fill="#3b82f6" opacity="0.9" />
      <rect x="150" y="264" width="88" height="5" rx="2" fill="#60a5fa" opacity="0.7" />
      <rect x="160" y="274" width="52" height="5" rx="2" fill="#34d399" opacity="0.8" />
      <rect x="160" y="284" width="68" height="5" rx="2" fill="#818cf8" opacity="0.65" />
      <rect x="150" y="294" width="76" height="5" rx="2" fill="#3b82f6" opacity="0.6" />
      {/* Cursor blink */}
      <rect x="230" y="294" width="2.5" height="8" rx="1" fill="white" opacity="0.8" />
      {/* Laptop base */}
      <rect x="125" y="332" width="170" height="10" rx="5" fill="#1e293b" />
      <rect x="134" y="330" width="152" height="4" rx="2" fill="#334155" />
      {/* Trackpad */}
      <rect x="184" y="337" width="52" height="2" rx="1" fill="#475569" />

      {/* ── Neck ── */}
      <rect x="200" y="200" width="20" height="24" rx="10" fill="#fbbf24" />

      {/* ── Head ── */}
      <circle cx="210" cy="172" r="46" fill="#fbbf24" />

      {/* ── Hair ── */}
      <path d="M168 166 Q172 120 210 116 Q248 120 252 166 Q244 140 210 136 Q176 140 168 166Z" fill="#111827" />
      {/* Side hair */}
      <path d="M168 166 Q162 155 167 140" stroke="#111827" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M252 166 Q258 155 253 140" stroke="#111827" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Hair top wave */}
      <path d="M178 130 Q195 122 210 126 Q225 122 242 130" stroke="#111827" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* ── Ears ── */}
      <circle cx="164" cy="172" r="11" fill="#fbbf24" />
      <circle cx="164" cy="172" r="7" fill="#f59e0b" />
      <circle cx="256" cy="172" r="11" fill="#fbbf24" />
      <circle cx="256" cy="172" r="7" fill="#f59e0b" />

      {/* ── Eyes ── */}
      <circle cx="193" cy="170" r="8" fill="white" />
      <circle cx="227" cy="170" r="8" fill="white" />
      <circle cx="194" cy="171" r="4.5" fill="#111827" />
      <circle cx="228" cy="171" r="4.5" fill="#111827" />
      {/* Eye highlights */}
      <circle cx="196" cy="169" r="1.8" fill="white" />
      <circle cx="230" cy="169" r="1.8" fill="white" />

      {/* ── Eyebrows ── */}
      <path d="M184 158 Q193 153 202 157" stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M218 157 Q227 153 236 158" stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* ── Smile ── */}
      <path d="M196 187 Q210 200 224 187" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="182" cy="183" rx="9" ry="6" fill="#fca5a5" opacity="0.45" />
      <ellipse cx="238" cy="183" rx="9" ry="6" fill="#fca5a5" opacity="0.45" />

      {/* ── Floating decorations ── */}
      {/* Star (top right) */}
      <path d="M355 70 L359 83 L372 87 L359 91 L355 104 L351 91 L338 87 L351 83Z" fill="#fbbf24" opacity="0.9" />
      {/* Small star */}
      <path d="M88 95 L91 103 L99 106 L91 109 L88 117 L85 109 L77 106 L85 103Z" fill="#60a5fa" opacity="0.8" />
      {/* Circle dot */}
      <circle cx="360" cy="160" r="6" fill="#34d399" opacity="0.7" />
      <circle cx="68" cy="170" r="5" fill="#a78bfa" opacity="0.7" />
      <circle cx="380" cy="260" r="4" fill="#f87171" opacity="0.6" />

      {/* Notification bubble (top right area) */}
      <rect x="295" y="130" width="88" height="38" rx="19" fill="white" opacity="0.92" />
      <circle cx="315" cy="149" r="10" fill="#3b82f6" />
      <path d="M310 149 L314 153 L320 144" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="330" y="143" width="40" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="330" y="152" width="28" height="5" rx="2.5" fill="#e2e8f0" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 45%, #ddd6fe 100%)" }}
    >

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-8 py-10 md:px-14 md:py-12">

        {/* ── LEFT: Text ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="flex-1 space-y-7"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            6 classes ongoing today
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Welcome Back,{" "}
              <span className="text-blue-600">Arjun!</span>
            </h1>
            <p className="text-base md:text-lg font-medium leading-relaxed max-w-md text-slate-500">
              Keep learning and achieve your goals today. You have{" "}
              <span className="font-bold text-slate-800">2 upcoming deadlines</span> this week.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="rounded-full px-8 font-bold text-white border-0"
                style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}
              >
                Continue Learning →
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-bold border-slate-300 text-slate-700 hover:bg-slate-100 bg-white"
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </motion.div>
          </div>

          {/* Quick numbers */}
          <div className="flex flex-wrap gap-8 pt-1 border-t border-slate-200">
            {[
              { label: "Courses", value: "11" },
              { label: "Quizzes Done", value: "24" },
              { label: "Certificates", value: "3" },
            ].map((s) => (
              <div key={s.label} className="pt-4">
                <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-xs font-semibold mt-0.5 text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Cartoon Boy + floating badges ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="flex-1 relative flex items-center justify-center min-h-[300px] md:min-h-[370px]"
        >
          {/* Cartoon SVG */}
          <div className="relative z-10 w-full max-w-[360px]">
            <CartoonBoy />
          </div>

          {/* Badge: top-left — Course progress */}
          <motion.div {...float(0)} className="absolute top-2 left-0 md:left-2 z-20">
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3 py-2 shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Data Structures</p>
                <p className="text-[10px] text-slate-400 font-medium">85% complete</p>
              </div>
            </div>
          </motion.div>

          {/* Badge: top-right — Rank */}
          <motion.div {...float(1.1)} className="absolute top-4 right-0 md:right-2 z-20">
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3 py-2 shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Rank #3</p>
                <p className="text-[10px] text-slate-400 font-medium">Leaderboard</p>
              </div>
            </div>
          </motion.div>

          {/* Badge: bottom-right — Deadline */}
          <motion.div {...float(0.6)} className="absolute bottom-4 right-0 md:right-2 z-20">
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3 py-2 shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100">
                <Clock className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Due in 2 days</p>
                <p className="text-[10px] text-slate-400 font-medium">Database Exam</p>
              </div>
            </div>
          </motion.div>

          {/* Badge: bottom-left — Progress */}
          <motion.div {...float(1.8)} className="absolute bottom-4 left-0 md:left-2 z-20">
            <div className="flex items-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 shadow-md">
              <TrendingUp className="h-4 w-4 text-white" />
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">72% Overall</p>
                <p className="text-[10px] text-blue-200 font-medium">Progress</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
