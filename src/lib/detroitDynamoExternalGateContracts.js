import {
  detroitDynamoCollectionPlan,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoLaunchReadiness,
  detroitDynamoPromotionGates,
} from './detroitDynamoDataModel.js';

function collectionIdsForModels(models) {
  return models
    .map((model) => detroitDynamoCollectionPlan.find((item) => item.model === model)?.collectionId || '')
    .filter(Boolean);
}

export const detroitDynamoPaymentPackageReadinessTracks = [
  {
    id: 'private-training-package',
    label: 'Private training package',
    publicRoutes: ['/detroit-dynamo/training', '/detroit-dynamo/book'],
    relatedModels: ['TrainingPackage', 'Booking', 'Payment'],
    packageType: 'training',
    publishMode: 'placeholder_only',
    providerStatus: 'not_connected',
    approvalRequired: ['Exact price', 'Session count', 'Duration', 'Refund/cancellation rule', 'Provider product id'],
    blockedAction: 'Do not show checkout or collect payment until the owner approves the package matrix and provider mapping.',
  },
  {
    id: 'small-group-training-package',
    label: 'Small-group training package',
    publicRoutes: ['/detroit-dynamo/training', '/detroit-dynamo/book'],
    relatedModels: ['TrainingPackage', 'Booking', 'Payment'],
    packageType: 'training',
    publishMode: 'placeholder_only',
    providerStatus: 'not_connected',
    approvalRequired: ['Exact price', 'Group size rules', 'Session count', 'Makeup policy', 'Provider product id'],
    blockedAction: 'Do not publish exact small-group pricing until group size and refund rules are approved.',
  },
  {
    id: 'team-training-quote',
    label: 'Team training quote',
    publicRoutes: ['/detroit-dynamo/training', '/detroit-dynamo/contact'],
    relatedModels: ['TrainingPackage', 'Booking', 'Payment'],
    packageType: 'quote',
    publishMode: 'interest_only',
    providerStatus: 'not_connected',
    approvalRequired: ['Quote rules', 'Facility costs', 'Coach assignment policy', 'Invoice/checkout choice'],
    blockedAction: 'Use inquiry language only until team-training quote rules and payment handling are approved.',
  },
  {
    id: 'camp-clinic-registration',
    label: 'Camp and clinic registration',
    publicRoutes: ['/detroit-dynamo/camps-clinics'],
    relatedModels: ['CampClinic', 'TrainingPackage', 'Payment', 'Waiver'],
    packageType: 'event',
    publishMode: 'coming_soon_interest',
    providerStatus: 'not_connected',
    approvalRequired: ['Dates', 'Facility', 'Capacity', 'Price', 'Waiver requirement', 'Refund/cancellation rule'],
    blockedAction: 'Do not open registration or payment until dates, capacity, waiver rules, and package price are confirmed.',
  },
  {
    id: 'youth-club-dues',
    label: 'Youth club dues',
    publicRoutes: ['/detroit-dynamo/youth-club', '/detroit-dynamo/tryouts'],
    relatedModels: ['Team', 'Player', 'ParentGuardian', 'Payment', 'Waiver'],
    packageType: 'club_dues',
    publishMode: 'pathway_goal_only',
    providerStatus: 'not_connected',
    approvalRequired: ['Age-group costs', 'Uniform policy', 'League fees', 'Payment schedule', 'Refund policy'],
    blockedAction: 'Do not publish dues or collect deposits until age-group teams, costs, and waiver requirements are approved.',
  },
  {
    id: 'sponsor-package',
    label: 'Sponsor package',
    publicRoutes: ['/detroit-dynamo/sponsors'],
    relatedModels: ['Sponsor', 'Payment'],
    packageType: 'sponsorship',
    publishMode: 'inquiry_only',
    providerStatus: 'not_connected',
    approvalRequired: ['Package tiers', 'Logo permissions', 'Activation inventory', 'Invoice/checkout workflow'],
    blockedAction: 'Keep sponsor CTAs as inquiry-only until package tiers, logo rules, and payment workflow are approved.',
  },
];

export const detroitDynamoWaiverReadinessTracks = [
  {
    id: 'youth-participation',
    label: 'Youth participation waiver',
    publicRoutes: ['/detroit-dynamo/youth-club', '/detroit-dynamo/tryouts'],
    relatedModels: ['Waiver', 'Player', 'ParentGuardian', 'TryoutRegistration', 'Team'],
    appliesTo: ['Youth Club', 'Youth tryouts', 'Future youth teams'],
    approvalStatus: 'legal_review_required',
    signatureMode: 'not_enabled',
    requiredApprovals: ['Guardian signature language', 'Participation risks', 'Emergency contact handling', 'Expiration rule'],
    blockedAction: 'Do not collect youth participation signatures until the approved waiver version exists.',
  },
  {
    id: 'medical-consent',
    label: 'Medical consent and emergency contact',
    publicRoutes: ['/detroit-dynamo/tryouts', '/detroit-dynamo/camps-clinics'],
    relatedModels: ['Waiver', 'Player', 'ParentGuardian', 'CampClinic'],
    appliesTo: ['Tryouts', 'Camps', 'Clinics', 'Youth teams'],
    approvalStatus: 'legal_review_required',
    signatureMode: 'not_enabled',
    requiredApprovals: ['Emergency contact fields', 'Medical disclosure rules', 'Data retention policy', 'Staff access policy'],
    blockedAction: 'Do not require medical consent in public forms until reviewed text and data handling rules are approved.',
  },
  {
    id: 'media-release',
    label: 'Media release',
    publicRoutes: ['/detroit-dynamo/about', '/detroit-dynamo/camps-clinics', '/detroit-dynamo/teams'],
    relatedModels: ['Waiver', 'Player', 'ParentGuardian', 'NewsPost'],
    appliesTo: ['Photos', 'Video', 'News', 'Social media', 'Sponsor proof'],
    approvalStatus: 'legal_review_required',
    signatureMode: 'not_enabled',
    requiredApprovals: ['Minor media consent', 'Opt-out workflow', 'Sponsor/content usage rules', 'Expiration rule'],
    blockedAction: 'Do not publish player proof, testimonials, or media assets without approved release coverage.',
  },
  {
    id: 'camp-clinic-waiver',
    label: 'Camp and clinic waiver',
    publicRoutes: ['/detroit-dynamo/camps-clinics'],
    relatedModels: ['Waiver', 'CampClinic', 'Player', 'ParentGuardian'],
    appliesTo: ['Seasonal camps', 'Winter indoor training', 'Speed/agility clinics', 'Goalkeeper training'],
    approvalStatus: 'legal_review_required',
    signatureMode: 'not_enabled',
    requiredApprovals: ['Program-specific risk language', 'Facility terms', 'Refund/cancellation link', 'Emergency contact handling'],
    blockedAction: 'Do not open camp or clinic registration until waiver and facility requirements are mapped.',
  },
  {
    id: 'adult-participation',
    label: 'Adult participation waiver',
    publicRoutes: ['/detroit-dynamo/senior-men', '/detroit-dynamo/senior-women'],
    relatedModels: ['Waiver', 'Player', 'TryoutRegistration', 'Team'],
    appliesTo: ['Senior men interest', 'Senior women interest', 'Adult evaluations'],
    approvalStatus: 'legal_review_required',
    signatureMode: 'not_enabled',
    requiredApprovals: ['Adult assumption-of-risk language', 'Tryout/event scope', 'Emergency contact handling', 'Expiration rule'],
    blockedAction: 'Do not run senior-team evaluations through the site until adult participation waiver coverage is approved.',
  },
  {
    id: 'team-travel',
    label: 'Team travel and event consent',
    publicRoutes: ['/detroit-dynamo/teams', '/detroit-dynamo/schedule-results'],
    relatedModels: ['Waiver', 'Team', 'Player', 'ParentGuardian', 'MatchFixture'],
    appliesTo: ['Future fixtures', 'Team travel', 'Events outside regular training venues'],
    approvalStatus: 'legal_review_required',
    signatureMode: 'not_enabled',
    requiredApprovals: ['Travel consent language', 'Transportation rules', 'Chaperone/staff policy', 'Event-specific expiry'],
    blockedAction: 'Do not publish team travel workflows until fixtures, facilities, and consent language are approved.',
  },
];

export function buildDetroitDynamoExternalGateContractReport() {
  const issues = auditDetroitDynamoExternalGateContracts();
  return {
    generatedAt: new Date().toISOString(),
    paymentPackageTracks: detroitDynamoPaymentPackageReadinessTracks.map((track) => ({
      ...track,
      collectionIds: collectionIdsForModels(track.relatedModels),
    })),
    waiverTracks: detroitDynamoWaiverReadinessTracks.map((track) => ({
      ...track,
      collectionIds: collectionIdsForModels(track.relatedModels),
    })),
    launchReadiness: detroitDynamoLaunchReadiness.filter((item) => (
      ['Payments/Packages', 'Waivers/Legal'].includes(item.category)
    )),
    promotionGates: detroitDynamoPromotionGates.filter((item) => (
      ['Payments approved', 'Waivers approved'].includes(item.gate)
    )),
    confirmationRegisters: detroitDynamoExternalConfirmationRegister.filter((item) => (
      ['Payments & Packages', 'Waivers & Legal'].includes(item.area)
    )),
    issues,
  };
}

export function buildDetroitDynamoExternalGateHandoffMarkdown(report = buildDetroitDynamoExternalGateContractReport()) {
  const lines = [
    '# Detroit Dynamo Payment and Waiver Gate Contract',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    'This contract keeps package/payment and waiver/legal work explicit while Detroit Dynamo remains preview-only. It does not enable checkout, collect money, or collect signatures.',
    '',
    '## Payment and Package Tracks',
    '',
    '| Track | Publish Mode | Provider | Routes | Required Approvals |',
    '| --- | --- | --- | --- | --- |',
    ...report.paymentPackageTracks.map((track) => (
      `| ${track.label} | ${track.publishMode} | ${track.providerStatus} | ${track.publicRoutes.join(', ')} | ${track.approvalRequired.join(', ')} |`
    )),
    '',
    '## Waiver Tracks',
    '',
    '| Track | Signature Mode | Routes | Applies To | Required Approvals |',
    '| --- | --- | --- | --- | --- |',
    ...report.waiverTracks.map((track) => (
      `| ${track.label} | ${track.signatureMode} | ${track.publicRoutes.join(', ')} | ${track.appliesTo.join(', ')} | ${track.requiredApprovals.join(', ')} |`
    )),
    '',
    '## Promotion Rule',
    '',
    'Keep payment CTAs as inquiry/placeholder flows and waiver references as approval-gated planning content until the owner confirms prices, provider products, refund rules, legal language, and signature workflow.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoExternalGateContracts() {
  const issues = [];
  const allModels = new Set(detroitDynamoCollectionPlan.map((item) => item.model));
  const requiredPaymentTracks = [
    'private-training-package',
    'small-group-training-package',
    'team-training-quote',
    'camp-clinic-registration',
    'youth-club-dues',
    'sponsor-package',
  ];
  const requiredWaiverTracks = [
    'youth-participation',
    'medical-consent',
    'media-release',
    'camp-clinic-waiver',
    'adult-participation',
    'team-travel',
  ];

  for (const id of requiredPaymentTracks) {
    if (!detroitDynamoPaymentPackageReadinessTracks.some((track) => track.id === id)) {
      issues.push(`Missing payment/package readiness track: ${id}`);
    }
  }
  for (const id of requiredWaiverTracks) {
    if (!detroitDynamoWaiverReadinessTracks.some((track) => track.id === id)) {
      issues.push(`Missing waiver readiness track: ${id}`);
    }
  }

  for (const track of detroitDynamoPaymentPackageReadinessTracks) {
    if (!track.publicRoutes.every((route) => route.startsWith('/detroit-dynamo'))) {
      issues.push(`${track.id} includes a non-Dynamo public route`);
    }
    if (track.providerStatus !== 'not_connected') {
      issues.push(`${track.id} must not be marked provider-connected while payment setup is pending`);
    }
    if (!['placeholder_only', 'interest_only', 'coming_soon_interest', 'pathway_goal_only', 'inquiry_only'].includes(track.publishMode)) {
      issues.push(`${track.id} has an unsafe publish mode`);
    }
    if (!track.relatedModels.every((model) => allModels.has(model))) {
      issues.push(`${track.id} references an unknown model`);
    }
    if (!track.approvalRequired.includes('Provider product id') && track.packageType === 'training') {
      issues.push(`${track.id} training package must require provider product approval`);
    }
  }

  for (const track of detroitDynamoWaiverReadinessTracks) {
    if (!track.publicRoutes.every((route) => route.startsWith('/detroit-dynamo'))) {
      issues.push(`${track.id} includes a non-Dynamo public route`);
    }
    if (track.approvalStatus !== 'legal_review_required') {
      issues.push(`${track.id} must stay legal-review-required while waiver text is pending`);
    }
    if (track.signatureMode !== 'not_enabled') {
      issues.push(`${track.id} signatures must stay disabled while waiver text is pending`);
    }
    if (!track.relatedModels.every((model) => allModels.has(model))) {
      issues.push(`${track.id} references an unknown model`);
    }
    if (!track.relatedModels.includes('Waiver')) {
      issues.push(`${track.id} must map to the Waiver model`);
    }
  }

  const paymentRegister = detroitDynamoExternalConfirmationRegister.find((item) => item.area === 'Payments & Packages');
  const waiverRegister = detroitDynamoExternalConfirmationRegister.find((item) => item.area === 'Waivers & Legal');
  if (!paymentRegister || paymentRegister.status !== 'pending_confirmation') {
    issues.push('Payments & Packages confirmation register must remain pending');
  }
  if (!waiverRegister || waiverRegister.status !== 'pending_confirmation') {
    issues.push('Waivers & Legal confirmation register must remain pending');
  }

  return issues;
}
