import { detroitDynamoExternalConfirmationRegister } from './detroitDynamoDataModel.js';
import { detroitDynamoLaunchEvidenceChecklist } from './detroitDynamoLaunchEvidenceContract.js';
import { detroitDynamoOwnerLaunchReviewSections } from './detroitDynamoOwnerLaunchReview.js';

export const detroitDynamoOwnerEvidenceIntakeColumns = [
  'intake_id',
  'checklist_item_id',
  'review_section',
  'owner_role',
  'promotion_gate',
  'confirmation_area',
  'current_status',
  'external_register_status',
  'evidence_type',
  'required_artifact',
  'acceptance_criteria',
  'verification_command',
  'blocked_live_actions',
  'evidence_location_to_fill',
  'approver_name_to_fill',
  'approval_date_to_fill',
  'owner_decision_to_fill',
  'notes_to_fill',
  'safe_to_publish',
  'live_gate_cleared',
  'publication_unlocked',
];

const ownerDecisionOptions = [
  'not_recorded',
  'evidence_attached',
  'owner_review_requested',
  'changes_requested',
  'preview_signed_off',
  'approved_after_all_gates_clear',
];

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function sectionForEvidenceItem(item) {
  return detroitDynamoOwnerLaunchReviewSections.find((section) => (
    section.sourceGate === item.promotionGate
    || section.label === item.confirmationArea
    || section.id.includes(item.confirmationArea.toLowerCase().split(' ')[0])
  ));
}

function confirmationForEvidenceItem(item) {
  return detroitDynamoExternalConfirmationRegister.find((confirmation) => (
    confirmation.area === item.confirmationArea
    || confirmation.area === item.promotionGate
    || item.confirmationArea.includes(confirmation.area)
  ));
}

export function buildDetroitDynamoOwnerEvidenceIntakeReport() {
  const intakeRows = detroitDynamoLaunchEvidenceChecklist.map((item) => {
    const section = sectionForEvidenceItem(item);
    const confirmation = confirmationForEvidenceItem(item);

    return {
      intake_id: `owner-evidence-${item.id}`,
      checklist_item_id: item.id,
      review_section_id: section?.id || 'unmapped-review-section',
      review_section: section?.label || item.confirmationArea,
      owner_role: item.ownerRole,
      promotion_gate: item.promotionGate,
      confirmation_area: item.confirmationArea,
      current_status: item.status,
      external_register_status: confirmation?.status || 'internal_preview_review',
      evidence_type: item.evidenceType,
      required_artifact: item.requiredArtifact,
      acceptance_criteria: item.acceptanceCriteria,
      verification_command: item.verificationCommand,
      blocked_live_actions: item.blocksActions,
      live_action_blocked: item.liveActionBlocked,
      next_action: confirmation?.nextAction || item.liveActionBlocked,
      evidence_location_to_fill: '',
      approver_name_to_fill: '',
      approval_date_to_fill: '',
      owner_decision_to_fill: 'not_recorded',
      notes_to_fill: '',
      safe_to_publish: false,
      live_gate_cleared: false,
      publication_unlocked: false,
    };
  });

  const blockedLiveActions = [...new Set(intakeRows.flatMap((row) => row.blocked_live_actions))].sort();
  const ownerRoles = [...new Set(intakeRows.map((row) => row.owner_role))].sort();
  const unresolvedRows = intakeRows.filter((row) => row.current_status !== 'preview_passed');

  const report = {
    generatedAt: new Date().toISOString(),
    purpose: 'Owner-fillable evidence intake for the final Detroit Dynamo launch gate. It records what proof must be attached before any live publication, checkout, waiver, redirect, or root promotion change.',
    decision: 'preview_only_evidence_intake',
    ownerDecisionOptions,
    columns: detroitDynamoOwnerEvidenceIntakeColumns,
    summary: {
      intakeRows: intakeRows.length,
      unresolvedRows: unresolvedRows.length,
      previewPassedRows: intakeRows.length - unresolvedRows.length,
      ownerRoles: ownerRoles.length,
      blockedLiveActions: blockedLiveActions.length,
      safeToPublishRows: intakeRows.filter((row) => row.safe_to_publish).length,
      liveGatesCleared: intakeRows.filter((row) => row.live_gate_cleared).length,
      publicationsUnlocked: intakeRows.filter((row) => row.publication_unlocked).length,
    },
    ownerRoles,
    blockedLiveActions,
    intakeRows,
    unresolvedRows,
    issues: [],
  };

  report.issues = auditDetroitDynamoOwnerEvidenceIntakeReport(report);
  return report;
}

export function buildDetroitDynamoOwnerEvidenceIntakeCsv(
  report = buildDetroitDynamoOwnerEvidenceIntakeReport(),
) {
  return [
    report.columns.join(','),
    ...report.intakeRows.map((row) => (
      report.columns.map((column) => csvEscape(row[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoOwnerEvidenceIntakeMarkdown(
  report = buildDetroitDynamoOwnerEvidenceIntakeReport(),
) {
  const lines = [
    '# Detroit Dynamo Owner Evidence Intake',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    report.purpose,
    '',
    'This is an intake worksheet only. It cannot clear live gates, approve public claims, enable checkout, collect signatures, remove noindex, or apply redirects by itself.',
    '',
    '## Summary',
    '',
    `- Intake rows: ${report.summary.intakeRows}`,
    `- Unresolved rows: ${report.summary.unresolvedRows}`,
    `- Preview-passed rows: ${report.summary.previewPassedRows}`,
    `- Owner roles: ${report.summary.ownerRoles}`,
    `- Blocked live actions: ${report.summary.blockedLiveActions}`,
    `- Safe-to-publish rows: ${report.summary.safeToPublishRows}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    '',
    '## How To Use',
    '',
    '- Fill `evidence_location_to_fill` with the file, URL, deployment id, provider id, legal version id, or owner-approved wording source.',
    '- Fill `approver_name_to_fill`, `approval_date_to_fill`, `owner_decision_to_fill`, and `notes_to_fill` during owner review.',
    '- Use only the allowed owner decision values listed below.',
    '- Keep `safe_to_publish`, `live_gate_cleared`, and `publication_unlocked` false until the separate live gate process is completed and verified.',
    '',
    'Allowed owner decisions:',
    ...report.ownerDecisionOptions.map((option) => `- ${option}`),
    '',
    '## Intake Rows',
    '',
    '| Intake ID | Owner | Gate | Status | Required Artifact | Verification |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.intakeRows.map((row) => (
      `| ${row.intake_id} | ${row.owner_role} | ${row.promotion_gate} | ${row.current_status} | ${row.required_artifact} | \`${row.verification_command}\` |`
    )),
    '',
    '## Row Details',
    '',
    ...report.intakeRows.flatMap((row) => [
      `### ${row.intake_id}`,
      '',
      `Review section: ${row.review_section}`,
      '',
      `Confirmation area: ${row.confirmation_area}`,
      '',
      `Evidence type: ${row.evidence_type}`,
      '',
      `Next action: ${row.next_action}`,
      '',
      'Acceptance criteria:',
      ...row.acceptance_criteria.map((criterion) => `- [ ] ${criterion}`),
      '',
      'Blocked live actions:',
      ...row.blocked_live_actions.map((action) => `- ${action}`),
      '',
      'Owner fill-in:',
      '- [ ] Evidence location:',
      '- [ ] Approver name:',
      '- [ ] Approval date:',
      '- [ ] Owner decision:',
      '- [ ] Notes:',
      '',
    ]),
    '## Blocked Live Actions',
    '',
    ...report.blockedLiveActions.map((action) => `- ${action}`),
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoOwnerEvidenceIntakeReport(
  report = buildDetroitDynamoOwnerEvidenceIntakeReport(),
) {
  const issues = [];
  const requiredColumns = [
    'intake_id',
    'checklist_item_id',
    'owner_role',
    'promotion_gate',
    'required_artifact',
    'verification_command',
    'evidence_location_to_fill',
    'owner_decision_to_fill',
    'safe_to_publish',
    'live_gate_cleared',
    'publication_unlocked',
  ];

  for (const column of requiredColumns) {
    if (!report.columns.includes(column)) {
      issues.push(`Missing owner evidence intake column: ${column}.`);
    }
  }

  if (report.decision !== 'preview_only_evidence_intake') {
    issues.push('Owner evidence intake must remain preview-only.');
  }
  if (report.summary.intakeRows < detroitDynamoLaunchEvidenceChecklist.length) {
    issues.push('Owner evidence intake must include every launch evidence checklist item.');
  }
  if (report.summary.unresolvedRows < 8) {
    issues.push('Owner evidence intake should keep unresolved external rows visible.');
  }
  if (report.summary.safeToPublishRows !== 0) {
    issues.push('Owner evidence intake must not mark rows safe to publish.');
  }
  if (report.summary.liveGatesCleared !== 0) {
    issues.push('Owner evidence intake must not clear live gates.');
  }
  if (report.summary.publicationsUnlocked !== 0) {
    issues.push('Owner evidence intake must not unlock publications.');
  }
  if (report.ownerDecisionOptions.length < 5 || !report.ownerDecisionOptions.includes('not_recorded')) {
    issues.push('Owner evidence intake needs explicit owner decision options.');
  }

  const ids = new Set();
  for (const row of report.intakeRows) {
    if (ids.has(row.intake_id)) {
      issues.push(`Duplicate owner evidence intake id: ${row.intake_id}.`);
    }
    ids.add(row.intake_id);
    if (!row.checklist_item_id || !detroitDynamoLaunchEvidenceChecklist.some((item) => item.id === row.checklist_item_id)) {
      issues.push(`${row.intake_id} is not mapped to a launch evidence checklist item.`);
    }
    if (!row.owner_role) {
      issues.push(`${row.intake_id} is missing owner role.`);
    }
    if (!row.required_artifact || row.required_artifact.length < 12) {
      issues.push(`${row.intake_id} needs a specific required artifact.`);
    }
    if (!Array.isArray(row.acceptance_criteria) || row.acceptance_criteria.length < 3) {
      issues.push(`${row.intake_id} needs at least three acceptance criteria.`);
    }
    if (!row.verification_command || row.verification_command.length < 8) {
      issues.push(`${row.intake_id} needs a verification command.`);
    }
    if (!Array.isArray(row.blocked_live_actions) || row.blocked_live_actions.length < 1) {
      issues.push(`${row.intake_id} needs blocked live actions.`);
    }
    if (row.safe_to_publish || row.live_gate_cleared || row.publication_unlocked) {
      issues.push(`${row.intake_id} must not unlock launch from an intake worksheet.`);
    }
  }

  return issues;
}
