import {
  detroitDynamoAdminRoles,
  detroitDynamoExternalConfirmationRegister,
} from './detroitDynamoDataModel.js';

export const DETROIT_DYNAMO_EXTERNAL_CONFIRMATION_ACTION_STORAGE_KEY = 'detroit-dynamo-preview-external-confirmation-actions';

export const detroitDynamoExternalConfirmationActionTypes = [
  'attach_confirmation_evidence',
  'request_owner_signoff',
  'request_changes',
  'record_preview_decision',
  'reset_to_pending',
];

const actionStatusByType = {
  attach_confirmation_evidence: 'evidence_attached',
  request_owner_signoff: 'owner_signoff_requested',
  request_changes: 'changes_requested',
  record_preview_decision: 'preview_decision_recorded',
  reset_to_pending: 'pending_confirmation',
};

const confirmationByArea = new Map(
  detroitDynamoExternalConfirmationRegister.map((item) => [item.area, item]),
);

function cleanText(value, max = 20000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function readPreviewExternalConfirmationActions() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(DETROIT_DYNAMO_EXTERNAL_CONFIRMATION_ACTION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function writePreviewExternalConfirmationActions(actions) {
  if (typeof window === 'undefined') {
    throw new Error('Preview external confirmation storage requires a browser environment.');
  }

  window.localStorage.setItem(
    DETROIT_DYNAMO_EXTERNAL_CONFIRMATION_ACTION_STORAGE_KEY,
    JSON.stringify(actions.slice(0, 150)),
  );
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function getDetroitDynamoPreviewExternalConfirmationActions() {
  return readPreviewExternalConfirmationActions();
}

export function validateDetroitDynamoExternalConfirmationActionPayload(payload) {
  const confirmationArea = cleanText(payload?.confirmation_area || payload?.confirmationArea, 160);
  const confirmation = confirmationByArea.get(confirmationArea);
  const action = cleanText(payload?.action, 80);
  const actorRole = detroitDynamoAdminRoles.find((role) => role === cleanText(payload?.actor_role || payload?.actorRole, 100)) || '';
  const evidenceLabel = cleanText(payload?.evidence_label || payload?.evidenceLabel, 200);
  const artifactReference = cleanText(payload?.artifact_reference || payload?.artifactReference, 500);
  const note = cleanText(payload?.note, 2000);
  const errors = [];

  if (!confirmation) {
    errors.push('Choose a Detroit Dynamo external confirmation area.');
  }
  if (!detroitDynamoExternalConfirmationActionTypes.includes(action)) {
    errors.push('Choose a supported external confirmation action.');
  }
  if (!actorRole) {
    errors.push('Choose a planned Detroit Dynamo admin role.');
  }
  if (confirmation && actorRole && actorRole !== confirmation.ownerRole && actorRole !== 'Master Admin') {
    errors.push('Only the confirmation owner role or Master Admin can record this preview confirmation action.');
  }
  if (['attach_confirmation_evidence', 'request_owner_signoff', 'record_preview_decision'].includes(action) && !evidenceLabel) {
    errors.push('Evidence label is required for attach, owner signoff, and preview decision actions.');
  }
  if (['attach_confirmation_evidence', 'record_preview_decision'].includes(action) && !artifactReference) {
    errors.push('Artifact reference is required for attach and preview decision actions.');
  }
  if (action === 'request_changes' && !note) {
    errors.push('A note is required when requesting confirmation changes.');
  }

  return {
    ok: errors.length === 0,
    errors,
    confirmation,
    payload: {
      confirmation_area: confirmationArea,
      action,
      actor_role: actorRole,
      evidence_label: evidenceLabel,
      artifact_reference: artifactReference,
      note,
    },
  };
}

export function submitDetroitDynamoExternalConfirmationAction(payload) {
  const validated = validateDetroitDynamoExternalConfirmationActionPayload(payload);
  if (!validated.ok) {
    throw new Error(validated.errors[0] || 'Detroit Dynamo external confirmation action is invalid.');
  }

  const now = new Date().toISOString();
  const confirmation = validated.confirmation;
  const record = {
    id: `dd-external-confirmation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: actionStatusByType[validated.payload.action],
    destination: 'Local preview external confirmation ledger; this does not approve publication or clear promotion gates',
    live_gate_cleared: false,
    publication_unlocked: false,
    created_at: now,
    updated_at: now,
    owner_role: confirmation.ownerRole,
    register_status: confirmation.status,
    related_models: confirmation.relatedModels,
    required_facts: confirmation.requiredFacts,
    publish_rule: confirmation.publishRule,
    next_action: confirmation.nextAction,
    ...validated.payload,
  };

  writePreviewExternalConfirmationActions([record, ...readPreviewExternalConfirmationActions()]);
  return record;
}

export function clearDetroitDynamoPreviewExternalConfirmationActions() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DETROIT_DYNAMO_EXTERNAL_CONFIRMATION_ACTION_STORAGE_KEY);
}

export function buildDetroitDynamoExternalConfirmationActionCsv(actions) {
  const columns = [
    'id',
    'created_at',
    'status',
    'action',
    'confirmation_area',
    'register_status',
    'owner_role',
    'actor_role',
    'evidence_label',
    'artifact_reference',
    'live_gate_cleared',
    'publication_unlocked',
    'note',
  ];

  return [
    columns.join(','),
    ...actions.map((action) => columns.map((column) => csvEscape(action[column])).join(',')),
  ].join('\n');
}

export function buildDetroitDynamoExternalConfirmationActionSummary(actions = []) {
  const latestByArea = new Map();
  for (const action of actions) {
    if (!latestByArea.has(action.confirmation_area)) {
      latestByArea.set(action.confirmation_area, action);
    }
  }

  return {
    totalActions: actions.length,
    confirmationAreasTouched: latestByArea.size,
    ownerSignoffsRequested: actions.filter((action) => action.status === 'owner_signoff_requested').length,
    changesRequested: actions.filter((action) => action.status === 'changes_requested').length,
    previewDecisions: actions.filter((action) => action.status === 'preview_decision_recorded').length,
    liveGatesCleared: actions.filter((action) => action.live_gate_cleared).length,
    publicationsUnlocked: actions.filter((action) => action.publication_unlocked).length,
    latestByArea: Array.from(latestByArea.values()),
  };
}

export const detroitDynamoExternalConfirmationActionFixtures = [
  {
    confirmation_area: 'Payments & Packages',
    action: 'request_owner_signoff',
    actor_role: 'Master Admin',
    evidence_label: 'Draft package and provider matrix',
    artifact_reference: 'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
    note: 'Owner must approve exact prices and provider product ids before checkout exists.',
  },
  {
    confirmation_area: 'Waivers & Legal',
    action: 'attach_confirmation_evidence',
    actor_role: 'Registrar',
    evidence_label: 'Waiver version register draft',
    artifact_reference: 'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
    note: 'Preview artifact only; no signatures are enabled.',
  },
  {
    confirmation_area: 'League & Competition Facts',
    action: 'request_changes',
    actor_role: 'Club Director',
    evidence_label: 'League pathway wording',
    artifact_reference: '',
    note: 'Keep public copy future-pathway until official league documents exist.',
  },
  {
    confirmation_area: 'Facilities & Operations',
    action: 'record_preview_decision',
    actor_role: 'Club Director',
    evidence_label: 'Facility operations review rehearsal',
    artifact_reference: 'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
    note: 'Preview decision only; no facility name, address, or schedule is public-approved.',
  },
  {
    confirmation_area: 'Staff, Rosters & Safeguarding',
    action: 'request_owner_signoff',
    actor_role: 'Club Director',
    evidence_label: 'Staff and roster safeguarding review',
    artifact_reference: 'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
    note: 'Staff/roster proof stays gated until permissions and safeguarding evidence exist.',
  },
  {
    confirmation_area: 'Sponsors, Media & Content Proof',
    action: 'attach_confirmation_evidence',
    actor_role: 'Media/Admin Staff',
    evidence_label: 'Sponsor and media proof checklist',
    artifact_reference: 'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
    note: 'Proof slots remain placeholders until logo, media, and testimonial permissions are approved.',
  },
];

export function buildDetroitDynamoExternalConfirmationActionReport(
  payloads = detroitDynamoExternalConfirmationActionFixtures,
) {
  const actions = payloads.map((payload, index) => {
    const validated = validateDetroitDynamoExternalConfirmationActionPayload(payload);
    if (!validated.ok) {
      return {
        fixture_id: `invalid-${index}`,
        validation_errors: validated.errors,
      };
    }

    const confirmation = validated.confirmation;
    return {
      id: `fixture-external-confirmation-${index + 1}`,
      status: actionStatusByType[validated.payload.action],
      destination: 'Fixture preview external confirmation ledger; this does not approve publication or clear promotion gates',
      live_gate_cleared: false,
      publication_unlocked: false,
      created_at: `2026-05-29T00:1${index}:00.000Z`,
      updated_at: `2026-05-29T00:1${index}:00.000Z`,
      owner_role: confirmation.ownerRole,
      register_status: confirmation.status,
      related_models: confirmation.relatedModels,
      required_facts: confirmation.requiredFacts,
      publish_rule: confirmation.publishRule,
      next_action: confirmation.nextAction,
      ...validated.payload,
    };
  });
  const validActions = actions.filter((action) => !action.validation_errors);
  const summary = buildDetroitDynamoExternalConfirmationActionSummary(validActions);
  const csv = buildDetroitDynamoExternalConfirmationActionCsv(validActions);

  return {
    generatedAt: new Date().toISOString(),
    fixtures: payloads,
    actions,
    summary,
    csv,
    csvHeader: csv.split('\n')[0],
    issues: auditDetroitDynamoExternalConfirmationActionReport({ actions, summary, csvHeader: csv.split('\n')[0] }),
  };
}

export function auditDetroitDynamoExternalConfirmationActionReport(
  report = buildDetroitDynamoExternalConfirmationActionReport(),
) {
  const issues = [];
  const validActions = report.actions.filter((action) => !action.validation_errors);
  const requiredAreas = detroitDynamoExternalConfirmationRegister.map((item) => item.area);
  const representedAreas = new Set(validActions.map((action) => action.confirmation_area));

  if (validActions.length < requiredAreas.length) {
    issues.push('External confirmation action fixtures should cover every external confirmation area.');
  }
  for (const area of requiredAreas) {
    if (!representedAreas.has(area)) {
      issues.push(`External confirmation action fixtures are missing area: ${area}.`);
    }
  }
  for (const actionType of ['attach_confirmation_evidence', 'request_owner_signoff', 'request_changes', 'record_preview_decision']) {
    if (!validActions.some((action) => action.action === actionType)) {
      issues.push(`External confirmation action fixtures should cover ${actionType}.`);
    }
  }
  if (validActions.some((action) => action.live_gate_cleared)) {
    issues.push('Preview external confirmation actions must not clear live promotion gates.');
  }
  if (validActions.some((action) => action.publication_unlocked)) {
    issues.push('Preview external confirmation actions must not unlock public claims, checkout, signatures, noindex removal, or redirects.');
  }
  if (report.summary.liveGatesCleared !== 0) {
    issues.push('External confirmation action summary must report zero live gates cleared.');
  }
  if (report.summary.publicationsUnlocked !== 0) {
    issues.push('External confirmation action summary must report zero unlocked publications.');
  }
  if (report.csvHeader !== 'id,created_at,status,action,confirmation_area,register_status,owner_role,actor_role,evidence_label,artifact_reference,live_gate_cleared,publication_unlocked,note') {
    issues.push('External confirmation action CSV header is not stable.');
  }
  for (const action of report.actions) {
    if (action.validation_errors?.length) {
      issues.push(`External confirmation action fixture failed validation: ${action.validation_errors.join(', ')}`);
    }
  }

  return issues;
}

export function buildDetroitDynamoExternalConfirmationActionMarkdown(
  report = buildDetroitDynamoExternalConfirmationActionReport(),
) {
  return `# Detroit Dynamo External Confirmation Action Verification

- Generated at: ${report.generatedAt}
- Fixture actions: ${report.actions.length}
- Confirmation areas touched: ${report.summary.confirmationAreasTouched}
- Owner signoffs requested: ${report.summary.ownerSignoffsRequested}
- Changes requested: ${report.summary.changesRequested}
- Preview decisions recorded: ${report.summary.previewDecisions}
- Live gates cleared: ${report.summary.liveGatesCleared}
- Publications unlocked: ${report.summary.publicationsUnlocked}

These actions are preview-only. They rehearse payment, waiver, league, facility, staff, roster, sponsor, media, and SEO confirmation routing without approving launch, enabling checkout, collecting signatures, publishing claims, removing noindex, or applying redirects.
`;
}
