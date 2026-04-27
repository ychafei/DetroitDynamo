import { base44 } from '@/api/base44Client';

export const siteContentRepo = {
  list: (sort) => base44.entities.SiteContent.list(sort),
  filter: (where, sort) => base44.entities.SiteContent.filter(where, sort),
  create: (data) => base44.entities.SiteContent.create(data),
  update: (id, data) => base44.entities.SiteContent.update(id, data),
};
