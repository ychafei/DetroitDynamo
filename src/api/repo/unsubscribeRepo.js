import { base44 } from '@/api/base44Client';

export const unsubscribeRepo = {
  list: (sort) => base44.entities.UnsubscribeRecord.list(sort),
  filter: (where, sort) => base44.entities.UnsubscribeRecord.filter(where, sort),
  create: (data) => base44.entities.UnsubscribeRecord.create(data),
  update: (id, data) => base44.entities.UnsubscribeRecord.update(id, data),
};
