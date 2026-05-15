import { Client, Databases, Query, ID } from 'node-appwrite';

// Auth-required — captures a previously-created PayPal order and writes the
// session_credits row directly so credits exist even if the webhook never fires.

export default async ({ req, res, log, error }) => {
  try {
    const userId = req.headers['x-appwrite-user-id'];
    if (!userId) return res.json({ error: 'Unauthorized' }, 401);

    const body = req.bodyJson || (req.body ? JSON.parse(req.body) : {});
    const { orderId } = body;
    if (!orderId) return res.json({ error: 'Missing orderId' }, 400);

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secretKey = process.env.PAYPAL_SECRET_KEY;
    if (!clientId || !secretKey) return res.json({ error: 'PayPal env vars missing' }, 500);

    const apiBase = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';

    const tokenRes = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secretKey}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      error(`PayPal token failed: ${tokenRes.status} ${text}`);
      return res.json({ error: 'PayPal authentication failed' }, 502);
    }
    const { access_token } = await tokenRes.json();

    const captureRes = await fetch(`${apiBase}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await captureRes.json();

    if (!captureRes.ok || result.status !== 'COMPLETED') {
      error(`PayPal capture failed: ${captureRes.status} ${JSON.stringify(result)}`);
      return res.json({ error: 'PayPal capture failed', details: result }, 502);
    }

    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    const customId = capture?.custom_id || result.purchase_units?.[0]?.custom_id;
    const captureId = capture?.id;

    if (!customId) {
      error(`PayPal capture missing custom_id: ${JSON.stringify(result)}`);
      return res.json({ error: 'Capture missing custom_id' }, 500);
    }

    const parts = customId.split('|');
    if (parts.length < 4) {
      error(`PayPal capture custom_id malformed: ${customId}`);
      return res.json({ error: 'Invalid custom_id' }, 500);
    }
    const [clientEmail, packageId, packageName, packageSessionsStr, durationMinutesStr] = parts;
    const packageSessions = parseInt(packageSessionsStr, 10) || 1;
    const durationMinutes = parseInt(durationMinutesStr, 10) || 60;

    const dbClient = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);
    const databases = new Databases(dbClient);

    const dedupKey = captureId || packageId;
    const existing = await databases.listDocuments('lctraining', 'session_credits', [
      Query.equal('client_email', clientEmail),
      Query.equal('package_id', dedupKey),
      Query.limit(1),
    ]);

    if (existing.documents.length === 0) {
      await databases.createDocument('lctraining', 'session_credits', ID.unique(), {
        client_email: clientEmail,
        client_name: clientEmail,
        package_id: dedupKey,
        package_name: packageName,
        total_credits: packageSessions,
        used_credits: 0,
        session_duration_minutes: durationMinutes,
        per_session_base_price: 0,
        payment_processor: 'paypal',
      });
      log(`PayPal credits created for ${clientEmail}, ${packageName}, ${packageSessions} × ${durationMinutes}min`);
    } else {
      log(`PayPal credits already exist for ${clientEmail} / ${dedupKey}`);
    }

    return res.json({ status: 'COMPLETED', captureId });
  } catch (err) {
    error(`capturePaypalOrder: ${err?.message || err}`);
    return res.json({ error: err?.message || String(err) }, 500);
  }
};
