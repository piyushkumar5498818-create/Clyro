# Clyro Demo Script — Main User Journey

This walkthrough demonstrates the complete 7-stage club lifecycle on Clyro.

## Test Personas Available in Header Role Switcher
1. **College Admin / Campus Manager:** `admin@msot.edu` (Dr. Sarah Jenkins)
2. **Society Administrator:** `society@msot.edu` (Elena Rostova)
3. **Faculty Advisor:** `advisor@msot.edu` (Prof. Alan Turing)
4. **Student Coordinator:** `coordinator@msot.edu` (Priya Sharma)
5. **Student:** `student@msot.edu` (Alex Rivera)

---

## Step-by-Step Walkthrough

### 1. Multi-Tier Hierarchy Inspection
1. Navigate to `/dashboard` (or click **Launch Dashboard** from the homepage).
2. With **College Admin** active, observe the Global Hierarchy Metrics:
   - 4 Top-level organizations (3 independent clubs + 1 apex society).
   - 4 Independent society sub-clubs under the apex society.
   - Distinct enrolled student count with zero double-counting.
3. Switch role to **Society Admin** using the top-right persona selector.
   - Observe the consolidated society dashboard aggregating metrics across all 4 sub-clubs (*Web & Cloud*, *AI & Data Science*, *Cybersecurity*, *Game Dev*).

### 2. Student Membership Request & Limits
1. Switch role to **Student** (`Alex Rivera`).
2. Navigate to the **Clubs & Society** tab.
3. Observe that Alex already holds a Primary membership in *Society Sub-club 1 (Web & Cloud)*.
4. Click **Join Sub-Club** on *Society Sub-club 2 (AI & Data Science)*.
5. Select **Secondary Membership** and submit.
6. Attempt to request a third club to witness the built-in constraint: *"You already have a registered secondary club."*

### 3. Coordinator Approval
1. Switch role to **Student Coordinator** (`Priya Sharma`).
2. Go to **Clubs & Society** and scroll to **Membership Requests & Enrolment Management**.
3. Locate the pending request and click the green checkmark (**Approve**).

### 4. Activity Planning (7 Days Prior)
1. In Coordinator mode, switch to the **Club Day** tab.
2. Click **Plan New Club Day Activity**.
3. Choose the host organization, enter title, topic, format (Presentation/Workshop), date, venue, deliverable instructions, and deadline.
4. Click **Submit to Faculty Advisor**. Notice status transitions to `submitted_for_approval`.

### 5. Faculty Advisor Review & Approval
1. Switch role to **Faculty Advisor** (`Prof. Alan Turing`).
2. Navigate to **Club Day**.
3. Review the pending activity plan and click **Approve Plan**.
4. The activity is now officially approved and unlocked for student check-in.

### 6. Time-Limited Dynamic QR Attendance
1. Switch to **Student Coordinator** and navigate to the **Attendance** tab.
2. Select the approved session and click **Open Attendance Window**.
3. A rotating 60-minute time-bounded passcode (`CLYRO-XXXX`) and high-resolution QR code render dynamically.
4. Switch role to **Student**, go to **Attendance**, enter the displayed session code, and click **Confirm Presence**.
5. Observe immediate confirmation: student marked as **Present**.
6. Attempt to submit the code a second time to demonstrate duplicate protection: *"Attendance already recorded for this session!"*
7. Switch back to Coordinator to view the attendee roster. Click the edit icon to demonstrate an audit correction with mandatory reason (e.g. *"Late arrival due to campus bus delay"*).

### 7. Deliverable Submission & 100-Point Rubric Grading
1. As **Student**, navigate to **Submissions & Rubric**.
2. Submit a project repository link (e.g., `https://github.com/alexrivera/distributed-system`) and notes.
3. Switch role to **Faculty Advisor**.
4. In the submissions table, click **Grade Rubric**.
5. Adjust interactive rubric sliders:
   - Content & Technical Depth (0–40)
   - Presentation & Clarity (0–30)
   - Participation & Timeliness (0–30)
6. Add qualitative comments and click **Save Evaluation**.
7. The score (e.g. 95/100) instantly reflects on the student's dashboard.

### 8. Verifiable Certificate & Public Verification Portal
1. Navigate to the **Certificates** tab.
2. As Advisor or College Admin, click **Issue New Certificate** for the student.
3. Click **Download PDF** to inspect the landscape certificate with official borders, signatures, verification code, and SHA-256 ledger hash.
4. Click **Verify** in the top navigation (or visit `/verify`).
5. Enter the certificate code (e.g., `CLYRO-ACH-2024-9581`).
6. Observe instant validation against the campus ledger.
7. Enter a tampered/fake code to verify that fraud is flagged immediately.
