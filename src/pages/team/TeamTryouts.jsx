import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamPageHero, SectionHeader } from '@/components/team/TeamPageShell';

const REQUIREMENTS = [
  'Open to players ages 17+',
  'Valid government-issued ID required at check-in',
  'Cleats, shin guards, and water — bring both home & away kits',
  'Arrive 30 minutes early for registration and warm-up',
];

const WHAT_TO_EXPECT = [
  '90-minute open session: technical, tactical, and small-sided play',
  'Evaluations across passing, first touch, decision-making, and athleticism',
  'Goalkeepers run a separate keeper-specific session',
  'Callbacks announced within 48 hours by email',
];

export default function TeamTryouts() {
  return (
    <div>
      <TeamPageHero
        eyebrow="Join the Club"
        title="DETROIT DYNAMO FC"
        accentTitle="TRYOUTS"
        description="Earn your place in Metro Detroit's premier semi-pro environment. Open tryouts and invite-only sessions throughout the year."
      />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-xs font-oswald tracking-widest uppercase text-accent mb-3">Requirements</p>
              <h3 className="font-oswald text-2xl tracking-wider text-foreground mb-5">WHAT YOU'LL NEED</h3>
              <ul className="space-y-3">
                {REQUIREMENTS.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-xs font-oswald tracking-widest uppercase text-accent mb-3">Format</p>
              <h3 className="font-oswald text-2xl tracking-wider text-foreground mb-5">WHAT TO EXPECT</h3>
              <ul className="space-y-3">
                {WHAT_TO_EXPECT.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-lg p-8 text-center">
            <SectionHeader
              eyebrow="Next Open Tryout"
              title="DATES COMING SOON"
              description="Register your interest below and we'll reach out the moment dates are confirmed."
            />
            <Link to="/apply/team-player">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-oswald tracking-wider uppercase px-8 py-6">
                Apply as Team Player
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
