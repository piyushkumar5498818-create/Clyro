-- Clyro: Seed Data for Mirai School of Technology
-- Seed: 002_seed_data.sql

-- 1. Campus
INSERT INTO campuses (id, name, code, location) VALUES
('c0000000-0000-0000-0000-000000000001', 'Mirai School of Technology', 'MSOT-MAIN', 'Innovation Campus Block A');

-- 2. Profiles (All Institutional Roles & Personas)
INSERT INTO profiles (id, email, full_name, role, campus_id, student_id, title) VALUES
('u0000000-0000-0000-0000-000000000001', 'admin@mirai.edu', 'Dr. Sarah Jenkins', 'college_admin', 'c0000000-0000-0000-0000-000000000001', NULL, 'Dean of Academic Affairs'),
('u0000000-0000-0000-0000-000000000002', 'cm@mirai.edu', 'Marcus Vance', 'campus_manager', 'c0000000-0000-0000-0000-000000000001', NULL, 'Campus Operations Director'),
('u0000000-0000-0000-0000-000000000003', 'advisor.tech@mirai.edu', 'Prof. Alan Turing', 'faculty_advisor', 'c0000000-0000-0000-0000-000000000001', NULL, 'Kaizen Tech Faculty Advisor'),
('u0000000-0000-0000-0000-000000000004', 'advisor.ecell@mirai.edu', 'Prof. Maya Angelou', 'faculty_advisor', 'c0000000-0000-0000-0000-000000000001', NULL, 'NEX-CELL Faculty Advisor'),
('u0000000-0000-0000-0000-000000000005', 'advisor.cultural@mirai.edu', 'Prof. Ravi Shankar', 'faculty_advisor', 'c0000000-0000-0000-0000-000000000001', NULL, 'MALHAR Society Advisor'),
('u0000000-0000-0000-0000-000000000006', 'nexcell.lead@mirai.edu', 'Arman Mehta', 'student_coordinator', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-NEX', 'NEX-CELL Student Lead'),
('u0000000-0000-0000-0000-000000000007', 'kaizen.lead@mirai.edu', 'Priya Sharma', 'student_coordinator', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-KAI', 'Kaizen Lead & AI Domain Coordinator'),
('u0000000-0000-0000-0000-000000000008', 'malhar.president@mirai.edu', 'Elena Rostova', 'society_admin', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-MAL', 'MALHAR Society President'),
('u0000000-0000-0000-0000-000000000009', 'alex.student@mirai.edu', 'Alex Rivera', 'student', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-042', 'Student Engineer');

-- 3. The 3 Primary Organizations
INSERT INTO organizations (id, campus_id, name, short_name, description, type, faculty_advisor_id, capacity, meeting_rules) VALUES
('o0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'NEX-CELL — Entrepreneurship Club', 'NEX-CELL', 'Official entrepreneurship club empowering student founders through venture incubation, pitch sessions, and MVP sprints.', 'entrepreneurship_club', 'u0000000-0000-0000-0000-000000000004', 150, 'Thursdays 5:30 PM & Pitch Saturdays'),
('o0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Kaizen Tech — Technical Club', 'Kaizen Tech', 'Premier technical club fostering full-stack engineering, applied machine learning, competitive programming, and open-source software.', 'technical_club', 'u0000000-0000-0000-0000-000000000003', 250, 'Saturdays 10:00 AM - 1:00 PM (Domain Workshops)'),
('o0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'MALHAR — Cultural Society', 'MALHAR', 'Vibrant cultural society orchestrating campus fests, music, stagecraft, media coverage, design systems, and performing arts.', 'cultural_society', 'u0000000-0000-0000-0000-000000000005', 200, 'Fridays 4:00 PM (Department Syncs) & Event Rehearsals');

-- 4. Kaizen Tech Technical Domains (6 Domains)
INSERT INTO organization_units (id, organization_id, name, code, type, description, capacity) VALUES
('u0000000-0000-0000-0001-000000000001', 'o0000000-0000-0000-0000-000000000002', 'Full-Stack Web Development', 'WEB', 'technical_domain', 'Modern web architectures, Next.js, distributed backends, and cloud deployment.', 60),
('u0000000-0000-0000-0001-000000000002', 'o0000000-0000-0000-0000-000000000002', 'Applied AI/ML', 'AI_ML', 'technical_domain', 'Deep learning, LLMs, computer vision, PyTorch, and intelligent agents.', 60),
('u0000000-0000-0000-0001-000000000003', 'o0000000-0000-0000-0000-000000000002', 'Competitive Programming', 'CP', 'technical_domain', 'Algorithmic problem solving, dynamic programming, graph algorithms, and contests.', 40),
('u0000000-0000-0000-0001-000000000004', 'o0000000-0000-0000-0000-000000000002', 'Mobile App Development', 'MOBILE', 'technical_domain', 'Cross-platform mobile applications, Flutter, React Native, and mobile UX.', 40),
('u0000000-0000-0000-0001-000000000005', 'o0000000-0000-0000-0000-000000000002', 'Open Source', 'OSS', 'technical_domain', 'Git workflows, upstream contributions, open licenses, and developer tooling.', 35),
('u0000000-0000-0000-0001-000000000006', 'o0000000-0000-0000-0000-000000000002', 'UI/UX Design', 'UIUX', 'technical_domain', 'Design systems, Figma wireframing, user research, accessibility, and visual hierarchy.', 35);

-- 5. MALHAR Departments (5 Departments)
INSERT INTO organization_units (id, organization_id, name, code, type, description, capacity) VALUES
('u0000000-0000-0000-0002-000000000001', 'o0000000-0000-0000-0000-000000000003', 'Management', 'MGMT', 'department', 'Event production, venue scheduling, hospitality, and festival execution.', 40),
('u0000000-0000-0000-0002-000000000002', 'o0000000-0000-0000-0000-000000000003', 'Media', 'MEDIA', 'department', 'Photography, cinematography, aftermovies, and visual storytelling.', 30),
('u0000000-0000-0000-0002-000000000003', 'o0000000-0000-0000-0000-000000000003', 'Tech', 'TECH', 'department', 'Stage sound, intelligent lighting, audio engineering, and live broadcast setup.', 30),
('u0000000-0000-0000-0002-000000000004', 'o0000000-0000-0000-0000-000000000003', 'Designing', 'DESIGN', 'department', 'Stage backdrops, digital banners, fest branding, and promotional collateral.', 30),
('u0000000-0000-0000-0002-000000000005', 'o0000000-0000-0000-0000-000000000003', 'PR', 'PR', 'department', 'Public relations, guest invitations, sponsorships, and campus outreach.', 35);

-- 6. NEX-CELL Initiatives (6 Flagship Programmes)
INSERT INTO initiatives (id, organization_id, name, code, description, format) VALUES
('i0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'Founders Fire', 'FIRE', 'High-stakes startup pitch sessions with angel mentors and operator feedback.', 'Pitch Sessions'),
('i0000000-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000001', 'Scrap to Scale', 'Rapid prototyping incubator guiding zero-to-one MVP production.', 'MVP Incubator'),
('i0000000-0000-0000-0000-000000000003', 'o0000000-0000-0000-0000-000000000001', 'Masterminds', 'Bi-weekly peer accountability pods tracking MRR, traction, and user retention.', 'Peer Pods'),
('i0000000-0000-0000-0000-000000000004', 'o0000000-0000-0000-0000-000000000001', 'Founder Talks', 'Fireside discussions with unicorn founders, VC partners, and alumni innovators.', 'Speaker Series'),
('i0000000-0000-0000-0000-000000000005', 'o0000000-0000-0000-0000-000000000001', 'The Mirage', 'Mirai flagship 48-hour innovation sprint and venture competition.', 'Hackathon Sprint'),
('i0000000-0000-0000-0000-000000000006', 'o0000000-0000-0000-0000-000000000001', 'Open Build', 'Recurring collaborative building sessions and pair programming for founders.', 'Co-Working Sprint');

-- 7. Sample Activity (Kaizen Tech Club Day 1)
INSERT INTO activities (
    id, organization_id, unit_id, title, topic, format, deliverable_description,
    scheduled_date, start_time, end_time, venue, submission_deadline, status,
    approved_by, approved_at, created_by
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'o0000000-0000-0000-0000-000000000002',
    'u0000000-0000-0000-0001-000000000002',
    'Club Day: LLM Agent Architectures & Vector Search',
    'RAG Pipelines, Hybrid Search, and Function Calling',
    'workshop',
    'Submit GitHub repository link with functioning RAG query pipeline and benchmark report.',
    CURRENT_DATE,
    '10:00:00',
    '13:00:00',
    'Turing Computing Lab & Hybrid Stream',
    NOW() + INTERVAL '2 days',
    'approved',
    'u0000000-0000-0000-0000-000000000003',
    NOW() - INTERVAL '1 day',
    'u0000000-0000-0000-0000-000000000007'
);
