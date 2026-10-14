export type UserRole =
  | "college_admin"
  | "campus_manager"
  | "society_admin"
  | "faculty_advisor"
  | "student_coordinator"
  | "student";

export type MembershipType = "primary" | "secondary";
export type MembershipStatus = "pending" | "approved" | "rejected";
export type ActivityFormat =
  | "presentation"
  | "workshop"
  | "hackathon"
  | "competition"
  | "assignment";
export type ActivityStatus =
  | "draft"
  | "submitted_for_approval"
  | "approved"
  | "rejected"
  | "completed";
export type AttendanceStatus = "present" | "late" | "excused" | "absent";
export type CheckInMethod = "qr_code" | "passcode" | "coordinator_manual";
export type SubmissionType = "file" | "link" | "text";
export type CertificateType = "participation" | "achievement" | "merit";

export interface Campus {
  id: string;
  name: string;
  code: string;
  location?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  campusId: string;
  studentId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Club {
  id: string;
  campusId: string;
  name: string;
  description: string;
  category: string;
  isSociety: boolean;
  parentClubId: string | null; // NULL for top-level, non-null for society sub-clubs
  facultyAdvisorId: string | null;
  capacity: number;
  meetingRules: string;
  createdAt: string;
  // Joined fields for display
  advisorName?: string;
  subClubs?: Club[];
  memberCount?: number;
}

export interface ClubCoordinator {
  id: string;
  clubId: string;
  userId: string;
  assignedAt: string;
  userFullName?: string;
  userEmail?: string;
}

export interface ClubMembership {
  id: string;
  clubId: string;
  userId: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  clubName?: string;
  userFullName?: string;
  userEmail?: string;
  studentId?: string;
}

export interface Activity {
  id: string;
  clubId: string;
  title: string;
  topic: string;
  format: ActivityFormat;
  deliverableDescription: string;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  venue: string;
  submissionDeadline: string; // ISO
  status: ActivityStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdBy: string;
  createdAt: string;
  // Joined fields
  clubName?: string;
  isParentSociety?: boolean;
}

export interface AttendanceToken {
  id: string;
  activityId: string;
  tokenCode: string; // 6-digit or rotating token
  validFrom: string;
  validUntil: string;
  createdBy: string;
}

export interface AttendanceRecord {
  id: string;
  activityId: string;
  userId: string;
  status: AttendanceStatus;
  checkInTime: string;
  checkInMethod: CheckInMethod;
  correctionReason?: string;
  correctedBy?: string;
  // Joined
  userFullName?: string;
  studentId?: string;
  activityTitle?: string;
  clubName?: string;
}

export interface Submission {
  id: string;
  activityId: string;
  userId: string;
  submissionType: SubmissionType;
  fileUrl?: string;
  linkUrl?: string;
  notes?: string;
  submittedAt: string;
  // Joined
  userFullName?: string;
  studentId?: string;
  activityTitle?: string;
  evaluation?: Evaluation;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  evaluatorId: string;
  scoreContent: number; // 0-40
  scorePresentation: number; // 0-30
  scoreParticipation: number; // 0-30
  totalScore: number; // 0-100
  feedback: string;
  evaluatedAt: string;
  evaluatorName?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  clubId: string;
  activityId?: string;
  certificateType: CertificateType;
  title: string;
  issueDate: string;
  verificationCode: string;
  pdfHash: string;
  userFullName?: string;
  clubName?: string;
  studentId?: string;
}
