import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

export const playerRepo = makeRepo(COL.Player);
