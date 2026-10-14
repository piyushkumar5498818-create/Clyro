-- Clyro: College Club Activities Tracker
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Custom Enum Types
CREATE TYPE user_role AS ENUM (
    'college_admin',
    'campus_manager',
    'society_admin',
    'faculty_advisor',
    'student_coordinator',
    'student'
);

CREATE TYPE membership_type AS ENUM ('primary', 'secondary');
CREATE TYPE membership_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE activity_format AS ENUM ('presentation', 'workshop', 'hackathon', 'competition', 'assignment');
CREATE TYPE activity_status AS ENUM ('draft', 'submitted_for_approval', 'approved', 'rejected', 'completed');
CREATE TYPE attendance_status AS ENUM ('present', 'late', 'excused', 'absent');
CREATE TYPE check_in_method AS ENUM ('qr_code', 'passcode', 'coordinator_manual');
CREATE TYPE submission_type AS ENUM ('file', 'link', 'text');
CREATE TYPE certificate_type AS ENUM ('participation', 'achievement', 'merit');

-- 2. Campuses Table
CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Profiles Table (Extends Auth Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    student_id TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Clubs Table (Hierarchical: parent_club_id models Society -> Sub-clubs)
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_society BOOLEAN NOT NULL DEFAULT FALSE,
    parent_club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    faculty_advisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    capacity INTEGER NOT NULL DEFAULT 50,
    meeting_rules TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_parent_not_self CHECK (parent_club_id != id)
);

-- 5. Club Coordinators Table
CREATE TABLE club_coordinators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (club_id, user_id)
);

-- 6. Club Memberships Table
CREATE TABLE club_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    membership_type membership_type NOT NULL DEFAULT 'primary',
    status membership_status NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    UNIQUE (club_id, user_id)
);

-- 7. Activities Table (Club Day Sessions)
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    format activity_format NOT NULL DEFAULT 'presentation',
    deliverable_description TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue TEXT NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    status activity_status NOT NULL DEFAULT 'draft',
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Attendance Tokens (Time-limited Rotating Check-in)
CREATE TABLE attendance_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    token_code TEXT NOT NULL UNIQUE,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Attendance Records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'present',
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_in_method check_in_method NOT NULL DEFAULT 'qr_code',
    correction_reason TEXT,
    corrected_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    UNIQUE (activity_id, user_id)
);

-- 10. Submissions Table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    submission_type submission_type NOT NULL DEFAULT 'link',
    file_url TEXT,
    link_url TEXT,
    notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (activity_id, user_id)
);

-- 11. Evaluations Table (Rubric Scoring)
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    score_content INTEGER NOT NULL CHECK (score_content BETWEEN 0 AND 40),
    score_presentation INTEGER NOT NULL CHECK (score_presentation BETWEEN 0 AND 30),
    score_participation INTEGER NOT NULL CHECK (score_participation BETWEEN 0 AND 30),
    total_score NUMERIC(5,2) GENERATED ALWAYS AS (score_content + score_presentation + score_participation) STORED,
    feedback TEXT,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (submission_id)
);

-- 12. Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    certificate_type certificate_type NOT NULL DEFAULT 'participation',
    title TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    verification_code TEXT NOT NULL UNIQUE,
    pdf_hash TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for High Performance
CREATE INDEX idx_clubs_parent ON clubs(parent_club_id);
CREATE INDEX idx_clubs_campus ON clubs(campus_id);
CREATE INDEX idx_club_memberships_user ON club_memberships(user_id);
CREATE INDEX idx_club_memberships_club ON club_memberships(club_id);
CREATE INDEX idx_activities_club ON activities(club_id);
CREATE INDEX idx_activities_date ON activities(scheduled_date);
CREATE INDEX idx_attendance_activity_user ON attendance_records(activity_id, user_id);
CREATE INDEX idx_submissions_activity_user ON submissions(activity_id, user_id);
CREATE INDEX idx_certificates_code ON certificates(verification_code);

-- Enable Row Level Security (RLS)
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Base Public Read Policies
CREATE POLICY "Public Read Campuses" ON campuses FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Clubs" ON clubs FOR SELECT USING (true);
CREATE POLICY "Public Read Activities" ON activities FOR SELECT USING (status = 'approved' OR status = 'completed');
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (true);
