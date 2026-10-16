"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyCertificateAction } from "@/actions/certificates";
import { Certificate } from "@/types/database";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  ArrowLeft,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Hash,
  Loader2,
} from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get("code") || "";
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<{
    verified: boolean;
    data?: Certificate;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    const res = await verifyCertificateAction(code.trim());
    setResult(res);
    setLoading(false);
  };

  useEffect(() => {
    if (initialCode) {
      handleVerify();
    }
  }, [initialCode]);

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <form onSubmit={handleVerify} className="flex gap-2.5 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Enter Verification Code (e.g. CLYRO-ACH-2024-9581)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-sm font-mono rounded-xl border border-white/15 py-3 pl-10 pr-4 bg-slate-900/80 text-white placeholder-slate-500 shadow-inner backdrop-blur-md focus:border-indigo-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="glass-btn-primary px-6 py-3 rounded-xl font-bold text-sm shadow-md transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {/* Verification Result */}
      {result && (
        <div className="max-w-xl mx-auto">
          {result.verified && result.data ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 space-y-5 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-emerald-300 text-lg leading-tight">
                    Authentic Certificate Verified
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Matches official MSOT campus record
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Achievement Title</div>
                    <div className="font-bold text-white text-base mt-0.5">{result.data.title}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Awarded Recipient</div>
                    <div className="font-bold text-white mt-0.5">
                      {result.data.userFullName}{" "}
                      {result.data.studentId ? `(${result.data.studentId})` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-rose-400 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Issuing Organization</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{result.data.organizationName || result.data.clubName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Date of Issuance</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{result.data.issueDate}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/10 pt-3.5">
                  <Hash className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cryptographic Ledger Hash</div>
                    <div className="font-mono text-xs text-slate-300 break-all mt-0.5">
                      {result.data.pdfHash}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/40 space-y-3 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-rose-300 text-lg">
                Verification Failed / Record Not Found
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {result.message}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-white text-lg">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
              C
            </div>
            <span>Clyro Verification Portal</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition border border-white/10 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Public Co-Curricular Verification Service
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Verify Student Credentials & Certificates
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Validate certificate authenticity, recipient identity, and tamper status against the MSOT verified academic ledger.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
