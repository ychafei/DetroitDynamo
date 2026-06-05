import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoProductionPreviewEvidenceReport,
  buildDetroitDynamoProductionPreviewEvidenceMarkdown,
  buildDetroitDynamoProductionPreviewEvidenceReport,
} from '../src/lib/detroitDynamoProductionPreviewEvidence.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-production-preview-evidence.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-production-preview-evidence.md');

const report = buildDetroitDynamoProductionPreviewEvidenceReport();
const issues = auditDetroitDynamoProductionPreviewEvidenceReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoProductionPreviewEvidenceMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo production-preview evidence matrix failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo production-preview evidence matrix verified.');
console.log(`Decision: ${report.decision.status}`);
console.log(`Tracks: ${report.summary.tracksTotal}`);
console.log(`Public form tracks: ${report.summary.publicFormTracks}`);
console.log(`Admin action tracks: ${report.summary.adminActionTracks}`);
console.log(`Route QA tracks: ${report.summary.routeQaTracks}`);
console.log(`Backend activation tracks: ${report.summary.backendActivationTracks}`);
console.log(`External confirmation tracks: ${report.summary.externalConfirmationTracks}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
