"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Club, Profile, ActivityFormat, Team } from "@/types/database";
import { createActivityAction, reviewActivityAction } from "@/actions/activities";
import { createTeamAction, getTeamsAction } from "@/actions/teams";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Plus,
  Send,
  AlertCircle,
  FileText,
  Sparkles,
  Shield,
  Users,
  Download,
  Printer,
  X,
  Award,
} from "lucide-react";

interface ActivityManagementViewProps {
  currentUser: Profile;
  clubs: Club[];
  activities: Activity[];
  onRefresh: () => void;
}

export function ActivityManagementView({
  currentUser,
  clubs,
  activities,
  onRefresh,
}: ActivityManagementViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clubId: currentUser.organizationId || clubs[0]?.id || "",
    title: "",
    topic: "",
    format: "presentation" as ActivityFormat,
    deliverableDescription: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:00",
    venue: "Seminar Hall A",
    submissionDeadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    publishImmediately: ["president", "vice_president", "admin", "college_admin"].includes(currentUser.role),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Event Teams & Registration state
  const [selectedTeamAct, setSelectedTeamAct] = useState<Activity | null>(null);
  const [activityTeams, setActivityTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamMessage, setTeamMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Duty Leave state
  const [dutyLeaveAct, setDutyLeaveAct] = useState<Activity | null>(null);

  const openTeamsModal = async (act: Activity) => {
    setSelectedTeamAct(act);
    setTeamMessage(null);
    setLoadingTeams(true);
    const teams = await getTeamsAction(act.id);
    setActivityTeams(teams);
    setLoadingTeams(false);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamAct || !newTeamName.trim()) return;
    setLoadingTeams(true);
    setTeamMessage(null);
    const res = await createTeamAction(selectedTeamAct.id, newTeamName.trim(), []);
    setLoadingTeams(false);
    if (res.success && res.data) {
      setActivityTeams((prev) => [res.data!, ...prev]);
      setNewTeamName("");
      setTeamMessage({ text: `Team "${res.data.name}" successfully registered!`, type: "success" });
    } else {
      setTeamMessage({ text: res.error || "Failed to register team", type: "error" });
    }
  };

  // Sync default club selection whenever clubs or currentUser changes
  useEffect(() => {
    if (clubs && clubs.length > 0) {
      setFormData((prev) => {
        if (!prev.clubId || !clubs.some((c) => c.id === prev.clubId)) {
          const preferred =
            currentUser.organizationId && clubs.some((c) => c.id === currentUser.organizationId)
              ? currentUser.organizationId
              : clubs[0].id;
          return { ...prev, clubId: preferred };
        }
        return prev;
      });
    }
  }, [clubs, currentUser]);

  const canCreate =
    currentUser.role === "president" ||
    currentUser.role === "vice_president" ||
    currentUser.role === "lead" ||
    currentUser.role === "admin" ||
    currentUser.role === "student_coordinator" ||
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "college_admin";

  const canApprove =
    currentUser.role === "president" ||
    currentUser.role === "vice_president" ||
    currentUser.role === "admin" ||
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "college_admin" ||
    currentUser.role === "campus_manager";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const clubIdToUse = formData.clubId || currentUser.organizationId || clubs[0]?.id;
    if (!clubIdToUse) {
      setLoading(false);
      setMessage({ text: "Please select an organization to host this activity.", type: "error" });
      return;
    }

    let parsedDeadline = new Date(Date.now() + 86400000 * 2).toISOString();
    if (formData.submissionDeadline) {
      const d = new Date(formData.submissionDeadline);
      if (!isNaN(d.getTime())) {
        parsedDeadline = d.toISOString();
      }
    }

    const res = await createActivityAction({
      ...formData,
      clubId: clubIdToUse,
      organizationId: clubIdToUse,
      submissionDeadline: parsedDeadline,
      publishImmediately: Boolean(canApprove && formData.publishImmediately),
    });

    setLoading(false);
    if (res.success && res.data) {
      // Immediately update local storage so it survives container reboots
      try {
        const raw = localStorage.getItem("gitclub_custom_activities_v3");
        const current: Activity[] = raw ? JSON.parse(raw) : [];
        const updated = [res.data, ...current.filter((a) => a.id !== res.data!.id)];
        localStorage.setItem("gitclub_custom_activities_v3", JSON.stringify(updated));
      } catch {}

      setMessage({
        text:
          res.data.status === "approved"
            ? "Activity successfully published live! Members can now check in and submit deliverables."
            : "Activity proposal submitted for leadership review.",
        type: "success",
      });
      setShowForm(false);
      setFormData((prev) => ({
        ...prev,
        title: "",
        topic: "",
        deliverableDescription: "",
      }));
      onRefresh();
    } else {
      setMessage({ text: res.error || "Failed to create activity", type: "error" });
    }
  };

  const handleReview = async (activityId: string, approved: boolean) => {
    setLoading(true);
    const res = await reviewActivityAction(activityId, approved);
    setLoading(false);
    if (res.success && res.data) {
      try {
        const raw = localStorage.getItem("gitclub_custom_activities_v3");
        const current: Activity[] = raw ? JSON.parse(raw) : [];
        const idx = current.findIndex((a) => a.id === activityId);
        if (idx >= 0) {
          current[idx] = {
            ...current[idx],
            status: res.data.status,
            approvedBy: res.data.approvedBy,
            approvedAt: res.data.approvedAt,
          };
        } else {
          current.unshift(res.data);
        }
        localStorage.setItem("gitclub_custom_activities_v3", JSON.stringify(current));
      } catch {}

      setMessage({
        text: `Activity ${approved ? "approved & published live" : "rejected"}!`,
        type: "success",
      });
      onRefresh();
    } else {
      setMessage({ text: res.error || "Review failed", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Activities &amp; Sessions
            </h2>
            {currentUser.role === "member" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>MY CLUB SESSIONS ONLY</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Schedule sessions, coordinate deliverables, and track activity lifecycle.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Plan Activity"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold backdrop-blur-md border ${
              message.type === "success"
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
                : "bg-rose-500/15 text-rose-200 border-rose-500/30"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Activity Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onSubmit={handleCreate}
            className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Activity Details
            </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Host Organization</label>
              <select
                value={formData.clubId}
                onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white backdrop-blur-md focus:border-indigo-400 focus:outline-none"
                required
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Title</label>
              <input
                type="text"
                placeholder="e.g. Club Day 2: Microservices"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Technical Topic</label>
              <input
                type="text"
                placeholder="e.g. Distributed Caching & Redis"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Session Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as ActivityFormat })}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white backdrop-blur-md focus:border-indigo-400 focus:outline-none"
              >
                <option value="presentation" className="bg-slate-900 text-white">PPT Presentation</option>
                <option value="workshop" className="bg-slate-900 text-white">Hands-On Workshop</option>
                <option value="hackathon" className="bg-slate-900 text-white">Mini Hackathon</option>
                <option value="competition" className="bg-slate-900 text-white">Coding Sprint / Competition</option>
                <option value="assignment" className="bg-slate-900 text-white">Assignment / Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Date & Venue</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white focus:border-indigo-400 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue / Lab"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Deadline</label>
              <input
                type="datetime-local"
                value={formData.submissionDeadline}
                onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white focus:border-indigo-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deliverable Instructions</label>
            <textarea
              rows={2}
              placeholder="Specify requirements (e.g. slide deck link, GitHub repo link, or PDF document)..."
              value={formData.deliverableDescription}
              onChange={(e) => setFormData({ ...formData, deliverableDescription: e.target.value })}
              className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
              required
            />
          </div>

          {canApprove && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-400/25">
              <input
                type="checkbox"
                id="publishImmediately"
                checked={formData.publishImmediately}
                onChange={(e) => setFormData({ ...formData, publishImmediately: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-white/20 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="publishImmediately" className="text-xs text-slate-200 cursor-pointer select-none">
                <strong className="text-white">Publish Live Immediately</strong> (Auto-approves session so attendees can check in and submit deliverables right away)
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>
                {loading
                  ? "Publishing..."
                  : formData.publishImmediately
                  ? "Publish Activity Live"
                  : "Submit for Approval"}
              </span>
            </button>
          </div>
        </motion.form>
      )}
      </AnimatePresence>

      {/* Activities Grid (Low Profile by default, details revealed on hover) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activities.length === 0 && (
          <div className="col-span-full p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">No activities available for your club</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Only activities for clubs you are enrolled in are visible here. Join a club above or check back when new sessions are published!
            </p>
          </div>
        )}
        {activities.map((act) => (
          <div
            key={act.id}
            className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-400/50 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 ease-out group cursor-default"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30">
                  {act.clubName}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    act.status === "approved"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : act.status === "submitted_for_approval"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : act.status === "completed"
                      ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {act.status.replace(/_/g, " ")}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-white leading-snug group-hover:text-indigo-200 transition-colors duration-300">
                {act.title}
              </h4>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{act.scheduledDate} &bull; {act.startTime}</span>
              </div>

              {/* Event Details: Directly readable on mobile */}
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                <p className="text-indigo-300 font-medium">
                  Topic: {act.topic}
                </p>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{act.venue}</span>
                </div>
                <div className="p-2.5 rounded-xl glass-card text-slate-300 leading-relaxed text-[11px]">
                  <strong className="text-white">Deliverable:</strong> {act.deliverableDescription}
                </div>
              </div>

              {/* Event Registration & Duty Leave Quick Actions */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openTeamsModal(act)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 transition flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Teams &amp; Registration</span>
                </button>
                {act.status === "approved" && (
                  <button
                    type="button"
                    onClick={() => setDutyLeaveAct(act)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Duty Leave</span>
                  </button>
                )}
              </div>
            </div>

            {/* Leadership Approval Actions */}
            {canApprove && act.status === "submitted_for_approval" && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleReview(act.id, false)}
                  disabled={loading}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview(act.id, true)}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 shadow-sm transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Approve &amp; Make Live</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Event Teams & Registration Modal */}
      {selectedTeamAct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel bg-slate-900/95 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-white/15 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Event Teams &amp; Registration
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                  {selectedTeamAct.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeamAct(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {teamMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                  teamMessage.type === "success"
                    ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-200 border-rose-500/30"
                }`}
              >
                {teamMessage.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{teamMessage.text}</span>
              </div>
            )}

            {/* Team Registration Form */}
            <form onSubmit={handleCreateTeam} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Form &amp; Register a Team</span>
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neural Ninjas, Team Alpha..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loadingTeams}
                  className="glass-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold shadow"
                >
                  {loadingTeams ? "Registering..." : "Register Team"}
                </button>
              </div>
            </form>

            {/* Registered Teams List */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-300">
                Registered Teams ({activityTeams.length})
              </div>
              {activityTeams.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 border border-white/5 rounded-2xl bg-white/[0.02]">
                  No teams registered for this event yet. Be the first to form a team!
                </div>
              ) : (
                <div className="space-y-2">
                  {activityTeams.map((team) => (
                    <div
                      key={team.id}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{team.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Registered
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {team.projectTitle || "Project in development"} &bull; Team Lead: Active Member
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {team.memberUserIds?.length ? `${team.memberUserIds.length + 1} Members` : "Team Active"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Duty Leave Letter Modal */}
      {dutyLeaveAct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel bg-slate-900/95 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-white/15 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Official Duty Leave Endorsement
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mirai School of Technology &bull; Academic Affairs &amp; Co-Curricular Cell
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDutyLeaveAct(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-slate-300 space-y-3 font-sans leading-relaxed">
              <div className="text-center pb-2 border-b border-white/10">
                <div className="font-bold text-sm text-white">MIRAI SCHOOL OF TECHNOLOGY</div>
                <div className="text-[10px] text-slate-400">OFFICE OF STUDENT AFFAIRS &amp; CLUB GOVERNANCE</div>
              </div>

              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
              </p>
              <p>
                <strong>To:</strong> The Campus Manager &amp; Head of Department
              </p>
              <p>
                <strong>Subject:</strong> Sanction of Duty Leave for Approved Campus Activity
              </p>
              <p>
                This is to certify that <strong>{currentUser.fullName}</strong> ({currentUser.studentId || "Verified Student"}), registered in <strong>{dutyLeaveAct.clubName || "Mirai Campus Club"}</strong>, is officially deputed to participate in:
              </p>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div><strong>Event / Session:</strong> {dutyLeaveAct.title}</div>
                <div><strong>Scheduled Date &amp; Time:</strong> {dutyLeaveAct.scheduledDate} ({dutyLeaveAct.startTime} – {dutyLeaveAct.endTime})</div>
                <div><strong>Venue:</strong> {dutyLeaveAct.venue}</div>
                <div><strong>Deliverable:</strong> {dutyLeaveAct.deliverableDescription}</div>
              </div>

              <p>
                Kindly grant duty leave for the aforementioned duration as per institutional co-curricular guidelines.
              </p>

              <div className="pt-4 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                <div>
                  <div className="font-semibold text-white">Faculty Advisor Endorsement</div>
                  <div>MSOT Co-Curricular Governance</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-400">Status: Approved</div>
                  <div>Digital Token Verified</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDutyLeaveAct(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Letter</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
