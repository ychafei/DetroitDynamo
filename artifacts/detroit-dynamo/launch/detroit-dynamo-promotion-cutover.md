# Detroit Dynamo Promotion Cutover Contract

Generated: 2026-05-29T14:14:30.559Z

This contract defines how the isolated Detroit Dynamo preview can become the public brand without breaking the current LC Training site, booking flow, auth, admin, legal/support copy, SEO, redirects, or rollback path.

| Track | Phase | Status | Owner | Affected Routes | Blocked Until |
| --- | --- | --- | --- | --- | --- |
| Current LC site snapshot and rollback | Pre-promotion | preview_ready | Master Admin | /, /about, /book, /lcfc, /team, /blog, /apply, /admin | Do not switch the root experience until current-site preservation evidence and rollback instructions are saved. |
| Root route and public shell promotion | Promotion window | blocked_until_approval | Master Admin | /, /detroit-dynamo, /detroit-dynamo/* | Owner signs off on the full brand switch and all external promotion gates are cleared. |
| SEO, metadata, robots, and indexing | Promotion window | blocked_until_approval | Media/Admin Staff | /detroit-dynamo, /detroit-dynamo/*, /detroit-dynamo-sitemap.xml | Do not remove preview noindex or publish Dynamo root SEO until the owner approves launch metadata. |
| Redirect and alias migration | Promotion window | blocked_until_approval | Master Admin | /book, /lcfc, /team, /apply, /detroit-dynamo/book, /detroit-dynamo/fc | Do not apply permanent redirects while the preview is still used for comparison. |
| Backend intake and admin data cutover | Backend activation | blocked_until_backend | Master Admin | /detroit-dynamo/contact, /detroit-dynamo/tryouts, /detroit-dynamo/book, /admin/detroit-dynamo | Appwrite credentials, collections, functions, permissions, and production-preview submissions are verified. |
| Booking, payment, package, and waiver cutover | External approvals | blocked_until_external_approval | Master Admin | /book, /detroit-dynamo/book, /detroit-dynamo/training, /detroit-dynamo/camps-clinics, /detroit-dynamo/tryouts | Payments/packages and waivers/legal external gates are approved. |
| Legal, support, and communications cutover | External approvals | blocked_until_external_approval | Media/Admin Staff | /terms, /privacy, /contact, /detroit-dynamo/contact | Legal/support ownership and sender-domain readiness are approved. |
| Content proof publication | External approvals | blocked_until_external_approval | Club Director | /detroit-dynamo/about, /detroit-dynamo/teams, /detroit-dynamo/schedule-results, /detroit-dynamo/sponsors | Claim-safety and external confirmation gates clear for each public proof item. |
| Monitoring, QA, and post-launch watch | Post-promotion | blocked_until_promotion | Master Admin | /, /book, /admin, /detroit-dynamo/* | Do not close the promotion window until post-launch QA and rollback readiness are documented. |

## Track Details

### Current LC site snapshot and rollback

Current state: Current LC Training routes, booking, auth, blog, team, LCFC, and admin flows remain live.

Cutover action: Capture route screenshots, smoke-test outputs, current metadata, env values, and deployment id before any promotion change.

Rollback action: Revert the routing change to the last known LC Training deployment and keep `/detroit-dynamo` as the preview shell.

Required evidence:
- [ ] Passing current-site route smoke test
- [ ] Passing current LC booking/auth/admin checks
- [ ] Production deployment id or rollback target
- [ ] Owner approval that a promotion window is open

### Root route and public shell promotion

Current state: Detroit Dynamo remains isolated under `/detroit-dynamo` and root still renders the current LC Training shell.

Cutover action: Promote the Detroit Dynamo layout to the approved public entry point only after all promotion gates pass.

Rollback action: Restore the current LC Training root route and keep Dynamo available only under the preview route.

Required evidence:
- [ ] Owner-approved launch timing
- [ ] Verified Detroit Dynamo root shell on desktop and mobile
- [ ] No old LC header/footer inside Dynamo routes
- [ ] No broken current LC route after rollback rehearsal

### SEO, metadata, robots, and indexing

Current state: Dynamo preview pages intentionally use preview metadata and noindex/noindex-style launch controls.

Cutover action: Apply approved Detroit Dynamo titles, descriptions, favicon, social image, canonical URLs, robots, and sitemap publication.

Rollback action: Reapply preview noindex and restore current LC Training metadata at root if the launch is reversed.

Required evidence:
- [ ] Approved metadata and Open Graph assets
- [ ] Approved sitemap and robots draft
- [ ] Noindex removal approval
- [ ] Search-console or SEO-owner launch acknowledgement

### Redirect and alias migration

Current state: Old LC routes remain real routes, and Detroit Dynamo redirect plans are draft-only launch artifacts.

Cutover action: Apply approved redirects from old LC public paths to Dynamo equivalents without breaking auth, admin, or payment callbacks.

Rollback action: Disable the redirect rules and restore old LC public paths as canonical routes.

Required evidence:
- [ ] Approved redirect plan
- [ ] Booking/payment callback exclusions reviewed
- [ ] Admin/auth route exclusions reviewed
- [ ] Post-cutover 200/301 route verification

### Backend intake and admin data cutover

Current state: Dynamo public forms use local preview storage with optional Appwrite intake mode and fallback.

Cutover action: Use live Appwrite intake after `dd_*` collections, functions, permissions, and status-action workflows are deployed and tested.

Rollback action: Switch the admin intake mode back to local preview/fallback and stop writing Dynamo records until the backend is repaired.

Required evidence:
- [ ] Provisioned isolated `dd_*` collections
- [ ] Deployed lead intake and pipeline action functions
- [ ] Production-preview submissions for every lead type
- [ ] Admin pipeline status updates verified with authenticated users

### Booking, payment, package, and waiver cutover

Current state: Current LC booking/payment flows remain live, and Dynamo packages/waivers remain inquiry-only or approval-gated.

Cutover action: Connect approved Dynamo packages, payment provider products, refund rules, waivers, and signature workflows.

Rollback action: Disable Dynamo checkout/signature entry points and route visitors back to inquiry forms or the current LC booking fallback.

Required evidence:
- [ ] Approved package matrix and provider product ids
- [ ] Approved refund/cancellation rules
- [ ] Approved waiver versions and signature workflow
- [ ] Successful payment and waiver sandbox tests

### Legal, support, and communications cutover

Current state: Legacy LC Training legal/support references remain in place until support, legal, payment, and email sender changes are approved.

Cutover action: Update support inboxes, sender names, legal pages, transactional emails, receipts, unsubscribe wording, and public contact copy.

Rollback action: Restore LC Training legal/support copy and transactional sender settings if the brand switch is paused.

Required evidence:
- [ ] Approved Detroit Dynamo support inbox and sender identity
- [ ] Approved legal entity, terms, privacy, and refund/support language
- [ ] Transactional email and receipt templates reviewed
- [ ] Unsubscribe and contact routing tested

### Content proof publication

Current state: Dynamo pages use honest future-pathway language, roster-ready layouts, proof slots, and placeholder states.

Cutover action: Publish confirmed staff, rosters, sponsors, facilities, fixtures, news, testimonials, and proof assets.

Rollback action: Remove unapproved proof content and return the affected sections to placeholder or interest-only states.

Required evidence:
- [ ] Approved staff, roster, and sponsor assets
- [ ] Media releases and proof permissions
- [ ] Confirmed fixtures/results/facilities before publication
- [ ] Club director approval for public claims

### Monitoring, QA, and post-launch watch

Current state: Preview QA runs against the isolated Dynamo shell while the current LC site remains public.

Cutover action: Run post-launch route, mobile, console, link, form, booking, admin, payment, waiver, and analytics checks.

Rollback action: Trigger rollback if core routes, forms, payments, auth, admin, or legal/support workflows fail after launch.

Required evidence:
- [ ] Passing browser QA after promotion
- [ ] Passing lint/build/typecheck/smoke tests
- [ ] No critical console errors or dead public CTAs
- [ ] Owner sign-off after the first launch verification pass

## Promotion Rule

Detroit Dynamo should remain preview-only until every cutover track has owner-approved evidence and a rollback path. Permanent redirects, root-route promotion, payment/waiver activation, support sender changes, and noindex removal are not preview tasks.
