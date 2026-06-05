# Detroit Dynamo External Gate Closure Packet

Generated: 2026-05-29T14:14:31.146Z

Decision: External Gate Closure Required

Detroit Dynamo can stay preview-complete, but final goal completion requires real external evidence for backend, payments, waivers, league/facility facts, deployment, cutover, and owner signoff.

This packet does not close external gates, approve launch, enable payments, enable signature capture, publish claims, remove noindex, apply redirects, or replace the current LC Training root site.

## Summary

- Closure rows: 9
- External-evidence rows: 8
- Owner-review rows: 1
- Critical rows: 7
- Gate groups: 7
- Owner roles: 4
- Source artifacts: 21
- Required evidence items: 36
- Verification commands: 22
- Blocked live actions: 27
- Ready-to-close rows: 0
- Closure-allowed rows: 0
- Live gates cleared: 0
- Publications unlocked: 0
- Production deployments recorded: 0
- Production submissions recorded: 0
- Root promotion allowed: false
- Checkout allowed: false
- Signature capture allowed: false
- Completion claim allowed: false

## Usage Rules

- Use this packet after the preview implementation passes local verification and before any live promotion meeting.
- Fill real evidence locations in the owner evidence intake worksheet; this packet only names the evidence required.
- Do not mark any row ready to close until its external proof, owner approver, date, and verification command output exist.
- Keep completion claims, root promotion, checkout, signatures, redirects, and publication blocked until all closure rows are approved.

## Closure Rows

| Row | Group | Owner | Priority | Status | Closure Question |
| --- | --- | --- | --- | --- | --- |
| Appwrite project, credentials, and environment readiness | Backend/Data | Master Admin | critical | external_evidence_required | Can the owner prove the backend project and secrets are valid without exposing values in docs or artifacts? |
| Provision isolated Detroit Dynamo dd_* schema | Backend/Data | Master Admin | critical | external_evidence_required | Do the provisioned Appwrite collections match the typed Detroit Dynamo schema plan? |
| Deploy functions and capture production-preview submission proof | Backend/Data | Master Admin | critical | external_evidence_required | Do real production-preview submissions and admin actions prove the live backend path works before promotion? |
| Approve package matrix, provider products, checkout, and webhook proof | Payments & Packages | Master Admin | critical | external_evidence_required | Are packages and payment products approved, tested, and auditable before checkout appears? |
| Approve waiver versions, signature capture, and safeguarding workflow | Waivers/Legal/Safeguarding | Registrar | critical | external_evidence_required | Can Detroit Dynamo safely collect youth, adult, medical, and media consent records? |
| Confirm league, facility, and operations facts | League/Facility Facts | Club Director | high | external_evidence_required | Are league and facility facts either confirmed or still clearly framed as future-pathway goals? |
| Attach staff, roster, sponsor, testimonial, media, and news proof | Content/Brand Proof | Media/Admin Staff | high | external_evidence_required | Is every proof-like public asset backed by permission and a reviewable source? |
| Record Vercel preview deployment, cutover, redirect, and rollback evidence | Deployment/Cutover | Master Admin | critical | external_evidence_required | Can the owner promote Detroit Dynamo with a tested preview URL, rollback target, and approved redirect/noindex plan? |
| Collect owner final signoff before completion claim | Owner Closeout | Master Admin | critical | owner_review_required | Has the owner signed every external gate row with evidence strong enough to claim the original objective complete? |

## Required Evidence By Row

### Appwrite project, credentials, and environment readiness

Owner: Master Admin

Status: external_evidence_required

Required evidence:
- [ ] Valid Appwrite project id, endpoint, and server credentials stored only in approved secret stores
- [ ] Confirmed Appwrite API key replacement after the expired local key is removed or rotated
- [ ] Preview and production environment variable checklist with values redacted from handoff artifacts
- [ ] Secret redaction scan showing 0 exact local secret matches and 0 identifier matches after evidence is attached

Verification commands:
- `npm run preflight:dynamo-backend`
- `npm run verify:dynamo-secret-redaction`
- `npm run plan:dynamo-appwrite`

Source artifacts:
- `artifacts/detroit-dynamo/backend-preflight.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-secret-redaction.md`

Blocked live actions:
- Appwrite intake default
- protected admin live reads
- protected admin live writes

### Provision isolated Detroit Dynamo dd_* schema

Owner: Master Admin

Status: external_evidence_required

Required evidence:
- [ ] Dry-run plan reviewed for all isolated dd_* collections, attributes, indexes, and permissions
- [ ] Apply run completed against the target Appwrite project
- [ ] Collection count, attribute count, and index count captured in a redacted proof artifact
- [ ] Rollback or recreate plan documented before live writes are enabled

Verification commands:
- `npm run plan:dynamo-appwrite`
- `npm run provision:dynamo-appwrite -- --apply`
- `npm run preflight:dynamo-backend`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.md`

Blocked live actions:
- live lead routing
- protected admin live reads
- protected admin live writes

### Deploy functions and capture production-preview submission proof

Owner: Master Admin

Status: external_evidence_required

Required evidence:
- [ ] Public intake function deployed and invoked from a production-preview URL for all seven public form variants
- [ ] Authenticated pipeline, module-read, role-grant, and module-write functions deployed with role-scoped proof
- [ ] Production-preview submission ids captured for ContactLead, Booking, TryoutRegistration, Sponsor, Player, and ParentGuardian paths
- [ ] Failure-path proof captured for validation, unauthenticated admin access, missing role grants, and external gate blocks

Verification commands:
- `npm run verify:dynamo-intake-contract`
- `npm run verify:dynamo-pipeline-actions`
- `npm run verify:dynamo-admin-module-read`
- `npm run verify:dynamo-admin-role-grants`
- `npm run verify:dynamo-admin-module-writes`
- `BASE_URL=<production-preview-url> npm run qa:dynamo-browser`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-handoff.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-pipeline-action-handoff.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md`

Blocked live actions:
- Appwrite intake default
- live lead routing
- protected admin live writes
- public launch announcement

### Approve package matrix, provider products, checkout, and webhook proof

Owner: Master Admin

Status: external_evidence_required

Required evidence:
- [ ] Owner-approved package matrix with exact prices, taxes, fees, session counts, refund rules, and payment schedules
- [ ] Provider product/price ids mapped to private training, small-group training, camps, youth dues, and sponsorship workflows
- [ ] Sandbox checkout success, failure, webhook, refund, and duplicate-submission proof
- [ ] Admin payment record and audit-event proof before checkout is linked from public pages

Verification commands:
- `npm run verify:dynamo-gate-contracts`
- `npm run verify:dynamo-owner-signoff-register`
- `npm run verify:dynamo-final-acceptance`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md`

Blocked live actions:
- checkout activation
- payment collection
- package publication

### Approve waiver versions, signature capture, and safeguarding workflow

Owner: Registrar

Status: external_evidence_required

Required evidence:
- [ ] Approved youth, adult, medical consent, media release, camp/clinic, and team travel waiver versions
- [ ] Guardian/adult signature workflow proof with export, expiration, revocation, and audit-event handling
- [ ] Approved privacy, retention, medical-data access, and minor safeguarding procedures
- [ ] Legal/support communications handoff for terms, privacy, refund, and support identity

Verification commands:
- `npm run verify:dynamo-safeguarding`
- `npm run verify:dynamo-gate-contracts`
- `npm run verify:dynamo-owner-evidence-intake`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv`

Blocked live actions:
- signature capture
- medical intake
- youth registration launch
- sensitive admin mutations

### Confirm league, facility, and operations facts

Owner: Club Director

Status: external_evidence_required

Required evidence:
- [ ] Confirmed senior league status or owner-approved future-pathway wording for men and women
- [ ] Confirmed youth league language or explicit roadmap wording that does not imply current membership
- [ ] Facility, field, indoor, schedule, insurance, and operations proof before names or addresses are published as facts
- [ ] Public copy review showing unconfirmed items remain future-pathway or approval-gated

Verification commands:
- `npm run verify:dynamo-claim-safety`
- `npm run verify:dynamo-external-confirmation-actions`
- `BASE_URL=<preview-url> npm run verify:dynamo`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md`

Blocked live actions:
- league claim publication
- facility publication
- fixture publication

### Attach staff, roster, sponsor, testimonial, media, and news proof

Owner: Media/Admin Staff

Status: external_evidence_required

Required evidence:
- [ ] Staff bios, credentials, headshots, and safeguarding clearance approved before publication
- [ ] Roster permission, player media release, and team status proof before roster cards go live
- [ ] Sponsor logo permission, package commitment, and usage rules approved before sponsor marks appear
- [ ] Testimonials, news posts, match media, and outcome claims backed by source proof and owner approval

Verification commands:
- `npm run verify:dynamo-claim-safety`
- `npm run verify:dynamo-safeguarding`
- `npm run verify:dynamo-external-confirmation-actions`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md`

Blocked live actions:
- staff proof publication
- roster publication
- sponsor logo publication
- testimonial publication
- news publication

### Record Vercel preview deployment, cutover, redirect, and rollback evidence

Owner: Master Admin

Status: external_evidence_required

Required evidence:
- [ ] Vercel CLI upgraded before deployment work and linked project inspected with identifiers redacted from handoffs
- [ ] Production-preview URL, deployment id, inspect summary, function/log review, route QA, and form QA recorded
- [ ] Current production snapshot, rollback target, promotion hold, root-route promotion plan, and redirect plan approved
- [ ] Noindex removal, sitemap publication, canonical/root switch, and permanent redirect timing approved by owner

Verification commands:
- `npm run verify:dynamo-vercel-preview`
- `npm run verify:dynamo-deployment-readiness`
- `npm run verify:dynamo-promotion-cutover`
- `BASE_URL=<production-preview-url> npm run qa:dynamo-browser`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-vercel-preview-runbook.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md`

Blocked live actions:
- production deployment
- root route promotion
- noindex removal
- permanent redirects
- sitemap publication

### Collect owner final signoff before completion claim

Owner: Master Admin

Status: owner_review_required

Required evidence:
- [ ] Every external gate row has a real evidence location, approver, date, owner decision, and notes
- [ ] Owner signoff register has signed rows only after backend, payments, waivers, proof, deployment, and cutover evidence exists
- [ ] Final acceptance matrix external-evidence rows are approved and go-live allowed only after real evidence is attached
- [ ] Requirement-level goal audit proves no remaining work before any completion claim is made

Verification commands:
- `npm run verify:dynamo-owner-signoff-register`
- `npm run verify:dynamo-final-acceptance`
- `npm run audit:dynamo-goal`

Source artifacts:
- `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md`
- `artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md`
- `artifacts/detroit-dynamo/goal-audit.json`

Blocked live actions:
- goal completion claim
- owner closeout
- public launch announcement

## Blocked Live Actions

- Appwrite intake default
- checkout activation
- facility publication
- fixture publication
- goal completion claim
- league claim publication
- live lead routing
- medical intake
- news publication
- noindex removal
- owner closeout
- package publication
- payment collection
- permanent redirects
- production deployment
- protected admin live reads
- protected admin live writes
- public launch announcement
- root route promotion
- roster publication
- sensitive admin mutations
- signature capture
- sitemap publication
- sponsor logo publication
- staff proof publication
- testimonial publication
- youth registration launch
