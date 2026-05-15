import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

export const lcfcStaffRepo = makeRepo(COL.LcfcStaff);
