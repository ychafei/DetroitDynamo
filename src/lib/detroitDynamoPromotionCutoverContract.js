import {
  detroitDynamoBackendActivationSteps,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoLaunchReadiness,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';

export const detroitDynamoPromotionCutoverTracks = [
  {
    id: 'current-site-snapshot-rollback',
    label: 'Legacy public route snapshot and rollback',
    phase: 'Pre-promotion',
    ownerRole: 'Master Admin',
    status: 'preview_ready',
    affectedRoutes: ['/', '/about', '/book', '/lcfc', '/team', '/blog', '/apply', '/admin'],
    currentState: 'Current Detroit Dynamo routes, booking, auth, blog, team, legacy club, and admin flows remain live.',
    cutoverAction: 'Capture route screenshots, smoke-test outputs, current metadata, env values, and deployment id before any promotion change.',
    rollbackAction: 'Revert the routing change to the last known Detroit Dynamo deployment and keep `/detroit-dynamo` as the preview shell.',
    requiredEvidence: [
      'Passing current-site route smoke test',
      'Passing existing booking/auth/admin checks',
      'Production deployment id or rollback target',
      'Owner approval that a promotion window is open',
    ],
    blockedUntil: 'Do not switch the root experience until current-site preservation evidence and rollback instructions are saved.',
  },
  {
    id: 'root-route-shell-promotion',
    label: 'Root route and public shell promotion',
    phase: 'Promotion window',
    ownerRole: 'Master Admin',
    status: 'blocked_until_approval',
    affectedRoutes: ['/', '/detroit-dynamo', '/detroit-dynamo/*'],
    currentState: 'Detroit Dynamo remains isolated under `/detroit-dynamo` and root still renders the current Detroit Dynamo shell.',
    cutoverAction: 'Promote the Detroit Dynamo layout to the approved public entry point only after all promotion gates pass.',
    rollbackAction: 'Restore the current Detroit Dynamo root route and keep Dynamo available only under the preview route.',
    requiredEvidence: [
      'Owner-approved launch timing',
      'Verified Detroit Dynamo root shell on desktop and mobile',
      'No old LC header/footer inside Dynamo routes',
      'No broken legacy public route after rollback rehearsal',
    ],
    blockedUntil: 'Owner signs off on the full brand switch and all external promotion gates are cleared.',
  },
  {
    id: 'seo-metadata-indexing',
    label: 'SEO, metadata, robots, and indexing',
    phase: 'Promotion window',
    ownerRole: 'Media/Admin Staff',
    status: 'blocked_until_approval',
    affectedRoutes: ['/detroit-dynamo', '/detroit-dynamo/*', '/detroit-dynamo-sitemap.xml'],
    currentState: 'Dynamo preview pages intentionally use preview metadata and noindex/noindex-style launch controls.',
    cutoverAction: 'Apply approved Detroit Dynamo titles, descriptions, favicon, social image, canonical URLs, robots, and sitemap publication.',
    rollbackAction: 'Reapply preview noindex and restore current Detroit Dynamo metadata at root if the launch is reversed.',
    requiredEvidence: [
      'Approved metadata and Open Graph assets',
      'Approved sitemap and robots draft',
      'Noindex removal approval',
      'Search-console or SEO-owner launch acknowledgement',
    ],
    blockedUntil: 'Do not remove preview noindex or publish Dynamo root SEO until the owner approves launch metadata.',
  },
  {
    id: 'redirect-alias-migration',
    label: 'Redirect and alias migration',
    phase: 'Promotion window',
    ownerRole: 'Master Admin',
    status: 'blocked_until_approval',
    affectedRoutes: ['/book', '/lcfc', '/team', '/apply', '/detroit-dynamo/book', '/detroit-dynamo/fc'],
    currentState: 'Old LC routes remain real routes, and Detroit Dynamo redirect plans are draft-only launch artifacts.',
    cutoverAction: 'Apply approved redirects from old LC public paths to Dynamo equivalents without breaking auth, admin, or payment callbacks.',
    rollbackAction: 'Disable the redirect rules and restore old LC public paths as canonical routes.',
    requiredEvidence: [
      'Approved redirect plan',
      'Booking/payment callback exclusions reviewed',
      'Admin/auth route exclusions reviewed',
      'Post-cutover 200/301 route verification',
    ],
    blockedUntil: 'Do not apply permanent redirects while the preview is still used for comparison.',
  },
  {
    id: 'backend-intake-cutover',
    label: 'Backend intake and admin data cutover',
    phase: 'Backend activation',
    ownerRole: 'Master Admin',
    status: 'blocked_until_backend',
    affectedRoutes: ['/detroit-dynamo/contact', '/detroit-dynamo/tryouts', '/detroit-dynamo/book', '/admin/detroit-dynamo'],
    currentState: 'Dynamo public forms use local preview storage with optional Appwrite intake mode and fallback.',
    cutoverAction: 'Use live Appwrite intake after `dd_*` collections, functions, permissions, and status-action workflows are deployed and tested.',
    rollbackAction: 'Switch the admin intake mode back to local preview/fallback and stop writing Dynamo records until the backend is repaired.',
    requiredEvidence: [
      'Provisioned isolated `dd_*` collections',
      'Deployed lead intake and pipeline action functions',
      'Production-preview submissions for every lead type',
      'Admin pipeline status updates verified with authenticated users',
    ],
    blockedUntil: 'Appwrite credentials, collections, functions, permissions, and production-preview submissions are verified.',
  },
  {
    id: 'booking-payment-waiver-cutover',
    label: 'Booking, payment, package, and waiver cutover',
    phase: 'External approvals',
    ownerRole: 'Master Admin',
    status: 'blocked_until_external_approval',
    affectedRoutes: ['/book', '/detroit-dynamo/book', '/detroit-dynamo/training', '/detroit-dynamo/camps-clinics', '/detroit-dynamo/tryouts'],
    currentState: 'Existing booking/payment flows remain live, and Dynamo packages/waivers remain inquiry-only or approval-gated.',
    cutoverAction: 'Connect approved Dynamo packages, payment provider products, refund rules, waivers, and signature workflows.',
    rollbackAction: 'Disable Dynamo checkout/signature entry points and route visitors back to inquiry forms or the existing booking fallback.',
    requiredEvidence: [
      'Approved package matrix and provider product ids',
      'Approved refund/cancellation rules',
      'Approved waiver versions and signature workflow',
      'Successful payment and waiver sandbox tests',
    ],
    blockedUntil: 'Payments/packages and waivers/legal external gates are approved.',
  },
  {
    id: 'legal-support-communications',
    label: 'Legal, support, and communications cutover',
    phase: 'External approvals',
    ownerRole: 'Media/Admin Staff',
    status: 'blocked_until_external_approval',
    affectedRoutes: ['/terms', '/privacy', '/contact', '/detroit-dynamo/contact'],
    currentState: 'Legacy Detroit Dynamo legal/support references remain in place until support, legal, payment, and email sender changes are approved.',
    cutoverAction: 'Update support inboxes, sender names, legal pages, transactional emails, receipts, unsubscribe wording, and public contact copy.',
    rollbackAction: 'Restore Detroit Dynamo legal/support copy and transactional sender settings if the brand switch is paused.',
    requiredEvidence: [
      'Approved Detroit Dynamo support inbox and sender identity',
      'Approved legal entity, terms, privacy, and refund/support language',
      'Transactional email and receipt templates reviewed',
      'Unsubscribe and contact routing tested',
    ],
    blockedUntil: 'Legal/support ownership and sender-domain readiness are approved.',
  },
  {
    id: 'content-proof-publication',
    label: 'Content proof publication',
    phase: 'External approvals',
    ownerRole: 'Club Director',
    status: 'blocked_until_external_approval',
    affectedRoutes: ['/detroit-dynamo/about', '/detroit-dynamo/teams', '/detroit-dynamo/schedule-results', '/detroit-dynamo/sponsors'],
    currentState: 'Dynamo pages use honest future-pathway language, roster-ready layouts, proof slots, and placeholder states.',
    cutoverAction: 'Publish confirmed staff, rosters, sponsors, facilities, fixtures, news, testimonials, and proof assets.',
    rollbackAction: 'Remove unapproved proof content and return the affected sections to placeholder or interest-only states.',
    requiredEvidence: [
      'Approved staff, roster, and sponsor assets',
      'Media releases and proof permissions',
      'Confirmed fixtures/results/facilities before publication',
      'Club director approval for public claims',
    ],
    blockedUntil: 'Claim-safety and external confirmation gates clear for each public proof item.',
  },
  {
    id: 'monitoring-qa-postlaunch',
    label: 'Monitoring, QA, and post-launch watch',
    phase: 'Post-promotion',
    ownerRole: 'Master Admin',
    status: 'blocked_until_promotion',
    affectedRoutes: ['/', '/book', '/admin', '/detroit-dynamo/*'],
    currentState: 'Preview QA runs against the isolated Dynamo shell while the legacy public route remains public.',
    cutoverAction: 'Run post-launch route, mobile, console, link, form, booking, admin, payment, waiver, and analytics checks.',
    rollbackAction: 'Trigger rollback if core routes, forms, payments, auth, admin, or legal/support workflows fail after launch.',
    requiredEvidence: [
      'Passing browser QA after promotion',
      'Passing lint/build/typecheck/smoke tests',
      'No critical console errors or dead public CTAs',
      'Owner sign-off after the first launch verification pass',
    ],
    blockedUntil: 'Do not close the promotion window until post-launch QA and rollback readiness are documented.',
  },
];

export function buildDetroitDynamoPromotionCutoverReport() {
  const issues = auditDetroitDynamoPromotionCutoverContract();
  return {
    generatedAt: new Date().toISOString(),
    cutoverTracks: detroitDynamoPromotionCutoverTracks.map((track) => ({
      ...track,
      relatedPromotionGates: detroitDynamoPromotionGates.filter((gate) => (
        track.blockedUntil.toLowerCase().includes(gate.gate.toLowerCase().split(' ')[0])
        || track.requiredEvidence.join(' ').toLowerCase().includes(gate.gate.toLowerCase().split(' ')[0])
      )),
    })),
    launchReadiness: detroitDynamoLaunchReadiness,
    promotionGates: detroitDynamoPromotionGates,
    backendActivationSteps: detroitDynamoBackendActivationSteps,
    confirmationRegisters: detroitDynamoExternalConfirmationRegister,
    issues,
  };
}

export function buildDetroitDynamoPromotionCutoverMarkdown(
  report = buildDetroitDynamoPromotionCutoverReport(),
) {
  const lines = [
    '# Detroit Dynamo Promotion Cutover Contract',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    'This contract defines how the isolated Detroit Dynamo preview can become the public brand without breaking the current Detroit Dynamo site, booking flow, auth, admin, legal/support copy, SEO, redirects, or rollback path.',
    '',
    '| Track | Phase | Status | Owner | Affected Routes | Blocked Until |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.cutoverTracks.map((track) => (
      `| ${track.label} | ${track.phase} | ${track.status} | ${track.ownerRole} | ${track.affectedRoutes.join(', ')} | ${track.blockedUntil} |`
    )),
    '',
    '## Track Details',
    '',
    ...report.cutoverTracks.flatMap((track) => [
      `### ${track.label}`,
      '',
      `Current state: ${track.currentState}`,
      '',
      `Cutover action: ${track.cutoverAction}`,
      '',
      `Rollback action: ${track.rollbackAction}`,
      '',
      'Required evidence:',
      ...track.requiredEvidence.map((item) => `- [ ] ${item}`),
      '',
    ]),
    '## Promotion Rule',
    '',
    'Detroit Dynamo should remain preview-only until every cutover track has owner-approved evidence and a rollback path. Permanent redirects, root-route promotion, payment/waiver activation, support sender changes, and noindex removal are not preview tasks.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoPromotionCutoverContract() {
  const issues = [];
  const requiredTrackIds = [
    'current-site-snapshot-rollback',
    'root-route-shell-promotion',
    'seo-metadata-indexing',
    'redirect-alias-migration',
    'backend-intake-cutover',
    'booking-payment-waiver-cutover',
    'legal-support-communications',
    'content-proof-publication',
    'monitoring-qa-postlaunch',
  ];
  const allowedStatuses = new Set([
    'preview_ready',
    'blocked_until_approval',
    'blocked_until_backend',
    'blocked_until_external_approval',
    'blocked_until_promotion',
  ]);
  const allowedOwnerRoles = new Set(['Master Admin', 'Media/Admin Staff', 'Club Director']);

  for (const id of requiredTrackIds) {
    if (!detroitDynamoPromotionCutoverTracks.some((track) => track.id === id)) {
      issues.push(`Missing promotion cutover track: ${id}`);
    }
  }

  const ids = new Set();
  for (const track of detroitDynamoPromotionCutoverTracks) {
    if (ids.has(track.id)) issues.push(`Duplicate promotion cutover track id: ${track.id}`);
    ids.add(track.id);
    if (!allowedStatuses.has(track.status)) {
      issues.push(`${track.id} has an unsafe promotion status`);
    }
    if (['live', 'complete', 'promoted'].includes(track.status)) {
      issues.push(`${track.id} must not be marked live while Detroit Dynamo remains preview-only`);
    }
    if (!allowedOwnerRoles.has(track.ownerRole)) {
      issues.push(`${track.id} has an unexpected owner role`);
    }
    if (!Array.isArray(track.affectedRoutes) || track.affectedRoutes.length === 0) {
      issues.push(`${track.id} needs affected routes`);
    }
    if (!track.currentState || !track.cutoverAction || !track.rollbackAction || !track.blockedUntil) {
      issues.push(`${track.id} needs current state, cutover action, rollback action, and blocked-until text`);
    }
    if (!Array.isArray(track.requiredEvidence) || track.requiredEvidence.length < 4) {
      issues.push(`${track.id} needs at least 4 required evidence items`);
    }
  }

  const rootTrack = detroitDynamoPromotionCutoverTracks.find((track) => track.id === 'root-route-shell-promotion');
  if (!rootTrack || rootTrack.status !== 'blocked_until_approval') {
    issues.push('Root route promotion must remain blocked until owner approval');
  }

  const backendTrack = detroitDynamoPromotionCutoverTracks.find((track) => track.id === 'backend-intake-cutover');
  if (!backendTrack || backendTrack.status !== 'blocked_until_backend') {
    issues.push('Backend intake cutover must remain blocked until backend verification passes');
  }

  const legalTrack = detroitDynamoPromotionCutoverTracks.find((track) => track.id === 'legal-support-communications');
  if (!legalTrack || !legalTrack.requiredEvidence.some((item) => item.toLowerCase().includes('support inbox'))) {
    issues.push('Legal/support communications cutover must require support inbox approval');
  }

  return issues;
}
