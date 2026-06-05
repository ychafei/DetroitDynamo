import { rpc } from '@/lib/rpc';
import { canDetroitDynamoRoleAccess } from './detroitDynamoAdminAccess.js';
import {
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoCollectionPlan,
} from './detroitDynamoDataModel.js';
import {
  detroitDynamoAdminModuleReadDefaultLimit,
  detroitDynamoAdminModuleReadFunctionId,
} from './detroitDynamoAdminModuleReadContract.js';

export const DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY = 'detroit-dynamo-preview-module-read-actions';
export const DETROIT_DYNAMO_MODULE_READ_BACKEND_STORAGE_KEY = 'detroit-dynamo-module-read-backend';

const collectionById = Object.fromEntries(
  detroitDynamoCollectionPlan.map((item) => [item.collectionId, item]),
);

function cleanText(value, max = 20000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
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
    throw new Error('Detroit Dynamo module read preview storage requires a browser environment.');
  }

  window.localStorage.setItem(storageKey, JSON.stringify(records.slice(0, limit)));
}

function shouldUseAppwriteModuleReads() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DETROIT_DYNAMO_MODULE_READ_BACKEND_STORAGE_KEY) === 'appwrite';
}

function findModuleBySlug(moduleSlug) {
  const slug = cleanText(moduleSlug, 120);
  return detroitDynamoAdminModuleRegistry.find((item) => item.slug === slug) || null;
}

function modelForCollection(collectionId) {
  return collectionById[collectionId]?.model || '';
}

function normalizeLimit(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return detroitDynamoAdminModuleReadDefaultLimit;
  return Math.min(parsed, detroitDynamoAdminModuleReadDefaultLimit);
}

function localPreviewCollections(payload, localDocuments = []) {
  const collectionIds = payload.collection_id
    ? [payload.collection_id]
    : findModuleBySlug(payload.module_slug)?.collectionIds || [];
  const limit = normalizeLimit(payload.limit);

  return collectionIds.map((collectionId) => {
    const documents = localDocuments
      .filter((item) => item.collection_id === collectionId)
      .map((item) => item.document || {})
      .slice(0, limit);

    return {
      collection_id: collectionId,
      model: modelForCollection(collectionId),
      total: documents.length,
      documents,
    };
  });
}

function writePreviewModuleReadAction(payload, localDocuments = [], overrides = {}) {
  const modulePlan = findModuleBySlug(payload.module_slug);
  const now = new Date().toISOString();
  const collections = localPreviewCollections(payload, localDocuments);
  const documentCount = collections.reduce((sum, collection) => sum + collection.documents.length, 0);
  const record = {
    id: `dd-module-read-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    function_id: detroitDynamoAdminModuleReadFunctionId,
    status: 'preview_module_read_captured',
    destination: 'Local preview dataset for future protected Detroit Dynamo module read action',
    module: modulePlan?.module || payload.module_slug,
    module_slug: payload.module_slug,
    actor_role: payload.actor_role,
    collection_id: payload.collection_id,
    limit: normalizeLimit(payload.limit),
    cursor: payload.cursor || '',
    collections,
    document_count: documentCount,
    created_at: now,
    updated_at: now,
    ...overrides,
  };

  writeJsonArray(DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY, [
    record,
    ...readJsonArray(DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY),
  ], 100);
  return record;
}

export function getDetroitDynamoModuleReadBackendMode() {
  return shouldUseAppwriteModuleReads() ? 'appwrite' : 'local';
}

export function setDetroitDynamoModuleReadBackendMode(mode) {
  if (typeof window === 'undefined') return;
  if (mode === 'appwrite') {
    window.localStorage.setItem(DETROIT_DYNAMO_MODULE_READ_BACKEND_STORAGE_KEY, 'appwrite');
    return;
  }
  window.localStorage.removeItem(DETROIT_DYNAMO_MODULE_READ_BACKEND_STORAGE_KEY);
}

export function getDetroitDynamoPreviewModuleReadActions() {
  return readJsonArray(DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY);
}

export function validateDetroitDynamoAdminModuleReadPayload(payload) {
  const moduleSlug = cleanText(payload?.module_slug || payload?.moduleSlug, 120);
  const modulePlan = findModuleBySlug(moduleSlug);
  const actorRole = detroitDynamoAdminRoles.find((role) => role === cleanText(payload?.actor_role || payload?.actorRole, 100)) || '';
  const collectionId = cleanText(payload?.collection_id || payload?.collectionId, 100);
  const limit = normalizeLimit(payload?.limit);
  const cursor = cleanText(payload?.cursor, 128);
  const errors = [];

  if (!modulePlan) {
    errors.push('Choose a planned Detroit Dynamo admin module.');
  }
  if (!actorRole) {
    errors.push('Choose a planned Detroit Dynamo admin role.');
  }
  if (modulePlan && collectionId && !modulePlan.collectionIds.includes(collectionId)) {
    errors.push('Choose a collection that belongs to this Detroit Dynamo admin module.');
  }
  if (modulePlan && actorRole && !canDetroitDynamoRoleAccess(actorRole, modulePlan.module, 'view')) {
    errors.push('Actor role does not have view access to this Detroit Dynamo admin module.');
  }

  return {
    ok: errors.length === 0,
    errors,
    modulePlan,
    payload: {
      module_slug: moduleSlug,
      collection_id: collectionId,
      actor_role: actorRole,
      limit,
      cursor,
    },
  };
}

export async function submitDetroitDynamoAdminModuleReadAction(payload, options = {}) {
  const validated = validateDetroitDynamoAdminModuleReadPayload(payload);
  if (!validated.ok) {
    throw new Error(validated.errors[0] || 'Detroit Dynamo admin module read payload is invalid.');
  }

  const localDocuments = Array.isArray(options.localDocuments) ? options.localDocuments : [];
  if (!shouldUseAppwriteModuleReads()) {
    return writePreviewModuleReadAction(validated.payload, localDocuments);
  }

  try {
    const { data } = await rpc.invoke(detroitDynamoAdminModuleReadFunctionId, validated.payload);
    const now = new Date().toISOString();
    const collections = Array.isArray(data?.collections) ? data.collections : [];
    const documentCount = collections.reduce((sum, collection) => (
      sum + (Array.isArray(collection.documents) ? collection.documents.length : 0)
    ), 0);
    const record = {
      id: `dd-module-read-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'appwrite_module_read_submitted',
      destination: 'Appwrite Detroit Dynamo admin module read function',
      created_at: now,
      updated_at: now,
      ...validated.payload,
      module: data?.module || validated.modulePlan?.module || validated.payload.module_slug,
      collections,
      document_count: documentCount,
      appwrite_response: data,
      role_assignment_id: data?.role_assignment_id || '',
    };
    writeJsonArray(DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY, [
      record,
      ...readJsonArray(DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY),
    ], 100);
    return record;
  } catch (error) {
    return writePreviewModuleReadAction(validated.payload, localDocuments, {
      status: 'preview_module_read_after_action_error',
      destination: 'Local preview dataset fallback after Appwrite module read error',
      backend_error: error?.message || String(error),
    });
  }
}

export function clearDetroitDynamoPreviewModuleReadActions() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DETROIT_DYNAMO_MODULE_READ_STORAGE_KEY);
}
