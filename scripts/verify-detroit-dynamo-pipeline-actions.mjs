import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoPipelineActionContract,
  buildDetroitDynamoPipelineActionContractReport,
  buildDetroitDynamoPipelineActionHandoffMarkdown,
} from '../src/lib/detroitDynamoPipelineActionContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-pipeline-action-fixtures.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-pipeline-action-handoff.md');

const issues = auditDetroitDynamoPipelineActionContract();
const report = buildDetroitDynamoPipelineActionContractReport();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoPipelineActionHandoffMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo pipeline action contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Detroit Dynamo pipeline action contract verified.');
console.log(`Supported models: ${report.supportedModels.length}`);
console.log(`Success fixtures: ${report.successFixtures.length}`);
console.log(`Rejection fixtures: ${report.rejectionFixtures.length}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
