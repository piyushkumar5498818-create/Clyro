"use client";

import { useState } from "react";
import { Organization, Profile, OrganizationMembership } from "@/types/database";
import { requestMembershipAction, reviewMembershipAction } from "@/actions/memberships";
import {
  Users,
  Building,
  Check,
  X,
  AlertCircle,
  Rocket,
  Code2,
  Palette,
  Layers,
  Sparkles,
  BookOpen,
  GraduationCap,
  Terminal,
  Cpu,
  Laptop,
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

export function ClubsHierarchyView({
  currentUser,
  topClubs,
  myMemberships,
  allMemberships,
  onRefresh,
}: ClubsHierarchyViewProps) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedDomainCode, setSelectedDomainCode] = useState<string>("CP");
  const [membershipType, setMembershipType] = useState<"primary" | "secondary">("primary");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const isStudent = currentUser.role === "member" || currentUser.role === "student";
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

  return (
    <div className="space-y-6">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Campus Organizations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            3 Clubs &bull; 8 Specialized Units
          </p>
        </div>

        {isStudent && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] text-indigo-300">
            <span>Policy: Max 2 Primary Memberships</span>
          </div>
        )}
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

      {/* 1. Kaizen Tech: 3 Technical Domains with Roadmaps & Mentors */}
      {kaizen && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-panel rounded-3xl p-5 sm:p-6 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">{kaizen.name}</h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    3 Tech Domains
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{kaizen.description}</p>
              </div>
            </div>

            <div className="shrink-0">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === kaizen.id);
                  return mem ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {mem.membershipType} &bull; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(kaizen)}
                      className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                    >
                      Join Kaizen Tech
                    </button>
                  );
                })()
              )}
            </div>
          </div>

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

          {/* Selected Domain Deep View (Roadmap & Mentors) with Swipe Transition */}
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
                        <span>Leads & Mentors</span>
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
        </motion.div>
      )}

      {/* 2. NEX-CELL: Entrepreneurship Club */}
      {nexcell && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">{nexcell.name}</h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    6 Initiatives
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{nexcell.description}</p>
              </div>
            </div>

            <div className="shrink-0">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === nexcell.id);
                  return mem ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {mem.membershipType} &bull; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(nexcell)}
                      className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                    >
                      Join NEX-CELL
                    </button>
                  );
                })()
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {nexcell.initiatives?.map((init) => (
              <motion.div
                key={init.id}
                whileHover={{ scale: 1.03, y: -3, transition: { type: "spring", stiffness: 450, damping: 20 } }}
                className="glass-card p-3.5 rounded-2xl border border-white/10 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span>{init.name}</span>
                  <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    {init.format}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{init.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. MALHAR: Cultural Society */}
      {malhar && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-400 flex items-center justify-center shrink-0">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">{malhar.name}</h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    5 Departments
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{malhar.description}</p>
              </div>
            </div>

            <div className="shrink-0">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === malhar.id);
                  return mem ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {mem.membershipType} &bull; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(malhar)}
                      className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                    >
                      Join MALHAR
                    </button>
                  );
                })()
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {malhar.units?.map((dept) => (
              <motion.div
                key={dept.id}
                whileHover={{ scale: 1.03, y: -3, transition: { type: "spring", stiffness: 450, damping: 20 } }}
                className="glass-card p-3.5 rounded-2xl border border-white/10 hover:border-rose-400/40 hover:shadow-lg hover:shadow-rose-500/10 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span>{dept.name}</span>
                  <span className="text-[10px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full">
                    {dept.code}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Member Section with 3D Pop Out from Back Animations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.8 }}
        style={{ transformPerspective: 1200, willChange: "transform, opacity" }}
        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-cyan-400" />
              Student Members &amp; Enrolment Queue
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Active verified students across NEX-CELL, Kaizen Tech, and MALHAR.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-blue-500/15 text-cyan-300 text-xs font-mono font-bold border border-blue-400/30">
              {allMemberships.length} ENROLLED RECORDS
            </span>
          </div>
        </div>

        {/* Member Cards Grid with 3D Pop-In Staggered Entrance */}
        {allMemberships.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
            <div className="text-sm font-semibold">No membership records found.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allMemberships.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                whileHover={{ scale: 1.025, y: -4, transition: { type: "spring", stiffness: 450, damping: 20 } }}
                transition={{
                  type: "spring",
                  stiffness: 85,
                  damping: 15,
                  mass: 0.85,
                  delay: Math.min(idx * 0.05, 0.3),
                }}
                style={{ transformPerspective: 1000 }}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between gap-4 border border-white/10 hover:border-blue-400/40 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-blue-500/10 transition-all group cursor-default"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-[1.5px] shadow-md shrink-0">
                        <div className="w-full h-full bg-[#0a1124] rounded-[14px] flex items-center justify-center text-white text-sm font-black">
                          {m.userFullName?.charAt(0) || "M"}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-bold text-white group-hover:text-blue-300 transition truncate">
                          {m.userFullName || "Student Member"}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                          {m.organizationName}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase border shrink-0 ${
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

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                    <span className="font-mono text-cyan-300 font-semibold uppercase px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-400/20">
                      {m.membershipType} TIER
                    </span>
                    <span className="text-slate-400 text-xs">
                      Joined {new Date(m.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {canReview && m.status === "pending" && (
                  <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => handleReviewMembership(m.id, "approved")}
                      disabled={loading}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReviewMembership(m.id, "rejected")}
                      disabled={loading}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600/25 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

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
