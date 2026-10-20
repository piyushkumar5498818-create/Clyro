"use server";

import { db } from "@/lib/store";
import { Certificate, CertificateType } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";
import { testingStore } from "@/lib/testing-store";

export async function issueCertificateAction(
  userId: string,
  organizationId: string,
  title: string,
  type: CertificateType = "participation",
  activityId?: string
): Promise<{ success: boolean; data?: Certificate; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to issue certificates." };
    }

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

    // Verify certificate in ledger
    const verifiedCert = db.verifyCertificate(cert.verificationCode);
    const verified = Boolean(verifiedCert && verifiedCert.verificationCode === cert.verificationCode);

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Issued verifiable certificate: "${cert.title}" (${cert.verificationCode})`,
        outcome: verified ? "Successful" : "Failed",
        targetEntityId: cert.id,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record issue certificate action:", logErr);
    }

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

  try {
    const activeUser = await getCurrentUserAction();
    if (activeUser) {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Verified authentic certificate in public ledger (${code})`,
        outcome: "Successful",
        targetEntityId: cert.id,
      });
    }
  } catch (logErr) {
    // Non-blocking for public verification
  }

  return {
    verified: true,
    data: cert,
    message: "Authentic certificate verified against Mirai School of Technology academic ledger.",
  };
}
