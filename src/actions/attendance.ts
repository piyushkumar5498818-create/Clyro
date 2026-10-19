"use server";

import { db } from "@/lib/store";
import { AttendanceToken, AttendanceRecord } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";

export async function generateTokenAction(
  activityId: string,
  minutes = 60
): Promise<{ success: boolean; data?: AttendanceToken; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
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
    if (activeUser.role !== "student" && activeUser.role !== "member") {
      return { success: false, error: "Only student members can check in to sessions." };
    }

    const record = db.checkInStudent(activityId, activeUser.id, code, method);
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
    const canCorrect = [
      "president",
      "vice_president",
      "lead",
      "admin",
      "student_coordinator",
      "society_admin",
      "faculty_advisor",
      "college_admin",
    ].includes(activeUser.role);
    if (!canCorrect) {
      return { success: false, error: "Only presidents, vice presidents, leads, or campus admins can correct attendance." };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: "A valid explanation reason (at least 5 characters) is mandatory for audit compliance." };
    }

    const rec = db.correctAttendance(recordId, status, reason.trim(), activeUser.id);
    return { success: true, data: rec };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getAttendanceRecordsAction(activityId: string): Promise<AttendanceRecord[]> {
  return db.getAttendanceRecords(activityId);
}
