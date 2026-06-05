import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoFinalAcceptanceMatrixReport,
  buildDetroitDynamoFinalAcceptanceMatrixCsv,
  buildDetroitDynamoFinalAcceptanceMatrixMarkdown,
  buildDetroitDynamoFinalAcceptanceMatrixReport,
} from '../src/lib/detroitDynamoFinalAcceptanceMatrix.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-final-acceptance-matrix.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-final-acceptance-matrix.md');
const csvPath = path.join(outDir, 'detroit-dynamo-final-acceptance-matrix.csv');

const report = buildDetroitDynamoFinalAcceptanceMatrixReport();
const issues = auditDetroitDynamoFinalAcceptanceMatrixReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoFinalAcceptanceMatrixMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoFinalAcceptanceMatrixCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo final acceptance matrix failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo final acceptance matrix verified.');
console.log(`Acceptance rows: ${report.summary.acceptanceRows}`);
console.log(`Preview-complete rows: ${report.summary.previewCompleteRows}`);
console.log(`External evidence required rows: ${report.summary.externalEvidenceRequiredRows}`);
console.log(`Owner signoff rows: ${report.summary.ownerSignoffRows}`);
console.log(`Owner signed rows: ${report.summary.ownerSignedRows}`);
console.log(`Go-live allowed rows: ${report.summary.goLiveAllowedRows}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Production deployments recorded: ${report.summary.productionDeploymentsRecorded}`);
console.log(`Production submissions recorded: ${report.summary.productionSubmissionsRecorded}`);
console.log(`Root promotion allowed: ${report.summary.rootPromotionAllowed}`);
console.log(`Checkout allowed: ${report.summary.checkoutAllowed}`);
console.log(`Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
