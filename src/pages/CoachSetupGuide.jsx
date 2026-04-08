import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, User, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: User, title: 'Complete Your Profile', desc: 'Add your bio, quote, and training area in Settings → Payment tab.', link: '/settings' },
  { icon: CreditCard, title: 'Set Up Payment Handles', desc: 'Add your Venmo, Zelle, or Cash App info so clients can pay you directly.', link: '/settings' },
  { icon: Calendar, title: 'Set Your Availability', desc: 'Block off dates and manage your schedule.', link: '/coach-schedule' },
];

export default function CoachSetupGuide() {
  return (
    <div className="py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-oswald text-4xl font-bold tracking-tight text-foreground mb-4">COACH SETUP</h1>
        <p className="text-muted-foreground mb-12">Complete these steps to start receiving bookings.</p>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <step.icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-oswald tracking-wider text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{step.desc}</p>
                <Link to={step.link}>
                  <Button size="sm" variant="outline" className="font-oswald tracking-wider uppercase text-xs">
                    Go →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}