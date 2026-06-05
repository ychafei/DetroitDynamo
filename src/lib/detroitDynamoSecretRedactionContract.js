export const detroitDynamoSecretRedactionDecision = {
  decision: 'secret_redaction_required_preview_only',
  label: 'Secret Redaction Required',
  launchMode: 'preview_only',
  publishAllowed: false,
  reason: 'Generated Detroit Dynamo handoffs, public code, and owner review artifacts must not expose local API keys, Vercel project identifiers, provider secrets, deployment bypass tokens, or environment values.',
};

export const detroitDynamoSecretRedactionRules = [
  {
    id: 'local-env-secret-values',
    label: 'Local environment secret values stay local',
    ownerRole: 'Master Admin',
    targetSurface: '.env*, Vercel env, Appwrite env, local developer shell',
    status: 'evidence_required',
    requiredChecks: [
      'Read local env files only to build redaction fingerprints, never to publish values',
      'Scan generated launch artifacts for exact local secret values',
      'Record only counts, file paths, and rule ids in redaction reports',
    ],
    allowedLocations: ['Local .env files', 'Vercel encrypted environment variables', 'Appwrite function variables'],
    blockedActions: ['public artifact publication', 'owner handoff distribution'],
  },
  {
    id: 'vercel-project-identifiers',
    label: 'Vercel project identifiers are redacted',
    ownerRole: 'Master Admin',
    targetSurface: '.vercel project/repo link files and launch handoffs',
    status: 'evidence_required',
    requiredChecks: [
      'Treat Vercel org ids and project ids as local deployment metadata',
      'Scan launch docs and generated artifacts for exact Vercel project identifiers',
      'Keep linked project counts and link type, but not ids, in handoff artifacts',
    ],
    allowedLocations: ['Local .vercel folder', 'Vercel platform'],
    blockedActions: ['deployment handoff publication', 'owner evidence packet sharing'],
  },
  {
    id: 'appwrite-server-credentials',
    label: 'Appwrite server credentials are never in public handoffs',
    ownerRole: 'Master Admin',
    targetSurface: 'Appwrite API keys, function variables, server SDK configuration',
    status: 'evidence_required',
    requiredChecks: [
      'Scan docs, scripts, source files, functions, and artifacts for exact Appwrite API key values',
      'Allow client-safe VITE endpoint/project id references only where the frontend needs them',
      'Keep server-key proof as yes/no evidence rather than printing values',
    ],
    allowedLocations: ['Appwrite function variables', 'Local developer env', 'Vercel encrypted env when needed'],
    blockedActions: ['Appwrite function deployment proof sharing', 'live admin write activation'],
  },
  {
    id: 'payment-provider-secrets',
    label: 'Payment provider secrets stay out of launch artifacts',
    ownerRole: 'Master Admin',
    targetSurface: 'Stripe, PayPal, webhook, checkout, and refund configuration',
    status: 'evidence_required',
    requiredChecks: [
      'Scan for Stripe secret keys, webhook secrets, PayPal secrets, and payment tokens',
      'Publish payment readiness as disconnected/approved status, not secret values',
      'Keep checkout disabled until payment provider products and webhooks are approved',
    ],
    allowedLocations: ['Payment provider dashboard', 'Vercel encrypted env', 'Appwrite function variables'],
    blockedActions: ['checkout activation', 'payment collection', 'package publication'],
  },
  {
    id: 'deployment-protection-tokens',
    label: 'Deployment access tokens and bypass secrets are not documented',
    ownerRole: 'Master Admin',
    targetSurface: 'Preview deployment protection, Vercel token, CI token, deployment URLs',
    status: 'evidence_required',
    requiredChecks: [
      'Scan for committed Vercel tokens and deployment bypass secrets',
      'Record preview access instructions without exposing bearer tokens or bypass values',
      'Use Vercel CLI authentication or protected preview access instead of public tokens',
    ],
    allowedLocations: ['Vercel account/session', 'CI secrets', 'Password manager'],
    blockedActions: ['preview QA handoff sharing', 'production promotion'],
  },
  {
    id: 'generated-launch-artifacts',
    label: 'Generated launch artifacts are share-safe',
    ownerRole: 'Media/Admin Staff',
    targetSurface: 'artifacts/detroit-dynamo/launch/*',
    status: 'evidence_required',
    requiredChecks: [
      'Scan JSON, Markdown, and CSV launch artifacts for exact secret values',
      'Scan generated artifacts for high-confidence secret token patterns',
      'Keep generated reports free of actual env values and deployment ids unless owner-approved',
    ],
    allowedLocations: ['Redacted counts', 'Redacted evidence status labels', 'Non-secret command names'],
    blockedActions: ['launch packet export', 'owner closeout'],
  },
  {
    id: 'public-source-and-docs',
    label: 'Public source and documentation avoid secrets',
    ownerRole: 'Master Admin',
    targetSurface: 'src, scripts, functions, docs, appwrite.json, package.json, vercel.json',
    status: 'evidence_required',
    requiredChecks: [
      'Scan source and docs for exact local secret values',
      'Allow environment variable names without values',
      'Reject raw tokens, provider secrets, or project ids in checked handoff text',
    ],
    allowedLocations: ['Environment variable names', 'Placeholder examples', 'Redacted command examples'],
    blockedActions: ['repository publication', 'external contractor handoff'],
  },
  {
    id: 'owner-handoff-redaction',
    label: 'Owner handoffs use evidence labels instead of secrets',
    ownerRole: 'Master Admin',
    targetSurface: 'Roadmap, owner signoff register, evidence intake, live readiness board',
    status: 'preview_ready',
    requiredChecks: [
      'Use proof-location fields instead of secret values',
      'Record approver, date, and verification command without printing credentials',
      'Keep launch approval blocked if redaction scan reports any leakage',
    ],
    allowedLocations: ['Owner evidence worksheet proof-location fields', 'Password manager references', 'Redacted screenshots'],
    blockedActions: ['owner launch decision', 'production promotion'],
  },
];

export const detroitDynamoSecretRedactionColumns = [
  'id',
  'label',
  'ownerRole',
  'targetSurface',
  'status',
  'requiredChecks',
  'allowedLocations',
  'blockedActions',
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

export function buildDetroitDynamoSecretRedactionReport(scan = {}) {
  const blockedActions = [...new Set(
    detroitDynamoSecretRedactionRules.flatMap((rule) => rule.blockedActions),
  )].sort();

  const report = {
    generatedAt: new Date().toISOString(),
    decision: detroitDynamoSecretRedactionDecision,
    columns: detroitDynamoSecretRedactionColumns,
    rules: detroitDynamoSecretRedactionRules,
    summary: {
      rulesTotal: detroitDynamoSecretRedactionRules.length,
      evidenceRequiredRules: detroitDynamoSecretRedactionRules.filter((rule) => rule.status === 'evidence_required').length,
      previewReadyRules: detroitDynamoSecretRedactionRules.filter((rule) => rule.status === 'preview_ready').length,
      ownerRoles: Object.keys(countBy(detroitDynamoSecretRedactionRules, 'ownerRole')).length,
      targetSurfaces: Object.keys(countBy(detroitDynamoSecretRedactionRules, 'targetSurface')).length,
      localSecretSourcesDetected: scan.localSecretSourcesDetected || 0,
      localIdentifierSourcesDetected: scan.localIdentifierSourcesDetected || 0,
      scannedFiles: scan.scannedFiles || 0,
      scannedBytes: scan.scannedBytes || 0,
      exactSecretMatches: scan.exactSecretMatches || 0,
      identifierMatches: scan.identifierMatches || 0,
      genericPatternMatches: scan.genericPatternMatches || 0,
      leakagesDetected: scan.leakagesDetected || 0,
      exactSecretValuesWritten: false,
      projectIdentifiersRedacted: true,
      publishAllowed: false,
      liveGatesCleared: 0,
      publicationsUnlocked: 0,
      blockedActions: blockedActions.length,
    },
    ownerRoles: countBy(detroitDynamoSecretRedactionRules, 'ownerRole'),
    blockedActions,
    scanTargets: scan.scanTargets || [
      'DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md',
      'artifacts/detroit-dynamo',
      'src',
      'scripts',
      'functions',
      'appwrite.json',
      'package.json',
      'vercel.json',
    ],
    violations: scan.violations || [],
    usageRules: [
      'Use this report before sharing generated launch artifacts or owner-review handoffs.',
      'Never write exact local secret values, Vercel project identifiers, deployment bypass tokens, or payment provider secrets into generated reports.',
      'A nonzero leakage count blocks owner handoff sharing, production promotion, checkout activation, and live admin-write activation.',
      'Environment variable names and redacted status labels are allowed; environment variable values are not.',
    ],
    issues: [],
  };

  report.issues = auditDetroitDynamoSecretRedactionReport(report);
  return report;
}

export function buildDetroitDynamoSecretRedactionCsv(
  report = buildDetroitDynamoSecretRedactionReport(),
) {
  return [
    report.columns.join(','),
    ...report.rules.map((rule) => (
      report.columns.map((column) => csvEscape(rule[column])).join(',')
    )),
  ].join('\n');
}

export function buildDetroitDynamoSecretRedactionMarkdown(
  report = buildDetroitDynamoSecretRedactionReport(),
) {
  const lines = [
    '# Detroit Dynamo Secret Redaction Contract',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Decision: ${report.decision.label}`,
    '',
    report.decision.reason,
    '',
    '## Summary',
    '',
    `- Rules: ${report.summary.rulesTotal}`,
    `- Evidence-required rules: ${report.summary.evidenceRequiredRules}`,
    `- Preview-ready rules: ${report.summary.previewReadyRules}`,
    `- Local secret sources detected: ${report.summary.localSecretSourcesDetected}`,
    `- Local identifier sources detected: ${report.summary.localIdentifierSourcesDetected}`,
    `- Scanned files: ${report.summary.scannedFiles}`,
    `- Exact secret matches: ${report.summary.exactSecretMatches}`,
    `- Identifier matches: ${report.summary.identifierMatches}`,
    `- Generic pattern matches: ${report.summary.genericPatternMatches}`,
    `- Leakages detected: ${report.summary.leakagesDetected}`,
    `- Exact secret values written: ${report.summary.exactSecretValuesWritten}`,
    `- Project identifiers redacted: ${report.summary.projectIdentifiersRedacted}`,
    `- Publish allowed: ${report.summary.publishAllowed}`,
    `- Live gates cleared: ${report.summary.liveGatesCleared}`,
    `- Publications unlocked: ${report.summary.publicationsUnlocked}`,
    '',
    '## Usage Rules',
    '',
    ...report.usageRules.map((rule) => `- ${rule}`),
    '',
    '## Redaction Rules',
    '',
    '| Rule | Surface | Owner | Status | Blocked Actions |',
    '| --- | --- | --- | --- | --- |',
    ...report.rules.map((rule) => (
      `| ${rule.label} | ${rule.targetSurface} | ${rule.ownerRole} | ${rule.status} | ${rule.blockedActions.join(', ')} |`
    )),
    '',
    '## Scan Targets',
    '',
    ...report.scanTargets.map((target) => `- ${target}`),
    '',
    '## Violations',
    '',
  ];

  if (report.violations.length === 0) {
    lines.push('No redaction violations were recorded by this report.', '');
  } else {
    for (const violation of report.violations) {
      lines.push(`- ${violation.file}: ${violation.ruleId} (${violation.matchType})`);
    }
    lines.push('');
  }

  lines.push(
    'This report does not approve launch, deploy code, expose secrets, record production evidence, clear live gates, unlock publication, or replace the current Detroit Dynamo root site.',
    '',
  );

  return lines.join('\n');
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoSecretRedactionReport(
  report = buildDetroitDynamoSecretRedactionReport(),
) {
  const issues = [];
  const requiredIds = [
    'local-env-secret-values',
    'vercel-project-identifiers',
    'appwrite-server-credentials',
    'payment-provider-secrets',
    'deployment-protection-tokens',
    'generated-launch-artifacts',
    'public-source-and-docs',
    'owner-handoff-redaction',
  ];

  assertReport(report.decision?.decision === 'secret_redaction_required_preview_only', 'Secret redaction must remain required and preview-only.', issues);
  assertReport(report.decision?.launchMode === 'preview_only', 'Secret redaction launch mode must remain preview-only.', issues);
  assertReport(report.decision?.publishAllowed === false, 'Secret redaction report must not allow publication.', issues);
  assertReport(report.summary.rulesTotal >= requiredIds.length, 'Secret redaction should cover every required rule.', issues);
  assertReport(report.summary.evidenceRequiredRules >= 7, 'Secret redaction should keep most rules evidence-required.', issues);
  assertReport(report.summary.exactSecretValuesWritten === false, 'Secret redaction reports must not write exact secret values.', issues);
  assertReport(report.summary.projectIdentifiersRedacted === true, 'Secret redaction reports must redact project identifiers.', issues);
  assertReport(report.summary.publishAllowed === false, 'Secret redaction reports must block publication by default.', issues);
  assertReport(report.summary.liveGatesCleared === 0, 'Secret redaction reports must not clear live gates.', issues);
  assertReport(report.summary.publicationsUnlocked === 0, 'Secret redaction reports must not unlock publications.', issues);
  assertReport(report.summary.leakagesDetected === 0, 'Secret redaction scan found leakage that must be removed before sharing handoffs.', issues);
  assertReport(report.usageRules.length >= 4, 'Secret redaction report needs usage rules.', issues);
  assertReport(report.blockedActions.length >= 8, 'Secret redaction report should list blocked actions.', issues);

  const ids = new Set();
  for (const id of requiredIds) {
    assertReport(report.rules.some((rule) => rule.id === id), `Missing secret redaction rule: ${id}.`, issues);
  }

  for (const rule of report.rules) {
    assertReport(!ids.has(rule.id), `Duplicate secret redaction rule id: ${rule.id}.`, issues);
    ids.add(rule.id);
    assertReport(rule.label && rule.label.length >= 8, `${rule.id} needs a label.`, issues);
    assertReport(rule.ownerRole && rule.ownerRole.length > 3, `${rule.id} needs an owner role.`, issues);
    assertReport(rule.targetSurface && rule.targetSurface.length > 6, `${rule.id} needs a target surface.`, issues);
    assertReport(!['live', 'approved', 'published', 'complete'].includes(rule.status), `${rule.id} must not be marked live/approved.`, issues);
    assertReport(Array.isArray(rule.requiredChecks) && rule.requiredChecks.length >= 3, `${rule.id} needs required checks.`, issues);
    assertReport(Array.isArray(rule.allowedLocations) && rule.allowedLocations.length >= 2, `${rule.id} needs allowed locations.`, issues);
    assertReport(Array.isArray(rule.blockedActions) && rule.blockedActions.length >= 1, `${rule.id} needs blocked actions.`, issues);
  }

  return issues;
}
