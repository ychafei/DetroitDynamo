import {
  detroitDynamoAllRoutePaths,
} from './detroitDynamoRouteManifest.js';
import {
  detroitDynamoAdminModuleDetailRoutes,
  detroitDynamoBackendActivationSteps,
  detroitDynamoExternalConfirmationRegister,
} from './detroitDynamoDataModel.js';
import {
  buildDetroitDynamoLeadIntakeFixtures,
  buildDetroitDynamoLeadIntakeRejectionFixtures,
} from './detroitDynamoLeadIntakeContract.js';
import {
  buildDetroitDynamoPipelineActionFixtures,
  buildDetroitDynamoPipelineActionRejectionFixtures,
} from './detroitDynamoPipelineActionContract.js';
import {
  buildDetroitDynamoAdminModuleReadFixtures,
  buildDetroitDynamoAdminModuleReadRejectionFixtures,
  detroitDynamoAdminModuleReadFunctionId,
} from './detroitDynamoAdminModuleReadContract.js';
import {
  buildDetroitDynamoAdminRoleGrantFixtures,
  buildDetroitDynamoAdminRoleGrantRejectionFixtures,
  detroitDynamoAdminRoleGrantFunctionId,
} from './detroitDynamoAdminRoleGrantContract.js';
import {
  buildDetroitDynamoAdminModuleWriteFixtures,
  buildDetroitDynamoAdminModuleWriteRejectionFixtures,
  detroitDynamoAdminModuleWriteFunctionId,
} from './detroitDynamoAdminModuleWriteContract.js';
import {
  buildDetroitDynamoAdminRecordWorkspaceReport,
} from './detroitDynamoAdminRecordWorkspaceContract.js';
import {
  buildDetroitDynamoLaunchEvidenceReport,
} from './detroitDynamoLaunchEvidenceContract.js';
import {
  buildDetroitDynamoOwnerLaunchReviewReport,
} from './detroitDynamoOwnerLaunchReview.js';

export const detroitDynamoProductionPreviewEvidenceDecision = {
  status: 'evidence_required',
  launchMode: 'preview_only',
  label: 'Evidence Required: Preview Only',
  reason: 'Production-preview submissions, authenticated admin actions, backend provisioning proof, and owner approvals must be attached before Detroit Dynamo can replace DetroitDynamo.com.',
};

export const detroitDynamoPipelineActionFunctionId = 'detroitDynamoLeadPipelineAction';

function countBy(items, field) {
  return items.reduce((totals, item) => {
    const key = item[field] || 'unknown';
    totals[key] = (totals[key] || 0) + 1;
    return totals;
  }, {});
}

function evidenceTrack({
  id,
  trackType,
  label,
  ownerRole,
  sourceReferences,
  requiredEvidence,
  acceptanceCriteria,
  blockedLiveActions,
  productionPreviewEvidenceId,
  previewCoverage,
  sourceRoute = '',
  leadType = '',
  functionId = '',
  relatedArtifacts = [],
}) {
  return {
    id,
    trackType,
    label,
    ownerRole,
    status: 'evidence_required',
    liveGateStatus: 'not_cleared',
    sourceRoute,
    leadType,
    functionId,
    sourceReferences,
    requiredEvidence,
    acceptanceCriteria,
    blockedLiveActions,
    productionPreviewEvidenceId,
    previewCoverage,
    relatedArtifacts,
  };
}

function buildPublicFormTracks() {
  return buildDetroitDynamoLeadIntakeFixtures().map((fixture) => evidenceTrack({
    id: `public-form-${fixture.leadType}`,
    trackType: 'public_form_submission',
    label: fixture.label,
    ownerRole: fixture.ownerRole,
    sourceRoute: fixture.sourceRoute,
    leadType: fixture.leadType,
    productionPreviewEvidenceId: `pp-form-${fixture.id}`,
    sourceReferences: [
      `Route: ${fixture.sourceRoute}`,
      `Function fixture: ${fixture.id}`,
      `Collections: ${fixture.functionCreatedCollectionIds.join(', ')}`,
    ],
    requiredEvidence: [
      `Submit the ${fixture.leadType} public form on the production-preview deployment and record the returned ContactLead id.`,
      `Confirm created model ids for ${fixture.functionCreatedModels.join(', ')} in isolated dd_* collections.`,
      'Confirm pipeline fields are populated for owner, status, due date, last note, update timestamp, and event count.',
      'Attach screenshot or browser QA state proving success copy is visible without console errors.',
    ],
    acceptanceCriteria: [
      'The source route remains under /detroit-dynamo and never posts into the current Detroit Dynamo booking or contact shell.',
      'A failed Appwrite call shows the polished error state and keeps the browser-local fallback recoverable.',
      'The production-preview evidence id is attached to the owner launch review before live routing is enabled.',
    ],
    blockedLiveActions: ['Appwrite intake default', 'live lead routing', 'owner launch approval'],
    previewCoverage: `${fixture.functionCreatedModels.length} model(s), ${fixture.routingCollectionIds.length} routing collection(s), ${fixture.expectedPipelineFields.length} pipeline field(s).`,
    relatedArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json',
      'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
    ],
  }));
}

function buildPublicValidationTrack() {
  const rejections = buildDetroitDynamoLeadIntakeRejectionFixtures();
  return evidenceTrack({
    id: 'public-form-negative-probes',
    trackType: 'public_validation_probe',
    label: 'Public form rejection probes',
    ownerRole: 'Media/Admin Staff',
    productionPreviewEvidenceId: 'pp-form-negative-probes',
    sourceReferences: [
      `Rejection fixtures: ${rejections.length}`,
      'Function fixture: detroitDynamoLeadIntake rejection cases',
      'Browser probes: validation error and storage error states',
    ],
    requiredEvidence: [
      'Run invalid source route, invalid lead type, incomplete tryout, and incomplete sponsor payload probes.',
      'Capture visible validation errors with aria-invalid and aria-describedby intact.',
      'Capture storage/backend failure state with role=alert and no broken fetch console spam.',
      'Attach response statuses and visible UI screenshots to the owner review packet.',
    ],
    acceptanceCriteria: [
      'Invalid payloads are rejected with stable 400-level messages.',
      'The user-facing form remains recoverable and mobile-friendly after each error.',
      'No rejected probe creates a live ContactLead, Booking, TryoutRegistration, Player, ParentGuardian, or Sponsor record.',
    ],
    blockedLiveActions: ['Appwrite intake default', 'live lead routing'],
    previewCoverage: `${rejections.length} rejection fixture(s) plus browser validation and storage-error probes.`,
    relatedArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-fixtures.json',
      'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
    ],
  });
}

function buildAdminFunctionTracks() {
  const adminContracts = [
    {
      id: 'admin-pipeline-action',
      label: 'Authenticated pipeline status action',
      ownerRole: 'Registrar',
      functionId: detroitDynamoPipelineActionFunctionId,
      successFixtures: buildDetroitDynamoPipelineActionFixtures(),
      rejectionFixtures: buildDetroitDynamoPipelineActionRejectionFixtures(),
      artifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-pipeline-action-handoff.md',
      blockedLiveActions: ['live lead status transitions', 'live audit-event writes', 'admin workflow launch'],
    },
    {
      id: 'admin-module-read',
      label: 'Authenticated admin module reads',
      ownerRole: 'Master Admin',
      functionId: detroitDynamoAdminModuleReadFunctionId,
      successFixtures: buildDetroitDynamoAdminModuleReadFixtures(),
      rejectionFixtures: buildDetroitDynamoAdminModuleReadRejectionFixtures(),
      artifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md',
      blockedLiveActions: ['protected admin live reads', 'role-scoped record browsing', 'admin dashboard launch'],
    },
    {
      id: 'admin-role-grant',
      label: 'Master Admin role grant actions',
      ownerRole: 'Master Admin',
      functionId: detroitDynamoAdminRoleGrantFunctionId,
      successFixtures: buildDetroitDynamoAdminRoleGrantFixtures(),
      rejectionFixtures: buildDetroitDynamoAdminRoleGrantRejectionFixtures(),
      artifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md',
      blockedLiveActions: ['trusted role grants', 'protected admin live reads', 'protected admin live writes'],
    },
    {
      id: 'admin-module-write',
      label: 'Authenticated admin module writes',
      ownerRole: 'Master Admin',
      functionId: detroitDynamoAdminModuleWriteFunctionId,
      successFixtures: buildDetroitDynamoAdminModuleWriteFixtures(),
      rejectionFixtures: buildDetroitDynamoAdminModuleWriteRejectionFixtures(),
      artifact: 'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md',
      blockedLiveActions: ['protected admin live writes', 'fixture/result publication', 'payment/waiver/sponsor mutation'],
    },
  ];

  return adminContracts.map((contract) => evidenceTrack({
    id: contract.id,
    trackType: 'admin_function_action',
    label: contract.label,
    ownerRole: contract.ownerRole,
    functionId: contract.functionId,
    productionPreviewEvidenceId: `pp-${contract.id}`,
    sourceReferences: [
      `Function: ${contract.functionId}`,
      `Success fixtures: ${contract.successFixtures.length}`,
      `Rejection fixtures: ${contract.rejectionFixtures.length}`,
    ],
    requiredEvidence: [
      'Run every success fixture against the production-preview Appwrite function with an authenticated session.',
      'Run every rejection fixture and capture the expected status/error without mutating protected records.',
      'Confirm trusted role assignment, collection scope, action guard, and audit-event behavior where applicable.',
      'Attach response ids, audit event ids, and screenshots from protected admin views to the owner review packet.',
    ],
    acceptanceCriteria: [
      'Success fixtures only touch isolated dd_* collections and return expected ids.',
      'Rejection fixtures block unauthenticated, unassigned, cross-module, or externally gated requests.',
      'No production root route, checkout, waiver signature, public claim, noindex removal, or redirect is changed.',
    ],
    blockedLiveActions: contract.blockedLiveActions,
    previewCoverage: `${contract.successFixtures.length} success fixture(s) and ${contract.rejectionFixtures.length} rejection fixture(s).`,
    relatedArtifacts: [contract.artifact],
  }));
}

function buildRecordWorkspaceTrack() {
  const report = buildDetroitDynamoAdminRecordWorkspaceReport();
  return evidenceTrack({
    id: 'admin-record-workspace-review',
    trackType: 'admin_record_workspace',
    label: 'Admin record workspace review',
    ownerRole: 'Club Director',
    productionPreviewEvidenceId: 'pp-admin-record-workspace-review',
    sourceReferences: [
      `Flattened records: ${report.flattenedRecords.length}`,
      `Fixture collections: ${report.fixtureCollections.length}`,
      'Protected module detail pages: /admin/detroit-dynamo/modules/:moduleSlug',
    ],
    requiredEvidence: [
      'Review record workspace rows on a production-preview protected admin module route.',
      'Export a CSV from at least one module and attach it to the owner review packet.',
      'Prepare a write payload from a record detail preview without submitting a live mutation.',
      'Confirm required-field readiness and field display profiles match Appwrite schema expectations.',
    ],
    acceptanceCriteria: [
      'Record previews remain read-only until admin module write evidence is approved.',
      'Prepared payloads include missing-required-field warnings before any live create/update/archive action.',
      'CSV export does not leak current Detroit Dynamo records or non-Dynamo collections.',
    ],
    blockedLiveActions: ['protected admin live writes', 'admin CRUD launch', 'live record migration'],
    previewCoverage: `${report.flattenedRecords.length} flattened preview record(s) across ${report.fixtureCollections.length} fixture collection(s).`,
    relatedArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.json',
    ],
  });
}

function buildRouteQaTracks() {
  return [
    evidenceTrack({
      id: 'current-lc-route-preservation',
      trackType: 'route_browser_qa',
      label: 'Legacy public route route preservation',
      ownerRole: 'Master Admin',
      productionPreviewEvidenceId: 'pp-current-lc-route-preservation',
      sourceReferences: [
        'Routes: /, /about, /book, /lcfc, /team, /blog, /apply',
        'Smoke command: BASE_URL=... npm run test -- --run',
        'Browser command: BASE_URL=... npm run qa:dynamo-browser',
      ],
      requiredEvidence: [
        'Attach production-preview route smoke output for current Detroit Dynamo routes.',
        'Attach browser screenshots or QA report proving the current homepage and booking shell still render.',
        'Confirm no Detroit Dynamo header, footer, or preview noindex behavior replaces the legacy root.',
        'Record rollback deployment id before any root route promotion is attempted.',
      ],
      acceptanceCriteria: [
        'Every legacy public route returns the SPA root with HTTP 2xx/3xx.',
        'Booking, auth, blog, team, legacy club, and admin navigation remain reachable.',
        'No permanent redirects from legacy public routes are applied while preview-only.',
      ],
      blockedLiveActions: ['root route promotion', 'permanent redirects', 'noindex removal'],
      previewCoverage: 'Current-site route list is covered by smoke tests and browser QA.',
      relatedArtifacts: [
        'artifacts/detroit-dynamo/goal-audit.json',
        'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
      ],
    }),
    evidenceTrack({
      id: 'dynamo-public-route-matrix',
      trackType: 'route_browser_qa',
      label: 'Detroit Dynamo public route matrix',
      ownerRole: 'Media/Admin Staff',
      productionPreviewEvidenceId: 'pp-dynamo-public-route-matrix',
      sourceReferences: [
        `Dynamo routes: ${detroitDynamoAllRoutePaths.length}`,
        'Route root: /detroit-dynamo',
        'Smoke command: BASE_URL=... npm run test -- --run',
      ],
      requiredEvidence: [
        'Attach production-preview smoke output for every /detroit-dynamo route and alias.',
        'Attach mobile and desktop browser QA screenshots for key public pages.',
        'Confirm every CTA stays inside the Dynamo experience or clearly routes to the approved booking flow.',
        'Confirm no dead buttons, broken anchors, or console errors appear in the route matrix.',
      ],
      acceptanceCriteria: [
        'All Dynamo routes return HTTP 2xx/3xx and render the isolated Dynamo shell.',
        'The goat logo, LC footer, old navigation, and old gold/black shell do not appear in Dynamo pages.',
        'Forms show loading, success, validation, and storage-error states cleanly.',
      ],
      blockedLiveActions: ['root route promotion', 'SEO index launch', 'public launch announcement'],
      previewCoverage: `${detroitDynamoAllRoutePaths.length} Dynamo route path(s) are covered by static and browser QA.`,
      relatedArtifacts: [
        'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
        'artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml',
      ],
    }),
    evidenceTrack({
      id: 'protected-admin-route-matrix',
      trackType: 'route_browser_qa',
      label: 'Protected Dynamo admin route matrix',
      ownerRole: 'Master Admin',
      productionPreviewEvidenceId: 'pp-protected-admin-route-matrix',
      sourceReferences: [
        `Protected module routes: ${detroitDynamoAdminModuleDetailRoutes.length}`,
        'Route root: /admin/detroit-dynamo',
        'Browser command: BASE_URL=... npm run qa:dynamo-browser',
      ],
      requiredEvidence: [
        'Attach production-preview browser QA output covering protected admin sign-in guard behavior.',
        'Open each /admin/detroit-dynamo/modules/:moduleSlug route and record the module readiness state.',
        'Confirm protected routes do not expose live writes without an authenticated trusted role.',
        'Confirm local preview ledgers and action consoles retain preview-only status labels.',
      ],
      acceptanceCriteria: [
        'Unauthenticated users see the expected sign-in guard.',
        'Protected module pages render action guards, data targets, safety gates, and record workspace sections.',
        'Live read/write controls remain blocked until Appwrite role and function evidence exists.',
      ],
      blockedLiveActions: ['protected admin live reads', 'protected admin live writes', 'role grant launch'],
      previewCoverage: `${detroitDynamoAdminModuleDetailRoutes.length} protected module route(s) are covered by browser QA.`,
      relatedArtifacts: [
        'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
        'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-registry.md',
      ],
    }),
  ];
}

function buildBackendActivationTracks() {
  return detroitDynamoBackendActivationSteps.map((step) => evidenceTrack({
    id: `backend-activation-step-${step.step}`,
    trackType: 'backend_activation',
    label: `${step.step}. ${step.title}`,
    ownerRole: step.ownerRole,
    productionPreviewEvidenceId: `pp-backend-step-${step.step}`,
    sourceReferences: [
      `Command: ${step.command}`,
      `Evidence: ${step.evidence}`,
      'Runbook: detroit-dynamo-backend-activation-runbook.md',
    ],
    requiredEvidence: [
      `Run or complete: ${step.command}.`,
      `Attach proof for: ${step.evidence}.`,
      `Record next action outcome: ${step.nextAction}.`,
      'Confirm the step does not mutate current Detroit Dynamo collections, booking, auth, blog, or forms.',
    ],
    acceptanceCriteria: [
      'The step targets isolated Detroit Dynamo dd_* schema, functions, or preview artifacts.',
      'Secrets are not printed in logs or committed to artifacts.',
      'The owner review packet references the evidence before Appwrite live mode is enabled.',
    ],
    blockedLiveActions: ['Appwrite intake default', 'live lead routing', 'protected admin live writes'],
    previewCoverage: `${step.evidence} is already named in the backend activation runbook.`,
    relatedArtifacts: ['artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md'],
  }));
}

function buildExternalConfirmationTracks() {
  return detroitDynamoExternalConfirmationRegister.map((item) => evidenceTrack({
    id: `external-confirmation-${item.area.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
    trackType: 'external_confirmation',
    label: item.area,
    ownerRole: item.ownerRole,
    productionPreviewEvidenceId: `pp-external-${item.area.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
    sourceReferences: [
      `Status now: ${item.status}`,
      `Related models: ${item.relatedModels.join(', ')}`,
      `Publish rule: ${item.publishRule}`,
    ],
    requiredEvidence: [
      ...item.requiredFacts,
      `Record action outcome: ${item.nextAction}.`,
    ],
    acceptanceCriteria: [
      'The publish rule remains enforced until official proof or owner approval is attached.',
      'Unconfirmed facts stay as future-pathway, placeholder, or register-interest language.',
      'No payment, waiver, staff, roster, sponsor, facility, league, SEO, redirect, or proof publication is unlocked by this preview record.',
    ],
    blockedLiveActions: ['public fact publication', 'checkout/signature activation', 'SEO/redirect launch'],
    previewCoverage: `${item.requiredFacts.length} required fact(s) are named for owner review.`,
    relatedArtifacts: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md',
    ],
  }));
}

export function buildDetroitDynamoProductionPreviewEvidenceReport() {
  const launchEvidenceReport = buildDetroitDynamoLaunchEvidenceReport();
  const ownerLaunchReview = buildDetroitDynamoOwnerLaunchReviewReport();
  const tracks = [
    ...buildPublicFormTracks(),
    buildPublicValidationTrack(),
    ...buildAdminFunctionTracks(),
    buildRecordWorkspaceTrack(),
    ...buildRouteQaTracks(),
    ...buildBackendActivationTracks(),
    ...buildExternalConfirmationTracks(),
  ];
  const blockedLiveActions = [...new Set(tracks.flatMap((track) => track.blockedLiveActions))].sort();
  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoProductionPreviewEvidenceDecision,
    tracks,
    summary: {
      tracksTotal: tracks.length,
      evidenceRequired: tracks.filter((track) => track.status === 'evidence_required').length,
      liveGatesCleared: tracks.filter((track) => track.liveGateStatus === 'cleared').length,
      productionSubmissionsRecorded: 0,
      publicationsUnlocked: 0,
      trackTypes: countBy(tracks, 'trackType'),
      ownerRoles: Object.keys(countBy(tracks, 'ownerRole')).sort(),
      publicFormTracks: tracks.filter((track) => track.trackType === 'public_form_submission').length,
      adminActionTracks: tracks.filter((track) => track.trackType === 'admin_function_action').length,
      routeQaTracks: tracks.filter((track) => track.trackType === 'route_browser_qa').length,
      backendActivationTracks: tracks.filter((track) => track.trackType === 'backend_activation').length,
      externalConfirmationTracks: tracks.filter((track) => track.trackType === 'external_confirmation').length,
      launchEvidenceItems: launchEvidenceReport.checklistItems.length,
      ownerReviewSections: ownerLaunchReview.sections.length,
      ownerReviewDecision: ownerLaunchReview.decision.decision,
      blockedLiveActions: blockedLiveActions.length,
    },
    requiredProductionPreviewActions: [
      'Run every public form fixture on a production-preview deployment and attach response ids or screenshots.',
      'Run authenticated admin function success and rejection fixtures with trusted preview roles.',
      'Attach route smoke, browser QA, and console-clean evidence for legacy public routes, Dynamo public routes, and protected Dynamo admin routes.',
      'Attach Appwrite preflight, provisioning/dry-run, function deployment, and isolated dd_* collection evidence before enabling live backend mode.',
      'Keep the owner launch review decision at No-Go: Preview Only until external approvals and production-preview evidence are reviewed.',
    ],
    blockedLiveActions,
    referencedReports: {
      launchEvidence: launchEvidenceReport.summary,
      ownerLaunchReview: ownerLaunchReview.summary,
    },
    issues: [],
  };
  report.issues = auditDetroitDynamoProductionPreviewEvidenceReport(report);

  return report;
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoProductionPreviewEvidenceReport(
  report = buildDetroitDynamoProductionPreviewEvidenceReport(),
) {
  const issues = [];
  const requiredTrackTypes = [
    'public_form_submission',
    'public_validation_probe',
    'admin_function_action',
    'admin_record_workspace',
    'route_browser_qa',
    'backend_activation',
    'external_confirmation',
  ];
  const requiredLeadTypes = ['contact', 'training', 'youth', 'tryout', 'men', 'women', 'sponsor'];
  const requiredFunctionIds = [
    detroitDynamoPipelineActionFunctionId,
    detroitDynamoAdminModuleReadFunctionId,
    detroitDynamoAdminRoleGrantFunctionId,
    detroitDynamoAdminModuleWriteFunctionId,
  ];

  assertReport(report.decision?.status === 'evidence_required', 'Production-preview evidence matrix must remain evidence_required.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'Production-preview evidence matrix must remain preview_only.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Production-preview evidence must not clear live gates.', issues);
  assertReport(report.summary.productionSubmissionsRecorded === 0, 'Static matrix must not claim production submissions are already recorded.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Production-preview evidence must not unlock publication.', issues);
  assertReport(report.tracks.length >= 24, 'Production-preview evidence matrix should include public, admin, route, backend, and external tracks.', issues);
  assertReport(report.requiredProductionPreviewActions.length >= 5, 'Production-preview evidence matrix needs operator action guidance.', issues);
  assertReport(report.blockedLiveActions.length >= 8, 'Production-preview evidence matrix should list blocked live actions.', issues);

  for (const type of requiredTrackTypes) {
    assertReport(report.tracks.some((track) => track.trackType === type), `Missing production-preview track type: ${type}.`, issues);
  }
  for (const leadType of requiredLeadTypes) {
    assertReport(report.tracks.some((track) => track.trackType === 'public_form_submission' && track.leadType === leadType), `Missing public form production-preview track for ${leadType}.`, issues);
  }
  for (const functionId of requiredFunctionIds) {
    assertReport(report.tracks.some((track) => track.functionId === functionId), `Missing admin function production-preview track for ${functionId}.`, issues);
  }
  assertReport(report.summary.backendActivationTracks === detroitDynamoBackendActivationSteps.length, 'Backend activation track count must match the backend activation runbook.', issues);
  assertReport(report.summary.externalConfirmationTracks === detroitDynamoExternalConfirmationRegister.length, 'External confirmation tracks must cover the full confirmation register.', issues);

  const ids = new Set();
  for (const track of report.tracks) {
    assertReport(!ids.has(track.id), `Duplicate production-preview evidence track id: ${track.id}.`, issues);
    ids.add(track.id);
    assertReport(track.status === 'evidence_required', `${track.id} must remain evidence_required.`, issues);
    assertReport(track.liveGateStatus === 'not_cleared', `${track.id} must not clear a live gate.`, issues);
    assertReport(track.ownerRole && track.ownerRole.length > 3, `${track.id} needs an owner role.`, issues);
    assertReport(track.productionPreviewEvidenceId && track.productionPreviewEvidenceId.startsWith('pp-'), `${track.id} needs a production-preview evidence id.`, issues);
    assertReport(Array.isArray(track.sourceReferences) && track.sourceReferences.length >= 2, `${track.id} needs source references.`, issues);
    assertReport(Array.isArray(track.requiredEvidence) && track.requiredEvidence.length >= 3, `${track.id} needs at least three required evidence items.`, issues);
    assertReport(Array.isArray(track.acceptanceCriteria) && track.acceptanceCriteria.length >= 2, `${track.id} needs acceptance criteria.`, issues);
    assertReport(Array.isArray(track.blockedLiveActions) && track.blockedLiveActions.length >= 1, `${track.id} needs blocked live actions.`, issues);
    if (track.trackType === 'public_form_submission') {
      assertReport(track.sourceRoute.startsWith('/detroit-dynamo'), `${track.id} public form route must stay inside /detroit-dynamo.`, issues);
    }
  }

  return issues;
}

export function buildDetroitDynamoProductionPreviewEvidenceMarkdown(
  report = buildDetroitDynamoProductionPreviewEvidenceReport(),
) {
  const lines = [
    '# Detroit Dynamo Production Preview Evidence Matrix',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Tracks: ${report.summary.tracksTotal}`,
    `- Evidence required: ${report.summary.evidenceRequired}`,
    `- Public form tracks: ${report.summary.publicFormTracks}`,
    `- Admin action tracks: ${report.summary.adminActionTracks}`,
    `- Route QA tracks: ${report.summary.routeQaTracks}`,
    `- Backend activation tracks: ${report.summary.backendActivationTracks}`,
    `- External confirmation tracks: ${report.summary.externalConfirmationTracks}`,
    `- Owner review decision: ${report.summary.ownerReviewDecision}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    '',
    '## Required Production Preview Actions',
    '',
    ...report.requiredProductionPreviewActions.map((action) => `- [ ] ${action}`),
    '',
    '## Evidence Tracks',
    '',
    '| Track | Type | Owner | Evidence Id | Status |',
    '| --- | --- | --- | --- | --- |',
    ...report.tracks.map((track) => `| ${track.label} | ${track.trackType} | ${track.ownerRole} | \`${track.productionPreviewEvidenceId}\` | ${track.status} |`),
    '',
    '## Track Details',
    '',
    ...report.tracks.flatMap((track) => [
      `### ${track.label}`,
      '',
      `Type: ${track.trackType}`,
      '',
      `Owner: ${track.ownerRole}`,
      '',
      `Evidence id: \`${track.productionPreviewEvidenceId}\``,
      '',
      `Live gate status: ${track.liveGateStatus}`,
      '',
      `Preview coverage: ${track.previewCoverage}`,
      '',
      'Required evidence:',
      ...track.requiredEvidence.map((item) => `- [ ] ${item}`),
      '',
      'Acceptance criteria:',
      ...track.acceptanceCriteria.map((item) => `- ${item}`),
      '',
      'Source references:',
      ...track.sourceReferences.map((item) => `- ${item}`),
      '',
      'Related artifacts:',
      ...(track.relatedArtifacts.length > 0 ? track.relatedArtifacts.map((item) => `- ${item}`) : ['- None']),
      '',
    ]),
    '## Blocked Live Actions',
    '',
    ...report.blockedLiveActions.map((action) => `- ${action}`),
    '',
    'This matrix is a production-preview evidence handoff only. It does not approve launch, enable Appwrite live mode, collect payments, collect signatures, publish claims, remove noindex, apply redirects, or replace the current Detroit Dynamo root site.',
    '',
  ];

  return lines.join('\n');
}
