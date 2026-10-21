"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Profile, Submission, Evaluation } from "@/types/database";
import { submitWorkAction, getSubmissionsAction } from "@/actions/submissions";
import { evaluateSubmissionAction } from "@/actions/evaluations";
import {
  FileText,
  ExternalLink,
  Award,
  CheckCircle,
  AlertCircle,
  Upload,
  MessageSquare,
  Star,
  Clock,
  Sparkles,
  Shield,
} from "lucide-react";

interface SubmissionsViewProps {
  currentUser: Profile;
  activities: Activity[];
  submissions: Submission[];
  onRefresh: () => void;
}

export function SubmissionsView({
  currentUser,
  activities,
  submissions,
  onRefresh,
}: SubmissionsViewProps) {
  const approvedActivities = activities.filter((a) => a.status === "approved");
  const [selectedActId, setSelectedActId] = useState(approvedActivities[0]?.id || "");
  const [submissionType, setSubmissionType] = useState<"link" | "file">("link");
  const [linkUrl, setLinkUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Sync selectedActId when approvedActivities loads or changes
  useEffect(() => {
    if (approvedActivities.length === 0) return;
    const isValid = approvedActivities.some((a) => a.id === selectedActId);
    if (!selectedActId || !isValid) {
      // Prefer an activity that the current user has NOT submitted yet
      const unsubmitted = approvedActivities.find(
        (a) => !submissions.some((s) => s.activityId === a.id && s.userId === currentUser.id)
      );
      setSelectedActId(unsubmitted ? unsubmitted.id : approvedActivities[0].id);
    }
  }, [activities, submissions, currentUser.id, selectedActId, approvedActivities]);

  // Current activity and submission state
  const selectedActivity = approvedActivities.find((a) => a.id === selectedActId);
  const mySubmissionForSelectedAct = submissions.find(
    (s) => s.activityId === selectedActId && s.userId === currentUser.id
  );

  // Dynamic evaluation state
  const [evaluatingSub, setEvaluatingSub] = useState<Submission | null>(null);
  const [evalItems, setEvalItems] = useState<{
    name: string;
    maxScore: number;
    score: number;
    description?: string;
  }[]>([]);
  const [evalFeedback, setEvalFeedback] = useState<string>("");

  const canSubmit = [
    "member",
    "student",
    "lead",
    "unit_lead",
    "president",
    "vice_president",
    "admin",
    "student_coordinator",
  ].includes(currentUser.role);

  const canEvaluate = [
    "president",
    "vice_president",
    "lead",
    "admin",
    "faculty_advisor",
    "student_coordinator",
    "college_admin",
  ].includes(currentUser.role);

  const openEvaluationModal = (sub: Submission) => {
    setEvaluatingSub(sub);
    const targetAct = activities.find((a) => a.id === sub.activityId);

    if (sub.evaluation?.scoreBreakdown && sub.evaluation.scoreBreakdown.length > 0) {
      setEvalItems(
        sub.evaluation.scoreBreakdown.map((b) => ({
          name: b.criteriaName,
          maxScore: b.maxScore || 40,
          score: b.score,
        }))
      );
      setEvalFeedback(sub.evaluation.feedback || "");
    } else if (targetAct?.rubricCriteria && targetAct.rubricCriteria.length > 0) {
      setEvalItems(
        targetAct.rubricCriteria.map((c) => ({
          name: c.name,
          maxScore: c.maxScore,
          score: Math.round(c.maxScore * 0.85),
          description: c.description,
        }))
      );
      setEvalFeedback("");
    } else {
      setEvalItems([
        { name: "Content & Technical Depth", maxScore: 40, score: 35, description: "Depth of execution and deliverable quality." },
        { name: "Presentation & Clarity", maxScore: 30, score: 25, description: "Clarity of demonstration and documentation." },
        { name: "Participation & Timeliness", maxScore: 30, score: 25, description: "Attendance adherence and discussion engagement." },
      ]);
      setEvalFeedback("");
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActId) {
      setMessage({ text: "Please select an activity to submit for.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await submitWorkAction(selectedActId, submissionType, {
      linkUrl,
      notes,
    });
    setLoading(false);
    if (res.success && res.data) {
      try {
        const raw = localStorage.getItem("gitclub_custom_submissions_v2");
        const current: Submission[] = raw ? JSON.parse(raw) : [];
        const updated = [res.data, ...current.filter((s) => s.id !== res.data!.id)];
        localStorage.setItem("gitclub_custom_submissions_v2", JSON.stringify(updated));
      } catch {}

      setMessage({ text: "Deliverable successfully submitted and recorded on the campus ledger!", type: "success" });
      setLinkUrl("");
      setNotes("");
      onRefresh();
    } else {
      setMessage({ text: res.error || "Submission failed", type: "error" });
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingSub) return;
    setLoading(true);
    setMessage(null);

    const breakdown = evalItems.map((item) => ({
      criteriaName: item.name,
      score: Number(item.score) || 0,
      maxScore: item.maxScore,
    }));

    const res = await evaluateSubmissionAction(evaluatingSub.id, {
      breakdown,
      feedback: evalFeedback,
      scoreContent: evalItems[0]?.score,
      scorePresentation: evalItems[1]?.score,
      scoreParticipation: evalItems[2]?.score,
    });

    setLoading(false);
    if (res.success && res.data) {
      try {
        const raw = localStorage.getItem("gitclub_custom_evaluations_v2");
        const current: Evaluation[] = raw ? JSON.parse(raw) : [];
        const updated = [
          res.data,
          ...current.filter((e) => e.submissionId !== res.data!.submissionId && e.id !== res.data!.id),
        ];
        localStorage.setItem("gitclub_custom_evaluations_v2", JSON.stringify(updated));
      } catch {}

      setMessage({
        text: `Rubric evaluation saved (${res.data.totalScore}/100) and recorded on ledger!`,
        type: "success",
      });
      setEvaluatingSub(null);
      onRefresh();
    } else {
      setMessage({ text: res.error || "Evaluation failed", type: "error" });
    }
  };

  const currentTotalScore = evalItems.reduce(
    (acc, curr) => acc + (Number(curr.score) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Upload className="w-6 h-6 text-indigo-400" />
              Deliverables &amp; Evaluation
            </h2>
            {currentUser.role !== "admin" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>MY CLUB SESSIONS ONLY</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Submit verified project deliverables, review evaluation rubrics, and track scores.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold backdrop-blur-md border ${
              message.type === "success"
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
                : "bg-rose-500/15 text-rose-200 border-rose-500/30"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deliverable Section (Submission Form or Existing Submission Status) */}
      {canSubmit && (
        <>
          {approvedActivities.length === 0 ? (
            <div className="glass-panel rounded-3xl p-6 text-center space-y-2 border border-white/10">
              <Clock className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Open Activities</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are currently no approved activities accepting project deliverables.
              </p>
            </div>
          ) : mySubmissionForSelectedAct ? (
            /* Already Submitted Status Card */
            <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-4 border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base text-white">
                        Deliverable Submitted
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-black">
                        Recorded on Ledger
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {selectedActivity?.title}
                    </p>
                  </div>
                </div>

                {/* Activity Switcher */}
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Select Activity
                  </label>
                  <select
                    value={selectedActId}
                    onChange={(e) => {
                      setSelectedActId(e.target.value);
                      setMessage(null);
                    }}
                    className="w-full sm:w-auto text-xs rounded-xl border border-white/15 p-2 bg-slate-900/90 text-white focus:border-indigo-400 focus:outline-none"
                  >
                    {approvedActivities.map((a) => {
                      const isSubmitted = submissions.some(
                        (s) => s.activityId === a.id && s.userId === currentUser.id
                      );
                      return (
                        <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                          {a.title} {isSubmitted ? "✓ [Submitted]" : "[Open for Submission]"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Submission Asset
                  </div>
                  {mySubmissionForSelectedAct.linkUrl ? (
                    <a
                      href={mySubmissionForSelectedAct.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold underline break-all"
                    >
                      <span>{mySubmissionForSelectedAct.linkUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-300 font-medium">Uploaded file deliverable</span>
                  )}

                  {mySubmissionForSelectedAct.notes && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase mb-0.5">
                        Notes:
                      </span>
                      <p className="text-slate-200 italic">&ldquo;{mySubmissionForSelectedAct.notes}&rdquo;</p>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 font-mono pt-1">
                    Submitted: {new Date(mySubmissionForSelectedAct.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Evaluation & Rubric Score
                  </div>
                  {mySubmissionForSelectedAct.evaluation ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>Score: {mySubmissionForSelectedAct.evaluation.totalScore} / 100</span>
                      </div>
                      {mySubmissionForSelectedAct.evaluation.feedback && (
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-200">
                          <span className="text-[10px] text-indigo-300 font-bold uppercase block mb-0.5">
                            Evaluator Feedback:
                          </span>
                          &ldquo;{mySubmissionForSelectedAct.evaluation.feedback}&rdquo;
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 py-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Evaluation
                      </span>
                      <p className="text-[11px] text-slate-400 pt-1">
                        Your deliverable has been recorded. Activity mentors and leads will grade it using the standard rubric.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>
                  One deliverable per activity is accepted. To submit for a different activity, pick an open one from the dropdown above.
                </span>
              </div>
            </div>
          ) : (
            /* Open Submission Form */
            <form onSubmit={handleSubmitWork} className="glass-panel rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Submit Deliverable
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-bold">
                  Open for Submission
                </span>
              </div>

              {/* Requirement prompt banner */}
              {selectedActivity?.deliverableDescription && (
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Deliverable Requirement:
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    {selectedActivity.deliverableDescription}
                  </p>
                  {selectedActivity.submissionDeadline && (
                    <div className="text-[10px] text-indigo-300 font-mono pt-1">
                      Deadline: {new Date(selectedActivity.submissionDeadline).toLocaleDateString()} at{" "}
                      {new Date(selectedActivity.submissionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Activity
                  </label>
                  <select
                    value={selectedActId}
                    onChange={(e) => {
                      setSelectedActId(e.target.value);
                      setMessage(null);
                    }}
                    className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white backdrop-blur-md focus:border-indigo-400 focus:outline-none"
                    required
                  >
                    {approvedActivities.map((a) => {
                      const isSubmitted = submissions.some(
                        (s) => s.activityId === a.id && s.userId === currentUser.id
                      );
                      return (
                        <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                          {a.title} {isSubmitted ? "✓ [Submitted]" : "[Open for Submission]"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Link / Repository URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/... or https://pitch.com/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Submission Notes &amp; Highlights (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Key architectural choices, test coverage, or live deployment URL..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto glass-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {loading ? "Submitting Deliverable..." : "Submit Deliverable"}
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* Submissions Roster */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Submitted Deliverables ({submissions.length})
          </h3>
        </div>

        {submissions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No student deliverables submitted yet.
          </div>
        ) : (
          <>
            {/* Mobile Cards List (Mobile Phones) */}
            <div className="block md:hidden space-y-3">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm">{s.userFullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.studentId}</div>
                    </div>
                    <div>
                      {s.evaluation ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <Award className="w-3 h-3 text-emerald-400" />
                          {s.evaluation.totalScore}/100
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-slate-300 font-medium">
                    {s.activityTitle}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                    {s.linkUrl ? (
                      <a
                        href={s.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Deliverable Link <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Uploaded file</span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(s.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {canEvaluate && (
                    <div className="pt-2">
                      <button
                        onClick={() => openEvaluationModal(s)}
                        className="w-full glass-btn-secondary py-2 rounded-xl font-semibold text-xs text-center"
                      >
                        {s.evaluation ? "Update Rubric" : "Grade Rubric"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table (Desktop Viewport) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Activity</th>
                    <th className="py-2.5 px-3">Deliverable Link</th>
                    <th className="py-2.5 px-3">Submitted At</th>
                    <th className="py-2.5 px-3">Rubric Score</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.04] transition">
                      <td className="py-2.5 px-3 font-bold text-white">
                        {s.userFullName}
                        <div className="text-[10px] text-slate-400 font-mono">{s.studentId}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{s.activityTitle}</td>
                      <td className="py-2.5 px-3">
                        {s.linkUrl ? (
                          <a
                            href={s.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition"
                          >
                            View Deliverable <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">File uploaded</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3">
                        {s.evaluation ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            {s.evaluation.totalScore}/100
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Pending Evaluation
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {canEvaluate && (
                          <button
                            onClick={() => openEvaluationModal(s)}
                            className="glass-btn-secondary px-3 py-1.5 rounded-xl font-semibold text-xs transition"
                          >
                            {s.evaluation ? "Update Rubric" : "Grade Rubric"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Rubric Evaluation Modal */}
      <AnimatePresence>
        {evaluatingSub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleEvaluate}
              className="glass-panel bg-slate-900/95 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl space-y-4 border border-white/15"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="font-black text-sm sm:text-base text-white">
                    Rubric Scoring: {evaluatingSub.userFullName}
                  </h4>
                  <p className="text-xs text-slate-400">{evaluatingSub.activityTitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Score</div>
                  <div className="text-xl font-black text-indigo-400">
                    {currentTotalScore}/100
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                {evalItems.map((item, idx) => (
                  <div
                    key={item.name + idx}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white">
                          {idx + 1}. {item.name}
                        </div>
                        {item.description && (
                          <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/80 px-2 py-1 rounded-xl border border-white/10">
                        <input
                          type="number"
                          min="0"
                          max={item.maxScore}
                          value={item.score}
                          onChange={(e) => {
                            const val = Math.min(item.maxScore, Math.max(0, Number(e.target.value) || 0));
                            setEvalItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, score: val } : it))
                            );
                          }}
                          className="w-12 text-center text-xs font-mono font-bold bg-transparent text-cyan-300 focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">/ {item.maxScore}</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={item.maxScore}
                      value={item.score}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEvalItems((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, score: val } : it))
                        );
                      }}
                      className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Evaluator Feedback
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Constructive feedback, highlights, and growth advice..."
                    value={evalFeedback}
                    onChange={(e) => setEvalFeedback(e.target.value)}
                    className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-800 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEvaluatingSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  Save Evaluation
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
