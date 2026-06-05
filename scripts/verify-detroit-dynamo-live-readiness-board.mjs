import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoLiveReadinessBoardReport,
  buildDetroitDynamoLiveReadinessBoardCsv,
  buildDetroitDynamoLiveReadinessBoardMarkdown,
  buildDetroitDynamoLiveReadinessBoardReport,
} from '../src/lib/detroitDynamoLiveReadinessBoard.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-live-readiness-board.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-live-readiness-board.md');
const csvPath = path.join(outDir, 'detroit-dynamo-live-readiness-board.csv');

const report = buildDetroitDynamoLiveReadinessBoardReport();
const issues = auditDetroitDynamoLiveReadinessBoardReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoLiveReadinessBoardMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoLiveReadinessBoardCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo live readiness board failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo live readiness board verified.');
console.log(`Decision: ${report.decision.decision}`);
console.log(`Rows: ${report.summary.rowsTotal}`);
console.log(`Blocked rows: ${report.summary.blockedRows}`);
console.log(`Go-live allowed rows: ${report.summary.goLiveAllowedRows}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Root promotion allowed: ${report.summary.rootPromotionAllowed}`);
console.log(`Checkout allowed: ${report.summary.checkoutAllowed}`);
console.log(`Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
