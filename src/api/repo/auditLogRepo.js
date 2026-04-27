import { base44 } from '@/api/base44Client';

export const auditLogRepo = {
  list: (sort) => base44.entities.AuditLog.list(sort),
  filter: (where, sort) => base44.entities.AuditLog.filter(where, sort),
  create: (data) => base44.entities.AuditLog.create(data),
};
