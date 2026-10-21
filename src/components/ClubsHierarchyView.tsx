"use client";

import { useState } from "react";
import { Organization, Profile, OrganizationMembership } from "@/types/database";
import { requestMembershipAction, reviewMembershipAction } from "@/actions/memberships";
import { createOrganizationAction } from "@/actions/organizations";
import {
  Users,
  Check,
  X,
  AlertCircle,
  Rocket,
  Code2,
  Palette,
  Layers,
  BookOpen,
  GraduationCap,
  Terminal,
  Cpu,
  Laptop,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Award,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ClubsHierarchyViewProps {
  currentUser: Profile;
  topClubs: Organization[];
  societySubClubs: any[];
  myMemberships: OrganizationMembership[];
  allMemberships: OrganizationMembership[];
  onRefresh: () => void;
}

// Subcomponent: Club-specific Members & Leadership Grid
function ClubMembersGrid({
  members,
  clubTheme,
  canReview,
  onReview,
  loading,
}: {
  members: OrganizationMembership[];
  clubTheme: "indigo" | "amber" | "rose";
  canReview: boolean;
  onReview: (id: string, status: "approved" | "rejected") => void;
  loading: boolean;
}) {
  if (members.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 space-y-2 border border-white/5 rounded-2xl bg-white/[0.02]">
        <Users className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
        <div className="text-xs font-semibold">No registered members found for this club.</div>
      </div>
    );
  }

  const borderHoverClass =
    clubTheme === "indigo"
      ? "hover:border-indigo-400/50 hover:shadow-indigo-500/10"
      : clubTheme === "amber"
      ? "hover:border-amber-400/50 hover:shadow-amber-500/10"
      : "hover:border-rose-400/50 hover:shadow-rose-500/10";

  const titleColorClass =
    clubTheme === "indigo"
      ? "text-indigo-300"
      : clubTheme === "amber"
      ? "text-amber-300"
      : "text-rose-300";

  const avatarGradientClass =
    clubTheme === "indigo"
      ? "from-indigo-600 via-blue-600 to-cyan-400"
      : clubTheme === "amber"
      ? "from-amber-600 via-orange-500 to-yellow-400"
      : "from-rose-600 via-pink-600 to-purple-400";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {members.map((m) => (
        <div
          key={m.id}
          className={`glass-card p-3.5 rounded-2xl border border-white/10 ${borderHoverClass} hover:bg-white/[0.06] hover:shadow-xl transition-all duration-500 ease-out group cursor-default`}
        >
          {/* Always Visible Low-Profile Summary */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${avatarGradientClass} p-[1.5px] shadow-sm shrink-0 overflow-hidden`}
              >
                <div className="w-full h-full bg-[#0a1124] rounded-[9px] flex items-center justify-center text-white text-xs font-black overflow-hidden">
                  {m.userAvatarUrl ? (
                    <img
                      src={m.userAvatarUrl}
                      alt={m.userFullName || "Avatar"}
                      className="w-full h-full object-cover rounded-[9px]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    (m.userFullName || "M")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-white transition-colors duration-300 truncate">
                  {m.userFullName || "Club Member"}
                </div>
                <div className={`text-[11px] font-semibold truncate ${titleColorClass}`}>
                  {m.userTitle || "Member"}
                </div>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shrink-0 ${
                m.status === "approved"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : m.status === "rejected"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}
            >
              {m.status}
            </span>
          </div>

          {/* Member Details: Direct readability on mobile touchscreens */}
          <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono uppercase text-slate-300 font-semibold text-[10px]">
                {m.membershipType} TIER
              </span>
              {m.studentId && (
                <span className="font-mono text-slate-400 text-[10px]">
                  {m.studentId}
                </span>
              )}
            </div>

            {m.userEmail && (
              <div className="text-slate-400 font-mono truncate text-[10px]">
                {m.userEmail}
              </div>
            )}

            {canReview && m.status === "pending" && (
              <div className="flex items-center gap-1.5 pt-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(m.id, "approved");
                  }}
                  disabled={loading}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition flex items-center justify-center gap-1 active:scale-95"
                >
                  <Check className="w-3 h-3" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(m.id, "rejected");
                  }}
                  disabled={loading}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-rose-600/25 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition flex items-center justify-center gap-1 active:scale-95"
                >
                  <X className="w-3 h-3" />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClubsHierarchyView({
  currentUser,
  topClubs,
  myMemberships,
  allMemberships,
  onRefresh,
}: ClubsHierarchyViewProps) {
  // Collapsed by default: all clubs are low-profile and clickable
  const [expandedClubId, setExpandedClubId] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedDomainCode, setSelectedDomainCode] = useState<string>("CP");
  const [membershipType, setMembershipType] = useState<"primary" | "secondary">("primary");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const toggleClub = (id: string) => {
    setExpandedClubId((prev) => (prev === id ? null : id));
  };

  const isStudent = currentUser.role === "member" || currentUser.role === "student";
  const isAdmin =
    currentUser.role === "admin" ||
    currentUser.role === "college_admin" ||
    currentUser.role === "campus_manager";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    shortName: "",
    description: "",
    type: "technical_club" as Organization["type"],
    facultyAdvisorName: "",
    presidentName: "",
    capacity: 100,
    meetingRules: "Every Saturday 10:00 AM",
  });

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.name.trim()) return;
    setLoading(true);
    setMessage(null);
    const res = await createOrganizationAction({
      name: createFormData.name.trim(),
      shortName: createFormData.shortName.trim() || createFormData.name.trim(),
      description: createFormData.description.trim(),
      type: createFormData.type,
      facultyAdvisorName: createFormData.facultyAdvisorName.trim(),
      presidentName: createFormData.presidentName.trim(),
      capacity: Number(createFormData.capacity) || 100,
      meetingRules: createFormData.meetingRules.trim() || "Every Saturday 10:00 AM",
    });
    setLoading(false);
    if (res.success) {
      setMessage({ text: `Club "${createFormData.name}" successfully registered!`, type: "success" });
      setShowCreateModal(false);
      setCreateFormData({
        name: "",
        shortName: "",
        description: "",
        type: "technical_club",
        facultyAdvisorName: "",
        presidentName: "",
        capacity: 100,
        meetingRules: "Every Saturday 10:00 AM",
      });
      onRefresh();
    } else {
      setMessage({ text: res.error || "Failed to register club", type: "error" });
    }
  };

  const canReview =
    currentUser.role === "president" ||
    currentUser.role === "vice_president" ||
    currentUser.role === "lead" ||
    currentUser.role === "admin" ||
    currentUser.role === "student_coordinator" ||
    currentUser.role === "society_admin" ||
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "college_admin";

  const handleRequestMembership = async (orgId: string) => {
    setLoading(true);
    setMessage(null);
    const res = await requestMembershipAction(orgId, membershipType);
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Membership request submitted!", type: "success" });
      setSelectedOrg(null);
      onRefresh();
    } else {
      setMessage({ text: res.error || "Failed to submit request", type: "error" });
    }
  };

  const handleReviewMembership = async (membershipId: string, status: "approved" | "rejected") => {
    setLoading(true);
    const res = await reviewMembershipAction(membershipId, status);
    setLoading(false);
    if (res.success) {
      setMessage({ text: `Membership ${status}!`, type: "success" });
      onRefresh();
    } else {
      setMessage({ text: res.error || "Review failed", type: "error" });
    }
  };

  const nexcell = topClubs.find((o) => o.shortName === "NEX-CELL");
  const kaizen = topClubs.find((o) => o.shortName === "Kaizen Tech");
  const malhar = topClubs.find((o) => o.shortName === "MALHAR");

  const kaizenMembers = allMemberships.filter((m) => m.organizationId === kaizen?.id);
  const nexcellMembers = allMemberships.filter((m) => m.organizationId === nexcell?.id);
  const malharMembers = allMemberships.filter((m) => m.organizationId === malhar?.id);

  return (
    <div className="space-y-6">
      {/* Top Banner / Guidelines */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Campus Organizations</span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Interactive Hub
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any club to explore technical domains, flagship initiatives, cultural departments, and enrolled leadership teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Club</span>
            </button>
          )}

          {isStudent && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] text-indigo-300">
              <span>Policy: Max 2 Primary Memberships</span>
            </div>
          )}
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md border ${
            message.type === "success"
              ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-200 border-rose-500/30"
          }`}
        >
          {message.type === "success" ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          {message.text}
        </motion.div>
      )}

      {/* ========================================================
          1. KAIZEN TECH (Clickable Accordion Card)
         ======================================================== */}
      {kaizen && (
        (() => {
          const isExpanded = expandedClubId === kaizen.id;
          return (
            <div
              className={`glass-panel rounded-3xl transition-all duration-300 border ${
                isExpanded
                  ? "p-5 sm:p-6 border-indigo-500/40 shadow-2xl shadow-indigo-500/5 ring-1 ring-indigo-500/20"
                  : "p-4 sm:p-5 border-white/10 hover:border-indigo-400/40 hover:bg-white/[0.04]"
              }`}
            >
              {/* Clickable Header */}
              <div
                onClick={() => toggleClub(kaizen.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-indigo-200 transition-colors">
                        {kaizen.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        3 Tech Domains
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-cyan-300 border border-blue-400/25">
                        {kaizenMembers.length} Members
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
                      {kaizen.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions & Expand Pill */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  {isStudent && (
                    (() => {
                      const mem = myMemberships.find((m) => m.organizationId === kaizen.id);
                      return mem ? (
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          {mem.membershipType} &bull; {mem.status}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrg(kaizen);
                          }}
                          className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                        >
                          Join Kaizen
                        </button>
                      );
                    })()
                  )}

                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 border ${
                      isExpanded
                        ? "bg-indigo-600/30 text-indigo-200 border-indigo-400/50"
                        : "bg-white/[0.05] text-slate-300 border-white/10 group-hover:bg-white/[0.09] group-hover:text-white"
                    }`}
                  >
                    <span>{isExpanded ? "Close" : "Explore Club & Members"}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="w-4 h-4 text-indigo-400" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Expandable Body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden space-y-6 pt-5 mt-5 border-t border-white/10"
                  >
                    {/* 3 Domain Selector Tabs */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Technical Domains
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {kaizen.units?.map((domain) => {
                          const isSelected = selectedDomainCode === domain.code;
                          return (
                            <motion.button
                              key={domain.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setSelectedDomainCode(domain.code)}
                              className={`p-3.5 rounded-2xl text-left transition border backdrop-blur-md ${
                                isSelected
                                  ? "bg-indigo-600/30 border-indigo-400/60 shadow-lg shadow-indigo-500/10"
                                  : "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  {domain.code === "CP" && <Terminal className="w-4 h-4 text-indigo-400" />}
                                  {domain.code === "WEB" && <Laptop className="w-4 h-4 text-indigo-400" />}
                                  {domain.code === "AI_DS" && <Cpu className="w-4 h-4 text-indigo-400" />}
                                  <span className="font-bold text-xs text-white">{domain.name}</span>
                                </div>
                                <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.2 rounded-full">
                                  {domain.code}
                                </span>
                              </div>
                              {domain.subtitle && (
                                <div className="text-[11px] text-indigo-300/80 font-medium">{domain.subtitle}</div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Domain Deep View (Roadmap & Mentors) */}
                    <AnimatePresence mode="wait">
                      {(() => {
                        const activeDomain =
                          kaizen.units?.find((d) => d.code === selectedDomainCode) || kaizen.units?.[0];
                        if (!activeDomain) return null;

                        return (
                          <motion.div
                            key={activeDomain.code}
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -18 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="glass-card-static rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4"
                          >
                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-black text-base text-white">{activeDomain.name}</h4>
                                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                                    {activeDomain.code}
                                  </span>
                                </div>
                                {activeDomain.subtitle && (
                                  <p className="text-xs text-indigo-300 font-medium mt-0.5">{activeDomain.subtitle}</p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                              {/* Left: 4-Phase Roadmap */}
                              <div className="lg:col-span-7 space-y-3">
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-300">
                                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Roadmap (4 Phases)</span>
                                </div>

                                <div className="space-y-2.5">
                                  {activeDomain.roadmap?.map((phase, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                        {idx + 1}
                                      </div>
                                      <div className="flex-1 glass-card p-2.5 rounded-xl border border-white/10 text-xs">
                                        <span className="font-bold text-white">
                                          {phase.phase}: {phase.title}
                                        </span>
                                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                                          {phase.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right: Domain Leads & Mentors */}
                              <div className="lg:col-span-5 space-y-3">
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-300">
                                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Domain Leads & Mentors</span>
                                </div>

                                <div className="glass-card-static rounded-2xl p-3 border border-white/10 space-y-2 max-h-[380px] overflow-y-auto">
                                  {activeDomain.mentors && activeDomain.mentors.length > 0 ? (
                                    activeDomain.mentors.map((m, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] text-xs border border-white/5"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center text-[10px] font-bold">
                                            {m.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </div>
                                          <div>
                                            <div className="font-bold text-white">{m.name}</div>
                                            <div className="text-[10px] text-slate-400">{m.role}</div>
                                          </div>
                                        </div>
                                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300">
                                          Mentor
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="py-6 text-center text-slate-400 space-y-1 text-xs">
                                      <GraduationCap className="w-6 h-6 mx-auto text-slate-500 opacity-60" />
                                      <div>Mentors currently unassigned.</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>

                    {/* Dedicated Kaizen Tech Leadership & Enrolled Members */}
                    <div className="pt-5 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            Kaizen Tech Leadership & Enrolled Members
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {kaizenMembers.length} Members
                        </span>
                      </div>

                      <ClubMembersGrid
                        members={kaizenMembers}
                        clubTheme="indigo"
                        canReview={canReview}
                        onReview={handleReviewMembership}
                        loading={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()
      )}

      {/* ========================================================
          2. NEX-CELL: Entrepreneurship Club (Clickable Accordion)
         ======================================================== */}
      {nexcell && (
        (() => {
          const isExpanded = expandedClubId === nexcell.id;
          return (
            <div
              className={`glass-panel rounded-3xl transition-all duration-300 border ${
                isExpanded
                  ? "p-5 sm:p-6 border-amber-500/40 shadow-2xl shadow-amber-500/5 ring-1 ring-amber-500/20"
                  : "p-4 sm:p-5 border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04]"
              }`}
            >
              {/* Clickable Header */}
              <div
                onClick={() => toggleClub(nexcell.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-200 transition-colors">
                        {nexcell.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        6 Initiatives
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-cyan-300 border border-blue-400/25">
                        {nexcellMembers.length} Members
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
                      {nexcell.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions & Expand Pill */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  {isStudent && (
                    (() => {
                      const mem = myMemberships.find((m) => m.organizationId === nexcell.id);
                      return mem ? (
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          {mem.membershipType} &bull; {mem.status}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrg(nexcell);
                          }}
                          className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                        >
                          Join NEX-CELL
                        </button>
                      );
                    })()
                  )}

                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 border ${
                      isExpanded
                        ? "bg-amber-600/30 text-amber-200 border-amber-400/50"
                        : "bg-white/[0.05] text-slate-300 border-white/10 group-hover:bg-white/[0.09] group-hover:text-white"
                    }`}
                  >
                    <span>{isExpanded ? "Close" : "Explore Club & Members"}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Expandable Body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden space-y-6 pt-5 mt-5 border-t border-white/10"
                  >
                    {/* 6 Flagship Initiatives Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Flagship Entrepreneurship Tracks
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {nexcell.initiatives?.map((init) => (
                          <div
                            key={init.id}
                            className="glass-card p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.06] transition-all duration-500 ease-out group cursor-default"
                          >
                            <div className="flex items-center justify-between text-sm font-bold text-white">
                              <span className="group-hover:text-amber-300 transition-colors duration-300 truncate pr-2">
                                {init.name}
                              </span>
                              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                                {init.format}
                              </span>
                            </div>
                            {/* Direct Mobile Description */}
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{init.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dedicated NEX-CELL Leadership & Fellows */}
                    <div className="pt-5 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-400" />
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            NEX-CELL Leadership & Student Founders
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {nexcellMembers.length} Members
                        </span>
                      </div>

                      <ClubMembersGrid
                        members={nexcellMembers}
                        clubTheme="amber"
                        canReview={canReview}
                        onReview={handleReviewMembership}
                        loading={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()
      )}

      {/* ========================================================
          3. MALHAR: Cultural Society (Clickable Accordion)
         ======================================================== */}
      {malhar && (
        (() => {
          const isExpanded = expandedClubId === malhar.id;
          return (
            <div
              className={`glass-panel rounded-3xl transition-all duration-300 border ${
                isExpanded
                  ? "p-5 sm:p-6 border-rose-500/40 shadow-2xl shadow-rose-500/5 ring-1 ring-rose-500/20"
                  : "p-4 sm:p-5 border-white/10 hover:border-rose-400/40 hover:bg-white/[0.04]"
              }`}
            >
              {/* Clickable Header */}
              <div
                onClick={() => toggleClub(malhar.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-rose-200 transition-colors">
                        {malhar.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        5 Departments
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-cyan-300 border border-blue-400/25">
                        {malharMembers.length} Members
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
                      {malhar.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions & Expand Pill */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  {isStudent && (
                    (() => {
                      const mem = myMemberships.find((m) => m.organizationId === malhar.id);
                      return mem ? (
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          {mem.membershipType} &bull; {mem.status}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrg(malhar);
                          }}
                          className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                        >
                          Join MALHAR
                        </button>
                      );
                    })()
                  )}

                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 border ${
                      isExpanded
                        ? "bg-rose-600/30 text-rose-200 border-rose-400/50"
                        : "bg-white/[0.05] text-slate-300 border-white/10 group-hover:bg-white/[0.09] group-hover:text-white"
                    }`}
                  >
                    <span>{isExpanded ? "Close" : "Explore Club & Members"}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="w-4 h-4 text-rose-400" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Expandable Body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden space-y-6 pt-5 mt-5 border-t border-white/10"
                  >
                    {/* 5 Departments Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Cultural Departments
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {malhar.units?.map((dept) => (
                          <div
                            key={dept.id}
                            className="glass-card p-4 rounded-2xl border border-white/10 hover:border-rose-400/40 hover:bg-white/[0.06] transition-all duration-500 ease-out group cursor-default"
                          >
                            <div className="flex items-center justify-between text-sm font-bold text-white">
                              <span className="group-hover:text-rose-300 transition-colors duration-300 truncate pr-2">
                                {dept.name}
                              </span>
                              <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30 shrink-0">
                                {dept.code}
                              </span>
                            </div>
                            {/* Direct Mobile Description */}
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{dept.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dedicated MALHAR Core Committee & Department Members */}
                    <div className="pt-5 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-rose-400" />
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            MALHAR Core Committee & Department Members
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          {malharMembers.length} Members
                        </span>
                      </div>

                      <ClubMembersGrid
                        members={malharMembers}
                        clubTheme="rose"
                        canReview={canReview}
                        onReview={handleReviewMembership}
                        loading={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()
      )}

      {/* ========================================================
          4. ADDITIONAL REGISTERED CAMPUS CLUBS
         ======================================================== */}
      {topClubs
        .filter(
          (o) =>
            o.shortName !== "NEX-CELL" &&
            o.shortName !== "Kaizen Tech" &&
            o.shortName !== "MALHAR"
        )
        .map((club) => {
          const isExpanded = expandedClubId === club.id;
          const clubMembers = allMemberships.filter((m) => m.organizationId === club.id);
          return (
            <div
              key={club.id}
              className={`glass-panel rounded-3xl transition-all duration-300 border ${
                isExpanded
                  ? "p-5 sm:p-6 border-cyan-500/40 shadow-2xl shadow-cyan-500/5 ring-1 ring-cyan-500/20"
                  : "p-4 sm:p-5 border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.04]"
              }`}
            >
              <div
                onClick={() => toggleClub(club.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-200 transition-colors">
                        {club.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {club.type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                        {clubMembers.length} Members &bull; Cap: {club.capacity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
                      {club.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  {isStudent && (
                    (() => {
                      const mem = myMemberships.find((m) => m.organizationId === club.id);
                      return mem ? (
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          {mem.membershipType} &bull; {mem.status}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrg(club);
                          }}
                          className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                        >
                          Join Club
                        </button>
                      );
                    })()
                  )}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-6 pt-6 border-t border-white/10 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400">Faculty Advisor:</span>{" "}
                        <span className="text-white font-bold">{club.advisorName || "Faculty Assigned"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400">Meeting Rules:</span>{" "}
                        <span className="text-white font-bold">{club.meetingRules}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-xs font-bold text-white mb-2">Registered Members ({clubMembers.length})</div>
                      <ClubMembersGrid
                        members={clubMembers}
                        clubTheme="indigo"
                        canReview={canReview}
                        onReview={handleReviewMembership}
                        loading={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

      {/* Admin Club Registration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel bg-slate-900/95 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-white/15 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-cyan-400" />
                Register New Campus Club
              </h4>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300">Club Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cypher — Cybersecurity Club"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Short Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cypher"
                    value={createFormData.shortName}
                    onChange={(e) => setCreateFormData({ ...createFormData, shortName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={createFormData.type}
                    onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="technical_club">Technical Club</option>
                    <option value="cultural_society">Cultural Society</option>
                    <option value="entrepreneurship_club">Entrepreneurship Club</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Mission, focus area, and campus activities..."
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Faculty Advisor</label>
                  <input
                    type="text"
                    placeholder="Dr. Sharma"
                    value={createFormData.facultyAdvisorName}
                    onChange={(e) => setCreateFormData({ ...createFormData, facultyAdvisorName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Student Coordinator</label>
                  <input
                    type="text"
                    placeholder="Student Lead"
                    value={createFormData.presidentName}
                    onChange={(e) => setCreateFormData({ ...createFormData, presidentName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Capacity</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={createFormData.capacity}
                    onChange={(e) => setCreateFormData({ ...createFormData, capacity: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Meeting Rules</label>
                  <input
                    type="text"
                    placeholder="Saturdays 2:00 PM"
                    value={createFormData.meetingRules}
                    onChange={(e) => setCreateFormData({ ...createFormData, meetingRules: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow"
                >
                  {loading ? "Registering..." : "Register Club"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Minimal Membership Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel bg-slate-900/90 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-white/15"
          >
            <h4 className="font-bold text-base text-white">
              Join {selectedOrg.name}
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl glass-card cursor-pointer border border-white/10">
                <input
                  type="radio"
                  name="memType"
                  value="primary"
                  checked={membershipType === "primary"}
                  onChange={() => setMembershipType("primary")}
                  className="text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-white">Primary Membership</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl glass-card cursor-pointer border border-white/10">
                <input
                  type="radio"
                  name="memType"
                  value="secondary"
                  checked={membershipType === "secondary"}
                  onChange={() => setMembershipType("secondary")}
                  className="text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-white">Secondary Membership</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrg(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestMembership(selectedOrg.id)}
                disabled={loading}
                className="glass-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold"
              >
                {loading ? "Submitting..." : "Join"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
