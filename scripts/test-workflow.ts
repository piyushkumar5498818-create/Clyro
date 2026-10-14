import { db } from "../src/lib/store";

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
  console.log("=== RUNNING CLYRO CORE INTEGRITY & WORKFLOW TEST SUITE ===");

  // 1. Hierarchy & Relational Model Tests
  console.log("\n1. Organizational Hierarchy Tests:");
  const topClubs = db.getTopLevelClubs();
  assert(topClubs.length === 4, "System has exactly 4 top-level clubs", `Found ${topClubs.length}`);

  const society = db.getSociety();
  assert(!!society, "Identified top-level Society entity");
  assert(society?.isSociety === true, "Society entity has isSociety = true");

  const subClubs = db.getSocietySubClubs();
  assert(subClubs.length === 4, "Society governs exactly 4 sub-clubs", `Found ${subClubs.length}`);
  const allLinked = subClubs.every((sc) => sc.parentClubId === society?.id);
  assert(allLinked, "All 4 sub-clubs have explicit parentClubId referencing Society");

  // 2. Metrics & Non-Double-Counting
  console.log("\n2. Consolidated Metrics & Double-Counting Prevention:");
  const collegeMetrics = db.getCollegeMetrics();
  assert(collegeMetrics.totalTopLevelClubs === 4, "College metrics report 4 top-level clubs");
  assert(collegeMetrics.societySubClubsCount === 4, "College metrics report 4 society sub-clubs");
  assert(collegeMetrics.totalClubsAndWings === 8, "Total distinct organizations equals 8");

  const societyMetrics = db.getSocietyConsolidatedMetrics();
  assert(societyMetrics?.subClubsCount === 4, "Society metrics consolidate all 4 sub-clubs");
  assert(typeof societyMetrics?.totalUniqueMembers === "number", "Consolidated unique members calculated");

  // 3. Membership Limits & Duplicate Protection
  console.log("\n3. Membership Rules & Duplicate Prevention:");
  const testStudentId = "u0000000-0000-0000-0000-000000000006"; // Alex Rivera
  const webClubId = "b0000000-0000-0000-0000-000000000101";
  const aiClubId = "b0000000-0000-0000-0000-000000000102";

  // Duplicate request check
  let duplicateThrown = false;
  try {
    db.requestMembership(testStudentId, webClubId, "secondary");
  } catch (err: any) {
    duplicateThrown = true;
  }
  assert(duplicateThrown, "Throws error when student requests duplicate club membership");

  // Secondary club request check
  try {
    const secMem = db.requestMembership(testStudentId, aiClubId, "secondary");
    assert(secMem.membershipType === "secondary", "Successfully requested secondary club membership");
  } catch (err: any) {
    assert(false, "Secondary membership request failed", err.message);
  }

  // Exceeding secondary limit check
  let thirdLimitThrown = false;
  try {
    db.requestMembership(testStudentId, "b0000000-0000-0000-0000-000000000103", "secondary");
  } catch (err: any) {
    thirdLimitThrown = true;
  }
  assert(thirdLimitThrown, "Throws error when student exceeds secondary membership limit");

  // 4. Activity Creation & Approval Flow
  console.log("\n4. Club Day Activity Lifecycle:");
  const newActivity = db.createActivity({
    clubId: aiClubId,
    title: "AI Workshop: Transformers in Practice",
    topic: "Attention Mechanisms & Embeddings",
    format: "workshop",
    deliverableDescription: "Submit Google Colab notebook URL with trained text classifier",
    scheduledDate: "2026-10-18",
    startTime: "13:00",
    endTime: "15:00",
    venue: "Lab 3",
    submissionDeadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdBy: "u0000000-0000-0000-0000-000000000005",
  });
  assert(newActivity.status === "submitted_for_approval", "Activity initially in submitted_for_approval state");

  const approvedActivity = db.reviewActivity(
    newActivity.id,
    true,
    "u0000000-0000-0000-0000-000000000004" // Advisor
  );
  assert(approvedActivity.status === "approved", "Advisor successfully approves activity plan");

  // 5. Time-Limited Attendance Check-In & Duplicate Guard
  console.log("\n5. Dynamic Attendance Token & Duplicate Protection:");
  const token = db.generateAttendanceToken(approvedActivity.id, "u0000000-0000-0000-0000-000000000005", 30);
  assert(!!token.tokenCode, `Attendance token generated: ${token.tokenCode}`);

  // Invalid code check
  let invalidCodeThrown = false;
  try {
    db.checkInStudent(approvedActivity.id, testStudentId, "WRONG-CODE");
  } catch (err: any) {
    invalidCodeThrown = true;
  }
  assert(invalidCodeThrown, "Rejects check-in with invalid token code");

  // Valid check-in
  const attRecord = db.checkInStudent(approvedActivity.id, testStudentId, token.tokenCode, "qr_code");
  assert(attRecord.status === "present", "Valid check-in marks student Present");

  // Duplicate check-in guard
  let duplicateAttThrown = false;
  try {
    db.checkInStudent(approvedActivity.id, testStudentId, token.tokenCode, "qr_code");
  } catch (err: any) {
    duplicateAttThrown = true;
  }
  assert(duplicateAttThrown, "Rejects duplicate check-in attempt for same session");

  // Attendance manual correction
  const corrected = db.correctAttendance(
    attRecord.id,
    "late",
    "Student arrived 15 mins late due to campus transport delay",
    "u0000000-0000-0000-0000-000000000005"
  );
  assert(corrected.status === "late", "Coordinator successfully records attendance correction with reason");

  // 6. Submissions & Rubric Scoring
  console.log("\n6. Submissions & Multi-Point Rubric Evaluations:");
  const sub = db.submitWork(approvedActivity.id, testStudentId, "link", {
    linkUrl: "https://colab.research.google.com/drive/1example-notebook",
    notes: "Trained mini-BERT with 94.2% test accuracy.",
  });
  assert(!!sub.id, "Student successfully submits activity deliverable");

  // Duplicate submission guard
  let duplicateSubThrown = false;
  try {
    db.submitWork(approvedActivity.id, testStudentId, "link", { linkUrl: "https://another.url" });
  } catch (err: any) {
    duplicateSubThrown = true;
  }
  assert(duplicateSubThrown, "Rejects duplicate deliverable submission for same activity");

  // Rubric out-of-bounds check
  let rubricBoundsThrown = false;
  try {
    db.evaluateSubmission(sub.id, "u0000000-0000-0000-0000-000000000004", {
      scoreContent: 50, // exceeds max 40
      scorePresentation: 20,
      scoreParticipation: 20,
      feedback: "Invalid score test",
    });
  } catch (err: any) {
    rubricBoundsThrown = true;
  }
  assert(rubricBoundsThrown, "Enforces rubric bounds (Content <= 40, Pres <= 30, Part <= 30)");

  // Valid rubric evaluation
  const evalResult = db.evaluateSubmission(sub.id, "u0000000-0000-0000-0000-000000000004", {
    scoreContent: 37,
    scorePresentation: 26,
    scoreParticipation: 28,
    feedback: "Solid model implementation and clean documentation.",
  });
  assert(evalResult.totalScore === 91, `Total score calculated correctly: ${evalResult.totalScore}/100`);

  // 7. Certificates & Verification
  console.log("\n7. Certificate Issuance & Verification Ledger:");
  const cert = db.issueCertificate(
    testStudentId,
    aiClubId,
    "Excellence in Deep Learning & NLP Workshop",
    "merit",
    approvedActivity.id
  );
  assert(!!cert.verificationCode, `Certificate issued with code: ${cert.verificationCode}`);

  const verified = db.verifyCertificate(cert.verificationCode);
  assert(!!verified, "Valid verification code locates certificate record");
  assert(verified?.userFullName === "Alex Rivera", "Verified certificate matches student name");

  const fakeVerification = db.verifyCertificate("FAKE-TAMPERED-CODE-9999");
  assert(fakeVerification === undefined, "Tampered/invalid code is safely rejected");

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
