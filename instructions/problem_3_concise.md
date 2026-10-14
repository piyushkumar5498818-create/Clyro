# Problem 3: Club Activities Tracker

## Goal
Build one secure, mobile-first platform for all MSOT campuses to manage clubs, activities, attendance, submissions, evaluations, events, certificates, and verified student achievements.

## Core Features (Required)
1. **Club Registry:** Admin creates clubs per campus, assigns advisors/coordinators, and sets capacity and rules.
2. **Enrolment:** Students request club membership; coordinators approve requests and enforce membership limits.
3. **Club Day Calendar:** Import academic dates; coordinators plan activities and advisors approve them.
4. **Attendance:** QR/one-time-code check-in; coordinators can correct records with a reason.
5. **Submissions:** Upload PPTs, assignments, links, or photos by deadline.
6. **Evaluation:** Coordinators/advisors score work using a rubric and provide comments.
7. **Events:** Manage registrations, teams, check-ins, and results for events such as Gambade, Hackathon, and Cross Road.
8. **Certificates:** Generate participation/achievement PDFs with verification links or QR codes.
9. **Dashboards:** Track participation, inactive clubs, zero-participation students, contributors, and exportable reports.

## Club Day Workflow
- **7 days before:** Coordinator plans activity; advisor approves.
- **3 days before:** Notify members of topic, venue, deliverable, and deadline.
- **On the day:** QR/code check-in; flag late check-ins; record presenters/results.
- **Within 48 hours:** Students submit deliverables; send reminders.
- **Within 5 days:** Evaluate submissions; publish scores.
- **Monthly:** Generate campus report on attendance, submissions, scores, and highlights.

## Roles & Permissions
- **Admin/Program Manager:** Manage clubs/events across campuses; view/export all reports.
- **Campus Manager:** Approve campus clubs; view campus data; approve Duty Leave.
- **Faculty Advisor:** Approve plans, evaluate submissions, issue achievement certificates.
- **Student Coordinator:** Plan activities, manage check-in, correct attendance with reasons, evaluate submissions.
- **Student:** Join clubs, check in, submit work, view scores, download certificates/transcript.

**Access control is mandatory:** Coordinators only access their clubs; students cannot edit attendance or scores.

## Security & Scale
- Prevent QR screenshot sharing (suggested: rotating, time-based QR codes).
- Protect student data and enforce role-based permissions.
- Certificate verification must identify incorrect records and detect tampered PDFs.
- Support **4 campuses, 30+ clubs, 1,000+ students**.
- Handle **500 check-ins within 5 minutes**, with **p95 response time under 1 second**.
- Load-test at **100, 300, and 500 concurrent check-ins**.

## Suggested Stack
- **Frontend:** Mobile-first web app/PWA
- **Backend:** Node.js or Python (FastAPI/Django)
- **Database:** PostgreSQL
- **File storage:** Supabase Storage, S3, or MinIO
- **Authentication:** Google Workspace for staff; OTP/student ID for students
- **QR:** Rotating time-based codes
- **Certificates:** PDF generation + public verification page
- **Notifications:** Email, push, WhatsApp, or Telegram

## Testing Requirements
- End-to-end Club Day flow for 3 clubs: plan → approve → check-in → submit → evaluate → report.
- Test screenshot sharing, late check-in, and off-campus check-in if geolocation is used.
- Generate 20 certificates; verify each link and test tampered PDFs.
- Test an event with 200 registrations and team formation without duplicates/lost entries.
- Verify permissions and reconcile report totals with raw data.
- Include a **Test Report** and load-test results.

## Deliverables
- GitHub repo, README, and one-command setup.
- Live demo or 5-minute demo video.
- Architecture diagram and design document (max 3 pages).
- Sample data: 3 clubs, one month of Club Days, one event.
- Sample certificate and co-curricular transcript.
- Test Report and load-test results.

## Bonus Features
- Co-curricular transcript integration with Placement Readiness Copilot (Problem 2).
- Club budgets/expense approvals, Duty Leave requests, media gallery with consent controls, and announcements.

## Judging Weights
| Criterion | Weight |
|---|---:|
| Complete club cycle | 25% |
| Student/coordinator experience | 20% |
| Verification/data integrity | 20% |
| Testing/scalability | 15% |
| Dashboards/reports | 10% |
| Code quality/documentation | 10% |

## Key Takeaway
Build a complete, secure club-management system—not just a UI. Prioritize the full student journey, easy coordinator workflows, reliable records, strict permissions, and proven performance.
