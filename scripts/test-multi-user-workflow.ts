import { db } from "../src/lib/store";
import { testingStore } from "../src/lib/testing-store";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` -> ${detail}` : ""}`);
    failed++;
  }
}

async function runMultiUserWorkflowTests() {
  console.log("=== RUNNING GITCLUB MULTI-USER TESTING LOG & ROLE-BASED WORKFLOW SUITE ===");

  // Reset testing log to start fresh for test run
  testingStore.resetStore();

  const allProfiles = db.getAllProfiles();
  const leadUser = allProfiles.find((p) => p.email === "devansh.hack@mirai.edu"); // Lead Member (NEX-CELL)
  const presidentUser = allProfiles.find((p) => p.email === "rishav.president@mirai.edu"); // President (Kaizen Tech)
  const studentUser = allProfiles.find((p) => p.email === "meera.founder@mirai.edu"); // Student Member (NEX-CELL)
  const adminUser = allProfiles.find((p) => p.email === "admin@mirai.edu"); // Campus Admin

  assert(Boolean(leadUser), "Lead Member tester identity exists (Devansh Soni)");
  assert(Boolean(presidentUser), "President tester identity exists (Rishav Raj)");
  assert(Boolean(studentUser), "Student Member tester identity exists (Meera Nair)");
  assert(Boolean(adminUser), "Campus Admin tester identity exists");

  if (!leadUser || !presidentUser || !studentUser || !adminUser) {
    console.error("Missing required tester identities. Aborting test.");
    return;
  }

  // ----------------------------------------------------
  // TEST STEP 1: TESTER 1 (LEAD MEMBER) SESSION & ACTIONS
  // ----------------------------------------------------
  console.log("\n1. Tester 1 (Lead Member) Login & Activity Creation:");

  const session1 = testingStore.startSession(leadUser.id, leadUser.role, leadUser.fullName, "Browser Session 1 (Lead)");
  assert(Boolean(session1.id), "Session 1 created with distinct session ID", session1.id);
  assert(session1.role === "lead", "Session 1 records verified role 'lead'");
  assert(Boolean(session1.loggedInAt), "Session 1 records server-generated login timestamp", session1.loggedInAt);
  assert(session1.loggedOutAt === null, "Session 1 is currently active with loggedOutAt = null");

  // Lead creates activity proposal
  const newActivity = db.createActivity({
    organizationId: "o0000000-0000-0000-0000-000000000001", // NEX-CELL
    title: "Mirai GenAI Venture Sprint 2026",
    topic: "Autonomous AI Agents for Commercial Enterprise",
    format: "hackathon",
    deliverableDescription: "Submit working GitHub repo link with multi-agent orchestration architecture.",
    scheduledDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "18:00",
    venue: "Incubation Hub Lab C",
    submissionDeadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdBy: leadUser.id,
  });

  assert(Boolean(newActivity.id), "Activity created successfully with ID", newActivity.id);
  assert(newActivity.status === "submitted_for_approval", "Activity initially in 'submitted_for_approval' state");

  // Verify backend state & record in testing store
  const persistedAct = db.getActivityById(newActivity.id);
  const actVerified = Boolean(persistedAct && persistedAct.id === newActivity.id);

  testingStore.recordAction({
    userId: leadUser.id,
    role: leadUser.role,
    userFullName: leadUser.fullName,
    doneWhatExactly: `Created and submitted activity proposal: "${newActivity.title}"`,
    outcome: actVerified ? "Successful" : "Failed",
    targetEntityId: newActivity.id,
  });

  const leadActions = testingStore.getActions({ role: "Lead Member" });
  assert(leadActions.length >= 2, "Testing log contains login and activity creation actions for Lead Member");
  assert(leadActions[0].doneWhatExactly.includes("Mirai GenAI Venture Sprint"), "Action description precisely describes operation");
  assert(leadActions[0].successfulOrNot === "Successful", "Operation outcome verified as 'Successful'");
  assert(leadActions[0].role === "Lead Member", "Field 1 (Role) accurately displays 'Lead Member'");

  // ----------------------------------------------------
  // TEST STEP 2: TESTER 2 (PRESIDENT) SESSION & ACTIONS
  // ----------------------------------------------------
  console.log("\n2. Tester 2 (President) Login, Approval & Attendance Session:");

  const session2 = testingStore.startSession(presidentUser.id, presidentUser.role, presidentUser.fullName, "Browser Session 2 (President)");
  assert(session2.id !== session1.id, "Session 2 has isolated session ID distinct from Session 1");
  assert(session2.role === "president", "Session 2 records verified role 'president'");

  // President approves the activity
  const reviewed = db.reviewActivity(newActivity.id, true, presidentUser.id, "Activity aligned with AI innovation mandate.");
  assert(reviewed.status === "approved", "Activity approved by Student Leadership (President)");
  assert(reviewed.approvedBy === presidentUser.id, "Approval attribution preserved for President");

  // Verify backend state & record in testing store
  const verifiedReviewed = db.getActivityById(newActivity.id);
  const approvalVerified = verifiedReviewed?.status === "approved";

  testingStore.recordAction({
    userId: presidentUser.id,
    role: presidentUser.role,
    userFullName: presidentUser.fullName,
    doneWhatExactly: `Approved activity plan: "${reviewed.title}"`,
    outcome: approvalVerified ? "Successful" : "Failed",
    targetEntityId: newActivity.id,
  });

  // President opens attendance check-in session
  const token = db.generateAttendanceToken(newActivity.id, presidentUser.id, 60);
  assert(Boolean(token.tokenCode), "Dynamic attendance token generated", token.tokenCode);

  const activeToken = db.getActiveToken(newActivity.id);
  const tokenVerified = activeToken?.tokenCode === token.tokenCode;

  testingStore.recordAction({
    userId: presidentUser.id,
    role: presidentUser.role,
    userFullName: presidentUser.fullName,
    doneWhatExactly: `Opened attendance check-in session for "${newActivity.title}" (Token: ${token.tokenCode})`,
    outcome: tokenVerified ? "Successful" : "Failed",
    targetEntityId: newActivity.id,
  });

  const presActions = testingStore.getActions({ role: "President" });
  assert(presActions.length >= 3, "Testing log contains login, approval, and attendance open actions for President");
  assert(presActions.some((a) => a.doneWhatExactly.includes("Approved activity plan")), "Approval action logged with title");
  assert(presActions.some((a) => a.doneWhatExactly.includes(token.tokenCode)), "Attendance token logged in action");

  // ----------------------------------------------------
  // TEST STEP 3: TESTER 3 (STUDENT MEMBER) SESSION & ACTIONS
  // ----------------------------------------------------
  console.log("\n3. Tester 3 (Student Member) Check-In & Deliverable Submission:");

  const session3 = testingStore.startSession(studentUser.id, studentUser.role, studentUser.fullName, "Browser Session 3 (Student)");
  assert(session3.id !== session1.id && session3.id !== session2.id, "Session 3 has isolated session ID");
  assert(session3.role === "member", "Session 3 records student role");

  // Student marks attendance using the active token code
  const attRecord = db.checkInStudent(newActivity.id, studentUser.id, token.tokenCode, "qr_code");
  assert(attRecord.status === "present", "Student marked attendance as 'present'");
  assert(attRecord.userId === studentUser.id, "Attendance record attributed to Student");

  const recordsInDb = db.getAttendanceRecords(newActivity.id);
  const checkInVerified = recordsInDb.some((r) => r.id === attRecord.id && r.userId === studentUser.id);

  testingStore.recordAction({
    userId: studentUser.id,
    role: studentUser.role,
    userFullName: studentUser.fullName,
    doneWhatExactly: `Marked attendance for "${newActivity.title}" via QR Code`,
    outcome: checkInVerified ? "Successful" : "Failed",
    targetEntityId: attRecord.id,
  });

  // Student submits project deliverable
  const sub = db.submitWork(newActivity.id, studentUser.id, "link", {
    linkUrl: "https://github.com/mirai-student/genai-venture-sprint",
    notes: "Multi-agent LangGraph workflow with streaming LLM tool calling and evaluation benchmarks.",
  });
  assert(Boolean(sub.id), "Deliverable submitted successfully with ID", sub.id);

  const subsInDb = db.getSubmissions(newActivity.id);
  const subVerified = subsInDb.some((s) => s.id === sub.id && s.userId === studentUser.id);

  testingStore.recordAction({
    userId: studentUser.id,
    role: studentUser.role,
    userFullName: studentUser.fullName,
    doneWhatExactly: `Submitted deliverable link: ${sub.linkUrl} for "${newActivity.title}"`,
    outcome: subVerified ? "Successful" : "Failed",
    targetEntityId: sub.id,
  });

  const studentActions = testingStore.getActions({ role: "Student" });
  assert(studentActions.length >= 3, "Testing log contains login, attendance check-in, and deliverable submission for Student");
  assert(studentActions.some((a) => a.doneWhatExactly.includes("Marked attendance")), "Attendance check-in logged");
  assert(studentActions.some((a) => a.doneWhatExactly.includes("Submitted deliverable link")), "Deliverable submission logged");

  // ----------------------------------------------------
  // TEST STEP 4: EVALUATION & CERTIFICATE ISSUANCE
  // ----------------------------------------------------
  console.log("\n4. Rubric Evaluation & Verifiable Certificate Issuance:");

  // President grades the deliverable
  const evaluation = db.evaluateSubmission(
    sub.id,
    presidentUser.id,
    [
      { criteriaName: "Technical Depth & Agent Architecture", score: 38, maxScore: 40 },
      { criteriaName: "Live Execution & Presentation", score: 29, maxScore: 30 },
      { criteriaName: "Code Quality & Documentation", score: 29, maxScore: 30 },
    ],
    "Outstanding implementation of autonomous agent routing and memory persistence."
  );
  assert(evaluation.totalScore === 96, "Evaluation rubric computed correct total score: 96/100");

  testingStore.recordAction({
    userId: presidentUser.id,
    role: presidentUser.role,
    userFullName: presidentUser.fullName,
    doneWhatExactly: `Graded deliverable submission with rubric score: ${evaluation.totalScore}/100`,
    outcome: "Successful",
    targetEntityId: sub.id,
  });

  // Issue certificate to Student
  const cert = db.issueCertificate(
    studentUser.id,
    "o0000000-0000-0000-0000-000000000001",
    "GenAI Venture Sprint Winner — Outstanding Deliverable",
    "achievement",
    newActivity.id
  );
  assert(Boolean(cert.verificationCode), "Certificate issued with tamper-proof code", cert.verificationCode);

  const verifiedCert = db.verifyCertificate(cert.verificationCode);
  const certVerified = verifiedCert?.verificationCode === cert.verificationCode;

  testingStore.recordAction({
    userId: presidentUser.id,
    role: presidentUser.role,
    userFullName: presidentUser.fullName,
    doneWhatExactly: `Issued verifiable certificate: "${cert.title}" (${cert.verificationCode})`,
    outcome: certVerified ? "Successful" : "Failed",
    targetEntityId: cert.id,
  });

  // ----------------------------------------------------
  // TEST STEP 5: LOGOUT & CONFIRMED LOGOUT TIMESTAMPS
  // ----------------------------------------------------
  console.log("\n5. Confirmed Logout Timestamps & Session Status:");

  // Tester 1 (Lead Member) logs out
  const logout1 = testingStore.endSession(leadUser.id);
  assert(logout1.success, "Tester 1 (Lead Member) confirmed logout");
  assert(Boolean(logout1.session?.loggedOutAt), "Tester 1 session records confirmed logout timestamp", logout1.session?.loggedOutAt || undefined);

  // Tester 3 (Student) logs out
  const logout3 = testingStore.endSession(studentUser.id);
  assert(logout3.success, "Tester 3 (Student) confirmed logout");
  assert(Boolean(logout3.session?.loggedOutAt), "Tester 3 session records confirmed logout timestamp", logout3.session?.loggedOutAt || undefined);

  // Tester 2 (President) remains logged in to verify active session representation
  const activeSessions = testingStore.getActiveSessions();
  assert(activeSessions.length === 1, "Exactly 1 active session remaining (President)", `Found ${activeSessions.length}`);
  assert(activeSessions[0].userId === presidentUser.id, "Active session accurately corresponds to President");

  // ----------------------------------------------------
  // TEST STEP 6: EXACT 5 FIELDS & PERSISTENCE INTEGRITY
  // ----------------------------------------------------
  console.log("\n6. Exact 5-Field Verification & Shared Storage Integrity:");

  const allRecords = testingStore.getActions();
  assert(allRecords.length >= 10, "Testing log captured all multi-user workflow actions", `Found ${allRecords.length}`);

  // Validate that EVERY record has the required 5 fields correctly formatted
  let allFieldsValid = true;
  for (const r of allRecords) {
    const hasField1Role = Boolean(r.role && typeof r.role === "string");
    const hasField2LoggedIn = Boolean(r.loggedInAt && !isNaN(new Date(r.loggedInAt).getTime()));
    const hasField3DoneWhat = Boolean(r.doneWhatExactly && r.doneWhatExactly.trim().length > 0);
    const hasField4LoggedOut = r.loggedOutAt === null || typeof r.loggedOutAt === "string";
    const hasField5Outcome = r.successfulOrNot === undefined || ["Successful", "Failed", "Not verified"].includes(r.successfulOrNot);

    if (!hasField1Role || !hasField2LoggedIn || !hasField3DoneWhat || !hasField4LoggedOut || !hasField5Outcome) {
      allFieldsValid = false;
      console.error("Invalid record fields:", r);
      break;
    }
  }
  assert(allFieldsValid, "All records strictly adhere to the 5 requested fields (Role, Logged in on, Done what, Logged out on, Outcome)");

  // Validate no secrets or tokens leaked in action descriptions
  const leakedSecret = allRecords.some(
    (r) =>
      r.doneWhatExactly.includes("password") ||
      r.doneWhatExactly.includes("cookie") ||
      r.doneWhatExactly.includes("AUTH_SECRET") ||
      r.doneWhatExactly.includes("secret")
  );
  assert(!leakedSecret, "No passwords, cookies, or secrets leaked in action log descriptions");

  // ----------------------------------------------------
  // TEST SUMMARY
  // ----------------------------------------------------
  console.log("\n======================================================");
  console.log(`MULTI-USER TESTING LOG SUITE: ${passed} PASSED, ${failed} FAILED`);
  console.log("======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runMultiUserWorkflowTests();
