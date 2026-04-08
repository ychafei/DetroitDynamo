import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { MapPin, Target, Users, Trophy } from 'lucide-react';

export default function About() {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    base44.entities.Coach.filter({ is_active: true }, 'display_order').then(setCoaches);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-oswald text-5xl sm:text-7xl font-bold tracking-tight text-foreground mb-6">
              THE LC TRAINING STORY
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded with a passion for developing soccer talent in Metro Detroit, LC Training brings 
              elite-level coaching to Oakland, Macomb, and Wayne counties. We believe every player 
              deserves access to professional training, regardless of their starting point.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'PRECISION', desc: 'Every session is tailored to the individual athlete.' },
              { icon: Users, title: 'COMMUNITY', desc: 'Building connections across Metro Detroit.' },
              { icon: Trophy, title: 'EXCELLENCE', desc: 'We push boundaries and raise the standard.' },
              { icon: MapPin, title: 'LOCAL', desc: 'Three counties, one mission.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-oswald text-lg font-bold tracking-wider text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-oswald text-4xl font-bold tracking-tight text-foreground mb-12 text-center">
            THE COACHING STAFF
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coaches.map((coach) => (
              <div key={coach.id} className="bg-card border border-border rounded-lg p-6">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {coach.photo_url ? (
                    <img src={coach.photo_url} alt={coach.first_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-oswald text-2xl font-bold text-muted-foreground/30">
                      {coach.first_name?.[0]}{coach.last_name?.[0]}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-oswald text-xl font-bold tracking-wider text-foreground">
                    {coach.first_name} {coach.last_name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-accent text-xs font-oswald tracking-wider uppercase mt-1">
                    <MapPin className="w-3 h-3" /> {coach.county} County
                  </div>
                  {coach.bio && (
                    <p className="text-sm text-muted-foreground mt-4">{coach.bio}</p>
                  )}
                  {coach.specializations?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                      {coach.specializations.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}