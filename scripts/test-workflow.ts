import { db } from "../src/lib/store";
import { signSessionToken, verifySessionToken, validateGoogleWorkspaceEmail } from "../src/lib/auth";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` -> ${detail}` : ""}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log("=== RUNNING GITCLUB MIRAI ORGANIZATIONAL INTEGRITY & WORKFLOW TEST SUITE ===");

  // 1. Organizational Model Tests
  console.log("\n1. Primary Organizations & Institutional Structure:");
  const orgs = db.getAllOrganizations();
  assert(orgs.length === 3, "Exactly 3 primary organizations deployed", `Found ${orgs.length}`);

  const nexcell = orgs.find((o) => o.shortName === "NEX-CELL");
  assert(!!nexcell, "NEX-CELL (Entrepreneurship Club) exists");
  assert(nexcell?.type === "entrepreneurship_club", "NEX-CELL is categorized as entrepreneurship_club");

  const kaizen = orgs.find((o) => o.shortName === "Kaizen Tech");
  assert(!!kaizen, "Kaizen Tech (Technical Club) exists");
  assert(kaizen?.type === "technical_club", "Kaizen Tech is categorized as technical_club");

  const malhar = orgs.find((o) => o.shortName === "MALHAR");
  assert(!!malhar, "MALHAR (Cultural Society) exists");
  assert(malhar?.type === "cultural_society", "MALHAR is categorized as cultural_society");

  // 2. Units & Initiatives Tests
  console.log("\n2. Specialized Units (Domains & Departments) & Initiatives:");
  const kaizenDomains = db.getUnits(kaizen?.id);
  assert(kaizenDomains.length === 3, "Kaizen Tech has exactly 3 technical domains", `Found ${kaizenDomains.length}`);
  const domainCodes = kaizenDomains.map((d) => d.code);
  assert(
    domainCodes.includes("CP") &&
    domainCodes.includes("WEB") &&
    domainCodes.includes("AI_DS"),
    "All 3 Kaizen technical domains verified (CP, Web, AI & Data Science)"
  );

  const malharDepts = db.getUnits(malhar?.id);
  assert(malharDepts.length === 5, "MALHAR has exactly 5 cultural departments", `Found ${malharDepts.length}`);
  const deptCodes = malharDepts.map((d) => d.code);
  assert(
    deptCodes.includes("MGMT") &&
    deptCodes.includes("MEDIA") &&
    deptCodes.includes("TECH") &&
    deptCodes.includes("DESIGN") &&
    deptCodes.includes("PR"),
    "All 5 MALHAR departments verified (Management, Media, Tech, Designing, PR)"
  );

  const nexcellInitiatives = db.getInitiatives(nexcell?.id);
  assert(nexcellInitiatives.length === 6, "NEX-CELL has exactly 6 flagship initiatives", `Found ${nexcellInitiatives.length}`);
  const initCodes = nexcellInitiatives.map((i) => i.code);
  assert(
    initCodes.includes("FIRE") &&
    initCodes.includes("SCALE") &&
    initCodes.includes("MINDS") &&
    initCodes.includes("TALKS") &&
    initCodes.includes("MIRAGE") &&
    initCodes.includes("BUILD"),
    "All 6 NEX-CELL initiatives verified (Founders Fire, Scrap to Scale, Masterminds, Founder Talks, The Mirage, Open Build)"
  );

  // 3. Institutional Metrics & Non-Double-Counting
  console.log("\n3. Campus Metrics & Non-Double-Counting Aggregation:");
  const institutionalMetrics = db.getInstitutionalMetrics();
  assert(institutionalMetrics.totalOrganizations === 3, "Reports exactly 3 primary organizations");
  assert(institutionalMetrics.totalUnits === 8, "Reports exactly 8 subordinate units (3 domains + 5 depts)");
  assert(institutionalMetrics.totalInitiatives === 6, "Reports exactly 6 initiatives");
  assert(typeof institutionalMetrics.totalEnrolledStudents === "number", "Calculates unique distinct student count");

  // 4. Membership Rules & Limit Enforcement
  console.log("\n4. Membership Enrolment & Constraints:");
  const testStudentId = "u0000000-0000-0000-0000-000000000008"; // Alex Rivera (member)

  // Duplicate membership attempt
  let duplicateThrown = false;
  try {
    db.requestMembership(testStudentId, kaizen!.id, "primary");
  } catch (err: any) {
    duplicateThrown = true;
  }
  assert(duplicateThrown, "Rejects duplicate membership request for same organization");

  // Join second organization (NEX-CELL)
  try {
    const mem2 = db.requestMembership(testStudentId, nexcell!.id, "secondary");
    assert(mem2.status === "pending", "Successfully requested secondary membership in NEX-CELL");
  } catch (err: any) {
    assert(false, "Failed to request secondary membership", err.message);
  }

  // Attempting third club exceeds default cap of 2
  let thirdClubThrown = false;
  try {
    db.requestMembership(testStudentId, malhar!.id, "secondary");
  } catch (err: any) {
    thirdClubThrown = true;
  }
  assert(thirdClubThrown, "Enforces institutional membership cap of 2 clubs per student");

  // 5. Activity Lifecycle & Student Leadership Approval
  console.log("\n5. Activity Lifecycle & Student Leadership Approval:");
  const newActivity = db.createActivity({
    organizationId: nexcell!.id,
    initiativeId: nexcellInitiatives[0].id, // Founders Fire
    title: "Founders Fire: Pre-Seed Pitch Session",
    topic: "Venture Pitching & Angel Feedback",
    format: "pitch_session",
    deliverableDescription: "Upload 10-slide deck and Loom walkthrough link",
    scheduledDate: "2026-10-24",
    startTime: "15:00",
    endTime: "18:00",
    venue: "Incubation Center Block B",
    submissionDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdBy: "u0000000-0000-0000-0000-000000000003", // Arman Mehta (President)
  });
  assert(newActivity.status === "submitted_for_approval", "Activity initially in submitted_for_approval state");

  const approvedActivity = db.reviewActivity(
    newActivity.id,
    true,
    "u0000000-0000-0000-0000-000000000003" // Arman Mehta (President)
  );
  assert(approvedActivity.status === "approved", "Student Leadership (President) approves activity plan");

  // 6. Dynamic Attendance Token & Duplicate Protection
  console.log("\n6. Dynamic Attendance Token & Fraud Protection:");
  const token = db.generateAttendanceToken(approvedActivity.id, "u0000000-0000-0000-0000-000000000003", 45);
  assert(!!token.tokenCode, `Dynamic token generated: ${token.tokenCode}`);

  // Invalid token check
  let invalidCodeThrown = false;
  try {
    db.checkInStudent(approvedActivity.id, testStudentId, "INVALID-CODE-99");
  } catch (err: any) {
    invalidCodeThrown = true;
  }
  assert(invalidCodeThrown, "Rejects check-in with invalid token code");

  // Valid check-in
  const attRecord = db.checkInStudent(approvedActivity.id, testStudentId, token.tokenCode, "qr_code");
  assert(attRecord.status === "present" || attRecord.status === "late", "Valid check-in records student attendance");

  // Duplicate check-in rejection
  let duplicateAttThrown = false;
  try {
    db.checkInStudent(approvedActivity.id, testStudentId, token.tokenCode, "qr_code");
  } catch (err: any) {
    duplicateAttThrown = true;
  }
  assert(duplicateAttThrown, "Rejects duplicate check-in attempt for same session");

  // Coordinator correction with mandatory reason
  const corrected = db.correctAttendance(
    attRecord.id,
    "excused",
    "Student representing college at hackathon conference",
    "u0000000-0000-0000-0000-000000000003"
  );
  assert(corrected.status === "excused", "Attendance corrected with mandatory audit reason");

  // 7. Submissions & Dynamic Rubrics
  console.log("\n7. Submissions & Dynamic Multi-Criteria Rubrics:");
  const sub = db.submitWork(approvedActivity.id, testStudentId, "link", {
    linkUrl: "https://pitch.com/founders-fire-demo",
    notes: "AI Copilot for supply chain validation with 3 beta pilots.",
  });
  assert(!!sub.id, "Student successfully submits deliverable");

  // Duplicate submission guard
  let duplicateSubThrown = false;
  try {
    db.submitWork(approvedActivity.id, testStudentId, "link", { linkUrl: "https://another-url.com" });
  } catch (err: any) {
    duplicateSubThrown = true;
  }
  assert(duplicateSubThrown, "Rejects duplicate deliverable submission for same activity");

  // Dynamic Rubric Evaluation
  const evalResult = db.evaluateSubmission(
    sub.id,
    "u0000000-0000-0000-0000-000000000003", // President
    [
      { criteriaName: "Problem Validation & TAM", score: 28, maxScore: 30 },
      { criteriaName: "Technical Feasibility & MVP", score: 28, maxScore: 30 },
      { criteriaName: "Traction & Unit Economics", score: 18, maxScore: 20 },
      { criteriaName: "Pitch Delivery & Defense", score: 19, maxScore: 20 },
    ],
    "Strong founder validation, impressive prototype traction."
  );
  assert(evalResult.totalScore === 93, `Total score calculated correctly: ${evalResult.totalScore}/100`);

  // 8. Event Team Formation
  console.log("\n8. Event Team Formation:");
  const team = db.createTeam(
    approvedActivity.id,
    "VentureFlow Robotics",
    testStudentId,
    [testStudentId, "u0000000-0000-0000-0000-000000000005"]
  );
  assert(team.name === "VentureFlow Robotics", "Team created successfully with lead and members");

  // 9. Certificates & Verification Ledger
  console.log("\n9. Verifiable Certificate & Fraud Prevention:");
  const cert = db.issueCertificate(
    testStudentId,
    nexcell!.id,
    "Winner: Founders Fire Seed Pitch Sprint",
    "achievement",
    approvedActivity.id
  );
  assert(!!cert.verificationCode, `Certificate generated with code: ${cert.verificationCode}`);

  const verified = db.verifyCertificate(cert.verificationCode);
  assert(!!verified, "Verification ledger validates authentic certificate");
  assert(verified?.userFullName === "Alex Rivera", "Verified certificate recipient matches student profile");

  const tampered = db.verifyCertificate("FAKE-TAMPERED-CERT-9999");
  assert(tampered === undefined, "Tampered/fraudulent code is rejected by verification service");

  // 10. Login Portal & Authentication Verification
  console.log("\n10. Login Portal & Authentication Verification:");
  const profiles = db.getAllProfiles();
  const student = profiles.find((p) => p.email.toLowerCase() === "alex.student@mirai.edu");
  assert(!!student, "Student member profile exists for login");

  const president = profiles.find((p) => p.email.toLowerCase() === "rishav.president@mirai.edu");
  assert(!!president, "Kaizen Tech President profile exists for login");

  const admin = profiles.find((p) => p.email.toLowerCase() === "admin@mirai.edu");
  assert(!!admin, "Campus Administrator profile exists for login");

  const switchedUser = db.setActiveUser(student!.id);
  assert(db.getActiveUser().id === student!.id, "Active user switches successfully upon student login");

  const switchedPres = db.setActiveUser(president!.id);
  assert(db.getActiveUser().id === president!.id, "Active user switches successfully upon president login");

  // 11. Backend Cryptographic Session Integrity
  console.log("\n11. Backend Cryptographic Session Tokens:");
  const sessionToken = signSessionToken(student!.id, student!.email, student!.role);
  assert(typeof sessionToken === "string" && sessionToken.includes("."), "Session token generated with HMAC-SHA256 signature");

  const verifiedSession = verifySessionToken(sessionToken);
  assert(verifiedSession?.userId === student!.id, "Cryptographic verification validates authentic token payload");
  assert(verifiedSession?.email === student!.email, "Token preserves verified campus identity");

  const tamperedToken = sessionToken.slice(0, -6) + "xyz999";
  const verifiedTampered = verifySessionToken(tamperedToken);
  assert(verifiedTampered === null, "Tampered session token signature rejected by auth utility");

  // 12. Google Workspace Authentication & Domain Restriction
  console.log("\n12. Google Workspace Authentication & Domain Restriction:");
  const validWorkspace = validateGoogleWorkspaceEmail("diya.sen@mirai.edu");
  assert(validWorkspace.valid === true, "Valid @mirai.edu Google Workspace email accepted");

  const personalGoogle = validateGoogleWorkspaceEmail("diya.sen@gmail.com");
  assert(personalGoogle.valid === false, "Personal @gmail.com domain blocked with institutional restriction error");

  const otherDomain = validateGoogleWorkspaceEmail("hacker@external.org");
  assert(otherDomain.valid === false, "Unauthorized non-mirai domain rejected");

  const googleUser = db.findOrCreateGoogleProfile("diya.sen@mirai.edu", "Diya Sen");
  assert(googleUser.email === "diya.sen@mirai.edu", "Google Workspace student profile provisioned successfully");
  assert(googleUser.role === "member", "Google Workspace student assigned member role by default");

  const googleSessionToken = signSessionToken(googleUser.id, googleUser.email, googleUser.role, "google_workspace");
  const verifiedGoogleSession = verifySessionToken(googleSessionToken);
  assert(verifiedGoogleSession?.authProvider === "google_workspace", "Session records google_workspace authentication provider");

  console.log(`\n======================================================`);
  console.log(`TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log(`======================================================\n`);

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution threw unexpected error:", err);
  process.exit(1);
});
