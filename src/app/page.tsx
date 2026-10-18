"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, Calendar, Award, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="border-b border-white/10 bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/25">
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
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/verify"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition border border-white/10 backdrop-blur-md"
            >
              Verify Certificate
            </Link>
            <Link
              href="/dashboard"
              className="glass-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
            >
              Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
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
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-indigo-300 text-xs font-bold mb-8 border border-white/15 backdrop-blur-md shadow-inner"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Club Management Platform &middot; Mirai School of Technology
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight"
        >
          One platform for every club, activity, and{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            verified achievement.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Streamlined co-curricular operations: NEX-CELL, Kaizen Tech (CP, Web, AI & Data Science), and MALHAR. Real-time QR attendance, rubric grading, and cryptographic transcripts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="glass-btn-primary px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 transition"
          >
            Access Mirai Portal <ArrowRight className="w-4 h-4" />
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
            className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-indigo-400/30 transition duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-5 shadow-lg shadow-indigo-500/10">
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
            className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-purple-400/30 transition duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-5 shadow-lg shadow-purple-500/10">
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
    </main>
  );
}
