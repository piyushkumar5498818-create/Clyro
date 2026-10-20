"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FormattedTestingLogEntry,
  getTestingLogAction,
  getActiveTestingSessionsAction,
  resetTestingLogAction,
} from "@/actions/testing-log";
import { TestingSession, Profile } from "@/types/database";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Search,
  Filter,
  Users,
  Clock,
  RotateCcw,
} from "lucide-react";

interface TestingLogViewProps {
  currentUser: Profile | null;
}

export function TestingLogView({ currentUser }: TestingLogViewProps) {
  const [entries, setEntries] = useState<FormattedTestingLogEntry[]>([]);
  const [activeSessions, setActiveSessions] = useState<TestingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoSync, setAutoSync] = useState(true);

  const loadData = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [logs, sessions] = await Promise.all([
        getTestingLogAction({
          role: roleFilter,
          outcome: outcomeFilter,
          search: searchQuery,
        }),
        getActiveTestingSessionsAction(),
      ]);
      setEntries(logs);
      setActiveSessions(sessions);
    } catch (err) {
      console.error("Failed to load testing log:", err);
    } finally {
      setLoading(false);
      if (!silent) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter, outcomeFilter, searchQuery]);

  // Periodic polling for real-time multi-user synchronization across independent sessions/machines
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      loadData(true);
    }, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [autoSync, roleFilter, outcomeFilter, searchQuery]);

  const handleReset = async () => {
    if (confirm("Reset the testing log for a fresh test scenario?")) {
      await resetTestingLogAction();
      await loadData();
    }
  };

  const getRoleBadgeClass = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes("president")) {
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    }
    if (r.includes("vice")) {
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    }
    if (r.includes("lead")) {
      return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    }
    if (r.includes("admin")) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    }
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  };

  return (
    <div className="space-y-4">
      {/* Active Testers Summary Strip */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Active Testing Sessions ({activeSessions.length})
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync 3s
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Multi-user session tracker for synchronized cross-device QA validation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadData(false)}
            disabled={refreshing}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-slate-200 border border-white/10 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/10 hover:border-rose-500/30 transition flex items-center gap-1.5"
            title="Reset testing log for fresh scenario"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Log</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-3 sm:p-3.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 border border-white/10 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search actions or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/15 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-slate-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="Lead Member">Lead Member</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Student">Student</option>
              <option value="Campus Admin">Campus Admin</option>
            </select>
          </div>

          {/* Outcome Filter */}
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Successful">Successful</option>
            <option value="Failed">Failed</option>
            <option value="Not verified">Not verified</option>
          </select>
        </div>
      </div>

      {/* Main Testing Log Display */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 space-y-4 border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-black text-sm sm:text-base text-white">
              Multi-User Testing &amp; Activity Log
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30">
            {entries.length} RECORDS
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading synchronized testing records...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
            <div className="text-sm font-bold text-white">No testing actions recorded yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Actions performed by testers (activity proposals, approvals, attendance check-ins, deliverable submissions) will synchronize here automatically.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View: The 5 Requested Fields */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">Role</th>
                    <th className="py-3 px-3.5">Logged in on</th>
                    <th className="py-3 px-3.5">Done what exactly</th>
                    <th className="py-3 px-3.5">Logged out on</th>
                    <th className="py-3 px-3.5 text-right">Successful or not</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Field 1: Role */}
                      <td className="py-3 px-3.5 font-bold whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadgeClass(
                            entry.role
                          )}`}
                        >
                          {entry.role}
                        </span>
                      </td>

                      {/* Field 2: Logged in on */}
                      <td className="py-3 px-3.5 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                        {entry.loggedInOn}
                      </td>

                      {/* Field 3: Done what exactly */}
                      <td className="py-3 px-3.5 text-white font-medium max-w-md">
                        {entry.doneWhatExactly}
                      </td>

                      {/* Field 4: Logged out on */}
                      <td className="py-3 px-3.5 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                        {entry.loggedOutOn === "Active Session" ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Session
                          </span>
                        ) : (
                          entry.loggedOutOn
                        )}
                      </td>

                      {/* Field 5: Successful or not */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        {entry.successfulOrNot === "Successful" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Successful
                          </span>
                        ) : entry.successfulOrNot === "Failed" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            Failed
                          </span>
                        ) : entry.successfulOrNot === "Not verified" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <HelpCircle className="w-3 h-3 text-amber-400" />
                            Not verified
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View: Touchscreen / Phone Optimized */}
            <div className="block md:hidden space-y-2.5">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeClass(
                        entry.role
                      )}`}
                    >
                      {entry.role}
                    </span>

                    <div>
                      {entry.successfulOrNot === "Successful" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Successful
                        </span>
                      ) : entry.successfulOrNot === "Failed" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          Failed
                        </span>
                      ) : entry.successfulOrNot === "Not verified" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <HelpCircle className="w-3 h-3 text-amber-400" />
                          Not verified
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-white font-medium text-xs pt-0.5">
                    {entry.doneWhatExactly}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 uppercase mr-1">In:</span>
                      {entry.loggedInOn}
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase mr-1">Out:</span>
                      {entry.loggedOutOn === "Active Session" ? (
                        <span className="text-emerald-400 font-semibold">Active</span>
                      ) : (
                        entry.loggedOutOn
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
