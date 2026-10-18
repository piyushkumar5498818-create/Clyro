"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginAction } from "@/actions/auth";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Shield,
  Users,
} from "lucide-react";

const QUICK_PERSONAS = [
  {
    role: "President",
    name: "Rishav Raj",
    org: "Kaizen Tech",
    email: "rishav.president@mirai.edu",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    icon: "👑",
  },
  {
    role: "Vice President",
    name: "Aarav Pathak",
    org: "Kaizen Tech",
    email: "aarav.vp@mirai.edu",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    icon: "⚡",
  },
  {
    role: "President",
    name: "Arman Mehta",
    org: "NEX-CELL",
    email: "arman.president@mirai.edu",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: "🚀",
  },
  {
    role: "President",
    name: "Elena Rostova",
    org: "MALHAR",
    email: "elena.president@mirai.edu",
    badge: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    icon: "🎭",
  },
  {
    role: "Lead",
    name: "Sagar Kumar",
    org: "CP Lead",
    email: "sagar.lead@mirai.edu",
    badge: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    icon: "🛠️",
  },
  {
    role: "Member",
    name: "Alex Rivera",
    org: "Student",
    email: "alex.student@mirai.edu",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    icon: "🎓",
  },
  {
    role: "Admin",
    name: "Campus Admin",
    org: "Dean Office",
    email: "admin@mirai.edu",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: "🛡️",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alex.student@mirai.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (targetEmail: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await loginAction(targetEmail, password);
    if (res.success && res.user) {
      setSuccess(`Authenticated as ${res.user.fullName} (${res.user.title || res.user.role})! Redirecting...`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } else {
      setLoading(false);
      setError(res.error || "Authentication failed. Please verify your email.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between py-8 px-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition">
            <div className="w-full h-full bg-slate-950/80 rounded-[11px] flex items-center justify-center backdrop-blur-sm">
              <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 via-purple-200 to-pink-300">
                C
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white leading-none">
              Clyro
            </span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">
              Mirai Campus
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition border border-white/10 backdrop-blur-md"
        >
          &larr; Back to Home
        </Link>
      </header>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="glass-panel rounded-3xl p-7 sm:p-9 shadow-2xl border border-white/15 backdrop-blur-2xl relative"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-[11px] font-bold mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Institutional Sign-In Portal
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Welcome to Mirai Clyro
            </h1>
            <p className="text-xs text-slate-300 mt-1.5">
              Sign in with your campus account or use quick institutional access.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credentials Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@mirai.edu"
                  className="w-full text-xs font-medium rounded-xl border border-white/15 pl-10 pr-3 py-2.5 bg-slate-900/80 text-white placeholder-slate-500 backdrop-blur-md focus:border-indigo-400 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-xs font-medium rounded-xl border border-white/15 pl-10 pr-10 py-2.5 bg-slate-900/80 text-white placeholder-slate-500 backdrop-blur-md focus:border-indigo-400 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-btn-primary py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition duration-200 mt-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Clyro</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Persona Access Section */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                One-Click Quick Persona Access
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Demo Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_PERSONAS.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => {
                    setEmail(p.email);
                    handleLogin(p.email);
                  }}
                  disabled={loading}
                  className="p-2 rounded-xl text-left border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-indigo-400/40 transition duration-150 flex items-center gap-2.5 group"
                >
                  <span className="text-base select-none">{p.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate group-hover:text-indigo-200 transition">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {p.role} &middot; {p.org}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 z-10 py-2">
        Mirai School of Technology &middot; Clyro Co-Curricular Platform
      </footer>
    </main>
  );
}
