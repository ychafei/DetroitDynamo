import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoOwnerLaunchReviewReport,
  buildDetroitDynamoOwnerLaunchReviewMarkdown,
  buildDetroitDynamoOwnerLaunchReviewReport,
} from '../src/lib/detroitDynamoOwnerLaunchReview.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-owner-launch-review.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-owner-launch-review.md');

const report = buildDetroitDynamoOwnerLaunchReviewReport();
const issues = auditDetroitDynamoOwnerLaunchReviewReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoOwnerLaunchReviewMarkdown(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo owner launch review failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo owner launch review verified.');
console.log(`Decision: ${report.decision.decision}`);
console.log(`Review sections: ${report.summary.sectionsTotal}`);
console.log(`Blocked sections: ${report.summary.blockedSections}`);
console.log(`External approvals required: ${report.summary.externalApprovalsRequired}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Artifacts written to ${jsonPath} and ${markdownPath}`);
