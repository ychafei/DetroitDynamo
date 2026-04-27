import { base44 } from '@/api/base44Client';

export const profileRepo = {
  list: (sort) => base44.entities.User.list(sort),
  filter: (where, sort) => base44.entities.User.filter(where, sort),
  updateById: (id, data) => base44.entities.User.update(id, data),
  update: (id, data) => base44.entities.User.update(id, data),
};
