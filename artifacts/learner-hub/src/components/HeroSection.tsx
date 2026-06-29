import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

function BookCartoonIllustration() {
  return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      {/* Background blobs */}
      <ellipse cx="320" cy="180" rx="90" ry="80" fill="#E0E7FF" opacity="0.6" />
      <ellipse cx="100" cy="240" rx="60" ry="50" fill="#DDD6FE" opacity="0.5" />
      <ellipse cx="380" cy="60" rx="50" ry="45" fill="#C7D2FE" opacity="0.4" />

      {/* Floating stars */}
      <circle cx="60" cy="60" r="5" fill="#F59E0B" opacity="0.8" />
      <circle cx="380" cy="130" r="4" fill="#10B981" opacity="0.8" />
      <circle cx="30" cy="180" r="3" fill="#7C3AED" opacity="0.7" />
      <circle cx="400" cy="250" r="5" fill="#EF4444" opacity="0.6" />

      {/* Sparkle star shapes */}
      <path d="M350 40 L353 48 L361 51 L353 54 L350 62 L347 54 L339 51 L347 48 Z" fill="#F59E0B" opacity="0.9" />
      <path d="M80 110 L82 116 L88 118 L82 120 L80 126 L78 120 L72 118 L78 116 Z" fill="#4F46E5" opacity="0.7" />

      {/* Desk surface */}
      <rect x="40" y="250" width="340" height="16" rx="8" fill="#C7D2FE" opacity="0.5" />

      {/* Big stack of books on left */}
      {/* Book 1 (bottom, widest) */}
      <rect x="55" y="200" width="110" height="52" rx="6" fill="#4F46E5" />
      <rect x="55" y="200" width="10" height="52" rx="4" fill="#3730A3" />
      <rect x="70" y="212" width="80" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="70" y="222" width="55" height="4" rx="2" fill="white" opacity="0.3" />

      {/* Book 2 */}
      <rect x="62" y="160" width="100" height="44" rx="6" fill="#7C3AED" />
      <rect x="62" y="160" width="10" height="44" rx="4" fill="#5B21B6" />
      <rect x="76" y="172" width="70" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="76" y="182" width="50" height="4" rx="2" fill="white" opacity="0.3" />

      {/* Book 3 */}
      <rect x="68" y="126" width="90" height="38" rx="6" fill="#10B981" />
      <rect x="68" y="126" width="10" height="38" rx="4" fill="#059669" />
      <rect x="82" y="137" width="60" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="82" y="147" width="40" height="4" rx="2" fill="white" opacity="0.3" />

      {/* Book 4 (top, small) - tilted */}
      <g transform="rotate(-8, 108, 120)">
        <rect x="75" y="100" width="78" height="30" rx="6" fill="#F59E0B" />
        <rect x="75" y="100" width="10" height="30" rx="4" fill="#D97706" />
        <rect x="89" y="110" width="48" height="3" rx="2" fill="white" opacity="0.5" />
      </g>

      {/* Pencil behind books */}
      <g transform="rotate(-15, 180, 150)">
        <rect x="170" y="90" width="10" height="130" rx="4" fill="#F59E0B" />
        <polygon points="170,90 180,90 175,72" fill="#FDE68A" />
        <rect x="170" y="210" width="10" height="12" rx="2" fill="#F87171" />
        <rect x="170" y="218" width="10" height="4" rx="1" fill="#FECACA" />
      </g>

      {/* Laptop */}
      <rect x="200" y="185" width="155" height="2" rx="1" fill="#94A3B8" />
      {/* Laptop base */}
      <rect x="195" y="213" width="165" height="38" rx="8" fill="#CBD5E1" />
      <rect x="210" y="220" width="135" height="24" rx="4" fill="#94A3B8" />
      {/* Touchpad */}
      <rect x="257" y="228" width="42" height="10" rx="4" fill="#7C8FA8" />
      {/* Laptop screen */}
      <rect x="207" y="130" width="142" height="90" rx="10" fill="#1E1B4B" />
      <rect x="214" y="137" width="128" height="76" rx="6" fill="#312E81" />
      {/* Screen content - code lines */}
      <rect x="220" y="145" width="70" height="5" rx="2" fill="#818CF8" opacity="0.8" />
      <rect x="220" y="155" width="90" height="5" rx="2" fill="#4F46E5" opacity="0.7" />
      <rect x="228" y="165" width="50" height="5" rx="2" fill="#10B981" opacity="0.8" />
      <rect x="228" y="175" width="65" height="5" rx="2" fill="#7C3AED" opacity="0.6" />
      <rect x="220" y="185" width="80" height="5" rx="2" fill="#818CF8" opacity="0.5" />
      <rect x="220" y="195" width="55" height="5" rx="2" fill="#10B981" opacity="0.7" />
      {/* Cursor blink */}
      <rect x="279" y="195" width="2" height="8" rx="1" fill="white" opacity="0.9" />
      {/* Screen hinge */}
      <rect x="207" y="218" width="142" height="5" rx="2" fill="#94A3B8" />

      {/* Graduation cap */}
      <g transform="translate(300, 65)">
        {/* Board */}
        <ellipse cx="0" cy="0" rx="38" ry="10" fill="#1E1B4B" />
        {/* Top block */}
        <rect x="-20" y="-30" width="40" height="32" rx="4" fill="#312E81" />
        {/* Board shadow */}
        <ellipse cx="0" cy="0" rx="30" ry="6" fill="#4338CA" opacity="0.4" />
        {/* Tassel string */}
        <line x1="30" y1="-5" x2="42" y2="20" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Tassel end */}
        <circle cx="42" cy="22" r="5" fill="#F59E0B" />
        <line x1="38" y1="26" x2="36" y2="34" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="27" x2="42" y2="36" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="46" y1="26" x2="48" y2="34" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        {/* Stars on cap */}
        <circle cx="-8" cy="-18" r="2" fill="#A5B4FC" opacity="0.7" />
        <circle cx="8" cy="-14" r="1.5" fill="#C7D2FE" opacity="0.6" />
      </g>

      {/* Small plant pot on the right */}
      <g transform="translate(355, 180)">
        {/* Pot */}
        <path d="M-18 40 L18 40 L14 20 L-14 20 Z" fill="#F97316" />
        <rect x="-20" y="18" width="40" height="6" rx="3" fill="#EA580C" />
        {/* Soil */}
        <ellipse cx="0" cy="19" rx="14" ry="4" fill="#78350F" />
        {/* Stem */}
        <path d="M0 18 Q-12 0 -8 -20" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M0 10 Q10 -5 6 -22" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <ellipse cx="-12" cy="-14" rx="10" ry="6" fill="#22C55E" transform="rotate(-30, -12, -14)" />
        <ellipse cx="9" cy="-16" rx="10" ry="6" fill="#4ADE80" transform="rotate(30, 9, -16)" />
        <ellipse cx="-6" cy="-26" rx="8" ry="5" fill="#16A34A" transform="rotate(-10, -6, -26)" />
      </g>

      {/* Notebook with pencil */}
      <g transform="translate(165, 210)">
        <rect x="0" y="0" width="55" height="42" rx="6" fill="white" />
        <rect x="0" y="0" width="8" height="42" rx="4" fill="#EF4444" />
        <rect x="0" y="0" width="55" height="42" rx="6" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Spiral */}
        <circle cx="4" cy="8" r="3" fill="white" stroke="#EF4444" strokeWidth="1.5" />
        <circle cx="4" cy="17" r="3" fill="white" stroke="#EF4444" strokeWidth="1.5" />
        <circle cx="4" cy="26" r="3" fill="white" stroke="#EF4444" strokeWidth="1.5" />
        <circle cx="4" cy="35" r="3" fill="white" stroke="#EF4444" strokeWidth="1.5" />
        {/* Lines */}
        <rect x="14" y="10" width="32" height="3" rx="1.5" fill="#E2E8F0" />
        <rect x="14" y="18" width="26" height="3" rx="1.5" fill="#E2E8F0" />
        <rect x="14" y="26" width="30" height="3" rx="1.5" fill="#E2E8F0" />
        <rect x="14" y="34" width="20" height="3" rx="1.5" fill="#E2E8F0" />
      </g>

      {/* Floating notification bubble */}
      <g transform="translate(295, 110)">
        <rect x="0" y="0" width="65" height="28" rx="14" fill="white" />
        <rect x="0" y="0" width="65" height="28" rx="14" stroke="#E0E7FF" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="7" fill="#10B981" />
        <text x="14" y="18" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">✓</text>
        <rect x="26" y="8" width="30" height="4" rx="2" fill="#CBD5E1" />
        <rect x="26" y="16" width="22" height="4" rx="2" fill="#E2E8F0" />
      </g>

      {/* XP badge floating */}
      <g transform="translate(60, 70)">
        <rect x="0" y="0" width="52" height="24" rx="12" fill="#4F46E5" />
        <text x="26" y="16" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">+50 XP</text>
      </g>
    </svg>
  );
}

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl p-8 md:p-10" style={{background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #EDE9FE 100%)"}}>
      {/* Decorative blobs */}
      <div className="absolute right-0 top-0 -z-10 h-[350px] w-[350px] translate-x-1/4 -translate-y-1/4 rounded-full" style={{background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)"}} />
      <div className="absolute bottom-0 left-1/3 -z-10 h-[200px] w-[200px] translate-y-1/3 rounded-full" style={{background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)"}} />
      <div className="absolute top-1/2 left-0 -z-10 h-[150px] w-[150px] -translate-x-1/2 rounded-full" style={{background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)"}} />

      <div className="flex flex-col-reverse md:flex-row items-center gap-6 justify-between">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="flex-1 space-y-6 z-10"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold" style={{background: "rgba(79,70,229,0.1)", color: "#4F46E5"}}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              6 classes ongoing today
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Welcome Back,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Arjun</span>{" "}
              <span className="inline-block origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Keep learning and achieve your goals today. You have <strong className="text-foreground">2 upcoming deadlines</strong> this week.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="rounded-full px-8 text-base font-bold shadow-xl" style={{background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 32px rgba(79,70,229,0.35)"}}>
                Continue Learning →
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base font-bold bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-white" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </motion.div>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { label: "Courses Enrolled", value: "11" },
              { label: "Quizzes Done", value: "24" },
              { label: "Certificates", value: "3" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-1 flex items-center justify-center max-w-md w-full"
        >
          <BookCartoonIllustration />
        </motion.div>
      </div>
    </div>
  );
}
