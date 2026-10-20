"use server";

import { testingStore } from "@/lib/testing-store";
import { getCurrentUserAction } from "@/actions/auth";
import { TestingSession, FormattedTestingLogEntry } from "@/types/database";

export type { FormattedTestingLogEntry };

export async function getTestingLogAction(filter?: {
  role?: string;
  outcome?: string;
  search?: string;
  limit?: number;
}): Promise<FormattedTestingLogEntry[]> {
  try {
    // Authenticate user
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return [];
    }

    const records = testingStore.getActions(filter);

    return records.map((r) => {
      // Server fallback strings
      const loginDate = new Date(r.loggedInAt);
      const formattedLogin = !isNaN(loginDate.getTime())
        ? loginDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
          " (" +
          loginDate.toLocaleDateString([], { month: "short", day: "numeric" }) +
          ")"
        : r.loggedInAt;

      let formattedLogout = "Active Session";
      if (r.loggedOutAt) {
        const logoutDate = new Date(r.loggedOutAt);
        formattedLogout = !isNaN(logoutDate.getTime())
          ? logoutDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
            " (" +
            logoutDate.toLocaleDateString([], { month: "short", day: "numeric" }) +
            ")"
          : r.loggedOutAt;
      }

      return {
        id: r.id,
        role: r.role,
        loggedInOn: formattedLogin,
        doneWhatExactly: r.doneWhatExactly,
        loggedOutOn: formattedLogout,
        successfulOrNot: r.successfulOrNot,
        loggedInAt: r.loggedInAt,
        loggedOutAt: r.loggedOutAt,
        timestamp: r.timestamp,
        userFullName: r.userId,
        userId: r.userId,
        sessionId: r.sessionId,
      };
    });
  } catch (err) {
    console.error("[getTestingLogAction] Error:", err);
    return [];
  }
}

export async function getActiveTestingSessionsAction(): Promise<TestingSession[]> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) return [];
    return testingStore.getActiveSessions();
  } catch (err) {
    console.error("[getActiveTestingSessionsAction] Error:", err);
    return [];
  }
}

export async function resetTestingLogAction(): Promise<{ success: boolean; message: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, message: "Authentication required." };
    }
    testingStore.resetStore();
    return { success: true, message: "Testing log successfully reset for new test run." };
  } catch (err: unknown) {
    return { success: false, message: (err as Error).message };
  }
}
