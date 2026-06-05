# Detroit Dynamo Promotion Summary

Date: 2026-06-05

## Status

Detroit Dynamo is now the primary public brand direction for the app.

What changed in this promotion pass:
- Root metadata, favicon, PWA manifest, shared navbar, shared footer, brand helper, and global theme tokens now use Detroit Dynamo.
- Guest root traffic redirects to `/detroit-dynamo`.
- Legacy public club routes such as `/lcfc`, `/lcfc/*`, `/team`, `/team/*`, `/about`, and `/blog` now redirect into Detroit Dynamo public routes instead of rendering the old LC/Les Chevres public design.
- The Detroit Dynamo header/footer no longer link back to a current-site comparison flow.
- Auth screens and shared public shell styling use the Detroit Dynamo navy, electric blue, silver, and white system.
- Public lead forms remain polished with validation, loading, success, and error states.
- Backend/admin/payment/waiver/league work remains launch-gated where real approvals or credentials are still required.

## Verification

Because this shell did not expose `npm`, commands were run directly through the bundled Node runtime at:

`/Users/yousef/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`

Passed:
- `node scripts/test-site-smoke.mjs` with `BASE_URL=http://127.0.0.1:5182`
- `node scripts/verify-detroit-dynamo-preview.mjs` with `BASE_URL=http://127.0.0.1:5182`
- `node scripts/audit-detroit-dynamo-goal.mjs` with `BASE_URL=http://127.0.0.1:5182`
- `node node_modules/eslint/bin/eslint.js . --quiet`
- `node node_modules/typescript/bin/tsc -p ./jsconfig.json`
- `node node_modules/vite/bin/vite.js build`
- `node scripts/browser-qa-detroit-dynamo.mjs` with `BASE_URL=http://127.0.0.1:5182`
- `git diff --check`

Browser QA passed against `http://127.0.0.1:5182`, checking 57 browser states, 1447 visible links, 149 visible buttons, all seven public lead forms, two form error probes, 39 Detroit Dynamo route states, and 16 admin module detail states.

Build note: Vite still reports the existing large chunk warning. The build completed successfully.

## Still Gated

These remain intentionally blocked until owner/external confirmation:
- Live payment products, package pricing, refunds, and checkout enablement.
- Waiver/legal signature workflow.
- League membership claims and senior/youth competition claims.
- Facility, staff, roster, sponsor logo, testimonial, media, and fixture proof.
- Production domain/email confirmation for Detroit Dynamo addresses and canonical URLs.
- Final Vercel deployment evidence, rollback target, sitemap/redirect publication, and owner signoff.
