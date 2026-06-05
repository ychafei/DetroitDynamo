import { auditLogRepo } from '@/api/repo';

/**
 * @param {{
 *   actor?: any,
 *   action?: string,
 *   entityType?: string,
 *   entityId?: string,
 *   before?: any,
 *   after?: any,
 *   reason?: string,
 *   metadata?: any,
 * }} [entry]
 */
export async function logAdminAction({
  actor,
  action,
  entityType = '',
  entityId = '',
  before,
  after,
  reason = '',
  metadata,
} = {}) {
  if (!actor?.email || !action) return;

  const payload = {
    actor_email: actor.email,
    actor_role: actor.is_super_admin ? 'super_admin' : 'admin',
    action,
  };
  if (entityType) payload.entity_type = entityType;
  if (entityId) payload.entity_id = entityId;
  if (before !== undefined) payload.before = before;
  if (after !== undefined) payload.after = after;
  if (reason) payload.reason = reason;
  if (metadata !== undefined) payload.metadata = metadata;

  try {
    await auditLogRepo.create(payload);
  } catch (err) {
    // Audit logging must never break the action it's annotating.
    console.error('audit log failed', { action, entityId }, err);
  }
}
