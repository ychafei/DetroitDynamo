import { base44 } from '@/api/base44Client';

export const sessionCreditRepo = {
  list: (sort) => base44.entities.SessionCredit.list(sort),
  filter: (where, sort) => base44.entities.SessionCredit.filter(where, sort),
  create: (data) => base44.entities.SessionCredit.create(data),
  update: (id, data) => base44.entities.SessionCredit.update(id, data),
  delete: (id) => base44.entities.SessionCredit.delete(id),
};
