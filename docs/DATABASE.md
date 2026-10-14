# Clyro Database Schema Specification

## Relational Entity Model

### 1. `campuses`
- `id` (UUID, PK)
- `name` (TEXT)
- `code` (TEXT, UNIQUE)
- `created_at` (TIMESTAMP)

### 2. `profiles`
- `id` (UUID, PK, references auth.users)
- `email` (TEXT, UNIQUE)
- `full_name` (TEXT)
- `role` (ENUM: `college_admin`, `campus_manager`, `society_admin`, `faculty_advisor`, `student_coordinator`, `student`)
- `campus_id` (UUID, FK -> campuses)
- `student_id` (TEXT, optional)
- `created_at` (TIMESTAMP)

### 3. `clubs`
- `id` (UUID, PK)
- `campus_id` (UUID, FK -> campuses)
- `name` (TEXT)
- `description` (TEXT)
- `is_society` (BOOLEAN, default false)
- `parent_club_id` (UUID, FK -> clubs.id, NULL for top-level organizations)
- `faculty_advisor_id` (UUID, FK -> profiles.id)
- `capacity` (INTEGER)
- `meeting_rules` (TEXT)
- `created_at` (TIMESTAMP)

### 4. `club_coordinators`
- `id` (UUID, PK)
- `club_id` (UUID, FK -> clubs.id)
- `user_id` (UUID, FK -> profiles.id)
- `assigned_at` (TIMESTAMP)
- UNIQUE (`club_id`, `user_id`)

### 5. `club_memberships`
- `id` (UUID, PK)
- `club_id` (UUID, FK -> clubs.id)
- `user_id` (UUID, FK -> profiles.id)
- `membership_type` (ENUM: `primary`, `secondary`)
- `status` (ENUM: `pending`, `approved`, `rejected`)
- `requested_at` (TIMESTAMP)
- `reviewed_at` (TIMESTAMP)
- `reviewed_by` (UUID, FK -> profiles.id)
- UNIQUE (`club_id`, `user_id`)

### 6. `activities`
- `id` (UUID, PK)
- `club_id` (UUID, FK -> clubs.id)
- `title` (TEXT)
- `topic` (TEXT)
- `format` (ENUM: `presentation`, `workshop`, `hackathon`, `competition`, `assignment`)
- `deliverable_description` (TEXT)
- `scheduled_date` (DATE)
- `start_time` (TIME)
- `end_time` (TIME)
- `venue` (TEXT)
- `submission_deadline` (TIMESTAMP)
- `status` (ENUM: `draft`, `submitted_for_approval`, `approved`, `rejected`, `completed`)
- `approved_by` (UUID, FK -> profiles.id)
- `created_by` (UUID, FK -> profiles.id)
- `created_at` (TIMESTAMP)

### 7. `attendance_tokens`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `token_code` (TEXT, UNIQUE)
- `valid_from` (TIMESTAMP)
- `valid_until` (TIMESTAMP)
- `created_by` (UUID, FK -> profiles.id)

### 8. `attendance_records`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `user_id` (UUID, FK -> profiles.id)
- `status` (ENUM: `present`, `late`, `excused`, `absent`)
- `check_in_time` (TIMESTAMP)
- `check_in_method` (ENUM: `qr_code`, `passcode`, `coordinator_manual`)
- `correction_reason` (TEXT, NULLABLE)
- `corrected_by` (UUID, FK -> profiles.id)
- UNIQUE (`activity_id`, `user_id`)

### 9. `submissions`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `user_id` (UUID, FK -> profiles.id)
- `submission_type` (ENUM: `file`, `link`, `text`)
- `file_url` (TEXT)
- `link_url` (TEXT)
- `notes` (TEXT)
- `submitted_at` (TIMESTAMP)
- UNIQUE (`activity_id`, `user_id`)

### 10. `evaluations`
- `id` (UUID, PK)
- `submission_id` (UUID, FK -> submissions.id)
- `evaluator_id` (UUID, FK -> profiles.id)
- `score_content` (INTEGER)
- `score_presentation` (INTEGER)
- `score_participation` (INTEGER)
- `total_score` (NUMERIC)
- `feedback` (TEXT)
- `evaluated_at` (TIMESTAMP)
- UNIQUE (`submission_id`)

### 11. `certificates`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> profiles.id)
- `club_id` (UUID, FK -> clubs.id)
- `certificate_type` (ENUM: `participation`, `achievement`, `merit`)
- `title` (TEXT)
- `issue_date` (DATE)
- `verification_code` (TEXT, UNIQUE)
- `pdf_hash` (TEXT)
- `created_at` (TIMESTAMP)
