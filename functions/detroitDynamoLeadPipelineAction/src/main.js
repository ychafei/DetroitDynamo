import { Client, Databases, ID } from 'node-appwrite';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'lctraining';
const AUDIT_COLLECTION_ID = 'dd_admin_audit_events';

const collectionByModel = {
  ContactLead: 'dd_contact_leads',
  Booking: 'dd_bookings',
  TryoutRegistration: 'dd_tryout_registrations',
  Sponsor: 'dd_sponsors',
};

const modelByCollection = Object.fromEntries(
  Object.entries(collectionByModel).map(([model, collectionId]) => [collectionId, model]),
);

const adminRoles = [
  'Master Admin',
  'Club Director',
  'Training Director',
  'Coach',
  'Team Manager',
  'Registrar',
  'Media/Admin Staff',
];

const pipelineStages = {
  new: {
    label: 'New intake',
    maxAgeHours: 4,
    nextStatuses: ['triaged', 'closed_duplicate'],
    ownerAction: 'Confirm lead type, source route, contact information, and required context.',
  },
  triaged: {
    label: 'Owner assigned',
    maxAgeHours: 24,
    nextStatuses: ['contacted', 'closed_not_fit'],
    ownerAction: 'Assign owner and set the next follow-up channel.',
  },
  contacted: {
    label: 'First contact made',
    maxAgeHours: 48,
    nextStatuses: ['awaiting_response', 'evaluation_scheduled', 'package_discussion', 'closed_not_fit'],
    ownerAction: 'Log first contact and response window.',
  },
  awaiting_response: {
    label: 'Awaiting response',
    maxAgeHours: 96,
    nextStatuses: ['contacted', 'evaluation_scheduled', 'closed_not_fit'],
    ownerAction: 'Keep one clear follow-up date and close or schedule after response.',
  },
  package_discussion: {
    label: 'Package discussion',
    maxAgeHours: 96,
    nextStatuses: ['evaluation_scheduled', 'converted', 'closed_not_fit'],
    ownerAction: 'Discuss packages without collecting payment until packages are approved.',
  },
  evaluation_scheduled: {
    label: 'Evaluation or meeting scheduled',
    maxAgeHours: 72,
    nextStatuses: ['invited_or_waitlisted', 'converted', 'closed_no_show'],
    ownerAction: 'Confirm the session, tryout, sponsor call, or program-fit meeting.',
  },
  invited_or_waitlisted: {
    label: 'Decision pending',
    maxAgeHours: 120,
    nextStatuses: ['converted', 'closed_not_fit'],
    ownerAction: 'Record invite, waitlist, roster, package, camp, or sponsor-package decision.',
  },
  converted: {
    label: 'Converted to active record',
    maxAgeHours: 168,
    nextStatuses: ['archived'],
    ownerAction: 'Connect the lead to active backend records once modules are live.',
  },
  closed_not_fit: {
    label: 'Closed',
    maxAgeHours: 168,
    nextStatuses: ['archived'],
    ownerAction: 'Close with reason while preserving source context.',
  },
  closed_duplicate: {
    label: 'Closed duplicate',
    maxAgeHours: 24,
    nextStatuses: ['archived'],
    ownerAction: 'Merge duplicate context into the oldest useful record.',
  },
  closed_no_show: {
    label: 'Closed no-show',
    maxAgeHours: 72,
    nextStatuses: ['archived', 'evaluation_scheduled'],
    ownerAction: 'Record missed evaluation, meeting, or call.',
  },
  archived: {
    label: 'Archived',
    maxAgeHours: 720,
    nextStatuses: ['new'],
    ownerAction: 'Retain source and outcome while removing from active follow-up.',
  },
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

function addHours(isoDate, hours) {
  const parsed = new Date(isoDate);
  return new Date(parsed.getTime() + hours * 36e5).toISOString();
}

function appwriteUserId(req) {
  return cleanText(req.headers['x-appwrite-user-id'] || req.headers['X-Appwrite-User-Id'], 128);
}

function requestIp(req) {
  const forwarded = cleanText(req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'], 120);
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 120);
  return cleanText(req.headers['x-real-ip'] || req.headers['X-Real-Ip'], 120);
}

function resolveModel(payload) {
  const model = cleanText(payload.model, 100);
  const collectionId = cleanText(payload.collection_id || payload.collectionId, 100);
  if (collectionByModel[model]) return { model, collectionId: collectionByModel[model] };
  if (modelByCollection[collectionId]) return { model: modelByCollection[collectionId], collectionId };
  return { model: '', collectionId: '' };
}

function validatePayload(payload) {
  const errors = [];
  const { model, collectionId } = resolveModel(payload);
  const recordId = cleanText(payload.record_id || payload.document_id || payload.documentId, 128);
  const nextStatus = cleanText(payload.next_status || payload.pipeline_status, 64);
  const actorRole = cleanText(payload.actor_role || payload.actorRole, 100);
  const ownerRole = cleanText(payload.owner_role || payload.ownerRole || actorRole, 100);

  if (!model || !collectionId) errors.push('model or collection_id must target a pipeline-backed Detroit Dynamo collection');
  if (!recordId) errors.push('record_id is required');
  if (!pipelineStages[nextStatus]) errors.push('next_status is invalid');
  if (!adminRoles.includes(actorRole)) errors.push('actor_role must be a planned Detroit Dynamo admin role');
  if (ownerRole && !adminRoles.includes(ownerRole)) errors.push('owner_role must be a planned Detroit Dynamo admin role');

  return {
    errors,
    model,
    collectionId,
    recordId,
    nextStatus,
    actorRole,
    ownerRole,
    note: cleanText(payload.note, 20000),
  };
}

function buildAuditEvent({ userId, validated, currentStatus, nextStatus, note, now, req }) {
  const metadata = {
    pipeline_owner_role: validated.ownerRole,
    note,
  };

  return {
    actor_user_id: userId,
    actor_role: validated.actorRole,
    action: 'pipeline_status_transition',
    target_model: validated.model,
    target_collection_id: validated.collectionId,
    target_record_id: validated.recordId,
    previous_status: currentStatus,
    next_status: nextStatus,
    event_summary: `${validated.actorRole} moved ${validated.model} from ${currentStatus} to ${nextStatus}.`,
    metadata_json: JSON.stringify(metadata),
    ip_address: requestIp(req),
    created_at: now,
  };
}

export default async ({ req, res, error }) => {
  try {
    const userId = appwriteUserId(req);
    if (!userId) return res.json({ error: 'Detroit Dynamo pipeline action requires an authenticated Appwrite user.' }, 401);

    const payload = parseBody(req);
    const validated = validatePayload(payload);
    if (validated.errors.length) {
      return res.json({ error: 'Invalid Detroit Dynamo pipeline action payload', errors: validated.errors }, 400);
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const current = await databases.getDocument(DB_ID, validated.collectionId, validated.recordId);
    const currentStatus = cleanText(current.pipeline_status, 64) || 'new';
    const currentStage = pipelineStages[currentStatus];

    if (!currentStage) {
      return res.json({ error: `Current pipeline_status is invalid: ${currentStatus}` }, 409);
    }
    if (!currentStage.nextStatuses.includes(validated.nextStatus)) {
      return res.json({
        error: 'Pipeline transition is not allowed',
        from_status: currentStatus,
        to_status: validated.nextStatus,
        allowed_next_statuses: currentStage.nextStatuses,
      }, 409);
    }

    const nextStage = pipelineStages[validated.nextStatus];
    const now = new Date().toISOString();
    const eventCount = Number.parseInt(current.pipeline_event_count, 10) || 0;
    const note = validated.note || nextStage.ownerAction;
    const ownerRole = validated.ownerRole || cleanText(current.pipeline_owner_role, 100) || validated.actorRole;

    const updated = await databases.updateDocument(DB_ID, validated.collectionId, validated.recordId, {
      pipeline_status: validated.nextStatus,
      pipeline_owner_role: ownerRole,
      pipeline_due_at: addHours(now, nextStage.maxAgeHours),
      pipeline_updated_at: now,
      pipeline_last_note: note,
      pipeline_event_count: eventCount + 1,
      updated_at: now,
    });

    const auditEvent = await databases.createDocument(
      DB_ID,
      AUDIT_COLLECTION_ID,
      ID.unique(),
      buildAuditEvent({
        userId,
        validated: {
          ...validated,
          ownerRole,
        },
        currentStatus,
        nextStatus: validated.nextStatus,
        note,
        now,
        req,
      }),
    );

    return res.json({
      success: true,
      model: validated.model,
      collection_id: validated.collectionId,
      record_id: validated.recordId,
      from_status: currentStatus,
      to_status: validated.nextStatus,
      actor_role: validated.actorRole,
      actor_user_id: userId,
      owner_role: ownerRole,
      pipeline_event_count: updated.pipeline_event_count,
      pipeline_due_at: updated.pipeline_due_at,
      pipeline_updated_at: updated.pipeline_updated_at,
      audit_event_id: auditEvent.$id,
      note,
    });
  } catch (err) {
    error(`detroitDynamoLeadPipelineAction: ${err?.message || err}`);
    return res.json({
      error: 'Detroit Dynamo pipeline action failed',
      detail: err?.message || String(err),
    }, 500);
  }
};
