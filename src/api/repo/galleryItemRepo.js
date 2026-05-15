import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

export const galleryItemRepo = makeRepo(COL.GalleryItem);
