# Detroit Dynamo Vercel Preview Deployment Runbook

Generated: 2026-05-29T14:14:31.145Z

Decision: Vercel Preview Evidence Required

Vercel preview deployment evidence, CLI readiness, route QA, rollback proof, and owner signoff must be recorded before Detroit Dynamo can replace the current LC Training root site.

## Summary

- Steps: 10
- Evidence-required steps: 7
- Preview-ready steps: 2
- Blocked steps: 1
- Commands: 19
- Observed Vercel CLI version: not_checked_by_browser_report
- Recommended Vercel CLI version: 54.6.1+
- CLI upgrade recommended: true
- Project link type: not_checked_by_browser_report
- Linked project count: 0
- Project identifiers redacted: true
- SPA rewrite present: false
- Required package scripts present: true
- Preview deployment recorded: 0
- Production deployment recorded: 0
- Production promotion allowed: false
- Rollback target recorded: false
- Live gates cleared: 0
- Publications unlocked: 0

## Usage Rules

- Use this runbook after local verification passes and before requesting an owner launch decision.
- Record Vercel preview URL, deployment id, inspect summary, browser QA, and rollback target in owner evidence artifacts.
- Do not commit Vercel org ids, project ids, tokens, environment values, or deployment-protection bypass secrets.
- Do not run promotion, redirect, noindex-removal, checkout, waiver-signature, or public-claim publication commands until owner signoff is complete.

## Runbook Steps

| Step | Phase | Status | Owner | Commands |
| --- | --- | --- | --- | --- |
| Upgrade and record Vercel CLI context | CLI | evidence_required | Master Admin | `vercel --version && npm i -g vercel@latest && pnpm add -g vercel@latest` |
| Confirm linked project without exposing ids | Project Link | preview_ready | Master Admin | `test -f .vercel/repo.json || test -f .vercel/project.json` |
| Pull preview environment safely | Environment | evidence_required | Master Admin | `vercel pull --yes --environment=preview` |
| Run local verification before deployment | Verification | preview_ready | Master Admin | `npm run lint && npm run typecheck && npm run build && npm run audit:dynamo-goal` |
| Create Vercel prebuilt output | Build | evidence_required | Master Admin | `vercel build` |
| Deploy prebuilt preview | Preview Deployment | evidence_required | Master Admin | `vercel deploy --prebuilt` |
| Inspect preview deployment and logs | Preview Deployment | evidence_required | Master Admin | `vercel inspect <preview-url> && vercel logs <preview-url>` |
| Run preview route, link, form, and console QA | Preview QA | evidence_required | Registrar | `BASE_URL=<preview-url> npm run verify:dynamo && BASE_URL=<preview-url> npm run qa:dynamo-browser` |
| Record current production snapshot before any promotion | Current Site Preservation | evidence_required | Master Admin | `BASE_URL=<current-production-url> npm run test -- --run && BASE_URL=<current-production-url> npm run qa:dynamo-browser` |
| Hold production promotion until owner signoff | Promotion Hold | blocked_until_owner_signoff | Master Admin | `vercel promote <preview-url> && vercel rollback <deployment-url-or-id>` |

## Evidence Checklist

### Upgrade and record Vercel CLI context

Rollback note: Use the prior production deployment as the rollback target if preview deployment checks fail.

Required evidence:
- [ ] Vercel CLI version recorded after upgrade
- [ ] Authenticated Vercel user/team confirmed without exposing tokens
- [ ] Deployment operator confirms the latest CLI is available before preview deployment work

Blocked live actions: production deployment, root route promotion

### Confirm linked project without exposing ids

Rollback note: Pause deployment if the link points at the wrong team or project.

Required evidence:
- [ ] .vercel link file exists locally
- [ ] Project directory is the repo root
- [ ] Org and project identifiers are redacted from public handoff docs

Blocked live actions: production deployment

### Pull preview environment safely

Rollback note: Revert to local preview intake if preview env values are missing or wrong.

Required evidence:
- [ ] Preview environment pull completed without printing secrets
- [ ] Client Appwrite endpoint and project id are present for preview only
- [ ] Server-side secrets remain in Vercel/Appwrite environments and are not committed

Blocked live actions: Appwrite intake default, protected admin live writes

### Run local verification before deployment

Rollback note: Do not deploy a build that fails local verification.

Required evidence:
- [ ] Lint, typecheck, and build pass locally
- [ ] Goal audit remains 7/8 with external gates visible
- [ ] Build warning, if any, is documented before deployment

Blocked live actions: preview deployment, production deployment

### Create Vercel prebuilt output

Rollback note: Delete failed prebuilt output and rerun local verification before rebuilding.

Required evidence:
- [ ] Vercel build output created from the linked project
- [ ] SPA rewrite continues to send routes to /index.html
- [ ] No production redirects or root promotion rules are introduced

Blocked live actions: preview deployment, production deployment

### Deploy prebuilt preview

Rollback note: Abandon the preview deployment if route QA, form QA, or admin guards fail.

Required evidence:
- [ ] Preview deployment URL recorded
- [ ] Preview deployment id recorded in owner evidence intake
- [ ] Deployment protection remains enabled unless owner explicitly approves an alternate QA access path

Blocked live actions: production deployment, root route promotion, noindex removal

### Inspect preview deployment and logs

Rollback note: Do not promote a preview deployment with unresolved deployment or runtime errors.

Required evidence:
- [ ] Deployment inspect output confirms the expected project and build
- [ ] Logs show no unexpected build/runtime errors during smoke testing
- [ ] Inspection output is summarized without exposing secrets

Blocked live actions: production deployment, owner launch decision

### Run preview route, link, form, and console QA

Rollback note: Keep the preview isolated and fix issues before owner review if QA fails.

Required evidence:
- [ ] Full verifier passes against the preview URL
- [ ] Browser QA submits all seven public lead forms against the preview URL
- [ ] No console, mobile overflow, broken link, route, or protected-admin guard failures are recorded

Blocked live actions: Appwrite intake default, public launch announcement, owner launch decision

### Record current production snapshot before any promotion

Rollback note: Restore the recorded LC deployment or routing target if promotion fails.

Required evidence:
- [ ] Current LC Training root, booking, auth, LCFC, team, blog, legal, and admin route snapshot recorded
- [ ] Rollback deployment id or previous production target recorded
- [ ] Current-site screenshots/report saved before any root-route change

Blocked live actions: root route promotion, permanent redirects, noindex removal

### Hold production promotion until owner signoff

Rollback note: Rollback must be ready before any promote command is allowed.

Required evidence:
- [ ] Owner signoff register has every row signed with evidence attached
- [ ] Live readiness board reports go-live rows and live gates only after external evidence is approved
- [ ] Rollback owner and rollback deployment target are recorded before promotion

Blocked live actions: production promotion, permanent redirects, checkout activation, signature capture, public claim publication

This runbook does not deploy, promote, roll back, remove noindex, publish redirects, enable checkout, collect signatures, publish claims, or replace the current LC Training root site.
