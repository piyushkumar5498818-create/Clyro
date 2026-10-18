"use client";

import { useState } from "react";
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

  // Evaluation modal state
  const [evaluatingSub, setEvaluatingSub] = useState<Submission | null>(null);
  const [rubric, setRubric] = useState({
    scoreContent: 35, // max 40
    scorePresentation: 25, // max 30
    scoreParticipation: 25, // max 30
    feedback: "",
  });

  const isStudent = currentUser.role === "member" || currentUser.role === "student";
  const canEvaluate =
    currentUser.role === "president" ||
    currentUser.role === "vice_president" ||
    currentUser.role === "lead" ||
    currentUser.role === "admin" ||
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "student_coordinator" ||
    currentUser.role === "college_admin";

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await submitWorkAction(selectedActId, submissionType, {
      linkUrl,
      notes,
    });
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Work submitted successfully for evaluation!", type: "success" });
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
    const res = await evaluateSubmissionAction(evaluatingSub.id, rubric);
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Rubric evaluation saved and published to student!", type: "success" });
      setEvaluatingSub(null);
      onRefresh();
    } else {
      setMessage({ text: res.error || "Evaluation failed", type: "error" });
    }
  };

  const currentTotalScore =
    Number(rubric.scoreContent || 0) +
    Number(rubric.scorePresentation || 0) +
    Number(rubric.scoreParticipation || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Deliverables & Evaluation
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Submit project links, evaluate with standard rubrics, and provide feedback.
          </p>
        </div>
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

      {/* Student Submission Card */}
      {isStudent && (
        <form onSubmit={handleSubmitWork} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base text-white">
              Submit Deliverable
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Activity</label>
              <select
                value={selectedActId}
                onChange={(e) => setSelectedActId(e.target.value)}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white backdrop-blur-md focus:border-indigo-400 focus:outline-none"
                required
              >
                {approvedActivities.map((a) => (
                  <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                    {a.title} ({a.clubName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Link / Repo URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Notes & Highlights</label>
            <textarea
              rows={2}
              placeholder="Key architectural choices, test results, or links to live demos..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="glass-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
            >
              {loading ? "Submitting..." : "Submit Deliverable"}
            </button>
          </div>
        </form>
      )}

      {/* Submissions Roster */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Submitted Deliverables ({submissions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
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
                        onClick={() => {
                          setEvaluatingSub(s);
                          if (s.evaluation) {
                            setRubric({
                              scoreContent: s.evaluation.scoreContent ?? 35,
                              scorePresentation: s.evaluation.scorePresentation ?? 25,
                              scoreParticipation: s.evaluation.scoreParticipation ?? 25,
                              feedback: s.evaluation.feedback || "",
                            });
                          }
                        }}
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
              className="glass-panel bg-slate-900/95 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-white/15"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="font-black text-base text-white">
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

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-300">
                    <span>1. Content & Technical Depth (Max 40)</span>
                    <span className="font-bold text-indigo-300">{rubric.scoreContent} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={rubric.scoreContent}
                    onChange={(e) => setRubric({ ...rubric, scoreContent: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-300">
                    <span>2. Presentation & Clarity (Max 30)</span>
                    <span className="font-bold text-indigo-300">{rubric.scorePresentation} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={rubric.scorePresentation}
                    onChange={(e) => setRubric({ ...rubric, scorePresentation: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-300">
                    <span>3. Participation & Timeliness (Max 30)</span>
                    <span className="font-bold text-indigo-300">{rubric.scoreParticipation} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={rubric.scoreParticipation}
                    onChange={(e) => setRubric({ ...rubric, scoreParticipation: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Evaluator Feedback</label>
                  <textarea
                    rows={2}
                    placeholder="Constructive feedback, highlights, and growth advice..."
                    value={rubric.feedback}
                    onChange={(e) => setRubric({ ...rubric, feedback: e.target.value })}
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
