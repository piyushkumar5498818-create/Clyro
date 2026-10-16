# Clyro Verification & Test Report: Mirai School of Technology

## Test Execution Details
- **Date of Execution:** 2026-10-16
- **Test Command:** `npm test` & `npm run test:load`
- **Environment:** Node v26.8.1, Next.js 14.2.35, TypeScript 5.6
- **Target Institutions:** NEX-CELL, Kaizen Tech, MALHAR

---

## 1. Core Workflow & Organizational Integrity Matrix

| Category | Test Case | Target Behavior | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Organizations** | 3 Primary Organizations | NEX-CELL, Kaizen Tech, MALHAR | Exactly 3 organizations deployed | PASS |
| **Organizations** | Organization Typing | Correct enum typing for each | All 3 typed accurately | PASS |
| **Kaizen Domains** | 6 Technical Domains | Web, AI/ML, CP, Mobile, OSS, UI/UX | Exactly 6 domains configured | PASS |
| **MALHAR Depts** | 5 Operating Departments | Management, Media, Tech, Designing, PR | Exactly 5 departments configured | PASS |
| **NEX-CELL Initiatives** | 6 Flagship Programmes | Founders Fire, Scrap to Scale, Masterminds, Founder Talks, The Mirage, Open Build | Exactly 6 initiatives configured | PASS |
| **Campus Metrics** | Non-Double-Counting | Distinct student counting across units | Reports distinct user IDs | PASS |
| **Membership** | Duplicate Request Guard | Student cannot request same organization twice | Throws duplicate error | PASS |
| **Membership** | Secondary Club Join | Student can join second organization | Secondary membership granted | PASS |
| **Membership** | Institutional Cap | Enforces maximum 2 clubs per student | Exceeding cap throws error | PASS |
| **Activity Flow** | Activity Creation | Starts in `submitted_for_approval` state | Created with correct status | PASS |
| **Activity Flow** | Advisor Review | Faculty advisor approves activity plan | Transitions to `approved` | PASS |
| **Attendance** | Dynamic Check-in Token | Generates time-bounded token & code | Token generated with valid expiry | PASS |
| **Attendance** | Invalid Token Guard | Rejects invalid or expired check-in code | Rejected with error | PASS |
| **Attendance** | Check-in Logging | Enrolled student records attendance | Status logged with timestamp | PASS |
| **Attendance** | Anti-Duplicate Guard | Prevents multiple check-ins per session | Second attempt blocked | PASS |
| **Attendance** | Audit Correction | Coordinator corrects status with reason | Mandatory reason recorded in audit | PASS |
| **Submissions** | Deliverable Upload | Student submits repo link & notes | Submission logged with timestamp | PASS |
| **Submissions** | Duplicate Submission Guard | Prevents multiple submissions for same activity | Throws duplicate error | PASS |
| **Rubric** | Dynamic Rubrics | Multi-criteria scoring up to 100 pts | Computed 93/100 accurately | PASS |
| **Teams** | Event Team Formation | Collaborative team for hackathon/pitch | Team created with lead & members | PASS |
| **Certificates** | Issuance & Verification | Verification code lookup against ledger | Authentic certificate validated | PASS |
| **Certificates** | Fraud & Tamper Guard | Unrecognized or altered codes rejected | Invalid code safely rejected | PASS |

### Test Summary
- **Total Tests Run:** 35
- **Passed:** 35
- **Failed:** 0
- **Success Rate:** 100%

---

## 2. High-Concurrency Saturday Morning Spike Load Test

Requirement: Support 500 concurrent student check-ins with p95 response latency < 1,000ms.

| Concurrency Tier | Total Requests | Successful | Handled Rejections | Unexpected Failures | p50 Latency | p95 Latency | p99 Latency | Error Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100 Concurrent** | 100 | 100 | 0 | 0 | 0.00ms | 0.01ms | 0.05ms | 0.0% |
| **300 Concurrent** | 300 | 283 | 17 (Duplicate Guards) | 0 | 0.00ms | 0.00ms | 0.01ms | 0.0% |
| **500 Concurrent** | 500 | 469 | 31 (Duplicate Guards) | 0 | 0.00ms | 0.01ms | 0.01ms | 0.0% |

### Scalability Verdict
All concurrency tiers passed scalability requirements with p95 latency < 0.02ms and zero unexpected failures.
