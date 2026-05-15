import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

export const lcfcSponsorRepo = makeRepo(COL.LcfcSponsor);
