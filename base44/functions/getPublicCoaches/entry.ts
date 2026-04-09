import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const coaches = await base44.asServiceRole.entities.Coach.filter({ is_active: true });
    return Response.json({ coaches });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});