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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Mirai Campus Organizations & Units
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            3 Primary Organizations &middot; 6 Technical Domains &middot; 5 Cultural Departments &middot; 6 Venture Initiatives
          </p>
        </div>

        {isStudent && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl text-xs">
            <span className="font-semibold text-indigo-900">Institutional Policy:</span>
            <span className="text-indigo-700">Max 2 Primary Organizations</span>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          {message.text}
        </div>
      )}

      {/* 1. NEX-CELL: Entrepreneurship Club */}
      {nexcell && (
        <div className="p-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-b from-amber-50/20 via-white to-white shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{nexcell.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    Entrepreneurship
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl">{nexcell.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === nexcell.id);
                  return mem ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                      {mem.membershipType} &middot; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(nexcell)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition"
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
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Flagship Venture Initiatives (6 Recurring Programmes)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {nexcell.initiatives?.map((init) => (
                <div key={init.id} className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/30">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{init.name}</span>
                    <span className="font-mono text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {init.format}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{init.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Kaizen Tech: Technical Club */}
      {kaizen && (
        <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/20 via-white to-white shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{kaizen.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                    Technical
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl">{kaizen.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === kaizen.id);
                  return mem ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                      {mem.membershipType} &middot; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(kaizen)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
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
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Configured Technical Domains (6 Specialized Tracks)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {kaizen.units?.map((domain) => (
                <div key={domain.id} className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{domain.name}</span>
                    <span className="font-mono text-[10px] text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                      {domain.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{domain.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MALHAR: Cultural Society */}
      {malhar && (
        <div className="p-6 rounded-2xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/20 via-white to-white shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{malhar.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900">
                    Cultural Society
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl">{malhar.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isStudent && (
                (() => {
                  const mem = myMemberships.find((m) => m.organizationId === malhar.id);
                  return mem ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                      {mem.membershipType} &middot; {mem.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrg(malhar)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
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
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Operating Departments (5 Specialized Production Units)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {malhar.units?.map((dept) => (
                <div key={dept.id} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{dept.name}</span>
                    <span className="font-mono text-[10px] text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      {dept.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Membership Review Section (Coordinators, Advisors, Admins) */}
      {canReview && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Organization Membership Queue ({allMemberships.length})
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Authorized Review
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Organization</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allMemberships.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {m.userFullName} ({m.studentId || "Student"})
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-bold">{m.organizationName}</td>
                    <td className="py-2.5 px-3 font-semibold uppercase text-indigo-700">{m.membershipType}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : m.status === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(m.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {m.status === "pending" && (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleReviewMembership(m.id, "approved")}
                            disabled={loading}
                            className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReviewMembership(m.id, "rejected")}
                            disabled={loading}
                            className="p-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-black text-lg text-slate-900">
              Join {selectedOrg.name}
            </h4>
            <p className="text-xs text-slate-600">
              Select your membership tier for this organization. Mirai policy allows students to join up to 2 primary organizations.
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="memType"
                  value="primary"
                  checked={membershipType === "primary"}
                  onChange={() => setMembershipType("primary")}
                  className="text-indigo-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Primary Membership</div>
                  <div className="text-[11px] text-slate-500">Core commitment, voting, and leadership eligibility.</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="memType"
                  value="secondary"
                  checked={membershipType === "secondary"}
                  onChange={() => setMembershipType("secondary")}
                  className="text-indigo-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Secondary Membership</div>
                  <div className="text-[11px] text-slate-500">Cross-domain participation and club day attendance.</div>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestMembership(selectedOrg.id)}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
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
