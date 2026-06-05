import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Flag,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

const ASSETS = {
  logo: '/detroit-dynamo/logo-primary.png',
  homeKit: '/detroit-dynamo/home-kit-reference.png',
  awayKit: '/detroit-dynamo/away-kit-reference.png',
  digital: '/detroit-dynamo/digital-reference.png',
  applications: '/detroit-dynamo/applications-reference.png',
};

const applicationCards = [
  {
    icon: MonitorSmartphone,
    title: 'Digital System',
    copy: 'Website surfaces, player content, parent communication, social graphics, and future club announcements.',
  },
  {
    icon: Flag,
    title: 'Matchday Graphics',
    copy: 'Fixture posters, player cards, score graphics, tryout promotions, and event-day templates.',
  },
  {
    icon: ShieldCheck,
    title: 'Merchandise',
    copy: 'Scarves, caps, hoodies, training tops, and daily gear that can carry the club identity cleanly.',
  },
  {
    icon: BadgeCheck,
    title: 'Sponsorship Surfaces',
    copy: 'Sponsor-ready apparel placements, banner systems, digital placements, and community partner inventory.',
  },
];

function SectionKicker({ children }) {
  return (
    <p className="font-oswald text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
      {children}
    </p>
  );
}

function SectionHeader({ kicker, title, copy, align = 'center' }) {
  const textAlign = align === 'left' ? 'text-left' : 'text-center mx-auto';

  return (
    <div className={`mb-10 max-w-3xl ${textAlign}`}>
      <SectionKicker>{kicker}</SectionKicker>
      <h2 className="mt-3 font-oswald text-3xl font-bold leading-tight tracking-[0.035em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {copy && <p className="mt-5 text-sm leading-7 text-[#B8C3D7] sm:text-base">{copy}</p>}
    </div>
  );
}

function DynamoLink({ to, children, variant = 'primary' }) {
  const classes =
    variant === 'primary'
      ? 'border-[var(--dynamo-blue)] bg-[var(--dynamo-blue)] text-[#020714] hover:bg-[var(--dynamo-blue-bright)]'
      : 'border-white/20 bg-white/[0.045] text-white hover:border-[var(--dynamo-blue-bright)] hover:text-[var(--dynamo-blue-bright)]';

  return (
    <Link
      to={to}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-5 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] transition ${classes}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function KitCard({ title, copy, src, alt }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#050B16]">
      <div className="aspect-[4/5] overflow-hidden bg-[#020714] lg:aspect-[5/6]">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="p-6">
        <h3 className="font-oswald text-3xl font-bold tracking-[0.035em] text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#B8C3D7]">{copy}</p>
      </div>
    </article>
  );
}

function ApplicationCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
      <Icon className="h-6 w-6 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
      <h3 className="mt-5 font-oswald text-xl font-bold tracking-[0.035em] text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#B8C3D7]">{item.copy}</p>
    </article>
  );
}

export default function DetroitDynamoBrand() {
  return (
    <div className="text-white">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="dynamo-texture absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_26%,rgba(0,120,255,0.2),transparent_28%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
          <div>
            <div className="mb-7 inline-flex items-center gap-3 rounded-md border border-[rgba(98,216,255,0.24)] bg-white/[0.03] px-3 py-2">
              <Sparkles className="h-4 w-4 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <span className="font-oswald text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                Internal Brand Preview
              </span>
            </div>
            <div className="mb-7 rounded-md border border-[rgba(98,216,255,0.24)] bg-white/[0.035] p-4 text-sm leading-6 text-[#B8C3D7]">
              Internal preview page for brand-system review. Not part of the primary public visitor path.
            </div>
            <h1 className="font-oswald text-5xl font-bold leading-[0.94] tracking-[0.025em] text-white sm:text-7xl">
              Detroit Dynamo
              <span className="block text-[#DCE6F5]">Identity Built to Scale</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#D7DEEA] sm:text-lg">
              A premium soccer identity system for training, academy development, future FC teams, kits, digital media,
              sponsorship, merchandise, and matchday culture.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <DynamoLink to="/detroit-dynamo">Back to Home</DynamoLink>
              <DynamoLink to="/book" variant="secondary">Book Training</DynamoLink>
            </div>
          </div>

          <article id="logo" className="rounded-lg border border-[var(--dynamo-line)] bg-[#050B16]/74 p-6">
            <SectionKicker>Logo System</SectionKicker>
            <div className="mt-6 rounded-lg border border-white/10 bg-[#020714] p-6">
              <img
                src={ASSETS.logo}
                alt="Detroit Dynamo approved primary logo"
                className="mx-auto max-h-[420px] w-full object-contain"
              />
            </div>
            <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
              The approved DD lockup anchors the system: metallic white and silver, deep navy foundation, and a restrained
              electric-blue energy slash.
            </p>
          </article>
        </div>
      </section>

      <section id="kits" className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Kits / Training Gear"
            title="Built for the Pitch. Ready for the City."
            copy="The kit system gives Detroit Dynamo a professional on-field presence while keeping the training environment sharp, wearable, and sponsor-ready."
          />
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.72fr]">
            <KitCard
              title="Home Kit"
              copy="Dark navy foundation, metallic marks, electric-blue trim, and performance details built for the primary club look."
              src={ASSETS.homeKit}
              alt="Detroit Dynamo home kit reference with dark navy match kit and electric blue details"
            />
            <KitCard
              title="Away Kit"
              copy="White and silver away expression with navy contrast, blue detail, and a premium badge system."
              src={ASSETS.awayKit}
              alt="Detroit Dynamo away kit reference with white and silver match kit and detail panels"
            />
            <article className="dynamo-panel flex flex-col justify-between rounded-lg p-6">
              <div>
                <SectionKicker>Training Gear</SectionKicker>
                <h3 className="mt-3 font-oswald text-3xl font-bold tracking-[0.035em] text-white">Daily standard</h3>
                <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                  Black/navy training tops, coach layers, caps, hoodies, and session gear make the system feel serious
                  before a player ever steps into a match kit.
                </p>
              </div>
              <div className="mt-8 grid gap-3">
                {['Player training', 'Coach uniform', 'Travel and sideline', 'Parent / supporter gear'].map((item) => (
                  <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                    <p className="font-oswald text-sm font-semibold tracking-[0.035em] text-white">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="digital" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <SectionHeader
              align="left"
              kicker="Digital / Matchday"
              title="A Brand That Works Beyond the Logo"
              copy="The deeper system covers player content, social posts, matchday graphics, merchandise, environmental graphics, and sponsor surfaces."
            />
            <div className="dynamo-rule hidden lg:block" />
          </div>
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#050B16]">
              <img
                src={ASSETS.digital}
                alt="Detroit Dynamo digital brand applications across matchday, apparel, banners, and stadium graphics"
                className="h-full max-h-[760px] w-full object-cover"
                loading="lazy"
              />
            </article>
            <div className="grid gap-5">
              <article id="matchday" className="overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#050B16]">
                <img
                  src={ASSETS.applications}
                  alt="Detroit Dynamo home kit and identity applications reference"
                  className="h-full max-h-[440px] w-full object-cover"
                  loading="lazy"
                />
              </article>
              <div className="grid gap-4 sm:grid-cols-2">
                {applicationCards.map((item) => (
                  <ApplicationCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsors" className="border-t border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <SectionKicker>Sponsor / Club Growth</SectionKicker>
            <h2 className="mt-3 font-oswald text-3xl font-bold leading-tight tracking-[0.035em] text-white sm:text-4xl lg:text-5xl">
              Presentation Strong Enough for Partners
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#B8C3D7] sm:text-base">
              Dynamo gives the future club room to grow: clean sponsor placements, consistent digital inventory,
              merchandise, event signage, community campaigns, and a serious soccer identity families can recognize.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Kit placement', 'Field banners', 'Social campaigns', 'Event signage'].map((item) => (
              <article key={item} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
                <Zap className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                <h3 className="mt-5 font-oswald text-xl font-bold tracking-[0.035em] text-white">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
