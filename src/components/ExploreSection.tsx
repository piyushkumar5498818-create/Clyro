"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Users,
} from "lucide-react";
import { scrollToSection } from "./SmoothScroll";
import { Activity, Profile } from "@/types/database";

interface ExploreSectionProps {
  currentUser: Profile;
  activities: Activity[];
}

export function ExploreSection({ currentUser, activities }: ExploreSectionProps) {
  const [highlightIndex, setHighlightIndex] = useState(0);

  const highlights = [
    {
      title: "SOMETHING UNBELIEVABLE HAPPENED AT MIRAI",
      sub: "Over 350+ students gathered for the NEX-CELL & Kaizen Tech Open Build Hackathon.",
      tag: "FLAGSHIP EVENT",
      image: "/mirai_portal_ref.png",
      date: "OCTOBER 2024",
    },
    {
      title: "KAIZEN TECH: 3 DOMAINS ACCREDITATION",
      sub: "Competitive Programming, Modern Web, and AI & Data Science teams open sprint enrolments.",
      tag: "TECH TRACKS",
      image: "/mirai_portal_ref.png",
      date: "ACADEMIC CYCLE",
    },
    {
      title: "MALHAR CULTURAL SOCIETY ANNUAL AUDITIONS",
      sub: "Management, Media, Tech, Design, and PR departments announce leadership cohorts.",
      tag: "SOCIETY PULSE",
      image: "/mirai_portal_ref.png",
      date: "STAGE FINALE",
    },
  ];

  const nextHighlight = () => {
    setHighlightIndex((prev) => (prev + 1) % highlights.length);
  };

  const prevHighlight = () => {
    setHighlightIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  // Sample schedule items aligned with user's screenshot
  const upcomingEvents = [
    {
      id: "ev-1",
      time: "9:15 AM - 10:45 AM",
      title: "DSA in C++ & Algorithmic Problem Solving",
      type: "Lecture",
      status: "Upcoming",
      meta: "Kaizen CP Domain • Offline Lab",
      badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    },
    {
      id: "ev-2",
      time: "11:00 AM - 12:30 PM",
      title: "Full-Stack System Architecture & Next.js",
      type: "Workshop",
      status: "Upcoming",
      meta: "Kaizen Web Domain • Tech Center",
      badgeColor: "bg-blue-500/15 text-cyan-300 border-cyan-500/30",
    },
    {
      id: "ev-3",
      time: "1:20 PM - 2:20 PM",
      title: "Introduction to Prompt Eng & Agentic Workflows",
      type: "Sprint",
      status: "Upcoming",
      meta: "Kaizen AI/DS • Studio 4",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    },
  ];

  // Radial Attendance Calculation
  const presentCount = 132;
  const absentCount = 4;
  const totalCount = presentCount + absentCount;
  const attendanceRate = Math.round((presentCount / totalCount) * 100);
  const strokeDashoffset = 283 - (283 * attendanceRate) / 100;

  return (
    <section id="explore" className="mb-10 space-y-6">
      {/* Top Section Breadcrumb / Lenis Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-widest">
            [DASHBOARD HOME]
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-xs text-slate-400 font-medium">Campus Operational Matrix</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GITCLUB MIRAI // REAL-TIME SYNCHRONIZED</span>
        </div>
      </div>

      {/* Grid: Explore (Left) and Events (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Explore 2x2 Grid (4 cols on lg) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Explore
              </h2>
              <span className="text-[11px] font-mono text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                QUICK ACCESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Schedule */}
              <button
                onClick={() => scrollToSection("attendance")}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:border-blue-400/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-2.5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  Schedule
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Live Sessions</span>
              </button>

              {/* My Clubs & Domains */}
              <button
                onClick={() => scrollToSection("clubs")}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:border-blue-400/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-2.5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  My Clubs
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">3 Tech & Cultural</span>
              </button>

              {/* Activity Approvals */}
              <button
                onClick={() => scrollToSection("activities")}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:border-blue-400/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Approvals
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Student Lead Desk</span>
              </button>

              {/* Verifications & Credentials */}
              <button
                onClick={() => scrollToSection("certificates")}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:border-blue-400/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2.5 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Transcripts
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Verified Certificates</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary Campus: <strong className="text-slate-200">Mirai Tech</strong></span>
            <button
              onClick={() => scrollToSection("overview")}
              className="text-blue-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Overview &rarr;
            </button>
          </div>
        </div>

        {/* Events / Live Schedule Cards (7 cols on lg) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Events</h2>
                <span className="text-xs text-slate-400 font-normal">Today&apos;s Curriculum</span>
              </div>
              <button
                onClick={() => scrollToSection("attendance")}
                className="text-xs font-semibold text-blue-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => scrollToSection("attendance")}
                  className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group hover:border-blue-400/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${ev.badgeColor}`}>
                        {ev.type}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                        {ev.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {ev.time}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {ev.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{ev.meta}</div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Check In <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Dynamic 60-min QR Check-in Active
            </span>
            <button
              onClick={() => scrollToSection("attendance")}
              className="font-mono text-blue-400 hover:underline"
            >
              GENERATE TOKEN #
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Highlights Banner & Circular Attendance Ring (Exact match to uploaded screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Highlights Carousel (8 cols on lg) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Highlights
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevHighlight}
                aria-label="Previous highlight"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextHighlight}
                aria-label="Next highlight"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-white/10 flex flex-col justify-end p-6">
            {/* Background Accent Gradients & Banner Graphics */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={highlightIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-20 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {highlights[highlightIndex].tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {highlights[highlightIndex].date}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {highlights[highlightIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {highlights[highlightIndex].sub}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => scrollToSection("activities")}
                    className="glass-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    Explore Activities <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollToSection("clubs")}
                    className="glass-btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold"
                  >
                    Club Details
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Circular Radial Attendance Widget (4 cols on lg - Exact copy of uploaded image) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Attendance</h2>
            <button
              onClick={() => scrollToSection("attendance")}
              className="text-xs font-semibold text-blue-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Circular Gauge Ring */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Active Progress Ring (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * attendanceRate) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Small Coral/Red Accent Dot at top center */}
                <circle cx="50" cy="8" r="3.2" fill="#ef4444" />
              </svg>

              {/* Center Text Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white tracking-tight">
                  {attendanceRate}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 -mt-0.5 uppercase tracking-wider">
                  Present
                </span>
              </div>
            </div>
          </div>

          {/* Stats Legend Breakdown */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[4px] bg-emerald-500" />
                <span className="text-slate-300 font-medium">Present</span>
              </div>
              <span className="font-mono font-bold text-white">{presentCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[4px] bg-rose-500" />
                <span className="text-slate-300 font-medium">Absent</span>
              </div>
              <span className="font-mono font-bold text-white">{absentCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/5 font-bold">
              <span className="text-slate-400">Total Classes</span>
              <span className="font-mono text-white">{totalCount}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
