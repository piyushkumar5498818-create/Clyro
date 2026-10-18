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
} from "lucide-react";
import { scrollToSection } from "./SmoothScroll";
import { logoutAction } from "@/actions/auth";
import { GitclubLogo } from "./GitclubLogo";
import { motion, AnimatePresence } from "framer-motion";

interface RightNavbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export function RightNavbarDrawer({
  isOpen,
  onClose,
  currentUser,
  profiles,
  onSwitchUser,
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

          {/* Right Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 bg-[#0a1124] border-l border-white/15 shadow-2xl flex flex-col text-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <GitclubLogo size="sm" showText={true} />
              </div>

              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Active Profile Card */}
              <div className="glass-card p-4 rounded-3xl border border-white/15 bg-white/[0.03]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-600/30 shrink-0">
                    <div className="w-full h-full bg-[#0a1124] rounded-[14px] flex items-center justify-center text-white text-lg font-black">
                      {currentUser.fullName.charAt(0)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white truncate">
                      {currentUser.fullName}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                      {currentUser.email}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-blue-500/15 text-cyan-300 border-blue-400/30">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{roleInfo.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                <div className="px-1 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  PAGE SECTIONS
                </div>

                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-semibold transition text-left group ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/20 text-white font-bold border border-blue-400/40 shadow-md"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-white/10 text-slate-400 group-hover:text-white"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{item.label}</span>
                        </div>
                        <span className="font-mono text-xs text-cyan-400 opacity-70 group-hover:opacity-100">
                          [{item.tag}]
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Persona Switcher Section */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="px-1 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                    SWITCH INSTITUTIONAL ROLE
                  </span>
                  <span className="text-[11px] text-blue-400 font-semibold">RBAC SIMULATOR</span>
                </div>

                <div className="space-y-1.5">
                  {profiles.map((p) => {
                    const isCurrent = p.id === currentUser.id;
                    const pRole = ROLE_LABELS[p.role] || { label: p.role, badge: "" };

                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSwitchUser(p.id);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition ${
                          isCurrent
                            ? "bg-blue-600/25 border border-blue-400/40 text-white font-bold"
                            : "hover:bg-white/[0.05] border border-white/5 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-sm font-bold truncate">{p.fullName}</div>
                          <div className="text-xs text-slate-400 truncate">{p.title || pRole.label}</div>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10 shrink-0">
                          {pRole.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Services & Security */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Link
                  href="/verify"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] border border-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span>Public Verification Ledger</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-sm font-semibold text-rose-300 hover:bg-rose-500/15 border border-rose-500/20 transition text-left"
                >
                  <LogOut className="w-5 h-5 text-rose-400" />
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
