import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

export const lcfcNewsRepo = makeRepo(COL.LcfcNews);
