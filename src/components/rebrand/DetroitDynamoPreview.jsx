import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Layers,
  Radio,
  Shield,
  Smartphone,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

const monogramSrc = '/detroit-dynamo/dd-monogram-placeholder.svg';

const pathways = [
  {
    icon: Activity,
    eyebrow: 'Player Development',
    title: 'Dynamo Training',
    description: 'Private and small-group sessions keep the existing booking model while elevating the future brand system.',
    detail: '1:1, small group, position-specific',
  },
  {
    icon: Trophy,
    eyebrow: 'Competitive Track',
    title: 'Dynamo FC',
    description: 'A cleaner club pathway for committed players, tryouts, staff credibility, and matchday storytelling.',
    detail: 'UPSL, youth pathway, tryouts',
  },
  {
    icon: Users,
    eyebrow: 'Community Engine',
    title: 'Metro Detroit Network',
    description: 'A scalable identity for Oakland, Macomb, and Wayne athletes without losing the coaching-first business.',
    detail: 'Families, coaches, partners',
  },
];

const comparison = [
  ['Brand role', 'LC Training private coaching site', 'Dynamo ecosystem for training, club, and content'],
  ['Visual system', 'Black, cream, and metallic gold', 'Deep navy, electric blue, silver, and white'],
  ['Primary proof', 'Coach access and booking flow', 'Professional pathway, apparel, media, and matchday'],
  ['Migration stance', 'Current site stays live', 'Preview route only, ready to promote later'],
];

const systemCards = [
  {
    icon: Shield,
    label: 'Identity',
    title: 'Monogram-led badge system',
    copy: 'Interlocking DD mark, lightning slash, and high-contrast typography built for digital and apparel.',
  },
  {
    icon: Smartphone,
    label: 'Platform',
    title: 'Booking remains connected',
    copy: 'Preview CTAs point back to existing LC Training booking, apply, and team flows instead of creating parallel forms.',
  },
  {
    icon: Radio,
    label: 'Media',
    title: 'Matchday-ready language',
    copy: 'Social graphics, fixtures, announcements, and roster stories can all live under one scalable brand voice.',
  },
];

const brandTokens = [
  { name: 'Midnight Navy', value: '#020714', className: 'bg-[#020714]' },
  { name: 'Electric Blue', value: '#00A3FF', className: 'bg-[#00A3FF]' },
  { name: 'Arc Blue', value: '#6FE7FF', className: 'bg-[#6FE7FF]' },
  { name: 'Metal Silver', value: '#A8B3C7', className: 'bg-[#A8B3C7]' },
  { name: 'Stadium White', value: '#F8FAFC', className: 'bg-[#F8FAFC]' },
];

function SectionLabel({ children }) {
  return (
    <p className="font-oswald text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6FE7FF]">
      {children}
    </p>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
        {title}
      </h2>
      {children && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#B8C3D7] sm:text-base">
          {children}
        </p>
      )}
    </div>
  );
}

function DynamoButton({ to, children, variant = 'primary' }) {
  const classes =
    variant === 'primary'
      ? 'border-[#00A3FF] bg-[#00A3FF] text-[#020714] shadow-[0_0_28px_rgba(0,163,255,0.28)] hover:bg-[#6FE7FF]'
      : 'border-white/20 bg-white/5 text-white hover:border-[#6FE7FF]/70 hover:text-[#6FE7FF]';

  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 py-3 font-oswald text-xs font-semibold uppercase tracking-[0.18em] transition ${classes}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function EnergyLine({ className }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-px origin-left rotate-[-16deg] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent opacity-70 ${className}`}
    />
  );
}

function HeroStats() {
  const stats = [
    ['01', 'Preserve booking'],
    ['02', 'Preview new identity'],
    ['03', 'Scale training to club'],
  ];

  return (
    <div className="mt-12 grid gap-3 sm:grid-cols-3">
      {stats.map(([number, label]) => (
        <div key={number} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur">
          <p className="font-oswald text-2xl font-bold text-white">{number}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#A8B3C7]">{label}</p>
        </div>
      ))}
    </div>
  );
}

function PathwayCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="group rounded-lg border border-white/10 bg-[#07111F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition hover:border-[#00A3FF]/50 hover:bg-[#081827]">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#00A3FF]/35 bg-[#00A3FF]/10 text-[#6FE7FF]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="font-oswald text-[10px] uppercase tracking-[0.24em] text-[#6FE7FF]/80">
          {item.eyebrow}
        </span>
      </div>
      <h3 className="font-oswald text-2xl font-semibold uppercase tracking-wider text-white">
        {item.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{item.description}</p>
      <p className="mt-7 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.18em] text-[#A8B3C7]">
        {item.detail}
      </p>
    </article>
  );
}

function KitPreview() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[#050B16] p-6">
      <EnergyLine className="left-6 top-28 w-[70%]" />
      <EnergyLine className="left-20 top-44 w-[55%]" />
      <div className="relative z-10">
        <SectionLabel>Kit Preview</SectionLabel>
        <h3 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-wider text-white">
          Built for the pitch and the sideline
        </h3>
      </div>
      <div className="relative z-10 mt-10 grid gap-5 sm:grid-cols-2">
        <div className="mx-auto w-full max-w-[220px]">
          <div className="relative h-64 rounded-lg border border-[#00A3FF]/30 bg-[#071827] shadow-[0_0_70px_rgba(0,163,255,0.16)]">
            <div className="absolute left-1/2 top-6 h-12 w-24 -translate-x-1/2 rounded-b-full border-b border-l border-r border-[#A8B3C7]/50" />
            <div className="absolute left-6 right-6 top-24 h-1 bg-[#00A3FF]" />
            <div className="absolute left-9 right-9 top-32 h-px bg-white/25" />
            <img
              src={monogramSrc}
              alt="Temporary Detroit Dynamo monogram on navy home kit"
              className="absolute left-1/2 top-20 h-20 w-20 -translate-x-1/2 rounded-md object-contain"
            />
            <p className="absolute bottom-7 left-0 right-0 text-center font-oswald text-xs uppercase tracking-[0.32em] text-[#A8B3C7]">
              Home
            </p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[220px]">
          <div className="relative h-64 rounded-lg border border-white/20 bg-[#E8EEF7] shadow-[0_0_70px_rgba(168,179,199,0.12)]">
            <div className="absolute left-1/2 top-6 h-12 w-24 -translate-x-1/2 rounded-b-full border-b border-l border-r border-[#071827]/35" />
            <div className="absolute bottom-0 left-0 top-0 w-12 bg-[#00A3FF]" />
            <div className="absolute bottom-0 right-0 top-0 w-3 bg-[#020714]" />
            <img
              src={monogramSrc}
              alt="Temporary Detroit Dynamo monogram on silver away kit"
              className="absolute left-1/2 top-20 h-20 w-20 -translate-x-1/2 rounded-md object-contain"
            />
            <p className="absolute bottom-7 left-0 right-0 text-center font-oswald text-xs uppercase tracking-[0.32em] text-[#020714]">
              Away
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DigitalPreview() {
  return (
    <div className="rounded-lg border border-white/10 bg-[#07111F] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <SectionLabel>Digital System</SectionLabel>
          <h3 className="mt-3 font-oswald text-2xl font-bold uppercase tracking-wider text-white">
            App-ready surfaces
          </h3>
        </div>
        <Smartphone className="h-9 w-9 text-[#6FE7FF]" aria-hidden="true" />
      </div>
      <div className="mt-7 space-y-3">
        {['Book a Dynamo Session', 'Tryout Registration', 'Coach Verification'].map((label, index) => (
          <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="text-sm font-medium text-white">{label}</span>
            <span className="font-oswald text-xs uppercase tracking-[0.18em] text-[#6FE7FF]">
              0{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchdayPreview() {
  return (
    <div className="rounded-lg border border-white/10 bg-[#07111F] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <SectionLabel>Matchday</SectionLabel>
          <h3 className="mt-3 font-oswald text-2xl font-bold uppercase tracking-wider text-white">
            Content that feels official
          </h3>
        </div>
        <CalendarDays className="h-9 w-9 text-[#6FE7FF]" aria-hidden="true" />
      </div>
      <div className="mt-7 rounded-lg border border-[#00A3FF]/30 bg-[#020714] p-5">
        <p className="font-oswald text-[10px] uppercase tracking-[0.28em] text-[#A8B3C7]">
          Saturday Night
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-oswald text-2xl font-bold uppercase tracking-wider text-white">
              Dynamo FC
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6FE7FF]">
              Detroit, MI
            </p>
          </div>
          <p className="font-oswald text-3xl font-bold text-white">7:30</p>
        </div>
        <div className="mt-6 h-1 bg-gradient-to-r from-[#00A3FF] via-white to-transparent" />
      </div>
    </div>
  );
}

function ComparisonSection() {
  return (
    <section className="bg-[#020714] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Current vs Future" title="A controlled brand transition">
          This preview frames Detroit Dynamo as a future layer over the existing LC Training engine, not a replacement for current pages or booking flows.
        </SectionHeading>
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#07111F]">
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-white/10 bg-white/[0.04] px-4 py-4 text-xs uppercase tracking-[0.2em] text-[#A8B3C7] sm:px-6">
            <span>Area</span>
            <span>Current LC</span>
            <span>Future Dynamo</span>
          </div>
          {comparison.map(([area, current, future]) => (
            <div key={area} className="grid grid-cols-1 gap-3 border-b border-white/10 px-4 py-5 last:border-b-0 sm:grid-cols-[1fr_1.2fr_1.2fr] sm:px-6">
              <p className="font-oswald text-sm uppercase tracking-[0.18em] text-[#6FE7FF]">{area}</p>
              <p className="text-sm leading-6 text-[#D7DEEA]">{current}</p>
              <p className="text-sm leading-6 text-white">{future}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandSystemSection() {
  return (
    <section className="bg-[#050B16] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Brand System" title="Premium, athletic, and scalable">
          A disciplined identity can carry private training, club competition, apparel, recruiting, and social media without splintering the business.
        </SectionHeading>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-[#07111F] p-6">
            <div className="flex items-center gap-5">
              {/* Final logo swap point: replace the placeholder asset with the approved Detroit Dynamo mark. */}
              <img
                src={monogramSrc}
                alt="Temporary Detroit Dynamo interlocking DD monogram placeholder"
                className="h-24 w-24 rounded-lg border border-[#00A3FF]/30 object-contain"
              />
              <div>
                <SectionLabel>Core Mark</SectionLabel>
                <h3 className="mt-2 font-oswald text-3xl font-bold uppercase tracking-wider text-white">
                  Detroit Dynamo
                </h3>
                <p className="mt-2 text-sm text-[#B8C3D7]">Interlocking DD with electric motion.</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-5 lg:grid-cols-1">
              {brandTokens.map((token) => (
                <div key={token.name} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
                  <span className={`h-9 w-9 rounded-md border border-white/20 ${token.className}`} aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-white">{token.name}</span>
                    <span className="block font-oswald text-[10px] uppercase tracking-[0.2em] text-[#A8B3C7]">{token.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {systemCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="rounded-lg border border-white/10 bg-[#07111F] p-5">
                  <Icon className="h-6 w-6 text-[#6FE7FF]" aria-hidden="true" />
                  <p className="mt-5 font-oswald text-[10px] uppercase tracking-[0.24em] text-[#A8B3C7]">{card.label}</p>
                  <h3 className="mt-3 font-oswald text-xl font-semibold uppercase tracking-wider text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{card.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DetroitDynamoPreview() {
  return (
    <div className="isolate bg-[#020714] text-white">
      <section className="relative overflow-hidden bg-[#020714] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(0,163,255,0.28),transparent_30%),radial-gradient(circle_at_12%_70%,rgba(111,231,255,0.13),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.07)_0,rgba(255,255,255,0)_24%,rgba(0,163,255,0.16)_24.5%,rgba(0,163,255,0)_25%)]" />
        <EnergyLine className="left-[16%] top-32 w-[62%]" />
        <EnergyLine className="left-[44%] top-52 w-[44%]" />
        <img
          src={monogramSrc}
          alt=""
          aria-hidden="true"
          className="absolute right-[-90px] top-10 h-[340px] w-[340px] rounded-lg object-contain opacity-25 blur-[1px] sm:h-[460px] sm:w-[460px] lg:right-[6%] lg:top-14 lg:h-[540px] lg:w-[540px]"
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-md border border-[#00A3FF]/30 bg-[#00A3FF]/10 px-3 py-2">
              <Zap className="h-4 w-4 text-[#6FE7FF]" aria-hidden="true" />
              <span className="font-oswald text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6FE7FF]">
                Non-destructive rebrand preview
              </span>
            </div>
            <h1 className="font-oswald text-5xl font-bold uppercase leading-[0.95] tracking-wider text-white sm:text-6xl lg:text-7xl">
              Detroit Dynamo Training
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#D7DEEA] sm:text-lg">
              A premium future-facing soccer identity for LC Training: electric, competitive, and built to scale from private development into a club ecosystem.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <DynamoButton to="/book">Book through LC Training</DynamoButton>
              <DynamoButton to="/lcfc/tryouts" variant="secondary">Explore team pathway</DynamoButton>
            </div>
          </div>
          <HeroStats />
        </div>
      </section>

      <ComparisonSection />

      <section className="bg-[#050B16] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Pathways" title="One brand, multiple player journeys">
            The preview keeps the commercial engine intact while showing how Dynamo can organize training, competitive soccer, and community growth.
          </SectionHeading>
          <div className="grid gap-5 lg:grid-cols-3">
            {pathways.map((item) => (
              <PathwayCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <BrandSystemSection />

      <section className="bg-[#020714] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Preview Modules" title="More than a color swap">
            The rebrand should look credible across apparel, app surfaces, and matchday content before it ever replaces the current homepage.
          </SectionHeading>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <KitPreview />
            <div className="grid gap-6">
              <DigitalPreview />
              <MatchdayPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionLabel>Next Step</SectionLabel>
            <h2 className="mt-3 font-oswald text-4xl font-bold uppercase tracking-wider text-white">
              Validate the direction before migration
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#B8C3D7] sm:text-base">
              The current LC Training website remains the source of truth. This route is a preview artifact for leadership review, visual testing, and future brand rollout planning.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: BadgeCheck, title: 'Review', copy: 'Confirm identity, tone, and naming hierarchy.' },
              { icon: Layers, title: 'Systemize', copy: 'Finalize logo files, color tokens, and page components.' },
              { icon: Star, title: 'Promote', copy: 'Move approved modules into live LC surfaces later.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-white/10 bg-[#07111F] p-5">
                  <Icon className="h-6 w-6 text-[#6FE7FF]" aria-hidden="true" />
                  <h3 className="mt-5 font-oswald text-xl font-semibold uppercase tracking-wider text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#B8C3D7]">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
