# Detroit Dynamo Launch Evidence Checklist

Generated: 2026-05-29T14:14:30.562Z

This checklist turns the external promotion gates into concrete proof requirements. It does not approve launch, enable Appwrite as the default backend, collect payments, collect signatures, publish league/facility claims, remove noindex, or apply redirects.

## Summary

- Total evidence items: 13
- Preview-passed items: 1
- Evidence-required items: 4
- Pending-confirmation items: 5
- Future-pathway items: 1
- Preview-only items: 2
- Blocked live actions: 37

## Evidence Items

| Item | Gate | Status | Owner | Required Artifact | Verification |
| --- | --- | --- | --- | --- | --- |
| current-site-route-snapshot | Current LC site preservation | preview_passed | Master Admin | Current LC route smoke output, browser QA report, and rollback deployment id | `BASE_URL=<production-preview-url> npm run test -- --run` |
| backend-preflight-and-provisioning | Data backend live | evidence_required | Master Admin | Backend preflight report plus Appwrite provision/apply transcript for isolated dd_* collections | `npm run preflight:dynamo-backend && npm run provision:dynamo-appwrite -- --apply` |
| backend-function-production-preview | Data backend live | evidence_required | Registrar | Production-preview submission ids for every public form variant and authenticated admin action | `npm run verify:dynamo-intake-contract && npm run verify:dynamo-pipeline-actions` |
| payment-package-approval | Payments approved | pending_confirmation | Master Admin | Approved package matrix with prices, session counts, taxes/fees, refund rules, and provider product ids | `npm run verify:dynamo-gate-contracts` |
| payment-provider-sandbox | Payments approved | evidence_required | Master Admin | Successful sandbox payment, failure, refund/cancel, and webhook/audit test evidence | `Provider sandbox test plus npm run verify:dynamo-gate-contracts` |
| waiver-legal-version-approval | Waivers approved | pending_confirmation | Registrar | Approved waiver/legal version register for youth, adult, medical, media, camp, and travel consent | `npm run verify:dynamo-gate-contracts && npm run verify:dynamo-safeguarding` |
| waiver-signature-workflow-test | Waivers approved | evidence_required | Registrar | Guardian/adult signature workflow test with audit trail, export, expiration, and revocation handling | `npm run verify:dynamo-safeguarding` |
| league-competition-confirmation | League and facility facts confirmed | future_pathway | Club Director | Official league, competition, fixture, roster, and staff confirmation documents or owner-approved public wording | `npm run verify:dynamo-claim-safety` |
| facility-operations-confirmation | League and facility facts confirmed | pending_confirmation | Club Director | Facility permits/agreements, schedule windows, emergency procedures, insurance notes, and location publish approval | `npm run verify:dynamo-claim-safety && npm run verify:dynamo-safeguarding` |
| staff-roster-safeguarding-confirmation | League and facility facts confirmed | pending_confirmation | Club Director | Staff approval, background/safeguarding status, roster publication approvals, and media-release coverage | `npm run verify:dynamo-safeguarding && npm run verify:dynamo-admin-role-grants` |
| sponsor-media-proof-confirmation | League and facility facts confirmed | pending_confirmation | Media/Admin Staff | Sponsor logo permissions, testimonial approvals, media releases, news proof, and publishing calendar | `npm run verify:dynamo-claim-safety` |
| seo-metadata-noindex-approval | SEO and redirect launch approved | preview_only | Media/Admin Staff | Approved titles, descriptions, favicon, Open Graph asset, robots, sitemap, canonical URLs, and noindex removal approval | `BASE_URL=<production-preview-url> npm run verify:dynamo` |
| redirect-cutover-and-postlaunch-qa | SEO and redirect launch approved | preview_only | Master Admin | Approved redirect plan, auth/payment/admin exclusions, post-cutover route QA, and rollback instructions | `BASE_URL=<production-url> npm run qa:dynamo-browser` |

## Acceptance Criteria

### current-site-route-snapshot

Gate: Current LC site preservation

Confirmation area: Current LC Site

Blocked live action: Do not replace the root route until the current-site snapshot and rollback target are saved.

Criteria:
- [ ] Root, booking, auth, blog, team, LCFC, apply, terms, privacy, and admin routes still respond.
- [ ] LC Training header/footer/navigation remain intact outside Detroit Dynamo routes.
- [ ] A rollback deployment id or previous production build target is recorded before promotion.

### backend-preflight-and-provisioning

Gate: Data backend live

Confirmation area: Backend/Data

Blocked live action: Keep public forms in local preview/fallback mode until Appwrite schema provisioning is verified.

Criteria:
- [ ] Preflight passes without printing secrets.
- [ ] All Detroit Dynamo dd_* collections, attributes, indexes, and permissions exist in the target Appwrite project.
- [ ] Legacy LC Training collections are not mutated by the Dynamo provisioner.

### backend-function-production-preview

Gate: Data backend live

Confirmation area: Backend/Data

Blocked live action: Do not make Appwrite the default intake mode until production-preview submissions and admin actions pass.

Criteria:
- [ ] Lead intake, pipeline action, module read, role grant, and module write functions are deployed with expected scopes.
- [ ] Training, tryout, youth, senior men, senior women, sponsor, and contact forms create expected records.
- [ ] Authenticated admin actions write audit events and reject unauthorized users.

### payment-package-approval

Gate: Payments approved

Confirmation area: Payments & Packages

Blocked live action: Do not publish checkout links or exact package commitments before owner approval.

Criteria:
- [ ] Private, small-group, team-training, camp, tryout, youth dues, and sponsor packages are approved.
- [ ] Provider product ids or invoice workflow ids are mapped to TrainingPackage, Payment, Booking, CampClinic, and Sponsor records.
- [ ] Refund, cancellation, failed-payment, and settlement handling are documented.

### payment-provider-sandbox

Gate: Payments approved

Confirmation area: Payments & Packages

Blocked live action: Keep payment CTAs as inquiry-only until provider sandbox evidence is signed off.

Criteria:
- [ ] Checkout succeeds for approved training, camp, dues, and sponsor payment paths.
- [ ] Failed, canceled, and refunded payments map cleanly to Payment records.
- [ ] No public Dynamo payment surface is enabled without the approved package matrix.

### waiver-legal-version-approval

Gate: Waivers approved

Confirmation area: Waivers & Legal

Blocked live action: Do not collect signatures, medical consent, or final legal acknowledgements until waiver versions are approved.

Criteria:
- [ ] Each waiver has approved language, version id, effective date, expiration rule, and owner/legal signoff.
- [ ] Minor participation requires guardian signature coverage and data-retention rules.
- [ ] Waiver requirements are mapped to tryouts, camps, training bookings, teams, and roster eligibility.

### waiver-signature-workflow-test

Gate: Waivers approved

Confirmation area: Waivers & Legal

Blocked live action: Do not open youth registration, camp registration, or senior evaluations until signature workflow evidence exists.

Criteria:
- [ ] Guardian and adult signature paths are tested on mobile and desktop.
- [ ] Signed waiver records retain version, signer, timestamp, related player/program, and audit evidence.
- [ ] Expired, revoked, or missing waivers block the correct admin workflows.

### league-competition-confirmation

Gate: League and facility facts confirmed

Confirmation area: League & Competition Facts

Blocked live action: Do not publish current league membership, fixtures, results, rosters, or staff claims without proof.

Criteria:
- [ ] No current UPSL, UPSL Women, youth league, roster, fixture, or result claim is published without confirmation.
- [ ] Future-pathway language remains in place for unconfirmed leagues and teams.
- [ ] Fixture, opponent, venue, competition, roster, and staff claims are individually approved before publication.

### facility-operations-confirmation

Gate: League and facility facts confirmed

Confirmation area: Facilities & Operations

Blocked live action: Do not publish facility commitments, addresses, or schedules until operating access is confirmed.

Criteria:
- [ ] Training, tryout, camp, indoor, match, and youth-team locations are confirmed before publication.
- [ ] Facility partner permissions, check-in instructions, weather/cancel rules, and emergency procedures are documented.
- [ ] Address, parking, access, and schedule copy is approved before going public.

### staff-roster-safeguarding-confirmation

Gate: League and facility facts confirmed

Confirmation area: Staff, Rosters & Safeguarding

Blocked live action: Do not publish youth roster/staff proof or enable sensitive roster workflows before safeguarding evidence exists.

Criteria:
- [ ] Staff and coach profiles are approved before publication.
- [ ] Youth player roster visibility follows guardian consent, media release, and safeguarding policy.
- [ ] Team manager and coach access is scoped to assigned teams and verified through role grants.

### sponsor-media-proof-confirmation

Gate: League and facility facts confirmed

Confirmation area: Sponsors, Media & Content Proof

Blocked live action: Do not publish sponsor, testimonial, media, or player-outcome proof without permission.

Criteria:
- [ ] Sponsor logos, testimonials, photos, video, and outcome claims have permission before publication.
- [ ] News/media proof is tied to approved source material.
- [ ] Sponsor package activation promises match approved sponsorship inventory.

### seo-metadata-noindex-approval

Gate: SEO and redirect launch approved

Confirmation area: Sponsors, Media & Content Proof

Blocked live action: Do not remove preview-only noindex or replace root metadata until SEO launch approval is recorded.

Criteria:
- [ ] Detroit Dynamo metadata and social assets are approved for the public root brand.
- [ ] Noindex removal is owner-approved and tied to the approved launch window.
- [ ] Current LC Training root SEO is not overwritten before promotion approval.

### redirect-cutover-and-postlaunch-qa

Gate: SEO and redirect launch approved

Confirmation area: Sponsors, Media & Content Proof

Blocked live action: Do not apply permanent redirects until redirect QA and rollback evidence are approved.

Criteria:
- [ ] Old LC routes, auth routes, admin routes, and payment callbacks have explicit redirect/exclusion decisions.
- [ ] Post-cutover browser QA passes on desktop and mobile.
- [ ] Rollback instructions are documented before permanent redirects are applied.

## Blocked Actions

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
