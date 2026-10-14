"use server";

import { db } from "@/lib/store";
import { Certificate, CertificateType } from "@/types/database";

export async function issueCertificateAction(
  userId: string,
  clubId: string,
  title: string,
  type: CertificateType = "participation",
  activityId?: string
): Promise<{ success: boolean; data?: Certificate; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    if (
      activeUser.role !== "faculty_advisor" &&
      activeUser.role !== "college_admin" &&
      activeUser.role !== "campus_manager"
    ) {
      return { success: false, error: "Only advisors or college admins can issue official certificates." };
    }

    const cert = db.issueCertificate(userId, clubId, title, type, activityId);
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
  const cert = db.verifyCertificate(code);
  if (!cert) {
    return {
      verified: false,
      message: "Certificate code not found in MSOT registry. Record may be invalid or tampered.",
    };
  }
  return {
    verified: true,
    data: cert,
    message: "Authentic certificate verified against MSOT academic ledger.",
  };
}
