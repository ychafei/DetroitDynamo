import {
  detroitDynamoCollectionPlan,
  detroitDynamoLeadRouting,
} from './detroitDynamoDataModel.js';

export const detroitDynamoLeadIntakeVariants = [
  'contact',
  'training',
  'youth',
  'tryout',
  'men',
  'women',
  'sponsor',
];

const tryoutLeadTypes = new Set(['youth', 'tryout', 'men', 'women']);

const functionCreatedModelsByLeadType = {
  contact: ['ContactLead'],
  training: ['ContactLead', 'Booking'],
  youth: ['ContactLead', 'Player', 'ParentGuardian', 'TryoutRegistration'],
  tryout: ['ContactLead', 'Player', 'ParentGuardian', 'TryoutRegistration'],
  men: ['ContactLead', 'Player', 'TryoutRegistration'],
  women: ['ContactLead', 'Player', 'TryoutRegistration'],
  sponsor: ['ContactLead', 'Sponsor'],
};

const createdKeysByModel = {
  ContactLead: 'contact_lead_id',
  Booking: 'booking_id',
  Player: 'player_id',
  ParentGuardian: 'parent_guardian_id',
  TryoutRegistration: 'tryout_registration_id',
  Sponsor: 'sponsor_id',
};

const successSpecs = [
  {
    id: 'contact-general-inquiry',
    label: 'General contact inquiry',
    leadType: 'contact',
    sourceRoute: '/detroit-dynamo/contact',
    payload: {
      contact_name: 'Jordan Parent',
      email: 'parent@example.com',
      phone: '3135550100',
      notes: 'Looking for the best pathway for a serious U12 player.',
    },
  },
  {
    id: 'training-private-session',
    label: 'Training academy inquiry',
    leadType: 'training',
    sourceRoute: '/detroit-dynamo/training',
    payload: {
      contact_name: 'Avery Training Parent',
      player_name: 'Noah Training',
      email: 'training@example.com',
      phone: '3135550101',
      program_interest: 'Private training',
      age_group: 'U13-U19 Competitive Pathway',
      notes: 'Needs speed of play and finishing work before tryouts.',
    },
  },
  {
    id: 'youth-club-interest',
    label: 'Youth club pathway interest',
    leadType: 'youth',
    sourceRoute: '/detroit-dynamo/youth-club',
    payload: {
      player_name: 'Maya Youth',
      parent_guardian_name: 'Taylor Youth Parent',
      email: 'youth@example.com',
      phone: '3135550102',
      date_of_birth: '2014-08-14',
      team_interest: 'Youth Club',
      position: 'Midfielder',
      current_club: 'Detroit Area Club',
      experience_level: 'Club',
      notes: 'Family wants a future competitive pathway.',
    },
  },
  {
    id: 'tryout-registration',
    label: 'Open tryout registration',
    leadType: 'tryout',
    sourceRoute: '/detroit-dynamo/tryouts',
    payload: {
      player_name: 'Sam Tryout',
      parent_guardian_name: 'Morgan Tryout Parent',
      email: 'tryout@example.com',
      phone: '3135550103',
      date_of_birth: '2010-04-12',
      team_interest: 'Youth Club',
      position: 'Defender',
      current_club: 'Independent',
      experience_level: 'High school',
      notes: 'Interested in upcoming evaluations.',
    },
  },
  {
    id: 'senior-men-interest',
    label: 'Senior men player interest',
    leadType: 'men',
    sourceRoute: '/detroit-dynamo/senior-men',
    payload: {
      player_name: 'Andre Senior',
      email: 'men@example.com',
      phone: '3135550104',
      date_of_birth: '2002-03-03',
      team_interest: "Senior Men's Team",
      position: 'Forward',
      current_club: 'College Club',
      experience_level: 'College',
      notes: 'Looking for the senior men pro-development pathway.',
    },
  },
  {
    id: 'senior-women-interest',
    label: 'Senior women player interest',
    leadType: 'women',
    sourceRoute: '/detroit-dynamo/senior-women',
    payload: {
      player_name: 'Riley Senior',
      email: 'women@example.com',
      phone: '3135550105',
      date_of_birth: '2001-11-20',
      team_interest: "Senior Women's Team",
      position: 'Goalkeeper',
      current_club: 'College Club',
      experience_level: 'College',
      notes: 'Interested in future women senior-team evaluations.',
    },
  },
  {
    id: 'sponsor-inquiry',
    label: 'Sponsor partnership inquiry',
    leadType: 'sponsor',
    sourceRoute: '/detroit-dynamo/sponsors',
    payload: {
      contact_name: 'Casey Business',
      organization: 'Detroit Performance Co.',
      email: 'sponsor@example.com',
      phone: '3135550106',
      package_interest: 'Founding Sponsor',
      notes: 'Interested in training and matchday sponsorship inventory.',
    },
  },
];

const rejectionSpecs = [
  {
    id: 'reject-non-dynamo-source',
    label: 'Reject non-Dynamo route',
    leadType: 'contact',
    expectedStatus: 400,
    expectedError: 'source_route must be a Detroit Dynamo route',
    reason: 'Public intake should not accept current Detroit Dynamo or arbitrary site routes.',
    payload: {
      lead_type: 'contact',
      source_route: '/book',
      contact_name: 'Wrong Route',
      email: 'wrong-route@example.com',
      notes: 'Should be rejected because the source is outside the preview.',
    },
  },
  {
    id: 'reject-invalid-lead-type',
    label: 'Reject invalid lead type',
    leadType: 'invalid',
    expectedStatus: 400,
    expectedError: 'lead_type is invalid',
    reason: 'Only the seven approved Detroit Dynamo form variants should be accepted.',
    payload: {
      lead_type: 'newsletter',
      source_route: '/detroit-dynamo/contact',
      contact_name: 'Unsupported Lead',
      email: 'unsupported@example.com',
    },
  },
  {
    id: 'reject-incomplete-tryout',
    label: 'Reject incomplete tryout profile',
    leadType: 'tryout',
    expectedStatus: 400,
    expectedError: 'phone is required',
    reason: 'Tryout and team-interest leads need player identity, birth date, position, experience, and contact phone.',
    payload: {
      lead_type: 'tryout',
      source_route: '/detroit-dynamo/tryouts',
      player_name: 'Incomplete Player',
      email: 'incomplete-tryout@example.com',
      date_of_birth: '2011-02-20',
      position: 'Midfielder',
      experience_level: 'Club',
    },
  },
  {
    id: 'reject-incomplete-sponsor',
    label: 'Reject incomplete sponsor inquiry',
    leadType: 'sponsor',
    expectedStatus: 400,
    expectedError: 'package_interest is required',
    reason: 'Sponsor leads need business identity and package interest before partnership follow-up.',
    payload: {
      lead_type: 'sponsor',
      source_route: '/detroit-dynamo/sponsors',
      organization: 'No Package LLC',
      email: 'sponsor-missing-package@example.com',
    },
  },
];

function collectionIdsForModels(models) {
  return models
    .map((model) => detroitDynamoCollectionPlan.find((item) => item.model === model)?.collectionId || '')
    .filter(Boolean);
}

function buildSuccessFixture(spec) {
  const routing = detroitDynamoLeadRouting[spec.leadType];
  const functionCreatedModels = functionCreatedModelsByLeadType[spec.leadType] || ['ContactLead'];
  const functionCreatedKeys = Object.fromEntries(
    functionCreatedModels.map((model) => [model, createdKeysByModel[model]]),
  );

  return {
    id: spec.id,
    label: spec.label,
    leadType: spec.leadType,
    sourceRoute: spec.sourceRoute,
    ownerRole: routing?.ownerRole || 'Media/Admin Staff',
    requestBody: {
      lead_type: spec.leadType,
      source_route: spec.sourceRoute,
      ...spec.payload,
    },
    routingDestinationModels: routing?.destinationModels || [],
    routingCollectionIds: routing?.collectionIds || [],
    functionCreatedModels,
    functionCreatedCollectionIds: collectionIdsForModels(functionCreatedModels),
    expectedCreatedKeys: functionCreatedKeys,
    expectedPipelineFields: ['pipeline_status', 'pipeline_owner_role', 'pipeline_due_at', 'pipeline_updated_at', 'pipeline_last_note', 'pipeline_event_count'],
    expectedResponse: {
      httpStatus: 200,
      success: true,
      lead_type: spec.leadType,
      created: functionCreatedKeys,
    },
  };
}

function buildRejectionFixture(spec) {
  return {
    id: spec.id,
    label: spec.label,
    leadType: spec.leadType,
    requestBody: spec.payload,
    expectedResponse: {
      httpStatus: spec.expectedStatus,
      error: spec.expectedError,
    },
    reason: spec.reason,
  };
}

export function buildDetroitDynamoLeadIntakeFixtures() {
  return successSpecs.map(buildSuccessFixture);
}

export function buildDetroitDynamoLeadIntakeRejectionFixtures() {
  return rejectionSpecs.map(buildRejectionFixture);
}

export function buildDetroitDynamoLeadIntakeContractReport() {
  const successFixtures = buildDetroitDynamoLeadIntakeFixtures();
  const rejectionFixtures = buildDetroitDynamoLeadIntakeRejectionFixtures();
  const issues = auditDetroitDynamoLeadIntakeContract();

  return {
    generatedAt: new Date().toISOString(),
    functionId: 'detroitDynamoLeadIntake',
    functionExecutePermission: 'any',
    variants: detroitDynamoLeadIntakeVariants,
    successFixtures,
    rejectionFixtures,
    issues,
  };
}

export function buildDetroitDynamoLeadIntakeHandoffMarkdown(report = buildDetroitDynamoLeadIntakeContractReport()) {
  const lines = [
    '# Detroit Dynamo Lead Intake Handoff',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '`detroitDynamoLeadIntake` is the public Appwrite Function planned for Detroit Dynamo form submissions. These fixtures document the accepted public payloads, expected created records, and rejection cases before live credentials are used.',
    '',
    '## Success Fixtures',
    '',
    '| Fixture | Lead Type | Source Route | Created Records | Routing Collections |',
    '| --- | --- | --- | --- | --- |',
    ...report.successFixtures.map((fixture) => (
      `| ${fixture.label} | ${fixture.leadType} | ${fixture.sourceRoute} | ${fixture.functionCreatedModels.join(', ')} | ${fixture.routingCollectionIds.join(', ')} |`
    )),
    '',
    '## Rejection Fixtures',
    '',
    '| Fixture | Expected Status | Error | Reason |',
    '| --- | --- | --- | --- |',
    ...report.rejectionFixtures.map((fixture) => (
      `| ${fixture.label} | ${fixture.expectedResponse.httpStatus} | ${fixture.expectedResponse.error} | ${fixture.reason} |`
    )),
    '',
    '## Sample Public Payload',
    '',
    '```json',
    JSON.stringify(report.successFixtures[0]?.requestBody || {}, null, 2),
    '```',
    '',
    '## Deployment Check',
    '',
    'Run `npm run verify:dynamo-intake-contract` before deploying the public intake function and again after field changes. This check does not make network calls.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoLeadIntakeContract() {
  const issues = [];
  const successFixtures = buildDetroitDynamoLeadIntakeFixtures();
  const rejectionFixtures = buildDetroitDynamoLeadIntakeRejectionFixtures();
  const fixtureTypes = new Set(successFixtures.map((fixture) => fixture.leadType));

  for (const variant of detroitDynamoLeadIntakeVariants) {
    if (!fixtureTypes.has(variant)) {
      issues.push(`Missing lead intake success fixture for ${variant}`);
    }
    if (!detroitDynamoLeadRouting[variant]) {
      issues.push(`Missing lead routing for ${variant}`);
    }
  }

  for (const fixture of successFixtures) {
    const body = fixture.requestBody;
    if (!detroitDynamoLeadIntakeVariants.includes(fixture.leadType)) {
      issues.push(`${fixture.id} uses unsupported lead type ${fixture.leadType}`);
    }
    if (body.lead_type !== fixture.leadType) {
      issues.push(`${fixture.id} request lead_type does not match fixture type`);
    }
    if (!String(body.source_route || '').startsWith('/detroit-dynamo')) {
      issues.push(`${fixture.id} source route must stay inside /detroit-dynamo`);
    }
    if (!String(body.email || '').includes('@')) {
      issues.push(`${fixture.id} is missing an email`);
    }
    if (!fixture.functionCreatedModels.includes('ContactLead')) {
      issues.push(`${fixture.id} must create a ContactLead`);
    }
    if (!fixture.expectedPipelineFields.includes('pipeline_status') || !fixture.expectedPipelineFields.includes('pipeline_due_at')) {
      issues.push(`${fixture.id} is missing expected pipeline field coverage`);
    }
    if (fixture.leadType === 'training' && !fixture.functionCreatedModels.includes('Booking')) {
      issues.push('Training intake fixture must create a Booking lead');
    }
    if (tryoutLeadTypes.has(fixture.leadType)) {
      for (const key of ['player_name', 'date_of_birth', 'position', 'experience_level', 'phone']) {
        if (!body[key]) issues.push(`${fixture.id} tryout/team payload is missing ${key}`);
      }
      if (!fixture.functionCreatedModels.includes('Player') || !fixture.functionCreatedModels.includes('TryoutRegistration')) {
        issues.push(`${fixture.id} tryout/team intake must create Player and TryoutRegistration records`);
      }
    }
    if (fixture.leadType === 'sponsor' && (!body.organization || !body.package_interest || !fixture.functionCreatedModels.includes('Sponsor'))) {
      issues.push('Sponsor intake fixture must include organization, package interest, and Sponsor record creation');
    }
  }

  const rejectionErrors = new Set(rejectionFixtures.map((fixture) => fixture.expectedResponse.error));
  for (const expectedError of ['source_route must be a Detroit Dynamo route', 'lead_type is invalid', 'phone is required', 'package_interest is required']) {
    if (!rejectionErrors.has(expectedError)) {
      issues.push(`Missing lead intake rejection fixture for ${expectedError}`);
    }
  }

  return issues;
}
