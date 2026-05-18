import { Client, Databases, Query } from 'node-appwrite';

// Public — returns { coaches: [...] } with only is_active=true coaches.
// Replaces the Base44 service-role workaround. Errors return an empty list
// so the home page still renders.

export default async ({ req, res, error }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const result = await databases.listDocuments('lctraining', 'coaches', [
      Query.equal('is_active', true),
      Query.orderAsc('display_order'),
      Query.limit(100),
    ]);

    // Expose `id` (clients use it, not $id) and availability as an object
    // (it's stored as a JSON string).
    const coaches = result.documents.map((d) => {
      let availability = d.availability;
      if (typeof availability === 'string' && availability.trim()) {
        try { availability = JSON.parse(availability); } catch { availability = {}; }
      }
      return { ...d, id: d.$id, availability: availability || {} };
    });
    return res.json({ coaches });
  } catch (err) {
    error(`getPublicCoaches: ${err?.message || err}`);
    return res.json({ coaches: [] });
  }
};
