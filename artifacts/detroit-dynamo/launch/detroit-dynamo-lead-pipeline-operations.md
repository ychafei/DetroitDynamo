# Detroit Dynamo Lead Pipeline Operations Guide

Generated: 2026-05-29T14:14:32.260Z

This guide describes the local-preview operator queue used by the protected preview admin. It turns browser leads into owner-assigned follow-up cards and lets admins test status transitions in localStorage without writing to Appwrite.

## Queue Summary Fields

- Active: leads in a non-closed, non-archived pipeline status.
- Due: active leads inside the final due window for their current stage.
- Late: active leads older than the max-age target for their current stage.
- Owner role: the role expected to make the next follow-up decision.
- Next statuses: the only planned status transitions the future admin action should allow.
- Local transition history: preview status changes append pipeline events to the browser-only lead record.

## Transition Controls

The protected admin pages only render buttons for allowed next statuses from the current stage. The future Appwrite-backed dashboard should enforce the same transition contract server-side and write an audit record for each status change.

Live backend scaffold: `detroitDynamoLeadPipelineAction` is the authenticated Appwrite Function planned for server-side status transitions on `dd_contact_leads`, `dd_bookings`, `dd_tryout_registrations`, and `dd_sponsors`.

## Sample Queue Output

| Lead | Type | Owner | Status | Urgency | Due Window | Next Statuses |
| --- | --- | --- | --- | --- | --- | --- |
| Sponsor Business | sponsor | Media/Admin Staff | new | overdue | -50h | triaged, closed_duplicate |
| Tryout Player | tryout | Registrar | new | overdue | -26h | triaged, closed_duplicate |
| Training Lead | training | Training Director | new | overdue | -2h | triaged, closed_duplicate |

## Counts

Active: 3

Due soon: 0

Overdue: 3
