import { buildDetroitDynamoLiveReadinessBoardReport } from './detroitDynamoLiveReadinessBoard.js';
import { buildDetroitDynamoOwnerEvidenceIntakeReport } from './detroitDynamoOwnerEvidenceIntake.js';
import { buildDetroitDynamoOwnerLaunchReviewReport } from './detroitDynamoOwnerLaunchReview.js';
import { buildDetroitDynamoOwnerSignoffRegisterReport } from './detroitDynamoOwnerSignoffRegister.js';
import { buildDetroitDynamoFinalAcceptanceMatrixReport } from './detroitDynamoFinalAcceptanceMatrix.js';
import { buildDetroitDynamoProductionPreviewEvidenceReport } from './detroitDynamoProductionPreviewEvidence.js';
import { buildDetroitDynamoVercelPreviewRunbookReport } from './detroitDynamoVercelPreviewRunbook.js';
import { buildDetroitDynamoSecretRedactionReport } from './detroitDynamoSecretRedactionContract.js';
import { buildDetroitDynamoExternalGateClosureReport } from './detroitDynamoExternalGateClosurePacket.js';

export const detroitDynamoLaunchArtifactIndexDecision = {
  decision: 'preview_handoff_index',
  label: 'Preview Handoff Index',
  reason: 'This index organizes the Detroit Dynamo launch artifacts for owner review without approving launch or unlocking live actions.',
};

export const detroitDynamoLaunchArtifactIndexItems = [
  {
    id: 'roadmap-doc',
    title: 'Rebrand Audit and Roadmap',
    ownerRole: 'Master Admin',
    category: 'Executive Summary',
    artifactPath: 'DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md',
    format: 'markdown',
    purpose: 'Primary summary of audit, implementation, remaining needs, testing, and next steps.',
    generatedBy: 'manual documentation update',
    verifyCommand: 'npm run audit:dynamo-goal',
    blocksActions: ['owner closeout', 'promotion decision'],
    launchQuestion: 'Does the handoff explain what was built, what remains external, and how it was verified?',
  },
  {
    id: 'goal-audit',
    title: 'Goal Audit Report',
    ownerRole: 'Master Admin',
    category: 'Executive Summary',
    artifactPath: 'artifacts/detroit-dynamo/goal-audit.json',
    format: 'json',
    purpose: 'Machine-readable 7/8 implemented-scope audit with the remaining external gate visible.',
    generatedBy: 'npm run audit:dynamo-goal',
    verifyCommand: 'npm run audit:dynamo-goal',
    blocksActions: ['goal completion claim', 'external gate closeout'],
    launchQuestion: 'Do implemented requirements still pass while external gates remain explicit?',
  },
  {
    id: 'final-acceptance-matrix',
    title: 'Final Acceptance Matrix',
    ownerRole: 'Master Admin',
    category: 'Executive Summary',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-final-acceptance-matrix.md',
    format: 'markdown',
    purpose: 'Requirement-by-requirement acceptance ledger separating preview-complete rows from external evidence required rows.',
    generatedBy: 'npm run verify:dynamo-final-acceptance',
    verifyCommand: 'npm run verify:dynamo-final-acceptance',
    blocksActions: ['goal completion claim', 'root route promotion', 'owner closeout'],
    launchQuestion: 'Does every original acceptance requirement have evidence and explicit remaining external gates?',
  },
  {
    id: 'owner-launch-review',
    title: 'Owner Launch Review Packet',
    ownerRole: 'Master Admin',
    category: 'Owner Decision',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-launch-review.md',
    format: 'markdown',
    purpose: 'No-go decision packet for owner review across backend, payments, waivers, facts, SEO, redirects, and monitoring.',
    generatedBy: 'npm run verify:dynamo-owner-launch-review',
    verifyCommand: 'npm run verify:dynamo-owner-launch-review',
    blocksActions: ['root route promotion', 'checkout activation', 'signature capture', 'public claim publication'],
    launchQuestion: 'Has the owner reviewed every go/no-go launch section?',
  },
  {
    id: 'owner-handoff-packet',
    title: 'Owner Handoff Packet',
    ownerRole: 'Master Admin',
    category: 'Owner Decision',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-handoff-packet.md',
    format: 'markdown',
    purpose: 'Single owner-meeting packet that consolidates redaction status, proof artifacts, verification commands, signoff state, and blocked live actions.',
    generatedBy: 'npm run verify:dynamo-owner-handoff-packet',
    verifyCommand: 'npm run verify:dynamo-owner-handoff-packet',
    blocksActions: ['owner launch decision', 'owner handoff distribution', 'goal completion claim', 'root route promotion'],
    launchQuestion: 'Does the owner have one redacted packet tying artifacts, commands, signoffs, evidence, and blocked live actions together?',
  },
  {
    id: 'external-gate-closure',
    title: 'External Gate Closure Packet',
    ownerRole: 'Master Admin',
    category: 'Owner Decision',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-external-gate-closure.md',
    format: 'markdown',
    purpose: 'Ordered closure rows for backend, payments, waivers, league/facility facts, proof publication, deployment, cutover, and final signoff evidence.',
    generatedBy: 'npm run verify:dynamo-external-gate-closure',
    verifyCommand: 'npm run verify:dynamo-external-gate-closure',
    blocksActions: ['external gate closeout', 'goal completion claim', 'root route promotion', 'checkout activation', 'signature capture'],
    launchQuestion: 'Does every remaining external gate have a role owner, required evidence, verification command, and blocked live action?',
  },
  {
    id: 'owner-evidence-intake',
    title: 'Owner Evidence Intake Worksheet',
    ownerRole: 'Master Admin',
    category: 'Owner Decision',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-evidence-intake.csv',
    format: 'csv',
    purpose: 'Fillable rows for proof location, approver, approval date, decision, and notes.',
    generatedBy: 'npm run verify:dynamo-owner-evidence-intake',
    verifyCommand: 'npm run verify:dynamo-owner-evidence-intake',
    blocksActions: ['owner launch decision', 'go-live row approval'],
    launchQuestion: 'Has every evidence item been given a real location, approver, date, and decision?',
  },
  {
    id: 'owner-signoff-register',
    title: 'Owner Signoff Register',
    ownerRole: 'Master Admin',
    category: 'Owner Decision',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-owner-signoff-register.md',
    format: 'markdown',
    purpose: 'Unsigned owner/external approval rows for final launch decisions across backend, deployment, payments, waivers, facts, content, SEO, redirects, and rollback.',
    generatedBy: 'npm run verify:dynamo-owner-signoff-register',
    verifyCommand: 'npm run verify:dynamo-owner-signoff-register',
    blocksActions: ['owner launch decision', 'root route promotion', 'checkout activation', 'signature capture', 'public claim publication', 'permanent redirects'],
    launchQuestion: 'Are all owner and external approvals still unsigned until real evidence is attached?',
  },
  {
    id: 'vercel-preview-runbook',
    title: 'Vercel Preview Deployment Runbook',
    ownerRole: 'Master Admin',
    category: 'Deployment',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-vercel-preview-runbook.md',
    format: 'markdown',
    purpose: 'Redacted Vercel CLI, preview deployment, inspect, QA, promotion-hold, and rollback command plan.',
    generatedBy: 'npm run verify:dynamo-vercel-preview',
    verifyCommand: 'npm run verify:dynamo-vercel-preview',
    blocksActions: ['production deployment', 'root route promotion', 'permanent redirects', 'owner launch decision'],
    launchQuestion: 'Has a Vercel preview URL, deployment id, route QA, inspect summary, and rollback target been recorded without exposing secrets?',
  },
  {
    id: 'secret-redaction',
    title: 'Secret Redaction Contract',
    ownerRole: 'Master Admin',
    category: 'Deployment',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-secret-redaction.md',
    format: 'markdown',
    purpose: 'Share-safety checklist and scanner for generated handoffs, source files, Vercel identifiers, and local provider secrets.',
    generatedBy: 'npm run verify:dynamo-secret-redaction',
    verifyCommand: 'npm run verify:dynamo-secret-redaction',
    blocksActions: ['owner handoff distribution', 'production promotion', 'checkout activation', 'live admin write activation'],
    launchQuestion: 'Do generated handoffs and source files avoid local secret values and Vercel project identifiers?',
  },
  {
    id: 'production-preview-evidence',
    title: 'Production Preview Evidence Matrix',
    ownerRole: 'Registrar',
    category: 'Owner Decision',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-production-preview-evidence.md',
    format: 'markdown',
    purpose: 'Production-preview proof checklist for public forms, admin functions, route QA, backend activation, and confirmations.',
    generatedBy: 'npm run verify:dynamo-production-preview-evidence',
    verifyCommand: 'npm run verify:dynamo-production-preview-evidence',
    blocksActions: ['Appwrite intake default', 'protected admin live writes', 'public launch announcement'],
    launchQuestion: 'Have production-preview submissions and admin action proofs been attached?',
  },
  {
    id: 'live-readiness-board',
    title: 'Live Readiness Board',
    ownerRole: 'Master Admin',
    category: 'Owner Decision',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-live-readiness-board.md',
    format: 'markdown',
    purpose: 'Final no-go/go phase board before any root, checkout, signature, redirect, or publication action.',
    generatedBy: 'npm run verify:dynamo-live-readiness-board',
    verifyCommand: 'npm run verify:dynamo-live-readiness-board',
    blocksActions: ['root route promotion', 'checkout activation', 'signature capture', 'noindex removal', 'permanent redirects'],
    launchQuestion: 'Is every launch phase still blocked until real evidence and owner approval exist?',
  },
  {
    id: 'deployment-readiness',
    title: 'Deployment Readiness Handoff',
    ownerRole: 'Master Admin',
    category: 'Deployment/Cutover',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-deployment-readiness.md',
    format: 'markdown',
    purpose: 'Hosting, environment, production-preview, domain, indexing, redirect, and rollback evidence required before root promotion.',
    generatedBy: 'npm run verify:dynamo-deployment-readiness',
    verifyCommand: 'npm run verify:dynamo-deployment-readiness',
    blocksActions: ['root route promotion', 'Appwrite intake default', 'permanent redirects', 'noindex removal', 'post-launch closeout'],
    launchQuestion: 'Are deployment ids, preview URLs, env evidence, and rollback targets recorded before promotion?',
  },
  {
    id: 'launch-evidence-checklist',
    title: 'Launch Evidence Checklist',
    ownerRole: 'Club Director',
    category: 'Launch Control',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-launch-evidence-checklist.md',
    format: 'markdown',
    purpose: 'Required proof list for site preservation, backend, payments, waivers, facts, SEO, redirects, and post-launch QA.',
    generatedBy: 'npm run verify:dynamo-launch-evidence',
    verifyCommand: 'npm run verify:dynamo-launch-evidence',
    blocksActions: ['promotion gate clearance', 'owner launch approval'],
    launchQuestion: 'Are all required proof items known and assigned?',
  },
  {
    id: 'launch-evidence-actions',
    title: 'Launch Evidence Action Handoff',
    ownerRole: 'Club Director',
    category: 'Launch Control',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-launch-evidence-actions.md',
    format: 'markdown',
    purpose: 'Preview-only ledger action model for attaching proof, requesting review, and requesting changes.',
    generatedBy: 'npm run verify:dynamo-launch-evidence-actions',
    verifyCommand: 'npm run verify:dynamo-launch-evidence-actions',
    blocksActions: ['live evidence clearance'],
    launchQuestion: 'Can operators record preview proof actions without clearing live gates?',
  },
  {
    id: 'external-confirmation-register',
    title: 'External Confirmation Register',
    ownerRole: 'Club Director',
    category: 'External Proof',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-register.md',
    format: 'markdown',
    purpose: 'Required facts and publish rules for payments, waivers, league/facility facts, staff, rosters, sponsors, media, and SEO.',
    generatedBy: 'npm run generate:dynamo-launch-assets',
    verifyCommand: 'npm run verify:dynamo',
    blocksActions: ['exact pricing publication', 'league claim publication', 'facility publication', 'sponsor proof publication'],
    launchQuestion: 'Which external facts are still unconfirmed?',
  },
  {
    id: 'external-confirmation-actions',
    title: 'External Confirmation Action Handoff',
    ownerRole: 'Club Director',
    category: 'External Proof',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-external-confirmation-actions.md',
    format: 'markdown',
    purpose: 'Preview-only approval routing model that cannot unlock publication or clear live gates.',
    generatedBy: 'npm run verify:dynamo-external-confirmation-actions',
    verifyCommand: 'npm run verify:dynamo-external-confirmation-actions',
    blocksActions: ['publication approval', 'checkout activation', 'signature capture'],
    launchQuestion: 'Can owner signoff requests be rehearsed without publishing facts?',
  },
  {
    id: 'payment-waiver-gates',
    title: 'Payment and Waiver Gate Contract',
    ownerRole: 'Registrar',
    category: 'External Proof',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-payment-waiver-gates.md',
    format: 'markdown',
    purpose: 'Payment/package and waiver/legal readiness tracks with publish modes and approval needs.',
    generatedBy: 'npm run verify:dynamo-gate-contracts',
    verifyCommand: 'npm run verify:dynamo-gate-contracts',
    blocksActions: ['checkout activation', 'payment collection', 'signature capture', 'medical intake'],
    launchQuestion: 'Are checkout and waiver workflows still gated until owner/legal approval?',
  },
  {
    id: 'claim-safety',
    title: 'Public Claim Safety Contract',
    ownerRole: 'Media/Admin Staff',
    category: 'External Proof',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-claim-safety.md',
    format: 'markdown',
    purpose: 'Claim guardrails for league, facility, roster, staff, sponsor, testimonial, media, and outcome proof.',
    generatedBy: 'npm run verify:dynamo-claim-safety',
    verifyCommand: 'npm run verify:dynamo-claim-safety',
    blocksActions: ['league claim publication', 'staff proof publication', 'sponsor logo publication'],
    launchQuestion: 'Are unconfirmed claims still future-pathway or placeholder language?',
  },
  {
    id: 'safeguarding-privacy',
    title: 'Safeguarding and Privacy Contract',
    ownerRole: 'Registrar',
    category: 'External Proof',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-safeguarding-privacy.md',
    format: 'markdown',
    purpose: 'Youth, guardian, staff, medical, waiver, media, roster, retention, export, deletion, and audit controls.',
    generatedBy: 'npm run verify:dynamo-safeguarding',
    verifyCommand: 'npm run verify:dynamo-safeguarding',
    blocksActions: ['youth registration launch', 'medical intake', 'youth roster publication', 'sensitive admin mutations'],
    launchQuestion: 'Are youth-facing operations still blocked until safeguarding evidence is approved?',
  },
  {
    id: 'backend-runbook',
    title: 'Backend Activation Runbook',
    ownerRole: 'Master Admin',
    category: 'Backend/Admin',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-backend-activation-runbook.md',
    format: 'markdown',
    purpose: 'Ordered Appwrite preflight, schema, provisioning, function, intake, and promotion-gate steps.',
    generatedBy: 'npm run generate:dynamo-launch-assets',
    verifyCommand: 'npm run preflight:dynamo-backend',
    blocksActions: ['Appwrite intake default', 'protected admin live writes', 'live lead routing'],
    launchQuestion: 'What must happen before live Appwrite mode is enabled?',
  },
  {
    id: 'lead-intake-handoff',
    title: 'Lead Intake Function Handoff',
    ownerRole: 'Media/Admin Staff',
    category: 'Backend/Admin',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-lead-intake-handoff.md',
    format: 'markdown',
    purpose: 'Function contract and fixtures for all public lead form variants.',
    generatedBy: 'npm run verify:dynamo-intake-contract',
    verifyCommand: 'npm run verify:dynamo-intake-contract',
    blocksActions: ['default live intake'],
    launchQuestion: 'Do public forms map to the expected dd_* records?',
  },
  {
    id: 'pipeline-action-handoff',
    title: 'Pipeline Action Function Handoff',
    ownerRole: 'Registrar',
    category: 'Backend/Admin',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-pipeline-action-handoff.md',
    format: 'markdown',
    purpose: 'Authenticated status transition fixtures and rejection cases.',
    generatedBy: 'npm run verify:dynamo-pipeline-actions',
    verifyCommand: 'npm run verify:dynamo-pipeline-actions',
    blocksActions: ['live lead status transitions'],
    launchQuestion: 'Are pipeline transitions scoped and auditable?',
  },
  {
    id: 'admin-module-read-handoff',
    title: 'Admin Module Read Handoff',
    ownerRole: 'Master Admin',
    category: 'Backend/Admin',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-read-handoff.md',
    format: 'markdown',
    purpose: 'Authenticated module read fixtures, scopes, and rejection cases.',
    generatedBy: 'npm run verify:dynamo-admin-module-read',
    verifyCommand: 'npm run verify:dynamo-admin-module-read',
    blocksActions: ['protected admin live reads'],
    launchQuestion: 'Are admin reads role-scoped before live data browsing?',
  },
  {
    id: 'admin-module-write-handoff',
    title: 'Admin Module Write Handoff',
    ownerRole: 'Master Admin',
    category: 'Backend/Admin',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-module-write-handoff.md',
    format: 'markdown',
    purpose: 'Authenticated create/update/archive fixtures and rejection cases for future admin writes.',
    generatedBy: 'npm run verify:dynamo-admin-module-writes',
    verifyCommand: 'npm run verify:dynamo-admin-module-writes',
    blocksActions: ['protected admin live writes', 'fixture/result publication', 'payment/waiver/sponsor mutation'],
    launchQuestion: 'Are live admin writes still blocked until external gates and roles are approved?',
  },
  {
    id: 'role-grant-handoff',
    title: 'Admin Role Grant Handoff',
    ownerRole: 'Master Admin',
    category: 'Backend/Admin',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-role-grant-handoff.md',
    format: 'markdown',
    purpose: 'Master Admin role grant bootstrap and role assignment action contract.',
    generatedBy: 'npm run verify:dynamo-admin-role-grants',
    verifyCommand: 'npm run verify:dynamo-admin-role-grants',
    blocksActions: ['trusted role grants', 'protected admin live access'],
    launchQuestion: 'Can trusted roles be granted without opening broad admin access?',
  },
  {
    id: 'record-workspace',
    title: 'Admin Record Workspace Handoff',
    ownerRole: 'Club Director',
    category: 'Backend/Admin',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-admin-record-workspace.md',
    format: 'markdown',
    purpose: 'Preview record workspace and CSV export planning for module detail pages.',
    generatedBy: 'npm run verify:dynamo-admin-record-workspace',
    verifyCommand: 'npm run verify:dynamo-admin-record-workspace',
    blocksActions: ['admin CRUD launch', 'live record migration'],
    launchQuestion: 'Are preview record workspaces ready without mutating live records?',
  },
  {
    id: 'promotion-cutover',
    title: 'Promotion Cutover Control',
    ownerRole: 'Master Admin',
    category: 'SEO/Cutover',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-promotion-cutover.md',
    format: 'markdown',
    purpose: 'Root route, metadata, noindex, redirect, legal/support, booking/payment/waiver, and rollback controls.',
    generatedBy: 'npm run verify:dynamo-promotion-cutover',
    verifyCommand: 'npm run verify:dynamo-promotion-cutover',
    blocksActions: ['root route promotion', 'noindex removal', 'permanent redirects'],
    launchQuestion: 'What remains blocked before Detroit Dynamo can replace the LC root?',
  },
  {
    id: 'redirect-plan',
    title: 'Redirect Plan Draft',
    ownerRole: 'Master Admin',
    category: 'SEO/Cutover',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-redirect-plan.md',
    format: 'markdown',
    purpose: 'Draft redirect timing for old LC routes into future Detroit Dynamo routes.',
    generatedBy: 'npm run generate:dynamo-launch-assets',
    verifyCommand: 'BASE_URL=<production-preview-url> npm run verify:dynamo',
    blocksActions: ['permanent redirects', 'canonical migration'],
    launchQuestion: 'Which redirects must wait for promotion approval?',
  },
  {
    id: 'sitemap-preview',
    title: 'Sitemap Preview',
    ownerRole: 'Media/Admin Staff',
    category: 'SEO/Cutover',
    artifactPath: 'artifacts/detroit-dynamo/launch/detroit-dynamo-sitemap-preview.xml',
    format: 'xml',
    purpose: 'Sitemap-ready Detroit Dynamo preview routes.',
    generatedBy: 'npm run generate:dynamo-launch-assets',
    verifyCommand: 'BASE_URL=<production-preview-url> npm run verify:dynamo',
    blocksActions: ['sitemap publication', 'noindex removal'],
    launchQuestion: 'Which Dynamo routes are sitemap-ready after SEO approval?',
  },
  {
    id: 'browser-qa-report',
    title: 'Browser QA Report',
    ownerRole: 'Master Admin',
    category: 'Verification',
    artifactPath: 'artifacts/detroit-dynamo/browser-qa/browser-qa-report.json',
    format: 'json',
    purpose: 'Rendered route, form, button, link, console, and protected admin QA evidence.',
    generatedBy: 'BASE_URL=http://127.0.0.1:5182 npm run qa:dynamo-browser',
    verifyCommand: 'BASE_URL=<target-url> npm run qa:dynamo-browser',
    blocksActions: ['post-cutover closeout', 'launch announcement'],
    launchQuestion: 'Do desktop/mobile routes, public forms, and protected admin pages render cleanly?',
  },
];

export const detroitDynamoLaunchArtifactIndexColumns = [
  'id',
  'title',
  'category',
  'ownerRole',
  'format',
  'artifactPath',
  'generatedBy',
  'verifyCommand',
  'launchQuestion',
  'blocksActions',
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

export function buildDetroitDynamoLaunchArtifactIndexReport() {
  const ownerLaunchReview = buildDetroitDynamoOwnerLaunchReviewReport();
  const ownerEvidenceIntake = buildDetroitDynamoOwnerEvidenceIntakeReport();
  const ownerSignoffRegister = buildDetroitDynamoOwnerSignoffRegisterReport();
  const finalAcceptanceMatrix = buildDetroitDynamoFinalAcceptanceMatrixReport();
  const vercelPreviewRunbook = buildDetroitDynamoVercelPreviewRunbookReport();
  const secretRedaction = buildDetroitDynamoSecretRedactionReport();
  const externalGateClosure = buildDetroitDynamoExternalGateClosureReport();
  const productionPreviewEvidence = buildDetroitDynamoProductionPreviewEvidenceReport();
  const liveReadinessBoard = buildDetroitDynamoLiveReadinessBoardReport();
  const blockedLiveActions = [...new Set(
    detroitDynamoLaunchArtifactIndexItems.flatMap((item) => item.blocksActions),
  )].sort();
  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoLaunchArtifactIndexDecision,
    columns: detroitDynamoLaunchArtifactIndexColumns,
    items: detroitDynamoLaunchArtifactIndexItems,
    summary: {
      artifactsTotal: detroitDynamoLaunchArtifactIndexItems.length,
      categories: Object.keys(countBy(detroitDynamoLaunchArtifactIndexItems, 'category')).length,
      ownerRoles: Object.keys(countBy(detroitDynamoLaunchArtifactIndexItems, 'ownerRole')).length,
      markdownArtifacts: detroitDynamoLaunchArtifactIndexItems.filter((item) => item.format === 'markdown').length,
      csvArtifacts: detroitDynamoLaunchArtifactIndexItems.filter((item) => item.format === 'csv').length,
      jsonArtifacts: detroitDynamoLaunchArtifactIndexItems.filter((item) => item.format === 'json').length,
      blockedLiveActions: blockedLiveActions.length,
      ownerLaunchReviewSections: ownerLaunchReview.summary.sectionsTotal,
      ownerEvidenceIntakeRows: ownerEvidenceIntake.summary.intakeRows,
      ownerSignoffRows: ownerSignoffRegister.summary.signoffRows,
      ownerUnsignedSignoffRows: ownerSignoffRegister.summary.unsignedRows,
      finalAcceptanceRows: finalAcceptanceMatrix.summary.acceptanceRows,
      finalAcceptanceExternalRows: finalAcceptanceMatrix.summary.externalEvidenceRequiredRows,
      vercelPreviewSteps: vercelPreviewRunbook.summary.stepsTotal,
      vercelPreviewCliUpgradeRecommended: vercelPreviewRunbook.summary.cliUpgradeRecommended,
      secretRedactionRules: secretRedaction.summary.rulesTotal,
      secretRedactionLeakages: secretRedaction.summary.leakagesDetected,
      externalGateClosureRows: externalGateClosure.summary.rowsTotal,
      externalGateClosureAllowedRows: externalGateClosure.summary.closureAllowedRows,
      productionPreviewTracks: productionPreviewEvidence.summary.tracksTotal,
      liveReadinessRows: liveReadinessBoard.summary.rowsTotal,
      liveGatesCleared: ownerLaunchReview.summary.liveGatesCleared
        + ownerEvidenceIntake.summary.liveGatesCleared
        + ownerSignoffRegister.summary.liveGatesCleared
        + productionPreviewEvidence.summary.liveGatesCleared
        + liveReadinessBoard.summary.liveGatesCleared,
      publicationsUnlocked: ownerLaunchReview.summary.publicationsUnlocked
        + ownerEvidenceIntake.summary.publicationsUnlocked
        + ownerSignoffRegister.summary.publicationsUnlocked
        + productionPreviewEvidence.summary.publicationsUnlocked
        + liveReadinessBoard.summary.publicationsUnlocked,
    },
    categories: countBy(detroitDynamoLaunchArtifactIndexItems, 'category'),
    ownerRoles: countBy(detroitDynamoLaunchArtifactIndexItems, 'ownerRole'),
    blockedLiveActions,
    usageRules: [
      'Start with the Live Readiness Board, then the Owner Launch Review Packet, then the Owner Evidence Intake Worksheet.',
      'Do not treat any index item as launch approval; it only points to the artifact that must be reviewed.',
      'Keep preview-only counters at zero until real external evidence and owner approval are attached.',
      'Run the artifact-specific verify command after updating any handoff file.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoLaunchArtifactIndexReport(report);
  return report;
}

export function buildDetroitDynamoLaunchArtifactIndexCsv(
  report = buildDetroitDynamoLaunchArtifactIndexReport(),
) {
  return [
    report.columns.join(','),
    ...report.items.map((item) => (
      report.columns.map((column) => csvEscape(item[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoLaunchArtifactIndexMarkdown(
  report = buildDetroitDynamoLaunchArtifactIndexReport(),
) {
  const lines = [
    '# Detroit Dynamo Launch Artifact Index',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Artifacts: ${report.summary.artifactsTotal}`,
    `- Categories: ${report.summary.categories}`,
    `- Owner roles: ${report.summary.ownerRoles}`,
    `- Markdown artifacts: ${report.summary.markdownArtifacts}`,
    `- CSV artifacts: ${report.summary.csvArtifacts}`,
    `- JSON artifacts: ${report.summary.jsonArtifacts}`,
    `- Blocked live actions: ${report.summary.blockedLiveActions}`,
    `- Owner launch review sections: ${report.summary.ownerLaunchReviewSections}`,
    `- Owner evidence intake rows: ${report.summary.ownerEvidenceIntakeRows}`,
    `- Owner signoff rows: ${report.summary.ownerSignoffRows}`,
    `- Owner unsigned signoff rows: ${report.summary.ownerUnsignedSignoffRows}`,
    `- Final acceptance rows: ${report.summary.finalAcceptanceRows}`,
    `- Final acceptance external rows: ${report.summary.finalAcceptanceExternalRows}`,
    `- Vercel preview steps: ${report.summary.vercelPreviewSteps}`,
    `- Vercel CLI upgrade recommended: ${report.summary.vercelPreviewCliUpgradeRecommended}`,
    `- Secret redaction rules: ${report.summary.secretRedactionRules}`,
    `- Secret redaction leakages: ${report.summary.secretRedactionLeakages}`,
    `- External gate closure rows: ${report.summary.externalGateClosureRows}`,
    `- External gate closure allowed rows: ${report.summary.externalGateClosureAllowedRows}`,
    `- Production-preview tracks: ${report.summary.productionPreviewTracks}`,
    `- Live readiness rows: ${report.summary.liveReadinessRows}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Artifact Index',
    '',
    '| Artifact | Category | Owner | Path | Verify | Launch Question |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.items.map((item) => (
      `| ${item.title} | ${item.category} | ${item.ownerRole} | \`${item.artifactPath}\` | \`${item.verifyCommand}\` | ${item.launchQuestion} |`
    )),
    '',
    '## Category Counts',
    '',
    ...Object.entries(report.categories).map(([category, count]) => `- ${category}: ${count}`),
    '',
    '## Blocked Live Actions',
    '',
    ...report.blockedLiveActions.map((action) => `- ${action}`),
    '',
    'This index is a navigation aid only. It does not approve launch, enable the live backend, collect payments, collect waiver signatures, publish claims, remove noindex, apply redirects, or replace the current Detroit Dynamo root site.',
    '',
  ];

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoLaunchArtifactIndexReport(
  report = buildDetroitDynamoLaunchArtifactIndexReport(),
) {
  const issues = [];
  const requiredIds = [
    'roadmap-doc',
    'goal-audit',
    'final-acceptance-matrix',
    'owner-launch-review',
    'owner-handoff-packet',
    'external-gate-closure',
    'owner-evidence-intake',
    'owner-signoff-register',
    'vercel-preview-runbook',
    'secret-redaction',
    'production-preview-evidence',
    'live-readiness-board',
    'deployment-readiness',
    'launch-evidence-checklist',
    'external-confirmation-register',
    'payment-waiver-gates',
    'claim-safety',
    'safeguarding-privacy',
    'backend-runbook',
    'promotion-cutover',
    'browser-qa-report',
  ];

  assertReport(report.decision?.decision === 'preview_handoff_index', 'Launch artifact index must remain a preview handoff index.', issues);
  assertReport(report.summary.artifactsTotal >= requiredIds.length, 'Launch artifact index should include all required handoff artifacts.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Launch artifact index must not report cleared live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Launch artifact index must not report unlocked publications.', issues);
  assertReport(report.summary.liveReadinessRows >= 11, 'Launch artifact index should reference the live readiness board rows.', issues);
  assertReport(report.summary.productionPreviewTracks >= 30, 'Launch artifact index should reference production-preview evidence tracks.', issues);
  assertReport(report.summary.ownerEvidenceIntakeRows >= 13, 'Launch artifact index should reference owner evidence intake rows.', issues);
  assertReport(report.summary.ownerSignoffRows >= 11, 'Launch artifact index should reference owner signoff rows.', issues);
  assertReport(report.summary.ownerUnsignedSignoffRows === report.summary.ownerSignoffRows, 'Launch artifact index should keep owner signoffs unsigned.', issues);
  assertReport(report.summary.finalAcceptanceRows >= 15, 'Launch artifact index should reference final acceptance rows.', issues);
  assertReport(report.summary.finalAcceptanceExternalRows >= 5, 'Launch artifact index should keep external acceptance gates explicit.', issues);
  assertReport(report.summary.vercelPreviewSteps >= 10, 'Launch artifact index should reference Vercel preview runbook steps.', issues);
  assertReport(report.summary.vercelPreviewCliUpgradeRecommended === true, 'Launch artifact index should keep the Vercel CLI upgrade recommendation visible.', issues);
  assertReport(report.summary.secretRedactionRules >= 8, 'Launch artifact index should reference secret redaction rules.', issues);
  assertReport(report.summary.secretRedactionLeakages === 0, 'Launch artifact index should not report redaction leakage.', issues);
  assertReport(report.summary.externalGateClosureRows >= 9, 'Launch artifact index should reference external gate closure rows.', issues);
  assertReport(report.summary.externalGateClosureAllowedRows === 0, 'Launch artifact index should keep external gate closure blocked.', issues);
  assertReport(report.usageRules.length >= 4, 'Launch artifact index needs usage rules.', issues);
  assertReport(report.blockedLiveActions.length >= 12, 'Launch artifact index should list blocked live actions.', issues);

  for (const id of requiredIds) {
    assertReport(report.items.some((item) => item.id === id), `Missing launch artifact index item: ${id}.`, issues);
  }

  const ids = new Set();
  for (const item of report.items) {
    assertReport(!ids.has(item.id), `Duplicate launch artifact id: ${item.id}.`, issues);
    ids.add(item.id);
    assertReport(item.title && item.title.length >= 4, `${item.id} needs a title.`, issues);
    assertReport(item.ownerRole && item.ownerRole.length > 3, `${item.id} needs an owner role.`, issues);
    assertReport(item.artifactPath && item.artifactPath.length > 8, `${item.id} needs an artifact path.`, issues);
    assertReport(item.verifyCommand && item.verifyCommand.length > 6, `${item.id} needs a verify command.`, issues);
    assertReport(item.launchQuestion && item.launchQuestion.endsWith('?'), `${item.id} needs a launch question.`, issues);
    assertReport(Array.isArray(item.blocksActions) && item.blocksActions.length >= 1, `${item.id} needs blocked actions.`, issues);
  }

  return issues;
}
