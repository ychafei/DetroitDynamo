import {
  buildDetroitDynamoLiveReadinessBoardReport,
} from './detroitDynamoLiveReadinessBoard.js';
import {
  buildDetroitDynamoPromotionCutoverReport,
} from './detroitDynamoPromotionCutoverContract.js';
import {
  detroitDynamoBackendActivationSteps,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';
import {
  detroitDynamoRedirectPlan,
  detroitDynamoSitemapRoutes,
} from './detroitDynamoRouteManifest.js';

export const detroitDynamoDeploymentReadinessDecision = {
  decision: 'deployment_evidence_required',
  label: 'Deployment Evidence Required',
  launchMode: 'preview_only',
  reason: 'Deployment, environment, domain, indexing, redirect, backend, and rollback evidence must be recorded before Detroit Dynamo can replace the current Detroit Dynamo root site.',
};

export const detroitDynamoDeploymentReadinessTracks = [
  {
    id: 'current-production-snapshot',
    label: 'Legacy production route snapshot',
    ownerRole: 'Master Admin',
    phase: 'Pre-deployment',
    status: 'evidence_required',
    deploymentSurface: 'Legacy public root, booking, auth, blog, team, legacy club, apply, legal, and admin routes',
    requiredEvidence: [
      'Production deployment id or rollback target for the current Detroit Dynamo site',
      'Current route smoke output and browser QA report saved before promotion',
      'Screenshots or rendered QA proof for root, booking, auth, admin, and legacy club paths',
    ],
    verificationCommand: 'BASE_URL=<current-production-url> npm run test -- --run',
    blockedLiveAction: 'Do not replace the legacy public root shell until rollback evidence is saved.',
    rollbackRequirement: 'Restore the recorded LC deployment or routing target if promotion fails.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'vercel-project-and-cli',
    label: 'Vercel project link and CLI readiness',
    ownerRole: 'Master Admin',
    phase: 'Hosting',
    status: 'evidence_required',
    deploymentSurface: '.vercel project link, Vercel CLI, deployment target, and build settings',
    requiredEvidence: [
      'Vercel project link confirmed without exposing org or project ids in public docs',
      'Vercel CLI version recorded after upgrading to the latest compatible release',
      'Preview deployment URL and production deployment target recorded',
    ],
    verificationCommand: 'vercel --version && npm run build',
    blockedLiveAction: 'Do not schedule promotion until the hosting target and CLI version are recorded.',
    rollbackRequirement: 'Keep the previous production deployment available as the rollback target.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'spa-routing-config',
    label: 'SPA routing and rewrite config',
    ownerRole: 'Master Admin',
    phase: 'Hosting',
    status: 'preview_ready',
    deploymentSurface: 'vercel.json and Vite static output',
    requiredEvidence: [
      'The Vercel rewrite continues to route SPA paths to /index.html',
      'No permanent Detroit Dynamo redirects are enabled before owner approval',
      'Auth, admin, booking, payment callback, and unsubscribe routes are explicitly protected from accidental redirect rules',
    ],
    verificationCommand: 'BASE_URL=<production-preview-url> npm run verify:dynamo',
    blockedLiveAction: 'Do not add permanent redirects until redirect exclusions are approved.',
    rollbackRequirement: 'Remove redirect rules and keep the SPA rewrite if cutover is paused.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'production-preview-build',
    label: 'Production-preview build proof',
    ownerRole: 'Master Admin',
    phase: 'Build',
    status: 'preview_ready',
    deploymentSurface: 'Vite build output and static Detroit Dynamo assets',
    requiredEvidence: [
      'npm run lint, npm run typecheck, npm run build, and git diff --check pass',
      'Detroit Dynamo logo, favicon, kit, digital, and application assets exist in public/detroit-dynamo',
      'Build artifact and preview deployment URL are recorded for owner review',
    ],
    verificationCommand: 'npm run lint && npm run typecheck && npm run build',
    blockedLiveAction: 'Do not promote an unverified build artifact.',
    rollbackRequirement: 'Redeploy the last verified LC build if the Dynamo build fails after promotion.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'client-env-production-preview',
    label: 'Client environment variable readiness',
    ownerRole: 'Master Admin',
    phase: 'Environment',
    status: 'evidence_required',
    deploymentSurface: 'VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in hosting environment',
    requiredEvidence: [
      'Production-preview client env keys are set in the host environment without exposing secret values',
      'Client bundle does not bake missing Appwrite env values into production-preview forms',
      'Local fallback remains available until production-preview submissions pass',
    ],
    verificationCommand: 'npm run preflight:dynamo-backend',
    blockedLiveAction: 'Do not make Appwrite intake the default until production-preview env values are verified.',
    rollbackRequirement: 'Switch public forms back to local preview/fallback mode if live intake fails.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'server-env-and-functions',
    label: 'Server function environment readiness',
    ownerRole: 'Master Admin',
    phase: 'Backend',
    status: 'evidence_required',
    deploymentSurface: 'Appwrite function variables, scopes, bootstrap admin, and dd_* collections',
    requiredEvidence: [
      'APPWRITE_API_KEY configured for Detroit Dynamo functions without printing secrets',
      'DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID set before first live Master Admin grant',
      'Lead intake, pipeline action, module read, role grant, and module write functions deployed with expected scopes',
    ],
    verificationCommand: 'npm run preflight:dynamo-backend',
    blockedLiveAction: 'Do not enable protected admin live writes until function variables and trusted roles are verified.',
    rollbackRequirement: 'Disable Appwrite write mode and return to local preview mode if functions fail.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'production-preview-form-and-admin-smoke',
    label: 'Production-preview form and admin smoke',
    ownerRole: 'Registrar',
    phase: 'Backend',
    status: 'evidence_required',
    deploymentSurface: 'Public forms, Appwrite records, protected admin actions, and audit events',
    requiredEvidence: [
      'Training, youth, tryout, men, women, sponsor, and contact forms create expected records',
      'Authenticated pipeline, module read, role grant, and module write actions reject unauthorized users and write audit events',
      'Production-preview record ids and admin action ids are attached to the owner evidence worksheet',
    ],
    verificationCommand: 'BASE_URL=<production-preview-url> npm run qa:dynamo-browser',
    blockedLiveAction: 'Do not record production submissions or enable live admin operations until smoke proof is attached.',
    rollbackRequirement: 'Disable live intake and archive failed test records if production-preview smoke fails.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'seo-indexing-and-domain',
    label: 'SEO, indexing, and domain readiness',
    ownerRole: 'Media/Admin Staff',
    phase: 'SEO',
    status: 'preview_only',
    deploymentSurface: 'Domain, canonical URLs, robots, sitemap, Open Graph, favicon, and noindex controls',
    requiredEvidence: [
      'Detroit Dynamo metadata, favicon, Open Graph image, robots draft, and sitemap preview are owner-approved',
      'Noindex removal is tied to a named launch window and owner approval',
      'Domain and canonical URL changes do not overwrite Detroit Dynamo root SEO before promotion approval',
    ],
    verificationCommand: 'BASE_URL=<production-preview-url> npm run verify:dynamo',
    blockedLiveAction: 'Do not remove preview noindex or publish root Dynamo metadata before SEO approval.',
    rollbackRequirement: 'Restore LC root metadata and reapply preview noindex if launch is reversed.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'redirect-domain-cutover',
    label: 'Redirect and domain cutover readiness',
    ownerRole: 'Master Admin',
    phase: 'Promotion',
    status: 'blocked_until_approval',
    deploymentSurface: 'Root route, old LC public paths, Dynamo aliases, redirects, and callback exclusions',
    requiredEvidence: [
      'Redirect plan approved with auth, admin, booking, payment callback, unsubscribe, and legal exclusions',
      'Post-cutover 200/301 route verification command is ready for the production URL',
      'Rollback instructions are written before permanent redirects are applied',
    ],
    verificationCommand: 'BASE_URL=<production-url> npm run verify:dynamo',
    blockedLiveAction: 'Do not apply permanent redirects or canonical migration before promotion approval.',
    rollbackRequirement: 'Disable redirect rules and restore old LC public routes as canonical paths if needed.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
  {
    id: 'post-launch-monitoring-and-rollback',
    label: 'Post-launch monitoring and rollback readiness',
    ownerRole: 'Master Admin',
    phase: 'Post-launch',
    status: 'evidence_required',
    deploymentSurface: 'Post-launch browser QA, route smoke, forms, admin, booking, payment, waiver, and owner closeout',
    requiredEvidence: [
      'Post-launch browser QA and route smoke commands are prepared for the production URL',
      'Owner sign-off process and rollback trigger conditions are documented',
      'Payment, waiver, admin, and support issues have a named rollback owner',
    ],
    verificationCommand: 'BASE_URL=<production-url> npm run qa:dynamo-browser',
    blockedLiveAction: 'Do not close the launch window until post-launch QA and rollback readiness are documented.',
    rollbackRequirement: 'Trigger rollback if root, booking, forms, payments, waivers, auth, admin, or legal/support flows fail.',
    liveGateCleared: false,
    publicationUnlocked: false,
  },
];

export const detroitDynamoDeploymentReadinessColumns = [
  'id',
  'label',
  'ownerRole',
  'phase',
  'status',
  'deploymentSurface',
  'verificationCommand',
  'blockedLiveAction',
  'rollbackRequirement',
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

export function buildDetroitDynamoDeploymentReadinessReport() {
  const liveReadinessBoard = buildDetroitDynamoLiveReadinessBoardReport();
  const promotionCutover = buildDetroitDynamoPromotionCutoverReport();
  const blockedLiveActions = [...new Set(
    detroitDynamoDeploymentReadinessTracks.map((track) => track.blockedLiveAction),
  )].sort();

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoDeploymentReadinessDecision,
    columns: detroitDynamoDeploymentReadinessColumns,
    tracks: detroitDynamoDeploymentReadinessTracks,
    summary: {
      tracksTotal: detroitDynamoDeploymentReadinessTracks.length,
      phases: Object.keys(countBy(detroitDynamoDeploymentReadinessTracks, 'phase')).length,
      ownerRoles: Object.keys(countBy(detroitDynamoDeploymentReadinessTracks, 'ownerRole')).length,
      evidenceRequiredTracks: detroitDynamoDeploymentReadinessTracks.filter((track) => track.status === 'evidence_required').length,
      previewReadyTracks: detroitDynamoDeploymentReadinessTracks.filter((track) => track.status === 'preview_ready').length,
      blockedTracks: detroitDynamoDeploymentReadinessTracks.filter((track) => track.status.includes('blocked') || track.status === 'preview_only').length,
      liveGatesCleared: detroitDynamoDeploymentReadinessTracks.filter((track) => track.liveGateCleared).length + liveReadinessBoard.summary.liveGatesCleared,
      publicationsUnlocked: detroitDynamoDeploymentReadinessTracks.filter((track) => track.publicationUnlocked).length + liveReadinessBoard.summary.publicationsUnlocked,
      productionDeploymentsRecorded: 0,
      productionSubmissionsRecorded: 0,
      rootPromotionAllowed: Boolean(liveReadinessBoard.summary.rootPromotionAllowed),
      permanentRedirectsAllowed: Boolean(liveReadinessBoard.summary.permanentRedirectsAllowed),
      sitemapRoutes: detroitDynamoSitemapRoutes.length,
      redirectPlanEntries: detroitDynamoRedirectPlan.length,
      backendActivationSteps: detroitDynamoBackendActivationSteps.length,
      promotionGates: detroitDynamoPromotionGates.length,
      promotionCutoverTracks: promotionCutover.cutoverTracks.length,
      blockedLiveActions: blockedLiveActions.length,
    },
    phases: countBy(detroitDynamoDeploymentReadinessTracks, 'phase'),
    ownerRoles: countBy(detroitDynamoDeploymentReadinessTracks, 'ownerRole'),
    blockedLiveActions,
    usageRules: [
      'Use this report after local preview QA passes and before any production-preview or root-route promotion meeting.',
      'Attach real deployment ids, preview URLs, production URLs, env confirmation, and rollback targets in the owner evidence worksheet.',
      'Do not treat preview-ready tracks as launch approval; external evidence and owner approval are still required.',
      'Run the production-preview commands against the real preview URL before enabling Appwrite default intake or redirects.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoDeploymentReadinessReport(report);
  return report;
}

export function buildDetroitDynamoDeploymentReadinessCsv(
  report = buildDetroitDynamoDeploymentReadinessReport(),
) {
  return [
    report.columns.join(','),
    ...report.tracks.map((track) => (
      report.columns.map((column) => csvEscape(track[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoDeploymentReadinessMarkdown(
  report = buildDetroitDynamoDeploymentReadinessReport(),
) {
  const lines = [
    '# Detroit Dynamo Deployment Readiness',
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
    `- Phases: ${report.summary.phases}`,
    `- Owner roles: ${report.summary.ownerRoles}`,
    `- Evidence-required tracks: ${report.summary.evidenceRequiredTracks}`,
    `- Preview-ready tracks: ${report.summary.previewReadyTracks}`,
    `- Blocked/preview-only tracks: ${report.summary.blockedTracks}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    `- Production deployments recorded: ${report.summary.productionDeploymentsRecorded}`,
    `- Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`,
    `- Root promotion allowed: ${report.summary.rootPromotionAllowed}`,
    `- Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`,
    `- Sitemap routes: ${report.summary.sitemapRoutes}`,
    `- Redirect plan entries: ${report.summary.redirectPlanEntries}`,
    `- Backend activation steps: ${report.summary.backendActivationSteps}`,
    `- Promotion gates: ${report.summary.promotionGates}`,
    `- Promotion cutover tracks: ${report.summary.promotionCutoverTracks}`,
    `- Blocked live actions: ${report.summary.blockedLiveActions}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Readiness Tracks',
    '',
    '| Track | Phase | Status | Owner | Verification | Blocked Live Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.tracks.map((track) => (
      `| ${track.label} | ${track.phase} | ${track.status} | ${track.ownerRole} | \`${track.verificationCommand}\` | ${track.blockedLiveAction} |`
    )),
    '',
    '## Track Details',
    '',
  ];

  for (const track of report.tracks) {
    lines.push(
      `### ${track.label}`,
      '',
      `Deployment surface: ${track.deploymentSurface}`,
      '',
      `Rollback requirement: ${track.rollbackRequirement}`,
      '',
      'Required evidence:',
      ...track.requiredEvidence.map((item) => `- [ ] ${item}`),
      '',
    );
  }

  lines.push(
    'This deployment readiness report is a preview handoff only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish public claims, remove noindex, apply permanent redirects, or replace the current Detroit Dynamo root site.',
    '',
  );

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoDeploymentReadinessReport(
  report = buildDetroitDynamoDeploymentReadinessReport(),
) {
  const issues = [];
  const requiredIds = [
    'current-production-snapshot',
    'vercel-project-and-cli',
    'spa-routing-config',
    'production-preview-build',
    'client-env-production-preview',
    'server-env-and-functions',
    'production-preview-form-and-admin-smoke',
    'seo-indexing-and-domain',
    'redirect-domain-cutover',
    'post-launch-monitoring-and-rollback',
  ];

  assertReport(report.decision?.decision === 'deployment_evidence_required', 'Deployment readiness must remain evidence-required.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'Deployment readiness launch mode must remain preview-only.', issues);
  assertReport(report.summary.tracksTotal >= requiredIds.length, 'Deployment readiness should include every required deployment track.', issues);
  assertReport(report.summary.evidenceRequiredTracks >= 6, 'Deployment readiness should keep most deployment tracks evidence-required.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Deployment readiness must not clear live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Deployment readiness must not unlock publications.', issues);
  assertReport(report.summary.productionDeploymentsRecorded === 0, 'Deployment readiness must not claim production deployment evidence is recorded.', issues);
  assertReport(report.summary.productionSubmissionsRecorded === 0, 'Deployment readiness must not claim production submissions are recorded.', issues);
  assertReport(report.summary.rootPromotionAllowed === false, 'Deployment readiness must block root promotion.', issues);
  assertReport(report.summary.permanentRedirectsAllowed === false, 'Deployment readiness must block permanent redirects.', issues);
  assertReport(report.summary.sitemapRoutes >= 12, 'Deployment readiness should reference sitemap-ready routes.', issues);
  assertReport(report.summary.redirectPlanEntries >= 6, 'Deployment readiness should reference redirect plan entries.', issues);
  assertReport(report.summary.backendActivationSteps >= 8, 'Deployment readiness should reference backend activation steps.', issues);
  assertReport(report.summary.promotionGates >= 6, 'Deployment readiness should reference promotion gates.', issues);
  assertReport(report.summary.promotionCutoverTracks >= 9, 'Deployment readiness should reference promotion cutover tracks.', issues);
  assertReport(report.usageRules.length >= 4, 'Deployment readiness needs usage rules.', issues);

  const ids = new Set();
  for (const id of requiredIds) {
    assertReport(report.tracks.some((track) => track.id === id), `Missing deployment readiness track: ${id}.`, issues);
  }

  for (const track of report.tracks) {
    assertReport(!ids.has(track.id), `Duplicate deployment readiness track id: ${track.id}.`, issues);
    ids.add(track.id);
    assertReport(track.label && track.label.length >= 6, `${track.id} needs a label.`, issues);
    assertReport(track.ownerRole && track.ownerRole.length > 3, `${track.id} needs an owner role.`, issues);
    assertReport(track.phase && track.phase.length > 2, `${track.id} needs a phase.`, issues);
    assertReport(!['live', 'approved', 'promoted', 'complete'].includes(track.status), `${track.id} must not be marked live/approved.`, issues);
    assertReport(track.deploymentSurface && track.deploymentSurface.length > 10, `${track.id} needs a deployment surface.`, issues);
    assertReport(Array.isArray(track.requiredEvidence) && track.requiredEvidence.length >= 3, `${track.id} needs at least three required evidence items.`, issues);
    assertReport(track.verificationCommand && track.verificationCommand.length > 6, `${track.id} needs a verification command.`, issues);
    assertReport(track.blockedLiveAction && track.blockedLiveAction.startsWith('Do not'), `${track.id} needs a blocked live action.`, issues);
    assertReport(track.rollbackRequirement && track.rollbackRequirement.length > 12, `${track.id} needs a rollback requirement.`, issues);
    assertReport(track.liveGateCleared === false, `${track.id} must not clear a live gate.`, issues);
    assertReport(track.publicationUnlocked === false, `${track.id} must not unlock publication.`, issues);
  }

  return issues;
}
