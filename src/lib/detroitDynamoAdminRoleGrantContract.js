import {
  detroitDynamoAdminRoles,
  detroitDynamoCollectionPlan,
} from './detroitDynamoDataModel.js';

export const detroitDynamoAdminRoleGrantFunctionId = 'detroitDynamoAdminRoleGrantAction';
export const detroitDynamoAdminRoleGrantAssignmentCollectionId = 'dd_admin_role_assignments';
export const detroitDynamoAdminRoleGrantAuditCollectionId = 'dd_admin_audit_events';
export const detroitDynamoAdminRoleGrantBootstrapEnv = 'DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID';

export const detroitDynamoAdminRoleGrantActions = [
  'grant_role',
  'suspend_role',
  'revoke_role',
  'expire_role',
  'reactivate_role',
];

const roleGrantFixtureSpecs = [
  {
    id: 'bootstrap-master-admin-grant',
    label: 'Bootstrap first Master Admin',
    action: 'grant_role',
    targetUserId: 'user_bootstrap_master',
    email: 'director@detroitdynamo.example',
    role: 'Master Admin',
    actorRole: 'Bootstrap Master Admin',
    previousRoleStatus: 'none',
    nextRoleStatus: 'active',
    bootstrap: true,
    scopeNote: 'Initial owner-controlled Master Admin grant before any active Master Admin exists.',
  },
  {
    id: 'grant-club-director',
    label: 'Grant Club Director',
    action: 'grant_role',
    targetUserId: 'user_club_director',
    email: 'club-director@detroitdynamo.example',
    role: 'Club Director',
    actorRole: 'Master Admin',
    previousRoleStatus: 'none',
    nextRoleStatus: 'active',
    scopeNote: 'Owns pathway, team, staff, sponsor, and content approval work.',
  },
  {
    id: 'grant-registrar',
    label: 'Grant Registrar',
    action: 'grant_role',
    targetUserId: 'user_registrar',
    email: 'registrar@detroitdynamo.example',
    role: 'Registrar',
    actorRole: 'Master Admin',
    previousRoleStatus: 'none',
    nextRoleStatus: 'active',
    scopeNote: 'Owns player, guardian, tryout, waiver, and roster intake records.',
  },
  {
    id: 'suspend-coach',
    label: 'Suspend Coach access',
    action: 'suspend_role',
    assignmentId: 'assignment_coach_active',
    targetUserId: 'user_coach',
    email: 'coach@detroitdynamo.example',
    role: 'Coach',
    actorRole: 'Master Admin',
    previousRoleStatus: 'active',
    nextRoleStatus: 'suspended',
    scopeNote: 'Temporary suspension while staff verification is reviewed.',
  },
  {
    id: 'revoke-media-admin',
    label: 'Revoke Media/Admin Staff access',
    action: 'revoke_role',
    assignmentId: 'assignment_media_active',
    targetUserId: 'user_media',
    email: 'media@detroitdynamo.example',
    role: 'Media/Admin Staff',
    actorRole: 'Master Admin',
    previousRoleStatus: 'active',
    nextRoleStatus: 'revoked',
    scopeNote: 'Remove content and sponsor lead access after offboarding.',
  },
  {
    id: 'expire-team-manager',
    label: 'Expire Team Manager access',
    action: 'expire_role',
    assignmentId: 'assignment_team_manager_active',
    targetUserId: 'user_team_manager',
    email: 'team-manager@detroitdynamo.example',
    role: 'Team Manager',
    actorRole: 'Master Admin',
    previousRoleStatus: 'active',
    nextRoleStatus: 'active',
    expiresAt: '2026-08-01T00:00:00.000Z',
    scopeNote: 'Seasonal team manager access with a planned expiration date.',
  },
];

const roleGrantRejectionSpecs = [
  {
    id: 'reject-unauthenticated-role-grant',
    label: 'Reject unauthenticated role grant',
    action: 'grant_role',
    role: 'Registrar',
    expectedStatus: 401,
    expectedError: 'Detroit Dynamo admin role grant requires an authenticated Appwrite user.',
    reason: 'Role grants must only be created from a protected dashboard session.',
  },
  {
    id: 'reject-non-master-admin',
    label: 'Reject non-Master Admin actor',
    action: 'grant_role',
    actorRole: 'Club Director',
    role: 'Registrar',
    expectedStatus: 403,
    expectedError: 'Only an active Master Admin can manage Detroit Dynamo admin role grants.',
    reason: 'Club Director has broad operating access but cannot grant trusted admin roles.',
  },
  {
    id: 'reject-missing-bootstrap-authority',
    label: 'Reject first Master Admin without bootstrap authority',
    action: 'grant_role',
    role: 'Master Admin',
    expectedStatus: 403,
    expectedError: 'Bootstrap Master Admin grant is not authorized for this Appwrite user.',
    reason: `The first Master Admin grant requires the server-side ${detroitDynamoAdminRoleGrantBootstrapEnv} owner user id.`,
  },
  {
    id: 'reject-invalid-role',
    label: 'Reject invalid role',
    action: 'grant_role',
    role: 'Owner',
    expectedStatus: 400,
    expectedError: 'role must be a planned Detroit Dynamo admin role',
    reason: 'Only planned Detroit Dynamo admin roles should be written to the trusted role assignment collection.',
  },
  {
    id: 'reject-self-master-admin-lockout',
    label: 'Reject self lockout',
    action: 'revoke_role',
    assignmentId: 'assignment_current_master_admin',
    role: 'Master Admin',
    expectedStatus: 409,
    expectedError: 'Master Admin cannot remove their own active role grant with this action.',
    reason: 'The live dashboard needs an explicit guard against accidental single-admin lockout.',
  },
  {
    id: 'reject-unknown-assignment',
    label: 'Reject unknown assignment',
    action: 'suspend_role',
    assignmentId: 'missing_assignment',
    role: 'Coach',
    expectedStatus: 404,
    expectedError: 'Detroit Dynamo admin role assignment was not found.',
    reason: 'Mutation actions must target a real trusted assignment document.',
  },
];

function roleAssignmentRecordId(spec) {
  return spec.assignmentId || `assignment_${spec.targetUserId}_${spec.role.replaceAll(/\W+/g, '_').toLowerCase()}`;
}

function buildRequestBody(spec) {
  const base = {
    action: spec.action,
    role: spec.role,
    scope_note: spec.scopeNote || '',
  };

  if (spec.action === 'grant_role') {
    return {
      ...base,
      target_user_id: spec.targetUserId,
      email: spec.email,
      expires_at: spec.expiresAt || '',
    };
  }

  return {
    ...base,
    assignment_id: spec.assignmentId,
    expires_at: spec.expiresAt || '',
  };
}

function buildSuccessFixture(spec) {
  const assignmentId = roleAssignmentRecordId(spec);

  return {
    id: spec.id,
    label: spec.label,
    action: spec.action,
    role: spec.role,
    actorRole: spec.actorRole,
    requiredAuth: 'Appwrite authenticated user execution',
    bootstrap: Boolean(spec.bootstrap),
    requestBody: buildRequestBody(spec),
    expectedResponse: {
      httpStatus: 200,
      success: true,
      function_id: detroitDynamoAdminRoleGrantFunctionId,
      function_execute_permission: 'users',
      action: spec.action,
      actor_user_id: 'authenticated Appwrite user id',
      actor_role: spec.actorRole,
      assignment_id: assignmentId,
      role: spec.role,
      status: spec.nextRoleStatus,
      audit_event_id: 'created dd_admin_audit_events document id',
    },
    expectedAssignment: {
      collectionId: detroitDynamoAdminRoleGrantAssignmentCollectionId,
      documentId: assignmentId,
      actor_user_id: spec.targetUserId || 'existing assignment actor_user_id',
      role: spec.role,
      previous_status: spec.previousRoleStatus,
      next_status: spec.nextRoleStatus,
      expires_at: spec.expiresAt || '',
      scope_note: spec.scopeNote || '',
    },
    expectedAuditEvent: {
      collectionId: detroitDynamoAdminRoleGrantAuditCollectionId,
      action: spec.action,
      actor_user_id: 'authenticated Appwrite user id',
      actor_role: spec.actorRole,
      target_model: 'AdminRoleAssignment',
      target_collection_id: detroitDynamoAdminRoleGrantAssignmentCollectionId,
      target_record_id: assignmentId,
      role_previous_status: spec.previousRoleStatus,
      role_next_status: spec.nextRoleStatus,
      metadata_json: 'role assignment status, target user, expiration, and scope note JSON',
      created_at: 'now',
    },
  };
}

function buildRejectionFixture(spec) {
  return {
    id: spec.id,
    label: spec.label,
    action: spec.action,
    role: spec.role,
    requestBody: buildRequestBody({
      targetUserId: 'user_rejected',
      email: 'rejected@detroitdynamo.example',
      scopeNote: 'Rejected fixture payload',
      ...spec,
    }),
    expectedResponse: {
      httpStatus: spec.expectedStatus,
      error: spec.expectedError,
    },
    reason: spec.reason,
  };
}

export function buildDetroitDynamoAdminRoleGrantFixtures() {
  return roleGrantFixtureSpecs.map(buildSuccessFixture);
}

export function buildDetroitDynamoAdminRoleGrantRejectionFixtures() {
  return roleGrantRejectionSpecs.map(buildRejectionFixture);
}

export function buildDetroitDynamoAdminRoleGrantContractReport() {
  const successFixtures = buildDetroitDynamoAdminRoleGrantFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminRoleGrantRejectionFixtures();
  const issues = auditDetroitDynamoAdminRoleGrantContract();

  return {
    generatedAt: new Date().toISOString(),
    functionId: detroitDynamoAdminRoleGrantFunctionId,
    functionExecutePermission: 'users',
    assignmentCollectionId: detroitDynamoAdminRoleGrantAssignmentCollectionId,
    auditEventCollectionId: detroitDynamoAdminRoleGrantAuditCollectionId,
    bootstrapEnv: detroitDynamoAdminRoleGrantBootstrapEnv,
    actions: detroitDynamoAdminRoleGrantActions,
    roles: detroitDynamoAdminRoles,
    successFixtures,
    rejectionFixtures,
    issues,
  };
}

export function buildDetroitDynamoAdminRoleGrantHandoffMarkdown(
  report = buildDetroitDynamoAdminRoleGrantContractReport(),
) {
  const lines = [
    '# Detroit Dynamo Admin Role Grant Handoff',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `\`${report.functionId}\` is the authenticated Appwrite Function planned for trusted Detroit Dynamo admin role management. It creates and mutates \`${report.assignmentCollectionId}\` records server-side, then appends an audit event to \`${report.auditEventCollectionId}\` for every successful action.`,
    '',
    `Only an active Master Admin can run grant, suspend, revoke, expire, or reactivate actions. The only exception is the first Master Admin bootstrap grant, which must match the server-side \`${report.bootstrapEnv}\` value while no active Master Admin assignment exists.`,
    '',
    '## Supported Actions',
    '',
    '| Action | Purpose |',
    '| --- | --- |',
    '| grant_role | Create an active trusted role assignment for an authenticated Appwrite user id. |',
    '| suspend_role | Temporarily disable an existing assignment without deleting it. |',
    '| revoke_role | Permanently remove an assignment from active use. |',
    '| expire_role | Add or update an expiration date so reads and mutations reject the role after that time. |',
    '| reactivate_role | Restore a suspended or revoked assignment after review. |',
    '',
    '## Success Fixtures',
    '',
    '| Fixture | Action | Role | Authority | Assignment | Audit Event |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.successFixtures.map((fixture) => (
      `| ${fixture.label} | ${fixture.action} | ${fixture.role} | ${fixture.actorRole} | ${fixture.expectedAssignment.collectionId}.${fixture.expectedAssignment.documentId} | ${fixture.expectedAuditEvent.collectionId}.${fixture.expectedAuditEvent.action} |`
    )),
    '',
    '## Rejection Fixtures',
    '',
    '| Fixture | Expected Status | Error | Reason |',
    '| --- | --- | --- | --- |',
    ...report.rejectionFixtures.map((fixture) => (
      `| ${fixture.label} | ${fixture.expectedResponse.httpStatus} | ${fixture.expectedResponse.error} | ${fixture.reason} |`
    )),
    '',
    '## Authenticated Invoke Shape',
    '',
    'The live admin should invoke this Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code, and do not write role assignment documents directly from the browser.',
    '',
    '```json',
    JSON.stringify(report.successFixtures[1]?.requestBody || report.successFixtures[0]?.requestBody || {}, null, 2),
    '```',
    '',
    '## Deployment Check',
    '',
    'Run `npm run verify:dynamo-admin-role-grants` before and after deploying the function. The script validates fixture coverage, Master Admin gating, bootstrap requirements, self-lockout protection, assignment writes, and audit-event writes without making network calls.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoAdminRoleGrantContract() {
  const issues = [];
  const validRoles = new Set(detroitDynamoAdminRoles);
  const validActions = new Set(detroitDynamoAdminRoleGrantActions);
  const successFixtures = buildDetroitDynamoAdminRoleGrantFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminRoleGrantRejectionFixtures();
  const assignmentCollection = detroitDynamoCollectionPlan.find((item) => item.model === 'AdminRoleAssignment');
  const auditCollection = detroitDynamoCollectionPlan.find((item) => item.model === 'AdminAuditEvent');

  if (detroitDynamoAdminRoleGrantFunctionId !== 'detroitDynamoAdminRoleGrantAction') {
    issues.push('Admin role grant function id must stay detroitDynamoAdminRoleGrantAction.');
  }

  if (!assignmentCollection || assignmentCollection.collectionId !== detroitDynamoAdminRoleGrantAssignmentCollectionId) {
    issues.push('Admin role grants require the dd_admin_role_assignments AdminRoleAssignment collection.');
  }

  if (!auditCollection || auditCollection.collectionId !== detroitDynamoAdminRoleGrantAuditCollectionId) {
    issues.push('Admin role grant actions require the dd_admin_audit_events AdminAuditEvent collection.');
  }

  for (const action of ['grant_role', 'suspend_role', 'revoke_role', 'expire_role', 'reactivate_role']) {
    if (!validActions.has(action)) {
      issues.push(`Admin role grant action is missing: ${action}`);
    }
  }

  for (const fixture of successFixtures) {
    if (!validActions.has(fixture.action)) {
      issues.push(`${fixture.id} uses an unknown role grant action.`);
    }
    if (!validRoles.has(fixture.role)) {
      issues.push(`${fixture.id} uses an unknown Detroit Dynamo role: ${fixture.role}`);
    }
    if (fixture.actorRole !== 'Master Admin' && fixture.actorRole !== 'Bootstrap Master Admin') {
      issues.push(`${fixture.id} must be authorized by Master Admin or Bootstrap Master Admin.`);
    }
    if (fixture.action === 'grant_role' && !fixture.requestBody['target_user_id']) {
      issues.push(`${fixture.id} grant payload is missing target_user_id.`);
    }
    if (fixture.action !== 'grant_role' && !fixture.requestBody['assignment_id']) {
      issues.push(`${fixture.id} mutation payload is missing assignment_id.`);
    }
    if (fixture.expectedResponse.function_id !== detroitDynamoAdminRoleGrantFunctionId) {
      issues.push(`${fixture.id} expected response has wrong function id.`);
    }
    if (!fixture.expectedResponse.audit_event_id) {
      issues.push(`${fixture.id} expected response is missing audit_event_id.`);
    }
    if (fixture.expectedAssignment.collectionId !== detroitDynamoAdminRoleGrantAssignmentCollectionId) {
      issues.push(`${fixture.id} expected assignment targets the wrong collection.`);
    }
    if (fixture.expectedAuditEvent.collectionId !== detroitDynamoAdminRoleGrantAuditCollectionId) {
      issues.push(`${fixture.id} expected audit event targets the wrong collection.`);
    }
    if (fixture.expectedAuditEvent.target_model !== 'AdminRoleAssignment') {
      issues.push(`${fixture.id} expected audit event must target AdminRoleAssignment.`);
    }
  }

  const bootstrapFixture = successFixtures.find((fixture) => fixture.id === 'bootstrap-master-admin-grant');
  if (!bootstrapFixture || !bootstrapFixture.bootstrap || bootstrapFixture.role !== 'Master Admin') {
    issues.push('Admin role grant contract must include a first Master Admin bootstrap fixture.');
  }

  const coveredActions = new Set(successFixtures.map((fixture) => fixture.action));
  for (const action of ['grant_role', 'suspend_role', 'revoke_role', 'expire_role']) {
    if (!coveredActions.has(action)) {
      issues.push(`Admin role grant success fixtures must cover ${action}.`);
    }
  }

  const requiredRejections = [
    ['reject-unauthenticated-role-grant', 401],
    ['reject-non-master-admin', 403],
    ['reject-missing-bootstrap-authority', 403],
    ['reject-invalid-role', 400],
    ['reject-self-master-admin-lockout', 409],
    ['reject-unknown-assignment', 404],
  ];

  for (const [id, status] of requiredRejections) {
    const fixture = rejectionFixtures.find((item) => item.id === id);
    if (!fixture || fixture.expectedResponse.httpStatus !== status) {
      issues.push(`Admin role grant rejection fixture ${id} must return ${status}.`);
    }
  }

  return issues;
}
