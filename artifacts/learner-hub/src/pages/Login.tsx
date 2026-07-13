import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, GraduationCap, LockKeyhole,
  BookOpen, Users, Shield, ArrowRight, CheckCircle2,
} from "lucide-react";
import { AUTH_API_BASE } from "@/lib/api";

const API_BASE = AUTH_API_BASE;

type Role = "student" | "faculty" | "admin";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
};

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

const roleConfig = {
  student: { label: "Student", icon: BookOpen, color: "#6c5ce7" },
  faculty: { label: "Faculty", icon: Users, color: "#00b894" },
  admin:   { label: "Admin",   icon: Shield, color: "#e17055" },
};

const features = [
  "Track assignments, quizzes & live classes",
  "AI-powered resume builder",
  "Real-time leaderboard & XP system",
  "Secure role-based access",
];

function LearnerIllustration() {
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Floating cards */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-4 rounded-2xl bg-white px-3 py-2.5 shadow-xl text-xs font-black text-[#6c5ce7] border border-purple-100"
      >
        📊 Data Structures<br />
        <span className="text-[10px] font-bold text-slate-400">85% complete</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute top-6 right-2 rounded-2xl bg-white px-3 py-2.5 shadow-xl text-xs font-black text-amber-600 border border-amber-100"
      >
        🏆 Rank #3<br />
        <span className="text-[10px] font-bold text-slate-400">Leaderboard</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-12 left-0 rounded-2xl bg-[#6c5ce7] px-3 py-2.5 shadow-xl text-xs font-black text-white"
      >
        📈 72% Overall<br />
        <span className="text-[10px] font-semibold text-purple-200">Progress</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute bottom-6 right-0 rounded-2xl bg-white px-3 py-2.5 shadow-xl text-xs font-black text-rose-600 border border-rose-100"
      >
        ⏰ Due in 2 days<br />
        <span className="text-[10px] font-bold text-slate-400">Database Exam</span>
      </motion.div>

      {/* Student SVG */}
      <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="170" rx="45" ry="10" fill="#ddd6fe" opacity="0.6"/>
        <rect x="45" y="130" width="110" height="8" rx="4" fill="#4f46e5"/>
        <rect x="52" y="90" width="96" height="44" rx="6" fill="#312e81"/>
        <rect x="56" y="93" width="88" height="38" rx="4" fill="#1e1b4b"/>
        <rect x="62" y="100" width="40" height="3" rx="1.5" fill="#6c5ce7"/>
        <rect x="62" y="107" width="55" height="3" rx="1.5" fill="#818cf8" opacity="0.7"/>
        <rect x="62" y="114" width="30" height="3" rx="1.5" fill="#818cf8" opacity="0.5"/>
        <rect x="62" y="121" width="45" height="3" rx="1.5" fill="#818cf8" opacity="0.4"/>
        <circle cx="122" cy="110" r="10" fill="#10b981" opacity="0.9"/>
        <path d="M117 110l3.5 3.5 5.5-5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="75" y="72" width="50" height="55" rx="10" fill="#4f46e5"/>
        <path d="M90 72 L100 84 L110 72" fill="#312e81"/>
        <circle cx="100" cy="55" r="22" fill="#fbbf24"/>
        <circle cx="93" cy="52" r="3" fill="#92400e"/>
        <circle cx="107" cy="52" r="3" fill="#92400e"/>
        <path d="M93 61 Q100 67 107 61" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M78 48 Q85 32 100 33 Q115 32 122 48 Q118 38 100 36 Q82 38 78 48Z" fill="#1c1917"/>
        <text x="28" y="55" fontSize="14" fill="#f59e0b">✦</text>
        <text x="160" y="80" fontSize="10" fill="#6c5ce7">✦</text>
        <text x="163" y="48" fontSize="16" fill="#f59e0b">✦</text>
      </svg>
    </div>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode]       = useState<"login" | "register">("login");
  const [role, setRole]       = useState<Role>("student");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
      setError(mode === "register" ? "Name, email and password are required." : "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });
      const data = await response.json() as { message?: string; user?: Omit<AuthUser, "token">; token?: string };

      if (!response.ok || !data.user || !data.token) {
        if (response.status === 404 && mode === "login") setMode("register");
        throw new Error(data.message ?? "Authentication failed.");
      }

      onLogin({ ...data.user, token: data.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f0eeff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-8 items-center">

        {/* ── Left: Illustration + Features ── */}
        <div className="hidden lg:flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">Learner Hub</p>
              <p className="text-xs font-bold text-slate-400">SGSU Digital Campus</p>
            </div>
          </div>

          {/* Illustration with Books Image */}
          <div className="rounded-[2rem] bg-gradient-to-br from-[#ede9fe] via-[#e0d9ff] to-[#dbeafe] p-8 relative overflow-hidden min-h-[320px] flex items-center justify-center">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6c5ce7]/10" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-[#00b894]/10" />

            {/* Floating stat cards */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-5 left-5 z-10 rounded-2xl bg-white px-3 py-2.5 shadow-xl text-xs font-black text-[#6c5ce7] border border-purple-100">
              📊 Data Structures<br /><span className="text-[10px] font-bold text-slate-400">85% complete</span>
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute top-5 right-5 z-10 rounded-2xl bg-white px-3 py-2.5 shadow-xl text-xs font-black text-amber-600 border border-amber-100">
              🏆 Rank #3<br /><span className="text-[10px] font-bold text-slate-400">Leaderboard</span>
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute bottom-5 left-5 z-10 rounded-2xl bg-[#6c5ce7] px-3 py-2.5 shadow-xl text-xs font-black text-white">
              📈 72% Overall<br /><span className="text-[10px] font-semibold text-purple-200">Progress</span>
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="absolute bottom-5 right-5 z-10 rounded-2xl bg-white px-3 py-2.5 shadow-xl text-xs font-black text-rose-600 border border-rose-100">
              ⏰ Due in 2 days<br /><span className="text-[10px] font-bold text-slate-400">Database Exam</span>
            </motion.div>

            {/* Hero illustration */}
            <img
              src="/hero-illustration.jpg"
              alt="Student Learning"
              className="relative z-0 w-64 h-64 object-contain mix-blend-multiply opacity-95 select-none pointer-events-none"
              style={{ maskImage: "radial-gradient(ellipse 80% 80% at center, black 55%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at center, black 55%, transparent 100%)" }}
            />
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#6c5ce7]" />
                <p className="text-sm font-bold text-slate-700">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Login Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6c5ce7] text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <p className="text-lg font-black text-slate-900">Learner Hub</p>
          </div>

          <div className="rounded-[2rem] bg-white p-7 shadow-2xl shadow-[#6c5ce7]/10 border border-purple-100">

            {/* Header */}
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6c5ce7]">Welcome to SGSU LMS</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">
                {mode === "login" ? "Sign In" : "Create Account"}
              </h1>
              <p className="mt-1.5 text-sm font-semibold text-slate-400">
                {mode === "login"
                  ? "Enter your credentials to access your dashboard."
                  : "Register to get started with SGSU Learning Hub."}
              </p>
            </div>

            {/* Login / Register toggle */}
            <div className="mb-5 grid grid-cols-2 gap-1.5 rounded-2xl bg-[#f0eeff] p-1.5">
              {(["login", "register"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => { setMode(item); setError(""); }}
                  className={`h-10 rounded-xl text-xs font-black capitalize transition-all ${
                    mode === item
                      ? "bg-white text-[#6c5ce7] shadow-md"
                      : "text-slate-500 hover:text-[#6c5ce7]"
                  }`}
                >
                  {item === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            {/* Role selector */}
            <div className="mb-5 grid grid-cols-3 gap-1.5 rounded-2xl bg-[#f0eeff] p-1.5">
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const { label, icon: Icon, color } = roleConfig[r];
                const active = r === role;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setError(""); }}
                    className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition-all ${
                      active
                        ? "bg-white shadow-md"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                    style={active ? { color } : {}}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6c5ce7]/50 focus:bg-white focus:ring-4 focus:ring-[#6c5ce7]/10"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@sgsu.edu.in"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6c5ce7]/50 focus:bg-white focus:ring-4 focus:ring-[#6c5ce7]/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6c5ce7]/50 focus:bg-white focus:ring-4 focus:ring-[#6c5ce7]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6c5ce7] transition"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#6c5ce7] text-sm font-black text-white shadow-xl shadow-[#6c5ce7]/30 transition hover:bg-[#5b4bd5] disabled:opacity-70"
              >
                {loading ? (
                  <span className="animate-pulse">Please wait...</span>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs font-bold text-slate-400">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="font-black text-[#6c5ce7] hover:underline"
              >
                {mode === "login" ? "Register here" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
