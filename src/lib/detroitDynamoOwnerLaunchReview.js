import {
  detroitDynamoBackendActivationSteps,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';
import { buildDetroitDynamoExternalGateContractReport } from './detroitDynamoExternalGateContracts.js';
import { buildDetroitDynamoClaimSafetyContractReport } from './detroitDynamoClaimSafetyContract.js';
import { buildDetroitDynamoPromotionCutoverReport } from './detroitDynamoPromotionCutoverContract.js';
import { buildDetroitDynamoLaunchEvidenceReport } from './detroitDynamoLaunchEvidenceContract.js';
import { buildDetroitDynamoLaunchEvidenceActionReport } from './detroitDynamoLaunchEvidenceActions.js';
import { buildDetroitDynamoExternalConfirmationActionReport } from './detroitDynamoExternalConfirmationActions.js';
import { buildDetroitDynamoSafeguardingReport } from './detroitDynamoSafeguardingContract.js';

export const detroitDynamoOwnerLaunchReviewDecision = {
  decision: 'no_go_preview_only',
  label: 'No-Go: Preview Only',
  reason: 'Detroit Dynamo is ready for stakeholder review, but live backend, payment, waiver, league/facility, proof, SEO, redirect, and owner approval gates are still open.',
};

export const detroitDynamoOwnerLaunchReviewSections = [
  {
    id: 'current-site-preservation',
    label: 'Legacy public route preservation',
    ownerRole: 'Master Admin',
    status: 'review_ready',
    sourceGate: 'Legacy public route preservation',
    decisionQuestion: 'Can the team prove the existing Detroit Dynamo site, booking, auth, blog, forms, navigation, and rollback target are preserved before any brand promotion?',
    artifactReferences: [
      'artifacts/detroit-dynamo/goal-audit.json',
      'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Passing current-site route smoke output',
      'Passing browser QA with LC root and booking screenshots',
      'Rollback deployment id or previous production build target',
      'Owner-approved launch window before root-route promotion',
    ],
    blockedLiveActions: ['root route promotion', 'permanent redirects', 'noindex removal'],
    requiredBeforeGoLive: ['Record rollback target', 'Confirm owner launch window'],
  },
  {
    id: 'backend-data-activation',
    label: 'Backend data activation',
    ownerRole: 'Master Admin',
    status: 'blocked_until_backend',
    sourceGate: 'Data backend live',
    decisionQuestion: 'Are isolated Appwrite dd_* collections, deployed functions, permissions, production-preview submissions, and authenticated admin actions verified?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Backend preflight passes without exposing secrets',
      'Provision/apply transcript proves isolated dd_* collections exist',
      'Functions are deployed with expected scopes and variables',
      'Production-preview lead and admin action submissions pass',
    ],
    blockedLiveActions: ['Appwrite intake default', 'live lead routing', 'protected admin live writes'],
    requiredBeforeGoLive: ['Valid Appwrite credentials', 'Provisioned target project', 'Production-preview function smoke ids'],
  },
  {
    id: 'payments-packages',
    label: 'Payments and packages',
    ownerRole: 'Master Admin',
    status: 'blocked_until_external_approval',
    sourceGate: 'Payments approved',
    decisionQuestion: 'Has the owner approved package prices, provider product ids, taxes/fees, refund rules, and sandbox payment behavior?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Approved package matrix for training, camps, dues, tryouts, and sponsors',
      'Provider product ids or invoice workflow ids mapped to records',
      'Successful sandbox success, failure, cancel, refund, and webhook tests',
      'Refund, cancellation, and settlement handling documented',
    ],
    blockedLiveActions: ['checkout activation', 'payment collection', 'published exact pricing'],
    requiredBeforeGoLive: ['Owner package signoff', 'Provider sandbox evidence', 'Payment audit mapping'],
  },
  {
    id: 'waivers-legal',
    label: 'Waivers and legal',
    ownerRole: 'Registrar',
    status: 'blocked_until_external_approval',
    sourceGate: 'Waivers approved',
    decisionQuestion: 'Are waiver versions, guardian/adult signatures, medical consent, media release, retention, expiration, and revocation rules legally approved and tested?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Approved waiver/legal version register',
      'Guardian and adult signature workflow test evidence',
      'Medical, emergency, media, and travel consent rules approved',
      'Waiver status mapped to registration, roster, camp, and tryout workflows',
    ],
    blockedLiveActions: ['signature capture', 'medical intake', 'roster eligibility clearance'],
    requiredBeforeGoLive: ['Legal signoff', 'Signature workflow smoke test', 'Retention and revocation policy'],
  },
  {
    id: 'league-facility-facts',
    label: 'League, competition, and facility facts',
    ownerRole: 'Club Director',
    status: 'future_pathway',
    sourceGate: 'League and facility facts confirmed',
    decisionQuestion: 'Can every league, fixture, result, facility, schedule, venue, staff, and roster claim be backed by official confirmation or owner-approved wording?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Official league and competition documents before current-membership claims',
      'Confirmed facility access, permits, schedules, insurance, and emergency procedures',
      'Fixture, opponent, venue, roster, staff, and competition proof before publication',
      'Owner-approved public wording for every unconfirmed pathway reference',
    ],
    blockedLiveActions: ['league claim publication', 'fixture/result publication', 'facility publication'],
    requiredBeforeGoLive: ['League/facility confirmation', 'Approved public wording', 'Claim-by-claim proof register'],
  },
  {
    id: 'staff-roster-safeguarding',
    label: 'Staff, rosters, and safeguarding',
    ownerRole: 'Club Director',
    status: 'blocked_until_external_approval',
    sourceGate: 'League and facility facts confirmed',
    decisionQuestion: 'Are staff profiles, coach credentials, youth roster visibility, media releases, background/safeguarding status, and role grants approved?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Approved staff names, roles, bios, licenses, and public contact rules',
      'Background/safeguarding status for youth-facing staff',
      'Roster visibility follows guardian consent and media-release controls',
      'Team manager and coach access scoped by trusted role grants',
    ],
    blockedLiveActions: ['staff proof publication', 'youth roster publication', 'team-manager sensitive access'],
    requiredBeforeGoLive: ['Staff approval packet', 'Safeguarding review', 'Role grant verification'],
  },
  {
    id: 'sponsor-media-proof',
    label: 'Sponsor, media, and proof content',
    ownerRole: 'Media/Admin Staff',
    status: 'blocked_until_external_approval',
    sourceGate: 'League and facility facts confirmed',
    decisionQuestion: 'Are sponsor logos, testimonials, player stories, media clips, launch posts, proof assets, and sponsor inventory approved for public use?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Sponsor logo, website link, activation inventory, and display permissions',
      'Media releases and testimonial permissions',
      'News proof tied to approved source material',
      'Sponsor package promises match approved inventory',
    ],
    blockedLiveActions: ['sponsor logo publication', 'testimonial publication', 'player outcome publication'],
    requiredBeforeGoLive: ['Sponsor proof approval', 'Media release review', 'Content calendar signoff'],
  },
  {
    id: 'seo-redirect-cutover',
    label: 'SEO, redirects, and promotion cutover',
    ownerRole: 'Master Admin',
    status: 'preview_only',
    sourceGate: 'SEO and redirect launch approved',
    decisionQuestion: 'Are metadata, Open Graph assets, robots, sitemap, canonical URLs, noindex removal, redirect exclusions, QA, and rollback instructions approved?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-redirect-plan.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Approved metadata, social image, favicon, sitemap, robots, and canonical URLs',
      'Owner-approved noindex removal tied to launch window',
      'Redirect plan includes auth, admin, booking, and payment callback exclusions',
      'Post-cutover desktop/mobile route QA and rollback instructions are documented',
    ],
    blockedLiveActions: ['noindex removal', 'root metadata replacement', 'permanent redirects'],
    requiredBeforeGoLive: ['SEO owner signoff', 'Redirect QA plan', 'Rollback instructions'],
  },
  {
    id: 'postlaunch-monitoring',
    label: 'Post-launch monitoring and rollback watch',
    ownerRole: 'Master Admin',
    status: 'blocked_until_promotion',
    sourceGate: 'SEO and redirect launch approved',
    decisionQuestion: 'Is there a first-hour and first-week monitoring plan for route health, forms, booking, admin, payments, waivers, analytics, support, and rollback?',
    artifactReferences: [
      'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
      'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
      'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    ],
    evidenceRequired: [
      'Post-launch browser QA command and owner signoff path',
      'Rollback trigger list for core routes, forms, payments, auth, admin, and support failures',
      'Support inbox and legal/support communications monitoring plan',
      'Analytics/search-console observation window and closeout note',
    ],
    blockedLiveActions: ['post-launch closeout', 'permanent redirect finalization', 'launch announcement closeout'],
    requiredBeforeGoLive: ['Monitoring owner assigned', 'Rollback trigger list', 'Support/analytics watch plan'],
  },
];

function gateStatus(gateName) {
  return detroitDynamoPromotionGates.find((gate) => gate.gate === gateName)?.status || 'unknown';
}

function relatedEvidenceItems(section, launchEvidenceReport) {
  return launchEvidenceReport.checklistItems
    .filter((item) => item.promotionGate === section.sourceGate
      || item.confirmationArea === section.label
      || section.evidenceRequired.some((evidence) => item.requiredArtifact.toLowerCase().includes(evidence.toLowerCase().split(' ')[0])))
    .map((item) => ({
      id: item.id,
      status: item.status,
      ownerRole: item.ownerRole,
      requiredArtifact: item.requiredArtifact,
    }));
}

export function buildDetroitDynamoOwnerLaunchReviewReport() {
  const launchEvidenceReport = buildDetroitDynamoLaunchEvidenceReport();
  const launchEvidenceActionReport = buildDetroitDynamoLaunchEvidenceActionReport();
  const externalConfirmationActionReport = buildDetroitDynamoExternalConfirmationActionReport();
  const externalGateReport = buildDetroitDynamoExternalGateContractReport();
  const claimSafetyReport = buildDetroitDynamoClaimSafetyContractReport();
  const promotionCutoverReport = buildDetroitDynamoPromotionCutoverReport();
  const safeguardingReport = buildDetroitDynamoSafeguardingReport();

  const sections = detroitDynamoOwnerLaunchReviewSections.map((section) => ({
    ...section,
    promotionGateStatus: gateStatus(section.sourceGate),
    relatedEvidenceItems: relatedEvidenceItems(section, launchEvidenceReport),
  }));
  const blockedSections = sections.filter((section) => section.status !== 'review_ready');
  const externalApprovalsRequired = detroitDynamoExternalConfirmationRegister.filter((item) => item.status !== 'confirmed');
  const unresolvedEvidenceItems = launchEvidenceReport.checklistItems.filter((item) => item.status !== 'preview_passed');
  const blockedLiveActions = [...new Set(sections.flatMap((section) => section.blockedLiveActions))].sort();

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoOwnerLaunchReviewDecision,
    sections,
    summary: {
      sectionsTotal: sections.length,
      reviewReady: sections.filter((section) => section.status === 'review_ready').length,
      blockedSections: blockedSections.length,
      externalApprovalsRequired: externalApprovalsRequired.length,
      unresolvedEvidenceItems: unresolvedEvidenceItems.length,
      liveGatesCleared: launchEvidenceActionReport.summary.liveGatesCleared
        + externalConfirmationActionReport.summary.liveGatesCleared,
      publicationsUnlocked: externalConfirmationActionReport.summary.publicationsUnlocked,
      paymentPackageTracks: externalGateReport.paymentPackageTracks.length,
      waiverTracks: externalGateReport.waiverTracks.length,
      claimSafetyTracks: claimSafetyReport.claimSafetyTracks.length,
      cutoverTracks: promotionCutoverReport.cutoverTracks.length,
      safeguardingTracks: safeguardingReport.safeguardingTracks.length,
      backendActivationSteps: detroitDynamoBackendActivationSteps.length,
      blockedLiveActions: blockedLiveActions.length,
    },
    blockedLiveActions,
    requiredOwnerActions: [
      'Review this packet with the owner before any root-route, SEO, redirect, payment, waiver, or claim publication change.',
      'Attach real evidence for every unresolved launch evidence item.',
      'Fill the owner evidence intake worksheet so each proof item has a location, approver, decision, date, and notes.',
      'Record external confirmation actions for payments, waivers, league/facility facts, staff/rosters, sponsors/media, and SEO/redirects.',
      'Keep Detroit Dynamo under /detroit-dynamo until every external gate has real evidence and owner approval.',
    ],
    referencedReports: {
      launchEvidence: launchEvidenceReport.summary,
      launchEvidenceActions: launchEvidenceActionReport.summary,
      externalConfirmationActions: externalConfirmationActionReport.summary,
      promotionCutoverTracks: promotionCutoverReport.cutoverTracks.length,
      externalConfirmationRegisters: detroitDynamoExternalConfirmationRegister.length,
    },
    issues: [],
  };
  report.issues = auditDetroitDynamoOwnerLaunchReviewReport(report);

  return report;
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoOwnerLaunchReviewReport(
  report = buildDetroitDynamoOwnerLaunchReviewReport(),
) {
  const issues = [];
  const requiredSectionIds = [
    'current-site-preservation',
    'backend-data-activation',
    'payments-packages',
    'waivers-legal',
    'league-facility-facts',
    'staff-roster-safeguarding',
    'sponsor-media-proof',
    'seo-redirect-cutover',
    'postlaunch-monitoring',
  ];
  const allowedStatuses = new Set([
    'review_ready',
    'blocked_until_backend',
    'blocked_until_external_approval',
    'future_pathway',
    'preview_only',
    'blocked_until_promotion',
  ]);

  assertReport(report.decision?.decision === 'no_go_preview_only', 'Owner launch review must remain no-go while external gates are pending.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Owner launch review must not report cleared live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Owner launch review must not report unlocked publications.', issues);
  assertReport(report.sections.length >= requiredSectionIds.length, 'Owner launch review should include every launch decision section.', issues);
  assertReport(report.summary.externalApprovalsRequired >= 6, 'Owner launch review should keep external approval count visible.', issues);
  assertReport(report.blockedLiveActions.length >= 8, 'Owner launch review should list blocked live actions.', issues);
  assertReport(report.requiredOwnerActions.length >= 4, 'Owner launch review needs owner action guidance.', issues);

  for (const id of requiredSectionIds) {
    assertReport(report.sections.some((section) => section.id === id), `Missing owner launch review section: ${id}.`, issues);
  }

  const ids = new Set();
  for (const section of report.sections) {
    assertReport(!ids.has(section.id), `Duplicate owner launch review section id: ${section.id}.`, issues);
    ids.add(section.id);
    assertReport(allowedStatuses.has(section.status), `${section.id} has unsupported status ${section.status}.`, issues);
    assertReport(section.ownerRole && section.ownerRole.length > 3, `${section.id} needs an owner role.`, issues);
    assertReport(section.decisionQuestion && section.decisionQuestion.endsWith('?'), `${section.id} needs a decision question.`, issues);
    assertReport(Array.isArray(section.artifactReferences) && section.artifactReferences.length >= 2, `${section.id} needs artifact references.`, issues);
    assertReport(Array.isArray(section.evidenceRequired) && section.evidenceRequired.length >= 4, `${section.id} needs at least four evidence requirements.`, issues);
    assertReport(Array.isArray(section.blockedLiveActions) && section.blockedLiveActions.length >= 3, `${section.id} needs blocked live actions.`, issues);
    assertReport(Array.isArray(section.requiredBeforeGoLive) && section.requiredBeforeGoLive.length >= 2, `${section.id} needs go-live prerequisites.`, issues);
  }

  return issues;
}

export function buildDetroitDynamoOwnerLaunchReviewMarkdown(
  report = buildDetroitDynamoOwnerLaunchReviewReport(),
) {
  const lines = [
    '# Detroit Dynamo Owner Launch Review Packet',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Review sections: ${report.summary.sectionsTotal}`,
    `- Review-ready sections: ${report.summary.reviewReady}`,
    `- Blocked sections: ${report.summary.blockedSections}`,
    `- External approvals required: ${report.summary.externalApprovalsRequired}`,
    `- Unresolved evidence items: ${report.summary.unresolvedEvidenceItems}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    '',
    '## Required Owner Actions',
    '',
    ...report.requiredOwnerActions.map((action) => `- [ ] ${action}`),
    '',
    '## Review Sections',
    '',
    '| Section | Status | Owner | Decision Question |',
    '| --- | --- | --- | --- |',
    ...report.sections.map((section) => (
      `| ${section.label} | ${section.status} | ${section.ownerRole} | ${section.decisionQuestion} |`
    )),
    '',
    '## Section Details',
    '',
    ...report.sections.flatMap((section) => [
      `### ${section.label}`,
      '',
      `Status: ${section.status}`,
      '',
      `Promotion gate status: ${section.promotionGateStatus}`,
      '',
      'Evidence required:',
      ...section.evidenceRequired.map((item) => `- [ ] ${item}`),
      '',
      'Artifacts:',
      ...section.artifactReferences.map((item) => `- ${item}`),
      '',
      'Blocked live actions:',
      ...section.blockedLiveActions.map((item) => `- ${item}`),
      '',
      'Required before go-live:',
      ...section.requiredBeforeGoLive.map((item) => `- [ ] ${item}`),
      '',
    ]),
    '## Blocked Live Actions',
    '',
    ...report.blockedLiveActions.map((action) => `- ${action}`),
    '',
    'This packet is a review aid only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish league/facility/staff/sponsor claims, remove noindex, or apply redirects.',
    '',
  ];

  return lines.join('\n');
}
