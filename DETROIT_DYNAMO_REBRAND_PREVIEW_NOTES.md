# Detroit Dynamo Rebrand Preview Notes

## Summary
- Added a non-destructive Detroit Dynamo rebrand preview at `/detroit-dynamo-preview`.
- Preserved the current LC Training homepage, booking flow, forms, routes, and brand copy.
- Added isolated rebrand components under `src/components/rebrand/`.
- Added a temporary local SVG monogram asset under `public/detroit-dynamo/`.
- Added subtle preview access from the public nav and footer.
- Added client-side `noindex,nofollow` robots metadata for the preview route.
- Added root `AGENTS.md` and an optional Codex skill for future Detroit Dynamo preview work.

## Route
- Preview route: `/detroit-dynamo-preview`
- Local dev URL: `http://127.0.0.1:5173/detroit-dynamo-preview`

## Asset Notes
- No approved Detroit Dynamo logo asset was present in the repo.
- Created `public/detroit-dynamo/dd-monogram-placeholder.svg` as a temporary placeholder.
- Swap this file for the final approved Detroit Dynamo logo when available.

## Implementation Notes
- The preview uses the existing Vite + React Router + Tailwind setup.
- The preview keeps CTAs connected to current LC Training routes:
  - `/book`
  - `/lcfc/tryouts`
- The preview intentionally does not alter the production homepage, manifest, sitemap, global SEO, booking logic, or legal pages.
- Because this is a Vite SPA, noindex/nofollow is applied client-side when the preview route mounts.

## Verification
- `npm run lint`
  - Initial run failed on two unrelated unused imports in clean files.
  - Removed unused imports from:
    - `src/components/coach/WeeklyAvailabilityEditor.jsx`
    - `src/components/guards/RouteGuards.jsx`
  - Final run passed.
- `npm run build`
  - Passed.
  - Vite reported the existing large bundle chunk warning.
- `npm run typecheck`
  - Failed with existing repo-wide JS/React typing issues.
  - Filtered typecheck output showed no errors for:
    - `src/App.jsx`
    - `src/components/rebrand/DetroitDynamoPreview.jsx`
    - `src/pages/DetroitDynamoPreview.jsx`
    - `src/components/layout/Navbar.jsx`
    - `src/components/layout/Footer.jsx`
- `curl -I http://127.0.0.1:5173/detroit-dynamo-preview`
  - Returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5173/detroit-dynamo/dd-monogram-placeholder.svg`
  - Returned `HTTP/1.1 200 OK`.
- `git diff --check`
  - Passed.
- Tests
  - No test script is defined in `package.json`.

## Known Issues / Assumptions
- The repo had several uncommitted changes before this work began; those were preserved and should be reviewed separately.
- The Detroit Dynamo logo is a placeholder, not final brand artwork.
- Typecheck is not currently clean for the repository as a whole.
- Preview route noindex is client-side only unless the app later gets route-level server metadata.

## Recommended Next Steps
1. Review the preview visually with the owner on desktop and mobile.
2. Replace the placeholder monogram with approved vector/logo files.
3. Finalize naming hierarchy: Detroit Dynamo, Detroit Dynamo Training, and Detroit Dynamo FC.
4. Decide which modules should graduate from preview into the live LC Training site.
5. Address repo-wide typecheck debt separately from the rebrand preview branch.
