import fs from 'node:fs/promises';
import path from 'node:path';
import {
  detroitDynamoRedirectPlan,
  detroitDynamoSitemapRoutes,
} from '../src/lib/detroitDynamoRouteManifest.js';
import {
  detroitDynamoBackendActivationSteps,
  detroitDynamoAdminModuleRegistry,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoLaunchReadiness,
  detroitDynamoLeadPipelineByType,
  detroitDynamoLeadPipelineStages,
  detroitDynamoLeadRouting,
  detroitDynamoPromotionGates,
  detroitDynamoRolePermissionMatrix,
} from '../src/lib/detroitDynamoDataModel.js';
import {
  detroitDynamoModuleActionGuards,
  detroitDynamoRoleAccessSummaries,
} from '../src/lib/detroitDynamoAdminAccess.js';
import {
  detroitDynamoLeadRecordDraftMap,
} from '../src/lib/detroitDynamoAdminDrafts.js';
import {
  buildDetroitDynamoExternalGateContractReport,
  buildDetroitDynamoExternalGateHandoffMarkdown,
} from '../src/lib/detroitDynamoExternalGateContracts.js';
import {
  buildDetroitDynamoClaimSafetyContractReport,
  buildDetroitDynamoClaimSafetyHandoffMarkdown,
} from '../src/lib/detroitDynamoClaimSafetyContract.js';
import {
  buildDetroitDynamoPromotionCutoverMarkdown,
  buildDetroitDynamoPromotionCutoverReport,
} from '../src/lib/detroitDynamoPromotionCutoverContract.js';
import {
  buildDetroitDynamoLaunchEvidenceMarkdown,
  buildDetroitDynamoLaunchEvidenceReport,
} from '../src/lib/detroitDynamoLaunchEvidenceContract.js';
import {
  buildDetroitDynamoLaunchEvidenceActionMarkdown,
  buildDetroitDynamoLaunchEvidenceActionReport,
} from '../src/lib/detroitDynamoLaunchEvidenceActions.js';
import {
  buildDetroitDynamoExternalConfirmationActionMarkdown,
  buildDetroitDynamoExternalConfirmationActionReport,
} from '../src/lib/detroitDynamoExternalConfirmationActions.js';
import {
  buildDetroitDynamoOwnerLaunchReviewMarkdown,
  buildDetroitDynamoOwnerLaunchReviewReport,
} from '../src/lib/detroitDynamoOwnerLaunchReview.js';
import {
  buildDetroitDynamoOwnerEvidenceIntakeCsv,
  buildDetroitDynamoOwnerEvidenceIntakeMarkdown,
  buildDetroitDynamoOwnerEvidenceIntakeReport,
} from '../src/lib/detroitDynamoOwnerEvidenceIntake.js';
import {
  buildDetroitDynamoProductionPreviewEvidenceMarkdown,
  buildDetroitDynamoProductionPreviewEvidenceReport,
} from '../src/lib/detroitDynamoProductionPreviewEvidence.js';
import {
  buildDetroitDynamoLiveReadinessBoardCsv,
  buildDetroitDynamoLiveReadinessBoardMarkdown,
  buildDetroitDynamoLiveReadinessBoardReport,
} from '../src/lib/detroitDynamoLiveReadinessBoard.js';
import {
  buildDetroitDynamoLaunchArtifactIndexCsv,
  buildDetroitDynamoLaunchArtifactIndexMarkdown,
  buildDetroitDynamoLaunchArtifactIndexReport,
} from '../src/lib/detroitDynamoLaunchArtifactIndex.js';
import {
  buildDetroitDynamoDeploymentReadinessCsv,
  buildDetroitDynamoDeploymentReadinessMarkdown,
  buildDetroitDynamoDeploymentReadinessReport,
} from '../src/lib/detroitDynamoDeploymentReadiness.js';
import {
  buildDetroitDynamoVercelPreviewRunbookCsv,
  buildDetroitDynamoVercelPreviewRunbookMarkdown,
  buildDetroitDynamoVercelPreviewRunbookReport,
} from '../src/lib/detroitDynamoVercelPreviewRunbook.js';
import {
  buildDetroitDynamoSecretRedactionCsv,
  buildDetroitDynamoSecretRedactionMarkdown,
  buildDetroitDynamoSecretRedactionReport,
} from '../src/lib/detroitDynamoSecretRedactionContract.js';
import {
  buildDetroitDynamoExternalGateClosureCsv,
  buildDetroitDynamoExternalGateClosureMarkdown,
  buildDetroitDynamoExternalGateClosureReport,
} from '../src/lib/detroitDynamoExternalGateClosurePacket.js';
import {
  buildDetroitDynamoOwnerHandoffPacketCsv,
  buildDetroitDynamoOwnerHandoffPacketMarkdown,
  buildDetroitDynamoOwnerHandoffPacketReport,
} from '../src/lib/detroitDynamoOwnerHandoffPacket.js';
import {
  buildDetroitDynamoOwnerSignoffRegisterCsv,
  buildDetroitDynamoOwnerSignoffRegisterMarkdown,
  buildDetroitDynamoOwnerSignoffRegisterReport,
} from '../src/lib/detroitDynamoOwnerSignoffRegister.js';
import {
  buildDetroitDynamoFinalAcceptanceMatrixCsv,
  buildDetroitDynamoFinalAcceptanceMatrixMarkdown,
  buildDetroitDynamoFinalAcceptanceMatrixReport,
} from '../src/lib/detroitDynamoFinalAcceptanceMatrix.js';
import {
  buildDetroitDynamoSafeguardingMarkdown,
  buildDetroitDynamoSafeguardingReport,
} from '../src/lib/detroitDynamoSafeguardingContract.js';
import {
  buildDetroitDynamoLeadPipelineQueue,
} from '../src/lib/detroitDynamoLeadPipeline.js';
import {
  buildDetroitDynamoLeadIntakeContractReport,
  buildDetroitDynamoLeadIntakeHandoffMarkdown,
} from '../src/lib/detroitDynamoLeadIntakeContract.js';
import {
  buildDetroitDynamoPipelineActionContractReport,
  buildDetroitDynamoPipelineActionHandoffMarkdown,
} from '../src/lib/detroitDynamoPipelineActionContract.js';
import {
  buildDetroitDynamoAdminModuleReadContractReport,
  buildDetroitDynamoAdminModuleReadHandoffMarkdown,
} from '../src/lib/detroitDynamoAdminModuleReadContract.js';
import {
  buildDetroitDynamoAdminRoleGrantContractReport,
  buildDetroitDynamoAdminRoleGrantHandoffMarkdown,
} from '../src/lib/detroitDynamoAdminRoleGrantContract.js';
import {
  buildDetroitDynamoAdminModuleWriteContractReport,
  buildDetroitDynamoAdminModuleWriteHandoffMarkdown,
} from '../src/lib/detroitDynamoAdminModuleWriteContract.js';
import {
  buildDetroitDynamoAdminRecordWorkspaceMarkdown,
  buildDetroitDynamoAdminRecordWorkspaceReport,
} from '../src/lib/detroitDynamoAdminRecordWorkspaceContract.js';

const root = process.cwd();
const outDir = path.join(root, 'artifacts/detroit-dynamo/launch');
const siteUrl = (process.env.SITE_URL || 'https://www.detroitdynamo.com').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function absoluteUrl(route) {
  return `${siteUrl}${route.path}`;
}

function buildSitemapXml() {
  const rows = detroitDynamoSitemapRoutes.map((route) => [
    '  <url>',
    `    <loc>${xmlEscape(absoluteUrl(route))}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${xmlEscape(route.changefreq)}</changefreq>`,
    `    <priority>${route.priority}</priority>`,
    '  </url>',
  ].join('\n'));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...rows,
    '</urlset>',
    '',
  ].join('\n');
}

function buildRedirectPlanJson() {
  return {
    generatedAt: new Date().toISOString(),
    siteUrl,
    note: 'Draft only. Do not apply until Detroit Dynamo promotion gates are approved and the current Detroit Dynamo site migration is signed off.',
    redirects: detroitDynamoRedirectPlan.map((item) => ({
      source: item.from,
      destination: item.to,
      status: item.status,
      timing: item.timing,
      note: item.note,
      permanent: true,
      applyWhen: item.timing,
    })),
  };
}

function buildRedirectPlanMarkdown(plan) {
  const lines = [
    '# Detroit Dynamo Redirect Plan Draft',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Site URL: ${siteUrl}`,
    '',
    'Do not apply these redirects while Detroit Dynamo is preview-only. The current Detroit Dynamo website, booking flow, auth, blog, team pages, and admin routes remain live until promotion is approved.',
    '',
    '| From | To | Timing | Note |',
    '| --- | --- | --- | --- |',
    ...plan.redirects.map((item) => `| \`${item.source}\` | \`${item.destination}\` | ${item.timing} | ${item.note} |`),
    '',
  ];
  return lines.join('\n');
}

function buildPromotionChecklist() {
  const lines = [
    '# Detroit Dynamo Promotion Checklist',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This checklist is intentionally conservative. Detroit Dynamo should stay isolated under `/detroit-dynamo` until these gates are approved with real evidence.',
    '',
    '## Promotion Gates',
    '',
    ...detroitDynamoPromotionGates.flatMap((gate) => [
      `- [ ] ${gate.gate}`,
      `  - Status now: ${gate.status}`,
      `  - Evidence required: ${gate.requiredEvidence}`,
      `  - Next action: ${gate.nextAction}`,
    ]),
    '',
    '## Launch Readiness Workstreams',
    '',
    ...detroitDynamoLaunchReadiness.flatMap((item) => [
      `### ${item.category}`,
      '',
      `Owner: ${item.ownerRole}`,
      '',
      `Status now: ${item.status}`,
      '',
      `Next action: ${item.nextAction}`,
      '',
      'Evidence needed:',
      ...item.evidenceNeeded.map((evidence) => `- [ ] ${evidence}`),
      '',
    ]),
  ];
  return lines.join('\n');
}

function buildRobotsDraft() {
  return [
    '# Detroit Dynamo robots.txt draft',
    '',
    'Do not publish this while the preview remains noindex.',
    'Use only after the Detroit Dynamo brand promotion is approved.',
    '',
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${siteUrl}/detroit-dynamo-sitemap.xml`,
    '',
  ].join('\n');
}

function buildBackendActivationRunbook() {
  const lines = [
    '# Detroit Dynamo Backend Activation Runbook',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'Use this after the owner approves field review and backend credentials. The steps are ordered to keep the current Detroit Dynamo backend safe while activating the isolated Detroit Dynamo `dd_*` collections and lead intake.',
    '',
    '| Step | Owner | Command / Action | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...detroitDynamoBackendActivationSteps.map((item) => `| ${item.step}. ${item.title} | ${item.ownerRole} | \`${item.command}\` | ${item.evidence} | ${item.nextAction} |`),
    '',
    'Do not remove preview-only `noindex`, publish production redirects, or disable local lead fallback until the final promotion-gate evidence is approved.',
    '',
  ];
  return lines.join('\n');
}

function buildExternalConfirmationRegister() {
  const lines = [
    '# Detroit Dynamo External Confirmation Register',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'Use this register before publishing exact prices, legal language, league/facility claims, staff/roster details, sponsor assets, testimonials, or launch claims. Anything still pending should stay as future-pathway or placeholder language.',
    '',
    ...detroitDynamoExternalConfirmationRegister.flatMap((item) => [
      `## ${item.area}`,
      '',
      `Status: ${item.status}`,
      '',
      `Owner: ${item.ownerRole}`,
      '',
      `Related models: ${item.relatedModels.join(', ')}`,
      '',
      `Publish rule: ${item.publishRule}`,
      '',
      `Next action: ${item.nextAction}`,
      '',
      'Required facts:',
      ...item.requiredFacts.map((fact) => `- [ ] ${fact}`),
      '',
    ]),
  ];
  return lines.join('\n');
}

function buildRolePermissionMatrix() {
  const lines = [
    '# Detroit Dynamo Role Permission Matrix',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This matrix is the planning source for future dashboard permissions. It separates payment, waiver, roster, sponsor, media, team, registrar, coach, and launch controls before the full admin dashboard is built.',
    '',
    ...detroitDynamoRolePermissionMatrix.flatMap((role) => [
      `## ${role.role}`,
      '',
      role.purpose,
      '',
      role.sensitiveControls.length > 0 ? `Sensitive controls: ${role.sensitiveControls.join(', ')}` : 'Sensitive controls: None',
      '',
      `Control modules: ${detroitDynamoRoleAccessSummaries.find((summary) => summary.role === role.role)?.controlModules.length || 0}`,
      '',
      '| Module | Access | Scope |',
      '| --- | --- | --- |',
      ...role.permissions.map((item) => `| ${item.module} | ${item.access} | ${item.scope} |`),
      '',
    ]),
  ];
  return lines.join('\n');
}

function buildAdminModuleRegistry() {
  const lines = [
    '# Detroit Dynamo Admin Module Registry',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This registry maps the future dashboard modules to owners, Appwrite collections, public source routes, first admin actions, and blockers. It is the module-by-module build guide for the live admin dashboard.',
    '',
    ...detroitDynamoAdminModuleRegistry.flatMap((item) => [
      `## ${item.module}`,
      '',
      `Status: ${item.status}`,
      '',
      `Protected detail route: /admin/detroit-dynamo/modules/${item.slug}`,
      '',
      `Launch phase: ${item.launchPhase}`,
      '',
      `Owners: ${item.ownerRoles.join(', ')}`,
      '',
      `Collections: ${item.collectionIds.join(', ')}`,
      '',
      `Source routes: ${item.sourceRoutes.join(', ') || 'Internal only'}`,
      '',
      item.purpose,
      '',
      'First actions:',
      ...item.enabledActions.map((action) => `- ${action}`),
      '',
      `Blocked until: ${item.blockedUntil}`,
      '',
    ]),
  ];
  return lines.join('\n');
}

function buildAdminActionGuards() {
  const lines = [
    '# Detroit Dynamo Admin Action Guards',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This file derives the first dashboard action guards from the admin module registry and role-permission matrix. It is not live authorization yet; it is the contract the Appwrite-backed admin screens should enforce.',
    '',
    ...detroitDynamoModuleActionGuards.flatMap((guard) => [
      `## ${guard.module}`,
      '',
      `Owner roles: ${guard.ownerRoles.join(', ')}`,
      '',
      '| Action | Required access | Owner roles allowed | All roles allowed |',
      '| --- | --- | --- | --- |',
      ...guard.actions.map((action) => (
        `| ${action.action} | ${action.requiredAccess} | ${action.permittedOwnerRoles.join(', ') || 'None'} | ${action.permittedRoles.join(', ') || 'None'} |`
      )),
      '',
    ]),
  ];
  return lines.join('\n');
}

function buildLeadRoutingMap() {
  const lines = [
    '# Detroit Dynamo Lead Routing Map',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This map connects public Detroit Dynamo form variants to future Appwrite models, collections, and admin owners. It keeps preview intake aligned with the protected module plans.',
    '',
    '| Lead Type | Owner | Destination Models | Collections | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...Object.entries(detroitDynamoLeadRouting).map(([leadType, routing]) => (
      `| ${leadType} | ${routing.ownerRole} | ${routing.destinationModels.join(', ')} | ${routing.collectionIds.join(', ')} | ${routing.nextAction} |`
    )),
    '',
  ];
  return lines.join('\n');
}

function buildRecordDraftMap() {
  const lines = [
    '# Detroit Dynamo Record Draft Map',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This map shows the local preview-only records the protected admin module pages derive from form submissions. These are read-only planning drafts, not live Appwrite mutations.',
    '',
    '| Lead Type | Owner | Draft Models | Draft Collections | Routing Models |',
    '| --- | --- | --- | --- | --- |',
    ...Object.values(detroitDynamoLeadRecordDraftMap).map((item) => (
      `| ${item.leadType} | ${item.ownerRole} | ${item.models.join(', ')} | ${item.collectionIds.join(', ')} | ${item.routingModels.join(', ') || 'ContactLead base'} |`
    )),
    '',
  ];
  return lines.join('\n');
}

function buildLeadPipelinePolicy() {
  const lines = [
    '# Detroit Dynamo Lead Pipeline Policy',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This policy defines the preview-to-admin follow-up lifecycle for Detroit Dynamo leads. It gives the future Appwrite-backed dashboard status stages, aging targets, owner actions, and lead-type coverage.',
    '',
    '| Status | Label | Max Age | Applies To | Next Statuses | Admin Modules |',
    '| --- | --- | --- | --- | --- | --- |',
    ...detroitDynamoLeadPipelineStages.map((stage) => (
      `| ${stage.status} | ${stage.label} | ${stage.maxAgeHours}h | ${stage.appliesTo.join(', ')} | ${stage.nextStatuses.join(', ')} | ${stage.adminModules.join(', ')} |`
    )),
    '',
    '## Lead Type Pipelines',
    '',
    '| Lead Type | Owner | Default Status | Required Stages | Collections |',
    '| --- | --- | --- | --- | --- |',
    ...Object.values(detroitDynamoLeadPipelineByType).map((item) => (
      `| ${item.leadType} | ${item.ownerRole} | ${item.defaultStatus} | ${item.requiredStages.join(', ')} | ${item.collectionIds.join(', ')} |`
    )),
    '',
  ];
  return lines.join('\n');
}

function buildLeadPipelineOperationsGuide() {
  const sampleLeads = [
    {
      id: 'sample-training',
      lead_type: 'training',
      contact_name: 'Training Lead',
      email: 'training@example.com',
      program_interest: 'Private training',
      created_at: '2026-05-28T12:00:00.000Z',
    },
    {
      id: 'sample-tryout',
      lead_type: 'tryout',
      player_name: 'Tryout Player',
      email: 'tryout@example.com',
      team_interest: 'Youth Club',
      created_at: '2026-05-27T12:00:00.000Z',
    },
    {
      id: 'sample-sponsor',
      lead_type: 'sponsor',
      organization: 'Sponsor Business',
      email: 'sponsor@example.com',
      package_interest: 'Founding Sponsor',
      created_at: '2026-05-26T12:00:00.000Z',
    },
  ];
  const queue = buildDetroitDynamoLeadPipelineQueue(sampleLeads, new Date('2026-05-28T18:00:00.000Z'));
  const lines = [
    '# Detroit Dynamo Lead Pipeline Operations Guide',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This guide describes the local-preview operator queue used by the protected preview admin. It turns browser leads into owner-assigned follow-up cards and lets admins test status transitions in localStorage without writing to Appwrite.',
    '',
    '## Queue Summary Fields',
    '',
    '- Active: leads in a non-closed, non-archived pipeline status.',
    '- Due: active leads inside the final due window for their current stage.',
    '- Late: active leads older than the max-age target for their current stage.',
    '- Owner role: the role expected to make the next follow-up decision.',
    '- Next statuses: the only planned status transitions the future admin action should allow.',
    '- Local transition history: preview status changes append pipeline events to the browser-only lead record.',
    '',
    '## Transition Controls',
    '',
    'The protected admin pages only render buttons for allowed next statuses from the current stage. The future Appwrite-backed dashboard should enforce the same transition contract server-side and write an audit record for each status change.',
    '',
    'Live backend scaffold: `detroitDynamoLeadPipelineAction` is the authenticated Appwrite Function planned for server-side status transitions on `dd_contact_leads`, `dd_bookings`, `dd_tryout_registrations`, and `dd_sponsors`.',
    '',
    '## Sample Queue Output',
    '',
    '| Lead | Type | Owner | Status | Urgency | Due Window | Next Statuses |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...queue.cards.map((card) => (
      `| ${card.title} | ${card.leadType} | ${card.ownerRole} | ${card.status} | ${card.urgency} | ${card.hoursUntilDue}h | ${card.nextStatuses.join(', ')} |`
    )),
    '',
    '## Counts',
    '',
    `Active: ${queue.active}`,
    '',
    `Due soon: ${queue.dueSoon}`,
    '',
    `Overdue: ${queue.overdue}`,
    '',
  ];
  return lines.join('\n');
}

await fs.mkdir(outDir, { recursive: true });

const redirectPlan = buildRedirectPlanJson();
const externalGateContract = buildDetroitDynamoExternalGateContractReport();
const claimSafetyContract = buildDetroitDynamoClaimSafetyContractReport();
const promotionCutoverContract = buildDetroitDynamoPromotionCutoverReport();
const launchEvidenceContract = buildDetroitDynamoLaunchEvidenceReport();
const launchEvidenceActionContract = buildDetroitDynamoLaunchEvidenceActionReport();
const externalConfirmationActionContract = buildDetroitDynamoExternalConfirmationActionReport();
const ownerLaunchReview = buildDetroitDynamoOwnerLaunchReviewReport();
const ownerEvidenceIntake = buildDetroitDynamoOwnerEvidenceIntakeReport();
const productionPreviewEvidence = buildDetroitDynamoProductionPreviewEvidenceReport();
const liveReadinessBoard = buildDetroitDynamoLiveReadinessBoardReport();
const launchArtifactIndex = buildDetroitDynamoLaunchArtifactIndexReport();
const deploymentReadiness = buildDetroitDynamoDeploymentReadinessReport();
const vercelPreviewRunbook = buildDetroitDynamoVercelPreviewRunbookReport();
const secretRedaction = buildDetroitDynamoSecretRedactionReport();
const externalGateClosure = buildDetroitDynamoExternalGateClosureReport();
const ownerHandoffPacket = buildDetroitDynamoOwnerHandoffPacketReport();
const ownerSignoffRegister = buildDetroitDynamoOwnerSignoffRegisterReport();
const finalAcceptanceMatrix = buildDetroitDynamoFinalAcceptanceMatrixReport();
const safeguardingContract = buildDetroitDynamoSafeguardingReport();
const leadIntakeContract = buildDetroitDynamoLeadIntakeContractReport();
const pipelineActionContract = buildDetroitDynamoPipelineActionContractReport();
const adminModuleReadContract = buildDetroitDynamoAdminModuleReadContractReport();
const adminRecordWorkspaceReport = buildDetroitDynamoAdminRecordWorkspaceReport();
const adminRoleGrantContract = buildDetroitDynamoAdminRoleGrantContractReport();
const adminModuleWriteContract = buildDetroitDynamoAdminModuleWriteContractReport();
await fs.writeFile(path.join(outDir, 'detroit-dynamo-sitemap-preview.xml'), buildSitemapXml());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-redirect-plan.json'), JSON.stringify(redirectPlan, null, 2));
await fs.writeFile(path.join(outDir, 'detroit-dynamo-redirect-plan.md'), buildRedirectPlanMarkdown(redirectPlan));
await fs.writeFile(path.join(outDir, 'detroit-dynamo-promotion-checklist.md'), buildPromotionChecklist());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-robots-draft.txt'), buildRobotsDraft());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-backend-activation-runbook.md'), buildBackendActivationRunbook());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-external-confirmation-register.md'), buildExternalConfirmationRegister());
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-payment-waiver-gates.json'),
  JSON.stringify(externalGateContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-payment-waiver-gates.md'),
  buildDetroitDynamoExternalGateHandoffMarkdown(externalGateContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-claim-safety.json'),
  JSON.stringify(claimSafetyContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-claim-safety.md'),
  buildDetroitDynamoClaimSafetyHandoffMarkdown(claimSafetyContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-promotion-cutover.json'),
  JSON.stringify(promotionCutoverContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-promotion-cutover.md'),
  buildDetroitDynamoPromotionCutoverMarkdown(promotionCutoverContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-launch-evidence-checklist.json'),
  JSON.stringify(launchEvidenceContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-launch-evidence-checklist.md'),
  buildDetroitDynamoLaunchEvidenceMarkdown(launchEvidenceContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-launch-evidence-actions.json'),
  JSON.stringify(launchEvidenceActionContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-launch-evidence-actions.md'),
  buildDetroitDynamoLaunchEvidenceActionMarkdown(launchEvidenceActionContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-external-confirmation-actions.json'),
  JSON.stringify(externalConfirmationActionContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-external-confirmation-actions.md'),
  buildDetroitDynamoExternalConfirmationActionMarkdown(externalConfirmationActionContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-launch-review.json'),
  JSON.stringify(ownerLaunchReview, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-launch-review.md'),
  buildDetroitDynamoOwnerLaunchReviewMarkdown(ownerLaunchReview),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-evidence-intake.json'),
  JSON.stringify(ownerEvidenceIntake, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-evidence-intake.md'),
  buildDetroitDynamoOwnerEvidenceIntakeMarkdown(ownerEvidenceIntake),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-evidence-intake.csv'),
  buildDetroitDynamoOwnerEvidenceIntakeCsv(ownerEvidenceIntake),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-production-preview-evidence.json'),
  JSON.stringify(productionPreviewEvidence, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-production-preview-evidence.md'),
  buildDetroitDynamoProductionPreviewEvidenceMarkdown(productionPreviewEvidence),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-live-readiness-board.json'),
  JSON.stringify(liveReadinessBoard, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-live-readiness-board.md'),
  buildDetroitDynamoLiveReadinessBoardMarkdown(liveReadinessBoard),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-live-readiness-board.csv'),
  buildDetroitDynamoLiveReadinessBoardCsv(liveReadinessBoard),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-launch-artifact-index.json'),
  JSON.stringify(launchArtifactIndex, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-launch-artifact-index.md'),
  buildDetroitDynamoLaunchArtifactIndexMarkdown(launchArtifactIndex),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-launch-artifact-index.csv'),
  buildDetroitDynamoLaunchArtifactIndexCsv(launchArtifactIndex),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-deployment-readiness.json'),
  JSON.stringify(deploymentReadiness, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-deployment-readiness.md'),
  buildDetroitDynamoDeploymentReadinessMarkdown(deploymentReadiness),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-deployment-readiness.csv'),
  buildDetroitDynamoDeploymentReadinessCsv(deploymentReadiness),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-vercel-preview-runbook.json'),
  JSON.stringify(vercelPreviewRunbook, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-vercel-preview-runbook.md'),
  buildDetroitDynamoVercelPreviewRunbookMarkdown(vercelPreviewRunbook),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-vercel-preview-runbook.csv'),
  buildDetroitDynamoVercelPreviewRunbookCsv(vercelPreviewRunbook),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-secret-redaction.json'),
  JSON.stringify(secretRedaction, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-secret-redaction.md'),
  buildDetroitDynamoSecretRedactionMarkdown(secretRedaction),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-secret-redaction.csv'),
  buildDetroitDynamoSecretRedactionCsv(secretRedaction),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-external-gate-closure.json'),
  JSON.stringify(externalGateClosure, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-external-gate-closure.md'),
  buildDetroitDynamoExternalGateClosureMarkdown(externalGateClosure),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-external-gate-closure.csv'),
  buildDetroitDynamoExternalGateClosureCsv(externalGateClosure),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-handoff-packet.json'),
  JSON.stringify(ownerHandoffPacket, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-handoff-packet.md'),
  buildDetroitDynamoOwnerHandoffPacketMarkdown(ownerHandoffPacket),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-handoff-packet.csv'),
  buildDetroitDynamoOwnerHandoffPacketCsv(ownerHandoffPacket),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-signoff-register.json'),
  JSON.stringify(ownerSignoffRegister, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-signoff-register.md'),
  buildDetroitDynamoOwnerSignoffRegisterMarkdown(ownerSignoffRegister),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-owner-signoff-register.csv'),
  buildDetroitDynamoOwnerSignoffRegisterCsv(ownerSignoffRegister),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-final-acceptance-matrix.json'),
  JSON.stringify(finalAcceptanceMatrix, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-final-acceptance-matrix.md'),
  buildDetroitDynamoFinalAcceptanceMatrixMarkdown(finalAcceptanceMatrix),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-final-acceptance-matrix.csv'),
  buildDetroitDynamoFinalAcceptanceMatrixCsv(finalAcceptanceMatrix),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-safeguarding-privacy.json'),
  JSON.stringify(safeguardingContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-safeguarding-privacy.md'),
  buildDetroitDynamoSafeguardingMarkdown(safeguardingContract),
);
await fs.writeFile(path.join(outDir, 'detroit-dynamo-role-permission-matrix.md'), buildRolePermissionMatrix());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-admin-module-registry.md'), buildAdminModuleRegistry());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-admin-action-guards.md'), buildAdminActionGuards());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-lead-routing-map.md'), buildLeadRoutingMap());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-record-draft-map.md'), buildRecordDraftMap());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-lead-pipeline-policy.md'), buildLeadPipelinePolicy());
await fs.writeFile(path.join(outDir, 'detroit-dynamo-lead-pipeline-operations.md'), buildLeadPipelineOperationsGuide());
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-lead-intake-fixtures.json'),
  JSON.stringify(leadIntakeContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-lead-intake-handoff.md'),
  buildDetroitDynamoLeadIntakeHandoffMarkdown(leadIntakeContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-pipeline-action-fixtures.json'),
  JSON.stringify(pipelineActionContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-pipeline-action-handoff.md'),
  buildDetroitDynamoPipelineActionHandoffMarkdown(pipelineActionContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-module-read-fixtures.json'),
  JSON.stringify(adminModuleReadContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-module-read-handoff.md'),
  buildDetroitDynamoAdminModuleReadHandoffMarkdown(adminModuleReadContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-record-workspace.json'),
  JSON.stringify(adminRecordWorkspaceReport, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-record-workspace.md'),
  buildDetroitDynamoAdminRecordWorkspaceMarkdown(adminRecordWorkspaceReport),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-role-grant-fixtures.json'),
  JSON.stringify(adminRoleGrantContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-role-grant-handoff.md'),
  buildDetroitDynamoAdminRoleGrantHandoffMarkdown(adminRoleGrantContract),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-module-write-fixtures.json'),
  JSON.stringify(adminModuleWriteContract, null, 2),
);
await fs.writeFile(
  path.join(outDir, 'detroit-dynamo-admin-module-write-handoff.md'),
  buildDetroitDynamoAdminModuleWriteHandoffMarkdown(adminModuleWriteContract),
);

console.log(`Detroit Dynamo launch assets written to ${outDir}`);
console.log(`Sitemap routes: ${detroitDynamoSitemapRoutes.length}`);
console.log(`Redirects: ${detroitDynamoRedirectPlan.length}`);
console.log(`Promotion gates: ${detroitDynamoPromotionGates.length}`);
console.log(`Backend activation steps: ${detroitDynamoBackendActivationSteps.length}`);
console.log(`External confirmation registers: ${detroitDynamoExternalConfirmationRegister.length}`);
console.log(`Payment/package gate tracks: ${externalGateContract.paymentPackageTracks.length}`);
console.log(`Waiver gate tracks: ${externalGateContract.waiverTracks.length}`);
console.log(`Claim-safety tracks: ${claimSafetyContract.claimSafetyTracks.length}`);
console.log(`Promotion cutover tracks: ${promotionCutoverContract.cutoverTracks.length}`);
console.log(`Launch evidence checklist items: ${launchEvidenceContract.checklistItems.length}`);
console.log(`Launch evidence action fixtures: ${launchEvidenceActionContract.actions.length}`);
console.log(`External confirmation action fixtures: ${externalConfirmationActionContract.actions.length}`);
console.log(`Owner launch review sections: ${ownerLaunchReview.sections.length}`);
console.log(`Owner evidence intake rows: ${ownerEvidenceIntake.intakeRows.length}`);
console.log(`Production preview evidence tracks: ${productionPreviewEvidence.tracks.length}`);
console.log(`Live readiness board rows: ${liveReadinessBoard.rows.length}`);
console.log(`Launch artifact index items: ${launchArtifactIndex.items.length}`);
console.log(`Deployment readiness tracks: ${deploymentReadiness.tracks.length}`);
console.log(`Vercel preview runbook steps: ${vercelPreviewRunbook.steps.length}`);
console.log(`Secret redaction rules: ${secretRedaction.rules.length}`);
console.log(`External gate closure rows: ${externalGateClosure.rows.length}`);
console.log(`Owner handoff packet sections: ${ownerHandoffPacket.sections.length}`);
console.log(`Owner signoff rows: ${ownerSignoffRegister.signoffRows.length}`);
console.log(`Final acceptance rows: ${finalAcceptanceMatrix.rows.length}`);
console.log(`Safeguarding tracks: ${safeguardingContract.safeguardingTracks.length}`);
console.log(`Role permission matrices: ${detroitDynamoRolePermissionMatrix.length}`);
console.log(`Role access summaries: ${detroitDynamoRoleAccessSummaries.length}`);
console.log(`Admin module registry entries: ${detroitDynamoAdminModuleRegistry.length}`);
console.log(`Admin module action guards: ${detroitDynamoModuleActionGuards.length}`);
console.log(`Lead routing variants: ${Object.keys(detroitDynamoLeadRouting).length}`);
console.log(`Record draft maps: ${Object.keys(detroitDynamoLeadRecordDraftMap).length}`);
console.log(`Lead pipeline stages: ${detroitDynamoLeadPipelineStages.length}`);
console.log(`Lead pipeline maps: ${Object.keys(detroitDynamoLeadPipelineByType).length}`);
console.log('Lead pipeline operations guide: written');
console.log(`Lead intake success fixtures: ${leadIntakeContract.successFixtures.length}`);
console.log(`Lead intake rejection fixtures: ${leadIntakeContract.rejectionFixtures.length}`);
console.log(`Pipeline action success fixtures: ${pipelineActionContract.successFixtures.length}`);
console.log(`Pipeline action rejection fixtures: ${pipelineActionContract.rejectionFixtures.length}`);
console.log(`Admin module read success fixtures: ${adminModuleReadContract.successFixtures.length}`);
console.log(`Admin module read rejection fixtures: ${adminModuleReadContract.rejectionFixtures.length}`);
console.log(`Admin record workspace fixture records: ${adminRecordWorkspaceReport.flattenedRecords.length}`);
console.log(`Admin role grant success fixtures: ${adminRoleGrantContract.successFixtures.length}`);
console.log(`Admin role grant rejection fixtures: ${adminRoleGrantContract.rejectionFixtures.length}`);
console.log(`Admin module write success fixtures: ${adminModuleWriteContract.successFixtures.length}`);
console.log(`Admin module write rejection fixtures: ${adminModuleWriteContract.rejectionFixtures.length}`);
