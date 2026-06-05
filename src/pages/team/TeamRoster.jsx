import React, { useEffect, useState } from 'react';
import { playerRepo } from '@/api/repo';
import { Users } from 'lucide-react';
import { TeamPageHero, ComingSoon } from '@/components/team/TeamPageShell';

export default function TeamRoster() {
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    playerRepo.filter({ is_active: true }, 'jersey_number').then(setPlayers).catch(() => setPlayers([]));
  }, []);

  return (
    <div>
      <TeamPageHero
        eyebrow="The Squad"
        title="ROSTER"
        description="The players representing Detroit Dynamo FC on the pitch this season."
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {players === null ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-card border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : players.length === 0 ? (
            <ComingSoon
              icon={Users}
              message="Roster announcement incoming"
              sub="Players will be unveiled ahead of the season opener. Stay tuned."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map((p) => (
                <div key={p.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="aspect-[3/4] bg-secondary relative">
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={`${p.first_name} ${p.last_name}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-oswald text-4xl text-muted-foreground/30">#{p.jersey_number || '?'}</span>
                      </div>
                    )}
                    {p.jersey_number != null && (
                      <span className="absolute top-3 left-3 font-oswald text-3xl text-accent drop-shadow-lg">#{p.jersey_number}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-oswald tracking-wider text-foreground uppercase">{p.first_name} {p.last_name}</p>
                    <p className="text-[10px] font-oswald tracking-widest uppercase text-accent mt-1">{p.position || 'Player'}</p>
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
