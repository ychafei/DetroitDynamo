import { detroitDynamoAdminRoles } from './detroitDynamoDataModel.js';
import { detroitDynamoLaunchEvidenceChecklist } from './detroitDynamoLaunchEvidenceContract.js';

export const DETROIT_DYNAMO_LAUNCH_EVIDENCE_ACTION_STORAGE_KEY = 'detroit-dynamo-preview-launch-evidence-actions';

export const detroitDynamoLaunchEvidenceActionTypes = [
  'attach_evidence',
  'request_owner_review',
  'request_changes',
  'record_preview_signoff',
  'reset_to_needed',
];

const actionStatusByType = {
  attach_evidence: 'evidence_attached',
  request_owner_review: 'owner_review_requested',
  request_changes: 'changes_requested',
  record_preview_signoff: 'preview_signoff_recorded',
  reset_to_needed: 'evidence_needed',
};

const launchEvidenceById = new Map(detroitDynamoLaunchEvidenceChecklist.map((item) => [item.id, item]));

function cleanText(value, max = 20000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function readPreviewLaunchEvidenceActions() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(DETROIT_DYNAMO_LAUNCH_EVIDENCE_ACTION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function writePreviewLaunchEvidenceActions(actions) {
  if (typeof window === 'undefined') {
    throw new Error('Preview launch evidence storage requires a browser environment.');
  }

  window.localStorage.setItem(
    DETROIT_DYNAMO_LAUNCH_EVIDENCE_ACTION_STORAGE_KEY,
    JSON.stringify(actions.slice(0, 150)),
  );
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function getDetroitDynamoPreviewLaunchEvidenceActions() {
  return readPreviewLaunchEvidenceActions();
}

export function validateDetroitDynamoLaunchEvidenceActionPayload(payload) {
  const checklistItemId = cleanText(payload?.checklist_item_id || payload?.checklistItemId, 120);
  const checklistItem = launchEvidenceById.get(checklistItemId);
  const action = cleanText(payload?.action, 80);
  const actorRole = detroitDynamoAdminRoles.find((role) => role === cleanText(payload?.actor_role || payload?.actorRole, 100)) || '';
  const evidenceLabel = cleanText(payload?.evidence_label || payload?.evidenceLabel, 200);
  const artifactReference = cleanText(payload?.artifact_reference || payload?.artifactReference, 500);
  const note = cleanText(payload?.note, 2000);
  const errors = [];

  if (!checklistItem) {
    errors.push('Choose a Detroit Dynamo launch evidence checklist item.');
  }
  if (!detroitDynamoLaunchEvidenceActionTypes.includes(action)) {
    errors.push('Choose a supported launch evidence action.');
  }
  if (!actorRole) {
    errors.push('Choose a planned Detroit Dynamo admin role.');
  }
  if (checklistItem && actorRole && actorRole !== checklistItem.ownerRole && actorRole !== 'Master Admin') {
    errors.push('Only the checklist owner role or Master Admin can record this preview evidence action.');
  }
  if (['attach_evidence', 'request_owner_review', 'record_preview_signoff'].includes(action) && !evidenceLabel) {
    errors.push('Evidence label is required for attach, review, and preview signoff actions.');
  }
  if (['attach_evidence', 'record_preview_signoff'].includes(action) && !artifactReference) {
    errors.push('Artifact reference is required for attach and preview signoff actions.');
  }
  if (action === 'request_changes' && !note) {
    errors.push('A note is required when requesting evidence changes.');
  }

  return {
    ok: errors.length === 0,
    errors,
    checklistItem,
    payload: {
      checklist_item_id: checklistItemId,
      action,
      actor_role: actorRole,
      evidence_label: evidenceLabel,
      artifact_reference: artifactReference,
      note,
    },
  };
}

export function submitDetroitDynamoLaunchEvidenceAction(payload) {
  const validated = validateDetroitDynamoLaunchEvidenceActionPayload(payload);
  if (!validated.ok) {
    throw new Error(validated.errors[0] || 'Detroit Dynamo launch evidence action is invalid.');
  }

  const now = new Date().toISOString();
  const checklistItem = validated.checklistItem;
  const record = {
    id: `dd-launch-evidence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: actionStatusByType[validated.payload.action],
    destination: 'Local preview launch evidence ledger; this does not clear promotion gates',
    live_gate_cleared: false,
    created_at: now,
    updated_at: now,
    promotion_gate: checklistItem.promotionGate,
    confirmation_area: checklistItem.confirmationArea,
    owner_role: checklistItem.ownerRole,
    required_artifact: checklistItem.requiredArtifact,
    blocked_actions: checklistItem.blocksActions,
    ...validated.payload,
  };

  writePreviewLaunchEvidenceActions([record, ...readPreviewLaunchEvidenceActions()]);
  return record;
}

export function clearDetroitDynamoPreviewLaunchEvidenceActions() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DETROIT_DYNAMO_LAUNCH_EVIDENCE_ACTION_STORAGE_KEY);
}

export function buildDetroitDynamoLaunchEvidenceActionCsv(actions) {
  const columns = [
    'id',
    'created_at',
    'status',
    'action',
    'checklist_item_id',
    'promotion_gate',
    'confirmation_area',
    'owner_role',
    'actor_role',
    'evidence_label',
    'artifact_reference',
    'live_gate_cleared',
    'note',
  ];

  return [
    columns.join(','),
    ...actions.map((action) => columns.map((column) => csvEscape(action[column])).join(',')),
  ].join('\n');
}

export function buildDetroitDynamoLaunchEvidenceActionSummary(actions = []) {
  const latestByItem = new Map();
  for (const action of actions) {
    if (!latestByItem.has(action.checklist_item_id)) {
      latestByItem.set(action.checklist_item_id, action);
    }
  }

  return {
    totalActions: actions.length,
    checklistItemsTouched: latestByItem.size,
    previewSignoffs: actions.filter((action) => action.status === 'preview_signoff_recorded').length,
    changesRequested: actions.filter((action) => action.status === 'changes_requested').length,
    liveGatesCleared: actions.filter((action) => action.live_gate_cleared).length,
    latestByItem: Array.from(latestByItem.values()),
  };
}

export const detroitDynamoLaunchEvidenceActionFixtures = [
  {
    checklist_item_id: 'current-site-route-snapshot',
    action: 'attach_evidence',
    actor_role: 'Master Admin',
    evidence_label: 'Current route smoke and rollback snapshot',
    artifact_reference: 'artifacts/detroit-dynamo/goal-audit.json',
    note: 'Preview evidence only.',
  },
  {
    checklist_item_id: 'payment-package-approval',
    action: 'request_owner_review',
    actor_role: 'Master Admin',
    evidence_label: 'Draft package matrix',
    artifact_reference: 'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
    note: 'Owner must approve exact pricing before checkout.',
  },
  {
    checklist_item_id: 'league-competition-confirmation',
    action: 'request_changes',
    actor_role: 'Club Director',
    evidence_label: 'League pathway wording',
    artifact_reference: '',
    note: 'Keep future-pathway copy until official league documents exist.',
  },
  {
    checklist_item_id: 'seo-metadata-noindex-approval',
    action: 'record_preview_signoff',
    actor_role: 'Media/Admin Staff',
    evidence_label: 'SEO review rehearsal',
    artifact_reference: 'artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml',
    note: 'Preview signoff only; noindex stays in place.',
  },
];

export function buildDetroitDynamoLaunchEvidenceActionReport(payloads = detroitDynamoLaunchEvidenceActionFixtures) {
  const actions = payloads.map((payload, index) => {
    const validated = validateDetroitDynamoLaunchEvidenceActionPayload(payload);
    if (!validated.ok) {
      return {
        fixture_id: `invalid-${index}`,
        validation_errors: validated.errors,
      };
    }

    const checklistItem = validated.checklistItem;
    return {
      id: `fixture-launch-evidence-${index + 1}`,
      status: actionStatusByType[validated.payload.action],
      destination: 'Fixture preview launch evidence ledger; this does not clear promotion gates',
      live_gate_cleared: false,
      created_at: `2026-05-29T00:0${index}:00.000Z`,
      updated_at: `2026-05-29T00:0${index}:00.000Z`,
      promotion_gate: checklistItem.promotionGate,
      confirmation_area: checklistItem.confirmationArea,
      owner_role: checklistItem.ownerRole,
      required_artifact: checklistItem.requiredArtifact,
      blocked_actions: checklistItem.blocksActions,
      ...validated.payload,
    };
  });
  const summary = buildDetroitDynamoLaunchEvidenceActionSummary(actions.filter((action) => !action.validation_errors));
  const csv = buildDetroitDynamoLaunchEvidenceActionCsv(actions.filter((action) => !action.validation_errors));

  return {
    generatedAt: new Date().toISOString(),
    fixtures: payloads,
    actions,
    summary,
    csv,
    csvHeader: csv.split('\n')[0],
    issues: auditDetroitDynamoLaunchEvidenceActionReport({ actions, summary, csvHeader: csv.split('\n')[0] }),
  };
}

export function auditDetroitDynamoLaunchEvidenceActionReport(
  report = buildDetroitDynamoLaunchEvidenceActionReport(),
) {
  const issues = [];
  const validActions = report.actions.filter((action) => !action.validation_errors);

  if (validActions.length < 4) {
    issues.push('Launch evidence action fixtures should cover at least four actions.');
  }
  if (!validActions.some((action) => action.action === 'attach_evidence')) {
    issues.push('Launch evidence action fixtures should cover attach_evidence.');
  }
  if (!validActions.some((action) => action.action === 'request_owner_review')) {
    issues.push('Launch evidence action fixtures should cover request_owner_review.');
  }
  if (!validActions.some((action) => action.action === 'request_changes')) {
    issues.push('Launch evidence action fixtures should cover request_changes.');
  }
  if (!validActions.some((action) => action.action === 'record_preview_signoff')) {
    issues.push('Launch evidence action fixtures should cover record_preview_signoff.');
  }
  if (validActions.some((action) => action.live_gate_cleared)) {
    issues.push('Preview launch evidence actions must not clear live promotion gates.');
  }
  if (report.summary.liveGatesCleared !== 0) {
    issues.push('Launch evidence action summary must report zero live gates cleared.');
  }
  if (report.csvHeader !== 'id,created_at,status,action,checklist_item_id,promotion_gate,confirmation_area,owner_role,actor_role,evidence_label,artifact_reference,live_gate_cleared,note') {
    issues.push('Launch evidence action CSV header is not stable.');
  }
  for (const action of report.actions) {
    if (action.validation_errors?.length) {
      issues.push(`Launch evidence action fixture failed validation: ${action.validation_errors.join(', ')}`);
    }
  }

  return issues;
}

export function buildDetroitDynamoLaunchEvidenceActionMarkdown(
  report = buildDetroitDynamoLaunchEvidenceActionReport(),
) {
  return `# Detroit Dynamo Launch Evidence Action Verification

- Generated at: ${report.generatedAt}
- Fixture actions: ${report.actions.length}
- Checklist items touched: ${report.summary.checklistItemsTouched}
- Preview signoffs recorded: ${report.summary.previewSignoffs}
- Changes requested: ${report.summary.changesRequested}
- Live gates cleared: ${report.summary.liveGatesCleared}

These actions are preview-only. They rehearse evidence routing and do not approve launch, enable backend cutover, collect payment, collect signatures, publish claims, remove noindex, or apply redirects.
`;
}
