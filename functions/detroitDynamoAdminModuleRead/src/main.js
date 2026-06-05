import { Client, Databases, Query } from 'node-appwrite';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'lctraining';
const DEFAULT_LIMIT = 25;
const ADMIN_ROLE_ASSIGNMENTS_COLLECTION_ID = 'dd_admin_role_assignments';

const moduleRegistry = [
  { module: 'Players', slug: 'players', collectionIds: ['dd_players', 'dd_tryout_registrations', 'dd_teams', 'dd_waivers'], ownerRoles: ['Registrar', 'Club Director'] },
  { module: 'Parents/guardians', slug: 'parents-guardians', collectionIds: ['dd_parent_guardians', 'dd_players', 'dd_waivers'], ownerRoles: ['Registrar'] },
  { module: 'Coaches', slug: 'coaches', collectionIds: ['dd_coaches', 'dd_staff_members', 'dd_teams', 'dd_programs'], ownerRoles: ['Training Director', 'Club Director'] },
  { module: 'Teams', slug: 'teams', collectionIds: ['dd_teams', 'dd_players', 'dd_coaches', 'dd_staff_members'], ownerRoles: ['Club Director', 'Team Manager', 'Registrar'] },
  { module: 'Age groups', slug: 'age-groups', collectionIds: ['dd_teams', 'dd_programs', 'dd_players'], ownerRoles: ['Club Director', 'Registrar'] },
  { module: 'Training programs', slug: 'training-programs', collectionIds: ['dd_programs', 'dd_training_packages', 'dd_camps_clinics'], ownerRoles: ['Training Director'] },
  { module: 'Training bookings', slug: 'training-bookings', collectionIds: ['dd_bookings', 'dd_training_sessions', 'dd_training_packages', 'dd_contact_leads'], ownerRoles: ['Training Director', 'Coach'] },
  { module: 'Tryout registrations', slug: 'tryout-registrations', collectionIds: ['dd_tryout_registrations', 'dd_players', 'dd_teams', 'dd_parent_guardians'], ownerRoles: ['Registrar', 'Club Director'] },
  { module: 'Camp registrations', slug: 'camp-registrations', collectionIds: ['dd_camps_clinics', 'dd_players', 'dd_parent_guardians', 'dd_waivers'], ownerRoles: ['Training Director', 'Registrar'] },
  { module: 'Payments/packages', slug: 'payments-packages', collectionIds: ['dd_payments', 'dd_training_packages', 'dd_camps_clinics', 'dd_sponsors'], ownerRoles: ['Master Admin', 'Training Director'] },
  { module: 'Waivers/forms', slug: 'waivers-forms', collectionIds: ['dd_waivers', 'dd_players', 'dd_parent_guardians', 'dd_camps_clinics'], ownerRoles: ['Registrar', 'Master Admin'] },
  { module: 'News posts', slug: 'news-posts', collectionIds: ['dd_news_posts', 'dd_staff_members', 'dd_sponsors', 'dd_match_results'], ownerRoles: ['Media/Admin Staff', 'Club Director'] },
  { module: 'Sponsors', slug: 'sponsors', collectionIds: ['dd_sponsors', 'dd_contact_leads', 'dd_news_posts'], ownerRoles: ['Media/Admin Staff', 'Club Director'] },
  { module: 'Schedules/results', slug: 'schedules-results', collectionIds: ['dd_match_fixtures', 'dd_match_results', 'dd_teams', 'dd_news_posts'], ownerRoles: ['Team Manager', 'Club Director'] },
  { module: 'Contact leads', slug: 'contact-leads', collectionIds: ['dd_contact_leads', 'dd_bookings', 'dd_tryout_registrations', 'dd_sponsors'], ownerRoles: ['Media/Admin Staff', 'Training Director', 'Registrar'] },
  { module: 'Website content sections', slug: 'website-content-sections', collectionIds: ['dd_news_posts', 'dd_staff_members', 'dd_sponsors', 'dd_programs'], ownerRoles: ['Media/Admin Staff', 'Club Director'] },
];

const adminRoles = [
  'Master Admin',
  'Club Director',
  'Training Director',
  'Coach',
  'Team Manager',
  'Registrar',
  'Media/Admin Staff',
];

const allModuleNames = moduleRegistry.map((item) => item.module);

const readableModulesByRole = {
  'Master Admin': allModuleNames,
  'Club Director': allModuleNames,
  'Training Director': allModuleNames,
  'Coach': [
    'Players',
    'Parents/guardians',
    'Coaches',
    'Teams',
    'Age groups',
    'Training programs',
    'Training bookings',
    'Tryout registrations',
    'Camp registrations',
    'Waivers/forms',
    'Schedules/results',
  ],
  'Team Manager': allModuleNames,
  Registrar: [
    'Players',
    'Parents/guardians',
    'Coaches',
    'Teams',
    'Age groups',
    'Training programs',
    'Training bookings',
    'Tryout registrations',
    'Camp registrations',
    'Payments/packages',
    'Waivers/forms',
    'Schedules/results',
    'Contact leads',
    'Website content sections',
  ],
  'Media/Admin Staff': [
    'Players',
    'Coaches',
    'Teams',
    'Age groups',
    'Training programs',
    'Tryout registrations',
    'Camp registrations',
    'News posts',
    'Sponsors',
    'Schedules/results',
    'Contact leads',
    'Website content sections',
  ],
};

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
  dd_admin_audit_events: 'AdminAuditEvent',
  dd_admin_role_assignments: 'AdminRoleAssignment',
};

function cleanText(value, max = 2000) {
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

function canReadModule(actorRole, moduleName) {
  return (readableModulesByRole[actorRole] || []).includes(moduleName);
}

function readLimit(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(parsed, DEFAULT_LIMIT);
}

function sanitizeDocument(document) {
  const { $permissions, ...safeDocument } = document;
  return safeDocument;
}

async function assertRoleAssignment(databases, userId, actorRole) {
  const result = await databases.listDocuments(DB_ID, ADMIN_ROLE_ASSIGNMENTS_COLLECTION_ID, [
    Query.equal('actor_user_id', userId),
    Query.equal('role', actorRole),
    Query.equal('status', 'active'),
    Query.limit(1),
  ]);
  const assignment = result.documents[0];
  if (!assignment) {
    return {
      ok: false,
      error: 'Actor role is not assigned to this authenticated Appwrite user.',
      status: 403,
    };
  }

  if (assignment.expires_at && new Date(assignment.expires_at).getTime() <= Date.now()) {
    return {
      ok: false,
      error: 'Actor role assignment has expired.',
      status: 403,
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
  const limit = readLimit(payload.limit);
  const cursor = cleanText(payload.cursor || payload.cursor_after || payload.cursorAfter, 128);

  if (!modulePlan) {
    return {
      errors: ['Detroit Dynamo admin module was not found.'],
      status: 404,
      modulePlan: null,
      actorRole,
      collectionIds: [],
      limit,
      cursor,
    };
  }
  if (!actorRole) errors.push('actor_role must be a planned Detroit Dynamo admin role');
  if (actorRole && !canReadModule(actorRole, modulePlan.module)) {
    return {
      errors: ['Actor role does not have view access to this Detroit Dynamo admin module.'],
      status: 403,
      modulePlan,
      actorRole,
      collectionIds: [],
      limit,
      cursor,
    };
  }
  if (collectionId && !modulePlan.collectionIds.includes(collectionId)) {
    return {
      errors: ['collection_id must belong to the requested Detroit Dynamo admin module.'],
      status: 400,
      modulePlan,
      actorRole,
      collectionIds: [],
      limit,
      cursor,
    };
  }

  return {
    errors,
    status: errors.length ? 400 : 200,
    modulePlan,
    actorRole,
    collectionIds: collectionId ? [collectionId] : modulePlan.collectionIds,
    limit,
    cursor,
  };
}

export default async ({ req, res, error }) => {
  try {
    const userId = appwriteUserId(req);
    if (!userId) return res.json({ error: 'Detroit Dynamo admin module read requires an authenticated Appwrite user.' }, 401);

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
      return res.json({
        error: roleAssignment.error,
      }, roleAssignment.status);
    }

    const queries = [Query.limit(validated.limit)];
    if (validated.cursor) queries.push(Query.cursorAfter(validated.cursor));

    const collections = await Promise.all(validated.collectionIds.map(async (collectionId) => {
      const result = await databases.listDocuments(DB_ID, collectionId, queries);
      return {
        collection_id: collectionId,
        model: modelByCollection[collectionId] || '',
        total: result.total,
        documents: result.documents.map(sanitizeDocument),
      };
    }));

    return res.json({
      success: true,
      function_id: 'detroitDynamoAdminModuleRead',
      module: validated.modulePlan.module,
      module_slug: validated.modulePlan.slug,
      actor_role: validated.actorRole,
      actor_user_id: userId,
      role_assignment_id: roleAssignment.assignmentId,
      limit: validated.limit,
      collections,
    });
  } catch (err) {
    error(`detroitDynamoAdminModuleRead: ${err?.message || err}`);
    return res.json({
      error: 'Detroit Dynamo admin module read failed',
      detail: err?.message || String(err),
    }, 500);
  }
};
