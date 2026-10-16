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
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

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
  const [membershipType, setMembershipType] = useState<"primary" | "secondary">("primary");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const isStudent = currentUser.role === "student";
  const canReview =
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
      setMessage({ text: "Membership request submitted for advisor/coordinator review!", type: "success" });
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Mirai Campus Organizations & Units
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            3 Primary Organizations &middot; 6 Technical Domains &middot; 5 Cultural Departments &middot; 6 Venture Initiatives
          </p>
        </div>

        {isStudent && (
          <div className="flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/30 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md">
            <span className="font-semibold text-indigo-300">Institutional Policy:</span>
            <span className="text-indigo-200">Max 2 Primary Organizations</span>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold backdrop-blur-md border ${
            message.type === "success"
              ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-200 border-rose-500/30"
          }`}
        >
          {message.type === "success" ? <Check className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          {message.text}
        </div>
      )}

      {/* 1. NEX-CELL: Entrepreneurship Club */}
      {nexcell && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                <Rocket className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{nexcell.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Entrepreneurship
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">{nexcell.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === nexcell.id);
                  return mem ? (
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {mem.membershipType} &middot; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(nexcell)}
                      className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
                    >
                      Join NEX-CELL
                    </button>
                  );
                })()
              )}
            </div>
          </div>

          {/* NEX-CELL 6 Flagship Initiatives */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Flagship Venture Initiatives (6 Recurring Programmes)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {nexcell.initiatives?.map((init) => (
                <div key={init.id} className="glass-card p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{init.name}</span>
                    <span className="font-mono text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {init.format}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{init.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Kaizen Tech: Technical Club */}
      {kaizen && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/10">
                <Code2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{kaizen.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Technical
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">{kaizen.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === kaizen.id);
                  return mem ? (
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {mem.membershipType} &middot; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(kaizen)}
                      className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
                    >
                      Join Kaizen Tech
                    </button>
                  );
                })()
              )}
            </div>
          </div>

          {/* Kaizen Tech 6 Technical Domains */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Configured Technical Domains (6 Specialized Tracks)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {kaizen.units?.map((domain) => (
                <div key={domain.id} className="glass-card p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{domain.name}</span>
                    <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      {domain.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{domain.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MALHAR: Cultural Society */}
      {malhar && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
                <Palette className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{malhar.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Cultural Society
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">{malhar.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === malhar.id);
                  return mem ? (
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {mem.membershipType} &middot; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(malhar)}
                      className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
                    >
                      Join MALHAR
                    </button>
                  );
                })()
              )}
            </div>
          </div>

          {/* MALHAR 5 Departments */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Building className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Operating Departments (5 Specialized Production Units)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {malhar.units?.map((dept) => (
                <div key={dept.id} className="glass-card p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{dept.name}</span>
                    <span className="font-mono text-[10px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                      {dept.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Membership Review Section (Coordinators, Advisors, Admins) */}
      {canReview && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Organization Membership Queue ({allMemberships.length})
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
              Authorized Review
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-300 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Organization</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allMemberships.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.04] transition">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {m.userFullName} ({m.studentId || "Student"})
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-bold">{m.organizationName}</td>
                    <td className="py-2.5 px-3 font-semibold uppercase text-indigo-300">{m.membershipType}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        m.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : m.status === "rejected"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(m.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {m.status === "pending" && (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleReviewMembership(m.id, "approved")}
                            disabled={loading}
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReviewMembership(m.id, "rejected")}
                            disabled={loading}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Membership Request Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900/90 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-white/15">
            <h4 className="font-black text-lg text-white">
              Join {selectedOrg.name}
            </h4>
            <p className="text-xs text-slate-300">
              Select your membership tier for this organization. Mirai policy allows students to join up to 2 primary organizations.
            </p>

            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl glass-card cursor-pointer border border-white/10 hover:border-indigo-400/40">
                <input
                  type="radio"
                  name="memType"
                  value="primary"
                  checked={membershipType === "primary"}
                  onChange={() => setMembershipType("primary")}
                  className="text-indigo-500 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-bold text-white">Primary Membership</div>
                  <div className="text-[11px] text-slate-400">Core commitment, voting, and leadership eligibility.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl glass-card cursor-pointer border border-white/10 hover:border-indigo-400/40">
                <input
                  type="radio"
                  name="memType"
                  value="secondary"
                  checked={membershipType === "secondary"}
                  onChange={() => setMembershipType("secondary")}
                  className="text-indigo-500 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-bold text-white">Secondary Membership</div>
                  <div className="text-[11px] text-slate-400">Cross-domain participation and club day attendance.</div>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-3">
              <button
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestMembership(selectedOrg.id)}
                disabled={loading}
                className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
