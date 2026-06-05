# AGENTS.md

## Project Context
This repository now promotes the former LC Training site into Detroit Dynamo / Detroit Dynamo Training / Detroit Dynamo FC.

## Current Priority
Keep Detroit Dynamo as the primary public brand and remove old LC Training / Les Chèvres public design remnants without breaking the working booking, auth, admin, payment, email, legal, or data flows.

## Non-Negotiables
- Do not destructively delete working booking, auth, payment, email, admin, coach, client, or legal functionality.
- The homepage and public shell should use Detroit Dynamo branding.
- Public metadata, favicon, manifest, navigation, footer, and CTAs should use Detroit Dynamo.
- Do not break existing SEO, navigation, booking, contact, or forms.
- Keep launch-gated admin/backend/payment/waiver/league work explicit until real approvals are confirmed.
- Prefer Detroit Dynamo components, route redirects, scoped styles, and local assets.
- `/detroit-dynamo` and `/detroit-dynamo/*` routes must keep their own header, footer, navigation, and layout.
- Do not use the goat logo, Les Chèvres wordmark, LC Training footer, old gold/black shell, or legacy navigation in the public experience.
- Do not break booking, sign in, sign up, blog, teams, or existing navigation.

## Design Direction
Detroit Dynamo should feel professional, modern, premium, athletic, competitive, and scalable.
Visual identity direction:
- Interlocking DD monogram
- Electric blue lightning slash
- Deep navy / black background
- Metallic silver / white typography
- Clean pro soccer club feel
- Strong Detroit energy without cliches

## Detroit Dynamo Public Site
- Detroit Dynamo is the primary public experience.
- Required routes include home, training, youth club, senior men, senior women, tryouts, teams, schedule/results, camps/clinics, sponsors, contact, brand/kits/digital identity, and about.
- Legacy public routes may remain registered for compatibility, but they should redirect into the Detroit Dynamo experience or render Detroit Dynamo-branded functionality.
- Do not falsely claim league memberships, facilities, rosters, sponsors, or payments/waivers until they are confirmed.

## Engineering Expectations
- First inspect the framework and repo structure.
- Follow existing conventions.
- Use TypeScript if the repo already uses TypeScript.
- Use Tailwind if the repo already uses Tailwind.
- Use CSS modules or scoped CSS if that is the project pattern.
- Avoid unnecessary dependencies.
- Keep components reusable and organized.
- Add alt text and accessible button/link labels.
- Make the preview fully responsive.

## Verification
Before finishing:
- Run install only if necessary.
- Run lint if available.
- Run build if available.
- Run tests if available.
- Fix errors introduced by this work.
- Provide exact commands run and results.

## Definition of Done
The work is done when:
- Working booking/auth/admin functionality still works.
- Detroit Dynamo is the global public brand.
- Legacy public design routes redirect or render Detroit Dynamo-branded screens.
- Detroit Dynamo looks premium on desktop and mobile.
- No console/build/lint errors are introduced.
- Summary documentation is created.
