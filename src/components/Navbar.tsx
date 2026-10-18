"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Profile, UserRole } from "@/types/database";
import {
  ShieldCheck,
  Menu,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { GitclubLogo } from "./GitclubLogo";
import { scrollToSection } from "./SmoothScroll";
import { RightNavbarDrawer } from "./RightNavbarDrawer";
import { motion } from "framer-motion";

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
  unit_lead: { label: "Domain / Dept Lead", badge: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
  student: { label: "Member", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30" },
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

  const sectionLinks = [
    { id: "overview", label: "Overview", tag: "01" },
    { id: "clubs", label: "Clubs & Units", tag: "02" },
    { id: "attendance", label: "Sessions & QR", tag: "03" },
    { id: "activities", label: "Approvals", tag: "04" },
    { id: "submissions", label: "Submissions", tag: "05" },
    { id: "certificates", label: "Transcripts", tag: "06" },
  ];

  return (
    <>
      {/* Top Ribbon Header (Unicorn Studio inspired, spacious & clear) */}
      <header className="sticky top-0 z-40 bg-[#070b16]/85 backdrop-blur-2xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <GitclubLogo size="md" showText={true} />
              </Link>

              {/* Center Quick Anchor Links on Desktop */}
              <nav className="hidden lg:flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                {sectionLinks.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className="relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeRibbonPill"
                          className="absolute inset-0 bg-blue-600/35 border border-blue-400/40 rounded-xl shadow-md"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span className={`text-[11px] font-mono ${isActive ? "text-cyan-300 font-bold" : "text-slate-500"}`}>
                          [{sec.tag}]
                        </span>
                        <span className={isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"}>
                          {sec.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: Quick Action Ribbon & Prompt Button for Hidden Navbar */}
            <div className="flex items-center gap-3">
              <Link
                href="/verify"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white transition border border-white/10"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Verify ID</span>
              </Link>

              {/* User Persona Chip */}
              <div
                onClick={() => setDrawerOpen(true)}
                className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-white/[0.05] border border-white/10 cursor-pointer hover:border-blue-400/40 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600/25 border border-blue-400/30 flex items-center justify-center text-blue-300 text-xs font-black">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[11px] text-cyan-300 font-semibold">
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              {/* The Ribbon Prompt Button: Opens the Hidden Right Navbar Drawer */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-600/25 hover:from-blue-600 hover:to-indigo-500 transition hover:scale-[1.02] active:scale-[0.98] border border-white/20"
                aria-label="Open Navigation & Role Switcher Drawer"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">Menu &amp; Switcher</span>
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
        profiles={profiles}
        onSwitchUser={onSwitchUser}
        activeSection={activeSection}
      />
    </>
  );
}
