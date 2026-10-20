"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Club, Profile, ActivityFormat } from "@/types/database";
import { createActivityAction, reviewActivityAction } from "@/actions/activities";
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
    clubId: clubs[0]?.id || "",
    title: "",
    topic: "",
    format: "presentation" as ActivityFormat,
    deliverableDescription: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:00",
    venue: "Seminar Hall A",
    submissionDeadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

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
    const res = await createActivityAction({
      ...formData,
      submissionDeadline: new Date(formData.submissionDeadline).toISOString(),
    });
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Activity scheduled successfully! Pending leadership review.", type: "success" });
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
    if (res.success) {
      setMessage({ text: `Activity ${approved ? "approved" : "rejected"}!`, type: "success" });
      onRefresh();
    } else {
      setMessage({ text: res.error || "Review failed", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Activities & Sessions
          </h2>
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
              className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              {loading ? "Publishing..." : "Publish Activity"}
            </button>
          </div>
        </motion.form>
      )}
      </AnimatePresence>

      {/* Activities Grid (Low Profile by default, details revealed on hover) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 shadow-sm transition"
                >
                  Approve Plan
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
