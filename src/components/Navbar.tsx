"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Profile, UserRole } from "@/types/database";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { GitclubLogo } from "./GitclubLogo";
import { RightNavbarDrawer } from "./RightNavbarDrawer";
import { scrollToSection } from "./SmoothScroll";
import { logoutAction } from "@/actions/auth";

interface NavbarProps {
  currentUser: Profile;
  activeSection: string;
}

const DESKTOP_NAV_LINKS = [
  { id: "overview", label: "Overview", tag: "01" },
  { id: "clubs", label: "Clubs", tag: "02" },
  { id: "attendance", label: "Check-In", tag: "03" },
  { id: "activities", label: "Activities", tag: "04" },
  { id: "submissions", label: "Deliverables", tag: "05" },
  { id: "certificates", label: "Ledger", tag: "06" },
  { id: "testing-log", label: "QA Log", tag: "07" },
];

const ROLE_LABELS: Record<UserRole, { label: string; badge: string }> = {
  president: { label: "President", badge: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
  vice_president: { label: "Vice President", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30" },
  lead: { label: "Lead / Head", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
  member: { label: "Member", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30" },
  admin: { label: "Campus Admin", badge: "bg-purple-500/20 text-purple-300 border-purple-400/30" },
  college_admin: { label: "Campus Admin", badge: "bg-purple-500/20 text-purple-300 border-purple-400/30" },
  campus_manager: { label: "Campus Manager", badge: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
  faculty_advisor: { label: "Advisor", badge: "bg-amber-500/20 text-amber-300 border-amber-400/30" },
  society_admin: { label: "President", badge: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
  student_coordinator: { label: "Student Lead", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
  unit_lead: { label: "Domain Lead", badge: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
  student: { label: "Member", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30" },
};

const SECTION_MAP: Record<string, { tag: string; label: string }> = {
  overview: { tag: "01", label: "Overview & Campus Metrics" },
  clubs: { tag: "02", label: "Clubs & Specialized Units" },
  attendance: { tag: "03", label: "Sessions & Smart Check-In" },
  activities: { tag: "04", label: "Proposals & Approvals" },
  submissions: { tag: "05", label: "Deliverables & Rubrics" },
  certificates: { tag: "06", label: "Transcripts & Ledger" },
  "testing-log": { tag: "07", label: "Multi-User Testing Log" },
};

export function Navbar({
  currentUser,
  activeSection,
}: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const roleInfo = ROLE_LABELS[currentUser.role] || {
    label: currentUser.role,
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };

  const activeSec = SECTION_MAP[activeSection] || SECTION_MAP.overview;

  return (
    <>
      {/* Sleek Fully-Responsive Top Header */}
      <header className="sticky top-0 z-40 bg-[#070b16]/85 backdrop-blur-2xl border-b border-white/10 transition-all">
        <div className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Clean Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group active:scale-95 transition-transform">
              <GitclubLogo size="sm" showText={true} />
            </Link>

            {/* Center (Desktop): Fast Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10 backdrop-blur-md">
              {DESKTOP_NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-75">[{link.tag}]</span>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Center (Mobile / Tablet): Live Scroll Position Indicator Pill */}
            <div className="flex lg:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="font-mono text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                [{activeSec.tag}]
              </span>
              <span className="text-white font-semibold tracking-tight text-[11px] max-w-[120px] sm:max-w-[200px] truncate">
                {activeSec.label}
              </span>
            </div>

            {/* Right: Unified Role Badge & Drawer Trigger */}
            <div className="flex items-center gap-2.5">
              <span className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${roleInfo.badge}`}>
                {roleInfo.label}
              </span>

              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 border border-white/10 hover:border-cyan-400/40 transition-all group shadow-sm"
                aria-label="Open Navigation Drawer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shrink-0">
                  <div className="w-full h-full bg-[#0a1124] rounded-[6px] flex items-center justify-center text-cyan-300 text-xs font-black">
                    {currentUser.fullName.charAt(0)}
                  </div>
                </div>

                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentUser.studentId || "Verified"}
                  </span>
                </div>

                <Menu className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hidden Right Navbar Drawer (Prompts into view on click) */}
      <RightNavbarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentUser={currentUser}
        activeSection={activeSection}
      />
    </>
  );
}
