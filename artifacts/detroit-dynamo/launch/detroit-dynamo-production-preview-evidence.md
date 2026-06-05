# Detroit Dynamo Production Preview Evidence Matrix

Generated: 2026-05-29T14:14:30.653Z

Decision: Evidence Required: Preview Only

Production-preview submissions, authenticated admin actions, backend provisioning proof, and owner approvals must be attached before Detroit Dynamo can replace LCTrainings.com.

## Summary

- Tracks: 30
- Evidence required: 30
- Public form tracks: 7
- Admin action tracks: 4
- Route QA tracks: 3
- Backend activation tracks: 8
- External confirmation tracks: 6
- Owner review decision: no_go_preview_only
- Live gates cleared: 0
- Production submissions recorded: 0
- Publications unlocked: 0

## Required Production Preview Actions

- [ ] Run every public form fixture on a production-preview deployment and attach response ids or screenshots.
- [ ] Run authenticated admin function success and rejection fixtures with trusted preview roles.
- [ ] Attach route smoke, browser QA, and console-clean evidence for current LC routes, Dynamo public routes, and protected Dynamo admin routes.
- [ ] Attach Appwrite preflight, provisioning/dry-run, function deployment, and isolated dd_* collection evidence before enabling live backend mode.
- [ ] Keep the owner launch review decision at No-Go: Preview Only until external approvals and production-preview evidence are reviewed.

## Evidence Tracks

| Track | Type | Owner | Evidence Id | Status |
| --- | --- | --- | --- | --- |
| General contact inquiry | public_form_submission | Media/Admin Staff | `pp-form-contact-general-inquiry` | evidence_required |
| Training academy inquiry | public_form_submission | Training Director | `pp-form-training-private-session` | evidence_required |
| Youth club pathway interest | public_form_submission | Registrar | `pp-form-youth-club-interest` | evidence_required |
| Open tryout registration | public_form_submission | Registrar | `pp-form-tryout-registration` | evidence_required |
| Senior men player interest | public_form_submission | Club Director | `pp-form-senior-men-interest` | evidence_required |
| Senior women player interest | public_form_submission | Club Director | `pp-form-senior-women-interest` | evidence_required |
| Sponsor partnership inquiry | public_form_submission | Media/Admin Staff | `pp-form-sponsor-inquiry` | evidence_required |
| Public form rejection probes | public_validation_probe | Media/Admin Staff | `pp-form-negative-probes` | evidence_required |
| Authenticated pipeline status action | admin_function_action | Registrar | `pp-admin-pipeline-action` | evidence_required |
| Authenticated admin module reads | admin_function_action | Master Admin | `pp-admin-module-read` | evidence_required |
| Master Admin role grant actions | admin_function_action | Master Admin | `pp-admin-role-grant` | evidence_required |
| Authenticated admin module writes | admin_function_action | Master Admin | `pp-admin-module-write` | evidence_required |
| Admin record workspace review | admin_record_workspace | Club Director | `pp-admin-record-workspace-review` | evidence_required |
| Current LC site route preservation | route_browser_qa | Master Admin | `pp-current-lc-route-preservation` | evidence_required |
| Detroit Dynamo public route matrix | route_browser_qa | Media/Admin Staff | `pp-dynamo-public-route-matrix` | evidence_required |
| Protected Dynamo admin route matrix | route_browser_qa | Master Admin | `pp-protected-admin-route-matrix` | evidence_required |
| 1. Run Local Backend Preflight | backend_activation | Master Admin | `pp-backend-step-1` | evidence_required |
| 2. Review Appwrite Collection Plan | backend_activation | Master Admin | `pp-backend-step-2` | evidence_required |
| 3. Provision Isolated Collections | backend_activation | Master Admin | `pp-backend-step-3` | evidence_required |
| 4. Configure Function Variables | backend_activation | Master Admin | `pp-backend-step-4` | evidence_required |
| 5. Deploy Lead Intake, Pipeline, Module Read, Role Grant, and Module Write Functions | backend_activation | Master Admin | `pp-backend-step-5` | evidence_required |
| 6. Enable Appwrite Intake in Admin | backend_activation | Media/Admin Staff | `pp-backend-step-6` | evidence_required |
| 7. Submit Production-Preview Test Leads and Pipeline Actions | backend_activation | Registrar | `pp-backend-step-7` | evidence_required |
| 8. Lock Promotion Gate Evidence | backend_activation | Club Director | `pp-backend-step-8` | evidence_required |
| Payments & Packages | external_confirmation | Master Admin | `pp-external-payments-packages` | evidence_required |
| Waivers & Legal | external_confirmation | Registrar | `pp-external-waivers-legal` | evidence_required |
| League & Competition Facts | external_confirmation | Club Director | `pp-external-league-competition-facts` | evidence_required |
| Facilities & Operations | external_confirmation | Club Director | `pp-external-facilities-operations` | evidence_required |
| Staff, Rosters & Safeguarding | external_confirmation | Club Director | `pp-external-staff-rosters-safeguarding` | evidence_required |
| Sponsors, Media & Content Proof | external_confirmation | Media/Admin Staff | `pp-external-sponsors-media-content-proof` | evidence_required |

## Track Details

### General contact inquiry

Type: public_form_submission

Owner: Media/Admin Staff

Evidence id: `pp-form-contact-general-inquiry`

Live gate status: not_cleared

Preview coverage: 1 model(s), 1 routing collection(s), 6 pipeline field(s).

Required evidence:
- [ ] Submit the contact public form on the production-preview deployment and record the returned ContactLead id.
- [ ] Confirm created model ids for ContactLead in isolated dd_* collections.
- [ ] Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.
- [ ] Attach screenshot or browser QA state proving success copy is visible without console errors.

Acceptance criteria:
- The source route remains under /detroit-dynamo and never posts into the current LC Training booking or contact shell.
- A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.
- The production-preview evidence id is attached to the owner launch review before live routing is enabled.

Source references:
- Route: /detroit-dynamo/contact
- Function fixture: contact-general-inquiry
- Collections: dd_contact_leads

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Training academy inquiry

Type: public_form_submission

Owner: Training Director

Evidence id: `pp-form-training-private-session`

Live gate status: not_cleared

Preview coverage: 2 model(s), 2 routing collection(s), 6 pipeline field(s).

Required evidence:
- [ ] Submit the training public form on the production-preview deployment and record the returned ContactLead id.
- [ ] Confirm created model ids for ContactLead, Booking in isolated dd_* collections.
- [ ] Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.
- [ ] Attach screenshot or browser QA state proving success copy is visible without console errors.

Acceptance criteria:
- The source route remains under /detroit-dynamo and never posts into the current LC Training booking or contact shell.
- A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.
- The production-preview evidence id is attached to the owner launch review before live routing is enabled.

Source references:
- Route: /detroit-dynamo/training
- Function fixture: training-private-session
- Collections: dd_contact_leads, dd_bookings

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Youth club pathway interest

Type: public_form_submission

Owner: Registrar

Evidence id: `pp-form-youth-club-interest`

Live gate status: not_cleared

Preview coverage: 4 model(s), 3 routing collection(s), 6 pipeline field(s).

Required evidence:
- [ ] Submit the youth public form on the production-preview deployment and record the returned ContactLead id.
- [ ] Confirm created model ids for ContactLead, Player, ParentGuardian, TryoutRegistration in isolated dd_* collections.
- [ ] Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.
- [ ] Attach screenshot or browser QA state proving success copy is visible without console errors.

Acceptance criteria:
- The source route remains under /detroit-dynamo and never posts into the current LC Training booking or contact shell.
- A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.
- The production-preview evidence id is attached to the owner launch review before live routing is enabled.

Source references:
- Route: /detroit-dynamo/youth-club
- Function fixture: youth-club-interest
- Collections: dd_contact_leads, dd_players, dd_parent_guardians, dd_tryout_registrations

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Open tryout registration

Type: public_form_submission

Owner: Registrar

Evidence id: `pp-form-tryout-registration`

Live gate status: not_cleared

Preview coverage: 4 model(s), 3 routing collection(s), 6 pipeline field(s).

Required evidence:
- [ ] Submit the tryout public form on the production-preview deployment and record the returned ContactLead id.
- [ ] Confirm created model ids for ContactLead, Player, ParentGuardian, TryoutRegistration in isolated dd_* collections.
- [ ] Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.
- [ ] Attach screenshot or browser QA state proving success copy is visible without console errors.

Acceptance criteria:
- The source route remains under /detroit-dynamo and never posts into the current LC Training booking or contact shell.
- A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.
- The production-preview evidence id is attached to the owner launch review before live routing is enabled.

Source references:
- Route: /detroit-dynamo/tryouts
- Function fixture: tryout-registration
- Collections: dd_contact_leads, dd_players, dd_parent_guardians, dd_tryout_registrations

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Senior men player interest

Type: public_form_submission

Owner: Club Director

Evidence id: `pp-form-senior-men-interest`

Live gate status: not_cleared

Preview coverage: 3 model(s), 3 routing collection(s), 6 pipeline field(s).

Required evidence:
- [ ] Submit the men public form on the production-preview deployment and record the returned ContactLead id.
- [ ] Confirm created model ids for ContactLead, Player, TryoutRegistration in isolated dd_* collections.
- [ ] Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.
- [ ] Attach screenshot or browser QA state proving success copy is visible without console errors.

Acceptance criteria:
- The source route remains under /detroit-dynamo and never posts into the current LC Training booking or contact shell.
- A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.
- The production-preview evidence id is attached to the owner launch review before live routing is enabled.

Source references:
- Route: /detroit-dynamo/senior-men
- Function fixture: senior-men-interest
- Collections: dd_contact_leads, dd_players, dd_tryout_registrations

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Senior women player interest

Type: public_form_submission

Owner: Club Director

Evidence id: `pp-form-senior-women-interest`

Live gate status: not_cleared

Preview coverage: 3 model(s), 3 routing collection(s), 6 pipeline field(s).

Required evidence:
- [ ] Submit the women public form on the production-preview deployment and record the returned ContactLead id.
- [ ] Confirm created model ids for ContactLead, Player, TryoutRegistration in isolated dd_* collections.
- [ ] Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.
- [ ] Attach screenshot or browser QA state proving success copy is visible without console errors.

Acceptance criteria:
- The source route remains under /detroit-dynamo and never posts into the current LC Training booking or contact shell.
- A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.
- The production-preview evidence id is attached to the owner launch review before live routing is enabled.

Source references:
- Route: /detroit-dynamo/senior-women
- Function fixture: senior-women-interest
- Collections: dd_contact_leads, dd_players, dd_tryout_registrations

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Sponsor partnership inquiry

Type: public_form_submission

Owner: Media/Admin Staff

Evidence id: `pp-form-sponsor-inquiry`

Live gate status: not_cleared

Preview coverage: 2 model(s), 2 routing collection(s), 6 pipeline field(s).

Required evidence:
- [ ] Submit the sponsor public form on the production-preview deployment and record the returned ContactLead id.
- [ ] Confirm created model ids for ContactLead, Sponsor in isolated dd_* collections.
- [ ] Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.
- [ ] Attach screenshot or browser QA state proving success copy is visible without console errors.

Acceptance criteria:
- The source route remains under /detroit-dynamo and never posts into the current LC Training booking or contact shell.
- A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.
- The production-preview evidence id is attached to the owner launch review before live routing is enabled.

Source references:
- Route: /detroit-dynamo/sponsors
- Function fixture: sponsor-inquiry
- Collections: dd_contact_leads, dd_sponsors

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Public form rejection probes

Type: public_validation_probe

Owner: Media/Admin Staff

Evidence id: `pp-form-negative-probes`

Live gate status: not_cleared

Preview coverage: 4 rejection fixture(s) plus browser validation and storage-error probes.

Required evidence:
- [ ] Run invalid source route, invalid lead type, incomplete tryout, and incomplete sponsor payload probes.
- [ ] Capture visible validation errors with aria-invalid and aria-describedby intact.
- [ ] Capture storage/backend failure state with role=alert and no broken fetch console spam.
- [ ] Attach response statuses and visible UI screenshots to the owner review packet.

Acceptance criteria:
- Invalid payloads are rejected with stable 400-level messages.
- The user-facing form remains recoverable and mobile-friendly after each error.
- No rejected probe creates a live ContactLead, Booking, TryoutRegistration, Player, ParentGuardian, or Sponsor record.

Source references:
- Rejection fixtures: 4
- Function fixture: detroitDynamoLeadIntake rejection cases
- Browser probes: validation error and storage error states

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Authenticated pipeline status action

Type: admin_function_action

Owner: Registrar

Evidence id: `pp-admin-pipeline-action`

Live gate status: not_cleared

Preview coverage: 6 success fixture(s) and 3 rejection fixture(s).

Required evidence:
- [ ] Run every success fixture against the production-preview Appwrite function with an authenticated session.
- [ ] Run every rejection fixture and capture the expected status/error without mutating protected records.
- [ ] Confirm trusted role assignment, collection scope, action guard, and audit-event behavior where applicable.
- [ ] Attach response ids, audit event ids, and screenshots from protected admin views to the owner review packet.

Acceptance criteria:
- Success fixtures only touch isolated dd_* collections and return expected ids.
- Rejection fixtures block unauthenticated, unassigned, cross-module, or externally gated requests.
- No production root route, checkout, waiver signature, public claim, noindex removal, or redirect is changed.

Source references:
- Function: detroitDynamoLeadPipelineAction
- Success fixtures: 6
- Rejection fixtures: 3

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-pipeline-action-handoff.md

### Authenticated admin module reads

Type: admin_function_action

Owner: Master Admin

Evidence id: `pp-admin-module-read`

Live gate status: not_cleared

Preview coverage: 6 success fixture(s) and 5 rejection fixture(s).

Required evidence:
- [ ] Run every success fixture against the production-preview Appwrite function with an authenticated session.
- [ ] Run every rejection fixture and capture the expected status/error without mutating protected records.
- [ ] Confirm trusted role assignment, collection scope, action guard, and audit-event behavior where applicable.
- [ ] Attach response ids, audit event ids, and screenshots from protected admin views to the owner review packet.

Acceptance criteria:
- Success fixtures only touch isolated dd_* collections and return expected ids.
- Rejection fixtures block unauthenticated, unassigned, cross-module, or externally gated requests.
- No production root route, checkout, waiver signature, public claim, noindex removal, or redirect is changed.

Source references:
- Function: detroitDynamoAdminModuleRead
- Success fixtures: 6
- Rejection fixtures: 5

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md

### Master Admin role grant actions

Type: admin_function_action

Owner: Master Admin

Evidence id: `pp-admin-role-grant`

Live gate status: not_cleared

Preview coverage: 6 success fixture(s) and 6 rejection fixture(s).

Required evidence:
- [ ] Run every success fixture against the production-preview Appwrite function with an authenticated session.
- [ ] Run every rejection fixture and capture the expected status/error without mutating protected records.
- [ ] Confirm trusted role assignment, collection scope, action guard, and audit-event behavior where applicable.
- [ ] Attach response ids, audit event ids, and screenshots from protected admin views to the owner review packet.

Acceptance criteria:
- Success fixtures only touch isolated dd_* collections and return expected ids.
- Rejection fixtures block unauthenticated, unassigned, cross-module, or externally gated requests.
- No production root route, checkout, waiver signature, public claim, noindex removal, or redirect is changed.

Source references:
- Function: detroitDynamoAdminRoleGrantAction
- Success fixtures: 6
- Rejection fixtures: 6

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md

### Authenticated admin module writes

Type: admin_function_action

Owner: Master Admin

Evidence id: `pp-admin-module-write`

Live gate status: not_cleared

Preview coverage: 6 success fixture(s) and 7 rejection fixture(s).

Required evidence:
- [ ] Run every success fixture against the production-preview Appwrite function with an authenticated session.
- [ ] Run every rejection fixture and capture the expected status/error without mutating protected records.
- [ ] Confirm trusted role assignment, collection scope, action guard, and audit-event behavior where applicable.
- [ ] Attach response ids, audit event ids, and screenshots from protected admin views to the owner review packet.

Acceptance criteria:
- Success fixtures only touch isolated dd_* collections and return expected ids.
- Rejection fixtures block unauthenticated, unassigned, cross-module, or externally gated requests.
- No production root route, checkout, waiver signature, public claim, noindex removal, or redirect is changed.

Source references:
- Function: detroitDynamoAdminModuleWriteAction
- Success fixtures: 6
- Rejection fixtures: 7

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md

### Admin record workspace review

Type: admin_record_workspace

Owner: Club Director

Evidence id: `pp-admin-record-workspace-review`

Live gate status: not_cleared

Preview coverage: 3 flattened preview record(s) across 2 fixture collection(s).

Required evidence:
- [ ] Review record workspace rows on a production-preview protected admin module route.
- [ ] Export a CSV from at least one module and attach it to the owner review packet.
- [ ] Prepare a write payload from a record detail preview without submitting a live mutation.
- [ ] Confirm required-field readiness and field display profiles match Appwrite schema expectations.

Acceptance criteria:
- Record previews remain read-only until admin module write evidence is approved.
- Prepared payloads include missing-required-field warnings before any live create/update/archive action.
- CSV export does not leak current LC Training records or non-Dynamo collections.

Source references:
- Flattened records: 3
- Fixture collections: 2
- Protected module detail pages: /admin/detroit-dynamo/modules/:moduleSlug

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.json

### Current LC site route preservation

Type: route_browser_qa

Owner: Master Admin

Evidence id: `pp-current-lc-route-preservation`

Live gate status: not_cleared

Preview coverage: Current-site route list is covered by smoke tests and browser QA.

Required evidence:
- [ ] Attach production-preview route smoke output for current LC Training routes.
- [ ] Attach browser screenshots or QA report proving the current homepage and booking shell still render.
- [ ] Confirm no Detroit Dynamo header, footer, or preview noindex behavior replaces the legacy root.
- [ ] Record rollback deployment id before any root route promotion is attempted.

Acceptance criteria:
- Every current LC route returns the SPA root with HTTP 2xx/3xx.
- Booking, auth, blog, team, LCFC, and admin navigation remain reachable.
- No permanent redirects from current LC routes are applied while preview-only.

Source references:
- Routes: /, /about, /book, /lcfc, /team, /blog, /apply
- Smoke command: BASE_URL=... npm run test -- --run
- Browser command: BASE_URL=... npm run qa:dynamo-browser

Related artifacts:
- artifacts/detroit-dynamo/goal-audit.json
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json

### Detroit Dynamo public route matrix

Type: route_browser_qa

Owner: Media/Admin Staff

Evidence id: `pp-dynamo-public-route-matrix`

Live gate status: not_cleared

Preview coverage: 22 Dynamo route path(s) are covered by static and browser QA.

Required evidence:
- [ ] Attach production-preview smoke output for every /detroit-dynamo route and alias.
- [ ] Attach mobile and desktop browser QA screenshots for key public pages.
- [ ] Confirm every CTA stays inside the Dynamo preview or clearly labels current LC fallback booking.
- [ ] Confirm no dead buttons, broken anchors, or console errors appear in the route matrix.

Acceptance criteria:
- All Dynamo routes return HTTP 2xx/3xx and render the isolated Dynamo shell.
- The goat logo, LC footer, old navigation, and old gold/black shell do not appear in Dynamo pages.
- Forms show loading, success, validation, and storage-error states cleanly.

Source references:
- Dynamo routes: 22
- Route root: /detroit-dynamo
- Smoke command: BASE_URL=... npm run test -- --run

Related artifacts:
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json
- artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml

### Protected Dynamo admin route matrix

Type: route_browser_qa

Owner: Master Admin

Evidence id: `pp-protected-admin-route-matrix`

Live gate status: not_cleared

Preview coverage: 16 protected module route(s) are covered by browser QA.

Required evidence:
- [ ] Attach production-preview browser QA output covering protected admin sign-in guard behavior.
- [ ] Open each /admin/detroit-dynamo/modules/:moduleSlug route and record the module readiness state.
- [ ] Confirm protected routes do not expose live writes without an authenticated trusted role.
- [ ] Confirm local preview ledgers and action consoles retain preview-only status labels.

Acceptance criteria:
- Unauthenticated users see the expected sign-in guard.
- Protected module pages render action guards, data targets, safety gates, and record workspace sections.
- Live read/write controls remain blocked until Appwrite role and function evidence exists.

Source references:
- Protected module routes: 16
- Route root: /admin/detroit-dynamo
- Browser command: BASE_URL=... npm run qa:dynamo-browser

Related artifacts:
- artifacts/detroit-dynamo/browser-qa/browser-qa-report.json
- artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-registry.md

### 1. Run Local Backend Preflight

Type: backend_activation

Owner: Master Admin

Evidence id: `pp-backend-step-1`

Live gate status: not_cleared

Preview coverage: Backend preflight report shows schema, function config, function source, pipeline-action fixture coverage, admin-module-read fixture coverage, admin-role-grant fixture coverage, admin-module-write fixture coverage, and env-key presence without printing secrets. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: npm run preflight:dynamo-backend.
- [ ] Attach proof for: Backend preflight report shows schema, function config, function source, pipeline-action fixture coverage, admin-module-read fixture coverage, admin-role-grant fixture coverage, admin-module-write fixture coverage, and env-key presence without printing secrets..
- [ ] Record next action outcome: Resolve any failing local checks before attempting networked backend work..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: npm run preflight:dynamo-backend
- Evidence: Backend preflight report shows schema, function config, function source, pipeline-action fixture coverage, admin-module-read fixture coverage, admin-role-grant fixture coverage, admin-module-write fixture coverage, and env-key presence without printing secrets.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### 2. Review Appwrite Collection Plan

Type: backend_activation

Owner: Master Admin

Evidence id: `pp-backend-step-2`

Live gate status: not_cleared

Preview coverage: Plan confirms the 18 requested operational dd_* collections plus admin audit event and admin role assignment collections with expected attributes, indexes, access policies, and public/function write paths. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: npm run plan:dynamo-appwrite.
- [ ] Attach proof for: Plan confirms the 18 requested operational dd_* collections plus admin audit event and admin role assignment collections with expected attributes, indexes, access policies, and public/function write paths..
- [ ] Record next action outcome: Approve fields, indexes, owner roles, public-form destinations, and audit-event retention before applying..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: npm run plan:dynamo-appwrite
- Evidence: Plan confirms the 18 requested operational dd_* collections plus admin audit event and admin role assignment collections with expected attributes, indexes, access policies, and public/function write paths.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### 3. Provision Isolated Collections

Type: backend_activation

Owner: Master Admin

Evidence id: `pp-backend-step-3`

Live gate status: not_cleared

Preview coverage: Appwrite contains the dd_* collections, attributes, indexes, and permissions required by the Detroit Dynamo model. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: npm run provision:dynamo-appwrite -- --apply.
- [ ] Attach proof for: Appwrite contains the dd_* collections, attributes, indexes, and permissions required by the Detroit Dynamo model..
- [ ] Record next action outcome: Use valid Appwrite credentials and do not mutate legacy LC Training collections..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: npm run provision:dynamo-appwrite -- --apply
- Evidence: Appwrite contains the dd_* collections, attributes, indexes, and permissions required by the Detroit Dynamo model.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### 4. Configure Function Variables

Type: backend_activation

Owner: Master Admin

Evidence id: `pp-backend-step-4`

Live gate status: not_cleared

Preview coverage: detroitDynamoLeadIntake, detroitDynamoLeadPipelineAction, detroitDynamoAdminModuleRead, detroitDynamoAdminRoleGrantAction, and detroitDynamoAdminModuleWriteAction have APPWRITE_API_KEY configured in Appwrite without exposing the key in logs or client code. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: node scripts/configure-functions.mjs.
- [ ] Attach proof for: detroitDynamoLeadIntake, detroitDynamoLeadPipelineAction, detroitDynamoAdminModuleRead, detroitDynamoAdminRoleGrantAction, and detroitDynamoAdminModuleWriteAction have APPWRITE_API_KEY configured in Appwrite without exposing the key in logs or client code..
- [ ] Record next action outcome: Confirm function variables after replacing any expired Appwrite key; set DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID before first live Master Admin grant..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: node scripts/configure-functions.mjs
- Evidence: detroitDynamoLeadIntake, detroitDynamoLeadPipelineAction, detroitDynamoAdminModuleRead, detroitDynamoAdminRoleGrantAction, and detroitDynamoAdminModuleWriteAction have APPWRITE_API_KEY configured in Appwrite without exposing the key in logs or client code.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### 5. Deploy Lead Intake, Pipeline, Module Read, Role Grant, and Module Write Functions

Type: backend_activation

Owner: Master Admin

Evidence id: `pp-backend-step-5`

Live gate status: not_cleared

Preview coverage: detroitDynamoLeadIntake, detroitDynamoLeadPipelineAction, detroitDynamoAdminModuleRead, detroitDynamoAdminRoleGrantAction, and detroitDynamoAdminModuleWriteAction are deployed and enabled with database/document scopes from appwrite.json. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: appwrite push functions --all.
- [ ] Attach proof for: detroitDynamoLeadIntake, detroitDynamoLeadPipelineAction, detroitDynamoAdminModuleRead, detroitDynamoAdminRoleGrantAction, and detroitDynamoAdminModuleWriteAction are deployed and enabled with database/document scopes from appwrite.json..
- [ ] Record next action outcome: Deploy only after preflight, provisioning, and function variable configuration pass..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: appwrite push functions --all
- Evidence: detroitDynamoLeadIntake, detroitDynamoLeadPipelineAction, detroitDynamoAdminModuleRead, detroitDynamoAdminRoleGrantAction, and detroitDynamoAdminModuleWriteAction are deployed and enabled with database/document scopes from appwrite.json.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### 6. Enable Appwrite Intake in Admin

Type: backend_activation

Owner: Media/Admin Staff

Evidence id: `pp-backend-step-6`

Live gate status: not_cleared

Preview coverage: Protected admin mode is switched from Local Preview to Appwrite Intake after backend deployment. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: Use /admin/detroit-dynamo Form Intake Mode.
- [ ] Attach proof for: Protected admin mode is switched from Local Preview to Appwrite Intake after backend deployment..
- [ ] Record next action outcome: Keep local preview fallback available until production-preview form submissions are verified..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: Use /admin/detroit-dynamo Form Intake Mode
- Evidence: Protected admin mode is switched from Local Preview to Appwrite Intake after backend deployment.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### 7. Submit Production-Preview Test Leads and Pipeline Actions

Type: backend_activation

Owner: Registrar

Evidence id: `pp-backend-step-7`

Live gate status: not_cleared

Preview coverage: Pipeline action fixtures validate locally, test submissions create ContactLead plus expected TryoutRegistration or Sponsor records in the dd_* collections, and authenticated pipeline actions update allowed statuses. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: npm run verify:dynamo-intake-contract && npm run verify:dynamo-pipeline-actions, then submit training, tryout, youth, senior, sponsor, and contact forms from /detroit-dynamo/*.
- [ ] Attach proof for: Pipeline action fixtures validate locally, test submissions create ContactLead plus expected TryoutRegistration or Sponsor records in the dd_* collections, and authenticated pipeline actions update allowed statuses..
- [ ] Record next action outcome: Verify no console errors, no broken success states, valid status transitions, and clear admin routing for every lead type..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: npm run verify:dynamo-intake-contract && npm run verify:dynamo-pipeline-actions, then submit training, tryout, youth, senior, sponsor, and contact forms from /detroit-dynamo/*
- Evidence: Pipeline action fixtures validate locally, test submissions create ContactLead plus expected TryoutRegistration or Sponsor records in the dd_* collections, and authenticated pipeline actions update allowed statuses.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### 8. Lock Promotion Gate Evidence

Type: backend_activation

Owner: Club Director

Evidence id: `pp-backend-step-8`

Live gate status: not_cleared

Preview coverage: Goal audit still passes implemented scope and keeps external gates visible until payments, waivers, facilities, and league facts are confirmed. is already named in the backend activation runbook.

Required evidence:
- [ ] Run or complete: npm run audit:dynamo-goal.
- [ ] Attach proof for: Goal audit still passes implemented scope and keeps external gates visible until payments, waivers, facilities, and league facts are confirmed..
- [ ] Record next action outcome: Do not remove preview-only noindex or redirect the current LC site until all promotion gates are approved..
- [ ] Confirm the step does not mutate current LC Training collections, booking, auth, blog, or forms.

Acceptance criteria:
- The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.
- Secrets are not printed in logs or committed to artifacts.
- The owner review packet references the evidence before Appwrite live mode is enabled.

Source references:
- Command: npm run audit:dynamo-goal
- Evidence: Goal audit still passes implemented scope and keeps external gates visible until payments, waivers, facilities, and league facts are confirmed.
- Runbook: detroit-dynamo-backend-activation-runbook.md

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md

### Payments & Packages

Type: external_confirmation

Owner: Master Admin

Evidence id: `pp-external-payments-packages`

Live gate status: not_cleared

Preview coverage: 4 required fact(s) are named for owner review.

Required evidence:
- [ ] Approved private, small-group, team-training, camp, tryout, dues, and sponsor package pricing
- [ ] Selected payment provider, checkout flow, refund policy, and failed-payment handling
- [ ] Tax/fee treatment, discount policy, and settlement ownership
- [ ] Admin reporting needs for packages, payments, refunds, and outstanding balances
- [ ] Record action outcome: Owner approves package matrix, provider, refund rules, and admin payment fields..

Acceptance criteria:
- The publish rule remains enforced until official proof or owner approval is attached.
- Unconfirmed facts stay as future-pathway, placeholder, or register-interest language.
- No payment, waiver, staff, roster, sponsor, facility, league, SEO, redirect, or proof publication is unlocked by this preview record.

Source references:
- Status now: pending_confirmation
- Related models: TrainingPackage, Payment, Booking, CampClinic, Sponsor
- Publish rule: Do not publish checkout links or exact package commitments until pricing and provider setup are approved.

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md

### Waivers & Legal

Type: external_confirmation

Owner: Registrar

Evidence id: `pp-external-waivers-legal`

Live gate status: not_cleared

Preview coverage: 4 required fact(s) are named for owner review.

Required evidence:
- [ ] Youth participation waiver and medical consent language
- [ ] Media release, privacy/terms language, and adult participation waiver
- [ ] Travel, emergency contact, and camp/clinic consent requirements
- [ ] Versioning, expiration, guardian signature, and retention rules
- [ ] Record action outcome: Prepare approved waiver versions and map each form/program to the right waiver requirement..

Acceptance criteria:
- The publish rule remains enforced until official proof or owner approval is attached.
- Unconfirmed facts stay as future-pathway, placeholder, or register-interest language.
- No payment, waiver, staff, roster, sponsor, facility, league, SEO, redirect, or proof publication is unlocked by this preview record.

Source references:
- Status now: pending_confirmation
- Related models: Waiver, Player, ParentGuardian, TryoutRegistration, CampClinic
- Publish rule: Do not collect signatures or present legal text as final until owner/legal review is complete.

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md

### League & Competition Facts

Type: external_confirmation

Owner: Club Director

Evidence id: `pp-external-league-competition-facts`

Live gate status: not_cleared

Preview coverage: 4 required fact(s) are named for owner review.

Required evidence:
- [ ] Confirmed senior men league acceptance before naming current UPSL or similar membership
- [ ] Confirmed senior women league acceptance before naming current UPSL Women or similar membership
- [ ] Confirmed youth league placement before naming current youth competition
- [ ] Fixture, opponent, venue, roster, staff, and competition rules confirmed before publication
- [ ] Record action outcome: Collect official league/competition documentation and owner-approved public wording..

Acceptance criteria:
- The publish rule remains enforced until official proof or owner approval is attached.
- Unconfirmed facts stay as future-pathway, placeholder, or register-interest language.
- No payment, waiver, staff, roster, sponsor, facility, league, SEO, redirect, or proof publication is unlocked by this preview record.

Source references:
- Status now: future_pathway
- Related models: Team, MatchFixture, MatchResult, NewsPost
- Publish rule: Use future-pathway language until written league or competition confirmation exists.

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md

### Facilities & Operations

Type: external_confirmation

Owner: Club Director

Evidence id: `pp-external-facilities-operations`

Live gate status: not_cleared

Preview coverage: 4 required fact(s) are named for owner review.

Required evidence:
- [ ] Confirmed training locations, field permits, indoor facility access, and match venues
- [ ] Calendar availability for private training, camps, tryouts, youth teams, and senior teams
- [ ] Insurance, safety, weather, cancellation, check-in, and emergency procedures
- [ ] Published location names, addresses, parking/access notes, and facility partner permissions
- [ ] Record action outcome: Confirm facility partners, operating rules, insurance requirements, and calendar windows..

Acceptance criteria:
- The publish rule remains enforced until official proof or owner approval is attached.
- Unconfirmed facts stay as future-pathway, placeholder, or register-interest language.
- No payment, waiver, staff, roster, sponsor, facility, league, SEO, redirect, or proof publication is unlocked by this preview record.

Source references:
- Status now: pending_confirmation
- Related models: TrainingSession, CampClinic, MatchFixture, Program
- Publish rule: Do not publish facility commitments, addresses, or schedules until operating access is confirmed.

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md

### Staff, Rosters & Safeguarding

Type: external_confirmation

Owner: Club Director

Evidence id: `pp-external-staff-rosters-safeguarding`

Live gate status: not_cleared

Preview coverage: 4 required fact(s) are named for owner review.

Required evidence:
- [ ] Confirmed staff names, roles, bios, licenses, photos, and public contact rules
- [ ] Background check, safeguarding, and youth communication standards
- [ ] Approved rosters, player photos, bios, statuses, and parent/player release permissions
- [ ] Team manager assignments and internal access levels
- [ ] Record action outcome: Collect staff/roster approvals and map internal roles to admin permissions..

Acceptance criteria:
- The publish rule remains enforced until official proof or owner approval is attached.
- Unconfirmed facts stay as future-pathway, placeholder, or register-interest language.
- No payment, waiver, staff, roster, sponsor, facility, league, SEO, redirect, or proof publication is unlocked by this preview record.

Source references:
- Status now: pending_confirmation
- Related models: Coach, StaffMember, Team, Player
- Publish rule: Do not publish staff, roster, or player bio details until permissions and verification are complete.

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md

### Sponsors, Media & Content Proof

Type: external_confirmation

Owner: Media/Admin Staff

Evidence id: `pp-external-sponsors-media-content-proof`

Live gate status: not_cleared

Preview coverage: 4 required fact(s) are named for owner review.

Required evidence:
- [ ] Approved sponsor packages, logos, website links, activation inventory, and display permissions
- [ ] Real testimonials, player stories, media clips, and partner quotes
- [ ] Launch announcements, news categories, editorial approval workflow, and image rights
- [ ] SEO/social assets, redirect timing, sitemap/robots publication, and current-site migration wording
- [ ] Record action outcome: Approve sponsor assets, proof content, launch copy, and publication workflow before promotion..

Acceptance criteria:
- The publish rule remains enforced until official proof or owner approval is attached.
- Unconfirmed facts stay as future-pathway, placeholder, or register-interest language.
- No payment, waiver, staff, roster, sponsor, facility, league, SEO, redirect, or proof publication is unlocked by this preview record.

Source references:
- Status now: preview_only
- Related models: Sponsor, NewsPost, ContactLead
- Publish rule: Keep proof slots as placeholders until real quotes, sponsor assets, and content rights are approved.

Related artifacts:
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md
- artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md

## Blocked Live Actions

- Appwrite intake default
- SEO index launch
- SEO/redirect launch
- admin CRUD launch
- admin dashboard launch
- admin workflow launch
- checkout/signature activation
- fixture/result publication
- live audit-event writes
- live lead routing
- live lead status transitions
- live record migration
- noindex removal
- owner launch approval
- payment/waiver/sponsor mutation
- permanent redirects
- protected admin live reads
- protected admin live writes
- public fact publication
- public launch announcement
- role grant launch
- role-scoped record browsing
- root route promotion
- trusted role grants

This matrix is a production-preview evidence handoff only. It does not approve launch, enable Appwrite live mode, collect payments, collect signatures, publish claims, remove noindex, apply redirects, or replace the current LC Training root site.
