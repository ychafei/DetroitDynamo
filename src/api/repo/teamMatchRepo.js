import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

export const teamMatchRepo = makeRepo(COL.TeamMatch);
