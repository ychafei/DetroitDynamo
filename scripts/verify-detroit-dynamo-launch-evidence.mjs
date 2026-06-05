import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoLaunchEvidenceReport,
  buildDetroitDynamoLaunchEvidenceMarkdown,
  buildDetroitDynamoLaunchEvidenceReport,
} from '../src/lib/detroitDynamoLaunchEvidenceContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-launch-evidence-checklist.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-launch-evidence-checklist.md');

const report = buildDetroitDynamoLaunchEvidenceReport();
const issues = auditDetroitDynamoLaunchEvidenceReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoLaunchEvidenceMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo launch evidence verification failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo launch evidence verification passed.');
console.log(`Evidence items: ${report.checklistItems.length}`);
console.log(`Evidence required: ${report.summary.evidenceRequired}`);
console.log(`Pending confirmations: ${report.summary.pendingConfirmation}`);
console.log(`Blocked actions: ${report.summary.blockedActions}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
