"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, Calendar, Award, Sparkles, Terminal, Building2, MapPin, ExternalLink, School } from "lucide-react";
import { GitclubLogo } from "@/components/GitclubLogo";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="border-b border-white/10 bg-[#070b16]/70 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <GitclubLogo size="sm" showText={true} />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/verify"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition border border-white/10 backdrop-blur-md"
            >
              Verify Credentials
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition border border-white/10 backdrop-blur-md"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="glass-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28 px-4 text-center max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-300 text-xs font-bold mb-8 border border-blue-500/20 backdrop-blur-md shadow-inner"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Gitclub &middot; Mirai School of Technology Operations Hub
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight"
        >
          One unified platform for every club, activity, and{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
            verified achievement.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Streamlined co-curricular operations: NEX-CELL (6 Tracks), Kaizen Tech (CP, Web, AI & Data Science), and MALHAR (5 Cultural Depts). Real-time QR attendance, rubric grading, and cryptographic transcripts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/login"
            className="glass-btn-primary px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 transition"
          >
            Sign In with Google <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="glass-btn-secondary px-6 py-3.5 rounded-2xl font-semibold text-sm transition"
          >
            Open Live Dashboard
          </Link>
          <Link
            href="/verify"
            className="glass-btn-secondary px-6 py-3.5 rounded-2xl font-semibold text-sm transition"
          >
            Verify Certificate
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.35 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-blue-400/30 transition duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-5 shadow-lg shadow-blue-500/10">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white mb-2">
                Unified Club Hierarchy
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                NEX-CELL entrepreneurship initiatives, Kaizen Tech 3 core technical tracks (CP, Web, AI & Data Science), and MALHAR cultural departments with non-double-counted rosters.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-400/30 transition duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-5 shadow-lg shadow-cyan-500/10">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white mb-2">
                Activity Lifecycle
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Streamlined session scheduling, student leadership review, dynamic 60-minute QR passcodes, project deliverable uploads, and standardized 100-point rubric grading.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-400/30 transition duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white mb-2">
                Tamper-Proof Transcripts
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Cryptographically hashed certificate records and verified student transcripts downloadable as PDF and instantly checkable on the public ledger.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Official 3 Campuses Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-2 border border-cyan-400/20">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>3 Official Mirai Campuses</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Mirai School of Technology Campus Network
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Co-curricular tracking, dynamic clubs, and verified leadership records connected across all 3 institutional campuses.
              </p>
            </div>
            <a
              href="https://miraisot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white border border-white/10 transition self-start sm:self-auto"
            >
              <span>Visit miraisot.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Campus 1: Bengaluru */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  MSOT-BLR
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Bengaluru Campus</span>
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Rathinam Institute of Technology
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Bengaluru South, Karnataka – 560076</span>
                </p>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/5">
                <div className="text-slate-400">AICTE Approved &bull; VTU Affiliated</div>
                <div className="text-cyan-300/90 font-mono text-[10px]">BE CSE &bull; BE CSE AI/ML</div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <a
                  href="https://miraisot.com/campuses/rathinam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Campus Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  href="/login"
                  className="text-xs text-slate-300 hover:text-white font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  Select &amp; Sign In
                </Link>
              </div>
            </div>

            {/* Campus 2: Ghaziabad */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  MSOT-GZB
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Delhi NCR Campus</span>
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Hi-Tech Institute of Technology
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Ghaziabad, Uttar Pradesh – 201015</span>
                </p>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/5">
                <div className="text-slate-400">AICTE Approved &bull; AKTU Affiliated</div>
                <div className="text-cyan-300/90 font-mono text-[10px]">B.Tech CSE &bull; B.Tech CSE AI/ML</div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <a
                  href="https://miraisot.com/campuses/hi-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Campus Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  href="/login"
                  className="text-xs text-slate-300 hover:text-white font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  Select &amp; Sign In
                </Link>
              </div>
            </div>

            {/* Campus 3: Jaipur */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  MSOT-JPR
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Jaipur Campus</span>
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Jagannath University
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Jaipur, Rajasthan – 302022</span>
                </p>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/5">
                <div className="text-slate-400">AICTE Approved &bull; NAAC A+ Accreditation</div>
                <div className="text-cyan-300/90 font-mono text-[10px]">B.Tech AI/ML</div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <a
                  href="https://miraisot.com/campuses/jagannath-university"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Campus Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  href="/login"
                  className="text-xs text-slate-300 hover:text-white font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  Select &amp; Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070b16]/70 backdrop-blur-2xl py-8 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <GitclubLogo size="sm" showText={true} />
          <span className="font-mono text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} Gitclub &bull; Mirai School of Technology Co-Curricular Platform
          </span>
        </div>
      </footer>
    </main>
  );
}
