import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { amount, packageId, packageName, packageSessions, sessionDurationMinutes } = await req.json();

    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY not set');
      return Response.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    // Build the origin URL for success/cancel redirects
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || '';

    // Create Stripe Checkout Session via REST API
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('success_url', `${origin}/book?stripe_success=1&session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${origin}/book`);
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', String(Math.round(amount * 100)));
    params.append('line_items[0][price_data][product_data][name]', `${packageName} — Coaching Session`);
    params.append('line_items[0][quantity]', '1');
    params.append('metadata[client_email]', user.email);
    params.append('metadata[client_name]', user.full_name || user.email);
    params.append('metadata[package_id]', packageId || '');
    params.append('metadata[package_name]', packageName || '');
    params.append('metadata[package_sessions]', String(packageSessions || 1));
    params.append('metadata[session_duration_minutes]', String(sessionDurationMinutes || 60));

    // Stripe-Account header required for organization-level keys (sk_org_...)
    const stripeAccountId = Deno.env.get('STRIPE_ACCOUNT_ID') || 'acct_1P5lEAClCNOrs1rW';

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Account': stripeAccountId,
      },
      body: params.toString(),
    });

    const session = await res.json();

    if (!session.id || !session.url) {
      console.error('Stripe session creation failed:', JSON.stringify(session));
      return Response.json({ error: 'Failed to create checkout session', details: session }, { status: 500 });
    }

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('[ERROR] createStripeCheckout:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
