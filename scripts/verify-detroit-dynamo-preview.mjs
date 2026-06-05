import fs from 'node:fs/promises';
import path from 'node:path';
import {
  detroitDynamoAllRoutePaths,
  detroitDynamoAliasRoutes,
  detroitDynamoRouteManifest,
  detroitDynamoSitemapRoutes,
} from '../src/lib/detroitDynamoRouteManifest.js';
import {
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminModuleDetailRoutes,
  detroitDynamoAdminModules,
  detroitDynamoAdminRoles,
  detroitDynamoBackendActivationSteps,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoLaunchReadiness,
  detroitDynamoLeadPipelineByType,
  detroitDynamoLeadPipelineStages,
  detroitDynamoLeadRouting,
  detroitDynamoPromotionGates,
  detroitDynamoRolePermissionMatrix,
} from '../src/lib/detroitDynamoDataModel.js';
import {
  auditDetroitDynamoActionGuards,
  auditDetroitDynamoAccessPolicy,
  canDetroitDynamoRoleAccess,
  detroitDynamoModuleActionGuards,
  detroitDynamoRoleAccessSummaries,
} from '../src/lib/detroitDynamoAdminAccess.js';
import {
  auditDetroitDynamoRecordDrafts,
  detroitDynamoLeadRecordDraftMap,
} from '../src/lib/detroitDynamoAdminDrafts.js';
import {
  auditDetroitDynamoExternalGateContracts,
  buildDetroitDynamoExternalGateContractReport,
} from '../src/lib/detroitDynamoExternalGateContracts.js';
import {
  auditDetroitDynamoClaimSafetyContract,
  buildDetroitDynamoClaimSafetyContractReport,
} from '../src/lib/detroitDynamoClaimSafetyContract.js';
import {
  auditDetroitDynamoPromotionCutoverContract,
  buildDetroitDynamoPromotionCutoverReport,
} from '../src/lib/detroitDynamoPromotionCutoverContract.js';
import {
  auditDetroitDynamoLaunchEvidenceReport,
  buildDetroitDynamoLaunchEvidenceReport,
} from '../src/lib/detroitDynamoLaunchEvidenceContract.js';
import {
  auditDetroitDynamoLaunchEvidenceActionReport,
  buildDetroitDynamoLaunchEvidenceActionReport,
} from '../src/lib/detroitDynamoLaunchEvidenceActions.js';
import {
  auditDetroitDynamoExternalConfirmationActionReport,
  buildDetroitDynamoExternalConfirmationActionReport,
} from '../src/lib/detroitDynamoExternalConfirmationActions.js';
import {
  auditDetroitDynamoOwnerLaunchReviewReport,
  buildDetroitDynamoOwnerLaunchReviewReport,
} from '../src/lib/detroitDynamoOwnerLaunchReview.js';
import {
  auditDetroitDynamoOwnerEvidenceIntakeReport,
  buildDetroitDynamoOwnerEvidenceIntakeReport,
} from '../src/lib/detroitDynamoOwnerEvidenceIntake.js';
import {
  auditDetroitDynamoProductionPreviewEvidenceReport,
  buildDetroitDynamoProductionPreviewEvidenceReport,
} from '../src/lib/detroitDynamoProductionPreviewEvidence.js';
import {
  auditDetroitDynamoLiveReadinessBoardReport,
  buildDetroitDynamoLiveReadinessBoardReport,
} from '../src/lib/detroitDynamoLiveReadinessBoard.js';
import {
  auditDetroitDynamoLaunchArtifactIndexReport,
  buildDetroitDynamoLaunchArtifactIndexReport,
} from '../src/lib/detroitDynamoLaunchArtifactIndex.js';
import {
  auditDetroitDynamoDeploymentReadinessReport,
  buildDetroitDynamoDeploymentReadinessReport,
} from '../src/lib/detroitDynamoDeploymentReadiness.js';
import {
  auditDetroitDynamoOwnerSignoffRegisterReport,
  buildDetroitDynamoOwnerSignoffRegisterReport,
} from '../src/lib/detroitDynamoOwnerSignoffRegister.js';
import {
  auditDetroitDynamoFinalAcceptanceMatrixReport,
  buildDetroitDynamoFinalAcceptanceMatrixReport,
} from '../src/lib/detroitDynamoFinalAcceptanceMatrix.js';
import {
  auditDetroitDynamoVercelPreviewRunbookReport,
  buildDetroitDynamoVercelPreviewRunbookReport,
} from '../src/lib/detroitDynamoVercelPreviewRunbook.js';
import {
  auditDetroitDynamoSecretRedactionReport,
  buildDetroitDynamoSecretRedactionReport,
} from '../src/lib/detroitDynamoSecretRedactionContract.js';
import {
  auditDetroitDynamoExternalGateClosureReport,
  buildDetroitDynamoExternalGateClosureReport,
} from '../src/lib/detroitDynamoExternalGateClosurePacket.js';
import {
  auditDetroitDynamoOwnerHandoffPacketReport,
  buildDetroitDynamoOwnerHandoffPacketReport,
} from '../src/lib/detroitDynamoOwnerHandoffPacket.js';
import {
  auditDetroitDynamoSafeguardingContract,
  buildDetroitDynamoSafeguardingReport,
} from '../src/lib/detroitDynamoSafeguardingContract.js';
import {
  auditDetroitDynamoLeadPipelineOperations,
} from '../src/lib/detroitDynamoLeadPipeline.js';
import {
  auditDetroitDynamoLeadIntakeContract,
  buildDetroitDynamoLeadIntakeFixtures,
  buildDetroitDynamoLeadIntakeRejectionFixtures,
  detroitDynamoLeadIntakeVariants,
} from '../src/lib/detroitDynamoLeadIntakeContract.js';
import {
  auditDetroitDynamoPipelineActionContract,
  buildDetroitDynamoPipelineActionFixtures,
  buildDetroitDynamoPipelineActionRejectionFixtures,
  detroitDynamoPipelineActionModels,
} from '../src/lib/detroitDynamoPipelineActionContract.js';
import {
  auditDetroitDynamoAdminModuleReadContract,
  buildDetroitDynamoAdminModuleReadFixtures,
  buildDetroitDynamoAdminModuleReadRejectionFixtures,
} from '../src/lib/detroitDynamoAdminModuleReadContract.js';
import {
  auditDetroitDynamoAdminRoleGrantContract,
  buildDetroitDynamoAdminRoleGrantFixtures,
  buildDetroitDynamoAdminRoleGrantRejectionFixtures,
} from '../src/lib/detroitDynamoAdminRoleGrantContract.js';
import {
  auditDetroitDynamoAdminModuleWriteContract,
  buildDetroitDynamoAdminModuleWriteFixtures,
  buildDetroitDynamoAdminModuleWriteRejectionFixtures,
} from '../src/lib/detroitDynamoAdminModuleWriteContract.js';
import {
  detroitDynamoAppwriteCollections,
} from '../src/lib/detroitDynamoAppwriteSchema.js';

const root = process.cwd();
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173';

const appRouteNeedles = [
  'path="/detroit-dynamo"',
  ...detroitDynamoRouteManifest
    .filter((route) => route.routerPath !== 'index')
    .map((route) => `path="${route.routerPath}"`),
  ...detroitDynamoAliasRoutes
    .filter((route) => !route.routerPath.startsWith('/'))
    .map((route) => `path="${route.routerPath}"`),
  'path="/admin/detroit-dynamo"',
  'path="/admin/detroit-dynamo/modules/:moduleSlug"',
];

const dynamoRoutes = detroitDynamoAllRoutePaths;

const currentSiteRoutes = ['/', '/book', '/login', '/dashboard', '/coach'];

const adminRoutes = [
  '/admin',
  '/admin/coaches',
  '/admin/team',
  '/admin/lcfc',
  '/admin/detroit-dynamo',
  ...detroitDynamoAdminModuleDetailRoutes,
  '/admin/bookings',
  '/admin/credits',
  '/admin/content',
  '/admin/pricing',
  '/admin/applications',
  '/admin/blog',
  '/admin/users',
  '/admin/messages',
  '/admin/unsubscribes',
];

const requiredAssets = [
  '/detroit-dynamo/logo-primary.png',
  '/detroit-dynamo/favicon.svg',
  '/detroit-dynamo/detroit-dynamo-mark.svg',
  '/detroit-dynamo/home-kit-reference.png',
  '/detroit-dynamo/away-kit-reference.png',
  '/detroit-dynamo/digital-reference.png',
  '/detroit-dynamo/applications-reference.png',
];

const requiredLeadTypes = ['contact', 'training', 'youth', 'tryout', 'men', 'women', 'sponsor'];
const pipelineBackedModels = ['ContactLead', 'Booking', 'TryoutRegistration', 'Sponsor'];
const pipelineAttributeKeys = [
  'pipeline_status',
  'pipeline_owner_role',
  'pipeline_due_at',
  'pipeline_updated_at',
  'pipeline_last_note',
  'pipeline_event_count',
];
const pipelineIndexKeys = ['idx_pipeline_status', 'idx_pipeline_owner', 'idx_pipeline_due'];

const smokeRoutes = [
  '/',
  '/book',
  '/admin',
  '/admin/detroit-dynamo',
  '/admin/detroit-dynamo/modules/players',
  ...dynamoRoutes.filter((route) => route !== '/detroit-dynamo-preview'),
];

const sourceFiles = [
  'src/components/detroit-dynamo/DetroitDynamoHeader.jsx',
  'src/components/detroit-dynamo/DetroitDynamoFooter.jsx',
  'src/components/detroit-dynamo/useDetroitDynamoMeta.js',
  'src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx',
  'src/pages/detroit-dynamo/DetroitDynamoBrand.jsx',
  'src/pages/detroit-dynamo/DetroitDynamoHome.jsx',
  'src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx',
  'src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx',
  'src/lib/detroitDynamoAdminAccess.js',
  'src/lib/detroitDynamoAdminDrafts.js',
  'src/lib/detroitDynamoClaimSafetyContract.js',
  'src/lib/detroitDynamoExternalGateContracts.js',
  'src/lib/detroitDynamoLeadIntakeContract.js',
  'src/lib/detroitDynamoLeadPipeline.js',
  'src/lib/detroitDynamoPipelineActionContract.js',
  'src/lib/detroitDynamoAdminModuleReadContract.js',
  'src/lib/detroitDynamoAdminModuleReads.js',
  'src/lib/detroitDynamoAdminRecordWorkspace.js',
  'src/lib/detroitDynamoAdminRecordWorkspaceContract.js',
  'src/lib/detroitDynamoAdminRoleGrantContract.js',
  'src/lib/detroitDynamoAdminRoleGrants.js',
  'src/lib/detroitDynamoAdminModuleWriteContract.js',
  'src/lib/detroitDynamoAdminModuleWrites.js',
  'src/lib/detroitDynamoPromotionCutoverContract.js',
  'src/lib/detroitDynamoLaunchEvidenceContract.js',
  'src/lib/detroitDynamoLaunchEvidenceActions.js',
  'src/lib/detroitDynamoExternalConfirmationActions.js',
  'src/lib/detroitDynamoOwnerLaunchReview.js',
  'src/lib/detroitDynamoOwnerEvidenceIntake.js',
  'src/lib/detroitDynamoProductionPreviewEvidence.js',
  'src/lib/detroitDynamoLiveReadinessBoard.js',
  'src/lib/detroitDynamoLaunchArtifactIndex.js',
  'src/lib/detroitDynamoDeploymentReadiness.js',
  'src/lib/detroitDynamoVercelPreviewRunbook.js',
  'src/lib/detroitDynamoSecretRedactionContract.js',
  'src/lib/detroitDynamoExternalGateClosurePacket.js',
  'src/lib/detroitDynamoOwnerHandoffPacket.js',
  'src/lib/detroitDynamoOwnerSignoffRegister.js',
  'src/lib/detroitDynamoFinalAcceptanceMatrix.js',
  'src/lib/detroitDynamoLeads.js',
  'src/lib/detroitDynamoSafeguardingContract.js',
  'src/pages/admin/AdminDetroitDynamo.jsx',
  'src/pages/admin/AdminDetroitDynamoModule.jsx',
  'src/pages/admin/AdminPanel.jsx',
];

const appwriteFunctionNeedles = [
  '"$id": "detroitDynamoLeadIntake"',
  '"execute": ["any"]',
  '"path": "functions/detroitDynamoLeadIntake"',
  '"$id": "detroitDynamoLeadPipelineAction"',
  '"execute": ["users"]',
  '"path": "functions/detroitDynamoLeadPipelineAction"',
  '"$id": "detroitDynamoAdminModuleRead"',
  '"path": "functions/detroitDynamoAdminModuleRead"',
  '"$id": "detroitDynamoAdminRoleGrantAction"',
  '"path": "functions/detroitDynamoAdminRoleGrantAction"',
  '"$id": "detroitDynamoAdminModuleWriteAction"',
  '"path": "functions/detroitDynamoAdminModuleWriteAction"',
  '"documents.write"',
];

const requiredFunctionFiles = [
  'functions/detroitDynamoLeadIntake/src/main.js',
  'functions/detroitDynamoLeadIntake/package.json',
  'functions/detroitDynamoLeadPipelineAction/src/main.js',
  'functions/detroitDynamoLeadPipelineAction/package.json',
  'functions/detroitDynamoAdminModuleRead/src/main.js',
  'functions/detroitDynamoAdminModuleRead/package.json',
  'functions/detroitDynamoAdminRoleGrantAction/src/main.js',
  'functions/detroitDynamoAdminRoleGrantAction/package.json',
  'functions/detroitDynamoAdminModuleWriteAction/src/main.js',
  'functions/detroitDynamoAdminModuleWriteAction/package.json',
];

const allowedRoutes = new Set([...dynamoRoutes, ...currentSiteRoutes, ...adminRoutes]);
const failures = [];

async function readProjectFile(file) {
  return fs.readFile(path.join(root, file), 'utf8');
}

async function listProjectFiles(dir) {
  const entries = await fs.readdir(path.join(root, dir), { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) return listProjectFiles(relative);
    return relative;
  }));
  return files.flat();
}

function withoutHash(value) {
  return value.split('#')[0] || '/';
}

function hashPart(value) {
  return value.includes('#') ? value.split('#')[1] : '';
}

function collectLinks(file, text) {
  const links = [];
  const patterns = [
    /\b(?:to|href|primaryTo|secondaryTo|source|route)\s*=\s*["'](\/[^"']*)["']/g,
    /\b(?:to|path|source|route):\s*["'](\/[^"']*)["']/g,
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(text);
    while (match) {
      links.push({ file, value: match[1] });
      match = pattern.exec(text);
    }
  }

  return links;
}

function collectAnchorIds(file, text) {
  const anchors = [];
  const pattern = /\bid\s*=\s*["']([^"']+)["']/g;
  let match = pattern.exec(text);
  while (match) {
    anchors.push({ file, id: match[1] });
    match = pattern.exec(text);
  }
  return anchors;
}

async function verifyAppRoutes() {
  const app = await readProjectFile('src/App.jsx');
  for (const needle of appRouteNeedles) {
    if (!app.includes(needle)) {
      failures.push(`Missing App route registration: ${needle}`);
    }
  }
}

function verifyRouteManifest() {
  const paths = new Set();
  for (const route of detroitDynamoRouteManifest) {
    if (paths.has(route.path)) failures.push(`Duplicate route manifest path: ${route.path}`);
    paths.add(route.path);
    if (!route.title) failures.push(`Missing SEO title for ${route.path}`);
    if (!route.description) failures.push(`Missing SEO description for ${route.path}`);
    if (route.sitemap && (!route.priority || !route.changefreq)) {
      failures.push(`Sitemap route missing priority/changefreq: ${route.path}`);
    }
  }

  for (const alias of detroitDynamoAliasRoutes) {
    if (!paths.has(alias.canonicalPath)) {
      failures.push(`Alias ${alias.path} points at missing canonical route ${alias.canonicalPath}`);
    }
  }

  if (detroitDynamoSitemapRoutes.length < 12) {
    failures.push('Expected at least 12 sitemap-ready Detroit Dynamo routes');
  }
}

function verifyLaunchReadiness() {
  if (!Array.isArray(detroitDynamoLaunchReadiness) || detroitDynamoLaunchReadiness.length < 6) {
    failures.push('Expected at least 6 Detroit Dynamo launch-readiness categories');
  }
  if (!Array.isArray(detroitDynamoPromotionGates) || detroitDynamoPromotionGates.length < 6) {
    failures.push('Expected at least 6 Detroit Dynamo promotion gates');
  }
  if (!Array.isArray(detroitDynamoBackendActivationSteps) || detroitDynamoBackendActivationSteps.length < 8) {
    failures.push('Expected at least 8 Detroit Dynamo backend activation steps');
  }
  if (!Array.isArray(detroitDynamoExternalConfirmationRegister) || detroitDynamoExternalConfirmationRegister.length < 6) {
    failures.push('Expected at least 6 Detroit Dynamo external confirmation registers');
  }
  if (!Array.isArray(detroitDynamoRolePermissionMatrix) || detroitDynamoRolePermissionMatrix.length < 7) {
    failures.push('Expected at least 7 Detroit Dynamo role permission rows');
  }
  if (!Array.isArray(detroitDynamoAdminModuleRegistry) || detroitDynamoAdminModuleRegistry.length !== detroitDynamoAdminModules.length) {
    failures.push('Expected Detroit Dynamo admin module registry to cover every planned admin module');
  }

  const requiredCategories = [
    'Backend/Data',
    'Payments/Packages',
    'Waivers/Legal',
    'League/Competition',
    'Facilities/Operations',
    'Content/Brand Promotion',
  ];
  const readinessCategories = new Set(detroitDynamoLaunchReadiness.map((item) => item.category));
  for (const category of requiredCategories) {
    if (!readinessCategories.has(category)) {
      failures.push(`Missing launch-readiness category: ${category}`);
    }
  }

  for (const item of detroitDynamoLaunchReadiness) {
    if (!item.category || !item.status || !item.ownerRole || !item.nextAction || !item.promotionGate) {
      failures.push(`Incomplete launch-readiness item: ${item.category || 'unknown'}`);
    }
    if (!Array.isArray(item.evidenceNeeded) || item.evidenceNeeded.length < 3) {
      failures.push(`Launch-readiness item needs at least 3 evidence points: ${item.category || 'unknown'}`);
    }
    if (item.category === 'League/Competition' && item.status === 'confirmed') {
      failures.push('League/Competition readiness must not be marked confirmed before league membership is verified');
    }
  }

  const requiredGates = [
    'Legacy public route preservation',
    'Data backend live',
    'Payments approved',
    'Waivers approved',
    'League and facility facts confirmed',
    'SEO and redirect launch approved',
  ];
  const gateNames = new Set(detroitDynamoPromotionGates.map((item) => item.gate));
  for (const gate of requiredGates) {
    if (!gateNames.has(gate)) {
      failures.push(`Missing promotion gate: ${gate}`);
    }
  }

  for (const item of detroitDynamoPromotionGates) {
    if (!item.gate || !item.status || !item.requiredEvidence || !item.nextAction) {
      failures.push(`Incomplete promotion gate: ${item.gate || 'unknown'}`);
    }
  }

  const requiredBackendCommands = [
    'npm run preflight:dynamo-backend',
    'npm run plan:dynamo-appwrite',
    'npm run provision:dynamo-appwrite -- --apply',
    'node scripts/configure-functions.mjs',
    'appwrite push functions --all',
    'npm run audit:dynamo-goal',
  ];
  const backendCommands = new Set(detroitDynamoBackendActivationSteps.map((item) => item.command));
  for (const command of requiredBackendCommands) {
    if (!backendCommands.has(command)) {
      failures.push(`Missing backend activation command: ${command}`);
    }
  }
  for (const item of detroitDynamoBackendActivationSteps) {
    if (!item.step || !item.title || !item.ownerRole || !item.command || !item.evidence || !item.nextAction) {
      failures.push(`Incomplete backend activation step: ${item.title || 'unknown'}`);
    }
  }

  const requiredConfirmationAreas = [
    'Payments & Packages',
    'Waivers & Legal',
    'League & Competition Facts',
    'Facilities & Operations',
    'Staff, Rosters & Safeguarding',
    'Sponsors, Media & Content Proof',
  ];
  const confirmationAreas = new Set(detroitDynamoExternalConfirmationRegister.map((item) => item.area));
  for (const area of requiredConfirmationAreas) {
    if (!confirmationAreas.has(area)) {
      failures.push(`Missing external confirmation area: ${area}`);
    }
  }
  for (const item of detroitDynamoExternalConfirmationRegister) {
    if (!item.area || !item.status || !item.ownerRole || !item.publishRule || !item.nextAction) {
      failures.push(`Incomplete external confirmation register: ${item.area || 'unknown'}`);
    }
    if (!Array.isArray(item.requiredFacts) || item.requiredFacts.length < 4) {
      failures.push(`External confirmation register needs at least 4 facts: ${item.area || 'unknown'}`);
    }
    if (item.area === 'League & Competition Facts' && item.status === 'confirmed') {
      failures.push('League & Competition Facts must not be marked confirmed before league membership is verified');
    }
  }

  const externalGateIssues = auditDetroitDynamoExternalGateContracts();
  for (const issue of externalGateIssues) {
    failures.push(`Detroit Dynamo external gate contract issue: ${issue}`);
  }
  const externalGateReport = buildDetroitDynamoExternalGateContractReport();
  if (externalGateReport.paymentPackageTracks.length < 6) {
    failures.push('Expected at least 6 payment/package gate tracks');
  }
  if (externalGateReport.waiverTracks.length < 6) {
    failures.push('Expected at least 6 waiver gate tracks');
  }
  if (!externalGateReport.paymentPackageTracks.every((track) => track.providerStatus === 'not_connected')) {
    failures.push('Payment/package gate tracks must remain provider-disconnected in preview');
  }
  if (!externalGateReport.waiverTracks.every((track) => track.signatureMode === 'not_enabled')) {
    failures.push('Waiver gate tracks must keep signatures disabled in preview');
  }

  const claimSafetyIssues = auditDetroitDynamoClaimSafetyContract();
  for (const issue of claimSafetyIssues) {
    failures.push(`Detroit Dynamo claim safety contract issue: ${issue}`);
  }
  const claimSafetyReport = buildDetroitDynamoClaimSafetyContractReport();
  if (claimSafetyReport.claimSafetyTracks.length < 7) {
    failures.push('Expected at least 7 public claim-safety tracks');
  }
  if (claimSafetyReport.claimSafetyTracks.some((track) => track.confirmationStatus === 'confirmed')) {
    failures.push('Claim-safety tracks must not be marked confirmed while the preview is isolated');
  }
  if (!claimSafetyReport.claimSafetyTracks.some((track) => track.id === 'league-competition-pathway' && track.confirmationStatus === 'future_pathway')) {
    failures.push('Claim-safety contract must keep league and competition language future-pathway only');
  }
  if (!claimSafetyReport.claimSafetyTracks.every((track) => track.blockedClaim && track.safeLanguage.length >= 2)) {
    failures.push('Claim-safety tracks must include blocked claim and safe language guidance');
  }

  const promotionCutoverIssues = auditDetroitDynamoPromotionCutoverContract();
  for (const issue of promotionCutoverIssues) {
    failures.push(`Detroit Dynamo promotion cutover contract issue: ${issue}`);
  }
  const promotionCutoverReport = buildDetroitDynamoPromotionCutoverReport();
  if (promotionCutoverReport.cutoverTracks.length < 9) {
    failures.push('Expected at least 9 promotion cutover tracks');
  }
  if (promotionCutoverReport.cutoverTracks.some((track) => ['live', 'complete', 'promoted'].includes(track.status))) {
    failures.push('Promotion cutover tracks must not be marked live while Detroit Dynamo is preview-only');
  }
  if (!promotionCutoverReport.cutoverTracks.some((track) => track.id === 'legal-support-communications')) {
    failures.push('Promotion cutover contract must include legal/support communications readiness');
  }
  if (!promotionCutoverReport.cutoverTracks.every((track) => track.rollbackAction && track.requiredEvidence.length >= 4)) {
    failures.push('Promotion cutover tracks must include rollback action and required evidence');
  }

  const launchEvidenceReport = buildDetroitDynamoLaunchEvidenceReport();
  const launchEvidenceIssues = auditDetroitDynamoLaunchEvidenceReport(launchEvidenceReport);
  for (const issue of launchEvidenceIssues) {
    failures.push(`Detroit Dynamo launch evidence contract issue: ${issue}`);
  }
  if (launchEvidenceReport.checklistItems.length < 13) {
    failures.push('Expected at least 13 launch evidence checklist items');
  }
  if (!launchEvidenceReport.checklistItems.some((item) => item.id === 'backend-preflight-and-provisioning')) {
    failures.push('Launch evidence checklist must include backend preflight/provisioning evidence');
  }
  if (!launchEvidenceReport.checklistItems.some((item) => item.id === 'payment-package-approval')) {
    failures.push('Launch evidence checklist must include payment/package approval evidence');
  }
  if (!launchEvidenceReport.checklistItems.some((item) => item.id === 'waiver-legal-version-approval')) {
    failures.push('Launch evidence checklist must include waiver/legal approval evidence');
  }
  if (!launchEvidenceReport.checklistItems.some((item) => item.id === 'seo-metadata-noindex-approval' && item.status === 'preview_only')) {
    failures.push('Launch evidence checklist must keep SEO/noindex approval preview-only');
  }
  const launchEvidenceActionReport = buildDetroitDynamoLaunchEvidenceActionReport();
  const launchEvidenceActionIssues = auditDetroitDynamoLaunchEvidenceActionReport(launchEvidenceActionReport);
  for (const issue of launchEvidenceActionIssues) {
    failures.push(`Detroit Dynamo launch evidence action contract issue: ${issue}`);
  }
  if (launchEvidenceActionReport.summary.liveGatesCleared !== 0) {
    failures.push('Preview launch evidence actions must not clear live gates');
  }
  if (launchEvidenceActionReport.actions.length < 4) {
    failures.push('Expected at least 4 launch evidence action fixtures');
  }
  const externalConfirmationActionReport = buildDetroitDynamoExternalConfirmationActionReport();
  const externalConfirmationActionIssues = auditDetroitDynamoExternalConfirmationActionReport(externalConfirmationActionReport);
  for (const issue of externalConfirmationActionIssues) {
    failures.push(`Detroit Dynamo external confirmation action contract issue: ${issue}`);
  }
  if (externalConfirmationActionReport.summary.liveGatesCleared !== 0) {
    failures.push('Preview external confirmation actions must not clear live gates');
  }
  if (externalConfirmationActionReport.summary.publicationsUnlocked !== 0) {
    failures.push('Preview external confirmation actions must not unlock publication');
  }
  if (externalConfirmationActionReport.actions.length < detroitDynamoExternalConfirmationRegister.length) {
    failures.push('Expected external confirmation action fixtures to cover every confirmation register');
  }
  const ownerLaunchReviewReport = buildDetroitDynamoOwnerLaunchReviewReport();
  const ownerLaunchReviewIssues = auditDetroitDynamoOwnerLaunchReviewReport(ownerLaunchReviewReport);
  for (const issue of ownerLaunchReviewIssues) {
    failures.push(`Detroit Dynamo owner launch review issue: ${issue}`);
  }
  if (ownerLaunchReviewReport.decision.decision !== 'no_go_preview_only') {
    failures.push('Owner launch review must remain no-go while external gates are pending');
  }
  if (ownerLaunchReviewReport.summary.liveGatesCleared !== 0 || ownerLaunchReviewReport.summary.publicationsUnlocked !== 0) {
    failures.push('Owner launch review must not clear live gates or unlock publications');
  }
  if (ownerLaunchReviewReport.sections.length < 9) {
    failures.push('Expected at least 9 owner launch review sections');
  }
  const ownerEvidenceIntakeReport = buildDetroitDynamoOwnerEvidenceIntakeReport();
  const ownerEvidenceIntakeIssues = auditDetroitDynamoOwnerEvidenceIntakeReport(ownerEvidenceIntakeReport);
  for (const issue of ownerEvidenceIntakeIssues) {
    failures.push(`Detroit Dynamo owner evidence intake issue: ${issue}`);
  }
  if (ownerEvidenceIntakeReport.summary.liveGatesCleared !== 0 || ownerEvidenceIntakeReport.summary.publicationsUnlocked !== 0) {
    failures.push('Owner evidence intake must not clear live gates or unlock publications');
  }
  if (ownerEvidenceIntakeReport.summary.safeToPublishRows !== 0) {
    failures.push('Owner evidence intake must not mark rows safe to publish');
  }
  if (ownerEvidenceIntakeReport.intakeRows.length < buildDetroitDynamoLaunchEvidenceReport().checklistItems.length) {
    failures.push('Owner evidence intake must cover every launch evidence checklist item');
  }
  const productionPreviewEvidenceReport = buildDetroitDynamoProductionPreviewEvidenceReport();
  const productionPreviewEvidenceIssues = auditDetroitDynamoProductionPreviewEvidenceReport(productionPreviewEvidenceReport);
  for (const issue of productionPreviewEvidenceIssues) {
    failures.push(`Detroit Dynamo production-preview evidence issue: ${issue}`);
  }
  if (productionPreviewEvidenceReport.summary.liveGatesCleared !== 0 || productionPreviewEvidenceReport.summary.publicationsUnlocked !== 0) {
    failures.push('Production-preview evidence matrix must not clear live gates or unlock publications');
  }
  if (productionPreviewEvidenceReport.summary.productionSubmissionsRecorded !== 0) {
    failures.push('Production-preview evidence matrix must not claim production submissions are already recorded');
  }
  if (productionPreviewEvidenceReport.summary.publicFormTracks < requiredLeadTypes.length) {
    failures.push('Production-preview evidence matrix must cover every public lead form variant');
  }
  const liveReadinessBoardReport = buildDetroitDynamoLiveReadinessBoardReport();
  const liveReadinessBoardIssues = auditDetroitDynamoLiveReadinessBoardReport(liveReadinessBoardReport);
  for (const issue of liveReadinessBoardIssues) {
    failures.push(`Detroit Dynamo live readiness board issue: ${issue}`);
  }
  if (liveReadinessBoardReport.decision.decision !== 'no_go_preview_only') {
    failures.push('Live readiness board must remain no-go while external gates are open');
  }
  if (liveReadinessBoardReport.summary.goLiveAllowedRows !== 0) {
    failures.push('Live readiness board must not allow go-live rows');
  }
  if (liveReadinessBoardReport.summary.liveGatesCleared !== 0 || liveReadinessBoardReport.summary.publicationsUnlocked !== 0) {
    failures.push('Live readiness board must not clear live gates or unlock publications');
  }
  if (liveReadinessBoardReport.summary.rootPromotionAllowed || liveReadinessBoardReport.summary.checkoutAllowed || liveReadinessBoardReport.summary.permanentRedirectsAllowed) {
    failures.push('Live readiness board must keep root promotion, checkout, and permanent redirects blocked');
  }
  const launchArtifactIndexReport = buildDetroitDynamoLaunchArtifactIndexReport();
  const launchArtifactIndexIssues = auditDetroitDynamoLaunchArtifactIndexReport(launchArtifactIndexReport);
  for (const issue of launchArtifactIndexIssues) {
    failures.push(`Detroit Dynamo launch artifact index issue: ${issue}`);
  }
  if (launchArtifactIndexReport.summary.liveGatesCleared !== 0 || launchArtifactIndexReport.summary.publicationsUnlocked !== 0) {
    failures.push('Launch artifact index must not clear live gates or unlock publications');
  }
  if (launchArtifactIndexReport.summary.artifactsTotal < 20) {
    failures.push('Launch artifact index must cover the launch handoff packet');
  }
  const deploymentReadinessReport = buildDetroitDynamoDeploymentReadinessReport();
  const deploymentReadinessIssues = auditDetroitDynamoDeploymentReadinessReport(deploymentReadinessReport);
  for (const issue of deploymentReadinessIssues) {
    failures.push(`Detroit Dynamo deployment readiness issue: ${issue}`);
  }
  if (deploymentReadinessReport.decision.launchMode !== 'preview_only') {
    failures.push('Deployment readiness must remain preview-only');
  }
  if (deploymentReadinessReport.summary.liveGatesCleared !== 0 || deploymentReadinessReport.summary.publicationsUnlocked !== 0) {
    failures.push('Deployment readiness must not clear live gates or unlock publications');
  }
  if (deploymentReadinessReport.summary.productionDeploymentsRecorded !== 0 || deploymentReadinessReport.summary.productionSubmissionsRecorded !== 0) {
    failures.push('Deployment readiness must not claim production deployment or submission evidence');
  }
  if (deploymentReadinessReport.summary.rootPromotionAllowed || deploymentReadinessReport.summary.permanentRedirectsAllowed) {
    failures.push('Deployment readiness must block root promotion and permanent redirects');
  }
  const vercelPreviewRunbookReport = buildDetroitDynamoVercelPreviewRunbookReport();
  const vercelPreviewRunbookIssues = auditDetroitDynamoVercelPreviewRunbookReport(vercelPreviewRunbookReport);
  for (const issue of vercelPreviewRunbookIssues) {
    failures.push(`Detroit Dynamo Vercel preview runbook issue: ${issue}`);
  }
  if (vercelPreviewRunbookReport.decision.launchMode !== 'preview_only' || vercelPreviewRunbookReport.decision.productionPromotionAllowed !== false) {
    failures.push('Vercel preview runbook must remain preview-only and block production promotion');
  }
  if (vercelPreviewRunbookReport.summary.stepsTotal < 10 || vercelPreviewRunbookReport.summary.commandCount < 10) {
    failures.push('Vercel preview runbook must include the concrete preview deployment command path');
  }
  if (!vercelPreviewRunbookReport.summary.projectIdentifiersRedacted) {
    failures.push('Vercel preview runbook must redact project identifiers');
  }
  if (vercelPreviewRunbookReport.summary.previewDeploymentRecorded !== 0 || vercelPreviewRunbookReport.summary.productionDeploymentRecorded !== 0) {
    failures.push('Vercel preview runbook must not claim preview or production deployment evidence');
  }
  if (vercelPreviewRunbookReport.summary.productionPromotionAllowed || vercelPreviewRunbookReport.summary.rollbackTargetRecorded) {
    failures.push('Vercel preview runbook must keep production promotion and rollback evidence blocked until owner signoff');
  }
  if (vercelPreviewRunbookReport.summary.liveGatesCleared !== 0 || vercelPreviewRunbookReport.summary.publicationsUnlocked !== 0) {
    failures.push('Vercel preview runbook must not clear live gates or unlock publications');
  }
  const secretRedactionReport = buildDetroitDynamoSecretRedactionReport();
  const secretRedactionIssues = auditDetroitDynamoSecretRedactionReport(secretRedactionReport);
  for (const issue of secretRedactionIssues) {
    failures.push(`Detroit Dynamo secret redaction issue: ${issue}`);
  }
  if (secretRedactionReport.decision.launchMode !== 'preview_only' || secretRedactionReport.decision.publishAllowed !== false) {
    failures.push('Secret redaction contract must remain preview-only and block publication');
  }
  if (secretRedactionReport.summary.rulesTotal < 8 || secretRedactionReport.summary.evidenceRequiredRules < 7) {
    failures.push('Secret redaction contract must include the required redaction rules');
  }
  if (secretRedactionReport.summary.exactSecretValuesWritten !== false || secretRedactionReport.summary.projectIdentifiersRedacted !== true) {
    failures.push('Secret redaction contract must avoid exact secret values and redact project identifiers');
  }
  if (secretRedactionReport.summary.leakagesDetected !== 0) {
    failures.push('Secret redaction contract must not report leakage');
  }
  if (secretRedactionReport.summary.liveGatesCleared !== 0 || secretRedactionReport.summary.publicationsUnlocked !== 0) {
    failures.push('Secret redaction contract must not clear live gates or unlock publications');
  }
  const externalGateClosureReport = buildDetroitDynamoExternalGateClosureReport();
  const externalGateClosureIssues = auditDetroitDynamoExternalGateClosureReport(externalGateClosureReport);
  for (const issue of externalGateClosureIssues) {
    failures.push(`Detroit Dynamo external gate closure issue: ${issue}`);
  }
  if (externalGateClosureReport.decision.launchMode !== 'preview_only' || externalGateClosureReport.decision.closureAllowed !== false) {
    failures.push('External gate closure packet must remain preview-only and block closure');
  }
  if (externalGateClosureReport.summary.rowsTotal < 9 || externalGateClosureReport.summary.externalEvidenceRows < 8) {
    failures.push('External gate closure packet must include the required external evidence rows');
  }
  if (externalGateClosureReport.summary.readyToCloseRows !== 0 || externalGateClosureReport.summary.closureAllowedRows !== 0) {
    failures.push('External gate closure packet must not mark rows ready or closure-allowed in preview');
  }
  if (externalGateClosureReport.summary.liveGatesCleared !== 0 || externalGateClosureReport.summary.publicationsUnlocked !== 0) {
    failures.push('External gate closure packet must not clear live gates or unlock publications');
  }
  if (externalGateClosureReport.summary.rootPromotionAllowed || externalGateClosureReport.summary.checkoutAllowed || externalGateClosureReport.summary.signatureCaptureAllowed || externalGateClosureReport.summary.completionClaimAllowed) {
    failures.push('External gate closure packet must block root promotion, checkout, signatures, and completion claims');
  }
  const ownerHandoffPacketReport = buildDetroitDynamoOwnerHandoffPacketReport();
  const ownerHandoffPacketIssues = auditDetroitDynamoOwnerHandoffPacketReport(ownerHandoffPacketReport);
  for (const issue of ownerHandoffPacketIssues) {
    failures.push(`Detroit Dynamo owner handoff packet issue: ${issue}`);
  }
  if (ownerHandoffPacketReport.decision.launchMode !== 'preview_only' || ownerHandoffPacketReport.decision.publishAllowed !== false) {
    failures.push('Owner handoff packet must remain preview-only and block publication');
  }
  if (ownerHandoffPacketReport.summary.packetSections < 9 || ownerHandoffPacketReport.summary.evidenceRequiredSections !== ownerHandoffPacketReport.summary.packetSections) {
    failures.push('Owner handoff packet must include evidence-required sections for every launch handoff area');
  }
  if (ownerHandoffPacketReport.summary.redactionReviewSections !== ownerHandoffPacketReport.summary.packetSections) {
    failures.push('Owner handoff packet must require redaction review for every section');
  }
  if (ownerHandoffPacketReport.summary.signedRows !== 0 || ownerHandoffPacketReport.summary.unsignedRows !== ownerHandoffPacketReport.summary.signoffRows) {
    failures.push('Owner handoff packet must keep signoff rows unsigned');
  }
  if (ownerHandoffPacketReport.summary.secretRedactionLeakages !== 0) {
    failures.push('Owner handoff packet must not report secret redaction leakages');
  }
  if (ownerHandoffPacketReport.summary.liveGatesCleared !== 0 || ownerHandoffPacketReport.summary.publicationsUnlocked !== 0) {
    failures.push('Owner handoff packet must not clear live gates or unlock publications');
  }
  if (ownerHandoffPacketReport.summary.rootPromotionAllowed || ownerHandoffPacketReport.summary.checkoutAllowed || ownerHandoffPacketReport.summary.permanentRedirectsAllowed) {
    failures.push('Owner handoff packet must block root promotion, checkout, and permanent redirects');
  }
  const ownerSignoffRegisterReport = buildDetroitDynamoOwnerSignoffRegisterReport();
  const ownerSignoffRegisterIssues = auditDetroitDynamoOwnerSignoffRegisterReport(ownerSignoffRegisterReport);
  for (const issue of ownerSignoffRegisterIssues) {
    failures.push(`Detroit Dynamo owner signoff register issue: ${issue}`);
  }
  if (ownerSignoffRegisterReport.decision.launchMode !== 'preview_only') {
    failures.push('Owner signoff register must remain preview-only');
  }
  if (ownerSignoffRegisterReport.summary.signedRows !== 0 || ownerSignoffRegisterReport.summary.unsignedRows !== ownerSignoffRegisterReport.summary.signoffRows) {
    failures.push('Owner signoff register must keep all signoff rows unsigned');
  }
  if (ownerSignoffRegisterReport.summary.liveGatesCleared !== 0 || ownerSignoffRegisterReport.summary.publicationsUnlocked !== 0) {
    failures.push('Owner signoff register must not clear live gates or unlock publications');
  }
  if (ownerSignoffRegisterReport.summary.productionDeploymentsRecorded !== 0 || ownerSignoffRegisterReport.summary.productionSubmissionsRecorded !== 0) {
    failures.push('Owner signoff register must not claim production deployment or submission evidence');
  }
  if (ownerSignoffRegisterReport.summary.rootPromotionAllowed || ownerSignoffRegisterReport.summary.checkoutAllowed || ownerSignoffRegisterReport.summary.permanentRedirectsAllowed) {
    failures.push('Owner signoff register must block root promotion, checkout, and permanent redirects');
  }
  const finalAcceptanceMatrixReport = buildDetroitDynamoFinalAcceptanceMatrixReport();
  const finalAcceptanceMatrixIssues = auditDetroitDynamoFinalAcceptanceMatrixReport(finalAcceptanceMatrixReport);
  for (const issue of finalAcceptanceMatrixIssues) {
    failures.push(`Detroit Dynamo final acceptance matrix issue: ${issue}`);
  }
  if (finalAcceptanceMatrixReport.decision.launchMode !== 'preview_only' || finalAcceptanceMatrixReport.decision.completionClaimAllowed !== false) {
    failures.push('Final acceptance matrix must remain preview-only and block completion claims');
  }
  if (finalAcceptanceMatrixReport.summary.externalEvidenceRequiredRows < 5) {
    failures.push('Final acceptance matrix must keep external evidence rows explicit');
  }
  if (finalAcceptanceMatrixReport.summary.ownerSignedRows !== 0 || finalAcceptanceMatrixReport.summary.goLiveAllowedRows !== 0) {
    failures.push('Final acceptance matrix must not claim signed owner approvals or go-live rows');
  }
  if (finalAcceptanceMatrixReport.summary.liveGatesCleared !== 0 || finalAcceptanceMatrixReport.summary.publicationsUnlocked !== 0) {
    failures.push('Final acceptance matrix must not clear live gates or unlock publications');
  }
  if (finalAcceptanceMatrixReport.summary.productionDeploymentsRecorded !== 0 || finalAcceptanceMatrixReport.summary.productionSubmissionsRecorded !== 0) {
    failures.push('Final acceptance matrix must not claim production deployment or submission evidence');
  }
  if (finalAcceptanceMatrixReport.summary.rootPromotionAllowed || finalAcceptanceMatrixReport.summary.checkoutAllowed || finalAcceptanceMatrixReport.summary.permanentRedirectsAllowed) {
    failures.push('Final acceptance matrix must block root promotion, checkout, and permanent redirects');
  }

  const safeguardingIssues = auditDetroitDynamoSafeguardingContract();
  for (const issue of safeguardingIssues) {
    failures.push(`Detroit Dynamo safeguarding contract issue: ${issue}`);
  }
  const safeguardingReport = buildDetroitDynamoSafeguardingReport();
  if (safeguardingReport.safeguardingTracks.length < 8) {
    failures.push('Expected at least 8 safeguarding and privacy tracks');
  }
  if (safeguardingReport.safeguardingTracks.some((track) => ['live', 'active', 'approved'].includes(track.activationStatus))) {
    failures.push('Safeguarding tracks must not be marked live while policy/legal/backend review is pending');
  }
  if (!safeguardingReport.safeguardingTracks.some((track) => track.id === 'minor-intake-guardian-consent')) {
    failures.push('Safeguarding contract must include minor intake and guardian consent');
  }
  if (!safeguardingReport.safeguardingTracks.every((track) => track.requiredControls.length >= 4 && track.blockedAction && track.previewHandling)) {
    failures.push('Safeguarding tracks must include controls, blocked action, and preview handling');
  }

  const expectedRoles = [
    'Master Admin',
    'Club Director',
    'Training Director',
    'Coach',
    'Team Manager',
    'Registrar',
    'Media/Admin Staff',
  ];
  const expectedModules = [
    'Players',
    'Parents/guardians',
    'Coaches',
    'Teams',
    'Age groups',
    'Training programs',
    'Training bookings',
    'Tryout registrations',
    'Camp registrations',
    'Payments/packages',
    'Waivers/forms',
    'News posts',
    'Sponsors',
    'Schedules/results',
    'Contact leads',
    'Website content sections',
  ];
  const validAccessLevels = new Set(['admin', 'manage', 'approve', 'contribute', 'view', 'none']);
  const roleNames = new Set(detroitDynamoRolePermissionMatrix.map((item) => item.role));
  for (const role of expectedRoles) {
    if (!roleNames.has(role)) failures.push(`Missing role permission matrix row: ${role}`);
  }
  for (const role of detroitDynamoRolePermissionMatrix) {
    if (!role.role || !role.purpose || !Array.isArray(role.permissions)) {
      failures.push(`Incomplete role permission row: ${role.role || 'unknown'}`);
      continue;
    }
    const modules = new Set(role.permissions.map((item) => item.module));
    for (const module of expectedModules) {
      if (!modules.has(module)) {
        failures.push(`Role ${role.role} missing module permission: ${module}`);
      }
    }
    for (const item of role.permissions) {
      if (!validAccessLevels.has(item.access) || !item.scope) {
        failures.push(`Role ${role.role} has invalid permission for ${item.module || 'unknown module'}`);
      }
    }
  }

  const accessPolicyIssues = auditDetroitDynamoAccessPolicy();
  for (const issue of accessPolicyIssues) {
    failures.push(`Detroit Dynamo access policy issue: ${issue}`);
  }
  if (detroitDynamoRoleAccessSummaries.length !== detroitDynamoRolePermissionMatrix.length) {
    failures.push('Detroit Dynamo role access summaries do not match role matrix count');
  }
  if (!canDetroitDynamoRoleAccess('Master Admin', 'Payments/packages', 'admin')) {
    failures.push('Master Admin must retain admin access to Payments/packages');
  }
  if (!canDetroitDynamoRoleAccess('Club Director', 'News posts', 'approve')) {
    failures.push('Club Director must retain approval access to News posts');
  }
  if (!canDetroitDynamoRoleAccess('Registrar', 'Waivers/forms', 'manage')) {
    failures.push('Registrar must retain management access to Waivers/forms');
  }
  if (canDetroitDynamoRoleAccess('Coach', 'Payments/packages', 'view')) {
    failures.push('Coach must not have payment visibility in Detroit Dynamo policy');
  }
  if (canDetroitDynamoRoleAccess('Media/Admin Staff', 'Waivers/forms', 'view')) {
    failures.push('Media/Admin Staff must not have waiver visibility in Detroit Dynamo policy');
  }
  const actionGuardIssues = auditDetroitDynamoActionGuards();
  for (const issue of actionGuardIssues) {
    failures.push(`Detroit Dynamo action guard issue: ${issue}`);
  }
  const recordDraftIssues = auditDetroitDynamoRecordDrafts();
  for (const issue of recordDraftIssues) {
    failures.push(`Detroit Dynamo record draft issue: ${issue}`);
  }

  const registryModules = new Set(detroitDynamoAdminModuleRegistry.map((item) => item.module));
  const registryCollections = new Set(detroitDynamoAdminModuleRegistry.flatMap((item) => item.collectionIds || []));
  const registrySlugs = new Set(detroitDynamoAdminModuleRegistry.map((item) => item.slug));
  const guardModules = new Set(detroitDynamoModuleActionGuards.map((item) => item.module));
  for (const module of detroitDynamoAdminModules) {
    if (!registryModules.has(module)) {
      failures.push(`Missing admin module registry entry: ${module}`);
    }
    if (!guardModules.has(module)) {
      failures.push(`Missing admin module action guard: ${module}`);
    }
  }
  for (const item of detroitDynamoAdminModuleRegistry) {
    if (!item.purpose || !item.launchPhase || !item.status || !item.blockedUntil) {
      failures.push(`Incomplete admin module registry entry: ${item.module || 'unknown module'}`);
    }
    if (!item.slug || !detroitDynamoAdminModuleDetailRoutes.includes(`/admin/detroit-dynamo/modules/${item.slug}`)) {
      failures.push(`Admin module registry entry missing detail route slug: ${item.module || 'unknown module'}`);
    }
    if (!Array.isArray(item.primaryModels) || item.primaryModels.length === 0) {
      failures.push(`Admin module registry entry missing primary models: ${item.module || 'unknown module'}`);
    }
    if (!Array.isArray(item.collectionIds) || item.collectionIds.length === 0) {
      failures.push(`Admin module registry entry missing collection IDs: ${item.module || 'unknown module'}`);
    }
    if (!Array.isArray(item.ownerRoles) || item.ownerRoles.some((role) => !detroitDynamoAdminRoles.includes(role))) {
      failures.push(`Admin module registry entry has invalid owner role: ${item.module || 'unknown module'}`);
    }
    if (!Array.isArray(item.enabledActions) || item.enabledActions.length < 3) {
      failures.push(`Admin module registry entry needs at least 3 enabled actions: ${item.module || 'unknown module'}`);
    }
  }
  for (const guard of detroitDynamoModuleActionGuards) {
    if (!Array.isArray(guard.actions) || guard.actions.length < 3) {
      failures.push(`Admin module action guard needs at least 3 guarded actions: ${guard.module || 'unknown module'}`);
    }
    for (const action of guard.actions) {
      if (!action.requiredAccess || action.permittedRoles.length === 0 || action.permittedOwnerRoles.length === 0) {
        failures.push(`Incomplete admin action guard for ${guard.module || 'unknown module'}: ${action.action || 'unknown action'}`);
      }
    }
  }
  for (const collectionId of ['dd_players', 'dd_parent_guardians', 'dd_bookings', 'dd_tryout_registrations', 'dd_sponsors', 'dd_contact_leads']) {
    if (!registryCollections.has(collectionId)) {
      failures.push(`Admin module registry should reference intake collection: ${collectionId}`);
    }
  }
  if (!detroitDynamoAppwriteCollections.some((collection) => collection.model === 'AdminAuditEvent'
    && collection.collectionId === 'dd_admin_audit_events'
    && collection.accessPolicy === 'server_function_append_admin_read')) {
    failures.push('Detroit Dynamo Appwrite schema must include the append-only admin audit event collection');
  }
  if (registrySlugs.size !== detroitDynamoAdminModuleRegistry.length) {
    failures.push('Admin module registry slugs must be unique for detail routes');
  }
  if (detroitDynamoAdminModuleDetailRoutes.length !== detroitDynamoAdminModuleRegistry.length) {
    failures.push('Admin module detail route count must match registry count');
  }

  for (const leadType of requiredLeadTypes) {
    const routing = detroitDynamoLeadRouting[leadType];
    if (!routing) {
      failures.push(`Missing structured lead routing for ${leadType}`);
      continue;
    }
    if (!routing.destinationModel || !routing.ownerRole || !routing.nextAction) {
      failures.push(`Incomplete lead routing text for ${leadType}`);
    }
    if (!Array.isArray(routing.destinationModels) || routing.destinationModels.length === 0) {
      failures.push(`Lead routing missing destination models for ${leadType}`);
    }
    if (!Array.isArray(routing.collectionIds) || routing.collectionIds.length === 0) {
      failures.push(`Lead routing missing collection IDs for ${leadType}`);
    }
  }
  const routingExpectations = [
    ['training', 'Booking'],
    ['youth', 'ParentGuardian'],
    ['tryout', 'Player'],
    ['men', 'Team'],
    ['women', 'Team'],
    ['sponsor', 'Sponsor'],
  ];
  for (const [leadType, model] of routingExpectations) {
    if (!detroitDynamoLeadRouting[leadType]?.destinationModels?.includes(model)) {
      failures.push(`Lead routing for ${leadType} should include ${model}`);
    }
  }

  if (!Array.isArray(detroitDynamoLeadPipelineStages) || detroitDynamoLeadPipelineStages.length < 6) {
    failures.push('Expected at least 6 Detroit Dynamo lead pipeline stages');
  }
  const pipelineStatuses = new Set(detroitDynamoLeadPipelineStages.map((stage) => stage.status));
  for (const status of ['new', 'triaged', 'contacted', 'converted', 'closed_not_fit']) {
    if (!pipelineStatuses.has(status)) {
      failures.push(`Lead pipeline missing status: ${status}`);
    }
  }
  for (const stage of detroitDynamoLeadPipelineStages) {
    if (!stage.status || !stage.label || !stage.ownerAction || !Number.isFinite(stage.maxAgeHours) || stage.maxAgeHours <= 0) {
      failures.push(`Incomplete lead pipeline stage: ${stage.status || 'unknown stage'}`);
    }
    if (!Array.isArray(stage.appliesTo) || stage.appliesTo.length === 0) {
      failures.push(`Lead pipeline stage missing lead-type coverage: ${stage.status || 'unknown stage'}`);
    }
    if (!Array.isArray(stage.nextStatuses) || stage.nextStatuses.length === 0) {
      failures.push(`Lead pipeline stage missing next statuses: ${stage.status || 'unknown stage'}`);
    }
    if (stage.nextStatuses.some((status) => !pipelineStatuses.has(status))) {
      failures.push(`Lead pipeline stage references unknown next status: ${stage.status || 'unknown stage'}`);
    }
    if (!Array.isArray(stage.adminModules) || stage.adminModules.length === 0) {
      failures.push(`Lead pipeline stage missing admin module coverage: ${stage.status || 'unknown stage'}`);
    }
  }
  for (const leadType of requiredLeadTypes) {
    const pipeline = detroitDynamoLeadPipelineByType[leadType];
    if (!pipeline) {
      failures.push(`Missing lead pipeline map for ${leadType}`);
      continue;
    }
    if (pipeline.defaultStatus !== 'new' || !pipeline.requiredStages.includes('new') || !pipeline.requiredStages.includes('contacted')) {
      failures.push(`Lead pipeline for ${leadType} must start at new and include contacted`);
    }
    if (!Array.isArray(pipeline.collectionIds) || pipeline.collectionIds.length === 0) {
      failures.push(`Lead pipeline for ${leadType} missing collection IDs`);
    }
  }
  const pipelineOperationIssues = auditDetroitDynamoLeadPipelineOperations();
  for (const issue of pipelineOperationIssues) {
    failures.push(`Detroit Dynamo lead pipeline operation issue: ${issue}`);
  }

  const requiredDraftModels = ['ContactLead', 'Booking', 'Player', 'ParentGuardian', 'TryoutRegistration', 'Sponsor', 'Team'];
  const draftModels = new Set(Object.values(detroitDynamoLeadRecordDraftMap).flatMap((item) => item.models));
  for (const model of requiredDraftModels) {
    if (!draftModels.has(model)) {
      failures.push(`Record draft map should create ${model}`);
    }
  }
}

async function verifyExternalGateContractSurfaces() {
  const protectedAdmin = await readProjectFile('src/pages/admin/AdminDetroitDynamo.jsx');
  const modulePage = await readProjectFile('src/pages/admin/AdminDetroitDynamoModule.jsx');
  const pkg = JSON.parse(await readProjectFile('package.json'));
  const publicFoundation = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx');

  if (!protectedAdmin.includes('CHECKOUT AND SIGNATURE SAFETY CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoExternalGateContractReport')) {
    failures.push('Protected Dynamo admin must surface the payment/waiver gate contract');
  }
  if (!modulePage.includes('EXTERNAL READINESS GATES') || !modulePage.includes('buildDetroitDynamoExternalGateContractReport') || !modulePage.includes('paymentPackageTracks') || !modulePage.includes('waiverTracks')) {
    failures.push('Protected Dynamo module detail pages must surface module-specific payment/waiver gate tracks');
  }
  if (!publicFoundation.includes('Checkout and Signature Safety Contract') || !publicFoundation.includes('buildDetroitDynamoExternalGateContractReport')) {
    failures.push('Public Dynamo admin foundation must surface the payment/waiver gate contract');
  }
  if (!protectedAdmin.includes('PUBLIC CLAIM SAFETY CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoClaimSafetyContractReport')) {
    failures.push('Protected Dynamo admin must surface the public claim-safety contract');
  }
  if (!modulePage.includes('CLAIM SAFETY GUARDS') || !modulePage.includes('buildDetroitDynamoClaimSafetyContractReport')) {
    failures.push('Protected Dynamo module detail pages must surface module-specific claim-safety guards');
  }
  if (!modulePage.includes('SAFEGUARDING PRIVACY GUARDS') || !modulePage.includes('buildDetroitDynamoSafeguardingReport')) {
    failures.push('Protected Dynamo module detail pages must surface module-specific safeguarding/privacy guards');
  }
  if (!publicFoundation.includes('Public Claim Safety Contract') || !publicFoundation.includes('buildDetroitDynamoClaimSafetyContractReport')) {
    failures.push('Public Dynamo admin foundation must surface the public claim-safety contract');
  }
  if (!protectedAdmin.includes('PROMOTION CUTOVER CONTROL') || !protectedAdmin.includes('buildDetroitDynamoPromotionCutoverReport')) {
    failures.push('Protected Dynamo admin must surface the promotion cutover contract');
  }
  if (!publicFoundation.includes('Promotion Cutover Control') || !publicFoundation.includes('buildDetroitDynamoPromotionCutoverReport')) {
    failures.push('Public Dynamo admin foundation must surface the promotion cutover contract');
  }
  if (!protectedAdmin.includes('LAUNCH EVIDENCE CHECKLIST') || !protectedAdmin.includes('buildDetroitDynamoLaunchEvidenceReport')) {
    failures.push('Protected Dynamo admin must surface the launch evidence checklist contract');
  }
  if (!protectedAdmin.includes('LAUNCH EVIDENCE ACTION LEDGER') || !protectedAdmin.includes('submitDetroitDynamoLaunchEvidenceAction')) {
    failures.push('Protected Dynamo admin must surface the preview launch evidence action ledger');
  }
  if (!protectedAdmin.includes('EXTERNAL CONFIRMATION ACTION QUEUE') || !protectedAdmin.includes('submitDetroitDynamoExternalConfirmationAction')) {
    failures.push('Protected Dynamo admin must surface the preview external confirmation action queue');
  }
  if (!protectedAdmin.includes('OWNER LAUNCH REVIEW PACKET') || !protectedAdmin.includes('buildDetroitDynamoOwnerLaunchReviewReport')) {
    failures.push('Protected Dynamo admin must surface the owner launch review packet');
  }
  if (!protectedAdmin.includes('OWNER EVIDENCE INTAKE WORKSHEET') || !protectedAdmin.includes('buildDetroitDynamoOwnerEvidenceIntakeReport')) {
    failures.push('Protected Dynamo admin must surface the owner evidence intake worksheet');
  }
  if (!protectedAdmin.includes('PRODUCTION PREVIEW EVIDENCE MATRIX') || !protectedAdmin.includes('buildDetroitDynamoProductionPreviewEvidenceReport')) {
    failures.push('Protected Dynamo admin must surface the production-preview evidence matrix');
  }
  if (!protectedAdmin.includes('LIVE READINESS BOARD') || !protectedAdmin.includes('buildDetroitDynamoLiveReadinessBoardReport')) {
    failures.push('Protected Dynamo admin must surface the live readiness board');
  }
  if (!protectedAdmin.includes('LAUNCH ARTIFACT INDEX') || !protectedAdmin.includes('buildDetroitDynamoLaunchArtifactIndexReport')) {
    failures.push('Protected Dynamo admin must surface the launch artifact index');
  }
  if (!protectedAdmin.includes('DEPLOYMENT READINESS HANDOFF') || !protectedAdmin.includes('buildDetroitDynamoDeploymentReadinessReport')) {
    failures.push('Protected Dynamo admin must surface the deployment readiness handoff');
  }
  if (!protectedAdmin.includes('OWNER SIGNOFF REGISTER') || !protectedAdmin.includes('buildDetroitDynamoOwnerSignoffRegisterReport')) {
    failures.push('Protected Dynamo admin must surface the owner signoff register');
  }
  if (!protectedAdmin.includes('FINAL ACCEPTANCE MATRIX') || !protectedAdmin.includes('buildDetroitDynamoFinalAcceptanceMatrixReport')) {
    failures.push('Protected Dynamo admin must surface the final acceptance matrix');
  }
  if (!publicFoundation.includes('Launch Evidence Checklist') || !publicFoundation.includes('buildDetroitDynamoLaunchEvidenceReport')) {
    failures.push('Public Dynamo admin foundation must surface the launch evidence checklist contract');
  }
  if (!publicFoundation.includes('Launch Evidence Action Workflow') || !publicFoundation.includes('buildDetroitDynamoLaunchEvidenceActionReport')) {
    failures.push('Public Dynamo admin foundation must surface the preview launch evidence action workflow');
  }
  if (!publicFoundation.includes('External Confirmation Action Queue') || !publicFoundation.includes('buildDetroitDynamoExternalConfirmationActionReport')) {
    failures.push('Public Dynamo admin foundation must surface the preview external confirmation action workflow');
  }
  if (!publicFoundation.includes('Owner Launch Review Packet') || !publicFoundation.includes('buildDetroitDynamoOwnerLaunchReviewReport')) {
    failures.push('Public Dynamo admin foundation must surface the owner launch review packet');
  }
  if (!publicFoundation.includes('Owner Evidence Intake Worksheet') || !publicFoundation.includes('buildDetroitDynamoOwnerEvidenceIntakeReport')) {
    failures.push('Public Dynamo admin foundation must surface the owner evidence intake worksheet');
  }
  if (!publicFoundation.includes('Production Preview Evidence Matrix') || !publicFoundation.includes('buildDetroitDynamoProductionPreviewEvidenceReport')) {
    failures.push('Public Dynamo admin foundation must surface the production-preview evidence matrix');
  }
  if (!publicFoundation.includes('Live Readiness Board') || !publicFoundation.includes('buildDetroitDynamoLiveReadinessBoardReport')) {
    failures.push('Public Dynamo admin foundation must surface the live readiness board');
  }
  if (!publicFoundation.includes('Launch Artifact Index') || !publicFoundation.includes('buildDetroitDynamoLaunchArtifactIndexReport')) {
    failures.push('Public Dynamo admin foundation must surface the launch artifact index');
  }
  if (!publicFoundation.includes('Deployment Readiness Handoff') || !publicFoundation.includes('buildDetroitDynamoDeploymentReadinessReport')) {
    failures.push('Public Dynamo admin foundation must surface the deployment readiness handoff');
  }
  if (!protectedAdmin.includes('VERCEL PREVIEW DEPLOYMENT RUNBOOK') || !protectedAdmin.includes('buildDetroitDynamoVercelPreviewRunbookReport')) {
    failures.push('Protected Dynamo admin must surface the Vercel preview deployment runbook');
  }
  if (!publicFoundation.includes('Vercel Preview Deployment Runbook') || !publicFoundation.includes('buildDetroitDynamoVercelPreviewRunbookReport')) {
    failures.push('Public Dynamo admin foundation must surface the Vercel preview deployment runbook');
  }
  if (!protectedAdmin.includes('SECRET REDACTION CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoSecretRedactionReport')) {
    failures.push('Protected Dynamo admin must surface the secret redaction contract');
  }
  if (!publicFoundation.includes('Secret Redaction Contract') || !publicFoundation.includes('buildDetroitDynamoSecretRedactionReport')) {
    failures.push('Public Dynamo admin foundation must surface the secret redaction contract');
  }
  if (!protectedAdmin.includes('EXTERNAL GATE CLOSURE PACKET') || !protectedAdmin.includes('buildDetroitDynamoExternalGateClosureReport')) {
    failures.push('Protected Dynamo admin must surface the external gate closure packet');
  }
  if (!publicFoundation.includes('External Gate Closure Packet') || !publicFoundation.includes('buildDetroitDynamoExternalGateClosureReport')) {
    failures.push('Public Dynamo admin foundation must surface the external gate closure packet');
  }
  if (!publicFoundation.includes('Owner Signoff Register') || !publicFoundation.includes('buildDetroitDynamoOwnerSignoffRegisterReport')) {
    failures.push('Public Dynamo admin foundation must surface the owner signoff register');
  }
  if (!publicFoundation.includes('Final Acceptance Matrix') || !publicFoundation.includes('buildDetroitDynamoFinalAcceptanceMatrixReport')) {
    failures.push('Public Dynamo admin foundation must surface the final acceptance matrix');
  }
  if (!protectedAdmin.includes('SAFEGUARDING AND DATA PRIVACY CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoSafeguardingReport')) {
    failures.push('Protected Dynamo admin must surface the safeguarding and data privacy contract');
  }
  if (!publicFoundation.includes('Safeguarding and Data Privacy Contract') || !publicFoundation.includes('buildDetroitDynamoSafeguardingReport')) {
    failures.push('Public Dynamo admin foundation must surface the safeguarding and data privacy contract');
  }
  if (!protectedAdmin.includes('LIVE MODULE READ CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoAdminModuleReadContractReport')) {
    failures.push('Protected Dynamo admin must surface the authenticated admin module read contract');
  }
  if (!publicFoundation.includes('Admin Module Read Contract') || !publicFoundation.includes('buildDetroitDynamoAdminModuleReadContractReport')) {
    failures.push('Public Dynamo admin foundation must surface the authenticated admin module read contract');
  }
  if (!protectedAdmin.includes('LIVE MODULE WRITE CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoAdminModuleWriteContractReport')) {
    failures.push('Protected Dynamo admin must surface the authenticated admin module write contract');
  }
  if (!publicFoundation.includes('Admin Module Write Contract') || !publicFoundation.includes('buildDetroitDynamoAdminModuleWriteContractReport')) {
    failures.push('Public Dynamo admin foundation must surface the authenticated admin module write contract');
  }
  if (!protectedAdmin.includes('LIVE RECORD WORKSPACE CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoAdminRecordWorkspaceReport')) {
    failures.push('Protected Dynamo admin must surface the admin record workspace contract');
  }
  if (!publicFoundation.includes('Admin Record Workspace Contract') || !publicFoundation.includes('buildDetroitDynamoAdminRecordWorkspaceReport')) {
    failures.push('Public Dynamo admin foundation must surface the admin record workspace contract');
  }
  if (!protectedAdmin.includes('LIVE ROLE GRANT CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoAdminRoleGrantContractReport')) {
    failures.push('Protected Dynamo admin must surface the authenticated admin role grant contract');
  }
  if (!publicFoundation.includes('Admin Role Grant Contract') || !publicFoundation.includes('buildDetroitDynamoAdminRoleGrantContractReport')) {
    failures.push('Public Dynamo admin foundation must surface the authenticated admin role grant contract');
  }
  if (!pkg.scripts?.['verify:dynamo-launch-evidence']) {
    failures.push('package.json is missing verify:dynamo-launch-evidence.');
  }
  if (!pkg.scripts?.['verify:dynamo-launch-evidence-actions']) {
    failures.push('package.json is missing verify:dynamo-launch-evidence-actions.');
  }
  if (!pkg.scripts?.['verify:dynamo-production-preview-evidence']) {
    failures.push('package.json is missing verify:dynamo-production-preview-evidence.');
  }
  if (!pkg.scripts?.['verify:dynamo-live-readiness-board']) {
    failures.push('package.json is missing verify:dynamo-live-readiness-board.');
  }
  if (!pkg.scripts?.['verify:dynamo-launch-artifact-index']) {
    failures.push('package.json is missing verify:dynamo-launch-artifact-index.');
  }
  if (!pkg.scripts?.['verify:dynamo-owner-signoff-register']) {
    failures.push('package.json is missing verify:dynamo-owner-signoff-register.');
  }
  if (!pkg.scripts?.['verify:dynamo-final-acceptance']) {
    failures.push('package.json is missing verify:dynamo-final-acceptance.');
  }
  if (!pkg.scripts?.['verify:dynamo-vercel-preview']) {
    failures.push('package.json is missing verify:dynamo-vercel-preview.');
  }
  if (!pkg.scripts?.['verify:dynamo-secret-redaction']) {
    failures.push('package.json is missing verify:dynamo-secret-redaction.');
  }
  if (!pkg.scripts?.['verify:dynamo-external-gate-closure']) {
    failures.push('package.json is missing verify:dynamo-external-gate-closure.');
  }
}

async function verifyDetroitDynamoMetadataScaffold() {
  const metaHook = await readProjectFile('src/components/detroit-dynamo/useDetroitDynamoMeta.js');
  const requiredMetaNeedles = [
    'DYNAMO_SOCIAL_IMAGE',
    'og:image',
    'og:image:alt',
    'og:url',
    'twitter:card',
    'summary_large_image',
    'twitter:image',
    'canonical',
  ];

  for (const needle of requiredMetaNeedles) {
    if (!metaHook.includes(needle)) {
      failures.push(`Detroit Dynamo metadata hook missing ${needle}`);
    }
  }
}

async function verifySourceLinks() {
  const texts = await Promise.all(
    sourceFiles.map(async (file) => ({ file, text: await readProjectFile(file) })),
  );
  const anchors = new Set(texts.flatMap(({ file, text }) => collectAnchorIds(file, text).map((anchor) => anchor.id)));
  const links = texts.flatMap(({ file, text }) => collectLinks(file, text));

  for (const { file, value } of links) {
    const route = withoutHash(value);
    const hash = hashPart(value);
    if (!allowedRoutes.has(route)) {
      failures.push(`Unknown internal route in ${file}: ${value}`);
      continue;
    }
    if (hash && route.startsWith('/detroit-dynamo') && !anchors.has(hash)) {
      failures.push(`Missing anchor target for ${value} referenced in ${file}`);
    }
  }
}

async function verifyHttpTargets() {
  for (const target of [...smokeRoutes, ...requiredAssets]) {
    let response;
    try {
      response = await fetch(new URL(target, baseUrl), { redirect: 'manual' });
    } catch (error) {
      failures.push(`Could not reach ${baseUrl}${target}: ${error.message}`);
      continue;
    }

    if (response.status < 200 || response.status >= 400) {
      failures.push(`Unexpected HTTP ${response.status} for ${target}`);
    }
  }
}

async function verifyFunctionScaffold() {
  const appwriteConfig = await readProjectFile('appwrite.json');
  const functionSource = await readProjectFile('functions/detroitDynamoLeadIntake/src/main.js');
  const pipelineActionSource = await readProjectFile('functions/detroitDynamoLeadPipelineAction/src/main.js');
  const adminModuleReadSource = await readProjectFile('functions/detroitDynamoAdminModuleRead/src/main.js');
  const adminRoleGrantSource = await readProjectFile('functions/detroitDynamoAdminRoleGrantAction/src/main.js');
  const adminModuleWriteSource = await readProjectFile('functions/detroitDynamoAdminModuleWriteAction/src/main.js');
  for (const needle of appwriteFunctionNeedles) {
    if (!appwriteConfig.includes(needle)) {
      failures.push(`Missing Appwrite function config: ${needle}`);
    }
  }

  const functionSourceNeedles = [
    'dd_contact_leads',
    'dd_tryout_registrations',
    'dd_sponsors',
    'dd_players',
    'dd_parent_guardians',
    'dd_bookings',
    'pipeline_status',
    'pipeline_owner_role',
    'pipeline_due_at',
    'initialPipelineFields',
    'compactDocument',
    'APPWRITE_DATABASE_ID',
    'source_route must be a Detroit Dynamo route',
  ];
  for (const needle of functionSourceNeedles) {
    if (!functionSource.includes(needle)) {
      failures.push(`Missing Detroit Dynamo intake function source guard: ${needle}`);
    }
  }

  const pipelineActionNeedles = [
    'dd_contact_leads',
    'dd_bookings',
    'dd_tryout_registrations',
    'dd_sponsors',
    'dd_admin_audit_events',
    'pipeline_status',
    'pipeline_owner_role',
    'pipeline_due_at',
    'pipeline_event_count',
    'currentStage.nextStatuses.includes',
    'databases.updateDocument',
    'databases.createDocument',
    'audit_event_id',
    'Detroit Dynamo pipeline action requires an authenticated Appwrite user',
  ];
  for (const needle of pipelineActionNeedles) {
    if (!pipelineActionSource.includes(needle)) {
      failures.push(`Missing Detroit Dynamo pipeline action source guard: ${needle}`);
    }
  }

  const adminModuleReadNeedles = [
    'moduleRegistry',
    'dd_players',
    'dd_contact_leads',
    'dd_payments',
    'dd_admin_role_assignments',
    'assertRoleAssignment',
    'Query.limit',
    'databases.listDocuments',
    'actor_role',
    'Actor role is not assigned to this authenticated Appwrite user',
    'collection_id must belong to the requested Detroit Dynamo admin module',
    'Detroit Dynamo admin module read requires an authenticated Appwrite user',
  ];
  for (const needle of adminModuleReadNeedles) {
    if (!adminModuleReadSource.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin module read source guard: ${needle}`);
    }
  }

  const adminRoleGrantNeedles = [
    'dd_admin_role_assignments',
    'dd_admin_audit_events',
    'DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID',
    'countActiveMasterAdmins',
    'hasActiveMasterAdmin',
    'canBootstrapMasterAdmin',
    'findExistingActiveAssignment',
    'databases.createDocument',
    'databases.updateDocument',
    'Master Admin cannot remove their own active role grant with this action',
    'audit_event_id',
    'Detroit Dynamo admin role grant requires an authenticated Appwrite user',
  ];
  for (const needle of adminRoleGrantNeedles) {
    if (!adminRoleGrantSource.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin role grant source guard: ${needle}`);
    }
  }

  const adminModuleWriteNeedles = [
    'moduleRegistry',
    'dd_players',
    'dd_teams',
    'dd_news_posts',
    'dd_match_fixtures',
    'dd_admin_role_assignments',
    'dd_admin_audit_events',
    'assertRoleAssignment',
    'external_gate',
    'databases.createDocument',
    'databases.updateDocument',
    'admin_module_write_action',
    'audit_event_id',
    'Detroit Dynamo admin module write requires an authenticated Appwrite user',
  ];
  for (const needle of adminModuleWriteNeedles) {
    if (!adminModuleWriteSource.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin module write source guard: ${needle}`);
    }
  }

  for (const file of requiredFunctionFiles) {
    try {
      await fs.access(path.join(root, file));
    } catch {
      failures.push(`Missing function scaffold file: ${file}`);
    }
  }
}

async function verifyLeadIntakeContract() {
  const issues = auditDetroitDynamoLeadIntakeContract();
  for (const issue of issues) {
    failures.push(`Detroit Dynamo lead intake contract issue: ${issue}`);
  }

  const protectedAdmin = await readProjectFile('src/pages/admin/AdminDetroitDynamo.jsx');
  const publicFoundation = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx');
  const successFixtures = buildDetroitDynamoLeadIntakeFixtures();
  const rejectionFixtures = buildDetroitDynamoLeadIntakeRejectionFixtures();
  const fixtureTypes = new Set(successFixtures.map((fixture) => fixture.leadType));

  for (const variant of requiredLeadTypes) {
    if (!detroitDynamoLeadIntakeVariants.includes(variant)) {
      failures.push(`Lead intake contract is missing supported variant: ${variant}`);
    }
    if (!fixtureTypes.has(variant)) {
      failures.push(`Lead intake contract is missing a success fixture for ${variant}`);
    }
  }

  if (successFixtures.length < requiredLeadTypes.length) {
    failures.push('Lead intake contract should include at least one success fixture per public form variant');
  }
  if (rejectionFixtures.length < 4) {
    failures.push('Lead intake contract should include invalid route, invalid type, tryout, and sponsor rejection fixtures');
  }
  for (const fixture of successFixtures) {
    if (fixture.expectedResponse.httpStatus !== 200 || !fixture.expectedCreatedKeys.ContactLead) {
      failures.push(`Lead intake success fixture has incomplete expectations: ${fixture.id}`);
    }
  }

  if (!protectedAdmin.includes('PUBLIC FORM HANDOFF CONTRACT') || !protectedAdmin.includes('buildDetroitDynamoLeadIntakeContractReport')) {
    failures.push('Protected Dynamo admin must surface the public lead-intake handoff contract');
  }
  if (!publicFoundation.includes('Form Submission Handoff Contract') || !publicFoundation.includes('buildDetroitDynamoLeadIntakeContractReport')) {
    failures.push('Public Dynamo admin foundation must surface the public lead-intake handoff contract');
  }
}

function verifyAdminModuleReadContract() {
  const issues = auditDetroitDynamoAdminModuleReadContract();
  for (const issue of issues) {
    failures.push(`Detroit Dynamo admin module read contract issue: ${issue}`);
  }

  const successFixtures = buildDetroitDynamoAdminModuleReadFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminModuleReadRejectionFixtures();
  const fixtureModules = new Set(successFixtures.map((fixture) => fixture.moduleSlug));

  for (const moduleSlug of ['players', 'training-bookings', 'sponsors', 'teams', 'schedules-results', 'payments-packages']) {
    if (!fixtureModules.has(moduleSlug)) {
      failures.push(`Admin module read contract is missing success fixture for ${moduleSlug}`);
    }
  }
  if (successFixtures.length < 6) {
    failures.push('Admin module read contract should include at least 6 success fixtures');
  }
  if (rejectionFixtures.length < 4) {
    failures.push('Admin module read contract should include auth, invalid module, role, role-assignment, and collection rejection fixtures');
  }
  for (const fixture of successFixtures) {
    if (fixture.expectedResponse.httpStatus !== 200 || fixture.expectedResponse.function_id !== 'detroitDynamoAdminModuleRead' || !fixture.expectedResponse.role_assignment_id) {
      failures.push(`Admin module read success fixture has incomplete expectations: ${fixture.id}`);
    }
  }
}

async function verifyAdminModuleReadControls() {
  const helper = await readProjectFile('src/lib/detroitDynamoAdminModuleReads.js');
  const workspaceHelper = await readProjectFile('src/lib/detroitDynamoAdminRecordWorkspace.js');
  const workspaceContract = await readProjectFile('src/lib/detroitDynamoAdminRecordWorkspaceContract.js');
  const modulePage = await readProjectFile('src/pages/admin/AdminDetroitDynamoModule.jsx');
  const pkg = JSON.parse(await readProjectFile('package.json'));
  const requiredHelperNeedles = [
    'DETROIT_DYNAMO_MODULE_READ_BACKEND_STORAGE_KEY',
    'DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY',
    'detroitDynamoAdminModuleReadFunctionId',
    'validateDetroitDynamoAdminModuleReadPayload',
    'submitDetroitDynamoAdminModuleReadAction',
    'rpc.invoke',
    'preview_module_read_captured',
    'preview_module_read_after_action_error',
    'appwrite_module_read_submitted',
    'detroitDynamoAdminModuleReadDefaultLimit',
  ];

  for (const needle of requiredHelperNeedles) {
    if (!helper.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin module read helper support: ${needle}`);
    }
  }

  const requiredWorkspaceHelperNeedles = [
    'flattenDetroitDynamoModuleRecordCollections',
    'buildDetroitDynamoModuleRecordCsv',
    'buildDetroitDynamoRecordFieldRows',
    'buildDetroitDynamoCollectionDisplayProfile',
    'buildDetroitDynamoPreparedRecordPayload',
    'missingRequiredFields',
    'protected-module-record-workspace',
  ];

  for (const needle of requiredWorkspaceHelperNeedles) {
    if (!workspaceHelper.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin record workspace helper support: ${needle}`);
    }
  }
  for (const needle of [
    'buildDetroitDynamoAdminRecordWorkspaceReport',
    'auditDetroitDynamoAdminRecordWorkspaceReport',
    'buildDetroitDynamoAdminRecordWorkspaceMarkdown',
    'player-missing-dob',
  ]) {
    if (!workspaceContract.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin record workspace contract support: ${needle}`);
    }
  }
  if (!pkg.scripts?.['verify:dynamo-admin-record-workspace']) {
    failures.push('package.json is missing verify:dynamo-admin-record-workspace.');
  }

  const requiredModulePageNeedles = [
    'detroitDynamoAdminRecordWorkspace',
    'MODULE READ ACTION CONSOLE',
    'submitDetroitDynamoAdminModuleReadAction',
    'setDetroitDynamoModuleReadBackendMode',
    'getDetroitDynamoPreviewModuleReadActions',
    'moduleReadSubmitting',
    'moduleReadMessage',
    'moduleReadError',
    'READ RESULT PREVIEW',
    'MODULE READ LEDGER',
    'Read Module Records',
    'MODULE RECORD WORKSPACE',
    'downloadModuleRecordsCsv',
    'moduleFilteredRecords',
    'modulePaginatedRecords',
    'moduleRecordPageCount',
    'RECORD DETAIL PREVIEW',
    'Field Display Profile',
    'selectedModuleFieldRows',
    'prepareModuleRecordWriteAction',
    'Missing required',
    'Prepare Update',
    'Prepare Archive',
    'Export CSV',
  ];

  for (const needle of requiredModulePageNeedles) {
    if (!modulePage.includes(needle)) {
      failures.push(`Protected Dynamo module read console is missing: ${needle}`);
    }
  }
}

function verifyAdminRoleGrantContract() {
  const issues = auditDetroitDynamoAdminRoleGrantContract();
  for (const issue of issues) {
    failures.push(`Detroit Dynamo admin role grant contract issue: ${issue}`);
  }

  const successFixtures = buildDetroitDynamoAdminRoleGrantFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminRoleGrantRejectionFixtures();
  const coveredActions = new Set(successFixtures.map((fixture) => fixture.action));

  for (const action of ['grant_role', 'suspend_role', 'revoke_role', 'expire_role']) {
    if (!coveredActions.has(action)) {
      failures.push(`Admin role grant contract is missing success fixture for ${action}`);
    }
  }
  if (!successFixtures.some((fixture) => fixture.id === 'bootstrap-master-admin-grant' && fixture.role === 'Master Admin')) {
    failures.push('Admin role grant contract must include a first Master Admin bootstrap fixture');
  }
  if (successFixtures.length < 6) {
    failures.push('Admin role grant contract should include at least 6 success fixtures');
  }
  if (rejectionFixtures.length < 6) {
    failures.push('Admin role grant contract should include auth, master admin, bootstrap, invalid role, self-lockout, and missing assignment rejection fixtures');
  }
  for (const fixture of successFixtures) {
    if (fixture.expectedResponse.httpStatus !== 200 || fixture.expectedResponse.function_id !== 'detroitDynamoAdminRoleGrantAction' || !fixture.expectedResponse.audit_event_id) {
      failures.push(`Admin role grant success fixture has incomplete expectations: ${fixture.id}`);
    }
    if (fixture.expectedAuditEvent?.collectionId !== 'dd_admin_audit_events' || fixture.expectedAuditEvent?.target_model !== 'AdminRoleAssignment') {
      failures.push(`Admin role grant fixture must append AdminRoleAssignment audit event: ${fixture.id}`);
    }
  }
}

function verifyAdminModuleWriteContract() {
  const issues = auditDetroitDynamoAdminModuleWriteContract();
  for (const issue of issues) {
    failures.push(`Detroit Dynamo admin module write contract issue: ${issue}`);
  }

  const successFixtures = buildDetroitDynamoAdminModuleWriteFixtures();
  const rejectionFixtures = buildDetroitDynamoAdminModuleWriteRejectionFixtures();
  const fixtureModules = new Set(successFixtures.map((fixture) => fixture.moduleSlug));

  for (const moduleSlug of ['teams', 'players', 'news-posts', 'sponsors', 'schedules-results', 'website-content-sections']) {
    if (!fixtureModules.has(moduleSlug)) {
      failures.push(`Admin module write contract is missing success fixture for ${moduleSlug}`);
    }
  }
  if (successFixtures.length < 6) {
    failures.push('Admin module write contract should include at least 6 success fixtures');
  }
  if (rejectionFixtures.length < 7) {
    failures.push('Admin module write contract should include auth, role-grant, role-access, external-gate, collection, record, and action rejection fixtures');
  }
  for (const fixture of successFixtures) {
    if (fixture.expectedResponse.httpStatus !== 200 || fixture.expectedResponse.function_id !== 'detroitDynamoAdminModuleWriteAction' || !fixture.expectedResponse.audit_event_id) {
      failures.push(`Admin module write success fixture has incomplete expectations: ${fixture.id}`);
    }
    if (fixture.expectedAuditEvent?.collectionId !== 'dd_admin_audit_events' || fixture.expectedAuditEvent?.action !== 'admin_module_write_action') {
      failures.push(`Admin module write fixture must append admin_module_write_action audit event: ${fixture.id}`);
    }
  }
}

async function verifyAdminRoleGrantControls() {
  const helper = await readProjectFile('src/lib/detroitDynamoAdminRoleGrants.js');
  const protectedAdmin = await readProjectFile('src/pages/admin/AdminDetroitDynamo.jsx');
  const requiredHelperNeedles = [
    'DETROIT_DYNAMO_ROLE_GRANT_BACKEND_STORAGE_KEY',
    'DETROIT_DYNAMO_ROLE_GRANT_STORAGE_KEY',
    'detroitDynamoAdminRoleGrantFunctionId',
    'validateDetroitDynamoAdminRoleGrantPayload',
    'submitDetroitDynamoAdminRoleGrantAction',
    'rpc.invoke',
    'preview_role_grant_captured',
    'preview_role_grant_after_action_error',
    'appwrite_role_grant_submitted',
  ];

  for (const needle of requiredHelperNeedles) {
    if (!helper.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin role grant helper support: ${needle}`);
    }
  }

  const requiredAdminNeedles = [
    'ROLE GRANT ACTION CONSOLE',
    'submitDetroitDynamoAdminRoleGrantAction',
    'setDetroitDynamoRoleGrantBackendMode',
    'getDetroitDynamoPreviewRoleGrantActions',
    'roleGrantSubmitting',
    'roleGrantMessage',
    'roleGrantError',
    'Recent Preview Role Actions',
    'Submit Role Action',
  ];

  for (const needle of requiredAdminNeedles) {
    if (!protectedAdmin.includes(needle)) {
      failures.push(`Protected Dynamo admin role grant console is missing: ${needle}`);
    }
  }
}

async function verifyAdminModuleWriteControls() {
  const helper = await readProjectFile('src/lib/detroitDynamoAdminModuleWrites.js');
  const modulePage = await readProjectFile('src/pages/admin/AdminDetroitDynamoModule.jsx');
  const requiredHelperNeedles = [
    'DETROIT_DYNAMO_MODULE_WRITE_BACKEND_STORAGE_KEY',
    'DETROIT_DYNAMO_MODULE_WRITE_STORAGE_KEY',
    'detroitDynamoAdminModuleWriteFunctionId',
    'validateDetroitDynamoAdminModuleWritePayload',
    'submitDetroitDynamoAdminModuleWriteAction',
    'rpc.invoke',
    'preview_module_write_captured',
    'preview_module_write_after_action_error',
    'appwrite_module_write_submitted',
    'admin_module_write_action',
    'DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY',
  ];

  for (const needle of requiredHelperNeedles) {
    if (!helper.includes(needle)) {
      failures.push(`Missing Detroit Dynamo admin module write helper support: ${needle}`);
    }
  }

  const requiredModulePageNeedles = [
    'MODULE WRITE ACTION CONSOLE',
    'submitDetroitDynamoAdminModuleWriteAction',
    'setDetroitDynamoModuleWriteBackendMode',
    'getDetroitDynamoPreviewModuleWriteActions',
    'moduleWriteSubmitting',
    'moduleWriteMessage',
    'moduleWriteError',
    'MODULE WRITE LEDGER',
    'Submit Write Action',
  ];

  for (const needle of requiredModulePageNeedles) {
    if (!modulePage.includes(needle)) {
      failures.push(`Protected Dynamo module write console is missing: ${needle}`);
    }
  }
}

function verifyPipelineActionContract() {
  const issues = auditDetroitDynamoPipelineActionContract();
  for (const issue of issues) {
    failures.push(`Detroit Dynamo pipeline action contract issue: ${issue}`);
  }

  const successFixtures = buildDetroitDynamoPipelineActionFixtures();
  const rejectionFixtures = buildDetroitDynamoPipelineActionRejectionFixtures();
  const fixtureModels = new Set(successFixtures.map((fixture) => fixture.model));

  for (const model of pipelineBackedModels) {
    if (!detroitDynamoPipelineActionModels.includes(model)) {
      failures.push(`Pipeline action contract is missing supported model: ${model}`);
    }
    if (!fixtureModels.has(model)) {
      failures.push(`Pipeline action contract is missing a success fixture for ${model}`);
    }
  }

  if (successFixtures.length < pipelineBackedModels.length) {
    failures.push('Pipeline action contract should include at least one success fixture per pipeline-backed model');
  }
  if (rejectionFixtures.length < 3) {
    failures.push('Pipeline action contract should include unauthenticated, invalid transition, and unsupported-model rejection fixtures');
  }
  for (const fixture of successFixtures) {
    if (fixture.expectedResponse.httpStatus !== 200 || fixture.expectedUpdatedFields.pipeline_status !== fixture.nextStatus) {
      failures.push(`Pipeline action success fixture has incomplete expectations: ${fixture.id}`);
    }
  }
}

function verifyAppwritePipelineSchema() {
  const statusValues = new Set(detroitDynamoLeadPipelineStages.map((stage) => stage.status));

  for (const model of pipelineBackedModels) {
    const collection = detroitDynamoAppwriteCollections.find((item) => item.model === model);
    if (!collection) {
      failures.push(`Missing Appwrite collection for pipeline-backed model: ${model}`);
      continue;
    }

    const attributes = new Map(collection.attributes.map((attribute) => [attribute.key, attribute]));
    const indexes = new Set(collection.indexes.map((index) => index.key));

    for (const key of pipelineAttributeKeys) {
      if (!attributes.has(key)) {
        failures.push(`${model} Appwrite schema is missing pipeline attribute: ${key}`);
      }
    }

    const pipelineStatus = attributes.get('pipeline_status');
    if (pipelineStatus?.type !== 'enum' || pipelineStatus.default !== 'new') {
      failures.push(`${model}.pipeline_status must be an enum that defaults to new`);
    } else {
      for (const status of statusValues) {
        if (!pipelineStatus.elements.includes(status)) {
          failures.push(`${model}.pipeline_status is missing allowed status: ${status}`);
        }
      }
    }

    for (const key of pipelineIndexKeys) {
      if (!indexes.has(key)) {
        failures.push(`${model} Appwrite schema is missing pipeline index: ${key}`);
      }
    }
  }
}

async function verifyLocalPipelineActions() {
  const leadHelper = await readProjectFile('src/lib/detroitDynamoLeads.js');
  const adminPage = await readProjectFile('src/pages/admin/AdminDetroitDynamo.jsx');
  const modulePage = await readProjectFile('src/pages/admin/AdminDetroitDynamoModule.jsx');
  const clubPages = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx');
  const pipeline = await readProjectFile('src/lib/detroitDynamoLeadPipeline.js');
  const requiredNeedles = [
    'updateDetroitDynamoPreviewLeadPipelineStatus',
    'getDetroitDynamoPreviewAuditEvents',
    'DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY',
    'canDetroitDynamoLeadPipelineTransition',
    'pipeline_status',
    'pipeline_events',
    'audit_event_id',
    'pipeline_status_transition',
  ];

  for (const needle of requiredNeedles) {
    if (!leadHelper.includes(needle) && !pipeline.includes(needle)) {
      failures.push(`Missing local lead pipeline action support: ${needle}`);
    }
  }
  if (!adminPage.includes('transitionLead') || !adminPage.includes('Move ${card.title} to ${status}')) {
    failures.push('Protected Dynamo admin must expose local lead transition controls');
  }
  if (!adminPage.includes('LOCAL AUDIT EVENT LEDGER') || !adminPage.includes('downloadPreviewAuditEvents')) {
    failures.push('Protected Dynamo admin must expose local audit event ledger and export');
  }
  if (!modulePage.includes('transitionLead') || !modulePage.includes('Move ${card.title} to ${status}')) {
    failures.push('Protected Dynamo module page must expose module lead transition controls');
  }
  if (!modulePage.includes('MODULE AUDIT EVENT LEDGER') || !modulePage.includes('getDetroitDynamoPreviewAuditEvents')) {
    failures.push('Protected Dynamo module page must expose module-filtered local audit events');
  }
  if (!adminPage.includes('LIVE STATUS MUTATION CONTRACT') || !adminPage.includes('buildDetroitDynamoPipelineActionContractReport')) {
    failures.push('Protected Dynamo admin must surface the authenticated pipeline-action handoff contract');
  }
  if (!clubPages.includes('Pipeline Status Mutation Contract') || !clubPages.includes('buildDetroitDynamoPipelineActionContractReport')) {
    failures.push('Public Dynamo admin foundation must surface the authenticated pipeline-action handoff contract');
  }
}

async function verifyPromotedBrandShell() {
  const indexHtml = await readProjectFile('index.html');
  if (!indexHtml.includes('<title>Detroit Dynamo</title>')) {
    failures.push('Root index.html title must be Detroit Dynamo after promotion');
  }
  if (!indexHtml.includes('/detroit-dynamo/favicon.svg')) {
    failures.push('Root index.html favicon must use the Detroit Dynamo favicon after promotion');
  }

  const manifest = JSON.parse(await readProjectFile('public/manifest.json'));
  if (manifest.name !== 'Detroit Dynamo' || manifest.short_name !== 'Dynamo') {
    failures.push('public/manifest.json must be branded as Detroit Dynamo after promotion');
  }
  const manifestIconSources = (manifest.icons || []).map((icon) => icon.src);
  if (!manifestIconSources.includes('/detroit-dynamo/logo-primary.png')) {
    failures.push('public/manifest.json must use the Detroit Dynamo logo after promotion');
  }

  const sharedShellFiles = [
    'src/components/layout/Navbar.jsx',
    'src/components/layout/Footer.jsx',
    'src/lib/brand.js',
  ];
  const sharedShellTexts = await Promise.all(
    sharedShellFiles.map(async (file) => ({ file, text: await readProjectFile(file) })),
  );

  for (const { file, text } of sharedShellTexts) {
    if (!text.includes('Detroit Dynamo') && !text.includes('DETROIT DYNAMO') && file !== 'src/lib/brand.js') {
      failures.push(`${file} must include Detroit Dynamo promoted-brand copy`);
    }
  }

  const brandFile = sharedShellTexts.find((item) => item.file === 'src/lib/brand.js')?.text || '';
  if (!brandFile.includes("'DETROIT DYNAMO'")) {
    failures.push('src/lib/brand.js must return the Detroit Dynamo brand label globally');
  }

  const navbar = sharedShellTexts.find((item) => item.file === 'src/components/layout/Navbar.jsx')?.text || '';
  if (!navbar.includes("path: '/detroit-dynamo'")) {
    failures.push('Navbar must link into Detroit Dynamo routes');
  }

  const styles = await readProjectFile('src/index.css');
  if (!styles.includes('--color-brand-blue: #0078FF;')) {
    failures.push('Global theme tokens must use the Detroit Dynamo electric blue accent after promotion');
  }
  if (!styles.includes('.dynamo-site')) {
    failures.push('Detroit Dynamo route styles must remain available under .dynamo-site');
  }
}

async function verifyNoPreviewBrandLeakage() {
  const oldBrandAssetPatterns = [
    /\/logo\.png/,
    /\/logo-shield\.png/,
    /logo-shield/i,
  ];
  const reviewedExceptions = {
    'src/components/layout/Navbar.jsx': ['DETROIT DYNAMO', "path: '/detroit-dynamo'"],
    'src/components/layout/Footer.jsx': ['DETROIT DYNAMO', '/detroit-dynamo'],
    'src/pages/admin/AdminPanel.jsx': ['Detroit Dynamo Ops', '/admin/detroit-dynamo'],
  };
  const scannedFiles = [
    'index.html',
    ...(await listProjectFiles('src')),
    ...(await listProjectFiles('public')),
  ].filter((file) => /\.(jsx?|json|html|svg)$/.test(file));

  for (const file of scannedFiles) {
    let text = await readProjectFile(file);
    for (const allowedSnippet of reviewedExceptions[file] || []) {
      text = text.replaceAll(allowedSnippet, '');
    }

    if (/LC Training|LCTrainings|Les Ch[eè]vres|Les Chevres/i.test(text)) {
      failures.push(`Unexpected old LC Training/Les Chevres brand reference after promotion: ${file}`);
    }
    if (oldBrandAssetPatterns.some((pattern) => pattern.test(text))) {
      failures.push(`Unexpected old LC Training logo asset reference after promotion: ${file}`);
    }
  }
}

await verifyAppRoutes();
verifyRouteManifest();
verifyLaunchReadiness();
await verifyExternalGateContractSurfaces();
await verifyDetroitDynamoMetadataScaffold();
await verifyPromotedBrandShell();
await verifyNoPreviewBrandLeakage();
await verifySourceLinks();
await verifyFunctionScaffold();
await verifyLeadIntakeContract();
verifyAdminModuleReadContract();
await verifyAdminModuleReadControls();
verifyAdminRoleGrantContract();
verifyAdminModuleWriteContract();
await verifyAdminRoleGrantControls();
await verifyAdminModuleWriteControls();
verifyPipelineActionContract();
verifyAppwritePipelineSchema();
await verifyLocalPipelineActions();
await verifyHttpTargets();

if (failures.length) {
  console.error('Detroit Dynamo preview verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Detroit Dynamo preview verification passed against ${baseUrl}`);
console.log(`Checked ${smokeRoutes.length} routes, ${requiredAssets.length} assets, ${sourceFiles.length} source files, ${detroitDynamoLaunchReadiness.length} readiness categories, ${detroitDynamoPromotionGates.length} promotion gates, ${detroitDynamoBackendActivationSteps.length} backend activation steps, ${detroitDynamoExternalConfirmationRegister.length} external confirmation registers, ${buildDetroitDynamoExternalGateContractReport().paymentPackageTracks.length} payment/package gate tracks, ${buildDetroitDynamoExternalGateContractReport().waiverTracks.length} waiver gate tracks, ${buildDetroitDynamoClaimSafetyContractReport().claimSafetyTracks.length} claim-safety tracks, ${buildDetroitDynamoPromotionCutoverReport().cutoverTracks.length} promotion cutover tracks, ${buildDetroitDynamoLaunchEvidenceReport().checklistItems.length} launch evidence checklist items, ${buildDetroitDynamoLaunchEvidenceActionReport().actions.length} launch evidence action fixtures, ${buildDetroitDynamoExternalConfirmationActionReport().actions.length} external confirmation action fixtures, ${buildDetroitDynamoOwnerLaunchReviewReport().sections.length} owner launch review sections, ${buildDetroitDynamoOwnerEvidenceIntakeReport().intakeRows.length} owner evidence intake rows, ${buildDetroitDynamoProductionPreviewEvidenceReport().tracks.length} production-preview evidence tracks, ${buildDetroitDynamoLiveReadinessBoardReport().rows.length} live readiness board rows, ${buildDetroitDynamoLaunchArtifactIndexReport().items.length} launch artifact index items, ${buildDetroitDynamoDeploymentReadinessReport().tracks.length} deployment readiness tracks, ${buildDetroitDynamoVercelPreviewRunbookReport().steps.length} Vercel preview runbook steps, ${buildDetroitDynamoSecretRedactionReport().rules.length} secret redaction rules, ${buildDetroitDynamoExternalGateClosureReport().rows.length} external gate closure rows, ${buildDetroitDynamoOwnerHandoffPacketReport().sections.length} owner handoff packet sections, ${buildDetroitDynamoOwnerSignoffRegisterReport().signoffRows.length} owner signoff rows, ${buildDetroitDynamoFinalAcceptanceMatrixReport().rows.length} final acceptance rows, ${buildDetroitDynamoSafeguardingReport().safeguardingTracks.length} safeguarding tracks, ${detroitDynamoRolePermissionMatrix.length} role permission rows, ${detroitDynamoAdminModuleRegistry.length} admin module registry entries, ${detroitDynamoModuleActionGuards.length} action guard groups, ${Object.keys(detroitDynamoLeadRecordDraftMap).length} record draft maps, ${detroitDynamoLeadPipelineStages.length} lead pipeline stages, ${buildDetroitDynamoLeadIntakeFixtures().length} lead intake success fixtures, ${buildDetroitDynamoPipelineActionFixtures().length} pipeline action success fixtures, ${buildDetroitDynamoAdminModuleReadFixtures().length} admin module read success fixtures, ${buildDetroitDynamoAdminRoleGrantFixtures().length} admin role grant success fixtures, ${buildDetroitDynamoAdminModuleWriteFixtures().length} admin module write success fixtures.`);
