import { base44 } from '@/api/base44Client';

export const messageRepo = {
  filter: (where, sort) => base44.entities.Message.filter(where, sort),
  create: (data) => base44.entities.Message.create(data),
  update: (id, data) => base44.entities.Message.update(id, data),
  subscribe: (cb) => base44.entities.Message.subscribe(cb),
};
