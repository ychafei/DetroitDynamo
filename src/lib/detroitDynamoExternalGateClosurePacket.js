import {
  detroitDynamoBackendActivationSteps,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';
import { detroitDynamoFinalAcceptanceRows } from './detroitDynamoFinalAcceptanceMatrix.js';
import { detroitDynamoLaunchEvidenceChecklist } from './detroitDynamoLaunchEvidenceContract.js';

export const detroitDynamoExternalGateClosureDecision = {
  decision: 'external_gate_closure_required_preview_only',
  label: 'External Gate Closure Required',
  launchMode: 'preview_only',
  closureAllowed: false,
  completionClaimAllowed: false,
  reason: 'Detroit Dynamo can stay preview-complete, but final goal completion requires real external evidence for backend, payments, waivers, league/facility facts, deployment, cutover, and owner signoff.',
};

export const detroitDynamoExternalGateClosureColumns = [
  'id',
  'label',
  'gateGroup',
  'ownerRole',
  'priority',
  'status',
  'sourceArtifacts',
  'requiredEvidence',
  'verificationCommands',
  'blockedLiveActions',
  'closureQuestion',
  'closureAllowed',
];

export const detroitDynamoExternalGateClosureRows = [
  {
    id: 'appwrite-project-and-credentials',
    label: 'Appwrite project, credentials, and environment readiness',
    gateGroup: 'Backend/Data',
    ownerRole: 'Master Admin',
    priority: 'critical',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/backend-preflight.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-secret-redaction.md',
    ],
    requiredEvidence: [
      'Valid Appwrite project id, endpoint, and server credentials stored only in approved secret stores',
      'Confirmed Appwrite API key replacement after the expired local key is removed or rotated',
      'Preview and production environment variable checklist with values redacted from handoff artifacts',
      'Secret redaction scan showing 0 exact local secret matches and 0 identifier matches after evidence is attached',
    ],
    verificationCommands: [
      'npm run preflight:dynamo-backend',
      'npm run verify:dynamo-secret-redaction',
      'npm run plan:dynamo-appwrite',
    ],
    sourceAcceptanceRows: ['backend-appwrite-scaffold'],
    sourcePromotionGates: ['Live backend ready'],
    sourceConfirmationAreas: ['Backend/Data'],
    blockedLiveActions: ['Appwrite intake default', 'protected admin live reads', 'protected admin live writes'],
    closureQuestion: 'Can the owner prove the backend project and secrets are valid without exposing values in docs or artifacts?',
    closureAllowed: false,
  },
  {
    id: 'appwrite-schema-provisioning',
    label: 'Provision isolated Detroit Dynamo dd_* schema',
    gateGroup: 'Backend/Data',
    ownerRole: 'Master Admin',
    priority: 'critical',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.md',
    ],
    requiredEvidence: [
      'Dry-run plan reviewed for all isolated dd_* collections, attributes, indexes, and permissions',
      'Apply run completed against the target Appwrite project',
      'Collection count, attribute count, and index count captured in a redacted proof artifact',
      'Rollback or recreate plan documented before live writes are enabled',
    ],
    verificationCommands: [
      'npm run plan:dynamo-appwrite',
      'npm run provision:dynamo-appwrite -- --apply',
      'npm run preflight:dynamo-backend',
    ],
    sourceAcceptanceRows: ['backend-appwrite-scaffold', 'admin-data-model-foundation'],
    sourcePromotionGates: ['Live backend ready'],
    sourceConfirmationAreas: ['Backend/Data'],
    blockedLiveActions: ['live lead routing', 'protected admin live reads', 'protected admin live writes'],
    closureQuestion: 'Do the provisioned Appwrite collections match the typed Detroit Dynamo schema plan?',
    closureAllowed: false,
  },
  {
    id: 'function-deployment-and-production-preview-submissions',
    label: 'Deploy functions and capture production-preview submission proof',
    gateGroup: 'Backend/Data',
    ownerRole: 'Master Admin',
    priority: 'critical',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-pipeline-action-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md',
    ],
    requiredEvidence: [
      'Public intake function deployed and invoked from a production-preview URL for all seven public form variants',
      'Authenticated pipeline, module-read, role-grant, and module-write functions deployed with role-scoped proof',
      'Production-preview submission ids captured for ContactLead, Booking, TryoutRegistration, Sponsor, Player, and ParentGuardian paths',
      'Failure-path proof captured for validation, unauthenticated admin access, missing role grants, and external gate blocks',
    ],
    verificationCommands: [
      'npm run verify:dynamo-intake-contract',
      'npm run verify:dynamo-pipeline-actions',
      'npm run verify:dynamo-admin-module-read',
      'npm run verify:dynamo-admin-role-grants',
      'npm run verify:dynamo-admin-module-writes',
      'BASE_URL=<production-preview-url> npm run qa:dynamo-browser',
    ],
    sourceAcceptanceRows: ['public-lead-forms-and-routing', 'admin-data-model-foundation', 'backend-appwrite-scaffold'],
    sourcePromotionGates: ['Live backend ready'],
    sourceConfirmationAreas: ['Backend/Data'],
    blockedLiveActions: ['Appwrite intake default', 'live lead routing', 'protected admin live writes', 'public launch announcement'],
    closureQuestion: 'Do real production-preview submissions and admin actions prove the live backend path works before promotion?',
    closureAllowed: false,
  },
  {
    id: 'payment-package-provider-products',
    label: 'Approve package matrix, provider products, checkout, and webhook proof',
    gateGroup: 'Payments & Packages',
    ownerRole: 'Master Admin',
    priority: 'critical',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md',
    ],
    requiredEvidence: [
      'Owner-approved package matrix with exact prices, taxes, fees, session counts, refund rules, and payment schedules',
      'Provider product/price ids mapped to private training, small-group training, camps, youth dues, and sponsorship workflows',
      'Sandbox checkout success, failure, webhook, refund, and duplicate-submission proof',
      'Admin payment record and audit-event proof before checkout is linked from public pages',
    ],
    verificationCommands: [
      'npm run verify:dynamo-gate-contracts',
      'npm run verify:dynamo-owner-signoff-register',
      'npm run verify:dynamo-final-acceptance',
    ],
    sourceAcceptanceRows: ['payments-and-packages'],
    sourcePromotionGates: ['Payments approved'],
    sourceConfirmationAreas: ['Payments & Packages'],
    blockedLiveActions: ['checkout activation', 'payment collection', 'package publication'],
    closureQuestion: 'Are packages and payment products approved, tested, and auditable before checkout appears?',
    closureAllowed: false,
  },
  {
    id: 'waiver-legal-signature-workflow',
    label: 'Approve waiver versions, signature capture, and safeguarding workflow',
    gateGroup: 'Waivers/Legal/Safeguarding',
    ownerRole: 'Registrar',
    priority: 'critical',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    requiredEvidence: [
      'Approved youth, adult, medical consent, media release, camp/clinic, and team travel waiver versions',
      'Guardian/adult signature workflow proof with export, expiration, revocation, and audit-event handling',
      'Approved privacy, retention, medical-data access, and minor safeguarding procedures',
      'Legal/support communications handoff for terms, privacy, refund, and support identity',
    ],
    verificationCommands: [
      'npm run verify:dynamo-safeguarding',
      'npm run verify:dynamo-gate-contracts',
      'npm run verify:dynamo-owner-evidence-intake',
    ],
    sourceAcceptanceRows: ['waivers-legal-safeguarding'],
    sourcePromotionGates: ['Waivers approved'],
    sourceConfirmationAreas: ['Waivers & Legal', 'Staff, Rosters & Safeguarding'],
    blockedLiveActions: ['signature capture', 'medical intake', 'youth registration launch', 'sensitive admin mutations'],
    closureQuestion: 'Can Detroit Dynamo safely collect youth, adult, medical, and media consent records?',
    closureAllowed: false,
  },
  {
    id: 'league-facility-confirmations',
    label: 'Confirm league, facility, and operations facts',
    gateGroup: 'League/Facility Facts',
    ownerRole: 'Club Director',
    priority: 'high',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md',
    ],
    requiredEvidence: [
      'Confirmed senior league status or owner-approved future-pathway wording for men and women',
      'Confirmed youth league language or explicit roadmap wording that does not imply current membership',
      'Facility, field, indoor, schedule, insurance, and operations proof before names or addresses are published as facts',
      'Public copy review showing unconfirmed items remain future-pathway or approval-gated',
    ],
    verificationCommands: [
      'npm run verify:dynamo-claim-safety',
      'npm run verify:dynamo-external-confirmation-actions',
      'BASE_URL=<preview-url> npm run verify:dynamo',
    ],
    sourceAcceptanceRows: ['league-facility-staff-sponsor-proof'],
    sourcePromotionGates: ['League/facility facts confirmed'],
    sourceConfirmationAreas: ['League & Competition Facts', 'Facilities & Operations'],
    blockedLiveActions: ['league claim publication', 'facility publication', 'fixture publication'],
    closureQuestion: 'Are league and facility facts either confirmed or still clearly framed as future-pathway goals?',
    closureAllowed: false,
  },
  {
    id: 'staff-roster-sponsor-media-proof',
    label: 'Attach staff, roster, sponsor, testimonial, media, and news proof',
    gateGroup: 'Content/Brand Proof',
    ownerRole: 'Media/Admin Staff',
    priority: 'high',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
    ],
    requiredEvidence: [
      'Staff bios, credentials, headshots, and safeguarding clearance approved before publication',
      'Roster permission, player media release, and team status proof before roster cards go live',
      'Sponsor logo permission, package commitment, and usage rules approved before sponsor marks appear',
      'Testimonials, news posts, match media, and outcome claims backed by source proof and owner approval',
    ],
    verificationCommands: [
      'npm run verify:dynamo-claim-safety',
      'npm run verify:dynamo-safeguarding',
      'npm run verify:dynamo-external-confirmation-actions',
    ],
    sourceAcceptanceRows: ['league-facility-staff-sponsor-proof'],
    sourcePromotionGates: ['Proof approved'],
    sourceConfirmationAreas: ['Staff, Rosters & Safeguarding', 'Sponsors, Media & Content Proof'],
    blockedLiveActions: ['staff proof publication', 'roster publication', 'sponsor logo publication', 'testimonial publication', 'news publication'],
    closureQuestion: 'Is every proof-like public asset backed by permission and a reviewable source?',
    closureAllowed: false,
  },
  {
    id: 'vercel-preview-deployment-cutover-and-rollback',
    label: 'Record Vercel preview deployment, cutover, redirect, and rollback evidence',
    gateGroup: 'Deployment/Cutover',
    ownerRole: 'Master Admin',
    priority: 'critical',
    status: 'external_evidence_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-vercel-preview-runbook.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
    ],
    requiredEvidence: [
      'Vercel CLI upgraded before deployment work and linked project inspected with identifiers redacted from handoffs',
      'Production-preview URL, deployment id, inspect summary, function/log review, route QA, and form QA recorded',
      'Current production snapshot, rollback target, promotion hold, root-route promotion plan, and redirect plan approved',
      'Noindex removal, sitemap publication, canonical/root switch, and permanent redirect timing approved by owner',
    ],
    verificationCommands: [
      'npm run verify:dynamo-vercel-preview',
      'npm run verify:dynamo-deployment-readiness',
      'npm run verify:dynamo-promotion-cutover',
      'BASE_URL=<production-preview-url> npm run qa:dynamo-browser',
    ],
    sourceAcceptanceRows: ['seo-cutover-redirect-readiness', 'existing-lc-site-preservation'],
    sourcePromotionGates: ['SEO/redirect launch approval', 'Current site preserved'],
    sourceConfirmationAreas: ['SEO/Cutover'],
    blockedLiveActions: ['production deployment', 'root route promotion', 'noindex removal', 'permanent redirects', 'sitemap publication'],
    closureQuestion: 'Can the owner promote Detroit Dynamo with a tested preview URL, rollback target, and approved redirect/noindex plan?',
    closureAllowed: false,
  },
  {
    id: 'owner-final-signoff-and-completion-claim',
    label: 'Collect owner final signoff before completion claim',
    gateGroup: 'Owner Closeout',
    ownerRole: 'Master Admin',
    priority: 'critical',
    status: 'owner_review_required',
    sourceArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md',
      'artifacts/detroit-dynamo/goal-audit.json',
    ],
    requiredEvidence: [
      'Every external gate row has a real evidence location, approver, date, owner decision, and notes',
      'Owner signoff register has signed rows only after backend, payments, waivers, proof, deployment, and cutover evidence exists',
      'Final acceptance matrix external-evidence rows are approved and go-live allowed only after real evidence is attached',
      'Requirement-level goal audit proves no remaining work before any completion claim is made',
    ],
    verificationCommands: [
      'npm run verify:dynamo-owner-signoff-register',
      'npm run verify:dynamo-final-acceptance',
      'npm run audit:dynamo-goal',
    ],
    sourceAcceptanceRows: ['documentation-and-launch-handoff'],
    sourcePromotionGates: ['Owner launch approval'],
    sourceConfirmationAreas: ['Owner Closeout'],
    blockedLiveActions: ['goal completion claim', 'owner closeout', 'public launch announcement'],
    closureQuestion: 'Has the owner signed every external gate row with evidence strong enough to claim the original objective complete?',
    closureAllowed: false,
  },
];

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function countBy(items, field) {
  return items.reduce((totals, item) => {
    const key = item[field] || 'unknown';
    totals[key] = (totals[key] || 0) + 1;
    return totals;
  }, {});
}

export function buildDetroitDynamoExternalGateClosureReport() {
  const blockedLiveActions = [...new Set(
    detroitDynamoExternalGateClosureRows.flatMap((row) => row.blockedLiveActions),
  )].sort();
  const sourceArtifacts = [...new Set(
    detroitDynamoExternalGateClosureRows.flatMap((row) => row.sourceArtifacts),
  )].sort();
  const verificationCommands = [...new Set(
    detroitDynamoExternalGateClosureRows.flatMap((row) => row.verificationCommands),
  )].sort();
  const requiredEvidenceItems = detroitDynamoExternalGateClosureRows.reduce(
    (total, row) => total + row.requiredEvidence.length,
    0,
  );
  const finalExternalRows = detroitDynamoFinalAcceptanceRows.filter((row) => (
    row.completionStatus === 'external_evidence_required'
  ));

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoExternalGateClosureDecision,
    columns: detroitDynamoExternalGateClosureColumns,
    rows: detroitDynamoExternalGateClosureRows,
    summary: {
      rowsTotal: detroitDynamoExternalGateClosureRows.length,
      externalEvidenceRows: detroitDynamoExternalGateClosureRows.filter((row) => row.status === 'external_evidence_required').length,
      ownerReviewRows: detroitDynamoExternalGateClosureRows.filter((row) => row.status === 'owner_review_required').length,
      criticalRows: detroitDynamoExternalGateClosureRows.filter((row) => row.priority === 'critical').length,
      gateGroups: Object.keys(countBy(detroitDynamoExternalGateClosureRows, 'gateGroup')).length,
      ownerRoles: Object.keys(countBy(detroitDynamoExternalGateClosureRows, 'ownerRole')).length,
      sourceArtifacts: sourceArtifacts.length,
      requiredEvidenceItems,
      verificationCommands: verificationCommands.length,
      blockedLiveActions: blockedLiveActions.length,
      sourcePromotionGates: detroitDynamoPromotionGates.length,
      sourceConfirmationAreas: detroitDynamoExternalConfirmationRegister.length,
      launchEvidenceItems: detroitDynamoLaunchEvidenceChecklist.length,
      backendActivationSteps: detroitDynamoBackendActivationSteps.length,
      finalAcceptanceExternalRows: finalExternalRows.length,
      readyToCloseRows: detroitDynamoExternalGateClosureRows.filter((row) => row.status === 'ready_to_close').length,
      closureAllowedRows: detroitDynamoExternalGateClosureRows.filter((row) => row.closureAllowed).length,
      liveGatesCleared: 0,
      publicationsUnlocked: 0,
      productionDeploymentsRecorded: 0,
      productionSubmissionsRecorded: 0,
      rootPromotionAllowed: false,
      checkoutAllowed: false,
      signatureCaptureAllowed: false,
      completionClaimAllowed: false,
    },
    gateGroups: countBy(detroitDynamoExternalGateClosureRows, 'gateGroup'),
    ownerRoles: countBy(detroitDynamoExternalGateClosureRows, 'ownerRole'),
    sourceArtifacts,
    verificationCommands,
    blockedLiveActions,
    usageRules: [
      'Use this packet after the preview implementation passes local verification and before any live promotion meeting.',
      'Fill real evidence locations in the owner evidence intake worksheet; this packet only names the evidence required.',
      'Do not mark any row ready to close until its external proof, owner approver, date, and verification command output exist.',
      'Keep completion claims, root promotion, checkout, signatures, redirects, and publication blocked until all closure rows are approved.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoExternalGateClosureReport(report);
  return report;
}

export function buildDetroitDynamoExternalGateClosureCsv(
  report = buildDetroitDynamoExternalGateClosureReport(),
) {
  return [
    report.columns.join(','),
    ...report.rows.map((row) => (
      report.columns.map((column) => csvEscape(row[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoExternalGateClosureMarkdown(
  report = buildDetroitDynamoExternalGateClosureReport(),
) {
  const lines = [
    '# Detroit Dynamo External Gate Closure Packet',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    'This packet does not close external gates, approve launch, enable payments, enable signature capture, publish claims, remove noindex, apply redirects, or replace the current Detroit Dynamo root site.',
    '',
    '## Summary',
    '',
    `- Closure rows: ${report.summary.rowsTotal}`,
    `- External-evidence rows: ${report.summary.externalEvidenceRows}`,
    `- Owner-review rows: ${report.summary.ownerReviewRows}`,
    `- Critical rows: ${report.summary.criticalRows}`,
    `- Gate groups: ${report.summary.gateGroups}`,
    `- Owner roles: ${report.summary.ownerRoles}`,
    `- Source artifacts: ${report.summary.sourceArtifacts}`,
    `- Required evidence items: ${report.summary.requiredEvidenceItems}`,
    `- Verification commands: ${report.summary.verificationCommands}`,
    `- Blocked live actions: ${report.summary.blockedLiveActions}`,
    `- Ready-to-close rows: ${report.summary.readyToCloseRows}`,
    `- Closure-allowed rows: ${report.summary.closureAllowedRows}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    `- Production deployments recorded: ${report.summary.productionDeploymentsRecorded}`,
    `- Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`,
    `- Root promotion allowed: ${report.summary.rootPromotionAllowed}`,
    `- Checkout allowed: ${report.summary.checkoutAllowed}`,
    `- Signature capture allowed: ${report.summary.signatureCaptureAllowed}`,
    `- Completion claim allowed: ${report.summary.completionClaimAllowed}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Closure Rows',
    '',
    '| Row | Group | Owner | Priority | Status | Closure Question |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.rows.map((row) => (
      `| ${row.label} | ${row.gateGroup} | ${row.ownerRole} | ${row.priority} | ${row.status} | ${row.closureQuestion} |`
    )),
    '',
    '## Required Evidence By Row',
    '',
    ...report.rows.flatMap((row) => [
      `### ${row.label}`,
      '',
      `Owner: ${row.ownerRole}`,
      '',
      `Status: ${row.status}`,
      '',
      'Required evidence:',
      ...row.requiredEvidence.map((item) => `- [ ] ${item}`),
      '',
      'Verification commands:',
      ...row.verificationCommands.map((command) => `- \`${command}\``),
      '',
      'Source artifacts:',
      ...row.sourceArtifacts.map((artifact) => `- \`${artifact}\``),
      '',
      'Blocked live actions:',
      ...row.blockedLiveActions.map((action) => `- ${action}`),
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

export function auditDetroitDynamoExternalGateClosureReport(
  report = buildDetroitDynamoExternalGateClosureReport(),
) {
  const issues = [];
  const requiredIds = [
    'appwrite-project-and-credentials',
    'appwrite-schema-provisioning',
    'function-deployment-and-production-preview-submissions',
    'payment-package-provider-products',
    'waiver-legal-signature-workflow',
    'league-facility-confirmations',
    'staff-roster-sponsor-media-proof',
    'vercel-preview-deployment-cutover-and-rollback',
    'owner-final-signoff-and-completion-claim',
  ];

  assertReport(report.decision?.decision === 'external_gate_closure_required_preview_only', 'External gate closure must remain preview-only and required.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'External gate closure launch mode must remain preview-only.', issues);
  assertReport(report.decision?.closureAllowed === false, 'External gate closure must not allow closure by default.', issues);
  assertReport(report.decision?.completionClaimAllowed === false, 'External gate closure must not allow completion claims.', issues);
  assertReport(report.summary.rowsTotal >= requiredIds.length, 'External gate closure should cover every required closure row.', issues);
  assertReport(report.summary.externalEvidenceRows >= 8, 'External gate closure should keep external-evidence rows visible.', issues);
  assertReport(report.summary.criticalRows >= 6, 'External gate closure should mark critical launch blockers.', issues);
  assertReport(report.summary.readyToCloseRows === 0, 'External gate closure must not mark rows ready to close in preview.', issues);
  assertReport(report.summary.closureAllowedRows === 0, 'External gate closure rows must not be closure-allowed in preview.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'External gate closure must not clear live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'External gate closure must not unlock publications.', issues);
  assertReport(report.summary.productionDeploymentsRecorded === 0, 'External gate closure must not record production deployments.', issues);
  assertReport(report.summary.productionSubmissionsRecorded === 0, 'External gate closure must not record production submissions.', issues);
  assertReport(report.summary.rootPromotionAllowed === false, 'External gate closure must block root promotion.', issues);
  assertReport(report.summary.checkoutAllowed === false, 'External gate closure must block checkout.', issues);
  assertReport(report.summary.signatureCaptureAllowed === false, 'External gate closure must block signature capture.', issues);
  assertReport(report.summary.completionClaimAllowed === false, 'External gate closure must block completion claims.', issues);
  assertReport(report.summary.finalAcceptanceExternalRows >= 5, 'External gate closure must reference final acceptance external rows.', issues);
  assertReport(report.summary.launchEvidenceItems >= 13, 'External gate closure must reference launch evidence items.', issues);
  assertReport(report.summary.backendActivationSteps >= 8, 'External gate closure must reference backend activation steps.', issues);
  assertReport(report.usageRules.length >= 4, 'External gate closure needs usage rules.', issues);
  assertReport(report.blockedLiveActions.length >= 12, 'External gate closure should list blocked live actions.', issues);

  for (const id of requiredIds) {
    assertReport(report.rows.some((row) => row.id === id), `Missing external gate closure row: ${id}.`, issues);
  }

  const ids = new Set();
  for (const row of report.rows) {
    assertReport(!ids.has(row.id), `Duplicate external gate closure row id: ${row.id}.`, issues);
    ids.add(row.id);
    assertReport(row.label && row.label.length >= 12, `${row.id} needs a clear label.`, issues);
    assertReport(row.ownerRole && row.ownerRole.length > 3, `${row.id} needs an owner role.`, issues);
    assertReport(['critical', 'high', 'medium'].includes(row.priority), `${row.id} has an unsupported priority.`, issues);
    assertReport(!['complete', 'closed', 'approved', 'live', 'ready_to_close'].includes(row.status), `${row.id} must not be marked closed or live.`, issues);
    assertReport(row.closureAllowed === false, `${row.id} must not allow closure in preview.`, issues);
    assertReport(Array.isArray(row.sourceArtifacts) && row.sourceArtifacts.length >= 1, `${row.id} needs source artifacts.`, issues);
    assertReport(Array.isArray(row.requiredEvidence) && row.requiredEvidence.length >= 3, `${row.id} needs required evidence.`, issues);
    assertReport(Array.isArray(row.verificationCommands) && row.verificationCommands.length >= 2, `${row.id} needs verification commands.`, issues);
    assertReport(Array.isArray(row.blockedLiveActions) && row.blockedLiveActions.length >= 1, `${row.id} needs blocked live actions.`, issues);
    assertReport(row.closureQuestion && row.closureQuestion.endsWith('?'), `${row.id} needs a closure question.`, issues);
  }

  assertReport(report.rows.some((row) => row.verificationCommands.includes('npm run verify:dynamo-vercel-preview')), 'External gate closure should include Vercel preview verification.', issues);
  assertReport(report.rows.some((row) => row.verificationCommands.includes('npm run verify:dynamo-secret-redaction')), 'External gate closure should include secret redaction verification.', issues);
  assertReport(report.rows.some((row) => row.verificationCommands.includes('npm run preflight:dynamo-backend')), 'External gate closure should include backend preflight verification.', issues);

  return issues;
}
