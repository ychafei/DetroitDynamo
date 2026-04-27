import { base44 } from '@/api/base44Client';

export const conversationRepo = {
  list: (sort) => base44.entities.Conversation.list(sort),
  filter: (where, sort) => base44.entities.Conversation.filter(where, sort),
  create: (data) => base44.entities.Conversation.create(data),
  update: (id, data) => base44.entities.Conversation.update(id, data),
};
