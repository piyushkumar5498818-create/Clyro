"use client";

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
  Briefcase,
} from "lucide-react";

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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Mirai School of Technology &middot; Club Management Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            {isCollegeAdmin &&
              "Campus-wide governance across NEX-CELL, Kaizen Tech, and MALHAR. Authoritative participation ledgers with zero double-counting."}
            {isAdvisor &&
              `Faculty advisory console for Mirai campus organizations. Review activity plans, evaluate deliverables, and issue verifiable achievement certificates.`}
            {!isCollegeAdmin && !isAdvisor && !isStudent &&
              "Operational command center for student coordinators, domain leads, and department heads. Launch QR check-in, review submissions, and manage teams."}
            {isStudent &&
              "Explore Mirai's entrepreneurship, technical, and cultural organizations. Attend Saturday Club Days, upload deliverables, and build a verified co-curricular transcript."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab(isStudent ? "attendance" : "activities")}
              className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow hover:bg-indigo-50 transition flex items-center gap-2"
            >
              {isStudent ? "Quick Session Check-In" : "Club Day Activities"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("clubs")}
              className="px-4 py-2 rounded-xl bg-indigo-800/60 text-white font-medium text-sm hover:bg-indigo-800 transition border border-indigo-500/40"
            >
              Explore Organizations & Units
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Global Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Campus Organizations & Participation Ledger
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Verified MSOT Ledger
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border bg-white shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500">Primary Organizations</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {institutionalMetrics?.totalOrganizations || 3}
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">NEX-CELL &middot; Kaizen &middot; MALHAR</div>
          </div>

          <div className="p-5 rounded-xl border bg-white shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500">Specialized Units</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {institutionalMetrics?.totalUnits || 11}
            </div>
            <div className="text-xs text-slate-500 mt-1">6 Domains + 5 Departments</div>
          </div>

          <div className="p-5 rounded-xl border bg-white shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500">Distinct Enrolled Students</div>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">
              {institutionalMetrics?.totalEnrolledStudents || 1}
            </div>
            <div className="text-xs text-emerald-600 mt-1 font-medium">Non-double-counted</div>
          </div>

          <div className="p-5 rounded-xl border bg-white shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500">Flagship Initiatives</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {institutionalMetrics?.totalInitiatives || 6}
            </div>
            <div className="text-xs text-slate-500 mt-1">NEX-CELL Venture Tracks</div>
          </div>
        </div>
      </div>

      {/* The 3 Primary Organizations Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NEX-CELL */}
        <div
          onClick={() => setActiveTab("clubs")}
          className="p-6 rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase text-amber-700">Entrepreneurship Club</div>
            <h3 className="font-extrabold text-lg text-slate-900 mt-1">NEX-CELL</h3>
            <p className="text-xs text-slate-600 mt-2 line-clamp-3">
              Venture building, pitch critiques, MVP sprints, and startup founder networking.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t text-xs text-amber-800 font-semibold flex items-center justify-between">
            <span>6 Flagship Initiatives</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Kaizen Tech */}
        <div
          onClick={() => setActiveTab("clubs")}
          className="p-6 rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/30 to-white hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase text-indigo-700">Technical Club</div>
            <h3 className="font-extrabold text-lg text-slate-900 mt-1">Kaizen Tech</h3>
            <p className="text-xs text-slate-600 mt-2 line-clamp-3">
              Full-stack engineering, applied machine learning, competitive programming, and OSS.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t text-xs text-indigo-800 font-semibold flex items-center justify-between">
            <span>6 Technical Domains</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* MALHAR */}
        <div
          onClick={() => setActiveTab("clubs")}
          className="p-6 rounded-2xl border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/30 to-white hover:border-rose-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase text-rose-700">Cultural Society</div>
            <h3 className="font-extrabold text-lg text-slate-900 mt-1">MALHAR</h3>
            <p className="text-xs text-slate-600 mt-2 line-clamp-3">
              Campus fests, live stagecraft, event media, branding design, and performing arts.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t text-xs text-rose-800 font-semibold flex items-center justify-between">
            <span>5 Specialized Departments</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
