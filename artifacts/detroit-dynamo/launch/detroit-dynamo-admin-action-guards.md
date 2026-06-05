# Detroit Dynamo Admin Action Guards

Generated: 2026-05-29T14:14:32.245Z

This file derives the first dashboard action guards from the admin module registry and role-permission matrix. It is not live authorization yet; it is the contract the Appwrite-backed admin screens should enforce.

## Players

Owner roles: Registrar, Club Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Review player leads | view | Registrar, Club Director | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar, Media/Admin Staff |
| Assign status | manage | Registrar | Master Admin, Registrar |
| Connect guardians | manage | Registrar | Master Admin, Registrar |
| Prepare roster eligibility | manage | Registrar | Master Admin, Registrar |

## Parents/guardians

Owner roles: Registrar

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Review guardian records | view | Registrar | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar |
| Connect players | manage | Registrar | Master Admin, Registrar |
| Track consent readiness | view | Registrar | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar |
| Route family communication | manage | Registrar | Master Admin, Registrar |

## Coaches

Owner roles: Training Director, Club Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Create coach profiles | manage | Club Director | Master Admin, Club Director |
| Assign programs | manage | Club Director | Master Admin, Club Director |
| Assign teams | manage | Club Director | Master Admin, Club Director |
| Review background-check status | view | Training Director, Club Director | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar, Media/Admin Staff |

## Teams

Owner roles: Club Director, Team Manager, Registrar

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Create team shells | manage | Club Director | Master Admin, Club Director |
| Assign coaches | manage | Club Director | Master Admin, Club Director |
| Assign managers | manage | Club Director | Master Admin, Club Director |
| Prepare roster cards | manage | Club Director | Master Admin, Club Director |

## Age groups

Owner roles: Club Director, Registrar

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Define age-group cohorts | manage | Club Director | Master Admin, Club Director |
| Map players by birth year | manage | Club Director | Master Admin, Club Director |
| Publish pathway language | manage | Club Director | Master Admin, Club Director |
| Review capacity | view | Club Director, Registrar | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar, Media/Admin Staff |

## Training programs

Owner roles: Training Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Create programs | manage | Training Director | Master Admin, Training Director |
| Draft package options | contribute | Training Director | Master Admin, Training Director |
| Set public visibility | manage | Training Director | Master Admin, Training Director |
| Connect booking CTAs | manage | Training Director | Master Admin, Training Director |

## Training bookings

Owner roles: Training Director, Coach

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Review booking leads | view | Training Director, Coach | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar |
| Assign coach follow-up | manage | Training Director | Master Admin, Training Director |
| Capture requested focus | contribute | Training Director, Coach | Master Admin, Training Director, Coach |
| Prepare session records | manage | Training Director | Master Admin, Training Director |

## Tryout registrations

Owner roles: Registrar, Club Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Review registrations | view | Registrar, Club Director | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar, Media/Admin Staff |
| Set status | manage | Registrar, Club Director | Master Admin, Club Director, Registrar |
| Route by pathway | manage | Registrar, Club Director | Master Admin, Club Director, Registrar |
| Prepare invite/waitlist decisions | manage | Registrar, Club Director | Master Admin, Club Director, Registrar |

## Camp registrations

Owner roles: Training Director, Registrar

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Create camp shells | manage | Training Director, Registrar | Master Admin, Training Director, Registrar |
| Track interest | view | Training Director, Registrar | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar, Media/Admin Staff |
| Manage capacity | manage | Training Director, Registrar | Master Admin, Training Director, Registrar |
| Confirm waiver readiness | manage | Training Director, Registrar | Master Admin, Training Director, Registrar |

## Payments/packages

Owner roles: Master Admin, Training Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Draft packages | contribute | Master Admin, Training Director | Master Admin, Training Director |
| Map provider products | manage | Master Admin | Master Admin |
| Review payment status | view | Master Admin, Training Director | Master Admin, Club Director, Training Director, Team Manager, Registrar |
| Prepare refund rules | manage | Master Admin | Master Admin |

## Waivers/forms

Owner roles: Registrar, Master Admin

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Draft waiver versions | contribute | Registrar, Master Admin | Master Admin, Registrar |
| Track signature status | view | Registrar, Master Admin | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar |
| Review expirations | view | Registrar, Master Admin | Master Admin, Club Director, Training Director, Coach, Team Manager, Registrar |
| Gate participation readiness | manage | Registrar, Master Admin | Master Admin, Registrar |

## News posts

Owner roles: Media/Admin Staff, Club Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Draft posts | contribute | Media/Admin Staff, Club Director | Master Admin, Club Director, Training Director, Team Manager, Media/Admin Staff |
| Approve claims | approve | Club Director | Master Admin, Club Director |
| Schedule publication | manage | Media/Admin Staff | Master Admin, Media/Admin Staff |
| Archive old posts | manage | Media/Admin Staff | Master Admin, Media/Admin Staff |

## Sponsors

Owner roles: Media/Admin Staff, Club Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Review sponsor leads | view | Media/Admin Staff, Club Director | Master Admin, Club Director, Training Director, Team Manager, Media/Admin Staff |
| Track package interest | view | Media/Admin Staff, Club Director | Master Admin, Club Director, Training Director, Team Manager, Media/Admin Staff |
| Approve logos | approve | Club Director | Master Admin, Club Director |
| Prepare partnership content | manage | Media/Admin Staff | Master Admin, Media/Admin Staff |

## Schedules/results

Owner roles: Team Manager, Club Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Create fixture drafts | manage | Team Manager, Club Director | Master Admin, Club Director, Team Manager |
| Confirm venues | manage | Team Manager, Club Director | Master Admin, Club Director, Team Manager |
| Publish results | manage | Team Manager, Club Director | Master Admin, Club Director, Team Manager |
| Connect recaps | manage | Team Manager, Club Director | Master Admin, Club Director, Team Manager |

## Contact leads

Owner roles: Media/Admin Staff, Training Director, Registrar

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Review leads | view | Media/Admin Staff, Training Director, Registrar | Master Admin, Club Director, Training Director, Team Manager, Registrar, Media/Admin Staff |
| Assign owner | manage | Media/Admin Staff, Training Director, Registrar | Master Admin, Training Director, Registrar, Media/Admin Staff |
| Set status | manage | Media/Admin Staff, Training Director, Registrar | Master Admin, Training Director, Registrar, Media/Admin Staff |
| Export follow-up queue | view | Media/Admin Staff, Training Director, Registrar | Master Admin, Club Director, Training Director, Team Manager, Registrar, Media/Admin Staff |

## Website content sections

Owner roles: Media/Admin Staff, Club Director

| Action | Required access | Owner roles allowed | All roles allowed |
| --- | --- | --- | --- |
| Draft content sections | contribute | Media/Admin Staff, Club Director | Master Admin, Club Director, Training Director, Team Manager, Media/Admin Staff |
| Approve launch copy | approve | Club Director | Master Admin, Club Director |
| Update proof slots | manage | Media/Admin Staff | Master Admin, Media/Admin Staff |
| Prepare sitemap/redirect promotion | manage | Media/Admin Staff | Master Admin, Media/Admin Staff |
