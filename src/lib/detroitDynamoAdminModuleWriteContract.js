import {
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoCollectionPlan,
} from './detroitDynamoDataModel.js';
import {
  canDetroitDynamoRoleAccess,
  getDetroitDynamoActionRequirement,
} from './detroitDynamoAdminAccess.js';
import {
  detroitDynamoAdminRoleGrantAssignmentCollectionId,
  detroitDynamoAdminRoleGrantAuditCollectionId,
} from './detroitDynamoAdminRoleGrantContract.js';

export const detroitDynamoAdminModuleWriteFunctionId = 'detroitDynamoAdminModuleWriteAction';
export const detroitDynamoAdminModuleWriteMutations = [
  'create_record',
  'update_record',
  'archive_record',
];

const collectionPlanById = Object.fromEntries(
  detroitDynamoCollectionPlan.map((item) => [item.collectionId, item]),
);

const writeFixtureSpecs = [
  {
    id: 'club-director-create-team-shell',
    label: 'Create senior team shell',
    moduleSlug: 'teams',
    collectionId: 'dd_teams',
    actorRole: 'Club Director',
    moduleAction: 'Create team shells',
    mutation: 'create_record',
    payload: {
      name: 'Detroit Dynamo Senior Men',
      program_pillar: 'Senior Men',
      league_status: 'future_pathway',
      tryout_status: 'interest_open',
    },
  },
  {
    id: 'registrar-update-player-status',
    label: 'Update player intake status',
    moduleSlug: 'players',
    collectionId: 'dd_players',
    actorRole: 'Registrar',
    moduleAction: 'Assign status',
    mutation: 'update_record',
    recordId: 'player_preview_001',
    payload: {
      status: 'active',
      waiver_status: 'pending',
    },
  },
  {
    id: 'media-draft-news-post',
    label: 'Draft club news post',
    moduleSlug: 'news-posts',
    collectionId: 'dd_news_posts',
    actorRole: 'Media/Admin Staff',
    moduleAction: 'Draft posts',
    mutation: 'create_record',
    payload: {
      title: 'Detroit Dynamo tryout interest opens',
      slug: 'tryout-interest-opens',
      status: 'draft',
      category: 'Tryouts',
    },
  },
  {
    id: 'club-director-approve-sponsor-logo',
    label: 'Approve sponsor logo placement',
    moduleSlug: 'sponsors',
    collectionId: 'dd_sponsors',
    actorRole: 'Club Director',
    moduleAction: 'Approve logos',
    mutation: 'update_record',
    recordId: 'sponsor_preview_001',
    payload: {
      status: 'approved',
      logo_url: '/detroit-dynamo/sponsor-placeholder.png',
    },
  },
  {
    id: 'team-manager-create-fixture-draft',
    label: 'Create fixture draft after gate review',
    moduleSlug: 'schedules-results',
    collectionId: 'dd_match_fixtures',
    actorRole: 'Team Manager',
    moduleAction: 'Create fixture drafts',
    mutation: 'create_record',
    externalGateConfirmed: true,
    payload: {
      team_id: 'team_senior_men',
      opponent: 'Opponent pending confirmation',
      status: 'draft',
      competition_label: 'Future pathway fixture',
    },
  },
  {
    id: 'media-update-proof-slot',
    label: 'Update approved proof slot',
    moduleSlug: 'website-content-sections',
    collectionId: 'dd_news_posts',
    actorRole: 'Media/Admin Staff',
    moduleAction: 'Update proof slots',
    mutation: 'update_record',
    recordId: 'news_preview_001',
    externalGateConfirmed: true,
    payload: {
      status: 'review',
      summary: 'Proof slot updated after owner review.',
    },
  },
];

const rejectionSpecs = [
  {
    id: 'reject-unauthenticated-write',
    label: 'Reject unauthenticated write',
    moduleSlug: 'teams',
    collectionId: 'dd_teams',
    actorRole: 'Club Director',
    moduleAction: 'Create team shells',
    mutation: 'create_record',
    expectedStatus: 401,
    expectedError: 'Detroit Dynamo admin module write requires an authenticated Appwrite user.',
    reason: 'Protected module writes must only run from an authenticated dashboard session.',
  },
  {
    id: 'reject-unassigned-role-write',
    label: 'Reject unassigned role write',
    moduleSlug: 'players',
    collectionId: 'dd_players',
    actorRole: 'Registrar',
    moduleAction: 'Assign status',
    mutation: 'update_record',
    recordId: 'player_preview_001',
    expectedStatus: 403,
    expectedError: 'Actor role is not assigned to this authenticated Appwrite user.',
    reason: `The requested actor role must be backed by an active ${detroitDynamoAdminRoleGrantAssignmentCollectionId} grant.`,
  },
  {
    id: 'reject-role-without-write-access',
    label: 'Reject coach payment write',
    moduleSlug: 'payments-packages',
    collectionId: 'dd_payments',
    actorRole: 'Coach',
    moduleAction: 'Review payment status',
    mutation: 'update_record',
    recordId: 'payment_preview_001',
    externalGateConfirmed: true,
    expectedStatus: 403,
    expectedError: 'Actor role does not have the required access for this Detroit Dynamo admin action.',
    reason: 'Coaches must not mutate payment or package administration records.',
  },
  {
    id: 'reject-external-gate-unconfirmed',
    label: 'Reject unconfirmed external gate',
    moduleSlug: 'schedules-results',
    collectionId: 'dd_match_results',
    actorRole: 'Team Manager',
    moduleAction: 'Publish results',
    mutation: 'update_record',
    recordId: 'result_preview_001',
    expectedStatus: 409,
    expectedError: 'External readiness gate must be confirmed before this Detroit Dynamo module write.',
    reason: 'Fixtures, results, payment, waiver, and launch-content modules require real-world proof before writes are enabled.',
  },
  {
    id: 'reject-collection-outside-module-write',
    label: 'Reject cross-module write',
    moduleSlug: 'sponsors',
    collectionId: 'dd_players',
    actorRole: 'Media/Admin Staff',
    moduleAction: 'Track package interest',
    mutation: 'update_record',
    recordId: 'player_preview_001',
    expectedStatus: 400,
    expectedError: 'collection_id must belong to the requested Detroit Dynamo admin module.',
    reason: 'A sponsor permission surface cannot mutate player records.',
  },
  {
    id: 'reject-update-without-record',
    label: 'Reject missing record id',
    moduleSlug: 'news-posts',
    collectionId: 'dd_news_posts',
    actorRole: 'Media/Admin Staff',
    moduleAction: 'Archive old posts',
    mutation: 'archive_record',
    expectedStatus: 400,
    expectedError: 'record_id is required for update_record and archive_record.',
    reason: 'Update and archive mutations must target a real Appwrite document.',
  },
  {
    id: 'reject-invalid-module-action',
    label: 'Reject invalid module action',
    moduleSlug: 'teams',
    collectionId: 'dd_teams',
    actorRole: 'Club Director',
    moduleAction: 'Publish results',
    mutation: 'update_record',
    recordId: 'team_preview_001',
    expectedStatus: 400,
    expectedError: 'module_action must be one of the requested Detroit Dynamo admin module actions.',
    reason: 'Write requests must align with the module action-guard registry, not arbitrary labels.',
  },
];

function getModuleBySlug(moduleSlug) {
  return detroitDynamoAdminModuleRegistry.find((item) => item.slug === moduleSlug) || null;
}

function collectionModel(collectionId) {
  return collectionPlanById[collectionId]?.model || '';
}

function buildRequestBody(spec) {
  return {
    module_slug: spec.moduleSlug,
    collection_id: spec.collectionId,
    model: collectionModel(spec.collectionId),
    mutation: spec.mutation,
    module_action: spec.moduleAction,
    actor_role: spec.actorRole,
    record_id: spec.recordId || '',
    external_gate_confirmed: Boolean(spec.externalGateConfirmed),
    payload: spec.payload || {
      status: 'preview',
    },
  };
}

function buildSuccessFixture(spec) {
  const modulePlan = getModuleBySlug(spec.moduleSlug);
  const model = collectionModel(spec.collectionId);
  const recordId = spec.recordId || `created ${spec.collectionId} document id`;
  const requiredAccess = getDetroitDynamoActionRequirement(spec.moduleAction);

  return {
    id: spec.id,
    label: spec.label,
    module: modulePlan?.module || spec.moduleSlug,
    moduleSlug: spec.moduleSlug,
    collectionId: spec.collectionId,
    model,
    mutation: spec.mutation,
    moduleAction: spec.moduleAction,
    requiredAccess,
    actorRole: spec.actorRole,
    externalGateConfirmed: Boolean(spec.externalGateConfirmed),
    requestBody: buildRequestBody(spec),
    expectedResponse: {
      httpStatus: 200,
      success: true,
      function_id: detroitDynamoAdminModuleWriteFunctionId,
      function_execute_permission: 'users',
      mutation: spec.mutation,
      module_slug: spec.moduleSlug,
      module: modulePlan?.module || spec.moduleSlug,
      actor_role: spec.actorRole,
      actor_user_id: 'authenticated Appwrite user id',
      role_assignment_id: 'active dd_admin_role_assignments document id',
      collection_id: spec.collectionId,
      model,
      record_id: recordId,
      audit_event_id: 'created dd_admin_audit_events document id',
    },
    expectedAuditEvent: {
      collectionId: detroitDynamoAdminRoleGrantAuditCollectionId,
      action: 'admin_module_write_action',
      actor_user_id: 'authenticated Appwrite user id',
      actor_role: spec.actorRole,
      target_model: model,
      target_collection_id: spec.collectionId,
      target_record_id: recordId,
      metadata_json: 'module, mutation, action, required access, and payload keys JSON',
      created_at: 'now',
    },
  };
}

function buildRejectionFixture(spec) {
  return {
    id: spec.id,
    label: spec.label,
    moduleSlug: spec.moduleSlug,
    collectionId: spec.collectionId,
    actorRole: spec.actorRole,
    mutation: spec.mutation,
    moduleAction: spec.moduleAction,
    requestBody: buildRequestBody(spec),
    expectedResponse: {
      httpStatus: spec.expectedStatus,
      error: spec.expectedError,
    },
    reason: spec.reason,
  };
}

export function buildDetroitDynamoAdminModuleWriteFixtures() {
  return writeFixtureSpecs.map(buildSuccessFixture);
}

export function buildDetroitDynamoAdminModuleWriteRejectionFixtures() {
  return rejectionSpecs.map(buildRejectionFixture);
}

export function buildDetroitDynamoAdminModuleWriteContractReport() {
  const successFixtures = buildDetroitDynamoAdminModuleWriteFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminModuleWriteRejectionFixtures();
  const issues = auditDetroitDynamoAdminModuleWriteContract();

  return {
    generatedAt: new Date().toISOString(),
    functionId: detroitDynamoAdminModuleWriteFunctionId,
    functionExecutePermission: 'users',
    roleAssignmentCollectionId: detroitDynamoAdminRoleGrantAssignmentCollectionId,
    auditEventCollectionId: detroitDynamoAdminRoleGrantAuditCollectionId,
    mutations: detroitDynamoAdminModuleWriteMutations,
    supportedModules: detroitDynamoAdminModuleRegistry.map((item) => ({
      module: item.module,
      slug: item.slug,
      status: item.status,
      ownerRoles: item.ownerRoles,
      collectionIds: item.collectionIds,
      enabledActions: item.enabledActions,
    })),
    successFixtures,
    rejectionFixtures,
    issues,
  };
}

export function buildDetroitDynamoAdminModuleWriteHandoffMarkdown(
  report = buildDetroitDynamoAdminModuleWriteContractReport(),
) {
  const lines = [
    '# Detroit Dynamo Admin Module Write Handoff',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `\`${report.functionId}\` is the authenticated Appwrite Function planned for protected Detroit Dynamo admin module writes. It keeps create, update, and archive mutations server-side, module-scoped, role-grant verified, and audit-event backed.`,
    '',
    `Every successful write must verify an active \`${report.roleAssignmentCollectionId}\` grant and append an \`${report.auditEventCollectionId}\` audit event before returning success.`,
    '',
    '## Supported Mutations',
    '',
    ...report.mutations.map((mutation) => `- ${mutation}`),
    '',
    '## Success Fixtures',
    '',
    '| Fixture | Module | Mutation | Action | Role | Collection | External Gate |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...report.successFixtures.map((fixture) => (
      `| ${fixture.label} | ${fixture.module} | ${fixture.mutation} | ${fixture.moduleAction} | ${fixture.actorRole} | ${fixture.collectionId} | ${fixture.externalGateConfirmed ? 'confirmed' : 'not required'} |`
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
    'The live admin should invoke this Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code, and do not write Detroit Dynamo admin-module documents directly from the browser.',
    '',
    '```json',
    JSON.stringify(report.successFixtures[0]?.requestBody || {}, null, 2),
    '```',
    '',
    '## Deployment Check',
    '',
    'Run `npm run verify:dynamo-admin-module-writes` before and after deploying the function. The script validates module/action coverage, role access, collection scoping, external-gate rejections, role-grant requirements, and audit-event writes without making network calls.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoAdminModuleWriteContract() {
  const issues = [];
  const successFixtures = buildDetroitDynamoAdminModuleWriteFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminModuleWriteRejectionFixtures();
  const validRoles = new Set(detroitDynamoAdminRoles);
  const collectionIds = new Set(detroitDynamoCollectionPlan.map((item) => item.collectionId));
  const externalGateModules = new Set(
    detroitDynamoAdminModuleRegistry
      .filter((item) => item.status === 'external_gate')
      .map((item) => item.slug),
  );

  if (detroitDynamoAdminModuleWriteFunctionId !== 'detroitDynamoAdminModuleWriteAction') {
    issues.push('Admin module write function id must stay detroitDynamoAdminModuleWriteAction.');
  }

  if (!collectionIds.has(detroitDynamoAdminRoleGrantAssignmentCollectionId)) {
    issues.push('Admin module writes require the trusted admin role assignment collection.');
  }

  if (!collectionIds.has(detroitDynamoAdminRoleGrantAuditCollectionId)) {
    issues.push('Admin module writes require the admin audit event collection.');
  }

  for (const modulePlan of detroitDynamoAdminModuleRegistry) {
    if (!modulePlan.slug) issues.push(`Admin module is missing slug: ${modulePlan.module}`);
    if (!modulePlan.collectionIds.length) issues.push(`Admin module is missing collections: ${modulePlan.module}`);
    if (!modulePlan.enabledActions.length) issues.push(`Admin module is missing enabled actions: ${modulePlan.module}`);
    for (const collectionId of modulePlan.collectionIds) {
      if (!collectionIds.has(collectionId)) {
        issues.push(`${modulePlan.module} references unknown collection ${collectionId}`);
      }
    }
  }

  for (const fixture of successFixtures) {
    const modulePlan = getModuleBySlug(fixture.moduleSlug);
    if (!modulePlan) {
      issues.push(`${fixture.id} references unknown module ${fixture.moduleSlug}`);
      continue;
    }
    if (!modulePlan.collectionIds.includes(fixture.collectionId)) {
      issues.push(`${fixture.id} collection ${fixture.collectionId} is not part of ${modulePlan.module}`);
    }
    if (!modulePlan.enabledActions.includes(fixture.moduleAction)) {
      issues.push(`${fixture.id} action ${fixture.moduleAction} is not enabled for ${modulePlan.module}`);
    }
    if (!detroitDynamoAdminModuleWriteMutations.includes(fixture.mutation)) {
      issues.push(`${fixture.id} uses unsupported mutation ${fixture.mutation}`);
    }
    if (!validRoles.has(fixture.actorRole)) {
      issues.push(`${fixture.id} uses unknown role ${fixture.actorRole}`);
    }
    if (!canDetroitDynamoRoleAccess(fixture.actorRole, modulePlan.module, fixture.requiredAccess)) {
      issues.push(`${fixture.id} actor role cannot perform ${fixture.requiredAccess} on ${modulePlan.module}`);
    }
    if (externalGateModules.has(fixture.moduleSlug) && !fixture.externalGateConfirmed) {
      issues.push(`${fixture.id} targets an external-gate module without confirmed evidence.`);
    }
    if (fixture.expectedResponse.function_id !== detroitDynamoAdminModuleWriteFunctionId || !fixture.expectedResponse.audit_event_id) {
      issues.push(`${fixture.id} expected response must include function id and audit event id.`);
    }
    if (fixture.expectedAuditEvent.collectionId !== detroitDynamoAdminRoleGrantAuditCollectionId) {
      issues.push(`${fixture.id} expected audit event targets the wrong collection.`);
    }
    if (fixture.expectedAuditEvent.target_model !== fixture.model) {
      issues.push(`${fixture.id} expected audit event targets the wrong model.`);
    }
  }

  const requiredRejections = [
    ['reject-unauthenticated-write', 401],
    ['reject-unassigned-role-write', 403],
    ['reject-role-without-write-access', 403],
    ['reject-external-gate-unconfirmed', 409],
    ['reject-collection-outside-module-write', 400],
    ['reject-update-without-record', 400],
    ['reject-invalid-module-action', 400],
  ];
  for (const [id, status] of requiredRejections) {
    const fixture = rejectionFixtures.find((item) => item.id === id);
    if (!fixture || fixture.expectedResponse.httpStatus !== status) {
      issues.push(`Admin module write rejection fixture ${id} must return ${status}.`);
    }
  }

  if (canDetroitDynamoRoleAccess('Coach', 'Payments/packages', 'contribute')) {
    issues.push('Coach must not be able to mutate Payments/packages through the module write contract.');
  }

  return issues;
}
