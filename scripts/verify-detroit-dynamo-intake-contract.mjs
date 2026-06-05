import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoLeadIntakeContract,
  buildDetroitDynamoLeadIntakeContractReport,
  buildDetroitDynamoLeadIntakeHandoffMarkdown,
} from '../src/lib/detroitDynamoLeadIntakeContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-lead-intake-fixtures.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-lead-intake-handoff.md');

const issues = auditDetroitDynamoLeadIntakeContract();
const report = buildDetroitDynamoLeadIntakeContractReport();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoLeadIntakeHandoffMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo lead intake contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Detroit Dynamo lead intake contract verified.');
console.log(`Variants: ${report.variants.length}`);
console.log(`Success fixtures: ${report.successFixtures.length}`);
console.log(`Rejection fixtures: ${report.rejectionFixtures.length}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
