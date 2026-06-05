# Detroit Dynamo Lead Pipeline Policy

Generated: 2026-05-29T14:14:32.253Z

This policy defines the preview-to-admin follow-up lifecycle for Detroit Dynamo leads. It gives the future Appwrite-backed dashboard status stages, aging targets, owner actions, and lead-type coverage.

| Status | Label | Max Age | Applies To | Next Statuses | Admin Modules |
| --- | --- | --- | --- | --- | --- |
| new | New intake | 4h | contact, training, youth, tryout, men, women, sponsor | triaged, closed_duplicate | Contact leads |
| triaged | Owner assigned | 24h | contact, training, youth, tryout, men, women, sponsor | contacted, closed_not_fit | Contact leads, Tryout registrations, Training bookings, Sponsors |
| contacted | First contact made | 48h | contact, training, youth, tryout, men, women, sponsor | awaiting_response, evaluation_scheduled, package_discussion, closed_not_fit | Contact leads, Training bookings, Tryout registrations, Sponsors |
| awaiting_response | Awaiting response | 96h | contact, training, youth, tryout, men, women, sponsor | contacted, evaluation_scheduled, closed_not_fit | Contact leads, Training bookings, Tryout registrations, Sponsors |
| package_discussion | Package discussion | 96h | training, sponsor, contact | evaluation_scheduled, converted, closed_not_fit | Training bookings, Sponsors, Payments/packages |
| evaluation_scheduled | Evaluation or meeting scheduled | 72h | training, youth, tryout, men, women, sponsor | invited_or_waitlisted, converted, closed_no_show | Training bookings, Tryout registrations, Sponsors, Players |
| invited_or_waitlisted | Decision pending | 120h | youth, tryout, men, women, training, sponsor | converted, closed_not_fit | Tryout registrations, Teams, Training bookings, Sponsors |
| converted | Converted to active record | 168h | contact, training, youth, tryout, men, women, sponsor | archived | Players, Training bookings, Tryout registrations, Teams, Sponsors, Payments/packages, Waivers/forms |
| closed_not_fit | Closed | 168h | contact, training, youth, tryout, men, women, sponsor | archived | Contact leads |
| closed_duplicate | Closed duplicate | 24h | contact, training, youth, tryout, men, women, sponsor | archived | Contact leads |
| closed_no_show | Closed no-show | 72h | training, youth, tryout, men, women, sponsor | archived, evaluation_scheduled | Training bookings, Tryout registrations, Sponsors |
| archived | Archived | 720h | contact, training, youth, tryout, men, women, sponsor | new | Contact leads |

## Lead Type Pipelines

| Lead Type | Owner | Default Status | Required Stages | Collections |
| --- | --- | --- | --- | --- |
| contact | Media/Admin Staff | new | new, triaged, contacted, awaiting_response, package_discussion, converted, closed_not_fit, closed_duplicate, archived | dd_contact_leads |
| training | Training Director | new | new, triaged, contacted, awaiting_response, package_discussion, evaluation_scheduled, invited_or_waitlisted, converted, closed_not_fit, closed_duplicate, closed_no_show, archived | dd_contact_leads, dd_bookings |
| youth | Registrar | new | new, triaged, contacted, awaiting_response, evaluation_scheduled, invited_or_waitlisted, converted, closed_not_fit, closed_duplicate, closed_no_show, archived | dd_players, dd_parent_guardians, dd_tryout_registrations |
| tryout | Registrar | new | new, triaged, contacted, awaiting_response, evaluation_scheduled, invited_or_waitlisted, converted, closed_not_fit, closed_duplicate, closed_no_show, archived | dd_players, dd_parent_guardians, dd_tryout_registrations |
| men | Club Director | new | new, triaged, contacted, awaiting_response, evaluation_scheduled, invited_or_waitlisted, converted, closed_not_fit, closed_duplicate, closed_no_show, archived | dd_players, dd_tryout_registrations, dd_teams |
| women | Club Director | new | new, triaged, contacted, awaiting_response, evaluation_scheduled, invited_or_waitlisted, converted, closed_not_fit, closed_duplicate, closed_no_show, archived | dd_players, dd_tryout_registrations, dd_teams |
| sponsor | Media/Admin Staff | new | new, triaged, contacted, awaiting_response, package_discussion, evaluation_scheduled, invited_or_waitlisted, converted, closed_not_fit, closed_duplicate, closed_no_show, archived | dd_sponsors, dd_contact_leads |
