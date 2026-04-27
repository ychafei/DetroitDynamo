import { base44 } from '@/api/base44Client';

export const matchRequestRepo = {
  filter: (where, sort) => base44.entities.MatchRequest.filter(where, sort),
  create: (data) => base44.entities.MatchRequest.create(data),
  update: (id, data) => base44.entities.MatchRequest.update(id, data),
};
