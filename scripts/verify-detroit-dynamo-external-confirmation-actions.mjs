import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoExternalConfirmationActionReport,
  buildDetroitDynamoExternalConfirmationActionMarkdown,
  buildDetroitDynamoExternalConfirmationActionReport,
} from '../src/lib/detroitDynamoExternalConfirmationActions.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-external-confirmation-actions.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-external-confirmation-actions.md');

const report = buildDetroitDynamoExternalConfirmationActionReport();
const issues = auditDetroitDynamoExternalConfirmationActionReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoExternalConfirmationActionMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo external confirmation action verification failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo external confirmation action verification passed.');
console.log(`Fixture actions: ${report.actions.length}`);
console.log(`Confirmation areas touched: ${report.summary.confirmationAreasTouched}`);
console.log(`Owner signoffs requested: ${report.summary.ownerSignoffsRequested}`);
console.log(`Preview decisions: ${report.summary.previewDecisions}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
