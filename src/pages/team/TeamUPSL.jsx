import React from 'react';
import { ChevronRight, Trophy, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamPageHero, SectionHeader } from '@/components/team/TeamPageShell';

export default function TeamUPSL() {
  return (
    <div>
      <TeamPageHero
        eyebrow="United Premier Soccer League"
        title="LCFC"
        accentTitle="UPSL"
        description="LCFC competes in the United Premier Soccer League — the largest national pro-development league in the United States."
      />

      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'League', value: 'UPSL' },
              { label: 'Division', value: 'Midwest' },
              { label: 'Season', value: '2026' },
              { label: 'Home', value: 'Metro Detroit' },
            ].map((item) => (
              <div key={item.label} className="border border-border bg-card/50 rounded-lg p-4">
                <div className="text-[10px] font-oswald tracking-widest uppercase text-muted-foreground mb-1">
                  {item.label}
                </div>
                <div className="font-oswald text-xl tracking-wider text-foreground">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-xs font-oswald tracking-widest uppercase text-accent mb-3">About UPSL</p>
              <h3 className="font-oswald text-2xl tracking-wider text-foreground mb-4">PRO-DEVELOPMENT FOOTBALL</h3>
              <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />400+ clubs across the United States</li>
                <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />Promotion & relegation between Premier, Championship, and D2 divisions</li>
                <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />Spring and fall seasons with national playoffs</li>
                <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />Pathway for players, coaches, and front-office talent</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 flex flex-col">
              <p className="text-xs font-oswald tracking-widest uppercase text-accent mb-3">Conference Standings</p>
              <h3 className="font-oswald text-2xl tracking-wider text-foreground mb-4">MIDWEST DIVISION</h3>
              <div className="flex-1 flex items-center justify-center py-8 border border-dashed border-border rounded-md">
                <div className="text-center">
                  <Trophy className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-oswald tracking-wider text-muted-foreground/60 uppercase text-sm">Standings released at kickoff</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Quick Links" title="EXPLORE LCFC" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/team/roster" className="group flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <span className="font-oswald tracking-wider text-foreground">ROSTER</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-accent" />
            </Link>
            <Link to="/team/schedule" className="group flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="font-oswald tracking-wider text-foreground">SCHEDULE</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-accent" />
            </Link>
            <Link to="/team/tryouts" className="group flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="font-oswald tracking-wider text-foreground">TRYOUTS</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-accent" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
