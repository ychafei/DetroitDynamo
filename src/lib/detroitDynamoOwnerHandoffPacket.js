import { buildDetroitDynamoClaimSafetyContractReport } from './detroitDynamoClaimSafetyContract.js';
import { buildDetroitDynamoDeploymentReadinessReport } from './detroitDynamoDeploymentReadiness.js';
import { buildDetroitDynamoExternalGateContractReport } from './detroitDynamoExternalGateContracts.js';
import { buildDetroitDynamoFinalAcceptanceMatrixReport } from './detroitDynamoFinalAcceptanceMatrix.js';
import { buildDetroitDynamoLaunchArtifactIndexReport } from './detroitDynamoLaunchArtifactIndex.js';
import { buildDetroitDynamoLaunchEvidenceReport } from './detroitDynamoLaunchEvidenceContract.js';
import { buildDetroitDynamoLiveReadinessBoardReport } from './detroitDynamoLiveReadinessBoard.js';
import { buildDetroitDynamoOwnerEvidenceIntakeReport } from './detroitDynamoOwnerEvidenceIntake.js';
import { buildDetroitDynamoOwnerLaunchReviewReport } from './detroitDynamoOwnerLaunchReview.js';
import { buildDetroitDynamoOwnerSignoffRegisterReport } from './detroitDynamoOwnerSignoffRegister.js';
import { buildDetroitDynamoProductionPreviewEvidenceReport } from './detroitDynamoProductionPreviewEvidence.js';
import { buildDetroitDynamoPromotionCutoverReport } from './detroitDynamoPromotionCutoverContract.js';
import { buildDetroitDynamoSafeguardingReport } from './detroitDynamoSafeguardingContract.js';
import { buildDetroitDynamoSecretRedactionReport } from './detroitDynamoSecretRedactionContract.js';
import { buildDetroitDynamoExternalGateClosureReport } from './detroitDynamoExternalGateClosurePacket.js';
import { buildDetroitDynamoVercelPreviewRunbookReport } from './detroitDynamoVercelPreviewRunbook.js';

export const detroitDynamoOwnerHandoffPacketDecision = {
  decision: 'owner_handoff_packet_preview_only',
  label: 'Owner Handoff Packet Required',
  launchMode: 'preview_only',
  publishAllowed: false,
  completionClaimAllowed: false,
  reason: 'This packet consolidates Detroit Dynamo launch evidence for owner review while keeping every external gate, signoff, publication, checkout, signature, redirect, and root-promotion action blocked.',
};

export const detroitDynamoOwnerHandoffPacketColumns = [
  'id',
  'title',
  'ownerRole',
  'decisionStatus',
  'primaryArtifact',
  'supportingArtifacts',
  'verificationCommands',
  'evidenceRequired',
  'requiresRedactionReview',
  'signoffStatus',
  'blockedLiveActions',
];

export const detroitDynamoOwnerHandoffPacketSections = [
  {
    id: 'executive-closeout',
    title: 'Executive closeout and final acceptance',
    ownerRole: 'Master Admin',
    decisionStatus: 'preview_complete_external_gates_pending',
    primaryArtifact: 'DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/goal-audit.json',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-launch-artifact-index.md',
    ],
    verificationCommands: [
      'npm run audit:dynamo-goal',
      'npm run verify:dynamo-final-acceptance',
      'npm run verify:dynamo-launch-artifact-index',
    ],
    evidenceRequired: [
      'Owner reviews the audit, final acceptance rows, external evidence rows, and launch artifact index.',
      'Goal remains active until external/backend/payment/waiver/league/deployment/signoff evidence is attached.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['goal completion claim', 'owner closeout', 'root route promotion'],
  },
  {
    id: 'external-gate-closure',
    title: 'External gate closure rows',
    ownerRole: 'Master Admin',
    decisionStatus: 'external_gate_closure_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-external-gate-closure.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md',
    ],
    verificationCommands: [
      'npm run verify:dynamo-external-gate-closure',
      'npm run verify:dynamo-owner-evidence-intake',
      'npm run verify:dynamo-owner-signoff-register',
    ],
    evidenceRequired: [
      'Every external gate has a role owner, source artifact, required evidence list, verification command, and blocked live action.',
      'No closure row is marked ready to close until real evidence, approver, date, and owner decision are attached.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['external gate closeout', 'goal completion claim', 'root route promotion', 'checkout activation', 'signature capture'],
  },
  {
    id: 'owner-decision-and-evidence',
    title: 'Owner decision, evidence intake, and signoff register',
    ownerRole: 'Master Admin',
    decisionStatus: 'owner_review_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-launch-review.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-live-readiness-board.md',
    ],
    verificationCommands: [
      'npm run verify:dynamo-owner-launch-review',
      'npm run verify:dynamo-owner-evidence-intake',
      'npm run verify:dynamo-owner-signoff-register',
      'npm run verify:dynamo-live-readiness-board',
    ],
    evidenceRequired: [
      'Every evidence row has a real proof location, approver, approval date, decision, and owner note.',
      'Every final signoff row remains unsigned until the matching external evidence is approved.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['owner launch decision', 'live gate clearance', 'publication approval'],
  },
  {
    id: 'deployment-vercel-redaction',
    title: 'Deployment, Vercel preview, rollback, and redaction',
    ownerRole: 'Master Admin',
    decisionStatus: 'deployment_evidence_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-vercel-preview-runbook.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-secret-redaction.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-secret-redaction-violations.csv',
    ],
    verificationCommands: [
      'npm run verify:dynamo-deployment-readiness',
      'npm run verify:dynamo-vercel-preview',
      'npm run verify:dynamo-secret-redaction',
    ],
    evidenceRequired: [
      'Preview deployment URL, deployment id, inspect summary, browser QA proof, and rollback target are recorded without exposing secrets.',
      'Secret redaction scanner reports zero exact secret matches, zero identifier matches, and zero token-pattern leakages.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['production deployment', 'root route promotion', 'permanent redirects', 'owner handoff distribution'],
  },
  {
    id: 'backend-admin-activation',
    title: 'Backend, Appwrite, roles, and admin activation',
    ownerRole: 'Master Admin',
    decisionStatus: 'backend_activation_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.md',
    ],
    verificationCommands: [
      'npm run preflight:dynamo-backend',
      'npm run verify:dynamo-admin-module-read',
      'npm run verify:dynamo-admin-module-writes',
      'npm run verify:dynamo-admin-role-grants',
      'npm run verify:dynamo-admin-record-workspace',
    ],
    evidenceRequired: [
      'Isolated dd_* collections are provisioned in the target Appwrite project.',
      'Trusted role grants, audit events, protected reads, and gated writes are production-preview tested.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['Appwrite intake default', 'protected admin live reads', 'protected admin live writes'],
  },
  {
    id: 'production-preview-forms',
    title: 'Production-preview public forms and lead workflow',
    ownerRole: 'Registrar',
    decisionStatus: 'production_preview_evidence_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-pipeline-action-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-pipeline-operations.md',
    ],
    verificationCommands: [
      'BASE_URL=<production-preview-url> npm run qa:dynamo-browser',
      'npm run verify:dynamo-intake-contract',
      'npm run verify:dynamo-pipeline-actions',
    ],
    evidenceRequired: [
      'Training, youth, tryout, men, women, sponsor, and contact forms have production-preview submission ids.',
      'Authenticated lead status transitions write audit events and unauthorized actions are rejected.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['default live intake', 'live lead status transitions', 'public launch announcement'],
  },
  {
    id: 'payments-packages',
    title: 'Payments, packages, provider products, and checkout',
    ownerRole: 'Master Admin',
    decisionStatus: 'external_evidence_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-launch-evidence-checklist.md',
    ],
    verificationCommands: [
      'npm run verify:dynamo-gate-contracts',
      'npm run verify:dynamo-owner-signoff-register',
    ],
    evidenceRequired: [
      'Approved package matrix includes prices, taxes, fees, refund rules, and provider product ids.',
      'Sandbox checkout, failure, refund, cancellation, webhook, and audit proof are attached.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['checkout activation', 'payment collection', 'package publication'],
  },
  {
    id: 'waivers-safeguarding',
    title: 'Waivers, legal versions, safeguarding, and privacy',
    ownerRole: 'Registrar',
    decisionStatus: 'external_evidence_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md',
    ],
    verificationCommands: [
      'npm run verify:dynamo-safeguarding',
      'npm run verify:dynamo-gate-contracts',
    ],
    evidenceRequired: [
      'Approved youth/adult waiver, medical, media, camp, and travel consent version register is attached.',
      'Guardian/adult signature audit, export, expiration, and revocation proof are production-preview tested.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['signature capture', 'medical intake', 'youth registration launch', 'sensitive admin mutations'],
  },
  {
    id: 'external-facts-content',
    title: 'League, facility, staff, roster, sponsor, media, and claims',
    ownerRole: 'Club Director',
    decisionStatus: 'external_evidence_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    verificationCommands: [
      'npm run verify:dynamo-external-confirmation-actions',
      'npm run verify:dynamo-claim-safety',
      'npm run verify:dynamo-owner-evidence-intake',
    ],
    evidenceRequired: [
      'League/facility status is confirmed or future-pathway wording is owner-approved.',
      'Staff, roster, sponsor logo, testimonial, media-release, and news proof approvals are attached.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['league claim publication', 'facility publication', 'staff proof publication', 'roster publication', 'sponsor logo publication'],
  },
  {
    id: 'seo-cutover-postlaunch',
    title: 'SEO, noindex, redirects, root promotion, and post-launch watch',
    ownerRole: 'Master Admin',
    decisionStatus: 'cutover_approval_required',
    primaryArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
    supportingArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-redirect-plan.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-live-readiness-board.md',
    ],
    verificationCommands: [
      'npm run verify:dynamo-promotion-cutover',
      'BASE_URL=<production-preview-url> npm run verify:dynamo',
      'BASE_URL=<production-url> npm run qa:dynamo-browser',
    ],
    evidenceRequired: [
      'Owner-approved noindex removal, sitemap publication, canonical/root switch, redirect plan, and rollback target are attached.',
      'Post-launch smoke, browser QA, support escalation, and rollback owner are prepared before launch announcement.',
    ],
    requiresRedactionReview: true,
    signoffStatus: 'not_signed',
    blockedLiveActions: ['root route promotion', 'noindex removal', 'permanent redirects', 'sitemap publication', 'launch announcement'],
  },
];

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function unique(values) {
  return [...new Set(values.flat().filter(Boolean))].sort();
}

function countBy(items, field) {
  return items.reduce((totals, item) => {
    const key = item[field] || 'unknown';
    totals[key] = (totals[key] || 0) + 1;
    return totals;
  }, {});
}

export function buildDetroitDynamoOwnerHandoffPacketReport() {
  const artifactIndex = buildDetroitDynamoLaunchArtifactIndexReport();
  const ownerLaunchReview = buildDetroitDynamoOwnerLaunchReviewReport();
  const ownerEvidenceIntake = buildDetroitDynamoOwnerEvidenceIntakeReport();
  const ownerSignoffRegister = buildDetroitDynamoOwnerSignoffRegisterReport();
  const finalAcceptanceMatrix = buildDetroitDynamoFinalAcceptanceMatrixReport();
  const deploymentReadiness = buildDetroitDynamoDeploymentReadinessReport();
  const vercelPreviewRunbook = buildDetroitDynamoVercelPreviewRunbookReport();
  const secretRedaction = buildDetroitDynamoSecretRedactionReport();
  const externalGateClosure = buildDetroitDynamoExternalGateClosureReport();
  const productionPreviewEvidence = buildDetroitDynamoProductionPreviewEvidenceReport();
  const liveReadinessBoard = buildDetroitDynamoLiveReadinessBoardReport();
  const externalGateContract = buildDetroitDynamoExternalGateContractReport();
  const safeguarding = buildDetroitDynamoSafeguardingReport();
  const claimSafety = buildDetroitDynamoClaimSafetyContractReport();
  const promotionCutover = buildDetroitDynamoPromotionCutoverReport();
  const launchEvidence = buildDetroitDynamoLaunchEvidenceReport();

  const blockedLiveActions = unique(detroitDynamoOwnerHandoffPacketSections.map((section) => section.blockedLiveActions));
  const verificationCommands = unique(detroitDynamoOwnerHandoffPacketSections.map((section) => section.verificationCommands));
  const artifactPaths = unique(detroitDynamoOwnerHandoffPacketSections.map((section) => [
    section.primaryArtifact,
    ...section.supportingArtifacts,
  ]));

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoOwnerHandoffPacketDecision,
    columns: detroitDynamoOwnerHandoffPacketColumns,
    sections: detroitDynamoOwnerHandoffPacketSections,
    summary: {
      packetSections: detroitDynamoOwnerHandoffPacketSections.length,
      ownerRoles: Object.keys(countBy(detroitDynamoOwnerHandoffPacketSections, 'ownerRole')).length,
      evidenceRequiredSections: detroitDynamoOwnerHandoffPacketSections.filter((section) => section.evidenceRequired.length > 0).length,
      redactionReviewSections: detroitDynamoOwnerHandoffPacketSections.filter((section) => section.requiresRedactionReview).length,
      signoffRows: ownerSignoffRegister.summary.signoffRows,
      signedRows: ownerSignoffRegister.summary.signedRows,
      unsignedRows: ownerSignoffRegister.summary.unsignedRows,
      unresolvedEvidenceRows: ownerEvidenceIntake.summary.unresolvedRows,
      finalAcceptanceRows: finalAcceptanceMatrix.summary.acceptanceRows,
      externalAcceptanceRows: finalAcceptanceMatrix.summary.externalEvidenceRequiredRows,
      launchArtifactsIndexed: artifactIndex.summary.artifactsTotal,
      deploymentReadinessTracks: deploymentReadiness.summary.tracksTotal,
      vercelPreviewSteps: vercelPreviewRunbook.summary.stepsTotal,
      secretRedactionRules: secretRedaction.summary.rulesTotal,
      secretRedactionLeakages: secretRedaction.summary.leakagesDetected,
      externalGateClosureRows: externalGateClosure.summary.rowsTotal,
      externalGateClosureAllowedRows: externalGateClosure.summary.closureAllowedRows,
      productionPreviewTracks: productionPreviewEvidence.summary.tracksTotal,
      liveReadinessRows: liveReadinessBoard.summary.rowsTotal,
      paymentPackageTracks: externalGateContract.paymentPackageTracks.length,
      waiverTracks: externalGateContract.waiverTracks.length,
      safeguardingTracks: safeguarding.safeguardingTracks.length,
      claimSafetyTracks: claimSafety.claimSafetyTracks.length,
      promotionCutoverTracks: promotionCutover.cutoverTracks.length,
      launchEvidenceItems: launchEvidence.summary.total,
      liveGatesCleared: ownerLaunchReview.summary.liveGatesCleared
        + ownerEvidenceIntake.summary.liveGatesCleared
        + ownerSignoffRegister.summary.liveGatesCleared
        + productionPreviewEvidence.summary.liveGatesCleared
        + liveReadinessBoard.summary.liveGatesCleared,
      publicationsUnlocked: ownerLaunchReview.summary.publicationsUnlocked
        + ownerEvidenceIntake.summary.publicationsUnlocked
        + ownerSignoffRegister.summary.publicationsUnlocked
        + productionPreviewEvidence.summary.publicationsUnlocked
        + liveReadinessBoard.summary.publicationsUnlocked,
      goLiveAllowedRows: liveReadinessBoard.summary.goLiveAllowedRows,
      rootPromotionAllowed: liveReadinessBoard.summary.rootPromotionAllowed,
      checkoutAllowed: liveReadinessBoard.summary.checkoutAllowed,
      signaturesAllowed: liveReadinessBoard.summary.signatureCaptureAllowed,
      permanentRedirectsAllowed: liveReadinessBoard.summary.permanentRedirectsAllowed,
      noindexRemovalAllowed: liveReadinessBoard.summary.noindexRemovalAllowed,
      publicClaimPublicationAllowed: liveReadinessBoard.summary.publicClaimPublicationAllowed,
      publishAllowed: detroitDynamoOwnerHandoffPacketDecision.publishAllowed,
      completionClaimAllowed: detroitDynamoOwnerHandoffPacketDecision.completionClaimAllowed,
      artifactPaths: artifactPaths.length,
      verificationCommands: verificationCommands.length,
      blockedLiveActions: blockedLiveActions.length,
    },
    ownerRoles: countBy(detroitDynamoOwnerHandoffPacketSections, 'ownerRole'),
    decisionStatuses: countBy(detroitDynamoOwnerHandoffPacketSections, 'decisionStatus'),
    artifactPaths,
    verificationCommands,
    blockedLiveActions,
    usageRules: [
      'Run this packet after regenerating launch artifacts and after the secret redaction scanner passes.',
      'Use the packet as the owner meeting agenda, not as launch approval.',
      'Attach real evidence in the owner evidence intake worksheet before changing any signoff status.',
      'Keep public claims, checkout, signatures, noindex removal, redirects, and root promotion blocked until the matching live gate has evidence and owner approval.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoOwnerHandoffPacketReport(report);
  return report;
}

export function buildDetroitDynamoOwnerHandoffPacketCsv(
  report = buildDetroitDynamoOwnerHandoffPacketReport(),
) {
  return [
    report.columns.join(','),
    ...report.sections.map((section) => (
      report.columns.map((column) => csvEscape(section[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoOwnerHandoffPacketMarkdown(
  report = buildDetroitDynamoOwnerHandoffPacketReport(),
) {
  const lines = [
    '# Detroit Dynamo Owner Handoff Packet',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    'This packet is preview-only. It does not approve launch, complete the goal, enable live Appwrite intake, enable checkout, collect signatures, publish public claims, remove noindex, apply redirects, or replace the current Detroit Dynamo root site.',
    '',
    '## Summary',
    '',
    `- Packet sections: ${report.summary.packetSections}`,
    `- Owner roles: ${report.summary.ownerRoles}`,
    `- Evidence-required sections: ${report.summary.evidenceRequiredSections}`,
    `- Redaction-review sections: ${report.summary.redactionReviewSections}`,
    `- Launch artifacts indexed: ${report.summary.launchArtifactsIndexed}`,
    `- Signoff rows: ${report.summary.signoffRows}`,
    `- Signed rows: ${report.summary.signedRows}`,
    `- Unsigned rows: ${report.summary.unsignedRows}`,
    `- Unresolved evidence rows: ${report.summary.unresolvedEvidenceRows}`,
    `- Final acceptance rows: ${report.summary.finalAcceptanceRows}`,
    `- External acceptance rows: ${report.summary.externalAcceptanceRows}`,
    `- Secret redaction rules: ${report.summary.secretRedactionRules}`,
    `- Secret redaction leakages: ${report.summary.secretRedactionLeakages}`,
    `- External gate closure rows: ${report.summary.externalGateClosureRows}`,
    `- External gate closure allowed rows: ${report.summary.externalGateClosureAllowedRows}`,
    `- Production-preview tracks: ${report.summary.productionPreviewTracks}`,
    `- Live readiness rows: ${report.summary.liveReadinessRows}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    `- Go-live allowed rows: ${report.summary.goLiveAllowedRows}`,
    `- Root promotion allowed: ${report.summary.rootPromotionAllowed}`,
    `- Checkout allowed: ${report.summary.checkoutAllowed}`,
    `- Signatures allowed: ${report.summary.signaturesAllowed}`,
    `- Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`,
    `- Noindex removal allowed: ${report.summary.noindexRemovalAllowed}`,
    `- Public claim publication allowed: ${report.summary.publicClaimPublicationAllowed}`,
    `- Publish allowed: ${report.summary.publishAllowed}`,
    `- Completion claim allowed: ${report.summary.completionClaimAllowed}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Packet Sections',
    '',
    '| Section | Owner | Status | Primary Artifact | Verify | Signoff |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.sections.map((section) => (
      `| ${section.title} | ${section.ownerRole} | ${section.decisionStatus} | \`${section.primaryArtifact}\` | \`${section.verificationCommands.join(' && ')}\` | ${section.signoffStatus} |`
    )),
    '',
    '## Section Details',
    '',
    ...report.sections.flatMap((section) => [
      `### ${section.title}`,
      '',
      `Owner: ${section.ownerRole}`,
      '',
      `Decision status: ${section.decisionStatus}`,
      '',
      `Primary artifact: \`${section.primaryArtifact}\``,
      '',
      'Supporting artifacts:',
      ...section.supportingArtifacts.map((artifact) => `- \`${artifact}\``),
      '',
      'Evidence required:',
      ...section.evidenceRequired.map((item) => `- [ ] ${item}`),
      '',
      'Verification commands:',
      ...section.verificationCommands.map((command) => `- \`${command}\``),
      '',
      'Blocked live actions:',
      ...section.blockedLiveActions.map((action) => `- ${action}`),
      '',
    ]),
    '## Blocked Live Actions',
    '',
    ...report.blockedLiveActions.map((action) => `- ${action}`),
    '',
  ];

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoOwnerHandoffPacketReport(
  report = buildDetroitDynamoOwnerHandoffPacketReport(),
) {
  const issues = [];
  const requiredIds = [
    'executive-closeout',
    'external-gate-closure',
    'owner-decision-and-evidence',
    'deployment-vercel-redaction',
    'backend-admin-activation',
    'production-preview-forms',
    'payments-packages',
    'waivers-safeguarding',
    'external-facts-content',
    'seo-cutover-postlaunch',
  ];

  assertReport(report.decision?.decision === 'owner_handoff_packet_preview_only', 'Owner handoff packet must remain preview-only.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'Owner handoff packet launch mode must be preview-only.', issues);
  assertReport(report.decision?.publishAllowed === false, 'Owner handoff packet must not allow publication.', issues);
  assertReport(report.decision?.completionClaimAllowed === false, 'Owner handoff packet must not allow completion claims.', issues);
  assertReport(report.summary.packetSections >= requiredIds.length, 'Owner handoff packet should include every required section.', issues);
  assertReport(report.summary.evidenceRequiredSections === report.summary.packetSections, 'Every owner handoff section should require evidence.', issues);
  assertReport(report.summary.redactionReviewSections === report.summary.packetSections, 'Every owner handoff section should require redaction review.', issues);
  assertReport(report.summary.signedRows === 0, 'Owner handoff packet must keep signoff rows unsigned.', issues);
  assertReport(report.summary.unsignedRows === report.summary.signoffRows, 'Owner handoff packet should keep every signoff row unsigned.', issues);
  assertReport(report.summary.unresolvedEvidenceRows >= 8, 'Owner handoff packet should keep unresolved evidence rows visible.', issues);
  assertReport(report.summary.externalAcceptanceRows >= 5, 'Owner handoff packet should keep external acceptance rows visible.', issues);
  assertReport(report.summary.launchArtifactsIndexed >= 29, 'Owner handoff packet should reference the launch artifact index.', issues);
  assertReport(report.summary.secretRedactionRules >= 8, 'Owner handoff packet should reference secret redaction rules.', issues);
  assertReport(report.summary.secretRedactionLeakages === 0, 'Owner handoff packet must not report secret leakages.', issues);
  assertReport(report.summary.externalGateClosureRows >= 9, 'Owner handoff packet should reference external gate closure rows.', issues);
  assertReport(report.summary.externalGateClosureAllowedRows === 0, 'Owner handoff packet should keep external gate closure blocked.', issues);
  assertReport(report.summary.productionPreviewTracks >= 30, 'Owner handoff packet should reference production-preview evidence tracks.', issues);
  assertReport(report.summary.liveReadinessRows >= 11, 'Owner handoff packet should reference live-readiness rows.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Owner handoff packet must not clear live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Owner handoff packet must not unlock publications.', issues);
  assertReport(report.summary.goLiveAllowedRows === 0, 'Owner handoff packet must not mark go-live rows allowed.', issues);
  assertReport(report.summary.rootPromotionAllowed === false, 'Owner handoff packet must block root promotion.', issues);
  assertReport(report.summary.checkoutAllowed === false, 'Owner handoff packet must block checkout.', issues);
  assertReport(report.summary.signaturesAllowed === false, 'Owner handoff packet must block signatures.', issues);
  assertReport(report.summary.permanentRedirectsAllowed === false, 'Owner handoff packet must block permanent redirects.', issues);
  assertReport(report.summary.noindexRemovalAllowed === false, 'Owner handoff packet must block noindex removal.', issues);
  assertReport(report.summary.publicClaimPublicationAllowed === false, 'Owner handoff packet must block public claim publication.', issues);
  assertReport(report.summary.publishAllowed === false, 'Owner handoff packet summary must block publication.', issues);
  assertReport(report.summary.completionClaimAllowed === false, 'Owner handoff packet summary must block completion claims.', issues);
  assertReport(report.summary.verificationCommands >= 12, 'Owner handoff packet should list verification commands.', issues);
  assertReport(report.summary.blockedLiveActions >= 12, 'Owner handoff packet should list blocked live actions.', issues);
  assertReport(report.usageRules.length >= 4, 'Owner handoff packet needs usage rules.', issues);

  for (const id of requiredIds) {
    assertReport(report.sections.some((section) => section.id === id), `Missing owner handoff packet section: ${id}.`, issues);
  }

  const ids = new Set();
  for (const section of report.sections) {
    assertReport(!ids.has(section.id), `Duplicate owner handoff packet section id: ${section.id}.`, issues);
    ids.add(section.id);
    assertReport(section.title && section.title.length >= 8, `${section.id} needs a title.`, issues);
    assertReport(section.ownerRole && section.ownerRole.length > 3, `${section.id} needs an owner role.`, issues);
    assertReport(section.primaryArtifact && section.primaryArtifact.length > 8, `${section.id} needs a primary artifact.`, issues);
    assertReport(Array.isArray(section.supportingArtifacts) && section.supportingArtifacts.length >= 2, `${section.id} needs supporting artifacts.`, issues);
    assertReport(Array.isArray(section.verificationCommands) && section.verificationCommands.length >= 2, `${section.id} needs verification commands.`, issues);
    assertReport(Array.isArray(section.evidenceRequired) && section.evidenceRequired.length >= 2, `${section.id} needs evidence requirements.`, issues);
    assertReport(section.requiresRedactionReview === true, `${section.id} must require redaction review.`, issues);
    assertReport(section.signoffStatus === 'not_signed', `${section.id} must keep signoff status not signed.`, issues);
    assertReport(Array.isArray(section.blockedLiveActions) && section.blockedLiveActions.length >= 2, `${section.id} needs blocked live actions.`, issues);
  }

  return issues;
}
