export const detroitDynamoVercelPreviewDecision = {
  decision: 'vercel_preview_evidence_required',
  label: 'Vercel Preview Evidence Required',
  launchMode: 'preview_only',
  productionPromotionAllowed: false,
  reason: 'Vercel preview deployment evidence, CLI readiness, route QA, rollback proof, and owner signoff must be recorded before Detroit Dynamo can replace the current Detroit Dynamo root site.',
};

export const detroitDynamoVercelMinimumCliVersion = '54.6.1';

export const detroitDynamoVercelPreviewSteps = [
  {
    id: 'cli-upgrade-and-auth-context',
    label: 'Upgrade and record Vercel CLI context',
    ownerRole: 'Master Admin',
    phase: 'CLI',
    status: 'evidence_required',
    commands: ['vercel --version', 'npm i -g vercel@latest', 'pnpm add -g vercel@latest'],
    requiredEvidence: [
      'Vercel CLI version recorded after upgrade',
      'Authenticated Vercel user/team confirmed without exposing tokens',
      'Deployment operator confirms the latest CLI is available before preview deployment work',
    ],
    blockedLiveActions: ['production deployment', 'root route promotion'],
    rollbackNote: 'Use the prior production deployment as the rollback target if preview deployment checks fail.',
  },
  {
    id: 'repo-link-redaction-check',
    label: 'Confirm linked project without exposing ids',
    ownerRole: 'Master Admin',
    phase: 'Project Link',
    status: 'preview_ready',
    commands: ['test -f .vercel/repo.json || test -f .vercel/project.json'],
    requiredEvidence: [
      '.vercel link file exists locally',
      'Project directory is the repo root',
      'Org and project identifiers are redacted from public handoff docs',
    ],
    blockedLiveActions: ['production deployment'],
    rollbackNote: 'Pause deployment if the link points at the wrong team or project.',
  },
  {
    id: 'preview-env-pull',
    label: 'Pull preview environment safely',
    ownerRole: 'Master Admin',
    phase: 'Environment',
    status: 'evidence_required',
    commands: ['vercel pull --yes --environment=preview'],
    requiredEvidence: [
      'Preview environment pull completed without printing secrets',
      'Client Appwrite endpoint and project id are present for preview only',
      'Server-side secrets remain in Vercel/Appwrite environments and are not committed',
    ],
    blockedLiveActions: ['Appwrite intake default', 'protected admin live writes'],
    rollbackNote: 'Revert to local preview intake if preview env values are missing or wrong.',
  },
  {
    id: 'local-verification-before-deploy',
    label: 'Run local verification before deployment',
    ownerRole: 'Master Admin',
    phase: 'Verification',
    status: 'preview_ready',
    commands: ['npm run lint', 'npm run typecheck', 'npm run build', 'npm run audit:dynamo-goal'],
    requiredEvidence: [
      'Lint, typecheck, and build pass locally',
      'Goal audit remains 7/8 with external gates visible',
      'Build warning, if any, is documented before deployment',
    ],
    blockedLiveActions: ['preview deployment', 'production deployment'],
    rollbackNote: 'Do not deploy a build that fails local verification.',
  },
  {
    id: 'vercel-prebuilt-build',
    label: 'Create Vercel prebuilt output',
    ownerRole: 'Master Admin',
    phase: 'Build',
    status: 'evidence_required',
    commands: ['vercel build'],
    requiredEvidence: [
      'Vercel build output created from the linked project',
      'SPA rewrite continues to send routes to /index.html',
      'No production redirects or root promotion rules are introduced',
    ],
    blockedLiveActions: ['preview deployment', 'production deployment'],
    rollbackNote: 'Delete failed prebuilt output and rerun local verification before rebuilding.',
  },
  {
    id: 'deploy-prebuilt-preview',
    label: 'Deploy prebuilt preview',
    ownerRole: 'Master Admin',
    phase: 'Preview Deployment',
    status: 'evidence_required',
    commands: ['vercel deploy --prebuilt'],
    requiredEvidence: [
      'Preview deployment URL recorded',
      'Preview deployment id recorded in owner evidence intake',
      'Deployment protection remains enabled unless owner explicitly approves an alternate QA access path',
    ],
    blockedLiveActions: ['production deployment', 'root route promotion', 'noindex removal'],
    rollbackNote: 'Abandon the preview deployment if route QA, form QA, or admin guards fail.',
  },
  {
    id: 'inspect-preview-deployment',
    label: 'Inspect preview deployment and logs',
    ownerRole: 'Master Admin',
    phase: 'Preview Deployment',
    status: 'evidence_required',
    commands: ['vercel inspect <preview-url>', 'vercel logs <preview-url>'],
    requiredEvidence: [
      'Deployment inspect output confirms the expected project and build',
      'Logs show no unexpected build/runtime errors during smoke testing',
      'Inspection output is summarized without exposing secrets',
    ],
    blockedLiveActions: ['production deployment', 'owner launch decision'],
    rollbackNote: 'Do not promote a preview deployment with unresolved deployment or runtime errors.',
  },
  {
    id: 'preview-route-and-form-qa',
    label: 'Run preview route, link, form, and console QA',
    ownerRole: 'Registrar',
    phase: 'Preview QA',
    status: 'evidence_required',
    commands: ['BASE_URL=<preview-url> npm run verify:dynamo', 'BASE_URL=<preview-url> npm run qa:dynamo-browser'],
    requiredEvidence: [
      'Full verifier passes against the preview URL',
      'Browser QA submits all seven public lead forms against the preview URL',
      'No console, mobile overflow, broken link, route, or protected-admin guard failures are recorded',
    ],
    blockedLiveActions: ['Appwrite intake default', 'public launch announcement', 'owner launch decision'],
    rollbackNote: 'Keep the preview isolated and fix issues before owner review if QA fails.',
  },
  {
    id: 'current-production-snapshot-before-promotion',
    label: 'Record current production snapshot before any promotion',
    ownerRole: 'Master Admin',
    phase: 'Current Site Preservation',
    status: 'evidence_required',
    commands: ['BASE_URL=<current-production-url> npm run test -- --run', 'BASE_URL=<current-production-url> npm run qa:dynamo-browser'],
    requiredEvidence: [
      'Current Detroit Dynamo root, booking, auth, legacy club, team, blog, legal, and admin route snapshot recorded',
      'Rollback deployment id or previous production target recorded',
      'Current-site screenshots/report saved before any root-route change',
    ],
    blockedLiveActions: ['root route promotion', 'permanent redirects', 'noindex removal'],
    rollbackNote: 'Restore the recorded LC deployment or routing target if promotion fails.',
  },
  {
    id: 'promotion-command-hold',
    label: 'Hold production promotion until owner signoff',
    ownerRole: 'Master Admin',
    phase: 'Promotion Hold',
    status: 'blocked_until_owner_signoff',
    commands: ['vercel promote <preview-url>', 'vercel rollback <deployment-url-or-id>'],
    requiredEvidence: [
      'Owner signoff register has every row signed with evidence attached',
      'Live readiness board reports go-live rows and live gates only after external evidence is approved',
      'Rollback owner and rollback deployment target are recorded before promotion',
    ],
    blockedLiveActions: ['production promotion', 'permanent redirects', 'checkout activation', 'signature capture', 'public claim publication'],
    rollbackNote: 'Rollback must be ready before any promote command is allowed.',
  },
];

export const detroitDynamoVercelPreviewColumns = [
  'id',
  'label',
  'ownerRole',
  'phase',
  'status',
  'commands',
  'requiredEvidence',
  'blockedLiveActions',
  'rollbackNote',
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

function parseVersion(version) {
  const match = String(version || '').match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1, 4).map((part) => Number(part)) : null;
}

function compareVersions(left, right) {
  const parsedLeft = parseVersion(left);
  const parsedRight = parseVersion(right);
  if (!parsedLeft || !parsedRight) return null;
  for (let index = 0; index < parsedLeft.length; index += 1) {
    if (parsedLeft[index] > parsedRight[index]) return 1;
    if (parsedLeft[index] < parsedRight[index]) return -1;
  }
  return 0;
}

export function buildDetroitDynamoVercelPreviewRunbookReport(context = {}) {
  const versionComparison = compareVersions(context.vercelCliVersion, detroitDynamoVercelMinimumCliVersion);
  const cliUpgradeRecommended = versionComparison == null ? true : versionComparison < 0;
  const blockedLiveActions = [...new Set(
    detroitDynamoVercelPreviewSteps.flatMap((step) => step.blockedLiveActions),
  )].sort();

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoVercelPreviewDecision,
    columns: detroitDynamoVercelPreviewColumns,
    steps: detroitDynamoVercelPreviewSteps,
    summary: {
      stepsTotal: detroitDynamoVercelPreviewSteps.length,
      phases: Object.keys(countBy(detroitDynamoVercelPreviewSteps, 'phase')).length,
      ownerRoles: Object.keys(countBy(detroitDynamoVercelPreviewSteps, 'ownerRole')).length,
      evidenceRequiredSteps: detroitDynamoVercelPreviewSteps.filter((step) => step.status === 'evidence_required').length,
      previewReadySteps: detroitDynamoVercelPreviewSteps.filter((step) => step.status === 'preview_ready').length,
      blockedSteps: detroitDynamoVercelPreviewSteps.filter((step) => step.status.includes('blocked')).length,
      commandCount: detroitDynamoVercelPreviewSteps.reduce((total, step) => total + step.commands.length, 0),
      observedVercelCliVersion: context.vercelCliVersion || 'not_checked_by_browser_report',
      recommendedVercelCliVersion: detroitDynamoVercelMinimumCliVersion,
      cliUpgradeRecommended,
      projectLinkType: context.projectLinkType || 'not_checked_by_browser_report',
      linkedProjectCount: Number.isFinite(context.linkedProjectCount) ? context.linkedProjectCount : 0,
      projectIdentifiersRedacted: true,
      spaRewritePresent: Boolean(context.spaRewritePresent),
      requiredPackageScriptsPresent: context.requiredPackageScriptsPresent !== false,
      previewDeploymentRecorded: 0,
      productionDeploymentRecorded: 0,
      productionPromotionAllowed: false,
      rollbackTargetRecorded: false,
      liveGatesCleared: 0,
      publicationsUnlocked: 0,
      blockedLiveActions: blockedLiveActions.length,
    },
    phases: countBy(detroitDynamoVercelPreviewSteps, 'phase'),
    ownerRoles: countBy(detroitDynamoVercelPreviewSteps, 'ownerRole'),
    blockedLiveActions,
    usageRules: [
      'Use this runbook after local verification passes and before requesting an owner launch decision.',
      'Record Vercel preview URL, deployment id, inspect summary, browser QA, and rollback target in owner evidence artifacts.',
      'Do not commit Vercel org ids, project ids, tokens, environment values, or deployment-protection bypass secrets.',
      'Do not run promotion, redirect, noindex-removal, checkout, waiver-signature, or public-claim publication commands until owner signoff is complete.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoVercelPreviewRunbookReport(report);
  return report;
}

export function buildDetroitDynamoVercelPreviewRunbookCsv(
  report = buildDetroitDynamoVercelPreviewRunbookReport(),
) {
  return [
    report.columns.join(','),
    ...report.steps.map((step) => (
      report.columns.map((column) => csvEscape(step[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoVercelPreviewRunbookMarkdown(
  report = buildDetroitDynamoVercelPreviewRunbookReport(),
) {
  const lines = [
    '# Detroit Dynamo Vercel Preview Deployment Runbook',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Steps: ${report.summary.stepsTotal}`,
    `- Evidence-required steps: ${report.summary.evidenceRequiredSteps}`,
    `- Preview-ready steps: ${report.summary.previewReadySteps}`,
    `- Blocked steps: ${report.summary.blockedSteps}`,
    `- Commands: ${report.summary.commandCount}`,
    `- Observed Vercel CLI version: ${report.summary.observedVercelCliVersion}`,
    `- Recommended Vercel CLI version: ${report.summary.recommendedVercelCliVersion}+`,
    `- CLI upgrade recommended: ${report.summary.cliUpgradeRecommended}`,
    `- Project link type: ${report.summary.projectLinkType}`,
    `- Linked project count: ${report.summary.linkedProjectCount}`,
    `- Project identifiers redacted: ${report.summary.projectIdentifiersRedacted}`,
    `- SPA rewrite present: ${report.summary.spaRewritePresent}`,
    `- Required package scripts present: ${report.summary.requiredPackageScriptsPresent}`,
    `- Preview deployment recorded: ${report.summary.previewDeploymentRecorded}`,
    `- Production deployment recorded: ${report.summary.productionDeploymentRecorded}`,
    `- Production promotion allowed: ${report.summary.productionPromotionAllowed}`,
    `- Rollback target recorded: ${report.summary.rollbackTargetRecorded}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Runbook Steps',
    '',
    '| Step | Phase | Status | Owner | Commands |',
    '| --- | --- | --- | --- | --- |',
    ...report.steps.map((step) => (
      `| ${step.label} | ${step.phase} | ${step.status} | ${step.ownerRole} | \`${step.commands.join(' && ')}\` |`
    )),
    '',
    '## Evidence Checklist',
    '',
  ];

  for (const step of report.steps) {
    lines.push(
      `### ${step.label}`,
      '',
      `Rollback note: ${step.rollbackNote}`,
      '',
      'Required evidence:',
      ...step.requiredEvidence.map((item) => `- [ ] ${item}`),
      '',
      `Blocked live actions: ${step.blockedLiveActions.join(', ')}`,
      '',
    );
  }

  lines.push(
    'This runbook does not deploy, promote, roll back, remove noindex, publish redirects, enable checkout, collect signatures, publish claims, or replace the current Detroit Dynamo root site.',
    '',
  );

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoVercelPreviewRunbookReport(
  report = buildDetroitDynamoVercelPreviewRunbookReport(),
) {
  const issues = [];
  const requiredIds = [
    'cli-upgrade-and-auth-context',
    'repo-link-redaction-check',
    'preview-env-pull',
    'local-verification-before-deploy',
    'vercel-prebuilt-build',
    'deploy-prebuilt-preview',
    'inspect-preview-deployment',
    'preview-route-and-form-qa',
    'current-production-snapshot-before-promotion',
    'promotion-command-hold',
  ];

  assertReport(report.decision?.decision === 'vercel_preview_evidence_required', 'Vercel preview runbook must remain evidence-required.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'Vercel preview runbook must remain preview-only.', issues);
  assertReport(report.decision?.productionPromotionAllowed === false, 'Vercel preview runbook must not allow production promotion.', issues);
  assertReport(report.summary.stepsTotal >= requiredIds.length, 'Vercel preview runbook should include every deployment step.', issues);
  assertReport(report.summary.evidenceRequiredSteps >= 6, 'Vercel preview runbook should keep deployment work evidence-required.', issues);
  assertReport(report.summary.commandCount >= 10, 'Vercel preview runbook should include concrete CLI commands.', issues);
  assertReport(report.summary.projectIdentifiersRedacted === true, 'Vercel preview runbook must redact project identifiers.', issues);
  assertReport(report.summary.previewDeploymentRecorded === 0, 'Vercel preview runbook must not claim a preview deployment is recorded.', issues);
  assertReport(report.summary.productionDeploymentRecorded === 0, 'Vercel preview runbook must not claim a production deployment is recorded.', issues);
  assertReport(report.summary.productionPromotionAllowed === false, 'Vercel preview runbook must block production promotion.', issues);
  assertReport(report.summary.rollbackTargetRecorded === false, 'Vercel preview runbook must not claim rollback evidence is recorded.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Vercel preview runbook must not clear live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Vercel preview runbook must not unlock publications.', issues);
  assertReport(report.usageRules.length >= 4, 'Vercel preview runbook needs usage rules.', issues);
  assertReport(report.blockedLiveActions.length >= 8, 'Vercel preview runbook should list blocked live actions.', issues);
  assertReport(report.steps.some((step) => step.commands.includes('npm i -g vercel@latest')), 'Vercel preview runbook must recommend the npm Vercel CLI upgrade command.', issues);
  assertReport(report.steps.some((step) => step.commands.includes('pnpm add -g vercel@latest')), 'Vercel preview runbook must recommend the pnpm Vercel CLI upgrade command.', issues);

  const ids = new Set();
  for (const id of requiredIds) {
    assertReport(report.steps.some((step) => step.id === id), `Missing Vercel preview runbook step: ${id}.`, issues);
  }

  for (const step of report.steps) {
    assertReport(!ids.has(step.id), `Duplicate Vercel preview runbook step id: ${step.id}.`, issues);
    ids.add(step.id);
    assertReport(step.label && step.label.length >= 6, `${step.id} needs a label.`, issues);
    assertReport(step.ownerRole && step.ownerRole.length > 3, `${step.id} needs an owner role.`, issues);
    assertReport(step.phase && step.phase.length > 2, `${step.id} needs a phase.`, issues);
    assertReport(!['live', 'approved', 'promoted', 'complete'].includes(step.status), `${step.id} must not be marked live/approved.`, issues);
    assertReport(Array.isArray(step.commands) && step.commands.length >= 1, `${step.id} needs commands.`, issues);
    assertReport(Array.isArray(step.requiredEvidence) && step.requiredEvidence.length >= 3, `${step.id} needs at least three required evidence items.`, issues);
    assertReport(Array.isArray(step.blockedLiveActions) && step.blockedLiveActions.length >= 1, `${step.id} needs blocked live actions.`, issues);
    assertReport(step.rollbackNote && step.rollbackNote.length >= 12, `${step.id} needs a rollback note.`, issues);
  }

  return issues;
}
