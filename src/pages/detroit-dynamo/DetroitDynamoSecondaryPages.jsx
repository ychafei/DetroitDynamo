// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Flag,
  Gauge,
  Goal,
  HelpCircle,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Upload,
  Zap,
} from 'lucide-react';
import DetroitDynamoLeadForm from '@/components/detroit-dynamo/DetroitDynamoLeadForm';
import { coachRepo, siteContentRepo } from '@/api/repo';
import { storage } from '@/lib/storage';
import useCurrentUser from '@/hooks/useCurrentUser';

const trainingAreaOptions = ['Oakland', 'Macomb', 'Wayne'];
const trainingProgramOptions = [
  'Private training',
  'Small-group training',
  'Team training',
  'Tryout preparation',
  'Camps / clinics',
  'Goalkeeper training',
];

function trainingInterestHref(programInterest, focusInterest = programInterest) {
  const params = new URLSearchParams();
  params.set('program', programInterest);
  params.set('focus', focusInterest);
  return `/detroit-dynamo/book?${params.toString()}#training-interest`;
}

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

function PageHero({ kicker, title, copy, primaryText, primaryTo, secondaryText, secondaryTo }) {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="dynamo-texture absolute inset-0 opacity-55" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(0,120,255,0.2),transparent_28%),linear-gradient(115deg,rgba(255,255,255,0.045),transparent_32%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_0.45fr] lg:items-end">
        <div className="min-w-0">
          <div className="mb-7 inline-flex items-center gap-3 rounded-md border border-[rgba(98,216,255,0.24)] bg-white/[0.03] px-3 py-2">
            <Sparkles className="h-4 w-4 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
            <span className="font-oswald text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
              {kicker}
            </span>
          </div>
          <h1 className="max-w-4xl break-words font-oswald text-5xl font-bold uppercase leading-[0.94] tracking-[0.025em] text-white sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#D7DEEA] sm:text-lg">{copy}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <DynamoButton to={primaryTo}>{primaryText}</DynamoButton>
            {secondaryText && secondaryTo && (
              <DynamoButton to={secondaryTo} variant="secondary">
                {secondaryText}
              </DynamoButton>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225]/78 p-5">
          <SectionKicker>Built in Detroit</SectionKicker>
          <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">
            A premium training identity built around detail, discipline, player confidence, and long-term development.
          </p>
        </div>
      </div>
    </section>
  );
}

function ExistingAboutStorySection() {
  const [coaches, setCoaches] = useState([]);
  const [foundersPhoto, setFoundersPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useCurrentUser();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    coachRepo.filter({ is_active: true }, 'display_order').then(setCoaches).catch(() => setCoaches([]));
    siteContentRepo.filter({ key: 'founders_photo' }).then((results) => {
      if (results.length > 0) setFoundersPhoto(results[0]);
    }).catch(() => setFoundersPhoto(null));
  }, []);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url: fileUrl } = await storage.uploadFile('site-content', file);
      if (foundersPhoto) {
        const nextPhoto = await siteContentRepo.update(foundersPhoto.id, { value: fileUrl });
        setFoundersPhoto(nextPhoto);
      } else {
        const nextPhoto = await siteContentRepo.create({ key: 'founders_photo', value: fileUrl, content_type: 'image' });
        setFoundersPhoto(nextPhoto);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-center">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#061225]">
              {foundersPhoto?.value ? (
                <img src={foundersPhoto.value} alt="Detroit Dynamo founders" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="font-oswald text-xs font-bold uppercase tracking-[0.16em] text-[#8390A6]">
                    Founders Photo
                  </p>
                </div>
              )}
              {isAdmin && (
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition hover:opacity-100">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  <span className="text-center text-white">
                    <Upload className="mx-auto mb-2 h-8 w-8" aria-hidden="true" />
                    <span className="font-oswald text-xs font-bold uppercase tracking-[0.14em]">
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </span>
                  </span>
                </label>
              )}
            </div>
            <div className="absolute -bottom-4 -left-4 h-1 w-32 bg-[var(--dynamo-blue-bright)]" aria-hidden="true" />
          </div>

          <div>
            <SectionKicker>Original Story</SectionKicker>
            <h2 className="mt-3 font-oswald text-4xl font-bold uppercase leading-tight tracking-[0.035em] text-white sm:text-5xl">
              Three Teammates. One Detroit Standard.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[#B8C3D7] sm:text-base">
              <p>
                It started on a college soccer field: three young men from Metro Detroit who shared more than a love
                for the game. They shared the belief that players deserve the right guidance, the right coaching, and
                the right push.
              </p>
              <p>
                Through early-morning trainings, film sessions, and the kind of accountability that comes from a real
                locker room, the promise was simple: come back home and help the next generation get what serious
                players need.
              </p>
              <p className="font-semibold text-white">
                Detroit Dynamo carries that promise forward across Oakland, Macomb, and Wayne counties with a stronger
                identity, a clearer pathway, and the same player-first training foundation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Target, 'Precision', 'Every session is tailored to the individual athlete.'],
            [Users, 'Community', 'Building connections across Metro Detroit.'],
            [Trophy, 'Excellence', 'Pushing standards higher for serious players.'],
            [MapPin, 'Local', 'Oakland, Macomb, Wayne, and one Detroit pathway.'],
          ].map(([Icon, title, copy]) => (
            <InfoCard key={title} icon={Icon} title={title} copy={copy} />
          ))}
        </div>

        <div className="mt-16">
          <SectionHeader
            kicker="Coaching Staff"
            title="Existing Coach Profiles Stay Connected"
            copy="The Dynamo About page now uses the same active coach records that powered the original About and booking experience."
          />
          {coaches.length === 0 ? (
            <div className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 text-center">
              <p className="text-sm leading-7 text-[#B8C3D7]">
                Active coach profiles appear here when the coach records are available. The live booking flow still
                connects players to available coaches.
              </p>
              <div className="mt-6">
                <DynamoButton to="/book">Start Live Booking</DynamoButton>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {coaches.map((coach) => (
                <Link
                  key={coach.id}
                  to={`/coaches/${coach.id}`}
                  className="group rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 text-center transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.42)] hover:bg-[#08172C]"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.045]">
                    {coach.photo_url ? (
                      <img src={coach.photo_url} alt={`Coach ${coach.first_name} ${coach.last_name}`} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-oswald text-2xl font-bold text-white/25">
                        {coach.first_name?.[0]}{coach.last_name?.[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 font-oswald text-xl font-bold uppercase tracking-[0.04em] text-white">
                    {coach.first_name} {coach.last_name}
                  </h3>
                  <p className="mt-2 inline-flex items-center justify-center gap-1.5 font-oswald text-xs uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {coach.county} County
                  </p>
                  {coach.is_head_coach && (
                    <p className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--dynamo-blue)] px-3 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-[#020714]">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      Head Coach
                    </p>
                  )}
                  {coach.bio && <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#B8C3D7]">{coach.bio}</p>}
                  <span className="mt-5 inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#D7DEEA] transition group-hover:text-[var(--dynamo-blue-bright)]">
                    View Profile
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ kicker, title, copy, align = 'center' }) {
  const textAlign = align === 'left' ? 'text-left' : 'text-center mx-auto';

  return (
    <div className={`mb-10 max-w-3xl ${textAlign}`}>
      <SectionKicker>{kicker}</SectionKicker>
      <h2 className="mt-3 font-oswald text-3xl font-bold uppercase leading-tight tracking-[0.035em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {copy && <p className="mt-5 text-sm leading-7 text-[#B8C3D7] sm:text-base">{copy}</p>}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <div className="mt-5 grid gap-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3 text-sm text-[#D7DEEA]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
          {item}
        </div>
      ))}
    </div>
  );
}

function InfoCard({ icon: Icon, kicker, title, copy, bullets, cta, to }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 transition hover:-translate-y-1 hover:border-[rgba(98,216,255,0.42)] hover:bg-[#08172C]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
          <Icon className="h-6 w-6 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
        </span>
        {kicker && (
          <span className="font-oswald text-xs font-semibold uppercase tracking-[0.12em] text-[#6D7C94]">
            {kicker}
          </span>
        )}
      </div>
      <h3 className="mt-6 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{copy}</p>
      {bullets && <BulletList items={bullets} />}
      {cta && to && (
        <Link
          to={to}
          className="mt-7 inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#D7DEEA] transition group-hover:text-[var(--dynamo-blue-bright)]"
        >
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}

function StepStrip({ steps }) {
  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {steps.map(([number, title, copy]) => (
        <article key={title} className="rounded-md border border-[var(--dynamo-line)] bg-[#07172C] p-4">
          <div className="flex items-center gap-3">
            <span className="font-oswald text-sm font-bold text-[var(--dynamo-blue-bright)]">{number}</span>
            <h3 className="font-oswald text-lg font-semibold uppercase tracking-[0.035em] text-white">{title}</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#AEBBD0]">{copy}</p>
        </article>
      ))}
    </div>
  );
}

function CtaSection({ title, copy, primaryText = 'Book Training', primaryTo = '/book', secondaryText, secondaryTo }) {
  return (
    <section className="relative overflow-hidden border-t border-[var(--dynamo-line)] bg-[#020714] px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,120,255,0.22),transparent_38%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl text-center">
        <SectionKicker>Next Step</SectionKicker>
        <h2 className="mt-3 font-oswald text-4xl font-bold uppercase leading-tight tracking-[0.035em] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#B8C3D7] sm:text-base">{copy}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <DynamoButton to={primaryTo}>{primaryText}</DynamoButton>
          {secondaryText && secondaryTo && (
            <DynamoButton to={secondaryTo} variant="secondary">
              {secondaryText}
            </DynamoButton>
          )}
        </div>
      </div>
    </section>
  );
}

const trainingPrograms = [
  {
    icon: Target,
    title: 'Private Training',
    copy: 'For players who need individual detail and a plan built around their position, confidence, and goals.',
    bullets: ['Who it is for: committed individual players', 'Works on: technique, finishing, ball mastery, position detail', 'Outcome: cleaner habits under pressure'],
    bookingProgram: 'Private training',
  },
  {
    icon: Users,
    title: 'Small Group Training',
    copy: 'For players who need competitive reps with athletes at a similar level and a faster training tempo.',
    bullets: ['Who it is for: players ready for live pressure', 'Works on: scanning, tempo, duels, decision-making', 'Outcome: faster execution in game moments'],
    bookingProgram: 'Small-group training',
  },
  {
    icon: ShieldCheck,
    title: 'Team Training',
    copy: 'For teams that need sharper habits, faster play, and a consistent development standard.',
    bullets: ['Who it is for: coaches and full teams', 'Works on: shared habits, speed of play, execution', 'Outcome: a more connected training culture'],
    bookingProgram: 'Team training',
  },
  {
    icon: Trophy,
    title: 'Tryout Preparation',
    copy: 'For players getting ready for club, high school, college ID, or future Detroit Dynamo evaluation environments.',
    bullets: ['Who it is for: players preparing for selection', 'Works on: confidence, speed, habits, and position impact', 'Outcome: clearer readiness under pressure'],
    bookingProgram: 'Tryout preparation',
  },
  {
    icon: Goal,
    title: 'Position-Specific Training',
    copy: 'For players who need work tied to the demands of their role, not generic cone patterns.',
    bullets: ['Who it is for: goalkeepers, defenders, midfielders, forwards', 'Works on: role habits, decisions, and match actions', 'Outcome: more useful game transfer'],
    bookingProgram: 'Private training',
  },
  {
    icon: CalendarDays,
    title: 'Camps & Clinics',
    copy: 'For seasonal blocks around finishing, goalkeeper work, speed/agility, winter indoor training, and summer development.',
    bullets: ['Who it is for: players who want focused training windows', 'Works on: clinic-specific themes', 'Outcome: sharper reps in a short development block'],
    bookingProgram: 'Camps / clinics',
  },
];

export function DetroitDynamoTraining() {
  return (
    <div>
      <PageHero
        kicker="Training"
        title="Elite Training for Serious Players"
        copy="Private training, small groups, team sessions, and player-specific development built around the details that actually show up in games."
        primaryText="Book Training"
        primaryTo="/book"
        secondaryText="Training Inquiry"
        secondaryTo="/detroit-dynamo/book#training-interest"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Programs"
            title="What Players Can Book"
            copy="Each program has a clear purpose: technical detail, decision-making, finishing, team habits, movement quality, or tactical understanding."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {trainingPrograms.map((program) => (
              <InfoCard
                key={program.title}
                {...program}
                cta="Start this program"
                to={trainingInterestHref(program.bookingProgram, program.title)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Training Focus"
            title="The Details That Change Games"
            copy="Dynamo sessions are built around the full player: technical execution, tactical choices, athletic movement, mental confidence, and competitive habits."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              [Target, 'Technical', 'Touch, passing, ball mastery, first action, weak foot, striking.'],
              [Brain, 'Tactical', 'Scanning, spacing, timing, pressure cues, and position decisions.'],
              [Dumbbell, 'Physical', 'Movement mechanics, acceleration, agility, balance, and repeat intensity.'],
              [BadgeCheck, 'Mental', 'Confidence, focus, composure, and response to mistakes.'],
              [Trophy, 'Competitive Habits', 'Tempo, accountability, duel mentality, and match transfer.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Session Flow"
            title="How a Session Moves"
            copy="Players should know why they are doing the work, feel pressure inside the work, and leave with a clear next step."
          />
          <StepStrip
            steps={[
              ['01', 'Warm-up', 'Warm up with purpose and movement patterns tied to the session focus.'],
              ['02', 'Technical Detail', 'Slow the detail down, correct the habit, then build speed.'],
              ['03', 'Pressure Reps', 'Add defenders, time, space limits, and competitive triggers.'],
              ['04', 'Game Application', 'Connect the skill to realistic match decisions and moments.'],
              ['05', 'Review', 'Name the next step so the player knows what to repeat.'],
            ]}
          />
        </div>
      </section>

      <CtaSection
        title="Ready to Train with Intent?"
        copy="Choose the right program, book an evaluation, and start building the details that show up on game day."
        primaryText="Book Training"
        primaryTo="/book"
      />
    </div>
  );
}

export function DetroitDynamoFC() {
  return (
    <div>
      <PageHero
        kicker="Future Club Pathway"
        title="Detroit Dynamo FC"
        copy="A future competitive pathway for players ready to represent a stronger standard. This is a club platform preview built to scale from training into academy structure and future team identity."
        primaryText="Join the Future Pathway"
        primaryTo="/detroit-dynamo/book"
        secondaryText="Book Evaluation"
        secondaryTo="/book"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Club Pathway"
            title="Built from Training into Representation"
            copy="Detroit Dynamo FC is framed as the future competitive identity, not a current operating claim. The path starts with player development and grows into structure."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Target, 'Training Foundation', 'Technical detail, confidence, and player plans come first.'],
              [Layers, 'Academy Development', 'Cohorts, curriculum, benchmarks, and seasonal progression.'],
              [Trophy, 'Competitive Teams', 'Future teams, fixtures, tryouts, and roster standards.'],
              [Flag, 'Matchday Identity', 'A club presentation that players, families, and partners can believe in.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
            <SectionHeader
              align="left"
              kicker="Matchday Concept"
              title="What the Future Club Could Look Like"
              copy="The FC pathway can eventually support player cards, fixtures, team identity, sponsor-ready assets, and a stronger community presence without making fake claims today."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [BadgeCheck, 'Player Cards', 'Clean player profiles and development stories when real rosters exist.'],
                [CalendarDays, 'Fixtures', 'Future schedules, tryouts, events, and matchday announcements.'],
                [ShieldCheck, 'Team Identity', 'A consistent club standard across apparel, media, and communication.'],
                [Users, 'Community Presence', 'A future pathway that gives families something local to rally around.'],
              ].map(([Icon, title, copy]) => (
                <InfoCard key={title} icon={Icon} title={title} copy={copy} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Player Expectations"
            title="The Standard to Represent"
            copy="The future FC pathway should reward more than talent. It should reward the habits that make a player reliable in a competitive environment."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              [ShieldCheck, 'Discipline', 'Consistent effort and accountability.'],
              [Target, 'Development', 'A willingness to improve specific details.'],
              [BadgeCheck, 'Commitment', 'Respect for the work and the team environment.'],
              [Trophy, 'Competitive Mindset', 'The ability to handle pressure and respond.'],
              [Users, 'Team Culture', 'Standards that raise the group, not just the individual.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Step into the Future Pathway"
        copy="Start with evaluation and development work before the future competitive structure is promoted."
        primaryText="Join the Future Pathway"
        primaryTo="/detroit-dynamo/book"
        secondaryText="Book Evaluation"
        secondaryTo="/book"
      />
    </div>
  );
}

export function DetroitDynamoAcademy() {
  return (
    <div>
      <PageHero
        kicker="Academy"
        title="The Player Development Engine"
        copy="Structured development for players who need more than random training sessions. The academy pathway gives families a clearer rhythm, curriculum, and standard."
        primaryText="Start with an Evaluation"
        primaryTo="/book"
        secondaryText="View Training"
        secondaryTo="/detroit-dynamo/training"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Academy Promise"
            title="More Structure. More Clarity. More Transfer."
            copy="A serious player needs repeatable themes, clear expectations, and work that connects back to the game."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Layers, 'Foundation', 'Ball comfort, movement habits, confidence, and basic decision cues.'],
              [Target, 'Emerging', 'Sharper technique, competitive reps, and position-specific habits.'],
              [Trophy, 'Competitive', 'Higher tempo, pressure, tactical awareness, and match transfer.'],
              [Zap, 'Elite Prep', 'Details, standards, and accountability for players pushing toward the next level.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Curriculum Pillars"
            title="A Complete Player Framework"
            copy="The academy structure should develop the player across technique, understanding, movement, confidence, and character."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              [Target, 'Technical Mastery', 'Touch, passing, ball control, finishing, and weak foot.'],
              [Brain, 'Tactical Understanding', 'Spacing, scanning, timing, and decision-making.'],
              [Gauge, 'Athletic Movement', 'Speed, agility, balance, and soccer-specific movement.'],
              [BadgeCheck, 'Mental Confidence', 'Composure, courage, focus, and response to pressure.'],
              [ShieldCheck, 'Character & Leadership', 'Discipline, communication, accountability, and respect.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Progression Timeline"
            title="How Players Move Forward"
            copy="Parents and players should understand where the work starts, what the focus is, and what needs to happen next."
          />
          <StepStrip
            steps={[
              ['01', 'Evaluate', 'Understand level, goals, position, and confidence.'],
              ['02', 'Place', 'Match the player to the right training rhythm and challenge.'],
              ['03', 'Train', 'Build the details through repetition, pressure, and feedback.'],
              ['04', 'Review', 'Track what is improving and what needs more attention.'],
              ['05', 'Advance', 'Increase challenge when the habits are ready.'],
            ]}
          />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <SectionHeader
            align="left"
            kicker="Parent Clarity"
            title="Parents Should Know the Why"
            copy="A better academy pathway gives parents clarity about what their player is working on, why it matters, and what progress should look like over time."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {['Clear session themes', 'Visible development focus', 'Simple next steps', 'Professional expectations'].map((item) => (
              <article key={item} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
                <CheckCircle2 className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                <h3 className="mt-5 font-oswald text-xl font-bold uppercase tracking-[0.035em] text-white">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Start with an Evaluation"
        copy="Find the right development rhythm before choosing the next training path."
        primaryText="Start with an Evaluation"
        primaryTo="/book"
      />
    </div>
  );
}

export function DetroitDynamoBook() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCounty = queryParams.get('county');
  const selectedProgram = queryParams.get('program');
  const selectedFocus = queryParams.get('focus') || '';
  const countyInterest = trainingAreaOptions.includes(selectedCounty) ? selectedCounty : '';
  const programInterest = trainingProgramOptions.includes(selectedProgram) ? selectedProgram : '';
  const focusInterest = selectedFocus.trim().replace(/\s+/g, ' ').slice(0, 80);
  const countyNote = countyInterest ? `County interest: ${countyInterest} County.` : '';
  const programNote = programInterest ? `Program interest: ${programInterest}.` : '';
  const focusNote = focusInterest ? `Training focus: ${focusInterest}.` : '';
  const contextNotes = [countyNote, programNote, focusNote].filter(Boolean).join('\n');
  const sourceParams = new URLSearchParams();
  if (countyInterest) sourceParams.set('county', countyInterest);
  if (programInterest) sourceParams.set('program', programInterest);
  if (focusInterest) sourceParams.set('focus', focusInterest);
  const sourceRoute = sourceParams.toString()
    ? `/detroit-dynamo/book?${sourceParams.toString()}`
    : '/detroit-dynamo/book';
  const sessions = [
    ['Private Session', 'Best for individual players', 'Technical detail, finishing, ball mastery, confidence, and position-specific work.'],
    ['Small Group Session', 'Best for competitive reps', 'Pressure, tempo, decision-making, duels, and game-realistic repetition.'],
    ['Team Training', 'Best for coaches and teams', 'Shared habits, speed of play, execution, and a sharper training culture.'],
    ['Player Evaluation', 'Best first step', 'Assess the player, identify priorities, and choose the right development path.'],
  ];

  return (
    <div>
      <PageHero
        kicker="Booking"
        title="Book Detroit Dynamo Training"
        copy="Use the existing booking process to choose your county, coach, package, duration, training goals, and checkout path. Use the inquiry form below when you need staff help choosing the right fit."
        primaryText="Start Live Booking"
        primaryTo="/book"
        secondaryText="Training Inquiry"
        secondaryTo="/detroit-dynamo/book#training-interest"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Sessions"
            title="Choose the Right Starting Point"
            copy="If you are not sure what fits, start with a player evaluation and use it to build the plan."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {sessions.map(([title, bestFor, focus]) => (
              <InfoCard
                key={title}
                icon={CalendarDays}
                title={title}
                copy={focus}
                bullets={[bestFor, 'Live flow: county, coach, package, duration, goals, checkout', 'Secondary path: ask staff about fit']}
                cta="Start booking"
                to="/book"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="training-interest" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
            <SectionKicker>Training Inquiry</SectionKicker>
            <h2 className="mt-3 font-oswald text-3xl font-bold uppercase leading-tight tracking-[0.035em] text-white sm:text-4xl">
              Need Help Choosing the Right Fit?
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">
              The live booking flow is already connected at `/book`. This form is the staff-follow-up path for players,
              parents, or teams who want guidance before booking.
            </p>
            <BulletList
              items={[
                'Routes to the Training Director / Booking queue for follow-up',
                'Captures program interest, contact info, and player goals',
                'Keeps club/camp package questions separate from the live private-training checkout',
              ]}
            />
            {countyInterest && (
              <div className="mt-5 rounded-md border border-[rgba(98,216,255,0.24)] bg-[#020714] p-4">
                <SectionKicker>County Interest</SectionKicker>
                <p className="mt-3 text-sm leading-6 text-[#D7DEEA]">
                  This inquiry is tagged for <span className="font-semibold text-white">{countyInterest} County</span>.
                  The training queue preserves that context for the Training Director / Booking workflow.
                </p>
              </div>
            )}
            {(programInterest || focusInterest) && (
              <div className="mt-5 rounded-md border border-[rgba(98,216,255,0.24)] bg-[#020714] p-4">
                <SectionKicker>Program Interest</SectionKicker>
                <p className="mt-3 text-sm leading-6 text-[#D7DEEA]">
                  {programInterest && (
                    <>
                      Program interest: <span className="font-semibold text-white">{programInterest}</span>.
                    </>
                  )}
                  {programInterest && focusInterest ? ' ' : ''}
                  {focusInterest && (
                    <>
                      Training focus: <span className="font-semibold text-white">{focusInterest}</span>.
                    </>
                  )}
                  {' '}This context is prefilled into the training queue so the Training Director can see what the player clicked before submitting.
                </p>
              </div>
            )}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <DynamoButton to="/detroit-dynamo/contact" variant="secondary">Contact Staff</DynamoButton>
              <DynamoButton to="/detroit-dynamo/admin-foundation" variant="secondary">View Admin Plan</DynamoButton>
            </div>
          </article>

          <DetroitDynamoLeadForm
            variant="training"
            source={sourceRoute}
            defaultProgramInterest={programInterest}
            defaultNotes={contextNotes}
          />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 text-center">
          <SectionKicker>Booking Note</SectionKicker>
          <p className="mt-4 text-sm leading-7 text-[#D7DEEA] sm:text-base">
            The existing private-training booking process is live at `/book`. Dynamo-specific club/camp packages,
            waivers, and new approval-gated products should still be confirmed before they are sold publicly.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <DynamoButton to="/book">Start Live Booking</DynamoButton>
            <DynamoButton to="/detroit-dynamo/contact" variant="secondary">Contact About Training</DynamoButton>
          </div>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader kicker="FAQ" title="Booking Questions" copy="Simple answers before you choose a training path." />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Who is training for?', 'Serious players who want clearer technical detail, more confidence, and better game transfer.'],
              ['What should players bring?', 'Soccer shoes, water, a ball if requested, and a willingness to work with focus.'],
              ['How do I know which session fits?', 'Start with an evaluation if the right path is unclear.'],
              ['Can teams book training?', 'Yes. Team sessions can focus on habits, tempo, execution, and shared standards.'],
              ['Is Detroit Dynamo FC active yet?', 'Detroit Dynamo FC is presented as a future competitive pathway until league, roster, and schedule confirmations are approved.'],
            ].map(([question, answer]) => (
              <article key={question} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
                <HelpCircle className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                <h3 className="mt-4 font-oswald text-xl font-bold uppercase tracking-[0.035em] text-white">{question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#B8C3D7]">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function DetroitDynamoResults() {
  return (
    <div>
      <PageHero
        kicker="Results"
        title="Player Development You Can See"
        copy="Results should be visible in habits: cleaner technique, faster decisions, stronger finishing, better movement, more confidence, and a clearer training plan."
        primaryText="Book Player Evaluation"
        primaryTo="/book"
        secondaryText="View Training"
        secondaryTo="/detroit-dynamo/training"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader kicker="Outcomes" title="What Improvement Should Look Like" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              [Target, 'Cleaner Technique', 'Better first touch, passing, ball mastery, weak foot, and striking details.'],
              [Brain, 'Faster Decisions', 'Scanning, tempo, pressure, and game-realistic problem solving.'],
              [Goal, 'Stronger Finishing', 'Composure, striking habits, timing, and more attacking variety.'],
              [Gauge, 'Better Movement', 'Acceleration, balance, change of direction, and soccer-specific conditioning.'],
              [BadgeCheck, 'More Confidence', 'Repetition, coaching detail, and competitive training environments.'],
              [ShieldCheck, 'Clearer Training Plan', 'Training options that can grow into academy and future FC opportunities.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
            <SectionKicker>Before</SectionKicker>
            <h2 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-[0.035em] text-white">
              Unclear Training
            </h2>
            <BulletList items={['Random reps', 'Unclear focus', 'Low pressure', 'No visible plan']} />
          </article>
          <article className="rounded-lg border border-[rgba(98,216,255,0.34)] bg-[#07172C] p-6">
            <SectionKicker>After</SectionKicker>
            <h2 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-[0.035em] text-white">
              Dynamo Standard
            </h2>
            <BulletList items={['Targeted detail', 'Pressure reps', 'Game-speed decisions', 'Visible next steps']} />
          </article>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="What We Track"
            title="The Details Parents and Players Can Understand"
            copy="No fake stats. No invented testimonials. Just the soccer details that can be watched, coached, and improved."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['First touch', 'Weak foot', 'Passing tempo', 'Scanning', 'Finishing habits', '1v1 confidence', 'Position-specific decisions', 'Conditioning / movement quality'].map((item) => (
              <div key={item} className="rounded-md border border-[var(--dynamo-line)] bg-[#061225] p-4 font-semibold text-[#D7DEEA]">
                {item}
              </div>
            ))}
          </div>
          <article className="mt-8 rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
            <SectionKicker>Future Proof</SectionKicker>
            <h3 className="mt-3 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
              Real Player Stories Can Live Here
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">
              When approved real testimonials, training clips, player stories, or measurable development examples are
              available, they can be added here without inventing names, statistics, or commitments.
            </p>
          </article>
        </div>
      </section>

      <CtaSection
        title="Start with an Evaluation"
        copy="Build a clearer plan around the player and start tracking the details that matter."
        primaryText="Book Player Evaluation"
        primaryTo="/book"
      />
    </div>
  );
}

export function DetroitDynamoAbout() {
  return (
    <div>
      <PageHero
        kicker="About"
        title="Built in Detroit. Driven by Development."
        copy="Detroit Dynamo exists to build serious players through detail, discipline, confidence, and a professional training standard."
        primaryText="Book Training"
        primaryTo="/book"
        secondaryText="View Programs"
        secondaryTo="/detroit-dynamo/training"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
          <SectionHeader
            align="left"
            kicker="Mission"
            title="Build Serious Players"
            copy="The mission is simple: help players train with purpose, understand the details, and build habits that carry into competitive moments."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Target, 'Development', 'Every session should move the player forward.'],
              [ShieldCheck, 'Discipline', 'A serious standard around work, focus, and accountability.'],
              [BadgeCheck, 'Confidence', 'Players need reps, correction, and belief under pressure.'],
              [Trophy, 'Competitive Habits', 'Training should transfer into game speed and decisions.'],
              [Users, 'Community', 'A local soccer identity families can recognize and grow with.'],
              [Layers, 'Long-term Growth', 'Training today can become academy and future club structure.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <ExistingAboutStorySection />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Why Dynamo"
            title="A Stronger Identity for a Bigger Pathway"
            copy="Detroit Dynamo is built to support training, academy structure, future club growth, and a more memorable soccer presence for serious players and families."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Target, 'Players', 'More detail, stronger identity, and clearer development options.'],
              [BadgeCheck, 'Parents', 'A professional environment with visible next steps.'],
              [Users, 'Teams', 'Custom training standards for groups and coaches.'],
              [Flag, 'Future Club Pathway', 'A platform that can grow into academy and FC culture.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Staff / Standards"
            title="Built for a Real Technical Staff"
            copy="The public site is ready for confirmed directors, coaches, team managers, registrar roles, media/admin staff, and player-safety standards without inventing names."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [ShieldCheck, 'Club Director', 'Owns standards, pathway, staffing, and club operations.'],
              [Target, 'Training Director', 'Owns curriculum, sessions, coach education, and player plans.'],
              [Users, 'Coaches / Managers', 'Support teams, communication, attendance, and matchday organization.'],
              [BadgeCheck, 'Registrar / Admin', 'Manages leads, forms, waivers, payments, rosters, and schedules.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Train Under the Dynamo Standard"
        copy="Book training, view programs, and start building the details that show up on game day."
        primaryText="Book Training"
        primaryTo="/book"
        secondaryText="View Programs"
        secondaryTo="/detroit-dynamo/training"
      />
    </div>
  );
}
