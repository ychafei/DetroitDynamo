# AGENTS.md

## Project Context
This repository powers LCTrainings.com, the current website for LC Training. The owner is exploring a future rebrand into Detroit Dynamo / Detroit Dynamo Training / Detroit Dynamo FC.

## Current Priority
Add rebrand-preview functionality without replacing the existing LC Training website.

## Non-Negotiables
- Do not delete current pages, content, styles, routes, forms, or booking flows.
- Do not replace the homepage yet.
- Do not globally rename LC Training to Detroit Dynamo.
- Do not break existing SEO, navigation, booking, contact, or forms.
- Keep rebrand preview code isolated and easy to remove or promote later.
- Prefer new components, new route, scoped styles, and local assets.

## Design Direction
Detroit Dynamo should feel professional, modern, premium, athletic, competitive, and scalable.
Visual identity direction:
- Interlocking DD monogram
- Electric blue lightning slash
- Deep navy / black background
- Metallic silver / white typography
- Clean pro soccer club feel
- Strong Detroit energy without cliches

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
- Existing LC Training site still works.
- New Detroit Dynamo preview route works.
- Preview can be accessed from a subtle link/button.
- Preview looks premium on desktop and mobile.
- No console/build/lint errors are introduced.
- Summary documentation is created.
