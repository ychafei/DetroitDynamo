import { Client, Databases, ID, Query } from 'node-appwrite';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'lctraining';
const ADMIN_ROLE_ASSIGNMENTS_COLLECTION_ID = 'dd_admin_role_assignments';
const AUDIT_COLLECTION_ID = 'dd_admin_audit_events';

const mutations = ['create_record', 'update_record', 'archive_record'];
const accessRank = { none: 0, view: 1, contribute: 2, approve: 3, manage: 4, admin: 5 };

const adminRoles = [
  'Master Admin',
  'Club Director',
  'Training Director',
  'Coach',
  'Team Manager',
  'Registrar',
  'Media/Admin Staff',
];

const moduleRegistry = [
  { module: 'Players', slug: 'players', status: 'intake_ready_after_backend', collectionIds: ['dd_players', 'dd_tryout_registrations', 'dd_teams', 'dd_waivers'], enabledActions: ['Review player leads', 'Assign status', 'Connect guardians', 'Prepare roster eligibility'] },
  { module: 'Parents/guardians', slug: 'parents-guardians', status: 'intake_ready_after_backend', collectionIds: ['dd_parent_guardians', 'dd_players', 'dd_waivers'], enabledActions: ['Review guardian records', 'Connect players', 'Track consent readiness', 'Route family communication'] },
  { module: 'Coaches', slug: 'coaches', status: 'admin_dashboard_needed', collectionIds: ['dd_coaches', 'dd_staff_members', 'dd_teams', 'dd_programs'], enabledActions: ['Create coach profiles', 'Assign programs', 'Assign teams', 'Review background-check status'] },
  { module: 'Teams', slug: 'teams', status: 'admin_dashboard_needed', collectionIds: ['dd_teams', 'dd_players', 'dd_coaches', 'dd_staff_members'], enabledActions: ['Create team shells', 'Assign coaches', 'Assign managers', 'Prepare roster cards'] },
  { module: 'Age groups', slug: 'age-groups', status: 'admin_dashboard_needed', collectionIds: ['dd_teams', 'dd_programs', 'dd_players'], enabledActions: ['Define age-group cohorts', 'Map players by birth year', 'Publish pathway language', 'Review capacity'] },
  { module: 'Training programs', slug: 'training-programs', status: 'admin_dashboard_needed', collectionIds: ['dd_programs', 'dd_training_packages', 'dd_camps_clinics'], enabledActions: ['Create programs', 'Draft package options', 'Set public visibility', 'Connect booking CTAs'] },
  { module: 'Training bookings', slug: 'training-bookings', status: 'intake_ready_after_backend', collectionIds: ['dd_bookings', 'dd_training_sessions', 'dd_training_packages', 'dd_contact_leads'], enabledActions: ['Review booking leads', 'Assign coach follow-up', 'Capture requested focus', 'Prepare session records'] },
  { module: 'Tryout registrations', slug: 'tryout-registrations', status: 'intake_ready_after_backend', collectionIds: ['dd_tryout_registrations', 'dd_players', 'dd_teams', 'dd_parent_guardians'], enabledActions: ['Review registrations', 'Set status', 'Route by pathway', 'Prepare invite/waitlist decisions'] },
  { module: 'Camp registrations', slug: 'camp-registrations', status: 'admin_dashboard_needed', collectionIds: ['dd_camps_clinics', 'dd_players', 'dd_parent_guardians', 'dd_waivers'], enabledActions: ['Create camp shells', 'Track interest', 'Manage capacity', 'Confirm waiver readiness'] },
  { module: 'Payments/packages', slug: 'payments-packages', status: 'external_gate', collectionIds: ['dd_payments', 'dd_training_packages', 'dd_camps_clinics', 'dd_sponsors'], enabledActions: ['Draft packages', 'Map provider products', 'Review payment status', 'Prepare refund rules'] },
  { module: 'Waivers/forms', slug: 'waivers-forms', status: 'external_gate', collectionIds: ['dd_waivers', 'dd_players', 'dd_parent_guardians', 'dd_camps_clinics'], enabledActions: ['Draft waiver versions', 'Track signature status', 'Review expirations', 'Gate participation readiness'] },
  { module: 'News posts', slug: 'news-posts', status: 'admin_dashboard_needed', collectionIds: ['dd_news_posts', 'dd_staff_members', 'dd_sponsors', 'dd_match_results'], enabledActions: ['Draft posts', 'Approve claims', 'Schedule publication', 'Archive old posts'] },
  { module: 'Sponsors', slug: 'sponsors', status: 'intake_ready_after_backend', collectionIds: ['dd_sponsors', 'dd_contact_leads', 'dd_news_posts'], enabledActions: ['Review sponsor leads', 'Track package interest', 'Approve logos', 'Prepare partnership content'] },
  { module: 'Schedules/results', slug: 'schedules-results', status: 'external_gate', collectionIds: ['dd_match_fixtures', 'dd_match_results', 'dd_teams', 'dd_news_posts'], enabledActions: ['Create fixture drafts', 'Confirm venues', 'Publish results', 'Connect recaps'] },
  { module: 'Contact leads', slug: 'contact-leads', status: 'intake_ready_after_backend', collectionIds: ['dd_contact_leads', 'dd_bookings', 'dd_tryout_registrations', 'dd_sponsors'], enabledActions: ['Review leads', 'Assign owner', 'Set status', 'Export follow-up queue'] },
  { module: 'Website content sections', slug: 'website-content-sections', status: 'external_gate', collectionIds: ['dd_news_posts', 'dd_staff_members', 'dd_sponsors', 'dd_programs'], enabledActions: ['Draft content sections', 'Approve launch copy', 'Update proof slots', 'Prepare sitemap/redirect promotion'] },
];

const modelByCollection = {
  dd_players: 'Player',
  dd_parent_guardians: 'ParentGuardian',
  dd_coaches: 'Coach',
  dd_teams: 'Team',
  dd_programs: 'Program',
  dd_training_packages: 'TrainingPackage',
  dd_training_sessions: 'TrainingSession',
  dd_bookings: 'Booking',
  dd_tryout_registrations: 'TryoutRegistration',
  dd_camps_clinics: 'CampClinic',
  dd_payments: 'Payment',
  dd_waivers: 'Waiver',
  dd_sponsors: 'Sponsor',
  dd_news_posts: 'NewsPost',
  dd_match_fixtures: 'MatchFixture',
  dd_match_results: 'MatchResult',
  dd_contact_leads: 'ContactLead',
  dd_staff_members: 'StaffMember',
};

const roleAccessByModule = {
  'Master Admin': Object.fromEntries(moduleRegistry.map((item) => [item.module, 'admin'])),
  'Club Director': { Players: 'view', 'Parents/guardians': 'view', Coaches: 'manage', Teams: 'manage', 'Age groups': 'manage', 'Training programs': 'view', 'Training bookings': 'view', 'Tryout registrations': 'manage', 'Camp registrations': 'view', 'Payments/packages': 'view', 'Waivers/forms': 'view', 'News posts': 'approve', Sponsors: 'approve', 'Schedules/results': 'manage', 'Contact leads': 'view', 'Website content sections': 'approve' },
  'Training Director': { Players: 'contribute', 'Parents/guardians': 'view', Coaches: 'contribute', Teams: 'view', 'Age groups': 'view', 'Training programs': 'manage', 'Training bookings': 'manage', 'Tryout registrations': 'view', 'Camp registrations': 'manage', 'Payments/packages': 'contribute', 'Waivers/forms': 'view', 'News posts': 'contribute', Sponsors: 'view', 'Schedules/results': 'view', 'Contact leads': 'manage', 'Website content sections': 'contribute' },
  Coach: { Players: 'view', 'Parents/guardians': 'view', Coaches: 'view', Teams: 'view', 'Age groups': 'view', 'Training programs': 'view', 'Training bookings': 'contribute', 'Tryout registrations': 'view', 'Camp registrations': 'view', 'Payments/packages': 'none', 'Waivers/forms': 'view', 'News posts': 'none', Sponsors: 'none', 'Schedules/results': 'view', 'Contact leads': 'none', 'Website content sections': 'none' },
  'Team Manager': { Players: 'contribute', 'Parents/guardians': 'contribute', Coaches: 'view', Teams: 'contribute', 'Age groups': 'view', 'Training programs': 'view', 'Training bookings': 'view', 'Tryout registrations': 'view', 'Camp registrations': 'view', 'Payments/packages': 'view', 'Waivers/forms': 'view', 'News posts': 'contribute', Sponsors: 'view', 'Schedules/results': 'manage', 'Contact leads': 'view', 'Website content sections': 'contribute' },
  Registrar: { Players: 'manage', 'Parents/guardians': 'manage', Coaches: 'view', Teams: 'contribute', 'Age groups': 'contribute', 'Training programs': 'view', 'Training bookings': 'view', 'Tryout registrations': 'manage', 'Camp registrations': 'manage', 'Payments/packages': 'view', 'Waivers/forms': 'manage', 'News posts': 'none', Sponsors: 'none', 'Schedules/results': 'view', 'Contact leads': 'manage', 'Website content sections': 'view' },
  'Media/Admin Staff': { Players: 'view', 'Parents/guardians': 'none', Coaches: 'view', Teams: 'view', 'Age groups': 'view', 'Training programs': 'view', 'Training bookings': 'none', 'Tryout registrations': 'view', 'Camp registrations': 'view', 'Payments/packages': 'none', 'Waivers/forms': 'none', 'News posts': 'manage', Sponsors: 'manage', 'Schedules/results': 'contribute', 'Contact leads': 'manage', 'Website content sections': 'manage' },
};

function cleanText(value, max = 20000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function parseBody(req) {
  if (req.bodyJson && typeof req.bodyJson === 'object') return req.bodyJson;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);
  return {};
}

function appwriteUserId(req) {
  return cleanText(req.headers['x-appwrite-user-id'] || req.headers['X-Appwrite-User-Id'], 128);
}

function requestIp(req) {
  const forwarded = cleanText(req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'], 120);
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 120);
  return cleanText(req.headers['x-real-ip'] || req.headers['X-Real-Ip'], 120);
}

function normalizeRole(roleName) {
  const value = cleanText(roleName, 100).toLowerCase();
  return adminRoles.find((role) => role.toLowerCase() === value) || '';
}

function normalizeModuleSlug(value) {
  return cleanText(value, 120)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findModule(payload) {
  const slug = normalizeModuleSlug(payload.module_slug || payload.moduleSlug || payload.module);
  return moduleRegistry.find((item) => item.slug === slug) || null;
}

function getActionRequirement(actionLabel) {
  const action = cleanText(actionLabel, 200).toLowerCase();
  if (action.includes('approve')) return 'approve';
  if (
    action.includes('create')
    || action.includes('assign')
    || action.includes('connect')
    || action.includes('set ')
    || action.includes('set public')
    || action.includes('manage')
    || action.includes('map ')
    || action.includes('publish')
    || action.includes('schedule')
    || action.includes('archive')
    || action.includes('prepare')
    || action.includes('route')
    || action.includes('confirm')
    || action.includes('gate')
    || action.includes('define')
    || action.includes('update')
  ) return 'manage';
  if (action.includes('draft') || action.includes('capture') || action.includes('propose')) return 'contribute';
  if (action.includes('review') || action.includes('track') || action.includes('export')) return 'view';
  return 'contribute';
}

function canRolePerform(actorRole, moduleName, requiredAccess) {
  const access = roleAccessByModule[actorRole]?.[moduleName] || 'none';
  return (accessRank[access] || 0) >= (accessRank[requiredAccess] || 0);
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function sanitizePayload(payload) {
  const input = isPlainObject(payload) ? payload : {};
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (key.startsWith('$') || ['id', 'created_date', 'updated_date'].includes(key)) continue;
    output[key] = value;
  }
  return output;
}

function isActiveAssignment(assignment) {
  if (!assignment || assignment.status !== 'active') return false;
  if (!assignment.expires_at) return true;
  return new Date(assignment.expires_at).getTime() > Date.now();
}

async function assertRoleAssignment(databases, userId, actorRole) {
  const result = await databases.listDocuments(DB_ID, ADMIN_ROLE_ASSIGNMENTS_COLLECTION_ID, [
    Query.equal('actor_user_id', userId),
    Query.equal('role', actorRole),
    Query.equal('status', 'active'),
    Query.limit(10),
  ]);
  const assignment = result.documents.find(isActiveAssignment);
  if (!assignment) {
    return {
      ok: false,
      status: 403,
      error: 'Actor role is not assigned to this authenticated Appwrite user.',
    };
  }
  return {
    ok: true,
    assignmentId: assignment.$id,
  };
}

function validatePayload(payload) {
  const errors = [];
  const modulePlan = findModule(payload);
  const actorRole = normalizeRole(payload.actor_role || payload.actorRole);
  const collectionId = cleanText(payload.collection_id || payload.collectionId, 100);
  const mutation = cleanText(payload.mutation, 80);
  const moduleAction = cleanText(payload.module_action || payload.moduleAction, 200);
  const recordId = cleanText(payload.record_id || payload.document_id || payload.recordId || payload.documentId, 128);
  const writePayload = sanitizePayload(payload.payload);
  const externalGateConfirmed = payload.external_gate_confirmed === true || payload.externalGateConfirmed === true;

  if (!modulePlan) {
    return { errors: ['Detroit Dynamo admin module was not found.'], status: 404 };
  }
  if (!actorRole) errors.push('actor_role must be a planned Detroit Dynamo admin role');
  if (!collectionId || !modulePlan.collectionIds.includes(collectionId)) {
    errors.push('collection_id must belong to the requested Detroit Dynamo admin module.');
  }
  if (!mutations.includes(mutation)) errors.push('mutation must be create_record, update_record, or archive_record');
  if (!moduleAction || !modulePlan.enabledActions.includes(moduleAction)) {
    errors.push('module_action must be one of the requested Detroit Dynamo admin module actions.');
  }
  if (['update_record', 'archive_record'].includes(mutation) && !recordId) {
    errors.push('record_id is required for update_record and archive_record.');
  }
  if (['create_record', 'update_record'].includes(mutation) && Object.keys(writePayload).length === 0) {
    errors.push('payload must include at least one writable field.');
  }
  const requiredAccess = getActionRequirement(moduleAction);
  if (actorRole && moduleAction && !canRolePerform(actorRole, modulePlan.module, requiredAccess)) {
    return {
      errors: ['Actor role does not have the required access for this Detroit Dynamo admin action.'],
      status: 403,
      modulePlan,
      actorRole,
      collectionId,
      mutation,
      moduleAction,
      recordId,
      writePayload,
      requiredAccess: getActionRequirement(moduleAction),
      externalGateConfirmed,
    };
  }

  if (modulePlan.status === 'external_gate' && !externalGateConfirmed) {
    return {
      errors: ['External readiness gate must be confirmed before this Detroit Dynamo module write.'],
      status: 409,
      modulePlan,
      actorRole,
      collectionId,
      mutation,
      moduleAction,
      recordId,
      writePayload,
      requiredAccess,
      externalGateConfirmed,
    };
  }

  return {
    errors,
    status: errors.length ? 400 : 200,
    modulePlan,
    actorRole,
    collectionId,
    mutation,
    moduleAction,
    recordId,
    writePayload,
    requiredAccess,
    externalGateConfirmed,
  };
}

function buildAuditEvent({ userId, validated, documentId, now, req }) {
  const metadata = {
    module: validated.modulePlan.module,
    module_slug: validated.modulePlan.slug,
    mutation: validated.mutation,
    module_action: validated.moduleAction,
    required_access: validated.requiredAccess,
    external_gate_confirmed: validated.externalGateConfirmed,
    payload_keys: Object.keys(validated.writePayload),
  };

  return {
    actor_user_id: userId,
    actor_role: validated.actorRole,
    action: 'admin_module_write_action',
    target_model: modelByCollection[validated.collectionId] || '',
    target_collection_id: validated.collectionId,
    target_record_id: documentId,
    event_summary: `${validated.actorRole} performed ${validated.mutation} on ${validated.modulePlan.module}.`,
    metadata_json: JSON.stringify(metadata),
    ip_address: requestIp(req),
    created_at: now,
  };
}

export default async ({ req, res, error }) => {
  try {
    const userId = appwriteUserId(req);
    if (!userId) return res.json({ error: 'Detroit Dynamo admin module write requires an authenticated Appwrite user.' }, 401);

    const payload = parseBody(req);
    const validated = validatePayload(payload);
    if (validated.errors.length) {
      return res.json({
        error: validated.errors[0],
        errors: validated.errors,
      }, validated.status);
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const roleAssignment = await assertRoleAssignment(databases, userId, validated.actorRole);
    if (!roleAssignment.ok) {
      return res.json({ error: roleAssignment.error }, roleAssignment.status);
    }

    const now = new Date().toISOString();
    let document;
    if (validated.mutation === 'create_record') {
      document = await databases.createDocument(DB_ID, validated.collectionId, ID.unique(), {
        ...validated.writePayload,
        created_at: now,
        updated_at: now,
      });
    } else {
      document = await databases.updateDocument(DB_ID, validated.collectionId, validated.recordId, {
        ...validated.writePayload,
        updated_at: now,
      });
    }

    const auditEvent = await databases.createDocument(
      DB_ID,
      AUDIT_COLLECTION_ID,
      ID.unique(),
      buildAuditEvent({
        userId,
        validated,
        documentId: document.$id,
        now,
        req,
      }),
    );

    return res.json({
      success: true,
      function_id: 'detroitDynamoAdminModuleWriteAction',
      mutation: validated.mutation,
      module: validated.modulePlan.module,
      module_slug: validated.modulePlan.slug,
      actor_role: validated.actorRole,
      actor_user_id: userId,
      role_assignment_id: roleAssignment.assignmentId,
      collection_id: validated.collectionId,
      model: modelByCollection[validated.collectionId] || '',
      record_id: document.$id,
      audit_event_id: auditEvent.$id,
    });
  } catch (err) {
    error(`detroitDynamoAdminModuleWriteAction: ${err?.message || err}`);
    return res.json({
      error: 'Detroit Dynamo admin module write action failed',
      detail: err?.message || String(err),
    }, 500);
  }
};
