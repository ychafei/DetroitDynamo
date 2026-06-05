# Detroit Dynamo Launch Artifact Index

Generated: 2026-05-29T14:14:31.108Z

Decision: Preview Handoff Index

This index organizes the Detroit Dynamo launch artifacts for owner review without approving launch or unlocking live actions.

## Summary

- Artifacts: 31
- Categories: 9
- Owner roles: 4
- Markdown artifacts: 27
- CSV artifacts: 1
- JSON artifacts: 2
- Blocked live actions: 49
- Owner launch review sections: 9
- Owner evidence intake rows: 13
- Owner signoff rows: 11
- Owner unsigned signoff rows: 11
- Final acceptance rows: 15
- Final acceptance external rows: 5
- Vercel preview steps: 10
- Vercel CLI upgrade recommended: true
- Secret redaction rules: 8
- Secret redaction leakages: 0
- External gate closure rows: 9
- External gate closure allowed rows: 0
- Production-preview tracks: 30
- Live readiness rows: 11
- Live gates cleared: 0
- Publications unlocked: 0

## Usage Rules

- Start with the Live Readiness Board, then the Owner Launch Review Packet, then the Owner Evidence Intake Worksheet.
- Do not treat any index item as launch approval; it only points to the artifact that must be reviewed.
- Keep preview-only counters at zero until real external evidence and owner approval are attached.
- Run the artifact-specific verify command after updating any handoff file.

## Artifact Index

| Artifact | Category | Owner | Path | Verify | Launch Question |
| --- | --- | --- | --- | --- | --- |
| Rebrand Audit and Roadmap | Executive Summary | Master Admin | `DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md` | `npm run audit:dynamo-goal` | Does the handoff explain what was built, what remains external, and how it was verified? |
| Goal Audit Report | Executive Summary | Master Admin | `artifacts/detroit-dynamo/goal-audit.json` | `npm run audit:dynamo-goal` | Do implemented requirements still pass while external gates remain explicit? |
| Final Acceptance Matrix | Executive Summary | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md` | `npm run verify:dynamo-final-acceptance` | Does every original acceptance requirement have evidence and explicit remaining external gates? |
| Owner Launch Review Packet | Owner Decision | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-launch-review.md` | `npm run verify:dynamo-owner-launch-review` | Has the owner reviewed every go/no-go launch section? |
| Owner Handoff Packet | Owner Decision | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-handoff-packet.md` | `npm run verify:dynamo-owner-handoff-packet` | Does the owner have one redacted packet tying artifacts, commands, signoffs, evidence, and blocked live actions together? |
| External Gate Closure Packet | Owner Decision | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-external-gate-closure.md` | `npm run verify:dynamo-external-gate-closure` | Does every remaining external gate have a role owner, required evidence, verification command, and blocked live action? |
| Owner Evidence Intake Worksheet | Owner Decision | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv` | `npm run verify:dynamo-owner-evidence-intake` | Has every evidence item been given a real location, approver, date, and decision? |
| Owner Signoff Register | Owner Decision | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md` | `npm run verify:dynamo-owner-signoff-register` | Are all owner and external approvals still unsigned until real evidence is attached? |
| Vercel Preview Deployment Runbook | Deployment | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-vercel-preview-runbook.md` | `npm run verify:dynamo-vercel-preview` | Has a Vercel preview URL, deployment id, route QA, inspect summary, and rollback target been recorded without exposing secrets? |
| Secret Redaction Contract | Deployment | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-secret-redaction.md` | `npm run verify:dynamo-secret-redaction` | Do generated handoffs and source files avoid local secret values and Vercel project identifiers? |
| Production Preview Evidence Matrix | Owner Decision | Registrar | `artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md` | `npm run verify:dynamo-production-preview-evidence` | Have production-preview submissions and admin action proofs been attached? |
| Live Readiness Board | Owner Decision | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-live-readiness-board.md` | `npm run verify:dynamo-live-readiness-board` | Is every launch phase still blocked until real evidence and owner approval exist? |
| Deployment Readiness Handoff | Deployment/Cutover | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md` | `npm run verify:dynamo-deployment-readiness` | Are deployment ids, preview URLs, env evidence, and rollback targets recorded before promotion? |
| Launch Evidence Checklist | Launch Control | Club Director | `artifacts/detroit-dynamo/launch/detroit-dynamo-launch-evidence-checklist.md` | `npm run verify:dynamo-launch-evidence` | Are all required proof items known and assigned? |
| Launch Evidence Action Handoff | Launch Control | Club Director | `artifacts/detroit-dynamo/launch/detroit-dynamo-launch-evidence-actions.md` | `npm run verify:dynamo-launch-evidence-actions` | Can operators record preview proof actions without clearing live gates? |
| External Confirmation Register | External Proof | Club Director | `artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md` | `npm run verify:dynamo` | Which external facts are still unconfirmed? |
| External Confirmation Action Handoff | External Proof | Club Director | `artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md` | `npm run verify:dynamo-external-confirmation-actions` | Can owner signoff requests be rehearsed without publishing facts? |
| Payment and Waiver Gate Contract | External Proof | Registrar | `artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md` | `npm run verify:dynamo-gate-contracts` | Are checkout and waiver workflows still gated until owner/legal approval? |
| Public Claim Safety Contract | External Proof | Media/Admin Staff | `artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md` | `npm run verify:dynamo-claim-safety` | Are unconfirmed claims still future-pathway or placeholder language? |
| Safeguarding and Privacy Contract | External Proof | Registrar | `artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md` | `npm run verify:dynamo-safeguarding` | Are youth-facing operations still blocked until safeguarding evidence is approved? |
| Backend Activation Runbook | Backend/Admin | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md` | `npm run preflight:dynamo-backend` | What must happen before live Appwrite mode is enabled? |
| Lead Intake Function Handoff | Backend/Admin | Media/Admin Staff | `artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-handoff.md` | `npm run verify:dynamo-intake-contract` | Do public forms map to the expected dd_* records? |
| Pipeline Action Function Handoff | Backend/Admin | Registrar | `artifacts/detroit-dynamo/launch/detroit-dynamo-pipeline-action-handoff.md` | `npm run verify:dynamo-pipeline-actions` | Are pipeline transitions scoped and auditable? |
| Admin Module Read Handoff | Backend/Admin | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md` | `npm run verify:dynamo-admin-module-read` | Are admin reads role-scoped before live data browsing? |
| Admin Module Write Handoff | Backend/Admin | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md` | `npm run verify:dynamo-admin-module-writes` | Are live admin writes still blocked until external gates and roles are approved? |
| Admin Role Grant Handoff | Backend/Admin | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md` | `npm run verify:dynamo-admin-role-grants` | Can trusted roles be granted without opening broad admin access? |
| Admin Record Workspace Handoff | Backend/Admin | Club Director | `artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.md` | `npm run verify:dynamo-admin-record-workspace` | Are preview record workspaces ready without mutating live records? |
| Promotion Cutover Control | SEO/Cutover | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md` | `npm run verify:dynamo-promotion-cutover` | What remains blocked before Detroit Dynamo can replace the LC root? |
| Redirect Plan Draft | SEO/Cutover | Master Admin | `artifacts/detroit-dynamo/launch/detroit-dynamo-redirect-plan.md` | `BASE_URL=<production-preview-url> npm run verify:dynamo` | Which redirects must wait for promotion approval? |
| Sitemap Preview | SEO/Cutover | Media/Admin Staff | `artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml` | `BASE_URL=<production-preview-url> npm run verify:dynamo` | Which Dynamo routes are sitemap-ready after SEO approval? |
| Browser QA Report | Verification | Master Admin | `artifacts/detroit-dynamo/browser-qa/browser-qa-report.json` | `BASE_URL=<target-url> npm run qa:dynamo-browser` | Do desktop/mobile routes, public forms, and protected admin pages render cleanly? |

## Category Counts

- Executive Summary: 3
- Owner Decision: 7
- Deployment: 2
- Deployment/Cutover: 1
- Launch Control: 2
- External Proof: 5
- Backend/Admin: 7
- SEO/Cutover: 3
- Verification: 1

## Blocked Live Actions

- Appwrite intake default
- admin CRUD launch
- canonical migration
- checkout activation
- default live intake
- exact pricing publication
- external gate closeout
- facility publication
- fixture/result publication
- go-live row approval
- goal completion claim
- launch announcement
- league claim publication
- live admin write activation
- live evidence clearance
- live lead routing
- live lead status transitions
- live record migration
- medical intake
- noindex removal
- owner closeout
- owner handoff distribution
- owner launch approval
- owner launch decision
- payment collection
- payment/waiver/sponsor mutation
- permanent redirects
- post-cutover closeout
- post-launch closeout
- production deployment
- production promotion
- promotion decision
- promotion gate clearance
- protected admin live access
- protected admin live reads
- protected admin live writes
- public claim publication
- public launch announcement
- publication approval
- root route promotion
- sensitive admin mutations
- signature capture
- sitemap publication
- sponsor logo publication
- sponsor proof publication
- staff proof publication
- trusted role grants
- youth registration launch
- youth roster publication

This index is a navigation aid only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish claims, remove noindex, apply redirects, or replace the current LC Training root site.
