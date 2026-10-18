import {
  Campus,
  Profile,
  Organization,
  OrganizationUnit,
  Initiative,
  OrganizationMembership,
  UnitAssignment,
  Activity,
  AttendanceToken,
  AttendanceRecord,
  Submission,
  Evaluation,
  Team,
  Certificate,
  UserRole,
} from "@/types/database";

interface MiraiDatabaseState {
  campuses: Campus[];
  profiles: Profile[];
  organizations: Organization[];
  units: OrganizationUnit[];
  initiatives: Initiative[];
  memberships: OrganizationMembership[];
  unitAssignments: UnitAssignment[];
  activities: Activity[];
  attendanceTokens: AttendanceToken[];
  attendanceRecords: AttendanceRecord[];
  submissions: Submission[];
  evaluations: Evaluation[];
  teams: Team[];
  certificates: Certificate[];
  activeUserId: string;
}

const INITIAL_CAMPUS: Campus = {
  id: "c0000000-0000-0000-0000-000000000001",
  name: "Mirai School of Technology",
  code: "MSOT-MAIN",
  location: "Innovation Campus Block A",
  createdAt: new Date().toISOString(),
};

const INITIAL_PROFILES: Profile[] = [
  {
    id: "u0000000-0000-0000-0000-000000000001",
    email: "rishav.president@mirai.edu",
    fullName: "Rishav Raj",
    role: "president",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-KAI-01",
    title: "President — Kaizen Tech",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000002",
    email: "aarav.vp@mirai.edu",
    fullName: "Aarav Pathak",
    role: "vice_president",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-KAI-02",
    title: "Vice President — Kaizen Tech",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000003",
    email: "arman.president@mirai.edu",
    fullName: "Arman Mehta",
    role: "president",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-NEX-01",
    title: "President — NEX-CELL",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000004",
    email: "sapna.president@mirai.edu",
    fullName: "Sapna Singh",
    role: "president",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-01",
    title: "President — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1787028393194_whatsapp_image_2026-08-16_at_13_35_10.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000005",
    email: "sagar.lead@mirai.edu",
    fullName: "Sagar Kumar",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-KAI-03",
    title: "Programming Head — Kaizen Tech",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    unitId: "u0000000-0000-0000-0001-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000006",
    email: "saurav.lead@mirai.edu",
    fullName: "Saurav Kumar",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-KAI-04",
    title: "Design Head — Kaizen Tech",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000007",
    email: "siya.treasurer@mirai.edu",
    fullName: "Siya Bhardwaj",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-KAI-05",
    title: "Treasurer — Kaizen Tech",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000008",
    email: "alex.student@mirai.edu",
    fullName: "Alex Rivera",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-042",
    title: "Student Member",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000009",
    email: "admin@mirai.edu",
    fullName: "Campus Administrator",
    role: "admin",
    campusId: INITIAL_CAMPUS.id,
    title: "Platform Admin",
    createdAt: new Date().toISOString(),
  },
  // MALHAR Leadership & Department Heads
  {
    id: "u0000000-0000-0000-0000-000000000010",
    email: "kiran.vp@mirai.edu",
    fullName: "Kiran Sinha",
    role: "vice_president",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-02",
    title: "Vice President — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1791404478050_whatsapp_image_2026-10-08_at_01_50_52.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000011",
    email: "anshika.treasurer@mirai.edu",
    fullName: "Anshika",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-03",
    title: "Treasurer — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1787028579064_whatsapp_image_2026-08-16_at_13_51_54.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000012",
    email: "dhruv.media@mirai.edu",
    fullName: "Dhruv Tomar",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-04",
    title: "Media Head — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1787028871783_dhruv.png",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000002",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000013",
    email: "shivam.tech@mirai.edu",
    fullName: "Shivam Kumar",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-05",
    title: "Tech Head — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789719824843_whatsapp_image_2026-09-18_at_13_50_26.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000003",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000014",
    email: "priyanka.design@mirai.edu",
    fullName: "Priyanka Negi",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-06",
    title: "Designing Head — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789720124340_screenshot_2026-08-16_at_1_49_26_pm.png",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000004",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000015",
    email: "purnima.mgmt@mirai.edu",
    fullName: "Purnima Raj",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-07",
    title: "Management Head — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789720503726_whatsapp_image_2026-08-19_at_20_09_07__1_.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000001",
    createdAt: new Date().toISOString(),
  },
  // MALHAR Members
  {
    id: "u0000000-0000-0000-0000-000000000016",
    email: "anchal.mgmt@mirai.edu",
    fullName: "Anchal kumari",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-08",
    title: "Management Member — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789895457518_whatsapp_image_2026-09-20_at_02_15_19.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000017",
    email: "aanya.design@mirai.edu",
    fullName: "Aanya Varshney",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-09",
    title: "Design Member — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789841241383_36875.jpg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000004",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000018",
    email: "shambhavi.mgmt@mirai.edu",
    fullName: "Shambhavi Sharma",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-10",
    title: "Management Member — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789897969133_whatsapp_image_2026-09-20_at_14_25_58.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000019",
    email: "anup.mgmt@mirai.edu",
    fullName: "Anup Gupta",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-11",
    title: "Management Member — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789898309798_whatsapp_image_2026-09-20_at_15_27_31.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000020",
    email: "sanskar.mgmt@mirai.edu",
    fullName: "Sanskar Singh",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2025-MAL-12",
    title: "Management Member — MALHAR",
    avatarUrl: "https://lqaldejqwxtvbrqymkln.supabase.co/storage/v1/object/public/media/avatars/1789901427129_whatsapp_image_2026-09-20_at_16_05_04.jpeg",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000001",
    createdAt: new Date().toISOString(),
  },
  // NEX-CELL Leadership & Startup Founder Members
  {
    id: "u0000000-0000-0000-0000-000000000021",
    email: "rohan.vp@mirai.edu",
    fullName: "Rohan Varma",
    role: "vice_president",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-NEX-02",
    title: "Vice President — NEX-CELL",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000022",
    email: "tanya.incubation@mirai.edu",
    fullName: "Tanya Kapoor",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-NEX-03",
    title: "Incubation & Venture Lead — NEX-CELL",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000023",
    email: "kabir.pitch@mirai.edu",
    fullName: "Kabir Joshi",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-NEX-04",
    title: "Pitch & Demo Day Lead — NEX-CELL",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000024",
    email: "devansh.hack@mirai.edu",
    fullName: "Devansh Soni",
    role: "lead",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-NEX-05",
    title: "Hackathon & Mirage Lead — NEX-CELL",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000025",
    email: "meera.founder@mirai.edu",
    fullName: "Meera Nair",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-NEX-06",
    title: "Student Founder — NEX-CELL",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0000-000000000026",
    email: "ishaan.founder@mirai.edu",
    fullName: "Ishaan Verma",
    role: "member",
    campusId: INITIAL_CAMPUS.id,
    studentId: "STU-2024-NEX-07",
    title: "Student Founder — NEX-CELL",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: "o0000000-0000-0000-0000-000000000001",
    campusId: INITIAL_CAMPUS.id,
    name: "NEX-CELL — Entrepreneurship Club",
    shortName: "NEX-CELL",
    description: "Official entrepreneurship club empowering student founders through venture incubation, pitch sessions, and MVP sprints.",
    type: "entrepreneurship_club",
    presidentId: "u0000000-0000-0000-0000-000000000003",
    presidentName: "Arman Mehta",
    capacity: 150,
    meetingRules: "Thursdays 5:30 PM & Pitch Saturdays",
    createdAt: new Date().toISOString(),
  },
  {
    id: "o0000000-0000-0000-0000-000000000002",
    campusId: INITIAL_CAMPUS.id,
    name: "Kaizen Tech — Technical Club",
    shortName: "Kaizen Tech",
    description: "Premier technical club fostering full-stack engineering, applied machine learning, competitive programming, and open-source software.",
    type: "technical_club",
    presidentId: "u0000000-0000-0000-0000-000000000001",
    presidentName: "Rishav Raj",
    capacity: 250,
    meetingRules: "Saturdays 10:00 AM - 1:00 PM (Domain Workshops)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "o0000000-0000-0000-0000-000000000003",
    campusId: INITIAL_CAMPUS.id,
    name: "MALHAR — Cultural Society",
    shortName: "MALHAR",
    description: "Cultural society of Mirai School of Technology started by the 2025–29 batch, driving performing arts, media, design, tech, and cultural festival productions across 5 departments.",
    type: "cultural_society",
    presidentId: "u0000000-0000-0000-0000-000000000004",
    presidentName: "Sapna Singh",
    capacity: 200,
    meetingRules: "Fridays 4:00 PM (Department Syncs) & Event Rehearsals",
    createdAt: new Date().toISOString(),
  },
];

// Kaizen Tech 3 Technical Domains with 4-phase learning roadmaps & mentors
const INITIAL_UNITS: OrganizationUnit[] = [
  {
    id: "u0000000-0000-0000-0001-000000000001",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    name: "Competitive Programming",
    code: "CP",
    type: "technical_domain",
    subtitle: "Master algorithms in C++",
    description: "Algorithmic problem solving, dynamic programming, graph algorithms, and contests.",
    leadId: "u0000000-0000-0000-0000-000000000005",
    leadName: "Sagar Kumar",
    roadmap: [
      {
        phase: "Phase 1",
        title: "Basics",
        description: "Dive deep into basics to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 2",
        title: "Graphs",
        description: "Dive deep into graphs to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 3",
        title: "Dynamic Programming",
        description: "Dive deep into dynamic programming to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 4",
        title: "Advanced Trees",
        description: "Dive deep into advanced trees to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
    ],
    mentors: [
      { name: "Saurav Kumar", role: "Design Head" },
      { name: "Manikesh", role: "Member" },
      { name: "Chetan Soni", role: "Social Media Head" },
      { name: "Sagar Kumar", role: "Programming Head" },
      { name: "Harsh Surana", role: "Member" },
      { name: "Rishav Raj", role: "President" },
      { name: "Siya Bhardwaj", role: "Treasurer" },
      { name: "Subham Rai", role: "Member" },
      { name: "Aarav Pathak", role: "Vice President" },
    ],
    capacity: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0001-000000000002",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    name: "Full-Stack Web",
    code: "WEB",
    type: "technical_domain",
    subtitle: "React, Tailwind, Node",
    description: "Modern web engineering with React, Next.js, Tailwind CSS, Node.js backends, and cloud deployment.",
    roadmap: [
      {
        phase: "Phase 1",
        title: "Frontend UI",
        description: "Dive deep into frontend ui to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 2",
        title: "API Design",
        description: "Dive deep into api design to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 3",
        title: "Database Modeling",
        description: "Dive deep into database modeling to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 4",
        title: "Authentication",
        description: "Dive deep into authentication to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
    ],
    mentors: [],
    capacity: 60,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0001-000000000003",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    name: "AI & Data Science",
    code: "AI_DS",
    type: "technical_domain",
    subtitle: "Python & Machine Learning",
    description: "Applied machine learning, data cleaning, regression, deep neural networks, and NLP agents.",
    leadId: "u0000000-0000-0000-0000-000000000002",
    leadName: "Aarav Pathak",
    roadmap: [
      {
        phase: "Phase 1",
        title: "Data Cleaning",
        description: "Dive deep into data cleaning to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 2",
        title: "Linear Regression",
        description: "Dive deep into linear regression to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 3",
        title: "Neural Networks",
        description: "Dive deep into neural networks to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
      {
        phase: "Phase 4",
        title: "NLP",
        description: "Dive deep into nlp to build a solid foundation. You'll work on practical projects and algorithmic challenges.",
      },
    ],
    mentors: [
      { name: "Aarav Pathak", role: "Vice President" },
    ],
    capacity: 60,
    createdAt: new Date().toISOString(),
  },
  // MALHAR 5 Departments
  {
    id: "u0000000-0000-0000-0002-000000000001",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    name: "Management",
    code: "MGMT",
    type: "department",
    description: "Event production, venue scheduling, hospitality, and festival execution.",
    leadId: "u0000000-0000-0000-0000-000000000015",
    leadName: "Purnima Raj",
    capacity: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0002-000000000002",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    name: "Media",
    code: "MEDIA",
    type: "department",
    description: "Photography, cinematography, aftermovies, and visual storytelling.",
    leadId: "u0000000-0000-0000-0000-000000000012",
    leadName: "Dhruv Tomar",
    capacity: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0002-000000000003",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    name: "Tech",
    code: "TECH",
    type: "department",
    description: "Stage sound, intelligent lighting, audio engineering, and live broadcast setup.",
    leadId: "u0000000-0000-0000-0000-000000000013",
    leadName: "Shivam Kumar",
    capacity: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0002-000000000004",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    name: "Designing",
    code: "DESIGN",
    type: "department",
    description: "Stage backdrops, digital banners, fest branding, and promotional collateral.",
    leadId: "u0000000-0000-0000-0000-000000000014",
    leadName: "Priyanka Negi",
    capacity: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: "u0000000-0000-0000-0002-000000000005",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    name: "PR",
    code: "PR",
    type: "department",
    description: "Public relations, guest invitations, sponsorships, and campus outreach.",
    capacity: 35,
    createdAt: new Date().toISOString(),
  },
];

// NEX-CELL 6 Initiatives
const INITIAL_INITIATIVES: Initiative[] = [
  {
    id: "i0000000-0000-0000-0000-000000000001",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    name: "Founders Fire",
    code: "FIRE",
    description: "High-stakes startup pitch sessions with angel mentors and operator feedback.",
    format: "Pitch Sessions",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i0000000-0000-0000-0000-000000000002",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    name: "Scrap to Scale",
    code: "SCALE",
    description: "Rapid prototyping incubator guiding zero-to-one MVP production.",
    format: "MVP Incubator",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i0000000-0000-0000-0000-000000000003",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    name: "Masterminds",
    code: "MINDS",
    description: "Bi-weekly peer accountability pods tracking MRR, traction, and user retention.",
    format: "Peer Pods",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i0000000-0000-0000-0000-000000000004",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    name: "Founder Talks",
    code: "TALKS",
    description: "Fireside discussions with unicorn founders, VC partners, and alumni innovators.",
    format: "Speaker Series",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i0000000-0000-0000-0000-000000000005",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    name: "The Mirage",
    code: "MIRAGE",
    description: "Mirai flagship 48-hour innovation sprint and venture competition.",
    format: "Hackathon Sprint",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i0000000-0000-0000-0000-000000000006",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    name: "Open Build",
    code: "BUILD",
    description: "Recurring collaborative building sessions and pair programming for founders.",
    format: "Co-Working Sprint",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_MEMBERSHIPS: OrganizationMembership[] = [
  {
    id: "m0000000-0000-0000-0000-000000000001",
    organizationId: "o0000000-0000-0000-0000-000000000002", // Alex is approved member of Kaizen Tech
    userId: "u0000000-0000-0000-0000-000000000008",
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000001", // Rishav Raj (President)
  },
  // MALHAR Leadership & Memberships
  {
    id: "m0000000-0000-0000-0000-000000000002",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000004", // Sapna Singh (President)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 59).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000009",
  },
  {
    id: "m0000000-0000-0000-0000-000000000003",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000010", // Kiran Sinha (VP)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 59).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000004",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000011", // Anshika (Treasurer)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 49).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000005",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000012", // Dhruv Tomar (Media Head)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 49).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000006",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000013", // Shivam Kumar (Tech Head)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 44).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000007",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000014", // Priyanka Negi (Designing Head)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 44).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000008",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000015", // Purnima Raj (Management Head)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 44).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000009",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000016", // Anchal kumari (Management Member)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 29).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000010",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000017", // Aanya Varshney (Design Member)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 19).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000011",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000018", // Shambhavi Sharma (Management Member)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 19).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000012",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000019", // Anup Gupta (Management Member)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  {
    id: "m0000000-0000-0000-0000-000000000013",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    userId: "u0000000-0000-0000-0000-000000000020", // Sanskar Singh (Management Member)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000004",
  },
  // Kaizen Tech Leadership Memberships
  {
    id: "m0000000-0000-0000-0000-000000000014",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    userId: "u0000000-0000-0000-0000-000000000001", // Rishav Raj (President)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 59).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000009",
  },
  {
    id: "m0000000-0000-0000-0000-000000000015",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    userId: "u0000000-0000-0000-0000-000000000002", // Aarav Pathak (VP)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 59).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000001",
  },
  {
    id: "m0000000-0000-0000-0000-000000000016",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    userId: "u0000000-0000-0000-0000-000000000005", // Sagar Kumar (Programming Head)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 49).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000001",
  },
  {
    id: "m0000000-0000-0000-0000-000000000017",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    userId: "u0000000-0000-0000-0000-000000000006", // Saurav Kumar (Design Head)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 49).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000001",
  },
  {
    id: "m0000000-0000-0000-0000-000000000018",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    userId: "u0000000-0000-0000-0000-000000000007", // Siya Bhardwaj (Treasurer)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 49).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000001",
  },
  // NEX-CELL Leadership & Memberships
  {
    id: "m0000000-0000-0000-0000-000000000019",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000003", // Arman Mehta (President)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 59).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000009",
  },
  {
    id: "m0000000-0000-0000-0000-000000000020",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000021", // Rohan Varma (VP)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 59).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000003",
  },
  {
    id: "m0000000-0000-0000-0000-000000000021",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000022", // Tanya Kapoor (Incubation Lead)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 44).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000003",
  },
  {
    id: "m0000000-0000-0000-0000-000000000022",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000023", // Kabir Joshi (Pitch Lead)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 44).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000003",
  },
  {
    id: "m0000000-0000-0000-0000-000000000023",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000024", // Devansh Soni (Hackathon Lead)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 44).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000003",
  },
  {
    id: "m0000000-0000-0000-0000-000000000024",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000025", // Meera Nair (Student Founder)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 29).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000003",
  },
  {
    id: "m0000000-0000-0000-0000-000000000025",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000026", // Ishaan Verma (Student Founder)
    membershipType: "primary",
    status: "approved",
    requestedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 29).toISOString(),
    reviewedBy: "u0000000-0000-0000-0000-000000000003",
  },
];

const INITIAL_UNIT_ASSIGNMENTS: UnitAssignment[] = [
  {
    id: "ua000000-0000-0000-0000-000000000001",
    unitId: "u0000000-0000-0000-0001-000000000003", // Alex assigned to AI & Data Science domain
    userId: "u0000000-0000-0000-0000-000000000008",
    role: "member",
    assignedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000002",
    unitId: "u0000000-0000-0000-0002-000000000002", // Dhruv Tomar assigned to Media
    userId: "u0000000-0000-0000-0000-000000000012",
    role: "lead",
    assignedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000003", // Shivam Kumar assigned to Tech
    userId: "u0000000-0000-0000-0000-000000000013",
    role: "lead",
    assignedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000004",
    unitId: "u0000000-0000-0000-0002-000000000004", // Priyanka Negi assigned to Designing
    userId: "u0000000-0000-0000-0000-000000000014",
    role: "lead",
    assignedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000005",
    unitId: "u0000000-0000-0000-0002-000000000001", // Purnima Raj assigned to Management
    userId: "u0000000-0000-0000-0000-000000000015",
    role: "lead",
    assignedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000006",
    unitId: "u0000000-0000-0000-0002-000000000001", // Anchal assigned to Management
    userId: "u0000000-0000-0000-0000-000000000016",
    role: "member",
    assignedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000007",
    unitId: "u0000000-0000-0000-0002-000000000004", // Aanya assigned to Designing
    userId: "u0000000-0000-0000-0000-000000000017",
    role: "member",
    assignedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000008",
    unitId: "u0000000-0000-0000-0002-000000000001", // Shambhavi assigned to Management
    userId: "u0000000-0000-0000-0000-000000000018",
    role: "member",
    assignedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000009",
    unitId: "u0000000-0000-0000-0002-000000000001", // Anup assigned to Management
    userId: "u0000000-0000-0000-0000-000000000019",
    role: "member",
    assignedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: "ua000000-0000-0000-0000-000000000010",
    unitId: "u0000000-0000-0000-0002-000000000001", // Sanskar assigned to Management
    userId: "u0000000-0000-0000-0000-000000000020",
    role: "member",
    assignedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    unitId: "u0000000-0000-0000-0001-000000000003",
    title: "Kaizen Club Day: LLM Agent Architectures & Vector Search",
    topic: "RAG Pipelines, Hybrid Search, and Function Calling",
    format: "workshop",
    deliverableDescription: "Submit GitHub repository link with functioning RAG query pipeline and benchmark report.",
    scheduledDate: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "13:00",
    venue: "Turing Computing Lab Block A",
    submissionDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: "approved",
    approvedBy: "u0000000-0000-0000-0000-000000000001",
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: "u0000000-0000-0000-0000-000000000002",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    rubricCriteria: [
      { name: "Technical Depth & Architecture", maxScore: 40, description: "Quality of RAG implementation, prompt chaining, and embeddings." },
      { name: "Demo & Code Cleanliness", maxScore: 30, description: "Repo documentation, test coverage, and live query execution." },
      { name: "Participation & Discussion", maxScore: 30, description: "Active Q&A and technical contribution in lab session." },
    ],
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    organizationId: "o0000000-0000-0000-0000-000000000001",
    initiativeId: "i0000000-0000-0000-0000-000000000001",
    title: "NEX-CELL Founders Fire: Cohort Pitch Session 1",
    topic: "Problem Validation, TAM Calculation & Early MVP Demo",
    format: "pitch_session",
    deliverableDescription: "Submit pitch deck link and 3-minute Loom walkthrough.",
    scheduledDate: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "16:30",
    venue: "Incubation Center Block B",
    submissionDeadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: "approved",
    approvedBy: "u0000000-0000-0000-0000-000000000003",
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: "u0000000-0000-0000-0000-000000000003",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rubricCriteria: [
      { name: "Problem Validation & Market Size", maxScore: 30, description: "Clarity of customer pain point and target market sizing." },
      { name: "Solution & Product Feasibility", maxScore: 30, description: "Technical viability and uniqueness of value proposition." },
      { name: "Traction & Execution Plan", maxScore: 20, description: "Customer interviews, waitlist metrics, or prototype tests." },
      { name: "Pitch Delivery & Q&A", maxScore: 20, description: "Confidence, timekeeping, and investor answer defense." },
    ],
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    organizationId: "o0000000-0000-0000-0000-000000000003",
    unitId: "u0000000-0000-0000-0002-000000000002",
    title: "MALHAR Media: Annual Fest Cinematography Workshop",
    topic: "Gimbal Staging, Audio Syncing & Premiere Pro Speed Cuts",
    format: "workshop",
    deliverableDescription: "Upload 60-second teaser reel link with soundtrack sync.",
    scheduledDate: new Date().toISOString().split("T")[0],
    startTime: "16:00",
    endTime: "18:00",
    venue: "Auditorium Control Room",
    submissionDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: "approved",
    approvedBy: "u0000000-0000-0000-0000-000000000004",
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: "u0000000-0000-0000-0000-000000000004",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rubricCriteria: [
      { name: "Cinematic Framing & Lighting", maxScore: 40, description: "Composition, color grading, and dynamic range." },
      { name: "Audio Mastering & Pacing", maxScore: 30, description: "Soundtrack alignment and clear beat transitions." },
      { name: "Brand Alignment & Storytelling", maxScore: 30, description: "Engagement and festival atmosphere capture." },
    ],
  },
];

const INITIAL_TOKENS: AttendanceToken[] = [
  {
    id: "t0000000-0000-0000-0000-000000000001",
    activityId: "a0000000-0000-0000-0000-000000000001",
    tokenCode: "CLYRO-KAI-8192",
    validFrom: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    validUntil: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    createdBy: "u0000000-0000-0000-0000-000000000002",
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "r0000000-0000-0000-0000-000000000001",
    activityId: "a0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000008",
    status: "present",
    checkInTime: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    checkInMethod: "qr_code",
  },
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "s0000000-0000-0000-0000-000000000001",
    activityId: "a0000000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000008",
    submissionType: "link",
    linkUrl: "https://github.com/alexrivera/mirai-llm-rag-agent",
    notes: "Implemented hybrid vector search using Qdrant and LangChain with tool calling.",
    submittedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: "e0000000-0000-0000-0000-000000000001",
    submissionId: "s0000000-0000-0000-0000-000000000001",
    evaluatorId: "u0000000-0000-0000-0000-000000000001",
    scoreBreakdown: [
      { criteriaName: "Technical Depth & Architecture", score: 38, maxScore: 40 },
      { criteriaName: "Demo & Code Cleanliness", score: 28, maxScore: 30 },
      { criteriaName: "Participation & Discussion", score: 28, maxScore: 30 },
    ],
    totalScore: 94,
    feedback: "High-grade architecture! Clean integration of embeddings and hybrid filtering.",
    evaluatedAt: new Date().toISOString(),
  },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: "team_001",
    activityId: "a0000000-0000-0000-0000-000000000002",
    name: "NeuralFlow Venture",
    leadUserId: "u0000000-0000-0000-0000-000000000008",
    memberUserIds: ["u0000000-0000-0000-0000-000000000008"],
    projectTitle: "AI Automated Customer Retention Agent",
    projectUrl: "https://github.com/alexrivera/neuralflow",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "cert000-0000-0000-0000-000000000001",
    userId: "u0000000-0000-0000-0000-000000000008",
    organizationId: "o0000000-0000-0000-0000-000000000002",
    activityId: "a0000000-0000-0000-0000-000000000001",
    certificateType: "achievement",
    title: "Certificate of Excellence in LLM Engineering & Applied AI",
    issueDate: new Date().toISOString().split("T")[0],
    verificationCode: "CLYRO-KAI-2024-9142",
    pdfHash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  },
];

// Singleton store instance
declare global {
  // eslint-disable-next-line no-var
  var __mirai_db: MiraiDatabaseState | undefined;
}

function getDatabase(): MiraiDatabaseState {
  if (!globalThis.__mirai_db) {
    globalThis.__mirai_db = {
      campuses: [INITIAL_CAMPUS],
      profiles: [...INITIAL_PROFILES],
      organizations: [...INITIAL_ORGANIZATIONS],
      units: [...INITIAL_UNITS],
      initiatives: [...INITIAL_INITIATIVES],
      memberships: [...INITIAL_MEMBERSHIPS],
      unitAssignments: [...INITIAL_UNIT_ASSIGNMENTS],
      activities: [...INITIAL_ACTIVITIES],
      attendanceTokens: [...INITIAL_TOKENS],
      attendanceRecords: [...INITIAL_ATTENDANCE],
      submissions: [...INITIAL_SUBMISSIONS],
      evaluations: [...INITIAL_EVALUATIONS],
      teams: [...INITIAL_TEAMS],
      certificates: [...INITIAL_CERTIFICATES],
      activeUserId: "u0000000-0000-0000-0000-000000000001", // Rishav Raj (President — Kaizen Tech)
    };
  }
  return globalThis.__mirai_db;
}

export const db = {
  // --- Auth & Session ---
  getActiveUser(): Profile {
    const state = getDatabase();
    return (
      state.profiles.find((p) => p.id === state.activeUserId) ||
      state.profiles[0]
    );
  },

  setActiveUser(userId: string): Profile {
    const state = getDatabase();
    const user = state.profiles.find((p) => p.id === userId);
    if (!user) throw new Error("User not found");
    state.activeUserId = user.id;
    return user;
  },

  getUserById(userId: string): Profile | undefined {
    return getDatabase().profiles.find((p) => p.id === userId);
  },

  getAllProfiles(): Profile[] {
    return getDatabase().profiles;
  },

  findOrCreateGoogleProfile(email: string, fullName?: string, avatarUrl?: string): Profile {
    const state = getDatabase();
    const normalized = email.trim().toLowerCase();
    const existing = state.profiles.find((p) => p.email.toLowerCase() === normalized);
    if (existing) {
      if (fullName && !existing.fullName) existing.fullName = fullName;
      if (avatarUrl && !existing.avatarUrl) existing.avatarUrl = avatarUrl;
      return existing;
    }

    const newProfile: Profile = {
      id: `u${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: normalized,
      fullName:
        fullName ||
        normalized
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      role: "member",
      campusId: state.campuses[0]?.id || "c0000000-0000-0000-0000-000000000001",
      studentId: `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: "Student Member (Google Workspace)",
      avatarUrl,
      createdAt: new Date().toISOString(),
    };

    state.profiles.push(newProfile);
    return newProfile;
  },

  // --- Organizations & Units ---
  getAllOrganizations(): Organization[] {
    const state = getDatabase();
    return state.organizations.map((org) => {
      const president = state.profiles.find((p) => p.id === org.presidentId);
      const advisor = state.profiles.find((p) => p.id === org.facultyAdvisorId);
      const units = state.units.filter((u) => u.organizationId === org.id);
      const initiatives = state.initiatives.filter((i) => i.organizationId === org.id);
      const memberCount = state.memberships.filter(
        (m) => m.organizationId === org.id && m.status === "approved"
      ).length;

      return {
        ...org,
        presidentName: president?.fullName || org.presidentName,
        advisorName: advisor?.fullName,
        units,
        initiatives,
        memberCount,
      };
    });
  },

  getOrganizationById(orgId: string): Organization | undefined {
    return this.getAllOrganizations().find((o) => o.id === orgId);
  },

  getUnits(orgId?: string): OrganizationUnit[] {
    const state = getDatabase();
    let units = state.units;
    if (orgId) {
      units = units.filter((u) => u.organizationId === orgId);
    }
    return units.map((u) => {
      const lead = state.profiles.find((p) => p.id === u.leadId);
      const memberCount = state.unitAssignments.filter((ua) => ua.unitId === u.id).length;
      return {
        ...u,
        leadName: lead?.fullName,
        memberCount,
      };
    });
  },

  getInitiatives(orgId?: string): Initiative[] {
    const state = getDatabase();
    if (orgId) {
      return state.initiatives.filter((i) => i.organizationId === orgId);
    }
    return state.initiatives;
  },

  // --- Memberships & Unit Allocations ---
  getMembershipsByOrg(orgId: string): OrganizationMembership[] {
    const state = getDatabase();
    return state.memberships
      .filter((m) => m.organizationId === orgId)
      .map((m) => {
        const user = state.profiles.find((p) => p.id === m.userId);
        const org = state.organizations.find((o) => o.id === m.organizationId);
        return {
          ...m,
          userFullName: user?.fullName,
          userEmail: user?.email,
          userAvatarUrl: user?.avatarUrl,
          userTitle: user?.title,
          studentId: user?.studentId,
          organizationName: org?.shortName,
        };
      });
  },

  getMembershipsByUser(userId: string): OrganizationMembership[] {
    const state = getDatabase();
    return state.memberships
      .filter((m) => m.userId === userId)
      .map((m) => {
        const org = state.organizations.find((o) => o.id === m.organizationId);
        return {
          ...m,
          organizationName: org?.shortName,
        };
      });
  },

  requestMembership(
    userId: string,
    orgId: string,
    type: "primary" | "secondary"
  ): OrganizationMembership {
    const state = getDatabase();

    // Check duplicate
    const existing = state.memberships.find(
      (m) => m.userId === userId && m.organizationId === orgId
    );
    if (existing) {
      throw new Error("Already enrolled or requested membership for this organization");
    }

    // Configurable limit check: default max 2 organizations
    const userActiveMems = state.memberships.filter(
      (m) => m.userId === userId && m.status !== "rejected"
    );
    if (userActiveMems.length >= 2) {
      throw new Error("Institutional policy limits students to a maximum of 2 active club memberships.");
    }

    const newMem: OrganizationMembership = {
      id: "mem_" + Math.random().toString(36).substring(2, 9),
      organizationId: orgId,
      userId,
      membershipType: type,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    state.memberships.push(newMem);
    return newMem;
  },

  reviewMembership(
    membershipId: string,
    status: "approved" | "rejected",
    reviewerId: string
  ): OrganizationMembership {
    const state = getDatabase();
    const mem = state.memberships.find((m) => m.id === membershipId);
    if (!mem) throw new Error("Membership request not found");

    mem.status = status;
    mem.reviewedAt = new Date().toISOString();
    mem.reviewedBy = reviewerId;
    return mem;
  },

  assignUnit(userId: string, unitId: string, role: "lead" | "member" = "member"): UnitAssignment {
    const state = getDatabase();
    const existing = state.unitAssignments.find(
      (ua) => ua.userId === userId && ua.unitId === unitId
    );
    if (existing) return existing;

    const assignment: UnitAssignment = {
      id: "ua_" + Math.random().toString(36).substring(2, 9),
      unitId,
      userId,
      role,
      assignedAt: new Date().toISOString(),
    };
    state.unitAssignments.push(assignment);
    return assignment;
  },

  // --- Activities ---
  getActivities(orgId?: string): Activity[] {
    const state = getDatabase();
    let acts = state.activities;
    if (orgId) {
      acts = acts.filter((a) => a.organizationId === orgId);
    }
    return acts.map((a) => {
      const org = state.organizations.find((o) => o.id === a.organizationId);
      const unit = state.units.find((u) => u.id === a.unitId);
      const initiative = state.initiatives.find((i) => i.id === a.initiativeId);
      return {
        ...a,
        organizationName: org?.shortName,
        clubName: org?.shortName,
        unitName: unit?.name,
        initiativeName: initiative?.name,
      };
    });
  },

  getActivityById(id: string): Activity | undefined {
    return this.getActivities().find((a) => a.id === id);
  },

  createActivity(data: Omit<Activity, "id" | "status" | "createdAt">): Activity {
    const state = getDatabase();
    const newAct: Activity = {
      ...data,
      id: "act_" + Math.random().toString(36).substring(2, 9),
      status: "submitted_for_approval",
      createdAt: new Date().toISOString(),
    };
    state.activities.unshift(newAct);
    return newAct;
  },

  reviewActivity(
    activityId: string,
    approved: boolean,
    reviewerId: string,
    reason?: string
  ): Activity {
    const state = getDatabase();
    const act = state.activities.find((a) => a.id === activityId);
    if (!act) throw new Error("Activity not found");

    act.status = approved ? "approved" : "rejected";
    act.approvedBy = reviewerId;
    act.approvedAt = new Date().toISOString();
    if (reason) act.rejectionReason = reason;
    return act;
  },

  // --- Attendance Tokens & Check-In ---
  generateAttendanceToken(activityId: string, createdBy: string, minutes = 60): AttendanceToken {
    const state = getDatabase();
    state.attendanceTokens = state.attendanceTokens.filter(
      (t) => t.activityId !== activityId
    );

    const tokenCode = `GITCLUB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const validUntil = new Date(now.getTime() + minutes * 60 * 1000);

    const newToken: AttendanceToken = {
      id: "tok_" + Math.random().toString(36).substring(2, 9),
      activityId,
      tokenCode,
      validFrom: now.toISOString(),
      validUntil: validUntil.toISOString(),
      createdBy,
    };

    state.attendanceTokens.push(newToken);
    return newToken;
  },

  getActiveToken(activityId: string): AttendanceToken | undefined {
    const state = getDatabase();
    const now = new Date().toISOString();
    return state.attendanceTokens.find(
      (t) => t.activityId === activityId && t.validUntil >= now
    );
  },

  checkInStudent(
    activityId: string,
    userId: string,
    code: string,
    method: "qr_code" | "passcode" = "qr_code"
  ): AttendanceRecord {
    const state = getDatabase();

    // 1. Anti-duplicate constraint
    const duplicate = state.attendanceRecords.find(
      (r) => r.activityId === activityId && r.userId === userId
    );
    if (duplicate) {
      throw new Error("Attendance already recorded for this session!");
    }

    // 2. Validate token & window
    const token = state.attendanceTokens.find(
      (t) => t.activityId === activityId && t.tokenCode.toUpperCase() === code.trim().toUpperCase()
    );
    if (!token) {
      throw new Error("Invalid check-in code. Please verify with session coordinator.");
    }

    const now = new Date();
    if (now > new Date(token.validUntil)) {
      throw new Error("Check-in window has expired.");
    }

    // 3. Late arrival detection (e.g. 20+ mins into valid window)
    const tokenStart = new Date(token.validFrom).getTime();
    const elapsedMinutes = (now.getTime() - tokenStart) / (1000 * 60);
    const status: AttendanceRecord["status"] = elapsedMinutes > 20 ? "late" : "present";

    const record: AttendanceRecord = {
      id: "rec_" + Math.random().toString(36).substring(2, 9),
      activityId,
      userId,
      status,
      checkInTime: now.toISOString(),
      checkInMethod: method,
    };

    state.attendanceRecords.push(record);
    return record;
  },

  correctAttendance(
    recordId: string,
    status: AttendanceRecord["status"],
    reason: string,
    correctedBy: string
  ): AttendanceRecord {
    const state = getDatabase();
    const record = state.attendanceRecords.find((r) => r.id === recordId);
    if (!record) throw new Error("Attendance record not found");

    record.status = status;
    record.correctionReason = reason;
    record.correctedBy = correctedBy;
    return record;
  },

  getAttendanceRecords(activityId: string): AttendanceRecord[] {
    const state = getDatabase();
    return state.attendanceRecords
      .filter((r) => r.activityId === activityId)
      .map((r) => {
        const user = state.profiles.find((p) => p.id === r.userId);
        return {
          ...r,
          userFullName: user?.fullName,
          studentId: user?.studentId,
        };
      });
  },

  // --- Submissions & Evaluations ---
  submitWork(
    activityId: string,
    userId: string,
    submissionType: "link" | "file" | "text",
    payload: { linkUrl?: string; fileUrl?: string; notes?: string }
  ): Submission {
    const state = getDatabase();
    const existing = state.submissions.find(
      (s) => s.activityId === activityId && s.userId === userId
    );
    if (existing) {
      throw new Error("You have already submitted work for this activity.");
    }

    const newSub: Submission = {
      id: "sub_" + Math.random().toString(36).substring(2, 9),
      activityId,
      userId,
      submissionType,
      linkUrl: payload.linkUrl,
      fileUrl: payload.fileUrl,
      notes: payload.notes,
      submittedAt: new Date().toISOString(),
    };

    state.submissions.push(newSub);
    return newSub;
  },

  getSubmissions(activityId?: string): Submission[] {
    const state = getDatabase();
    let subs = state.submissions;
    if (activityId) {
      subs = subs.filter((s) => s.activityId === activityId);
    }
    return subs.map((s) => {
      const user = state.profiles.find((p) => p.id === s.userId);
      const activity = state.activities.find((a) => a.id === s.activityId);
      const evaluation = state.evaluations.find((e) => e.submissionId === s.id);
      return {
        ...s,
        userFullName: user?.fullName,
        studentId: user?.studentId,
        activityTitle: activity?.title,
        evaluation,
      };
    });
  },

  evaluateSubmission(
    submissionId: string,
    evaluatorId: string,
    scoreBreakdown: { criteriaName: string; score: number; maxScore: number }[],
    feedback: string
  ): Evaluation {
    const state = getDatabase();

    // Validate bounds
    let totalScore = 0;
    for (const item of scoreBreakdown) {
      if (item.score < 0 || item.score > item.maxScore) {
        throw new Error(`Score for ${item.criteriaName} must be between 0 and ${item.maxScore}`);
      }
      totalScore += item.score;
    }

    if (totalScore > 100) {
      throw new Error("Total score cannot exceed 100 points");
    }

    const scoreContent = scoreBreakdown[0]?.score || 0;
    const scorePresentation = scoreBreakdown[1]?.score || 0;
    const scoreParticipation = scoreBreakdown[2]?.score || 0;

    let evaluation = state.evaluations.find((e) => e.submissionId === submissionId);
    if (evaluation) {
      evaluation.scoreBreakdown = scoreBreakdown;
      evaluation.scoreContent = scoreContent;
      evaluation.scorePresentation = scorePresentation;
      evaluation.scoreParticipation = scoreParticipation;
      evaluation.totalScore = totalScore;
      evaluation.feedback = feedback;
      evaluation.evaluatedAt = new Date().toISOString();
      evaluation.evaluatorId = evaluatorId;
    } else {
      evaluation = {
        id: "eval_" + Math.random().toString(36).substring(2, 9),
        submissionId,
        evaluatorId,
        scoreBreakdown,
        scoreContent,
        scorePresentation,
        scoreParticipation,
        totalScore,
        feedback,
        evaluatedAt: new Date().toISOString(),
      };
      state.evaluations.push(evaluation);
    }
    return evaluation;
  },

  // --- Teams & Events ---
  createTeam(activityId: string, name: string, leadUserId: string, memberUserIds: string[]): Team {
    const state = getDatabase();
    const newTeam: Team = {
      id: "team_" + Math.random().toString(36).substring(2, 9),
      activityId,
      name,
      leadUserId,
      memberUserIds: Array.from(new Set([leadUserId, ...memberUserIds])),
      createdAt: new Date().toISOString(),
    };
    state.teams.push(newTeam);
    return newTeam;
  },

  getTeams(activityId?: string): Team[] {
    const state = getDatabase();
    if (activityId) {
      return state.teams.filter((t) => t.activityId === activityId);
    }
    return state.teams;
  },

  // --- Certificates & Verifications ---
  issueCertificate(
    userId: string,
    organizationId: string,
    title: string,
    type: "participation" | "achievement" | "merit",
    activityId?: string
  ): Certificate {
    const state = getDatabase();
    const org = state.organizations.find((o) => o.id === organizationId);
    const orgPrefix = org?.shortName.replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase() || "MST";
    const verificationCode = `GITCLUB-${orgPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Deterministic cryptographic-style ledger digest
    const rawPayload = `${userId}:${organizationId}:${title}:${type}:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < rawPayload.length; i++) {
      hash = (hash << 5) - hash + rawPayload.charCodeAt(i);
      hash |= 0;
    }
    const pdfHash = Math.abs(hash).toString(16).padStart(16, "0") + "a4f891b72e";

    const cert: Certificate = {
      id: "cert_" + Math.random().toString(36).substring(2, 9),
      userId,
      organizationId,
      activityId,
      certificateType: type,
      title,
      issueDate: new Date().toISOString().split("T")[0],
      verificationCode,
      pdfHash,
    };

    state.certificates.push(cert);
    return cert;
  },

  getCertificates(userId?: string): Certificate[] {
    const state = getDatabase();
    let certs = state.certificates;
    if (userId) {
      certs = certs.filter((c) => c.userId === userId);
    }
    return certs.map((c) => {
      const user = state.profiles.find((p) => p.id === c.userId);
      const org = state.organizations.find((o) => o.id === c.organizationId);
      return {
        ...c,
        userFullName: user?.fullName,
        studentId: user?.studentId,
        organizationName: org?.shortName,
      };
    });
  },

  verifyCertificate(code: string): Certificate | undefined {
    const state = getDatabase();
    const cert = state.certificates.find(
      (c) => c.verificationCode.toUpperCase() === code.trim().toUpperCase()
    );
    if (!cert) return undefined;

    const user = state.profiles.find((p) => p.id === cert.userId);
    const org = state.organizations.find((o) => o.id === cert.organizationId);
    return {
      ...cert,
      userFullName: user?.fullName,
      studentId: user?.studentId,
      organizationName: org?.shortName,
    };
  },

  // --- Institutional Metrics & Non-Double-Counting Aggregations ---
  getInstitutionalMetrics() {
    const state = getDatabase();
    const organizations = state.organizations;
    const units = state.units;
    const initiatives = state.initiatives;

    // Distinct participating students across all organizations
    const uniqueStudentIds = new Set(
      state.memberships
        .filter((m) => m.status === "approved")
        .map((m) => m.userId)
    );

    const totalAttendance = state.attendanceRecords.length;
    const totalSubmissions = state.submissions.length;
    const totalCertificates = state.certificates.length;

    return {
      campusName: state.campuses[0]?.name || "Mirai School of Technology",
      totalOrganizations: organizations.length, // 3: NEX-CELL, Kaizen Tech, MALHAR
      totalUnits: units.length, // 11 units: 6 domains + 5 departments
      totalInitiatives: initiatives.length, // 6 NEX-CELL initiatives
      totalEnrolledStudents: uniqueStudentIds.size,
      totalAttendanceLogs: totalAttendance,
      totalSubmissions: totalSubmissions,
      totalCertificatesIssued: totalCertificates,
      organizationsBreakdown: organizations.map((org) => {
        const orgUnits = units.filter((u) => u.organizationId === org.id);
        const orgInitiatives = initiatives.filter((i) => i.organizationId === org.id);
        const orgMembers = state.memberships.filter(
          (m) => m.organizationId === org.id && m.status === "approved"
        );
        return {
          id: org.id,
          name: org.name,
          shortName: org.shortName,
          type: org.type,
          unitsCount: orgUnits.length,
          initiativesCount: orgInitiatives.length,
          memberCount: orgMembers.length,
          activitiesCount: state.activities.filter((a) => a.organizationId === org.id).length,
        };
      }),
    };
  },
};
