"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { loginAction, googleWorkspaceAuthAction } from "@/actions/auth";
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
  X,
  ExternalLink,
} from "lucide-react";
import { GitclubLogo } from "@/components/GitclubLogo";

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

const GOOGLE_WORKSPACE_ACCOUNTS = [
  {
    name: "Alex Rivera",
    email: "alex.student@mirai.edu",
    role: "Student Member",
    sub: "Computer Science & Engineering · Year 2",
    initials: "AR",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Rishav Raj",
    email: "rishav.president@mirai.edu",
    role: "President — Kaizen Tech",
    sub: "Technical Club Executive",
    initials: "RR",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Aarav Pathak",
    email: "aarav.vp@mirai.edu",
    role: "Vice President — Kaizen Tech",
    sub: "AI & Data Science Domain Mentor",
    initials: "AP",
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Arman Mehta",
    email: "arman.president@mirai.edu",
    role: "President — NEX-CELL",
    sub: "Entrepreneurship Club Executive",
    initials: "AM",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Elena Rostova",
    email: "elena.president@mirai.edu",
    role: "President — MALHAR",
    sub: "Cultural Society Executive",
    initials: "ER",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Campus Administrator",
    email: "admin@mirai.edu",
    role: "Dean of Student Affairs",
    sub: "MSOT Central Administration",
    initials: "CA",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("alex.student@mirai.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Google Workspace SSO modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  const handleLogin = async (targetEmail: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await loginAction(targetEmail, password);
    if (res.success && res.user) {
      setSuccess(`Authenticated as ${res.user.fullName} (${res.user.title || res.user.role})! Redirecting...`);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } else {
      setLoading(false);
      setError(res.error || "Authentication failed. Please verify your email.");
    }
  };

  const handleGoogleWorkspaceLogin = async (targetEmail: string, fullName?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await googleWorkspaceAuthAction(targetEmail, fullName);
    if (res.success && res.user) {
      setShowGoogleModal(false);
      setSuccess(
        `Google Workspace Single Sign-On Verified: ${res.user.fullName} (${res.user.email}). Redirecting to campus portal...`
      );
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } else {
      setLoading(false);
      setError(res.error || "Google Workspace authentication was rejected.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email);
  };

  const onCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleGoogleWorkspaceLogin(customGoogleEmail, customGoogleName);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between py-8 px-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <GitclubLogo size="sm" showText={true} />
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-cyan-300 text-[11px] font-bold mb-3 border border-blue-500/25">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Institutional Sign-In Portal
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Welcome to Gitclub
            </h1>
            <p className="text-xs text-slate-300 mt-1.5">
              Sign in with your campus Google Workspace account or institutional credentials.
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

          {/* Google Workspace Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg shadow-black/20 flex items-center justify-center gap-3 transition-all duration-200 border border-slate-200 group active:scale-[0.99]"
          >
            {/* Google Multi-Color SVG Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-slate-800 group-hover:text-black">
              Sign in with Google Workspace
            </span>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              @mirai.edu SSO
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-slate-900/90 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              or campus password
            </span>
          </div>

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
                  <span>Sign In with Credentials</span>
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
                One-Click Role Preview
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Instant Auth</span>
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

      {/* Google Workspace Account Chooser Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Google Header */}
              <div className="text-center pb-4 border-b border-white/10">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white shadow-md mb-2.5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-white">Google Workspace</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Choose a verified <strong className="text-blue-400">@mirai.edu</strong> account to continue to Gitclub
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  Institutional Domain Enforced: @mirai.edu
                </div>
              </div>

              {/* Account List */}
              <div className="py-4 space-y-2 max-h-72 overflow-y-auto">
                {GOOGLE_WORKSPACE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleGoogleWorkspaceLogin(acc.email, acc.name)}
                    disabled={loading}
                    className="w-full p-2.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-indigo-400/50 transition flex items-center gap-3 text-left group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${acc.color} text-white font-black text-xs flex items-center justify-center shadow-md shrink-0`}
                    >
                      {acc.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                        {acc.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 truncate">
                        {acc.email}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {acc.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Google Workspace Account Toggle */}
              <div className="pt-3 border-t border-white/10">
                {!showCustomGoogleInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="w-full py-2 px-3 text-xs font-semibold text-indigo-300 hover:text-indigo-200 hover:bg-white/5 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Use another @mirai.edu account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <form onSubmit={onCustomGoogleSubmit} className="space-y-3 pt-1">
                    <div className="text-xs font-bold text-slate-200">
                      Sign in with institutional Google Workspace email
                    </div>
                    <div>
                      <input
                        type="text"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        placeholder="Full Name (e.g. Diya Sen)"
                        className="w-full text-xs rounded-xl border border-white/15 p-2 bg-slate-800 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none mb-2"
                        required
                      />
                      <input
                        type="email"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        placeholder="username@mirai.edu"
                        className="w-full text-xs font-mono rounded-xl border border-white/15 p-2 bg-slate-800 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowCustomGoogleInput(false)}
                        className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="glass-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold"
                      >
                        Continue with Google SSO
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 z-10 py-2">
        Mirai School of Technology &middot; Google Workspace SSO Integration &middot; Gitclub Platform
      </footer>
    </main>
  );
}
