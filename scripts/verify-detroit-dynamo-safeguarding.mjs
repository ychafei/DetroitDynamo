import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoSafeguardingContract,
  buildDetroitDynamoSafeguardingMarkdown,
  buildDetroitDynamoSafeguardingReport,
} from '../src/lib/detroitDynamoSafeguardingContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');

const issues = auditDetroitDynamoSafeguardingContract();
const report = buildDetroitDynamoSafeguardingReport();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-safeguarding-privacy.json'),
  JSON.stringify(report, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-safeguarding-privacy.md'),
  buildDetroitDynamoSafeguardingMarkdown(report),
);

if (issues.length > 0) {
  console.error(`Detroit Dynamo safeguarding contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo safeguarding contract passed.');
console.log(`Safeguarding tracks: ${report.safeguardingTracks.length}`);
console.log(`Launch readiness categories referenced: ${report.launchReadiness.length}`);
console.log(`Promotion gates referenced: ${report.promotionGates.length}`);
console.log(`External confirmation registers referenced: ${report.confirmationRegisters.length}`);
console.log(`Artifacts written to ${outDir}`);
