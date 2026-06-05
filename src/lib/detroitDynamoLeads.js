import { rpc } from '@/lib/rpc';
import { detroitDynamoLeadRouting } from './detroitDynamoDataModel.js';
import {
  canDetroitDynamoLeadPipelineTransition,
  normalizeDetroitDynamoLeadPipelineStatus,
} from './detroitDynamoLeadPipeline.js';

export const DETROIT_DYNAMO_LEADS_STORAGE_KEY = 'detroit-dynamo-preview-leads';
export const DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY = 'detroit-dynamo-preview-audit-events';
export const DETROIT_DYNAMO_LEAD_BACKEND_STORAGE_KEY = 'detroit-dynamo-lead-backend';
export const DETROIT_DYNAMO_LEAD_INTAKE_FUNCTION_ID = 'detroitDynamoLeadIntake';

function shouldUseAppwriteIntake() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DETROIT_DYNAMO_LEAD_BACKEND_STORAGE_KEY) === 'appwrite';
}

function readLeads() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(DETROIT_DYNAMO_LEADS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function readAuditEvents() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function writePreviewLead(payload, overrides = {}) {
  if (typeof window === 'undefined') {
    throw new Error('Preview lead storage requires a browser environment.');
  }

  const createdAt = new Date().toISOString();
  const record = {
    id: `dd-lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: 'preview_captured',
    destination: 'Future Appwrite ContactLead / TryoutRegistration queue',
    created_at: createdAt,
    updated_at: createdAt,
    ...payload,
    ...overrides,
  };

  const leads = [record, ...readLeads()].slice(0, 100);
  window.localStorage.setItem(DETROIT_DYNAMO_LEADS_STORAGE_KEY, JSON.stringify(leads));
  return record;
}

function writeLeads(leads) {
  if (typeof window === 'undefined') {
    throw new Error('Preview lead storage requires a browser environment.');
  }

  window.localStorage.setItem(DETROIT_DYNAMO_LEADS_STORAGE_KEY, JSON.stringify(leads.slice(0, 100)));
}

function writeAuditEvents(events) {
  if (typeof window === 'undefined') {
    throw new Error('Preview audit event storage requires a browser environment.');
  }

  window.localStorage.setItem(DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY, JSON.stringify(events.slice(0, 200)));
}

function writePreviewAuditEvent(event) {
  const events = [event, ...readAuditEvents()].slice(0, 200);
  writeAuditEvents(events);
  return event;
}

function normalizeIntakeResponse(payload, data) {
  const createdAt = new Date().toISOString();
  return {
    id: data?.created?.contact_lead_id || `dd-intake-${Date.now()}`,
    status: 'appwrite_intake_captured',
    destination: 'Appwrite Detroit Dynamo lead intake function',
    created_at: createdAt,
    updated_at: createdAt,
    appwrite_created: data?.created || null,
    ...payload,
  };
}

export async function submitDetroitDynamoLeadToAppwrite(payload) {
  const { data } = await rpc.invoke(DETROIT_DYNAMO_LEAD_INTAKE_FUNCTION_ID, payload);
  return normalizeIntakeResponse(payload, data);
}

export async function saveDetroitDynamoLead(payload) {
  if (!shouldUseAppwriteIntake()) {
    return writePreviewLead(payload);
  }

  try {
    return await submitDetroitDynamoLeadToAppwrite(payload);
  } catch (error) {
    return writePreviewLead(payload, {
      status: 'preview_captured_after_intake_error',
      destination: 'Local preview queue fallback after Appwrite intake error',
      backend_error: error?.message || String(error),
    });
  }
}

export function getDetroitDynamoPreviewLeads() {
  return readLeads();
}

export function getDetroitDynamoPreviewAuditEvents() {
  return readAuditEvents();
}

export function updateDetroitDynamoPreviewLeadPipelineStatus(leadId, nextStatus, options = {}) {
  if (typeof window === 'undefined') {
    throw new Error('Preview lead storage requires a browser environment.');
  }

  const leads = readLeads();
  const target = leads.find((lead) => lead.id === leadId);
  if (!target) {
    throw new Error('Preview lead was not found in this browser.');
  }

  const currentStatus = normalizeDetroitDynamoLeadPipelineStatus(target);
  if (!canDetroitDynamoLeadPipelineTransition(currentStatus, nextStatus)) {
    throw new Error(`Cannot move Detroit Dynamo lead from ${currentStatus} to ${nextStatus}.`);
  }

  const updatedAt = new Date().toISOString();
  const routing = detroitDynamoLeadRouting[target.lead_type] || detroitDynamoLeadRouting.contact;
  const actorRole = options.actorRole || 'Preview Admin';
  const note = options.note || '';
  const event = {
    from: currentStatus,
    to: nextStatus,
    at: updatedAt,
    by: actorRole,
    note,
  };
  const auditEvent = {
    id: `dd-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actor_user_id: 'preview-local-admin',
    actor_role: actorRole,
    action: 'pipeline_status_transition',
    target_model: routing.destinationModels?.[0] || 'ContactLead',
    target_collection_id: routing.collectionIds?.[0] || 'dd_contact_leads',
    target_record_id: leadId,
    lead_type: target.lead_type || 'contact',
    previous_status: currentStatus,
    next_status: nextStatus,
    event_summary: `${actorRole} moved ${target.player_name || target.contact_name || target.organization || 'Lead'} from ${currentStatus} to ${nextStatus}.`,
    metadata_json: JSON.stringify({
      source_route: target.source_route || '',
      owner_role: actorRole,
      note,
    }),
    ip_address: 'local-preview',
    created_at: updatedAt,
  };

  const updatedLead = {
    ...target,
    pipeline_status: nextStatus,
    pipeline_updated_at: updatedAt,
    pipeline_updated_by: event.by,
    pipeline_note: event.note,
    audit_event_id: auditEvent.id,
    pipeline_events: [...(Array.isArray(target.pipeline_events) ? target.pipeline_events : []), event].slice(-20),
    updated_at: updatedAt,
  };

  writePreviewAuditEvent(auditEvent);
  writeLeads(leads.map((lead) => (lead.id === leadId ? updatedLead : lead)));
  return updatedLead;
}

export function clearDetroitDynamoPreviewLeads() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DETROIT_DYNAMO_LEADS_STORAGE_KEY);
  window.localStorage.removeItem(DETROIT_DYNAMO_AUDIT_EVENTS_STORAGE_KEY);
}
