// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Briefcase,
  CalendarDays,
  Check,
  Gauge,
  Goal,
  Handshake,
  LayoutDashboard,
  MapPin,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { coachRepo, pricingPackageRepo } from '@/api/repo';
import { Badge } from '@/components/ui/badge';
import DetroitDynamoLeadForm from '@/components/detroit-dynamo/DetroitDynamoLeadForm';

const ASSETS = {
  logo: '/detroit-dynamo/logo-primary.png',
};

const heroOffers = [
  {
    title: 'Training Academy',
    copy: 'Private, small-group, team, tryout prep, position-specific, camp, and clinic development.',
  },
  {
    title: 'Youth Club',
    copy: 'U7-U19 development roadmap from foundation work into future competitive youth teams.',
  },
  {
    title: 'Senior Teams',
    copy: "Future men's and women's pro-development pathways with roster, schedule, staff, media, and sponsor infrastructure.",
  },
];

const counties = [
  { name: 'Oakland', description: 'North Metro Detroit', detail: 'Private and small-group training across Oakland County.' },
  { name: 'Macomb', description: 'East Metro Detroit', detail: 'Technical work, finishing, and development sessions in Macomb County.' },
  { name: 'Wayne', description: 'Central Metro Detroit', detail: 'A dedicated training path for players across Wayne County.' },
];

const programs = [
  {
    icon: Target,
    title: 'Private Training',
    outcome: 'Individual technical detail',
    copy: '1-on-1 technical detail, finishing, ball mastery, and position-specific development.',
    bookingProgram: 'Private training',
  },
  {
    icon: Users,
    title: 'Small Group Training',
    outcome: 'Competitive reps at pace',
    copy: 'Competitive reps, pressure, tempo, and decision-making with players at a similar level.',
    bookingProgram: 'Small-group training',
  },
  {
    icon: ShieldCheck,
    title: 'Team Training',
    outcome: 'Sharper team habits',
    copy: 'Custom sessions for teams that need sharper habits, faster play, and better execution.',
    bookingProgram: 'Team training',
  },
  {
    icon: Goal,
    title: 'Finishing & Ball Mastery',
    outcome: 'More attacking confidence',
    copy: 'Repetition, creativity, weak-foot work, striking, and attacking confidence.',
    bookingProgram: 'Private training',
  },
  {
    icon: Gauge,
    title: 'Speed / Agility / Performance',
    outcome: 'Soccer-specific movement',
    copy: 'Movement mechanics, acceleration, change of direction, and soccer-specific conditioning.',
    bookingProgram: 'Small-group training',
  },
  {
    icon: Brain,
    title: 'Game IQ',
    outcome: 'Faster decisions',
    copy: 'Scanning, spacing, decision-making, movement off the ball, and tactical understanding.',
    bookingProgram: 'Private training',
  },
];

const methodSteps = [
  ['01', 'Evaluate', 'Assess the player, position demands, confidence, and competitive goals.'],
  ['02', 'Build', 'Create a focused plan with session themes and clear development targets.'],
  ['03', 'Train', 'Run purposeful reps with coaching detail, intensity, and game pressure.'],
  ['04', 'Compete', 'Translate the work into duels, decisions, finishing, and match moments.'],
  ['05', 'Review', 'Track progress, adjust the plan, and keep moving toward the next level.'],
];

const developmentProofs = [
  {
    icon: Target,
    title: 'Cleaner Technique',
    copy: 'First touch, passing, ball mastery, weak foot, and striking details.',
  },
  {
    icon: Brain,
    title: 'Faster Decisions',
    copy: 'Scanning, tempo, pressure, and game-realistic problem solving.',
  },
  {
    icon: Gauge,
    title: 'More Confidence',
    copy: 'Repetition, coaching detail, and competitive training environments.',
  },
  {
    icon: ShieldCheck,
    title: 'Clearer Pathway',
    copy: 'Training options that can grow into academy and future FC opportunities.',
  },
];

const portalCards = [
  {
    icon: CalendarDays,
    title: 'Live Booking Flow',
    copy: 'Use the existing booking process to pick county, coach, package, duration, goals, and checkout.',
    to: '/book',
    cta: 'Book Training',
  },
  {
    icon: LayoutDashboard,
    title: 'Client Portal',
    copy: 'Clients can manage sessions, credits, messages, rescheduling, and progress from the dashboard.',
    to: '/dashboard',
    cta: 'Open Dashboard',
  },
  {
    icon: Briefcase,
    title: 'Coach Portal',
    copy: 'Coaches keep their schedule, sessions, clients, earnings, profile, and messages in the existing portal.',
    to: '/coach',
    cta: 'Open Coach Portal',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Portal',
    copy: 'Admins keep access to coaches, bookings, pricing, users, applications, content, and Dynamo operations.',
    to: '/admin',
    cta: 'Open Admin',
  },
];

const futurePathways = [
  {
    title: 'Detroit Dynamo Training Academy',
    copy: 'Private, small-group, team, tryout-prep, position-specific, and seasonal development.',
    detail: 'Train',
  },
  {
    title: 'Detroit Dynamo Youth Club',
    copy: 'U7-U19 player development roadmap with honest future competitive-pathway language.',
    detail: 'Develop',
  },
  {
    title: 'Detroit Dynamo Senior Teams',
    copy: "Future men's and women's teams connected to training, tryouts, sponsors, media, and matchday operations.",
    detail: 'Compete',
  },
];

const stakeholderCards = [
  {
    icon: Target,
    title: 'For Players',
    copy: 'Sharper touches, faster decisions, better finishing habits, and more confidence under real pressure.',
    highlights: ['Technical repetition', 'Game-speed decisions', 'Position-specific growth'],
    cta: 'View Training Programs',
    to: '/detroit-dynamo#programs',
  },
  {
    icon: BadgeCheck,
    title: 'For Parents',
    copy: 'Clear training options, a visible development path, and a professional environment built around progress.',
    highlights: ['Easy next steps', 'Clear session focus', 'Progress-centered coaching'],
    cta: 'Book an Evaluation',
    to: '/book',
  },
  {
    icon: Users,
    title: 'For Teams & Coaches',
    copy: 'Custom team sessions that reinforce habits, raise tempo, and help groups train with a shared standard.',
    highlights: ['Team technical work', 'Speed of play', 'Competitive training culture'],
    cta: 'Request Team Training',
    to: '/detroit-dynamo/book',
  },
  {
    icon: ShieldCheck,
    title: 'For the Club Pathway',
    copy: 'Training is the foundation. The long-term vision adds youth club structure, senior teams, matchday culture, and community growth.',
    highlights: ['Youth progression', 'Senior teams', 'Club culture'],
    cta: 'Explore the Pathway',
    to: '/detroit-dynamo#pathway',
  },
];

const testimonials = [
  {
    quote: 'Approved parent stories, player quotes, and measurable training outcomes can be published here once collected and verified.',
    name: 'Parent story slot',
    child: 'Ready for a real testimonial',
    county: 'Oakland / Macomb / Wayne',
  },
  {
    quote: 'A player development story can show the before, the training focus, the coach feedback, and the game-day transfer.',
    name: 'Player story slot',
    child: 'Training outcome placeholder',
    county: 'Metro Detroit',
  },
  {
    quote: 'Future sponsor, team, and club-partner quotes can live here without inventing credibility before it exists.',
    name: 'Partner story slot',
    child: 'Sponsor-ready placeholder',
    county: 'Detroit area',
  },
  {
    quote: 'This section is designed for real proof, not fake testimonials. Add approved stories when the backend content model is ready.',
    name: 'Media proof slot',
    child: 'News / video / recap placeholder',
    county: 'Detroit Dynamo',
  },
];

const newsItems = [
  {
    icon: Newspaper,
    title: 'Training Academy Launch Roadmap',
    copy: 'Publish real program announcements, camp releases, and coach updates when approved.',
    to: '/detroit-dynamo/training',
  },
  {
    icon: Users,
    title: 'Youth Club Development Roadmap',
    copy: 'Use future-pathway language until age groups, staff, facilities, and leagues are confirmed.',
    to: '/detroit-dynamo/youth-club',
  },
  {
    icon: Trophy,
    title: 'Senior Team Interest Window',
    copy: "Route men's and women's player interest into the future registrar/admin workflow.",
    to: '/detroit-dynamo/tryouts',
  },
  {
    icon: Handshake,
    title: 'Founding Sponsor Conversations',
    copy: 'Give local partners a clear path into the organization before matchday inventory exists.',
    to: '/detroit-dynamo/sponsors',
  },
];

const contentProofBoard = [
  {
    icon: Newspaper,
    title: 'Program Announcements',
    owner: 'Training Director + Media/Admin Staff',
    proof: 'Approved program name, coach assignment, location, capacity, pricing status, and registration path.',
    publishWhen: 'Publish when the training or camp offer is owner-approved and the CTA routes to a working inquiry or booking flow.',
    blocked: 'Do not announce exact packages, dates, or checkout language until approvals exist.',
  },
  {
    icon: Users,
    title: 'Roster / Staff Updates',
    owner: 'Club Director + Registrar',
    proof: 'Confirmed role, display permission, safeguarding status where relevant, and approved bio/photo assets.',
    publishWhen: 'Publish when staff, roster, tryout, or pathway facts are confirmed and safe to display.',
    blocked: 'Do not list players, coaches, or team placement before consent and operational approval.',
  },
  {
    icon: Handshake,
    title: 'Sponsor Assets',
    owner: 'Media/Admin Staff',
    proof: 'Signed package approval, logo file, usage permission, website link, activation inventory, and placement rules.',
    publishWhen: 'Publish when sponsor proof, display rights, and package language are approved.',
    blocked: 'Do not display sponsor logos or founding-partner claims from conversations alone.',
  },
  {
    icon: Trophy,
    title: 'Matchday / Club Media',
    owner: 'Media/Admin Staff + Team Manager',
    proof: 'Confirmed fixture/result, approved recap, media rights, opponent/venue facts, and claim-safe language.',
    publishWhen: 'Publish when teams, competitions, fixtures, results, or event media are real and verified.',
    blocked: 'Do not imply league membership, official fixtures, or competitive results until confirmed.',
  },
];

function SectionKicker({ children }) {
  return (
    <p className="font-oswald text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
      {children}
    </p>
  );
}

function DynamoButton({ to, children, variant = 'primary' }) {
  const classes =
    variant === 'primary'
      ? 'border-[var(--dynamo-blue)] bg-[var(--dynamo-blue)] text-[#020714] shadow-[0_0_28px_rgba(0,120,255,0.26)] hover:bg-[var(--dynamo-blue-bright)]'
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

function HeroOfferCard({ item }) {
  return (
    <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#050B16]/72 p-5 backdrop-blur-sm">
      <h3 className="font-oswald text-xl font-semibold tracking-[0.035em] text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#B8C3D7]">{item.copy}</p>
    </article>
  );
}

function MethodStrip() {
  return (
    <section id="method" className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionKicker>Training System</SectionKicker>
            <h2 className="mt-3 font-oswald text-2xl font-bold tracking-[0.035em] text-white sm:text-3xl">
              The Dynamo Training System
            </h2>
          </div>
          <DynamoButton to="/book">Book Player Evaluation</DynamoButton>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {methodSteps.map(([number, title, copy]) => (
            <article key={title} className="relative rounded-md border border-[var(--dynamo-line)] bg-[#07172C] p-4">
              <div className="flex items-center gap-3">
                <span className="font-oswald text-sm font-bold text-[var(--dynamo-blue-bright)]">{number}</span>
                <h3 className="font-oswald text-lg font-semibold tracking-[0.035em] text-white">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#AEBBD0]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramCard({ program, index }) {
  const Icon = program.icon;
  const bookingHref = '/book';

  return (
    <article className="group rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5 transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.42)] hover:bg-[#08172C]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
          <Icon className="h-6 w-6 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
        </span>
        <span className="font-oswald text-xs font-semibold text-[#6D7C94]">0{index + 1}</span>
      </div>
      <h3 className="mt-6 font-oswald text-2xl font-semibold tracking-[0.035em] text-white">{program.title}</h3>
      <p className="mt-2 text-sm font-semibold text-[var(--dynamo-blue-bright)]">{program.outcome}</p>
      <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{program.copy}</p>
      <Link
        to={bookingHref}
        className="mt-6 inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#D7DEEA] transition group-hover:text-[var(--dynamo-blue-bright)]"
      >
        Start live booking
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function ProofCard({ proof }) {
  const Icon = proof.icon;

  return (
    <article className="rounded-lg border border-white/10 bg-[#071326] p-5">
      <Icon className="h-6 w-6 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
      <h3 className="mt-5 font-oswald text-xl font-bold tracking-[0.035em] text-white">{proof.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#B8C3D7]">{proof.copy}</p>
    </article>
  );
}

function FuturePathwayCard({ item }) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--dynamo-blue)] via-[var(--dynamo-blue-bright)] to-transparent" aria-hidden="true" />
      <SectionKicker>{item.detail}</SectionKicker>
      <h3 className="mt-4 font-oswald text-2xl font-bold tracking-[0.035em] text-white">{item.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{item.copy}</p>
    </article>
  );
}

function PortalAccessSection() {
  return (
    <section id="portals" className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="Existing Platform"
          title="Booking, Coaches, and Portals Stay Connected"
          copy="Detroit Dynamo now sits on top of the working system that was already built: live booking, coach profiles, client dashboards, coach tools, and admin operations."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {portalCards.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group flex h-full flex-col rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.42)] hover:bg-[#08172C] focus:outline-none focus:ring-2 focus:ring-[rgba(98,216,255,0.45)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
                  <Icon className="h-6 w-6 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-oswald text-2xl font-bold tracking-[0.035em] text-white">{item.title}</h3>
                <p className="mt-4 grow text-sm leading-7 text-[#B8C3D7]">{item.copy}</p>
                <span className="mt-7 inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#D7DEEA] transition group-hover:text-[var(--dynamo-blue-bright)]">
                  {item.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StakeholderCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.42)] hover:bg-[#08172C]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
          <Icon className="h-6 w-6 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
        </span>
        <span className="font-oswald text-xs font-semibold uppercase tracking-[0.12em] text-[#6D7C94]">
          Dynamo
        </span>
      </div>

      <h3 className="mt-6 font-oswald text-2xl font-bold tracking-[0.035em] text-white">{item.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{item.copy}</p>

      <div className="mt-6 grid gap-2">
        {item.highlights.map((highlight) => (
          <div key={highlight} className="flex items-center gap-3 text-sm text-[#D7DEEA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dynamo-blue-bright)]" aria-hidden="true" />
            {highlight}
          </div>
        ))}
      </div>

      <Link
        to={item.to}
        className="mt-7 inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#D7DEEA] transition group-hover:text-[var(--dynamo-blue-bright)]"
      >
        {item.cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function CountySection() {
  return (
    <section id="counties" className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="Training Areas"
          title="Select Your County"
          copy="Each county has a dedicated training path ready to help players find the right coach, location, and next step."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {counties.map((county) => (
            <Link
              key={county.name}
              to={`/book?county=${county.name}`}
              className="group relative min-h-[250px] overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-7 text-center transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.45)] hover:bg-[#08172C]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,120,255,0.18),transparent_56%)] opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
              <div className="relative flex h-full flex-col items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] shadow-[0_0_28px_rgba(0,120,255,0.14)]">
                  <MapPin className="h-7 w-7 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                </span>
                <h3 className="mt-7 font-oswald text-3xl font-bold tracking-[0.04em] text-white">{county.name}</h3>
                <p className="mt-2 text-sm font-semibold text-[#D7DEEA]">{county.description}</p>
                <p className="mt-4 max-w-xs text-sm leading-6 text-[#9EABBF]">{county.detail}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)] opacity-0 transition group-hover:opacity-100">
                  Book in {county.name}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoachShowcaseSection() {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    coachRepo.filter({ is_active: true }, 'display_order').then(setCoaches).catch(() => setCoaches([]));
  }, []);

  return (
    <section id="coaches" className="bg-[#020714] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="Coaching Staff"
          title="Meet the Coaches"
          copy="Hand-picked professionals dedicated to technical detail, confidence, and the next generation of serious Detroit-area players."
        />
        {coaches.length === 0 ? (
          <div className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 text-center">
            <SectionKicker>Coach Profiles</SectionKicker>
            <h3 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-[0.035em] text-white">
              Coach Data Loads From the Existing Platform
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#B8C3D7]">
              Active coach records and public coach profiles are still connected to the existing coach system. The live booking flow also loads those coaches during booking.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <DynamoButton to="/book">Start Live Booking</DynamoButton>
              <DynamoButton to="/coach" variant="secondary">Coach Portal</DynamoButton>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
          {coaches.map((coach) => (
            <Link
              key={coach.id}
              to={`/coaches/${coach.id}`}
              className="group relative block overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#061225] transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.45)] focus:outline-none focus:ring-2 focus:ring-[rgba(98,216,255,0.45)]"
              aria-label={`View profile for ${coach.first_name} ${coach.last_name}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#08172C]">
                {coach.photo_url ? (
                  <img
                    src={coach.photo_url}
                    alt={`Coach ${coach.first_name} ${coach.last_name}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-oswald text-6xl font-bold text-white/15">
                      {coach.first_name?.[0]}{coach.last_name?.[0]}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-[#020714]/35 to-transparent" />
                {coach.is_head_coach && (
                  <Badge className="absolute right-3 top-3 border-0 bg-[var(--dynamo-blue)] text-[#020714] font-oswald text-[10px] uppercase tracking-[0.12em]">
                    <Star className="mr-1 h-3 w-3" aria-hidden="true" />
                    Head Coach
                  </Badge>
                )}
              </div>

              <div className="relative -mt-20 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <span className="font-oswald text-xs uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">
                    {coach.county} County
                  </span>
                </div>
                <h3 className="font-oswald text-2xl font-bold tracking-[0.04em] text-white">
                  {coach.first_name} {coach.last_name}
                </h3>
                {coach.training_area && <p className="mt-2 text-sm text-[#B8C3D7]">{coach.training_area}</p>}
                {coach.specializations?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {coach.specializations.slice(0, 3).map((spec) => (
                      <Badge key={spec} className="border border-white/10 bg-white/[0.06] text-[#D7DEEA] font-oswald text-[10px] uppercase tracking-[0.08em]">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
                {coach.quote && (
                  <p className="mt-5 border-l-2 border-[rgba(98,216,255,0.35)] pl-3 text-sm italic leading-6 text-[#B8C3D7]">
                    "{coach.quote}"
                  </p>
                )}
                <div className="mt-6 flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)] transition group-hover:gap-3">
                  View Profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PricingSection() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    pricingPackageRepo.filter({ is_visible: true }, 'display_order').then(setPackages).catch(() => setPackages([]));
  }, []);

  if (packages.length === 0) return null;

  return (
    <section id="packages" className="bg-[#020714] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="Packages"
          title="Training Packages"
          copy="Invest in your development with flexible options for evaluations, single sessions, and structured player development plans."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => {
            const isFeatured = pkg.badge?.toLowerCase().includes('popular');
            return (
              <article
                key={pkg.id}
                className={`relative flex min-h-[430px] flex-col rounded-lg border p-7 transition ${
                  isFeatured
                    ? 'border-[rgba(98,216,255,0.72)] bg-[#07172C] shadow-[0_0_36px_rgba(0,120,255,0.16)]'
                    : 'border-[var(--dynamo-line)] bg-[#061225] hover:border-[rgba(98,216,255,0.38)]'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="rounded-full bg-[var(--dynamo-blue)] px-4 py-1.5 font-oswald text-[11px] font-bold uppercase tracking-[0.12em] text-[#020714]">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <h3 className="font-oswald text-2xl font-bold uppercase tracking-[0.04em] text-white">{pkg.name}</h3>
                {pkg.description && <p className="mt-4 text-sm leading-6 text-[#B8C3D7]">{pkg.description}</p>}

                <div className="mt-8">
                  <span className="font-oswald text-5xl font-bold text-white">${pkg.price}</span>
                  {pkg.sessions && (
                    <span className="ml-2 text-sm text-[#B8C3D7]">
                      / {pkg.sessions} session{pkg.sessions > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {pkg.includes?.length > 0 && (
                  <ul className="mt-8 space-y-3">
                    {pkg.includes.map((item, index) => (
                      <li key={`${pkg.id}-${index}`} className="flex items-start gap-3 text-sm leading-6 text-[#D7DEEA]">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  to="/book"
                  className={`mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] transition ${
                    isFeatured
                      ? 'bg-[var(--dynamo-blue)] text-[#020714] hover:bg-[var(--dynamo-blue-bright)]'
                      : 'border border-white/10 bg-white/[0.055] text-white hover:border-[var(--dynamo-blue-bright)] hover:text-[var(--dynamo-blue-bright)]'
                  }`}
                >
                  Book This Package
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="families" className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="Proof System"
          title="Testimonial-Ready Without Fake Claims"
          copy="This section is ready for real parent stories, player outcomes, training clips, partner quotes, and media proof once approved content exists."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <p className="text-base italic leading-8 text-[#D7DEEA]">"{testimonial.quote}"</p>
              <div className="mt-6 border-t border-[var(--dynamo-line)] pt-5">
                <h3 className="font-oswald text-2xl font-bold tracking-[0.04em] text-white">{testimonial.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--dynamo-blue-bright)]">{testimonial.child}</p>
                <p className="mt-1 text-sm text-[#AEBBD0]">{testimonial.county}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsMediaSection() {
  return (
    <section id="news" className="bg-[#020714] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="News / Media"
          title="Ready for Real Club Updates"
          copy="Latest news should publish real announcements, tryout windows, camp releases, roster updates, sponsors, and matchday content when those pieces are confirmed."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {newsItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.42)] hover:bg-[#08172C]"
              >
                <Icon className="h-6 w-6 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                <h3 className="mt-5 font-oswald text-xl font-bold uppercase tracking-[0.035em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#B8C3D7]">{item.copy}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#D7DEEA] transition group-hover:text-[var(--dynamo-blue-bright)]">
                  Open
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-end">
            <div>
              <SectionKicker>Publish Only With Approval</SectionKicker>
              <h3 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-[0.035em] text-white">
                Content Proof Board
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">
                Every future news post, media asset, sponsor item, roster update, and result should have proof before it
                moves from draft to public. This keeps the preview serious without inventing credibility.
              </p>
            </div>
            <div className="rounded-md border border-[rgba(98,216,255,0.24)] bg-[#020714] p-4">
              <p className="font-oswald text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                Proof Required Before Publishing
              </p>
              <p className="mt-3 text-sm leading-6 text-[#AEBBD0]">
                No fake testimonials, unapproved sponsor logos, unconfirmed rosters, invented fixtures, or league claims.
                Each item needs an owner, source artifact, display permission, and safe preview/live status.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {contentProofBoard.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-md border border-white/10 bg-[#061225] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-5 w-5 shrink-0 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                    <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[#AEBBD0]">
                      Draft Gate
                    </span>
                  </div>
                  <h4 className="mt-4 font-oswald text-xl font-bold uppercase tracking-[0.035em] text-white">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dynamo-blue-bright)]">
                    {item.owner}
                  </p>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-[#B8C3D7]">
                    <p><span className="font-semibold text-white">Proof:</span> {item.proof}</p>
                    <p><span className="font-semibold text-white">Publish:</span> {item.publishWhen}</p>
                    <p><span className="font-semibold text-white">Blocked:</span> {item.blocked}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeInterestSection() {
  return (
    <section id="interest" className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
        <SectionHeader
          align="left"
          kicker="Interest Form"
          title="Tell Us Where You Fit"
          copy="Players, parents, teams, sponsors, and future partners can use one polished preview form while the permanent backend/admin queue is planned."
        />
        <DetroitDynamoLeadForm variant="contact" source="/detroit-dynamo" compact />
      </div>
    </section>
  );
}

export default function DetroitDynamoHome() {
  return (
    <div className="text-white">
      <section id="home" className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="dynamo-texture absolute inset-0 opacity-55" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(0,120,255,0.22),transparent_28%),linear-gradient(115deg,rgba(255,255,255,0.05),transparent_32%)]"
          aria-hidden="true"
        />
        <img src={ASSETS.logo} alt="" aria-hidden="true" className="dynamo-hero-watermark hidden sm:block" />

        <div className="relative mx-auto max-w-7xl">
          <div className="w-full max-w-4xl min-w-0">
            <div className="mb-7 inline-flex max-w-full items-center gap-3 rounded-md border border-[rgba(98,216,255,0.24)] bg-white/[0.03] px-3 py-2">
              <Sparkles className="h-4 w-4 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <span className="font-oswald text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                Detroit Dynamo Training
              </span>
            </div>
            <h1 className="max-w-full break-words font-oswald text-5xl font-bold leading-[0.94] tracking-[0.025em] text-white sm:text-7xl lg:text-8xl">
              <span className="block">Elite Soccer</span>
              <span className="block">Training</span>
              <span className="block text-[#DCE6F5]">
                Built for the Next <span className="block sm:inline">Level</span>
              </span>
            </h1>
            <p className="mt-6 text-sm font-semibold text-[var(--dynamo-blue-bright)] sm:text-base">
              Built in Detroit. Driven by development.
            </p>
            <p className="mt-6 w-full max-w-[22.5rem] text-base leading-8 text-[#D7DEEA] sm:max-w-2xl sm:text-lg">
              Private training, small-group sessions, and a future club pathway for serious players who want sharper technique, smarter decisions, and a stronger competitive identity.
            </p>
            <div className="mt-9 flex w-full max-w-[22.5rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
              <DynamoButton to="/book">Book Training</DynamoButton>
              <DynamoButton to="/detroit-dynamo/tryouts" variant="secondary">
                Register for Tryouts
              </DynamoButton>
              <Link
                to="/detroit-dynamo/youth-club"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 px-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)] transition hover:text-white sm:w-auto sm:px-4"
              >
                Join the Youth Club
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/detroit-dynamo/sponsors"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 px-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)] transition hover:text-white sm:w-auto sm:px-4"
              >
                Sponsor Detroit Dynamo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid w-full max-w-[22.5rem] gap-5 sm:max-w-none md:grid-cols-3">
            {heroOffers.map((item) => (
              <HeroOfferCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <MethodStrip />

      <PortalAccessSection />

      <CountySection />

      <CoachShowcaseSection />

      <section id="programs" className="bg-[#020714] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Programs"
            title="Training Built Around the Player"
            copy="Every session is built to improve the details that actually show up in games: touch, tempo, movement, decision-making, finishing, and confidence under pressure."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <ProgramCard key={program.title} program={program} index={index} />
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <section id="results" className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
            <SectionHeader
              align="left"
              kicker="Results"
              title="Player Development You Can See"
              copy="Dynamo is built around visible improvement: the technical details, sharper decisions, and repeatable habits that show up when the game gets faster."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {developmentProofs.map((proof) => (
                <ProofCard key={proof.title} proof={proof} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pathway" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-end">
            <SectionHeader
              align="left"
              kicker="The Dynamo Development Pathway"
              title="Private Training to Club Soccer to Senior Level"
              copy="Detroit Dynamo is planned as one connected path: Training Academy, Youth Club, competitive teams, senior men/women, and long-term college/pre-pro opportunities."
            />
            <div className="dynamo-rule hidden lg:block" />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {futurePathways.map((item) => (
              <FuturePathwayCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="who-it-serves" className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Who It Serves"
            title="Built Around the Player - And Everyone Supporting Them"
            copy="Detroit Dynamo is built for the full player ecosystem: serious athletes, parents who want clarity, teams that need sharper development, and a future club pathway that can grow with the city."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stakeholderCards.map((item) => (
              <StakeholderCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <NewsMediaSection />

      <HomeInterestSection />

      <section id="book" className="relative overflow-hidden border-t border-[var(--dynamo-line)] bg-[#020714] px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,120,255,0.22),transparent_38%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl text-center">
          <SectionKicker>Book Training</SectionKicker>
          <h2 className="mt-3 font-oswald text-4xl font-bold leading-tight tracking-[0.035em] text-white sm:text-5xl lg:text-6xl">
            Ready to Start the Dynamo Standard?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#B8C3D7] sm:text-base">
            Choose the right training path, book an evaluation, and start building the details that show up on game day.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <DynamoButton to="/book">Book Training</DynamoButton>
            <DynamoButton to="/detroit-dynamo#programs" variant="secondary">
              View Programs
            </DynamoButton>
          </div>
        </div>
      </section>
    </div>
  );
}
