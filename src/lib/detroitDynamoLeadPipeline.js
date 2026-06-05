import {
  detroitDynamoAdminModules,
  detroitDynamoLeadPipelineByType,
  detroitDynamoLeadPipelineStages,
  detroitDynamoLeadRouting,
} from './detroitDynamoDataModel.js';

const stageByStatus = Object.fromEntries(
  detroitDynamoLeadPipelineStages.map((stage) => [stage.status, stage]),
);

const activeStatuses = new Set(
  detroitDynamoLeadPipelineStages
    .map((stage) => stage.status)
    .filter((status) => status !== 'archived' && !status.startsWith('closed_')),
);

function cleanText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function parseDate(value) {
  const parsed = new Date(value || 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function hoursBetween(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, (end.getTime() - start.getTime()) / 36e5);
}

function leadTitle(lead) {
  return cleanText(
    lead?.player_name || lead?.contact_name || lead?.organization || lead?.email,
    'Detroit Dynamo lead',
  );
}

export function normalizeDetroitDynamoLeadPipelineStatus(lead) {
  const candidates = [
    lead?.pipeline_status,
    lead?.follow_up_status,
    lead?.workflow_status,
    lead?.admin_status,
    lead?.status,
  ];

  for (const candidate of candidates) {
    const status = cleanText(candidate);
    if (stageByStatus[status]) return status;
  }

  return 'new';
}

export function getDetroitDynamoLeadPipelineStage(status) {
  return stageByStatus[status] || stageByStatus.new;
}

export function getDetroitDynamoLeadPipelineTransitions(status) {
  return getDetroitDynamoLeadPipelineStage(status).nextStatuses || [];
}

export function canDetroitDynamoLeadPipelineTransition(currentStatus, nextStatus) {
  const normalizedNext = cleanText(nextStatus);
  if (!stageByStatus[normalizedNext]) return false;
  return getDetroitDynamoLeadPipelineTransitions(currentStatus).includes(normalizedNext);
}

export function buildDetroitDynamoLeadPipelineCard(lead, now = new Date()) {
  const leadType = cleanText(lead?.lead_type, 'contact');
  const pipeline = detroitDynamoLeadPipelineByType[leadType] || detroitDynamoLeadPipelineByType.contact;
  const routing = detroitDynamoLeadRouting[leadType] || detroitDynamoLeadRouting.contact;
  const status = normalizeDetroitDynamoLeadPipelineStatus(lead);
  const stage = getDetroitDynamoLeadPipelineStage(status);
  const createdAt = parseDate(lead?.created_at);
  const ageHours = Number(hoursBetween(createdAt, now).toFixed(1));
  const hoursUntilDue = Number((stage.maxAgeHours - ageHours).toFixed(1));
  const isActive = activeStatuses.has(stage.status);
  const isOverdue = isActive && hoursUntilDue < 0;
  const isDueSoon = isActive && !isOverdue && hoursUntilDue <= Math.min(24, Math.max(4, stage.maxAgeHours / 4));

  return {
    id: cleanText(lead?.id, `preview:${leadType}:${leadTitle(lead)}`),
    title: leadTitle(lead),
    leadType,
    ownerRole: pipeline?.ownerRole || routing.ownerRole,
    status: stage.status,
    label: stage.label,
    ageHours,
    hoursUntilDue,
    isActive,
    isOverdue,
    isDueSoon,
    urgency: isOverdue ? 'overdue' : isDueSoon ? 'due_soon' : isActive ? 'on_track' : 'closed',
    ownerAction: stage.ownerAction,
    nextStatuses: stage.nextStatuses,
    transitionCount: Array.isArray(lead?.pipeline_events) ? lead.pipeline_events.length : 0,
    lastTransitionAt: cleanText(lead?.pipeline_updated_at),
    lastTransitionBy: cleanText(lead?.pipeline_updated_by),
    lastTransitionNote: cleanText(lead?.pipeline_note),
    adminModules: stage.adminModules,
    collectionIds: pipeline?.collectionIds || routing.collectionIds || [],
    destinationModels: pipeline?.destinationModels || routing.destinationModels || [],
    sourceRoute: cleanText(lead?.source_route, '/detroit-dynamo'),
    email: cleanText(lead?.email),
    phone: cleanText(lead?.phone),
    interest: cleanText(lead?.team_interest || lead?.program_interest || lead?.package_interest || lead?.age_group, 'General inquiry'),
  };
}

function countBy(items, getter) {
  return items.reduce((totals, item) => {
    const key = getter(item);
    totals[key] = (totals[key] || 0) + 1;
    return totals;
  }, {});
}

function urgencyRank(card) {
  if (card.isOverdue) return 0;
  if (card.isDueSoon) return 1;
  if (card.isActive) return 2;
  return 3;
}

export function buildDetroitDynamoLeadPipelineQueue(leads, now = new Date()) {
  const cards = (Array.isArray(leads) ? leads : [])
    .map((lead) => buildDetroitDynamoLeadPipelineCard(lead, now))
    .sort((a, b) => urgencyRank(a) - urgencyRank(b) || b.ageHours - a.ageHours);

  return {
    total: cards.length,
    active: cards.filter((card) => card.isActive).length,
    overdue: cards.filter((card) => card.isOverdue).length,
    dueSoon: cards.filter((card) => card.isDueSoon).length,
    byStatus: countBy(cards, (card) => card.status),
    byOwnerRole: countBy(cards, (card) => card.ownerRole),
    byLeadType: countBy(cards, (card) => card.leadType),
    cards,
  };
}

export function getDetroitDynamoModulePipelineCards(modulePlan, leads, now = new Date()) {
  if (!modulePlan) return [];
  const collectionIds = new Set(modulePlan.collectionIds || []);
  const primaryModels = new Set(modulePlan.primaryModels || []);

  return buildDetroitDynamoLeadPipelineQueue(leads, now).cards.filter((card) => (
    card.adminModules.includes(modulePlan.module)
    || card.collectionIds.some((collectionId) => collectionIds.has(collectionId))
    || card.destinationModels.some((model) => primaryModels.has(model))
  ));
}

export function auditDetroitDynamoLeadPipelineOperations() {
  const issues = [];
  const requiredLeadTypes = ['contact', 'training', 'youth', 'tryout', 'men', 'women', 'sponsor'];
  const validStatuses = new Set(detroitDynamoLeadPipelineStages.map((stage) => stage.status));
  const validModules = new Set(detroitDynamoAdminModules);

  for (const stage of detroitDynamoLeadPipelineStages) {
    for (const status of stage.nextStatuses) {
      if (!validStatuses.has(status)) {
        issues.push(`${stage.status} references unknown next status ${status}`);
      }
    }
    for (const module of stage.adminModules) {
      if (!validModules.has(module)) {
        issues.push(`${stage.status} references unknown admin module ${module}`);
      }
    }
  }

  for (const leadType of requiredLeadTypes) {
    const pipeline = detroitDynamoLeadPipelineByType[leadType];
    if (!pipeline) {
      issues.push(`Missing pipeline map for ${leadType}`);
      continue;
    }

    const sampleCard = buildDetroitDynamoLeadPipelineCard({
      id: `sample-${leadType}`,
      lead_type: leadType,
      email: `${leadType}@example.com`,
      created_at: new Date('2026-05-28T12:00:00.000Z').toISOString(),
    }, new Date('2026-05-28T16:30:00.000Z'));

    if (sampleCard.status !== 'new') {
      issues.push(`Sample ${leadType} pipeline card should start at new`);
    }
    if (!sampleCard.ownerRole || !sampleCard.ownerAction || sampleCard.nextStatuses.length === 0) {
      issues.push(`Sample ${leadType} pipeline card is missing operator fields`);
    }
    if (!Array.isArray(sampleCard.collectionIds) || sampleCard.collectionIds.length === 0) {
      issues.push(`Sample ${leadType} pipeline card is missing collection targets`);
    }
    if (!canDetroitDynamoLeadPipelineTransition(sampleCard.status, 'triaged')) {
      issues.push(`Sample ${leadType} pipeline card should transition from new to triaged`);
    }
  }

  const queue = buildDetroitDynamoLeadPipelineQueue([
    {
      id: 'sample-overdue',
      lead_type: 'training',
      contact_name: 'Overdue Training Lead',
      email: 'training@example.com',
      created_at: new Date('2026-05-26T12:00:00.000Z').toISOString(),
    },
  ], new Date('2026-05-28T16:30:00.000Z'));

  if (queue.total !== 1 || queue.active !== 1 || queue.overdue !== 1 || queue.cards[0].urgency !== 'overdue') {
    issues.push('Pipeline queue should classify stale active leads as overdue');
  }

  return issues;
}
