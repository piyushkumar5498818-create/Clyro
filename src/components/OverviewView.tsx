"use client";

import { Profile, Club, Activity, AttendanceRecord, Submission, Certificate } from "@/types/database";
import {
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface OverviewViewProps {
  currentUser: Profile;
  topClubs: Club[];
  societyMetrics: any;
  collegeMetrics: any;
  activities: Activity[];
  attendanceRecords: AttendanceRecord[];
  submissions: Submission[];
  certificates: Certificate[];
  setActiveTab: (tab: string) => void;
}

export function OverviewView({
  currentUser,
  topClubs,
  societyMetrics,
  collegeMetrics,
  activities,
  attendanceRecords,
  submissions,
  certificates,
  setActiveTab,
}: OverviewViewProps) {
  const isCollegeAdmin = currentUser.role === "college_admin" || currentUser.role === "campus_manager";
  const isSocietyAdmin = currentUser.role === "society_admin";
  const isCoordinator = currentUser.role === "student_coordinator";
  const isAdvisor = currentUser.role === "faculty_advisor";
  const isStudent = currentUser.role === "student";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            {isCollegeAdmin && "Campus Executive Management"}
            {isSocietyAdmin && "Apex Society Governing Console"}
            {isCoordinator && "Student Coordinator Operations"}
            {isAdvisor && "Faculty Advisory & Evaluation Portal"}
            {isStudent && "Student Co-Curricular Portfolio"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            {isCollegeAdmin &&
              "Real-time governance across 4 top-level campus organizations and 4 specialized society sub-clubs. Verified tracking with zero double-counting."}
            {isSocietyAdmin &&
              "Overseeing the Technical & Innovation Society and consolidating metrics across all 4 independent sub-club wings."}
            {isCoordinator &&
              "Manage your assigned club members, run time-limited QR check-in sessions, and evaluate participant deliverables."}
            {isAdvisor &&
              "Review upcoming Club Day activity plans, rubric-grade submissions, and issue verifiable achievement certificates."}
            {isStudent &&
              "Track your enrolled clubs, attend Saturday Club Day sessions with dynamic QR check-in, and build your verified resume record."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab(isStudent ? "attendance" : isCoordinator ? "attendance" : "activities")}
              className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow hover:bg-indigo-50 transition flex items-center gap-2"
            >
              {isStudent ? "Check In to Session" : isCoordinator ? "Launch QR Attendance" : "View Club Day Activities"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("clubs")}
              className="px-4 py-2 rounded-xl bg-indigo-700/60 text-white font-medium text-sm hover:bg-indigo-700 transition border border-indigo-500/40"
            >
              Explore Club Hierarchy
            </button>
          </div>
        </div>
      </div>

      {/* College Admin Global Metrics */}
      {isCollegeAdmin && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Institution-Wide Hierarchy & Activity Metrics
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Verified Ledger
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border bg-white shadow-sm">
              <div className="text-xs font-semibold uppercase text-slate-500">Top-Level Clubs</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {collegeMetrics?.totalTopLevelClubs || 4}
              </div>
              <div className="text-xs text-indigo-600 mt-1 font-medium">3 Independent + 1 Society</div>
            </div>

            <div className="p-5 rounded-xl border bg-white shadow-sm">
              <div className="text-xs font-semibold uppercase text-slate-500">Society Sub-Clubs</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {collegeMetrics?.societySubClubsCount || 4}
              </div>
              <div className="text-xs text-slate-500 mt-1">Independent Wings</div>
            </div>

            <div className="p-5 rounded-xl border bg-white shadow-sm">
              <div className="text-xs font-semibold uppercase text-slate-500">Distinct Enrolled Students</div>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">
                {collegeMetrics?.totalEnrolledStudents || 1}
              </div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">Zero double-counting</div>
            </div>

            <div className="p-5 rounded-xl border bg-white shadow-sm">
              <div className="text-xs font-semibold uppercase text-slate-500">Attendance Records</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {collegeMetrics?.totalAttendanceLogs || 1}
              </div>
              <div className="text-xs text-slate-500 mt-1">Verified via QR / code</div>
            </div>
          </div>
        </div>
      )}

      {/* Society Admin Consolidated Metrics */}
      {(isSocietyAdmin || isCollegeAdmin) && societyMetrics && (
        <div className="p-6 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Consolidated Society View
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {societyMetrics.societyName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                4 Sub-Clubs Consolidated
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {societyMetrics.totalUniqueMembers} Unique Members
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {societyMetrics.subClubsList.map((sc: any) => (
              <div key={sc.id} className="p-4 rounded-xl border bg-white shadow-xs">
                <div className="font-bold text-sm text-slate-900">{sc.name}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t pt-2">
                  <span>Members: <strong className="text-slate-900">{sc.membersCount}</strong></span>
                  <span>Activities: <strong className="text-indigo-600">{sc.activitiesCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setActiveTab("clubs")}
          className="p-6 rounded-2xl border bg-white hover:border-indigo-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Club Hierarchy</h3>
          <p className="text-xs text-slate-600 mt-1">
            Browse the 4 top-level clubs and 4 specialized society sub-clubs. Manage memberships and limits.
          </p>
        </div>

        <div
          onClick={() => setActiveTab("activities")}
          className="p-6 rounded-2xl border bg-white hover:border-indigo-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Club Day Planning</h3>
          <p className="text-xs text-slate-600 mt-1">
            Plan session topics, deliverable requirements, and execute advisor approvals.
          </p>
        </div>

        <div
          onClick={() => setActiveTab("attendance")}
          className="p-6 rounded-2xl border bg-white hover:border-indigo-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">QR Check-In & Attendance</h3>
          <p className="text-xs text-slate-600 mt-1">
            Dynamic time-limited attendance codes with duplicate guard and manual coordinator overrides.
          </p>
        </div>
      </div>
    </div>
  );
}
