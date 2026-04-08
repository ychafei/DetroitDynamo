import React from 'react';

export default function Terms() {
  return (
    <div className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-oswald text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-8">TERMS OF SERVICE</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-foreground">1. Services</h2>
          <p>LC Training provides soccer coaching services in Oakland, Macomb, and Wayne counties in Metro Detroit. By booking a session, you agree to these terms.</p>
          <h2 className="text-foreground">2. Booking & Cancellation</h2>
          <p>Sessions must be booked through the LC Training platform. Sessions cancelled with less than 24 hours notice may incur a late-cancellation fee at the coach's discretion.</p>
          <h2 className="text-foreground">3. Payment</h2>
          <p>Payment is made directly to the coach via the provided payment methods (Venmo, Zelle, Cash App, PayPal, or Cash). LC Training does not process payments.</p>
          <h2 className="text-foreground">4. Assumption of Risk</h2>
          <p>Soccer training involves physical activity. Participants assume all risks associated with training sessions.</p>
          <h2 className="text-foreground">5. Minors</h2>
          <p>Participants under 18 must have parental or guardian consent. Parent/guardian information must be provided during registration.</p>
          <h2 className="text-foreground">6. Communication</h2>
          <p>All messages sent through the LC Training platform are monitored for safety and quality purposes.</p>
          <h2 className="text-foreground">7. Code of Conduct</h2>
          <p>Users who violate our community standards may be banned from the platform. Banned users will be notified by email.</p>
        </div>
      </div>
    </div>
  );
}