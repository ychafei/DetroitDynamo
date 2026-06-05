# Detroit Dynamo Final Acceptance Matrix

Generated: 2026-05-29T14:14:32.024Z

Decision: Final Acceptance Preview Audit

The Detroit Dynamo preview implementation can be audited against the original objective, but full goal completion still requires external backend, payment, waiver, league/facility, production deployment, and owner signoff evidence.

## Summary

- Acceptance rows: 15
- Preview-complete rows: 10
- External evidence required rows: 5
- Public routes: 18
- Data models: 20
- Admin modules: 16
- Production-preview tracks: 30
- Deployment readiness tracks: 10
- Owner signoff rows: 11
- Owner signed rows: 0
- Owner unsigned rows: 11
- Go-live allowed rows: 0
- Live gates cleared: 0
- Publications unlocked: 0
- Production deployments recorded: 0
- Production submissions recorded: 0
- Root promotion allowed: false
- Checkout allowed: false
- Permanent redirects allowed: false

## Usage Rules

- Use this matrix as the requirement-by-requirement completion audit for the original Detroit Dynamo objective.
- Rows marked preview_complete are complete for the isolated preview only; production-preview evidence may still be required before promotion.
- Rows marked external_evidence_required cannot be closed by code changes alone; they need real owner, legal, payment, backend, league, facility, deployment, or production evidence.
- Do not mark the full goal complete while ownerSignedRows, goLiveAllowedRows, liveGatesCleared, publicationsUnlocked, production deployments, and production submissions remain at zero.

## Acceptance Matrix

| Requirement | Area | Owner | Status | Verify | Remaining Evidence |
| --- | --- | --- | --- | --- | --- |
| Repo audit and current-state inventory | Repo Audit | Master Admin | preview_complete | `npm run audit:dynamo-goal && npm run verify:dynamo` | None for preview |
| Existing LC Training site preservation | Current Site Preservation | Master Admin | preview_complete | `BASE_URL=<current-production-url> npm run test -- --run && BASE_URL=<current-production-url> npm run qa:dynamo-browser` | 2 |
| Isolated Detroit Dynamo parallel shell | Preview Architecture | Master Admin | preview_complete | `BASE_URL=<preview-url> npm run verify:dynamo && BASE_URL=<preview-url> npm run qa:dynamo-browser` | None for preview |
| Detroit Dynamo brand system, logo assets, and metadata | Brand/SEO Preview | Media/Admin Staff | preview_complete | `BASE_URL=<preview-url> npm run verify:dynamo && BASE_URL=<preview-url> npm run qa:dynamo-browser` | 1 |
| Full public Detroit Dynamo site structure and player pathway | Public Website | Club Director | preview_complete | `BASE_URL=<preview-url> npm run test -- --run && BASE_URL=<preview-url> npm run verify:dynamo` | 1 |
| Validated public lead forms and routing | Forms/Lead System | Registrar | preview_complete | `BASE_URL=<preview-url> npm run qa:dynamo-browser && npm run verify:dynamo-intake-contract` | 1 |
| Admin roles, modules, data models, and records foundation | Admin/Data Foundation | Master Admin | preview_complete | `npm run plan:dynamo-appwrite && npm run verify:dynamo-admin-record-workspace && BASE_URL=<preview-url> npm run verify:dynamo` | 1 |
| Appwrite schema and function scaffold | Backend/Data | Master Admin | preview_complete | `npm run preflight:dynamo-backend && npm run provision:dynamo-appwrite && node scripts/configure-functions.mjs` | 3 |
| Payments, packages, and checkout readiness | Payments & Packages | Master Admin | external_evidence_required | `npm run verify:dynamo-gate-contracts && npm run verify:dynamo-owner-signoff-register` | 2 |
| Waivers, legal, youth safeguarding, and privacy readiness | Waivers/Legal/Safeguarding | Registrar | external_evidence_required | `npm run verify:dynamo-safeguarding && npm run verify:dynamo-gate-contracts` | 3 |
| League, facility, staff, roster, sponsor, and media proof | External Confirmation | Club Director | external_evidence_required | `npm run verify:dynamo-claim-safety && npm run verify:dynamo-external-confirmation-actions` | 2 |
| SEO, noindex, root promotion, redirects, and rollback | SEO/Cutover | Master Admin | external_evidence_required | `npm run verify:dynamo-promotion-cutover && npm run verify:dynamo-deployment-readiness && BASE_URL=<production-preview-url> npm run verify:dynamo` | 2 |
| Lint, typecheck, build, smoke, full verifier, and browser QA | Verification | Master Admin | preview_complete | `npm run lint && npm run typecheck && npm run build && BASE_URL=<preview-url> npm run qa:dynamo-browser` | 1 |
| Documentation and launch handoff artifacts | Documentation | Master Admin | preview_complete | `npm run generate:dynamo-launch-assets && npm run verify:dynamo-launch-artifact-index` | 1 |
| Owner final signoff and go-live authority | Owner Decision | Master Admin | external_evidence_required | `npm run verify:dynamo-owner-signoff-register && npm run verify:dynamo-live-readiness-board && npm run audit:dynamo-goal` | 3 |

## External Evidence Required

### Payments, packages, and checkout readiness

Blocked live actions: checkout activation, payment collection, package publication

- [ ] Approved package matrix with prices, taxes, fees, refund rules, and payment provider product ids
- [ ] Sandbox checkout, webhook, refund, failure, and audit proof

### Waivers, legal, youth safeguarding, and privacy readiness

Blocked live actions: signature capture, medical intake, youth registration launch, sensitive admin mutations

- [ ] Approved legal waiver versions and signature workflow tests
- [ ] Guardian/adult signature audit, export, expiration, and revocation proof
- [ ] Approved terms, privacy, refund, support, and communications ownership

### League, facility, staff, roster, sponsor, and media proof

Blocked live actions: league claim publication, facility publication, staff proof publication, roster publication, sponsor logo publication

- [ ] Confirmed league/facility status or owner-approved future-pathway wording
- [ ] Staff, roster, sponsor logo, testimonial, media-release, and news proof approvals

### SEO, noindex, root promotion, redirects, and rollback

Blocked live actions: root route promotion, noindex removal, permanent redirects, sitemap publication

- [ ] Production-preview deployment id and URL
- [ ] Owner-approved noindex removal, sitemap publication, canonical/root switch, redirect plan, and rollback target

### Owner final signoff and go-live authority

Blocked live actions: goal completion claim, root route promotion, checkout activation, signature capture, public claim publication, permanent redirects

- [ ] Every owner signoff row signed by a named approver with evidence attached
- [ ] Live readiness board converted from no-go to go only after evidence approval
- [ ] Production deployment, form, payment, waiver, league/facility, SEO, redirect, and rollback proof attached

This matrix does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish public claims, remove noindex, apply permanent redirects, or replace the current LC Training root site.
