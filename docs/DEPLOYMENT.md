# Clyro Deployment & Production Readiness Guide

## 1. Environment Configuration

Copy the template into your local or hosting environment:
```bash
cp .env.example .env.local
```

### Required Variables
| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Canonical URL of deployed application | `http://localhost:3000` or `https://clyro.mirai.edu` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous Key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged service role key | `eyJhbGciOi...` *(Never expose to browser)* |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`| S3/Supabase Storage bucket for deliverables | `club-submissions` |
| `NEXT_PUBLIC_DEMO_MODE` | Enables local simulated persona switcher | `true` for development/testing; `false` in production |

---

## 2. Database Provisioning & Migrations

### A. Applying Schema to Supabase PostgreSQL
1. Open your Supabase SQL Editor (or connect via `psql`).
2. Execute `supabase/migrations/001_initial_schema.sql` to create all custom enum types, tables, foreign keys, indexes, and Row Level Security (RLS) policies.
3. Execute `supabase/seed.sql` to populate initial campus records, the 3 organizations (NEX-CELL, Kaizen Tech, MALHAR), the 6 Kaizen domains, the 5 MALHAR departments, the 6 NEX-CELL initiatives, and initial test personas.

### B. In-Memory / Local Fallback Mode
When Supabase credentials are not supplied, Clyro automatically activates its resilient in-memory ledger engine. This engine adheres to the exact same relational constraints, duplicate check-in guards, and non-double-counting aggregations, allowing seamless offline evaluation and test execution.

---

## 3. Initial Administrator & Persona Provisioning

Initial administrative and leadership personas pre-configured in seed data:
- **College Admin:** Dr. Sarah Jenkins (`admin@mirai.edu`)
- **Campus Manager:** Marcus Vance (`cm@mirai.edu`)
- **Faculty Advisors:** Prof. Alan Turing (`advisor.tech@mirai.edu`), Prof. Maya Angelou (`advisor.ecell@mirai.edu`), Prof. Ravi Shankar (`advisor.cultural@mirai.edu`)
- **Student Coordinators:** Arman Mehta (`nexcell.lead@mirai.edu`), Priya Sharma (`kaizen.lead@mirai.edu`), Elena Rostova (`malhar.president@mirai.edu`)
- **Student:** Alex Rivera (`alex.student@mirai.edu`)

---

## 4. Security & Production Lockdown

1. **Persona Switcher Isolation:** In production (`NODE_ENV === 'production'` and `NEXT_PUBLIC_DEMO_MODE !== 'true'`), the `switchUserAction` server action is completely blocked and rejects user switching.
2. **Server-Side Validation:** All server actions in `src/actions/` perform independent identity checks, permission authorization, and organization scoping.
3. **Public Endpoint Scoping:** The public certificate verification route (`/verify`) executes scoped queries and never exposes student email addresses, private files, or unrelated records.

---

## 5. Verification & Testing Instructions

Run the test commands to verify system integrity before deploying:
```bash
# 1. Run core organizational integrity & workflow suite (35 tests)
npm test

# 2. Run Saturday morning spike concurrency load test (500 users)
npm run test:load

# 3. Compile optimized production build
npm run build
```

---

## 6. Hosting Deployment (Vercel)

1. Push your changes to GitHub repository `main` branch.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DEMO_MODE=true` for preview or `false` for production).
4. Click **Deploy**. Next.js App Router will generate optimized static and server-rendered routes automatically.
