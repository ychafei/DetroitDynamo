import { base44 } from '@/api/base44Client';

export const blogPostRepo = {
  list: (sort) => base44.entities.BlogPost.list(sort),
  filter: (where, sort) => base44.entities.BlogPost.filter(where, sort),
  create: (data) => base44.entities.BlogPost.create(data),
  update: (id, data) => base44.entities.BlogPost.update(id, data),
  delete: (id) => base44.entities.BlogPost.delete(id),
};
