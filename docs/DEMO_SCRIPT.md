# Clyro Demo Script: Mirai School of Technology

This walkthrough demonstrates the complete 7-stage club lifecycle across **NEX-CELL**, **Kaizen Tech**, and **MALHAR**.

## Test Personas in Persona Switcher
1. **College Admin:** Dr. Sarah Jenkins (`admin@mirai.edu`) — Dean of Academic Affairs
2. **Campus Manager:** Marcus Vance (`cm@mirai.edu`) — Operations Director
3. **Faculty Advisor (Tech):** Prof. Alan Turing (`advisor.tech@mirai.edu`)
4. **Faculty Advisor (E-Cell):** Prof. Maya Angelou (`advisor.ecell@mirai.edu`)
5. **Faculty Advisor (Cultural):** Prof. Ravi Shankar (`advisor.cultural@mirai.edu`)
6. **NEX-CELL Student Lead:** Arman Mehta (`nexcell.lead@mirai.edu`)
7. **Kaizen Lead & AI Domain Coordinator:** Priya Sharma (`kaizen.lead@mirai.edu`)
8. **MALHAR Society President:** Elena Rostova (`malhar.president@mirai.edu`)
9. **Student Engineer:** Alex Rivera (`alex.student@mirai.edu`)

---

## Step-by-Step Walkthrough

### 1. Institutional Organizations & Units Exploration
1. Launch dashboard at `/dashboard`.
2. Inspect the 3 Primary Organizations:
   - **NEX-CELL:** 6 Flagship Initiatives (*Founders Fire*, *Scrap to Scale*, *Masterminds*, *Founder Talks*, *The Mirage*, *Open Build*).
   - **Kaizen Tech:** 6 Technical Domains (*Web Development*, *Applied AI/ML*, *Competitive Programming*, *Mobile App*, *Open Source*, *UI/UX*).
   - **MALHAR:** 5 Operating Departments (*Management*, *Media*, *Tech*, *Designing*, *PR*).
3. Observe institutional metrics calculating distinct enrolled students without double-counting.

### 2. Student Membership Enrolment & Cap Enforcement
1. Switch persona to **Student Engineer** (`Alex Rivera`).
2. Navigate to **Organizations & Units**.
3. Observe Alex is currently enrolled in Kaizen Tech.
4. Click **Join NEX-CELL**, choose **Secondary Membership**, and submit.
5. Attempt to join a third organization (MALHAR) to demonstrate the institutional cap: *"Institutional policy limits students to a maximum of 2 active club memberships."*

### 3. Coordinator / Advisor Membership Review
1. Switch persona to **NEX-CELL Student Lead** (`Arman Mehta`).
2. Navigate to **Organizations & Units** and review pending requests.
3. Click the green checkmark to **Approve** Alex's membership.

### 4. Activity Proposal & Advisory Approval
1. Switch to **Club Day** tab.
2. Click **Plan New Club Day Activity**.
3. Propose a new session (e.g. *Founders Fire Pitch Session* or *Applied AI Agent Workshop*).
4. Switch persona to **Faculty Advisor** (`Prof. Maya Angelou` or `Prof. Alan Turing`).
5. Review the proposed session plan and click **Approve Plan**.

### 5. Dynamic Time-Limited QR Attendance Check-In
1. Switch to **Student Lead / Coordinator** and open the **Attendance** tab.
2. Click **Open Attendance Window**.
3. A rotating 60-minute time-bounded passcode (`CLYRO-XXXX`) and scannable QR code display dynamically.
4. Switch to **Student Engineer** (`Alex Rivera`), enter the passcode, and click **Confirm Presence**.
5. Observe immediate verification with timestamp.
6. Attempt to check in again to verify anti-duplicate protection: *"Attendance already recorded for this session!"*
7. In Coordinator mode, demonstrate an attendance correction with a mandatory explanation note.

### 6. Deliverable Upload & Dynamic Rubric Scoring
1. As **Student Engineer**, navigate to **Submissions & Rubric**.
2. Submit a project repository link or pitch deck URL.
3. Switch to **Faculty Advisor**.
4. Click **Grade Rubric** to open the multi-criteria scoring sliders.
5. Enter qualitative feedback and click **Save Evaluation**.
6. Real-time scores and feedback reflect on the student's dashboard.

### 7. Verifiable Certificate & Public Verification Portal
1. Navigate to **Certificates**.
2. Click **Issue New Certificate** to award an achievement certificate.
3. Click **Download PDF** to inspect the landscape certificate with official borders, signatures, verification code, and SHA-256 ledger hash.
4. Visit `/verify` and enter the code (`CLYRO-KAI-2024-9142` or newly generated code).
5. Verify that authentic credentials show verified status, while tampered codes are flagged immediately.
