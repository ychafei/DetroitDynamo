# Detroit Dynamo Deployment Readiness

Generated: 2026-05-29T14:14:31.145Z

Decision: Deployment Evidence Required

Deployment, environment, domain, indexing, redirect, backend, and rollback evidence must be recorded before Detroit Dynamo can replace the current LC Training root site.

## Summary

- Tracks: 10
- Phases: 8
- Owner roles: 3
- Evidence-required tracks: 6
- Preview-ready tracks: 2
- Blocked/preview-only tracks: 2
- Live gates cleared: 0
- Publications unlocked: 0
- Production deployments recorded: 0
- Production submissions recorded: 0
- Root promotion allowed: false
- Permanent redirects allowed: false
- Sitemap routes: 16
- Redirect plan entries: 7
- Backend activation steps: 8
- Promotion gates: 6
- Promotion cutover tracks: 9
- Blocked live actions: 10

## Usage Rules

- Use this report after local preview QA passes and before any production-preview or root-route promotion meeting.
- Attach real deployment ids, preview URLs, production URLs, env confirmation, and rollback targets in the owner evidence worksheet.
- Do not treat preview-ready tracks as launch approval; external evidence and owner approval are still required.
- Run the production-preview commands against the real preview URL before enabling Appwrite default intake or redirects.

## Readiness Tracks

| Track | Phase | Status | Owner | Verification | Blocked Live Action |
| --- | --- | --- | --- | --- | --- |
| Current LC production snapshot | Pre-deployment | evidence_required | Master Admin | `BASE_URL=<current-production-url> npm run test -- --run` | Do not replace the current LC root shell until rollback evidence is saved. |
| Vercel project link and CLI readiness | Hosting | evidence_required | Master Admin | `vercel --version && npm run build` | Do not schedule promotion until the hosting target and CLI version are recorded. |
| SPA routing and rewrite config | Hosting | preview_ready | Master Admin | `BASE_URL=<production-preview-url> npm run verify:dynamo` | Do not add permanent redirects until redirect exclusions are approved. |
| Production-preview build proof | Build | preview_ready | Master Admin | `npm run lint && npm run typecheck && npm run build` | Do not promote an unverified build artifact. |
| Client environment variable readiness | Environment | evidence_required | Master Admin | `npm run preflight:dynamo-backend` | Do not make Appwrite intake the default until production-preview env values are verified. |
| Server function environment readiness | Backend | evidence_required | Master Admin | `npm run preflight:dynamo-backend` | Do not enable protected admin live writes until function variables and trusted roles are verified. |
| Production-preview form and admin smoke | Backend | evidence_required | Registrar | `BASE_URL=<production-preview-url> npm run qa:dynamo-browser` | Do not record production submissions or enable live admin operations until smoke proof is attached. |
| SEO, indexing, and domain readiness | SEO | preview_only | Media/Admin Staff | `BASE_URL=<production-preview-url> npm run verify:dynamo` | Do not remove preview noindex or publish root Dynamo metadata before SEO approval. |
| Redirect and domain cutover readiness | Promotion | blocked_until_approval | Master Admin | `BASE_URL=<production-url> npm run verify:dynamo` | Do not apply permanent redirects or canonical migration before promotion approval. |
| Post-launch monitoring and rollback readiness | Post-launch | evidence_required | Master Admin | `BASE_URL=<production-url> npm run qa:dynamo-browser` | Do not close the launch window until post-launch QA and rollback readiness are documented. |

## Track Details

### Current LC production snapshot

Deployment surface: Current LC root, booking, auth, blog, team, LCFC, apply, legal, and admin routes

Rollback requirement: Restore the recorded LC deployment or routing target if promotion fails.

Required evidence:
- [ ] Production deployment id or rollback target for the current LC Training site
- [ ] Current route smoke output and browser QA report saved before promotion
- [ ] Screenshots or rendered QA proof for root, booking, auth, admin, and LCFC paths

### Vercel project link and CLI readiness

Deployment surface: .vercel project link, Vercel CLI, deployment target, and build settings

Rollback requirement: Keep the previous production deployment available as the rollback target.

Required evidence:
- [ ] Vercel project link confirmed without exposing org or project ids in public docs
- [ ] Vercel CLI version recorded after upgrading to the latest compatible release
- [ ] Preview deployment URL and production deployment target recorded

### SPA routing and rewrite config

Deployment surface: vercel.json and Vite static output

Rollback requirement: Remove redirect rules and keep the SPA rewrite if cutover is paused.

Required evidence:
- [ ] The Vercel rewrite continues to route SPA paths to /index.html
- [ ] No permanent Detroit Dynamo redirects are enabled before owner approval
- [ ] Auth, admin, booking, payment callback, and unsubscribe routes are explicitly protected from accidental redirect rules

### Production-preview build proof

Deployment surface: Vite build output and static Detroit Dynamo assets

Rollback requirement: Redeploy the last verified LC build if the Dynamo build fails after promotion.

Required evidence:
- [ ] npm run lint, npm run typecheck, npm run build, and git diff --check pass
- [ ] Detroit Dynamo logo, favicon, kit, digital, and application assets exist in public/detroit-dynamo
- [ ] Build artifact and preview deployment URL are recorded for owner review

### Client environment variable readiness

Deployment surface: VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in hosting environment

Rollback requirement: Switch public forms back to local preview/fallback mode if live intake fails.

Required evidence:
- [ ] Production-preview client env keys are set in the host environment without exposing secret values
- [ ] Client bundle does not bake missing Appwrite env values into production-preview forms
- [ ] Local fallback remains available until production-preview submissions pass

### Server function environment readiness

Deployment surface: Appwrite function variables, scopes, bootstrap admin, and dd_* collections

Rollback requirement: Disable Appwrite write mode and return to local preview mode if functions fail.

Required evidence:
- [ ] APPWRITE_API_KEY configured for Detroit Dynamo functions without printing secrets
- [ ] DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID set before first live Master Admin grant
- [ ] Lead intake, pipeline action, module read, role grant, and module write functions deployed with expected scopes

### Production-preview form and admin smoke

Deployment surface: Public forms, Appwrite records, protected admin actions, and audit events

Rollback requirement: Disable live intake and archive failed test records if production-preview smoke fails.

Required evidence:
- [ ] Training, youth, tryout, men, women, sponsor, and contact forms create expected records
- [ ] Authenticated pipeline, module read, role grant, and module write actions reject unauthorized users and write audit events
- [ ] Production-preview record ids and admin action ids are attached to the owner evidence worksheet

### SEO, indexing, and domain readiness

Deployment surface: Domain, canonical URLs, robots, sitemap, Open Graph, favicon, and noindex controls

Rollback requirement: Restore LC root metadata and reapply preview noindex if launch is reversed.

Required evidence:
- [ ] Detroit Dynamo metadata, favicon, Open Graph image, robots draft, and sitemap preview are owner-approved
- [ ] Noindex removal is tied to a named launch window and owner approval
- [ ] Domain and canonical URL changes do not overwrite LC Training root SEO before promotion approval

### Redirect and domain cutover readiness

Deployment surface: Root route, old LC public paths, Dynamo aliases, redirects, and callback exclusions

Rollback requirement: Disable redirect rules and restore old LC public routes as canonical paths if needed.

Required evidence:
- [ ] Redirect plan approved with auth, admin, booking, payment callback, unsubscribe, and legal exclusions
- [ ] Post-cutover 200/301 route verification command is ready for the production URL
- [ ] Rollback instructions are written before permanent redirects are applied

### Post-launch monitoring and rollback readiness

Deployment surface: Post-launch browser QA, route smoke, forms, admin, booking, payment, waiver, and owner closeout

Rollback requirement: Trigger rollback if root, booking, forms, payments, waivers, auth, admin, or legal/support flows fail.

Required evidence:
- [ ] Post-launch browser QA and route smoke commands are prepared for the production URL
- [ ] Owner sign-off process and rollback trigger conditions are documented
- [ ] Payment, waiver, admin, and support issues have a named rollback owner

This deployment readiness report is a preview handoff only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish public claims, remove noindex, apply permanent redirects, or replace the current LC Training root site.
