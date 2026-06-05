# Detroit Dynamo Backend Preflight

Generated: 2026-05-29T05:47:10.231Z

This report does not make network calls, print secrets, or mutate Appwrite. It checks local scaffold readiness for the Detroit Dynamo backend handoff.

Summary: 23 passing, 1 pending, 0 failing.

| Check | Status | Evidence | Next Action |
| --- | --- | --- | --- |
| .env.local available | pass | .env.local exists. Secret values were not printed. | None |
| Appwrite provisioning environment | pass | VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, and APPWRITE_API_KEY are present. Secret values were not printed. | None |
| Appwrite schema validation | pass | 20 collections, 247 attributes, and 70 indexes validate locally. | None |
| Payment/package and waiver gate contracts | pass | 6 payment/package tracks and 6 waiver tracks keep checkout and signatures disabled until approvals are complete. | None |
| Public claim safety contract | pass | 7 claim-safety tracks keep league, facility, roster, sponsor, fixture, outcome, and launch claims approval-gated. | None |
| Promotion cutover contract | pass | 9 cutover tracks keep root promotion, redirects, backend intake, payments, legal/support, proof content, and rollback approval-gated. | None |
| Safeguarding and data privacy contract | pass | 8 safeguarding tracks keep minor consent, staff verification, medical data, media releases, retention, and audit enforcement approval-gated. | None |
| detroitDynamoLeadIntake Appwrite config | pass | Function is public lead intake, enabled, points to the scaffold path, and includes database/document scopes. | None |
| detroitDynamoLeadPipelineAction Appwrite config | pass | Function is authenticated pipeline action, enabled, points to the scaffold path, and includes database/document scopes. | None |
| detroitDynamoAdminModuleRead Appwrite config | pass | Function is authenticated admin module read, enabled, points to the scaffold path, and includes database/document scopes. | None |
| detroitDynamoAdminRoleGrantAction Appwrite config | pass | Function is authenticated admin role grant action, enabled, points to the scaffold path, and includes database/document scopes. | None |
| detroitDynamoAdminModuleWriteAction Appwrite config | pass | Function is authenticated admin module write action, enabled, points to the scaffold path, and includes database/document scopes. | None |
| detroitDynamoLeadIntake scaffold | pass | Function package and source validate the public lead payload and write contact, tryout, sponsor, player, guardian, booking, and pipeline fields to the expected dd_* collections. | None |
| detroitDynamoLeadIntake public payload contract | pass | 7 success fixtures and 4 rejection fixtures validate against public form variants, routing collections, and required field guardrails. | None |
| detroitDynamoLeadPipelineAction scaffold | pass | Function package and source validate authenticated pipeline transitions, update pipeline fields on expected dd_* records, and append audit events. | None |
| detroitDynamoLeadPipelineAction handoff contract | pass | 6 success fixtures and 3 rejection fixtures validate against supported dd_* collections, admin roles, allowed pipeline transitions, and audit event writes. | None |
| detroitDynamoAdminModuleRead scaffold | pass | Function package and source validate authenticated module reads, role access, collection scoping, pagination limit, and Appwrite document reads. | None |
| detroitDynamoAdminModuleRead handoff contract | pass | 6 success fixtures and 5 rejection fixtures validate against protected modules, scoped dd_* collections, and admin role view access. | None |
| detroitDynamoAdminRoleGrantAction scaffold | pass | Function package and source validate authenticated Master Admin role grants, bootstrap the first Master Admin only by server env, mutate trusted role assignments, and append audit events. | None |
| detroitDynamoAdminRoleGrantAction handoff contract | pass | 6 success fixtures and 6 rejection fixtures validate against Master Admin gating, first-admin bootstrap, self-lockout protection, trusted assignment writes, and audit event writes. | None |
| detroitDynamoAdminModuleWriteAction scaffold | pass | Function package and source validate authenticated module writes, trusted role grants, module action guards, collection scoping, external gates, document mutations, and audit events. | None |
| detroitDynamoAdminModuleWriteAction handoff contract | pass | 6 success fixtures and 7 rejection fixtures validate against protected modules, action guards, scoped collections, trusted role grants, external gates, and audit event writes. | None |
| Function variable configuration path | pass | scripts/configure-functions.mjs includes Detroit Dynamo function APPWRITE_API_KEY mappings. | None |
| Live backend verification | pending | No Appwrite network calls were made. This keeps the preflight safe for local preview and CI without credentials. | After replacing/confirming credentials, run npm run provision:dynamo-appwrite -- --apply, configure function variables, deploy Detroit Dynamo functions, bootstrap or grant Master Admin access, submit production-preview forms, test an authenticated pipeline transition, then test an authenticated admin module read. |
