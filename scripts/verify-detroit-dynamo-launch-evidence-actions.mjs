import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoLaunchEvidenceActionReport,
  buildDetroitDynamoLaunchEvidenceActionMarkdown,
  buildDetroitDynamoLaunchEvidenceActionReport,
} from '../src/lib/detroitDynamoLaunchEvidenceActions.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-launch-evidence-actions.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-launch-evidence-actions.md');

const report = buildDetroitDynamoLaunchEvidenceActionReport();
const issues = auditDetroitDynamoLaunchEvidenceActionReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoLaunchEvidenceActionMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo launch evidence action verification failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo launch evidence action verification passed.');
console.log(`Fixture actions: ${report.actions.length}`);
console.log(`Checklist items touched: ${report.summary.checklistItemsTouched}`);
console.log(`Preview signoffs: ${report.summary.previewSignoffs}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
