"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Profile, AttendanceRecord, AttendanceToken } from "@/types/database";
import {
  generateTokenAction,
  checkInStudentAction,
  correctAttendanceAction,
  getActiveTokenAction,
  getAttendanceRecordsAction,
} from "@/actions/attendance";
import {
  QrCode,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  Edit2,
  KeyRound,
} from "lucide-react";
import QRCode from "qrcode";

interface AttendanceViewProps {
  currentUser: Profile;
  activities: Activity[];
  onRefresh: () => void;
}

export function AttendanceView({
  currentUser,
  activities,
  onRefresh,
}: AttendanceViewProps) {
  const approvedActivities = activities.filter((a) => a.status === "approved");
  const [selectedActId, setSelectedActId] = useState<string>(approvedActivities[0]?.id || "");
  const [activeToken, setActiveToken] = useState<AttendanceToken | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [passcode, setPasscode] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Manual correction state
  const [correctingRecord, setCorrectingRecord] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceRecord["status"]>("present");
  const [correctionReason, setCorrectionReason] = useState("");

  const canCheckIn = Boolean(currentUser);
  const canManage =
    currentUser.role === "president" ||
    currentUser.role === "vice_president" ||
    currentUser.role === "lead" ||
    currentUser.role === "admin" ||
    currentUser.role === "student_coordinator" ||
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "college_admin";

  const loadAttendanceData = async (actId: string) => {
    if (!actId) return;
    const token = await getActiveTokenAction(actId);
    setActiveToken(token || null);
    if (token) {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://clyro-brown.vercel.app";
      const checkInUrl = `${origin}/dashboard?checkin=${token.tokenCode}&activityId=${actId}`;
      const url = await QRCode.toDataURL(checkInUrl, { margin: 2, width: 220 });
      setQrDataUrl(url);
    } else {
      setQrDataUrl("");
    }
    const recs = await getAttendanceRecordsAction(actId);
    setRecords(recs);
  };

  useEffect(() => {
    if (approvedActivities.length > 0) {
      const exists = approvedActivities.some((a) => a.id === selectedActId);
      if (!selectedActId || !exists) {
        setSelectedActId(approvedActivities[0].id);
      }
    }
  }, [approvedActivities, selectedActId]);

  useEffect(() => {
    if (selectedActId) {
      loadAttendanceData(selectedActId);
    }
  }, [selectedActId]);

  const handleGenerateToken = async () => {
    setLoading(true);
    setMessage(null);
    const res = await generateTokenAction(selectedActId, 1440);
    setLoading(false);
    if (res.success && res.data) {
      setActiveToken(res.data);
      const origin = typeof window !== "undefined" ? window.location.origin : "https://clyro-brown.vercel.app";
      const checkInUrl = `${origin}/dashboard?checkin=${res.data.tokenCode}&activityId=${selectedActId}`;
      const url = await QRCode.toDataURL(checkInUrl, { margin: 2, width: 220 });
      setQrDataUrl(url);
      setMessage({ text: "Dynamic attendance window active (24-hour verification window).", type: "success" });
    } else {
      setMessage({ text: res.error || "Failed to generate token", type: "error" });
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await checkInStudentAction(selectedActId, passcode, "passcode");
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Successfully checked in! Attendance recorded.", type: "success" });
      setPasscode("");
      loadAttendanceData(selectedActId);
      onRefresh();
    } else {
      setMessage({ text: res.error || "Check-in failed.", type: "error" });
    }
  };

  const handleCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctingRecord) return;
    setLoading(true);
    const res = await correctAttendanceAction(correctingRecord.id, newStatus, correctionReason);
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Attendance record updated with audit note.", type: "success" });
      setCorrectingRecord(null);
      setCorrectionReason("");
      loadAttendanceData(selectedActId);
      onRefresh();
    } else {
      setMessage({ text: res.error || "Update failed", type: "error" });
    }
  };

  const selectedActivity = activities.find((a) => a.id === selectedActId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Attendance & Check-In
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Dynamic QR verification, one-time session passcodes, and real-time attendance ledger.
          </p>
        </div>

        {/* Activity Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Session:</label>
          <select
            value={selectedActId}
            onChange={(e) => setSelectedActId(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-white/15 p-2 bg-slate-900/80 text-white backdrop-blur-md focus:border-indigo-400 focus:outline-none"
          >
            {approvedActivities.map((a) => (
              <option key={a.id} value={a.id} className="bg-slate-900 text-slate-100">
                {a.title} ({a.clubName})
              </option>
            ))}
          </select>
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
            {message.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Activity Session Switcher Tabs: Clearly shows each activity */}
      {approvedActivities.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">Select Activity:</span>
          {approvedActivities.map((act) => {
            const isSelected = act.id === selectedActId;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => setSelectedActId(act.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-white/[0.04] text-slate-300 hover:text-white border-white/10"
                }`}
              >
                <span>{act.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-indigo-200">
                  {act.clubName || "Club"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: QR Code / Token Display */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-1 glass-panel rounded-3xl p-6 flex flex-col items-center text-center space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-white/15">
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            Live Check-in Code
          </div>

          {activeToken ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-3 w-full flex flex-col items-center"
            >
              {qrDataUrl && (
                <div className="p-3 bg-white border-2 border-indigo-500/60 rounded-2xl shadow-xl shadow-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="Attendance QR Code" className="w-40 h-40 sm:w-48 sm:h-48 max-w-full object-contain mx-auto" />
                </div>
              )}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-white w-full backdrop-blur-md">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passcode</div>
                <div className="text-2xl font-mono font-black tracking-widest text-indigo-400 mt-0.5">
                  {activeToken.tokenCode}
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Valid until {new Date(activeToken.validUntil).toLocaleTimeString()}
              </div>
            </motion.div>
          ) : (
            <div className="py-12 px-4 rounded-2xl border border-dashed border-white/15 text-slate-400 text-xs">
              No active attendance window. Coordinators can generate a new session code below.
            </div>
          )}

          {canManage && (
            <button
              onClick={handleGenerateToken}
              disabled={loading}
              className="w-full glass-btn-primary py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {activeToken ? "Rotate Code" : "Open Attendance Window"}
            </button>
          )}
        </motion.div>

        {/* Right Columns: Student Check-In Form & Real-Time Roster */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student / Attendee Fast Check-In Form */}
          {canCheckIn && (
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-extrabold text-base text-white">
                    Instant Attendance Check-In
                  </h3>
                </div>
                {activeToken && (
                  <button
                    type="button"
                    onClick={() => setPasscode(activeToken.tokenCode)}
                    className="self-start sm:self-auto px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-400/30 transition flex items-center gap-1.5 active:scale-95"
                    title="Tap to autofill current session passcode on phone"
                  >
                    <span>Auto-Fill:</span>
                    <span className="text-white underline">{activeToken.tokenCode}</span>
                  </button>
                )}
              </div>

              {records.some((r) => r.userId === currentUser.id) && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>You are marked present for this session</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
                </div>
              )}

              <p className="text-xs text-slate-300">
                Enter the session passcode displayed on the screen or scan the QR code with your phone camera.
              </p>

              <form onSubmit={handleCheckIn} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={activeToken ? `e.g. ${activeToken.tokenCode}` : "e.g. GITCLUB-7492"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="flex-1 font-mono uppercase tracking-wider text-sm rounded-xl border border-white/15 p-2.5 bg-slate-900/60 text-white font-bold backdrop-blur-md focus:border-indigo-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-md whitespace-nowrap"
                >
                  {loading ? "Checking..." : "Confirm Presence"}
                </button>
              </form>
            </div>
          )}

          {/* Roster / Log of Attendees */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                Session Attendees ({records.length})
              </h3>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Live Roster
              </span>
            </div>

            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[500px]">
                <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Method</th>
                    {canManage && <th className="py-2.5 px-3 text-right">Correction</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.04] transition">
                      <td className="py-2.5 px-3 font-bold text-white">{r.userFullName || "Student"}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{r.studentId || "—"}</td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {new Date(r.checkInTime).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          r.status === "present"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : r.status === "late"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                        }`}>
                          {r.status}
                        </span>
                        {r.correctionReason && (
                          <div className="text-[10px] text-slate-400 mt-0.5 italic">
                            &quot;{r.correctionReason}&quot;
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 uppercase font-mono text-[10px]">
                        {r.checkInMethod}
                      </td>
                      {canManage && (
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setCorrectingRecord(r);
                              setNewStatus(r.status);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                            title="Correct Attendance with Reason"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No check-ins recorded yet for this session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Correction Modal */}
      <AnimatePresence>
        {correctingRecord && (
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
              onSubmit={handleCorrection}
              className="glass-panel bg-slate-900/95 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-white/15"
            >
              <h4 className="font-black text-base text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                Audit Correction: {correctingRecord.userFullName}
              </h4>
              <p className="text-xs text-slate-300">
                Provide an audit justification for modifying this attendance record.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Override</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-800 text-white"
                >
                  <option value="present">Present</option>
                  <option value="late">Late Arrival</option>
                  <option value="excused">Excused Absence</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason</label>
                <textarea
                  rows={2}
                  placeholder="Reason for override..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-800 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectingRecord(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  Save Correction
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
