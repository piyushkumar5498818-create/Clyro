# Clyro Open Questions & Policy Assumptions

## 1. Confirmed Requirements (from Prompt & Official References)
1. **Primary Organizations:** The platform must represent exactly NEX-CELL (Entrepreneurship), Kaizen Tech (Technical), and MALHAR (Cultural Society).
2. **Kaizen Domains:** Exactly 6 initial technical domains (Full-Stack Web, Applied AI/ML, Competitive Programming, Mobile App, Open Source, UI/UX).
3. **MALHAR Departments:** Exactly 5 departments (Management, Media, Tech, Designing, PR).
4. **NEX-CELL Initiatives:** 6 core initiative tracks (Founders Fire, Scrap to Scale, Masterminds, Founder Talks, The Mirage, Open Build).
5. **No Double-Counting:** Aggregations of unique students across campus organizations must be distinct.

---

## 2. Institutional Assumptions & Configurable Defaults

| Item | Open Question / Ambiguity | Configured Default Behavior | Justification |
| :--- | :--- | :--- | :--- |
| **Membership Cap** | Can a student join more than 2 clubs? | Configurable default: Max 2 primary organizations. Unit affiliations within an org (domains/departments) do not count toward this cap. | Protects student academic bandwidth while permitting domain specialization. |
| **Geolocation Check-in** | Is GPS check-in required for Club Day? | Disabled by default. Can be enabled per session. High-entropy rotating QR and short time window provide default security. | Avoids invasive location tracking and failures indoors/in basements. |
| **Certificate Thresholds** | What qualifies a student for a certificate? | Default: Session attendance recorded + Rubric score >= 60% on deliverables. | Ensures certificates represent verifiable accomplishment, not merely attendance. |
| **Notification Gateways** | Which SMS/WhatsApp providers are active? | Configurable provider interface. Gracefully logs to application console if third-party credentials are not supplied. | Guarantees testability without blocking on external telecom APIs. |
| **Rubric Criteria** | Do cultural fests use the same 40/30/30 rubric as code reviews? | Organization-specific rubrics supported. Technical default (40/30/30), Pitch default (Problem 30 / Solution 30 / Traction 20 / Presentation 20), Cultural default (Performance 40 / Technique 30 / Stage Presence 30). | Meets the authentic evaluation needs of disparate organization disciplines. |
