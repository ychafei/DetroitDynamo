import React from 'react';
import { Badge } from '@/components/ui/badge';

export function TeamPageHero({ eyebrow, title, accentTitle = '', description, badge = '' }) {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <img
        src="/detroit-dynamo/logo-primary.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-[-140px] top-1/2 -translate-y-1/2 w-[560px] opacity-[0.08] mix-blend-screen hidden lg:block"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-xs font-oswald tracking-widest uppercase">{eyebrow}</span>
          </div>
        )}
        <h1 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[0.95] mb-5">
          {title} {accentTitle && <span className="text-accent">{accentTitle}</span>}
        </h1>
        {description && (
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-dm-sans">
            {description}
          </p>
        )}
        {badge && (
          <div className="mt-6">
            <Badge className="bg-accent/10 text-accent border-accent/20 font-oswald tracking-widest uppercase text-[10px]">
              {badge}
            </Badge>
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description = '', badge = '' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-oswald tracking-widest uppercase text-accent mb-3">{eyebrow}</p>
        )}
        <h2 className="font-oswald text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {badge && (
        <Badge className="bg-accent/10 text-accent border-accent/20 font-oswald tracking-widest uppercase text-[10px] self-start sm:self-end">
          {badge}
        </Badge>
      )}
    </div>
  );
}

export function ComingSoon({ icon: Icon, message = 'Coming Soon', sub }) {
  return (
    <div className="border border-dashed border-border rounded-lg py-16 flex flex-col items-center justify-center text-center">
      {Icon && <Icon className="w-10 h-10 text-muted-foreground/40 mb-4" />}
      <p className="font-oswald tracking-wider uppercase text-sm text-muted-foreground/70">{message}</p>
      {sub && <p className="text-xs text-muted-foreground/50 mt-2 max-w-md">{sub}</p>}
    </div>
  );
}
