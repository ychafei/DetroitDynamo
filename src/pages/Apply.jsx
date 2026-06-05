import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, Shield, Briefcase, FileText } from 'lucide-react';
import { ApplicationForm } from '@/components/apply/ApplicationForm';

const PATHS = [
  {
    to: '/apply/team-player',
    icon: Users,
    title: 'Apply as Team Player',
    desc: 'Compete for Detroit Dynamo FC - UPSL squad and age-group teams.',
  },
  {
    to: '/apply/team-coach',
    icon: Shield,
    title: 'Apply as Team Coach',
    desc: 'Coach the club side — UPSL, age groups, GK roles.',
  },
  {
    to: '/apply/private-training-coach',
    icon: Briefcase,
    title: 'Apply as Private Training Coach',
    desc: '1-on-1 and small-group Detroit Dynamo sessions.',
  },
];

export default function Apply() {
  return (
    <div>
      <section className="py-16 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-oswald text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              JOIN THE FAMILY
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pick the path that fits. Whether you're chasing a roster spot, a coaching badge, or a private-training role — we're listening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PATHS.map(({ to, icon: Icon, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:bg-card/80 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-accent" />
                </div>
                <h3 className="font-oswald text-lg tracking-wider text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 border-b border-border py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-xs font-oswald tracking-widest uppercase text-accent">General Application</span>
          </div>
          <h2 className="font-oswald text-2xl sm:text-3xl tracking-tight text-foreground mb-2">
            NOT SURE WHICH PATH?
          </h2>
          <p className="text-sm text-muted-foreground">
            Use the form below to introduce yourself. We'll route you to the right team.
          </p>
        </div>
      </section>

      <ApplicationForm
        type="general"
        title="GENERAL APPLICATION"
        subtitle="Tell us who you are and what you're looking to do. We read everything."
        promptLabel="What's on your mind? *"
        promptPlaceholder="Coaching, playing, partnerships, sponsorship — let us know."
        fields={{ resume: true, backgroundCheck: false }}
      />
    </div>
  );
}
