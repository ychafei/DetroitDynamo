import { base44 } from '@/api/base44Client';

export const rpc = {
  invoke: (name, body) => base44.functions.invoke(name, body),
};
