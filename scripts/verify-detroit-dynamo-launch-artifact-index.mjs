import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoLaunchArtifactIndexReport,
  buildDetroitDynamoLaunchArtifactIndexCsv,
  buildDetroitDynamoLaunchArtifactIndexMarkdown,
  buildDetroitDynamoLaunchArtifactIndexReport,
} from '../src/lib/detroitDynamoLaunchArtifactIndex.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-launch-artifact-index.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-launch-artifact-index.md');
const csvPath = path.join(outDir, 'detroit-dynamo-launch-artifact-index.csv');

const report = buildDetroitDynamoLaunchArtifactIndexReport();
const issues = auditDetroitDynamoLaunchArtifactIndexReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoLaunchArtifactIndexMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoLaunchArtifactIndexCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo launch artifact index failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo launch artifact index verified.');
console.log(`Artifacts: ${report.summary.artifactsTotal}`);
console.log(`Categories: ${report.summary.categories}`);
console.log(`Owner roles: ${report.summary.ownerRoles}`);
console.log(`Blocked live actions: ${report.summary.blockedLiveActions}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
