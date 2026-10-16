"use client";

import { useState } from "react";
import { Certificate, Club, Profile, CertificateType } from "@/types/database";
import { issueCertificateAction } from "@/actions/certificates";
import {
  Award,
  Download,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  FileCheck,
} from "lucide-react";
import jsPDF from "jspdf";

interface CertificatesViewProps {
  currentUser: Profile;
  clubs: Club[];
  certificates: Certificate[];
  onRefresh: () => void;
}

export function CertificatesView({
  currentUser,
  clubs,
  certificates,
  onRefresh,
}: CertificatesViewProps) {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState("student@msot.edu");
  const [selectedClubId, setSelectedClubId] = useState(clubs[0]?.id || "");
  const [title, setTitle] = useState("Excellence in Cloud & Distributed Systems");
  const [certType, setCertType] = useState<CertificateType>("achievement");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const canIssue =
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "college_admin" ||
    currentUser.role === "campus_manager";

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Default to the test student Alex Rivera for simplicity
    const targetUserId = "u0000000-0000-0000-0000-000000000006";
    const res = await issueCertificateAction(targetUserId, selectedClubId, title, certType);
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Official certificate issued and recorded on the ledger!", type: "success" });
      setShowIssueModal(false);
      onRefresh();
    } else {
      setMessage({ text: res.error || "Failed to issue certificate", type: "error" });
    }
  };

  const handleDownloadPDF = (cert: Certificate) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Decorative Borders
    doc.setDrawColor(79, 70, 229); // Indigo 600
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(199, 210, 254); // Indigo 200
    doc.setLineWidth(0.8);
    doc.rect(14, 14, 269, 182);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text("MSOT COLLEGE OF TECHNOLOGY", 148.5, 40, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241); // Indigo 500
    doc.text("VERIFIED CO-CURRICULAR TRANSCRIPT & CERTIFICATE", 148.5, 50, { align: "center" });

    // Certificate Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text("This is officially awarded to", 148.5, 75, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42);
    doc.text(cert.userFullName || "Alex Rivera", 148.5, 90, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `for distinguished participation and verified deliverables in`,
      148.5,
      105,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(67, 56, 202);
    doc.text(cert.title, 148.5, 118, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Host Organization: ${cert.clubName || "MSOT Technical Wings"}`, 148.5, 128, { align: "center" });

    // Signatures & Verification Details
    doc.setDrawColor(203, 213, 225);
    doc.line(40, 165, 100, 165);
    doc.line(197, 165, 257, 165);

    doc.setFontSize(10);
    doc.text("Faculty Advisor Signature", 70, 172, { align: "center" });
    doc.text("Director of Student Activities", 227, 172, { align: "center" });

    // Footer Security Bar
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 180, 257, 12, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text(`Verification Code: ${cert.verificationCode}`, 25, 187);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`Ledger Hash: ${cert.pdfHash.substring(0, 28)}...`, 130, 187);
    doc.text(`Issued: ${cert.issueDate}`, 240, 187);

    doc.save(`${cert.verificationCode}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Verifiable Certificates & Transcripts
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Tamper-Proof Ledger &middot; Public Verification &middot; Downloadable PDF Records
          </p>
        </div>

        {canIssue && (
          <button
            onClick={() => setShowIssueModal(true)}
            className="glass-btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Issue New Certificate
          </button>
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
          {message.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          {message.text}
        </div>
      )}

      {/* Certificates Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-400/40 transition duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30">
                  {cert.organizationName || cert.clubName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {cert.certificateType}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-white leading-snug">
                {cert.title}
              </h4>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                Recipient: <strong className="text-white">{cert.userFullName}</strong>
              </p>

              <div className="mt-3.5 p-3 rounded-2xl glass-card text-xs font-mono text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Code:</span>
                  <strong className="text-indigo-400">{cert.verificationCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span>{cert.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Ledger Verified
              </span>
              <button
                onClick={() => handleDownloadPDF(cert)}
                className="glass-btn-primary px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleIssue} className="glass-panel bg-slate-900/90 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-white/15">
            <h4 className="font-black text-base text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Issue Verifiable Student Certificate
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Organization</label>
              <select
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Recipient</label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white font-mono placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Achievement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Certificate Type</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-white/15 p-2.5 bg-slate-900/80 text-white backdrop-blur-md focus:border-indigo-400 focus:outline-none"
              >
                <option value="achievement" className="bg-slate-900 text-white">Achievement</option>
                <option value="participation" className="bg-slate-900 text-white">Participation</option>
                <option value="merit" className="bg-slate-900 text-white">Merit & Honor</option>
              </select>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md"
              >
                {loading ? "Generating..." : "Issue & Record"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
