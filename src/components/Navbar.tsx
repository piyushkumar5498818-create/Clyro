"use client";

import Link from "next/link";
import { Profile, UserRole } from "@/types/database";
import { ShieldCheck, UserCheck, Layers } from "lucide-react";

interface NavbarProps {
  currentUser: Profile;
  profiles: Profile[];
  onSwitchUser: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; badge: string }> = {
  college_admin: { label: "College Admin", badge: "bg-purple-100 text-purple-800 border-purple-300" },
  campus_manager: { label: "Campus Manager", badge: "bg-blue-100 text-blue-800 border-blue-300" },
  society_admin: { label: "Society Admin", badge: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  faculty_advisor: { label: "Faculty Advisor", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  student_coordinator: { label: "Student Coordinator", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  student: { label: "Student", badge: "bg-sky-100 text-sky-800 border-sky-300" },
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
    badge: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                C
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                  Clyro
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  MSOT Campus Platform
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: "overview", label: "Dashboard" },
                { id: "clubs", label: "Clubs & Society" },
                { id: "activities", label: "Club Day" },
                { id: "attendance", label: "Attendance" },
                { id: "submissions", label: "Submissions & Rubric" },
                { id: "certificates", label: "Certificates" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Persona / Role Switcher for Autonomous Evaluation */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulated Persona:</span>
            </div>

            <div className="relative inline-block">
              <select
                aria-label="Simulated Persona Role Switcher"
                value={currentUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-3 pr-8 text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({ROLE_LABELS[p.role]?.label || p.role})
                  </option>
                ))}
              </select>
            </div>

            <span
              className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleInfo.badge}`}
            >
              {roleInfo.label}
            </span>

            <Link
              href="/verify"
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition border border-slate-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verify
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 text-xs">
          {[
            { id: "overview", label: "Dashboard" },
            { id: "clubs", label: "Clubs" },
            { id: "activities", label: "Activities" },
            { id: "attendance", label: "Attendance" },
            { id: "submissions", label: "Submissions" },
            { id: "certificates", label: "Certificates" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 whitespace-nowrap rounded-md font-medium ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-100 text-slate-700"
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
