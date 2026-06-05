import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoAdminRecordWorkspaceReport,
  buildDetroitDynamoAdminRecordWorkspaceMarkdown,
  buildDetroitDynamoAdminRecordWorkspaceReport,
} from '../src/lib/detroitDynamoAdminRecordWorkspaceContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-admin-record-workspace.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-admin-record-workspace.md');

const report = buildDetroitDynamoAdminRecordWorkspaceReport();
const issues = auditDetroitDynamoAdminRecordWorkspaceReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoAdminRecordWorkspaceMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo admin record workspace verification failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo admin record workspace verification passed.');
console.log(`Flattened records: ${report.flattenedRecords.length}`);
console.log(`Complete player missing required fields: ${report.completePlayerProfile.missingRequiredFieldCount}`);
console.log(`Incomplete player missing required fields: ${report.incompletePlayerProfile.missingRequiredFields.join(', ')}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
