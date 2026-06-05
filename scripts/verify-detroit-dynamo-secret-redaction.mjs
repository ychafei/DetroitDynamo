import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoSecretRedactionReport,
  buildDetroitDynamoSecretRedactionCsv,
  buildDetroitDynamoSecretRedactionMarkdown,
  buildDetroitDynamoSecretRedactionReport,
} from '../src/lib/detroitDynamoSecretRedactionContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-secret-redaction.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-secret-redaction.md');
const csvPath = path.join(outDir, 'detroit-dynamo-secret-redaction.csv');
const violationCsvPath = path.join(outDir, 'detroit-dynamo-secret-redaction-violations.csv');

const sensitiveKeyPattern = /(API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE|WEBHOOK|CLIENT_SECRET|STRIPE_SECRET|PAYPAL_SECRET|VERCEL)/i;
const textExtensions = new Set([
  '.css',
  '.csv',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yml',
  '.yaml',
]);
const scanTargets = [
  'DETROIT_DYNAMO_REBRAND_AUDIT_AND_ROADMAP.md',
  'DETROIT_DYNAMO_FULL_PREVIEW_NOTES.md',
  'artifacts/detroit-dynamo',
  'src',
  'scripts',
  'functions',
  'appwrite.json',
  'package.json',
  'vercel.json',
];
const genericSecretPatterns = [
  { id: 'appwrite-standard-api-key', pattern: /\bstandard_[A-Za-z0-9]{40,}\b/g },
  { id: 'stripe-secret-key', pattern: /\bsk_(?:live|test)_[A-Za-z0-9]{20,}\b/g },
  { id: 'stripe-webhook-secret', pattern: /\bwhsec_[A-Za-z0-9]{20,}\b/g },
  { id: 'vercel-token-assignment', pattern: /\bVERCEL_TOKEN\s*=\s*['"]?[^'"\s]{12,}/g },
  { id: 'jwt-like-token', pattern: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{12,}\b/g },
];

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

async function readIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function parseEnvSecrets(text, sourceFile) {
  const entries = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const [rawKey, ...rawValueParts] = line.split('=');
    const key = rawKey.trim();
    const value = rawValueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (/CLIENT_ID$/i.test(key) && !/CLIENT_SECRET$/i.test(key)) continue;
    if (!sensitiveKeyPattern.test(key) || value.length < 8) continue;
    entries.push({
      sourceFile,
      key,
      value,
      label: `${path.basename(sourceFile)}:${key}`,
    });
  }
  return entries;
}

async function collectLocalSecrets() {
  const envFiles = ['.env', '.env.local', '.env.production', '.env.preview', '.env.development'];
  const entries = [];
  for (const envFile of envFiles) {
    const absolute = path.join(root, envFile);
    const text = await readIfExists(absolute);
    if (!text) continue;
    entries.push(...parseEnvSecrets(text, envFile));
  }
  return entries;
}

async function collectLocalIdentifiers() {
  const identifiers = [];
  const repo = await readJsonIfExists(path.join(root, '.vercel/repo.json'));
  const project = await readJsonIfExists(path.join(root, '.vercel/project.json'));
  for (const item of repo?.projects || []) {
    for (const [field, value] of Object.entries({ id: item.id, orgId: item.orgId })) {
      if (typeof value === 'string' && value.length > 8) {
        identifiers.push({ sourceFile: '.vercel/repo.json', key: field, value, label: `.vercel/repo.json:${field}` });
      }
    }
  }
  for (const [field, value] of Object.entries({ projectId: project?.projectId, orgId: project?.orgId })) {
    if (typeof value === 'string' && value.length > 8) {
      identifiers.push({ sourceFile: '.vercel/project.json', key: field, value, label: `.vercel/project.json:${field}` });
    }
  }
  return identifiers;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectTextFiles(targets) {
  const files = [];

  async function walk(relativePath) {
    const absolute = path.join(root, relativePath);
    if (!(await pathExists(absolute))) return;
    const stats = await fs.stat(absolute);
    if (stats.isDirectory()) {
      const base = path.basename(relativePath);
      if (['node_modules', 'dist', '.git', '.vercel'].includes(base)) return;
      const children = await fs.readdir(absolute);
      for (const child of children) {
        await walk(path.join(relativePath, child));
      }
      return;
    }
    if (!stats.isFile()) return;
    if (!textExtensions.has(path.extname(relativePath))) return;
    files.push(relativePath);
  }

  for (const target of targets) {
    await walk(target);
  }
  return files;
}

function addViolation(violations, file, ruleId, matchType) {
  violations.push({ file, ruleId, matchType });
}

async function scanFiles(files, secrets, identifiers) {
  const violations = [];
  let scannedBytes = 0;

  for (const file of files) {
    const absolute = path.join(root, file);
    let text = '';
    try {
      text = await fs.readFile(absolute, 'utf8');
    } catch {
      continue;
    }
    scannedBytes += Buffer.byteLength(text);

    for (const secret of secrets) {
      if (text.includes(secret.value)) {
        addViolation(violations, file, 'exact-local-secret-value', `exact:${secret.label}`);
      }
    }
    for (const identifier of identifiers) {
      if (text.includes(identifier.value)) {
        addViolation(violations, file, 'vercel-project-identifier', `exact:${identifier.label}`);
      }
    }
    for (const pattern of genericSecretPatterns) {
      pattern.pattern.lastIndex = 0;
      if (pattern.pattern.test(text)) {
        addViolation(violations, file, pattern.id, 'generic-pattern');
      }
    }
  }

  return { violations, scannedBytes };
}

function buildViolationCsv(violations) {
  const columns = ['file', 'rule_id', 'match_type'];
  return [
    columns.join(','),
    ...violations.map((violation) => columns.map((column) => csvEscape(violation[column])).join(',')),
  ].join('\n');
}

const secrets = await collectLocalSecrets();
const identifiers = await collectLocalIdentifiers();
const files = await collectTextFiles(scanTargets);
const { violations, scannedBytes } = await scanFiles(files, secrets, identifiers);
const exactSecretMatches = violations.filter((violation) => violation.ruleId === 'exact-local-secret-value').length;
const identifierMatches = violations.filter((violation) => violation.ruleId === 'vercel-project-identifier').length;
const genericPatternMatches = violations.length - exactSecretMatches - identifierMatches;
const report = buildDetroitDynamoSecretRedactionReport({
  localSecretSourcesDetected: secrets.length,
  localIdentifierSourcesDetected: identifiers.length,
  scannedFiles: files.length,
  scannedBytes,
  exactSecretMatches,
  identifierMatches,
  genericPatternMatches,
  leakagesDetected: violations.length,
  violations,
  scanTargets,
});
const issues = auditDetroitDynamoSecretRedactionReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoSecretRedactionMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoSecretRedactionCsv(report));
await fs.writeFile(violationCsvPath, buildViolationCsv(violations));

if (issues.length > 0) {
  console.error(`Detroit Dynamo secret redaction verification failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo secret redaction verified.');
console.log(`Rules: ${report.summary.rulesTotal}`);
console.log(`Local secret sources detected: ${report.summary.localSecretSourcesDetected}`);
console.log(`Local identifier sources detected: ${report.summary.localIdentifierSourcesDetected}`);
console.log(`Scanned files: ${report.summary.scannedFiles}`);
console.log(`Exact secret matches: ${report.summary.exactSecretMatches}`);
console.log(`Identifier matches: ${report.summary.identifierMatches}`);
console.log(`Generic pattern matches: ${report.summary.genericPatternMatches}`);
console.log(`Leakages detected: ${report.summary.leakagesDetected}`);
console.log(`Project identifiers redacted: ${report.summary.projectIdentifiersRedacted}`);
console.log(`Publish allowed: ${report.summary.publishAllowed}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, ${csvPath}, and ${violationCsvPath}`);
