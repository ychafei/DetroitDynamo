import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoDeploymentReadinessReport,
  buildDetroitDynamoDeploymentReadinessCsv,
  buildDetroitDynamoDeploymentReadinessMarkdown,
  buildDetroitDynamoDeploymentReadinessReport,
} from '../src/lib/detroitDynamoDeploymentReadiness.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-deployment-readiness.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-deployment-readiness.md');
const csvPath = path.join(outDir, 'detroit-dynamo-deployment-readiness.csv');

const report = buildDetroitDynamoDeploymentReadinessReport();
const issues = auditDetroitDynamoDeploymentReadinessReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoDeploymentReadinessMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoDeploymentReadinessCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo deployment readiness failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo deployment readiness verified.');
console.log(`Tracks: ${report.summary.tracksTotal}`);
console.log(`Evidence-required tracks: ${report.summary.evidenceRequiredTracks}`);
console.log(`Preview-ready tracks: ${report.summary.previewReadyTracks}`);
console.log(`Blocked/preview-only tracks: ${report.summary.blockedTracks}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Production deployments recorded: ${report.summary.productionDeploymentsRecorded}`);
console.log(`Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`);
console.log(`Root promotion allowed: ${report.summary.rootPromotionAllowed}`);
console.log(`Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
