import fs from "fs";
import path from "path";
import { TestingSession, TestingActionRecord, TestingOutcome, FormattedTestingLogEntry } from "@/types/database";

interface TestingLogData {
  sessions: TestingSession[];
  actions: TestingActionRecord[];
}

declare global {
  // eslint-disable-next-line no-var
  var __gitclub_testing_cache: TestingLogData | undefined;
}

const IS_SERVERLESS = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NODE_ENV === "production"
);

// If running on Vercel/serverless, use writable /tmp directory
const DATA_DIR = IS_SERVERLESS ? "/tmp/gitclub-data" : path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "testing-log.json");
const BUNDLED_FILE = path.join(process.cwd(), "data", "testing-log.json");

function ensureLoaded(): TestingLogData {
  if (globalThis.__gitclub_testing_cache) return globalThis.__gitclub_testing_cache;

  try {
    // 1. Try reading from runtime STORE_FILE (/tmp or data/)
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.sessions) && Array.isArray(parsed.actions)) {
        globalThis.__gitclub_testing_cache = parsed;
        return parsed;
      }
    }

    // 2. Fallback to bundled seed file
    if (fs.existsSync(BUNDLED_FILE)) {
      const raw = fs.readFileSync(BUNDLED_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.sessions) && Array.isArray(parsed.actions)) {
        globalThis.__gitclub_testing_cache = parsed;
        saveToDisk();
        return parsed;
      }
    }
  } catch (err) {
    console.error("[TestingStore] Failed to read store file, reinitializing:", err);
  }

  globalThis.__gitclub_testing_cache = {
    sessions: [],
    actions: [],
  };
  saveToDisk();
  return globalThis.__gitclub_testing_cache;
}

function saveToDisk(): void {
  const cache = globalThis.__gitclub_testing_cache;
  if (!cache) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${STORE_FILE}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`;
    fs.writeFileSync(tempFile, JSON.stringify(cache, null, 2), "utf-8");
    fs.renameSync(tempFile, STORE_FILE);
  } catch (err) {
    // If primary write failed (e.g. read-only in production), fallback to /tmp
    try {
      const fallbackDir = "/tmp/gitclub-data";
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
      const fallbackFile = path.join(fallbackDir, "testing-log.json");
      fs.writeFileSync(fallbackFile, JSON.stringify(cache, null, 2), "utf-8");
    } catch (tmpErr) {
      console.error("[TestingStore] Failed to write fallback tmp file:", tmpErr);
    }
  }
}

/**
 * Normalizes system role to human-readable label matching application permissions.
 */
export function formatRoleLabel(role: string): string {
  switch (role) {
    case "president":
      return "President";
    case "vice_president":
      return "Vice President";
    case "lead":
    case "unit_lead":
      return "Lead Member";
    case "admin":
    case "college_admin":
    case "campus_manager":
      return "Campus Admin";
    case "faculty_advisor":
      return "Faculty Advisor";
    case "student_coordinator":
      return "Student Coordinator";
    case "member":
    case "student":
    default:
      return "Student";
  }
}

export const testingStore = {
  /**
   * Starts a new authenticated testing session upon login.
   * Auto-closes any previous open sessions for this user so ghost sessions never stack.
   */
  startSession(userId: string, role: string, userFullName: string, userAgent?: string): TestingSession {
    const data = ensureLoaded();
    const now = new Date().toISOString();

    // Close any previous open session for this user to guarantee clean synchronization
    const openSessions = data.sessions.filter(
      (s) => s.userId === userId && !s.loggedOutAt
    );
    for (const openSess of openSessions) {
      openSess.loggedOutAt = now;
      openSess.isConfirmedLogout = false;
      for (const act of data.actions) {
        if (act.sessionId === openSess.id && !act.loggedOutAt) {
          act.loggedOutAt = now;
        }
      }
    }

    const session: TestingSession = {
      id: "tsess_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36),
      userId,
      role,
      userFullName,
      loggedInAt: now,
      loggedOutAt: null,
      isConfirmedLogout: false,
      lastActiveAt: now,
      userAgent,
      createdAt: now,
    };

    data.sessions.unshift(session);

    // Record the initial login action
    const loginAction: TestingActionRecord = {
      id: "tact_" + Math.random().toString(36).substring(2, 9),
      sessionId: session.id,
      userId,
      role: formatRoleLabel(role),
      loggedInAt: session.loggedInAt,
      doneWhatExactly: "Logged into the application",
      loggedOutAt: null,
      successfulOrNot: "Successful",
      timestamp: now,
    };

    data.actions.unshift(loginAction);
    saveToDisk();

    return session;
  },

  /**
   * Confirms logout for all active sessions of this user.
   */
  endSession(userId: string): { success: boolean; session?: TestingSession } {
    const data = ensureLoaded();
    const now = new Date().toISOString();

    // Find all active sessions for this user
    const activeSessions = data.sessions.filter(
      (s) => s.userId === userId && !s.loggedOutAt
    );

    if (activeSessions.length > 0) {
      for (const session of activeSessions) {
        session.loggedOutAt = now;
        session.isConfirmedLogout = true;
        session.lastActiveAt = now;

        // Update all past action records in this session with the confirmed logout timestamp
        for (const act of data.actions) {
          if (act.sessionId === session.id && !act.loggedOutAt) {
            act.loggedOutAt = now;
          }
        }
      }

      const primary = activeSessions[0];
      // Record the explicit logout action
      const logoutAction: TestingActionRecord = {
        id: "tact_" + Math.random().toString(36).substring(2, 9),
        sessionId: primary.id,
        userId: primary.userId,
        role: formatRoleLabel(primary.role),
        loggedInAt: primary.loggedInAt,
        doneWhatExactly: "Logged out of the application",
        loggedOutAt: now,
        successfulOrNot: "Successful",
        timestamp: now,
      };

      data.actions.unshift(logoutAction);
      saveToDisk();
      return { success: true, session: primary };
    }

    // Fallback: If no open session found in memory, record logout safely
    const fallbackAction: TestingActionRecord = {
      id: "tact_" + Math.random().toString(36).substring(2, 9),
      sessionId: "tsess_fallback",
      userId,
      role: "Student",
      loggedInAt: now,
      doneWhatExactly: "Logged out of the application",
      loggedOutAt: now,
      successfulOrNot: "Successful",
      timestamp: now,
    };
    data.actions.unshift(fallbackAction);
    saveToDisk();

    return { success: true };
  },

  /**
   * Records a business action performed by an authenticated user during their session.
   */
  recordAction(params: {
    userId: string;
    role: string;
    userFullName: string;
    doneWhatExactly: string;
    outcome?: TestingOutcome;
    targetEntityId?: string;
  }): TestingActionRecord {
    const data = ensureLoaded();
    const now = new Date().toISOString();

    // Find the active session for this user or create a session if missing
    let session = data.sessions.find(
      (s) => s.userId === params.userId && !s.loggedOutAt
    );

    if (!session) {
      session = {
        id: "tsess_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36),
        userId: params.userId,
        role: params.role,
        userFullName: params.userFullName,
        loggedInAt: now,
        loggedOutAt: null,
        isConfirmedLogout: false,
        lastActiveAt: now,
        createdAt: now,
      };
      data.sessions.unshift(session);
    } else {
      session.lastActiveAt = now;
    }

    const actionRecord: TestingActionRecord = {
      id: "tact_" + Math.random().toString(36).substring(2, 9),
      sessionId: session.id,
      userId: params.userId,
      role: formatRoleLabel(params.role),
      loggedInAt: session.loggedInAt,
      doneWhatExactly: params.doneWhatExactly,
      loggedOutAt: session.loggedOutAt || null,
      successfulOrNot: params.outcome,
      targetEntityId: params.targetEntityId,
      timestamp: now,
    };

    data.actions.unshift(actionRecord);
    saveToDisk();

    return actionRecord;
  },

  /**
   * Returns all testing action records with optional filtering.
   * Auto-reconciles idle sessions (>20 min inactive) so they don't linger as "Active Session".
   */
  getActions(filter?: {
    role?: string;
    outcome?: string;
    search?: string;
    limit?: number;
  }): TestingActionRecord[] {
    const data = ensureLoaded();

    // Auto-reconcile idle sessions (>20 min inactive)
    const IDLE_TIMEOUT_MS = 20 * 60 * 1000;
    const nowTime = Date.now();
    for (const sess of data.sessions) {
      if (!sess.loggedOutAt) {
        const lastActivityTime = new Date(sess.lastActiveAt || sess.createdAt).getTime();
        if (nowTime - lastActivityTime > IDLE_TIMEOUT_MS) {
          const timeoutTime = new Date(lastActivityTime + IDLE_TIMEOUT_MS).toISOString();
          sess.loggedOutAt = timeoutTime;
          sess.isConfirmedLogout = false;
          for (const act of data.actions) {
            if (act.sessionId === sess.id && !act.loggedOutAt) {
              act.loggedOutAt = timeoutTime;
            }
          }
        }
      }
    }

    let result = [...data.actions];

    // Ensure loggedOutAt is synchronized with session state
    const sessionMap = new Map<string, TestingSession>();
    for (const s of data.sessions) {
      sessionMap.set(s.id, s);
    }

    result = result.map((act) => {
      const sess = sessionMap.get(act.sessionId);
      return {
        ...act,
        loggedOutAt: sess?.loggedOutAt || act.loggedOutAt || null,
      };
    });

    if (filter?.role && filter.role !== "ALL") {
      result = result.filter(
        (a) => a.role.toLowerCase() === filter.role?.toLowerCase()
      );
    }

    if (filter?.outcome && filter.outcome !== "ALL") {
      result = result.filter(
        (a) => a.successfulOrNot?.toLowerCase() === filter.outcome?.toLowerCase()
      );
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.doneWhatExactly.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          (a.targetEntityId && a.targetEntityId.toLowerCase().includes(q))
      );
    }

    const limit = filter?.limit || 100;
    return result.slice(0, limit);
  },

  /**
   * Returns active connected testing sessions.
   */
  getActiveSessions(): TestingSession[] {
    const data = ensureLoaded();
    const nowTime = Date.now();
    const IDLE_TIMEOUT_MS = 20 * 60 * 1000;

    return data.sessions.filter((s) => {
      if (s.loggedOutAt || s.isConfirmedLogout) return false;
      const lastActivityTime = new Date(s.lastActiveAt || s.createdAt).getTime();
      return nowTime - lastActivityTime <= IDLE_TIMEOUT_MS;
    });
  },

  /**
   * Clears testing records (used in test setup / reset).
   */
  resetStore(): void {
    globalThis.__gitclub_testing_cache = { sessions: [], actions: [] };
    saveToDisk();
  },

  /**
   * Merges persistent client records into server state so records never disappear on cold starts.
   */
  mergeClientRecords(clientRecords: FormattedTestingLogEntry[]): void {
    const data = ensureLoaded();
    const existingActionMap = new Map(data.actions.map((a) => [a.id, a]));
    let modified = false;

    for (const r of clientRecords) {
      if (!existingActionMap.has(r.id)) {
        const action: TestingActionRecord = {
          id: r.id,
          sessionId: r.sessionId || "tsess_client_restored",
          userId: r.userId || "u0000000-0000-0000-0000-000000000008",
          role: r.role,
          loggedInAt: r.loggedInAt || r.timestamp,
          doneWhatExactly: r.doneWhatExactly,
          loggedOutAt: r.loggedOutAt || null,
          successfulOrNot: r.successfulOrNot,
          timestamp: r.timestamp,
        };
        data.actions.push(action);
        existingActionMap.set(r.id, action);
        modified = true;
      } else {
        const existing = existingActionMap.get(r.id)!;
        if (!existing.loggedOutAt && r.loggedOutAt) {
          existing.loggedOutAt = r.loggedOutAt;
          modified = true;
        }
      }
    }

    if (modified) {
      data.actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      saveToDisk();
    }
  },
};
