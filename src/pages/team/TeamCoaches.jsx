import React, { useEffect, useState } from 'react';
import { coachRepo } from '@/api/repo';
import { Shield } from 'lucide-react';
import { TeamPageHero, ComingSoon } from '@/components/team/TeamPageShell';

export default function TeamCoaches() {
  const [coaches, setCoaches] = useState(null);

  useEffect(() => {
    coachRepo.filter({ coach_type: 'team', is_active: true }, 'display_order')
      .then(setCoaches)
      .catch(() => setCoaches([]));
  }, []);

  return (
    <div>
      <TeamPageHero
        eyebrow="Technical Staff"
        title="LCFC"
        accentTitle="COACHES"
        description="The minds shaping the club's identity on and off the pitch."
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {coaches === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-card border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : coaches.length === 0 ? (
            <ComingSoon
              icon={Shield}
              message="Coaching staff announcement coming soon"
              sub="The technical bench will be unveiled ahead of the season."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coaches.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="aspect-[4/3] bg-secondary">
                    {c.photo_url ? (
                      <img src={c.photo_url} alt={`${c.first_name} ${c.last_name}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-oswald text-4xl text-muted-foreground/30">
                          {c.first_name?.[0]}{c.last_name?.[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-oswald tracking-widest uppercase text-accent mb-1">{c.title || 'Coach'}</p>
                    <p className="font-oswald text-xl tracking-wider text-foreground">{c.first_name} {c.last_name}</p>
                    {c.bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-4">{c.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
