# Clyro Architecture Specification: Mirai School of Technology

## 1. System Overview
Clyro is a unified college Club Activities Tracker engineered to manage multi-tenant club organizations, specialized units (domains & departments), recurring initiatives, session planning, time-limited QR attendance check-in, dynamic rubric evaluations, and tamper-evident certificate issuance for **Mirai School of Technology (MSOT)**.

---

## 2. Institutional Organization Hierarchy

```
                            +-----------------------------------------------+
                            |             College Administration            |
                            |           (Mirai School of Technology)        |
                            +-----------------------------------------------+
                                                    |
            +---------------------------------------+---------------------------------------+
            |                                       |                                       |
+-----------------------+               +-----------------------+               +-----------------------+
|       NEX-CELL        |               |      Kaizen Tech      |               |        MALHAR         |
| (Entrepreneurship)    |               |   (Technical Club)    |               |   (Cultural Society)  |
+-----------------------+               +-----------------------+               +-----------------------+
            |                                       |                                       |
  [Flagship Initiatives]                  [6 Technical Domains]                   [5 Operating Depts]
  1. Founders Fire                        1. Full-Stack Web Dev                   1. Management
  2. Scrap to Scale                       2. Applied AI/ML                        2. Media
  3. Masterminds                          3. Competitive Prog                     3. Tech
  4. Founder Talks                        4. Mobile App Dev                       4. Designing
  5. The Mirage Sprint                    5. Open Source (OSS)                    5. Public Relations (PR)
  6. Open Build                           6. UI/UX Design
```

### Key Structural Principles
1. **Explicit Entity Taxonomy:** Differentiates between primary *Organizations*, internal *Units* (domains/departments), recurring *Initiatives*, and scheduled *Activities*.
2. **Double-Counting Prevention:** All aggregate institutional and cross-club reports utilize `COUNT(DISTINCT user_id)`, ensuring accurate student counts even when students participate across multiple organizations or units.
3. **Multi-Tenant Scoping:** Coordinators and leads possess scoped authorization strictly limited to their assigned organization or unit.

---

## 3. Technology Stack & Request Flow

- **Frontend:** Next.js 14 App Router, React 18, TypeScript 5.6, Tailwind CSS, Lucide Icons.
- **Backend & Logic:** Next.js Server Actions with server-side authorization guards.
- **Data Layer:** Supabase PostgreSQL with Row Level Security (RLS) & local persistent fallback engine.
- **Attendance Verification:** Dynamic, time-limited, rotating token generator and QR rendering.
- **Document & Certificate Generation:** Client and Server PDF rendering with SHA-256 cryptographic verification digest.

### Request Pipeline
```
[Client / Mobile] 
       │ 
       ▼
[Next.js Server Action]
       │ 
       ├─► 1. Identity & Session Verification
       ├─► 2. RBAC Scope & Permission Check
       ├─► 3. Relational Constraint & State Transition Validation
       │ 
       ▼
[Database / Ledger Engine]
       │ 
       ├─► Anti-Duplicate Database Constraint
       ├─► Audit Logging (Actor ID + Reason + Timestamp)
       └─► Atomic Commit
```
