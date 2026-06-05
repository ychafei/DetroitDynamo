# Detroit Dynamo Promotion Checklist

Generated: 2026-05-29T14:14:32.047Z

This checklist is intentionally conservative. Detroit Dynamo should stay isolated under `/detroit-dynamo` until these gates are approved with real evidence.

## Promotion Gates

- [ ] Current LC site preservation
  - Status now: passing_in_preview
  - Evidence required: Root LC routes, booking, auth, forms, navigation, manifest, and footer continue to work before launch.
  - Next action: Keep running current-site isolation checks before every promotion decision.
- [ ] Data backend live
  - Status now: planned
  - Evidence required: All required dd_* collections exist, permissions are reviewed, and public forms persist to Appwrite.
  - Next action: Provision after final field review and valid credentials are available.
- [ ] Payments approved
  - Status now: pending_confirmation
  - Evidence required: Products, packages, taxes/fees, refunds, and settlement handling are approved by the business owner.
  - Next action: Map approved packages to checkout flows and payment records.
- [ ] Waivers approved
  - Status now: pending_confirmation
  - Evidence required: Participation, medical, media, privacy, and travel consent language is approved before signature capture.
  - Next action: Connect waiver versions to registrations, bookings, camps, and teams.
- [ ] League and facility facts confirmed
  - Status now: future_pathway
  - Evidence required: No current league, fixture, roster, facility, or staff claim is published without confirmation.
  - Next action: Maintain future-pathway language until official documents or owner-approved facts are available.
- [ ] SEO and redirect launch approved
  - Status now: preview_only
  - Evidence required: Canonical routes, sitemap, metadata, Open Graph assets, and old-route redirect timing are approved.
  - Next action: Remove noindex only when Detroit Dynamo is the approved public brand.

## Launch Readiness Workstreams

### Backend/Data

Owner: Master Admin

Status now: planned

Next action: Review the scaffold, replace expired credentials, run the dry run, then apply the Appwrite provisioner.

Evidence needed:
- [ ] Approved isolated dd_* collection plan
- [ ] Valid Appwrite project credentials
- [ ] Verified detroitDynamoLeadIntake fixtures for all public form variants
- [ ] Deployed detroitDynamoLeadIntake function
- [ ] Verified detroitDynamoLeadPipelineAction fixtures for authenticated status changes
- [ ] Verified detroitDynamoAdminModuleRead fixtures for protected module reads
- [ ] Verified detroitDynamoAdminRoleGrantAction fixtures for Master Admin role grant management
- [ ] Verified detroitDynamoAdminModuleWriteAction fixtures for protected module writes
- [ ] Active dd_admin_role_assignments grants for every live admin role
- [ ] Public form writes tested from production preview

### Payments/Packages

Owner: Master Admin

Status now: pending_confirmation

Next action: Confirm business pricing and provider choice before connecting checkout or package purchase flows.

Evidence needed:
- [ ] Approved training package pricing
- [ ] Camp, tryout, club dues, and sponsor package rules
- [ ] Stripe or PayPal product mapping
- [ ] Refund, cancellation, and failed-payment handling

### Waivers/Legal

Owner: Registrar

Status now: pending_confirmation

Next action: Have the owner and appropriate legal reviewer approve waiver text before collecting signatures.

Evidence needed:
- [ ] Youth participation waiver
- [ ] Medical consent and emergency contact language
- [ ] Media release and privacy language
- [ ] Adult participation and team-travel consent where needed

### League/Competition

Owner: Club Director

Status now: future_pathway

Next action: Keep all UPSL, UPSL Women, and youth-league language framed as a goal until written confirmation exists.

Evidence needed:
- [ ] Confirmed senior league acceptance before naming membership
- [ ] Confirmed youth league placement before naming competition
- [ ] Roster, staff, insurance, and rules compliance
- [ ] Published schedule only after opponents, dates, and venues are confirmed

### Facilities/Operations

Owner: Club Director

Status now: pending_confirmation

Next action: Confirm facility partners and operating rules before publishing location-specific commitments.

Evidence needed:
- [ ] Confirmed training locations and permitted field access
- [ ] Facility calendars for training, tryouts, camps, and matches
- [ ] Insurance and safety requirements
- [ ] Weather, cancellation, and communication procedures

### Content/Brand Promotion

Owner: Media/Admin Staff

Status now: preview_only

Next action: Keep the Dynamo site noindex and isolated until promotion timing, redirects, and real content are approved.

Evidence needed:
- [ ] Approved Detroit Dynamo launch copy
- [ ] Confirmed staff, testimonials, sponsor logos, news, and media
- [ ] SEO metadata, sitemap, redirects, and social images approved
- [ ] LC Training migration or preservation plan signed off
