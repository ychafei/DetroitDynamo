import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoAdminModuleReadContract,
  buildDetroitDynamoAdminModuleReadContractReport,
  buildDetroitDynamoAdminModuleReadHandoffMarkdown,
} from '../src/lib/detroitDynamoAdminModuleReadContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-admin-module-read-fixtures.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-admin-module-read-handoff.md');

const report = buildDetroitDynamoAdminModuleReadContractReport();
const issues = auditDetroitDynamoAdminModuleReadContract();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoAdminModuleReadHandoffMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo admin module read contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo admin module read contract passed.');
console.log(`Supported modules: ${report.supportedModules.length}`);
console.log(`Success fixtures: ${report.successFixtures.length}`);
console.log(`Rejection fixtures: ${report.rejectionFixtures.length}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
