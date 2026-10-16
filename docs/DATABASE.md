# Clyro Database Schema Specification: Mirai School of Technology

## Relational Entity Model

### 1. `campuses`
- `id` (UUID, PK)
- `name` (TEXT)
- `code` (TEXT, UNIQUE)
- `location` (TEXT)
- `created_at` (TIMESTAMP)

### 2. `profiles`
- `id` (UUID, PK, references auth.users)
- `email` (TEXT, UNIQUE)
- `full_name` (TEXT)
- `role` (ENUM: `college_admin`, `campus_manager`, `faculty_advisor`, `society_admin`, `student_coordinator`, `unit_lead`, `student`)
- `campus_id` (UUID, FK -> campuses)
- `student_id` (TEXT, optional)
- `title` (TEXT, optional, e.g. "President", "Media Head", "Domain Lead")
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. `organizations`
- `id` (UUID, PK)
- `campus_id` (UUID, FK -> campuses)
- `name` (TEXT)
- `short_name` (TEXT, UNIQUE) — e.g. "NEX-CELL", "Kaizen Tech", "MALHAR"
- `description` (TEXT)
- `type` (ENUM: `entrepreneurship_club`, `technical_club`, `cultural_society`)
- `faculty_advisor_id` (UUID, FK -> profiles.id)
- `capacity` (INTEGER)
- `meeting_rules` (TEXT)
- `created_at` (TIMESTAMP)

### 4. `organization_units`
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations.id)
- `name` (TEXT) — e.g. "Full-Stack Web Development", "Media"
- `code` (TEXT) — e.g. "WEB", "MEDIA"
- `type` (ENUM: `technical_domain`, `department`, `initiative_track`)
- `description` (TEXT)
- `lead_id` (UUID, FK -> profiles.id)
- `capacity` (INTEGER)
- UNIQUE (`organization_id`, `code`)

### 5. `initiatives`
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations.id)
- `name` (TEXT) — e.g. "Founders Fire", "Scrap to Scale"
- `code` (TEXT) — e.g. "FIRE", "SCALE"
- `description` (TEXT)
- `format` (TEXT)
- `status` (TEXT, default 'active')
- UNIQUE (`organization_id`, `code`)

### 6. `organization_memberships`
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations.id)
- `user_id` (UUID, FK -> profiles.id)
- `membership_type` (ENUM: `primary`, `secondary`)
- `status` (ENUM: `pending`, `approved`, `rejected`)
- `requested_at` (TIMESTAMP)
- `reviewed_at` (TIMESTAMP)
- `reviewed_by` (UUID, FK -> profiles.id)
- UNIQUE (`organization_id`, `user_id`)

### 7. `unit_assignments`
- `id` (UUID, PK)
- `unit_id` (UUID, FK -> organization_units.id)
- `user_id` (UUID, FK -> profiles.id)
- `role` (TEXT: `lead`, `member`)
- `assigned_at` (TIMESTAMP)
- UNIQUE (`unit_id`, `user_id`)

### 8. `activities`
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations.id)
- `unit_id` (UUID, FK -> organization_units.id, NULLABLE)
- `initiative_id` (UUID, FK -> initiatives.id, NULLABLE)
- `title` (TEXT)
- `topic` (TEXT)
- `format` (ENUM: `presentation`, `workshop`, `hackathon`, `pitch_session`, `audition`, `competition`, `assignment`)
- `deliverable_description` (TEXT)
- `scheduled_date` (DATE)
- `start_time` (TIME)
- `end_time` (TIME)
- `venue` (TEXT)
- `submission_deadline` (TIMESTAMP)
- `status` (ENUM: `draft`, `submitted_for_approval`, `approved`, `rejected`, `completed`)
- `approved_by` (UUID, FK -> profiles.id)
- `rubric_criteria` (JSONB)
- `created_by` (UUID, FK -> profiles.id)

### 9. `attendance_tokens`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `token_code` (TEXT, UNIQUE)
- `valid_from` (TIMESTAMP)
- `valid_until` (TIMESTAMP)
- `created_by` (UUID, FK -> profiles.id)

### 10. `attendance_records`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `user_id` (UUID, FK -> profiles.id)
- `status` (ENUM: `present`, `late`, `excused`, `absent`)
- `check_in_time` (TIMESTAMP)
- `check_in_method` (ENUM: `qr_code`, `passcode`, `coordinator_manual`)
- `correction_reason` (TEXT, NULLABLE)
- `corrected_by` (UUID, FK -> profiles.id)
- UNIQUE (`activity_id`, `user_id`)

### 11. `submissions`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `user_id` (UUID, FK -> profiles.id)
- `submission_type` (ENUM: `file`, `link`, `text`)
- `file_url` (TEXT)
- `link_url` (TEXT)
- `notes` (TEXT)
- `submitted_at` (TIMESTAMP)
- UNIQUE (`activity_id`, `user_id`)

### 12. `evaluations`
- `id` (UUID, PK)
- `submission_id` (UUID, FK -> submissions.id)
- `evaluator_id` (UUID, FK -> profiles.id)
- `score_breakdown` (JSONB)
- `total_score` (NUMERIC)
- `feedback` (TEXT)
- `evaluated_at` (TIMESTAMP)
- UNIQUE (`submission_id`)

### 13. `teams`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `name` (TEXT)
- `lead_user_id` (UUID, FK -> profiles.id)
- `member_user_ids` (UUID[])
- `created_at` (TIMESTAMP)

### 14. `certificates`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> profiles.id)
- `organization_id` (UUID, FK -> organizations.id)
- `activity_id` (UUID, FK -> activities.id)
- `certificate_type` (ENUM: `participation`, `achievement`, `merit`)
- `title` (TEXT)
- `issue_date` (DATE)
- `verification_code` (TEXT, UNIQUE)
- `pdf_hash` (TEXT)
- `created_at` (TIMESTAMP)
