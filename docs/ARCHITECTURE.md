# Clyro Architecture Specification

## 1. System Overview
Clyro is a unified college Club Activities Tracker engineered to manage multi-tier club hierarchies, session planning, time-limited attendance check-in, submission evaluation rubrics, and tamper-evident certificate issuance.

## 2. Multi-Tier Hierarchy Architecture
Clyro models campus organizations as a relational tree:
- **Top-Level Clubs:** Independent campus organizations (e.g., Club 1, Club 2, Club 3).
- **Society:** Top-level parent organization possessing its own administrative overview and consolidated metrics.
- **Society Sub-Clubs:** 4 independently manageable sub-clubs (e.g., Sub-club 1, Sub-club 2, Sub-club 3, Sub-club 4) linked via `parent_club_id`.
  - Independent memberships, coordinators, activities, attendance records, and evaluations.
  - Consolidated reporting at the Society level without double-counting student records.

```
       +-----------------------------------------------+
       |             College Administration            |
       +-----------------------------------------------+
           |               |               |
   +---------------+---------------+---------------+---------------+
   |    Club 1     |    Club 2     |    Club 3     |    Society    |
   +---------------+---------------+---------------+---------------+
                                                           |
                           +---------------+---------------+---------------+---------------+
                           |  Sub-Club 1   |  Sub-Club 2   |  Sub-Club 3   |  Sub-Club 4   |
                           +---------------+---------------+---------------+---------------+
```

## 3. Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS + Radix UI / shadcn design system
- **Database / Backend:** Supabase PostgreSQL with Row Level Security (RLS) & local persistent fallback engine
- **File Storage:** Supabase Storage / S3-compatible private upload storage
- **Attendance Verification:** Cryptographic time-based rotating tokens & QR generation
- **Document / Certificate Generation:** Client and Server PDF rendering with SHA-256 verification hash
