# Detroit Dynamo Safeguarding and Data Privacy Contract

Generated: 2026-05-29T14:14:32.024Z

This contract keeps youth safety, guardian consent, medical data, staff verification, media releases, retention, and role-scoped admin access explicit while Detroit Dynamo remains preview-only.

| Track | Owner | Protection Mode | Status | Routes | Blocked Action |
| --- | --- | --- | --- | --- | --- |
| Minor intake and guardian consent | Registrar | guardian_required | policy_review_required | /detroit-dynamo/tryouts, /detroit-dynamo/youth-club, /detroit-dynamo/camps-clinics | Do not treat a minor player as registered, rostered, or cleared for participation until guardian consent and waiver status are confirmed. |
| Coach, staff, and background-check readiness | Club Director | staff_verification_required | policy_review_required | /detroit-dynamo/about, /detroit-dynamo/training, /detroit-dynamo/teams | Do not publish staff credibility claims or assign youth-facing staff until verification and safeguarding process are approved. |
| Youth communication boundaries | Registrar | guardian_visible_communication | policy_review_required | /detroit-dynamo/contact, /detroit-dynamo/tryouts, /detroit-dynamo/youth-club | Do not build direct-to-minor communication workflows until guardian-visible communication rules are approved. |
| Medical and emergency data handling | Registrar | restricted_health_context | legal_review_required | /detroit-dynamo/tryouts, /detroit-dynamo/camps-clinics, /detroit-dynamo/book | Do not collect medical disclosures or emergency-contact legal consent until reviewed language and access rules are approved. |
| Waiver versions and media release governance | Registrar | versioned_release_required | legal_review_required | /detroit-dynamo/tryouts, /detroit-dynamo/camps-clinics, /detroit-dynamo/about, /detroit-dynamo/sponsors | Do not publish player photos, testimonials, sponsor proof, or media clips without current release coverage. |
| Roster, travel, and event clearance | Team Manager | participation_clearance_required | policy_review_required | /detroit-dynamo/teams, /detroit-dynamo/schedule-results, /detroit-dynamo/senior-men, /detroit-dynamo/senior-women | Do not mark players active for matches, travel, or events until roster and consent clearance are approved. |
| Data retention, export, and deletion | Master Admin | retention_policy_required | policy_review_required | /detroit-dynamo/contact, /detroit-dynamo/tryouts, /detroit-dynamo/book, /admin/detroit-dynamo | Do not treat browser-local preview leads as durable records or migrate them without retention and privacy approval. |
| Admin access and audit trail | Master Admin | role_scoped_audit_required | backend_required | /admin/detroit-dynamo, /admin/detroit-dynamo/modules/players, /admin/detroit-dynamo/modules/waivers-forms | Do not enable live sensitive record mutation until role-scoped authorization and audit logging are wired server-side. |

## Required Controls

### Minor intake and guardian consent

- [ ] Guardian name and contact captured for minor-facing youth, tryout, and camp records
- [ ] Guardian relationship and communication preference approved before live registration
- [ ] Minor records scoped to registrar, assigned coach, and approved team staff only
- [ ] Consent status visible before evaluations, camps, team placement, or media publication

Preview handling: Preview forms may collect interest and guardian names, but signatures and legal consent stay disabled.

### Coach, staff, and background-check readiness

- [ ] Background-check status captured before assigning youth-facing responsibilities
- [ ] Coach licenses, specialties, bios, and photos approved before public display
- [ ] Youth communication and supervision expectations acknowledged by staff
- [ ] Expired or rejected background-check states block youth-facing assignments

Preview handling: Preview pages can describe coaching standards without inventing names, licenses, or clearance status.

### Youth communication boundaries

- [ ] Minor communications route through guardian-approved contact methods
- [ ] Team manager and coach access scoped to assigned teams or sessions
- [ ] Internal notes avoid sensitive medical, disciplinary, or personal details unless required for safety
- [ ] Escalation path exists for parent concerns, opt-outs, and communication corrections

Preview handling: Preview lead follow-up stays owner-assigned and does not create live messaging threads.

### Medical and emergency data handling

- [ ] Emergency contact fields approved before collection
- [ ] Medical notes limited to safety-relevant context with restricted visibility
- [ ] Coach visibility limited to participation-critical information
- [ ] Retention and deletion rules approved for medical and emergency records

Preview handling: Preview forms avoid medical intake and route health/waiver details to future approved workflows.

### Waiver versions and media release governance

- [ ] Waiver type, version, signed date, expiration, and status tracked per player
- [ ] Minor media release requires guardian approval and opt-out path
- [ ] Sponsor/content usage rules mapped to approved media releases
- [ ] Expired or missing release status blocks public player proof and media publication

Preview handling: Preview proof slots remain placeholders until signed release coverage and asset permission exist.

### Roster, travel, and event clearance

- [ ] Roster eligibility depends on registration, waiver, and age-group status
- [ ] Travel/event consent mapped to fixture or event records where needed
- [ ] Team manager visibility scoped to assigned roster and event logistics
- [ ] Fixture publication does not imply player participation clearance

Preview handling: Roster-ready and schedule-ready layouts remain placeholders until confirmed records exist.

### Data retention, export, and deletion

- [ ] Retention periods approved for leads, players, guardians, bookings, tryouts, sponsors, and archived records
- [ ] Export workflow approved for owner/admin review without exposing unnecessary minor data
- [ ] Correction and deletion request path assigned to a responsible role
- [ ] Local preview storage remains clearly separate from live backend records

Preview handling: Preview lead export is browser-local planning data and should be cleared or migrated only after owner approval.

### Admin access and audit trail

- [ ] Role access follows the Detroit Dynamo permission matrix
- [ ] Sensitive actions on minor, waiver, staff, and medical-related records produce audit events
- [ ] Coach and media/admin roles cannot see payment, waiver, or guardian data outside approved scope
- [ ] Pipeline status changes keep actor role, note, timestamp, and event count

Preview handling: Local preview transitions show the intended audit shape but do not replace live backend enforcement.

## Promotion Rule

Do not launch live youth registration, medical intake, waiver signatures, roster clearance, staff publication, media proof, or sensitive admin mutation until these controls have owner approval and backend enforcement.
