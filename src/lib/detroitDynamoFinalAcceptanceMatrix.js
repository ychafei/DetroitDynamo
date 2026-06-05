import {
  detroitDynamoAdminModules,
  detroitDynamoDataModels,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';
import {
  detroitDynamoRouteManifest,
  detroitDynamoSitemapRoutes,
} from './detroitDynamoRouteManifest.js';
import { buildDetroitDynamoDeploymentReadinessReport } from './detroitDynamoDeploymentReadiness.js';
import { buildDetroitDynamoLiveReadinessBoardReport } from './detroitDynamoLiveReadinessBoard.js';
import { buildDetroitDynamoOwnerSignoffRegisterReport } from './detroitDynamoOwnerSignoffRegister.js';
import { buildDetroitDynamoProductionPreviewEvidenceReport } from './detroitDynamoProductionPreviewEvidence.js';

export const detroitDynamoFinalAcceptanceDecision = {
  decision: 'final_acceptance_preview_audit',
  label: 'Final Acceptance Preview Audit',
  launchMode: 'preview_only',
  completionClaimAllowed: false,
  reason: 'The Detroit Dynamo preview implementation can be audited against the original objective, but full goal completion still requires external backend, payment, waiver, league/facility, production deployment, and owner signoff evidence.',
};

export const detroitDynamoFinalAcceptanceRows = [
  {
    id: 'repo-audit-and-current-state',
    label: 'Repo audit and current-state inventory',
    acceptanceArea: 'Repo Audit',
    ownerRole: 'Master Admin',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md documents stack, routes, issues, changed files, and testing results',
      'npm run audit:dynamo-goal writes artifacts/detroit-dynamo/goal-audit.json',
      'npm run verify:dynamo checks route, metadata, launch, backend scaffold, and isolation contracts',
    ],
    remainingEvidenceRequired: [],
    verificationCommands: ['npm run audit:dynamo-goal', 'npm run verify:dynamo'],
    blockedLiveActions: ['goal completion claim'],
  },
  {
    id: 'existing-lc-site-preservation',
    label: 'Existing Detroit Dynamo site preservation',
    acceptanceArea: 'Current Site Preservation',
    ownerRole: 'Master Admin',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'Legacy public routes remain registered in src/App.jsx',
      'Shared navbar/footer use the Detroit Dynamo shell and route public visitors into the Dynamo experience',
      'Smoke/browser QA cover root, booking, legacy redirects, legal, and protected admin routes',
    ],
    remainingEvidenceRequired: [
      'Production legacy-route snapshot before any redirect or rollback change',
      'Rollback deployment id or previous production target',
    ],
    verificationCommands: ['BASE_URL=<current-production-url> npm run test -- --run', 'BASE_URL=<current-production-url> npm run qa:dynamo-browser'],
    blockedLiveActions: ['root route promotion', 'permanent redirects', 'noindex removal'],
  },
  {
    id: 'isolated-detroit-dynamo-shell',
    label: 'Isolated Detroit Dynamo parallel shell',
    acceptanceArea: 'Preview Architecture',
    ownerRole: 'Master Admin',
    completionStatus: 'preview_complete',
    currentEvidence: [
      '/detroit-dynamo and /detroit-dynamo/* use DetroitDynamoLayout, DetroitDynamoHeader, and DetroitDynamoFooter',
      'Detroit Dynamo styles are scoped under .dynamo-site',
      'Browser QA confirms / and /book do not render the Detroit Dynamo shell',
    ],
    remainingEvidenceRequired: [],
    verificationCommands: ['BASE_URL=<preview-url> npm run verify:dynamo', 'BASE_URL=<preview-url> npm run qa:dynamo-browser'],
    blockedLiveActions: ['root route promotion'],
  },
  {
    id: 'brand-system-and-assets',
    label: 'Detroit Dynamo brand system, logo assets, and metadata',
    acceptanceArea: 'Brand/SEO Preview',
    ownerRole: 'Media/Admin Staff',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'Approved Detroit Dynamo public assets live under public/detroit-dynamo/',
      'Detroit Dynamo pages use route-specific metadata, social image, canonical URL, and index,follow robots metadata',
      'The root metadata and PWA manifest now use Detroit Dynamo assets',
    ],
    remainingEvidenceRequired: [
      'Owner approval of final favicon, Open Graph image, canonical URL, sitemap timing, and domain ownership',
    ],
    verificationCommands: ['BASE_URL=<preview-url> npm run verify:dynamo', 'BASE_URL=<preview-url> npm run qa:dynamo-browser'],
    blockedLiveActions: ['noindex removal', 'root route promotion', 'sitemap publication'],
  },
  {
    id: 'public-site-pages-and-pathway',
    label: 'Full public Detroit Dynamo site structure and player pathway',
    acceptanceArea: 'Public Website',
    ownerRole: 'Club Director',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'Route manifest includes the requested home, training, youth, senior, tryout, teams, schedule, camps, sponsors, about, contact, book, brand, and admin-foundation routes',
      'Public pages explain Training Academy, Youth Club, Senior Men, Senior Women, camps, sponsors, and the Dynamo Development Pathway',
      'League and youth-club language remains future-pathway or approval-gated where memberships are not confirmed',
    ],
    remainingEvidenceRequired: [
      'Owner-approved final copy for league, facility, roster, staff, sponsor, testimonial, and news claims',
    ],
    verificationCommands: ['BASE_URL=<preview-url> npm run test -- --run', 'BASE_URL=<preview-url> npm run verify:dynamo'],
    blockedLiveActions: ['league claim publication', 'facility publication', 'roster publication', 'sponsor logo publication'],
  },
  {
    id: 'public-lead-forms-and-routing',
    label: 'Validated public lead forms and routing',
    acceptanceArea: 'Forms/Lead System',
    ownerRole: 'Registrar',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'DetroitDynamoLeadForm supports contact, training, youth, tryout, men, women, and sponsor variants',
      'Forms include validation, loading, success, error, and accessible field error states',
      'Browser QA submits all seven public forms and verifies validation plus storage-error probes',
    ],
    remainingEvidenceRequired: [
      'Production-preview submission ids for each form after Appwrite intake is deployed',
    ],
    verificationCommands: ['BASE_URL=<preview-url> npm run qa:dynamo-browser', 'npm run verify:dynamo-intake-contract'],
    blockedLiveActions: ['Appwrite intake default', 'public launch announcement'],
  },
  {
    id: 'admin-data-model-foundation',
    label: 'Admin roles, modules, data models, and records foundation',
    acceptanceArea: 'Admin/Data Foundation',
    ownerRole: 'Master Admin',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'Data model covers Player, ParentGuardian, Coach, Team, Program, TrainingPackage, TrainingSession, Booking, TryoutRegistration, CampClinic, Payment, Waiver, Sponsor, NewsPost, MatchFixture, MatchResult, ContactLead, and StaffMember',
      'Admin foundation covers 7 roles and 16 planned admin modules',
      'Protected module detail pages include read/write contracts, record workspace, audit ledgers, external gates, and safeguarding guards',
    ],
    remainingEvidenceRequired: [
      'Live Appwrite records and role-scoped dashboard workflows for daily operations',
    ],
    verificationCommands: ['npm run plan:dynamo-appwrite', 'npm run verify:dynamo-admin-record-workspace', 'BASE_URL=<preview-url> npm run verify:dynamo'],
    blockedLiveActions: ['protected admin live reads', 'protected admin live writes'],
  },
  {
    id: 'backend-appwrite-scaffold',
    label: 'Appwrite schema and function scaffold',
    acceptanceArea: 'Backend/Data',
    ownerRole: 'Master Admin',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'Appwrite collection plan uses isolated dd_* collection ids',
      'Function scaffolds exist for public intake, pipeline actions, admin module reads, role grants, and module writes',
      'Preflight and dry-run provision commands validate local readiness without mutating production state',
    ],
    remainingEvidenceRequired: [
      'Valid Appwrite credentials',
      'Provisioned dd_* collections in the target Appwrite project',
      'Deployed functions with production-preview invocation proof',
    ],
    verificationCommands: ['npm run preflight:dynamo-backend', 'npm run provision:dynamo-appwrite', 'node scripts/configure-functions.mjs'],
    blockedLiveActions: ['Appwrite intake default', 'live lead routing', 'protected admin live writes'],
  },
  {
    id: 'payments-and-packages',
    label: 'Payments, packages, and checkout readiness',
    acceptanceArea: 'Payments & Packages',
    ownerRole: 'Master Admin',
    completionStatus: 'external_evidence_required',
    currentEvidence: [
      'Payment/package gate contract keeps provider status disconnected and checkout disabled',
      'Promotion cutover and owner signoff register require payment/package approval before go-live',
      'Exact prices and packages remain gated rather than falsely published as approved live products',
    ],
    remainingEvidenceRequired: [
      'Approved package matrix with prices, taxes, fees, refund rules, and payment provider product ids',
      'Sandbox checkout, webhook, refund, failure, and audit proof',
    ],
    verificationCommands: ['npm run verify:dynamo-gate-contracts', 'npm run verify:dynamo-owner-signoff-register'],
    blockedLiveActions: ['checkout activation', 'payment collection', 'package publication'],
  },
  {
    id: 'waivers-legal-safeguarding',
    label: 'Waivers, legal, youth safeguarding, and privacy readiness',
    acceptanceArea: 'Waivers/Legal/Safeguarding',
    ownerRole: 'Registrar',
    completionStatus: 'external_evidence_required',
    currentEvidence: [
      'Safeguarding/privacy contract covers guardian consent, medical data, staff verification, roster clearance, retention, export, deletion, and audit controls',
      'Waiver tracks keep signature capture disabled in preview',
      'Owner signoff register requires waiver/legal approval before launch',
    ],
    remainingEvidenceRequired: [
      'Approved legal waiver versions and signature workflow tests',
      'Guardian/adult signature audit, export, expiration, and revocation proof',
      'Approved terms, privacy, refund, support, and communications ownership',
    ],
    verificationCommands: ['npm run verify:dynamo-safeguarding', 'npm run verify:dynamo-gate-contracts'],
    blockedLiveActions: ['signature capture', 'medical intake', 'youth registration launch', 'sensitive admin mutations'],
  },
  {
    id: 'league-facility-staff-sponsor-proof',
    label: 'League, facility, staff, roster, sponsor, and media proof',
    acceptanceArea: 'External Confirmation',
    ownerRole: 'Club Director',
    completionStatus: 'external_evidence_required',
    currentEvidence: [
      'External confirmation register keeps league, facility, staff, roster, sponsor, media, testimonial, and proof claims approval-gated',
      'Claim-safety contract keeps unconfirmed UPSL/youth league language future-pathway only',
      'Public pages avoid false current league-membership claims',
    ],
    remainingEvidenceRequired: [
      'Confirmed league/facility status or owner-approved future-pathway wording',
      'Staff, roster, sponsor logo, testimonial, media-release, and news proof approvals',
    ],
    verificationCommands: ['npm run verify:dynamo-claim-safety', 'npm run verify:dynamo-external-confirmation-actions'],
    blockedLiveActions: ['league claim publication', 'facility publication', 'staff proof publication', 'roster publication', 'sponsor logo publication'],
  },
  {
    id: 'seo-cutover-redirect-readiness',
    label: 'SEO, noindex, root promotion, redirects, and rollback',
    acceptanceArea: 'SEO/Cutover',
    ownerRole: 'Master Admin',
    completionStatus: 'external_evidence_required',
    currentEvidence: [
      'Promotion cutover, deployment readiness, live readiness, and owner signoff artifacts keep root promotion blocked',
      'Redirect plan exists as a draft artifact only',
      'Detroit Dynamo public metadata is promoted to index,follow, with redirects still draft-gated',
    ],
    remainingEvidenceRequired: [
      'Production-preview deployment id and URL',
      'Owner-approved sitemap publication, canonical/root switch, redirect plan, and rollback target',
    ],
    verificationCommands: ['npm run verify:dynamo-promotion-cutover', 'npm run verify:dynamo-deployment-readiness', 'BASE_URL=<production-preview-url> npm run verify:dynamo'],
    blockedLiveActions: ['root route promotion', 'noindex removal', 'permanent redirects', 'sitemap publication'],
  },
  {
    id: 'verification-and-browser-qa',
    label: 'Lint, typecheck, build, smoke, full verifier, and browser QA',
    acceptanceArea: 'Verification',
    ownerRole: 'Master Admin',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'lint, typecheck, build, smoke, full verifier, audit, and browser QA commands exist in package.json',
      'Browser QA verifies desktop/mobile layout, links, buttons, forms, route states, admin sign-in guards, and console cleanliness',
      'Roadmap records latest command results and known large-chunk build warning',
    ],
    remainingEvidenceRequired: [
      'Production-preview rerun of the same commands after deployment',
    ],
    verificationCommands: ['npm run lint', 'npm run typecheck', 'npm run build', 'BASE_URL=<preview-url> npm run qa:dynamo-browser'],
    blockedLiveActions: ['launch announcement', 'post-launch closeout'],
  },
  {
    id: 'documentation-and-launch-handoff',
    label: 'Documentation and launch handoff artifacts',
    acceptanceArea: 'Documentation',
    ownerRole: 'Master Admin',
    completionStatus: 'preview_complete',
    currentEvidence: [
      'DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md follows the requested final response format',
      'Launch artifact generator writes owner, backend, evidence, cutover, SEO, role, admin, and verification handoffs',
      'Launch artifact index maps handoffs to owner roles, paths, verify commands, and blocked live actions',
    ],
    remainingEvidenceRequired: [
      'Owner review of generated handoffs before any live launch meeting',
    ],
    verificationCommands: ['npm run generate:dynamo-launch-assets', 'npm run verify:dynamo-launch-artifact-index'],
    blockedLiveActions: ['owner closeout', 'promotion decision'],
  },
  {
    id: 'owner-final-signoff',
    label: 'Owner final signoff and go-live authority',
    acceptanceArea: 'Owner Decision',
    ownerRole: 'Master Admin',
    completionStatus: 'external_evidence_required',
    currentEvidence: [
      'Owner signoff register has 11 rows and keeps every row not_signed in preview',
      'Live readiness board keeps go-live allowed rows at zero',
      'Goal audit reports implemented preview scope as 7/8 with external gates pending',
    ],
    remainingEvidenceRequired: [
      'Every owner signoff row signed by a named approver with evidence attached',
      'Live readiness board converted from no-go to go only after evidence approval',
      'Production deployment, form, payment, waiver, league/facility, SEO, redirect, and rollback proof attached',
    ],
    verificationCommands: ['npm run verify:dynamo-owner-signoff-register', 'npm run verify:dynamo-live-readiness-board', 'npm run audit:dynamo-goal'],
    blockedLiveActions: ['goal completion claim', 'root route promotion', 'checkout activation', 'signature capture', 'public claim publication', 'permanent redirects'],
  },
];

export const detroitDynamoFinalAcceptanceColumns = [
  'id',
  'label',
  'acceptanceArea',
  'ownerRole',
  'completionStatus',
  'verificationCommands',
  'remainingEvidenceRequired',
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

export function buildDetroitDynamoFinalAcceptanceMatrixReport() {
  const deploymentReadiness = buildDetroitDynamoDeploymentReadinessReport();
  const liveReadinessBoard = buildDetroitDynamoLiveReadinessBoardReport();
  const ownerSignoffRegister = buildDetroitDynamoOwnerSignoffRegisterReport();
  const productionPreviewEvidence = buildDetroitDynamoProductionPreviewEvidenceReport();
  const blockedLiveActions = [...new Set(
    detroitDynamoFinalAcceptanceRows.flatMap((row) => row.blockedLiveActions),
  )].sort();

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoFinalAcceptanceDecision,
    columns: detroitDynamoFinalAcceptanceColumns,
    rows: detroitDynamoFinalAcceptanceRows,
    summary: {
      acceptanceRows: detroitDynamoFinalAcceptanceRows.length,
      previewCompleteRows: detroitDynamoFinalAcceptanceRows.filter((row) => row.completionStatus === 'preview_complete').length,
      externalEvidenceRequiredRows: detroitDynamoFinalAcceptanceRows.filter((row) => row.completionStatus === 'external_evidence_required').length,
      acceptanceAreas: Object.keys(countBy(detroitDynamoFinalAcceptanceRows, 'acceptanceArea')).length,
      ownerRoles: Object.keys(countBy(detroitDynamoFinalAcceptanceRows, 'ownerRole')).length,
      publicRoutes: detroitDynamoRouteManifest.length,
      sitemapRoutes: detroitDynamoSitemapRoutes.length,
      dataModels: Object.keys(detroitDynamoDataModels).length,
      adminModules: detroitDynamoAdminModules.length,
      promotionGates: detroitDynamoPromotionGates.length,
      externalConfirmationAreas: detroitDynamoExternalConfirmationRegister.length,
      productionPreviewTracks: productionPreviewEvidence.summary.tracksTotal,
      deploymentReadinessTracks: deploymentReadiness.summary.tracksTotal,
      ownerSignoffRows: ownerSignoffRegister.summary.signoffRows,
      ownerSignedRows: ownerSignoffRegister.summary.signedRows,
      ownerUnsignedRows: ownerSignoffRegister.summary.unsignedRows,
      liveReadinessRows: liveReadinessBoard.summary.rowsTotal,
      goLiveAllowedRows: liveReadinessBoard.summary.goLiveAllowedRows,
      liveGatesCleared: liveReadinessBoard.summary.liveGatesCleared + ownerSignoffRegister.summary.liveGatesCleared,
      publicationsUnlocked: liveReadinessBoard.summary.publicationsUnlocked + ownerSignoffRegister.summary.publicationsUnlocked,
      productionDeploymentsRecorded: deploymentReadiness.summary.productionDeploymentsRecorded,
      productionSubmissionsRecorded: deploymentReadiness.summary.productionSubmissionsRecorded,
      rootPromotionAllowed: Boolean(liveReadinessBoard.summary.rootPromotionAllowed || ownerSignoffRegister.summary.rootPromotionAllowed),
      checkoutAllowed: Boolean(liveReadinessBoard.summary.checkoutAllowed || ownerSignoffRegister.summary.checkoutAllowed),
      permanentRedirectsAllowed: Boolean(liveReadinessBoard.summary.permanentRedirectsAllowed || ownerSignoffRegister.summary.permanentRedirectsAllowed),
      blockedLiveActions: blockedLiveActions.length,
    },
    acceptanceAreas: countBy(detroitDynamoFinalAcceptanceRows, 'acceptanceArea'),
    ownerRoles: countBy(detroitDynamoFinalAcceptanceRows, 'ownerRole'),
    blockedLiveActions,
    usageRules: [
      'Use this matrix as the requirement-by-requirement completion audit for the original Detroit Dynamo objective.',
      'Rows marked preview_complete are complete for the isolated preview only; production-preview evidence may still be required before promotion.',
      'Rows marked external_evidence_required cannot be closed by code changes alone; they need real owner, legal, payment, backend, league, facility, deployment, or production evidence.',
      'Do not mark the full goal complete while ownerSignedRows, goLiveAllowedRows, liveGatesCleared, publicationsUnlocked, production deployments, and production submissions remain at zero.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoFinalAcceptanceMatrixReport(report);
  return report;
}

export function buildDetroitDynamoFinalAcceptanceMatrixCsv(
  report = buildDetroitDynamoFinalAcceptanceMatrixReport(),
) {
  return [
    report.columns.join(','),
    ...report.rows.map((row) => (
      report.columns.map((column) => csvEscape(row[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoFinalAcceptanceMatrixMarkdown(
  report = buildDetroitDynamoFinalAcceptanceMatrixReport(),
) {
  const lines = [
    '# Detroit Dynamo Final Acceptance Matrix',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Acceptance rows: ${report.summary.acceptanceRows}`,
    `- Preview-complete rows: ${report.summary.previewCompleteRows}`,
    `- External evidence required rows: ${report.summary.externalEvidenceRequiredRows}`,
    `- Public routes: ${report.summary.publicRoutes}`,
    `- Data models: ${report.summary.dataModels}`,
    `- Admin modules: ${report.summary.adminModules}`,
    `- Production-preview tracks: ${report.summary.productionPreviewTracks}`,
    `- Deployment readiness tracks: ${report.summary.deploymentReadinessTracks}`,
    `- Owner signoff rows: ${report.summary.ownerSignoffRows}`,
    `- Owner signed rows: ${report.summary.ownerSignedRows}`,
    `- Owner unsigned rows: ${report.summary.ownerUnsignedRows}`,
    `- Go-live allowed rows: ${report.summary.goLiveAllowedRows}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    `- Production deployments recorded: ${report.summary.productionDeploymentsRecorded}`,
    `- Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`,
    `- Root promotion allowed: ${report.summary.rootPromotionAllowed}`,
    `- Checkout allowed: ${report.summary.checkoutAllowed}`,
    `- Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Acceptance Matrix',
    '',
    '| Requirement | Area | Owner | Status | Verify | Remaining Evidence |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.rows.map((row) => (
      `| ${row.label} | ${row.acceptanceArea} | ${row.ownerRole} | ${row.completionStatus} | \`${row.verificationCommands.join(' && ')}\` | ${row.remainingEvidenceRequired.length || 'None for preview'} |`
    )),
    '',
    '## External Evidence Required',
    '',
  ];

  for (const row of report.rows.filter((item) => item.completionStatus === 'external_evidence_required')) {
    lines.push(
      `### ${row.label}`,
      '',
      `Blocked live actions: ${row.blockedLiveActions.join(', ')}`,
      '',
      ...row.remainingEvidenceRequired.map((item) => `- [ ] ${item}`),
      '',
    );
  }

  lines.push(
    'This matrix does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish public claims, remove noindex, apply permanent redirects, or replace the current Detroit Dynamo root site.',
    '',
  );

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoFinalAcceptanceMatrixReport(
  report = buildDetroitDynamoFinalAcceptanceMatrixReport(),
) {
  const issues = [];
  const requiredIds = [
    'repo-audit-and-current-state',
    'existing-lc-site-preservation',
    'isolated-detroit-dynamo-shell',
    'brand-system-and-assets',
    'public-site-pages-and-pathway',
    'public-lead-forms-and-routing',
    'admin-data-model-foundation',
    'backend-appwrite-scaffold',
    'payments-and-packages',
    'waivers-legal-safeguarding',
    'league-facility-staff-sponsor-proof',
    'seo-cutover-redirect-readiness',
    'verification-and-browser-qa',
    'documentation-and-launch-handoff',
    'owner-final-signoff',
  ];

  assertReport(report.decision?.decision === 'final_acceptance_preview_audit', 'Final acceptance matrix must remain a preview audit.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'Final acceptance matrix launch mode must remain preview-only.', issues);
  assertReport(report.decision?.completionClaimAllowed === false, 'Final acceptance matrix must not allow a completion claim.', issues);
  assertReport(report.summary.acceptanceRows >= requiredIds.length, 'Final acceptance matrix should cover every required acceptance row.', issues);
  assertReport(report.summary.previewCompleteRows >= 8, 'Final acceptance matrix should show substantial preview-complete coverage.', issues);
  assertReport(report.summary.externalEvidenceRequiredRows >= 5, 'Final acceptance matrix should keep external evidence rows explicit.', issues);
  assertReport(report.summary.publicRoutes >= 16, 'Final acceptance matrix should reference the public route surface.', issues);
  assertReport(report.summary.dataModels >= 18, 'Final acceptance matrix should reference the requested data model foundation.', issues);
  assertReport(report.summary.adminModules >= 16, 'Final acceptance matrix should reference the admin module foundation.', issues);
  assertReport(report.summary.ownerSignoffRows >= 11, 'Final acceptance matrix should reference owner signoff rows.', issues);
  assertReport(report.summary.ownerSignedRows === 0, 'Final acceptance matrix must not claim signed owner approvals.', issues);
  assertReport(report.summary.ownerUnsignedRows === report.summary.ownerSignoffRows, 'Final acceptance matrix should keep owner signoffs unsigned.', issues);
  assertReport(report.summary.goLiveAllowedRows === 0, 'Final acceptance matrix must not allow go-live rows.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Final acceptance matrix must not clear live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Final acceptance matrix must not unlock publications.', issues);
  assertReport(report.summary.productionDeploymentsRecorded === 0, 'Final acceptance matrix must not claim production deployments.', issues);
  assertReport(report.summary.productionSubmissionsRecorded === 0, 'Final acceptance matrix must not claim production submissions.', issues);
  assertReport(report.summary.rootPromotionAllowed === false, 'Final acceptance matrix must block root promotion.', issues);
  assertReport(report.summary.checkoutAllowed === false, 'Final acceptance matrix must block checkout.', issues);
  assertReport(report.summary.permanentRedirectsAllowed === false, 'Final acceptance matrix must block permanent redirects.', issues);
  assertReport(report.usageRules.length >= 4, 'Final acceptance matrix needs usage rules.', issues);

  const ids = new Set();
  for (const id of requiredIds) {
    assertReport(report.rows.some((row) => row.id === id), `Missing final acceptance row: ${id}.`, issues);
  }

  for (const row of report.rows) {
    assertReport(!ids.has(row.id), `Duplicate final acceptance row id: ${row.id}.`, issues);
    ids.add(row.id);
    assertReport(row.label && row.label.length >= 8, `${row.id} needs a label.`, issues);
    assertReport(row.acceptanceArea && row.acceptanceArea.length >= 5, `${row.id} needs an acceptance area.`, issues);
    assertReport(row.ownerRole && row.ownerRole.length > 3, `${row.id} needs an owner role.`, issues);
    assertReport(['preview_complete', 'external_evidence_required'].includes(row.completionStatus), `${row.id} has an invalid completion status.`, issues);
    assertReport(Array.isArray(row.currentEvidence) && row.currentEvidence.length >= 3, `${row.id} needs current evidence.`, issues);
    assertReport(Array.isArray(row.verificationCommands) && row.verificationCommands.length >= 1, `${row.id} needs verification commands.`, issues);
    assertReport(Array.isArray(row.blockedLiveActions) && row.blockedLiveActions.length >= 1, `${row.id} needs blocked live actions.`, issues);
    if (row.completionStatus === 'external_evidence_required') {
      assertReport(Array.isArray(row.remainingEvidenceRequired) && row.remainingEvidenceRequired.length >= 2, `${row.id} needs remaining external evidence.`, issues);
    }
  }

  return issues;
}
