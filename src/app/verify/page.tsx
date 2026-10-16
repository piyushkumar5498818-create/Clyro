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
      <form onSubmit={handleVerify} className="flex gap-2 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Enter Verification Code (e.g. CLYRO-ACH-2024-9581)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-sm font-mono rounded-xl border border-slate-300 py-3 pl-10 pr-4 bg-white shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {/* Verification Result */}
      {result && (
        <div className="max-w-xl mx-auto">
          {result.verified && result.data ? (
            <div className="p-6 rounded-2xl border-2 border-emerald-300 bg-white shadow-lg space-y-5">
              <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-emerald-900 text-lg leading-tight">
                    Authentic Certificate Verified
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    Matches official MSOT campus record
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Achievement Title</div>
                    <div className="font-bold text-slate-900">{result.data.title}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Awarded Recipient</div>
                    <div className="font-bold text-slate-900">
                      {result.data.userFullName}{" "}
                      {result.data.studentId ? `(${result.data.studentId})` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Issuing Organization</div>
                    <div className="font-semibold text-slate-700">{result.data.organizationName || result.data.clubName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Date of Issuance</div>
                    <div className="font-semibold text-slate-700">{result.data.issueDate}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t pt-3">
                  <Hash className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Cryptographic Ledger Hash</div>
                    <div className="font-mono text-[11px] text-slate-600 break-all">
                      {result.data.pdfHash}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border-2 border-rose-300 bg-white shadow-lg space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-rose-900 text-lg">
                Verification Failed / Record Not Found
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 text-lg">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
              C
            </div>
            <span>Clyro Verification Portal</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Public Co-Curricular Verification Service
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify Student Credentials & Certificates
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Validate certificate authenticity, recipient identity, and tamper status against the MSOT verified academic ledger.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
