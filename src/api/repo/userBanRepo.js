import { base44 } from '@/api/base44Client';

export const userBanRepo = {
  list: (sort) => base44.entities.UserBan.list(sort),
  filter: (where, sort) => base44.entities.UserBan.filter(where, sort),
  create: (data) => base44.entities.UserBan.create(data),
  update: (id, data) => base44.entities.UserBan.update(id, data),
};
