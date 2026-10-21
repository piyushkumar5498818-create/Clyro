# Gitclub Verification & Comprehensive Test Report: Mirai School of Technology

## Test Execution Details
- **Date of Execution:** 2026-10-21
- **Test Commands:** `npm test`, `npm run test:multi`, & `npm run test:load`
- **Environment:** Node v20+, Next.js 14.2.35, TypeScript 5.6
- **Target Institutions:** NEX-CELL, Kaizen Tech, MALHAR, Cypher (Club Registry)

---

## 1. Core Workflow, Scalability & Institutional Integrity Matrix

| Category | Test Case | Target Behavior | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Organizations** | 3 Primary Organizations | NEX-CELL, Kaizen Tech, MALHAR | Exactly 3 primary organizations deployed | PASS |
| **Organizations** | Organization Typing | Correct enum typing for each | All 3 typed accurately | PASS |
| **Kaizen Domains** | 3 Technical Domains | CP, Web, AI & Data Science | Exactly 3 domains configured | PASS |
| **MALHAR Depts** | 5 Operating Departments | Management, Media, Tech, Designing, PR | Exactly 5 departments configured | PASS |
| **NEX-CELL Initiatives** | 6 Flagship Programmes | Founders Fire, Scrap to Scale, Masterminds, Founder Talks, The Mirage, Open Build | Exactly 6 initiatives configured | PASS |
| **Campus Metrics** | Non-Double-Counting | Distinct student counting across units | Reports distinct verified user IDs | PASS |
| **Club Registry** | Admin Club Creation | Admin registers new club per campus | Created Cypher club with advisor, coordinator, rules | PASS |
| **Club Registry** | Capacity & Rules | Enforces capacity limit & meeting schedule | Persisted capacity 120 and Friday lab rules | PASS |
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
| **Events (200 pax)** | 200 Registrations & Teams | Event with 200 registrations and team formation | Formed 50 teams of 4 members with zero lost entries | PASS |
| **Certificates** | 20-Certificate Scale Audit | 20 certificates generated with unique ledger codes | Generated 20 certificates successfully | PASS |
| **Certificates** | 20 Verification Links | Each verification link opens the correct record | All 20 codes validated against ledger | PASS |
| **Certificates** | Fraud & Tamper Guard | Unrecognized or altered codes rejected | Invalid/tampered code safely rejected | PASS |
| **Authentication** | Cryptographic Sessions | HMAC-SHA256 session token generation | Validated authentic token signature | PASS |
| **Authentication** | Domain Restriction | Restrict to @mirai.edu Google Workspace | Non-mirai domain (@gmail.com) safely blocked | PASS |
| **Reports** | Report Reconciliation | Reconcile monthly report totals with raw data | Report totals exactly match raw attendance & submissions | PASS |

### Test Summary
- **Unit & Integration Tests (`npm test`):** 59 Passed, 0 Failed
- **Multi-User Synchronized Testing (`npm run test:multi`):** 41 Passed, 0 Failed
- **Combined Automated Pass Rate:** 100% (100 / 100 Tests Passed)

---

## 2. High-Concurrency Saturday Morning Spike Load Test

Requirement: Support 500 concurrent student check-ins with p95 response latency < 1,000ms.

| Concurrency Tier | Total Requests | Successful | Handled Rejections | Unexpected Failures | p50 Latency | p95 Latency | p99 Latency | Error Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100 Concurrent** | 100 | 100 | 0 | 0 | 0.49ms | 0.69ms | 0.91ms | 0.0% |
| **300 Concurrent** | 300 | 300 | 0 | 0 | 0.57ms | 0.88ms | 1.08ms | 0.0% |
| **500 Concurrent** | 500 | 500 | 0 | 0 | 0.72ms | 1.02ms | 1.14ms | 0.0% |

### Scalability Verdict
All concurrency tiers passed scalability requirements with p95 latency < 1.05ms (500x faster than the 1,000ms threshold) and 0% unexpected failures.
