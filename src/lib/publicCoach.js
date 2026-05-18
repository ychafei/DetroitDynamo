// getPublicCoaches returns raw Appwrite documents: `availability` is a JSON
// string and the doc id is `$id` (not `id`). Normalise here so the UI can use
// `coach.id` and `coach.availability['Monday']` like everywhere else.
export function parseAvailability(val) {
  if (val && typeof val === 'object') return val;
  if (typeof val === 'string' && val.trim()) {
    try { return JSON.parse(val); } catch { return {}; }
  }
  return {};
}

export function normalizePublicCoach(doc) {
  if (!doc) return doc;
  return {
    ...doc,
    id: doc.id || doc.$id,
    availability: parseAvailability(doc.availability),
  };
}
