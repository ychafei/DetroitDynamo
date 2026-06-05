import { rpc } from '@/lib/rpc';
import { detroitDynamoAdminRoles } from './detroitDynamoDataModel.js';
import {
  detroitDynamoAdminRoleGrantActions,
  detroitDynamoAdminRoleGrantFunctionId,
} from './detroitDynamoAdminRoleGrantContract.js';

export const DETROIT_DYNAMO_ROLE_GRANT_STORAGE_KEY = 'detroit-dynamo-preview-role-grant-actions';
export const DETROIT_DYNAMO_ROLE_GRANT_BACKEND_STORAGE_KEY = 'detroit-dynamo-role-grant-backend';

function cleanText(value, max = 20000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function shouldUseAppwriteRoleGrants() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DETROIT_DYNAMO_ROLE_GRANT_BACKEND_STORAGE_KEY) === 'appwrite';
}

function readPreviewRoleGrantActions() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(DETROIT_DYNAMO_ROLE_GRANT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function writePreviewRoleGrantActions(actions) {
  if (typeof window === 'undefined') {
    throw new Error('Preview role grant storage requires a browser environment.');
  }

  window.localStorage.setItem(DETROIT_DYNAMO_ROLE_GRANT_STORAGE_KEY, JSON.stringify(actions.slice(0, 100)));
}

export function getDetroitDynamoRoleGrantBackendMode() {
  return shouldUseAppwriteRoleGrants() ? 'appwrite' : 'local';
}

export function setDetroitDynamoRoleGrantBackendMode(mode) {
  if (typeof window === 'undefined') return;
  if (mode === 'appwrite') {
    window.localStorage.setItem(DETROIT_DYNAMO_ROLE_GRANT_BACKEND_STORAGE_KEY, 'appwrite');
    return;
  }
  window.localStorage.removeItem(DETROIT_DYNAMO_ROLE_GRANT_BACKEND_STORAGE_KEY);
}

export function getDetroitDynamoPreviewRoleGrantActions() {
  return readPreviewRoleGrantActions();
}

export function validateDetroitDynamoAdminRoleGrantPayload(payload) {
  const action = cleanText(payload?.action, 80);
  const role = detroitDynamoAdminRoles.find((item) => item === cleanText(payload?.role, 100)) || '';
  const targetUserId = cleanText(payload?.target_user_id || payload?.targetUserId, 128);
  const assignmentId = cleanText(payload?.assignment_id || payload?.assignmentId, 128);
  const email = cleanText(payload?.email, 320);
  const expiresAt = cleanText(payload?.expires_at || payload?.expiresAt, 80);
  const scopeNote = cleanText(payload?.scope_note || payload?.scopeNote, 20000);
  const errors = [];

  if (!detroitDynamoAdminRoleGrantActions.includes(action)) {
    errors.push('Choose a supported Detroit Dynamo role grant action.');
  }
  if (!role) {
    errors.push('Choose a planned Detroit Dynamo admin role.');
  }
  if (action === 'grant_role' && !targetUserId) {
    errors.push('Target Appwrite user id is required for a new grant.');
  }
  if (action !== 'grant_role' && !assignmentId) {
    errors.push('Assignment document id is required for suspend, revoke, expire, or reactivate actions.');
  }
  if (expiresAt && Number.isNaN(new Date(expiresAt).getTime())) {
    errors.push('Expiration must be a valid date/time if provided.');
  }

  return {
    ok: errors.length === 0,
    errors,
    payload: {
      action,
      role,
      target_user_id: targetUserId,
      assignment_id: assignmentId,
      email,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : '',
      scope_note: scopeNote,
    },
  };
}

function writePreviewRoleGrantAction(payload, overrides = {}) {
  const now = new Date().toISOString();
  const record = {
    id: `dd-role-grant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    function_id: detroitDynamoAdminRoleGrantFunctionId,
    status: 'preview_role_grant_captured',
    destination: 'Local preview queue for future Master Admin role grant action',
    audit_event_id: `dd-role-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: now,
    updated_at: now,
    ...payload,
    ...overrides,
  };
  writePreviewRoleGrantActions([record, ...readPreviewRoleGrantActions()]);
  return record;
}

export async function submitDetroitDynamoAdminRoleGrantAction(payload) {
  const validated = validateDetroitDynamoAdminRoleGrantPayload(payload);
  if (!validated.ok) {
    throw new Error(validated.errors[0] || 'Detroit Dynamo admin role grant payload is invalid.');
  }

  if (!shouldUseAppwriteRoleGrants()) {
    return writePreviewRoleGrantAction(validated.payload);
  }

  try {
    const { data } = await rpc.invoke(detroitDynamoAdminRoleGrantFunctionId, validated.payload);
    return {
      id: data?.assignment_id || `dd-role-grant-${Date.now()}`,
      status: 'appwrite_role_grant_submitted',
      destination: 'Appwrite Detroit Dynamo admin role grant function',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...validated.payload,
      appwrite_response: data,
      audit_event_id: data?.audit_event_id || '',
    };
  } catch (error) {
    return writePreviewRoleGrantAction(validated.payload, {
      status: 'preview_role_grant_after_action_error',
      destination: 'Local preview queue fallback after Appwrite role grant error',
      backend_error: error?.message || String(error),
    });
  }
}

export function clearDetroitDynamoPreviewRoleGrantActions() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DETROIT_DYNAMO_ROLE_GRANT_STORAGE_KEY);
}
