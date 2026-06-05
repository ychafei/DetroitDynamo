import {
  detroitDynamoCollectionPlan,
  detroitDynamoDataModels,
  detroitDynamoLeadRouting,
} from './detroitDynamoDataModel.js';
import {
  getDetroitDynamoLeadPipelineStage,
  normalizeDetroitDynamoLeadPipelineStatus,
} from './detroitDynamoLeadPipeline.js';

const collectionIdByModel = Object.fromEntries(
  detroitDynamoCollectionPlan.map((item) => [item.model, item.collectionId]),
);

const tryoutLeadTypes = new Set(['youth', 'tryout', 'men', 'women']);

const draftModelsByLeadType = {
  contact: ['ContactLead'],
  training: ['ContactLead', 'Booking'],
  youth: ['ContactLead', 'Player', 'ParentGuardian', 'TryoutRegistration', 'Team'],
  tryout: ['ContactLead', 'Player', 'ParentGuardian', 'TryoutRegistration'],
  men: ['ContactLead', 'Player', 'TryoutRegistration', 'Team'],
  women: ['ContactLead', 'Player', 'TryoutRegistration', 'Team'],
  sponsor: ['ContactLead', 'Sponsor'],
};

function cleanText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function compactDocument(document) {
  return Object.fromEntries(
    Object.entries(document).filter(([_key, value]) => hasValue(value)),
  );
}

function labelize(key) {
  return String(key)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  return cleanText(value);
}

function splitName(value, fallbackFirst, fallbackLast) {
  const parts = cleanText(value).split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return {
      first_name: fallbackFirst,
      last_name: fallbackLast,
    };
  }

  if (parts.length === 1) {
    return {
      first_name: parts[0],
      last_name: fallbackLast,
    };
  }

  return {
    first_name: parts.slice(0, -1).join(' '),
    last_name: parts.at(-1),
  };
}

function sourceLeadId(lead) {
  return cleanText(lead?.appwrite_created?.contact_lead_id || lead?.id, 'local-preview-lead');
}

function sourceRoute(lead) {
  return cleanText(lead?.source_route, '/detroit-dynamo');
}

function contactName(lead) {
  return cleanText(
    lead?.contact_name || lead?.parent_guardian_name || lead?.player_name || lead?.organization,
    'Detroit Dynamo lead',
  );
}

function addHours(value, hours) {
  const parsed = new Date(value || 0);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Date(parsed.getTime() + hours * 36e5).toISOString();
}

function leadPipelineDraftFields(lead) {
  const leadType = cleanText(lead?.lead_type, 'contact');
  const status = normalizeDetroitDynamoLeadPipelineStatus(lead);
  const stage = getDetroitDynamoLeadPipelineStage(status);
  const routing = detroitDynamoLeadRouting[leadType] || detroitDynamoLeadRouting.contact;
  const createdAt = cleanText(lead?.created_at);
  const updatedAt = cleanText(lead?.pipeline_updated_at || lead?.updated_at || createdAt);

  return {
    pipeline_status: status,
    pipeline_owner_role: cleanText(lead?.pipeline_owner_role, routing.ownerRole),
    pipeline_due_at: cleanText(lead?.pipeline_due_at, addHours(createdAt, stage.maxAgeHours)),
    pipeline_updated_at: updatedAt,
    pipeline_last_note: cleanText(lead?.pipeline_note, stage.ownerAction),
    pipeline_event_count: Array.isArray(lead?.pipeline_events) ? lead.pipeline_events.length : 0,
  };
}

function buildLeadMessage(lead) {
  return [
    lead?.program_interest ? `Program interest: ${lead.program_interest}` : '',
    lead?.team_interest ? `Team interest: ${lead.team_interest}` : '',
    lead?.age_group ? `Age group: ${lead.age_group}` : '',
    lead?.position ? `Position: ${lead.position}` : '',
    lead?.experience_level ? `Experience level: ${lead.experience_level}` : '',
    lead?.current_club ? `Current/previous club: ${lead.current_club}` : '',
    lead?.package_interest ? `Package interest: ${lead.package_interest}` : '',
    lead?.notes || '',
  ].map((item) => cleanText(item)).filter(Boolean).join('\n');
}

function buildBookingFocus(lead) {
  return [
    lead?.program_interest ? `Program interest: ${lead.program_interest}` : '',
    lead?.player_name ? `Player name: ${lead.player_name}` : '',
    lead?.age_group ? `Age group: ${lead.age_group}` : '',
    lead?.notes ? `Requested focus: ${lead.notes}` : '',
  ].map((item) => cleanText(item)).filter(Boolean).join('\n');
}

function defaultTeamInterest(lead) {
  const explicit = cleanText(lead?.team_interest);
  if (explicit) return explicit;
  if (lead?.lead_type === 'men') return "Senior Men's Team";
  if (lead?.lead_type === 'women') return "Senior Women's Team";
  if (lead?.lead_type === 'youth') return 'Youth Club';
  return 'Training Evaluation';
}

function genderFromLead(lead) {
  const explicit = cleanText(lead?.gender);
  if (explicit) return explicit;
  const teamInterest = defaultTeamInterest(lead).toLowerCase();
  if (lead?.lead_type === 'women' || teamInterest.includes('women')) return 'Female';
  if (lead?.lead_type === 'men' || teamInterest.includes("men")) return 'Male';
  if (lead?.lead_type === 'youth') return 'Coed / Open';
  return '';
}

function teamDraftValues(lead) {
  if (lead?.lead_type === 'men') {
    return {
      name: "Detroit Dynamo Senior Men's Team Interest",
      program_pillar: 'Senior Men',
      gender: 'Male',
      age_group: 'Senior / adult',
      season: 'Launch planning',
      league_status: 'future_pathway',
      player_ids: [`pending:${sourceLeadId(lead)}`],
      tryout_status: 'interest_open',
    };
  }

  if (lead?.lead_type === 'women') {
    return {
      name: "Detroit Dynamo Senior Women's Team Interest",
      program_pillar: 'Senior Women',
      gender: 'Female',
      age_group: 'Senior / adult',
      season: 'Launch planning',
      league_status: 'future_pathway',
      player_ids: [`pending:${sourceLeadId(lead)}`],
      tryout_status: 'interest_open',
    };
  }

  return {
    name: cleanText(lead?.age_group, 'Detroit Dynamo Youth Club Interest Cohort'),
    program_pillar: 'Youth Club',
    gender: 'Coed / Open',
    age_group: cleanText(lead?.age_group),
    season: 'Launch planning',
    league_status: 'future_pathway',
    player_ids: [`pending:${sourceLeadId(lead)}`],
    tryout_status: 'interest_open',
  };
}

function buildDraft(lead, model, title, values) {
  const document = compactDocument({
    ...values,
    created_at: lead?.created_at,
    updated_at: lead?.updated_at || lead?.created_at,
  });
  const modelFields = new Set(detroitDynamoDataModels[model] || []);
  const fields = Object.entries(document)
    .filter(([key]) => key !== 'id')
    .map(([key, value]) => ({
      key,
      label: labelize(key),
      value: displayValue(value),
      plannedModelField: modelFields.has(key),
    }));

  return {
    id: `draft:${model}:${sourceLeadId(lead)}`,
    model,
    collectionId: collectionIdByModel[model] || '',
    title,
    status: 'local_preview_draft',
    leadType: cleanText(lead?.lead_type, 'contact'),
    sourceLeadId: sourceLeadId(lead),
    sourceRoute: sourceRoute(lead),
    document,
    fields,
    backendGate: 'Preview only. No Appwrite mutation occurs until intake and protected admin workflows are enabled.',
  };
}

function buildContactLeadDraft(lead) {
  return buildDraft(
    lead,
    'ContactLead',
    contactName(lead),
    {
      lead_type: cleanText(lead?.lead_type, 'contact'),
      contact_name: contactName(lead),
      email: cleanText(lead?.email),
      phone: cleanText(lead?.phone),
      player_name: cleanText(lead?.player_name),
      organization: cleanText(lead?.organization),
      message: buildLeadMessage(lead),
      source_route: sourceRoute(lead),
      status: 'new',
      ...leadPipelineDraftFields(lead),
    },
  );
}

function buildBookingDraft(lead) {
  return buildDraft(
    lead,
    'Booking',
    cleanText(lead?.program_interest, 'Training inquiry booking lead'),
    {
      status: 'lead',
      requested_focus: buildBookingFocus(lead),
      source_lead_id: sourceLeadId(lead),
      ...leadPipelineDraftFields(lead),
    },
  );
}

function buildPlayerDraft(lead) {
  const playerName = splitName(lead?.player_name, 'Player', 'Lead');
  return buildDraft(
    lead,
    'Player',
    cleanText(lead?.player_name, `${playerName.first_name} ${playerName.last_name}`),
    {
      ...playerName,
      date_of_birth: cleanText(lead?.date_of_birth),
      gender: genderFromLead(lead),
      primary_position: cleanText(lead?.position),
      current_club: cleanText(lead?.current_club || lead?.current_previous_club),
      experience_level: cleanText(lead?.experience_level),
      team_ids: [],
      guardian_ids: lead?.parent_guardian_name ? [`pending-guardian:${sourceLeadId(lead)}`] : [],
      waiver_status: 'not_started',
      status: 'lead',
      source_lead_id: sourceLeadId(lead),
    },
  );
}

function buildParentGuardianDraft(lead) {
  if (!cleanText(lead?.parent_guardian_name)) return null;
  const guardianName = splitName(lead.parent_guardian_name, 'Parent', 'Guardian');
  return buildDraft(
    lead,
    'ParentGuardian',
    cleanText(lead.parent_guardian_name),
    {
      ...guardianName,
      email: cleanText(lead?.email),
      phone: cleanText(lead?.phone),
      relationship: 'Parent',
      player_ids: [`pending-player:${sourceLeadId(lead)}`],
      communication_preferences: ['email'],
      status: 'active',
    },
  );
}

function buildTryoutRegistrationDraft(lead) {
  return buildDraft(
    lead,
    'TryoutRegistration',
    cleanText(lead?.player_name, 'Tryout registration lead'),
    {
      player_name: cleanText(lead?.player_name),
      parent_guardian_name: cleanText(lead?.parent_guardian_name),
      date_of_birth: cleanText(lead?.date_of_birth),
      team_interest: defaultTeamInterest(lead),
      gender: genderFromLead(lead),
      position: cleanText(lead?.position),
      current_previous_club: cleanText(lead?.current_club || lead?.current_previous_club),
      experience_level: cleanText(lead?.experience_level),
      email: cleanText(lead?.email),
      phone: cleanText(lead?.phone),
      notes: buildLeadMessage(lead),
      status: 'new',
      source_lead_id: sourceLeadId(lead),
      ...leadPipelineDraftFields(lead),
    },
  );
}

function buildTeamDraft(lead) {
  return buildDraft(
    lead,
    'Team',
    teamDraftValues(lead).name,
    teamDraftValues(lead),
  );
}

function buildSponsorDraft(lead) {
  return buildDraft(
    lead,
    'Sponsor',
    cleanText(lead?.organization, 'Sponsor inquiry'),
    {
      business_name: cleanText(lead?.organization),
      contact_name: contactName(lead),
      email: cleanText(lead?.email),
      phone: cleanText(lead?.phone),
      package_interest: cleanText(lead?.package_interest),
      website_url: cleanText(lead?.website_url),
      status: 'lead',
      source_lead_id: sourceLeadId(lead),
      ...leadPipelineDraftFields(lead),
    },
  );
}

const draftBuilderByModel = {
  ContactLead: buildContactLeadDraft,
  Booking: buildBookingDraft,
  Player: buildPlayerDraft,
  ParentGuardian: buildParentGuardianDraft,
  TryoutRegistration: buildTryoutRegistrationDraft,
  Team: buildTeamDraft,
  Sponsor: buildSponsorDraft,
};

export const detroitDynamoLeadRecordDraftMap = Object.fromEntries(
  Object.entries(draftModelsByLeadType).map(([leadType, models]) => [leadType, {
    leadType,
    models,
    collectionIds: models.map((model) => collectionIdByModel[model]).filter(Boolean),
    routingModels: detroitDynamoLeadRouting[leadType]?.destinationModels || [],
    ownerRole: detroitDynamoLeadRouting[leadType]?.ownerRole || 'Media/Admin Staff',
  }]),
);

export function buildDetroitDynamoLeadRecordDrafts(lead) {
  const leadType = cleanText(lead?.lead_type, 'contact');
  const models = draftModelsByLeadType[leadType] || draftModelsByLeadType.contact;
  const drafts = models
    .filter((model) => model !== 'ParentGuardian' || cleanText(lead?.parent_guardian_name))
    .filter((model) => model !== 'Team' || tryoutLeadTypes.has(leadType))
    .map((model) => draftBuilderByModel[model]?.(lead))
    .filter(Boolean);

  return drafts;
}

export function getDetroitDynamoModuleDraftsForLeads(modulePlan, leads) {
  if (!modulePlan || !Array.isArray(leads)) return [];
  const moduleCollections = new Set(modulePlan.collectionIds || []);
  const moduleModels = new Set(modulePlan.primaryModels || []);

  return leads.flatMap((lead) => (
    buildDetroitDynamoLeadRecordDrafts(lead).filter((draft) => (
      moduleCollections.has(draft.collectionId) || moduleModels.has(draft.model)
    ))
  ));
}

export function auditDetroitDynamoRecordDrafts() {
  const issues = [];
  const requiredLeadTypes = ['contact', 'training', 'youth', 'tryout', 'men', 'women', 'sponsor'];
  const requiredDraftModels = ['ContactLead', 'Booking', 'Player', 'ParentGuardian', 'TryoutRegistration', 'Sponsor', 'Team'];
  const coveredModels = new Set();

  for (const leadType of requiredLeadTypes) {
    const mapEntry = detroitDynamoLeadRecordDraftMap[leadType];
    if (!mapEntry) {
      issues.push(`Missing record draft map for ${leadType}`);
      continue;
    }

    if (!Array.isArray(mapEntry.models) || mapEntry.models.length === 0) {
      issues.push(`Record draft map for ${leadType} has no models`);
    }

    for (const model of mapEntry.models) {
      coveredModels.add(model);
      if (!Object.hasOwn(detroitDynamoDataModels, model)) {
        issues.push(`Record draft map references unknown model ${model}`);
      }
      if (!collectionIdByModel[model]) {
        issues.push(`Record draft map model ${model} has no collection ID`);
      }
    }

    for (const routingModel of detroitDynamoLeadRouting[leadType]?.destinationModels || []) {
      if (!mapEntry.models.includes(routingModel)) {
        issues.push(`Record draft map for ${leadType} does not cover routing model ${routingModel}`);
      }
    }
  }

  for (const model of requiredDraftModels) {
    if (!coveredModels.has(model)) {
      issues.push(`Record draft map never creates ${model}`);
    }
  }

  return issues;
}
