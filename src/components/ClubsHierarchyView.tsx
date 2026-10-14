"use client";

import { useState } from "react";
import { Club, Profile, ClubMembership } from "@/types/database";
import { requestMembershipAction, reviewMembershipAction } from "@/actions/memberships";
import {
  Users,
  Building,
  Shield,
  Layers,
  Check,
  X,
  AlertCircle,
  PlusCircle,
  ChevronRight,
} from "lucide-react";

interface ClubsHierarchyViewProps {
  currentUser: Profile;
  topClubs: Club[];
  societySubClubs: Club[];
  myMemberships: ClubMembership[];
  allMemberships: ClubMembership[];
  onRefresh: () => void;
}

export function ClubsHierarchyView({
  currentUser,
  topClubs,
  societySubClubs,
  myMemberships,
  allMemberships,
  onRefresh,
}: ClubsHierarchyViewProps) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [membershipType, setMembershipType] = useState<"primary" | "secondary">("primary");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const isStudent = currentUser.role === "student";
  const isCoordinator = currentUser.role === "student_coordinator";
  const isAdvisor = currentUser.role === "faculty_advisor";
  const isAdmin = currentUser.role === "college_admin" || currentUser.role === "campus_manager";

  const handleRequestMembership = async (clubId: string) => {
    setLoading(true);
    setMessage(null);
    const res = await requestMembershipAction(clubId, membershipType);
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Membership request submitted successfully!", type: "success" });
      setSelectedClub(null);
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

  const society = topClubs.find((c) => c.isSociety);
  const independentClubs = topClubs.filter((c) => !c.isSociety);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            College Club Hierarchy & Registry
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            4 Top-Level Organizations &middot; 1 Apex Society &middot; 4 Dedicated Sub-Clubs
          </p>
        </div>

        {/* Student Membership Summary Pill */}
        {isStudent && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl text-xs">
            <span className="font-semibold text-indigo-900">Enrolment Limits:</span>
            <span className="text-indigo-700">Max 1 Primary + 1 Secondary</span>
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

      {/* Top-Level Independent Clubs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-lg text-slate-900">
            Top-Level Independent Clubs (3)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {independentClubs.map((club) => {
            const myMem = myMemberships.find((m) => m.clubId === club.id);
            return (
              <div
                key={club.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-indigo-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border">
                      {club.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Cap: {club.capacity}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 leading-snug">
                    {club.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {club.description}
                  </p>
                  <div className="mt-3 text-[11px] text-slate-500 space-y-1 border-t pt-2.5">
                    <div><strong>Rules:</strong> {club.meetingRules}</div>
                    <div><strong>Advisor:</strong> {club.advisorName || "Faculty Assigned"}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  {isStudent && (
                    myMem ? (
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        myMem.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {myMem.membershipType.toUpperCase()} &middot; {myMem.status.toUpperCase()}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedClub(club)}
                        className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition"
                      >
                        Join Club
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Apex Society with Nested Sub-Clubs */}
      {society && (
        <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                Apex Parent Organization
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {society.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                {society.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Sub-Clubs Governed</div>
                <div className="text-lg font-black text-indigo-700">4 Wings</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-700">
                Governed Sub-Clubs (4 Managed Independently)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {societySubClubs.map((subClub) => {
                const myMem = myMemberships.find((m) => m.clubId === subClub.id);
                return (
                  <div
                    key={subClub.id}
                    className="p-4 rounded-xl border border-indigo-100 bg-white hover:border-indigo-400 shadow-xs flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          Parent: Society
                        </span>
                        <span className="text-slate-400 font-medium">Cap: {subClub.capacity}</span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-900">{subClub.name}</h5>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-3">
                        {subClub.description}
                      </p>
                      <div className="text-[11px] text-slate-500 mt-2 border-t pt-2">
                        <strong>Meeting:</strong> {subClub.meetingRules}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t">
                      {isStudent && (
                        myMem ? (
                          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-md ${
                            myMem.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {myMem.membershipType.toUpperCase()} &middot; {myMem.status.toUpperCase()}
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedClub(subClub)}
                            className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs"
                          >
                            Join Sub-Club
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Coordinator Membership Approval Section */}
      {(isCoordinator || isAdvisor || isAdmin) && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Membership Requests & Enrolment Management
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {allMemberships.length} Enrolled / Pending Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Club / Sub-Club</th>
                  <th className="py-2.5 px-3">Type</th>
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
                    <td className="py-2.5 px-3 text-slate-700">{m.clubName}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-indigo-700 uppercase">
                        {m.membershipType}
                      </span>
                    </td>
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
                            className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReviewMembership(m.id, "rejected")}
                            disabled={loading}
                            className="p-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100"
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
      {selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-black text-lg text-slate-900">
              Join {selectedClub.name}
            </h4>
            <p className="text-xs text-slate-600">
              Select your membership tier for this organization. You can join at most 1 primary club and 1 secondary club across the campus.
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
                onClick={() => setSelectedClub(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestMembership(selectedClub.id)}
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
