# Detroit Dynamo Admin Module Registry

Generated: 2026-05-29T14:14:32.242Z

This registry maps the future dashboard modules to owners, Appwrite collections, public source routes, first admin actions, and blockers. It is the module-by-module build guide for the live admin dashboard.

## Players

Status: intake_ready_after_backend

Protected detail route: /admin/detroit-dynamo/modules/players

Launch phase: Phase 5

Owners: Registrar, Club Director

Collections: dd_players, dd_tryout_registrations, dd_teams, dd_waivers

Source routes: /detroit-dynamo/tryouts, /detroit-dynamo/youth-club

Track player profiles from training leads, youth club interest, tryouts, rosters, waivers, and future team placement.

First actions:
- Review player leads
- Assign status
- Connect guardians
- Prepare roster eligibility

Blocked until: Appwrite dd_players is provisioned and registrar workflows are approved.

## Parents/guardians

Status: intake_ready_after_backend

Protected detail route: /admin/detroit-dynamo/modules/parents-guardians

Launch phase: Phase 5

Owners: Registrar

Collections: dd_parent_guardians, dd_players, dd_waivers

Source routes: /detroit-dynamo/tryouts, /detroit-dynamo/youth-club

Manage guardian contact, consent relationships, communication preferences, and minor-player family context.

First actions:
- Review guardian records
- Connect players
- Track consent readiness
- Route family communication

Blocked until: Guardian consent language and privacy rules are approved.

## Coaches

Status: admin_dashboard_needed

Protected detail route: /admin/detroit-dynamo/modules/coaches

Launch phase: Phase 5

Owners: Training Director, Club Director

Collections: dd_coaches, dd_staff_members, dd_teams, dd_programs

Source routes: /detroit-dynamo/about, /detroit-dynamo/training

Maintain coaching staff, specialties, licenses, background-check status, assignments, and public staff visibility.

First actions:
- Create coach profiles
- Assign programs
- Assign teams
- Review background-check status

Blocked until: Staff facts, safeguarding process, and public bios are approved.

## Teams

Status: admin_dashboard_needed

Protected detail route: /admin/detroit-dynamo/modules/teams

Launch phase: Phase 5

Owners: Club Director, Team Manager, Registrar

Collections: dd_teams, dd_players, dd_coaches, dd_staff_members

Source routes: /detroit-dynamo/teams, /detroit-dynamo/senior-men, /detroit-dynamo/senior-women

Create youth, senior men, senior women, and pathway team records with coaches, managers, rosters, and tryout status.

First actions:
- Create team shells
- Assign coaches
- Assign managers
- Prepare roster cards

Blocked until: Team naming, roster policy, and competition/facility facts are approved.

## Age groups

Status: admin_dashboard_needed

Protected detail route: /admin/detroit-dynamo/modules/age-groups

Launch phase: Phase 5

Owners: Club Director, Registrar

Collections: dd_teams, dd_programs, dd_players

Source routes: /detroit-dynamo/youth-club, /detroit-dynamo/academy

Manage birth-year cohorts, U7-U8 foundation, U9-U12 pre-academy, and U13-U19 competitive pathway structure.

First actions:
- Define age-group cohorts
- Map players by birth year
- Publish pathway language
- Review capacity

Blocked until: Youth club development roadmap and tryout structure are approved.

## Training programs

Status: admin_dashboard_needed

Protected detail route: /admin/detroit-dynamo/modules/training-programs

Launch phase: Phase 5

Owners: Training Director

Collections: dd_programs, dd_training_packages, dd_camps_clinics

Source routes: /detroit-dynamo/training, /detroit-dynamo/camps-clinics

Manage private training, small groups, team training, tryout prep, position work, camps, and clinic program definitions.

First actions:
- Create programs
- Draft package options
- Set public visibility
- Connect booking CTAs

Blocked until: Program pricing, capacity, location, and coach assignment rules are approved.

## Training bookings

Status: intake_ready_after_backend

Protected detail route: /admin/detroit-dynamo/modules/training-bookings

Launch phase: Phase 4

Owners: Training Director, Coach

Collections: dd_bookings, dd_training_sessions, dd_training_packages, dd_contact_leads

Source routes: /detroit-dynamo/book, /detroit-dynamo/training

Route training inquiries into booking leads, coach availability review, session planning, and payment handoff.

First actions:
- Review booking leads
- Assign coach follow-up
- Capture requested focus
- Prepare session records

Blocked until: Appwrite dd_bookings is provisioned and live booking/payment policy is approved.

## Tryout registrations

Status: intake_ready_after_backend

Protected detail route: /admin/detroit-dynamo/modules/tryout-registrations

Launch phase: Phase 4

Owners: Registrar, Club Director

Collections: dd_tryout_registrations, dd_players, dd_teams, dd_parent_guardians

Source routes: /detroit-dynamo/tryouts, /detroit-dynamo/senior-men, /detroit-dynamo/senior-women

Manage youth, senior men, senior women, and training evaluation registrations from public interest forms.

First actions:
- Review registrations
- Set status
- Route by pathway
- Prepare invite/waitlist decisions

Blocked until: Appwrite intake is deployed and tryout operating dates are approved.

## Camp registrations

Status: admin_dashboard_needed

Protected detail route: /admin/detroit-dynamo/modules/camp-registrations

Launch phase: Phase 5

Owners: Training Director, Registrar

Collections: dd_camps_clinics, dd_players, dd_parent_guardians, dd_waivers

Source routes: /detroit-dynamo/camps-clinics

Manage camp and clinic interest, capacity, waitlists, age ranges, dates, locations, and participant readiness.

First actions:
- Create camp shells
- Track interest
- Manage capacity
- Confirm waiver readiness

Blocked until: Camp dates, facilities, pricing, and waiver rules are approved.

## Payments/packages

Status: external_gate

Protected detail route: /admin/detroit-dynamo/modules/payments-packages

Launch phase: Phase 5

Owners: Master Admin, Training Director

Collections: dd_payments, dd_training_packages, dd_camps_clinics, dd_sponsors

Source routes: /detroit-dynamo/training, /detroit-dynamo/sponsors

Manage training packages, camp pricing, team fees, sponsor packages, payment references, refunds, and checkout readiness.

First actions:
- Draft packages
- Map provider products
- Review payment status
- Prepare refund rules

Blocked until: Stripe/PayPal products, exact prices, refund terms, and owner approval are confirmed.

## Waivers/forms

Status: external_gate

Protected detail route: /admin/detroit-dynamo/modules/waivers-forms

Launch phase: Phase 5

Owners: Registrar, Master Admin

Collections: dd_waivers, dd_players, dd_parent_guardians, dd_camps_clinics

Source routes: /detroit-dynamo/tryouts, /detroit-dynamo/camps-clinics

Manage training, tryout, camp, youth club, media, medical, travel, and adult participation waiver readiness.

First actions:
- Draft waiver versions
- Track signature status
- Review expirations
- Gate participation readiness

Blocked until: Legal waiver text and consent workflow are approved.

## News posts

Status: admin_dashboard_needed

Protected detail route: /admin/detroit-dynamo/modules/news-posts

Launch phase: Phase 5

Owners: Media/Admin Staff, Club Director

Collections: dd_news_posts, dd_staff_members, dd_sponsors, dd_match_results

Source routes: /detroit-dynamo, /detroit-dynamo/about

Draft, review, approve, and publish club announcements, tryouts, camps, staff news, sponsors, rosters, and match recaps.

First actions:
- Draft posts
- Approve claims
- Schedule publication
- Archive old posts

Blocked until: Content approval workflow and media-release rules are approved.

## Sponsors

Status: intake_ready_after_backend

Protected detail route: /admin/detroit-dynamo/modules/sponsors

Launch phase: Phase 4

Owners: Media/Admin Staff, Club Director

Collections: dd_sponsors, dd_contact_leads, dd_news_posts

Source routes: /detroit-dynamo/sponsors

Track sponsor leads, packages, logo assets, website placements, approvals, and local business partnership follow-up.

First actions:
- Review sponsor leads
- Track package interest
- Approve logos
- Prepare partnership content

Blocked until: Sponsor packages, logo permissions, and publication rules are approved.

## Schedules/results

Status: external_gate

Protected detail route: /admin/detroit-dynamo/modules/schedules-results

Launch phase: Phase 5

Owners: Team Manager, Club Director

Collections: dd_match_fixtures, dd_match_results, dd_teams, dd_news_posts

Source routes: /detroit-dynamo/schedule-results, /detroit-dynamo/results

Manage fixtures, venues, competition labels, results, recaps, and team schedule publication readiness.

First actions:
- Create fixture drafts
- Confirm venues
- Publish results
- Connect recaps

Blocked until: Teams, competitions, opponents, facilities, and schedules are confirmed.

## Contact leads

Status: intake_ready_after_backend

Protected detail route: /admin/detroit-dynamo/modules/contact-leads

Launch phase: Phase 4

Owners: Media/Admin Staff, Training Director, Registrar

Collections: dd_contact_leads, dd_bookings, dd_tryout_registrations, dd_sponsors

Source routes: /detroit-dynamo/contact, /detroit-dynamo/book

Triage general, training, youth, senior-team, camp, sponsor, and operational inquiries into owner queues.

First actions:
- Review leads
- Assign owner
- Set status
- Export follow-up queue

Blocked until: Appwrite intake is deployed and admin notification/follow-up workflow is approved.

## Website content sections

Status: external_gate

Protected detail route: /admin/detroit-dynamo/modules/website-content-sections

Launch phase: Phase 5

Owners: Media/Admin Staff, Club Director

Collections: dd_news_posts, dd_staff_members, dd_sponsors, dd_programs

Source routes: /detroit-dynamo, /detroit-dynamo/brand, /detroit-dynamo/about

Manage approved brand copy, pathway sections, proof slots, staff modules, sponsor placements, and launch metadata.

First actions:
- Draft content sections
- Approve launch copy
- Update proof slots
- Prepare sitemap/redirect promotion

Blocked until: Owner approves final brand launch, SEO, redirects, public claims, and noindex removal.
