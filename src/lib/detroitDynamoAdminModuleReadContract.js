import {
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoCollectionPlan,
} from './detroitDynamoDataModel.js';
import {
  canDetroitDynamoRoleAccess,
} from './detroitDynamoAdminAccess.js';

export const detroitDynamoAdminModuleReadFunctionId = 'detroitDynamoAdminModuleRead';
export const detroitDynamoAdminModuleReadDefaultLimit = 25;
export const detroitDynamoAdminRoleAssignmentCollectionId = 'dd_admin_role_assignments';

const collectionPlanById = Object.fromEntries(
  detroitDynamoCollectionPlan.map((item) => [item.collectionId, item]),
);

const successFixtureSpecs = [
  {
    id: 'registrar-player-read',
    label: 'Registrar player pipeline read',
    moduleSlug: 'players',
    collectionId: 'dd_players',
    actorRole: 'Registrar',
  },
  {
    id: 'training-director-booking-read',
    label: 'Training director booking queue read',
    moduleSlug: 'training-bookings',
    collectionId: 'dd_bookings',
    actorRole: 'Training Director',
  },
  {
    id: 'media-sponsor-read',
    label: 'Media admin sponsor read',
    moduleSlug: 'sponsors',
    collectionId: 'dd_sponsors',
    actorRole: 'Media/Admin Staff',
  },
  {
    id: 'club-director-team-read',
    label: 'Club director team read',
    moduleSlug: 'teams',
    collectionId: 'dd_teams',
    actorRole: 'Club Director',
  },
  {
    id: 'team-manager-fixture-read',
    label: 'Team manager fixture read',
    moduleSlug: 'schedules-results',
    collectionId: 'dd_match_fixtures',
    actorRole: 'Team Manager',
  },
  {
    id: 'master-admin-payment-read',
    label: 'Master admin payment readiness read',
    moduleSlug: 'payments-packages',
    collectionId: 'dd_payments',
    actorRole: 'Master Admin',
  },
];

const rejectionFixtureSpecs = [
  {
    id: 'reject-unauthenticated-read',
    label: 'Reject unauthenticated module read',
    moduleSlug: 'contact-leads',
    collectionId: 'dd_contact_leads',
    actorRole: 'Media/Admin Staff',
    expectedStatus: 401,
    expectedError: 'Detroit Dynamo admin module read requires an authenticated Appwrite user.',
    reason: 'Protected admin data must only be read from an authenticated Appwrite user session.',
  },
  {
    id: 'reject-invalid-module',
    label: 'Reject unknown module',
    moduleSlug: 'unknown-module',
    collectionId: 'dd_contact_leads',
    actorRole: 'Media/Admin Staff',
    expectedStatus: 404,
    expectedError: 'Detroit Dynamo admin module was not found.',
    reason: 'The request must target one of the planned protected Detroit Dynamo admin modules.',
  },
  {
    id: 'reject-role-without-view',
    label: 'Reject coach payment read',
    moduleSlug: 'payments-packages',
    collectionId: 'dd_payments',
    actorRole: 'Coach',
    expectedStatus: 403,
    expectedError: 'Actor role does not have view access to this Detroit Dynamo admin module.',
    reason: 'Coaches cannot view payment or package administration records.',
  },
  {
    id: 'reject-role-not-assigned',
    label: 'Reject unassigned role',
    moduleSlug: 'players',
    collectionId: 'dd_players',
    actorRole: 'Registrar',
    expectedStatus: 403,
    expectedError: 'Actor role is not assigned to this authenticated Appwrite user.',
    reason: 'A caller cannot self-assert a valid role unless dd_admin_role_assignments has an active grant for that Appwrite user.',
  },
  {
    id: 'reject-collection-outside-module',
    label: 'Reject collection outside module',
    moduleSlug: 'sponsors',
    collectionId: 'dd_players',
    actorRole: 'Media/Admin Staff',
    expectedStatus: 400,
    expectedError: 'collection_id must belong to the requested Detroit Dynamo admin module.',
    reason: 'A module read cannot use the Sponsors permission surface to read unrelated player records.',
  },
];

function getModuleBySlug(moduleSlug) {
  return detroitDynamoAdminModuleRegistry.find((item) => item.slug === moduleSlug) || null;
}

function buildRequestBody(spec) {
  return {
    module_slug: spec.moduleSlug,
    collection_id: spec.collectionId,
    actor_role: spec.actorRole,
    limit: detroitDynamoAdminModuleReadDefaultLimit,
    cursor: '',
  };
}

function collectionModel(collectionId) {
  return collectionPlanById[collectionId]?.model || '';
}

function buildSuccessFixture(spec) {
  const modulePlan = getModuleBySlug(spec.moduleSlug);

  return {
    id: spec.id,
    label: spec.label,
    module: modulePlan?.module || spec.moduleSlug,
    moduleSlug: spec.moduleSlug,
    collectionId: spec.collectionId,
    model: collectionModel(spec.collectionId),
    actorRole: spec.actorRole,
    requiredAuth: 'Appwrite authenticated user execution',
    requestBody: buildRequestBody(spec),
    expectedResponse: {
      httpStatus: 200,
      success: true,
      function_id: detroitDynamoAdminModuleReadFunctionId,
      function_execute_permission: 'users',
      module_slug: spec.moduleSlug,
      module: modulePlan?.module || spec.moduleSlug,
      actor_role: spec.actorRole,
      actor_user_id: 'authenticated Appwrite user id',
      role_assignment_id: 'active dd_admin_role_assignments document id',
      limit: detroitDynamoAdminModuleReadDefaultLimit,
      collections: [
        {
          collection_id: spec.collectionId,
          model: collectionModel(spec.collectionId),
          total: 'Appwrite listDocuments total',
          documents: `Up to ${detroitDynamoAdminModuleReadDefaultLimit} sanitized documents`,
        },
      ],
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
    requestBody: buildRequestBody(spec),
    expectedResponse: {
      httpStatus: spec.expectedStatus,
      error: spec.expectedError,
    },
    reason: spec.reason,
  };
}

export function buildDetroitDynamoAdminModuleReadFixtures() {
  return successFixtureSpecs.map(buildSuccessFixture);
}

export function buildDetroitDynamoAdminModuleReadRejectionFixtures() {
  return rejectionFixtureSpecs.map(buildRejectionFixture);
}

export function buildDetroitDynamoAdminModuleReadContractReport() {
  const successFixtures = buildDetroitDynamoAdminModuleReadFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminModuleReadRejectionFixtures();
  const issues = auditDetroitDynamoAdminModuleReadContract();

  return {
    generatedAt: new Date().toISOString(),
    functionId: detroitDynamoAdminModuleReadFunctionId,
    functionExecutePermission: 'users',
    defaultLimit: detroitDynamoAdminModuleReadDefaultLimit,
    roleAssignmentCollectionId: detroitDynamoAdminRoleAssignmentCollectionId,
    supportedModules: detroitDynamoAdminModuleRegistry.map((item) => ({
      module: item.module,
      slug: item.slug,
      ownerRoles: item.ownerRoles,
      collectionIds: item.collectionIds,
    })),
    successFixtures,
    rejectionFixtures,
    issues,
  };
}

export function buildDetroitDynamoAdminModuleReadHandoffMarkdown(
  report = buildDetroitDynamoAdminModuleReadContractReport(),
) {
  const lines = [
    '# Detroit Dynamo Admin Module Read Handoff',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '`detroitDynamoAdminModuleRead` is the authenticated Appwrite Function planned for protected admin module reads once the Detroit Dynamo `dd_*` collections exist. It keeps read access server-side, role-gated, and scoped to the requested module collections.',
    '',
    `The caller may request an \`actor_role\`, but the function must verify it against an active \`${report.roleAssignmentCollectionId}\` grant for the authenticated Appwrite user before returning records.`,
    '',
    `Execution: \`${report.functionExecutePermission}\` only. Default limit: ${report.defaultLimit}.`,
    '',
    '## Supported Modules',
    '',
    '| Module | Slug | Collections | Owner Roles |',
    '| --- | --- | --- | --- |',
    ...report.supportedModules.map((item) => (
      `| ${item.module} | ${item.slug} | ${item.collectionIds.join(', ')} | ${item.ownerRoles.join(', ')} |`
    )),
    '',
    '## Success Fixtures',
    '',
    '| Fixture | Module | Collection | Actor Role | Role Grant | Expected Result |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.successFixtures.map((fixture) => (
      `| ${fixture.label} | ${fixture.module} | ${fixture.collectionId} | ${fixture.actorRole} | ${fixture.expectedResponse.role_assignment_id} | ${fixture.expectedResponse.collections[0].documents} |`
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
    'The live admin should invoke the Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code, and do not treat client-supplied roles as trusted unless the function confirms an active role assignment.',
    '',
    '```json',
    JSON.stringify(report.successFixtures[0]?.requestBody || {}, null, 2),
    '```',
    '',
    '## Deployment Check',
    '',
    'Run `npm run verify:dynamo-admin-module-read` before and after deploying the function. The script validates module coverage, collection scoping, role access, and rejection fixtures without making network calls.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoAdminModuleReadContract() {
  const issues = [];
  const successFixtures = buildDetroitDynamoAdminModuleReadFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminModuleReadRejectionFixtures();
  const validRoles = new Set(detroitDynamoAdminRoles);
  const collectionIds = new Set(detroitDynamoCollectionPlan.map((item) => item.collectionId));
  const roleAssignmentCollection = detroitDynamoCollectionPlan.find((item) => item.model === 'AdminRoleAssignment');

  if (detroitDynamoAdminModuleReadFunctionId !== 'detroitDynamoAdminModuleRead') {
    issues.push('Admin module read function id must stay detroitDynamoAdminModuleRead.');
  }

  if (detroitDynamoAdminModuleReadDefaultLimit !== 25) {
    issues.push('Admin module read default limit must stay capped at 25 for launch safety.');
  }

  if (!roleAssignmentCollection || roleAssignmentCollection.collectionId !== detroitDynamoAdminRoleAssignmentCollectionId) {
    issues.push('Admin module reads require the dd_admin_role_assignments AdminRoleAssignment collection.');
  }

  for (const modulePlan of detroitDynamoAdminModuleRegistry) {
    if (!modulePlan.slug) issues.push(`Admin module is missing slug: ${modulePlan.module}`);
    if (!modulePlan.collectionIds.length) issues.push(`Admin module is missing collections: ${modulePlan.module}`);
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
    if (!validRoles.has(fixture.actorRole)) {
      issues.push(`${fixture.id} uses an unknown role: ${fixture.actorRole}`);
    }
    if (!canDetroitDynamoRoleAccess(fixture.actorRole, modulePlan.module, 'view')) {
      issues.push(`${fixture.id} actor role cannot view ${modulePlan.module}`);
    }
    if (fixture.requestBody.limit > detroitDynamoAdminModuleReadDefaultLimit) {
      issues.push(`${fixture.id} exceeds the read limit cap`);
    }
    if (fixture.expectedResponse.httpStatus !== 200 || !fixture.expectedResponse.success) {
      issues.push(`${fixture.id} expected response must be a successful 200`);
    }
    if (!fixture.expectedResponse.actor_user_id || fixture.expectedResponse.function_id !== detroitDynamoAdminModuleReadFunctionId) {
      issues.push(`${fixture.id} expected response is missing authenticated function context`);
    }
    if (!fixture.expectedResponse.role_assignment_id) {
      issues.push(`${fixture.id} expected response is missing role_assignment_id`);
    }
  }

  const requiredRejections = [
    ['reject-unauthenticated-read', 401],
    ['reject-invalid-module', 404],
    ['reject-role-without-view', 403],
    ['reject-role-not-assigned', 403],
    ['reject-collection-outside-module', 400],
  ];
  for (const [id, status] of requiredRejections) {
    const fixture = rejectionFixtures.find((item) => item.id === id);
    if (!fixture || fixture.expectedResponse.httpStatus !== status) {
      issues.push(`Admin module read rejection fixture ${id} must return ${status}`);
    }
  }

  if (canDetroitDynamoRoleAccess('Coach', 'Payments/packages', 'view')) {
    issues.push('Coach must not be able to read Payments/packages through the module read contract.');
  }

  return issues;
}
