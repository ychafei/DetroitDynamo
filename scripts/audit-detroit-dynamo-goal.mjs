import fs from 'node:fs/promises';
import path from 'node:path';
import {
  detroitDynamoAliasRoutes,
  detroitDynamoAllRoutePaths,
  detroitDynamoRedirectPlan,
  detroitDynamoRouteManifest,
  detroitDynamoSitemapRoutes,
} from '../src/lib/detroitDynamoRouteManifest.js';
import {
  detroitDynamoAdminModules,
  detroitDynamoAdminModuleDetailRoutes,
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoBackendActivationSteps,
  detroitDynamoCollectionPlan,
  detroitDynamoDataModels,
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
} from '../src/lib/detroitDynamoLeadIntakeContract.js';
import {
  auditDetroitDynamoPipelineActionContract,
  buildDetroitDynamoPipelineActionFixtures,
  buildDetroitDynamoPipelineActionRejectionFixtures,
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
  auditDetroitDynamoAdminRecordWorkspaceReport,
  buildDetroitDynamoAdminRecordWorkspaceReport,
} from '../src/lib/detroitDynamoAdminRecordWorkspaceContract.js';
import {
  detroitDynamoAppwriteCollections,
  validateDetroitDynamoAppwriteSchema,
} from '../src/lib/detroitDynamoAppwriteSchema.js';

const root = process.cwd();
const artifactDir = path.join(root, 'artifacts/detroit-dynamo');
const failures = [];
const requirements = [];

const requiredCurrentRoutes = [
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

const requiredDynamoPaths = [
  '/detroit-dynamo',
  '/detroit-dynamo/training',
  '/detroit-dynamo/fc',
  '/detroit-dynamo/academy',
  '/detroit-dynamo/youth-club',
  '/detroit-dynamo/senior-men',
  '/detroit-dynamo/senior-women',
  '/detroit-dynamo/tryouts',
  '/detroit-dynamo/teams',
  '/detroit-dynamo/schedule-results',
  '/detroit-dynamo/camps-clinics',
  '/detroit-dynamo/sponsors',
  '/detroit-dynamo/about',
  '/detroit-dynamo/contact',
  '/detroit-dynamo/book',
  '/detroit-dynamo/brand',
  '/detroit-dynamo/admin-foundation',
];

const requiredModels = [
  'Player',
  'ParentGuardian',
  'Coach',
  'Team',
  'Program',
  'TrainingPackage',
  'TrainingSession',
  'Booking',
  'TryoutRegistration',
  'CampClinic',
  'Payment',
  'Waiver',
  'Sponsor',
  'NewsPost',
  'MatchFixture',
  'MatchResult',
  'ContactLead',
  'StaffMember',
];

const requiredLeadVariants = ['contact', 'training', 'youth', 'tryout', 'men', 'women', 'sponsor'];
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

const requiredDocsSections = [
  '## 1. Repo Audit Summary',
  '## 2. Main Issues Found',
  '## 3. Implementation Plan',
  '## 4. Files Changed in This Pass',
  '## 5. Features Added',
  '## 6. Still Needing Backend, Payment, or League Confirmation',
  '## 7. Testing Results',
  '## 8. Next Recommended Steps',
];

function record(id, requirement, status, evidence, details = '') {
  requirements.push({ id, requirement, status, evidence, details });
  if (status === 'fail') failures.push(`[${id}] ${requirement}: ${details || evidence}`);
}

function hasAll(text, needles) {
  return needles.every((needle) => text.includes(needle));
}

async function readProjectFile(file) {
  return fs.readFile(path.join(root, file), 'utf8');
}

async function fileExists(file) {
  try {
    await fs.access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

async function auditPromotedBrandShell() {
  const app = await readProjectFile('src/App.jsx');
  const indexHtml = await readProjectFile('index.html');
  const manifest = JSON.parse(await readProjectFile('public/manifest.json'));
  const navbar = await readProjectFile('src/components/layout/Navbar.jsx');
  const footer = await readProjectFile('src/components/layout/Footer.jsx');
  const brand = await readProjectFile('src/lib/brand.js');

  const routesPreserved = requiredCurrentRoutes.every((route) => (
    route === '/' ? app.includes('path="/"') : app.includes(`path="${route}"`)
  ));
  const promotedBrandApplied = indexHtml.includes('<title>Detroit Dynamo</title>')
    && indexHtml.includes('/detroit-dynamo/favicon.svg')
    && manifest.name === 'Detroit Dynamo'
    && manifest.short_name === 'Dynamo'
    && (manifest.icons || []).some((icon) => icon.src === '/detroit-dynamo/logo-primary.png')
    && hasAll(brand, ["'DETROIT DYNAMO'"]);
  const globalShellIsDynamo = navbar.includes('getBrandLabel')
    && navbar.includes('Detroit Dynamo home')
    && navbar.includes('/detroit-dynamo')
    && footer.includes('DETROIT DYNAMO')
    && !navbar.includes('LC Training')
    && !footer.includes('LC Training')
    && !navbar.includes('/logo.png')
    && !footer.includes('/logo.png');

  record(
    'promoted-brand-shell',
    'Detroit Dynamo is the global public brand while existing functional route registrations remain available.',
    routesPreserved && promotedBrandApplied && globalShellIsDynamo ? 'pass' : 'fail',
    'Checked src/App.jsx, index.html, public/manifest.json, shared navbar/footer, and src/lib/brand.js.',
    [
      routesPreserved ? '' : 'One or more legacy functional route registrations are missing.',
      promotedBrandApplied ? '' : 'Root metadata, PWA manifest, or brand helper still has old-brand values.',
      globalShellIsDynamo ? '' : 'Shared navbar/footer are not fully promoted to Detroit Dynamo.',
    ].filter(Boolean).join(' '),
  );
}

async function auditDetroitDynamoParallelSite() {
  const app = await readProjectFile('src/App.jsx');
  const layout = await readProjectFile('src/components/detroit-dynamo/DetroitDynamoLayout.jsx');
  const header = await readProjectFile('src/components/detroit-dynamo/DetroitDynamoHeader.jsx');
  const footer = await readProjectFile('src/components/detroit-dynamo/DetroitDynamoFooter.jsx');
  const styles = await readProjectFile('src/index.css');
  const paths = new Set(detroitDynamoAllRoutePaths);

  const routeCoverage = requiredDynamoPaths.every((route) => paths.has(route));
  const appUsesParallelShell = app.includes('<Route path="/detroit-dynamo" element={<DetroitDynamoLayout />}>')
    && app.includes('path="/detroit-dynamo-preview"')
    && layout.includes('dynamo-site')
    && layout.includes('useDetroitDynamoMeta');
  const shellIsolated = header.includes('Detroit Dynamo')
    && footer.includes('Detroit Dynamo')
    && !header.includes('LC Training')
    && !footer.includes('LC Training')
    && styles.includes('.dynamo-site');

  record(
    'parallel-dynamo-site',
    'Detroit Dynamo is a full parallel site under /detroit-dynamo with its own layout, header, footer, and scoped styles.',
    routeCoverage && appUsesParallelShell && shellIsolated ? 'pass' : 'fail',
    `Checked ${requiredDynamoPaths.length} required paths, DetroitDynamoLayout, header/footer, and scoped .dynamo-site styles.`,
    routeCoverage ? '' : 'One or more required Detroit Dynamo routes are missing from the route manifest.',
  );
}

async function auditPublicWebsiteContent() {
  const routeLabels = new Set(detroitDynamoRouteManifest.map((route) => route.label));
  const labelsPresent = [
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
    'About',
    'Contact',
  ].every((label) => routeLabels.has(label));
  const home = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoHome.jsx');
  const pages = [
    home,
    await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx'),
    await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx'),
  ].join('\n');
  const contentPresent = hasAll(pages, [
    'Book Training',
    'Register for Tryouts',
    'Join the Youth Club',
    'Sponsor Detroit Dynamo',
    'The Dynamo Development Pathway',
    'Testimonial-Ready',
    'News / Media',
    'Content Proof Board',
    'Proof Required Before Publishing',
    'U7-U8 Foundation',
    'Senior Men',
    'Senior Women',
    'Schedule & Results',
    'Goalkeeper Training',
  ]);
  const liveBookingCtas = home.includes('to="/book"')
    && home.includes('/book?county=')
    && home.includes('Live Booking Flow')
    && home.includes('Client Portal')
    && home.includes('Coach Portal')
    && home.includes('Admin Portal')
    && home.includes('Coach Data Loads From the Existing Platform')
    && pages.includes('Training Inquiry')
    && pages.includes('County Interest')
    && pages.includes('Program Interest')
    && pages.includes('defaultProgramInterest={programInterest}')
    && pages.includes('defaultNotes={contextNotes}');
  const tryoutRegistrationCtas = pages.includes('tryoutInterestHref')
    && pages.includes('Team Interest')
    && pages.includes('defaultTeamInterest={teamInterest}')
    && pages.includes('defaultNotes={teamNote}');
  const sponsorPackageCtas = pages.includes('sponsorPackageHref')
    && pages.includes('Sponsor Package Interest')
    && pages.includes('defaultPackageInterest={packageInterest}')
    && pages.includes('defaultNotes={packageNote}');
  const campClinicCtas = pages.includes('campClinicHref')
    && pages.includes('Clinic Interest')
    && pages.includes('defaultProgramInterest={defaultProgramInterest}')
    && pages.includes('defaultNotes={clinicNote}');
  const contactTopicCtas = pages.includes('contactTopicHref')
    && pages.includes('Inquiry Topic')
    && pages.includes('defaultNotes={topicNote}');
  const youthAgeGroupCtas = pages.includes('youthAgeGroupHref')
    && pages.includes('Age Group Interest')
    && pages.includes('defaultAgeGroupInterest={ageGroupInterest}')
    && pages.includes('defaultNotes={ageGroupNote}');

  record(
    'public-website-structure',
    'Public Detroit Dynamo pages cover the requested home, training, youth, senior, tryout, team, schedule, camp, sponsor, about, and contact experiences.',
    labelsPresent && contentPresent && liveBookingCtas && tryoutRegistrationCtas && sponsorPackageCtas && campClinicCtas && contactTopicCtas && youthAgeGroupCtas ? 'pass' : 'fail',
    'Checked route manifest labels and Detroit Dynamo page source for the requested sections, CTAs, pathway language, live booking handoff, portal access, coach section, secondary training inquiry, tryout team-interest handoff, sponsor package handoff, camp/clinic interest handoff, contact topic handoff, and youth age-group handoff.',
    [labelsPresent ? '' : 'One or more requested public page labels are missing from the route manifest.', liveBookingCtas ? '' : 'Dynamo homepage is missing live /book integration, portal links, coach visibility, or secondary training inquiry handoff.', tryoutRegistrationCtas ? '' : 'Dynamo tryout path CTAs are missing team-interest handoff into the registration form.', sponsorPackageCtas ? '' : 'Dynamo sponsor package CTAs are missing package-interest handoff into the inquiry form.', campClinicCtas ? '' : 'Dynamo camp/clinic CTAs are missing clinic-interest handoff into the inquiry form.', contactTopicCtas ? '' : 'Dynamo contact topic CTAs are missing topic handoff into the inquiry form.', youthAgeGroupCtas ? '' : 'Dynamo youth age-group CTAs are missing age-group handoff into the interest form.'].filter(Boolean).join('; '),
  );
}

async function auditFormsAndLeadSystem() {
  const leadForm = await readProjectFile('src/components/detroit-dynamo/DetroitDynamoLeadForm.jsx');
  const leadHelper = await readProjectFile('src/lib/detroitDynamoLeads.js');
  const pageSources = [
    await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoHome.jsx'),
    await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoSecondaryPages.jsx'),
    await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx'),
  ].join('\n');

  const variantsPresent = requiredLeadVariants.every((variant) => leadForm.includes(`${variant}:`));
  const labelsPresent = requiredFormLabels.every((label) => leadForm.includes(label));
  const statesPresent = hasAll(leadForm, ['validateForm', 'submitting', 'submittedLead', 'submitError', 'Submission Captured']);
  const persistencePresent = hasAll(leadHelper, [
    'saveDetroitDynamoLead',
    'getDetroitDynamoPreviewLeads',
    'getDetroitDynamoPreviewAuditEvents',
    'updateDetroitDynamoPreviewLeadPipelineStatus',
    'DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY',
    'pipeline_events',
    'audit_event_id',
    'DETROIT_DYNAMO_LEAD_BACKEND_STORAGE_KEY',
    'detroitDynamoLeadIntake',
  ]);
  const renderedVariants = ['contact', 'training', 'youth', 'tryout', 'sponsor'].every((variant) => pageSources.includes(`variant="${variant}"`))
    && pageSources.includes('formVariant="men"')
    && pageSources.includes('formVariant="women"');

  record(
    'forms-lead-system',
    'Detroit Dynamo forms include validation, loading, success, error states, all requested fields, and clean placeholder/Appwrite-ready lead persistence.',
    variantsPresent && labelsPresent && statesPresent && persistencePresent && renderedVariants ? 'pass' : 'fail',
    'Checked DetroitDynamoLeadForm, detroitDynamoLeads helper, and page-level form usage for all variants.',
    variantsPresent ? '' : 'One or more lead form variants are missing.',
  );
}

async function auditAdminAndDataFoundation() {
  const schemaErrors = validateDetroitDynamoAppwriteSchema();
  const pipelineSchemaIssues = [];
  const modelsPresent = requiredModels.every((model) => Object.hasOwn(detroitDynamoDataModels, model));
  const collectionModels = new Set(detroitDynamoCollectionPlan.map((item) => item.model));
  const collectionsPresent = requiredModels.every((model) => collectionModels.has(model));
  const adminAuditEventCollectionPresent = detroitDynamoAppwriteCollections.some((collection) => (
    collection.model === 'AdminAuditEvent'
    && collection.collectionId === 'dd_admin_audit_events'
    && collection.accessPolicy === 'server_function_append_admin_read'
    && collection.attributes.some((attribute) => attribute.key === 'actor_user_id')
    && collection.attributes.some((attribute) => attribute.key === 'target_record_id')
    && collection.indexes.some((index) => index.key === 'idx_target')
  ));
  const adminRoleAssignmentCollectionPresent = detroitDynamoAppwriteCollections.some((collection) => (
    collection.model === 'AdminRoleAssignment'
    && collection.collectionId === 'dd_admin_role_assignments'
    && collection.accessPolicy === 'master_admin_manage_function_read'
    && collection.attributes.some((attribute) => attribute.key === 'actor_user_id')
    && collection.attributes.some((attribute) => attribute.key === 'role')
    && collection.indexes.some((index) => index.key === 'idx_actor_role')
  ));
  const appwriteCollectionsPresent = detroitDynamoAppwriteCollections.length >= requiredModels.length
    && requiredModels.every((model) => {
      const collection = detroitDynamoAppwriteCollections.find((item) => item.model === model);
      return collection && collection.attributes.length > 0 && collection.indexes.length > 0;
    })
    && adminAuditEventCollectionPresent
    && adminRoleAssignmentCollectionPresent;
  const rolesAndModulesPresent = detroitDynamoAdminRoles.length >= 7
    && detroitDynamoAdminModules.length >= 16
    && Object.keys(detroitDynamoLeadRouting).length >= requiredLeadVariants.length;
  const structuredLeadRoutingPresent = requiredLeadVariants.every((variant) => {
    const routing = detroitDynamoLeadRouting[variant];
    return routing
      && routing.destinationModel
      && routing.ownerRole
      && routing.nextAction
      && Array.isArray(routing.destinationModels)
      && routing.destinationModels.length > 0
      && Array.isArray(routing.collectionIds)
      && routing.collectionIds.length > 0;
  })
    && detroitDynamoLeadRouting.training.destinationModels.includes('Booking')
    && detroitDynamoLeadRouting.tryout.destinationModels.includes('Player')
    && detroitDynamoLeadRouting.youth.destinationModels.includes('ParentGuardian')
    && detroitDynamoLeadRouting.sponsor.destinationModels.includes('Sponsor');
  const leadPipelineStatuses = new Set(detroitDynamoLeadPipelineStages.map((stage) => stage.status));
  const leadPipelinePresent = detroitDynamoLeadPipelineStages.length >= 6
    && requiredLeadVariants.every((variant) => detroitDynamoLeadPipelineByType[variant])
    && Object.values(detroitDynamoLeadPipelineByType).every((pipeline) => pipeline.defaultStatus === 'new'
      && Array.isArray(pipeline.requiredStages)
      && pipeline.requiredStages.includes('new')
      && pipeline.requiredStages.includes('contacted')
      && pipeline.collectionIds.length > 0)
    && detroitDynamoLeadPipelineStages.every((stage) => stage.status
      && stage.label
      && stage.ownerAction
      && Number.isFinite(stage.maxAgeHours)
      && stage.maxAgeHours > 0
      && Array.isArray(stage.appliesTo)
      && stage.appliesTo.length > 0
      && Array.isArray(stage.nextStatuses)
      && stage.nextStatuses.length > 0
      && stage.nextStatuses.every((status) => leadPipelineStatuses.has(status))
      && Array.isArray(stage.adminModules)
      && stage.adminModules.length > 0);
  const leadPipelineOperationIssues = auditDetroitDynamoLeadPipelineOperations();
  const leadPipelineOperationsPresent = leadPipelineOperationIssues.length === 0;
  const leadIntakeContractIssues = auditDetroitDynamoLeadIntakeContract();
  const leadIntakeSuccessFixtures = buildDetroitDynamoLeadIntakeFixtures();
  const leadIntakeRejectionFixtures = buildDetroitDynamoLeadIntakeRejectionFixtures();
  const leadIntakeContractPresent = leadIntakeContractIssues.length === 0
    && leadIntakeSuccessFixtures.length >= requiredLeadVariants.length
    && leadIntakeRejectionFixtures.length >= 4
    && requiredLeadVariants.every((variant) => leadIntakeSuccessFixtures.some((fixture) => fixture.leadType === variant));
  const pipelineActionContractIssues = auditDetroitDynamoPipelineActionContract();
  const pipelineActionSuccessFixtures = buildDetroitDynamoPipelineActionFixtures();
  const pipelineActionRejectionFixtures = buildDetroitDynamoPipelineActionRejectionFixtures();
  const pipelineActionContractPresent = pipelineActionContractIssues.length === 0
    && pipelineActionSuccessFixtures.length >= pipelineBackedModels.length
    && pipelineActionRejectionFixtures.length >= 3
    && pipelineBackedModels.every((model) => pipelineActionSuccessFixtures.some((fixture) => fixture.model === model))
    && pipelineActionSuccessFixtures.every((fixture) => fixture.expectedAuditEvent?.collectionId === 'dd_admin_audit_events'
      && fixture.expectedResponse.audit_event_id);
  const adminModuleReadContractIssues = auditDetroitDynamoAdminModuleReadContract();
  const adminModuleReadSuccessFixtures = buildDetroitDynamoAdminModuleReadFixtures();
  const adminModuleReadRejectionFixtures = buildDetroitDynamoAdminModuleReadRejectionFixtures();
  const adminModuleReadContractPresent = adminModuleReadContractIssues.length === 0
    && adminModuleReadSuccessFixtures.length >= 6
    && adminModuleReadRejectionFixtures.length >= 5
    && ['players', 'training-bookings', 'sponsors', 'teams', 'schedules-results', 'payments-packages'].every((moduleSlug) => (
      adminModuleReadSuccessFixtures.some((fixture) => fixture.moduleSlug === moduleSlug)
    ))
    && adminModuleReadSuccessFixtures.every((fixture) => fixture.expectedResponse.function_id === 'detroitDynamoAdminModuleRead'
      && fixture.expectedResponse.role_assignment_id);
  const adminRoleGrantContractIssues = auditDetroitDynamoAdminRoleGrantContract();
  const adminRoleGrantSuccessFixtures = buildDetroitDynamoAdminRoleGrantFixtures();
  const adminRoleGrantRejectionFixtures = buildDetroitDynamoAdminRoleGrantRejectionFixtures();
  const adminRoleGrantContractPresent = adminRoleGrantContractIssues.length === 0
    && adminRoleGrantSuccessFixtures.length >= 6
    && adminRoleGrantRejectionFixtures.length >= 6
    && ['grant_role', 'suspend_role', 'revoke_role', 'expire_role'].every((action) => (
      adminRoleGrantSuccessFixtures.some((fixture) => fixture.action === action)
    ))
    && adminRoleGrantSuccessFixtures.some((fixture) => fixture.id === 'bootstrap-master-admin-grant'
      && fixture.role === 'Master Admin')
    && adminRoleGrantSuccessFixtures.every((fixture) => fixture.expectedResponse.function_id === 'detroitDynamoAdminRoleGrantAction'
      && fixture.expectedResponse.audit_event_id
      && fixture.expectedAuditEvent?.collectionId === 'dd_admin_audit_events');
  const adminModuleWriteContractIssues = auditDetroitDynamoAdminModuleWriteContract();
  const adminModuleWriteSuccessFixtures = buildDetroitDynamoAdminModuleWriteFixtures();
  const adminModuleWriteRejectionFixtures = buildDetroitDynamoAdminModuleWriteRejectionFixtures();
  const adminModuleWriteContractPresent = adminModuleWriteContractIssues.length === 0
    && adminModuleWriteSuccessFixtures.length >= 6
    && adminModuleWriteRejectionFixtures.length >= 7
    && ['teams', 'players', 'news-posts', 'sponsors', 'schedules-results', 'website-content-sections'].every((moduleSlug) => (
      adminModuleWriteSuccessFixtures.some((fixture) => fixture.moduleSlug === moduleSlug)
    ))
    && adminModuleWriteSuccessFixtures.every((fixture) => fixture.expectedResponse.function_id === 'detroitDynamoAdminModuleWriteAction'
      && fixture.expectedResponse.audit_event_id
      && fixture.expectedAuditEvent?.collectionId === 'dd_admin_audit_events')
    && adminModuleWriteRejectionFixtures.some((fixture) => fixture.id === 'reject-external-gate-unconfirmed'
      && fixture.expectedResponse.httpStatus === 409)
    && adminModuleWriteRejectionFixtures.some((fixture) => fixture.id === 'reject-role-without-write-access'
      && fixture.expectedResponse.httpStatus === 403);
  const leadPipelineStatusValues = new Set(detroitDynamoLeadPipelineStages.map((stage) => stage.status));
  const pipelineSchemasPresent = pipelineBackedModels.every((model) => {
    const collection = detroitDynamoAppwriteCollections.find((item) => item.model === model);
    if (!collection) {
      pipelineSchemaIssues.push(`Missing pipeline-backed Appwrite schema for ${model}`);
      return false;
    }

    const attributes = new Map(collection.attributes.map((attribute) => [attribute.key, attribute]));
    const indexes = new Set(collection.indexes.map((index) => index.key));
    const hasFields = pipelineAttributeKeys.every((key) => attributes.has(key));
    const pipelineStatus = attributes.get('pipeline_status');
    const statusOk = pipelineStatus?.type === 'enum'
      && pipelineStatus.default === 'new'
      && [...leadPipelineStatusValues].every((status) => pipelineStatus.elements.includes(status));
    const indexesOk = ['idx_pipeline_status', 'idx_pipeline_owner', 'idx_pipeline_due'].every((key) => indexes.has(key));

    if (!hasFields) pipelineSchemaIssues.push(`${model} is missing one or more pipeline fields`);
    if (!statusOk) pipelineSchemaIssues.push(`${model}.pipeline_status does not match the shared pipeline statuses`);
    if (!indexesOk) pipelineSchemaIssues.push(`${model} is missing one or more pipeline indexes`);
    return hasFields && statusOk && indexesOk;
  });
  const validAccessLevels = new Set(['admin', 'manage', 'approve', 'contribute', 'view', 'none']);
  const roleNames = new Set(detroitDynamoRolePermissionMatrix.map((item) => item.role));
  const rolePermissionMatrixPresent = detroitDynamoAdminRoles.every((role) => roleNames.has(role))
    && detroitDynamoRolePermissionMatrix.every((role) => {
      const modules = new Set(role.permissions.map((item) => item.module));
      return detroitDynamoAdminModules.every((module) => modules.has(module))
        && role.permissions.every((item) => validAccessLevels.has(item.access) && item.scope)
        && Array.isArray(role.sensitiveControls);
    });
  const accessPolicyIssues = auditDetroitDynamoAccessPolicy();
  const accessPolicyPresent = detroitDynamoRoleAccessSummaries.length === detroitDynamoRolePermissionMatrix.length
    && detroitDynamoRoleAccessSummaries.every((role) => Array.isArray(role.controlModules)
      && Array.isArray(role.contributeModules)
      && Array.isArray(role.viewOnlyModules)
      && Array.isArray(role.blockedModules))
    && accessPolicyIssues.length === 0;
  const actionGuardIssues = auditDetroitDynamoActionGuards();
  const actionGuardsPresent = detroitDynamoModuleActionGuards.length === detroitDynamoAdminModuleRegistry.length
    && detroitDynamoModuleActionGuards.every((guard) => guard.actions.length >= 3
      && guard.actions.every((action) => action.requiredAccess
        && action.permittedRoles.length > 0
        && action.permittedOwnerRoles.length > 0))
    && actionGuardIssues.length === 0;
  const recordDraftIssues = auditDetroitDynamoRecordDrafts();
  const recordDraftMapPresent = requiredLeadVariants.every((variant) => detroitDynamoLeadRecordDraftMap[variant])
    && ['ContactLead', 'Booking', 'Player', 'ParentGuardian', 'TryoutRegistration', 'Sponsor', 'Team'].every((model) => (
      Object.values(detroitDynamoLeadRecordDraftMap).some((item) => item.models.includes(model))
    ))
    && recordDraftIssues.length === 0;
  const adminRecordWorkspaceReport = buildDetroitDynamoAdminRecordWorkspaceReport();
  const adminRecordWorkspaceIssues = auditDetroitDynamoAdminRecordWorkspaceReport(adminRecordWorkspaceReport);
  const adminRecordWorkspaceContractPresent = adminRecordWorkspaceIssues.length === 0
    && adminRecordWorkspaceReport.flattenedRecords.length >= 3
    && adminRecordWorkspaceReport.coveredHelpers.length >= 7
    && adminRecordWorkspaceReport.incompletePlayerProfile.missingRequiredFields.includes('date_of_birth')
    && adminRecordWorkspaceReport.preparedArchive.status === 'archived';
  const collectionIds = new Set(detroitDynamoCollectionPlan.map((item) => item.collectionId));
  const moduleSlugs = new Set(detroitDynamoAdminModuleRegistry.map((item) => item.slug));
  const adminModuleRegistryPresent = detroitDynamoAdminModuleRegistry.length === detroitDynamoAdminModules.length
    && detroitDynamoAdminModuleDetailRoutes.length === detroitDynamoAdminModuleRegistry.length
    && moduleSlugs.size === detroitDynamoAdminModuleRegistry.length
    && detroitDynamoAdminModules.every((module) => detroitDynamoAdminModuleRegistry.some((item) => item.module === module))
    && detroitDynamoAdminModuleRegistry.every((item) => item.purpose
      && item.slug
      && detroitDynamoAdminModuleDetailRoutes.includes(`/admin/detroit-dynamo/modules/${item.slug}`)
      && item.launchPhase
      && item.status
      && item.blockedUntil
      && Array.isArray(item.primaryModels)
      && item.primaryModels.length > 0
      && Array.isArray(item.collectionIds)
      && item.collectionIds.length > 0
      && item.collectionIds.every((collectionId) => collectionIds.has(collectionId))
      && Array.isArray(item.ownerRoles)
      && item.ownerRoles.every((role) => detroitDynamoAdminRoles.includes(role))
      && Array.isArray(item.enabledActions)
      && item.enabledActions.length >= 3);
  const functionSource = await readProjectFile('functions/detroitDynamoLeadIntake/src/main.js');
  const pipelineActionSource = await readProjectFile('functions/detroitDynamoLeadPipelineAction/src/main.js');
  const adminModuleReadSource = await readProjectFile('functions/detroitDynamoAdminModuleRead/src/main.js');
  const adminModuleReadHelperSource = await readProjectFile('src/lib/detroitDynamoAdminModuleReads.js');
  const adminRecordWorkspaceHelperSource = await readProjectFile('src/lib/detroitDynamoAdminRecordWorkspace.js');
  const adminRecordWorkspaceContractSource = await readProjectFile('src/lib/detroitDynamoAdminRecordWorkspaceContract.js');
  const adminRoleGrantSource = await readProjectFile('functions/detroitDynamoAdminRoleGrantAction/src/main.js');
  const adminModuleWriteSource = await readProjectFile('functions/detroitDynamoAdminModuleWriteAction/src/main.js');
  const adminRoleGrantHelperSource = await readProjectFile('src/lib/detroitDynamoAdminRoleGrants.js');
  const adminModuleWriteHelperSource = await readProjectFile('src/lib/detroitDynamoAdminModuleWrites.js');
  const protectedAdminSource = await readProjectFile('src/pages/admin/AdminDetroitDynamo.jsx');
  const moduleDetailSource = await readProjectFile('src/pages/admin/AdminDetroitDynamoModule.jsx');
  const publicAdminFoundationSource = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx');
  const intakeFunctionScaffoldPresent = await fileExists('functions/detroitDynamoLeadIntake/src/main.js')
    && (await readProjectFile('appwrite.json')).includes('"$id": "detroitDynamoLeadIntake"')
    && [
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
    ].every((needle) => functionSource.includes(needle));
  const pipelineActionFunctionPresent = await fileExists('functions/detroitDynamoLeadPipelineAction/src/main.js')
    && (await readProjectFile('appwrite.json')).includes('"$id": "detroitDynamoLeadPipelineAction"')
    && [
      'dd_contact_leads',
      'dd_bookings',
      'dd_tryout_registrations',
      'dd_sponsors',
      'dd_admin_audit_events',
      'pipeline_status',
      'pipeline_owner_role',
      'pipeline_due_at',
      'currentStage.nextStatuses.includes',
      'databases.updateDocument',
      'databases.createDocument',
      'audit_event_id',
    ].every((needle) => pipelineActionSource.includes(needle));
  const adminModuleReadFunctionPresent = await fileExists('functions/detroitDynamoAdminModuleRead/src/main.js')
    && (await readProjectFile('appwrite.json')).includes('"$id": "detroitDynamoAdminModuleRead"')
    && [
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
    ].every((needle) => adminModuleReadSource.includes(needle));
  const adminRoleGrantFunctionPresent = await fileExists('functions/detroitDynamoAdminRoleGrantAction/src/main.js')
    && (await readProjectFile('appwrite.json')).includes('"$id": "detroitDynamoAdminRoleGrantAction"')
    && [
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
    ].every((needle) => adminRoleGrantSource.includes(needle));
  const adminModuleWriteFunctionPresent = await fileExists('functions/detroitDynamoAdminModuleWriteAction/src/main.js')
    && (await readProjectFile('appwrite.json')).includes('"$id": "detroitDynamoAdminModuleWriteAction"')
    && [
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
      'APPWRITE_API_KEY',
    ].every((needle) => adminModuleWriteSource.includes(needle));
  const functionScaffoldPresent = intakeFunctionScaffoldPresent
    && pipelineActionFunctionPresent
    && adminModuleReadFunctionPresent
    && adminRoleGrantFunctionPresent
    && adminModuleWriteFunctionPresent;
  const leadIntakeContractSurfaced = protectedAdminSource.includes('PUBLIC FORM HANDOFF CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoLeadIntakeContractReport')
    && publicAdminFoundationSource.includes('Form Submission Handoff Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoLeadIntakeContractReport');
  const pipelineActionContractSurfaced = protectedAdminSource.includes('LIVE STATUS MUTATION CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoPipelineActionContractReport')
    && protectedAdminSource.includes('LOCAL AUDIT EVENT LEDGER')
    && protectedAdminSource.includes('getDetroitDynamoPreviewAuditEvents')
    && moduleDetailSource.includes('MODULE AUDIT EVENT LEDGER')
    && moduleDetailSource.includes('getDetroitDynamoPreviewAuditEvents')
    && publicAdminFoundationSource.includes('Pipeline Status Mutation Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoPipelineActionContractReport');
  const adminModuleReadContractSurfaced = protectedAdminSource.includes('LIVE MODULE READ CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoAdminModuleReadContractReport')
    && publicAdminFoundationSource.includes('Admin Module Read Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoAdminModuleReadContractReport');
  const adminModuleReadControlsPresent = moduleDetailSource.includes('MODULE READ ACTION CONSOLE')
    && moduleDetailSource.includes('submitDetroitDynamoAdminModuleReadAction')
    && moduleDetailSource.includes('setDetroitDynamoModuleReadBackendMode')
    && moduleDetailSource.includes('MODULE READ LEDGER')
    && [
      'DETROIT_DYNAMO_MODULE_READ_BACKEND_STORAGE_KEY',
      'DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY',
      'validateDetroitDynamoAdminModuleReadPayload',
      'submitDetroitDynamoAdminModuleReadAction',
      'rpc.invoke',
      'preview_module_read_captured',
      'preview_module_read_after_action_error',
      'appwrite_module_read_submitted',
      'detroitDynamoAdminModuleReadDefaultLimit',
    ].every((needle) => adminModuleReadHelperSource.includes(needle));
  const adminModuleRecordWorkspacePresent = moduleDetailSource.includes('MODULE RECORD WORKSPACE')
    && moduleDetailSource.includes('detroitDynamoAdminRecordWorkspace')
    && moduleDetailSource.includes('moduleRecordCollections')
    && moduleDetailSource.includes('moduleFilteredRecords')
    && moduleDetailSource.includes('modulePaginatedRecords')
    && moduleDetailSource.includes('moduleRecordPageCount')
    && moduleDetailSource.includes('downloadModuleRecordsCsv')
    && moduleDetailSource.includes('RECORD DETAIL PREVIEW')
    && moduleDetailSource.includes('Field Display Profile')
    && moduleDetailSource.includes('selectedModuleFieldRows')
    && moduleDetailSource.includes('prepareModuleRecordWriteAction')
    && moduleDetailSource.includes('Missing required')
    && moduleDetailSource.includes('Prepare Update')
    && moduleDetailSource.includes('Prepare Archive')
    && moduleDetailSource.includes('Export CSV')
    && [
      'flattenDetroitDynamoModuleRecordCollections',
      'buildDetroitDynamoModuleRecordCsv',
      'buildDetroitDynamoRecordFieldRows',
      'buildDetroitDynamoCollectionDisplayProfile',
      'buildDetroitDynamoPreparedRecordPayload',
      'missingRequiredFields',
      'protected-module-record-workspace',
    ].every((needle) => adminRecordWorkspaceHelperSource.includes(needle))
    && [
      'buildDetroitDynamoAdminRecordWorkspaceReport',
      'auditDetroitDynamoAdminRecordWorkspaceReport',
      'buildDetroitDynamoAdminRecordWorkspaceMarkdown',
      'player-missing-dob',
    ].every((needle) => adminRecordWorkspaceContractSource.includes(needle));
  const adminRecordWorkspaceContractSurfaced = protectedAdminSource.includes('LIVE RECORD WORKSPACE CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoAdminRecordWorkspaceReport')
    && publicAdminFoundationSource.includes('Admin Record Workspace Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoAdminRecordWorkspaceReport');
  const adminRoleGrantContractSurfaced = protectedAdminSource.includes('LIVE ROLE GRANT CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoAdminRoleGrantContractReport')
    && publicAdminFoundationSource.includes('Admin Role Grant Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoAdminRoleGrantContractReport');
  const adminModuleWriteContractSurfaced = protectedAdminSource.includes('LIVE MODULE WRITE CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoAdminModuleWriteContractReport')
    && publicAdminFoundationSource.includes('Admin Module Write Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoAdminModuleWriteContractReport');
  const adminRoleGrantControlsPresent = protectedAdminSource.includes('ROLE GRANT ACTION CONSOLE')
    && protectedAdminSource.includes('submitDetroitDynamoAdminRoleGrantAction')
    && protectedAdminSource.includes('setDetroitDynamoRoleGrantBackendMode')
    && protectedAdminSource.includes('Recent Preview Role Actions')
    && [
      'DETROIT_DYNAMO_ROLE_GRANT_BACKEND_STORAGE_KEY',
      'DETROIT_DYNAMO_ROLE_GRANT_STORAGE_KEY',
      'validateDetroitDynamoAdminRoleGrantPayload',
      'submitDetroitDynamoAdminRoleGrantAction',
      'rpc.invoke',
      'preview_role_grant_captured',
      'preview_role_grant_after_action_error',
      'appwrite_role_grant_submitted',
    ].every((needle) => adminRoleGrantHelperSource.includes(needle));
  const adminModuleWriteControlsPresent = moduleDetailSource.includes('MODULE WRITE ACTION CONSOLE')
    && moduleDetailSource.includes('submitDetroitDynamoAdminModuleWriteAction')
    && moduleDetailSource.includes('setDetroitDynamoModuleWriteBackendMode')
    && moduleDetailSource.includes('MODULE WRITE LEDGER')
    && [
      'DETROIT_DYNAMO_MODULE_WRITE_BACKEND_STORAGE_KEY',
      'DETROIT_DYNAMO_MODULE_WRITE_STORAGE_KEY',
      'validateDetroitDynamoAdminModuleWritePayload',
      'submitDetroitDynamoAdminModuleWriteAction',
      'rpc.invoke',
      'preview_module_write_captured',
      'preview_module_write_after_action_error',
      'appwrite_module_write_submitted',
      'admin_module_write_action',
      'DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY',
    ].every((needle) => adminModuleWriteHelperSource.includes(needle));
  const externalGateContractSurfaced = protectedAdminSource.includes('CHECKOUT AND SIGNATURE SAFETY CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoExternalGateContractReport')
    && moduleDetailSource.includes('EXTERNAL READINESS GATES')
    && moduleDetailSource.includes('buildDetroitDynamoExternalGateContractReport')
    && publicAdminFoundationSource.includes('Checkout and Signature Safety Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoExternalGateContractReport');
  const claimSafetyIssues = auditDetroitDynamoClaimSafetyContract();
  const claimSafetyReport = buildDetroitDynamoClaimSafetyContractReport();
  const claimSafetyContractPresent = claimSafetyIssues.length === 0
    && claimSafetyReport.claimSafetyTracks.length >= 7
    && claimSafetyReport.claimSafetyTracks.every((track) => track.confirmationStatus !== 'confirmed')
    && claimSafetyReport.claimSafetyTracks.some((track) => track.id === 'league-competition-pathway' && track.confirmationStatus === 'future_pathway');
  const claimSafetyContractSurfaced = protectedAdminSource.includes('PUBLIC CLAIM SAFETY CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoClaimSafetyContractReport')
    && moduleDetailSource.includes('CLAIM SAFETY GUARDS')
    && moduleDetailSource.includes('buildDetroitDynamoClaimSafetyContractReport')
    && publicAdminFoundationSource.includes('Public Claim Safety Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoClaimSafetyContractReport');
  const promotionCutoverIssues = auditDetroitDynamoPromotionCutoverContract();
  const promotionCutoverReport = buildDetroitDynamoPromotionCutoverReport();
  const promotionCutoverContractPresent = promotionCutoverIssues.length === 0
    && promotionCutoverReport.cutoverTracks.length >= 9
    && promotionCutoverReport.cutoverTracks.every((track) => !['live', 'complete', 'promoted'].includes(track.status))
    && promotionCutoverReport.cutoverTracks.some((track) => track.id === 'legal-support-communications');
  const promotionCutoverContractSurfaced = protectedAdminSource.includes('PROMOTION CUTOVER CONTROL')
    && protectedAdminSource.includes('buildDetroitDynamoPromotionCutoverReport')
    && publicAdminFoundationSource.includes('Promotion Cutover Control')
    && publicAdminFoundationSource.includes('buildDetroitDynamoPromotionCutoverReport');
  const safeguardingIssues = auditDetroitDynamoSafeguardingContract();
  const safeguardingReport = buildDetroitDynamoSafeguardingReport();
  const safeguardingContractPresent = safeguardingIssues.length === 0
    && safeguardingReport.safeguardingTracks.length >= 8
    && safeguardingReport.safeguardingTracks.every((track) => !['live', 'active', 'approved'].includes(track.activationStatus))
    && safeguardingReport.safeguardingTracks.some((track) => track.id === 'minor-intake-guardian-consent');
  const safeguardingContractSurfaced = protectedAdminSource.includes('SAFEGUARDING AND DATA PRIVACY CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoSafeguardingReport')
    && moduleDetailSource.includes('SAFEGUARDING PRIVACY GUARDS')
    && moduleDetailSource.includes('buildDetroitDynamoSafeguardingReport')
    && publicAdminFoundationSource.includes('Safeguarding and Data Privacy Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoSafeguardingReport');
  const backendActivationPresent = detroitDynamoBackendActivationSteps.length >= 8
    && detroitDynamoBackendActivationSteps[0].command === 'npm run preflight:dynamo-backend'
    && detroitDynamoBackendActivationSteps.some((item) => item.command.includes('provision:dynamo-appwrite -- --apply'))
    && detroitDynamoBackendActivationSteps.some((item) => item.title.includes('Submit Production-Preview Test Leads'));

  record(
    'admin-data-foundation',
    'Admin roles, modules, lead routing, Appwrite-ready schemas, and the lead intake function scaffold cover the requested club operating model.',
    modelsPresent && collectionsPresent && appwriteCollectionsPresent && rolesAndModulesPresent && structuredLeadRoutingPresent && leadPipelinePresent && leadPipelineOperationsPresent && leadIntakeContractPresent && leadIntakeContractSurfaced && pipelineActionContractPresent && pipelineActionContractSurfaced && adminModuleReadContractPresent && adminModuleReadContractSurfaced && adminModuleReadControlsPresent && adminModuleRecordWorkspacePresent && adminRecordWorkspaceContractPresent && adminRecordWorkspaceContractSurfaced && adminRoleGrantContractPresent && adminRoleGrantContractSurfaced && adminRoleGrantControlsPresent && adminModuleWriteContractPresent && adminModuleWriteContractSurfaced && adminModuleWriteControlsPresent && externalGateContractSurfaced && claimSafetyContractPresent && claimSafetyContractSurfaced && promotionCutoverContractPresent && promotionCutoverContractSurfaced && safeguardingContractPresent && safeguardingContractSurfaced && pipelineSchemasPresent && rolePermissionMatrixPresent && accessPolicyPresent && adminModuleRegistryPresent && actionGuardsPresent && recordDraftMapPresent && functionScaffoldPresent && backendActivationPresent && schemaErrors.length === 0 ? 'pass' : 'fail',
    `Checked ${requiredModels.length} models, ${detroitDynamoAppwriteCollections.length} Appwrite collections, ${detroitDynamoAdminRoles.length} roles, ${detroitDynamoAdminModules.length} modules, ${detroitDynamoAdminModuleRegistry.length} module registry entries, ${detroitDynamoRolePermissionMatrix.length} role permission rows, ${detroitDynamoRoleAccessSummaries.length} access summaries, ${detroitDynamoModuleActionGuards.length} action guard groups, ${Object.keys(detroitDynamoLeadRecordDraftMap).length} record draft maps, ${adminRecordWorkspaceReport.flattenedRecords.length} admin record workspace fixtures, ${detroitDynamoLeadPipelineStages.length} lead pipeline stages, ${pipelineBackedModels.length} pipeline-backed schemas, ${leadIntakeSuccessFixtures.length} lead intake success fixtures, ${leadIntakeRejectionFixtures.length} lead intake rejection fixtures, ${pipelineActionSuccessFixtures.length} pipeline action success fixtures, ${pipelineActionRejectionFixtures.length} pipeline action rejection fixtures, ${adminModuleReadSuccessFixtures.length} admin module read success fixtures, ${adminModuleReadRejectionFixtures.length} admin module read rejection fixtures, ${adminRoleGrantSuccessFixtures.length} admin role grant success fixtures, ${adminRoleGrantRejectionFixtures.length} admin role grant rejection fixtures, ${adminModuleWriteSuccessFixtures.length} admin module write success fixtures, ${adminModuleWriteRejectionFixtures.length} admin module write rejection fixtures, ${claimSafetyReport.claimSafetyTracks.length} claim-safety tracks, ${promotionCutoverReport.cutoverTracks.length} promotion cutover tracks, ${safeguardingReport.safeguardingTracks.length} safeguarding tracks, 5 function scaffolds, and ${detroitDynamoBackendActivationSteps.length} backend activation steps.`,
    [...schemaErrors, ...pipelineSchemaIssues, ...accessPolicyIssues, ...actionGuardIssues, ...recordDraftIssues, ...adminRecordWorkspaceIssues, ...leadPipelineOperationIssues, ...leadIntakeContractIssues, ...pipelineActionContractIssues, ...adminModuleReadContractIssues, ...adminRoleGrantContractIssues, ...adminModuleWriteContractIssues, ...(adminAuditEventCollectionPresent ? [] : ['AdminAuditEvent collection is not provision-scaffolded']), ...(adminRoleAssignmentCollectionPresent ? [] : ['AdminRoleAssignment collection is not provision-scaffolded']), ...claimSafetyIssues, ...promotionCutoverIssues, ...safeguardingIssues, ...(leadIntakeContractSurfaced ? [] : ['Lead intake handoff is not surfaced in admin foundation UI']), ...(pipelineActionContractSurfaced ? [] : ['Pipeline action handoff is not surfaced in admin foundation UI']), ...(adminModuleReadContractSurfaced ? [] : ['Admin module read handoff is not surfaced in admin foundation UI']), ...(adminModuleReadControlsPresent ? [] : ['Admin module read action console/helper is not surfaced in protected module UI']), ...(adminModuleRecordWorkspacePresent ? [] : ['Admin module record workspace is not surfaced in protected module UI']), ...(adminRecordWorkspaceContractSurfaced ? [] : ['Admin record workspace contract is not surfaced in admin foundation UI']), ...(adminRoleGrantContractSurfaced ? [] : ['Admin role grant handoff is not surfaced in admin foundation UI']), ...(adminRoleGrantControlsPresent ? [] : ['Admin role grant action console/helper is not surfaced in protected admin UI']), ...(adminModuleWriteContractSurfaced ? [] : ['Admin module write handoff is not surfaced in admin foundation UI']), ...(adminModuleWriteControlsPresent ? [] : ['Admin module write action console/helper is not surfaced in protected module UI']), ...(adminModuleWriteFunctionPresent ? [] : ['Admin module write function scaffold is missing expected guards']), ...(externalGateContractSurfaced ? [] : ['Payment/waiver gate contract is not surfaced in admin foundation UI']), ...(claimSafetyContractSurfaced ? [] : ['Public claim-safety contract is not surfaced in admin foundation UI']), ...(promotionCutoverContractSurfaced ? [] : ['Promotion cutover contract is not surfaced in admin foundation UI']), ...(safeguardingContractSurfaced ? [] : ['Safeguarding/privacy contract is not surfaced in admin foundation UI'])].join('; '),
  );
}

async function auditBrandSeoAndLaunchPlanning() {
  const metaHook = await readProjectFile('src/components/detroit-dynamo/useDetroitDynamoMeta.js');
  const protectedAdminSource = await readProjectFile('src/pages/admin/AdminDetroitDynamo.jsx');
  const moduleDetailSource = await readProjectFile('src/pages/admin/AdminDetroitDynamoModule.jsx');
  const publicAdminFoundationSource = await readProjectFile('src/pages/detroit-dynamo/DetroitDynamoClubPages.jsx');
  const requiredAssets = [
    'public/detroit-dynamo/logo-primary.png',
    'public/detroit-dynamo/favicon.svg',
    'public/detroit-dynamo/detroit-dynamo-mark.svg',
    'public/detroit-dynamo/home-kit-reference.png',
    'public/detroit-dynamo/away-kit-reference.png',
    'public/detroit-dynamo/digital-reference.png',
    'public/detroit-dynamo/applications-reference.png',
  ];

  const assetsPresent = (await Promise.all(requiredAssets.map(fileExists))).every(Boolean);
  const seoReady = detroitDynamoSitemapRoutes.length >= 12
    && detroitDynamoRouteManifest.every((route) => route.title && route.description)
    && detroitDynamoAliasRoutes.length >= 4
    && detroitDynamoRedirectPlan.length >= 6;
  const promotedMetaPresent = hasAll(metaHook, [
    'index,follow',
    'DYNAMO_SOCIAL_IMAGE',
    'og:image',
    'twitter:card',
    'summary_large_image',
    'canonical',
  ]);
  const launchPlanPresent = detroitDynamoLaunchReadiness.length >= 6
    && detroitDynamoPromotionGates.length >= 6
    && detroitDynamoLaunchReadiness.some((item) => item.category === 'League/Competition' && item.status === 'future_pathway');
  const confirmationRegisterPresent = detroitDynamoExternalConfirmationRegister.length >= 6
    && detroitDynamoExternalConfirmationRegister.some((item) => item.area === 'League & Competition Facts' && item.status === 'future_pathway')
    && detroitDynamoExternalConfirmationRegister.every((item) => item.requiredFacts.length >= 4 && item.publishRule && item.nextAction);
  const externalGateIssues = auditDetroitDynamoExternalGateContracts();
  const externalGateReport = buildDetroitDynamoExternalGateContractReport();
  const claimSafetyIssues = auditDetroitDynamoClaimSafetyContract();
  const claimSafetyReport = buildDetroitDynamoClaimSafetyContractReport();
  const promotionCutoverIssues = auditDetroitDynamoPromotionCutoverContract();
  const promotionCutoverReport = buildDetroitDynamoPromotionCutoverReport();
  const launchEvidenceReport = buildDetroitDynamoLaunchEvidenceReport();
  const launchEvidenceIssues = auditDetroitDynamoLaunchEvidenceReport(launchEvidenceReport);
  const launchEvidenceActionReport = buildDetroitDynamoLaunchEvidenceActionReport();
  const launchEvidenceActionIssues = auditDetroitDynamoLaunchEvidenceActionReport(launchEvidenceActionReport);
  const externalConfirmationActionReport = buildDetroitDynamoExternalConfirmationActionReport();
  const externalConfirmationActionIssues = auditDetroitDynamoExternalConfirmationActionReport(externalConfirmationActionReport);
  const ownerLaunchReviewReport = buildDetroitDynamoOwnerLaunchReviewReport();
  const ownerLaunchReviewIssues = auditDetroitDynamoOwnerLaunchReviewReport(ownerLaunchReviewReport);
  const ownerEvidenceIntakeReport = buildDetroitDynamoOwnerEvidenceIntakeReport();
  const ownerEvidenceIntakeIssues = auditDetroitDynamoOwnerEvidenceIntakeReport(ownerEvidenceIntakeReport);
  const productionPreviewEvidenceReport = buildDetroitDynamoProductionPreviewEvidenceReport();
  const productionPreviewEvidenceIssues = auditDetroitDynamoProductionPreviewEvidenceReport(productionPreviewEvidenceReport);
  const liveReadinessBoardReport = buildDetroitDynamoLiveReadinessBoardReport();
  const liveReadinessBoardIssues = auditDetroitDynamoLiveReadinessBoardReport(liveReadinessBoardReport);
  const launchArtifactIndexReport = buildDetroitDynamoLaunchArtifactIndexReport();
  const launchArtifactIndexIssues = auditDetroitDynamoLaunchArtifactIndexReport(launchArtifactIndexReport);
  const deploymentReadinessReport = buildDetroitDynamoDeploymentReadinessReport();
  const deploymentReadinessIssues = auditDetroitDynamoDeploymentReadinessReport(deploymentReadinessReport);
  const vercelPreviewRunbookReport = buildDetroitDynamoVercelPreviewRunbookReport();
  const vercelPreviewRunbookIssues = auditDetroitDynamoVercelPreviewRunbookReport(vercelPreviewRunbookReport);
  const secretRedactionReport = buildDetroitDynamoSecretRedactionReport();
  const secretRedactionIssues = auditDetroitDynamoSecretRedactionReport(secretRedactionReport);
  const externalGateClosureReport = buildDetroitDynamoExternalGateClosureReport();
  const externalGateClosureIssues = auditDetroitDynamoExternalGateClosureReport(externalGateClosureReport);
  const ownerHandoffPacketReport = buildDetroitDynamoOwnerHandoffPacketReport();
  const ownerHandoffPacketIssues = auditDetroitDynamoOwnerHandoffPacketReport(ownerHandoffPacketReport);
  const ownerSignoffRegisterReport = buildDetroitDynamoOwnerSignoffRegisterReport();
  const ownerSignoffRegisterIssues = auditDetroitDynamoOwnerSignoffRegisterReport(ownerSignoffRegisterReport);
  const finalAcceptanceMatrixReport = buildDetroitDynamoFinalAcceptanceMatrixReport();
  const finalAcceptanceMatrixIssues = auditDetroitDynamoFinalAcceptanceMatrixReport(finalAcceptanceMatrixReport);
  const safeguardingIssues = auditDetroitDynamoSafeguardingContract();
  const safeguardingReport = buildDetroitDynamoSafeguardingReport();
  const externalGateContractsPresent = externalGateIssues.length === 0
    && externalGateReport.paymentPackageTracks.length >= 6
    && externalGateReport.waiverTracks.length >= 6
    && externalGateReport.paymentPackageTracks.every((track) => track.providerStatus === 'not_connected')
    && externalGateReport.waiverTracks.every((track) => track.signatureMode === 'not_enabled');
  const claimSafetyContractsPresent = claimSafetyIssues.length === 0
    && claimSafetyReport.claimSafetyTracks.length >= 7
    && claimSafetyReport.claimSafetyTracks.every((track) => track.confirmationStatus !== 'confirmed')
    && claimSafetyReport.claimSafetyTracks.some((track) => track.id === 'league-competition-pathway' && track.confirmationStatus === 'future_pathway');
  const promotionCutoverContractsPresent = promotionCutoverIssues.length === 0
    && promotionCutoverReport.cutoverTracks.length >= 9
    && promotionCutoverReport.cutoverTracks.every((track) => !['live', 'complete', 'promoted'].includes(track.status))
    && promotionCutoverReport.cutoverTracks.some((track) => track.id === 'legal-support-communications');
  const launchEvidenceContractPresent = launchEvidenceIssues.length === 0
    && launchEvidenceReport.checklistItems.length >= 13
    && launchEvidenceReport.checklistItems.some((item) => item.id === 'backend-preflight-and-provisioning')
    && launchEvidenceReport.checklistItems.some((item) => item.id === 'payment-package-approval')
    && launchEvidenceReport.checklistItems.some((item) => item.id === 'waiver-legal-version-approval')
    && launchEvidenceReport.checklistItems.some((item) => item.id === 'seo-metadata-noindex-approval' && item.status === 'preview_only');
  const launchEvidenceActionContractPresent = launchEvidenceActionIssues.length === 0
    && launchEvidenceActionReport.actions.length >= 4
    && launchEvidenceActionReport.summary.liveGatesCleared === 0
    && launchEvidenceActionReport.actions.some((item) => item.action === 'attach_evidence')
    && launchEvidenceActionReport.actions.some((item) => item.action === 'record_preview_signoff');
  const externalConfirmationActionContractPresent = externalConfirmationActionIssues.length === 0
    && externalConfirmationActionReport.actions.length >= detroitDynamoExternalConfirmationRegister.length
    && externalConfirmationActionReport.summary.liveGatesCleared === 0
    && externalConfirmationActionReport.summary.publicationsUnlocked === 0
    && externalConfirmationActionReport.actions.some((item) => item.action === 'attach_confirmation_evidence')
    && externalConfirmationActionReport.actions.some((item) => item.action === 'record_preview_decision');
  const ownerLaunchReviewContractPresent = ownerLaunchReviewIssues.length === 0
    && ownerLaunchReviewReport.decision.decision === 'no_go_preview_only'
    && ownerLaunchReviewReport.sections.length >= 9
    && ownerLaunchReviewReport.summary.liveGatesCleared === 0
    && ownerLaunchReviewReport.summary.publicationsUnlocked === 0
    && ownerLaunchReviewReport.summary.externalApprovalsRequired >= detroitDynamoExternalConfirmationRegister.length
    && ownerLaunchReviewReport.requiredOwnerActions.length >= 4;
  const ownerEvidenceIntakeContractPresent = ownerEvidenceIntakeIssues.length === 0
    && ownerEvidenceIntakeReport.decision === 'preview_only_evidence_intake'
    && ownerEvidenceIntakeReport.intakeRows.length >= launchEvidenceReport.checklistItems.length
    && ownerEvidenceIntakeReport.summary.safeToPublishRows === 0
    && ownerEvidenceIntakeReport.summary.liveGatesCleared === 0
    && ownerEvidenceIntakeReport.summary.publicationsUnlocked === 0;
  const productionPreviewEvidenceContractPresent = productionPreviewEvidenceIssues.length === 0
    && productionPreviewEvidenceReport.decision.status === 'evidence_required'
    && productionPreviewEvidenceReport.decision.launchMode === 'preview_only'
    && productionPreviewEvidenceReport.tracks.length >= 24
    && productionPreviewEvidenceReport.summary.publicFormTracks >= requiredLeadVariants.length
    && productionPreviewEvidenceReport.summary.backendActivationTracks === detroitDynamoBackendActivationSteps.length
    && productionPreviewEvidenceReport.summary.externalConfirmationTracks === detroitDynamoExternalConfirmationRegister.length
    && productionPreviewEvidenceReport.summary.liveGatesCleared === 0
    && productionPreviewEvidenceReport.summary.productionSubmissionsRecorded === 0
    && productionPreviewEvidenceReport.summary.publicationsUnlocked === 0;
  const liveReadinessBoardContractPresent = liveReadinessBoardIssues.length === 0
    && liveReadinessBoardReport.decision.decision === 'no_go_preview_only'
    && liveReadinessBoardReport.rows.length >= 11
    && liveReadinessBoardReport.summary.goLiveAllowedRows === 0
    && liveReadinessBoardReport.summary.liveGatesCleared === 0
    && liveReadinessBoardReport.summary.publicationsUnlocked === 0
    && liveReadinessBoardReport.summary.rootPromotionAllowed === false
    && liveReadinessBoardReport.summary.checkoutAllowed === false
    && liveReadinessBoardReport.summary.permanentRedirectsAllowed === false;
  const launchArtifactIndexContractPresent = launchArtifactIndexIssues.length === 0
    && launchArtifactIndexReport.decision.decision === 'preview_handoff_index'
    && launchArtifactIndexReport.items.length >= 20
    && launchArtifactIndexReport.summary.liveGatesCleared === 0
    && launchArtifactIndexReport.summary.publicationsUnlocked === 0
    && launchArtifactIndexReport.summary.liveReadinessRows >= liveReadinessBoardReport.rows.length
    && launchArtifactIndexReport.summary.productionPreviewTracks >= productionPreviewEvidenceReport.tracks.length;
  const deploymentReadinessContractPresent = deploymentReadinessIssues.length === 0
    && deploymentReadinessReport.decision.decision === 'deployment_evidence_required'
    && deploymentReadinessReport.decision.launchMode === 'preview_only'
    && deploymentReadinessReport.tracks.length >= 10
    && deploymentReadinessReport.summary.liveGatesCleared === 0
    && deploymentReadinessReport.summary.publicationsUnlocked === 0
    && deploymentReadinessReport.summary.productionDeploymentsRecorded === 0
    && deploymentReadinessReport.summary.productionSubmissionsRecorded === 0
    && deploymentReadinessReport.summary.rootPromotionAllowed === false
    && deploymentReadinessReport.summary.permanentRedirectsAllowed === false;
  const vercelPreviewRunbookContractPresent = vercelPreviewRunbookIssues.length === 0
    && vercelPreviewRunbookReport.decision.decision === 'vercel_preview_evidence_required'
    && vercelPreviewRunbookReport.decision.launchMode === 'preview_only'
    && vercelPreviewRunbookReport.decision.productionPromotionAllowed === false
    && vercelPreviewRunbookReport.steps.length >= 10
    && vercelPreviewRunbookReport.summary.evidenceRequiredSteps >= 6
    && vercelPreviewRunbookReport.summary.projectIdentifiersRedacted === true
    && vercelPreviewRunbookReport.summary.previewDeploymentRecorded === 0
    && vercelPreviewRunbookReport.summary.productionDeploymentRecorded === 0
    && vercelPreviewRunbookReport.summary.productionPromotionAllowed === false
    && vercelPreviewRunbookReport.summary.liveGatesCleared === 0
    && vercelPreviewRunbookReport.summary.publicationsUnlocked === 0
    && vercelPreviewRunbookReport.steps.some((step) => step.commands.includes('npm i -g vercel@latest'))
    && vercelPreviewRunbookReport.steps.some((step) => step.commands.includes('pnpm add -g vercel@latest'));
  const secretRedactionContractPresent = secretRedactionIssues.length === 0
    && secretRedactionReport.decision.decision === 'secret_redaction_required_preview_only'
    && secretRedactionReport.decision.launchMode === 'preview_only'
    && secretRedactionReport.decision.publishAllowed === false
    && secretRedactionReport.rules.length >= 8
    && secretRedactionReport.summary.evidenceRequiredRules >= 7
    && secretRedactionReport.summary.exactSecretValuesWritten === false
    && secretRedactionReport.summary.projectIdentifiersRedacted === true
    && secretRedactionReport.summary.publishAllowed === false
    && secretRedactionReport.summary.leakagesDetected === 0
    && secretRedactionReport.summary.liveGatesCleared === 0
    && secretRedactionReport.summary.publicationsUnlocked === 0;
  const externalGateClosureContractPresent = externalGateClosureIssues.length === 0
    && externalGateClosureReport.decision.decision === 'external_gate_closure_required_preview_only'
    && externalGateClosureReport.decision.launchMode === 'preview_only'
    && externalGateClosureReport.decision.closureAllowed === false
    && externalGateClosureReport.decision.completionClaimAllowed === false
    && externalGateClosureReport.rows.length >= 9
    && externalGateClosureReport.summary.externalEvidenceRows >= 8
    && externalGateClosureReport.summary.readyToCloseRows === 0
    && externalGateClosureReport.summary.closureAllowedRows === 0
    && externalGateClosureReport.summary.liveGatesCleared === 0
    && externalGateClosureReport.summary.publicationsUnlocked === 0
    && externalGateClosureReport.summary.rootPromotionAllowed === false
    && externalGateClosureReport.summary.checkoutAllowed === false
    && externalGateClosureReport.summary.signatureCaptureAllowed === false
    && externalGateClosureReport.summary.completionClaimAllowed === false;
  const ownerHandoffPacketContractPresent = ownerHandoffPacketIssues.length === 0
    && ownerHandoffPacketReport.decision.decision === 'owner_handoff_packet_preview_only'
    && ownerHandoffPacketReport.decision.launchMode === 'preview_only'
    && ownerHandoffPacketReport.decision.publishAllowed === false
    && ownerHandoffPacketReport.decision.completionClaimAllowed === false
    && ownerHandoffPacketReport.sections.length >= 9
    && ownerHandoffPacketReport.summary.evidenceRequiredSections === ownerHandoffPacketReport.summary.packetSections
    && ownerHandoffPacketReport.summary.redactionReviewSections === ownerHandoffPacketReport.summary.packetSections
    && ownerHandoffPacketReport.summary.signedRows === 0
    && ownerHandoffPacketReport.summary.unsignedRows === ownerHandoffPacketReport.summary.signoffRows
    && ownerHandoffPacketReport.summary.secretRedactionLeakages === 0
    && ownerHandoffPacketReport.summary.liveGatesCleared === 0
    && ownerHandoffPacketReport.summary.publicationsUnlocked === 0
    && ownerHandoffPacketReport.summary.rootPromotionAllowed === false
    && ownerHandoffPacketReport.summary.checkoutAllowed === false
    && ownerHandoffPacketReport.summary.permanentRedirectsAllowed === false;
  const ownerSignoffRegisterContractPresent = ownerSignoffRegisterIssues.length === 0
    && ownerSignoffRegisterReport.decision.decision === 'owner_signoff_required_preview_only'
    && ownerSignoffRegisterReport.decision.launchMode === 'preview_only'
    && ownerSignoffRegisterReport.signoffRows.length >= 11
    && ownerSignoffRegisterReport.summary.signedRows === 0
    && ownerSignoffRegisterReport.summary.unsignedRows === ownerSignoffRegisterReport.summary.signoffRows
    && ownerSignoffRegisterReport.summary.liveGatesCleared === 0
    && ownerSignoffRegisterReport.summary.publicationsUnlocked === 0
    && ownerSignoffRegisterReport.summary.rootPromotionAllowed === false
    && ownerSignoffRegisterReport.summary.checkoutAllowed === false
    && ownerSignoffRegisterReport.summary.permanentRedirectsAllowed === false
    && ownerSignoffRegisterReport.summary.productionDeploymentsRecorded === 0
    && ownerSignoffRegisterReport.summary.productionSubmissionsRecorded === 0;
  const finalAcceptanceMatrixContractPresent = finalAcceptanceMatrixIssues.length === 0
    && finalAcceptanceMatrixReport.decision.decision === 'final_acceptance_preview_audit'
    && finalAcceptanceMatrixReport.decision.launchMode === 'preview_only'
    && finalAcceptanceMatrixReport.decision.completionClaimAllowed === false
    && finalAcceptanceMatrixReport.rows.length >= 15
    && finalAcceptanceMatrixReport.summary.externalEvidenceRequiredRows >= 5
    && finalAcceptanceMatrixReport.summary.ownerSignedRows === 0
    && finalAcceptanceMatrixReport.summary.goLiveAllowedRows === 0
    && finalAcceptanceMatrixReport.summary.liveGatesCleared === 0
    && finalAcceptanceMatrixReport.summary.publicationsUnlocked === 0
    && finalAcceptanceMatrixReport.summary.productionDeploymentsRecorded === 0
    && finalAcceptanceMatrixReport.summary.productionSubmissionsRecorded === 0
    && finalAcceptanceMatrixReport.summary.rootPromotionAllowed === false
    && finalAcceptanceMatrixReport.summary.checkoutAllowed === false
    && finalAcceptanceMatrixReport.summary.permanentRedirectsAllowed === false;
  const safeguardingContractsPresent = safeguardingIssues.length === 0
    && safeguardingReport.safeguardingTracks.length >= 8
    && safeguardingReport.safeguardingTracks.every((track) => !['live', 'active', 'approved'].includes(track.activationStatus))
    && safeguardingReport.safeguardingTracks.some((track) => track.id === 'minor-intake-guardian-consent');
  const externalGateContractsSurfaced = protectedAdminSource.includes('CHECKOUT AND SIGNATURE SAFETY CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoExternalGateContractReport')
    && moduleDetailSource.includes('EXTERNAL READINESS GATES')
    && moduleDetailSource.includes('buildDetroitDynamoExternalGateContractReport')
    && publicAdminFoundationSource.includes('Checkout and Signature Safety Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoExternalGateContractReport');
  const claimSafetyContractsSurfaced = protectedAdminSource.includes('PUBLIC CLAIM SAFETY CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoClaimSafetyContractReport')
    && moduleDetailSource.includes('CLAIM SAFETY GUARDS')
    && moduleDetailSource.includes('buildDetroitDynamoClaimSafetyContractReport')
    && publicAdminFoundationSource.includes('Public Claim Safety Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoClaimSafetyContractReport');
  const promotionCutoverContractsSurfaced = protectedAdminSource.includes('PROMOTION CUTOVER CONTROL')
    && protectedAdminSource.includes('buildDetroitDynamoPromotionCutoverReport')
    && publicAdminFoundationSource.includes('Promotion Cutover Control')
    && publicAdminFoundationSource.includes('buildDetroitDynamoPromotionCutoverReport');
  const launchEvidenceContractSurfaced = protectedAdminSource.includes('LAUNCH EVIDENCE CHECKLIST')
    && protectedAdminSource.includes('buildDetroitDynamoLaunchEvidenceReport')
    && publicAdminFoundationSource.includes('Launch Evidence Checklist')
    && publicAdminFoundationSource.includes('buildDetroitDynamoLaunchEvidenceReport');
  const launchEvidenceActionContractSurfaced = protectedAdminSource.includes('LAUNCH EVIDENCE ACTION LEDGER')
    && protectedAdminSource.includes('submitDetroitDynamoLaunchEvidenceAction')
    && protectedAdminSource.includes('downloadLaunchEvidenceActions')
    && publicAdminFoundationSource.includes('Launch Evidence Action Workflow')
    && publicAdminFoundationSource.includes('buildDetroitDynamoLaunchEvidenceActionReport');
  const externalConfirmationActionContractSurfaced = protectedAdminSource.includes('EXTERNAL CONFIRMATION ACTION QUEUE')
    && protectedAdminSource.includes('submitDetroitDynamoExternalConfirmationAction')
    && protectedAdminSource.includes('downloadExternalConfirmationActions')
    && publicAdminFoundationSource.includes('External Confirmation Action Queue')
    && publicAdminFoundationSource.includes('buildDetroitDynamoExternalConfirmationActionReport');
  const ownerLaunchReviewContractSurfaced = protectedAdminSource.includes('OWNER LAUNCH REVIEW PACKET')
    && protectedAdminSource.includes('buildDetroitDynamoOwnerLaunchReviewReport')
    && publicAdminFoundationSource.includes('Owner Launch Review Packet')
    && publicAdminFoundationSource.includes('buildDetroitDynamoOwnerLaunchReviewReport');
  const ownerEvidenceIntakeContractSurfaced = protectedAdminSource.includes('OWNER EVIDENCE INTAKE WORKSHEET')
    && protectedAdminSource.includes('buildDetroitDynamoOwnerEvidenceIntakeReport')
    && protectedAdminSource.includes('downloadOwnerEvidenceIntake')
    && publicAdminFoundationSource.includes('Owner Evidence Intake Worksheet')
    && publicAdminFoundationSource.includes('buildDetroitDynamoOwnerEvidenceIntakeReport');
  const productionPreviewEvidenceContractSurfaced = protectedAdminSource.includes('PRODUCTION PREVIEW EVIDENCE MATRIX')
    && protectedAdminSource.includes('buildDetroitDynamoProductionPreviewEvidenceReport')
    && publicAdminFoundationSource.includes('Production Preview Evidence Matrix')
    && publicAdminFoundationSource.includes('buildDetroitDynamoProductionPreviewEvidenceReport');
  const liveReadinessBoardContractSurfaced = protectedAdminSource.includes('LIVE READINESS BOARD')
    && protectedAdminSource.includes('buildDetroitDynamoLiveReadinessBoardReport')
    && publicAdminFoundationSource.includes('Live Readiness Board')
    && publicAdminFoundationSource.includes('buildDetroitDynamoLiveReadinessBoardReport');
  const launchArtifactIndexContractSurfaced = protectedAdminSource.includes('LAUNCH ARTIFACT INDEX')
    && protectedAdminSource.includes('buildDetroitDynamoLaunchArtifactIndexReport')
    && publicAdminFoundationSource.includes('Launch Artifact Index')
    && publicAdminFoundationSource.includes('buildDetroitDynamoLaunchArtifactIndexReport');
  const deploymentReadinessContractSurfaced = protectedAdminSource.includes('DEPLOYMENT READINESS HANDOFF')
    && protectedAdminSource.includes('buildDetroitDynamoDeploymentReadinessReport')
    && publicAdminFoundationSource.includes('Deployment Readiness Handoff')
    && publicAdminFoundationSource.includes('buildDetroitDynamoDeploymentReadinessReport');
  const vercelPreviewRunbookContractSurfaced = protectedAdminSource.includes('VERCEL PREVIEW DEPLOYMENT RUNBOOK')
    && protectedAdminSource.includes('buildDetroitDynamoVercelPreviewRunbookReport')
    && publicAdminFoundationSource.includes('Vercel Preview Deployment Runbook')
    && publicAdminFoundationSource.includes('buildDetroitDynamoVercelPreviewRunbookReport');
  const secretRedactionContractSurfaced = protectedAdminSource.includes('SECRET REDACTION CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoSecretRedactionReport')
    && publicAdminFoundationSource.includes('Secret Redaction Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoSecretRedactionReport');
  const externalGateClosureContractSurfaced = protectedAdminSource.includes('EXTERNAL GATE CLOSURE PACKET')
    && protectedAdminSource.includes('buildDetroitDynamoExternalGateClosureReport')
    && publicAdminFoundationSource.includes('External Gate Closure Packet')
    && publicAdminFoundationSource.includes('buildDetroitDynamoExternalGateClosureReport');
  const ownerHandoffPacketContractSurfaced = protectedAdminSource.includes('OWNER HANDOFF PACKET')
    && protectedAdminSource.includes('buildDetroitDynamoOwnerHandoffPacketReport')
    && publicAdminFoundationSource.includes('Owner Handoff Packet')
    && publicAdminFoundationSource.includes('buildDetroitDynamoOwnerHandoffPacketReport');
  const ownerSignoffRegisterContractSurfaced = protectedAdminSource.includes('OWNER SIGNOFF REGISTER')
    && protectedAdminSource.includes('buildDetroitDynamoOwnerSignoffRegisterReport')
    && publicAdminFoundationSource.includes('Owner Signoff Register')
    && publicAdminFoundationSource.includes('buildDetroitDynamoOwnerSignoffRegisterReport');
  const finalAcceptanceMatrixContractSurfaced = protectedAdminSource.includes('FINAL ACCEPTANCE MATRIX')
    && protectedAdminSource.includes('buildDetroitDynamoFinalAcceptanceMatrixReport')
    && publicAdminFoundationSource.includes('Final Acceptance Matrix')
    && publicAdminFoundationSource.includes('buildDetroitDynamoFinalAcceptanceMatrixReport');
  const safeguardingContractsSurfaced = protectedAdminSource.includes('SAFEGUARDING AND DATA PRIVACY CONTRACT')
    && protectedAdminSource.includes('buildDetroitDynamoSafeguardingReport')
    && moduleDetailSource.includes('SAFEGUARDING PRIVACY GUARDS')
    && moduleDetailSource.includes('buildDetroitDynamoSafeguardingReport')
    && publicAdminFoundationSource.includes('Safeguarding and Data Privacy Contract')
    && publicAdminFoundationSource.includes('buildDetroitDynamoSafeguardingReport');

  record(
    'brand-seo-launch-plan',
    'Detroit Dynamo assets, preview metadata, sitemap-ready route metadata, aliases, redirect plan, and launch gates are in place without replacing LC root SEO.',
    assetsPresent && seoReady && promotedMetaPresent && launchPlanPresent && confirmationRegisterPresent && externalGateContractsPresent && externalGateContractsSurfaced && claimSafetyContractsPresent && claimSafetyContractsSurfaced && promotionCutoverContractsPresent && promotionCutoverContractsSurfaced && launchEvidenceContractPresent && launchEvidenceContractSurfaced && launchEvidenceActionContractPresent && launchEvidenceActionContractSurfaced && externalConfirmationActionContractPresent && externalConfirmationActionContractSurfaced && ownerLaunchReviewContractPresent && ownerLaunchReviewContractSurfaced && ownerEvidenceIntakeContractPresent && ownerEvidenceIntakeContractSurfaced && productionPreviewEvidenceContractPresent && productionPreviewEvidenceContractSurfaced && liveReadinessBoardContractPresent && liveReadinessBoardContractSurfaced && launchArtifactIndexContractPresent && launchArtifactIndexContractSurfaced && deploymentReadinessContractPresent && deploymentReadinessContractSurfaced && vercelPreviewRunbookContractPresent && vercelPreviewRunbookContractSurfaced && secretRedactionContractPresent && secretRedactionContractSurfaced && externalGateClosureContractPresent && externalGateClosureContractSurfaced && ownerHandoffPacketContractPresent && ownerHandoffPacketContractSurfaced && finalAcceptanceMatrixContractPresent && finalAcceptanceMatrixContractSurfaced && safeguardingContractsPresent && safeguardingContractsSurfaced ? 'pass' : 'fail',
    `Checked ${requiredAssets.length} assets, ${detroitDynamoSitemapRoutes.length} sitemap routes, ${detroitDynamoAliasRoutes.length} aliases, ${detroitDynamoRedirectPlan.length} redirects, launch gates, ${detroitDynamoExternalConfirmationRegister.length} external confirmation registers, ${externalGateReport.paymentPackageTracks.length} payment/package gate tracks, ${externalGateReport.waiverTracks.length} waiver gate tracks, ${claimSafetyReport.claimSafetyTracks.length} claim-safety tracks, ${promotionCutoverReport.cutoverTracks.length} promotion cutover tracks, ${launchEvidenceReport.checklistItems.length} launch evidence checklist items, ${launchEvidenceActionReport.actions.length} launch evidence action fixtures, ${externalConfirmationActionReport.actions.length} external confirmation action fixtures, ${ownerLaunchReviewReport.sections.length} owner launch review sections, ${ownerEvidenceIntakeReport.intakeRows.length} owner evidence intake rows, ${productionPreviewEvidenceReport.tracks.length} production-preview evidence tracks, ${liveReadinessBoardReport.rows.length} live readiness board rows, ${launchArtifactIndexReport.items.length} launch artifact index items, ${deploymentReadinessReport.tracks.length} deployment readiness tracks, ${vercelPreviewRunbookReport.steps.length} Vercel preview runbook steps, ${secretRedactionReport.rules.length} secret redaction rules, ${externalGateClosureReport.rows.length} external gate closure rows, ${ownerHandoffPacketReport.sections.length} owner handoff packet sections, ${ownerSignoffRegisterReport.signoffRows.length} owner signoff rows, ${finalAcceptanceMatrixReport.rows.length} final acceptance rows, and ${safeguardingReport.safeguardingTracks.length} safeguarding tracks.`,
    [assetsPresent ? '' : 'One or more Detroit Dynamo public assets are missing.', ...externalGateIssues, ...claimSafetyIssues, ...promotionCutoverIssues, ...launchEvidenceIssues, ...launchEvidenceActionIssues, ...externalConfirmationActionIssues, ...ownerLaunchReviewIssues, ...ownerEvidenceIntakeIssues, ...productionPreviewEvidenceIssues, ...liveReadinessBoardIssues, ...launchArtifactIndexIssues, ...deploymentReadinessIssues, ...vercelPreviewRunbookIssues, ...secretRedactionIssues, ...externalGateClosureIssues, ...ownerHandoffPacketIssues, ...ownerSignoffRegisterIssues, ...finalAcceptanceMatrixIssues, ...safeguardingIssues, ...(externalGateContractsSurfaced ? [] : ['Payment/waiver gate contract is not surfaced in admin foundation UI']), ...(claimSafetyContractsSurfaced ? [] : ['Public claim-safety contract is not surfaced in admin foundation UI']), ...(promotionCutoverContractsSurfaced ? [] : ['Promotion cutover contract is not surfaced in admin foundation UI']), ...(launchEvidenceContractSurfaced ? [] : ['Launch evidence checklist is not surfaced in admin foundation UI']), ...(launchEvidenceActionContractSurfaced ? [] : ['Launch evidence action workflow is not surfaced in protected and public admin UI']), ...(externalConfirmationActionContractSurfaced ? [] : ['External confirmation action workflow is not surfaced in protected and public admin UI']), ...(ownerLaunchReviewContractSurfaced ? [] : ['Owner launch review packet is not surfaced in protected and public admin UI']), ...(ownerEvidenceIntakeContractSurfaced ? [] : ['Owner evidence intake worksheet is not surfaced in protected and public admin UI']), ...(productionPreviewEvidenceContractSurfaced ? [] : ['Production-preview evidence matrix is not surfaced in protected and public admin UI']), ...(liveReadinessBoardContractSurfaced ? [] : ['Live readiness board is not surfaced in protected and public admin UI']), ...(launchArtifactIndexContractSurfaced ? [] : ['Launch artifact index is not surfaced in protected and public admin UI']), ...(deploymentReadinessContractSurfaced ? [] : ['Deployment readiness handoff is not surfaced in protected and public admin UI']), ...(vercelPreviewRunbookContractSurfaced ? [] : ['Vercel preview runbook is not surfaced in protected and public admin UI']), ...(secretRedactionContractSurfaced ? [] : ['Secret redaction contract is not surfaced in protected and public admin UI']), ...(externalGateClosureContractSurfaced ? [] : ['External gate closure packet is not surfaced in protected and public admin UI']), ...(ownerHandoffPacketContractSurfaced ? [] : ['Owner handoff packet is not surfaced in protected and public admin UI']), ...(ownerSignoffRegisterContractSurfaced ? [] : ['Owner signoff register is not surfaced in protected and public admin UI']), ...(finalAcceptanceMatrixContractSurfaced ? [] : ['Final acceptance matrix is not surfaced in protected and public admin UI']), ...(safeguardingContractsSurfaced ? [] : ['Safeguarding/privacy contract is not surfaced in admin foundation UI'])].filter(Boolean).join('; '),
  );
}

async function auditVerificationAndDocumentation() {
  const pkg = JSON.parse(await readProjectFile('package.json'));
  const doc = await readProjectFile('DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md');
  const scripts = pkg.scripts || {};
  const commandsPresent = [
    'lint',
    'typecheck',
    'test',
    'verify:dynamo',
    'qa:dynamo-browser',
    'plan:dynamo-appwrite',
    'preflight:dynamo-backend',
    'provision:dynamo-appwrite',
    'audit:dynamo-goal',
    'generate:dynamo-launch-assets',
    'verify:dynamo-gate-contracts',
    'verify:dynamo-claim-safety',
    'verify:dynamo-promotion-cutover',
    'verify:dynamo-launch-evidence',
    'verify:dynamo-launch-evidence-actions',
    'verify:dynamo-external-confirmation-actions',
    'verify:dynamo-owner-launch-review',
    'verify:dynamo-owner-evidence-intake',
    'verify:dynamo-production-preview-evidence',
    'verify:dynamo-live-readiness-board',
    'verify:dynamo-launch-artifact-index',
    'verify:dynamo-deployment-readiness',
    'verify:dynamo-vercel-preview',
    'verify:dynamo-secret-redaction',
    'verify:dynamo-external-gate-closure',
    'verify:dynamo-owner-handoff-packet',
    'verify:dynamo-owner-signoff-register',
    'verify:dynamo-final-acceptance',
    'verify:dynamo-safeguarding',
    'verify:dynamo-intake-contract',
    'verify:dynamo-pipeline-actions',
    'verify:dynamo-admin-module-read',
    'verify:dynamo-admin-record-workspace',
    'verify:dynamo-admin-role-grants',
    'verify:dynamo-admin-module-writes',
    'build',
  ].every((script) => scripts[script]);
  const launchGeneratorPresent = await fileExists('scripts/generate-detroit-dynamo-launch-assets.mjs');
  const backendPreflightPresent = await fileExists('scripts/preflight-detroit-dynamo-backend.mjs');
  const docsPresent = requiredDocsSections.every((section) => doc.includes(section))
    && doc.includes('Still Needing Backend, Payment, or League Confirmation')
    && doc.includes('Testing Results');

  record(
    'verification-documentation',
    'Repo has repeatable verification commands and the requested audit, issues, implementation, changes, features, remaining needs, testing, and next-step documentation.',
    commandsPresent && launchGeneratorPresent && backendPreflightPresent && docsPresent ? 'pass' : 'fail',
    'Checked package scripts and DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md sections.',
    commandsPresent ? '' : 'One or more required verification scripts are missing from package.json.',
  );
}

async function auditExternalPromotionGates() {
  const unresolvedGates = detroitDynamoPromotionGates.filter((gate) => gate.status !== 'passing_in_preview');
  const unresolvedReadiness = detroitDynamoLaunchReadiness.filter((item) => item.status !== 'ready' && item.status !== 'passing');

  record(
    'external-promotion-gates',
    'Backend provisioning, payments, waivers/legal, league/facility confirmations, and launch approvals remain explicit external gates before full promotion.',
    unresolvedGates.length > 0 && unresolvedReadiness.length > 0 ? 'pending_external' : 'fail',
    `Pending promotion gates: ${unresolvedGates.map((gate) => gate.gate).join(', ')}.`,
    unresolvedGates.length > 0 ? '' : 'No pending external gates were found; review before marking the full goal complete.',
  );
}

async function main() {
  await auditPromotedBrandShell();
  await auditDetroitDynamoParallelSite();
  await auditPublicWebsiteContent();
  await auditFormsAndLeadSystem();
  await auditAdminAndDataFoundation();
  await auditBrandSeoAndLaunchPlanning();
  await auditVerificationAndDocumentation();
  await auditExternalPromotionGates();

  const summary = {
    passed: requirements.filter((item) => item.status === 'pass').length,
    pendingExternal: requirements.filter((item) => item.status === 'pending_external').length,
    failed: requirements.filter((item) => item.status === 'fail').length,
    total: requirements.length,
  };
  const report = {
    checkedAt: new Date().toISOString(),
    summary,
    requirements,
  };

  await fs.mkdir(artifactDir, { recursive: true });
  await fs.writeFile(path.join(artifactDir, 'goal-audit.json'), JSON.stringify(report, null, 2));

  if (failures.length > 0) {
    console.error(`Detroit Dynamo goal audit failed with ${failures.length} issue(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log('Detroit Dynamo goal audit passed for implemented promoted-brand scope.');
  console.log(`Implemented checks passed: ${summary.passed}/${summary.total}`);
  console.log(`External gates still pending: ${summary.pendingExternal}`);
  console.log(`Report written to ${path.join(artifactDir, 'goal-audit.json')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
