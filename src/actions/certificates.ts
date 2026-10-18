"use server";

import { db } from "@/lib/store";
import { Certificate, CertificateType } from "@/types/database";

export async function issueCertificateAction(
  userId: string,
  organizationId: string,
  title: string,
  type: CertificateType = "participation",
  activityId?: string
): Promise<{ success: boolean; data?: Certificate; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    const canIssue = [
      "president",
      "vice_president",
      "admin",
      "faculty_advisor",
      "college_admin",
      "campus_manager",
    ].includes(activeUser.role);
    if (!canIssue) {
      return { success: false, error: "Only club presidents, vice presidents, or campus admins can issue official certificates." };
    }

    const cert = db.issueCertificate(userId, organizationId, title, type, activityId);
    return { success: true, data: cert };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getCertificatesAction(userId?: string): Promise<Certificate[]> {
  return db.getCertificates(userId);
}

export async function verifyCertificateAction(
  code: string
): Promise<{ verified: boolean; data?: Certificate; message: string }> {
  if (!code || code.trim().length === 0) {
    return {
      verified: false,
      message: "Please enter a valid certificate verification code.",
    };
  }

  const cert = db.verifyCertificate(code.trim());
  if (!cert) {
    return {
      verified: false,
      message: "Certificate code not found in Mirai School of Technology ledger. Document may be counterfeit, unapproved, or tampered.",
    };
  }

  return {
    verified: true,
    data: cert,
    message: "Authentic certificate verified against Mirai School of Technology academic ledger.",
  };
}
