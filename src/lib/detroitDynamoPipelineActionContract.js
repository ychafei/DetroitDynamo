import {
  detroitDynamoAdminRoles,
  detroitDynamoCollectionPlan,
  detroitDynamoLeadPipelineStages,
} from './detroitDynamoDataModel.js';
import {
  canDetroitDynamoLeadPipelineTransition,
  getDetroitDynamoLeadPipelineStage,
  getDetroitDynamoLeadPipelineTransitions,
} from './detroitDynamoLeadPipeline.js';

export const detroitDynamoPipelineActionModels = [
  'ContactLead',
  'Booking',
  'TryoutRegistration',
  'Sponsor',
];

export const detroitDynamoPipelineActionCollectionByModel = Object.fromEntries(
  detroitDynamoPipelineActionModels.map((model) => [
    model,
    detroitDynamoCollectionPlan.find((item) => item.model === model)?.collectionId || '',
  ]),
);

export const detroitDynamoPipelineActionAuditCollectionId = (
  detroitDynamoCollectionPlan.find((item) => item.model === 'AdminAuditEvent')?.collectionId || ''
);

const ownerRoleByModel = {
  ContactLead: 'Media/Admin Staff',
  Booking: 'Training Director',
  TryoutRegistration: 'Registrar',
  Sponsor: 'Media/Admin Staff',
};

const fixtureSpecs = [
  {
    id: 'contact-new-to-triaged',
    label: 'General contact lead triage',
    model: 'ContactLead',
    leadType: 'contact',
    currentStatus: 'new',
    nextStatus: 'triaged',
    actorRole: 'Media/Admin Staff',
    note: 'Validated contact route, source, and preferred callback window.',
  },
  {
    id: 'training-contacted-to-package',
    label: 'Training booking package discussion',
    model: 'Booking',
    leadType: 'training',
    currentStatus: 'contacted',
    nextStatus: 'package_discussion',
    actorRole: 'Training Director',
    note: 'Family asked for private training package options after first contact.',
  },
  {
    id: 'tryout-contacted-to-evaluation',
    label: 'Tryout registration evaluation scheduled',
    model: 'TryoutRegistration',
    leadType: 'tryout',
    currentStatus: 'contacted',
    nextStatus: 'evaluation_scheduled',
    actorRole: 'Registrar',
    note: 'Player evaluation window confirmed with guardian.',
  },
  {
    id: 'sponsor-contacted-to-package',
    label: 'Sponsor inquiry package discussion',
    model: 'Sponsor',
    leadType: 'sponsor',
    currentStatus: 'contacted',
    nextStatus: 'package_discussion',
    actorRole: 'Media/Admin Staff',
    note: 'Local business requested founding sponsor inventory and logo rules.',
  },
  {
    id: 'duplicate-contact-closed',
    label: 'Duplicate contact merge',
    model: 'ContactLead',
    leadType: 'contact',
    currentStatus: 'new',
    nextStatus: 'closed_duplicate',
    actorRole: 'Media/Admin Staff',
    note: 'Merged duplicate submission into the oldest active lead record.',
  },
  {
    id: 'no-show-reopened',
    label: 'No-show evaluation rescheduled',
    model: 'TryoutRegistration',
    leadType: 'youth',
    currentStatus: 'closed_no_show',
    nextStatus: 'evaluation_scheduled',
    actorRole: 'Registrar',
    note: 'Guardian requested one reschedule after missed evaluation.',
  },
];

const rejectionSpecs = [
  {
    id: 'reject-unauthenticated',
    label: 'Reject unauthenticated action',
    model: 'ContactLead',
    leadType: 'contact',
    currentStatus: 'new',
    nextStatus: 'triaged',
    actorRole: 'Media/Admin Staff',
    expectedStatus: 401,
    expectedError: 'Detroit Dynamo pipeline action requires an authenticated Appwrite user.',
    reason: 'The function must receive the authenticated Appwrite user header from a protected session.',
  },
  {
    id: 'reject-invalid-transition',
    label: 'Reject disallowed transition',
    model: 'TryoutRegistration',
    leadType: 'tryout',
    currentStatus: 'new',
    nextStatus: 'converted',
    actorRole: 'Registrar',
    expectedStatus: 409,
    expectedError: 'Pipeline transition is not allowed',
    reason: 'New intake cannot skip triage, contact, scheduling, and invite or close review.',
  },
  {
    id: 'reject-unsupported-model',
    label: 'Reject unsupported collection target',
    model: 'Player',
    leadType: 'tryout',
    currentStatus: 'new',
    nextStatus: 'triaged',
    actorRole: 'Registrar',
    expectedStatus: 400,
    expectedError: 'model or collection_id must target a pipeline-backed Detroit Dynamo collection',
    reason: 'Only ContactLead, Booking, TryoutRegistration, and Sponsor are directly pipeline-backed.',
  },
];

function collectionIdForModel(model) {
  return detroitDynamoPipelineActionCollectionByModel[model] || '';
}

function recordIdForSpec(spec) {
  return `preview_${spec.id.replaceAll('-', '_')}`;
}

function buildRequestBody(spec) {
  const collectionId = collectionIdForModel(spec.model);
  return {
    model: spec.model,
    collection_id: collectionId,
    record_id: recordIdForSpec(spec),
    next_status: spec.nextStatus,
    actor_role: spec.actorRole,
    owner_role: spec.ownerRole || ownerRoleByModel[spec.model] || spec.actorRole,
    note: spec.note || getDetroitDynamoLeadPipelineStage(spec.nextStatus).ownerAction,
  };
}

function buildCurrentRecord(spec) {
  const currentStage = getDetroitDynamoLeadPipelineStage(spec.currentStatus);
  return {
    $id: recordIdForSpec(spec),
    pipeline_status: spec.currentStatus,
    pipeline_owner_role: spec.ownerRole || ownerRoleByModel[spec.model] || spec.actorRole,
    pipeline_due_at: '2026-05-28T20:00:00.000Z',
    pipeline_updated_at: '2026-05-28T16:00:00.000Z',
    pipeline_last_note: currentStage.ownerAction,
    pipeline_event_count: 0,
  };
}

function buildSuccessFixture(spec) {
  const nextStage = getDetroitDynamoLeadPipelineStage(spec.nextStatus);
  const ownerRole = spec.ownerRole || ownerRoleByModel[spec.model] || spec.actorRole;
  return {
    id: spec.id,
    label: spec.label,
    model: spec.model,
    collectionId: collectionIdForModel(spec.model),
    leadType: spec.leadType,
    currentStatus: spec.currentStatus,
    nextStatus: spec.nextStatus,
    allowedNextStatuses: getDetroitDynamoLeadPipelineTransitions(spec.currentStatus),
    requiredAuth: 'Appwrite authenticated user execution',
    requestBody: buildRequestBody(spec),
    currentRecordFixture: buildCurrentRecord(spec),
    expectedResponse: {
      httpStatus: 200,
      success: true,
      from_status: spec.currentStatus,
      to_status: spec.nextStatus,
      actor_role: spec.actorRole,
      owner_role: ownerRole,
      pipeline_event_count: 1,
      audit_event_id: 'created dd_admin_audit_events document id',
    },
    expectedUpdatedFields: {
      pipeline_status: spec.nextStatus,
      pipeline_owner_role: ownerRole,
      pipeline_due_at: `now + ${nextStage.maxAgeHours}h`,
      pipeline_updated_at: 'now',
      pipeline_last_note: buildRequestBody(spec).note,
      pipeline_event_count: 'previous + 1',
      updated_at: 'now',
    },
    expectedAuditEvent: {
      collectionId: detroitDynamoPipelineActionAuditCollectionId,
      action: 'pipeline_status_transition',
      actor_user_id: 'authenticated Appwrite user id',
      actor_role: spec.actorRole,
      target_model: spec.model,
      target_collection_id: collectionIdForModel(spec.model),
      target_record_id: recordIdForSpec(spec),
      previous_status: spec.currentStatus,
      next_status: spec.nextStatus,
      metadata_json: 'owner role and note JSON',
      created_at: 'now',
    },
  };
}

function buildRejectionFixture(spec) {
  return {
    id: spec.id,
    label: spec.label,
    model: spec.model,
    collectionId: collectionIdForModel(spec.model),
    leadType: spec.leadType,
    currentStatus: spec.currentStatus,
    nextStatus: spec.nextStatus,
    requestBody: buildRequestBody(spec),
    currentRecordFixture: buildCurrentRecord(spec),
    expectedResponse: {
      httpStatus: spec.expectedStatus,
      error: spec.expectedError,
    },
    reason: spec.reason,
  };
}

export function buildDetroitDynamoPipelineActionFixtures() {
  return fixtureSpecs.map(buildSuccessFixture);
}

export function buildDetroitDynamoPipelineActionRejectionFixtures() {
  return rejectionSpecs.map(buildRejectionFixture);
}

export function buildDetroitDynamoPipelineActionContractReport() {
  const successFixtures = buildDetroitDynamoPipelineActionFixtures();
  const rejectionFixtures = buildDetroitDynamoPipelineActionRejectionFixtures();
  const issues = auditDetroitDynamoPipelineActionContract();

  return {
    generatedAt: new Date().toISOString(),
    functionId: 'detroitDynamoLeadPipelineAction',
    functionExecutePermission: 'users',
    auditEventCollectionId: detroitDynamoPipelineActionAuditCollectionId,
    supportedModels: detroitDynamoPipelineActionModels.map((model) => ({
      model,
      collectionId: collectionIdForModel(model),
      ownerRole: ownerRoleByModel[model],
    })),
    successFixtures,
    rejectionFixtures,
    issues,
  };
}

export function buildDetroitDynamoPipelineActionHandoffMarkdown(report = buildDetroitDynamoPipelineActionContractReport()) {
  const lines = [
    '# Detroit Dynamo Pipeline Action Handoff',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '`detroitDynamoLeadPipelineAction` is the authenticated Appwrite Function planned for admin status changes on pipeline-backed Detroit Dynamo records. These fixtures keep the preview admin, Appwrite schema, and future live dashboard aligned before credentials are used.',
    '',
    `Every successful transition must also append an audit event to \`${report.auditEventCollectionId}\` before the action is treated as complete.`,
    '',
    '## Supported Models',
    '',
    '| Model | Collection | Default Owner |',
    '| --- | --- | --- |',
    ...report.supportedModels.map((item) => `| ${item.model} | ${item.collectionId} | ${item.ownerRole} |`),
    '',
    '## Success Fixtures',
    '',
    '| Fixture | Model | Current | Next | Owner | Expected Update |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.successFixtures.map((fixture) => (
      `| ${fixture.label} | ${fixture.model} | ${fixture.currentStatus} | ${fixture.nextStatus} | ${fixture.requestBody.owner_role} | ${Object.keys(fixture.expectedUpdatedFields).join(', ')} |`
    )),
    '',
    '## Audit Event Shape',
    '',
    '| Collection | Action | Actor | Target | Status Change |',
    '| --- | --- | --- | --- | --- |',
    ...report.successFixtures.map((fixture) => (
      `| ${fixture.expectedAuditEvent.collectionId} | ${fixture.expectedAuditEvent.action} | ${fixture.expectedAuditEvent.actor_role} | ${fixture.expectedAuditEvent.target_model}.${fixture.expectedAuditEvent.target_record_id} | ${fixture.expectedAuditEvent.previous_status} to ${fixture.expectedAuditEvent.next_status} |`
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
    'The live admin should invoke the Appwrite Function as an authenticated dashboard user. Do not expose `APPWRITE_API_KEY` in client code.',
    '',
    '```json',
    JSON.stringify(report.successFixtures[0]?.requestBody || {}, null, 2),
    '```',
    '',
    '## Deployment Check',
    '',
    'Run `npm run verify:dynamo-pipeline-actions` before and after deploying the function. The script validates fixture coverage, allowed transitions, planned roles, pipeline-backed collections, and audit-event writes without making network calls.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoPipelineActionContract() {
  const issues = [];
  const supportedModels = new Set(detroitDynamoPipelineActionModels);
  const validRoles = new Set(detroitDynamoAdminRoles);
  const validStatuses = new Set(detroitDynamoLeadPipelineStages.map((stage) => stage.status));
  const successFixtures = buildDetroitDynamoPipelineActionFixtures();
  const rejectionFixtures = buildDetroitDynamoPipelineActionRejectionFixtures();
  const auditCollection = detroitDynamoCollectionPlan.find((item) => item.model === 'AdminAuditEvent');

  if (!auditCollection || auditCollection.collectionId !== 'dd_admin_audit_events') {
    issues.push('Pipeline actions require the dd_admin_audit_events AdminAuditEvent collection');
  }

  for (const model of detroitDynamoPipelineActionModels) {
    if (!collectionIdForModel(model)) {
      issues.push(`Pipeline action model ${model} is missing a collection id`);
    }
    if (!successFixtures.some((fixture) => fixture.model === model)) {
      issues.push(`Pipeline action model ${model} is missing a success fixture`);
    }
  }

  for (const fixture of successFixtures) {
    if (!supportedModels.has(fixture.model)) {
      issues.push(`${fixture.id} targets unsupported model ${fixture.model}`);
    }
    if (!fixture.collectionId || fixture.collectionId !== fixture.requestBody.collection_id) {
      issues.push(`${fixture.id} has mismatched collection id`);
    }
    if (!validStatuses.has(fixture.currentStatus) || !validStatuses.has(fixture.nextStatus)) {
      issues.push(`${fixture.id} references an unknown pipeline status`);
    }
    if (!canDetroitDynamoLeadPipelineTransition(fixture.currentStatus, fixture.nextStatus)) {
      issues.push(`${fixture.id} transition ${fixture.currentStatus} -> ${fixture.nextStatus} is not allowed`);
    }
    if (!validRoles.has(fixture.requestBody.actor_role) || !validRoles.has(fixture.requestBody.owner_role)) {
      issues.push(`${fixture.id} references an unknown Detroit Dynamo admin role`);
    }
    for (const key of ['model', 'collection_id', 'record_id', 'next_status', 'actor_role', 'owner_role', 'note']) {
      if (!fixture.requestBody[key]) {
        issues.push(`${fixture.id} request body is missing ${key}`);
      }
    }
    for (const key of ['pipeline_status', 'pipeline_owner_role', 'pipeline_due_at', 'pipeline_updated_at', 'pipeline_last_note', 'pipeline_event_count', 'updated_at']) {
      if (!Object.hasOwn(fixture.expectedUpdatedFields, key)) {
        issues.push(`${fixture.id} expected update is missing ${key}`);
      }
    }
    if (!fixture.expectedResponse.audit_event_id) {
      issues.push(`${fixture.id} expected response is missing audit_event_id`);
    }
    for (const key of ['collectionId', 'action', 'actor_user_id', 'actor_role', 'target_model', 'target_collection_id', 'target_record_id', 'previous_status', 'next_status', 'metadata_json', 'created_at']) {
      if (!fixture.expectedAuditEvent?.[key]) {
        issues.push(`${fixture.id} expected audit event is missing ${key}`);
      }
    }
    if (fixture.expectedAuditEvent?.collectionId !== detroitDynamoPipelineActionAuditCollectionId) {
      issues.push(`${fixture.id} expected audit event targets the wrong collection`);
    }
  }

  const invalidTransitionFixture = rejectionFixtures.find((fixture) => fixture.id === 'reject-invalid-transition');
  if (!invalidTransitionFixture || canDetroitDynamoLeadPipelineTransition(
    invalidTransitionFixture.currentStatus,
    invalidTransitionFixture.nextStatus,
  )) {
    issues.push('Invalid-transition rejection fixture must use a disallowed pipeline transition');
  }

  const unsupportedFixture = rejectionFixtures.find((fixture) => fixture.id === 'reject-unsupported-model');
  if (!unsupportedFixture || supportedModels.has(unsupportedFixture.model)) {
    issues.push('Unsupported-model rejection fixture must target a non-pipeline-backed model');
  }

  return issues;
}
