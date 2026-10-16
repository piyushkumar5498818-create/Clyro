-- Clyro: Mirai School of Technology Club Activities Tracker
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Custom Enum Types
CREATE TYPE user_role AS ENUM (
    'college_admin',
    'campus_manager',
    'faculty_advisor',
    'society_admin',
    'student_coordinator',
    'unit_lead',
    'student'
);

CREATE TYPE organization_type AS ENUM (
    'entrepreneurship_club',
    'technical_club',
    'cultural_society'
);

CREATE TYPE unit_type AS ENUM (
    'technical_domain',
    'department',
    'initiative_track'
);

CREATE TYPE membership_type AS ENUM ('primary', 'secondary');
CREATE TYPE membership_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE activity_format AS ENUM ('presentation', 'workshop', 'hackathon', 'pitch_session', 'audition', 'competition', 'assignment');
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
    title TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Organizations Table (NEX-CELL, Kaizen Tech, MALHAR)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL UNIQUE,
    description TEXT,
    type organization_type NOT NULL,
    faculty_advisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    capacity INTEGER NOT NULL DEFAULT 100,
    meeting_rules TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Organization Units Table (Domains for Kaizen, Departments for MALHAR)
CREATE TABLE organization_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    type unit_type NOT NULL,
    description TEXT,
    lead_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    capacity INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, code)
);

-- 6. Initiatives Table (NEX-CELL Programs: Founders Fire, Scrap to Scale, etc.)
CREATE TABLE initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    format TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, code)
);

-- 7. Organization Memberships Table
CREATE TABLE organization_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    membership_type membership_type NOT NULL DEFAULT 'primary',
    status membership_status NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    UNIQUE (organization_id, user_id)
);

-- 8. Unit Assignments Table (Domain or Department allocations)
CREATE TABLE unit_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES organization_units(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'lead' or 'member'
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (unit_id, user_id)
);

-- 9. Activities Table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES organization_units(id) ON DELETE SET NULL,
    initiative_id UUID REFERENCES initiatives(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    format activity_format NOT NULL DEFAULT 'workshop',
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
    rubric_criteria JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Attendance Tokens (Time-limited Rotating Tokens)
CREATE TABLE attendance_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    token_code TEXT NOT NULL UNIQUE,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Attendance Records (Enforcing Single Check-In per User per Session)
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

-- 12. Submissions Table
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

-- 13. Evaluations Table (Dynamic multi-criteria scores)
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    score_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_score NUMERIC(5,2) NOT NULL CHECK (total_score BETWEEN 0 AND 100),
    feedback TEXT,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (submission_id)
);

-- 14. Teams Table (Collaborative teams for hackathons / pitch competitions)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    lead_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_user_ids UUID[] NOT NULL DEFAULT '{}',
    project_title TEXT,
    project_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    certificate_type certificate_type NOT NULL DEFAULT 'participation',
    title TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    verification_code TEXT NOT NULL UNIQUE,
    pdf_hash TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Query Performance
CREATE INDEX idx_units_org ON organization_units(organization_id);
CREATE INDEX idx_initiatives_org ON initiatives(organization_id);
CREATE INDEX idx_memberships_user ON organization_memberships(user_id);
CREATE INDEX idx_memberships_org ON organization_memberships(organization_id);
CREATE INDEX idx_activities_org ON activities(organization_id);
CREATE INDEX idx_attendance_activity_user ON attendance_records(activity_id, user_id);
CREATE INDEX idx_submissions_activity_user ON submissions(activity_id, user_id);
CREATE INDEX idx_certificates_code ON certificates(verification_code);

-- Enable Row Level Security (RLS)
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Base Public / Authenticated Read Policies
CREATE POLICY "Public Read Campuses" ON campuses FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Public Read Units" ON organization_units FOR SELECT USING (true);
CREATE POLICY "Public Read Initiatives" ON initiatives FOR SELECT USING (true);
CREATE POLICY "Public Read Approved Activities" ON activities FOR SELECT USING (status = 'approved' OR status = 'completed');
CREATE POLICY "Public Read Verified Certificates" ON certificates FOR SELECT USING (true);
