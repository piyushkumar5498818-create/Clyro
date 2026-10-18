"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Profile, UserRole } from "@/types/database";
import { Menu } from "lucide-react";
import { GitclubLogo } from "./GitclubLogo";
import { RightNavbarDrawer } from "./RightNavbarDrawer";

interface NavbarProps {
  currentUser: Profile;
  profiles: Profile[];
  onSwitchUser: (userId: string) => void;
  activeSection: string;
}

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
};

export function Navbar({
  currentUser,
  profiles,
  onSwitchUser,
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
      {/* Sleek, Uncluttered Top Ribbon Header */}
      <header className="sticky top-0 z-40 bg-[#070b16]/75 backdrop-blur-2xl border-b border-white/10 transition-all">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Clean Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <GitclubLogo size="md" showText={true} />
            </Link>

            {/* Center: Clean Live Scroll Position Pill (Zero clutter, dynamic context) */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] text-cyan-300 font-bold uppercase tracking-wider">
                [{activeSec.tag}]
              </span>
              <span className="text-white font-semibold tracking-tight">
                {activeSec.label}
              </span>
            </div>

            {/* Right: Single Unified Menu & Persona Capsule (Prompt for Hidden Drawer) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-blue-400/40 transition-all group shadow-sm"
              aria-label="Open Navigation & Role Switcher Drawer"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shrink-0">
                <div className="w-full h-full bg-[#0a1124] rounded-[9px] flex items-center justify-center text-cyan-300 text-xs font-black">
                  {currentUser.fullName.charAt(0)}
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition leading-tight">
                  {currentUser.fullName.split(" ")[0]}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/25 uppercase">
                  {roleInfo.label}
                </span>
              </div>

              <div className="ml-1 pl-2 border-l border-white/10 flex items-center text-slate-400 group-hover:text-white transition">
                <Menu className="w-4 h-4 text-cyan-400" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Hidden Right Navbar Drawer (Prompts into view on click) */}
      <RightNavbarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentUser={currentUser}
        profiles={profiles}
        onSwitchUser={onSwitchUser}
        activeSection={activeSection}
      />
    </>
  );
}
