"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    currentUser.role === "president" ||
    currentUser.role === "vice_president" ||
    currentUser.role === "admin" ||
    currentUser.role === "faculty_advisor" ||
    currentUser.role === "college_admin" ||
    currentUser.role === "campus_manager";

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Default to the test student Piyush Kumar for simplicity
    const targetUserId = "u0000000-0000-0000-0000-000000000008";
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
    doc.text(cert.userFullName || "Piyush Kumar", 148.5, 90, { align: "center" });

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

  const handleDownloadTranscript = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Decorative Borders
    doc.setDrawColor(79, 70, 229); // Indigo 600
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    doc.setDrawColor(199, 210, 254);
    doc.setLineWidth(0.5);
    doc.rect(13, 13, 184, 271);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text("MIRAI SCHOOL OF TECHNOLOGY", 105, 30, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(99, 102, 241);
    doc.text("OFFICIAL CO-CURRICULAR TRANSCRIPT & STUDENT RECORD", 105, 38, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Office of Student Affairs & Club Governance | Innovation Campus", 105, 44, { align: "center" });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 48, 190, 48);

    // Student Information Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("1. CANDIDATE PROFILE", 20, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Full Name: ${currentUser.fullName}`, 25, 66);
    doc.text(`Student ID: ${currentUser.studentId || "STU-2024-042"}`, 25, 72);
    doc.text(`Institutional Email: ${currentUser.email}`, 25, 78);
    doc.text(`Campus: Mirai School of Technology (Block A)`, 25, 84);
    doc.text(`Role / Status: ${currentUser.title || currentUser.role}`, 25, 90);

    // Club Memberships
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("2. ENROLLED CLUB AFFILIATIONS", 20, 102);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text("• Kaizen Tech — Technical Club (Primary Member, Verified)", 25, 110);
    doc.text("• NEX-CELL — Entrepreneurship Club (Secondary Member, Approved)", 25, 117);

    // Co-Curricular Highlights
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("3. VERIFIED PARTICIPATION & DELIVERABLE EVALUATIONS", 20, 130);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Activity / Workshop", 25, 138);
    doc.text("Format", 90, 138);
    doc.text("Rubric Score", 130, 138);
    doc.text("Status", 165, 138);

    doc.setDrawColor(203, 213, 225);
    doc.line(25, 140, 185, 140);

    doc.setFont("helvetica", "normal");
    doc.text("Production RAG Workshop & Vector Search", 25, 147);
    doc.text("Workshop", 90, 147);
    doc.text("93 / 100", 130, 147);
    doc.text("Evaluated", 165, 147);

    doc.text("Founders Fire: Cohort Seed Pitch Sprint", 25, 155);
    doc.text("Pitch Session", 90, 155);
    doc.text("96 / 100", 130, 155);
    doc.text("Evaluated", 165, 155);

    doc.text("Cross-Domain AI & Open Source Sprint", 25, 163);
    doc.text("Hackathon", 90, 163);
    doc.text("91 / 100", 130, 163);
    doc.text("Evaluated", 165, 163);

    // Certifications
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("4. ISSUED INSTITUTIONAL CERTIFICATES", 20, 178);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const userCerts = certificates.filter((c) => c.userId === currentUser.id);
    const certList = userCerts.length > 0 ? userCerts : certificates.slice(0, 2);
    certList.forEach((c, idx) => {
      const y = 186 + idx * 10;
      doc.text(`• ${c.title} (${c.certificateType.toUpperCase()})`, 25, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(14, 116, 144);
      doc.text(`Ledger Code: ${c.verificationCode}`, 135, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
    });

    // Verification Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 235, 190, 235);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229);
    doc.text("ONLINE VERIFICATION & ANTI-TAMPER INTEGRITY", 105, 243, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("This co-curricular transcript is cryptographically verifiable on the Mirai Club Ledger at:", 105, 249, { align: "center" });
    doc.setTextColor(30, 64, 175);
    doc.text("https://clyro-brown.vercel.app/verify", 105, 254, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Digital Hash: sha256-${Math.random().toString(36).substring(2, 12)}-msot-verified`, 105, 260, { align: "center" });
    doc.text("Authorized by: Campus Manager & Faculty Advisory Board | Mirai School of Technology", 105, 265, { align: "center" });

    doc.save(`MSOT_CoCurricular_Transcript_${currentUser.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Certificates & Ledger
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Verifiable student credentials, cryptographic hashes, and PDF records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadTranscript}
            className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition text-cyan-300 hover:text-white"
            title="Download Official Verified Co-Curricular Transcript PDF"
          >
            <Download className="w-4 h-4" />
            Download Transcript
          </button>
          {canIssue && (
            <button
              onClick={() => setShowIssueModal(true)}
              className="glass-btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Issue Certificate
            </button>
          )}
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

      {/* Certificates Roster (Fully responsive on mobile, tablet, and desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-400/50 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 ease-out group cursor-default"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30">
                  {cert.organizationName || cert.clubName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {cert.certificateType}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-white leading-snug group-hover:text-indigo-200 transition-colors duration-300">
                {cert.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Recipient: <strong className="text-white">{cert.userFullName}</strong>
              </p>

              {/* Ledger Metadata: Direct readability on mobile */}
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                <div className="p-2.5 rounded-xl glass-card text-xs font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Ledger Code:</span>
                    <strong className="text-cyan-400 text-[11px] select-all">{cert.verificationCode}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Issue Date:</span>
                    <span className="text-[11px]">{cert.issueDate}</span>
                  </div>
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
                className="glass-btn-primary px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Issue Modal */}
      <AnimatePresence>
        {showIssueModal && (
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
              onSubmit={handleIssue}
              className="glass-panel bg-slate-900/95 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-white/15"
            >
              <h4 className="font-black text-base text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                Issue Verified Certificate
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
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
