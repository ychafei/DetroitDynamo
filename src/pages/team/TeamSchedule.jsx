import React, { useEffect, useState } from 'react';
import { teamMatchRepo } from '@/api/repo';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TeamPageHero, ComingSoon } from '@/components/team/TeamPageShell';

const resultStyle = (result) => {
  if (!result) return 'bg-secondary text-muted-foreground border-border';
  const r = result.toLowerCase();
  if (r.startsWith('w')) return 'bg-green-500/10 text-green-400 border-green-500/30';
  if (r.startsWith('l')) return 'bg-red-500/10 text-red-400 border-red-500/30';
  if (r.startsWith('d') || r.startsWith('t')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
  return 'bg-secondary text-muted-foreground border-border';
};

export default function TeamSchedule() {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    teamMatchRepo.list('match_date').then(setMatches).catch(() => setMatches([]));
  }, []);

  return (
    <div>
      <TeamPageHero
        eyebrow="Match Day"
        title="SCHEDULE"
        description="Detroit Dynamo FC's fixture list - matches, opponents, and results."
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {matches === null ? (
            <div className="bg-card border border-border rounded-lg p-8 animate-pulse h-48" />
          ) : matches.length === 0 ? (
            <ComingSoon icon={Calendar} message="Fixture list coming soon" sub="The 2026 schedule will be published ahead of the season opener." />
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-secondary/50">
                <div className="col-span-2 text-[10px] font-oswald tracking-widest uppercase text-muted-foreground">Date</div>
                <div className="col-span-2 text-[10px] font-oswald tracking-widest uppercase text-muted-foreground">Time</div>
                <div className="col-span-4 text-[10px] font-oswald tracking-widest uppercase text-muted-foreground">Opponent</div>
                <div className="col-span-3 text-[10px] font-oswald tracking-widest uppercase text-muted-foreground">Venue</div>
                <div className="col-span-1 text-[10px] font-oswald tracking-widest uppercase text-muted-foreground text-right">Result</div>
              </div>
              {matches.map((m) => (
                <div key={m.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                  <div className="md:col-span-2 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 md:hidden" />
                    <span className="font-oswald tracking-wider text-sm">
                      {m.match_date ? format(new Date(m.match_date), 'MMM d') : 'TBA'}
                    </span>
                  </div>
                  <div className="md:col-span-2 font-oswald tracking-wider text-sm text-muted-foreground">
                    {m.match_time || '—'}
                  </div>
                  <div className="md:col-span-4 font-oswald tracking-wider text-foreground">
                    {m.is_home ? 'vs.' : 'at'} {m.opponent || 'TBA'}
                  </div>
                  <div className="md:col-span-3 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 md:hidden" />
                    <span className="text-sm">{m.location || 'Metro Detroit'}</span>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <Badge variant="outline" className={`text-[10px] font-oswald tracking-widest uppercase ${resultStyle(m.result)}`}>
                      {m.result || 'TBA'}
                    </Badge>
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
