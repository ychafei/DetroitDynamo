import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Trophy, Image as ImageIcon, UserPlus, Shield, ChevronRight } from 'lucide-react';
import { TeamPageHero } from '@/components/team/TeamPageShell';

const SECTIONS = [
  { to: '/team/upsl', icon: Trophy, title: 'UPSL Team', desc: 'Detroit’s competitive entry in the United Premier Soccer League.' },
  { to: '/team/roster', icon: Users, title: 'Roster', desc: 'Meet the squad — players, positions, and numbers.' },
  { to: '/team/schedule', icon: Calendar, title: 'Schedule', desc: 'Matches, fixtures, and key dates.' },
  { to: '/team/tryouts', icon: UserPlus, title: 'Tryouts', desc: 'Information for players looking to join the club.' },
  { to: '/team/coaches', icon: Shield, title: 'Coaches', desc: 'The technical staff shaping LCFC.' },
  { to: '/team/gallery', icon: ImageIcon, title: 'Gallery', desc: 'Photos and videos from the pitch.' },
];

export default function Team() {
  return (
    <div>
      <TeamPageHero
        eyebrow="LCFC · Les Chèvres Football Club"
        title="LCFC"
        accentTitle="OVERVIEW"
        description="The competitive arm of Les Chèvres — a Metro Detroit football club competing in the United Premier Soccer League. One badge, one brotherhood, one mission."
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTIONS.map(({ to, icon: Icon, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:bg-card/80 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-oswald text-xl tracking-wider text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
