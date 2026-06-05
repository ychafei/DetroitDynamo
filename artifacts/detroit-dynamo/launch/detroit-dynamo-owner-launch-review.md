# Detroit Dynamo Owner Launch Review Packet

Generated: 2026-05-29T14:14:30.582Z

Decision: No-Go: Preview Only

Detroit Dynamo is ready for stakeholder review, but live backend, payment, waiver, league/facility, proof, SEO, redirect, and owner approval gates are still open.

## Summary

- Review sections: 9
- Review-ready sections: 1
- Blocked sections: 8
- External approvals required: 6
- Unresolved evidence items: 12
- Live gates cleared: 0
- Publications unlocked: 0

## Required Owner Actions

- [ ] Review this packet with the owner before any root-route, SEO, redirect, payment, waiver, or claim publication change.
- [ ] Attach real evidence for every unresolved launch evidence item.
- [ ] Fill the owner evidence intake worksheet so each proof item has a location, approver, decision, date, and notes.
- [ ] Record external confirmation actions for payments, waivers, league/facility facts, staff/rosters, sponsors/media, and SEO/redirects.
- [ ] Keep Detroit Dynamo under /detroit-dynamo until every external gate has real evidence and owner approval.

## Review Sections

| Section | Status | Owner | Decision Question |
| --- | --- | --- | --- |
| Current LC site preservation | review_ready | Master Admin | Can the team prove the existing LC Training site, booking, auth, blog, forms, navigation, and rollback target are preserved before any brand promotion? |
| Backend data activation | blocked_until_backend | Master Admin | Are isolated Appwrite dd_* collections, deployed functions, permissions, production-preview submissions, and authenticated admin actions verified? |
| Payments and packages | blocked_until_external_approval | Master Admin | Has the owner approved package prices, provider product ids, taxes/fees, refund rules, and sandbox payment behavior? |
| Waivers and legal | blocked_until_external_approval | Registrar | Are waiver versions, guardian/adult signatures, medical consent, media release, retention, expiration, and revocation rules legally approved and tested? |
| League, competition, and facility facts | future_pathway | Club Director | Can every league, fixture, result, facility, schedule, venue, staff, and roster claim be backed by official confirmation or owner-approved wording? |
| Staff, rosters, and safeguarding | blocked_until_external_approval | Club Director | Are staff profiles, coach credentials, youth roster visibility, media releases, background/safeguarding status, and role grants approved? |
| Sponsor, media, and proof content | blocked_until_external_approval | Media/Admin Staff | Are sponsor logos, testimonials, player stories, media clips, launch posts, proof assets, and sponsor inventory approved for public use? |
| SEO, redirects, and promotion cutover | preview_only | Master Admin | Are metadata, Open Graph assets, robots, sitemap, canonical URLs, noindex removal, redirect exclusions, QA, and rollback instructions approved? |
| Post-launch monitoring and rollback watch | blocked_until_promotion | Master Admin | Is there a first-hour and first-week monitoring plan for route health, forms, booking, admin, payments, waivers, analytics, support, and rollback? |

## Section Details

### Current LC site preservation

Status: review_ready

Promotion gate status: passing_in_preview

Evidence required:
- [ ] Passing current-site route smoke output
- [ ] Passing browser QA with LC root and booking screenshots
- [ ] Rollback deployment id or previous production build target
- [ ] Owner-approved launch window before root-route promotion

Artifacts:
- artifacts/detroit-dynamo/goal-audit.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json
- artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- root route promotion
- permanent redirects
- noindex removal

Required before go-live:
- [ ] Record rollback target
- [ ] Confirm owner launch window

### Backend data activation

Status: blocked_until_backend

Promotion gate status: planned

Evidence required:
- [ ] Backend preflight passes without exposing secrets
- [ ] Provision/apply transcript proves isolated dd_* collections exist
- [ ] Functions are deployed with expected scopes and variables
- [ ] Production-preview lead and admin action submissions pass

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-handoff.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- Appwrite intake default
- live lead routing
- protected admin live writes

Required before go-live:
- [ ] Valid Appwrite credentials
- [ ] Provisioned target project
- [ ] Production-preview function smoke ids

### Payments and packages

Status: blocked_until_external_approval

Promotion gate status: pending_confirmation

Evidence required:
- [ ] Approved package matrix for training, camps, dues, tryouts, and sponsors
- [ ] Provider product ids or invoice workflow ids mapped to records
- [ ] Successful sandbox success, failure, cancel, refund, and webhook tests
- [ ] Refund, cancellation, and settlement handling documented

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- checkout activation
- payment collection
- published exact pricing

Required before go-live:
- [ ] Owner package signoff
- [ ] Provider sandbox evidence
- [ ] Payment audit mapping

### Waivers and legal

Status: blocked_until_external_approval

Promotion gate status: pending_confirmation

Evidence required:
- [ ] Approved waiver/legal version register
- [ ] Guardian and adult signature workflow test evidence
- [ ] Medical, emergency, media, and travel consent rules approved
- [ ] Waiver status mapped to registration, roster, camp, and tryout workflows

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- signature capture
- medical intake
- roster eligibility clearance

Required before go-live:
- [ ] Legal signoff
- [ ] Signature workflow smoke test
- [ ] Retention and revocation policy

### League, competition, and facility facts

Status: future_pathway

Promotion gate status: future_pathway

Evidence required:
- [ ] Official league and competition documents before current-membership claims
- [ ] Confirmed facility access, permits, schedules, insurance, and emergency procedures
- [ ] Fixture, opponent, venue, roster, staff, and competition proof before publication
- [ ] Owner-approved public wording for every unconfirmed pathway reference

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- league claim publication
- fixture/result publication
- facility publication

Required before go-live:
- [ ] League/facility confirmation
- [ ] Approved public wording
- [ ] Claim-by-claim proof register

### Staff, rosters, and safeguarding

Status: blocked_until_external_approval

Promotion gate status: future_pathway

Evidence required:
- [ ] Approved staff names, roles, bios, licenses, and public contact rules
- [ ] Background/safeguarding status for youth-facing staff
- [ ] Roster visibility follows guardian consent and media-release controls
- [ ] Team manager and coach access scoped by trusted role grants

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- staff proof publication
- youth roster publication
- team-manager sensitive access

Required before go-live:
- [ ] Staff approval packet
- [ ] Safeguarding review
- [ ] Role grant verification

### Sponsor, media, and proof content

Status: blocked_until_external_approval

Promotion gate status: future_pathway

Evidence required:
- [ ] Sponsor logo, website link, activation inventory, and display permissions
- [ ] Media releases and testimonial permissions
- [ ] News proof tied to approved source material
- [ ] Sponsor package promises match approved inventory

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- sponsor logo publication
- testimonial publication
- player outcome publication

Required before go-live:
- [ ] Sponsor proof approval
- [ ] Media release review
- [ ] Content calendar signoff

### SEO, redirects, and promotion cutover

Status: preview_only

Promotion gate status: preview_only

Evidence required:
- [ ] Approved metadata, social image, favicon, sitemap, robots, and canonical URLs
- [ ] Owner-approved noindex removal tied to launch window
- [ ] Redirect plan includes auth, admin, booking, and payment callback exclusions
- [ ] Post-cutover desktop/mobile route QA and rollback instructions are documented

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml
- artifacts/detroit-dynamo/launch/detroit-dynamo-redirect-plan.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- noindex removal
- root metadata replacement
- permanent redirects

Required before go-live:
- [ ] SEO owner signoff
- [ ] Redirect QA plan
- [ ] Rollback instructions

### Post-launch monitoring and rollback watch

Status: blocked_until_promotion

Promotion gate status: preview_only

Evidence required:
- [ ] Post-launch browser QA command and owner signoff path
- [ ] Rollback trigger list for core routes, forms, payments, auth, admin, and support failures
- [ ] Support inbox and legal/support communications monitoring plan
- [ ] Analytics/search-console observation window and closeout note

Artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json
- artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv

Blocked live actions:
- post-launch closeout
- permanent redirect finalization
- launch announcement closeout

Required before go-live:
- [ ] Monitoring owner assigned
- [ ] Rollback trigger list
- [ ] Support/analytics watch plan

## Blocked Live Actions

- Appwrite intake default
- checkout activation
- facility publication
- fixture/result publication
- launch announcement closeout
- league claim publication
- live lead routing
- medical intake
- noindex removal
- payment collection
- permanent redirect finalization
- permanent redirects
- player outcome publication
- post-launch closeout
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
- youth roster publication

This packet is a review aid only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish league/facility/staff/sponsor claims, remove noindex, or apply redirects.
