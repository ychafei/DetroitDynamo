import { base44 } from '@/api/base44Client';

export const coachBlockRepo = {
  list: (sort) => base44.entities.CoachBlock.list(sort),
  filter: (where, sort) => base44.entities.CoachBlock.filter(where, sort),
  create: (data) => base44.entities.CoachBlock.create(data),
  update: (id, data) => base44.entities.CoachBlock.update(id, data),
};
