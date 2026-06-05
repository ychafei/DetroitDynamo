# Detroit Dynamo Admin Module Write Handoff

Generated: 2026-05-29T14:14:32.033Z

`detroitDynamoAdminModuleWriteAction` is the authenticated Appwrite Function planned for protected Detroit Dynamo admin module writes. It keeps create, update, and archive mutations server-side, module-scoped, role-grant verified, and audit-event backed.

Every successful write must verify an active `dd_admin_role_assignments` grant and append an `dd_admin_audit_events` audit event before returning success.

## Supported Mutations

- create_record
- update_record
- archive_record

## Success Fixtures

| Fixture | Module | Mutation | Action | Role | Collection | External Gate |
| --- | --- | --- | --- | --- | --- | --- |
| Create senior team shell | Teams | create_record | Create team shells | Club Director | dd_teams | not required |
| Update player intake status | Players | update_record | Assign status | Registrar | dd_players | not required |
| Draft club news post | News posts | create_record | Draft posts | Media/Admin Staff | dd_news_posts | not required |
| Approve sponsor logo placement | Sponsors | update_record | Approve logos | Club Director | dd_sponsors | not required |
| Create fixture draft after gate review | Schedules/results | create_record | Create fixture drafts | Team Manager | dd_match_fixtures | confirmed |
| Update approved proof slot | Website content sections | update_record | Update proof slots | Media/Admin Staff | dd_news_posts | confirmed |

## Rejection Fixtures

| Fixture | Expected Status | Error | Reason |
| --- | --- | --- | --- |
| Reject unauthenticated write | 401 | Detroit Dynamo admin module write requires an authenticated Appwrite user. | Protected module writes must only run from an authenticated dashboard session. |
| Reject unassigned role write | 403 | Actor role is not assigned to this authenticated Appwrite user. | The requested actor role must be backed by an active dd_admin_role_assignments grant. |
| Reject coach payment write | 403 | Actor role does not have the required access for this Detroit Dynamo admin action. | Coaches must not mutate payment or package administration records. |
| Reject unconfirmed external gate | 409 | External readiness gate must be confirmed before this Detroit Dynamo module write. | Fixtures, results, payment, waiver, and launch-content modules require real-world proof before writes are enabled. |
| Reject cross-module write | 400 | collection_id must belong to the requested Detroit Dynamo admin module. | A sponsor permission surface cannot mutate player records. |
| Reject missing record id | 400 | record_id is required for update_record and archive_record. | Update and archive mutations must target a real Appwrite document. |
| Reject invalid module action | 400 | module_action must be one of the requested Detroit Dynamo admin module actions. | Write requests must align with the module action-guard registry, not arbitrary labels. |

## Authenticated Invoke Shape

The live admin should invoke this Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code, and do not write Detroit Dynamo admin-module documents directly from the browser.

```json
{
  "module_slug": "teams",
  "collection_id": "dd_teams",
  "model": "Team",
  "mutation": "create_record",
  "module_action": "Create team shells",
  "actor_role": "Club Director",
  "record_id": "",
  "external_gate_confirmed": false,
  "payload": {
    "name": "Detroit Dynamo Senior Men",
    "program_pillar": "Senior Men",
    "league_status": "future_pathway",
    "tryout_status": "interest_open"
  }
}
```

## Deployment Check

Run `npm run verify:dynamo-admin-module-writes` before and after deploying the function. The script validates module/action coverage, role access, collection scoping, external-gate rejections, role-grant requirements, and audit-event writes without making network calls.
