"use client";

import { useState, useEffect } from "react";
import { Profile, Organization, Activity, Submission, Certificate } from "@/types/database";
import {
  Users,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  Rocket,
  Code2,
  Palette,
  QrCode,
  Clock,
  TrendingUp,
} from "lucide-react";
import QRCode from "qrcode";
import { motion, Variants } from "framer-motion";
import { scrollToSection } from "./SmoothScroll";

interface OverviewViewProps {
  currentUser: Profile;
  organizations: Organization[];
  institutionalMetrics: any;
  activities: Activity[];
  attendanceRecords: any[];
  submissions: Submission[];
  certificates: Certificate[];
  setActiveTab?: (tab: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

export function OverviewView({
  currentUser,
  activities,
  institutionalMetrics,
  setActiveTab,
}: OverviewViewProps) {
  const isStudent = currentUser.role === "member" || currentUser.role === "student";
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const navigateTo = (secId: string) => {
    scrollToSection(secId);
    if (setActiveTab) setActiveTab(secId);
  };

  useEffect(() => {
    QRCode.toDataURL("GITCLUB-CAMPUS-ACTIVE-CHECKIN", {
      margin: 1,
      width: 140,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then(setQrCodeDataUrl)
      .catch(() => {});
  }, []);

  const upcomingActivities = activities.slice(0, 3);
  const activeEvent = activities.find((a) => a.status === "approved") || activities[0];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome & Global Metrics Header */}
      <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-300 text-[11px] font-semibold mb-2 border border-white/10 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Mirai Campus
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">{currentUser.fullName}</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {currentUser.title || "Student Leadership"} &bull; Activity Ledger
            </p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigateTo(isStudent ? "attendance" : "activities")}
              className="flex-1 glass-btn-primary px-3.5 py-2 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              {isStudent ? "Check In" : "Activities"}
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigateTo("clubs")}
              className="flex-1 glass-btn-secondary px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              Clubs
            </motion.button>
          </div>
        </div>

        {/* Global Metric Summary with 3D Pop Out */}
        <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-2.5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.05 }}
            className="glass-card p-3.5 rounded-2xl border border-white/10 cursor-default"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Clubs</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {institutionalMetrics?.totalOrganizations || 3}
            </div>
            <div className="text-[10px] text-blue-300 font-semibold mt-0.5 truncate">NEX-CELL &bull; Kaizen &bull; MALHAR</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.1 }}
            className="glass-card p-3.5 rounded-2xl border border-white/10 cursor-default"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialized Units</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {institutionalMetrics?.totalUnits || 8}
            </div>
            <div className="text-[10px] text-slate-300 font-medium mt-0.5 truncate">3 Domains &bull; 5 Depts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.15 }}
            className="glass-card p-3.5 rounded-2xl border border-white/10 cursor-default"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Members</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {institutionalMetrics?.totalEnrolledStudents || 1}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 truncate">Verified Students</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.2 }}
            className="glass-card p-3.5 rounded-2xl border border-white/10 cursor-default"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venture Tracks</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">
              {institutionalMetrics?.totalInitiatives || 6}
            </div>
            <div className="text-[10px] text-amber-300 font-medium mt-0.5 truncate">6 Flagship Tracks</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clubs (4 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 glass-panel rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Organizations
            </h2>
            <button
              onClick={() => navigateTo("clubs")}
              className="text-[11px] font-semibold text-indigo-300 hover:text-white transition"
            >
              View all &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {/* NEX-CELL */}
            <motion.div
              whileHover={{ scale: 1.025, y: -4, transition: { type: "spring", stiffness: 450, damping: 20 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo("clubs")}
              className="glass-card p-3.5 rounded-2xl cursor-pointer group hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition">
                      NEX-CELL
                    </h3>
                    <p className="text-[11px] text-slate-400">Entrepreneurship Club</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  6 Tracks
                </span>
              </div>
            </motion.div>

            {/* Kaizen Tech */}
            <motion.div
              whileHover={{ scale: 1.025, y: -4, transition: { type: "spring", stiffness: 450, damping: 20 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo("clubs")}
              className="glass-card p-3.5 rounded-2xl cursor-pointer group hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition">
                      Kaizen Tech
                    </h3>
                    <p className="text-[11px] text-slate-400">3 Tech Domains</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  CP &bull; Web &bull; AI/DS
                </span>
              </div>
            </motion.div>

            {/* MALHAR */}
            <motion.div
              whileHover={{ scale: 1.025, y: -4, transition: { type: "spring", stiffness: 450, damping: 20 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo("clubs")}
              className="glass-card p-3.5 rounded-2xl cursor-pointer group hover:border-rose-400/40 hover:shadow-lg hover:shadow-rose-500/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400 shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-rose-200 transition">
                      MALHAR
                    </h3>
                    <p className="text-[11px] text-slate-400">Cultural Society</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                  5 Depts
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Middle Column: Upcoming Activities & Progress (4 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          {/* Upcoming Activities */}
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Activities
              </h2>
              <button
                onClick={() => navigateTo("activities")}
                className="text-[11px] font-semibold text-indigo-300 hover:text-white"
              >
                All &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingActivities.map((act) => (
                <motion.div
                  key={act.id}
                  whileHover={{ scale: 1.01 }}
                  className="glass-card p-3 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{act.title}</h4>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{act.scheduledDate} &bull; {act.startTime || "10:00"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => navigateTo("activities")}
                      className="flex-1 glass-btn-secondary py-1 rounded-lg text-[10px] font-semibold text-center"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => navigateTo(isStudent ? "attendance" : "submissions")}
                      className="flex-1 glass-btn-primary py-1 rounded-lg text-[10px] font-semibold text-center"
                    >
                      {isStudent ? "Check In" : "Evaluate"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Progress
            </h2>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">Technical Depth</span>
                  <span className="text-indigo-300 font-bold">85%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 w-[85%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">Participation</span>
                  <span className="text-emerald-300 font-bold">75%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-[75%]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Attendance & Quick Log (4 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          {/* Quick Attendance Check-In */}
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3.5">
              <QrCode className="w-4 h-4 text-emerald-400" />
              Check-In
            </h2>

            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3.5">
              <div className="p-1.5 rounded-xl bg-white shadow shrink-0">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Attendance QR"
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-900 rounded flex items-center justify-center text-white text-xs">
                    QR
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase text-slate-400">Current Session</div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {activeEvent ? activeEvent.title : "Saturday Club Day"}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo("attendance")}
              className="mt-3.5 w-full glass-btn-primary py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
            >
              Open Attendance
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Activity Log */}
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-sky-400" />
              Activity Log
            </h2>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10 text-xs">
              <div className="relative pl-6">
                <div className="absolute left-1 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400" />
                <div className="font-semibold text-white">Kaizen Tech Web &bull; RAG Workshop</div>
                <div className="text-[10px] text-slate-400">Session approved</div>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-1 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                <div className="font-semibold text-white">NEX-CELL Founders Fire &bull; Pitch 1</div>
                <div className="text-[10px] text-slate-400">Cohort active</div>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-1 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400" />
                <div className="font-semibold text-white">MALHAR Media &bull; Annual Fest</div>
                <div className="text-[10px] text-slate-400">Rehearsals scheduled</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
