# Clyro Role-Based Access Control (RBAC) Matrix

## 1. Role Definitions & Scopes

Clyro strictly separates global permissions from organization-scoped and unit-scoped permissions:

| Role Category | Scope | Description |
| :--- | :--- | :--- |
| **College Admin / Program Manager** | Global | Full campus governance, cross-organization audits, ledger verification, master exports. |
| **Campus Manager** | Campus | Campus-level oversight, Duty Leave approvals, multi-club event sign-offs. |
| **Faculty Advisor** | Organization | Official academic advisor assigned to an organization; approves plans and evaluates submissions. |
| **Organization / Society Admin** | Organization | Student president/leader of NEX-CELL, Kaizen Tech, or MALHAR; oversees all internal units. |
| **Student Coordinator** | Organization / Unit | Operational lead managing day-to-day sessions, QR attendance, and member lists. |
| **Domain / Department Lead** | Unit | Technical lead of a Kaizen domain or head of a MALHAR department; reviews unit submissions. |
| **Student** | Self | Enrolls in organizations, marks attendance via dynamic QR/code, submits work, downloads transcript. |
| **Public / Anonymous** | Public | Read-only access to verify certificate authenticity codes at `/verify`. |

---

## 2. Granular Permissions Matrix

| Capability / Action | College Admin | Campus Manager | Faculty Advisor | Org/Society Admin | Coordinator | Unit Lead | Student | Public |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Create / Deactivate Organization** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Create / Manage Units (Domains/Depts)** | ✅ | ✅ | ✅ (Own Org) | ✅ (Own Org) | ❌ | ❌ | ❌ | ❌ |
| **Approve Membership Requests** | ✅ | ✅ | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Org) | ❌ | ❌ | ❌ |
| **Propose Activity Plan** | ✅ | ❌ | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Unit)| ❌ | ❌ |
| **Approve Activity Plan** | ✅ | ✅ | ✅ (Own Org) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Launch QR / Passcode Attendance** | ✅ | ❌ | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Unit)| ❌ | ❌ |
| **Check In to Attendance Session** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Enrolled)| ❌ |
| **Correct Attendance (with Reason)**| ✅ | ❌ | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Org) | ❌ | ❌ | ❌ |
| **Submit Activity Deliverables** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Enrolled)| ❌ |
| **Grade Submissions (Rubric)** | ✅ | ❌ | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Org) | ✅ (Own Unit)| ❌ | ❌ |
| **Issue Official Certificates** | ✅ | ✅ | ✅ (Own Org) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Download My Certificate / Transcript**| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (Own) | ❌ |
| **Verify Certificate Ledger Record** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Export Campus Participation Data** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Server-Side Enforcement Rules
1. **Never trust client parameters:** User ID and roles are extracted from the verified session or secure server token.
2. **Multi-tenant isolation:** A coordinator for Kaizen Tech cannot approve memberships, alter attendance, or grade work for NEX-CELL or MALHAR.
3. **No self-evaluation:** Coordinators or student leads cannot evaluate their own submissions.
4. **Audit trail:** All status modifications (attendance corrections, plan approvals, grade revisions) mandate actor identity and timestamps.
