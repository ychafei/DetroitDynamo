# Detroit Dynamo Admin Role Grant Handoff

Generated: 2026-05-29T14:14:32.030Z

`detroitDynamoAdminRoleGrantAction` is the authenticated Appwrite Function planned for trusted Detroit Dynamo admin role management. It creates and mutates `dd_admin_role_assignments` records server-side, then appends an audit event to `dd_admin_audit_events` for every successful action.

Only an active Master Admin can run grant, suspend, revoke, expire, or reactivate actions. The only exception is the first Master Admin bootstrap grant, which must match the server-side `DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID` value while no active Master Admin assignment exists.

## Supported Actions

| Action | Purpose |
| --- | --- |
| grant_role | Create an active trusted role assignment for an authenticated Appwrite user id. |
| suspend_role | Temporarily disable an existing assignment without deleting it. |
| revoke_role | Permanently remove an assignment from active use. |
| expire_role | Add or update an expiration date so reads and mutations reject the role after that time. |
| reactivate_role | Restore a suspended or revoked assignment after review. |

## Success Fixtures

| Fixture | Action | Role | Authority | Assignment | Audit Event |
| --- | --- | --- | --- | --- | --- |
| Bootstrap first Master Admin | grant_role | Master Admin | Bootstrap Master Admin | dd_admin_role_assignments.assignment_user_bootstrap_master_master_admin | dd_admin_audit_events.grant_role |
| Grant Club Director | grant_role | Club Director | Master Admin | dd_admin_role_assignments.assignment_user_club_director_club_director | dd_admin_audit_events.grant_role |
| Grant Registrar | grant_role | Registrar | Master Admin | dd_admin_role_assignments.assignment_user_registrar_registrar | dd_admin_audit_events.grant_role |
| Suspend Coach access | suspend_role | Coach | Master Admin | dd_admin_role_assignments.assignment_coach_active | dd_admin_audit_events.suspend_role |
| Revoke Media/Admin Staff access | revoke_role | Media/Admin Staff | Master Admin | dd_admin_role_assignments.assignment_media_active | dd_admin_audit_events.revoke_role |
| Expire Team Manager access | expire_role | Team Manager | Master Admin | dd_admin_role_assignments.assignment_team_manager_active | dd_admin_audit_events.expire_role |

## Rejection Fixtures

| Fixture | Expected Status | Error | Reason |
| --- | --- | --- | --- |
| Reject unauthenticated role grant | 401 | Detroit Dynamo admin role grant requires an authenticated Appwrite user. | Role grants must only be created from a protected dashboard session. |
| Reject non-Master Admin actor | 403 | Only an active Master Admin can manage Detroit Dynamo admin role grants. | Club Director has broad operating access but cannot grant trusted admin roles. |
| Reject first Master Admin without bootstrap authority | 403 | Bootstrap Master Admin grant is not authorized for this Appwrite user. | The first Master Admin grant requires the server-side DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID owner user id. |
| Reject invalid role | 400 | role must be a planned Detroit Dynamo admin role | Only planned Detroit Dynamo admin roles should be written to the trusted role assignment collection. |
| Reject self lockout | 409 | Master Admin cannot remove their own active role grant with this action. | The live dashboard needs an explicit guard against accidental single-admin lockout. |
| Reject unknown assignment | 404 | Detroit Dynamo admin role assignment was not found. | Mutation actions must target a real trusted assignment document. |

## Authenticated Invoke Shape

The live admin should invoke this Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code, and do not write role assignment documents directly from the browser.

```json
{
  "action": "grant_role",
  "role": "Club Director",
  "scope_note": "Owns pathway, team, staff, sponsor, and content approval work.",
  "target_user_id": "user_club_director",
  "email": "club-director@detroitdynamo.example",
  "expires_at": ""
}
```

## Deployment Check

Run `npm run verify:dynamo-admin-role-grants` before and after deploying the function. The script validates fixture coverage, Master Admin gating, bootstrap requirements, self-lockout protection, assignment writes, and audit-event writes without making network calls.
