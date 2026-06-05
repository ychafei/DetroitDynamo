# Detroit Dynamo Admin Module Read Handoff

Generated: 2026-05-29T14:14:32.028Z

`detroitDynamoAdminModuleRead` is the authenticated Appwrite Function planned for protected admin module reads once the Detroit Dynamo `dd_*` collections exist. It keeps read access server-side, role-gated, and scoped to the requested module collections.

The caller may request an `actor_role`, but the function must verify it against an active `dd_admin_role_assignments` grant for the authenticated Appwrite user before returning records.

Execution: `users` only. Default limit: 25.

## Supported Modules

| Module | Slug | Collections | Owner Roles |
| --- | --- | --- | --- |
| Players | players | dd_players, dd_tryout_registrations, dd_teams, dd_waivers | Registrar, Club Director |
| Parents/guardians | parents-guardians | dd_parent_guardians, dd_players, dd_waivers | Registrar |
| Coaches | coaches | dd_coaches, dd_staff_members, dd_teams, dd_programs | Training Director, Club Director |
| Teams | teams | dd_teams, dd_players, dd_coaches, dd_staff_members | Club Director, Team Manager, Registrar |
| Age groups | age-groups | dd_teams, dd_programs, dd_players | Club Director, Registrar |
| Training programs | training-programs | dd_programs, dd_training_packages, dd_camps_clinics | Training Director |
| Training bookings | training-bookings | dd_bookings, dd_training_sessions, dd_training_packages, dd_contact_leads | Training Director, Coach |
| Tryout registrations | tryout-registrations | dd_tryout_registrations, dd_players, dd_teams, dd_parent_guardians | Registrar, Club Director |
| Camp registrations | camp-registrations | dd_camps_clinics, dd_players, dd_parent_guardians, dd_waivers | Training Director, Registrar |
| Payments/packages | payments-packages | dd_payments, dd_training_packages, dd_camps_clinics, dd_sponsors | Master Admin, Training Director |
| Waivers/forms | waivers-forms | dd_waivers, dd_players, dd_parent_guardians, dd_camps_clinics | Registrar, Master Admin |
| News posts | news-posts | dd_news_posts, dd_staff_members, dd_sponsors, dd_match_results | Media/Admin Staff, Club Director |
| Sponsors | sponsors | dd_sponsors, dd_contact_leads, dd_news_posts | Media/Admin Staff, Club Director |
| Schedules/results | schedules-results | dd_match_fixtures, dd_match_results, dd_teams, dd_news_posts | Team Manager, Club Director |
| Contact leads | contact-leads | dd_contact_leads, dd_bookings, dd_tryout_registrations, dd_sponsors | Media/Admin Staff, Training Director, Registrar |
| Website content sections | website-content-sections | dd_news_posts, dd_staff_members, dd_sponsors, dd_programs | Media/Admin Staff, Club Director |

## Success Fixtures

| Fixture | Module | Collection | Actor Role | Role Grant | Expected Result |
| --- | --- | --- | --- | --- | --- |
| Registrar player pipeline read | Players | dd_players | Registrar | active dd_admin_role_assignments document id | Up to 25 sanitized documents |
| Training director booking queue read | Training bookings | dd_bookings | Training Director | active dd_admin_role_assignments document id | Up to 25 sanitized documents |
| Media admin sponsor read | Sponsors | dd_sponsors | Media/Admin Staff | active dd_admin_role_assignments document id | Up to 25 sanitized documents |
| Club director team read | Teams | dd_teams | Club Director | active dd_admin_role_assignments document id | Up to 25 sanitized documents |
| Team manager fixture read | Schedules/results | dd_match_fixtures | Team Manager | active dd_admin_role_assignments document id | Up to 25 sanitized documents |
| Master admin payment readiness read | Payments/packages | dd_payments | Master Admin | active dd_admin_role_assignments document id | Up to 25 sanitized documents |

## Rejection Fixtures

| Fixture | Expected Status | Error | Reason |
| --- | --- | --- | --- |
| Reject unauthenticated module read | 401 | Detroit Dynamo admin module read requires an authenticated Appwrite user. | Protected admin data must only be read from an authenticated Appwrite user session. |
| Reject unknown module | 404 | Detroit Dynamo admin module was not found. | The request must target one of the planned protected Detroit Dynamo admin modules. |
| Reject coach payment read | 403 | Actor role does not have view access to this Detroit Dynamo admin module. | Coaches cannot view payment or package administration records. |
| Reject unassigned role | 403 | Actor role is not assigned to this authenticated Appwrite user. | A caller cannot self-assert a valid role unless dd_admin_role_assignments has an active grant for that Appwrite user. |
| Reject collection outside module | 400 | collection_id must belong to the requested Detroit Dynamo admin module. | A module read cannot use the Sponsors permission surface to read unrelated player records. |

## Authenticated Invoke Shape

The live admin should invoke the Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code, and do not treat client-supplied roles as trusted unless the function confirms an active role assignment.

```json
{
  "module_slug": "players",
  "collection_id": "dd_players",
  "actor_role": "Registrar",
  "limit": 25,
  "cursor": ""
}
```

## Deployment Check

Run `npm run verify:dynamo-admin-module-read` before and after deploying the function. The script validates module coverage, collection scoping, role access, and rejection fixtures without making network calls.
