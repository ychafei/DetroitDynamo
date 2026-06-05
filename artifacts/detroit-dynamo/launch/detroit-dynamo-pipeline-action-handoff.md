# Detroit Dynamo Pipeline Action Handoff

Generated: 2026-05-29T14:14:32.027Z

`detroitDynamoLeadPipelineAction` is the authenticated Appwrite Function planned for admin status changes on pipeline-backed Detroit Dynamo records. These fixtures keep the preview admin, Appwrite schema, and future live dashboard aligned before credentials are used.

Every successful transition must also append an audit event to `dd_admin_audit_events` before the action is treated as complete.

## Supported Models

| Model | Collection | Default Owner |
| --- | --- | --- |
| ContactLead | dd_contact_leads | Media/Admin Staff |
| Booking | dd_bookings | Training Director |
| TryoutRegistration | dd_tryout_registrations | Registrar |
| Sponsor | dd_sponsors | Media/Admin Staff |

## Success Fixtures

| Fixture | Model | Current | Next | Owner | Expected Update |
| --- | --- | --- | --- | --- | --- |
| General contact lead triage | ContactLead | new | triaged | Media/Admin Staff | pipeline_status, pipeline_owner_role, pipeline_due_at, pipeline_updated_at, pipeline_last_note, pipeline_event_count, updated_at |
| Training booking package discussion | Booking | contacted | package_discussion | Training Director | pipeline_status, pipeline_owner_role, pipeline_due_at, pipeline_updated_at, pipeline_last_note, pipeline_event_count, updated_at |
| Tryout registration evaluation scheduled | TryoutRegistration | contacted | evaluation_scheduled | Registrar | pipeline_status, pipeline_owner_role, pipeline_due_at, pipeline_updated_at, pipeline_last_note, pipeline_event_count, updated_at |
| Sponsor inquiry package discussion | Sponsor | contacted | package_discussion | Media/Admin Staff | pipeline_status, pipeline_owner_role, pipeline_due_at, pipeline_updated_at, pipeline_last_note, pipeline_event_count, updated_at |
| Duplicate contact merge | ContactLead | new | closed_duplicate | Media/Admin Staff | pipeline_status, pipeline_owner_role, pipeline_due_at, pipeline_updated_at, pipeline_last_note, pipeline_event_count, updated_at |
| No-show evaluation rescheduled | TryoutRegistration | closed_no_show | evaluation_scheduled | Registrar | pipeline_status, pipeline_owner_role, pipeline_due_at, pipeline_updated_at, pipeline_last_note, pipeline_event_count, updated_at |

## Audit Event Shape

| Collection | Action | Actor | Target | Status Change |
| --- | --- | --- | --- | --- |
| dd_admin_audit_events | pipeline_status_transition | Media/Admin Staff | ContactLead.preview_contact_new_to_triaged | new to triaged |
| dd_admin_audit_events | pipeline_status_transition | Training Director | Booking.preview_training_contacted_to_package | contacted to package_discussion |
| dd_admin_audit_events | pipeline_status_transition | Registrar | TryoutRegistration.preview_tryout_contacted_to_evaluation | contacted to evaluation_scheduled |
| dd_admin_audit_events | pipeline_status_transition | Media/Admin Staff | Sponsor.preview_sponsor_contacted_to_package | contacted to package_discussion |
| dd_admin_audit_events | pipeline_status_transition | Media/Admin Staff | ContactLead.preview_duplicate_contact_closed | new to closed_duplicate |
| dd_admin_audit_events | pipeline_status_transition | Registrar | TryoutRegistration.preview_no_show_reopened | closed_no_show to evaluation_scheduled |

## Rejection Fixtures

| Fixture | Expected Status | Error | Reason |
| --- | --- | --- | --- |
| Reject unauthenticated action | 401 | Detroit Dynamo pipeline action requires an authenticated Appwrite user. | The function must receive the authenticated Appwrite user header from a protected session. |
| Reject disallowed transition | 409 | Pipeline transition is not allowed | New intake cannot skip triage, contact, scheduling, and invite or close review. |
| Reject unsupported collection target | 400 | model or collection_id must target a pipeline-backed Detroit Dynamo collection | Only ContactLead, Booking, TryoutRegistration, and Sponsor are directly pipeline-backed. |

## Authenticated Invoke Shape

The live admin should invoke the Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code.

```json
{
  "model": "ContactLead",
  "collection_id": "dd_contact_leads",
  "record_id": "preview_contact_new_to_triaged",
  "next_status": "triaged",
  "actor_role": "Media/Admin Staff",
  "owner_role": "Media/Admin Staff",
  "note": "Validated contact route, source, and preferred callback window."
}
```

## Deployment Check

Run `npm run verify:dynamo-pipeline-actions` before and after deploying the function. The script validates fixture coverage, allowed transitions, planned roles, pipeline-backed collections, and audit-event writes without making network calls.
