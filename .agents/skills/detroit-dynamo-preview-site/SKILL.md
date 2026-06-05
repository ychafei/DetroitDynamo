---
name: detroit-dynamo-preview-site
description: Use this skill when building or modifying the full Detroit Dynamo preview website, layout, pages, components, styling, brand system, or comparison flow for the LC Training / Les Chèvres rebrand.
---

# Detroit Dynamo Preview Site

## Purpose
Build and maintain a full parallel Detroit Dynamo preview site for LCTrainings.com without replacing or damaging the current LC Training / Les Chèvres site.

## Core Rules
- Preserve the existing LC Training / Les Chèvres site, routes, booking, auth, blog, teams, forms, and navigation.
- Never let the old header, footer, goat logo, LC Training footer, Les Chèvres wordmark, or gold/black shell leak into Detroit Dynamo routes.
- `/detroit-dynamo` and `/detroit-dynamo/*` must use a Detroit Dynamo-specific layout, header, footer, and navigation.
- Keep Detroit Dynamo code isolated and easy to promote or remove later.

## Visual Identity
- Use the approved Detroit Dynamo logo/monogram asset when present.
- Brand language: interlocking DD monogram, electric blue slash, silver/white typography, deep navy/black foundation.
- Make the experience feel premium, professional, modern, athletic, serious, and scalable.
- Avoid generic esports styling, mascots, skyline cliches, random third-party logos, and over-busy soccer imagery.

## Visual Quality Bar
The Detroit Dynamo preview must not look like a generic AI landing page.
Avoid:
- Oversized fake logo cards
- Generic gradient hero layouts
- Empty sections with only buzzwords
- Repetitive glass cards
- Random glowing lines without purpose
- Overuse of all-caps letter spacing
- Placeholder-looking sports copy
- Esports-style clutter
- Stock-template section structure

Prefer:
- Real approved Detroit Dynamo logo asset
- Editorial sports-club storytelling
- Premium dark interface
- Strong but restrained electric blue accents
- Realistic kit/apparel/digital preview modules
- Layered sections with depth, rhythm, and purpose
- Clean typography hierarchy
- Content that feels like a real professional soccer organization
- Strong mobile layout
- Specific soccer training and club pathway language

## Required Pages
- Home
- Training
- FC / club pathway
- Academy / development
- Booking preview
- Brand / kits / digital identity
- About

## Implementation Expectations
- Inspect the framework and routing before editing.
- Follow existing repo conventions, using React Router and Tailwind patterns in this app.
- Prefer isolated Detroit Dynamo layout/components/assets.
- Add accessible nav labels, link text, and image alt text.
- Run lint, build, and tests if available.
- Document changes, verification results, known issues, and next steps.
