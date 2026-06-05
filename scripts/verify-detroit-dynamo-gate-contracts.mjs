import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoExternalGateContracts,
  buildDetroitDynamoExternalGateContractReport,
  buildDetroitDynamoExternalGateHandoffMarkdown,
} from '../src/lib/detroitDynamoExternalGateContracts.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-payment-waiver-gates.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-payment-waiver-gates.md');

const issues = auditDetroitDynamoExternalGateContracts();
const report = buildDetroitDynamoExternalGateContractReport();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoExternalGateHandoffMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo payment/waiver gate contract failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Detroit Dynamo payment/waiver gate contract verified.');
console.log(`Payment/package tracks: ${report.paymentPackageTracks.length}`);
console.log(`Waiver tracks: ${report.waiverTracks.length}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
