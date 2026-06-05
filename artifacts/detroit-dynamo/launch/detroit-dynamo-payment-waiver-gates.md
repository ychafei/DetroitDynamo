# Detroit Dynamo Payment and Waiver Gate Contract

Generated: 2026-05-29T14:14:30.554Z

This contract keeps package/payment and waiver/legal work explicit while Detroit Dynamo remains preview-only. It does not enable checkout, collect money, or collect signatures.

## Payment and Package Tracks

| Track | Publish Mode | Provider | Routes | Required Approvals |
| --- | --- | --- | --- | --- |
| Private training package | placeholder_only | not_connected | /detroit-dynamo/training, /detroit-dynamo/book | Exact price, Session count, Duration, Refund/cancellation rule, Provider product id |
| Small-group training package | placeholder_only | not_connected | /detroit-dynamo/training, /detroit-dynamo/book | Exact price, Group size rules, Session count, Makeup policy, Provider product id |
| Team training quote | interest_only | not_connected | /detroit-dynamo/training, /detroit-dynamo/contact | Quote rules, Facility costs, Coach assignment policy, Invoice/checkout choice |
| Camp and clinic registration | coming_soon_interest | not_connected | /detroit-dynamo/camps-clinics | Dates, Facility, Capacity, Price, Waiver requirement, Refund/cancellation rule |
| Youth club dues | pathway_goal_only | not_connected | /detroit-dynamo/youth-club, /detroit-dynamo/tryouts | Age-group costs, Uniform policy, League fees, Payment schedule, Refund policy |
| Sponsor package | inquiry_only | not_connected | /detroit-dynamo/sponsors | Package tiers, Logo permissions, Activation inventory, Invoice/checkout workflow |

## Waiver Tracks

| Track | Signature Mode | Routes | Applies To | Required Approvals |
| --- | --- | --- | --- | --- |
| Youth participation waiver | not_enabled | /detroit-dynamo/youth-club, /detroit-dynamo/tryouts | Youth Club, Youth tryouts, Future youth teams | Guardian signature language, Participation risks, Emergency contact handling, Expiration rule |
| Medical consent and emergency contact | not_enabled | /detroit-dynamo/tryouts, /detroit-dynamo/camps-clinics | Tryouts, Camps, Clinics, Youth teams | Emergency contact fields, Medical disclosure rules, Data retention policy, Staff access policy |
| Media release | not_enabled | /detroit-dynamo/about, /detroit-dynamo/camps-clinics, /detroit-dynamo/teams | Photos, Video, News, Social media, Sponsor proof | Minor media consent, Opt-out workflow, Sponsor/content usage rules, Expiration rule |
| Camp and clinic waiver | not_enabled | /detroit-dynamo/camps-clinics | Seasonal camps, Winter indoor training, Speed/agility clinics, Goalkeeper training | Program-specific risk language, Facility terms, Refund/cancellation link, Emergency contact handling |
| Adult participation waiver | not_enabled | /detroit-dynamo/senior-men, /detroit-dynamo/senior-women | Senior men interest, Senior women interest, Adult evaluations | Adult assumption-of-risk language, Tryout/event scope, Emergency contact handling, Expiration rule |
| Team travel and event consent | not_enabled | /detroit-dynamo/teams, /detroit-dynamo/schedule-results | Future fixtures, Team travel, Events outside regular training venues | Travel consent language, Transportation rules, Chaperone/staff policy, Event-specific expiry |

## Promotion Rule

Keep payment CTAs as inquiry/placeholder flows and waiver references as approval-gated planning content until the owner confirms prices, provider products, refund rules, legal language, and signature workflow.
