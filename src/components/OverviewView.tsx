"use client";

import { useState, useEffect } from "react";
import { Profile, Organization, Activity, Submission, Certificate } from "@/types/database";
import {
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  Rocket,
  Code2,
  Palette,
  QrCode,
  Lightbulb,
  Globe,
  Laptop,
  CheckCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import QRCode from "qrcode";

interface OverviewViewProps {
  currentUser: Profile;
  organizations: Organization[];
  institutionalMetrics: any;
  activities: Activity[];
  attendanceRecords: any[];
  submissions: Submission[];
  certificates: Certificate[];
  setActiveTab: (tab: string) => void;
}

export function OverviewView({
  currentUser,
  organizations,
  institutionalMetrics,
  activities,
  submissions,
  certificates,
  setActiveTab,
}: OverviewViewProps) {
  const isCollegeAdmin = currentUser.role === "college_admin" || currentUser.role === "campus_manager";
  const isAdvisor = currentUser.role === "faculty_advisor";
  const isStudent = currentUser.role === "student";

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL("CLYRO-CAMPUS-ACTIVE-CHECKIN", {
      margin: 1,
      width: 140,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    }).then(setQrCodeDataUrl).catch(() => {});
  }, []);

  const upcomingActivities = activities.slice(0, 3);
  const activeEvent = activities.find((a) => a.status === "approved") || activities[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Institutional Metrics Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Ambient interior accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-3 border border-white/15 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Mirai School of Technology &middot; Verified Activity Ledger
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">{currentUser.fullName}</span>
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {isCollegeAdmin &&
                "Campus-wide governance across NEX-CELL, Kaizen Tech, and MALHAR. Authoritative participation ledgers with zero double-counting."}
              {isAdvisor &&
                "Faculty advisory console for Mirai campus organizations. Review activity plans, evaluate deliverables, and issue verifiable achievement certificates."}
              {!isCollegeAdmin && !isAdvisor && !isStudent &&
                "Operational command center for student coordinators, domain leads, and department heads. Launch QR check-in, review submissions, and manage teams."}
              {isStudent &&
                "Explore Mirai's entrepreneurship, technical, and cultural organizations. Attend Saturday Club Days, upload deliverables, and earn verified rubric credentials."}
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 sm:self-end">
            <button
              onClick={() => setActiveTab(isStudent ? "attendance" : "activities")}
              className="glass-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              {isStudent ? "Quick Attendance Check-In" : "Manage Club Day"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("clubs")}
              className="glass-btn-secondary px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              Explore Organizations
            </button>
          </div>
        </div>

        {/* Global Metric Pills */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card-static p-4 rounded-2xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Primary Orgs</div>
            <div className="text-2xl font-black text-white mt-1">
              {institutionalMetrics?.totalOrganizations || 3}
            </div>
            <div className="text-[11px] text-indigo-400 mt-0.5 font-medium">NEX-CELL &middot; Kaizen &middot; MALHAR</div>
          </div>

          <div className="glass-card-static p-4 rounded-2xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Specialized Units</div>
            <div className="text-2xl font-black text-white mt-1">
              {institutionalMetrics?.totalUnits || 11}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">6 Domains + 5 Departments</div>
          </div>

          <div className="glass-card-static p-4 rounded-2xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Distinct Enrolled</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {institutionalMetrics?.totalEnrolledStudents || 1}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5 font-medium">Non-double-counted</div>
          </div>

          <div className="glass-card-static p-4 rounded-2xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Flagship Tracks</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {institutionalMetrics?.totalInitiatives || 6}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-0.5">NEX-CELL Initiatives</div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Glassmorphism Grid matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Active Clubs & Organizations (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Active Organizations
              </h2>
              <button
                onClick={() => setActiveTab("clubs")}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition border border-white/10"
              >
                Explore Clubs
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {/* NEX-CELL Card */}
              <div
                onClick={() => setActiveTab("clubs")}
                className="glass-card p-4 rounded-2xl cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10 group-hover:scale-105 transition">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Venture
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-3 group-hover:text-amber-200 transition">
                  NEX-CELL
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Entrepreneurship Club</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium text-amber-300">6 Initiatives</span>
                  <span className="text-slate-400">Founders Fire &bull; Mirage</span>
                </div>
              </div>

              {/* Kaizen Tech Card */}
              <div
                onClick={() => setActiveTab("clubs")}
                className="glass-card p-4 rounded-2xl cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Tech Club
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-3 group-hover:text-indigo-200 transition">
                  Kaizen Tech
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Engineering & Development</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium text-indigo-300">6 Domains</span>
                  <span className="text-slate-400">Web &bull; AI/ML &bull; CP</span>
                </div>
              </div>

              {/* MALHAR Card */}
              <div
                onClick={() => setActiveTab("clubs")}
                className="glass-card p-4 rounded-2xl cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400 shadow-md shadow-rose-500/10 group-hover:scale-105 transition">
                    <Palette className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    Society
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-3 group-hover:text-rose-200 transition">
                  MALHAR
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Cultural Society</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium text-rose-300">5 Departments</span>
                  <span className="text-slate-400">Media &bull; PR &bull; Design</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("clubs")}
            className="w-full glass-btn-secondary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            Explore All Clubs & Hierarchy
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Middle Column: Upcoming Activities & Co-Curricular Progress (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Upcoming Activities Panel */}
          <div className="glass-panel rounded-3xl p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Upcoming Activities
              </h2>
              <button
                onClick={() => setActiveTab("activities")}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {upcomingActivities.map((act) => (
                <div key={act.id} className="glass-card p-3.5 rounded-2xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{act.title}</h4>
                        <div className="text-[11px] text-slate-400">
                          {act.scheduledDate} &bull; {act.startTime || "2:00 PM"} &bull; {act.venue || "Campus Hub"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("activities")}
                      className="flex-1 glass-btn-secondary py-1 rounded-lg text-[11px] font-semibold text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setActiveTab(isStudent ? "attendance" : "submissions")}
                      className="flex-1 glass-btn-primary py-1 rounded-lg text-[11px] font-semibold text-center"
                    >
                      {isStudent ? "Check In" : "Evaluate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Co-Curricular Progress & Rubric Evaluation Badges */}
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Co-Curricular Progress
            </h2>

            {/* Skill / Rubric Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Technical & Innovation</span>
                  <span className="text-cyan-400 font-bold">85%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-[85%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Leadership & Initiative</span>
                  <span className="text-emerald-400 font-bold">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 w-[75%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Execution & Project Mgt</span>
                  <span className="text-purple-400 font-bold">60%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 w-[60%]" />
                </div>
              </div>
            </div>

            {/* Rubric Evaluation Badges matching Mockup */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="text-[11px] font-bold uppercase text-slate-400 mb-3">
                Rubric Evaluation Badges
              </div>
              <div className="grid grid-cols-6 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-medium">Excellence</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-medium">Teamwork</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-medium">Innovation</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-medium">Leader</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-sm">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-medium">Global</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-sm">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-medium">Tech Savvy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attendance Check-In & Activity Timeline (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Attendance Check-In Card matching Mockup */}
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-4">
              <QrCode className="w-4 h-4 text-emerald-400" />
              Attendance Check-In
            </h2>

            <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 rounded-xl bg-white shadow-xl shadow-black/30 shrink-0">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Active Attendance QR"
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-mono">
                    QR
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="text-[10px] font-bold uppercase text-slate-400">Current Session</div>
                <div className="text-sm font-extrabold text-white line-clamp-1 mt-0.5">
                  {activeEvent ? activeEvent.title : "Saturday Club Day"}
                </div>
                <div className="text-xs text-slate-300 mt-1">Scan QR or enter token</div>

                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                  <span className="text-[11px] text-slate-400">18 checked in</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("attendance")}
              className="mt-4 w-full glass-btn-primary py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              Open Full Attendance Console
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Activity Timeline matching Mockup */}
          <div className="glass-panel rounded-3xl p-6 flex-1">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-sky-400" />
              Recent Activity Timeline
            </h2>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              <div className="relative pl-7 flex items-start gap-3">
                <div className="absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-500/40 border border-indigo-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sarah joined Kaizen Tech (Web Dev)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Membership approved by coordinator</div>
                </div>
              </div>

              <div className="relative pl-7 flex items-start gap-3">
                <div className="absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500/40 border border-emerald-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Debate prep & rubric evaluation complete</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Score 93/100 &bull; Rubric evaluated</div>
                </div>
              </div>

              <div className="relative pl-7 flex items-start gap-3">
                <div className="absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500/40 border border-purple-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">MALHAR music rehearsal scheduled</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Auditorium &bull; Saturday 4:00 PM</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("activities")}
              className="mt-6 w-full glass-btn-secondary py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              Log Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
