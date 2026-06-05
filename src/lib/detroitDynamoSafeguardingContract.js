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

export const detroitDynamoSafeguardingTracks = [
  {
    id: 'minor-intake-guardian-consent',
    label: 'Minor intake and guardian consent',
    ownerRole: 'Registrar',
    publicRoutes: ['/detroit-dynamo/tryouts', '/detroit-dynamo/youth-club', '/detroit-dynamo/camps-clinics'],
    relatedModels: ['Player', 'ParentGuardian', 'TryoutRegistration', 'CampClinic', 'Waiver'],
    adminModules: ['Players', 'Parents/guardians', 'Tryout registrations', 'Camp registrations', 'Waivers/forms'],
    protectionMode: 'guardian_required',
    activationStatus: 'policy_review_required',
    requiredControls: [
      'Guardian name and contact captured for minor-facing youth, tryout, and camp records',
      'Guardian relationship and communication preference approved before live registration',
      'Minor records scoped to registrar, assigned coach, and approved team staff only',
      'Consent status visible before evaluations, camps, team placement, or media publication',
    ],
    blockedAction: 'Do not treat a minor player as registered, rostered, or cleared for participation until guardian consent and waiver status are confirmed.',
    previewHandling: 'Preview forms may collect interest and guardian names, but signatures and legal consent stay disabled.',
  },
  {
    id: 'coach-staff-background-safeguarding',
    label: 'Coach, staff, and background-check readiness',
    ownerRole: 'Club Director',
    publicRoutes: ['/detroit-dynamo/about', '/detroit-dynamo/training', '/detroit-dynamo/teams'],
    relatedModels: ['Coach', 'StaffMember', 'Team', 'Program'],
    adminModules: ['Coaches', 'Teams', 'Training programs', 'Website content sections'],
    protectionMode: 'staff_verification_required',
    activationStatus: 'policy_review_required',
    requiredControls: [
      'Background-check status captured before assigning youth-facing responsibilities',
      'Coach licenses, specialties, bios, and photos approved before public display',
      'Youth communication and supervision expectations acknowledged by staff',
      'Expired or rejected background-check states block youth-facing assignments',
    ],
    blockedAction: 'Do not publish staff credibility claims or assign youth-facing staff until verification and safeguarding process are approved.',
    previewHandling: 'Preview pages can describe coaching standards without inventing names, licenses, or clearance status.',
  },
  {
    id: 'youth-communication-boundaries',
    label: 'Youth communication boundaries',
    ownerRole: 'Registrar',
    publicRoutes: ['/detroit-dynamo/contact', '/detroit-dynamo/tryouts', '/detroit-dynamo/youth-club'],
    relatedModels: ['ParentGuardian', 'Player', 'ContactLead', 'Team'],
    adminModules: ['Parents/guardians', 'Players', 'Contact leads', 'Teams'],
    protectionMode: 'guardian_visible_communication',
    activationStatus: 'policy_review_required',
    requiredControls: [
      'Minor communications route through guardian-approved contact methods',
      'Team manager and coach access scoped to assigned teams or sessions',
      'Internal notes avoid sensitive medical, disciplinary, or personal details unless required for safety',
      'Escalation path exists for parent concerns, opt-outs, and communication corrections',
    ],
    blockedAction: 'Do not build direct-to-minor communication workflows until guardian-visible communication rules are approved.',
    previewHandling: 'Preview lead follow-up stays owner-assigned and does not create live messaging threads.',
  },
  {
    id: 'medical-emergency-data',
    label: 'Medical and emergency data handling',
    ownerRole: 'Registrar',
    publicRoutes: ['/detroit-dynamo/tryouts', '/detroit-dynamo/camps-clinics', '/detroit-dynamo/book'],
    relatedModels: ['Player', 'ParentGuardian', 'Waiver', 'TrainingSession', 'CampClinic'],
    adminModules: ['Players', 'Parents/guardians', 'Waivers/forms', 'Training bookings', 'Camp registrations'],
    protectionMode: 'restricted_health_context',
    activationStatus: 'legal_review_required',
    requiredControls: [
      'Emergency contact fields approved before collection',
      'Medical notes limited to safety-relevant context with restricted visibility',
      'Coach visibility limited to participation-critical information',
      'Retention and deletion rules approved for medical and emergency records',
    ],
    blockedAction: 'Do not collect medical disclosures or emergency-contact legal consent until reviewed language and access rules are approved.',
    previewHandling: 'Preview forms avoid medical intake and route health/waiver details to future approved workflows.',
  },
  {
    id: 'waiver-version-media-release',
    label: 'Waiver versions and media release governance',
    ownerRole: 'Registrar',
    publicRoutes: ['/detroit-dynamo/tryouts', '/detroit-dynamo/camps-clinics', '/detroit-dynamo/about', '/detroit-dynamo/sponsors'],
    relatedModels: ['Waiver', 'Player', 'ParentGuardian', 'NewsPost', 'Sponsor'],
    adminModules: ['Waivers/forms', 'Players', 'Parents/guardians', 'News posts', 'Sponsors'],
    protectionMode: 'versioned_release_required',
    activationStatus: 'legal_review_required',
    requiredControls: [
      'Waiver type, version, signed date, expiration, and status tracked per player',
      'Minor media release requires guardian approval and opt-out path',
      'Sponsor/content usage rules mapped to approved media releases',
      'Expired or missing release status blocks public player proof and media publication',
    ],
    blockedAction: 'Do not publish player photos, testimonials, sponsor proof, or media clips without current release coverage.',
    previewHandling: 'Preview proof slots remain placeholders until signed release coverage and asset permission exist.',
  },
  {
    id: 'roster-travel-event-clearance',
    label: 'Roster, travel, and event clearance',
    ownerRole: 'Team Manager',
    publicRoutes: ['/detroit-dynamo/teams', '/detroit-dynamo/schedule-results', '/detroit-dynamo/senior-men', '/detroit-dynamo/senior-women'],
    relatedModels: ['Team', 'Player', 'ParentGuardian', 'Waiver', 'MatchFixture'],
    adminModules: ['Teams', 'Players', 'Parents/guardians', 'Waivers/forms', 'Schedules/results'],
    protectionMode: 'participation_clearance_required',
    activationStatus: 'policy_review_required',
    requiredControls: [
      'Roster eligibility depends on registration, waiver, and age-group status',
      'Travel/event consent mapped to fixture or event records where needed',
      'Team manager visibility scoped to assigned roster and event logistics',
      'Fixture publication does not imply player participation clearance',
    ],
    blockedAction: 'Do not mark players active for matches, travel, or events until roster and consent clearance are approved.',
    previewHandling: 'Roster-ready and schedule-ready layouts remain placeholders until confirmed records exist.',
  },
  {
    id: 'data-retention-export-deletion',
    label: 'Data retention, export, and deletion',
    ownerRole: 'Master Admin',
    publicRoutes: ['/detroit-dynamo/contact', '/detroit-dynamo/tryouts', '/detroit-dynamo/book', '/admin/detroit-dynamo'],
    relatedModels: ['ContactLead', 'Player', 'ParentGuardian', 'Booking', 'TryoutRegistration', 'Sponsor'],
    adminModules: ['Contact leads', 'Players', 'Parents/guardians', 'Training bookings', 'Tryout registrations', 'Sponsors'],
    protectionMode: 'retention_policy_required',
    activationStatus: 'policy_review_required',
    requiredControls: [
      'Retention periods approved for leads, players, guardians, bookings, tryouts, sponsors, and archived records',
      'Export workflow approved for owner/admin review without exposing unnecessary minor data',
      'Correction and deletion request path assigned to a responsible role',
      'Local preview storage remains clearly separate from live backend records',
    ],
    blockedAction: 'Do not treat browser-local preview leads as durable records or migrate them without retention and privacy approval.',
    previewHandling: 'Preview lead export is browser-local planning data and should be cleared or migrated only after owner approval.',
  },
  {
    id: 'admin-access-audit-trail',
    label: 'Admin access and audit trail',
    ownerRole: 'Master Admin',
    publicRoutes: ['/admin/detroit-dynamo', '/admin/detroit-dynamo/modules/players', '/admin/detroit-dynamo/modules/waivers-forms'],
    relatedModels: ['Player', 'ParentGuardian', 'Coach', 'Waiver', 'ContactLead'],
    adminModules: ['Players', 'Parents/guardians', 'Coaches', 'Waivers/forms', 'Contact leads'],
    protectionMode: 'role_scoped_audit_required',
    activationStatus: 'backend_required',
    requiredControls: [
      'Role access follows the Detroit Dynamo permission matrix',
      'Sensitive actions on minor, waiver, staff, and medical-related records produce audit events',
      'Coach and media/admin roles cannot see payment, waiver, or guardian data outside approved scope',
      'Pipeline status changes keep actor role, note, timestamp, and event count',
    ],
    blockedAction: 'Do not enable live sensitive record mutation until role-scoped authorization and audit logging are wired server-side.',
    previewHandling: 'Local preview transitions show the intended audit shape but do not replace live backend enforcement.',
  },
];

export function buildDetroitDynamoSafeguardingReport() {
  const issues = auditDetroitDynamoSafeguardingContract();
  return {
    generatedAt: new Date().toISOString(),
    safeguardingTracks: detroitDynamoSafeguardingTracks.map((track) => ({
      ...track,
      collectionIds: collectionIdsForModels(track.relatedModels),
    })),
    launchReadiness: detroitDynamoLaunchReadiness.filter((item) => (
      ['Backend/Data', 'Waivers/Legal', 'Facilities/Operations', 'Content/Brand Promotion'].includes(item.category)
    )),
    promotionGates: detroitDynamoPromotionGates.filter((item) => (
      ['Data backend live', 'Waivers approved', 'League and facility facts confirmed'].includes(item.gate)
    )),
    confirmationRegisters: detroitDynamoExternalConfirmationRegister.filter((item) => (
      ['Waivers & Legal', 'Staff, Rosters & Safeguarding', 'Facilities & Operations', 'Sponsors, Media & Content Proof'].includes(item.area)
    )),
    issues,
  };
}

export function buildDetroitDynamoSafeguardingMarkdown(report = buildDetroitDynamoSafeguardingReport()) {
  const lines = [
    '# Detroit Dynamo Safeguarding and Data Privacy Contract',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    'This contract keeps youth safety, guardian consent, medical data, staff verification, media releases, retention, and role-scoped admin access explicit while Detroit Dynamo remains preview-only.',
    '',
    '| Track | Owner | Protection Mode | Status | Routes | Blocked Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.safeguardingTracks.map((track) => (
      `| ${track.label} | ${track.ownerRole} | ${track.protectionMode} | ${track.activationStatus} | ${track.publicRoutes.join(', ')} | ${track.blockedAction} |`
    )),
    '',
    '## Required Controls',
    '',
    ...report.safeguardingTracks.flatMap((track) => [
      `### ${track.label}`,
      '',
      ...track.requiredControls.map((control) => `- [ ] ${control}`),
      '',
      `Preview handling: ${track.previewHandling}`,
      '',
    ]),
    '## Promotion Rule',
    '',
    'Do not launch live youth registration, medical intake, waiver signatures, roster clearance, staff publication, media proof, or sensitive admin mutation until these controls have owner approval and backend enforcement.',
    '',
  ];

  return lines.join('\n');
}

export function auditDetroitDynamoSafeguardingContract() {
  const issues = [];
  const allModels = new Set(detroitDynamoCollectionPlan.map((item) => item.model));
  const allModules = new Set(detroitDynamoAdminModules);
  const requiredTrackIds = [
    'minor-intake-guardian-consent',
    'coach-staff-background-safeguarding',
    'youth-communication-boundaries',
    'medical-emergency-data',
    'waiver-version-media-release',
    'roster-travel-event-clearance',
    'data-retention-export-deletion',
    'admin-access-audit-trail',
  ];
  const allowedStatuses = new Set([
    'policy_review_required',
    'legal_review_required',
    'backend_required',
  ]);
  const allowedProtectionModes = new Set([
    'guardian_required',
    'staff_verification_required',
    'guardian_visible_communication',
    'restricted_health_context',
    'versioned_release_required',
    'participation_clearance_required',
    'retention_policy_required',
    'role_scoped_audit_required',
  ]);

  for (const id of requiredTrackIds) {
    if (!detroitDynamoSafeguardingTracks.some((track) => track.id === id)) {
      issues.push(`Missing safeguarding track: ${id}`);
    }
  }

  for (const track of detroitDynamoSafeguardingTracks) {
    if (!track.publicRoutes.every((route) => route.startsWith('/detroit-dynamo') || route.startsWith('/admin/detroit-dynamo'))) {
      issues.push(`${track.id} includes a non-Dynamo route`);
    }
    if (!track.relatedModels.every((model) => allModels.has(model))) {
      issues.push(`${track.id} references an unknown model`);
    }
    if (!track.adminModules.every((module) => allModules.has(module))) {
      issues.push(`${track.id} references an unknown admin module`);
    }
    if (!allowedStatuses.has(track.activationStatus)) {
      issues.push(`${track.id} has an unsafe activation status`);
    }
    if (['live', 'active', 'approved'].includes(track.activationStatus)) {
      issues.push(`${track.id} must not be marked live while safeguarding policy is pending`);
    }
    if (!allowedProtectionModes.has(track.protectionMode)) {
      issues.push(`${track.id} has an unknown protection mode`);
    }
    if (!Array.isArray(track.requiredControls) || track.requiredControls.length < 4) {
      issues.push(`${track.id} needs at least 4 required controls`);
    }
    if (!track.blockedAction || !track.previewHandling) {
      issues.push(`${track.id} needs blocked action and preview handling text`);
    }
  }

  const minorTrack = detroitDynamoSafeguardingTracks.find((track) => track.id === 'minor-intake-guardian-consent');
  if (!minorTrack || !minorTrack.relatedModels.includes('ParentGuardian') || !minorTrack.relatedModels.includes('Waiver')) {
    issues.push('Minor intake safeguarding must include ParentGuardian and Waiver models');
  }

  const auditTrack = detroitDynamoSafeguardingTracks.find((track) => track.id === 'admin-access-audit-trail');
  if (!auditTrack || auditTrack.activationStatus !== 'backend_required') {
    issues.push('Admin access audit trail must remain backend-required until live enforcement exists');
  }

  return issues;
}
