import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

export const lcfcSettingsRepo = makeRepo(COL.LcfcSettings);
