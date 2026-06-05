import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoOwnerSignoffRegisterReport,
  buildDetroitDynamoOwnerSignoffRegisterCsv,
  buildDetroitDynamoOwnerSignoffRegisterMarkdown,
  buildDetroitDynamoOwnerSignoffRegisterReport,
} from '../src/lib/detroitDynamoOwnerSignoffRegister.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-owner-signoff-register.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-owner-signoff-register.md');
const csvPath = path.join(outDir, 'detroit-dynamo-owner-signoff-register.csv');

const report = buildDetroitDynamoOwnerSignoffRegisterReport();
const issues = auditDetroitDynamoOwnerSignoffRegisterReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoOwnerSignoffRegisterMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoOwnerSignoffRegisterCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo owner signoff register failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo owner signoff register verified.');
console.log(`Signoff rows: ${report.summary.signoffRows}`);
console.log(`Signed rows: ${report.summary.signedRows}`);
console.log(`Unsigned rows: ${report.summary.unsignedRows}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Root promotion allowed: ${report.summary.rootPromotionAllowed}`);
console.log(`Checkout allowed: ${report.summary.checkoutAllowed}`);
console.log(`Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`);
console.log(`Production deployments recorded: ${report.summary.productionDeploymentsRecorded}`);
console.log(`Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
