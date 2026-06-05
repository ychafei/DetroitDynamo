import {
  detroitDynamoAdminModules,
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

export const detroitDynamoClaimSafetyTracks = [
  {
    id: 'league-competition-pathway',
    label: 'League and competition pathway',
    confirmationArea: 'League & Competition Facts',
    publicRoutes: [
      '/detroit-dynamo/fc',
      '/detroit-dynamo/youth-club',
      '/detroit-dynamo/senior-men',
      '/detroit-dynamo/senior-women',
      '/detroit-dynamo/teams',
    ],
    relatedModels: ['Team', 'MatchFixture', 'MatchResult', 'NewsPost'],
    adminModules: ['Teams', 'Schedules/results', 'News posts', 'Website content sections'],
    publishMode: 'future_pathway_only',
    confirmationStatus: 'future_pathway',
    requiredEvidence: [
      'Written senior men league acceptance before naming current membership',
      'Written senior women league acceptance before naming current membership',
      'Confirmed youth league placement before naming current competition',
      'Owner-approved wording for every league and competition reference',
    ],
    blockedClaim: 'Do not state current UPSL, UPSL Women, or named youth-league membership until written acceptance is confirmed.',
    safeLanguage: [
      'Goal of competing in UPSL or a similar pro-development league.',
      'Future competitive youth pathway goal.',
      'Club development roadmap.',
    ],
  },
  {
    id: 'facility-operations-claims',
    label: 'Facility and operations claims',
    confirmationArea: 'Facilities & Operations',
    publicRoutes: [
      '/detroit-dynamo/training',
      '/detroit-dynamo/book',
      '/detroit-dynamo/tryouts',
      '/detroit-dynamo/camps-clinics',
      '/detroit-dynamo/schedule-results',
      '/detroit-dynamo/contact',
    ],
    relatedModels: ['TrainingSession', 'CampClinic', 'MatchFixture', 'Program'],
    adminModules: ['Training programs', 'Training bookings', 'Camp registrations', 'Schedules/results', 'Website content sections'],
    publishMode: 'placeholder_only',
    confirmationStatus: 'pending_confirmation',
    requiredEvidence: [
      'Confirmed field or facility partner access',
      'Approved calendars for training, tryouts, camps, and matches',
      'Insurance, safety, weather, cancellation, and emergency procedures',
      'Owner approval for public names, addresses, maps, and parking/access notes',
    ],
    blockedClaim: 'Do not publish facility names, addresses, schedules, or permitted-field commitments until operating access is confirmed.',
    safeLanguage: [
      'Location and facility details will be confirmed with registered players and families.',
      'Facility partnerships are being finalized.',
      'Training windows are planned around approved field access.',
    ],
  },
  {
    id: 'staff-roster-safeguarding',
    label: 'Staff, roster, and safeguarding proof',
    confirmationArea: 'Staff, Rosters & Safeguarding',
    publicRoutes: [
      '/detroit-dynamo/about',
      '/detroit-dynamo/academy',
      '/detroit-dynamo/youth-club',
      '/detroit-dynamo/teams',
      '/detroit-dynamo/senior-men',
      '/detroit-dynamo/senior-women',
    ],
    relatedModels: ['Coach', 'StaffMember', 'Team', 'Player', 'Waiver'],
    adminModules: ['Coaches', 'Teams', 'Players', 'Waivers/forms', 'Website content sections'],
    publishMode: 'approval_required',
    confirmationStatus: 'pending_confirmation',
    requiredEvidence: [
      'Approved staff names, titles, bios, licenses, and photos',
      'Background-check and safeguarding process confirmed for youth-facing roles',
      'Approved roster policy and player/guardian media releases',
      'Team manager assignments and public-contact rules',
    ],
    blockedClaim: 'Do not publish staff bios, coach credentials, roster cards, player photos, or player status details until verification and permissions are complete.',
    safeLanguage: [
      'Staff and roster details will be published after approval.',
      'Coaching standards and safeguarding workflows are part of the club buildout.',
      'Roster-ready layouts are prepared for confirmed teams.',
    ],
  },
  {
    id: 'sponsor-media-proof',
    label: 'Sponsor, testimonial, and media proof',
    confirmationArea: 'Sponsors, Media & Content Proof',
    publicRoutes: [
      '/detroit-dynamo',
      '/detroit-dynamo/sponsors',
      '/detroit-dynamo/about',
      '/detroit-dynamo/brand',
    ],
    relatedModels: ['Sponsor', 'NewsPost', 'ContactLead', 'StaffMember'],
    adminModules: ['Sponsors', 'News posts', 'Contact leads', 'Website content sections'],
    publishMode: 'proof_placeholder_only',
    confirmationStatus: 'preview_only',
    requiredEvidence: [
      'Approved sponsor logos, links, placements, and activation inventory',
      'Permissioned testimonials, player stories, partner quotes, and media clips',
      'Approved image rights and media-release coverage',
      'Editorial approval workflow for sponsor, news, and proof content',
    ],
    blockedClaim: 'Do not show sponsor logos, testimonials, partner quotes, player proof, or media clips as real until permissions and source assets are approved.',
    safeLanguage: [
      'Sponsor opportunities are open for local businesses.',
      'Proof slots are prepared for approved partners and media.',
      'Testimonial-ready sections will use real approved quotes only.',
    ],
  },
  {
    id: 'fixture-results-schedule',
    label: 'Fixtures, schedules, and results',
    confirmationArea: 'League & Competition Facts',
    publicRoutes: [
      '/detroit-dynamo/schedule-results',
      '/detroit-dynamo/results',
      '/detroit-dynamo/teams',
      '/detroit-dynamo/senior-men',
      '/detroit-dynamo/senior-women',
    ],
    relatedModels: ['MatchFixture', 'MatchResult', 'Team', 'NewsPost'],
    adminModules: ['Schedules/results', 'Teams', 'News posts', 'Website content sections'],
    publishMode: 'confirmed_records_only',
    confirmationStatus: 'future_pathway',
    requiredEvidence: [
      'Confirmed team record connected to the fixture',
      'Confirmed opponent, venue, competition, date, and kickoff time',
      'Post-match score source and recap approval',
      'Facility and competition permission for public publication',
    ],
    blockedClaim: 'Do not create fake fixtures, fake opponents, fake results, fake venues, or fake recaps to make the club look active.',
    safeLanguage: [
      'No fixtures have been published yet.',
      'Schedules and results will appear after teams and competitions are confirmed.',
      'Placeholder states are used until real match records exist.',
    ],
  },
  {
    id: 'player-outcome-proof',
    label: 'College, pre-pro, and player-outcome proof',
    confirmationArea: 'Sponsors, Media & Content Proof',
    publicRoutes: [
      '/detroit-dynamo/training',
      '/detroit-dynamo/academy',
      '/detroit-dynamo/youth-club',
      '/detroit-dynamo/fc',
      '/detroit-dynamo/senior-men',
      '/detroit-dynamo/senior-women',
    ],
    relatedModels: ['Player', 'Team', 'NewsPost', 'StaffMember'],
    adminModules: ['Players', 'Teams', 'News posts', 'Website content sections'],
    publishMode: 'proof_required',
    confirmationStatus: 'preview_only',
    requiredEvidence: [
      'Confirmed player consent for any placement, achievement, or pathway story',
      'Verified college, academy, semi-pro, or pro-development outcome before publication',
      'Approved parent/guardian release for minor-player achievements',
      'Owner-approved wording that avoids guarantees or misleading promises',
    ],
    blockedClaim: 'Do not guarantee scholarships, college placement, senior-team selection, or pre-pro outcomes.',
    safeLanguage: [
      'College and pre-pro preparation pathway.',
      'Development support for serious players.',
      'Player outcomes will be published only when verified and permissioned.',
    ],
  },
  {
    id: 'launch-news-seo-redirects',
    label: 'Launch news, SEO, and redirects',
    confirmationArea: 'Sponsors, Media & Content Proof',
    publicRoutes: [
      '/detroit-dynamo',
      '/detroit-dynamo/about',
      '/detroit-dynamo/brand',
      '/detroit-dynamo/admin-foundation',
    ],
    relatedModels: ['NewsPost', 'ContactLead', 'Sponsor', 'StaffMember'],
    adminModules: ['News posts', 'Sponsors', 'Contact leads', 'Website content sections'],
    publishMode: 'owner_approval_required',
    confirmationStatus: 'preview_only',
    requiredEvidence: [
      'Approved Detroit Dynamo launch copy and announcement timing',
      'Approved sitemap, canonical routes, robots/noindex removal, and Open Graph assets',
      'Approved redirect timing from old Detroit Dynamo routes',
      'Signed current-site migration or preservation plan',
    ],
    blockedClaim: 'Do not present Detroit Dynamo as the live replacement brand, remove preview noindex, or apply old-route redirects until launch approval is complete.',
    safeLanguage: [
      'Preview-only brand direction.',
      'Future promotion requires owner approval.',
      'Redirect plan is draft-only until the legacy public route migration is approved.',
    ],
  },
];

export function buildDetroitDynamoClaimSafetyContractReport() {
  const issues = auditDetroitDynamoClaimSafetyContract();
  const registersByArea = new Map(detroitDynamoExternalConfirmationRegister.map((item) => [item.area, item]));

  return {
    generatedAt: new Date().toISOString(),
    claimSafetyTracks: detroitDynamoClaimSafetyTracks.map((track) => ({
      ...track,
      collectionIds: collectionIdsForModels(track.relatedModels),
      confirmationRegister: registersByArea.get(track.confirmationArea) || null,
    })),
    confirmationRegisters: detroitDynamoExternalConfirmationRegister.filter((item) => (
      [
        'League & Competition Facts',
        'Facilities & Operations',
        'Staff, Rosters & Safeguarding',
        'Sponsors, Media & Content Proof',
      ].includes(item.area)
    )),
    launchReadiness: detroitDynamoLaunchReadiness.filter((item) => (
      ['League/Competition', 'Facilities/Operations', 'Content/Brand Promotion'].includes(item.category)
    )),
    promotionGates: detroitDynamoPromotionGates.filter((item) => (
      ['League and facility facts confirmed', 'SEO and redirect launch approved'].includes(item.gate)
    )),
    issues,
  };
}

export function buildDetroitDynamoClaimSafetyHandoffMarkdown(
  report = buildDetroitDynamoClaimSafetyContractReport(),
) {
  const lines = [
    '# Detroit Dynamo Public Claim Safety Contract',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    'This contract keeps the preview honest while Detroit Dynamo builds toward a full player pathway. It allows future-pathway language and polished placeholders, but blocks unverified league, facility, roster, sponsor, fixture, outcome, and launch claims.',
    '',
    '| Track | Area | Publish Mode | Status | Routes | Blocked Claim |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.claimSafetyTracks.map((track) => (
      `| ${track.label} | ${track.confirmationArea} | ${track.publishMode} | ${track.confirmationStatus} | ${track.publicRoutes.join(', ')} | ${track.blockedClaim} |`
    )),
    '',
    '## Safe Language',
    '',
    ...report.claimSafetyTracks.flatMap((track) => [
      `### ${track.label}`,
      '',
      ...track.safeLanguage.map((line) => `- ${line}`),
      '',
    ]),
    '## Promotion Rule',
    '',
    'Use future-pathway, placeholder, or approval-pending language until written evidence and owner-approved wording exist. Do not publish proof-like claims to make the organization appear farther along than it is.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoClaimSafetyContract() {
  const issues = [];
  const allModels = new Set(detroitDynamoCollectionPlan.map((item) => item.model));
  const allModules = new Set(detroitDynamoAdminModules);
  const registerByArea = new Map(detroitDynamoExternalConfirmationRegister.map((item) => [item.area, item]));
  const allowedPublishModes = new Set([
    'future_pathway_only',
    'placeholder_only',
    'approval_required',
    'proof_placeholder_only',
    'confirmed_records_only',
    'proof_required',
    'owner_approval_required',
  ]);
  const requiredTrackIds = [
    'league-competition-pathway',
    'facility-operations-claims',
    'staff-roster-safeguarding',
    'sponsor-media-proof',
    'fixture-results-schedule',
    'player-outcome-proof',
    'launch-news-seo-redirects',
  ];

  for (const id of requiredTrackIds) {
    if (!detroitDynamoClaimSafetyTracks.some((track) => track.id === id)) {
      issues.push(`Missing claim-safety track: ${id}`);
    }
  }

  for (const track of detroitDynamoClaimSafetyTracks) {
    const register = registerByArea.get(track.confirmationArea);
    if (!track.publicRoutes.every((route) => route.startsWith('/detroit-dynamo'))) {
      issues.push(`${track.id} includes a non-Dynamo public route`);
    }
    if (!track.relatedModels.every((model) => allModels.has(model))) {
      issues.push(`${track.id} references an unknown model`);
    }
    if (!track.adminModules.every((module) => allModules.has(module))) {
      issues.push(`${track.id} references an unknown admin module`);
    }
    if (!allowedPublishModes.has(track.publishMode)) {
      issues.push(`${track.id} has an unsafe publish mode`);
    }
    if (!register) {
      issues.push(`${track.id} references a missing external confirmation area`);
    } else if (register.status !== track.confirmationStatus) {
      issues.push(`${track.id} status must match confirmation register ${track.confirmationArea}`);
    }
    if (track.confirmationStatus === 'confirmed') {
      issues.push(`${track.id} must not be marked confirmed while Detroit Dynamo remains preview-only`);
    }
    if (!Array.isArray(track.requiredEvidence) || track.requiredEvidence.length < 4) {
      issues.push(`${track.id} needs at least 4 required evidence items`);
    }
    if (!track.blockedClaim) {
      issues.push(`${track.id} needs an explicit blocked claim`);
    }
    if (!Array.isArray(track.safeLanguage) || track.safeLanguage.length < 2) {
      issues.push(`${track.id} needs safe language options`);
    }
  }

  const leagueTrack = detroitDynamoClaimSafetyTracks.find((track) => track.id === 'league-competition-pathway');
  if (!leagueTrack || leagueTrack.confirmationStatus !== 'future_pathway') {
    issues.push('League pathway track must remain future_pathway until membership is verified');
  }

  const unsafeClaimText = detroitDynamoClaimSafetyTracks
    .flatMap((track) => [track.blockedClaim, ...track.safeLanguage])
    .join(' ')
    .toLowerCase();
  for (const phrase of ['current upsl member', 'currently competes in upsl', 'guaranteed scholarship']) {
    if (unsafeClaimText.includes(phrase)) {
      issues.push(`Claim safety contract contains unsafe claim phrase: ${phrase}`);
    }
  }

  return issues;
}
