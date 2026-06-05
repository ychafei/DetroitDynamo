import fs from 'node:fs/promises';
import path from 'node:path';
import {
  detroitDynamoAliasRoutes,
  detroitDynamoRouteManifest,
} from '../src/lib/detroitDynamoRouteManifest.js';
import {
  detroitDynamoAdminModuleDetailRoutes,
  detroitDynamoAdminModuleRegistry,
  detroitDynamoLeadPipelineByType,
  detroitDynamoLeadPipelineStages,
} from '../src/lib/detroitDynamoDataModel.js';
import { detroitDynamoModuleActionGuards } from '../src/lib/detroitDynamoAdminAccess.js';
import {
  auditDetroitDynamoLeadIntakeContract,
  buildDetroitDynamoLeadIntakeFixtures,
} from '../src/lib/detroitDynamoLeadIntakeContract.js';
import { auditDetroitDynamoExternalGateContracts } from '../src/lib/detroitDynamoExternalGateContracts.js';
import { auditDetroitDynamoClaimSafetyContract } from '../src/lib/detroitDynamoClaimSafetyContract.js';
import { auditDetroitDynamoPromotionCutoverContract } from '../src/lib/detroitDynamoPromotionCutoverContract.js';
import { auditDetroitDynamoLaunchEvidenceReport } from '../src/lib/detroitDynamoLaunchEvidenceContract.js';
import { auditDetroitDynamoLaunchEvidenceActionReport } from '../src/lib/detroitDynamoLaunchEvidenceActions.js';
import { auditDetroitDynamoExternalConfirmationActionReport } from '../src/lib/detroitDynamoExternalConfirmationActions.js';
import { auditDetroitDynamoOwnerLaunchReviewReport } from '../src/lib/detroitDynamoOwnerLaunchReview.js';
import { auditDetroitDynamoOwnerEvidenceIntakeReport } from '../src/lib/detroitDynamoOwnerEvidenceIntake.js';
import { auditDetroitDynamoProductionPreviewEvidenceReport } from '../src/lib/detroitDynamoProductionPreviewEvidence.js';
import { auditDetroitDynamoLiveReadinessBoardReport } from '../src/lib/detroitDynamoLiveReadinessBoard.js';
import { auditDetroitDynamoLaunchArtifactIndexReport } from '../src/lib/detroitDynamoLaunchArtifactIndex.js';
import { auditDetroitDynamoDeploymentReadinessReport } from '../src/lib/detroitDynamoDeploymentReadiness.js';
import { auditDetroitDynamoOwnerHandoffPacketReport } from '../src/lib/detroitDynamoOwnerHandoffPacket.js';
import { auditDetroitDynamoOwnerSignoffRegisterReport } from '../src/lib/detroitDynamoOwnerSignoffRegister.js';
import { auditDetroitDynamoFinalAcceptanceMatrixReport } from '../src/lib/detroitDynamoFinalAcceptanceMatrix.js';
import { auditDetroitDynamoSafeguardingContract } from '../src/lib/detroitDynamoSafeguardingContract.js';
import { auditDetroitDynamoLeadPipelineOperations } from '../src/lib/detroitDynamoLeadPipeline.js';
import { auditDetroitDynamoPipelineActionContract } from '../src/lib/detroitDynamoPipelineActionContract.js';
import { auditDetroitDynamoAdminModuleReadContract } from '../src/lib/detroitDynamoAdminModuleReadContract.js';
import { auditDetroitDynamoAdminRoleGrantContract } from '../src/lib/detroitDynamoAdminRoleGrantContract.js';
import { auditDetroitDynamoAdminModuleWriteContract } from '../src/lib/detroitDynamoAdminModuleWriteContract.js';
import { detroitDynamoAppwriteCollections } from '../src/lib/detroitDynamoAppwriteSchema.js';

const root = process.cwd();
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173';
const failures = [];

const currentSiteRoutes = [
  '/',
  '/about',
  '/book',
  '/lcfc',
  '/lcfc/roster',
  '/lcfc/schedule',
  '/lcfc/tryouts',
  '/team',
  '/team/schedule',
  '/blog',
  '/apply',
  '/terms',
  '/privacy',
];

const dynamoRoutes = [
  ...detroitDynamoRouteManifest.map((route) => route.path),
  ...detroitDynamoAliasRoutes.map((route) => route.path),
];

const protectedDynamoAdminRoutes = [
  '/admin/detroit-dynamo',
  ...detroitDynamoAdminModuleDetailRoutes,
];

const requiredDynamoLabels = [
  'Home',
  'Training Academy',
  'Youth Club',
  'Senior Men',
  'Senior Women',
  'Tryouts',
  'Teams',
  'Schedule & Results',
  'Camps & Clinics',
  'Sponsors',
  'Contact',
  'About',
];
const pipelineBackedModels = ['ContactLead', 'Booking', 'TryoutRegistration', 'Sponsor'];
const pipelineAttributeKeys = [
  'pipeline_status',
  'pipeline_owner_role',
  'pipeline_due_at',
  'pipeline_updated_at',
  'pipeline_last_note',
  'pipeline_event_count',
];

const requiredFormLabels = [
  'Player name',
  'Parent/guardian name if minor',
  'Date of birth',
  'Gender/team interest',
  'Position',
  'Current / previous club',
  'Level of experience',
  'Email',
  'Phone',
  'Notes',
  'Business / organization',
  'Package interest',
  'Program interest',
];

const requiredLeadVariants = [
  'contact',
  'training',
  'youth',
  'tryout',
  'men',
  'women',
  'sponsor',
];

const prohibitedCurrentClaims = [
  'current UPSL member',
  'current UPSL Women member',
  'member of UPSL',
  'member of UPSL Women',
  'currently competes in UPSL',
  'currently competing in UPSL',
  'currently competes in UPSL Women',
  'currently competing in UPSL Women',
];

async function readProjectFile(file) {
  return fs.readFile(path.join(root, file), 'utf8');
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function checkIncludes(file, text, needle, message = `Missing "${needle}" in ${file}`) {
  check(text.includes(needle), message);
}

async function fetchRoute(route) {
  const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' });
  const body = await response.text();
  return {
    status: response.status,
    contentType: response.headers.get('content-type') || '',
    body,
  };
}

async function verifyHttpRoutes() {
  const routes = [...currentSiteRoutes, ...dynamoRoutes, ...protectedDynamoAdminRoutes];
  for (const route of routes) {
    try {
      const { status, contentType, body } = await fetchRoute(route);
      check(status >= 200 && status < 400, `Unexpected HTTP ${status} for ${route}`);
      check(contentType.includes('text/html'), `Expected HTML response for ${route}, got ${contentType || 'no content-type'}`);
      check(body.includes('id="root"'), `SPA root container missing from ${route}`);
    } catch (error) {
      failures.push(`Could not reach ${baseUrl}${route}: ${error.message}`);
    }
  }
}

async function verifyAdminModuleContracts() {
  const app = await readProjectFile('src/App.jsx');
  const protectedAdmin = await readProjectFile('src/pages/admin/AdminDetroitDynamo.jsx');
  const moduleDetail = await readProjectFile('src/pages/admin/AdminDetroitDynamoModule.jsx');
  const publicFoundation = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx');
  const browserQa = await readProjectFile('scripts/browser-qa-detroit-dynamo.mjs');
  const appwriteConfig = await readProjectFile('appwrite.json');
  const pipelineAction = await readProjectFile('functions/detroitDynamoLeadPipelineAction/src/main.js');
  const adminModuleRead = await readProjectFile('functions/detroitDynamoAdminModuleRead/src/main.js');
  const adminRoleGrant = await readProjectFile('functions/detroitDynamoAdminRoleGrantAction/src/main.js');
  const adminModuleWrite = await readProjectFile('functions/detroitDynamoAdminModuleWriteAction/src/main.js');
  const adminModuleReadHelper = await readProjectFile('src/lib/detroitDynamoAdminModuleReads.js');
  const adminRecordWorkspaceHelper = await readProjectFile('src/lib/detroitDynamoAdminRecordWorkspace.js');
  const adminRecordWorkspaceContract = await readProjectFile('src/lib/detroitDynamoAdminRecordWorkspaceContract.js');
  const launchEvidenceContract = await readProjectFile('src/lib/detroitDynamoLaunchEvidenceContract.js');
  const launchEvidenceActions = await readProjectFile('src/lib/detroitDynamoLaunchEvidenceActions.js');
  const externalConfirmationActions = await readProjectFile('src/lib/detroitDynamoExternalConfirmationActions.js');
  const ownerLaunchReview = await readProjectFile('src/lib/detroitDynamoOwnerLaunchReview.js');
  const ownerEvidenceIntake = await readProjectFile('src/lib/detroitDynamoOwnerEvidenceIntake.js');
  const productionPreviewEvidence = await readProjectFile('src/lib/detroitDynamoProductionPreviewEvidence.js');
  const liveReadinessBoard = await readProjectFile('src/lib/detroitDynamoLiveReadinessBoard.js');
  const launchArtifactIndex = await readProjectFile('src/lib/detroitDynamoLaunchArtifactIndex.js');
  const deploymentReadiness = await readProjectFile('src/lib/detroitDynamoDeploymentReadiness.js');
  const vercelPreviewRunbook = await readProjectFile('src/lib/detroitDynamoVercelPreviewRunbook.js');
  const secretRedaction = await readProjectFile('src/lib/detroitDynamoSecretRedactionContract.js');
  const externalGateClosure = await readProjectFile('src/lib/detroitDynamoExternalGateClosurePacket.js');
  const ownerHandoffPacket = await readProjectFile('src/lib/detroitDynamoOwnerHandoffPacket.js');
  const ownerSignoffRegister = await readProjectFile('src/lib/detroitDynamoOwnerSignoffRegister.js');
  const finalAcceptanceMatrix = await readProjectFile('src/lib/detroitDynamoFinalAcceptanceMatrix.js');
  const adminRoleGrantHelper = await readProjectFile('src/lib/detroitDynamoAdminRoleGrants.js');
  const adminModuleWriteHelper = await readProjectFile('src/lib/detroitDynamoAdminModuleWrites.js');
  const intakeContractFixtures = buildDetroitDynamoLeadIntakeFixtures();
  const detailRoutes = new Set(detroitDynamoAdminModuleDetailRoutes);

  checkIncludes('src/App.jsx', app, 'path="/admin/detroit-dynamo/modules/:moduleSlug"', 'Protected Dynamo admin module detail route is missing');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, '/admin/detroit-dynamo/modules/${item.slug}', 'Protected Dynamo admin list does not link to module detail routes');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'FIRST ADMIN ACTION CONTRACT', 'Protected module detail page is missing action guard section');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'DATA TARGETS', 'Protected module detail page is missing data targets section');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODULE PERMISSIONS', 'Protected module detail page is missing module permissions section');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODEL WRITE PREVIEW', 'Protected module detail page is missing local record draft preview');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODULE READ ACTION CONSOLE', 'Protected module detail page is missing module read action console');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'submitDetroitDynamoAdminModuleReadAction', 'Protected module detail page is missing module read submit handler');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODULE READ LEDGER', 'Protected module detail page is missing module read ledger');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODULE RECORD WORKSPACE', 'Protected module detail page is missing module record workspace');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'downloadModuleRecordsCsv', 'Protected module detail page is missing module record CSV export');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'RECORD DETAIL PREVIEW', 'Protected module detail page is missing module record detail preview');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'moduleFilteredRecords', 'Protected module detail page is missing searchable module record data');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'modulePaginatedRecords', 'Protected module detail page is missing paginated module record data');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'Field Display Profile', 'Protected module detail page is missing schema-aware field profile');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'selectedModuleFieldRows', 'Protected module detail page is missing schema-aware field rows');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'prepareModuleRecordWriteAction', 'Protected module detail page is missing safe record-to-write handoff actions');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'Missing required', 'Protected module detail page is missing required-field readiness');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspace.js', adminRecordWorkspaceHelper, 'flattenDetroitDynamoModuleRecordCollections', 'Admin record workspace helper is missing record flattening');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspace.js', adminRecordWorkspaceHelper, 'buildDetroitDynamoModuleRecordCsv', 'Admin record workspace helper is missing CSV export builder');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspace.js', adminRecordWorkspaceHelper, 'buildDetroitDynamoCollectionDisplayProfile', 'Admin record workspace helper is missing schema field profile builder');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspace.js', adminRecordWorkspaceHelper, 'buildDetroitDynamoPreparedRecordPayload', 'Admin record workspace helper is missing write-prep payload builder');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspace.js', adminRecordWorkspaceHelper, 'missingRequiredFields', 'Admin record workspace helper is missing required-field readiness support');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspaceContract.js', adminRecordWorkspaceContract, 'buildDetroitDynamoAdminRecordWorkspaceReport', 'Admin record workspace contract is missing report builder');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspaceContract.js', adminRecordWorkspaceContract, 'auditDetroitDynamoAdminRecordWorkspaceReport', 'Admin record workspace contract is missing audit function');
  checkIncludes('src/lib/detroitDynamoAdminRecordWorkspaceContract.js', adminRecordWorkspaceContract, 'buildDetroitDynamoAdminRecordWorkspaceMarkdown', 'Admin record workspace contract is missing markdown handoff builder');
  checkIncludes('src/lib/detroitDynamoLaunchEvidenceContract.js', launchEvidenceContract, 'buildDetroitDynamoLaunchEvidenceReport', 'Launch evidence contract is missing report builder');
  checkIncludes('src/lib/detroitDynamoLaunchEvidenceContract.js', launchEvidenceContract, 'auditDetroitDynamoLaunchEvidenceReport', 'Launch evidence contract is missing audit function');
  checkIncludes('src/lib/detroitDynamoLaunchEvidenceContract.js', launchEvidenceContract, 'buildDetroitDynamoLaunchEvidenceMarkdown', 'Launch evidence contract is missing markdown handoff builder');
  checkIncludes('src/lib/detroitDynamoLaunchEvidenceActions.js', launchEvidenceActions, 'submitDetroitDynamoLaunchEvidenceAction', 'Launch evidence action helper is missing submit handler');
  checkIncludes('src/lib/detroitDynamoLaunchEvidenceActions.js', launchEvidenceActions, 'buildDetroitDynamoLaunchEvidenceActionCsv', 'Launch evidence action helper is missing CSV export');
  checkIncludes('src/lib/detroitDynamoLaunchEvidenceActions.js', launchEvidenceActions, 'live_gate_cleared: false', 'Launch evidence action helper must keep live gates uncleared');
  checkIncludes('src/lib/detroitDynamoExternalConfirmationActions.js', externalConfirmationActions, 'submitDetroitDynamoExternalConfirmationAction', 'External confirmation action helper is missing submit handler');
  checkIncludes('src/lib/detroitDynamoExternalConfirmationActions.js', externalConfirmationActions, 'buildDetroitDynamoExternalConfirmationActionCsv', 'External confirmation action helper is missing CSV export');
  checkIncludes('src/lib/detroitDynamoExternalConfirmationActions.js', externalConfirmationActions, 'publication_unlocked: false', 'External confirmation action helper must keep publication locked');
  checkIncludes('src/lib/detroitDynamoOwnerLaunchReview.js', ownerLaunchReview, 'buildDetroitDynamoOwnerLaunchReviewReport', 'Owner launch review helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoOwnerLaunchReview.js', ownerLaunchReview, 'no_go_preview_only', 'Owner launch review must stay no-go in preview');
  checkIncludes('src/lib/detroitDynamoOwnerLaunchReview.js', ownerLaunchReview, 'buildDetroitDynamoOwnerLaunchReviewMarkdown', 'Owner launch review helper is missing markdown builder');
  checkIncludes('src/lib/detroitDynamoOwnerEvidenceIntake.js', ownerEvidenceIntake, 'buildDetroitDynamoOwnerEvidenceIntakeReport', 'Owner evidence intake helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoOwnerEvidenceIntake.js', ownerEvidenceIntake, 'buildDetroitDynamoOwnerEvidenceIntakeCsv', 'Owner evidence intake helper is missing CSV builder');
  checkIncludes('src/lib/detroitDynamoOwnerEvidenceIntake.js', ownerEvidenceIntake, 'live_gate_cleared', 'Owner evidence intake must track live gate safety');
  checkIncludes('src/lib/detroitDynamoProductionPreviewEvidence.js', productionPreviewEvidence, 'buildDetroitDynamoProductionPreviewEvidenceReport', 'Production-preview evidence helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoProductionPreviewEvidence.js', productionPreviewEvidence, 'preview_only', 'Production-preview evidence helper must keep preview-only launch mode');
  checkIncludes('src/lib/detroitDynamoProductionPreviewEvidence.js', productionPreviewEvidence, 'productionSubmissionsRecorded: 0', 'Production-preview evidence helper must not claim recorded submissions');
  checkIncludes('src/lib/detroitDynamoLiveReadinessBoard.js', liveReadinessBoard, 'buildDetroitDynamoLiveReadinessBoardReport', 'Live readiness board helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoLiveReadinessBoard.js', liveReadinessBoard, 'no_go_preview_only', 'Live readiness board must remain no-go in preview');
  checkIncludes('src/lib/detroitDynamoLiveReadinessBoard.js', liveReadinessBoard, 'rootPromotionAllowed: false', 'Live readiness board must block root promotion');
  checkIncludes('src/lib/detroitDynamoLaunchArtifactIndex.js', launchArtifactIndex, 'buildDetroitDynamoLaunchArtifactIndexReport', 'Launch artifact index helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoLaunchArtifactIndex.js', launchArtifactIndex, 'preview_handoff_index', 'Launch artifact index must remain a preview handoff index');
  checkIncludes('src/lib/detroitDynamoLaunchArtifactIndex.js', launchArtifactIndex, 'detroit-dynamo-live-readiness-board.md', 'Launch artifact index must reference the live readiness handoff');
  checkIncludes('src/lib/detroitDynamoDeploymentReadiness.js', deploymentReadiness, 'buildDetroitDynamoDeploymentReadinessReport', 'Deployment readiness helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoDeploymentReadiness.js', deploymentReadiness, 'deployment_evidence_required', 'Deployment readiness must remain evidence-required');
  checkIncludes('src/lib/detroitDynamoDeploymentReadiness.js', deploymentReadiness, 'productionDeploymentsRecorded: 0', 'Deployment readiness must not claim production deployment evidence');
  checkIncludes('src/lib/detroitDynamoVercelPreviewRunbook.js', vercelPreviewRunbook, 'buildDetroitDynamoVercelPreviewRunbookReport', 'Vercel preview runbook helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoVercelPreviewRunbook.js', vercelPreviewRunbook, 'vercel_preview_evidence_required', 'Vercel preview runbook must remain evidence-required');
  checkIncludes('src/lib/detroitDynamoVercelPreviewRunbook.js', vercelPreviewRunbook, 'projectIdentifiersRedacted: true', 'Vercel preview runbook must redact project identifiers');
  checkIncludes('src/lib/detroitDynamoSecretRedactionContract.js', secretRedaction, 'buildDetroitDynamoSecretRedactionReport', 'Secret redaction helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoSecretRedactionContract.js', secretRedaction, 'secret_redaction_required_preview_only', 'Secret redaction contract must remain preview-only');
  checkIncludes('src/lib/detroitDynamoSecretRedactionContract.js', secretRedaction, 'exactSecretValuesWritten: false', 'Secret redaction contract must not write exact secret values');
  checkIncludes('src/lib/detroitDynamoSecretRedactionContract.js', secretRedaction, 'projectIdentifiersRedacted: true', 'Secret redaction contract must redact project identifiers');
  checkIncludes('src/lib/detroitDynamoExternalGateClosurePacket.js', externalGateClosure, 'buildDetroitDynamoExternalGateClosureReport', 'External gate closure helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoExternalGateClosurePacket.js', externalGateClosure, 'external_gate_closure_required_preview_only', 'External gate closure packet must remain preview-only');
  checkIncludes('src/lib/detroitDynamoExternalGateClosurePacket.js', externalGateClosure, 'completionClaimAllowed: false', 'External gate closure packet must block completion claims');
  checkIncludes('src/lib/detroitDynamoOwnerHandoffPacket.js', ownerHandoffPacket, 'buildDetroitDynamoOwnerHandoffPacketReport', 'Owner handoff packet helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoOwnerHandoffPacket.js', ownerHandoffPacket, 'owner_handoff_packet_preview_only', 'Owner handoff packet must remain preview-only');
  checkIncludes('src/lib/detroitDynamoOwnerHandoffPacket.js', ownerHandoffPacket, 'completionClaimAllowed: false', 'Owner handoff packet must block completion claims');
  checkIncludes('src/lib/detroitDynamoOwnerSignoffRegister.js', ownerSignoffRegister, 'buildDetroitDynamoOwnerSignoffRegisterReport', 'Owner signoff register helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoOwnerSignoffRegister.js', ownerSignoffRegister, 'owner_signoff_required_preview_only', 'Owner signoff register must remain preview-only');
  checkIncludes('src/lib/detroitDynamoOwnerSignoffRegister.js', ownerSignoffRegister, 'signoffRecorded: false', 'Owner signoff register must keep signoffs unsigned');
  checkIncludes('src/lib/detroitDynamoFinalAcceptanceMatrix.js', finalAcceptanceMatrix, 'buildDetroitDynamoFinalAcceptanceMatrixReport', 'Final acceptance matrix helper is missing report builder');
  checkIncludes('src/lib/detroitDynamoFinalAcceptanceMatrix.js', finalAcceptanceMatrix, 'final_acceptance_preview_audit', 'Final acceptance matrix must remain preview-only');
  checkIncludes('src/lib/detroitDynamoFinalAcceptanceMatrix.js', finalAcceptanceMatrix, 'completionClaimAllowed: false', 'Final acceptance matrix must block completion claims');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODULE WRITE ACTION CONSOLE', 'Protected module detail page is missing module write action console');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'submitDetroitDynamoAdminModuleWriteAction', 'Protected module detail page is missing module write submit handler');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODULE WRITE LEDGER', 'Protected module detail page is missing module write ledger');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'OWNER WORK PREVIEW', 'Protected module detail page is missing module follow-up queue preview');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'MODULE AUDIT EVENT LEDGER', 'Protected module detail page is missing module audit event ledger');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'getDetroitDynamoPreviewAuditEvents', 'Protected module detail page is missing local audit event data');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'EXTERNAL READINESS GATES', 'Protected module detail page is missing module-specific external gate content');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'buildDetroitDynamoExternalGateContractReport', 'Protected module detail page is missing external gate contract data');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'CLAIM SAFETY GUARDS', 'Protected module detail page is missing module-specific claim-safety content');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'buildDetroitDynamoClaimSafetyContractReport', 'Protected module detail page is missing claim-safety contract data');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'SAFEGUARDING PRIVACY GUARDS', 'Protected module detail page is missing module-specific safeguarding/privacy content');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'buildDetroitDynamoSafeguardingReport', 'Protected module detail page is missing safeguarding/privacy contract data');
  checkIncludes('src/pages/admin/AdminDetroitDynamoModule.jsx', moduleDetail, 'updateDetroitDynamoPreviewLeadPipelineStatus', 'Protected module detail page is missing local transition handler');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'First Action Guards', 'Public admin foundation is missing action guard planning content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Follow-Up Status Policy', 'Public admin foundation is missing lead pipeline planning content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'FOLLOW-UP STATUS POLICY', 'Protected Dynamo admin is missing lead pipeline planning content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'OPERATOR INTAKE BOARD', 'Protected Dynamo admin is missing operator intake board');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LOCAL AUDIT EVENT LEDGER', 'Protected Dynamo admin is missing local audit event ledger');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'downloadPreviewAuditEvents', 'Protected Dynamo admin is missing audit event export');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'PUBLIC FORM HANDOFF CONTRACT', 'Protected Dynamo admin is missing public lead-intake handoff content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'CHECKOUT AND SIGNATURE SAFETY CONTRACT', 'Protected Dynamo admin is missing payment/waiver gate content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'PUBLIC CLAIM SAFETY CONTRACT', 'Protected Dynamo admin is missing public claim-safety contract content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'PROMOTION CUTOVER CONTROL', 'Protected Dynamo admin is missing promotion cutover content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LAUNCH EVIDENCE CHECKLIST', 'Protected Dynamo admin is missing launch evidence checklist content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoLaunchEvidenceReport', 'Protected Dynamo admin is missing launch evidence checklist data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LAUNCH EVIDENCE ACTION LEDGER', 'Protected Dynamo admin is missing launch evidence action ledger');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'submitDetroitDynamoLaunchEvidenceAction', 'Protected Dynamo admin is missing launch evidence action submit handler');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'EXTERNAL CONFIRMATION ACTION QUEUE', 'Protected Dynamo admin is missing external confirmation action queue');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'submitDetroitDynamoExternalConfirmationAction', 'Protected Dynamo admin is missing external confirmation action submit handler');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'OWNER LAUNCH REVIEW PACKET', 'Protected Dynamo admin is missing owner launch review packet');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoOwnerLaunchReviewReport', 'Protected Dynamo admin is missing owner launch review data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'OWNER EVIDENCE INTAKE WORKSHEET', 'Protected Dynamo admin is missing owner evidence intake worksheet');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'downloadOwnerEvidenceIntake', 'Protected Dynamo admin is missing owner evidence intake CSV export');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'PRODUCTION PREVIEW EVIDENCE MATRIX', 'Protected Dynamo admin is missing production-preview evidence matrix');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoProductionPreviewEvidenceReport', 'Protected Dynamo admin is missing production-preview evidence data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LIVE READINESS BOARD', 'Protected Dynamo admin is missing live readiness board');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoLiveReadinessBoardReport', 'Protected Dynamo admin is missing live readiness board data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LAUNCH ARTIFACT INDEX', 'Protected Dynamo admin is missing launch artifact index');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoLaunchArtifactIndexReport', 'Protected Dynamo admin is missing launch artifact index data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'DEPLOYMENT READINESS HANDOFF', 'Protected Dynamo admin is missing deployment readiness handoff');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoDeploymentReadinessReport', 'Protected Dynamo admin is missing deployment readiness data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'VERCEL PREVIEW DEPLOYMENT RUNBOOK', 'Protected Dynamo admin is missing Vercel preview runbook');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoVercelPreviewRunbookReport', 'Protected Dynamo admin is missing Vercel preview runbook data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'SECRET REDACTION CONTRACT', 'Protected Dynamo admin is missing secret redaction contract');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoSecretRedactionReport', 'Protected Dynamo admin is missing secret redaction data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'EXTERNAL GATE CLOSURE PACKET', 'Protected Dynamo admin is missing external gate closure packet');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoExternalGateClosureReport', 'Protected Dynamo admin is missing external gate closure data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'OWNER HANDOFF PACKET', 'Protected Dynamo admin is missing owner handoff packet');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoOwnerHandoffPacketReport', 'Protected Dynamo admin is missing owner handoff packet data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'OWNER SIGNOFF REGISTER', 'Protected Dynamo admin is missing owner signoff register');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoOwnerSignoffRegisterReport', 'Protected Dynamo admin is missing owner signoff register data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'FINAL ACCEPTANCE MATRIX', 'Protected Dynamo admin is missing final acceptance matrix');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoFinalAcceptanceMatrixReport', 'Protected Dynamo admin is missing final acceptance matrix data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'SAFEGUARDING AND DATA PRIVACY CONTRACT', 'Protected Dynamo admin is missing safeguarding/privacy content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LIVE MODULE READ CONTRACT', 'Protected Dynamo admin is missing admin module read contract content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoAdminModuleReadContractReport', 'Protected Dynamo admin is missing admin module read contract data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LIVE MODULE WRITE CONTRACT', 'Protected Dynamo admin is missing admin module write contract content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoAdminModuleWriteContractReport', 'Protected Dynamo admin is missing admin module write contract data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LIVE RECORD WORKSPACE CONTRACT', 'Protected Dynamo admin is missing admin record workspace contract content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoAdminRecordWorkspaceReport', 'Protected Dynamo admin is missing admin record workspace contract data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'LIVE ROLE GRANT CONTRACT', 'Protected Dynamo admin is missing admin role grant contract content');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'buildDetroitDynamoAdminRoleGrantContractReport', 'Protected Dynamo admin is missing admin role grant contract data');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'ROLE GRANT ACTION CONSOLE', 'Protected Dynamo admin is missing role grant action console');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'submitDetroitDynamoAdminRoleGrantAction', 'Protected Dynamo admin is missing role grant submit handler');
  checkIncludes('src/pages/admin/AdminDetroitDynamo.jsx', protectedAdmin, 'updateDetroitDynamoPreviewLeadPipelineStatus', 'Protected Dynamo admin is missing local lead transition handler');
  checkIncludes('src/lib/detroitDynamoLeads.js', await readProjectFile('src/lib/detroitDynamoLeads.js'), 'DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY', 'Local lead helper is missing preview audit event storage');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Form Submission Handoff Contract', 'Public admin foundation is missing public lead-intake handoff content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Checkout and Signature Safety Contract', 'Public admin foundation is missing payment/waiver gate content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Public Claim Safety Contract', 'Public admin foundation is missing public claim-safety contract content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Promotion Cutover Control', 'Public admin foundation is missing promotion cutover content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Launch Evidence Checklist', 'Public admin foundation is missing launch evidence checklist content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoLaunchEvidenceReport', 'Public admin foundation is missing launch evidence checklist data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Launch Evidence Action Workflow', 'Public admin foundation is missing launch evidence action workflow content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoLaunchEvidenceActionReport', 'Public admin foundation is missing launch evidence action workflow data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'External Confirmation Action Queue', 'Public admin foundation is missing external confirmation action workflow content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoExternalConfirmationActionReport', 'Public admin foundation is missing external confirmation action workflow data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Owner Launch Review Packet', 'Public admin foundation is missing owner launch review packet content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoOwnerLaunchReviewReport', 'Public admin foundation is missing owner launch review data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Owner Evidence Intake Worksheet', 'Public admin foundation is missing owner evidence intake worksheet content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoOwnerEvidenceIntakeReport', 'Public admin foundation is missing owner evidence intake data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Production Preview Evidence Matrix', 'Public admin foundation is missing production-preview evidence matrix content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoProductionPreviewEvidenceReport', 'Public admin foundation is missing production-preview evidence data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Live Readiness Board', 'Public admin foundation is missing live readiness board content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoLiveReadinessBoardReport', 'Public admin foundation is missing live readiness board data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Launch Artifact Index', 'Public admin foundation is missing launch artifact index content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoLaunchArtifactIndexReport', 'Public admin foundation is missing launch artifact index data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Deployment Readiness Handoff', 'Public admin foundation is missing deployment readiness content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoDeploymentReadinessReport', 'Public admin foundation is missing deployment readiness data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Vercel Preview Deployment Runbook', 'Public admin foundation is missing Vercel preview runbook content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoVercelPreviewRunbookReport', 'Public admin foundation is missing Vercel preview runbook data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Secret Redaction Contract', 'Public admin foundation is missing secret redaction content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoSecretRedactionReport', 'Public admin foundation is missing secret redaction data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'External Gate Closure Packet', 'Public admin foundation is missing external gate closure content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoExternalGateClosureReport', 'Public admin foundation is missing external gate closure data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Owner Handoff Packet', 'Public admin foundation is missing owner handoff packet content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoOwnerHandoffPacketReport', 'Public admin foundation is missing owner handoff packet data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Owner Signoff Register', 'Public admin foundation is missing owner signoff register content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoOwnerSignoffRegisterReport', 'Public admin foundation is missing owner signoff register data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Final Acceptance Matrix', 'Public admin foundation is missing final acceptance matrix content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoFinalAcceptanceMatrixReport', 'Public admin foundation is missing final acceptance matrix data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Safeguarding and Data Privacy Contract', 'Public admin foundation is missing safeguarding/privacy content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Admin Module Read Contract', 'Public admin foundation is missing admin module read contract content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoAdminModuleReadContractReport', 'Public admin foundation is missing admin module read contract data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Admin Module Write Contract', 'Public admin foundation is missing admin module write contract content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoAdminModuleWriteContractReport', 'Public admin foundation is missing admin module write contract data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Admin Record Workspace Contract', 'Public admin foundation is missing admin record workspace contract content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoAdminRecordWorkspaceReport', 'Public admin foundation is missing admin record workspace contract data');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'Admin Role Grant Contract', 'Public admin foundation is missing admin role grant contract content');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', publicFoundation, 'buildDetroitDynamoAdminRoleGrantContractReport', 'Public admin foundation is missing admin role grant contract data');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'adminModuleRoutesAudited', 'Browser QA is missing admin module route coverage');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'signInRequired', 'Browser QA is missing protected admin sign-in guard coverage');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'leadFormSubmissions', 'Browser QA is missing full public lead-form submission coverage');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'formSubmissionSummary', 'Browser QA is missing submitted lead-form reporting');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'submitInvalidTryoutForm', 'Browser QA is missing public form validation-error coverage');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'submitStorageErrorForm', 'Browser QA is missing public form storage-error coverage');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'validationErrorVisible', 'Browser QA is missing validation-error assertions');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'storageErrorVisible', 'Browser QA is missing storage-error assertions');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'invalidControlHasAriaInvalid', 'Browser QA is missing aria-invalid assertions');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'invalidControlDescribedByError', 'Browser QA is missing aria-describedby assertions');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'successStatusVisible', 'Browser QA is missing success status accessibility assertions');
  checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, 'storageErrorAlertVisible', 'Browser QA is missing error alert accessibility assertions');
  for (const formLabel of ['training', 'youth', 'tryout', 'men', 'women', 'sponsor', 'contact']) {
    checkIncludes('scripts/browser-qa-detroit-dynamo.mjs', browserQa, `label: '${formLabel}'`, `Browser QA is missing ${formLabel} form submission coverage`);
  }
  checkIncludes('appwrite.json', appwriteConfig, '"$id": "detroitDynamoLeadPipelineAction"', 'Appwrite config is missing the pipeline action function');
  checkIncludes('functions/detroitDynamoLeadPipelineAction/src/main.js', pipelineAction, 'currentStage.nextStatuses.includes', 'Pipeline action function must enforce allowed status transitions');
  checkIncludes('functions/detroitDynamoLeadPipelineAction/src/main.js', pipelineAction, 'databases.updateDocument', 'Pipeline action function must update pipeline-backed records');
  checkIncludes('functions/detroitDynamoLeadPipelineAction/src/main.js', pipelineAction, 'dd_admin_audit_events', 'Pipeline action function must target the admin audit event collection');
  checkIncludes('functions/detroitDynamoLeadPipelineAction/src/main.js', pipelineAction, 'databases.createDocument', 'Pipeline action function must append audit events for live transitions');
  checkIncludes('functions/detroitDynamoLeadPipelineAction/src/main.js', pipelineAction, 'audit_event_id', 'Pipeline action function must return the created audit event id');
  checkIncludes('appwrite.json', appwriteConfig, '"$id": "detroitDynamoAdminModuleRead"', 'Appwrite config is missing the admin module read function');
  checkIncludes('functions/detroitDynamoAdminModuleRead/src/main.js', adminModuleRead, 'databases.listDocuments', 'Admin module read function must list scoped documents');
  checkIncludes('functions/detroitDynamoAdminModuleRead/src/main.js', adminModuleRead, 'Query.limit', 'Admin module read function must cap read pagination');
  checkIncludes('functions/detroitDynamoAdminModuleRead/src/main.js', adminModuleRead, 'dd_admin_role_assignments', 'Admin module read function must verify trusted role assignments');
  checkIncludes('functions/detroitDynamoAdminModuleRead/src/main.js', adminModuleRead, 'Actor role is not assigned to this authenticated Appwrite user', 'Admin module read function must reject unassigned client-asserted roles');
  checkIncludes('functions/detroitDynamoAdminModuleRead/src/main.js', adminModuleRead, 'collection_id must belong to the requested Detroit Dynamo admin module', 'Admin module read function must reject cross-module collection reads');
  checkIncludes('src/lib/detroitDynamoAdminModuleReads.js', adminModuleReadHelper, 'DETROIT_DYNAMO_MODULE_READ_BACKEND_STORAGE_KEY', 'Admin module read helper must expose Appwrite/local mode');
  checkIncludes('src/lib/detroitDynamoAdminModuleReads.js', adminModuleReadHelper, 'validateDetroitDynamoAdminModuleReadPayload', 'Admin module read helper must validate action payloads');
  checkIncludes('src/lib/detroitDynamoAdminModuleReads.js', adminModuleReadHelper, 'rpc.invoke', 'Admin module read helper must invoke the Appwrite function in live mode');
  checkIncludes('src/lib/detroitDynamoAdminModuleReads.js', adminModuleReadHelper, 'preview_module_read_after_action_error', 'Admin module read helper must fall back cleanly when live mode fails');
  checkIncludes('appwrite.json', appwriteConfig, '"$id": "detroitDynamoAdminRoleGrantAction"', 'Appwrite config is missing the admin role grant function');
  checkIncludes('functions/detroitDynamoAdminRoleGrantAction/src/main.js', adminRoleGrant, 'dd_admin_role_assignments', 'Admin role grant function must write trusted role assignments');
  checkIncludes('functions/detroitDynamoAdminRoleGrantAction/src/main.js', adminRoleGrant, 'dd_admin_audit_events', 'Admin role grant function must append audit events');
  checkIncludes('functions/detroitDynamoAdminRoleGrantAction/src/main.js', adminRoleGrant, 'DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID', 'Admin role grant function must gate first Master Admin bootstrap by server env');
  checkIncludes('functions/detroitDynamoAdminRoleGrantAction/src/main.js', adminRoleGrant, 'hasActiveMasterAdmin', 'Admin role grant function must require an active Master Admin grant');
  checkIncludes('functions/detroitDynamoAdminRoleGrantAction/src/main.js', adminRoleGrant, 'Master Admin cannot remove their own active role grant with this action', 'Admin role grant function must protect against self-lockout');
  checkIncludes('functions/detroitDynamoAdminRoleGrantAction/src/main.js', adminRoleGrant, 'audit_event_id', 'Admin role grant function must return the created audit event id');
  checkIncludes('appwrite.json', appwriteConfig, '"$id": "detroitDynamoAdminModuleWriteAction"', 'Appwrite config is missing the admin module write function');
  checkIncludes('functions/detroitDynamoAdminModuleWriteAction/src/main.js', adminModuleWrite, 'dd_admin_role_assignments', 'Admin module write function must verify trusted role assignments');
  checkIncludes('functions/detroitDynamoAdminModuleWriteAction/src/main.js', adminModuleWrite, 'dd_admin_audit_events', 'Admin module write function must append audit events');
  checkIncludes('functions/detroitDynamoAdminModuleWriteAction/src/main.js', adminModuleWrite, 'external_gate', 'Admin module write function must enforce external gate confirmation');
  checkIncludes('functions/detroitDynamoAdminModuleWriteAction/src/main.js', adminModuleWrite, 'databases.createDocument', 'Admin module write function must create Appwrite documents');
  checkIncludes('functions/detroitDynamoAdminModuleWriteAction/src/main.js', adminModuleWrite, 'databases.updateDocument', 'Admin module write function must update Appwrite documents');
  checkIncludes('functions/detroitDynamoAdminModuleWriteAction/src/main.js', adminModuleWrite, 'admin_module_write_action', 'Admin module write function must write admin module audit events');
  checkIncludes('src/lib/detroitDynamoAdminRoleGrants.js', adminRoleGrantHelper, 'DETROIT_DYNAMO_ROLE_GRANT_BACKEND_STORAGE_KEY', 'Admin role grant helper must expose Appwrite/local mode');
  checkIncludes('src/lib/detroitDynamoAdminRoleGrants.js', adminRoleGrantHelper, 'validateDetroitDynamoAdminRoleGrantPayload', 'Admin role grant helper must validate action payloads');
  checkIncludes('src/lib/detroitDynamoAdminRoleGrants.js', adminRoleGrantHelper, 'rpc.invoke', 'Admin role grant helper must invoke the Appwrite function in live mode');
  checkIncludes('src/lib/detroitDynamoAdminRoleGrants.js', adminRoleGrantHelper, 'preview_role_grant_after_action_error', 'Admin role grant helper must fall back cleanly when live mode fails');
  checkIncludes('src/lib/detroitDynamoAdminModuleWrites.js', adminModuleWriteHelper, 'DETROIT_DYNAMO_MODULE_WRITE_BACKEND_STORAGE_KEY', 'Admin module write helper must expose Appwrite/local mode');
  checkIncludes('src/lib/detroitDynamoAdminModuleWrites.js', adminModuleWriteHelper, 'validateDetroitDynamoAdminModuleWritePayload', 'Admin module write helper must validate action payloads');
  checkIncludes('src/lib/detroitDynamoAdminModuleWrites.js', adminModuleWriteHelper, 'rpc.invoke', 'Admin module write helper must invoke the Appwrite function in live mode');
  checkIncludes('src/lib/detroitDynamoAdminModuleWrites.js', adminModuleWriteHelper, 'preview_module_write_after_action_error', 'Admin module write helper must fall back cleanly when live mode fails');
  checkIncludes('src/lib/detroitDynamoAdminModuleWrites.js', adminModuleWriteHelper, 'admin_module_write_action', 'Admin module write helper must append local audit events');

  for (const issue of auditDetroitDynamoLeadIntakeContract()) {
    check(false, `Lead intake contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoPipelineActionContract()) {
    check(false, `Pipeline action contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoAdminModuleReadContract()) {
    check(false, `Admin module read contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoAdminRoleGrantContract()) {
    check(false, `Admin role grant contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoAdminModuleWriteContract()) {
    check(false, `Admin module write contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoExternalGateContracts()) {
    check(false, `External gate contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoClaimSafetyContract()) {
    check(false, `Claim safety contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoPromotionCutoverContract()) {
    check(false, `Promotion cutover contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoLaunchEvidenceReport()) {
    check(false, `Launch evidence contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoLaunchEvidenceActionReport()) {
    check(false, `Launch evidence action contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoExternalConfirmationActionReport()) {
    check(false, `External confirmation action contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoOwnerLaunchReviewReport()) {
    check(false, `Owner launch review contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoOwnerEvidenceIntakeReport()) {
    check(false, `Owner evidence intake contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoProductionPreviewEvidenceReport()) {
    check(false, `Production-preview evidence contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoLiveReadinessBoardReport()) {
    check(false, `Live readiness board contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoLaunchArtifactIndexReport()) {
    check(false, `Launch artifact index contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoDeploymentReadinessReport()) {
    check(false, `Deployment readiness contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoOwnerHandoffPacketReport()) {
    check(false, `Owner handoff packet contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoOwnerSignoffRegisterReport()) {
    check(false, `Owner signoff register contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoFinalAcceptanceMatrixReport()) {
    check(false, `Final acceptance matrix contract audit issue: ${issue}`);
  }
  for (const issue of auditDetroitDynamoSafeguardingContract()) {
    check(false, `Safeguarding contract audit issue: ${issue}`);
  }
  for (const variant of requiredLeadVariants) {
    check(intakeContractFixtures.some((fixture) => fixture.leadType === variant), `Lead intake fixtures missing variant: ${variant}`);
  }
  check(detroitDynamoAdminModuleRegistry.length === detroitDynamoModuleActionGuards.length, 'Admin module registry and action guard counts differ');
  check(detroitDynamoLeadPipelineStages.length >= 6, 'Expected at least 6 lead pipeline stages');
  check(Object.keys(detroitDynamoLeadPipelineByType).length >= 7, 'Expected lead pipeline map for every lead type');
  for (const pipeline of Object.values(detroitDynamoLeadPipelineByType)) {
    check(pipeline.defaultStatus === 'new', `Lead pipeline must start as new for ${pipeline.leadType}`);
    check(pipeline.requiredStages.includes('contacted'), `Lead pipeline must include contacted for ${pipeline.leadType}`);
  }
  for (const issue of auditDetroitDynamoLeadPipelineOperations()) {
    check(false, `Lead pipeline operation audit issue: ${issue}`);
  }
  for (const model of pipelineBackedModels) {
    const collection = detroitDynamoAppwriteCollections.find((item) => item.model === model);
    check(Boolean(collection), `Missing pipeline-backed Appwrite collection for ${model}`);
    if (!collection) continue;
    const attributes = new Set(collection.attributes.map((attribute) => attribute.key));
    const indexes = new Set(collection.indexes.map((index) => index.key));
    for (const key of pipelineAttributeKeys) {
      check(attributes.has(key), `${model} schema missing pipeline attribute ${key}`);
    }
    check(indexes.has('idx_pipeline_status'), `${model} schema missing pipeline status index`);
    check(indexes.has('idx_pipeline_due'), `${model} schema missing pipeline due index`);
  }
  for (const modulePlan of detroitDynamoAdminModuleRegistry) {
    check(modulePlan.slug, `Admin module is missing slug: ${modulePlan.module}`);
    check(detailRoutes.has(`/admin/detroit-dynamo/modules/${modulePlan.slug}`), `Admin module detail route missing for ${modulePlan.module}`);

    const guard = detroitDynamoModuleActionGuards.find((item) => item.module === modulePlan.module);
    check(Boolean(guard), `Missing action guard group for ${modulePlan.module}`);
    if (!guard) continue;
    check(guard.actions.length === modulePlan.enabledActions.length, `Action guard count mismatch for ${modulePlan.module}`);
    for (const action of guard.actions) {
      check(action.requiredAccess, `Action guard missing required access for ${modulePlan.module}: ${action.action}`);
      check(action.permittedOwnerRoles.length > 0, `Action guard has no permitted owner role for ${modulePlan.module}: ${action.action}`);
    }
  }
}

function verifyRouteManifest() {
  const labels = new Set(detroitDynamoRouteManifest.map((route) => route.label));
  for (const label of requiredDynamoLabels) {
    check(labels.has(label), `Missing Detroit Dynamo route manifest label: ${label}`);
  }

  const sitemapRoutes = detroitDynamoRouteManifest.filter((route) => route.sitemap);
  check(sitemapRoutes.length >= 12, 'Expected at least 12 sitemap-ready Detroit Dynamo routes');

  for (const route of detroitDynamoRouteManifest) {
    check(route.title && route.description, `Missing SEO metadata for ${route.path}`);
    if (route.sitemap) {
      check(route.priority && route.changefreq, `Missing sitemap metadata for ${route.path}`);
    }
  }
}

async function verifyAppRouteContracts() {
  const app = await readProjectFile('src/App.jsx');
  for (const route of currentSiteRoutes) {
    if (route === '/') {
      checkIncludes('src/App.jsx', app, 'path="/"', 'Current homepage route is missing');
      continue;
    }
    checkIncludes('src/App.jsx', app, `path="${route}"`, `Current route is missing from App.jsx: ${route}`);
  }

  for (const route of detroitDynamoRouteManifest) {
    const routeNeedle = route.routerPath === 'index'
      ? 'path="/detroit-dynamo"'
      : `path="${route.routerPath}"`;
    checkIncludes('src/App.jsx', app, routeNeedle, `Detroit Dynamo route is missing from App.jsx: ${route.path}`);
  }
}

async function verifyLeadFormContracts() {
  const file = 'src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx';
  const form = await readProjectFile(file);
  for (const variant of requiredLeadVariants) {
    check(form.includes(`${variant}:`) || form.includes(`formVariant="${variant}"`) || form.includes(`variant="${variant}"`), `Missing lead form variant contract: ${variant}`);
  }
  for (const label of requiredFormLabels) {
    checkIncludes(file, form, label);
  }
  for (const behavior of ['validateForm', 'submitting', 'submittedLead', 'submitError', 'saveDetroitDynamoLead']) {
    checkIncludes(file, form, behavior, `Lead form missing ${behavior} behavior`);
  }
  for (const accessibilityBehavior of ['aria-invalid', 'aria-describedby', 'aria-busy', 'aria-disabled', 'role="alert"', 'role="status"']) {
    checkIncludes(file, form, accessibilityBehavior, `Lead form missing accessible ${accessibilityBehavior} behavior`);
  }
}

async function verifyDynamoPageFormCoverage() {
  const files = [
    'src/pages/detroit-dynamo/DetroitDynamoHome.jsx',
    'src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx',
    'src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx',
  ];
  const text = (await Promise.all(files.map(readProjectFile))).join('\n');

  for (const variant of ['contact', 'training', 'youth', 'tryout', 'sponsor']) {
    check(text.includes(`variant="${variant}"`), `Missing rendered Detroit Dynamo lead form for variant: ${variant}`);
  }
  check(text.includes('formVariant="men"'), "Missing men's senior-team lead form coverage");
  check(text.includes('formVariant="women"'), "Missing women's senior-team lead form coverage");
}

async function verifyDynamoContentProofBoard() {
  const file = 'src/pages/detroit-dynamo/DetroitDynamoHome.jsx';
  const home = await readProjectFile(file);
  for (const needle of [
    'Content Proof Board',
    'Proof Required Before Publishing',
    'No fake testimonials',
    'unapproved sponsor logos',
    'unconfirmed rosters',
    'invented fixtures',
    'league claims',
  ]) {
    checkIncludes(file, home, needle, `Detroit Dynamo homepage is missing content proof-board language: ${needle}`);
  }
}

async function verifyDynamoCurrentBookingFallbackLabels() {
  const home = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoHome.jsx');
  const secondary = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx');
  const clubPages = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx');
  const leadForm = await readProjectFile('src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx');

  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoHome.jsx', home, 'to="/book"', 'Dynamo home should expose the existing live booking flow');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoHome.jsx', home, 'Live Booking Flow', 'Dynamo home should explain the existing booking process');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoHome.jsx', home, 'Client Portal', 'Dynamo home should expose the existing client dashboard');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoHome.jsx', home, 'Coach Portal', 'Dynamo home should expose the existing coach portal');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoHome.jsx', home, 'Admin Portal', 'Dynamo home should expose the existing admin portal');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoHome.jsx', home, '/book?county=', 'Dynamo county CTAs should feed the existing booking flow');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoHome.jsx', home, 'Coach Data Loads From the Existing Platform', 'Dynamo coach section should stay visible when coach data is unavailable');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx', secondary, 'useLocation', 'Dynamo booking preview should read county query context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx', secondary, 'County Interest', 'Dynamo booking preview should surface selected county context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx', secondary, 'Program Interest', 'Dynamo booking preview should surface selected program context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx', secondary, 'Training focus:', 'Dynamo booking preview should preserve selected training focus context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx', secondary, 'defaultProgramInterest={programInterest}', 'Dynamo booking preview should seed selected program into the lead form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx', secondary, 'defaultNotes={contextNotes}', 'Dynamo booking preview should seed routed county/program/focus context into the lead notes');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'tryoutInterestHref', 'Dynamo tryout path CTAs should carry selected team context into the registration form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'Team Interest', 'Dynamo tryout registration should surface selected team context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultTeamInterest={teamInterest}', 'Dynamo tryout registration should seed selected team into the lead form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultNotes={teamNote}', 'Dynamo tryout registration should seed selected team context into the lead notes');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'sponsorPackageHref', 'Dynamo sponsor package CTAs should carry selected package context into the inquiry form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'Sponsor Package Interest', 'Dynamo sponsor inquiry should surface selected package context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultPackageInterest={packageInterest}', 'Dynamo sponsor inquiry should seed selected package into the lead form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultNotes={packageNote}', 'Dynamo sponsor inquiry should seed selected package context into the lead notes');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'campClinicHref', 'Dynamo camp/clinic CTAs should carry selected clinic context into the interest form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'Clinic Interest', 'Dynamo camp/clinic inquiry should surface selected clinic context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultProgramInterest={defaultProgramInterest}', 'Dynamo camp/clinic inquiry should seed selected clinic program into the lead form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultNotes={clinicNote}', 'Dynamo camp/clinic inquiry should seed selected clinic context into the lead notes');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'contactTopicHref', 'Dynamo contact topic CTAs should carry selected topic context into the contact form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'Inquiry Topic', 'Dynamo contact form should surface selected inquiry topic context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultNotes={topicNote}', 'Dynamo contact form should seed selected inquiry topic into the lead notes');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'youthAgeGroupHref', 'Dynamo youth age-group CTAs should carry selected age-group context into the youth form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'Age Group Interest', 'Dynamo youth form should surface selected age-group context');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultAgeGroupInterest={ageGroupInterest}', 'Dynamo youth form should seed selected age group into the lead form');
  checkIncludes('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx', clubPages, 'defaultNotes={ageGroupNote}', 'Dynamo youth form should seed selected age-group context into the lead notes');
  checkIncludes('src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx', leadForm, 'defaultNotes', 'Lead form should support default notes for routed context');
  checkIncludes('src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx', leadForm, 'defaultProgramInterest', 'Lead form should support default program interest for routed context');
  checkIncludes('src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx', leadForm, 'defaultPackageInterest', 'Lead form should support default package interest for routed context');
  checkIncludes('src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx', leadForm, 'defaultAgeGroupInterest', 'Lead form should support default age-group interest for routed context');
  checkIncludes('src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx', leadForm, 'previousDefaults', 'Lead form should sync routed default context without overwriting user edits');
}

async function verifyPromotedGlobalBrand() {
  const navbar = await readProjectFile('src/components/layout/Navbar.jsx');
  const footer = await readProjectFile('src/components/layout/Footer.jsx');
  const manifest = JSON.parse(await readProjectFile('public/manifest.json'));
  const indexHtml = await readProjectFile('index.html');
  const brand = await readProjectFile('src/lib/brand.js');

  checkIncludes('src/components/layout/Navbar.jsx', navbar, 'getBrandLabel', 'Global navbar is missing the promoted brand helper');
  checkIncludes('src/components/layout/Navbar.jsx', navbar, 'Detroit Dynamo home', 'Global navbar is missing Detroit Dynamo home labeling');
  checkIncludes('src/lib/brand.js', brand, 'DETROIT DYNAMO', 'Global brand helper is missing Detroit Dynamo label');
  checkIncludes('src/components/layout/Navbar.jsx', navbar, '/detroit-dynamo', 'Global navbar should link into Detroit Dynamo routes');
  checkIncludes('src/components/layout/Footer.jsx', footer, 'DETROIT DYNAMO', 'Global footer is missing Detroit Dynamo label');
  check(manifest.name === 'Detroit Dynamo', 'Manifest should be branded as Detroit Dynamo');
  check(manifest.short_name === 'Dynamo', 'Manifest short name should be Dynamo');
  check((manifest.icons || []).some((icon) => icon.src === '/detroit-dynamo/logo-primary.png'), 'Manifest should use Detroit Dynamo logo asset');
  check(indexHtml.includes('<title>Detroit Dynamo</title>'), 'Root HTML title should be Detroit Dynamo');
  check(indexHtml.includes('/detroit-dynamo/favicon.svg'), 'Root HTML favicon should use Detroit Dynamo favicon');
}

async function verifyNoUnconfirmedLeagueClaims() {
  const files = [
    'src/pages/detroit-dynamo/DetroitDynamoHome.jsx',
    'src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx',
    'src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx',
    'src/lib/detroitDynamoRouteManifest.js',
  ];
  const text = (await Promise.all(files.map(readProjectFile))).join('\n').toLowerCase();
  for (const phrase of prohibitedCurrentClaims) {
    check(!text.includes(phrase.toLowerCase()), `Found unconfirmed league-membership claim: "${phrase}"`);
  }
}

async function main() {
  await verifyHttpRoutes();
  verifyRouteManifest();
  await verifyAppRouteContracts();
  await verifyAdminModuleContracts();
  await verifyLeadFormContracts();
  await verifyDynamoPageFormCoverage();
  await verifyDynamoContentProofBoard();
  await verifyDynamoCurrentBookingFallbackLabels();
  await verifyPromotedGlobalBrand();
  await verifyNoUnconfirmedLeagueClaims();

  if (failures.length > 0) {
    console.error('Site smoke tests failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Site smoke tests passed against ${baseUrl}`);
  console.log(`Checked ${currentSiteRoutes.length} current routes, ${dynamoRoutes.length} Detroit Dynamo routes, and ${protectedDynamoAdminRoutes.length} protected Dynamo admin routes.`);
  console.log(`Verified ${requiredLeadVariants.length} lead variants, route metadata, admin action guards, promoted brand shell, and league-claim guardrails.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
