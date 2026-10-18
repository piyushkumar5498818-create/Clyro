"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Profile, UserRole } from "@/types/database";
import {
  ShieldCheck,
  UserCheck,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Compass,
  Award,
  Layers,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { GitclubLogo } from "./GitclubLogo";
import { scrollToSection } from "./SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  currentUser: Profile;
  profiles: Profile[];
  onSwitchUser: (userId: string) => void;
  activeSection: string;
}

const ROLE_LABELS: Record<UserRole, { label: string; badge: string }> = {
  president: { label: "President", badge: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  vice_president: { label: "Vice President", badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  lead: { label: "Lead / Head", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  member: { label: "Member", badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  admin: { label: "Campus Admin", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  college_admin: { label: "Campus Admin", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  campus_manager: { label: "Campus Manager", badge: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  faculty_advisor: { label: "Advisor", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  society_admin: { label: "President", badge: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  student_coordinator: { label: "Student Lead", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  unit_lead: { label: "Domain / Dept Lead", badge: "bg-teal-500/15 text-teal-300 border-teal-500/30" },
  student: { label: "Member", badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
};

export function Navbar({
  currentUser,
  profiles,
  onSwitchUser,
  activeSection,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const roleInfo = ROLE_LABELS[currentUser.role] || {
    label: currentUser.role,
    badge: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const sectionLinks = [
    { id: "explore", label: "Explore", tag: "00" },
    { id: "overview", label: "Overview", tag: "01" },
    { id: "clubs", label: "Clubs", tag: "02" },
    { id: "attendance", label: "Attendance", tag: "03" },
    { id: "activities", label: "Activities", tag: "04" },
    { id: "submissions", label: "Submissions", tag: "05" },
    { id: "certificates", label: "Transcripts", tag: "06" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#070b16]/80 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Logo & Brand (desktop logo is in sidebar) */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Link href="/">
                <GitclubLogo size="sm" showText={true} />
              </Link>
            </div>

            {/* Desktop Quick Lenis Nav Indicator */}
            <nav className="hidden xl:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {sectionLinks.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSectionIndicator"
                        className="absolute inset-0 bg-blue-600/30 border border-blue-400/40 rounded-lg shadow-sm"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5 font-mono">
                      <span className={`text-[10px] ${isActive ? "text-cyan-300 font-bold" : "text-slate-500"}`}>
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

          {/* Right Action Cluster: Persona Switcher, Verify, Profile */}
          <div className="flex items-center gap-3">
            <Link
              href="/verify"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition border border-white/10"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verify ID</span>
            </Link>

            {/* Institutional Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600/25 border border-blue-400/30 flex items-center justify-center text-blue-300 text-xs font-bold">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-none">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-blue-300 font-semibold mt-0.5">
                    {roleInfo.label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {switcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-white/15"
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        Switch Institutional Persona
                      </div>
                      <div className="text-xs text-slate-300 font-semibold mt-0.5">
                        Test RBAC & Executive Approval Flows
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                      {profiles.map((p) => {
                        const isCurrent = p.id === currentUser.id;
                        const pRole = ROLE_LABELS[p.role] || { label: p.role, badge: "" };
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              onSwitchUser(p.id);
                              setSwitcherOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition ${
                              isCurrent
                                ? "bg-blue-600/30 text-white font-bold border border-blue-500/40"
                                : "hover:bg-white/10 text-slate-300 hover:text-white"
                            }`}
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="truncate font-semibold">{p.fullName}</span>
                              <span className="text-[10px] text-slate-400 truncate">{p.title || pRole.label}</span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 shrink-0">
                              {pRole.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Gitclub</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300"
              aria-label="Toggle Navigation"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-slate-950/95 px-4 py-4 space-y-2 backdrop-blur-2xl"
          >
            {sectionLinks.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  scrollToSection(sec.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/10 text-left"
              >
                <span>{sec.label}</span>
                <span className="font-mono text-cyan-400 text-[10px]">[{sec.tag}]</span>
              </button>
            ))}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
              <Link href="/verify" className="text-cyan-400 font-semibold">
                Verify Credentials &rarr;
              </Link>
              <button onClick={handleLogout} className="text-rose-400 font-semibold">
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
