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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Verifiable Certificates & Transcripts
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tamper-Proof Ledger &middot; Public Verification &middot; Downloadable PDF Records
          </p>
        </div>

        {canIssue && (
          <button
            onClick={() => setShowIssueModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Issue New Certificate
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

      {/* Certificates Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-indigo-300 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {cert.clubName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {cert.certificateType}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                {cert.title}
              </h4>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Recipient: <strong className="text-slate-900">{cert.userFullName}</strong>
              </p>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs font-mono text-slate-600 border space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Code:</span>
                  <strong className="text-indigo-600">{cert.verificationCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span>{cert.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ledger Verified
              </span>
              <button
                onClick={() => handleDownloadPDF(cert)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleIssue} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Issue Verifiable Student Certificate
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Organization</label>
              <select
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Recipient</label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Achievement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate Type</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
              >
                <option value="achievement">Achievement</option>
                <option value="participation">Participation</option>
                <option value="merit">Merit & Honor</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
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
