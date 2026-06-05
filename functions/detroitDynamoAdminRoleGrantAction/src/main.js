import { Client, Databases, ID, Query } from 'node-appwrite';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'lctraining';
const ROLE_ASSIGNMENTS_COLLECTION_ID = 'dd_admin_role_assignments';
const AUDIT_COLLECTION_ID = 'dd_admin_audit_events';
const BOOTSTRAP_ADMIN_USER_ID = process.env.DETROIT_DYNAMO_BOOTSTRAP_ADMIN_USER_ID || '';

const adminRoles = [
  'Master Admin',
  'Club Director',
  'Training Director',
  'Coach',
  'Team Manager',
  'Registrar',
  'Media/Admin Staff',
];

const grantActions = [
  'grant_role',
  'suspend_role',
  'revoke_role',
  'expire_role',
  'reactivate_role',
];

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

function parseExpiration(value) {
  const text = cleanText(value, 80);
  if (!text) return '';
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

function isActiveAssignment(assignment) {
  if (!assignment || assignment.status !== 'active') return false;
  if (!assignment.expires_at) return true;
  return new Date(assignment.expires_at).getTime() > Date.now();
}

function validatePayload(payload) {
  const errors = [];
  const action = cleanText(payload.action, 80);
  const role = normalizeRole(payload.role);
  const targetUserId = cleanText(payload.target_user_id || payload.targetUserId || payload.actor_user_id || payload.actorUserId, 128);
  const assignmentId = cleanText(payload.assignment_id || payload.assignmentId, 128);
  const email = cleanText(payload.email, 320);
  const expiresAt = parseExpiration(payload.expires_at || payload.expiresAt);
  const scopeNote = cleanText(payload.scope_note || payload.scopeNote, 20000);

  if (!grantActions.includes(action)) errors.push('action must be a supported Detroit Dynamo admin role grant action');
  if (!role) errors.push('role must be a planned Detroit Dynamo admin role');
  if (action === 'grant_role' && !targetUserId) errors.push('target_user_id is required for grant_role');
  if (action !== 'grant_role' && !assignmentId) errors.push('assignment_id is required for role assignment mutations');
  if ((payload.expires_at || payload.expiresAt) && !expiresAt) errors.push('expires_at must be a valid ISO date when provided');

  return {
    errors,
    action,
    role,
    targetUserId,
    assignmentId,
    email,
    expiresAt,
    scopeNote,
  };
}

async function hasActiveMasterAdmin(databases, userId) {
  const result = await databases.listDocuments(DB_ID, ROLE_ASSIGNMENTS_COLLECTION_ID, [
    Query.equal('actor_user_id', userId),
    Query.equal('role', 'Master Admin'),
    Query.equal('status', 'active'),
    Query.limit(10),
  ]);
  return result.documents.some(isActiveAssignment);
}

async function countActiveMasterAdmins(databases) {
  const result = await databases.listDocuments(DB_ID, ROLE_ASSIGNMENTS_COLLECTION_ID, [
    Query.equal('role', 'Master Admin'),
    Query.equal('status', 'active'),
    Query.limit(100),
  ]);
  return result.documents.filter(isActiveAssignment).length;
}

async function findExistingActiveAssignment(databases, userId, role) {
  const result = await databases.listDocuments(DB_ID, ROLE_ASSIGNMENTS_COLLECTION_ID, [
    Query.equal('actor_user_id', userId),
    Query.equal('role', role),
    Query.equal('status', 'active'),
    Query.limit(10),
  ]);
  return result.documents.find(isActiveAssignment) || null;
}

function canBootstrapMasterAdmin({ activeMasterAdminCount, userId, validated }) {
  return activeMasterAdminCount === 0
    && validated.action === 'grant_role'
    && validated.role === 'Master Admin'
    && BOOTSTRAP_ADMIN_USER_ID
    && userId === BOOTSTRAP_ADMIN_USER_ID;
}

function buildAssignmentDocument({ userId, validated, now }) {
  const document = {
    actor_user_id: validated.targetUserId,
    email: validated.email,
    role: validated.role,
    status: 'active',
    assigned_by_user_id: userId,
    assigned_at: now,
    scope_note: validated.scopeNote,
    created_at: now,
    updated_at: now,
  };
  if (validated.expiresAt) document.expires_at = validated.expiresAt;
  return document;
}

function buildAuditEvent({ userId, actorRole, action, assignment, previousStatus, nextStatus, validated, now, req }) {
  const metadata = {
    role: assignment.role || validated.role,
    role_previous_status: previousStatus,
    role_next_status: nextStatus,
    target_user_id: assignment.actor_user_id || validated.targetUserId,
    email: assignment.email || validated.email,
    expires_at: assignment.expires_at || validated.expiresAt || '',
    scope_note: validated.scopeNote || assignment.scope_note || '',
  };

  return {
    actor_user_id: userId,
    actor_role: actorRole,
    action,
    target_model: 'AdminRoleAssignment',
    target_collection_id: ROLE_ASSIGNMENTS_COLLECTION_ID,
    target_record_id: assignment.$id,
    event_summary: `${actorRole} performed ${action} for ${metadata.role}.`,
    metadata_json: JSON.stringify(metadata),
    ip_address: requestIp(req),
    created_at: now,
  };
}

function mutationPatch({ action, validated, now }) {
  if (action === 'suspend_role') {
    return {
      status: 'suspended',
      scope_note: validated.scopeNote,
      updated_at: now,
    };
  }

  if (action === 'revoke_role') {
    return {
      status: 'revoked',
      scope_note: validated.scopeNote,
      updated_at: now,
    };
  }

  if (action === 'expire_role') {
    return {
      expires_at: validated.expiresAt || now,
      scope_note: validated.scopeNote,
      updated_at: now,
    };
  }

  const patch = {
    status: 'active',
    scope_note: validated.scopeNote,
    updated_at: now,
  };
  if (validated.expiresAt) patch.expires_at = validated.expiresAt;
  return patch;
}

export default async ({ req, res, error }) => {
  try {
    const userId = appwriteUserId(req);
    if (!userId) return res.json({ error: 'Detroit Dynamo admin role grant requires an authenticated Appwrite user.' }, 401);

    const payload = parseBody(req);
    const validated = validatePayload(payload);
    if (validated.errors.length) {
      return res.json({
        error: 'Invalid Detroit Dynamo admin role grant payload',
        errors: validated.errors,
      }, 400);
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const activeMasterAdminCount = await countActiveMasterAdmins(databases);
    const bootstrapAllowed = canBootstrapMasterAdmin({ activeMasterAdminCount, userId, validated });
    const masterAdminAllowed = bootstrapAllowed || await hasActiveMasterAdmin(databases, userId);

    if (!masterAdminAllowed) {
      if (validated.action === 'grant_role' && validated.role === 'Master Admin' && activeMasterAdminCount === 0) {
        return res.json({ error: 'Bootstrap Master Admin grant is not authorized for this Appwrite user.' }, 403);
      }
      return res.json({ error: 'Only an active Master Admin can manage Detroit Dynamo admin role grants.' }, 403);
    }

    const now = new Date().toISOString();
    const actorRole = bootstrapAllowed ? 'Bootstrap Master Admin' : 'Master Admin';
    let assignment;
    let previousStatus = 'none';
    let nextStatus = 'active';

    if (validated.action === 'grant_role') {
      const existing = await findExistingActiveAssignment(databases, validated.targetUserId, validated.role);
      if (existing) {
        return res.json({
          error: 'Detroit Dynamo admin role assignment already exists for this user and role.',
          assignment_id: existing.$id,
        }, 409);
      }

      assignment = await databases.createDocument(
        DB_ID,
        ROLE_ASSIGNMENTS_COLLECTION_ID,
        ID.unique(),
        buildAssignmentDocument({ userId, validated, now }),
      );
    } else {
      assignment = await databases.getDocument(DB_ID, ROLE_ASSIGNMENTS_COLLECTION_ID, validated.assignmentId).catch((err) => {
        if (err?.code === 404) return null;
        throw err;
      });

      if (!assignment) {
        return res.json({ error: 'Detroit Dynamo admin role assignment was not found.' }, 404);
      }

      if (assignment.actor_user_id === userId && assignment.role === 'Master Admin' && ['suspend_role', 'revoke_role', 'expire_role'].includes(validated.action)) {
        return res.json({ error: 'Master Admin cannot remove their own active role grant with this action.' }, 409);
      }

      previousStatus = assignment.status || 'unknown';
      const patch = mutationPatch({ action: validated.action, validated, now });
      assignment = await databases.updateDocument(DB_ID, ROLE_ASSIGNMENTS_COLLECTION_ID, assignment.$id, patch);
      nextStatus = assignment.status || patch.status || previousStatus;
    }

    const auditEvent = await databases.createDocument(
      DB_ID,
      AUDIT_COLLECTION_ID,
      ID.unique(),
      buildAuditEvent({
        userId,
        actorRole,
        action: validated.action,
        assignment,
        previousStatus,
        nextStatus,
        validated,
        now,
        req,
      }),
    );

    return res.json({
      success: true,
      function_id: 'detroitDynamoAdminRoleGrantAction',
      action: validated.action,
      actor_user_id: userId,
      actor_role: actorRole,
      assignment_id: assignment.$id,
      role: assignment.role,
      status: assignment.status,
      expires_at: assignment.expires_at || '',
      audit_event_id: auditEvent.$id,
    });
  } catch (err) {
    error(`detroitDynamoAdminRoleGrantAction: ${err?.message || err}`);
    return res.json({
      error: 'Detroit Dynamo admin role grant action failed',
      detail: err?.message || String(err),
    }, 500);
  }
};
