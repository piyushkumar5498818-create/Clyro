# Clyro — College Club Activities Tracker

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Clyro** is a college Club Activities Tracker engineered to manage multi-tier club hierarchies, session planning, time-limited QR attendance check-in, submission evaluation rubrics, and tamper-evident certificate issuance for MSOT campuses.

---

## 🏛️ 1. Multi-Tier Organizational Hierarchy

Clyro models campus organizations as a relational parent-child tree:
- **3 Top-Level Independent Clubs:**
  1. *Club 1 (Competitive Programming)*
  2. *Club 2 (Robotics & Automation)*
  3. *Club 3 (Debating & Literary)*
- **1 Apex Society (Top-Level Parent):**
  - *Society (Technical & Innovation Society)* (`is_society: true`, `parent_club_id: null`)
- **4 Dedicated Society Sub-Clubs (Independently Managed Wings):**
  1. *Society Sub-club 1 (Web & Cloud)* (`parent_club_id` &rarr; Society)
  2. *Society Sub-club 2 (AI & Data Science)* (`parent_club_id` &rarr; Society)
  3. *Society Sub-club 3 (Cybersecurity)* (`parent_club_id` &rarr; Society)
  4. *Society Sub-club 4 (Game Dev & Creative)* (`parent_club_id` &rarr; Society)

> **Double-Counting Prevention:** College-wide and Society-level reports automatically aggregate distinct student IDs via unique sets to ensure accurate representation without duplication across multiple club memberships.

---

## 🔄 2. Complete End-to-End Club Day Workflow

Every session strictly adheres to the verifiable 7-step lifecycle:
1. **Membership Enrolment:** Students browse clubs and request membership with strict limits (Max 1 Primary + 1 Secondary). Coordinators approve or reject.
2. **Activity Planning (7 Days Prior):** Coordinator submits title, topic, session format (presentation/workshop), deliverable instructions, and deadline.
3. **Faculty Advisor Approval:** Faculty advisor reviews activity plans and clicks Approve/Reject. Only approved activities unlock for check-in.
4. **Time-Limited QR Check-In:** Coordinator launches a 60-minute session that dynamically generates a 6-character rotating passcode and scannable QR code.
5. **Fast Mobile Check-In & Anti-Duplicate Guard:** Students enter passcode or scan QR code. Database locks enforce a single attendance record per user per session. Coordinators can audit-correct with mandatory explanations.
6. **Deliverable Submissions:** Enrolled students upload project repository URLs, live demos, or file links with notes.
7. **100-Point Rubric Grading:** Evaluators grade work on 3 dimensions:
   - Content & Technical Depth (0–40 pts)
   - Presentation & Clarity (0–30 pts)
   - Participation & Timeliness (0–30 pts)
   - Qualitative feedback loop immediately visible to the student.
8. **Verifiable PDF Certificates:** Issues certificates with unique verification codes (`CLYRO-ACH-XXXX`) and SHA-256 hashes, searchable publicly on `/verify`.

---

## 👥 3. Role-Based Access Control (RBAC)

Clyro provides an integrated **Persona / Role Switcher** in the top navigation bar to facilitate instant evaluation across all 6 roles:

| Role | Persona Name & Email | Primary Permissions |
| :--- | :--- | :--- |
| **College Admin** | Dr. Sarah Jenkins (`admin@msot.edu`) | Institution-wide dashboards, all 8 organizations, global exports |
| **Campus Manager** | Marcus Vance (`cm@msot.edu`) | Campus oversight, Duty Leave approvals, executive review |
| **Society Admin** | Elena Rostova (`society@msot.edu`) | Consolidated dashboard over the 4 society sub-clubs |
| **Faculty Advisor** | Prof. Alan Turing (`advisor@msot.edu`) | Review activity plans, rubric-grade submissions, issue certificates |
| **Student Coordinator** | Priya Sharma (`coordinator@msot.edu`) | Manage assigned club, launch QR check-in, audit attendance |
| **Student** | Alex Rivera (`student@msot.edu`) | Browse clubs, scan QR check-in, submit work, download transcript |

---

## 🚀 4. Quick Start & Execution

### Prerequisites
- Node.js 18+ (tested on Node v26)
- npm or pnpm

### Installation
```bash
# 1. Clone repository
git clone https://github.com/piyushkumar5498818-create/Clyro.git
cd Clyro

# 2. Install dependencies
npm install

# 3. Environment configuration (optional: runs out of the box in demo mode)
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the landing page or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the unified console.

---

## 🧪 5. Testing & Verification Suites

### Core Workflow Integrity Suite (28 Tests)
Executes end-to-end assertions covering the relational model, duplicate protections, rubric bounds, activity approvals, and tamper checks:
```bash
npm test
```
*Result: 28 / 28 Passed (100% success).*

### High-Concurrency Spike Load Test (500 Users)
Simulates Saturday morning peak check-in traffic (100, 300, and 500 concurrent check-ins):
```bash
npm run test:load
```
*Result: p95 latency < 0.05ms (Requirement: < 1,000ms), 0% unexpected failures.*

### Production Build
Verifies TypeScript validity and static route generation for all pages:
```bash
npm run build
```

---

## 📚 6. Documentation Index

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture, data flow, and hierarchy tree.
- [docs/DATABASE.md](docs/DATABASE.md) — Entity-relationship schema, SQL migrations, and RLS policies.
- [docs/TEST_REPORT.md](docs/TEST_REPORT.md) — Detailed test execution log, assertions matrix, and load test benchmarks.
- [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) — Step-by-step walkthrough of the user journey.
- [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql) — Production PostgreSQL Supabase migration.
- [supabase/seed.sql](supabase/seed.sql) — Pre-configured seed data for all campuses, clubs, and personas.

---

## 📄 License
This project is licensed under the MIT License.
