# Clyro — College Club Activities Tracker

> Autonomous college platform for multi-tier club hierarchies, attendance verification, activity management, submission evaluation, and tamper-evident transcripts.

## Features
- **Multi-Level Organization Hierarchy:** 4 top-level campus clubs, including a parent Society governing 4 independent sub-clubs.
- **Role-Based Access Control:** Strict authorization across 6 distinct user roles (College Admin, Campus Manager, Society Admin, Faculty Advisor, Student Coordinator, Student).
- **Club Day Workflow:** 7-stage verifiable cycle: Activity Planning &rarr; Advisor Review &rarr; Announcement &rarr; Time-Limited QR Check-In &rarr; Submissions &rarr; Rubric Evaluation &rarr; Monthly Reporting.
- **Security & Integrity:** Dynamic time-based QR codes, tamper-evident certificate hashes, and duplicate prevention.
- **Dashboards:** Dedicated views for students, coordinators, advisors, society leadership, and college administrators.

## Tech Stack
- **Frontend:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Database:** Next.js Server Actions, PostgreSQL / Supabase, Row Level Security (RLS).
- **Export & Storage:** jsPDF for verifiable PDF transcripts and certificates, S3/Supabase Storage for uploads.

## Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local

# 3. Run development server
npm run dev

# 4. Build for production
npm run build
```
