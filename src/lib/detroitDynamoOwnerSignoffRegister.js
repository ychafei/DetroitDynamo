import {
  buildDetroitDynamoDeploymentReadinessReport,
} from './detroitDynamoDeploymentReadiness.js';
import {
  buildDetroitDynamoExternalGateContractReport,
} from './detroitDynamoExternalGateContracts.js';
import {
  buildDetroitDynamoClaimSafetyContractReport,
} from './detroitDynamoClaimSafetyContract.js';
import {
  buildDetroitDynamoLiveReadinessBoardReport,
} from './detroitDynamoLiveReadinessBoard.js';
import {
  buildDetroitDynamoOwnerEvidenceIntakeReport,
} from './detroitDynamoOwnerEvidenceIntake.js';
import {
  buildDetroitDynamoOwnerLaunchReviewReport,
} from './detroitDynamoOwnerLaunchReview.js';
import {
  buildDetroitDynamoSafeguardingReport,
} from './detroitDynamoSafeguardingContract.js';

export const detroitDynamoOwnerSignoffDecision = {
  decision: 'owner_signoff_required_preview_only',
  label: 'Owner Signoff Required',
  launchMode: 'preview_only',
  reason: 'Every final launch approval remains unsigned until real evidence, owner approval, and external confirmations are recorded.',
};

export const detroitDynamoOwnerSignoffRows = [
  {
    id: 'current-site-rollback-signoff',
    label: 'Current-site snapshot and rollback approval',
    signoffArea: 'Current Site Preservation',
    signerRole: 'Master Admin',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
    requiredEvidence: [
      'Legacy public production route smoke report',
      'Browser QA report for legacy public routes and protected admin routes',
      'Rollback deployment id or previous production target',
    ],
    verifyCommand: 'BASE_URL=<current-production-url> npm run test -- --run',
    blockedLiveActions: ['root route promotion', 'permanent redirects', 'noindex removal'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'deployment-readiness-signoff',
    label: 'Deployment and environment readiness approval',
    signoffArea: 'Deployment Readiness',
    signerRole: 'Master Admin',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md',
    requiredEvidence: [
      'Production-preview deployment URL and deployment id',
      'Hosting project link, environment, and rollback target confirmation',
      'Production-preview build, route, and browser QA proof',
    ],
    verifyCommand: 'npm run verify:dynamo-deployment-readiness',
    blockedLiveActions: ['root route promotion', 'Appwrite intake default', 'permanent redirects'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'backend-appwrite-signoff',
    label: 'Appwrite backend activation approval',
    signoffArea: 'Backend/Data',
    signerRole: 'Master Admin',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md',
    requiredEvidence: [
      'Isolated dd_* collections provisioned in the target Appwrite project',
      'Detroit Dynamo functions deployed with expected scopes and variables',
      'Bootstrap Master Admin or trusted role grant evidence recorded',
    ],
    verifyCommand: 'npm run preflight:dynamo-backend',
    blockedLiveActions: ['Appwrite intake default', 'protected admin live reads', 'protected admin live writes'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'production-preview-forms-signoff',
    label: 'Production-preview public form and admin action approval',
    signoffArea: 'Production Preview Proof',
    signerRole: 'Registrar',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md',
    requiredEvidence: [
      'Training, youth, tryout, men, women, sponsor, and contact form submission ids',
      'Authenticated pipeline, module read, role grant, and module write action ids',
      'Unauthorized admin action rejection proof and audit event ids',
    ],
    verifyCommand: 'BASE_URL=<production-preview-url> npm run qa:dynamo-browser',
    blockedLiveActions: ['default live intake', 'status mutation workflow', 'protected admin live writes'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'payment-package-signoff',
    label: 'Payment packages and provider product approval',
    signoffArea: 'Payments & Packages',
    signerRole: 'Master Admin',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
    requiredEvidence: [
      'Approved package matrix with prices, session counts, taxes, fees, and refund rules',
      'Payment provider product ids and sandbox test proof',
      'Payment failure, refund, cancellation, and webhook/audit handling proof',
    ],
    verifyCommand: 'npm run verify:dynamo-gate-contracts',
    blockedLiveActions: ['checkout activation', 'payment collection', 'package publication'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'waiver-legal-signoff',
    label: 'Waiver, legal, medical, and media release approval',
    signoffArea: 'Waivers & Legal',
    signerRole: 'Registrar',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
    requiredEvidence: [
      'Approved waiver/legal version register for youth, adult, medical, media, camp, and travel consent',
      'Guardian/adult signature workflow test with audit, export, expiration, and revocation handling',
      'Terms, privacy, refund, support, and communication ownership approval',
    ],
    verifyCommand: 'npm run verify:dynamo-safeguarding',
    blockedLiveActions: ['signature capture', 'medical intake', 'youth registration launch'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'league-facility-signoff',
    label: 'League, competition, facility, and operations fact approval',
    signoffArea: 'Facilities & Competition',
    signerRole: 'Club Director',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
    requiredEvidence: [
      'League/competition status or future-pathway wording approval',
      'Facility permits, schedule windows, emergency procedures, and insurance notes',
      'Approved public location/facility copy',
    ],
    verifyCommand: 'npm run verify:dynamo-claim-safety',
    blockedLiveActions: ['league claim publication', 'facility publication', 'fixture publication'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'staff-roster-safeguarding-signoff',
    label: 'Staff, roster, and safeguarding publication approval',
    signoffArea: 'Staff, Rosters & Safeguarding',
    signerRole: 'Club Director',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
    requiredEvidence: [
      'Staff approval and background/safeguarding status',
      'Roster publication approvals and media-release coverage',
      'Youth communication, travel, medical, retention, and audit controls approved',
    ],
    verifyCommand: 'npm run verify:dynamo-safeguarding',
    blockedLiveActions: ['staff proof publication', 'roster publication', 'sensitive admin mutations'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'sponsor-media-content-signoff',
    label: 'Sponsor, media, testimonials, and news proof approval',
    signoffArea: 'Sponsors, Media & Content Proof',
    signerRole: 'Media/Admin Staff',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
    requiredEvidence: [
      'Sponsor logo permissions and approved sponsor package copy',
      'Testimonial, media-release, news, and proof asset approvals',
      'Publishing calendar and source-of-truth links',
    ],
    verifyCommand: 'npm run verify:dynamo-external-confirmation-actions',
    blockedLiveActions: ['sponsor logo publication', 'testimonial publication', 'news proof publication'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'seo-root-redirect-signoff',
    label: 'SEO, noindex, root promotion, and redirect approval',
    signoffArea: 'SEO & Cutover',
    signerRole: 'Master Admin',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
    requiredEvidence: [
      'Approved metadata, favicon, Open Graph image, robots draft, sitemap, and canonical URLs',
      'Noindex removal approval tied to an approved launch window',
      'Redirect plan approved with auth, admin, booking, payment callback, unsubscribe, and legal exclusions',
    ],
    verifyCommand: 'BASE_URL=<production-preview-url> npm run verify:dynamo',
    blockedLiveActions: ['root route promotion', 'noindex removal', 'permanent redirects'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'post-launch-watch-signoff',
    label: 'Post-launch monitoring and rollback owner approval',
    signoffArea: 'Post-launch Monitoring',
    signerRole: 'Master Admin',
    status: 'not_signed',
    sourceArtifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md',
    requiredEvidence: [
      'Post-launch browser QA and smoke commands prepared for the production URL',
      'Rollback trigger conditions and rollback owner approved',
      'Payment, waiver, admin, support, and legal escalation plan documented',
    ],
    verifyCommand: 'BASE_URL=<production-url> npm run qa:dynamo-browser',
    blockedLiveActions: ['post-launch closeout', 'launch announcement', 'rollback window closure'],
    signoffRecorded: false,
    liveGateCleared: false,
    publicationUnlocked: false,
  },
];

export const detroitDynamoOwnerSignoffColumns = [
  'id',
  'label',
  'signoffArea',
  'signerRole',
  'status',
  'sourceArtifact',
  'verifyCommand',
  'blockedLiveActions',
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

export function buildDetroitDynamoOwnerSignoffRegisterReport() {
  const ownerLaunchReview = buildDetroitDynamoOwnerLaunchReviewReport();
  const ownerEvidenceIntake = buildDetroitDynamoOwnerEvidenceIntakeReport();
  const liveReadinessBoard = buildDetroitDynamoLiveReadinessBoardReport();
  const deploymentReadiness = buildDetroitDynamoDeploymentReadinessReport();
  const externalGateContract = buildDetroitDynamoExternalGateContractReport();
  const claimSafetyContract = buildDetroitDynamoClaimSafetyContractReport();
  const safeguardingContract = buildDetroitDynamoSafeguardingReport();
  const blockedLiveActions = [...new Set(
    detroitDynamoOwnerSignoffRows.flatMap((row) => row.blockedLiveActions),
  )].sort();

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoOwnerSignoffDecision,
    columns: detroitDynamoOwnerSignoffColumns,
    signoffRows: detroitDynamoOwnerSignoffRows,
    summary: {
      signoffRows: detroitDynamoOwnerSignoffRows.length,
      signoffAreas: Object.keys(countBy(detroitDynamoOwnerSignoffRows, 'signoffArea')).length,
      signerRoles: Object.keys(countBy(detroitDynamoOwnerSignoffRows, 'signerRole')).length,
      signedRows: detroitDynamoOwnerSignoffRows.filter((row) => row.signoffRecorded).length,
      unsignedRows: detroitDynamoOwnerSignoffRows.filter((row) => !row.signoffRecorded).length,
      liveGatesCleared: detroitDynamoOwnerSignoffRows.filter((row) => row.liveGateCleared).length + liveReadinessBoard.summary.liveGatesCleared,
      publicationsUnlocked: detroitDynamoOwnerSignoffRows.filter((row) => row.publicationUnlocked).length + liveReadinessBoard.summary.publicationsUnlocked,
      rootPromotionAllowed: Boolean(liveReadinessBoard.summary.rootPromotionAllowed),
      checkoutAllowed: Boolean(liveReadinessBoard.summary.checkoutAllowed),
      permanentRedirectsAllowed: Boolean(liveReadinessBoard.summary.permanentRedirectsAllowed),
      productionDeploymentsRecorded: deploymentReadiness.summary.productionDeploymentsRecorded,
      productionSubmissionsRecorded: deploymentReadiness.summary.productionSubmissionsRecorded,
      ownerLaunchReviewSections: ownerLaunchReview.summary.sectionsTotal,
      ownerEvidenceIntakeRows: ownerEvidenceIntake.summary.intakeRows,
      deploymentReadinessTracks: deploymentReadiness.summary.tracksTotal,
      paymentPackageTracks: externalGateContract.paymentPackageTracks.length,
      waiverTracks: externalGateContract.waiverTracks.length,
      claimSafetyTracks: claimSafetyContract.claimSafetyTracks.length,
      safeguardingTracks: safeguardingContract.safeguardingTracks.length,
      blockedLiveActions: blockedLiveActions.length,
    },
    signoffAreas: countBy(detroitDynamoOwnerSignoffRows, 'signoffArea'),
    signerRoles: countBy(detroitDynamoOwnerSignoffRows, 'signerRole'),
    blockedLiveActions,
    usageRules: [
      'Use this register as the final owner and external approval worksheet after evidence artifacts are complete.',
      'Do not convert not_signed rows to signed until the required evidence is attached and the approver is identified.',
      'Every signed row must keep the matching source artifact and verification command attached to the owner review packet.',
      'No live gate, publication, checkout, noindex, redirect, or root promotion action is allowed while any row remains unsigned.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoOwnerSignoffRegisterReport(report);
  return report;
}

export function buildDetroitDynamoOwnerSignoffRegisterCsv(
  report = buildDetroitDynamoOwnerSignoffRegisterReport(),
) {
  return [
    report.columns.join(','),
    ...report.signoffRows.map((row) => (
      report.columns.map((column) => csvEscape(row[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoOwnerSignoffRegisterMarkdown(
  report = buildDetroitDynamoOwnerSignoffRegisterReport(),
) {
  const lines = [
    '# Detroit Dynamo Owner Signoff Register',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Signoff rows: ${report.summary.signoffRows}`,
    `- Signoff areas: ${report.summary.signoffAreas}`,
    `- Signer roles: ${report.summary.signerRoles}`,
    `- Signed rows: ${report.summary.signedRows}`,
    `- Unsigned rows: ${report.summary.unsignedRows}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    `- Root promotion allowed: ${report.summary.rootPromotionAllowed}`,
    `- Checkout allowed: ${report.summary.checkoutAllowed}`,
    `- Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`,
    `- Production deployments recorded: ${report.summary.productionDeploymentsRecorded}`,
    `- Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`,
    `- Owner launch review sections: ${report.summary.ownerLaunchReviewSections}`,
    `- Owner evidence intake rows: ${report.summary.ownerEvidenceIntakeRows}`,
    `- Deployment readiness tracks: ${report.summary.deploymentReadinessTracks}`,
    `- Payment/package tracks: ${report.summary.paymentPackageTracks}`,
    `- Waiver tracks: ${report.summary.waiverTracks}`,
    `- Claim-safety tracks: ${report.summary.claimSafetyTracks}`,
    `- Safeguarding tracks: ${report.summary.safeguardingTracks}`,
    `- Blocked live actions: ${report.summary.blockedLiveActions}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Signoff Rows',
    '',
    '| Signoff | Area | Role | Status | Source Artifact | Verification |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.signoffRows.map((row) => (
      `| ${row.label} | ${row.signoffArea} | ${row.signerRole} | ${row.status} | \`${row.sourceArtifact}\` | \`${row.verifyCommand}\` |`
    )),
    '',
    '## Required Evidence',
    '',
  ];

  for (const row of report.signoffRows) {
    lines.push(
      `### ${row.label}`,
      '',
      `Blocked live actions: ${row.blockedLiveActions.join(', ')}`,
      '',
      ...row.requiredEvidence.map((item) => `- [ ] ${item}`),
      '',
    );
  }

  lines.push(
    'This signoff register is a preview handoff only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish public claims, remove noindex, apply permanent redirects, or replace the current Detroit Dynamo root site.',
    '',
  );

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoOwnerSignoffRegisterReport(
  report = buildDetroitDynamoOwnerSignoffRegisterReport(),
) {
  const issues = [];
  const requiredIds = [
    'current-site-rollback-signoff',
    'deployment-readiness-signoff',
    'backend-appwrite-signoff',
    'production-preview-forms-signoff',
    'payment-package-signoff',
    'waiver-legal-signoff',
    'league-facility-signoff',
    'staff-roster-safeguarding-signoff',
    'sponsor-media-content-signoff',
    'seo-root-redirect-signoff',
    'post-launch-watch-signoff',
  ];

  assertReport(report.decision?.decision === 'owner_signoff_required_preview_only', 'Owner signoff register must remain preview-only and required.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'Owner signoff launch mode must remain preview-only.', issues);
  assertReport(report.summary.signoffRows >= requiredIds.length, 'Owner signoff register should include every required signoff row.', issues);
  assertReport(report.summary.signedRows === 0, 'Owner signoff register must not claim signed rows.', issues);
  assertReport(report.summary.unsignedRows === report.summary.signoffRows, 'All owner signoff rows must remain unsigned in preview.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Owner signoff register must not clear live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Owner signoff register must not unlock publications.', issues);
  assertReport(report.summary.rootPromotionAllowed === false, 'Owner signoff register must block root promotion.', issues);
  assertReport(report.summary.checkoutAllowed === false, 'Owner signoff register must block checkout.', issues);
  assertReport(report.summary.permanentRedirectsAllowed === false, 'Owner signoff register must block permanent redirects.', issues);
  assertReport(report.summary.productionDeploymentsRecorded === 0, 'Owner signoff register must not claim production deployment evidence.', issues);
  assertReport(report.summary.productionSubmissionsRecorded === 0, 'Owner signoff register must not claim production submissions.', issues);
  assertReport(report.summary.deploymentReadinessTracks >= 10, 'Owner signoff register should reference deployment readiness.', issues);
  assertReport(report.summary.paymentPackageTracks >= 6, 'Owner signoff register should reference payment/package gate tracks.', issues);
  assertReport(report.summary.waiverTracks >= 6, 'Owner signoff register should reference waiver gate tracks.', issues);
  assertReport(report.summary.claimSafetyTracks >= 7, 'Owner signoff register should reference claim-safety tracks.', issues);
  assertReport(report.summary.safeguardingTracks >= 8, 'Owner signoff register should reference safeguarding tracks.', issues);
  assertReport(report.usageRules.length >= 4, 'Owner signoff register needs usage rules.', issues);

  const ids = new Set();
  for (const id of requiredIds) {
    assertReport(report.signoffRows.some((row) => row.id === id), `Missing owner signoff row: ${id}.`, issues);
  }

  for (const row of report.signoffRows) {
    assertReport(!ids.has(row.id), `Duplicate owner signoff id: ${row.id}.`, issues);
    ids.add(row.id);
    assertReport(row.label && row.label.length >= 8, `${row.id} needs a label.`, issues);
    assertReport(row.signoffArea && row.signoffArea.length >= 5, `${row.id} needs a signoff area.`, issues);
    assertReport(row.signerRole && row.signerRole.length > 3, `${row.id} needs a signer role.`, issues);
    assertReport(row.status === 'not_signed', `${row.id} must remain not_signed.`, issues);
    assertReport(row.sourceArtifact && row.sourceArtifact.startsWith('artifacts/detroit-dynamo/launch/'), `${row.id} needs a launch artifact source.`, issues);
    assertReport(Array.isArray(row.requiredEvidence) && row.requiredEvidence.length >= 3, `${row.id} needs at least three evidence items.`, issues);
    assertReport(row.verifyCommand && row.verifyCommand.length > 6, `${row.id} needs a verification command.`, issues);
    assertReport(Array.isArray(row.blockedLiveActions) && row.blockedLiveActions.length >= 2, `${row.id} needs blocked live actions.`, issues);
    assertReport(row.signoffRecorded === false, `${row.id} must not record signoff.`, issues);
    assertReport(row.liveGateCleared === false, `${row.id} must not clear a live gate.`, issues);
    assertReport(row.publicationUnlocked === false, `${row.id} must not unlock publication.`, issues);
  }

  return issues;
}
