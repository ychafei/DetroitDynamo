import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoClaimSafetyContract,
  buildDetroitDynamoClaimSafetyContractReport,
  buildDetroitDynamoClaimSafetyHandoffMarkdown,
} from '../src/lib/detroitDynamoClaimSafetyContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');

const issues = auditDetroitDynamoClaimSafetyContract();
const report = buildDetroitDynamoClaimSafetyContractReport();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-claim-safety.json'),
  JSON.stringify(report, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-claim-safety.md'),
  buildDetroitDynamoClaimSafetyHandoffMarkdown(report),
);

if (issues.length > 0) {
  console.error(`Detroit Dynamo claim safety contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo claim safety contract passed.');
console.log(`Claim-safety tracks: ${report.claimSafetyTracks.length}`);
console.log(`External confirmation registers covered: ${report.confirmationRegisters.length}`);
console.log(`Launch readiness categories covered: ${report.launchReadiness.length}`);
console.log(`Promotion gates covered: ${report.promotionGates.length}`);
console.log(`Artifacts written to ${outDir}`);
