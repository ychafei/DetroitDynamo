# Detroit Dynamo Role Permission Matrix

Generated: 2026-05-29T14:14:32.240Z

This matrix is the planning source for future dashboard permissions. It separates payment, waiver, roster, sponsor, media, team, registrar, coach, and launch controls before the full admin dashboard is built.

## Master Admin

Owns platform setup, payment/provider configuration, database provisioning, launch gates, and final promotion controls.

Sensitive controls: Payment provider keys, Appwrite provisioning, Function deployment, SEO/redirect launch approval

Control modules: 16

| Module | Access | Scope |
| --- | --- | --- |
| Players | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Parents/guardians | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Coaches | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Teams | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Age groups | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Training programs | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Training bookings | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Tryout registrations | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Camp registrations | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Payments/packages | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Waivers/forms | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| News posts | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Sponsors | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Schedules/results | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Contact leads | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |
| Website content sections | admin | Full administrative access for setup, launch approval, data correction, and emergency operations. |

## Club Director

Owns club strategy, pathway standards, teams, staff structure, facilities, competition facts, and sponsor approvals.

Sensitive controls: League/facility claims, Staff/roster publication, Sponsor approvals

Control modules: 8

| Module | Access | Scope |
| --- | --- | --- |
| Players | view | Review player pipeline and roster readiness across programs. |
| Parents/guardians | view | View family contact context when needed for club operations. |
| Coaches | manage | Approve staff structure, public staff profiles, and coaching assignments. |
| Teams | manage | Create and approve youth, senior men, senior women, and pathway team structures. |
| Age groups | manage | Define youth age-group roadmap and competitive pathway standards. |
| Training programs | view | Review training-to-club alignment and public positioning. |
| Training bookings | view | Review demand signals without editing coach-level session details. |
| Tryout registrations | manage | Oversee tryout windows, senior pathway interest, and team-placement decisions. |
| Camp registrations | view | Review camp demand and operational readiness. |
| Payments/packages | view | Review package and dues readiness without provider-key access. |
| Waivers/forms | view | Confirm waiver coverage before teams, camps, and tryouts launch. |
| News posts | approve | Approve club announcements, league wording, staff news, and launch communications. |
| Sponsors | approve | Approve sponsor packages, logo use, and partnership claims. |
| Schedules/results | manage | Approve fixtures, results, venues, and competition wording before publication. |
| Contact leads | view | Review strategic inquiries and route high-priority opportunities. |
| Website content sections | approve | Approve public brand, pathway, facility, league, and launch content. |

## Training Director

Owns training academy programs, coach assignments, training packages, camps, clinics, and booking operations.

Sensitive controls: Training package drafts, Camp/clinic registration readiness

Control modules: 4

| Module | Access | Scope |
| --- | --- | --- |
| Players | contribute | Update training context, focus areas, and development notes when connected to programs. |
| Parents/guardians | view | View guardian contacts needed for training coordination. |
| Coaches | contribute | Recommend coach assignments, specialties, and training capacity. |
| Teams | view | Review team needs that shape training programs. |
| Age groups | view | Use age-group roadmap when building academy and camp offerings. |
| Training programs | manage | Create and manage private, small-group, team-training, tryout-prep, camp, and clinic programs. |
| Training bookings | manage | Manage training inquiry flow, coach availability, and booking lifecycle. |
| Tryout registrations | view | Review evaluation demand and route players toward training or teams. |
| Camp registrations | manage | Manage camp/clinic interest, capacity, dates, and training focus. |
| Payments/packages | contribute | Propose packages and pricing for owner/payment approval. |
| Waivers/forms | view | Confirm training and camp waiver coverage before sessions run. |
| News posts | contribute | Draft training, camp, and clinic announcements. |
| Sponsors | view | Review training sponsor inventory and activation fit. |
| Schedules/results | view | Review training/event calendars that affect team operations. |
| Contact leads | manage | Own training, camp, clinic, and evaluation lead routing. |
| Website content sections | contribute | Draft training academy and camp/clinic content. |

## Coach

Handles assigned player sessions, training notes, attendance context, and development feedback without broad admin control.

Sensitive controls: Assigned-player privacy, Youth safeguarding boundaries

Control modules: 0

| Module | Access | Scope |
| --- | --- | --- |
| Players | view | View assigned players and relevant training context. |
| Parents/guardians | view | View guardian contact context for assigned training sessions only. |
| Coaches | view | View coaching directory and staff context. |
| Teams | view | View assigned team or training group context. |
| Age groups | view | Reference age-group standards for session planning. |
| Training programs | view | View program structure and session focus expectations. |
| Training bookings | contribute | Update assigned session notes, attendance, and training outcomes. |
| Tryout registrations | view | View assigned evaluation context only. |
| Camp registrations | view | View assigned camp/clinic roster context. |
| Payments/packages | none | No payment or package administration. |
| Waivers/forms | view | Confirm waiver status for assigned players before activity. |
| News posts | none | No direct publication access. |
| Sponsors | none | No sponsor administration. |
| Schedules/results | view | View assigned schedule context. |
| Contact leads | none | No direct lead queue access. |
| Website content sections | none | No website content administration. |

## Team Manager

Coordinates team logistics, roster communications, schedules, results, and parent/team operations.

Sensitive controls: Assigned-team scope, Parent communication rules

Control modules: 1

| Module | Access | Scope |
| --- | --- | --- |
| Players | contribute | Update roster logistics and team assignment context for assigned teams. |
| Parents/guardians | contribute | Maintain guardian/team communication context for assigned teams. |
| Coaches | view | View assigned staff and coach contact context. |
| Teams | contribute | Maintain assigned team logistics, roster readiness, and manager notes. |
| Age groups | view | Reference age-group and team standards. |
| Training programs | view | Review program commitments that affect team calendars. |
| Training bookings | view | View team-training bookings for assigned teams. |
| Tryout registrations | view | Review assigned-team tryout and evaluation context. |
| Camp registrations | view | Review camp participation for assigned players where relevant. |
| Payments/packages | view | View team fee/payment status summaries without editing provider records. |
| Waivers/forms | view | Confirm waiver completion for assigned team activities. |
| News posts | contribute | Draft assigned-team updates, recaps, and announcements. |
| Sponsors | view | View sponsor placements relevant to team operations. |
| Schedules/results | manage | Manage assigned-team fixtures, results, venue details, and recap inputs. |
| Contact leads | view | View team-related inquiries routed by admin staff. |
| Website content sections | contribute | Draft assigned-team roster, schedule, and manager content. |

## Registrar

Owns player, guardian, tryout, waiver, camp registration, and eligibility records.

Sensitive controls: Minor data privacy, Guardian consent, Waiver status

Control modules: 6

| Module | Access | Scope |
| --- | --- | --- |
| Players | manage | Manage player records, age groups, roster eligibility, and status. |
| Parents/guardians | manage | Manage guardian contacts, relationships, and communication preferences. |
| Coaches | view | View coach/team assignments that affect registrations. |
| Teams | contribute | Update roster eligibility and registration status for teams. |
| Age groups | contribute | Maintain birth-year and age-group registration context. |
| Training programs | view | Review program requirements that affect player registration. |
| Training bookings | view | View booking context for player/guardian records. |
| Tryout registrations | manage | Own tryout intake, review status, invitations, waitlists, and archive flow. |
| Camp registrations | manage | Own camp/clinic registrations, capacity, waitlists, and participant records. |
| Payments/packages | view | View payment/package status needed for eligibility and registration. |
| Waivers/forms | manage | Own waiver versions, signature status, expirations, and form completeness. |
| News posts | none | No direct publication access. |
| Sponsors | none | No sponsor administration. |
| Schedules/results | view | View schedules that affect registration and waiver readiness. |
| Contact leads | manage | Own youth, tryout, camp, and registrar-routed contact leads. |
| Website content sections | view | Review registration language but do not publish site content. |

## Media/Admin Staff

Owns content workflow, sponsor/admin lead triage, media placeholders, news posts, and website section updates.

Sensitive controls: Media release approval, Sponsor asset permissions, No payment/waiver access

Control modules: 4

| Module | Access | Scope |
| --- | --- | --- |
| Players | view | View public-approved player context for stories only after release approval. |
| Parents/guardians | none | No guardian data access unless explicitly routed by registrar. |
| Coaches | view | View public staff profile details and media-approved coach content. |
| Teams | view | View public team structure, schedule context, and approved roster details. |
| Age groups | view | Reference age-group pathway language for content. |
| Training programs | view | Reference program structure for content and lead routing. |
| Training bookings | none | No booking administration. |
| Tryout registrations | view | View aggregate tryout interest for communications planning only. |
| Camp registrations | view | View aggregate camp interest for communications planning only. |
| Payments/packages | none | No payment administration. |
| Waivers/forms | none | No waiver administration. |
| News posts | manage | Create and manage approved announcements, news, recaps, and launch content. |
| Sponsors | manage | Manage sponsor leads, logos, web links, placements, and approved activation content. |
| Schedules/results | contribute | Draft schedule/result posts and media assets after team manager confirmation. |
| Contact leads | manage | Triage general, sponsor, content, and public inquiry leads. |
| Website content sections | manage | Manage approved website sections, proof slots, launch copy, and media placeholders. |
