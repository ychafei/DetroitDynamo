import {
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoLaunchReadiness,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';
import { buildDetroitDynamoLaunchEvidenceReport } from './detroitDynamoLaunchEvidenceContract.js';
import { buildDetroitDynamoOwnerEvidenceIntakeReport } from './detroitDynamoOwnerEvidenceIntake.js';
import { buildDetroitDynamoOwnerLaunchReviewReport } from './detroitDynamoOwnerLaunchReview.js';
import { buildDetroitDynamoProductionPreviewEvidenceReport } from './detroitDynamoProductionPreviewEvidence.js';

export const detroitDynamoLiveReadinessBoardDecision = {
  decision: 'no_go_preview_only',
  label: 'No-Go: Preview Only',
  reason: 'Detroit Dynamo has a complete preview and launch handoff, but live backend, payment, waiver, fact-proof, SEO, redirect, and owner approval gates are not cleared.',
};

export const detroitDynamoLiveReadinessBoardRows = [
  {
    id: 'current-site-rollback',
    label: 'Legacy public route and rollback',
    ownerRole: 'Master Admin',
    phase: 'Preserve existing business',
    sourceGates: ['Legacy public route preservation'],
    confirmationAreas: ['Legacy Public Routes'],
    productionTrackTypes: ['route_browser_qa'],
    readinessCategories: [],
    liveDecision: 'review_ready_not_promoted',
    requiredProof: [
      'Legacy public route smoke output from the production-preview URL',
      'Browser QA screenshots for the current homepage and booking shell',
      'Rollback deployment id or prior production build target',
    ],
    verificationCommands: [
      'BASE_URL=<production-preview-url> npm run test -- --run',
      'BASE_URL=<production-preview-url> npm run qa:dynamo-browser',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/goal-audit.json',
      'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
    ],
    blockedLiveActions: ['root route promotion', 'permanent redirects', 'noindex removal'],
  },
  {
    id: 'backend-appwrite-live',
    label: 'Backend and Appwrite live mode',
    ownerRole: 'Master Admin',
    phase: 'Activate isolated data backend',
    sourceGates: ['Data backend live'],
    confirmationAreas: ['Backend/Data'],
    productionTrackTypes: ['backend_activation'],
    readinessCategories: ['Backend/Data'],
    liveDecision: 'blocked_until_backend_evidence',
    requiredProof: [
      'Preflight report without secret leakage',
      'Provision/apply transcript for isolated dd_* collections',
      'Function variables and deployment proof for all Detroit Dynamo functions',
    ],
    verificationCommands: [
      'npm run preflight:dynamo-backend',
      'npm run provision:dynamo-appwrite -- --apply',
      'node scripts/configure-functions.mjs',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md',
    ],
    blockedLiveActions: ['Appwrite intake default', 'live lead routing', 'protected admin live writes'],
  },
  {
    id: 'public-form-production-preview',
    label: 'Public form production-preview submissions',
    ownerRole: 'Registrar',
    phase: 'Verify lead intake',
    sourceGates: ['Data backend live'],
    confirmationAreas: ['Backend/Data'],
    productionTrackTypes: ['public_form_submission', 'public_validation_probe'],
    readinessCategories: ['Backend/Data'],
    liveDecision: 'blocked_until_submission_ids',
    requiredProof: [
      'Production-preview submission id for each public lead form variant',
      'Successful validation and storage-error probes',
      'Admin routing confirmation for training, youth, tryout, senior, sponsor, and contact leads',
    ],
    verificationCommands: [
      'npm run verify:dynamo-intake-contract',
      'BASE_URL=<production-preview-url> npm run qa:dynamo-browser',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md',
    ],
    blockedLiveActions: ['default live intake', 'live lead routing', 'owner launch approval'],
  },
  {
    id: 'protected-admin-live-operations',
    label: 'Protected admin live operations',
    ownerRole: 'Master Admin',
    phase: 'Verify role-scoped admin',
    sourceGates: ['Data backend live'],
    confirmationAreas: ['Backend/Data', 'Staff, Rosters & Safeguarding'],
    productionTrackTypes: ['admin_function_action', 'admin_record_workspace'],
    readinessCategories: ['Backend/Data'],
    liveDecision: 'blocked_until_admin_function_evidence',
    requiredProof: [
      'Authenticated success and rejection fixture results for pipeline, module-read, role-grant, and module-write functions',
      'Audit event ids for permitted actions',
      'Rejected unauthorized requests without protected record mutation',
    ],
    verificationCommands: [
      'npm run verify:dynamo-pipeline-actions',
      'npm run verify:dynamo-admin-module-read',
      'npm run verify:dynamo-admin-role-grants',
      'npm run verify:dynamo-admin-module-writes',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md',
    ],
    blockedLiveActions: ['protected admin live reads', 'protected admin live writes', 'trusted role grants'],
  },
  {
    id: 'payments-packages-provider',
    label: 'Payments, packages, and provider tests',
    ownerRole: 'Master Admin',
    phase: 'Approve commercial setup',
    sourceGates: ['Payments approved'],
    confirmationAreas: ['Payments & Packages'],
    productionTrackTypes: ['external_confirmation'],
    readinessCategories: ['Payments/Packages'],
    liveDecision: 'blocked_until_payment_approval',
    requiredProof: [
      'Owner-approved package matrix with exact prices, taxes, fees, session counts, and refund rules',
      'Provider product ids or invoice workflow ids',
      'Sandbox success, failure, cancel, refund, webhook, and audit evidence',
    ],
    verificationCommands: [
      'npm run verify:dynamo-gate-contracts',
      'Provider sandbox test plan',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    blockedLiveActions: ['checkout activation', 'payment collection', 'published exact pricing'],
  },
  {
    id: 'waivers-legal-signature',
    label: 'Waivers, legal, and signature workflow',
    ownerRole: 'Registrar',
    phase: 'Approve participation controls',
    sourceGates: ['Waivers approved'],
    confirmationAreas: ['Waivers & Legal'],
    productionTrackTypes: ['external_confirmation'],
    readinessCategories: ['Waivers/Legal'],
    liveDecision: 'blocked_until_legal_approval',
    requiredProof: [
      'Approved waiver/legal version register for youth, adult, medical, media, camp, and travel consent',
      'Guardian and adult signature workflow tests',
      'Retention, expiration, revocation, and roster-eligibility rules',
    ],
    verificationCommands: [
      'npm run verify:dynamo-gate-contracts',
      'npm run verify:dynamo-safeguarding',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    blockedLiveActions: ['signature capture', 'medical intake', 'roster eligibility clearance'],
  },
  {
    id: 'league-facility-operations-proof',
    label: 'League, facility, and operations proof',
    ownerRole: 'Club Director',
    phase: 'Confirm real-world soccer operations',
    sourceGates: ['League and facility facts confirmed'],
    confirmationAreas: ['League & Competition Facts', 'Facilities & Operations'],
    productionTrackTypes: ['external_confirmation'],
    readinessCategories: ['League/Competition', 'Facilities/Operations'],
    liveDecision: 'blocked_until_fact_confirmation',
    requiredProof: [
      'Official league or owner-approved future-pathway wording for every competition claim',
      'Facility permits, calendars, insurance notes, emergency procedures, and publish approval',
      'Fixture, opponent, venue, roster, staff, and competition proof before publication',
    ],
    verificationCommands: [
      'npm run verify:dynamo-claim-safety',
      'npm run verify:dynamo-safeguarding',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    blockedLiveActions: ['league claim publication', 'facility publication', 'fixture/result publication'],
  },
  {
    id: 'staff-roster-safeguarding-proof',
    label: 'Staff, rosters, and safeguarding proof',
    ownerRole: 'Club Director',
    phase: 'Protect youth and roster data',
    sourceGates: ['League and facility facts confirmed'],
    confirmationAreas: ['Staff, Rosters & Safeguarding'],
    productionTrackTypes: ['external_confirmation'],
    readinessCategories: ['League/Competition'],
    liveDecision: 'blocked_until_safeguarding_review',
    requiredProof: [
      'Approved staff names, roles, bios, photos, licenses, and public contact rules',
      'Background/safeguarding review for youth-facing staff',
      'Guardian/media-release controls before youth roster or player profile publication',
    ],
    verificationCommands: [
      'npm run verify:dynamo-safeguarding',
      'npm run verify:dynamo-admin-role-grants',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    blockedLiveActions: ['staff proof publication', 'youth roster publication', 'team-manager sensitive access'],
  },
  {
    id: 'sponsor-media-content-proof',
    label: 'Sponsor, media, and content proof',
    ownerRole: 'Media/Admin Staff',
    phase: 'Approve public proof',
    sourceGates: ['League and facility facts confirmed', 'SEO and redirect launch approved'],
    confirmationAreas: ['Sponsors, Media & Content Proof'],
    productionTrackTypes: ['external_confirmation'],
    readinessCategories: ['Content/Brand Promotion'],
    liveDecision: 'blocked_until_content_permissions',
    requiredProof: [
      'Sponsor logo permissions, website links, package inventory, and display rules',
      'Testimonial, player story, photo, video, and media-release permissions',
      'Launch content calendar and proof source material',
    ],
    verificationCommands: [
      'npm run verify:dynamo-claim-safety',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    blockedLiveActions: ['sponsor logo publication', 'testimonial publication', 'player outcome publication'],
  },
  {
    id: 'seo-redirect-root-cutover',
    label: 'SEO, redirects, and root cutover',
    ownerRole: 'Master Admin',
    phase: 'Promote public brand only after approval',
    sourceGates: ['SEO and redirect launch approved'],
    confirmationAreas: ['Sponsors, Media & Content Proof'],
    productionTrackTypes: ['route_browser_qa', 'external_confirmation'],
    readinessCategories: ['Content/Brand Promotion'],
    liveDecision: 'blocked_until_cutover_approval',
    requiredProof: [
      'Approved titles, descriptions, favicon, Open Graph asset, robots, sitemap, canonical URLs, and noindex removal',
      'Redirect/exclusion decisions for old LC routes, auth routes, admin routes, booking, and payment callbacks',
      'Post-cutover desktop/mobile route QA plan and rollback instructions',
    ],
    verificationCommands: [
      'BASE_URL=<production-preview-url> npm run verify:dynamo',
      'BASE_URL=<production-url> npm run qa:dynamo-browser',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-redirect-plan.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    blockedLiveActions: ['root metadata replacement', 'noindex removal', 'permanent redirects'],
  },
  {
    id: 'post-launch-monitoring-rollback',
    label: 'Post-launch monitoring and rollback',
    ownerRole: 'Master Admin',
    phase: 'Watch the launch window',
    sourceGates: ['SEO and redirect launch approved'],
    confirmationAreas: ['Sponsors, Media & Content Proof'],
    productionTrackTypes: ['route_browser_qa'],
    readinessCategories: ['Content/Brand Promotion'],
    liveDecision: 'blocked_until_monitoring_owner',
    requiredProof: [
      'Named monitoring owner for first hour and first week',
      'Rollback trigger list for routes, forms, booking, auth, admin, payments, waivers, analytics, and support',
      'Support inbox, legal/support sender identity, analytics, and search-console watch plan',
    ],
    verificationCommands: [
      'BASE_URL=<production-url> npm run qa:dynamo-browser',
      'npm run audit:dynamo-goal',
    ],
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
      'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-launch-review.md',
    ],
    blockedLiveActions: ['post-launch closeout', 'permanent redirect finalization', 'launch announcement closeout'],
  },
];

export const detroitDynamoLiveReadinessBoardColumns = [
  'id',
  'label',
  'phase',
  'ownerRole',
  'liveDecision',
  'promotionGateStatuses',
  'readinessStatuses',
  'externalConfirmationStatuses',
  'evidenceItems',
  'intakeRows',
  'productionPreviewTracks',
  'requiredProof',
  'verificationCommands',
  'artifactReferences',
  'blockedLiveActions',
  'goLiveAllowed',
];

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function statusList(items, key, value) {
  return items.map((item) => `${item[key]}: ${item[value]}`);
}

function rowMatchesEvidence(row, item) {
  return row.sourceGates.includes(item.promotionGate)
    || row.confirmationAreas.includes(item.confirmationArea);
}

function rowMatchesIntake(row, item) {
  return row.sourceGates.includes(item.promotion_gate)
    || row.confirmationAreas.includes(item.confirmation_area)
    || row.confirmationAreas.includes(item.review_section);
}

function rowMatchesProductionTrack(row, track) {
  return row.productionTrackTypes.includes(track.trackType)
    && (
      row.ownerRole === track.ownerRole
      || row.confirmationAreas.some((area) => track.sourceReferences.join(' ').includes(area))
      || row.sourceGates.some((gate) => track.sourceReferences.join(' ').includes(gate))
      || row.id.includes(track.trackType.split('_')[0])
    );
}

export function buildDetroitDynamoLiveReadinessBoardReport() {
  const launchEvidence = buildDetroitDynamoLaunchEvidenceReport();
  const ownerLaunchReview = buildDetroitDynamoOwnerLaunchReviewReport();
  const ownerEvidenceIntake = buildDetroitDynamoOwnerEvidenceIntakeReport();
  const productionPreviewEvidence = buildDetroitDynamoProductionPreviewEvidenceReport();

  const rows = detroitDynamoLiveReadinessBoardRows.map((row) => {
    const promotionGates = detroitDynamoPromotionGates.filter((gate) => row.sourceGates.includes(gate.gate));
    const readinessItems = detroitDynamoLaunchReadiness.filter((item) => row.readinessCategories.includes(item.category));
    const externalConfirmations = detroitDynamoExternalConfirmationRegister.filter((item) => (
      row.confirmationAreas.includes(item.area)
    ));
    const evidenceItems = launchEvidence.checklistItems.filter((item) => rowMatchesEvidence(row, item));
    const intakeRows = ownerEvidenceIntake.intakeRows.filter((item) => rowMatchesIntake(row, item));
    const productionTracks = productionPreviewEvidence.tracks.filter((track) => rowMatchesProductionTrack(row, track));

    return {
      ...row,
      promotionGateStatuses: statusList(promotionGates, 'gate', 'status'),
      readinessStatuses: statusList(readinessItems, 'category', 'status'),
      externalConfirmationStatuses: statusList(externalConfirmations, 'area', 'status'),
      evidenceItems: evidenceItems.length,
      intakeRows: intakeRows.length,
      productionPreviewTracks: productionTracks.length,
      goLiveAllowed: false,
      previewOnlyReason: 'External evidence and owner approval are still required before this row can unlock any live action.',
    };
  });

  const blockedLiveActions = [...new Set(rows.flatMap((row) => row.blockedLiveActions))].sort();
  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoLiveReadinessBoardDecision,
    columns: detroitDynamoLiveReadinessBoardColumns,
    rows,
    summary: {
      rowsTotal: rows.length,
      goLiveAllowedRows: rows.filter((row) => row.goLiveAllowed).length,
      blockedRows: rows.filter((row) => !row.goLiveAllowed).length,
      liveGatesCleared: ownerLaunchReview.summary.liveGatesCleared
        + ownerEvidenceIntake.summary.liveGatesCleared
        + productionPreviewEvidence.summary.liveGatesCleared,
      publicationsUnlocked: ownerLaunchReview.summary.publicationsUnlocked
        + ownerEvidenceIntake.summary.publicationsUnlocked
        + productionPreviewEvidence.summary.publicationsUnlocked,
      productionSubmissionsRecorded: productionPreviewEvidence.summary.productionSubmissionsRecorded,
      safeToPublishRows: ownerEvidenceIntake.summary.safeToPublishRows,
      rootPromotionAllowed: false,
      liveBackendDefaultAllowed: false,
      checkoutAllowed: false,
      signatureCaptureAllowed: false,
      publicClaimPublicationAllowed: false,
      noindexRemovalAllowed: false,
      permanentRedirectsAllowed: false,
      blockedLiveActions: blockedLiveActions.length,
      ownerReviewDecision: ownerLaunchReview.decision.decision,
      ownerEvidenceIntakeRows: ownerEvidenceIntake.summary.intakeRows,
      productionPreviewEvidenceTracks: productionPreviewEvidence.summary.tracksTotal,
      launchEvidenceItems: launchEvidence.summary.total,
    },
    launchBlockers: [
      'Do not replace the Detroit Dynamo root route.',
      'Do not remove noindex or publish permanent redirects.',
      'Do not make Appwrite intake, admin writes, checkout, or waiver signatures live by default.',
      'Do not publish current league, facility, staff, roster, sponsor, testimonial, or outcome claims without proof.',
      'Do not announce launch until owner evidence intake, production-preview evidence, and owner launch review are all signed off.',
    ],
    blockedLiveActions,
    referencedReports: {
      ownerLaunchReview: ownerLaunchReview.summary,
      ownerEvidenceIntake: ownerEvidenceIntake.summary,
      productionPreviewEvidence: productionPreviewEvidence.summary,
      launchEvidence: launchEvidence.summary,
    },
    issues: [],
  };

  report.issues = auditDetroitDynamoLiveReadinessBoardReport(report);
  return report;
}

export function buildDetroitDynamoLiveReadinessBoardCsv(
  report = buildDetroitDynamoLiveReadinessBoardReport(),
) {
  return [
    report.columns.join(','),
    ...report.rows.map((row) => (
      report.columns.map((column) => csvEscape(row[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoLiveReadinessBoardMarkdown(
  report = buildDetroitDynamoLiveReadinessBoardReport(),
) {
  const lines = [
    '# Detroit Dynamo Live Readiness Board',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Rows: ${report.summary.rowsTotal}`,
    `- Blocked rows: ${report.summary.blockedRows}`,
    `- Go-live allowed rows: ${report.summary.goLiveAllowedRows}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    `- Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`,
    `- Safe-to-publish rows: ${report.summary.safeToPublishRows}`,
    `- Root promotion allowed: ${report.summary.rootPromotionAllowed}`,
    `- Checkout allowed: ${report.summary.checkoutAllowed}`,
    `- Signature capture allowed: ${report.summary.signatureCaptureAllowed}`,
    `- Public claim publication allowed: ${report.summary.publicClaimPublicationAllowed}`,
    `- Noindex removal allowed: ${report.summary.noindexRemovalAllowed}`,
    `- Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`,
    '',
    '## Launch Blockers',
    '',
    ...report.launchBlockers.map((blocker) => `- ${blocker}`),
    '',
    '## Board Rows',
    '',
    '| Phase | Owner | Decision | Gate Status | Evidence | Intake | Production Preview |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...report.rows.map((row) => (
      `| ${row.label} | ${row.ownerRole} | ${row.liveDecision} | ${row.promotionGateStatuses.join('; ') || 'No direct gate'} | ${row.evidenceItems} | ${row.intakeRows} | ${row.productionPreviewTracks} |`
    )),
    '',
    '## Row Details',
    '',
    ...report.rows.flatMap((row) => [
      `### ${row.label}`,
      '',
      `Phase: ${row.phase}`,
      '',
      `Owner: ${row.ownerRole}`,
      '',
      `Decision: ${row.liveDecision}`,
      '',
      `Go-live allowed: ${row.goLiveAllowed}`,
      '',
      'Required proof:',
      ...row.requiredProof.map((item) => `- [ ] ${item}`),
      '',
      'Verification commands:',
      ...row.verificationCommands.map((item) => `- \`${item}\``),
      '',
      'Artifacts:',
      ...row.artifactReferences.map((item) => `- ${item}`),
      '',
      'Blocked live actions:',
      ...row.blockedLiveActions.map((item) => `- ${item}`),
      '',
    ]),
    '## Blocked Live Actions',
    '',
    ...report.blockedLiveActions.map((action) => `- ${action}`),
    '',
    'This board is a live-readiness control surface only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish claims, remove noindex, apply redirects, or replace the current Detroit Dynamo root site.',
    '',
  ];

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoLiveReadinessBoardReport(
  report = buildDetroitDynamoLiveReadinessBoardReport(),
) {
  const issues = [];
  const requiredRowIds = [
    'current-site-rollback',
    'backend-appwrite-live',
    'public-form-production-preview',
    'protected-admin-live-operations',
    'payments-packages-provider',
    'waivers-legal-signature',
    'league-facility-operations-proof',
    'staff-roster-safeguarding-proof',
    'sponsor-media-content-proof',
    'seo-redirect-root-cutover',
    'post-launch-monitoring-rollback',
  ];

  assertReport(report.decision?.decision === 'no_go_preview_only', 'Live readiness board must remain no-go while external gates are open.', issues);
  assertReport(report.summary.rowsTotal >= requiredRowIds.length, 'Live readiness board should include every launch phase row.', issues);
  assertReport(report.summary.goLiveAllowedRows === 0, 'Live readiness board must not allow any go-live rows.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Live readiness board must not report cleared live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Live readiness board must not unlock publications.', issues);
  assertReport(report.summary.productionSubmissionsRecorded === 0, 'Live readiness board must not claim production submissions are recorded.', issues);
  assertReport(report.summary.safeToPublishRows === 0, 'Live readiness board must not mark rows safe to publish.', issues);
  assertReport(report.summary.rootPromotionAllowed === false, 'Live readiness board must not allow root promotion.', issues);
  assertReport(report.summary.liveBackendDefaultAllowed === false, 'Live readiness board must not allow live backend defaults.', issues);
  assertReport(report.summary.checkoutAllowed === false, 'Live readiness board must not allow checkout.', issues);
  assertReport(report.summary.signatureCaptureAllowed === false, 'Live readiness board must not allow signature capture.', issues);
  assertReport(report.summary.publicClaimPublicationAllowed === false, 'Live readiness board must not allow public claim publication.', issues);
  assertReport(report.summary.noindexRemovalAllowed === false, 'Live readiness board must not allow noindex removal.', issues);
  assertReport(report.summary.permanentRedirectsAllowed === false, 'Live readiness board must not allow permanent redirects.', issues);
  assertReport(report.launchBlockers.length >= 5, 'Live readiness board needs explicit launch blockers.', issues);
  assertReport(report.blockedLiveActions.length >= 10, 'Live readiness board should list blocked live actions.', issues);

  for (const id of requiredRowIds) {
    assertReport(report.rows.some((row) => row.id === id), `Missing live readiness row: ${id}.`, issues);
  }

  const ids = new Set();
  for (const row of report.rows) {
    assertReport(!ids.has(row.id), `Duplicate live readiness row id: ${row.id}.`, issues);
    ids.add(row.id);
    assertReport(row.goLiveAllowed === false, `${row.id} must not be go-live allowed.`, issues);
    assertReport(row.ownerRole && row.ownerRole.length > 3, `${row.id} needs an owner role.`, issues);
    assertReport(row.liveDecision && row.liveDecision !== 'ready_to_launch', `${row.id} needs a blocked live decision.`, issues);
    assertReport(Array.isArray(row.requiredProof) && row.requiredProof.length >= 3, `${row.id} needs at least three proof items.`, issues);
    assertReport(Array.isArray(row.verificationCommands) && row.verificationCommands.length >= 1, `${row.id} needs verification commands.`, issues);
    assertReport(Array.isArray(row.artifactReferences) && row.artifactReferences.length >= 2, `${row.id} needs artifact references.`, issues);
    assertReport(Array.isArray(row.blockedLiveActions) && row.blockedLiveActions.length >= 3, `${row.id} needs blocked live actions.`, issues);
  }

  return issues;
}
