import { base44 } from '@/api/base44Client';

export const storage = {
  uploadFile: async (_bucket, file) => {
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    return { url: file_url, id: null };
  },
};
