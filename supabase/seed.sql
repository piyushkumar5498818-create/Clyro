-- Clyro: Seed Data
-- Seed: 002_seed_data.sql

-- 1. Campus
INSERT INTO campuses (id, name, code, location) VALUES
('c0000000-0000-0000-0000-000000000001', 'MSOT Central Campus', 'MSOT-CENTRAL', 'Academic Block A');

-- 2. Profiles (Demonstrating all 6 Roles)
INSERT INTO profiles (id, email, full_name, role, campus_id, student_id) VALUES
('u0000000-0000-0000-0000-000000000001', 'admin@msot.edu', 'Dr. Sarah Jenkins', 'college_admin', 'c0000000-0000-0000-0000-000000000001', NULL),
('u0000000-0000-0000-0000-000000000002', 'cm@msot.edu', 'Marcus Vance', 'campus_manager', 'c0000000-0000-0000-0000-000000000001', NULL),
('u0000000-0000-0000-0000-000000000003', 'society@msot.edu', 'Elena Rostova', 'society_admin', 'c0000000-0000-0000-0000-000000000001', NULL),
('u0000000-0000-0000-0000-000000000004', 'advisor@msot.edu', 'Prof. Alan Turing', 'faculty_advisor', 'c0000000-0000-0000-0000-000000000001', NULL),
('u0000000-0000-0000-0000-000000000005', 'coordinator@msot.edu', 'Priya Sharma', 'student_coordinator', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-001'),
('u0000000-0000-0000-0000-000000000006', 'student@msot.edu', 'Alex Rivera', 'student', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-042');

-- 3. Top-Level Clubs (3 Independent Clubs + 1 Society)
INSERT INTO clubs (id, campus_id, name, description, category, is_society, parent_club_id, faculty_advisor_id, capacity, meeting_rules) VALUES
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Club 1 (Competitive Programming)', 'Algorithms, competitive programming, and interview problem solving.', 'Technical', FALSE, NULL, 'u0000000-0000-0000-0000-000000000004', 60, 'Weekly contests every Wednesday 5 PM'),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Club 2 (Robotics & IoT)', 'Hardware prototypes, embedded C, microcontrollers, and automation.', 'Engineering', FALSE, NULL, 'u0000000-0000-0000-0000-000000000004', 45, 'Lab sessions alternate Thursdays'),
('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Club 3 (Debating & Literary)', 'Parliamentary debates, public speaking, model UN, and creative writing.', 'Cultural', FALSE, NULL, 'u0000000-0000-0000-0000-000000000004', 50, 'Sessions on Friday evenings'),
('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Society (Technical & Innovation Society)', 'Apex society fostering multidisciplinary computer science and technology domains.', 'Society', TRUE, NULL, 'u0000000-0000-0000-0000-000000000004', 200, 'Governing council meets monthly');

-- 4. Society Sub-Clubs (4 Sub-clubs under the Society)
INSERT INTO clubs (id, campus_id, name, description, category, is_society, parent_club_id, faculty_advisor_id, capacity, meeting_rules) VALUES
('b0000000-0000-0000-0000-000000000101', 'c0000000-0000-0000-0000-000000000001', 'Society Sub-club 1 (Web & Cloud)', 'Full stack engineering, cloud platforms, DevOps, and scalable systems.', 'Technical', FALSE, 'b0000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000004', 50, 'Saturdays 10:00 AM - 12:00 PM'),
('b0000000-0000-0000-0000-000000000102', 'c0000000-0000-0000-0000-000000000001', 'Society Sub-club 2 (AI & Data Science)', 'Neural networks, generative models, computer vision, and applied ML.', 'Technical', FALSE, 'b0000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000004', 50, 'Saturdays 1:00 PM - 3:00 PM'),
('b0000000-0000-0000-0000-000000000103', 'c0000000-0000-0000-0000-000000000001', 'Society Sub-club 3 (Cybersecurity)', 'Ethical hacking, cryptography, vulnerability assessment, and defense.', 'Technical', FALSE, 'b0000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000004', 40, 'Saturdays 3:30 PM - 5:30 PM'),
('b0000000-0000-0000-0000-000000000104', 'c0000000-0000-0000-0000-000000000001', 'Society Sub-club 4 (Game Dev & Creative)', 'Game design, 3D modelling, shaders, and real-time interactive rendering.', 'Creative', FALSE, 'b0000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000004', 40, 'Saturdays 11:00 AM - 1:00 PM');

-- 5. Coordinators
INSERT INTO club_coordinators (id, club_id, user_id) VALUES
('k0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000101', 'u0000000-0000-0000-0000-000000000005');

-- 6. Memberships
INSERT INTO club_memberships (id, club_id, user_id, membership_type, status) VALUES
('m0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000101', 'u0000000-0000-0000-0000-000000000006', 'primary', 'approved');

-- 7. Sample Activity (Approved Club Day Session)
INSERT INTO activities (
    id, club_id, title, topic, format, deliverable_description,
    scheduled_date, start_time, end_time, venue, submission_deadline, status,
    approved_by, approved_at, created_by
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000101',
    'Club Day 1: Cloud Architecture & Serverless',
    'Serverless Microservices and Edge Deployment',
    'presentation',
    'Upload architecture slide deck (PDF or link) + GitHub repo link',
    CURRENT_DATE,
    '10:00:00',
    '12:00:00',
    'Seminar Hall 2 & Online',
    NOW() + INTERVAL '2 days',
    'approved',
    'u0000000-0000-0000-0000-000000000004',
    NOW() - INTERVAL '1 day',
    'u0000000-0000-0000-0000-000000000005'
);
