import { makeRepo } from '@/api/repoFactory';
import { COL } from '@/api/appwriteClient';

const base = makeRepo(COL.Coach);

// `availability` is a String attribute in Appwrite holding JSON, but the whole
// app uses it as an object (coach.availability['Monday'] etc.). Centralise the
// (de)serialisation here so reads return an object and writes send a string —
// previously saving an object into the String attribute was rejected, so
// availability never persisted.
function parseAvail(doc) {
  if (doc && typeof doc.availability === 'string' && doc.availability.trim()) {
    try {
      return { ...doc, availability: JSON.parse(doc.availability) };
    } catch {
      return { ...doc, availability: {} };
    }
  }
  return doc;
}

function serializeAvail(data) {
  if (data && data.availability && typeof data.availability === 'object') {
    return { ...data, availability: JSON.stringify(data.availability) };
  }
  return data;
}

export const coachRepo = {
  ...base,
  list: async (sort) => (await base.list(sort)).map(parseAvail),
  filter: async (where, sort) => (await base.filter(where, sort)).map(parseAvail),
  get: async (id) => parseAvail(await base.get(id)),
  create: (data) => base.create(serializeAvail(data)),
  update: (id, data) => base.update(id, serializeAvail(data)),
};
