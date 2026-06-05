import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoPromotionCutoverContract,
  buildDetroitDynamoPromotionCutoverMarkdown,
  buildDetroitDynamoPromotionCutoverReport,
} from '../src/lib/detroitDynamoPromotionCutoverContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');

const issues = auditDetroitDynamoPromotionCutoverContract();
const report = buildDetroitDynamoPromotionCutoverReport();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-promotion-cutover.json'),
  JSON.stringify(report, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-promotion-cutover.md'),
  buildDetroitDynamoPromotionCutoverMarkdown(report),
);

if (issues.length > 0) {
  console.error(`Detroit Dynamo promotion cutover contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo promotion cutover contract passed.');
console.log(`Cutover tracks: ${report.cutoverTracks.length}`);
console.log(`Promotion gates referenced: ${report.promotionGates.length}`);
console.log(`Backend activation steps referenced: ${report.backendActivationSteps.length}`);
console.log(`External confirmation registers referenced: ${report.confirmationRegisters.length}`);
console.log(`Artifacts written to ${outDir}`);
