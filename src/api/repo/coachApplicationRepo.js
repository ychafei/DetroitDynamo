import { base44 } from '@/api/base44Client';

export const coachApplicationRepo = {
  list: (sort) => base44.entities.CoachApplication.list(sort),
  filter: (where, sort) => base44.entities.CoachApplication.filter(where, sort),
  create: (data) => base44.entities.CoachApplication.create(data),
  update: (id, data) => base44.entities.CoachApplication.update(id, data),
};
