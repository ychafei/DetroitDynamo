import { base44 } from '@/api/base44Client';

export const coachRepo = {
  list: (sort) => base44.entities.Coach.list(sort),
  filter: (where, sort) => base44.entities.Coach.filter(where, sort),
  create: (data) => base44.entities.Coach.create(data),
  update: (id, data) => base44.entities.Coach.update(id, data),
};
