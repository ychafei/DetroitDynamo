# Detroit Dynamo Owner Evidence Intake

Generated: 2026-05-29T14:14:30.585Z

Owner-fillable evidence intake for the final Detroit Dynamo launch gate. It records what proof must be attached before any live publication, checkout, waiver, redirect, or root promotion change.

This is an intake worksheet only. It cannot clear live gates, approve public claims, enable checkout, collect signatures, remove noindex, or apply redirects by itself.

## Summary

- Intake rows: 13
- Unresolved rows: 12
- Preview-passed rows: 1
- Owner roles: 4
- Blocked live actions: 37
- Safe-to-publish rows: 0
- Live gates cleared: 0
- Publications unlocked: 0

## How To Use

- Fill `evidence_location_to_fill` with the file, URL, deployment id, provider id, legal version id, or owner-approved wording source.
- Fill `approver_name_to_fill`, `approval_date_to_fill`, `owner_decision_to_fill`, and `notes_to_fill` during owner review.
- Use only the allowed owner decision values listed below.
- Keep `safe_to_publish`, `live_gate_cleared`, and `publication_unlocked` false until the separate live gate process is completed and verified.

Allowed owner decisions:
- not_recorded
- evidence_attached
- owner_review_requested
- changes_requested
- preview_signed_off
- approved_after_all_gates_clear

## Intake Rows

| Intake ID | Owner | Gate | Status | Required Artifact | Verification |
| --- | --- | --- | --- | --- | --- |
| owner-evidence-current-site-route-snapshot | Master Admin | Current LC site preservation | preview_passed | Current LC route smoke output, browser QA report, and rollback deployment id | `BASE_URL=<production-preview-url> npm run test -- --run` |
| owner-evidence-backend-preflight-and-provisioning | Master Admin | Data backend live | evidence_required | Backend preflight report plus Appwrite provision/apply transcript for isolated dd_* collections | `npm run preflight:dynamo-backend && npm run provision:dynamo-appwrite -- --apply` |
| owner-evidence-backend-function-production-preview | Registrar | Data backend live | evidence_required | Production-preview submission ids for every public form variant and authenticated admin action | `npm run verify:dynamo-intake-contract && npm run verify:dynamo-pipeline-actions` |
| owner-evidence-payment-package-approval | Master Admin | Payments approved | pending_confirmation | Approved package matrix with prices, session counts, taxes/fees, refund rules, and provider product ids | `npm run verify:dynamo-gate-contracts` |
| owner-evidence-payment-provider-sandbox | Master Admin | Payments approved | evidence_required | Successful sandbox payment, failure, refund/cancel, and webhook/audit test evidence | `Provider sandbox test plus npm run verify:dynamo-gate-contracts` |
| owner-evidence-waiver-legal-version-approval | Registrar | Waivers approved | pending_confirmation | Approved waiver/legal version register for youth, adult, medical, media, camp, and travel consent | `npm run verify:dynamo-gate-contracts && npm run verify:dynamo-safeguarding` |
| owner-evidence-waiver-signature-workflow-test | Registrar | Waivers approved | evidence_required | Guardian/adult signature workflow test with audit trail, export, expiration, and revocation handling | `npm run verify:dynamo-safeguarding` |
| owner-evidence-league-competition-confirmation | Club Director | League and facility facts confirmed | future_pathway | Official league, competition, fixture, roster, and staff confirmation documents or owner-approved public wording | `npm run verify:dynamo-claim-safety` |
| owner-evidence-facility-operations-confirmation | Club Director | League and facility facts confirmed | pending_confirmation | Facility permits/agreements, schedule windows, emergency procedures, insurance notes, and location publish approval | `npm run verify:dynamo-claim-safety && npm run verify:dynamo-safeguarding` |
| owner-evidence-staff-roster-safeguarding-confirmation | Club Director | League and facility facts confirmed | pending_confirmation | Staff approval, background/safeguarding status, roster publication approvals, and media-release coverage | `npm run verify:dynamo-safeguarding && npm run verify:dynamo-admin-role-grants` |
| owner-evidence-sponsor-media-proof-confirmation | Media/Admin Staff | League and facility facts confirmed | pending_confirmation | Sponsor logo permissions, testimonial approvals, media releases, news proof, and publishing calendar | `npm run verify:dynamo-claim-safety` |
| owner-evidence-seo-metadata-noindex-approval | Media/Admin Staff | SEO and redirect launch approved | preview_only | Approved titles, descriptions, favicon, Open Graph asset, robots, sitemap, canonical URLs, and noindex removal approval | `BASE_URL=<production-preview-url> npm run verify:dynamo` |
| owner-evidence-redirect-cutover-and-postlaunch-qa | Master Admin | SEO and redirect launch approved | preview_only | Approved redirect plan, auth/payment/admin exclusions, post-cutover route QA, and rollback instructions | `BASE_URL=<production-url> npm run qa:dynamo-browser` |

## Row Details

### owner-evidence-current-site-route-snapshot

Review section: Current LC site preservation

Confirmation area: Current LC Site

Evidence type: verification_report

Next action: Do not replace the root route until the current-site snapshot and rollback target are saved.

Acceptance criteria:
- [ ] Root, booking, auth, blog, team, LCFC, apply, terms, privacy, and admin routes still respond.
- [ ] LC Training header/footer/navigation remain intact outside Detroit Dynamo routes.
- [ ] A rollback deployment id or previous production build target is recorded before promotion.

Blocked live actions:
- root route promotion
- permanent redirects
- noindex removal

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-backend-preflight-and-provisioning

Review section: Backend data activation

Confirmation area: Backend/Data

Evidence type: backend_report

Next action: Keep public forms in local preview/fallback mode until Appwrite schema provisioning is verified.

Acceptance criteria:
- [ ] Preflight passes without printing secrets.
- [ ] All Detroit Dynamo dd_* collections, attributes, indexes, and permissions exist in the target Appwrite project.
- [ ] Legacy LC Training collections are not mutated by the Dynamo provisioner.

Blocked live actions:
- Appwrite intake default
- admin write mode default
- live lead routing

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-backend-function-production-preview

Review section: Backend data activation

Confirmation area: Backend/Data

Evidence type: function_smoke

Next action: Do not make Appwrite the default intake mode until production-preview submissions and admin actions pass.

Acceptance criteria:
- [ ] Lead intake, pipeline action, module read, role grant, and module write functions are deployed with expected scopes.
- [ ] Training, tryout, youth, senior men, senior women, sponsor, and contact forms create expected records.
- [ ] Authenticated admin actions write audit events and reject unauthorized users.

Blocked live actions:
- default live intake
- status mutation workflow
- protected admin live writes

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-payment-package-approval

Review section: Payments and packages

Confirmation area: Payments & Packages

Evidence type: owner_signoff

Next action: Owner approves package matrix, provider, refund rules, and admin payment fields.

Acceptance criteria:
- [ ] Private, small-group, team-training, camp, tryout, youth dues, and sponsor packages are approved.
- [ ] Provider product ids or invoice workflow ids are mapped to TrainingPackage, Payment, Booking, CampClinic, and Sponsor records.
- [ ] Refund, cancellation, failed-payment, and settlement handling are documented.

Blocked live actions:
- checkout activation
- payment collection
- published exact pricing

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-payment-provider-sandbox

Review section: Payments and packages

Confirmation area: Payments & Packages

Evidence type: provider_test

Next action: Owner approves package matrix, provider, refund rules, and admin payment fields.

Acceptance criteria:
- [ ] Checkout succeeds for approved training, camp, dues, and sponsor payment paths.
- [ ] Failed, canceled, and refunded payments map cleanly to Payment records.
- [ ] No public Dynamo payment surface is enabled without the approved package matrix.

Blocked live actions:
- payment provider live mode
- camp checkout
- dues/deposit collection

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-waiver-legal-version-approval

Review section: Waivers and legal

Confirmation area: Waivers & Legal

Evidence type: legal_signoff

Next action: Prepare approved waiver versions and map each form/program to the right waiver requirement.

Acceptance criteria:
- [ ] Each waiver has approved language, version id, effective date, expiration rule, and owner/legal signoff.
- [ ] Minor participation requires guardian signature coverage and data-retention rules.
- [ ] Waiver requirements are mapped to tryouts, camps, training bookings, teams, and roster eligibility.

Blocked live actions:
- signature capture
- medical intake
- roster eligibility clearance

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-waiver-signature-workflow-test

Review section: Waivers and legal

Confirmation area: Waivers & Legal

Evidence type: workflow_test

Next action: Prepare approved waiver versions and map each form/program to the right waiver requirement.

Acceptance criteria:
- [ ] Guardian and adult signature paths are tested on mobile and desktop.
- [ ] Signed waiver records retain version, signer, timestamp, related player/program, and audit evidence.
- [ ] Expired, revoked, or missing waivers block the correct admin workflows.

Blocked live actions:
- youth registration launch
- camp registration launch
- senior tryout waiver enforcement

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-league-competition-confirmation

Review section: League, competition, and facility facts

Confirmation area: League & Competition Facts

Evidence type: official_confirmation

Next action: Collect official league/competition documentation and owner-approved public wording.

Acceptance criteria:
- [ ] No current UPSL, UPSL Women, youth league, roster, fixture, or result claim is published without confirmation.
- [ ] Future-pathway language remains in place for unconfirmed leagues and teams.
- [ ] Fixture, opponent, venue, competition, roster, and staff claims are individually approved before publication.

Blocked live actions:
- league claim publication
- fixture/result publication
- roster/staff proof publication

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-facility-operations-confirmation

Review section: League, competition, and facility facts

Confirmation area: Facilities & Operations

Evidence type: operations_confirmation

Next action: Confirm facility partners, operating rules, insurance requirements, and calendar windows.

Acceptance criteria:
- [ ] Training, tryout, camp, indoor, match, and youth-team locations are confirmed before publication.
- [ ] Facility partner permissions, check-in instructions, weather/cancel rules, and emergency procedures are documented.
- [ ] Address, parking, access, and schedule copy is approved before going public.

Blocked live actions:
- facility publication
- camp date publication
- tryout schedule publication

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-staff-roster-safeguarding-confirmation

Review section: League, competition, and facility facts

Confirmation area: Staff, Rosters & Safeguarding

Evidence type: safeguarding_review

Next action: Collect staff/roster approvals and map internal roles to admin permissions.

Acceptance criteria:
- [ ] Staff and coach profiles are approved before publication.
- [ ] Youth player roster visibility follows guardian consent, media release, and safeguarding policy.
- [ ] Team manager and coach access is scoped to assigned teams and verified through role grants.

Blocked live actions:
- staff proof publication
- youth roster publication
- team-manager sensitive access

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-sponsor-media-proof-confirmation

Review section: League, competition, and facility facts

Confirmation area: Sponsors, Media & Content Proof

Evidence type: content_approval

Next action: Approve sponsor assets, proof content, launch copy, and publication workflow before promotion.

Acceptance criteria:
- [ ] Sponsor logos, testimonials, photos, video, and outcome claims have permission before publication.
- [ ] News/media proof is tied to approved source material.
- [ ] Sponsor package activation promises match approved sponsorship inventory.

Blocked live actions:
- sponsor logo publication
- testimonial publication
- player outcome publication

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-seo-metadata-noindex-approval

Review section: SEO, redirects, and promotion cutover

Confirmation area: Sponsors, Media & Content Proof

Evidence type: seo_signoff

Next action: Approve sponsor assets, proof content, launch copy, and publication workflow before promotion.

Acceptance criteria:
- [ ] Detroit Dynamo metadata and social assets are approved for the public root brand.
- [ ] Noindex removal is owner-approved and tied to the approved launch window.
- [ ] Current LC Training root SEO is not overwritten before promotion approval.

Blocked live actions:
- noindex removal
- root metadata replacement
- sitemap publication

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

### owner-evidence-redirect-cutover-and-postlaunch-qa

Review section: SEO, redirects, and promotion cutover

Confirmation area: Sponsors, Media & Content Proof

Evidence type: route_qa

Next action: Approve sponsor assets, proof content, launch copy, and publication workflow before promotion.

Acceptance criteria:
- [ ] Old LC routes, auth routes, admin routes, and payment callbacks have explicit redirect/exclusion decisions.
- [ ] Post-cutover browser QA passes on desktop and mobile.
- [ ] Rollback instructions are documented before permanent redirects are applied.

Blocked live actions:
- permanent redirects
- canonical alias migration
- post-launch closeout

Owner fill-in:
- [ ] Evidence location:
- [ ] Approver name:
- [ ] Approval date:
- [ ] Owner decision:
- [ ] Notes:

## Blocked Live Actions

- Appwrite intake default
- admin write mode default
- camp checkout
- camp date publication
- camp registration launch
- canonical alias migration
- checkout activation
- default live intake
- dues/deposit collection
- facility publication
- fixture/result publication
- league claim publication
- live lead routing
- medical intake
- noindex removal
- payment collection
- payment provider live mode
- permanent redirects
- player outcome publication
- post-launch closeout
- protected admin live writes
- published exact pricing
- root metadata replacement
- root route promotion
- roster eligibility clearance
- roster/staff proof publication
- senior tryout waiver enforcement
- signature capture
- sitemap publication
- sponsor logo publication
- staff proof publication
- status mutation workflow
- team-manager sensitive access
- testimonial publication
- tryout schedule publication
- youth registration launch
- youth roster publication
