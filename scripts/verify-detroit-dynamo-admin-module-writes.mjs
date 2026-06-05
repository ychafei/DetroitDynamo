import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoAdminModuleWriteContract,
  buildDetroitDynamoAdminModuleWriteContractReport,
  buildDetroitDynamoAdminModuleWriteHandoffMarkdown,
} from '../src/lib/detroitDynamoAdminModuleWriteContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-admin-module-write-fixtures.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-admin-module-write-handoff.md');

const report = buildDetroitDynamoAdminModuleWriteContractReport();
const issues = auditDetroitDynamoAdminModuleWriteContract();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoAdminModuleWriteHandoffMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo admin module write contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo admin module write contract passed.');
console.log(`Supported modules: ${report.supportedModules.length}`);
console.log(`Mutations: ${report.mutations.length}`);
console.log(`Success fixtures: ${report.successFixtures.length}`);
console.log(`Rejection fixtures: ${report.rejectionFixtures.length}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
