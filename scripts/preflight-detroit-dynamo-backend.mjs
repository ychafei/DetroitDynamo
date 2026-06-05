import fs from 'node:fs/promises';
import path from 'node:path';
import {
  detroitDynamoAppwriteCollections,
  validateDetroitDynamoAppwriteSchema,
} from '../src/lib/detroitDynamoAppwriteSchema.js';
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
  auditDetroitDynamoSafeguardingContract,
  buildDetroitDynamoSafeguardingReport,
} from '../src/lib/detroitDynamoSafeguardingContract.js';
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

const root = process.cwd();
const envPath = path.join(root, '.env.local');
const artifactDir = path.join(root, 'artifacts/detroit-dynamo');
const jsonReportPath = path.join(artifactDir, 'backend-preflight.json');
const markdownReportPath = path.join(artifactDir, 'backend-preflight.md');
const checks = [];

const requiredProvisionEnv = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'APPWRITE_API_KEY',
];

const requiredFunctionScopes = [
  'databases.read',
  'databases.write',
  'documents.read',
  'documents.write',
];

function record(id, label, status, evidence, nextAction = '') {
  checks.push({ id, label, status, evidence, nextAction });
}

async function readIfExists(file) {
  try {
    return await fs.readFile(path.join(root, file), 'utf8');
  } catch {
    return '';
  }
}

async function fileExists(file) {
  try {
    await fs.access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

function parseEnv(content) {
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function envValue(env, key) {
  return process.env[key] || env[key] || '';
}

function validateEndpoint(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function summarize() {
  return {
    pass: checks.filter((check) => check.status === 'pass').length,
    pending: checks.filter((check) => check.status === 'pending').length,
    fail: checks.filter((check) => check.status === 'fail').length,
    total: checks.length,
  };
}

function buildMarkdown(summary) {
  const lines = [
    '# Detroit Dynamo Backend Preflight',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This report does not make network calls, print secrets, or mutate Appwrite. It checks local scaffold readiness for the Detroit Dynamo backend handoff.',
    '',
    `Summary: ${summary.pass} passing, ${summary.pending} pending, ${summary.fail} failing.`,
    '',
    '| Check | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- |',
    ...checks.map((check) => `| ${check.label} | ${check.status} | ${check.evidence} | ${check.nextAction || 'None'} |`),
    '',
  ];
  return lines.join('\n');
}

const envContent = await readIfExists('.env.local');
const env = parseEnv(envContent);

if (!envContent) {
  record(
    'env-file',
    '.env.local available',
    'pending',
    '.env.local was not found. This is acceptable for local preview, but backend apply/deploy commands need credentials.',
    'Create .env.local with VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, and APPWRITE_API_KEY before provisioning.',
  );
} else {
  record('env-file', '.env.local available', 'pass', '.env.local exists. Secret values were not printed.');
}

const missingEnv = requiredProvisionEnv.filter((key) => !envValue(env, key));
if (missingEnv.length > 0) {
  record(
    'appwrite-env',
    'Appwrite provisioning environment',
    'pending',
    `Missing required key(s): ${missingEnv.join(', ')}.`,
    'Add the missing keys before running npm run provision:dynamo-appwrite -- --apply or deploying the intake function.',
  );
} else if (!validateEndpoint(envValue(env, 'VITE_APPWRITE_ENDPOINT'))) {
  record(
    'appwrite-env',
    'Appwrite provisioning environment',
    'fail',
    'VITE_APPWRITE_ENDPOINT is present but is not a valid http(s) URL.',
    'Fix VITE_APPWRITE_ENDPOINT before any backend apply/deploy command.',
  );
} else {
  record(
    'appwrite-env',
    'Appwrite provisioning environment',
    'pass',
    'VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, and APPWRITE_API_KEY are present. Secret values were not printed.',
  );
}

const schemaErrors = validateDetroitDynamoAppwriteSchema();
if (schemaErrors.length > 0) {
  record(
    'appwrite-schema',
    'Appwrite schema validation',
    'fail',
    `${schemaErrors.length} schema issue(s): ${schemaErrors.join('; ')}`,
    'Fix the schema/data-model mismatch before provisioning.',
  );
} else {
  const attributeCount = detroitDynamoAppwriteCollections.reduce((count, collection) => count + collection.attributes.length, 0);
  const indexCount = detroitDynamoAppwriteCollections.reduce((count, collection) => count + collection.indexes.length, 0);
  record(
    'appwrite-schema',
    'Appwrite schema validation',
    'pass',
    `${detroitDynamoAppwriteCollections.length} collections, ${attributeCount} attributes, and ${indexCount} indexes validate locally.`,
  );
}

const externalGateIssues = auditDetroitDynamoExternalGateContracts();
const externalGateReport = buildDetroitDynamoExternalGateContractReport();
record(
  'payment-waiver-gate-contracts',
  'Payment/package and waiver gate contracts',
  externalGateIssues.length === 0 ? 'pass' : 'fail',
  externalGateIssues.length === 0
    ? `${externalGateReport.paymentPackageTracks.length} payment/package tracks and ${externalGateReport.waiverTracks.length} waiver tracks keep checkout and signatures disabled until approvals are complete.`
    : `${externalGateIssues.length} gate issue(s): ${externalGateIssues.join('; ')}`,
  externalGateIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoExternalGateContracts.js before enabling payment or waiver workflows.',
);

const claimSafetyIssues = auditDetroitDynamoClaimSafetyContract();
const claimSafetyReport = buildDetroitDynamoClaimSafetyContractReport();
record(
  'claim-safety-contract',
  'Public claim safety contract',
  claimSafetyIssues.length === 0 ? 'pass' : 'fail',
  claimSafetyIssues.length === 0
    ? `${claimSafetyReport.claimSafetyTracks.length} claim-safety tracks keep league, facility, roster, sponsor, fixture, outcome, and launch claims approval-gated.`
    : `${claimSafetyIssues.length} claim-safety issue(s): ${claimSafetyIssues.join('; ')}`,
  claimSafetyIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoClaimSafetyContract.js before publishing public proof or competition claims.',
);

const promotionCutoverIssues = auditDetroitDynamoPromotionCutoverContract();
const promotionCutoverReport = buildDetroitDynamoPromotionCutoverReport();
record(
  'promotion-cutover-contract',
  'Promotion cutover contract',
  promotionCutoverIssues.length === 0 ? 'pass' : 'fail',
  promotionCutoverIssues.length === 0
    ? `${promotionCutoverReport.cutoverTracks.length} cutover tracks keep root promotion, redirects, backend intake, payments, legal/support, proof content, and rollback approval-gated.`
    : `${promotionCutoverIssues.length} cutover issue(s): ${promotionCutoverIssues.join('; ')}`,
  promotionCutoverIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoPromotionCutoverContract.js before planning a root brand switch.',
);

const safeguardingIssues = auditDetroitDynamoSafeguardingContract();
const safeguardingReport = buildDetroitDynamoSafeguardingReport();
record(
  'safeguarding-privacy-contract',
  'Safeguarding and data privacy contract',
  safeguardingIssues.length === 0 ? 'pass' : 'fail',
  safeguardingIssues.length === 0
    ? `${safeguardingReport.safeguardingTracks.length} safeguarding tracks keep minor consent, staff verification, medical data, media releases, retention, and audit enforcement approval-gated.`
    : `${safeguardingIssues.length} safeguarding issue(s): ${safeguardingIssues.join('; ')}`,
  safeguardingIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoSafeguardingContract.js before enabling live youth registration or sensitive admin workflows.',
);

const appwriteConfigText = await readIfExists('appwrite.json');
let appwriteConfig = null;
try {
  appwriteConfig = JSON.parse(appwriteConfigText || '{}');
} catch (error) {
  record('appwrite-config-json', 'appwrite.json parse', 'fail', `appwrite.json could not be parsed: ${error.message}`);
}

if (appwriteConfig) {
  const expectedFunctions = [
    {
      id: 'detroitDynamoLeadIntake',
      execute: 'any',
      path: 'functions/detroitDynamoLeadIntake',
      label: 'public lead intake',
    },
    {
      id: 'detroitDynamoLeadPipelineAction',
      execute: 'users',
      path: 'functions/detroitDynamoLeadPipelineAction',
      label: 'authenticated pipeline action',
    },
    {
      id: 'detroitDynamoAdminModuleRead',
      execute: 'users',
      path: 'functions/detroitDynamoAdminModuleRead',
      label: 'authenticated admin module read',
      scopes: ['databases.read', 'documents.read'],
    },
    {
      id: 'detroitDynamoAdminRoleGrantAction',
      execute: 'users',
      path: 'functions/detroitDynamoAdminRoleGrantAction',
      label: 'authenticated admin role grant action',
    },
    {
      id: 'detroitDynamoAdminModuleWriteAction',
      execute: 'users',
      path: 'functions/detroitDynamoAdminModuleWriteAction',
      label: 'authenticated admin module write action',
    },
  ];

  for (const expectedFunction of expectedFunctions) {
    const fn = (appwriteConfig.functions || []).find((item) => item.$id === expectedFunction.id);
    if (!fn) {
      record(
        `function-config-${expectedFunction.id}`,
        `${expectedFunction.id} Appwrite config`,
        'fail',
        `appwrite.json does not include ${expectedFunction.id}.`,
        'Register the function before deployment.',
      );
      continue;
    }

    const expectedScopes = expectedFunction.scopes || requiredFunctionScopes;
    const missingScopes = expectedScopes.filter((scope) => !(fn.scopes || []).includes(scope));
    const ok = fn.execute?.includes(expectedFunction.execute)
      && fn.enabled === true
      && fn.path === expectedFunction.path
      && missingScopes.length === 0;
    record(
      `function-config-${expectedFunction.id}`,
      `${expectedFunction.id} Appwrite config`,
      ok ? 'pass' : 'fail',
      ok
        ? `Function is ${expectedFunction.label}, enabled, points to the scaffold path, and includes database/document scopes.`
        : `Function config is incomplete. Missing scopes: ${missingScopes.join(', ') || 'none'}.`,
      ok ? '' : 'Fix appwrite.json before deploying the function.',
    );
  }
}

const functionSource = await readIfExists('functions/detroitDynamoLeadIntake/src/main.js');
const functionPackageExists = await fileExists('functions/detroitDynamoLeadIntake/package.json');
const functionSourceOk = [
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
  'validatePayload',
  'compactDocument',
  'APPWRITE_DATABASE_ID',
  'source_route must be a Detroit Dynamo route',
  'APPWRITE_API_KEY',
].every((needle) => functionSource.includes(needle));

record(
  'function-scaffold',
  'detroitDynamoLeadIntake scaffold',
  functionPackageExists && functionSourceOk ? 'pass' : 'fail',
  functionPackageExists && functionSourceOk
    ? 'Function package and source validate the public lead payload and write contact, tryout, sponsor, player, guardian, booking, and pipeline fields to the expected dd_* collections.'
    : 'Function package or expected source safeguards are missing.',
  functionPackageExists && functionSourceOk ? '' : 'Restore the function scaffold before enabling Appwrite intake.',
);

const leadIntakeContractIssues = auditDetroitDynamoLeadIntakeContract();
const leadIntakeSuccessFixtures = buildDetroitDynamoLeadIntakeFixtures();
const leadIntakeRejectionFixtures = buildDetroitDynamoLeadIntakeRejectionFixtures();
record(
  'function-lead-intake-contract',
  'detroitDynamoLeadIntake public payload contract',
  leadIntakeContractIssues.length === 0 ? 'pass' : 'fail',
  leadIntakeContractIssues.length === 0
    ? `${leadIntakeSuccessFixtures.length} success fixtures and ${leadIntakeRejectionFixtures.length} rejection fixtures validate against public form variants, routing collections, and required field guardrails.`
    : `${leadIntakeContractIssues.length} contract issue(s): ${leadIntakeContractIssues.join('; ')}`,
  leadIntakeContractIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoLeadIntakeContract.js before deploying public intake.',
);

const pipelineActionSource = await readIfExists('functions/detroitDynamoLeadPipelineAction/src/main.js');
const pipelineActionPackageExists = await fileExists('functions/detroitDynamoLeadPipelineAction/package.json');
const pipelineActionSourceOk = [
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
  'APPWRITE_API_KEY',
].every((needle) => pipelineActionSource.includes(needle));

record(
  'function-scaffold-pipeline-action',
  'detroitDynamoLeadPipelineAction scaffold',
  pipelineActionPackageExists && pipelineActionSourceOk ? 'pass' : 'fail',
  pipelineActionPackageExists && pipelineActionSourceOk
    ? 'Function package and source validate authenticated pipeline transitions, update pipeline fields on expected dd_* records, and append audit events.'
    : 'Pipeline action function package or expected source safeguards are missing.',
  pipelineActionPackageExists && pipelineActionSourceOk ? '' : 'Restore the pipeline action function scaffold before enabling live status transitions.',
);

const pipelineActionContractIssues = auditDetroitDynamoPipelineActionContract();
const pipelineActionSuccessFixtures = buildDetroitDynamoPipelineActionFixtures();
const pipelineActionRejectionFixtures = buildDetroitDynamoPipelineActionRejectionFixtures();
record(
  'function-pipeline-action-contract',
  'detroitDynamoLeadPipelineAction handoff contract',
  pipelineActionContractIssues.length === 0 ? 'pass' : 'fail',
  pipelineActionContractIssues.length === 0
    ? `${pipelineActionSuccessFixtures.length} success fixtures and ${pipelineActionRejectionFixtures.length} rejection fixtures validate against supported dd_* collections, admin roles, allowed pipeline transitions, and audit event writes.`
    : `${pipelineActionContractIssues.length} contract issue(s): ${pipelineActionContractIssues.join('; ')}`,
  pipelineActionContractIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoPipelineActionContract.js before deploying live pipeline actions.',
);

const adminModuleReadSource = await readIfExists('functions/detroitDynamoAdminModuleRead/src/main.js');
const adminModuleReadPackageExists = await fileExists('functions/detroitDynamoAdminModuleRead/package.json');
const adminModuleReadSourceOk = [
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
  'APPWRITE_API_KEY',
].every((needle) => adminModuleReadSource.includes(needle));

record(
  'function-scaffold-admin-module-read',
  'detroitDynamoAdminModuleRead scaffold',
  adminModuleReadPackageExists && adminModuleReadSourceOk ? 'pass' : 'fail',
  adminModuleReadPackageExists && adminModuleReadSourceOk
    ? 'Function package and source validate authenticated module reads, role access, collection scoping, pagination limit, and Appwrite document reads.'
    : 'Admin module read function package or expected source safeguards are missing.',
  adminModuleReadPackageExists && adminModuleReadSourceOk ? '' : 'Restore the admin module read function scaffold before enabling protected live admin reads.',
);

const adminModuleReadContractIssues = auditDetroitDynamoAdminModuleReadContract();
const adminModuleReadSuccessFixtures = buildDetroitDynamoAdminModuleReadFixtures();
const adminModuleReadRejectionFixtures = buildDetroitDynamoAdminModuleReadRejectionFixtures();
record(
  'function-admin-module-read-contract',
  'detroitDynamoAdminModuleRead handoff contract',
  adminModuleReadContractIssues.length === 0 ? 'pass' : 'fail',
  adminModuleReadContractIssues.length === 0
    ? `${adminModuleReadSuccessFixtures.length} success fixtures and ${adminModuleReadRejectionFixtures.length} rejection fixtures validate against protected modules, scoped dd_* collections, and admin role view access.`
    : `${adminModuleReadContractIssues.length} contract issue(s): ${adminModuleReadContractIssues.join('; ')}`,
  adminModuleReadContractIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoAdminModuleReadContract.js before deploying live protected module reads.',
);

const adminRoleGrantSource = await readIfExists('functions/detroitDynamoAdminRoleGrantAction/src/main.js');
const adminRoleGrantPackageExists = await fileExists('functions/detroitDynamoAdminRoleGrantAction/package.json');
const adminRoleGrantSourceOk = [
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
  'APPWRITE_API_KEY',
].every((needle) => adminRoleGrantSource.includes(needle));

record(
  'function-scaffold-admin-role-grant',
  'detroitDynamoAdminRoleGrantAction scaffold',
  adminRoleGrantPackageExists && adminRoleGrantSourceOk ? 'pass' : 'fail',
  adminRoleGrantPackageExists && adminRoleGrantSourceOk
    ? 'Function package and source validate authenticated Master Admin role grants, bootstrap the first Master Admin only by server env, mutate trusted role assignments, and append audit events.'
    : 'Admin role grant function package or expected source safeguards are missing.',
  adminRoleGrantPackageExists && adminRoleGrantSourceOk ? '' : 'Restore the admin role grant function scaffold before enabling live role management.',
);

const adminRoleGrantContractIssues = auditDetroitDynamoAdminRoleGrantContract();
const adminRoleGrantSuccessFixtures = buildDetroitDynamoAdminRoleGrantFixtures();
const adminRoleGrantRejectionFixtures = buildDetroitDynamoAdminRoleGrantRejectionFixtures();
record(
  'function-admin-role-grant-contract',
  'detroitDynamoAdminRoleGrantAction handoff contract',
  adminRoleGrantContractIssues.length === 0 ? 'pass' : 'fail',
  adminRoleGrantContractIssues.length === 0
    ? `${adminRoleGrantSuccessFixtures.length} success fixtures and ${adminRoleGrantRejectionFixtures.length} rejection fixtures validate against Master Admin gating, first-admin bootstrap, self-lockout protection, trusted assignment writes, and audit event writes.`
    : `${adminRoleGrantContractIssues.length} contract issue(s): ${adminRoleGrantContractIssues.join('; ')}`,
  adminRoleGrantContractIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoAdminRoleGrantContract.js before deploying live role grant actions.',
);

const adminModuleWriteSource = await readIfExists('functions/detroitDynamoAdminModuleWriteAction/src/main.js');
const adminModuleWritePackageExists = await fileExists('functions/detroitDynamoAdminModuleWriteAction/package.json');
const adminModuleWriteSourceOk = [
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

record(
  'function-scaffold-admin-module-write',
  'detroitDynamoAdminModuleWriteAction scaffold',
  adminModuleWritePackageExists && adminModuleWriteSourceOk ? 'pass' : 'fail',
  adminModuleWritePackageExists && adminModuleWriteSourceOk
    ? 'Function package and source validate authenticated module writes, trusted role grants, module action guards, collection scoping, external gates, document mutations, and audit events.'
    : 'Admin module write function package or expected source safeguards are missing.',
  adminModuleWritePackageExists && adminModuleWriteSourceOk ? '' : 'Restore the admin module write function scaffold before enabling live dashboard writes.',
);

const adminModuleWriteContractIssues = auditDetroitDynamoAdminModuleWriteContract();
const adminModuleWriteSuccessFixtures = buildDetroitDynamoAdminModuleWriteFixtures();
const adminModuleWriteRejectionFixtures = buildDetroitDynamoAdminModuleWriteRejectionFixtures();
record(
  'function-admin-module-write-contract',
  'detroitDynamoAdminModuleWriteAction handoff contract',
  adminModuleWriteContractIssues.length === 0 ? 'pass' : 'fail',
  adminModuleWriteContractIssues.length === 0
    ? `${adminModuleWriteSuccessFixtures.length} success fixtures and ${adminModuleWriteRejectionFixtures.length} rejection fixtures validate against protected modules, action guards, scoped collections, trusted role grants, external gates, and audit event writes.`
    : `${adminModuleWriteContractIssues.length} contract issue(s): ${adminModuleWriteContractIssues.join('; ')}`,
  adminModuleWriteContractIssues.length === 0
    ? ''
    : 'Fix src/lib/detroitDynamoAdminModuleWriteContract.js before deploying live protected module writes.',
);

const configureFunctions = await readIfExists('scripts/configure-functions.mjs');
record(
  'function-env-config',
  'Function variable configuration path',
  configureFunctions.includes('detroitDynamoLeadIntake')
    && configureFunctions.includes('detroitDynamoLeadPipelineAction')
    && configureFunctions.includes('detroitDynamoAdminModuleRead')
    && configureFunctions.includes('detroitDynamoAdminRoleGrantAction')
    && configureFunctions.includes('detroitDynamoAdminModuleWriteAction')
    && configureFunctions.includes('APPWRITE_API_KEY')
    ? 'pass'
    : 'fail',
  'scripts/configure-functions.mjs includes Detroit Dynamo function APPWRITE_API_KEY mappings.',
  configureFunctions.includes('detroitDynamoAdminModuleWriteAction') ? '' : 'Add Detroit Dynamo functions to configure-functions.mjs before deploy.',
);

record(
  'backend-network',
  'Live backend verification',
  'pending',
  'No Appwrite network calls were made. This keeps the preflight safe for local preview and CI without credentials.',
  'After replacing/confirming credentials, run npm run provision:dynamo-appwrite -- --apply, configure function variables, deploy Detroit Dynamo functions, bootstrap or grant Master Admin access, submit production-preview forms, test an authenticated pipeline transition, then test an authenticated admin module read.',
);

const summary = summarize();
const report = {
  checkedAt: new Date().toISOString(),
  summary,
  checks,
};

await fs.mkdir(artifactDir, { recursive: true });
await fs.writeFile(jsonReportPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownReportPath, buildMarkdown(summary));

if (summary.fail > 0) {
  console.error(`Detroit Dynamo backend preflight failed with ${summary.fail} issue(s):`);
  for (const check of checks.filter((item) => item.status === 'fail')) {
    console.error(`- ${check.label}: ${check.evidence}`);
  }
  process.exit(1);
}

console.log('Detroit Dynamo backend preflight passed for local scaffold readiness.');
console.log(`Checks: ${summary.pass} passing, ${summary.pending} pending, ${summary.fail} failing.`);
console.log('No secrets were printed and no Appwrite network calls were made.');
console.log(`Reports written to ${jsonReportPath} and ${markdownReportPath}`);
