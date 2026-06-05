import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoExternalGateClosureReport,
  buildDetroitDynamoExternalGateClosureCsv,
  buildDetroitDynamoExternalGateClosureMarkdown,
  buildDetroitDynamoExternalGateClosureReport,
} from '../src/lib/detroitDynamoExternalGateClosurePacket.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-external-gate-closure.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-external-gate-closure.md');
const csvPath = path.join(outDir, 'detroit-dynamo-external-gate-closure.csv');

const report = buildDetroitDynamoExternalGateClosureReport();
const issues = auditDetroitDynamoExternalGateClosureReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoExternalGateClosureMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoExternalGateClosureCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo external gate closure packet failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo external gate closure packet verified.');
console.log(`Closure rows: ${report.summary.rowsTotal}`);
console.log(`External evidence rows: ${report.summary.externalEvidenceRows}`);
console.log(`Owner review rows: ${report.summary.ownerReviewRows}`);
console.log(`Critical rows: ${report.summary.criticalRows}`);
console.log(`Required evidence items: ${report.summary.requiredEvidenceItems}`);
console.log(`Ready-to-close rows: ${report.summary.readyToCloseRows}`);
console.log(`Closure-allowed rows: ${report.summary.closureAllowedRows}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Root promotion allowed: ${report.summary.rootPromotionAllowed}`);
console.log(`Checkout allowed: ${report.summary.checkoutAllowed}`);
console.log(`Signature capture allowed: ${report.summary.signatureCaptureAllowed}`);
console.log(`Completion claim allowed: ${report.summary.completionClaimAllowed}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
