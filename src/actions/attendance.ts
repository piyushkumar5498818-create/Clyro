"use server";

import { db } from "@/lib/store";
import { AttendanceToken, AttendanceRecord } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";
import { testingStore } from "@/lib/testing-store";

export async function generateTokenAction(
  activityId: string,
  minutes = 60
): Promise<{ success: boolean; data?: AttendanceToken; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to open attendance." };
    }

    const canManage = [
      "president",
      "vice_president",
      "lead",
      "admin",
      "student_coordinator",
      "society_admin",
      "unit_lead",
      "faculty_advisor",
      "college_admin",
    ].includes(activeUser.role);
    if (!canManage) {
      return { success: false, error: "Only presidents, vice presidents, leads, or campus admins can open attendance check-in." };
    }

    const token = db.generateAttendanceToken(activityId, activeUser.id, minutes);
    const activity = db.getActivityById(activityId);

    // Verify token active in backend store
    const activeToken = db.getActiveToken(activityId);
    const verified = Boolean(activeToken && activeToken.tokenCode === token.tokenCode);

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Opened attendance check-in session for "${activity?.title || "Activity"}" (Token: ${token.tokenCode})`,
        outcome: verified ? "Successful" : "Failed",
        targetEntityId: activityId,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record generate token action:", logErr);
    }

    return { success: true, data: token };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getActiveTokenAction(activityId: string): Promise<AttendanceToken | undefined> {
  return db.getActiveToken(activityId);
}

export async function checkInStudentAction(
  activityId: string,
  code: string,
  method: "qr_code" | "passcode" = "qr_code"
): Promise<{ success: boolean; data?: AttendanceRecord; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to check in." };
    }

    const record = db.checkInStudent(activityId, activeUser.id, code, method);
    const activity = db.getActivityById(record.activityId);

    // Verify attendance persisted in backend store
    const allRecords = db.getAttendanceRecords(record.activityId);
    const verified = Boolean(allRecords.some((r) => r.id === record.id && r.userId === activeUser.id));

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Marked attendance for "${activity?.title || "Activity"}" via ${method === "qr_code" ? "QR Code" : "Passcode"}`,
        outcome: verified ? "Successful" : "Failed",
        targetEntityId: record.id,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record check-in action:", logErr);
    }

    return { success: true, data: record };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function correctAttendanceAction(
  recordId: string,
  status: AttendanceRecord["status"],
  reason: string
): Promise<{ success: boolean; data?: AttendanceRecord; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to correct attendance." };
    }

    const canCorrect = [
      "president",
      "vice_president",
      "lead",
      "admin",
      "student_coordinator",
      "society_admin",
      "unit_lead",
      "faculty_advisor",
      "college_admin",
    ].includes(activeUser.role);
    if (!canCorrect) {
      return { success: false, error: "Unauthorized to correct attendance records." };
    }

    const corrected = db.correctAttendance(recordId, status, activeUser.id, reason);

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Corrected attendance record status to ${status.toUpperCase()} (Audit Reason: "${reason}")`,
        outcome: "Successful",
        targetEntityId: recordId,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record correct attendance action:", logErr);
    }

    return { success: true, data: corrected };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getAttendanceRecordsAction(activityId?: string): Promise<AttendanceRecord[]> {
  if (!activityId) return [];
  return db.getAttendanceRecords(activityId);
}
