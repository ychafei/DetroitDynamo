# Detroit Dynamo Live Readiness Board

Generated: 2026-05-29T14:14:30.694Z

Decision: No-Go: Preview Only

Detroit Dynamo has a complete preview and launch handoff, but live backend, payment, waiver, fact-proof, SEO, redirect, and owner approval gates are not cleared.

## Summary

- Rows: 11
- Blocked rows: 11
- Go-live allowed rows: 0
- Live gates cleared: 0
- Publications unlocked: 0
- Production submissions recorded: 0
- Safe-to-publish rows: 0
- Root promotion allowed: false
- Checkout allowed: false
- Signature capture allowed: false
- Public claim publication allowed: false
- Noindex removal allowed: false
- Permanent redirects allowed: false

## Launch Blockers

- Do not replace the LC Training root route.
- Do not remove noindex or publish permanent redirects.
- Do not make Appwrite intake, admin writes, checkout, or waiver signatures live by default.
- Do not publish current league, facility, staff, roster, sponsor, testimonial, or outcome claims without proof.
- Do not announce launch until owner evidence intake, production-preview evidence, and owner launch review are all signed off.

## Board Rows

| Phase | Owner | Decision | Gate Status | Evidence | Intake | Production Preview |
| --- | --- | --- | --- | --- | --- | --- |
| Current LC site and rollback | Master Admin | review_ready_not_promoted | Current LC site preservation: passing_in_preview | 1 | 1 | 2 |
| Backend and Appwrite live mode | Master Admin | blocked_until_backend_evidence | Data backend live: planned | 2 | 2 | 8 |
| Public form production-preview submissions | Registrar | blocked_until_submission_ids | Data backend live: planned | 2 | 2 | 8 |
| Protected admin live operations | Master Admin | blocked_until_admin_function_evidence | Data backend live: planned | 3 | 3 | 5 |
| Payments, packages, and provider tests | Master Admin | blocked_until_payment_approval | Payments approved: pending_confirmation | 2 | 2 | 1 |
| Waivers, legal, and signature workflow | Registrar | blocked_until_legal_approval | Waivers approved: pending_confirmation | 2 | 2 | 1 |
| League, facility, and operations proof | Club Director | blocked_until_fact_confirmation | League and facility facts confirmed: future_pathway | 4 | 4 | 3 |
| Staff, rosters, and safeguarding proof | Club Director | blocked_until_safeguarding_review | League and facility facts confirmed: future_pathway | 4 | 4 | 3 |
| Sponsor, media, and content proof | Media/Admin Staff | blocked_until_content_permissions | League and facility facts confirmed: future_pathway; SEO and redirect launch approved: preview_only | 6 | 6 | 1 |
| SEO, redirects, and root cutover | Master Admin | blocked_until_cutover_approval | SEO and redirect launch approved: preview_only | 3 | 3 | 3 |
| Post-launch monitoring and rollback | Master Admin | blocked_until_monitoring_owner | SEO and redirect launch approved: preview_only | 3 | 3 | 2 |

## Row Details

### Current LC site and rollback

Phase: Preserve existing business

Owner: Master Admin

Decision: review_ready_not_promoted

Go-live allowed: false

Required proof:
- [ ] Current LC route smoke output from the production-preview URL
- [ ] Browser QA screenshots for the current homepage and booking shell
- [ ] Rollback deployment id or prior production build target

Verification commands:
- `BASE_URL=<production-preview-url> npm run test -- --run`
- `BASE_URL=<production-preview-url> npm run qa:dynamo-browser`

Artifacts:
- artifacts/detroit-dynamo/goal-audit.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json
- artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md

Blocked live actions:
- root route promotion
- permanent redirects
- noindex removal

### Backend and Appwrite live mode

Phase: Activate isolated data backend

Owner: Master Admin

Decision: blocked_until_backend_evidence

Go-live allowed: false

Required proof:
- [ ] Preflight report without secret leakage
- [ ] Provision/apply transcript for isolated dd_* collections
- [ ] Function variables and deployment proof for all Detroit Dynamo functions

Verification commands:
- `npm run preflight:dynamo-backend`
- `npm run provision:dynamo-appwrite -- --apply`
- `node scripts/configure-functions.mjs`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md

Blocked live actions:
- Appwrite intake default
- live lead routing
- protected admin live writes

### Public form production-preview submissions

Phase: Verify lead intake

Owner: Registrar

Decision: blocked_until_submission_ids

Go-live allowed: false

Required proof:
- [ ] Production-preview submission id for each public lead form variant
- [ ] Successful validation and storage-error probes
- [ ] Admin routing confirmation for training, youth, tryout, senior, sponsor, and contact leads

Verification commands:
- `npm run verify:dynamo-intake-contract`
- `BASE_URL=<production-preview-url> npm run qa:dynamo-browser`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md

Blocked live actions:
- default live intake
- live lead routing
- owner launch approval

### Protected admin live operations

Phase: Verify role-scoped admin

Owner: Master Admin

Decision: blocked_until_admin_function_evidence

Go-live allowed: false

Required proof:
- [ ] Authenticated success and rejection fixture results for pipeline, module-read, role-grant, and module-write functions
- [ ] Audit event ids for permitted actions
- [ ] Rejected unauthorized requests without protected record mutation

Verification commands:
- `npm run verify:dynamo-pipeline-actions`
- `npm run verify:dynamo-admin-module-read`
- `npm run verify:dynamo-admin-role-grants`
- `npm run verify:dynamo-admin-module-writes`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md

Blocked live actions:
- protected admin live reads
- protected admin live writes
- trusted role grants

### Payments, packages, and provider tests

Phase: Approve commercial setup

Owner: Master Admin

Decision: blocked_until_payment_approval

Go-live allowed: false

Required proof:
- [ ] Owner-approved package matrix with exact prices, taxes, fees, session counts, and refund rules
- [ ] Provider product ids or invoice workflow ids
- [ ] Sandbox success, failure, cancel, refund, webhook, and audit evidence

Verification commands:
- `npm run verify:dynamo-gate-contracts`
- `Provider sandbox test plan`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- checkout activation
- payment collection
- published exact pricing

### Waivers, legal, and signature workflow

Phase: Approve participation controls

Owner: Registrar

Decision: blocked_until_legal_approval

Go-live allowed: false

Required proof:
- [ ] Approved waiver/legal version register for youth, adult, medical, media, camp, and travel consent
- [ ] Guardian and adult signature workflow tests
- [ ] Retention, expiration, revocation, and roster-eligibility rules

Verification commands:
- `npm run verify:dynamo-gate-contracts`
- `npm run verify:dynamo-safeguarding`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- signature capture
- medical intake
- roster eligibility clearance

### League, facility, and operations proof

Phase: Confirm real-world soccer operations

Owner: Club Director

Decision: blocked_until_fact_confirmation

Go-live allowed: false

Required proof:
- [ ] Official league or owner-approved future-pathway wording for every competition claim
- [ ] Facility permits, calendars, insurance notes, emergency procedures, and publish approval
- [ ] Fixture, opponent, venue, roster, staff, and competition proof before publication

Verification commands:
- `npm run verify:dynamo-claim-safety`
- `npm run verify:dynamo-safeguarding`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- league claim publication
- facility publication
- fixture/result publication

### Staff, rosters, and safeguarding proof

Phase: Protect youth and roster data

Owner: Club Director

Decision: blocked_until_safeguarding_review

Go-live allowed: false

Required proof:
- [ ] Approved staff names, roles, bios, photos, licenses, and public contact rules
- [ ] Background/safeguarding review for youth-facing staff
- [ ] Guardian/media-release controls before youth roster or player profile publication

Verification commands:
- `npm run verify:dynamo-safeguarding`
- `npm run verify:dynamo-admin-role-grants`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- staff proof publication
- youth roster publication
- team-manager sensitive access

### Sponsor, media, and content proof

Phase: Approve public proof

Owner: Media/Admin Staff

Decision: blocked_until_content_permissions

Go-live allowed: false

Required proof:
- [ ] Sponsor logo permissions, website links, package inventory, and display rules
- [ ] Testimonial, player story, photo, video, and media-release permissions
- [ ] Launch content calendar and proof source material

Verification commands:
- `npm run verify:dynamo-claim-safety`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- sponsor logo publication
- testimonial publication
- player outcome publication

### SEO, redirects, and root cutover

Phase: Promote public brand only after approval

Owner: Master Admin

Decision: blocked_until_cutover_approval

Go-live allowed: false

Required proof:
- [ ] Approved titles, descriptions, favicon, Open Graph asset, robots, sitemap, canonical URLs, and noindex removal
- [ ] Redirect/exclusion decisions for old LC routes, auth routes, admin routes, booking, and payment callbacks
- [ ] Post-cutover desktop/mobile route QA plan and rollback instructions

Verification commands:
- `BASE_URL=<production-preview-url> npm run verify:dynamo`
- `BASE_URL=<production-url> npm run qa:dynamo-browser`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml
- artifacts/detroit-dynamo/launch/detroit-dynamo-redirect-plan.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- root metadata replacement
- noindex removal
- permanent redirects

### Post-launch monitoring and rollback

Phase: Watch the launch window

Owner: Master Admin

Decision: blocked_until_monitoring_owner

Go-live allowed: false

Required proof:
- [ ] Named monitoring owner for first hour and first week
- [ ] Rollback trigger list for routes, forms, booking, auth, admin, payments, waivers, analytics, and support
- [ ] Support inbox, legal/support sender identity, analytics, and search-console watch plan

Verification commands:
- `BASE_URL=<production-url> npm run qa:dynamo-browser`
- `npm run audit:dynamo-goal`

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-launch-review.md

Blocked live actions:
- post-launch closeout
- permanent redirect finalization
- launch announcement closeout

## Blocked Live Actions

- Appwrite intake default
- checkout activation
- default live intake
- facility publication
- fixture/result publication
- launch announcement closeout
- league claim publication
- live lead routing
- medical intake
- noindex removal
- owner launch approval
- payment collection
- permanent redirect finalization
- permanent redirects
- player outcome publication
- post-launch closeout
- protected admin live reads
- protected admin live writes
- published exact pricing
- root metadata replacement
- root route promotion
- roster eligibility clearance
- signature capture
- sponsor logo publication
- staff proof publication
- team-manager sensitive access
- testimonial publication
- trusted role grants
- youth roster publication

This board is a live-readiness control surface only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish claims, remove noindex, apply redirects, or replace the current LC Training root site.
