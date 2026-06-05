# Detroit Dynamo Secret Redaction Contract

Generated: 2026-05-29T14:22:18.850Z

Decision: Secret Redaction Required

Generated Detroit Dynamo handoffs, public code, and owner review artifacts must not expose local API keys, Vercel project identifiers, provider secrets, deployment bypass tokens, or environment values.

## Summary

- Rules: 8
- Evidence-required rules: 7
- Preview-ready rules: 1
- Local secret sources detected: 7
- Local identifier sources detected: 2
- Scanned files: 369
- Exact secret matches: 0
- Identifier matches: 0
- Generic pattern matches: 0
- Leakages detected: 0
- Exact secret values written: false
- Project identifiers redacted: true
- Publish allowed: false
- Live gates cleared: 0
- Publications unlocked: 0

## Usage Rules

- Use this report before sharing generated launch artifacts or owner-review handoffs.
- Never write exact local secret values, Vercel project identifiers, deployment bypass tokens, or payment provider secrets into generated reports.
- A nonzero leakage count blocks owner handoff sharing, production promotion, checkout activation, and live admin-write activation.
- Environment variable names and redacted status labels are allowed; environment variable values are not.

## Redaction Rules

| Rule | Surface | Owner | Status | Blocked Actions |
| --- | --- | --- | --- | --- |
| Local environment secret values stay local | .env*, Vercel env, Appwrite env, local developer shell | Master Admin | evidence_required | public artifact publication, owner handoff distribution |
| Vercel project identifiers are redacted | .vercel project/repo link files and launch handoffs | Master Admin | evidence_required | deployment handoff publication, owner evidence packet sharing |
| Appwrite server credentials are never in public handoffs | Appwrite API keys, function variables, server SDK configuration | Master Admin | evidence_required | Appwrite function deployment proof sharing, live admin write activation |
| Payment provider secrets stay out of launch artifacts | Stripe, PayPal, webhook, checkout, and refund configuration | Master Admin | evidence_required | checkout activation, payment collection, package publication |
| Deployment access tokens and bypass secrets are not documented | Preview deployment protection, Vercel token, CI token, deployment URLs | Master Admin | evidence_required | preview QA handoff sharing, production promotion |
| Generated launch artifacts are share-safe | artifacts/detroit-dynamo/launch/* | Media/Admin Staff | evidence_required | launch packet export, owner closeout |
| Public source and documentation avoid secrets | src, scripts, functions, docs, appwrite.json, package.json, vercel.json | Master Admin | evidence_required | repository publication, external contractor handoff |
| Owner handoffs use evidence labels instead of secrets | Roadmap, owner signoff register, evidence intake, live readiness board | Master Admin | preview_ready | owner launch decision, production promotion |

## Scan Targets

- DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md
- DETROIT_DYNAMO_FULL_PREVIEW_NOTES.md
- artifacts/detroit-dynamo
- src
- scripts
- functions
- appwrite.json
- package.json
- vercel.json

## Violations

No redaction violations were recorded by this report.

This report does not approve launch, deploy code, expose secrets, record production evidence, clear live gates, unlock publication, or replace the current LC Training root site.
