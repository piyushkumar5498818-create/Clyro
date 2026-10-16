"use client";

import { useState } from "react";
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
    currentUser.role === "student_coordinator" ||
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "college_admin";

  const canApprove =
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
      setMessage({ text: "Activity created and submitted for advisor review!", type: "success" });
      setShowForm(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Club Day Activity Management
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Weekly 7-Day Planning &middot; Faculty Review &middot; Deliverable Guidelines
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Close Form" : "Plan New Club Day Activity"}
          </button>
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
          {message.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          {message.text}
        </div>
      )}

      {/* Plan Activity Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/30 shadow-md space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Activity Planning Form (7 Days Prior)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Host Organization</label>
              <select
                value={formData.clubId}
                onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                required
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Title</label>
              <input
                type="text"
                placeholder="e.g. Club Day 2: Microservices"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Topic</label>
              <input
                type="text"
                placeholder="e.g. Distributed Caching & Redis"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as ActivityFormat })}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
              >
                <option value="presentation">PPT Presentation</option>
                <option value="workshop">Hands-On Workshop</option>
                <option value="hackathon">Mini Hackathon</option>
                <option value="competition">Coding Sprint / Competition</option>
                <option value="assignment">Assignment / Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date & Venue</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue / Lab"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
              <input
                type="datetime-local"
                value={formData.submissionDeadline}
                onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deliverable Instructions</label>
            <textarea
              rows={2}
              placeholder="Specify requirements (e.g. slide deck link, GitHub repo link, or PDF document)..."
              value={formData.deliverableDescription}
              onChange={(e) => setFormData({ ...formData, deliverableDescription: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              {loading ? "Submitting..." : "Submit to Faculty Advisor"}
            </button>
          </div>
        </form>
      )}

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((act) => (
          <div
            key={act.id}
            className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-indigo-300 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {act.clubName}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    act.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : act.status === "submitted_for_approval"
                      ? "bg-amber-100 text-amber-800"
                      : act.status === "completed"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {act.status.replace(/_/g, " ")}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                {act.title}
              </h4>
              <p className="text-xs font-semibold text-indigo-600 mt-1">
                Topic: {act.topic}
              </p>

              <div className="mt-3 text-xs text-slate-600 space-y-1.5 border-t pt-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{act.scheduledDate} ({act.startTime} - {act.endTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{act.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deadline: {new Date(act.submissionDeadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 border">
                <strong>Deliverable:</strong> {act.deliverableDescription}
              </div>
            </div>

            {/* Advisor Approval Actions */}
            {canApprove && act.status === "submitted_for_approval" && (
              <div className="mt-4 pt-3 border-t flex items-center justify-end gap-2">
                <button
                  onClick={() => handleReview(act.id, false)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview(act.id, true)}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
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
