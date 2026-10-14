import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Calendar, Award } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Clyro
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Campus v1.0
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-6 border">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          Verified Co-Curricular Management Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          One platform for every club, activity, and verified achievement.
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Manage the 4 top-level college clubs, dedicated societies with independent sub-clubs, real-time QR attendance check-in, rubric evaluations, and verifiable certificates.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 transition shadow-md flex items-center gap-2"
          >
            Access Portal <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/verify"
            className="px-6 py-3 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 transition shadow-sm"
          >
            Verify Certificate
          </Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border bg-slate-50/50">
            <Users className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Multi-Level Hierarchy
            </h3>
            <p className="text-sm text-slate-600">
              4 top-level organizations with dedicated society sub-clubs. Consolidated dashboards for leadership, independent workspaces for coordinators.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-slate-50/50">
            <Calendar className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Verified Club Day Lifecycle
            </h3>
            <p className="text-sm text-slate-600">
              End-to-end flow: Planning &rarr; Advisor Approval &rarr; Time-limited QR Check-in &rarr; Work Submissions &rarr; Rubric Evaluation.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-slate-50/50">
            <Award className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Tamper-Proof Transcripts
            </h3>
            <p className="text-sm text-slate-600">
              Cryptographically verifiable certificates and student co-curricular records ready for resumes and placement copilot integrations.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
