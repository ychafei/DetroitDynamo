# Detroit Dynamo Full Preview Notes

Current update, 2026-06-05: these notes are historical from the parallel-preview phase. Detroit Dynamo is now promoted as the primary public brand; use `DETROIT_DYNAMO_PROMOTION_SUMMARY.md` as the current status document.

## Current Status
- `/detroit-dynamo` remains the approved training-first homepage direction.
- Detroit Dynamo routes use their own independent header, footer, navigation, styling, and metadata behavior.
- The current LC Training / Les Chevres site remains separate and unchanged by this pass.
- The old Les Chevres / goat shell does not appear inside Detroit Dynamo route files.

## Favicon / Browser Tab Icon
- Added `public/detroit-dynamo/favicon.svg`.
- The favicon is a simplified transparent DD/lightning SVG mark, not the full stacked logo and not a dark square tile.
- Added `src/components/detroit-dynamo/useDetroitDynamoMeta.js`.
- Wired the meta hook into `DetroitDynamoLayout` so `/detroit-dynamo` and `/detroit-dynamo/*` set:
  - `document.title`
  - `link[rel="icon"]`
  - `link[rel="shortcut icon"]`
  - `link[rel="apple-touch-icon"]`
  - `meta[name="robots"]` as `noindex,nofollow`
- Dynamo icon href uses `/detroit-dynamo/favicon.svg?v=1` to avoid stale browser cache.
- Existing current-site favicon/title behavior is restored when leaving the Detroit Dynamo layout.

## Routes Completed
- `/detroit-dynamo` - approved homepage.
- `/detroit-dynamo/training` - training/programs page.
- `/detroit-dynamo/fc` - future FC pathway page.
- `/detroit-dynamo/academy` - player development / academy page.
- `/detroit-dynamo/book` - booking-preview page that hands off to the current `/book` flow.
- `/detroit-dynamo/results` - player outcomes/results page without fake testimonials or fake stats.
- `/detroit-dynamo/about` - story/trust/rebrand rationale page.
- `/detroit-dynamo/brand` - retained as internal brand preview, not part of the primary public path.

## Navigation / Footer
- Header navigation now uses real pages:
  - Home: `/detroit-dynamo`
  - Training: `/detroit-dynamo/training`
  - FC: `/detroit-dynamo/fc`
  - Academy: `/detroit-dynamo/academy`
  - Book: `/detroit-dynamo/book`
  - Results: `/detroit-dynamo/results`
  - About: `/detroit-dynamo/about`
- Header still includes `Current Site` and `Book Training`.
- Footer links now focus on Training, Academy, FC, Results, Book Training, Current Site, and About.
- `/detroit-dynamo/brand` remains available only through a subtle `Internal Brand Preview` footer link.

## Files Created
- `public/detroit-dynamo/favicon.svg`
- `src/components/detroit-dynamo/useDetroitDynamoMeta.js`
- `src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx`
- `artifacts/detroit-dynamo/training-desktop.png`
- `artifacts/detroit-dynamo/fc-desktop.png`
- `artifacts/detroit-dynamo/academy-desktop.png`
- `artifacts/detroit-dynamo/book-desktop.png`
- `artifacts/detroit-dynamo/results-desktop.png`
- `artifacts/detroit-dynamo/about-desktop.png`
- `artifacts/detroit-dynamo/mobile-homepage.png`

## Files Modified
- `src/App.jsx`
- `src/components/detroit-dynamo/DetroitDynamoLayout.jsx`
- `src/components/detroit-dynamo/DetroitDynamoHeader.jsx`
- `src/components/detroit-dynamo/DetroitDynamoFooter.jsx`
- `src/pages/detroit-dynamo/DetroitDynamoHome.jsx`
- `src/pages/detroit-dynamo/DetroitDynamoBrand.jsx`
- `DETROIT_DYNAMO_FULL_PREVIEW_NOTES.md`
- `artifacts/detroit-dynamo/homepage-desktop.png`
- `artifacts/detroit-dynamo/brand-desktop.png`

## Commands Run
- `npm run lint` - passed.
- `npm run build` - passed; Vite still reports the existing large chunk warning.
- `git diff --check` - passed.
- Route check loop for:
  - `/detroit-dynamo`
  - `/detroit-dynamo/training`
  - `/detroit-dynamo/fc`
  - `/detroit-dynamo/academy`
  - `/detroit-dynamo/book`
  - `/detroit-dynamo/results`
  - `/detroit-dynamo/about`
  - `/detroit-dynamo/brand`
  All returned `200`.
- Static scan:
  - `rg -n "LES CHÈVRES|Les Chèvres|LC TRAINING|goat|PublicLayout|old favicon|logo\\.png|/logo\\.png|favicon\\.ico" src/components/detroit-dynamo src/pages/detroit-dynamo public/detroit-dynamo`
  - No matches.

## Screenshot Paths
- `artifacts/detroit-dynamo/homepage-desktop.png`
- `artifacts/detroit-dynamo/training-desktop.png`
- `artifacts/detroit-dynamo/fc-desktop.png`
- `artifacts/detroit-dynamo/academy-desktop.png`
- `artifacts/detroit-dynamo/book-desktop.png`
- `artifacts/detroit-dynamo/results-desktop.png`
- `artifacts/detroit-dynamo/about-desktop.png`
- `artifacts/detroit-dynamo/mobile-homepage.png`
- `artifacts/detroit-dynamo/brand-desktop.png`

## Remaining Issues / Follow-Up
- The header/footer DD mark and favicon are clean temporary transparent SVG marks. Replace them later with final exported transparent Detroit Dynamo SVG assets when available.
- `/detroit-dynamo/brand` remains an internal review page and should not be promoted in the public visitor journey.
- Earlier preview-site passes kept the current LC Training / Les Chevres site untouched; the later current-site theme pass below intentionally applies Detroit Dynamo styling to that shell.

## Current Site Detroit Dynamo Theme Pass
- Transformed the current public site shell to the Detroit Dynamo visual system while preserving the existing route/layout structure.
- Updated global design tokens from the old black/gold palette to deep navy, electric blue, silver, and white.
- Replaced the old goat/shield brand mark in the public navbar, footer, homepage hero watermark, login card, team hero, and LCFC/team shared UI with the clean Detroit Dynamo DD mark.
- Updated the browser title/favicon/manifest for the themed current-site experience.
- Updated obvious public-facing LC Training / LCFC / Les Chevres labels to Detroit Dynamo / Detroit Dynamo Training / Detroit Dynamo FC where they appear in visitor-facing pages, onboarding, booking, matching, and team sections.
- Kept the existing page hierarchy, booking routes, auth routes, team routes, forms, and admin route structure intact.

## Current Site Theme Files Modified
- `src/index.css`
- `src/lib/brand.js`
- `index.html`
- `public/manifest.json`
- `src/components/layout/Navbar.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/landing/HeroSection.jsx`
- `src/components/landing/ParentTestimonials.jsx`
- `src/components/landing/CTABanner.jsx`
- `src/components/team/TeamPageShell.jsx`
- `src/components/lcfc/LcfcKit.jsx`
- `src/pages/About.jsx`
- `src/pages/Team.jsx`
- `src/pages/Lcfc.jsx`
- `src/pages/Login.jsx`
- `src/pages/Book.jsx`
- `src/pages/Terms.jsx`
- `src/pages/Matching.jsx`
- `src/pages/ParentConsent.jsx`
- `src/pages/Dashboard.jsx`
- Team, LCFC, apply, admin, and coach page label/color polish files.

## Current Site Theme Verification
- `npm run lint` - passed.
- `npm run build` - passed; Vite still reports the existing large chunk warning.
- `git diff --check` - passed after removing two trailing spaces.
- Local route checks returned `200` for:
  - `/`
  - `/book`
  - `/about`
  - `/lcfc`
  - `/detroit-dynamo`

## Current Site Theme Remaining Notes
- The old `/detroit-dynamo` preview still intentionally mentions LC Training in context where it explains the preview/migration relationship.
- Route paths such as `/lcfc` and `/admin/lcfc` remain unchanged for compatibility even though the visible labels now read Detroit Dynamo FC.

## Detroit Dynamo Homepage Current-Site Sections Pass
- Added Dynamo-styled versions of the current homepage business sections into `/detroit-dynamo`.
- New `/detroit-dynamo` sections:
  - County selector for Oakland, Macomb, and Wayne.
  - Live coach showcase using active coaches from `coachRepo`.
  - Live training packages using visible packages from `pricingPackageRepo`.
  - Parent testimonial/proof section using Detroit Dynamo copy.
- These sections use the Detroit Dynamo dark navy, electric blue, silver/white visual system instead of the old gold/black styling.
- County and package CTAs continue into the existing booking flow so the current booking system remains intact.
- Coach cards link to the existing public coach profile routes.

## Detroit Dynamo Homepage Sections Verification
- `npm run lint` - passed.
- `npm run build` - passed; Vite still reports the existing large chunk warning.
- `git diff --check` - passed.
- Local route check returned `200` for `/detroit-dynamo`.
