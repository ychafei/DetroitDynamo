# Detroit Dynamo Lead Intake Handoff

Generated: 2026-05-29T14:14:32.025Z

`detroitDynamoLeadIntake` is the public Appwrite Function planned for Detroit Dynamo form submissions. These fixtures document the accepted public payloads, expected created records, and rejection cases before live credentials are used.

## Success Fixtures

| Fixture | Lead Type | Source Route | Created Records | Routing Collections |
| --- | --- | --- | --- | --- |
| General contact inquiry | contact | /detroit-dynamo/contact | ContactLead | dd_contact_leads |
| Training academy inquiry | training | /detroit-dynamo/training | ContactLead, Booking | dd_contact_leads, dd_bookings |
| Youth club pathway interest | youth | /detroit-dynamo/youth-club | ContactLead, Player, ParentGuardian, TryoutRegistration | dd_players, dd_parent_guardians, dd_tryout_registrations |
| Open tryout registration | tryout | /detroit-dynamo/tryouts | ContactLead, Player, ParentGuardian, TryoutRegistration | dd_players, dd_parent_guardians, dd_tryout_registrations |
| Senior men player interest | men | /detroit-dynamo/senior-men | ContactLead, Player, TryoutRegistration | dd_players, dd_tryout_registrations, dd_teams |
| Senior women player interest | women | /detroit-dynamo/senior-women | ContactLead, Player, TryoutRegistration | dd_players, dd_tryout_registrations, dd_teams |
| Sponsor partnership inquiry | sponsor | /detroit-dynamo/sponsors | ContactLead, Sponsor | dd_sponsors, dd_contact_leads |

## Rejection Fixtures

| Fixture | Expected Status | Error | Reason |
| --- | --- | --- | --- |
| Reject non-Dynamo route | 400 | source_route must be a Detroit Dynamo route | Public intake should not accept current LC Training or arbitrary site routes. |
| Reject invalid lead type | 400 | lead_type is invalid | Only the seven approved Detroit Dynamo form variants should be accepted. |
| Reject incomplete tryout profile | 400 | phone is required | Tryout and team-interest leads need player identity, birth date, position, experience, and contact phone. |
| Reject incomplete sponsor inquiry | 400 | package_interest is required | Sponsor leads need business identity and package interest before partnership follow-up. |

## Sample Public Payload

```json
{
  "lead_type": "contact",
  "source_route": "/detroit-dynamo/contact",
  "contact_name": "Jordan Parent",
  "email": "parent@example.com",
  "phone": "3135550100",
  "notes": "Looking for the best pathway for a serious U12 player."
}
```

## Deployment Check

Run `npm run verify:dynamo-intake-contract` before deploying the public intake function and again after field changes. This check does not make network calls.
