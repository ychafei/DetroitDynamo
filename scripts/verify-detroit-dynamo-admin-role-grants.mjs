import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoAdminRoleGrantContract,
  buildDetroitDynamoAdminRoleGrantContractReport,
  buildDetroitDynamoAdminRoleGrantHandoffMarkdown,
} from '../src/lib/detroitDynamoAdminRoleGrantContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-admin-role-grant-fixtures.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-admin-role-grant-handoff.md');

const report = buildDetroitDynamoAdminRoleGrantContractReport();
const issues = auditDetroitDynamoAdminRoleGrantContract();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoAdminRoleGrantHandoffMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo admin role grant contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo admin role grant contract passed.');
console.log(`Actions: ${report.actions.length}`);
console.log(`Roles: ${report.roles.length}`);
console.log(`Success fixtures: ${report.successFixtures.length}`);
console.log(`Rejection fixtures: ${report.rejectionFixtures.length}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
