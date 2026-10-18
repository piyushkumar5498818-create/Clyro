-- Clyro: Seed Data for Mirai School of Technology
-- 3 Primary Clubs · 3 Kaizen Tech Domains · Student Leadership (President, VP, Lead, Member, Admin)

-- 1. Campus
INSERT INTO campuses (id, name, code, location) VALUES
('c0000000-0000-0000-0000-000000000001', 'Mirai School of Technology', 'MSOT-MAIN', 'Innovation Campus Block A')
ON CONFLICT (id) DO NOTHING;

-- 2. Profiles (Student Leadership Hierarchy)
INSERT INTO profiles (id, email, full_name, role, campus_id, student_id, title) VALUES
('u0000000-0000-0000-0000-000000000001', 'admin@mirai.edu', 'Sarah Jenkins', 'admin', 'c0000000-0000-0000-0000-000000000001', 'ADM-2024-001', 'Campus Administrator'),
('u0000000-0000-0000-0000-000000000002', 'nexcell.president@mirai.edu', 'Arman Mehta', 'president', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-NEX', 'NEX-CELL President'),
('u0000000-0000-0000-0000-000000000003', 'nexcell.vp@mirai.edu', 'Rhea Kapoor', 'vice_president', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-NVP', 'NEX-CELL Vice President'),
('u0000000-0000-0000-0000-000000000004', 'kaizen.president@mirai.edu', 'Priya Sharma', 'president', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-KAI', 'Kaizen Tech President'),
('u0000000-0000-0000-0000-000000000005', 'kaizen.vp@mirai.edu', 'Dev Patel', 'vice_president', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-KVP', 'Kaizen Tech Vice President'),
('u0000000-0000-0000-0000-000000000006', 'malhar.president@mirai.edu', 'Elena Rostova', 'president', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-MAL', 'MALHAR President'),
('u0000000-0000-0000-0000-000000000007', 'malhar.vp@mirai.edu', 'Kabir Singh', 'vice_president', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-MVP', 'MALHAR Vice President'),
('u0000000-0000-0000-0000-000000000008', 'lead.web@mirai.edu', 'Aryan Saxena', 'lead', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-WEB', 'Web Domain Lead'),
('u0000000-0000-0000-0000-000000000009', 'alex.student@mirai.edu', 'Alex Rivera', 'member', 'c0000000-0000-0000-0000-000000000001', 'STU-2024-042', 'Student Member')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  title = EXCLUDED.title,
  full_name = EXCLUDED.full_name;

-- 3. The 3 Primary Organizations
INSERT INTO organizations (id, campus_id, name, short_name, description, type, capacity, meeting_rules) VALUES
('o0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'NEX-CELL — Entrepreneurship Club', 'NEX-CELL', 'Official entrepreneurship club empowering student founders through venture incubation, pitch sessions, and MVP sprints.', 'entrepreneurship_club', 150, 'Thursdays 5:30 PM & Pitch Saturdays'),
('o0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Kaizen Tech — Technical Club', 'Kaizen Tech', 'Premier technical club fostering full-stack engineering, applied machine learning, competitive programming, and open-source software.', 'technical_club', 250, 'Saturdays 10:00 AM - 1:00 PM (Domain Workshops)'),
('o0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'MALHAR — Cultural Society', 'MALHAR', 'Vibrant cultural society orchestrating campus fests, music, stagecraft, media coverage, design systems, and performing arts.', 'cultural_society', 200, 'Fridays 4:00 PM (Department Syncs) & Event Rehearsals')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  description = EXCLUDED.description;

-- 4. Kaizen Tech Technical Domains (Strictly 3 Tech Domains)
INSERT INTO organization_units (id, organization_id, name, code, type, description, capacity) VALUES
('u0000000-0000-0000-0001-000000000001', 'o0000000-0000-0000-0000-000000000002', 'Competitive Programming', 'CP', 'technical_domain', 'Algorithmic problem solving in C++, graphs, dynamic programming, and contests.', 50),
('u0000000-0000-0000-0001-000000000002', 'o0000000-0000-0000-0000-000000000002', 'Full-Stack Web Development', 'WEB', 'technical_domain', 'Modern web architectures, React, Tailwind, Next.js, APIs, and databases.', 60),
('u0000000-0000-0000-0001-000000000003', 'o0000000-0000-0000-0000-000000000002', 'Applied AI & Data Science', 'AI_DS', 'technical_domain', 'Data pipelines, linear regression, PyTorch neural networks, and LLMs.', 50)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  description = EXCLUDED.description;

-- 5. MALHAR Departments (5 Departments)
INSERT INTO organization_units (id, organization_id, name, code, type, description, capacity) VALUES
('u0000000-0000-0000-0002-000000000001', 'o0000000-0000-0000-0000-000000000003', 'Management', 'MGMT', 'department', 'Event production, venue scheduling, hospitality, and festival execution.', 40),
('u0000000-0000-0000-0002-000000000002', 'o0000000-0000-0000-0000-000000000003', 'Media', 'MEDIA', 'department', 'Photography, cinematography, aftermovies, and visual storytelling.', 30),
('u0000000-0000-0000-0002-000000000003', 'o0000000-0000-0000-0000-000000000003', 'Tech', 'TECH', 'department', 'Stage sound, intelligent lighting, audio engineering, and live broadcast setup.', 30),
('u0000000-0000-0000-0002-000000000004', 'o0000000-0000-0000-0000-000000000003', 'Designing', 'DESIGN', 'department', 'Stage backdrops, digital banners, fest branding, and promotional collateral.', 30),
('u0000000-0000-0000-0002-000000000005', 'o0000000-0000-0000-0000-000000000003', 'PR', 'PR', 'department', 'Public relations, guest invitations, sponsorships, and campus outreach.', 35)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  description = EXCLUDED.description;

-- 6. NEX-CELL Initiatives (6 Flagship Programmes)
INSERT INTO initiatives (id, organization_id, name, code, description, format) VALUES
('i0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'Founders Fire', 'FIRE', 'High-stakes startup pitch sessions with angel mentors and operator feedback.', 'Pitch Sessions'),
('i0000000-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000001', 'Scrap to Scale', 'SCALE', 'Rapid prototyping incubator guiding zero-to-one MVP production.', 'MVP Incubator'),
('i0000000-0000-0000-0000-000000000003', 'o0000000-0000-0000-0000-000000000001', 'Masterminds', 'MINDS', 'Bi-weekly peer accountability pods tracking MRR, traction, and user retention.', 'Peer Pods'),
('i0000000-0000-0000-0000-000000000004', 'o0000000-0000-0000-0000-000000000001', 'Founder Talks', 'TALKS', 'Fireside discussions with unicorn founders, VC partners, and alumni innovators.', 'Speaker Series'),
('i0000000-0000-0000-0000-000000000005', 'o0000000-0000-0000-0000-000000000001', 'The Mirage', 'MIRAGE', 'Mirai flagship 48-hour innovation sprint and venture competition.', 'Hackathon Sprint'),
('i0000000-0000-0000-0000-000000000006', 'o0000000-0000-0000-0000-000000000001', 'Open Build', 'BUILD', 'Recurring collaborative building sessions and pair programming for founders.', 'Co-Working Sprint')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 7. Sample Activity (Kaizen Tech Web Development Workshop)
INSERT INTO activities (
    id, organization_id, unit_id, title, topic, format, deliverable_description,
    scheduled_date, start_time, end_time, venue, submission_deadline, status,
    approved_by, approved_at, created_by
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'o0000000-0000-0000-0000-000000000002',
    'u0000000-0000-0000-0001-000000000002',
    'Club Day: Modern Full-Stack Systems & API Design',
    'React Server Components, Next.js, and Distributed Backends',
    'workshop',
    'Submit GitHub repository link with functioning API routes and test coverage.',
    CURRENT_DATE,
    '10:00:00',
    '13:00:00',
    'Turing Computing Lab & Hybrid Stream',
    NOW() + INTERVAL '2 days',
    'approved',
    'u0000000-0000-0000-0000-000000000004',
    NOW() - INTERVAL '1 day',
    'u0000000-0000-0000-0000-000000000008'
)
ON CONFLICT (id) DO NOTHING;
