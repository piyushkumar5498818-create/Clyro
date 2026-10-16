export type UserRole =
  | "college_admin"
  | "campus_manager"
  | "faculty_advisor"
  | "society_admin"
  | "student_coordinator"
  | "unit_lead"
  | "student";

export type OrganizationType =
  | "entrepreneurship_club"
  | "technical_club"
  | "cultural_society";

export type UnitType =
  | "technical_domain" // Kaizen Tech domains
  | "department"       // MALHAR departments
  | "initiative_track";// NEX-CELL specialized tracks

export type MembershipType = "primary" | "secondary";
export type MembershipStatus = "pending" | "approved" | "rejected";

export type ActivityFormat =
  | "presentation"
  | "workshop"
  | "hackathon"
  | "pitch_session"
  | "audition"
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
  title?: string; // e.g. "President", "Media Head", "Domain Lead"
  organizationId?: string; // Assigned organization if applicable
  unitId?: string; // Assigned unit (domain or department) if applicable
  createdAt: string;
}

export interface Organization {
  id: string;
  campusId: string;
  name: string;
  shortName: string; // e.g. "NEX-CELL", "Kaizen Tech", "MALHAR"
  description: string;
  type: OrganizationType;
  facultyAdvisorId: string | null;
  advisorName?: string;
  capacity: number;
  meetingRules: string;
  createdAt: string;
  // Joined stats
  units?: OrganizationUnit[];
  initiatives?: Initiative[];
  memberCount?: number;
}

export type Club = Organization;

export interface OrganizationUnit {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  type: UnitType;
  description: string;
  leadId?: string;
  leadName?: string;
  capacity?: number;
  createdAt: string;
  memberCount?: number;
}

export interface Initiative {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description: string;
  format: string; // e.g. "Pitch Sessions", "MVP Incubator", "Peer Groups"
  status: "active" | "completed" | "upcoming";
  createdAt: string;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  organizationName?: string;
  userFullName?: string;
  userEmail?: string;
  studentId?: string;
}

export type ClubMembership = OrganizationMembership;

export interface UnitAssignment {
  id: string;
  unitId: string;
  userId: string;
  role: "lead" | "member";
  assignedAt: string;
  unitName?: string;
  userFullName?: string;
}

export interface RubricCriteria {
  name: string;
  maxScore: number;
  description: string;
}

export interface Activity {
  id: string;
  organizationId: string;
  unitId?: string; // Optional: specific domain or department
  initiativeId?: string; // Optional: specific initiative (e.g. Founders Fire)
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
  // Custom rubric criteria (or defaults to standard 100pt rubric)
  rubricCriteria?: RubricCriteria[];
  // Joined fields
  organizationName?: string;
  clubName?: string;
  unitName?: string;
  initiativeName?: string;
}

export interface AttendanceToken {
  id: string;
  activityId: string;
  tokenCode: string;
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
  organizationName?: string;
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

export interface EvaluationScoreItem {
  criteriaName: string;
  score: number;
  maxScore: number;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  evaluatorId: string;
  scoreBreakdown: EvaluationScoreItem[];
  scoreContent?: number;
  scorePresentation?: number;
  scoreParticipation?: number;
  totalScore: number; // 0-100
  feedback: string;
  evaluatedAt: string;
  evaluatorName?: string;
}

export interface Team {
  id: string;
  activityId?: string;
  name: string;
  leadUserId: string;
  memberUserIds: string[];
  projectTitle?: string;
  projectUrl?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  organizationId: string;
  activityId?: string;
  certificateType: CertificateType;
  title: string;
  issueDate: string;
  verificationCode: string;
  pdfHash: string;
  userFullName?: string;
  organizationName?: string;
  clubName?: string;
  studentId?: string;
}
