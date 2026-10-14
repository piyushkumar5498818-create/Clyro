# Clyro Verification & Test Report

## Test Plan & Matrix

| Category | Test Case | Target Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Foundation** | Next.js 14 App Router Build | Compiles with TypeScript zero errors | PASS |
| **Foundation** | Tailwind CSS Styles | Classes render responsive layouts | PASS |
| **Hierarchy** | 4 Top-Level Clubs | 3 independent clubs + 1 society | Pending Phase B/C |
| **Hierarchy** | 4 Society Sub-Clubs | Parent-child relation, no double-count | Pending Phase B/C |
| **Workflow** | Activity Planning & Advisor Approval | Faculty approves activity before student check-in | Pending Phase D |
| **Workflow** | Dynamic QR Attendance & Duplicate Lock | Single check-in per user, rejects expired codes | Pending Phase D |
| **Workflow** | Submissions & Rubric Scoring | File/link uploads with multi-point rubric | Pending Phase D |
| **Security** | Role-Based Access Isolation | Coordinators restricted to assigned clubs | Pending Phase B/C |
| **Integrity** | Certificate Verification Page | Validates authenticity and flags tampered IDs | Pending Phase E |
