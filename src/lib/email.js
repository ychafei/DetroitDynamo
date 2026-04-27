import { base44 } from '@/api/base44Client';

export const email = {
  send: ({ to, subject, body }) => base44.integrations.Core.SendEmail({ to, subject, body }),
};
