import { base44 } from '@/api/base44Client';

export const sessionRepo = {
  list: (sort) => base44.entities.Session.list(sort),
  filter: (where, sort) => base44.entities.Session.filter(where, sort),
  create: (data) => base44.entities.Session.create(data),
  update: (id, data) => base44.entities.Session.update(id, data),
  delete: (id) => base44.entities.Session.delete(id),
};
