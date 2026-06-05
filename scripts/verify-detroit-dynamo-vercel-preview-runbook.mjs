import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoVercelPreviewRunbookReport,
  buildDetroitDynamoVercelPreviewRunbookCsv,
  buildDetroitDynamoVercelPreviewRunbookMarkdown,
  buildDetroitDynamoVercelPreviewRunbookReport,
} from '../src/lib/detroitDynamoVercelPreviewRunbook.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-vercel-preview-runbook.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-vercel-preview-runbook.md');
const csvPath = path.join(outDir, 'detroit-dynamo-vercel-preview-runbook.csv');

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function detectVercelCliVersion() {
  try {
    const output = execFileSync('vercel', ['--version'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const versions = output.match(/\d+\.\d+\.\d+/g) || [];
    return versions.at(-1) || output.trim();
  } catch {
    return '';
  }
}

function hasSpaRewrite(config) {
  return Array.isArray(config?.rewrites)
    && config.rewrites.some((rewrite) => rewrite.source === '/(.*)' && rewrite.destination === '/index.html');
}

async function buildLocalContext() {
  const repoLink = await readJsonIfExists(path.join(root, '.vercel/repo.json'));
  const projectLink = await readJsonIfExists(path.join(root, '.vercel/project.json'));
  const vercelConfig = await readJsonIfExists(path.join(root, 'vercel.json'));
  const pkg = await readJsonIfExists(path.join(root, 'package.json'));
  const requiredScripts = ['lint', 'typecheck', 'build', 'test', 'verify:dynamo', 'qa:dynamo-browser', 'audit:dynamo-goal'];
  const scripts = pkg?.scripts || {};

  return {
    vercelCliVersion: detectVercelCliVersion(),
    projectLinkType: repoLink ? 'repo' : projectLink ? 'project' : 'missing',
    linkedProjectCount: repoLink?.projects?.length || (projectLink ? 1 : 0),
    spaRewritePresent: hasSpaRewrite(vercelConfig),
    requiredPackageScriptsPresent: requiredScripts.every((script) => Boolean(scripts[script])),
  };
}

const report = buildDetroitDynamoVercelPreviewRunbookReport(await buildLocalContext());
const issues = auditDetroitDynamoVercelPreviewRunbookReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoVercelPreviewRunbookMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoVercelPreviewRunbookCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo Vercel preview runbook failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo Vercel preview runbook verified.');
console.log(`Steps: ${report.summary.stepsTotal}`);
console.log(`Evidence-required steps: ${report.summary.evidenceRequiredSteps}`);
console.log(`Observed Vercel CLI version: ${report.summary.observedVercelCliVersion || 'not installed'}`);
console.log(`Recommended Vercel CLI version: ${report.summary.recommendedVercelCliVersion}+`);
console.log(`CLI upgrade recommended: ${report.summary.cliUpgradeRecommended}`);
console.log(`Project link type: ${report.summary.projectLinkType}`);
console.log(`Linked project count: ${report.summary.linkedProjectCount}`);
console.log(`Project identifiers redacted: ${report.summary.projectIdentifiersRedacted}`);
console.log(`SPA rewrite present: ${report.summary.spaRewritePresent}`);
console.log(`Required package scripts present: ${report.summary.requiredPackageScriptsPresent}`);
console.log(`Preview deployment recorded: ${report.summary.previewDeploymentRecorded}`);
console.log(`Production deployment recorded: ${report.summary.productionDeploymentRecorded}`);
console.log(`Production promotion allowed: ${report.summary.productionPromotionAllowed}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
