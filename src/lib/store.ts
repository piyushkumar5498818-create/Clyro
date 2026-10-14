import {
  Campus,
  Profile,
  Club,
  ClubCoordinator,
  ClubMembership,
  Activity,
  AttendanceToken,
  AttendanceRecord,
  Submission,
  Evaluation,
  Certificate,
  UserRole,
} from "@/types/database";

// In-Memory Seed State with full hierarchy
interface ClyroDatabaseState {
  campuses: Campus[];
  profiles: Profile[];
  clubs: Club[];
  coordinators: ClubCoordinator[];
  memberships: ClubMembership[];
  activities: Activity[];
  attendanceTokens: AttendanceToken[];
  attendanceRecords: AttendanceRecord[];
  submissions: Submission[];
  evaluations: Evaluation[];
  certificates: Certificate[];
  activeUserId: string;
}

const INITIAL_CAMPUS: Campus = {
  id: "c0000000-0000-0000-0000-000000000001",
  name: "MSOT Central Campus",
  code: "MSOT-CENTRAL",
  location: "Academic Block A",
  createdAt: new Date().toISOString(),
};

const INITIAL_PROFILES: Profile[] = [
  {
    id: "u0000000-0000-0000-0000-000000000001",
    email: "admin@msot.edu",
    fullName: "Dr. Sarah Jenkins",
    role: "college_admin",
    campusId: INITIAL_CAMPUS.id,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000002",
    email: "cm@msot.edu",
    fullName: "Marcus Vance",
    role: "campus_manager",
    campusId: INITIAL_CAMPUS.id,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000003",
    email: "society@msot.edu",
    fullName: "Elena Rostova",
    role: "society_admin",
    campusId: INITIAL_CAMPUS.id,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000004",
    email: "advisor@msot.edu",
    fullName: "Prof. Alan Turing",
    role: "faculty_advisor",
    campusId: INITIAL_CAMPUS.id,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000005",
    email: "coordinator@msot.edu",
    fullName: "Priya Sharma",
    role: "student_coordinator",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000006",
    email: "student@msot.edu",
    fullName: "Alex Rivera",
    role: "student",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-042",
    createdAt: new Date().toISOString(),
  },
];

// Top-Level Clubs (3 Independent Clubs + 1 Society)
const INITIAL_TOP_CLUBS: Club[] = [
  {
    id: "b0000000-0000-0000-0000-000000000001",
    campusId: INITIAL_CAMPUS.id,
    name: "Club 1 (Competitive Programming)",
    description: "Algorithms, competitive programming, and interview problem solving.",
    category: "Technical",
    isSociety: false,
    parentClubId: null,
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 60,
    meetingRules: "Weekly contests every Wednesday 5 PM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    campusId: INITIAL_CAMPUS.id,
    name: "Club 2 (Robotics & Automation)",
    description: "Hardware prototypes, embedded C, microcontrollers, and robotics automation.",
    category: "Engineering",
    isSociety: false,
    parentClubId: null,
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 45,
    meetingRules: "Lab sessions alternate Thursdays",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b0000000-0000-0000-0000-000000000003",
    campusId: INITIAL_CAMPUS.id,
    name: "Club 3 (Debating & Literary)",
    description: "Parliamentary debates, public speaking, model UN, and creative writing.",
    category: "Cultural",
    isSociety: false,
    parentClubId: null,
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 50,
    meetingRules: "Sessions on Friday evenings",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b0000000-0000-0000-0000-000000000004",
    campusId: INITIAL_CAMPUS.id,
    name: "Society (Technical & Innovation Society)",
    description: "Apex society coordinating multidisciplinary engineering wings, cross-domain hackathons, and tech seminars.",
    category: "Society",
    isSociety: true,
    parentClubId: null,
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 200,
    meetingRules: "Governing council meets monthly",
    createdAt: new Date().toISOString(),
  },
];

// Society's 4 Sub-Clubs
const INITIAL_SUB_CLUBS: Club[] = [
  {
    id: "b0000000-0000-0000-0000-000000000101",
    campusId: INITIAL_CAMPUS.id,
    name: "Society Sub-club 1 (Web & Cloud)",
    description: "Full stack engineering, cloud platforms, DevOps, and scalable systems.",
    category: "Technical",
    isSociety: false,
    parentClubId: "b0000000-0000-0000-0000-000000000004",
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 50,
    meetingRules: "Saturdays 10:00 AM - 12:00 PM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b0000000-0000-0000-0000-000000000102",
    campusId: INITIAL_CAMPUS.id,
    name: "Society Sub-club 2 (AI & Data Science)",
    description: "Neural networks, generative models, computer vision, and applied ML.",
    category: "Technical",
    isSociety: false,
    parentClubId: "b0000000-0000-0000-0000-000000000004",
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 50,
    meetingRules: "Saturdays 1:00 PM - 3:00 PM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b0000000-0000-0000-0000-000000000103",
    campusId: INITIAL_CAMPUS.id,
    name: "Society Sub-club 3 (Cybersecurity)",
    description: "Ethical hacking, cryptography, vulnerability assessment, and defense.",
    category: "Technical",
    isSociety: false,
    parentClubId: "b0000000-0000-0000-0000-000000000004",
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 40,
    meetingRules: "Saturdays 3:30 PM - 5:30 PM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b0000000-0000-0000-0000-000000000104",
    campusId: INITIAL_CAMPUS.id,
    name: "Society Sub-club 4 (Game Dev & Creative)",
    description: "Game design, 3D modelling, shaders, and real-time interactive rendering.",
    category: "Creative",
    isSociety: false,
    parentClubId: "b0000000-0000-0000-0000-000000000004",
    facultyAdvisorId: "u0000000-0000-0000-0000-000000000004",
    capacity: 40,
    meetingRules: "Saturdays 11:00 AM - 1:00 PM",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_COORDINATORS: ClubCoordinator[] = [
  {
    id: "k0000000-0000-0000-0000-000000000001",
    clubId: "b0000000-0000-0000-0000-000000000101", // Priya coordinates Sub-club 1
    userId: "u0000000-0000-0000-0000-000000000005",
    assignedAt: new Date().toISOString(),
  },
];

const INITIAL_MEMBERSHIPS: ClubMembership[] = [
  {
    id: "m0000000-0000-0000-0000-000000000001",
    clubId: "b0000000-0000-0000-0000-000000000101",
    userId: "u0000000-0000-0000-0000-000000000006", // Alex is approved member of Sub-club 1
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000005",
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    clubId: "b0000000-0000-0000-0000-000000000101",
    title: "Club Day 1: Cloud Architecture & Serverless",
    topic: "Serverless Microservices and Edge Deployment",
    format: "presentation",
    deliverableDescription: "Submit architecture slide deck (PDF/link) and GitHub repo link.",
    scheduledDate: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:00",
    venue: "Seminar Hall 2",
    submissionDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: "approved",
    approvedBy: "u0000000-0000-0000-0000-000000000004",
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: "u0000000-0000-0000-0000-000000000005",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// Active live attendance token
const INITIAL_TOKENS: AttendanceToken[] = [
  {
    id: "t0000000-0000-0000-0000-000000000001",
    activityId: "a0000000-0000-0000-0000-000000000001",
    tokenCode: "CLYRO-7492",
    validFrom: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    validUntil: new Date(Date.now() + 1000 * 60 * 90).toISOString(), // valid for 90 more mins
    createdBy: "u0000000-0000-0000-0000-000000000005",
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "r0000000-0000-0000-0000-000000000001",
    activityId: "a0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000006",
    status: "present",
    checkInTime: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    checkInMethod: "qr_code",
  },
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "s0000000-0000-0000-0000-000000000001",
    activityId: "a0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000006",
    submissionType: "link",
    linkUrl: "https://github.com/alexrivera/serverless-clyro-demo",
    notes: "Completed microservices architecture with AWS Lambda + DynamoDB edge cache.",
    submittedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: "e0000000-0000-0000-0000-000000000001",
    submissionId: "s0000000-0000-0000-0000-000000000001",
    evaluatorId: "u0000000-0000-0000-0000-000000000004", // Prof. Turing
    scoreContent: 38, // out of 40
    scorePresentation: 28, // out of 30
    scoreParticipation: 29, // out of 30
    totalScore: 95,
    feedback: "Exceptional architecture breakdown with clean container diagrams and load analysis.",
    evaluatedAt: new Date().toISOString(),
  },
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "cert000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000006",
    clubId: "b0000000-0000-0000-0000-000000000101",
    activityId: "a0000000-0000-0000-0000-000000000001",
    certificateType: "achievement",
    title: "Certificate of Outstanding Performance in Serverless Cloud Architecture",
    issueDate: new Date().toISOString().split("T")[0],
    verificationCode: "CLYRO-ACH-2024-9581",
    pdfHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
];

// Singleton store instance
declare global {
  // eslint-disable-next-line no-var
  var __clyro_db: ClyroDatabaseState | undefined;
}

function getDatabase(): ClyroDatabaseState {
  if (!globalThis.__clyro_db) {
    globalThis.__clyro_db = {
      campuses: [INITIAL_CAMPUS],
      profiles: [...INITIAL_PROFILES],
      clubs: [...INITIAL_TOP_CLUBS, ...INITIAL_SUB_CLUBS],
      coordinators: [...INITIAL_COORDINATORS],
      memberships: [...INITIAL_MEMBERSHIPS],
      activities: [...INITIAL_ACTIVITIES],
      attendanceTokens: [...INITIAL_TOKENS],
      attendanceRecords: [...INITIAL_ATTENDANCE],
      submissions: [...INITIAL_SUBMISSIONS],
      evaluations: [...INITIAL_EVALUATIONS],
      certificates: [...INITIAL_CERTIFICATES],
      activeUserId: "u0000000-0000-0000-0000-000000000001", // Default to College Admin
    };
  }
  return globalThis.__clyro_db;
}

export const db = {
  // --- Auth & Session ---
  getActiveUser(): Profile {
    const state = getDatabase();
    return (
      state.profiles.find((p) => p.id === state.activeUserId) ||
      state.profiles[0]
    );
  },

  setActiveUser(userId: string): Profile {
    const state = getDatabase();
    const user = state.profiles.find((p) => p.id === userId);
    if (!user) throw new Error("User not found");
    state.activeUserId = user.id;
    return user;
  },

  getAllProfiles(): Profile[] {
    return getDatabase().profiles;
  },

  // --- Clubs Hierarchy ---
  getAllClubs(): Club[] {
    const state = getDatabase();
    return state.clubs.map((c) => {
      const advisor = state.profiles.find((p) => p.id === c.facultyAdvisorId);
      const subClubs = state.clubs.filter((sub) => sub.parentClubId === c.id);
      const memberCount = state.memberships.filter(
        (m) => m.clubId === c.id && m.status === "approved"
      ).length;
      return {
        ...c,
        advisorName: advisor?.fullName,
        subClubs,
        memberCount,
      };
    });
  },

  getTopLevelClubs(): Club[] {
    return this.getAllClubs().filter((c) => c.parentClubId === null);
  },

  getSociety(): Club | undefined {
    return this.getAllClubs().find((c) => c.isSociety && c.parentClubId === null);
  },

  getSocietySubClubs(): Club[] {
    const society = this.getSociety();
    if (!society) return [];
    return this.getAllClubs().filter((c) => c.parentClubId === society.id);
  },

  getClubById(clubId: string): Club | undefined {
    return this.getAllClubs().find((c) => c.id === clubId);
  },

  // --- Coordinators ---
  getClubCoordinators(clubId: string): ClubCoordinator[] {
    const state = getDatabase();
    return state.coordinators
      .filter((coord) => coord.clubId === clubId)
      .map((coord) => {
        const user = state.profiles.find((p) => p.id === coord.userId);
        return {
          ...coord,
          userFullName: user?.fullName,
          userEmail: user?.email,
        };
      });
  },

  assignCoordinator(clubId: string, userId: string): ClubCoordinator {
    const state = getDatabase();
    const existing = state.coordinators.find(
      (c) => c.clubId === clubId && c.userId === userId
    );
    if (existing) return existing;

    const newCoord: ClubCoordinator = {
      id: "coord_" + Math.random().toString(36).substring(2, 9),
      clubId,
      userId,
      assignedAt: new Date().toISOString(),
    };
    state.coordinators.push(newCoord);
    return newCoord;
  },

  // --- Memberships ---
  getMembershipsByClub(clubId: string): ClubMembership[] {
    const state = getDatabase();
    return state.memberships
      .filter((m) => m.clubId === clubId)
      .map((m) => {
        const user = state.profiles.find((p) => p.id === m.userId);
        const club = state.clubs.find((c) => c.id === m.clubId);
        return {
          ...m,
          userFullName: user?.fullName,
          userEmail: user?.email,
          studentId: user?.studentId,
          clubName: club?.name,
        };
      });
  },

  getMembershipsByUser(userId: string): ClubMembership[] {
    const state = getDatabase();
    return state.memberships
      .filter((m) => m.userId === userId)
      .map((m) => {
        const club = state.clubs.find((c) => c.id === m.clubId);
        return {
          ...m,
          clubName: club?.name,
        };
      });
  },

  requestMembership(
    userId: string,
    clubId: string,
    type: "primary" | "secondary"
  ): ClubMembership {
    const state = getDatabase();

    // Check duplicate
    const existing = state.memberships.find(
      (m) => m.userId === userId && m.clubId === clubId
    );
    if (existing) {
      throw new Error("Already enrolled or requested membership for this club");
    }

    // Limit check: 1 primary, 1 secondary
    const userMemberships = state.memberships.filter(
      (m) => m.userId === userId && m.status !== "rejected"
    );
    const existingType = userMemberships.find(
      (m) => m.membershipType === type
    );
    if (existingType) {
      throw new Error(`You already have a registered ${type} club.`);
    }

    const newMembership: ClubMembership = {
      id: "mem_" + Math.random().toString(36).substring(2, 9),
      clubId,
      userId,
      membershipType: type,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    state.memberships.push(newMembership);
    return newMembership;
  },

  reviewMembership(
    membershipId: string,
    status: "approved" | "rejected",
    reviewerId: string
  ): ClubMembership {
    const state = getDatabase();
    const mem = state.memberships.find((m) => m.id === membershipId);
    if (!mem) throw new Error("Membership request not found");

    mem.status = status;
    mem.reviewedAt = new Date().toISOString();
    mem.reviewedBy = reviewerId;
    return mem;
  },

  // --- Activities ---
  getActivities(clubId?: string): Activity[] {
    const state = getDatabase();
    let acts = state.activities;
    if (clubId) {
      acts = acts.filter((a) => a.clubId === clubId);
    }
    return acts.map((a) => {
      const club = state.clubs.find((c) => c.id === a.clubId);
      return {
        ...a,
        clubName: club?.name,
      };
    });
  },

  getActivityById(activityId: string): Activity | undefined {
    return this.getActivities().find((a) => a.id === activityId);
  },

  createActivity(data: Omit<Activity, "id" | "status" | "createdAt">): Activity {
    const state = getDatabase();
    const newAct: Activity = {
      ...data,
      id: "act_" + Math.random().toString(36).substring(2, 9),
      status: "submitted_for_approval",
      createdAt: new Date().toISOString(),
    };
    state.activities.unshift(newAct);
    return newAct;
  },

  reviewActivity(
    activityId: string,
    approved: boolean,
    reviewerId: string,
    reason?: string
  ): Activity {
    const state = getDatabase();
    const act = state.activities.find((a) => a.id === activityId);
    if (!act) throw new Error("Activity not found");

    act.status = approved ? "approved" : "rejected";
    act.approvedBy = reviewerId;
    act.approvedAt = new Date().toISOString();
    if (reason) act.rejectionReason = reason;
    return act;
  },

  // --- Attendance Tokens & Records ---
  generateAttendanceToken(activityId: string, createdBy: string, minutes = 60): AttendanceToken {
    const state = getDatabase();
    // Invalidate existing tokens for this activity
    state.attendanceTokens = state.attendanceTokens.filter(
      (t) => t.activityId !== activityId
    );

    const tokenCode = `CLYRO-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const validUntil = new Date(now.getTime() + minutes * 60 * 1000);

    const newToken: AttendanceToken = {
      id: "tok_" + Math.random().toString(36).substring(2, 9),
      activityId,
      tokenCode,
      validFrom: now.toISOString(),
      validUntil: validUntil.toISOString(),
      createdBy,
    };

    state.attendanceTokens.push(newToken);
    return newToken;
  },

  getActiveToken(activityId: string): AttendanceToken | undefined {
    const state = getDatabase();
    const now = new Date().toISOString();
    return state.attendanceTokens.find(
      (t) => t.activityId === activityId && t.validUntil >= now
    );
  },

  checkInStudent(
    activityId: string,
    userId: string,
    code: string,
    method: "qr_code" | "passcode" = "qr_code"
  ): AttendanceRecord {
    const state = getDatabase();

    // 1. Check duplicate
    const duplicate = state.attendanceRecords.find(
      (r) => r.activityId === activityId && r.userId === userId
    );
    if (duplicate) {
      throw new Error("Attendance already recorded for this session!");
    }

    // 2. Validate token
    const token = state.attendanceTokens.find(
      (t) => t.activityId === activityId && t.tokenCode.toUpperCase() === code.trim().toUpperCase()
    );
    if (!token) {
      throw new Error("Invalid check-in code. Please check with your coordinator.");
    }

    const now = new Date();
    if (now > new Date(token.validUntil)) {
      throw new Error("Check-in window has expired.");
    }

    // 3. Record attendance
    const record: AttendanceRecord = {
      id: "rec_" + Math.random().toString(36).substring(2, 9),
      activityId,
      userId,
      status: "present",
      checkInTime: now.toISOString(),
      checkInMethod: method,
    };

    state.attendanceRecords.push(record);
    return record;
  },

  correctAttendance(
    recordId: string,
    status: AttendanceRecord["status"],
    reason: string,
    correctedBy: string
  ): AttendanceRecord {
    const state = getDatabase();
    const record = state.attendanceRecords.find((r) => r.id === recordId);
    if (!record) throw new Error("Attendance record not found");

    record.status = status;
    record.correctionReason = reason;
    record.correctedBy = correctedBy;
    return record;
  },

  getAttendanceRecords(activityId: string): AttendanceRecord[] {
    const state = getDatabase();
    return state.attendanceRecords
      .filter((r) => r.activityId === activityId)
      .map((r) => {
        const user = state.profiles.find((p) => p.id === r.userId);
        return {
          ...r,
          userFullName: user?.fullName,
          studentId: user?.studentId,
        };
      });
  },

  // --- Submissions ---
  submitWork(
    activityId: string,
    userId: string,
    submissionType: "link" | "file" | "text",
    payload: { linkUrl?: string; fileUrl?: string; notes?: string }
  ): Submission {
    const state = getDatabase();
    const existing = state.submissions.find(
      (s) => s.activityId === activityId && s.userId === userId
    );
    if (existing) {
      throw new Error("You have already submitted work for this activity.");
    }

    const newSub: Submission = {
      id: "sub_" + Math.random().toString(36).substring(2, 9),
      activityId,
      userId,
      submissionType,
      linkUrl: payload.linkUrl,
      fileUrl: payload.fileUrl,
      notes: payload.notes,
      submittedAt: new Date().toISOString(),
    };

    state.submissions.push(newSub);
    return newSub;
  },

  getSubmissions(activityId?: string): Submission[] {
    const state = getDatabase();
    let subs = state.submissions;
    if (activityId) {
      subs = subs.filter((s) => s.activityId === activityId);
    }
    return subs.map((s) => {
      const user = state.profiles.find((p) => p.id === s.userId);
      const activity = state.activities.find((a) => a.id === s.activityId);
      const evaluation = state.evaluations.find((e) => e.submissionId === s.id);
      return {
        ...s,
        userFullName: user?.fullName,
        studentId: user?.studentId,
        activityTitle: activity?.title,
        evaluation,
      };
    });
  },

  // --- Evaluations ---
  evaluateSubmission(
    submissionId: string,
    evaluatorId: string,
    rubric: {
      scoreContent: number;
      scorePresentation: number;
      scoreParticipation: number;
      feedback: string;
    }
  ): Evaluation {
    const state = getDatabase();
    // Validate bounds
    if (rubric.scoreContent < 0 || rubric.scoreContent > 40) {
      throw new Error("Content score must be between 0 and 40");
    }
    if (rubric.scorePresentation < 0 || rubric.scorePresentation > 30) {
      throw new Error("Presentation score must be between 0 and 30");
    }
    if (rubric.scoreParticipation < 0 || rubric.scoreParticipation > 30) {
      throw new Error("Participation score must be between 0 and 30");
    }

    const totalScore =
      rubric.scoreContent + rubric.scorePresentation + rubric.scoreParticipation;

    // Check if already evaluated
    let evaluation = state.evaluations.find((e) => e.submissionId === submissionId);
    if (evaluation) {
      evaluation.scoreContent = rubric.scoreContent;
      evaluation.scorePresentation = rubric.scorePresentation;
      evaluation.scoreParticipation = rubric.scoreParticipation;
      evaluation.totalScore = totalScore;
      evaluation.feedback = rubric.feedback;
      evaluation.evaluatedAt = new Date().toISOString();
      evaluation.evaluatorId = evaluatorId;
    } else {
      evaluation = {
        id: "eval_" + Math.random().toString(36).substring(2, 9),
        submissionId,
        evaluatorId,
        scoreContent: rubric.scoreContent,
        scorePresentation: rubric.scorePresentation,
        scoreParticipation: rubric.scoreParticipation,
        totalScore,
        feedback: rubric.feedback,
        evaluatedAt: new Date().toISOString(),
      };
      state.evaluations.push(evaluation);
    }
    return evaluation;
  },

  // --- Certificates ---
  issueCertificate(
    userId: string,
    clubId: string,
    title: string,
    type: "participation" | "achievement" | "merit",
    activityId?: string
  ): Certificate {
    const state = getDatabase();
    const verificationCode = `CLYRO-${type.substring(0, 3).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const pdfHash =
      "hash_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    const cert: Certificate = {
      id: "cert_" + Math.random().toString(36).substring(2, 9),
      userId,
      clubId,
      activityId,
      certificateType: type,
      title,
      issueDate: new Date().toISOString().split("T")[0],
      verificationCode,
      pdfHash,
    };

    state.certificates.push(cert);
    return cert;
  },

  getCertificates(userId?: string): Certificate[] {
    const state = getDatabase();
    let certs = state.certificates;
    if (userId) {
      certs = certs.filter((c) => c.userId === userId);
    }
    return certs.map((c) => {
      const user = state.profiles.find((p) => p.id === c.userId);
      const club = state.clubs.find((cl) => cl.id === c.clubId);
      return {
        ...c,
        userFullName: user?.fullName,
        studentId: user?.studentId,
        clubName: club?.name,
      };
    });
  },

  verifyCertificate(code: string): Certificate | undefined {
    const state = getDatabase();
    const cert = state.certificates.find(
      (c) => c.verificationCode.toUpperCase() === code.trim().toUpperCase()
    );
    if (!cert) return undefined;

    const user = state.profiles.find((p) => p.id === cert.userId);
    const club = state.clubs.find((cl) => cl.id === cert.clubId);
    return {
      ...cert,
      userFullName: user?.fullName,
      studentId: user?.studentId,
      clubName: club?.name,
    };
  },

  // --- Consolidated Analytics ---
  getCollegeMetrics() {
    const state = getDatabase();
    const topClubs = state.clubs.filter((c) => c.parentClubId === null);
    const society = topClubs.find((c) => c.isSociety);
    const subClubs = society
      ? state.clubs.filter((c) => c.parentClubId === society.id)
      : [];

    // Distinct participating students (no double-counting across clubs)
    const uniqueStudents = new Set(
      state.memberships
        .filter((m) => m.status === "approved")
        .map((m) => m.userId)
    );

    const totalAttendance = state.attendanceRecords.length;
    const totalSubmissions = state.submissions.length;

    return {
      totalTopLevelClubs: topClubs.length, // 4
      societySubClubsCount: subClubs.length, // 4
      totalClubsAndWings: state.clubs.length, // 8 total entities
      totalEnrolledStudents: uniqueStudents.size,
      totalAttendanceLogs: totalAttendance,
      totalSubmissions: totalSubmissions,
      totalActivities: state.activities.length,
    };
  },

  getSocietyConsolidatedMetrics() {
    const state = getDatabase();
    const society = this.getSociety();
    if (!society) return null;

    const subClubs = state.clubs.filter((c) => c.parentClubId === society.id);
    const subClubIds = subClubs.map((s) => s.id);

    // Filter memberships in society sub-clubs
    const societyMemberships = state.memberships.filter(
      (m) => subClubIds.includes(m.clubId) && m.status === "approved"
    );

    // Unique students enrolled across the 4 sub-clubs (ensuring no double-counting)
    const uniqueStudents = new Set(societyMemberships.map((m) => m.userId));

    // Activities conducted under society sub-clubs
    const societyActivities = state.activities.filter((a) =>
      subClubIds.includes(a.clubId)
    );
    const societyActIds = societyActivities.map((a) => a.id);

    // Attendance across all sub-clubs
    const societyAttendance = state.attendanceRecords.filter((r) =>
      societyActIds.includes(r.activityId)
    );

    // Submissions
    const societySubmissions = state.submissions.filter((s) =>
      societyActIds.includes(s.activityId)
    );

    return {
      societyName: society.name,
      subClubsCount: subClubs.length,
      subClubsList: subClubs.map((sc) => ({
        id: sc.id,
        name: sc.name,
        membersCount: state.memberships.filter(
          (m) => m.clubId === sc.id && m.status === "approved"
        ).length,
        activitiesCount: state.activities.filter((a) => a.clubId === sc.id).length,
      })),
      totalUniqueMembers: uniqueStudents.size,
      totalActivities: societyActivities.length,
      totalAttendanceRecorded: societyAttendance.length,
      totalSubmissions: societySubmissions.length,
    };
  },
};
