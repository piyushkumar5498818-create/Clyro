"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Profile, UserRole } from "@/types/database";
import {
  X,
  LayoutDashboard,
  Users,
  QrCode,
  CheckSquare,
  FileSpreadsheet,
  Award,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";
import { scrollToSection } from "./SmoothScroll";
import { logoutAction } from "@/actions/auth";
import { GitclubLogo } from "./GitclubLogo";
import { motion, AnimatePresence } from "framer-motion";

interface RightNavbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
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

export function RightNavbarDrawer({
  isOpen,
  onClose,
  currentUser,
  activeSection,
}: RightNavbarDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const navItems = [
    { id: "overview", label: "Overview & Metrics", tag: "01", icon: LayoutDashboard },
    { id: "clubs", label: "Clubs & Specialized Units", tag: "02", icon: Users },
    { id: "attendance", label: "Live Sessions & QR Check-In", tag: "03", icon: QrCode },
    { id: "activities", label: "Activity Proposals & Approvals", tag: "04", icon: CheckSquare },
    { id: "submissions", label: "Submissions & Rubrics", tag: "05", icon: FileSpreadsheet },
    { id: "certificates", label: "Verified Transcripts & Certs", tag: "06", icon: Award },
  ];

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    onClose();
  };

  const roleInfo = ROLE_LABELS[currentUser.role] || {
    label: currentUser.role,
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Right Slide-over Panel (Compact, Uncluttered, Fits 100% on screen without scroll) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[350px] h-screen max-h-screen z-50 bg-[#080d1c] border-l border-white/15 shadow-2xl flex flex-col justify-between text-slate-100 overflow-hidden backdrop-blur-2xl"
          >
            {/* 1. Header */}
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-2.5">
                <GitclubLogo size="sm" showText={true} />
              </div>

              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Middle Content (No Scroll, perfectly spaced) */}
            <div className="flex-1 flex flex-col justify-between px-5 py-4 min-h-0 overflow-hidden">
              {/* Active Session Card (Low-profile, sleek) */}
              <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-[1.5px] shadow-md shadow-blue-600/30 shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-[#0a1124] rounded-[9px] flex items-center justify-center text-white text-xs font-black overflow-hidden">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.fullName}
                          className="w-full h-full object-cover rounded-[9px]"
                        />
                      ) : (
                        currentUser.fullName.charAt(0)
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>{currentUser.fullName}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                    <div className="text-[11px] text-cyan-300 font-mono truncate">
                      {currentUser.title || roleInfo.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-blue-500/15 text-cyan-300 border border-blue-400/25">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Page Directory Links */}
              <div className="space-y-1 my-auto py-2">
                <div className="px-1 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center justify-between">
                  <span>DIRECTORY</span>
                  <span className="text-[9px] text-slate-300 font-normal">6 SECTIONS</span>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left group ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/20 text-white font-bold border border-blue-400/40 shadow-sm"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-white/10 text-slate-400 group-hover:text-white"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className="font-mono text-[11px] text-cyan-400 opacity-70 group-hover:opacity-100 shrink-0 ml-2">
                          [{item.tag}]
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Services & Sign Out */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 shrink-0">
                <Link
                  href="/verify"
                  onClick={onClose}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] border border-white/10 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Public Verification Ledger</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/15 border border-rose-500/20 transition text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out of Gitclub</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
