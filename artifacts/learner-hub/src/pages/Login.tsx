import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Shield,
  Sparkles,
  Users,
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
  student: { label: "Student", icon: BookOpen },
  faculty: { label: "Faculty", icon: Users },
  admin: { label: "Admin", icon: Shield },
};

function CampusModel() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[420px]">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-12 top-12 h-48 w-64 rounded-[2rem] border border-white/25 bg-white/15 shadow-2xl backdrop-blur-xl"
        style={{ transform: "rotateX(58deg) rotateZ(-35deg)" }}
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute left-24 top-24 h-48 w-64 rounded-[2rem] bg-gradient-to-br from-[#f97316] via-[#7130a1] to-[#263676] shadow-2xl"
        style={{ transform: "rotateX(58deg) rotateZ(-35deg)" }}
      />
      <div className="absolute left-[142px] top-[102px] flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-[#7130a1] shadow-2xl">
        <GraduationCap className="h-12 w-12" />
      </div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-8 top-20 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-sm font-extrabold text-[#263676] shadow-xl"
      >
        Secure Login
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 left-4 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-sm font-extrabold text-[#f97316] shadow-xl"
      >
        Secure Data
      </motion.div>
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute bottom-8 right-16 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-sm font-extrabold text-[#263676] shadow-xl"
      >
        Skills Hub
      </motion.div>
    </div>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
      setError(mode === "register" ? "Name, email, and password are required." : "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });
      const data = await response.json() as { message?: string; user?: Omit<AuthUser, "token">; token?: string };

      if (!response.ok || !data.user || !data.token) {
        if (response.status === 404 && mode === "login") {
          setMode("register");
        }
        throw new Error(data.message ?? "Authentication failed.");
      }

      onLogin({ ...data.user, token: data.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7fb]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#263676] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.32),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(135deg,#263676_0%,#4b237a_60%,#7130a1_100%)]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#7130a1] shadow-xl">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-2xl font-black">Scope Global Skills University</p>
              <p className="text-sm font-semibold text-white/70">Authenticated LMS Command Center</p>
            </div>
          </div>

          <div className="relative z-10 grid items-center gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold text-white/90">
                <Sparkles className="h-4 w-4 text-[#f97316]" />
                Deploy-ready secure access
              </div>
              <h1 className="text-5xl font-black leading-tight">
                Real login, secure accounts, and SGSU learning tools.
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/72">
                Sign in with a registered account or create a role-based account for student, faculty, or admin access.
              </p>
            </div>
            <CampusModel />
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              ["Cloud", "Ready access"],
              ["Role", "Access control"],
              ["AI", "Resume builder"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs font-bold text-white/65">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-[500px]"
          >
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7130a1] text-white">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xl font-black text-[#263676]">SGSU LMS</p>
                <p className="text-xs font-bold text-slate-500">Digital campus</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-[#263676]/10">
              <div className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f97316]">Secure access</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight text-[#111827]">
                  {mode === "login" ? "Welcome back" : "Create account"}
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {mode === "login"
                    ? "Sign in with your registered SGSU account."
                    : "Register once, then your account will be saved securely."}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                {(["login", "register"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setMode(item);
                      setError("");
                    }}
                    className={`h-11 rounded-xl text-xs font-black capitalize transition-all ${
                      mode === item
                        ? "bg-white text-[#7130a1] shadow-md"
                        : "text-slate-500 hover:bg-white/60 hover:text-[#263676]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
                {(Object.keys(roleConfig) as Role[]).map((item) => {
                  const RoleIcon = roleConfig[item].icon;
                  const active = item === role;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setRole(item);
                        setError("");
                      }}
                      className={`flex h-12 items-center justify-center gap-2 rounded-xl text-xs font-black transition-all ${
                        active
                          ? "bg-white text-[#7130a1] shadow-md"
                          : "text-slate-500 hover:bg-white/60 hover:text-[#263676]"
                      }`}
                    >
                      <RoleIcon className="h-4 w-4" />
                      {roleConfig[item].label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Full name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7130a1] focus:bg-white focus:ring-4 focus:ring-[#7130a1]/10"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@sgsu.edu.in"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7130a1] focus:bg-white focus:ring-4 focus:ring-[#7130a1]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Password</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Minimum 6 characters"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7130a1] focus:bg-white focus:ring-4 focus:ring-[#7130a1]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#7130a1]"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-13 w-full rounded-2xl bg-[#263676] px-5 py-3.5 text-base font-black text-white shadow-xl shadow-[#263676]/25 transition hover:bg-[#7130a1] disabled:opacity-70"
                >
                  {loading ? "Please wait..." : mode === "login" ? "Sign in to SGSU LMS" : "Create secure account"}
                </button>
              </form>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
