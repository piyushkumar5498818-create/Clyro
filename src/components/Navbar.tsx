"use client";

import Link from "next/link";
import { Profile, UserRole } from "@/types/database";
import { ShieldCheck, UserCheck } from "lucide-react";

interface NavbarProps {
  currentUser: Profile;
  profiles: Profile[];
  onSwitchUser: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; badge: string }> = {
  college_admin: { label: "College Admin", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  campus_manager: { label: "Campus Manager", badge: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  faculty_advisor: { label: "Faculty Advisor", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  society_admin: { label: "Society President", badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  student_coordinator: { label: "Student Lead", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  unit_lead: { label: "Domain / Dept Lead", badge: "bg-teal-500/15 text-teal-300 border-teal-500/30" },
  student: { label: "Student", badge: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
};

export function Navbar({
  currentUser,
  profiles,
  onSwitchUser,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const roleInfo = ROLE_LABELS[currentUser.role] || {
    label: currentUser.role,
    badge: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/40 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition">
                <div className="w-full h-full bg-slate-950/80 rounded-[11px] flex items-center justify-center backdrop-blur-sm">
                  <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 via-purple-200 to-pink-300">
                    C
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white leading-none group-hover:text-indigo-200 transition">
                  Clyro
                </span>
                <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase mt-0.5">
                  Mirai School of Tech
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {[
                { id: "overview", label: "Dashboard" },
                { id: "clubs", label: "Organizations & Units" },
                { id: "activities", label: "Club Day" },
                { id: "attendance", label: "Attendance" },
                { id: "submissions", label: "Submissions & Rubric" },
                { id: "certificates", label: "Certificates" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white/15 text-white shadow-sm border border-white/20 backdrop-blur-md"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Persona / Role Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Persona:</span>
            </div>

            <div className="relative inline-block">
              <select
                aria-label="Persona Switcher"
                value={currentUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="text-xs sm:text-sm font-medium rounded-xl border border-white/15 bg-slate-900/70 py-1.5 pl-3 pr-8 text-slate-100 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer backdrop-blur-md"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                    {p.fullName} — {p.title || ROLE_LABELS[p.role]?.label}
                  </option>
                ))}
              </select>
            </div>

            <span
              className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${roleInfo.badge}`}
            >
              {currentUser.title || roleInfo.label}
            </span>

            <Link
              href="/verify"
              className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition border border-white/10 backdrop-blur-md shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verify
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-white/10 text-xs">
          {[
            { id: "overview", label: "Dashboard" },
            { id: "clubs", label: "Orgs & Units" },
            { id: "activities", label: "Activities" },
            { id: "attendance", label: "Attendance" },
            { id: "submissions", label: "Submissions" },
            { id: "certificates", label: "Certificates" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 whitespace-nowrap rounded-lg font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-600/80 text-white border border-indigo-400/40 shadow-sm"
                  : "bg-white/[0.04] text-slate-300 border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
