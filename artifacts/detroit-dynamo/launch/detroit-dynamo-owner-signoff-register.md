# Detroit Dynamo Owner Signoff Register

Generated: 2026-05-29T14:14:31.955Z

Decision: Owner Signoff Required

Every final launch approval remains unsigned until real evidence, owner approval, and external confirmations are recorded.

## Summary

- Signoff rows: 11
- Signoff areas: 11
- Signer roles: 4
- Signed rows: 0
- Unsigned rows: 11
- Live gates cleared: 0
- Publications unlocked: 0
- Root promotion allowed: false
- Checkout allowed: false
- Permanent redirects allowed: false
- Production deployments recorded: 0
- Production submissions recorded: 0
- Owner launch review sections: 9
- Owner evidence intake rows: 13
- Deployment readiness tracks: 10
- Payment/package tracks: 6
- Waiver tracks: 6
- Claim-safety tracks: 7
- Safeguarding tracks: 8
- Blocked live actions: 26

## Usage Rules

- Use this register as the final owner and external approval worksheet after evidence artifacts are complete.
- Do not convert not_signed rows to signed until the required evidence is attached and the approver is identified.
- Every signed row must keep the matching source artifact and verification command attached to the owner review packet.
- No live gate, publication, checkout, noindex, redirect, or root promotion action is allowed while any row remains unsigned.

## Signoff Rows

| Signoff | Area | Role | Status | Source Artifact | Verification |
| --- | --- | --- | --- | --- | --- |
| Current-site snapshot and rollback approval | Current Site Preservation | Master Admin | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md` | `BASE_URL=<current-production-url> npm run test -- --run` |
| Deployment and environment readiness approval | Deployment Readiness | Master Admin | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md` | `npm run verify:dynamo-deployment-readiness` |
| Appwrite backend activation approval | Backend/Data | Master Admin | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md` | `npm run preflight:dynamo-backend` |
| Production-preview public form and admin action approval | Production Preview Proof | Registrar | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md` | `BASE_URL=<production-preview-url> npm run qa:dynamo-browser` |
| Payment packages and provider product approval | Payments & Packages | Master Admin | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md` | `npm run verify:dynamo-gate-contracts` |
| Waiver, legal, medical, and media release approval | Waivers & Legal | Registrar | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md` | `npm run verify:dynamo-safeguarding` |
| League, competition, facility, and operations fact approval | Facilities & Competition | Club Director | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md` | `npm run verify:dynamo-claim-safety` |
| Staff, roster, and safeguarding publication approval | Staff, Rosters & Safeguarding | Club Director | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md` | `npm run verify:dynamo-safeguarding` |
| Sponsor, media, testimonials, and news proof approval | Sponsors, Media & Content Proof | Media/Admin Staff | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md` | `npm run verify:dynamo-external-confirmation-actions` |
| SEO, noindex, root promotion, and redirect approval | SEO & Cutover | Master Admin | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md` | `BASE_URL=<production-preview-url> npm run verify:dynamo` |
| Post-launch monitoring and rollback owner approval | Post-launch Monitoring | Master Admin | not_signed | `artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md` | `BASE_URL=<production-url> npm run qa:dynamo-browser` |

## Required Evidence

### Current-site snapshot and rollback approval

Blocked live actions: root route promotion, permanent redirects, noindex removal

- [ ] Current LC production route smoke report
- [ ] Browser QA report for current LC routes and protected admin routes
- [ ] Rollback deployment id or previous production target

### Deployment and environment readiness approval

Blocked live actions: root route promotion, Appwrite intake default, permanent redirects

- [ ] Production-preview deployment URL and deployment id
- [ ] Hosting project link, environment, and rollback target confirmation
- [ ] Production-preview build, route, and browser QA proof

### Appwrite backend activation approval

Blocked live actions: Appwrite intake default, protected admin live reads, protected admin live writes

- [ ] Isolated dd_* collections provisioned in the target Appwrite project
- [ ] Detroit Dynamo functions deployed with expected scopes and variables
- [ ] Bootstrap Master Admin or trusted role grant evidence recorded

### Production-preview public form and admin action approval

Blocked live actions: default live intake, status mutation workflow, protected admin live writes

- [ ] Training, youth, tryout, men, women, sponsor, and contact form submission ids
- [ ] Authenticated pipeline, module read, role grant, and module write action ids
- [ ] Unauthorized admin action rejection proof and audit event ids

### Payment packages and provider product approval

Blocked live actions: checkout activation, payment collection, package publication

- [ ] Approved package matrix with prices, session counts, taxes, fees, and refund rules
- [ ] Payment provider product ids and sandbox test proof
- [ ] Payment failure, refund, cancellation, and webhook/audit handling proof

### Waiver, legal, medical, and media release approval

Blocked live actions: signature capture, medical intake, youth registration launch

- [ ] Approved waiver/legal version register for youth, adult, medical, media, camp, and travel consent
- [ ] Guardian/adult signature workflow test with audit, export, expiration, and revocation handling
- [ ] Terms, privacy, refund, support, and communication ownership approval

### League, competition, facility, and operations fact approval

Blocked live actions: league claim publication, facility publication, fixture publication

- [ ] League/competition status or future-pathway wording approval
- [ ] Facility permits, schedule windows, emergency procedures, and insurance notes
- [ ] Approved public location/facility copy

### Staff, roster, and safeguarding publication approval

Blocked live actions: staff proof publication, roster publication, sensitive admin mutations

- [ ] Staff approval and background/safeguarding status
- [ ] Roster publication approvals and media-release coverage
- [ ] Youth communication, travel, medical, retention, and audit controls approved

### Sponsor, media, testimonials, and news proof approval

Blocked live actions: sponsor logo publication, testimonial publication, news proof publication

- [ ] Sponsor logo permissions and approved sponsor package copy
- [ ] Testimonial, media-release, news, and proof asset approvals
- [ ] Publishing calendar and source-of-truth links

### SEO, noindex, root promotion, and redirect approval

Blocked live actions: root route promotion, noindex removal, permanent redirects

- [ ] Approved metadata, favicon, Open Graph image, robots draft, sitemap, and canonical URLs
- [ ] Noindex removal approval tied to an approved launch window
- [ ] Redirect plan approved with auth, admin, booking, payment callback, unsubscribe, and legal exclusions

### Post-launch monitoring and rollback owner approval

Blocked live actions: post-launch closeout, launch announcement, rollback window closure

- [ ] Post-launch browser QA and smoke commands prepared for the production URL
- [ ] Rollback trigger conditions and rollback owner approved
- [ ] Payment, waiver, admin, support, and legal escalation plan documented

This signoff register is a preview handoff only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish public claims, remove noindex, apply permanent redirects, or replace the current LC Training root site.
