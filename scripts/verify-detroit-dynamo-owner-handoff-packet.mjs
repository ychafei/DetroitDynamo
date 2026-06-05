import fs from 'node:fs/promises';
import path from 'node:path';
import {
  auditDetroitDynamoOwnerHandoffPacketReport,
  buildDetroitDynamoOwnerHandoffPacketCsv,
  buildDetroitDynamoOwnerHandoffPacketMarkdown,
  buildDetroitDynamoOwnerHandoffPacketReport,
} from '../src/lib/detroitDynamoOwnerHandoffPacket.js';

const outDir = path.join(process.cwd(), 'artifacts/detroit-dynamo/launch');
const jsonPath = path.join(outDir, 'detroit-dynamo-owner-handoff-packet.json');
const markdownPath = path.join(outDir, 'detroit-dynamo-owner-handoff-packet.md');
const csvPath = path.join(outDir, 'detroit-dynamo-owner-handoff-packet.csv');

const report = buildDetroitDynamoOwnerHandoffPacketReport();
const issues = auditDetroitDynamoOwnerHandoffPacketReport(report);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
await fs.writeFile(markdownPath, buildDetroitDynamoOwnerHandoffPacketMarkdown(report));
await fs.writeFile(csvPath, buildDetroitDynamoOwnerHandoffPacketCsv(report));

if (issues.length > 0) {
  console.error(`Detroit Dynamo owner handoff packet failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Detroit Dynamo owner handoff packet verified.');
console.log(`Packet sections: ${report.summary.packetSections}`);
console.log(`Evidence-required sections: ${report.summary.evidenceRequiredSections}`);
console.log(`Redaction-review sections: ${report.summary.redactionReviewSections}`);
console.log(`Launch artifacts indexed: ${report.summary.launchArtifactsIndexed}`);
console.log(`Signoff rows: ${report.summary.signoffRows}`);
console.log(`Signed rows: ${report.summary.signedRows}`);
console.log(`Unresolved evidence rows: ${report.summary.unresolvedEvidenceRows}`);
console.log(`Secret redaction leakages: ${report.summary.secretRedactionLeakages}`);
console.log(`Production-preview tracks: ${report.summary.productionPreviewTracks}`);
console.log(`Live gates cleared: ${report.summary.liveGatesCleared}`);
console.log(`Publications unlocked: ${report.summary.publicationsUnlocked}`);
console.log(`Root promotion allowed: ${report.summary.rootPromotionAllowed}`);
console.log(`Checkout allowed: ${report.summary.checkoutAllowed}`);
console.log(`Signatures allowed: ${report.summary.signaturesAllowed}`);
console.log(`Permanent redirects allowed: ${report.summary.permanentRedirectsAllowed}`);
console.log(`Noindex removal allowed: ${report.summary.noindexRemovalAllowed}`);
console.log(`Public claim publication allowed: ${report.summary.publicClaimPublicationAllowed}`);
console.log(`Publish allowed: ${report.summary.publishAllowed}`);
console.log(`Completion claim allowed: ${report.summary.completionClaimAllowed}`);
console.log(`Artifacts written to ${jsonPath}, ${markdownPath}, and ${csvPath}`);
