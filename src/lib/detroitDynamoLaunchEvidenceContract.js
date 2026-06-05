import {
  detroitDynamoBackendActivationSteps,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';
import { detroitDynamoPromotionCutoverTracks } from './detroitDynamoPromotionCutoverContract.js';

export const detroitDynamoLaunchEvidenceChecklist = [
  {
    id: 'current-site-route-snapshot',
    promotionGate: 'Legacy public route preservation',
    confirmationArea: 'Legacy Public Routes',
    ownerRole: 'Master Admin',
    status: 'preview_passed',
    evidenceType: 'verification_report',
    requiredArtifact: 'Legacy public route smoke output, browser QA report, and rollback deployment id',
    acceptanceCriteria: [
      'Root, booking, auth, blog, team, legacy club, apply, terms, privacy, and admin routes still respond.',
      'Detroit Dynamo header/footer/navigation remain intact outside Detroit Dynamo routes.',
      'A rollback deployment id or previous production build target is recorded before promotion.',
    ],
    verificationCommand: 'BASE_URL=<production-preview-url> npm run test -- --run',
    liveActionBlocked: 'Do not replace the root route until the current-site snapshot and rollback target are saved.',
    blocksActions: ['root route promotion', 'permanent redirects', 'noindex removal'],
  },
  {
    id: 'backend-preflight-and-provisioning',
    promotionGate: 'Data backend live',
    confirmationArea: 'Backend/Data',
    ownerRole: 'Master Admin',
    status: 'evidence_required',
    evidenceType: 'backend_report',
    requiredArtifact: 'Backend preflight report plus Appwrite provision/apply transcript for isolated dd_* collections',
    acceptanceCriteria: [
      'Preflight passes without printing secrets.',
      'All Detroit Dynamo dd_* collections, attributes, indexes, and permissions exist in the target Appwrite project.',
      'Legacy Detroit Dynamo collections are not mutated by the Dynamo provisioner.',
    ],
    verificationCommand: 'npm run preflight:dynamo-backend && npm run provision:dynamo-appwrite -- --apply',
    liveActionBlocked: 'Keep public forms in local preview/fallback mode until Appwrite schema provisioning is verified.',
    blocksActions: ['Appwrite intake default', 'admin write mode default', 'live lead routing'],
  },
  {
    id: 'backend-function-production-preview',
    promotionGate: 'Data backend live',
    confirmationArea: 'Backend/Data',
    ownerRole: 'Registrar',
    status: 'evidence_required',
    evidenceType: 'function_smoke',
    requiredArtifact: 'Production-preview submission ids for every public form variant and authenticated admin action',
    acceptanceCriteria: [
      'Lead intake, pipeline action, module read, role grant, and module write functions are deployed with expected scopes.',
      'Training, tryout, youth, senior men, senior women, sponsor, and contact forms create expected records.',
      'Authenticated admin actions write audit events and reject unauthorized users.',
    ],
    verificationCommand: 'npm run verify:dynamo-intake-contract && npm run verify:dynamo-pipeline-actions',
    liveActionBlocked: 'Do not make Appwrite the default intake mode until production-preview submissions and admin actions pass.',
    blocksActions: ['default live intake', 'status mutation workflow', 'protected admin live writes'],
  },
  {
    id: 'payment-package-approval',
    promotionGate: 'Payments approved',
    confirmationArea: 'Payments & Packages',
    ownerRole: 'Master Admin',
    status: 'pending_confirmation',
    evidenceType: 'owner_signoff',
    requiredArtifact: 'Approved package matrix with prices, session counts, taxes/fees, refund rules, and provider product ids',
    acceptanceCriteria: [
      'Private, small-group, team-training, camp, tryout, youth dues, and sponsor packages are approved.',
      'Provider product ids or invoice workflow ids are mapped to TrainingPackage, Payment, Booking, CampClinic, and Sponsor records.',
      'Refund, cancellation, failed-payment, and settlement handling are documented.',
    ],
    verificationCommand: 'npm run verify:dynamo-gate-contracts',
    liveActionBlocked: 'Do not publish checkout links or exact package commitments before owner approval.',
    blocksActions: ['checkout activation', 'payment collection', 'published exact pricing'],
  },
  {
    id: 'payment-provider-sandbox',
    promotionGate: 'Payments approved',
    confirmationArea: 'Payments & Packages',
    ownerRole: 'Master Admin',
    status: 'evidence_required',
    evidenceType: 'provider_test',
    requiredArtifact: 'Successful sandbox payment, failure, refund/cancel, and webhook/audit test evidence',
    acceptanceCriteria: [
      'Checkout succeeds for approved training, camp, dues, and sponsor payment paths.',
      'Failed, canceled, and refunded payments map cleanly to Payment records.',
      'No public Dynamo payment surface is enabled without the approved package matrix.',
    ],
    verificationCommand: 'Provider sandbox test plus npm run verify:dynamo-gate-contracts',
    liveActionBlocked: 'Keep payment CTAs as inquiry-only until provider sandbox evidence is signed off.',
    blocksActions: ['payment provider live mode', 'camp checkout', 'dues/deposit collection'],
  },
  {
    id: 'waiver-legal-version-approval',
    promotionGate: 'Waivers approved',
    confirmationArea: 'Waivers & Legal',
    ownerRole: 'Registrar',
    status: 'pending_confirmation',
    evidenceType: 'legal_signoff',
    requiredArtifact: 'Approved waiver/legal version register for youth, adult, medical, media, camp, and travel consent',
    acceptanceCriteria: [
      'Each waiver has approved language, version id, effective date, expiration rule, and owner/legal signoff.',
      'Minor participation requires guardian signature coverage and data-retention rules.',
      'Waiver requirements are mapped to tryouts, camps, training bookings, teams, and roster eligibility.',
    ],
    verificationCommand: 'npm run verify:dynamo-gate-contracts && npm run verify:dynamo-safeguarding',
    liveActionBlocked: 'Do not collect signatures, medical consent, or final legal acknowledgements until waiver versions are approved.',
    blocksActions: ['signature capture', 'medical intake', 'roster eligibility clearance'],
  },
  {
    id: 'waiver-signature-workflow-test',
    promotionGate: 'Waivers approved',
    confirmationArea: 'Waivers & Legal',
    ownerRole: 'Registrar',
    status: 'evidence_required',
    evidenceType: 'workflow_test',
    requiredArtifact: 'Guardian/adult signature workflow test with audit trail, export, expiration, and revocation handling',
    acceptanceCriteria: [
      'Guardian and adult signature paths are tested on mobile and desktop.',
      'Signed waiver records retain version, signer, timestamp, related player/program, and audit evidence.',
      'Expired, revoked, or missing waivers block the correct admin workflows.',
    ],
    verificationCommand: 'npm run verify:dynamo-safeguarding',
    liveActionBlocked: 'Do not open youth registration, camp registration, or senior evaluations until signature workflow evidence exists.',
    blocksActions: ['youth registration launch', 'camp registration launch', 'senior tryout waiver enforcement'],
  },
  {
    id: 'league-competition-confirmation',
    promotionGate: 'League and facility facts confirmed',
    confirmationArea: 'League & Competition Facts',
    ownerRole: 'Club Director',
    status: 'future_pathway',
    evidenceType: 'official_confirmation',
    requiredArtifact: 'Official league, competition, fixture, roster, and staff confirmation documents or owner-approved public wording',
    acceptanceCriteria: [
      'No current UPSL, UPSL Women, youth league, roster, fixture, or result claim is published without confirmation.',
      'Future-pathway language remains in place for unconfirmed leagues and teams.',
      'Fixture, opponent, venue, competition, roster, and staff claims are individually approved before publication.',
    ],
    verificationCommand: 'npm run verify:dynamo-claim-safety',
    liveActionBlocked: 'Do not publish current league membership, fixtures, results, rosters, or staff claims without proof.',
    blocksActions: ['league claim publication', 'fixture/result publication', 'roster/staff proof publication'],
  },
  {
    id: 'facility-operations-confirmation',
    promotionGate: 'League and facility facts confirmed',
    confirmationArea: 'Facilities & Operations',
    ownerRole: 'Club Director',
    status: 'pending_confirmation',
    evidenceType: 'operations_confirmation',
    requiredArtifact: 'Facility permits/agreements, schedule windows, emergency procedures, insurance notes, and location publish approval',
    acceptanceCriteria: [
      'Training, tryout, camp, indoor, match, and youth-team locations are confirmed before publication.',
      'Facility partner permissions, check-in instructions, weather/cancel rules, and emergency procedures are documented.',
      'Address, parking, access, and schedule copy is approved before going public.',
    ],
    verificationCommand: 'npm run verify:dynamo-claim-safety && npm run verify:dynamo-safeguarding',
    liveActionBlocked: 'Do not publish facility commitments, addresses, or schedules until operating access is confirmed.',
    blocksActions: ['facility publication', 'camp date publication', 'tryout schedule publication'],
  },
  {
    id: 'staff-roster-safeguarding-confirmation',
    promotionGate: 'League and facility facts confirmed',
    confirmationArea: 'Staff, Rosters & Safeguarding',
    ownerRole: 'Club Director',
    status: 'pending_confirmation',
    evidenceType: 'safeguarding_review',
    requiredArtifact: 'Staff approval, background/safeguarding status, roster publication approvals, and media-release coverage',
    acceptanceCriteria: [
      'Staff and coach profiles are approved before publication.',
      'Youth player roster visibility follows guardian consent, media release, and safeguarding policy.',
      'Team manager and coach access is scoped to assigned teams and verified through role grants.',
    ],
    verificationCommand: 'npm run verify:dynamo-safeguarding && npm run verify:dynamo-admin-role-grants',
    liveActionBlocked: 'Do not publish youth roster/staff proof or enable sensitive roster workflows before safeguarding evidence exists.',
    blocksActions: ['staff proof publication', 'youth roster publication', 'team-manager sensitive access'],
  },
  {
    id: 'sponsor-media-proof-confirmation',
    promotionGate: 'League and facility facts confirmed',
    confirmationArea: 'Sponsors, Media & Content Proof',
    ownerRole: 'Media/Admin Staff',
    status: 'pending_confirmation',
    evidenceType: 'content_approval',
    requiredArtifact: 'Sponsor logo permissions, testimonial approvals, media releases, news proof, and publishing calendar',
    acceptanceCriteria: [
      'Sponsor logos, testimonials, photos, video, and outcome claims have permission before publication.',
      'News/media proof is tied to approved source material.',
      'Sponsor package activation promises match approved sponsorship inventory.',
    ],
    verificationCommand: 'npm run verify:dynamo-claim-safety',
    liveActionBlocked: 'Do not publish sponsor, testimonial, media, or player-outcome proof without permission.',
    blocksActions: ['sponsor logo publication', 'testimonial publication', 'player outcome publication'],
  },
  {
    id: 'seo-metadata-noindex-approval',
    promotionGate: 'SEO and redirect launch approved',
    confirmationArea: 'Sponsors, Media & Content Proof',
    ownerRole: 'Media/Admin Staff',
    status: 'preview_only',
    evidenceType: 'seo_signoff',
    requiredArtifact: 'Approved titles, descriptions, favicon, Open Graph asset, robots, sitemap, canonical URLs, and noindex removal approval',
    acceptanceCriteria: [
      'Detroit Dynamo metadata and social assets are approved for the public root brand.',
      'Noindex removal is owner-approved and tied to the approved launch window.',
      'Current Detroit Dynamo root SEO is not overwritten before promotion approval.',
    ],
    verificationCommand: 'BASE_URL=<production-preview-url> npm run verify:dynamo',
    liveActionBlocked: 'Do not remove preview-only noindex or replace root metadata until SEO launch approval is recorded.',
    blocksActions: ['noindex removal', 'root metadata replacement', 'sitemap publication'],
  },
  {
    id: 'redirect-cutover-and-postlaunch-qa',
    promotionGate: 'SEO and redirect launch approved',
    confirmationArea: 'Sponsors, Media & Content Proof',
    ownerRole: 'Master Admin',
    status: 'preview_only',
    evidenceType: 'route_qa',
    requiredArtifact: 'Approved redirect plan, auth/payment/admin exclusions, post-cutover route QA, and rollback instructions',
    acceptanceCriteria: [
      'Old LC routes, auth routes, admin routes, and payment callbacks have explicit redirect/exclusion decisions.',
      'Post-cutover browser QA passes on desktop and mobile.',
      'Rollback instructions are documented before permanent redirects are applied.',
    ],
    verificationCommand: 'BASE_URL=<production-url> npm run qa:dynamo-browser',
    liveActionBlocked: 'Do not apply permanent redirects until redirect QA and rollback evidence are approved.',
    blocksActions: ['permanent redirects', 'canonical alias migration', 'post-launch closeout'],
  },
];

function promotionGateByName() {
  return new Map(detroitDynamoPromotionGates.map((gate) => [gate.gate, gate]));
}

function confirmationByArea() {
  return new Map(detroitDynamoExternalConfirmationRegister.map((item) => [item.area, item]));
}

function cutoverTracksForItem(item) {
  const haystack = `${item.promotionGate} ${item.confirmationArea} ${item.blocksActions.join(' ')}`.toLowerCase();
  return detroitDynamoPromotionCutoverTracks
    .filter((track) => (
      haystack.includes(track.phase.toLowerCase().split(' ')[0])
      || track.requiredEvidence.join(' ').toLowerCase().includes(item.confirmationArea.toLowerCase().split(' ')[0])
      || item.blocksActions.some((action) => track.cutoverAction.toLowerCase().includes(action.split(' ')[0]))
    ))
    .map((track) => ({
      id: track.id,
      label: track.label,
      phase: track.phase,
      status: track.status,
    }));
}

export function buildDetroitDynamoLaunchEvidenceReport() {
  const promotionGates = promotionGateByName();
  const confirmations = confirmationByArea();
  const items = detroitDynamoLaunchEvidenceChecklist.map((item) => ({
    ...item,
    promotionGateStatus: promotionGates.get(item.promotionGate)?.status || 'unknown',
    confirmationStatus: confirmations.get(item.confirmationArea)?.status || (item.confirmationArea === 'Legacy Public Routes' || item.confirmationArea === 'Backend/Data' ? 'internal_gate' : 'missing'),
    relatedCutoverTracks: cutoverTracksForItem(item),
  }));
  const blockedActions = [...new Set(items.flatMap((item) => item.blocksActions))].sort();

  const report = {
    generatedAt: new Date().toISOString(),
    checklistItems: items,
    summary: {
      total: items.length,
      previewPassed: items.filter((item) => item.status === 'preview_passed').length,
      evidenceRequired: items.filter((item) => item.status === 'evidence_required').length,
      pendingConfirmation: items.filter((item) => item.status === 'pending_confirmation').length,
      futurePathway: items.filter((item) => item.status === 'future_pathway').length,
      previewOnly: items.filter((item) => item.status === 'preview_only').length,
      blockedActions: blockedActions.length,
    },
    promotionGates: detroitDynamoPromotionGates,
    externalConfirmationRegister: detroitDynamoExternalConfirmationRegister,
    backendActivationSteps: detroitDynamoBackendActivationSteps,
    blockedActions,
    issues: [],
  };
  report.issues = auditDetroitDynamoLaunchEvidenceReport(report);

  return report;
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoLaunchEvidenceReport(report = buildDetroitDynamoLaunchEvidenceReport()) {
  const issues = [];
  const promotionGateNames = new Set(detroitDynamoPromotionGates.map((gate) => gate.gate));
  const externalAreas = new Set(detroitDynamoExternalConfirmationRegister.map((item) => item.area));
  const representedGates = new Set(report.checklistItems.map((item) => item.promotionGate));
  const representedAreas = new Set(report.checklistItems.map((item) => item.confirmationArea));
  const allowedStatuses = new Set([
    'preview_passed',
    'evidence_required',
    'pending_confirmation',
    'future_pathway',
    'preview_only',
  ]);
  const allowedTypes = new Set([
    'verification_report',
    'backend_report',
    'function_smoke',
    'owner_signoff',
    'provider_test',
    'legal_signoff',
    'workflow_test',
    'official_confirmation',
    'operations_confirmation',
    'safeguarding_review',
    'content_approval',
    'seo_signoff',
    'route_qa',
  ]);

  assertReport(report.checklistItems.length >= 13, 'Launch evidence checklist should include at least 13 gate items.', issues);
  for (const gate of promotionGateNames) {
    assertReport(representedGates.has(gate), `Launch evidence checklist does not represent promotion gate: ${gate}.`, issues);
  }
  for (const area of externalAreas) {
    assertReport(representedAreas.has(area), `Launch evidence checklist does not represent external confirmation area: ${area}.`, issues);
  }
  assertReport(report.checklistItems.some((item) => item.id === 'backend-preflight-and-provisioning'), 'Backend provisioning evidence item is missing.', issues);
  assertReport(report.checklistItems.some((item) => item.id === 'payment-package-approval'), 'Payment approval evidence item is missing.', issues);
  assertReport(report.checklistItems.some((item) => item.id === 'waiver-legal-version-approval'), 'Waiver approval evidence item is missing.', issues);
  assertReport(report.checklistItems.some((item) => item.id === 'league-competition-confirmation' && item.status === 'future_pathway'), 'League evidence item must remain future_pathway until confirmed.', issues);
  assertReport(report.checklistItems.some((item) => item.id === 'seo-metadata-noindex-approval' && item.status === 'preview_only'), 'SEO evidence item must remain preview_only before launch approval.', issues);

  const ids = new Set();
  for (const item of report.checklistItems) {
    assertReport(!ids.has(item.id), `Duplicate launch evidence item id: ${item.id}.`, issues);
    ids.add(item.id);
    assertReport(promotionGateNames.has(item.promotionGate), `${item.id} references an unknown promotion gate.`, issues);
    assertReport(item.confirmationArea === 'Legacy Public Routes' || item.confirmationArea === 'Backend/Data' || externalAreas.has(item.confirmationArea), `${item.id} references an unknown confirmation area.`, issues);
    assertReport(allowedStatuses.has(item.status), `${item.id} has unsupported status ${item.status}.`, issues);
    assertReport(!['approved', 'complete', 'live', 'promoted'].includes(item.status), `${item.id} must not be marked approved/live while preview gates are pending.`, issues);
    assertReport(allowedTypes.has(item.evidenceType), `${item.id} has unsupported evidence type ${item.evidenceType}.`, issues);
    assertReport(item.requiredArtifact && item.requiredArtifact.length > 24, `${item.id} needs a concrete required artifact.`, issues);
    assertReport(Array.isArray(item.acceptanceCriteria) && item.acceptanceCriteria.length >= 3, `${item.id} needs at least three acceptance criteria.`, issues);
    assertReport(item.acceptanceCriteria.every((criterion) => criterion.length > 24), `${item.id} has weak acceptance criteria.`, issues);
    assertReport(item.verificationCommand && item.verificationCommand.length > 8, `${item.id} needs a verification command or action.`, issues);
    assertReport(item.liveActionBlocked && item.liveActionBlocked.length > 24, `${item.id} needs a blocked-live-action statement.`, issues);
    assertReport(Array.isArray(item.blocksActions) && item.blocksActions.length >= 1, `${item.id} should list blocked actions.`, issues);
  }

  return issues;
}

export function buildDetroitDynamoLaunchEvidenceMarkdown(report = buildDetroitDynamoLaunchEvidenceReport()) {
  const lines = [
    '# Detroit Dynamo Launch Evidence Checklist',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    'This checklist turns the external promotion gates into concrete proof requirements. It does not approve launch, enable Appwrite as the default backend, collect payments, collect signatures, publish league/facility claims, remove noindex, or apply redirects.',
    '',
    '## Summary',
    '',
    `- Total evidence items: ${report.summary.total}`,
    `- Preview-passed items: ${report.summary.previewPassed}`,
    `- Evidence-required items: ${report.summary.evidenceRequired}`,
    `- Pending-confirmation items: ${report.summary.pendingConfirmation}`,
    `- Future-pathway items: ${report.summary.futurePathway}`,
    `- Preview-only items: ${report.summary.previewOnly}`,
    `- Blocked live actions: ${report.summary.blockedActions}`,
    '',
    '## Evidence Items',
    '',
    '| Item | Gate | Status | Owner | Required Artifact | Verification |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.checklistItems.map((item) => (
      `| ${item.id} | ${item.promotionGate} | ${item.status} | ${item.ownerRole} | ${item.requiredArtifact} | \`${item.verificationCommand}\` |`
    )),
    '',
    '## Acceptance Criteria',
    '',
    ...report.checklistItems.flatMap((item) => [
      `### ${item.id}`,
      '',
      `Gate: ${item.promotionGate}`,
      '',
      `Confirmation area: ${item.confirmationArea}`,
      '',
      `Blocked live action: ${item.liveActionBlocked}`,
      '',
      'Criteria:',
      ...item.acceptanceCriteria.map((criterion) => `- [ ] ${criterion}`),
      '',
    ]),
    '## Blocked Actions',
    '',
    ...report.blockedActions.map((action) => `- ${action}`),
    '',
  ];

  return lines.join('\n');
}
