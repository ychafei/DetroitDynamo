import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoOwnerEvidenceIntakeReport,
  buildDetroitDynamoOwnerEvidenceIntakeCsv,
  buildDetroitDynamoOwnerEvidenceIntakeMarkdown,
  buildDetroitDynamoOwnerEvidenceIntakeReport,
} from '../src/lib/detroitDynamoOwnerEvidenceIntake.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-owner-evidence-intake.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-owner-evidence-intake.md');
const csvPath = path.join(outDir, 'detroit-dynamo-owner-evidence-intake.csv');

const report = buildDetroitDynamoOwnerEvidenceIntakeReport();
const issues = auditDetroitDynamoOwnerEvidenceIntakeReport(report);

if (issues.length > 0) {
  console.error('Detroit Dynamo owner evidence intake verification failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoOwnerEvidenceIntakeMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoOwnerEvidenceIntakeCsv(report));

console.log('Detroit Dynamo owner evidence intake verified.');
console.log(`Intake rows: ${report.summary.intakeRows}`);
console.log(`Unresolved rows: ${report.summary.unresolvedRows}`);
console.log(`Blocked live actions: ${report.summary.blockedLiveActions}`);
console.log(`Safe-to-publish rows: ${report.summary.safeToPublishRows}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
