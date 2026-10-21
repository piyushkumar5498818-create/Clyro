"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { loginAction, googleSignInAction, mailLoginAction } from "@/actions/auth";
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
  X,
  Building2,
  Check,
  Search,
  Users,
  UserCheck,
  ChevronDown,
  MapPin,
  School,
} from "lucide-react";
import { GitclubLogo } from "@/components/GitclubLogo";

interface CampusMemberPersona {
  name: string;
  email: string;
  role: string;
  club: "Kaizen Tech" | "NEX-CELL" | "MALHAR" | "Admin";
  sub: string;
  initials: string;
  color: string;
}

const ALL_26_CAMPUS_MEMBERS: CampusMemberPersona[] = [
  // Kaizen Tech — Technical Club (6)
  {
    name: "Rishav Raj",
    email: "rishav.president@mirai.edu",
    role: "President — Kaizen Tech",
    club: "Kaizen Tech",
    sub: "Technical Club Executive (CP, Web, AI & DS)",
    initials: "RR",
    color: "from-blue-700 to-indigo-600",
  },
  {
    name: "Aarav Pathak",
    email: "aarav.vp@mirai.edu",
    role: "Vice President — Kaizen Tech",
    club: "Kaizen Tech",
    sub: "AI & Data Science Domain Lead",
    initials: "AP",
    color: "from-indigo-600 to-blue-500",
  },
  {
    name: "Sagar Kumar",
    email: "sagar.lead@mirai.edu",
    role: "Programming Head — Kaizen Tech",
    club: "Kaizen Tech",
    sub: "Competitive Programming Domain",
    initials: "SK",
    color: "from-blue-600 to-cyan-500",
  },
  {
    name: "Saurav Kumar",
    email: "saurav.lead@mirai.edu",
    role: "Design Head — Kaizen Tech",
    club: "Kaizen Tech",
    sub: "Full-Stack & UI/UX Systems",
    initials: "SK",
    color: "from-cyan-600 to-teal-500",
  },
  {
    name: "Siya Bhardwaj",
    email: "siya.treasurer@mirai.edu",
    role: "Treasurer — Kaizen Tech",
    club: "Kaizen Tech",
    sub: "Finance, Budgets & Allocations",
    initials: "SB",
    color: "from-indigo-600 to-purple-500",
  },
  {
    name: "Piyush Kumar",
    email: "piyush.student@mirai.edu",
    role: "Student Member — Kaizen Tech",
    club: "Kaizen Tech",
    sub: "Computer Science & Engineering · AI Domain",
    initials: "PK",
    color: "from-blue-600 to-cyan-500",
  },

  // NEX-CELL — Entrepreneurship Club (7)
  {
    name: "Arman Mehta",
    email: "arman.president@mirai.edu",
    role: "President — NEX-CELL",
    club: "NEX-CELL",
    sub: "Entrepreneurship Club Executive (6 Flagship Tracks)",
    initials: "AM",
    color: "from-amber-600 to-orange-500",
  },
  {
    name: "Rohan Varma",
    email: "rohan.vp@mirai.edu",
    role: "Vice President — NEX-CELL",
    club: "NEX-CELL",
    sub: "Venture Incubation & Operations",
    initials: "RV",
    color: "from-orange-600 to-amber-500",
  },
  {
    name: "Tanya Kapoor",
    email: "tanya.incubation@mirai.edu",
    role: "Incubation Lead — NEX-CELL",
    club: "NEX-CELL",
    sub: "Venture Incubation & Early Funding",
    initials: "TK",
    color: "from-amber-500 to-yellow-500",
  },
  {
    name: "Kabir Joshi",
    email: "kabir.pitch@mirai.edu",
    role: "Pitch Lead — NEX-CELL",
    club: "NEX-CELL",
    sub: "Founders Fire & Demo Days",
    initials: "KJ",
    color: "from-yellow-600 to-amber-600",
  },
  {
    name: "Devansh Soni",
    email: "devansh.hack@mirai.edu",
    role: "Hackathon Lead — NEX-CELL",
    club: "NEX-CELL",
    sub: "The Mirage & Open Build Sprints",
    initials: "DS",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Meera Nair",
    email: "meera.founder@mirai.edu",
    role: "Student Founder — NEX-CELL",
    club: "NEX-CELL",
    sub: "Active Cohort Founder & Pitcher",
    initials: "MN",
    color: "from-amber-600 to-emerald-500",
  },
  {
    name: "Ishaan Verma",
    email: "ishaan.founder@mirai.edu",
    role: "Student Founder — NEX-CELL",
    club: "NEX-CELL",
    sub: "Hardware MVP & Prototyping",
    initials: "IV",
    color: "from-orange-600 to-amber-400",
  },

  // MALHAR — Cultural Society (12)
  {
    name: "Sapna Singh",
    email: "sapna.president@mirai.edu",
    role: "President — MALHAR",
    club: "MALHAR",
    sub: "Cultural Society Executive (5 Departments)",
    initials: "SS",
    color: "from-rose-600 to-pink-500",
  },
  {
    name: "Kiran Sinha",
    email: "kiran.vp@mirai.edu",
    role: "Vice President — MALHAR",
    club: "MALHAR",
    sub: "Fest Operations & Coordination",
    initials: "KS",
    color: "from-pink-600 to-rose-400",
  },
  {
    name: "Anshika",
    email: "anshika.treasurer@mirai.edu",
    role: "Treasurer — MALHAR",
    club: "MALHAR",
    sub: "Society Budgeting & Accounts",
    initials: "AN",
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Dhruv Tomar",
    email: "dhruv.media@mirai.edu",
    role: "Media Head — MALHAR",
    club: "MALHAR",
    sub: "Media, Film & Photography Department",
    initials: "DT",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "Shivam Kumar",
    email: "shivam.tech@mirai.edu",
    role: "Tech Head — MALHAR",
    club: "MALHAR",
    sub: "Stage Lighting, Acoustics & Visuals",
    initials: "SK",
    color: "from-purple-600 to-indigo-500",
  },
  {
    name: "Priyanka Negi",
    email: "priyanka.design@mirai.edu",
    role: "Designing Head — MALHAR",
    club: "MALHAR",
    sub: "Brand, Posters & Creative Assets",
    initials: "PN",
    color: "from-rose-500 to-red-500",
  },
  {
    name: "Purnima Raj",
    email: "purnima.mgmt@mirai.edu",
    role: "Management Head — MALHAR",
    club: "MALHAR",
    sub: "Hospitality & Crowd Logistics",
    initials: "PR",
    color: "from-pink-600 to-rose-500",
  },
  {
    name: "Anchal kumari",
    email: "anchal.mgmt@mirai.edu",
    role: "Management Member — MALHAR",
    club: "MALHAR",
    sub: "Event Logistics & Hospitality",
    initials: "AK",
    color: "from-rose-500 to-pink-500",
  },
  {
    name: "Aanya Varshney",
    email: "aanya.design@mirai.edu",
    role: "Design Member — MALHAR",
    club: "MALHAR",
    sub: "Stage Décor & Visual Identity",
    initials: "AV",
    color: "from-pink-500 to-purple-400",
  },
  {
    name: "Shambhavi Sharma",
    email: "shambhavi.mgmt@mirai.edu",
    role: "Management Member — MALHAR",
    club: "MALHAR",
    sub: "Auditorium & Green Room Coordination",
    initials: "SS",
    color: "from-rose-600 to-pink-400",
  },
  {
    name: "Anup Gupta",
    email: "anup.mgmt@mirai.edu",
    role: "Management Member — MALHAR",
    club: "MALHAR",
    sub: "VIP Protocol & Crowd Flow",
    initials: "AG",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Sanskar Singh",
    email: "sanskar.mgmt@mirai.edu",
    role: "Management Member — MALHAR",
    club: "MALHAR",
    sub: "Security Liaison & Sound Desk",
    initials: "SS",
    color: "from-pink-500 to-rose-500",
  },

  // Campus Administration (1)
  {
    name: "Campus Administrator",
    email: "admin@mirai.edu",
    role: "Platform Admin / Dean of Student Affairs",
    club: "Admin",
    sub: "MSOT Central Administration & Governance Desk",
    initials: "CA",
    color: "from-purple-600 to-indigo-600",
  },
];

interface CampusOption {
  id: string;
  name: string;
  code: string;
  location: string;
  isMain?: boolean;
}

const AVAILABLE_CAMPUSES: CampusOption[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    name: "Mirai School of Technology",
    code: "MSOT-MAIN",
    location: "Main Tech Campus · Innovation Block A",
    isMain: true,
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    name: "Mirai North Engineering Hub",
    code: "MSOT-NORTH",
    location: "North Campus · Computing & Robotics Wing",
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    name: "Mirai Research & Incubation City",
    code: "MSOT-RIC",
    location: "Electronic City · DeepTech & AI Labs",
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    name: "Mirai Global & Virtual Campus",
    code: "MSOT-GLOBAL",
    location: "Cloud Network · Virtual Exchange",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("piyush.student@mirai.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Campus selection state
  const [selectedCampusId, setSelectedCampusId] = useState<string>("c0000000-0000-0000-0000-000000000001");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gitclub_selected_campus_id");
      if (saved && AVAILABLE_CAMPUSES.some((c) => c.id === saved)) {
        setSelectedCampusId(saved);
      }
    } catch {}
  }, []);

  const handleCampusChange = (id: string) => {
    setSelectedCampusId(id);
    try {
      localStorage.setItem("gitclub_selected_campus_id", id);
    } catch {}
  };

  const selectedCampus =
    AVAILABLE_CAMPUSES.find((c) => c.id === selectedCampusId) || AVAILABLE_CAMPUSES[0];

  // Quick Persona Search & Club Filters
  const [selectedClub, setSelectedClub] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Google Workspace SSO modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [modalClub, setModalClub] = useState<string>("All");
  const [modalSearch, setModalSearch] = useState<string>("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  const filteredMembers = useMemo(() => {
    return ALL_26_CAMPUS_MEMBERS.filter((m) => {
      const matchClub = selectedClub === "All" || m.club === selectedClub;
      const matchQuery =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClub && matchQuery;
    });
  }, [selectedClub, searchQuery]);

  const modalFilteredMembers = useMemo(() => {
    return ALL_26_CAMPUS_MEMBERS.filter((m) => {
      const matchClub = modalClub === "All" || m.club === modalClub;
      const matchQuery =
        !modalSearch.trim() ||
        m.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        m.role.toLowerCase().includes(modalSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(modalSearch.toLowerCase());
      return matchClub && matchQuery;
    });
  }, [modalClub, modalSearch]);

  const handleLogin = async (targetEmail: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await mailLoginAction(targetEmail, password);
    if (res.success && res.user) {
      setSuccess(`Authenticated for ${selectedCampus.name} as ${res.user.fullName} (${res.user.title || res.user.role}). Redirecting...`);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } else {
      setLoading(false);
      setError(res.error || "Mail authentication failed. Please enter a valid email.");
    }
  };

  const handleGoogleLogin = async (targetEmail: string, fullName?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await googleSignInAction(targetEmail, fullName);
    if (res.success && res.user) {
      setShowGoogleModal(false);
      setSuccess(
        `Signed in with Google for ${selectedCampus.name}: ${res.user.fullName} (${res.user.email}). Redirecting...`
      );
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } else {
      setLoading(false);
      setError(res.error || "Google authentication was rejected.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email);
  };

  const onCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleGoogleLogin(customGoogleEmail, customGoogleName);
  };

  return (
    <main className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Ambient Glows & Grid Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-700/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <Link href="/" className="flex items-center gap-3 group">
          <GitclubLogo size="md" showText={true} />
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] transition border border-white/10 backdrop-blur-md flex items-center gap-2"
        >
          <span>&larr; Public Portal</span>
        </Link>
      </header>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-auto z-10 py-4 space-y-6">
        {/* Main Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/60 border border-white/15 backdrop-blur-2xl relative space-y-5"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 text-cyan-300 text-xs font-mono font-bold border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>GOOGLE SIGN IN &bull; MAIL LOGIN SYSTEM</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Gitclub</span>
            </h1>

            <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto">
              Sign in with Google, use the Mail Login System with any email address, or select an instant campus persona below.
            </p>
          </div>

          {/* Institutional Campus Selection Selector */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Institutional Campus</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                {selectedCampus.code}
              </span>
            </div>

            {/* Dropdown Selector with Custom Icons */}
            <div className="relative">
              <select
                value={selectedCampusId}
                onChange={(e) => handleCampusChange(e.target.value)}
                className="w-full text-xs font-bold rounded-xl border border-white/15 pl-9 pr-9 py-2.5 bg-slate-900/95 text-white backdrop-blur-md focus:border-cyan-400 focus:outline-none appearance-none cursor-pointer"
                aria-label="Select Institutional Campus"
              >
                {AVAILABLE_CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white py-1 font-sans">
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <School className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            {/* Fast Campus Branch Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] font-semibold">
              {AVAILABLE_CAMPUSES.map((c) => {
                const isSelected = c.id === selectedCampusId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCampusChange(c.id)}
                    className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition border ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-sm"
                        : "bg-white/[0.03] text-slate-400 hover:text-white border-white/10 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{c.code}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Campus Location Metadata */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span className="truncate flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{selectedCampus.location}</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-400 shrink-0 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </span>
            </div>
          </div>

          {/* Feedback Banners */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md"
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
                className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Action: Google Sign In Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-xl shadow-black/20 flex items-center justify-center gap-3 transition-all duration-200 border border-slate-200 group active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span className="text-slate-900 group-hover:text-black font-extrabold">
                Sign in with Google
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                1-Tap
              </span>
            </button>
          </div>

          {/* Clean Minimalist Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0a1124] px-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider absolute">
              or continue with mail login
            </span>
          </div>

          {/* Mail Login System */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Mail Login System
                </h2>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30">
                Email + Password
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Sign in with any email address. Existing profiles log in instantly; new emails are automatically registered.
            </p>

            {/* Target Campus Badge in Mail Login */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Target Campus:</span>
              </span>
              <span className="font-bold text-white flex items-center gap-1.5 truncate">
                <span className="truncate">{selectedCampus.name}</span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20 shrink-0">
                  {selectedCampus.code}
                </span>
              </span>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@mirai.edu or user@gmail.com"
                    className="w-full text-xs font-medium rounded-2xl border border-white/15 pl-10 pr-3.5 py-2.5 bg-white/[0.04] text-white placeholder-slate-500 backdrop-blur-md focus:border-cyan-400 focus:bg-white/[0.08] focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Password
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
                    className="w-full text-xs font-medium rounded-2xl border border-white/15 pl-10 pr-10 py-2.5 bg-white/[0.04] text-white placeholder-slate-500 backdrop-blur-md focus:border-cyan-400 focus:bg-white/[0.08] focus:outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99] border border-white/20"
              >
                {loading ? (
                  <span>Authenticating with Mail System...</span>
                ) : (
                  <>
                    <span>Sign In with Mail</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Section: 1-Click Instant Persona Login (All 26 Campus Members) */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant 1-Click Selection (All 26 Members)</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                {filteredMembers.length} Personas
              </span>
            </div>

            {/* Club Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
              {[
                { id: "All", label: "All (26)" },
                { id: "Kaizen Tech", label: "Kaizen Tech (6)" },
                { id: "NEX-CELL", label: "NEX-CELL (7)" },
                { id: "MALHAR", label: "MALHAR (12)" },
                { id: "Admin", label: "Admin (1)" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedClub(c.id)}
                  className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition border ${
                    selectedClub === c.id
                      ? "bg-blue-600 text-white border-blue-400 shadow-sm"
                      : "bg-white/[0.04] text-slate-300 hover:text-white border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Quick Persona Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search member by name (e.g. Piyush, Rishav, Sapna, Meera)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Scrollable Persona Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredMembers.map((person) => {
                const isSelected = email === person.email;
                return (
                  <div
                    key={person.email}
                    className={`p-2.5 rounded-2xl border transition flex items-center justify-between gap-2 text-left group ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400/50 shadow-md"
                        : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleLogin(person.email)}
                      disabled={loading}
                      className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                      title={`1-Click Login as ${person.name}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${person.color} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        {person.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate flex items-center gap-1">
                          <span>{person.name}</span>
                          {person.name === "Piyush Kumar" && (
                            <span className="text-[9px] font-mono px-1 rounded bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                              STUDENT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {person.role}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEmail(person.email);
                      }}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition shrink-0"
                      title="Fill into form"
                    >
                      Select
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security & Organization Ledger Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>HMAC-SHA256 Encrypted</span>
            </div>
            <span className="text-slate-300">Mirai Campus SSO</span>
          </div>
        </motion.div>
      </div>

      {/* Google Workspace Account Chooser Modal (All 26 Members) */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#0a1124] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-4"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Google Header */}
              <div className="text-center pb-3 border-b border-white/10">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white shadow-lg mb-2">
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
                <h3 className="text-xl font-black text-white">Sign in with Google</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Select an account or enter any Google email address to continue to GitClub
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">
                    <Building2 className="w-3 h-3 text-cyan-400" />
                    <span>Campus: {selectedCampus.name} ({selectedCampus.code})</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span>Google Accounts (@gmail.com &amp; campus emails)</span>
                  </span>
                </div>
              </div>

              {/* Modal Club Filter Chips & Search */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold">
                  {[
                    { id: "All", label: "All (26)" },
                    { id: "Kaizen Tech", label: "Kaizen (6)" },
                    { id: "NEX-CELL", label: "NEX-CELL (7)" },
                    { id: "MALHAR", label: "MALHAR (12)" },
                    { id: "Admin", label: "Admin (1)" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setModalClub(c.id)}
                      className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition border ${
                        modalClub === c.id
                          ? "bg-blue-600 text-white border-blue-400"
                          : "bg-white/[0.04] text-slate-300 hover:text-white border-white/10"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filter accounts by name or role..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Verified Accounts */}
              <div className="py-1 space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {modalFilteredMembers.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleGoogleLogin(acc.email, acc.name)}
                    disabled={loading}
                    className="w-full p-2.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-cyan-400/40 transition flex items-center gap-3 text-left group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${acc.color} text-white font-black text-xs flex items-center justify-center shadow-md shrink-0`}
                    >
                      {acc.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate flex items-center gap-1.5">
                        <span>{acc.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          {acc.club}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 truncate">
                        {acc.email}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {acc.role}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition shrink-0" />
                  </button>
                ))}
              </div>

              {/* Custom Google Email Entry */}
              <div className="pt-2 border-t border-white/10">
                {!showCustomGoogleInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="w-full py-2 px-3 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Use another Google account (@gmail.com or campus)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <form onSubmit={onCustomGoogleSubmit} className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-slate-200">
                      Sign in with any Google account
                    </div>
                    <div>
                      <input
                        type="text"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        placeholder="Full Name (e.g. Diya Sen)"
                        className="w-full text-xs rounded-xl border border-white/15 p-2 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none mb-1.5"
                        required
                      />
                      <input
                        type="email"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        placeholder="yourname@gmail.com or username@mirai.edu"
                        className="w-full text-xs font-mono rounded-xl border border-white/15 p-2 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
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
                        className="glass-btn-primary px-3 py-1.5 rounded-xl text-xs font-bold shadow"
                      >
                        Sign in with Google
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
      <footer className="text-center text-xs text-slate-400 z-10 py-3 font-mono">
        Mirai School of Technology &bull; Google Sign In &bull; Mail Login System &bull; Gitclub Matrix
      </footer>
    </main>
  );
}
