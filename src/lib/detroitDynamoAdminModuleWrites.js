import { rpc } from '@/lib/rpc';
import {
  canDetroitDynamoRoleAccess,
  getDetroitDynamoActionRequirement,
} from './detroitDynamoAdminAccess.js';
import {
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoCollectionPlan,
} from './detroitDynamoDataModel.js';
import { DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY } from './detroitDynamoLeads.js';
import {
  detroitDynamoAdminModuleWriteFunctionId,
  detroitDynamoAdminModuleWriteMutations,
} from './detroitDynamoAdminModuleWriteContract.js';

export const DETROIT_DYNAMO_MODULE_WRITE_STORAGE_KEY = 'detroit-dynamo-preview-module-write-actions';
export const DETROIT_DYNAMO_MODULE_WRITE_BACKEND_STORAGE_KEY = 'detroit-dynamo-module-write-backend';

const collectionById = Object.fromEntries(
  detroitDynamoCollectionPlan.map((item) => [item.collectionId, item]),
);

function cleanText(value, max = 20000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function parsePayload(value) {
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  }
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function readJsonArray(storageKey) {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function writeJsonArray(storageKey, records, limit = 100) {
  if (typeof window === 'undefined') {
    throw new Error('Detroit Dynamo module write preview storage requires a browser environment.');
  }

  window.localStorage.setItem(storageKey, JSON.stringify(records.slice(0, limit)));
}

function shouldUseAppwriteModuleWrites() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DETROIT_DYNAMO_MODULE_WRITE_BACKEND_STORAGE_KEY) === 'appwrite';
}

function findModuleBySlug(moduleSlug) {
  const slug = cleanText(moduleSlug, 120);
  return detroitDynamoAdminModuleRegistry.find((item) => item.slug === slug) || null;
}

function modelForCollection(collectionId) {
  return collectionById[collectionId]?.model || '';
}

function appendPreviewAuditEvent(record, payload, overrides = {}) {
  const auditEvent = {
    id: record.audit_event_id,
    actor_user_id: 'preview-local-admin',
    actor_role: payload.actor_role,
    action: 'admin_module_write_action',
    target_model: modelForCollection(payload.collection_id),
    target_collection_id: payload.collection_id,
    target_record_id: payload.record_id || record.record_id,
    previous_status: payload.mutation === 'create_record' ? 'not_created' : 'existing_record',
    next_status: payload.mutation,
    event_summary: `${payload.actor_role} previewed ${payload.mutation.replaceAll('_', ' ')} for ${record.module}.`,
    metadata_json: JSON.stringify({
      module: record.module,
      module_slug: payload.module_slug,
      module_action: payload.module_action,
      required_access: record.required_access,
      external_gate_confirmed: payload.external_gate_confirmed,
      payload_keys: Object.keys(payload.payload || {}),
      backend_mode: overrides.status || record.status,
    }),
    ip_address: 'local-preview',
    created_at: record.created_at,
  };
  writeJsonArray(DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY, [
    auditEvent,
    ...readJsonArray(DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY),
  ], 200);
  return auditEvent;
}

function writePreviewModuleWriteAction(payload, overrides = {}) {
  const modulePlan = findModuleBySlug(payload.module_slug);
  const now = new Date().toISOString();
  const recordId = payload.record_id || `preview-created-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record = {
    id: `dd-module-write-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    function_id: detroitDynamoAdminModuleWriteFunctionId,
    status: 'preview_module_write_captured',
    destination: 'Local preview queue for future protected Detroit Dynamo module write action',
    module: modulePlan?.module || payload.module_slug,
    module_slug: payload.module_slug,
    module_action: payload.module_action,
    mutation: payload.mutation,
    actor_role: payload.actor_role,
    collection_id: payload.collection_id,
    model: modelForCollection(payload.collection_id),
    record_id: recordId,
    required_access: getDetroitDynamoActionRequirement(payload.module_action),
    external_gate_confirmed: Boolean(payload.external_gate_confirmed),
    payload: payload.payload || {},
    audit_event_id: `dd-module-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: now,
    updated_at: now,
    ...overrides,
  };

  writeJsonArray(DETROIT_DYNAMO_MODULE_WRITE_STORAGE_KEY, [
    record,
    ...readJsonArray(DETROIT_DYNAMO_MODULE_WRITE_STORAGE_KEY),
  ], 100);
  appendPreviewAuditEvent(record, payload, overrides);
  return record;
}

export function getDetroitDynamoModuleWriteBackendMode() {
  return shouldUseAppwriteModuleWrites() ? 'appwrite' : 'local';
}

export function setDetroitDynamoModuleWriteBackendMode(mode) {
  if (typeof window === 'undefined') return;
  if (mode === 'appwrite') {
    window.localStorage.setItem(DETROIT_DYNAMO_MODULE_WRITE_BACKEND_STORAGE_KEY, 'appwrite');
    return;
  }
  window.localStorage.removeItem(DETROIT_DYNAMO_MODULE_WRITE_BACKEND_STORAGE_KEY);
}

export function getDetroitDynamoPreviewModuleWriteActions() {
  return readJsonArray(DETROIT_DYNAMO_MODULE_WRITE_STORAGE_KEY);
}

export function validateDetroitDynamoAdminModuleWritePayload(payload) {
  const moduleSlug = cleanText(payload?.module_slug || payload?.moduleSlug, 120);
  const modulePlan = findModuleBySlug(moduleSlug);
  const actorRole = detroitDynamoAdminRoles.find((role) => role === cleanText(payload?.actor_role || payload?.actorRole, 100)) || '';
  const collectionId = cleanText(payload?.collection_id || payload?.collectionId, 100);
  const mutation = cleanText(payload?.mutation, 80);
  const moduleAction = cleanText(payload?.module_action || payload?.moduleAction, 200);
  const recordId = cleanText(payload?.record_id || payload?.recordId, 128);
  const externalGateConfirmed = payload?.external_gate_confirmed === true || payload?.externalGateConfirmed === true;
  const errors = [];
  let writePayload = {};

  try {
    writePayload = parsePayload(payload?.payload);
  } catch (_error) {
    errors.push('Payload must be valid JSON for the selected Detroit Dynamo module write.');
  }

  if (!modulePlan) {
    errors.push('Choose a planned Detroit Dynamo admin module.');
  }
  if (!actorRole) {
    errors.push('Choose a planned Detroit Dynamo admin role.');
  }
  if (!detroitDynamoAdminModuleWriteMutations.includes(mutation)) {
    errors.push('Choose create_record, update_record, or archive_record.');
  }
  if (!modulePlan?.collectionIds.includes(collectionId)) {
    errors.push('Choose a collection that belongs to this Detroit Dynamo admin module.');
  }
  if (!modulePlan?.enabledActions.includes(moduleAction)) {
    errors.push('Choose an action from this Detroit Dynamo admin module.');
  }
  if (['update_record', 'archive_record'].includes(mutation) && !recordId) {
    errors.push('Record id is required for update_record and archive_record.');
  }
  if (['create_record', 'update_record'].includes(mutation) && Object.keys(writePayload).length === 0) {
    errors.push('Payload must include at least one writable field.');
  }

  const requiredAccess = getDetroitDynamoActionRequirement(moduleAction);
  if (modulePlan && actorRole && moduleAction && !canDetroitDynamoRoleAccess(actorRole, modulePlan.module, requiredAccess)) {
    errors.push('Actor role does not have the required access for this Detroit Dynamo admin action.');
  }
  if (modulePlan?.status === 'external_gate' && !externalGateConfirmed) {
    errors.push('External readiness gate must be confirmed before this Detroit Dynamo module write.');
  }

  return {
    ok: errors.length === 0,
    errors,
    modulePlan,
    requiredAccess,
    payload: {
      module_slug: moduleSlug,
      collection_id: collectionId,
      model: modelForCollection(collectionId),
      mutation,
      module_action: moduleAction,
      actor_role: actorRole,
      record_id: recordId,
      external_gate_confirmed: externalGateConfirmed,
      payload: writePayload,
    },
  };
}

export async function submitDetroitDynamoAdminModuleWriteAction(payload) {
  const validated = validateDetroitDynamoAdminModuleWritePayload(payload);
  if (!validated.ok) {
    throw new Error(validated.errors[0] || 'Detroit Dynamo admin module write payload is invalid.');
  }

  if (!shouldUseAppwriteModuleWrites()) {
    return writePreviewModuleWriteAction(validated.payload);
  }

  try {
    const { data } = await rpc.invoke(detroitDynamoAdminModuleWriteFunctionId, validated.payload);
    return {
      id: data?.record_id || `dd-module-write-${Date.now()}`,
      status: 'appwrite_module_write_submitted',
      destination: 'Appwrite Detroit Dynamo admin module write function',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...validated.payload,
      appwrite_response: data,
      audit_event_id: data?.audit_event_id || '',
    };
  } catch (error) {
    return writePreviewModuleWriteAction(validated.payload, {
      status: 'preview_module_write_after_action_error',
      destination: 'Local preview queue fallback after Appwrite module write error',
      backend_error: error?.message || String(error),
    });
  }
}

export function clearDetroitDynamoPreviewModuleWriteActions() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DETROIT_DYNAMO_MODULE_WRITE_STORAGE_KEY);
}
