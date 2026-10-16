# Clyro Organisational Model: Mirai School of Technology

## 1. Entity Taxonomy & Definitions

To prevent conflating distinct organizational structures, Clyro formalizes the following distinct entity types:

| Entity Type | Definition | Concrete Example at Mirai |
| :--- | :--- | :--- |
| **Organization** | Primary registered collegiate entity with its own faculty advisor, governance, and membership roster. | NEX-CELL, Kaizen Tech, MALHAR |
| **Organization Unit** | An internal division or specialized track within an organization. | Kaizen Tech Domains (e.g. *Applied AI/ML*), MALHAR Departments (e.g. *Media*) |
| **Initiative / Programme** | A recurring activity series or structured venture track within an organization. | NEX-CELL's *Founders Fire*, *Scrap to Scale*, *Open Build* |
| **Activity / Event** | An individual scheduled occurrence (session, workshop, contest, fest, meeting). | Club Day 1 Session, Hackathon Sprint, Auditions |
| **Team** | A transient or permanent collaboration group formed for a specific activity or event. | Pitch Team, Hackathon Squad, Production Crew |

---

## 2. Institutional Organizations

### A. NEX-CELL — Entrepreneurship Club
- **Mission:** Empower student founders, foster venture creation, and bridge academic learning with real-world startup execution.
- **Organization Type:** `entrepreneurship_club`
- **Internal Units & Initiatives:**
  - *Founders Fire:* Pitch critique sessions with faculty, alumni, and angel mentors.
  - *Scrap to Scale:* Rapid prototyping incubator from initial sketch to functional MVP.
  - *Masterminds:* Bi-weekly peer accountability pods tracking revenue and user acquisition.
  - *Founder Talks:* Fireside chats with ecosystem founders and industry operators.
  - *The Mirage:* Flagship 48-hour innovation sprint and venture competition.
  - *Open Build:* Open co-working and collaborative building sprints.
- **Workflow Requirements:** Startup pitch submission, mentor scoring rubric, milestone tracking, team formation.

### B. Kaizen Tech — Technical Club
- **Mission:** Promote technical rigor, open source contribution, modern development stacks, and competitive algorithmic problem-solving.
- **Organization Type:** `technical_club`
- **6 Technical Domains:**
  1. *Full-Stack Web Development:* Modern frontend, serverless microservices, cloud infra.
  2. *Applied AI/ML:* Large language models, deep learning, computer vision, data pipelines.
  3. *Competitive Programming:* Data structures, algorithmic speed contests, ICPC prep.
  4. *Mobile App Development:* React Native, Flutter, mobile systems, iOS/Android deployments.
  5. *Open Source:* Git collaboration, upstream OSS contributions, tooling.
  6. *UI/UX Design:* Wireframing, design systems, design thinking, Figma prototypes.
- **Workflow Requirements:** Technical workshops, GitHub deliverable tracking, domain lead reviews, technical hackathons.

### C. MALHAR — Cultural Society
- **Mission:** Celebrate artistic expression, performing arts, campus events, stage production, and inter-college cultural showcases.
- **Organization Type:** `cultural_society`
- **Leadership Titles:** President, Vice President, Treasurer, Media Head, Department Heads.
- **5 Operating Departments:**
  1. *Management:* Stage planning, venue booking, hospitality, event operations.
  2. *Media:* Event photography, cinematography, video editing, aftermovies.
  3. *Tech:* Stage lighting, audio engineering, visual displays, event infrastructure.
  4. *Designing:* Stage aesthetics, banners, posters, digital branding assets.
  5. *PR:* Social media outreach, sponsorship tie-ups, campus announcements.
- **Workflow Requirements:** Auditions, rehearsal schedules, logistics checklists, task assignments, event photo galleries with consent controls.

---

## 3. Configurable Membership & Allocation Rules

- **Membership Allocation:** Configurable at the campus policy level. Default policy: Students can join up to 2 primary organizations.
- **Unit Affiliation:** Students enrolled in an organization may optionally be assigned to 1 or more units (e.g. Kaizen AI/ML domain or MALHAR Media department).
- **Non-Double Counting Principle:** Institutional reports calculate `COUNT(DISTINCT user_id)` across organizations, preventing inflated student counts when students participate across multiple clubs or departments.
