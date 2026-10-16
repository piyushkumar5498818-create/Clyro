# Clyro Implementation Plan: Mirai School of Technology

## 1. Executive Summary & Objective
Transform the initial Clyro prototype into a production-grade, secure, multi-tenant college club and society operations platform specifically mapped to the real organizations at **Mirai School of Technology (MSOT)**:
1. **NEX-CELL** — Entrepreneurship Club (Initiative-driven: Founders Fire, Scrap to Scale, Masterminds, Founder Talks, The Mirage, Open Build)
2. **Kaizen Tech** — Technical Club (6 Domains: Web, AI/ML, CP, Mobile, Open Source, UI/UX)
3. **MALHAR** — Cultural Society (5 Departments: Management, Media, Tech, Designing, PR)

---

## 2. Gap Analysis (Current Prototype vs. Target State)

| Dimension | Current Prototype | Target Mirai State | Action Required |
| :--- | :--- | :--- | :--- |
| **Organizations** | 4 generic clubs (CP, Robotics, Debating, Fictional Society with 4 sub-clubs) | 3 Primary Organizations: NEX-CELL, Kaizen Tech, MALHAR | Replace generic seed with real organizations & typed units |
| **Organizational Units** | Rigid parent-child clubs | Dynamic typed units: `department` (MALHAR), `technical_domain` (Kaizen), `initiative` (NEX-CELL) | Refactor relational model to support Organization & Org Units |
| **Authentication** | Process-wide global active user switcher | Supabase Auth + Session validation with scoped identity | Implement real session validation; isolate demo switcher to dev-only |
| **RBAC** | Flat role enum on profiles | Scoped roles: Global vs. Org-level vs. Unit-level (e.g. Domain Lead, Dept Head) | Implement `RBAC_MATRIX.md` with server-side permission checks |
| **Attendance** | Basic QR token check-in | Cryptographic token, server-side expiry, duplicate prevention, late-flagging, audit log | Harden attendance server actions & constraint checks |
| **Rubric Scoring** | Fixed 40/30/30 rubric | Configurable rubric templates per organization type | Allow customizable rubrics per activity/initiative |
| **Certificates** | Client-generated PDF with dummy hash | Cryptographic SHA-256 digest of generated PDF, scoped public verification | Real SHA-256 computation over PDF buffer, verify route |
| **Events & Teams** | Basic activity model | Full event registration, team formation, duplicate prevention | Event & team registration workflows |

---

## 3. Phased Execution Roadmap

### Phase 1: Organization Configuration & Schema (`feat/organisation-model`)
- Create `docs/ORGANISATIONAL_MODEL.md`, `docs/RBAC_MATRIX.md`, `docs/OPEN_QUESTIONS.md`.
- Redesign database schema to support:
  - `organizations` (NEX-CELL, Kaizen Tech, MALHAR)
  - `organization_units` (Domains, Departments, Tracks)
  - `initiatives` (Recurring programs for NEX-CELL)
  - `organization_memberships` and `unit_assignments`
- Update `supabase/migrations/` with clean forward migration.
- Provide comprehensive seed data representing the real organizations, initiatives, domains, and departments.

### Phase 2: Identity & Security (`feat/auth-rbac`)
- Formalize authorization layer in `src/lib/auth.ts` separating authenticated identity, user profile, organization membership, and assigned roles.
- Enforce server-side authorization guards on all server actions.
- Lock demo role switcher behind `NEXT_PUBLIC_DEMO_MODE === 'true'` (disabled in production).
- Verify Row Level Security (RLS) SQL policies.

### Phase 3: Persistent Data Layer & Workflows (`feat/club-workflows`)
- Adapt `src/lib/store.ts` and server actions (`actions/organizations.ts`, `actions/units.ts`, `actions/initiatives.ts`, `actions/activities.ts`, `actions/attendance.ts`, `actions/submissions.ts`, `actions/evaluations.ts`).
- Support startup pitch / MVP submissions for NEX-CELL, technical project reviews for Kaizen, and event task / audition management for MALHAR.
- Enforce strict duplicate check-in guards, attendance audit log with mandatory reasons.

### Phase 4: Frontend Adaptation & Custom Workflows (`feat/events-certificates`)
- Update UI components to showcase:
  - NEX-CELL Initiatives Hub (Founders Fire, Scrap to Scale, etc.)
  - Kaizen Tech Domains (Web, AI/ML, CP, Mobile, Open Source, UI/UX) with Domain Lead badges
  - MALHAR Cultural Departments (Management, Media, Tech, Designing, PR) with Department Head hierarchy
- Interactive event registration and team formation module.
- Verifiable certificate issuance with real SHA-256 digest calculation and public verification on `/verify`.

### Phase 5: Testing, Hardening & Delivery (`test/security-and-integrity`)
- Expand test suite in `scripts/test-workflow.ts` covering all 3 real organizations and their workflows.
- Execute load testing at 100, 300, 500 concurrent check-ins.
- Verify production build `npm run build`.
- Update all documentation files: `README.md`, `ARCHITECTURE.md`, `DATABASE.md`, `TEST_REPORT.md`, `DEPLOYMENT.md`.
