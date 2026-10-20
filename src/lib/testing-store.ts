import fs from "fs";
import path from "path";
import { TestingSession, TestingActionRecord, TestingOutcome } from "@/types/database";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "testing-log.json");

interface TestingLogData {
  sessions: TestingSession[];
  actions: TestingActionRecord[];
}

// In-memory cache for ultra-fast access, persisted to disk on every change
let cache: TestingLogData | null = null;

function ensureLoaded(): TestingLogData {
  if (cache) return cache;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      cache = JSON.parse(raw);
      if (cache && Array.isArray(cache.sessions) && Array.isArray(cache.actions)) {
        return cache;
      }
    }
  } catch (err) {
    console.error("[TestingStore] Failed to read store file, reinitializing:", err);
  }

  cache = {
    sessions: [],
    actions: [],
  };
  saveToDisk();
  return cache;
}

function saveToDisk(): void {
  if (!cache) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${STORE_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(cache, null, 2), "utf-8");
    fs.renameSync(tempFile, STORE_FILE);
  } catch (err) {
    console.error("[TestingStore] Failed to write store file:", err);
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
   */
  startSession(userId: string, role: string, userFullName: string, userAgent?: string): TestingSession {
    const data = ensureLoaded();
    const now = new Date().toISOString();

    // Check if there is an existing unconfirmed session for this user and close it
    const existingActive = data.sessions.find(
      (s) => s.userId === userId && !s.loggedOutAt
    );
    if (existingActive) {
      existingActive.lastActiveAt = now;
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
   * Confirms logout for an active testing session.
   */
  endSession(userId: string): { success: boolean; session?: TestingSession } {
    const data = ensureLoaded();
    const now = new Date().toISOString();

    // Find the latest active session for this user
    const session = data.sessions.find(
      (s) => s.userId === userId && !s.loggedOutAt
    );

    if (session) {
      session.loggedOutAt = now;
      session.isConfirmedLogout = true;
      session.lastActiveAt = now;

      // Update all past action records in this session with the confirmed logout timestamp
      for (const act of data.actions) {
        if (act.sessionId === session.id) {
          act.loggedOutAt = now;
        }
      }

      // Record the explicit logout action
      const logoutAction: TestingActionRecord = {
        id: "tact_" + Math.random().toString(36).substring(2, 9),
        sessionId: session.id,
        userId,
        role: formatRoleLabel(session.role),
        loggedInAt: session.loggedInAt,
        doneWhatExactly: "Logged out of the application",
        loggedOutAt: now,
        successfulOrNot: "Successful",
        timestamp: now,
      };

      data.actions.unshift(logoutAction);
      saveToDisk();
      return { success: true, session };
    }

    // Even if no active session in memory, record logout event safely
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
   */
  getActions(filter?: {
    role?: string;
    outcome?: string;
    search?: string;
    limit?: number;
  }): TestingActionRecord[] {
    const data = ensureLoaded();
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
        loggedOutAt: sess?.loggedOutAt || null,
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
    return data.sessions.filter((s) => !s.loggedOutAt);
  },

  /**
   * Clears testing records (used in test setup / reset).
   */
  resetStore(): void {
    cache = { sessions: [], actions: [] };
    saveToDisk();
  },
};
