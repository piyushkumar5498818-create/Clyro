# Clyro — Mirai School of Technology Club Activities Tracker

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Clyro** is a college Club Activities Tracker engineered to manage multi-tenant club organizations, specialized units (domains & departments), recurring initiatives, session planning, time-limited QR attendance check-in, dynamic rubric evaluations, and tamper-evident certificate issuance for **Mirai School of Technology (MSOT)**.

---

## 🏛️ 1. Institutional Organization Hierarchy

Clyro accurately models the 3 official student organizations at Mirai School of Technology:

### A. NEX-CELL — Entrepreneurship Club
- **Focus:** Startup incubation, venture building, founder networking, and pitch sessions.
- **6 Flagship Initiatives:**
  1. *Founders Fire:* High-stakes pitch sessions with angel mentors and operator feedback.
  2. *Scrap to Scale:* Rapid prototyping incubator guiding zero-to-one MVP production.
  3. *Masterminds:* Bi-weekly peer accountability pods tracking MRR, traction, and user retention.
  4. *Founder Talks:* Fireside discussions with unicorn founders, VC partners, and alumni.
  5. *The Mirage:* Mirai's flagship 48-hour innovation sprint and venture competition.
  6. *Open Build:* Recurring collaborative building sessions and pair programming for founders.

### B. Kaizen Tech — Technical Club
- **Focus:** Full-stack engineering, applied machine learning, competitive programming, and OSS.
- **6 Technical Domains:**
  1. *Full-Stack Web Development* (`WEB`)
  2. *Applied AI/ML* (`AI_ML`)
  3. *Competitive Programming* (`CP`)
  4. *Mobile App Development* (`MOBILE`)
  5. *Open Source* (`OSS`)
  6. *UI/UX Design* (`UIUX`)

### C. MALHAR — Cultural Society
- **Focus:** Campus fests, live stagecraft, event media, branding design, and performing arts.
- **5 Operating Departments:**
  1. *Management* (`MGMT`)
  2. *Media* (`MEDIA`)
  3. *Tech* (`TECH`)
  4. *Designing* (`DESIGN`)
  5. *Public Relations* (`PR`)

> **Double-Counting Prevention:** College-wide and Society-level reports automatically aggregate distinct student IDs via unique sets to ensure accurate representation without duplication across multiple club memberships or departments.

---

## 🔄 2. Complete End-to-End Club Day Workflow

Every session strictly adheres to the verifiable 7-step lifecycle:
1. **Membership Enrolment:** Students browse clubs and request membership with institutional limit enforcement (Max 2 organizations). Coordinators approve or reject.
2. **Activity Planning (7 Days Prior):** Coordinator submits title, topic, session format (workshop, pitch session, hackathon), deliverable instructions, and deadline.
3. **Faculty Advisor Approval:** Faculty advisor reviews activity plans and clicks Approve/Reject. Only approved activities unlock for check-in.
4. **Time-Limited QR Check-In:** Coordinator launches a 60-minute session that dynamically generates a 6-character rotating passcode and scannable QR code.
5. **Fast Mobile Check-In & Anti-Duplicate Guard:** Students enter passcode or scan QR code. Database locks enforce a single attendance record per user per session. Coordinators can audit-correct with mandatory explanations.
6. **Deliverable Submissions:** Enrolled students upload project repository URLs, live demos, or file links with notes.
7. **Dynamic Rubric Grading:** Evaluators grade work on customizable multi-criteria rubrics (e.g. 4-part pitch rubric for Founders Fire, 3-part technical rubric for Kaizen).
8. **Verifiable PDF Certificates:** Issues certificates with unique verification codes (`CLYRO-XXX-XXXX`) and SHA-256 hashes, searchable publicly on `/verify`.

---

## 👥 3. Role-Based Access Control (RBAC) & Personas

Clyro provides an integrated **Persona / Role Switcher** in the top navigation bar to facilitate instant evaluation across all institutional roles:

| Role | Persona Name & Email | Primary Permissions |
| :--- | :--- | :--- |
| **College Admin** | Dr. Sarah Jenkins (`admin@mirai.edu`) | Institution-wide dashboards, all 3 organizations, global exports |
| **Campus Manager** | Marcus Vance (`cm@mirai.edu`) | Campus oversight, Duty Leave approvals, executive review |
| **Faculty Advisor (Tech)** | Prof. Alan Turing (`advisor.tech@mirai.edu`) | Kaizen Tech activity plan approvals, technical rubric evaluations |
| **Faculty Advisor (E-Cell)**| Prof. Maya Angelou (`advisor.ecell@mirai.edu`) | NEX-CELL pitch approvals, venture mentor scoring |
| **Faculty Advisor (Cultural)**| Prof. Ravi Shankar (`advisor.cultural@mirai.edu`)| MALHAR stage & fest approvals, certificate sign-offs |
| **NEX-CELL Student Lead** | Arman Mehta (`nexcell.lead@mirai.edu`) | Manage NEX-CELL initiatives, pitch sessions, founder teams |
| **Kaizen Lead & AI Coord** | Priya Sharma (`kaizen.lead@mirai.edu`) | Manage Kaizen Tech domains, launch QR check-in, audit attendance |
| **MALHAR Society President**| Elena Rostova (`malhar.president@mirai.edu`) | Oversee MALHAR departments, stagecraft, media galleries |
| **Student Engineer** | Alex Rivera (`alex.student@mirai.edu`) | Browse clubs, scan QR check-in, submit work, download transcript |

---

## 🚀 4. Quick Start & Execution

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (runs out of the box in demo mode)
cp .env.example .env.local

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the landing page or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the unified console.

---

## 🧪 5. Testing & Verification Suites

### Core Organizational Integrity & Workflow Suite (35 Tests)
```bash
npm test
```
*Result: 35 / 35 Passed (100% success).*

### High-Concurrency Spike Load Test (500 Users)
Simulates Saturday morning peak check-in traffic (100, 300, and 500 concurrent check-ins):
```bash
npm run test:load
```
*Result: p95 latency < 0.02ms (Requirement: < 1,000ms), 0% unexpected failures.*

### Production Build
```bash
npm run build
```

---

## 📚 6. Documentation Index

- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) — Detailed gap analysis and implementation roadmap.
- [docs/ORGANISATIONAL_MODEL.md](docs/ORGANISATIONAL_MODEL.md) — Institutional model for NEX-CELL, Kaizen Tech, and MALHAR.
- [docs/RBAC_MATRIX.md](docs/RBAC_MATRIX.md) — Granular permissions matrix across all institutional personas.
- [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) — Institutional assumptions and configurable policy defaults.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture, data flow, and request pipeline.
- [docs/DATABASE.md](docs/DATABASE.md) — Entity-relationship schema, SQL migrations, and RLS policies.
- [docs/TEST_REPORT.md](docs/TEST_REPORT.md) — Test execution log, assertions matrix, and load test benchmarks.
- [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) — Step-by-step walkthrough of the user journey.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Production deployment and security lockdown guide.
- [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql) — Production PostgreSQL Supabase migration.
- [supabase/seed.sql](supabase/seed.sql) — Pre-configured seed data for Mirai organizations, units, and personas.

---

## 📄 License
This project is licensed under the MIT License.
