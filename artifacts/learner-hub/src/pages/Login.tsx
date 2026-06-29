import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, GraduationCap, BookOpen, Users, Shield, Sparkles } from "lucide-react";

type Role = "student" | "faculty" | "admin";

interface LoginProps {
  onLogin: (role: Role, name: string) => void;
}

const demoAccounts: Record<Role, { name: string; email: string; password: string }> = {
  student: { name: "Arjun Singh", email: "arjun.singh@learnerhub.edu", password: "student@123" },
  faculty: { name: "Dr. Sarah Chen", email: "sarah.chen@learnerhub.edu", password: "faculty@123" },
  admin:   { name: "Admin User",    email: "admin@learnerhub.edu",       password: "admin@123"   },
};

const roleConfig = {
  student: { label: "Student",  icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-400",  ring: "ring-indigo-500"  },
  faculty: { label: "Faculty",  icon: Users,    color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-400", ring: "ring-emerald-500" },
  admin:   { label: "Admin",    icon: Shield,   color: "text-violet-600", bg: "bg-violet-50",  border: "border-violet-400",  ring: "ring-violet-500"  },
};

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole]           = useState<Role>("student");
  const [name, setName]           = useState(demoAccounts.student.name);
  const [email, setEmail]         = useState(demoAccounts.student.email);
  const [password, setPassword]   = useState(demoAccounts.student.password);
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  function handleRoleChange(r: Role) {
    setRole(r);
    setName(demoAccounts[r].name);
    setEmail(demoAccounts[r].email);
    setPassword(demoAccounts[r].password);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim())     { setError("Please enter your name.");     return; }
    if (!email.trim())    { setError("Please enter your email.");    return; }
    if (!password.trim()) { setError("Please enter your password."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role, name.trim());
    }, 1400);
  }

  const cfg = roleConfig[role];
  const RoleIcon = cfg.icon;

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #EDE9FE 100%)" }}>

      {/* ── Left panel ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[48%] p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #4F46E5 0%, #7C3AED 60%, #6D28D9 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-10 h-48 w-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #A5B4FC 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Learner Hub</span>
        </div>

        {/* Centre illustration */}
        <div className="relative z-10 flex flex-col gap-8">
          {/* Big quote */}
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              The future belongs<br/>to those who<br/>
              <span className="text-yellow-300">keep learning.</span>
            </h2>
            <p className="text-indigo-200 text-lg font-medium max-w-xs">
              Access your courses, track progress, and achieve your academic goals — all in one place.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "50K+", label: "Students" },
              { value: "200+", label: "Courses" },
              { value: "98%",  label: "Success Rate" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs font-semibold text-indigo-200 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 flex items-center gap-2 text-indigo-200 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          Trusted by 50,000+ students across 120 universities
        </div>
      </motion.div>

      {/* ── Right panel (form) ─────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-foreground">Learner Hub</span>
          </div>

          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-2xl border border-white/60 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-foreground mb-1">Welcome back 👋</h1>
              <p className="text-muted-foreground text-sm font-medium">Sign in to continue to your dashboard</p>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <label className="block text-xs font-extrabold text-foreground uppercase tracking-widest mb-3">Sign in as</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(roleConfig) as Role[]).map((r) => {
                  const rc = roleConfig[r];
                  const Icon = rc.icon;
                  const active = role === r;
                  return (
                    <motion.button
                      key={r}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 py-3 px-2 transition-all font-semibold text-sm
                        ${active ? `${rc.bg} ${rc.border} ${rc.color} shadow-md` : "bg-gray-50 border-gray-200 text-muted-foreground hover:bg-gray-100"}`}
                    >
                      <Icon className={`h-5 w-5 ${active ? rc.color : "text-muted-foreground"}`} />
                      {rc.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  data-testid="input-name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.edu"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  data-testid="input-email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-semibold text-red-500 bg-red-50 rounded-xl px-4 py-2"
                >
                  {error}
                </motion.p>
              )}

              {/* Demo hint */}
              <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3">
                <p className="text-xs font-bold text-primary mb-1">Demo credentials auto-filled</p>
                <p className="text-[11px] text-muted-foreground">Switch roles above to load different demo accounts. Just click Sign In!</p>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                data-testid="button-signin"
                className="w-full rounded-xl py-3.5 text-base font-extrabold text-white shadow-xl transition-all disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 24px rgba(79,70,229,0.35)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In →"
                )}
              </motion.button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground font-medium">
            This is a demo application. No real authentication is performed.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
