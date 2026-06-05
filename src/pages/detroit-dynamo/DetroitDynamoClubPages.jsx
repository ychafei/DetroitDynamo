// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Database,
  Dumbbell,
  ExternalLink,
  Filter,
  Flag,
  Goal,
  Handshake,
  Inbox,
  KeyRound,
  MapPin,
  Medal,
  Megaphone,
  Newspaper,
  RefreshCcw,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import DetroitDynamoLeadForm from '@/components/detroit-dynamo/DetroitDynamoLeadForm';
import { getDetroitDynamoPreviewLeads } from '@/lib/detroitDynamoLeads';
import {
  detroitDynamoAdminModules,
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoBackendActivationSteps,
  detroitDynamoCollectionPlan,
  detroitDynamoDataModels,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoLaunchReadiness,
  detroitDynamoLeadPipelineStages,
  detroitDynamoLeadRouting,
  detroitDynamoPromotionGates,
} from '@/lib/detroitDynamoDataModel';
import {
  detroitDynamoModuleActionGuards,
  detroitDynamoRoleAccessSummaries,
} from '@/lib/detroitDynamoAdminAccess';
import { buildDetroitDynamoExternalGateContractReport } from '@/lib/detroitDynamoExternalGateContracts';
import { buildDetroitDynamoClaimSafetyContractReport } from '@/lib/detroitDynamoClaimSafetyContract';
import { buildDetroitDynamoLeadIntakeContractReport } from '@/lib/detroitDynamoLeadIntakeContract';
import { buildDetroitDynamoPipelineActionContractReport } from '@/lib/detroitDynamoPipelineActionContract';
import { buildDetroitDynamoAdminModuleReadContractReport } from '@/lib/detroitDynamoAdminModuleReadContract';
import { buildDetroitDynamoAdminModuleWriteContractReport } from '@/lib/detroitDynamoAdminModuleWriteContract';
import { buildDetroitDynamoAdminRoleGrantContractReport } from '@/lib/detroitDynamoAdminRoleGrantContract';
import { buildDetroitDynamoAdminRecordWorkspaceReport } from '@/lib/detroitDynamoAdminRecordWorkspaceContract';
import { buildDetroitDynamoLaunchEvidenceReport } from '@/lib/detroitDynamoLaunchEvidenceContract';
import { buildDetroitDynamoLaunchEvidenceActionReport } from '@/lib/detroitDynamoLaunchEvidenceActions';
import { buildDetroitDynamoExternalConfirmationActionReport } from '@/lib/detroitDynamoExternalConfirmationActions';
import { buildDetroitDynamoOwnerLaunchReviewReport } from '@/lib/detroitDynamoOwnerLaunchReview';
import { buildDetroitDynamoOwnerEvidenceIntakeReport } from '@/lib/detroitDynamoOwnerEvidenceIntake';
import { buildDetroitDynamoProductionPreviewEvidenceReport } from '@/lib/detroitDynamoProductionPreviewEvidence';
import { buildDetroitDynamoLiveReadinessBoardReport } from '@/lib/detroitDynamoLiveReadinessBoard';
import { buildDetroitDynamoLaunchArtifactIndexReport } from '@/lib/detroitDynamoLaunchArtifactIndex';
import { buildDetroitDynamoDeploymentReadinessReport } from '@/lib/detroitDynamoDeploymentReadiness';
import { buildDetroitDynamoVercelPreviewRunbookReport } from '@/lib/detroitDynamoVercelPreviewRunbook';
import { buildDetroitDynamoSecretRedactionReport } from '@/lib/detroitDynamoSecretRedactionContract';
import { buildDetroitDynamoExternalGateClosureReport } from '@/lib/detroitDynamoExternalGateClosurePacket';
import { buildDetroitDynamoOwnerHandoffPacketReport } from '@/lib/detroitDynamoOwnerHandoffPacket';
import { buildDetroitDynamoOwnerSignoffRegisterReport } from '@/lib/detroitDynamoOwnerSignoffRegister';
import { buildDetroitDynamoFinalAcceptanceMatrixReport } from '@/lib/detroitDynamoFinalAcceptanceMatrix';
import { buildDetroitDynamoPromotionCutoverReport } from '@/lib/detroitDynamoPromotionCutoverContract';
import { buildDetroitDynamoSafeguardingReport } from '@/lib/detroitDynamoSafeguardingContract';

function SectionKicker({ children }) {
  return (
    <p className="font-oswald text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
      {children}
    </p>
  );
}

const tryoutTeamOptions = ['Youth Club', "Senior Men's Team", "Senior Women's Team", 'Training Evaluation'];
const sponsorPackageOptions = ['Community Partner', 'Training Partner', 'Kit / Apparel Partner', 'Matchday / Event Partner', 'Founding Sponsor'];
const campClinicOptions = ['Seasonal Camps', 'Summer Training', 'Winter Indoor Training', 'Speed / Agility Clinics', 'Finishing Clinics', 'Goalkeeper Training'];
const contactTopicOptions = ['Training Inquiry', 'Tryout Inquiry', 'Sponsor Inquiry', 'Location / Facility'];
const youthAgeGroupOptions = ['U7-U8 Foundation', 'U9-U12 Pre-Academy', 'U13-U19 Competitive Pathway'];

function tryoutInterestHref(teamInterest) {
  const params = new URLSearchParams();
  params.set('team', teamInterest);
  return `/detroit-dynamo/tryouts?${params.toString()}#tryout-form`;
}

function sponsorPackageHref(packageInterest) {
  const params = new URLSearchParams();
  params.set('package', packageInterest);
  return `/detroit-dynamo/sponsors?${params.toString()}#sponsor-inquiry`;
}

function campClinicHref(clinicInterest) {
  const params = new URLSearchParams();
  params.set('clinic', clinicInterest);
  return `/detroit-dynamo/camps-clinics?${params.toString()}#camp-interest`;
}

function contactTopicHref(topicInterest) {
  const params = new URLSearchParams();
  params.set('topic', topicInterest);
  return `/detroit-dynamo/contact?${params.toString()}#contact-form`;
}

function youthAgeGroupHref(ageGroupInterest) {
  const params = new URLSearchParams();
  params.set('ageGroup', ageGroupInterest);
  return `/detroit-dynamo/youth-club?${params.toString()}#youth-interest`;
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

function PageHero({ kicker, title, copy, primaryText, primaryTo, secondaryText, secondaryTo, children }) {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="dynamo-texture absolute inset-0 opacity-55" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(0,120,255,0.2),transparent_28%),linear-gradient(115deg,rgba(255,255,255,0.045),transparent_32%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_0.5fr] lg:items-end">
        <div className="min-w-0">
          <div className="mb-7 inline-flex items-center gap-3 rounded-md border border-[rgba(98,216,255,0.24)] bg-white/[0.03] px-3 py-2">
            <Zap className="h-4 w-4 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
            <span className="font-oswald text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
              {kicker}
            </span>
          </div>
          <h1 className="max-w-5xl break-words font-oswald text-5xl font-bold uppercase leading-[0.94] tracking-[0.025em] text-white sm:text-7xl lg:text-8xl">
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
        {children || (
          <div className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225]/78 p-5">
            <SectionKicker>Player Pathway</SectionKicker>
            <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">
              Private training, youth development, and future senior teams are planned as one connected development system.
            </p>
          </div>
        )}
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
      {bullets && (
        <div className="mt-5 grid gap-2">
          {bullets.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#D7DEEA]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      )}
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

function PlaceholderPanel({ kicker, title, copy, items }) {
  return (
    <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
      <SectionKicker>{kicker}</SectionKicker>
      <h3 className="mt-3 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{copy}</p>
      {items && (
        <div className="mt-5 grid gap-3">
          {items.map((item) => (
            <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm font-semibold text-[#D7DEEA]">
              {item}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

const ageGroups = [
  {
    icon: Target,
    title: 'U7-U8 Foundation',
    formAgeGroup: 'U7-U8 Foundation',
    copy: 'A playful but serious foundation for ball comfort, movement, confidence, and basic decision cues.',
    bullets: ['Ball mastery and coordination', 'Confidence on the ball', 'Small-sided decision habits'],
  },
  {
    icon: ShieldCheck,
    title: 'U9-U12 Pre-Academy / Development',
    formAgeGroup: 'U9-U12 Pre-Academy',
    copy: 'A more structured development stage for technique, pressure, passing rhythm, and position awareness.',
    bullets: ['Technical repetition at pace', 'Learning to scan and solve pressure', 'Parent clarity on next steps'],
  },
  {
    icon: Trophy,
    title: 'U13-U19 Competitive Club Pathway',
    formAgeGroup: 'U13-U19 Competitive Pathway',
    copy: 'A future competitive team pathway for players ready for accountability, standards, tryouts, and match preparation.',
    bullets: ['Competitive roster standards', 'Position-specific growth', 'Future league pathway goal'],
  },
];

export function DetroitDynamoYouthClub() {
  const location = useLocation();
  const selectedAgeGroup = new URLSearchParams(location.search).get('ageGroup');
  const ageGroupInterest = youthAgeGroupOptions.includes(selectedAgeGroup) ? selectedAgeGroup : '';
  const ageGroupNote = ageGroupInterest ? `Youth age group interest: ${ageGroupInterest}.` : '';
  const sourceRoute = ageGroupInterest
    ? `/detroit-dynamo/youth-club?ageGroup=${encodeURIComponent(ageGroupInterest)}`
    : '/detroit-dynamo/youth-club';

  return (
    <div>
      <PageHero
        kicker="Youth Club"
        title="Youth Development Built with a Real Pathway"
        copy="Detroit Dynamo Youth Club is the long-term pathway from early development into competitive youth soccer. The roadmap is honest: build the structure, evaluate players properly, and pursue respected competition only when the club is ready."
        primaryText="Join Youth Club Interest"
        primaryTo="#youth-interest"
        secondaryText="View Tryouts"
        secondaryTo="/detroit-dynamo/tryouts"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Age Groups"
            title="A Progression Families Can Understand"
            copy="The youth club roadmap separates early foundation work, pre-academy development, and future competitive teams so parents can see where their player fits."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {ageGroups.map((group) => (
              <InfoCard
                key={group.title}
                {...group}
                cta="Register this age group"
                to={youthAgeGroupHref(group.formAgeGroup)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <SectionHeader
            align="left"
            kicker="Development Model"
            title="Player First, Team Ready"
            copy="The pathway starts with individual development and grows into team environments when the standard, staff, and player pool are strong enough."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Goal, 'Technical Base', 'Touch, passing, receiving, striking, and ball comfort.'],
              [Dumbbell, 'Movement Quality', 'Balance, speed, agility, coordination, and repeat effort.'],
              [BadgeCheck, 'Game Understanding', 'Scanning, spacing, pressure cues, and decisions.'],
              [Users, 'Team Habits', 'Communication, role clarity, standards, and accountability.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-start">
          <PlaceholderPanel
            kicker="League Roadmap"
            title="Future Competitive Pathway Goal"
            copy="Detroit Dynamo should not claim Michigan or regional league membership until confirmed. The honest roadmap is to build toward respected competitive environments with proper staff, standards, facilities, admin, and player depth."
            items={['Future pathway language only', 'No unconfirmed league claims', 'Tryout-ready structure before competition promises']}
          />
          <PlaceholderPanel
            kicker="Parent Clarity"
            title="What Parents Need to Know"
            copy="Parents should quickly understand the age group, training rhythm, evaluation process, coaching standards, cost expectations, and whether the club pathway is current, future, or invite-only."
            items={['Clear communication rhythm', 'Coach standards and safeguarding', 'Development feedback by stage']}
          />
        </div>
      </section>

      <section id="youth-interest" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <SectionHeader
            align="left"
            kicker="Register Interest"
            title="Help Build the First Youth Cohorts"
            copy="This preview form captures youth-club interest without promising current team placement or league membership."
          />
          <div className="grid gap-5">
            {ageGroupInterest && (
              <div className="rounded-lg border border-[rgba(98,216,255,0.24)] bg-[#061225] p-5">
                <SectionKicker>Age Group Interest</SectionKicker>
                <p className="mt-3 text-sm leading-6 text-[#D7DEEA]">
                  This youth inquiry is tagged for <span className="font-semibold text-white">{ageGroupInterest}</span>.
                  The future registrar queue should preserve the selected development stage before evaluating player fit.
                </p>
              </div>
            )}
            <DetroitDynamoLeadForm
              variant="youth"
              source={sourceRoute}
              defaultTeamInterest="Youth Club"
              defaultAgeGroupInterest={ageGroupInterest}
              defaultNotes={ageGroupNote}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const seniorRosterSlots = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards', 'Trialists / invitees'];
const staffSlots = ['Head Coach', 'Assistant Coach', 'Goalkeeper Coach', 'Team Manager', 'Performance / medical support'];

function SeniorTeamPage({ gender, title, route, formVariant, leagueGoal, accentCopy }) {
  return (
    <div>
      <PageHero
        kicker={`${gender} Senior Team`}
        title={title}
        copy={`${accentCopy} The language here is intentional: this is a pro-development pathway goal, not an unconfirmed current league claim.`}
        primaryText="Register Player Interest"
        primaryTo="#player-interest"
        secondaryText="Sponsor the Team"
        secondaryTo="/detroit-dynamo/sponsors"
      >
        <div className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225]/78 p-5">
          <SectionKicker>Competition Goal</SectionKicker>
          <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{leagueGoal}</p>
        </div>
      </PageHero>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Team Platform"
            title="Roster, Schedule, Staff, Media"
            copy="The senior-team pages are ready for the operational pieces a real club needs once rosters, staff, and competition dates are confirmed."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Users, 'Roster Ready', 'Player cards, positions, bios, photos, and status.'],
              [CalendarDays, 'Schedule / Results', 'Fixtures, scores, venues, and match recaps when confirmed.'],
              [ShieldCheck, 'Staff', 'Coaches, team managers, operations, and performance roles.'],
              [Megaphone, 'Media / Sponsors', 'News, announcements, sponsor inventory, and matchday assets.'],
            ].map(([Icon, cardTitle, copy]) => (
              <InfoCard key={cardTitle} icon={Icon} title={cardTitle} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          <PlaceholderPanel
            kicker="Roster"
            title="Roster Layout"
            copy="No player is listed until the roster is real and approved."
            items={seniorRosterSlots}
          />
          <PlaceholderPanel
            kicker="Schedule"
            title="Schedule / Results"
            copy="No fixtures are posted until dates, opponents, venue, and competition status are confirmed."
            items={['Upcoming fixtures placeholder', 'Final results placeholder', 'Match recap placeholder']}
          />
          <PlaceholderPanel
            kicker="Staff"
            title="Staff Structure"
            copy="The page is ready for confirmed staff without inventing names."
            items={staffSlots}
          />
        </div>
      </section>

      <section id="player-interest" className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <SectionHeader
            align="left"
            kicker="Player Interest"
            title="Register for the Senior Pathway"
            copy="Submit player interest for future tryouts, training evaluation, and senior-team communications."
          />
          <DetroitDynamoLeadForm variant={formVariant} source={route} defaultTeamInterest={gender === "Men's" ? "Senior Men's Team" : "Senior Women's Team"} />
        </div>
      </section>
    </div>
  );
}

export function DetroitDynamoSeniorMen() {
  return (
    <SeniorTeamPage
      gender="Men's"
      title="Detroit Dynamo Senior Men"
      route="/detroit-dynamo/senior-men"
      formVariant="men"
      leagueGoal="Long-term goal: compete in UPSL or a similar pro-development league when the roster, staff, operations, and league entry are confirmed."
      accentCopy="A future men's team pathway for serious players who want a local competitive environment connected to training, standards, and club identity."
    />
  );
}

export function DetroitDynamoSeniorWomen() {
  return (
    <SeniorTeamPage
      gender="Women's"
      title="Detroit Dynamo Senior Women"
      route="/detroit-dynamo/senior-women"
      formVariant="women"
      leagueGoal="Long-term goal: compete in UPSL Women or a similar women's pro-development league when the roster, staff, operations, and league entry are confirmed."
      accentCopy="A future women's team pathway built with the same standard: serious development, strong operations, and a platform players can grow through."
    />
  );
}

export function DetroitDynamoTryouts() {
  const location = useLocation();
  const selectedTeam = new URLSearchParams(location.search).get('team');
  const teamInterest = tryoutTeamOptions.includes(selectedTeam) ? selectedTeam : '';
  const teamNote = teamInterest ? `Tryout path interest: ${teamInterest}.` : '';
  const sourceRoute = teamInterest
    ? `/detroit-dynamo/tryouts?team=${encodeURIComponent(teamInterest)}`
    : '/detroit-dynamo/tryouts';

  return (
    <div>
      <PageHero
        kicker="Tryouts"
        title="Evaluation First. Team Placement Second."
        copy="Detroit Dynamo tryouts are framed as interest and evaluation until official teams, staff, seasons, and league memberships are confirmed."
        primaryText="Register Tryout Interest"
        primaryTo="#tryout-form"
        secondaryText="View Teams"
        secondaryTo="/detroit-dynamo/teams"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Tryout Paths"
            title="Choose the Right Evaluation"
            copy="Every interest path should collect useful player context and route cleanly to the future registrar/admin queue."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Users, 'Youth Tryouts', 'Age-group development and future team interest.', tryoutInterestHref('Youth Club')],
              [Trophy, "Men's Tryouts", "Senior men's pro-development pathway interest.", tryoutInterestHref("Senior Men's Team")],
              [Medal, "Women's Tryouts", "Senior women's pro-development pathway interest.", tryoutInterestHref("Senior Women's Team")],
              [Target, 'Training Evaluation', 'Private or small-group training assessment.', tryoutInterestHref('Training Evaluation')],
            ].map(([Icon, cardTitle, copy, to]) => (
              <InfoCard key={cardTitle} icon={Icon} title={cardTitle} copy={copy} cta="Register this path" to={to} />
            ))}
          </div>
        </div>
      </section>

      <section id="tryout-form" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <SectionHeader
            align="left"
            kicker="Registration"
            title="Tryout Interest Form"
            copy="This includes player name, guardian name for minors, birth date, team interest, position, club history, level, contact info, notes, validation, loading, success, and error states."
          />
          <div className="grid gap-5">
            {teamInterest && (
              <div className="rounded-lg border border-[rgba(98,216,255,0.24)] bg-[#061225] p-5">
                <SectionKicker>Team Interest</SectionKicker>
                <p className="mt-3 text-sm leading-6 text-[#D7DEEA]">
                  This registration is tagged for <span className="font-semibold text-white">{teamInterest}</span>.
                  The future registrar queue should preserve the selected tryout path before reviewing the player profile.
                </p>
              </div>
            )}
            <DetroitDynamoLeadForm
              variant="tryout"
              source={sourceRoute}
              defaultTeamInterest={teamInterest}
              defaultNotes={teamNote}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function DetroitDynamoTeams() {
  const teams = [
    {
      icon: Target,
      title: 'Youth Development Teams',
      copy: 'Future U7-U19 team structure with age groups, tryouts, coaches, parent communication, and development benchmarks.',
      to: '/detroit-dynamo/youth-club',
    },
    {
      icon: Trophy,
      title: "Senior Men's Team",
      copy: "Future men's pro-development pathway with roster, staff, tryout interest, sponsor inventory, and schedule pages.",
      to: '/detroit-dynamo/senior-men',
    },
    {
      icon: Medal,
      title: "Senior Women's Team",
      copy: "Future women's pro-development pathway with the same operational standard and sponsor-ready presentation.",
      to: '/detroit-dynamo/senior-women',
    },
  ];

  return (
    <div>
      <PageHero
        kicker="Teams"
        title="One Directory for Every Dynamo Team"
        copy="The team directory is prepared for youth teams, senior men, senior women, coaches, team managers, and roster-ready cards without listing fake players."
        primaryText="Register for Tryouts"
        primaryTo="/detroit-dynamo/tryouts"
        secondaryText="View Schedule"
        secondaryTo="/detroit-dynamo/schedule-results"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader kicker="Team Directory" title="Current Roadmap" />
          <div className="grid gap-5 lg:grid-cols-3">
            {teams.map((team) => (
              <InfoCard key={team.title} {...team} cta="Open team path" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <PlaceholderPanel
            kicker="Roster Cards"
            title="Roster-Ready Fields"
            copy="When real teams are confirmed, each player card can include name, position, age group, height, hometown, previous club, school, headshot, and status."
            items={['Player photo', 'Position and age group', 'Current status', 'Short player bio']}
          />
          <PlaceholderPanel
            kicker="Managers / Coaches"
            title="Team Staff Directory"
            copy="Team managers and staff can be grouped by age group or senior team with role, contact rules, safeguarding status, and display order."
            items={staffSlots}
          />
        </div>
      </section>
    </div>
  );
}

const scheduleRows = [
  { team: 'Youth Club', type: 'Fixture', label: 'No youth fixtures posted', status: 'Awaiting confirmed teams' },
  { team: "Senior Men's Team", type: 'Fixture', label: "No men's fixtures posted", status: 'Awaiting league / event confirmation' },
  { team: "Senior Women's Team", type: 'Fixture', label: "No women's fixtures posted", status: 'Awaiting league / event confirmation' },
  { team: 'Training Evaluation', type: 'Event', label: 'Evaluation dates coming soon', status: 'Use booking preview for training' },
];

export function DetroitDynamoScheduleResults() {
  const [teamFilter, setTeamFilter] = useState('All');
  const filters = ['All', 'Youth Club', "Senior Men's Team", "Senior Women's Team", 'Training Evaluation'];
  const visibleRows = useMemo(
    () => (teamFilter === 'All' ? scheduleRows : scheduleRows.filter((row) => row.team === teamFilter)),
    [teamFilter]
  );

  return (
    <div>
      <PageHero
        kicker="Schedule & Results"
        title="Fixtures Ready When the Teams Are Real"
        copy="This page is structured for future fixtures, results, team filters, match recaps, and placeholder states with no fake games."
        primaryText="Register for Tryouts"
        primaryTo="/detroit-dynamo/tryouts"
        secondaryText="View Teams"
        secondaryTo="/detroit-dynamo/teams"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              align="left"
              kicker="Filters"
              title="Team Schedule Board"
              copy="Select a team to see the relevant fixture placeholder state."
            />
            <div className="flex flex-wrap gap-2" aria-label="Schedule team filter">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTeamFilter(filter)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 font-oswald text-[11px] font-bold uppercase tracking-[0.1em] transition ${
                    teamFilter === filter
                      ? 'border-[var(--dynamo-blue)] bg-[var(--dynamo-blue)] text-[#020714]'
                      : 'border-white/15 bg-white/[0.04] text-[#D7DEEA] hover:border-[var(--dynamo-blue-bright)]'
                  }`}
                >
                  <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {visibleRows.map((row) => (
              <article key={`${row.team}-${row.label}`} className="grid gap-4 rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5 md:grid-cols-[0.8fr_0.5fr_1fr] md:items-center">
                <div>
                  <p className="font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">{row.type}</p>
                  <h3 className="mt-2 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">{row.team}</h3>
                </div>
                <p className="text-sm font-semibold text-[#D7DEEA]">{row.label}</p>
                <p className="text-sm leading-6 text-[#AEBBD0]">{row.status}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <PlaceholderPanel
              kicker="Fixtures"
              title="Upcoming Fixtures"
              copy="Once games are confirmed, this panel should show date, opponent, venue, competition, team, and ticket/admission notes."
            />
            <PlaceholderPanel
              kicker="Results"
              title="Completed Results"
              copy="Once games are played, this panel should show score, result, goal scorers if approved, recap, media, and match report."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function DetroitDynamoCampsClinics() {
  const location = useLocation();
  const selectedClinic = new URLSearchParams(location.search).get('clinic');
  const clinicInterest = campClinicOptions.includes(selectedClinic) ? selectedClinic : '';
  const defaultProgramInterest = clinicInterest === 'Goalkeeper Training' ? 'Goalkeeper training' : clinicInterest ? 'Camps / clinics' : '';
  const clinicNote = clinicInterest ? `Camp / clinic interest: ${clinicInterest}.` : '';
  const sourceRoute = clinicInterest
    ? `/detroit-dynamo/camps-clinics?clinic=${encodeURIComponent(clinicInterest)}`
    : '/detroit-dynamo/camps-clinics';
  const clinics = [
    [CalendarDays, 'Seasonal Camps', 'School-break and seasonal training blocks with clear age ranges and capacity.'],
    [Zap, 'Summer Training', 'High-tempo summer development built around touches, movement, and match transfer.'],
    [ShieldCheck, 'Winter Indoor Training', 'Technical repetition and game-speed work during indoor months.'],
    [Dumbbell, 'Speed / Agility Clinics', 'Soccer-specific movement, acceleration, balance, and change of direction.'],
    [Goal, 'Finishing Clinics', 'Striking, composure, weak foot, attacking movement, and final-third choices.'],
    [Target, 'Goalkeeper Training', 'Handling, footwork, angles, distribution, and shot-stopping habits.'],
  ];

  return (
    <div>
      <PageHero
        kicker="Camps & Clinics"
        title="Seasonal Development Blocks"
        copy="Camps and clinics give Detroit Dynamo room to run focused training around finishing, speed, goalkeeper work, winter indoor training, and summer development."
        primaryText="Request Camp Info"
        primaryTo="#camp-interest"
        secondaryText="Book Training"
        secondaryTo="/book"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader kicker="Clinic Menu" title="Programs Ready to Publish" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clinics.map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} cta="Register interest" to={campClinicHref(title)} />
            ))}
          </div>
        </div>
      </section>

      <section id="camp-interest" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <SectionHeader
            align="left"
            kicker="Camp Interest"
            title="Build the Camp List"
            copy="Until registration/payment collections are built, this polished interest form captures demand without sending visitors to a broken checkout."
          />
          <div className="grid gap-5">
            {clinicInterest && (
              <div className="rounded-lg border border-[rgba(98,216,255,0.24)] bg-[#061225] p-5">
                <SectionKicker>Clinic Interest</SectionKicker>
                <p className="mt-3 text-sm leading-6 text-[#D7DEEA]">
                  This inquiry is tagged for <span className="font-semibold text-white">{clinicInterest}</span>.
                  The future Training Director / Camp workflow should preserve the selected clinic before dates, pricing,
                  capacity, and payment products are approved.
                </p>
              </div>
            )}
            <DetroitDynamoLeadForm
              variant="training"
              source={sourceRoute}
              defaultProgramInterest={defaultProgramInterest}
              defaultNotes={clinicNote}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function DetroitDynamoSponsors() {
  const location = useLocation();
  const selectedPackage = new URLSearchParams(location.search).get('package');
  const packageInterest = sponsorPackageOptions.includes(selectedPackage) ? selectedPackage : '';
  const packageNote = packageInterest ? `Sponsor package interest: ${packageInterest}.` : '';
  const sourceRoute = packageInterest
    ? `/detroit-dynamo/sponsors?package=${encodeURIComponent(packageInterest)}`
    : '/detroit-dynamo/sponsors';
  const packages = [
    ['Community Partner', 'Local visibility, website listing, and campaign mentions.'],
    ['Training Partner', 'Support camps, clinics, and player-development programming.'],
    ['Kit / Apparel Partner', 'Future placement opportunities when uniforms and league rules are confirmed.'],
    ['Matchday / Event Partner', 'Future matchday, camp, clinic, and event activation inventory when approved.'],
    ['Founding Sponsor', 'Premium early partner positioning across digital, events, and club roadmap assets.'],
  ];

  return (
    <div>
      <PageHero
        kicker="Sponsors"
        title="A Partner Platform Built for Growth"
        copy="Detroit Dynamo is positioned for local business partnerships, youth-development support, future matchday inventory, and sponsor-ready digital content."
        primaryText="Sponsor Detroit Dynamo"
        primaryTo="#sponsor-inquiry"
        secondaryText="View Brand System"
        secondaryTo="/detroit-dynamo/brand"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Why Sponsor"
            title="Support a Serious Player Pathway"
            copy="Sponsors should see a real organization forming: training, youth development, senior pathways, camps, media, and community presence."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Handshake, 'Local Impact', 'Back player development across Metro Detroit.'],
              [Users, 'Family Audience', 'Reach serious soccer families, players, and coaches.'],
              [Newspaper, 'Digital Content', 'Support future media, news, player stories, and campaigns.'],
              [Flag, 'Future Matchday', 'Build toward matchday, kit, event, and facility inventory.'],
            ].map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {packages.map(([title, copy]) => (
              <InfoCard
                key={title}
                icon={CircleDollarSign}
                title={title}
                copy={copy}
                cta="Inquire about this package"
                to={sponsorPackageHref(title)}
              />
            ))}
          </div>
          <PlaceholderPanel
            kicker="Sponsor Logos"
            title="Partner Logo Section"
            copy="Logo placements should remain empty until real sponsors are approved. The layout is ready for founding partners, community partners, and event sponsors."
            items={['Founding partner logo', 'Community partner logo', 'Camp partner logo', 'Media partner logo']}
          />
        </div>
      </section>

      <section id="sponsor-inquiry" className="bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <SectionHeader
            align="left"
            kicker="Inquiry"
            title="Start a Partnership Conversation"
            copy="The sponsor form captures business details and package interest for the future partnerships/admin queue."
          />
          <div className="grid gap-5">
            {packageInterest && (
              <div className="rounded-lg border border-[rgba(98,216,255,0.24)] bg-[#061225] p-5">
                <SectionKicker>Sponsor Package Interest</SectionKicker>
                <p className="mt-3 text-sm leading-6 text-[#D7DEEA]">
                  This inquiry is tagged for <span className="font-semibold text-white">{packageInterest}</span>.
                  The future partnerships queue should preserve the package context before sponsor inventory is approved.
                </p>
              </div>
            )}
            <DetroitDynamoLeadForm
              variant="sponsor"
              source={sourceRoute}
              defaultPackageInterest={packageInterest}
              defaultNotes={packageNote}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function DetroitDynamoContact() {
  const location = useLocation();
  const selectedTopic = new URLSearchParams(location.search).get('topic');
  const topicInterest = contactTopicOptions.includes(selectedTopic) ? selectedTopic : '';
  const topicNote = topicInterest ? `Contact topic: ${topicInterest}.` : '';
  const sourceRoute = topicInterest
    ? `/detroit-dynamo/contact?topic=${encodeURIComponent(topicInterest)}`
    : '/detroit-dynamo/contact';

  return (
    <div>
      <PageHero
        kicker="Contact"
        title="Talk to Detroit Dynamo"
        copy="Use one clear form for general questions, training inquiries, tryout interest, sponsor conversations, and facility/location planning."
        primaryText="Send Inquiry"
        primaryTo="#contact-form"
        secondaryText="Book Training"
        secondaryTo="/book"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Target, 'Training Inquiry', 'Private, small group, team training, camps, and evaluations.'],
            [ClipboardList, 'Tryout Inquiry', 'Youth club, senior men, senior women, and training evaluation questions.'],
            [Handshake, 'Sponsor Inquiry', 'Local business partnerships and future sponsor packages.'],
            [MapPin, 'Location / Facility', 'Metro Detroit facility details can be added when confirmed.'],
          ].map(([Icon, title, copy]) => (
            <InfoCard key={title} icon={Icon} title={title} copy={copy} cta="Start this inquiry" to={contactTopicHref(title)} />
          ))}
        </div>
      </section>

      <section id="contact-form" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <SectionHeader
              align="left"
              kicker="General Inquiry"
              title="Route the Message Cleanly"
              copy="This preview form validates input, shows loading/success/error states, and maps to the future ContactLead model."
            />
            <div className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
              <SectionKicker>Facility Placeholder</SectionKicker>
              <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">
                Metro Detroit training locations and facility partnerships should be listed here only after they are confirmed.
              </p>
            </div>
          </div>
          <div className="grid gap-5">
            {topicInterest && (
              <div className="rounded-lg border border-[rgba(98,216,255,0.24)] bg-[#061225] p-5">
                <SectionKicker>Inquiry Topic</SectionKicker>
                <p className="mt-3 text-sm leading-6 text-[#D7DEEA]">
                  This message is tagged for <span className="font-semibold text-white">{topicInterest}</span>.
                  The future ContactLead queue should preserve the selected topic before routing it to the right owner.
                </p>
              </div>
            )}
            <DetroitDynamoLeadForm
              variant="contact"
              source={sourceRoute}
              defaultNotes={topicNote}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function DetroitDynamoAdminFoundation() {
  const [leads, setLeads] = useState([]);
  const [selectedModel, setSelectedModel] = useState('Player');
  const externalGateContract = useMemo(() => buildDetroitDynamoExternalGateContractReport(), []);
  const claimSafetyContract = useMemo(() => buildDetroitDynamoClaimSafetyContractReport(), []);
  const promotionCutoverContract = useMemo(() => buildDetroitDynamoPromotionCutoverReport(), []);
  const launchEvidenceContract = useMemo(() => buildDetroitDynamoLaunchEvidenceReport(), []);
  const launchEvidenceActionContract = useMemo(() => buildDetroitDynamoLaunchEvidenceActionReport(), []);
  const externalConfirmationActionContract = useMemo(() => buildDetroitDynamoExternalConfirmationActionReport(), []);
  const ownerLaunchReview = useMemo(() => buildDetroitDynamoOwnerLaunchReviewReport(), []);
  const ownerEvidenceIntake = useMemo(() => buildDetroitDynamoOwnerEvidenceIntakeReport(), []);
  const productionPreviewEvidence = useMemo(() => buildDetroitDynamoProductionPreviewEvidenceReport(), []);
  const liveReadinessBoard = useMemo(() => buildDetroitDynamoLiveReadinessBoardReport(), []);
  const launchArtifactIndex = useMemo(() => buildDetroitDynamoLaunchArtifactIndexReport(), []);
  const deploymentReadiness = useMemo(() => buildDetroitDynamoDeploymentReadinessReport(), []);
  const vercelPreviewRunbook = useMemo(() => buildDetroitDynamoVercelPreviewRunbookReport(), []);
  const secretRedaction = useMemo(() => buildDetroitDynamoSecretRedactionReport(), []);
  const externalGateClosure = useMemo(() => buildDetroitDynamoExternalGateClosureReport(), []);
  const ownerHandoffPacket = useMemo(() => buildDetroitDynamoOwnerHandoffPacketReport(), []);
  const ownerSignoffRegister = useMemo(() => buildDetroitDynamoOwnerSignoffRegisterReport(), []);
  const finalAcceptanceMatrix = useMemo(() => buildDetroitDynamoFinalAcceptanceMatrixReport(), []);
  const safeguardingContract = useMemo(() => buildDetroitDynamoSafeguardingReport(), []);
  const leadIntakeContract = useMemo(() => buildDetroitDynamoLeadIntakeContractReport(), []);
  const pipelineActionContract = useMemo(() => buildDetroitDynamoPipelineActionContractReport(), []);
  const adminModuleReadContract = useMemo(() => buildDetroitDynamoAdminModuleReadContractReport(), []);
  const adminModuleWriteContract = useMemo(() => buildDetroitDynamoAdminModuleWriteContractReport(), []);
  const adminRoleGrantContract = useMemo(() => buildDetroitDynamoAdminRoleGrantContractReport(), []);
  const adminRecordWorkspaceContract = useMemo(() => buildDetroitDynamoAdminRecordWorkspaceReport(), []);
  const modelEntries = Object.entries(detroitDynamoDataModels);
  const selectedFields = detroitDynamoDataModels[selectedModel] || [];
  const routeCounts = leads.reduce((counts, lead) => {
    const type = lead.lead_type || 'unknown';
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
  const modules = [
    [Users, 'People', 'Players, parents/guardians, coaches, staff, admins, and role-based access.'],
    [Target, 'Programs', 'Training programs, teams, age groups, camps, clinics, tryouts, and packages.'],
    [CalendarDays, 'Operations', 'Bookings, sessions, schedules, results, waivers, payments, and communication logs.'],
    [Building2, 'Growth', 'News posts, sponsors, contact leads, website content, and media inventory.'],
  ];

  const refreshLeads = () => setLeads(getDetroitDynamoPreviewLeads());

  useEffect(() => {
    refreshLeads();
  }, []);

  return (
    <div>
      <PageHero
        kicker="Admin Foundation"
        title="The Back Office the Club Will Need"
        copy="This internal preview outlines the dashboard modules and data model foundation needed to turn Detroit Dynamo from a website into a scalable soccer organization."
        primaryText="View Public Site"
        primaryTo="/detroit-dynamo"
        secondaryText="Contact"
        secondaryTo="/detroit-dynamo/contact"
      />

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Admin Modules"
            title="Dashboard Roadmap"
            copy="This is a planning foundation, not a live admin replacement. It maps cleanly to Appwrite collections and role-based access."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {modules.map(([Icon, title, copy]) => (
              <InfoCard key={title} icon={Icon} title={title} copy={copy} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Trusted Role Grants"
            title="Admin Role Grant Contract"
            copy="The future live dashboard needs a Master Admin-controlled path for creating, suspending, revoking, expiring, and reactivating trusted role assignments before protected reads or mutations are opened broadly."
          />
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <KeyRound className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Grant Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Actions', adminRoleGrantContract.actions.length],
                  ['Success Fixtures', adminRoleGrantContract.successFixtures.length],
                  ['Rejection Fixtures', adminRoleGrantContract.rejectionFixtures.length],
                  ['Roles', adminRoleGrantContract.roles.length],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Function execution is planned as `{adminRoleGrantContract.functionExecutePermission}`. The first Master
                Admin grant must match `{adminRoleGrantContract.bootstrapEnv}` while no active Master Admin exists.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Master Admin Grant Fixtures
              </h3>
              <div className="mt-5 grid gap-3">
                {adminRoleGrantContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-white/10 bg-[#020714] p-3 text-xs md:grid-cols-[0.75fr_0.55fr_0.65fr]">
                    <span className="font-semibold text-white">{fixture.label}</span>
                    <code className="break-all text-[var(--dynamo-blue-bright)]">{fixture.action}</code>
                    <span className="leading-5 text-[#AEBBD0]">{fixture.role}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {adminRoleGrantContract.rejectionFixtures.map((fixture) => (
                  <div key={fixture.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <p className="font-oswald text-sm font-bold uppercase tracking-[0.035em] text-white">{fixture.label}</p>
                    <p className="mt-2 font-mono text-xs text-[var(--dynamo-blue-bright)]">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{fixture.reason}</p>
                  </div>
                ))}
              </div>
            </article>

          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Owner Review"
            title="Owner Launch Review Packet"
            copy="Detroit Dynamo now has one go/no-go packet that gathers backend activation, payment/waiver gates, external confirmations, claim safety, safeguarding, SEO, redirects, rollback, and post-launch monitoring into an owner review surface. The current decision remains no-go until real evidence is approved."
          />
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                {ownerLaunchReview.decision.label}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{ownerLaunchReview.decision.reason}</p>
              <div className="mt-5 grid gap-3">
                {[
                  ['Review Sections', ownerLaunchReview.summary.sectionsTotal],
                  ['Blocked Sections', ownerLaunchReview.summary.blockedSections],
                  ['External Approvals', ownerLaunchReview.summary.externalApprovalsRequired],
                  ['Live Gates Cleared', ownerLaunchReview.summary.liveGatesCleared],
                  ['Publications Unlocked', ownerLaunchReview.summary.publicationsUnlocked],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Generated artifact: `detroit-dynamo-owner-launch-review.md`. It is a decision handoff, not launch
                approval.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Launch Review Sections
              </h3>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {ownerLaunchReview.sections.map((section) => (
                  <div key={section.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{section.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {section.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{section.ownerRole}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{section.requiredBeforeGoLive.slice(0, 2).join(', ')}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                The packet keeps `liveGatesCleared` and `publicationsUnlocked` at zero while the site remains isolated
                under `/detroit-dynamo`.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <Database className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Owner Evidence Intake Worksheet
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                The intake worksheet turns each launch evidence item into a fillable row for proof location, approver,
                date, owner decision, notes, blocked live actions, and verification command. It is built for the final
                owner review meeting and does not approve launch by itself.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-5">
                {[
                  ['Rows', ownerEvidenceIntake.summary.intakeRows],
                  ['Unresolved', ownerEvidenceIntake.summary.unresolvedRows],
                  ['Safe Publish', ownerEvidenceIntake.summary.safeToPublishRows],
                  ['Live Gates', ownerEvidenceIntake.summary.liveGatesCleared],
                  ['Publications', ownerEvidenceIntake.summary.publicationsUnlocked],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {ownerEvidenceIntake.intakeRows.slice(0, 4).map((row) => (
                  <div key={row.intake_id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <p className="font-semibold text-white">{row.review_section}</p>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{row.owner_role} / {row.confirmation_area}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{row.required_artifact}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-owner-evidence-intake.md`, `.json`, and `.csv`.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Owner Signoff Register
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                The owner signoff register is the final approval ledger for launch. It keeps each approval unsigned
                until a real owner or external approver attaches evidence, records a decision, and reruns the matching
                verification command.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Signoffs', ownerSignoffRegister.summary.signoffRows],
                  ['Signed', ownerSignoffRegister.summary.signedRows],
                  ['Unsigned', ownerSignoffRegister.summary.unsignedRows],
                  ['Live Gates', ownerSignoffRegister.summary.liveGatesCleared],
                  ['Root', String(ownerSignoffRegister.summary.rootPromotionAllowed)],
                  ['Redirects', String(ownerSignoffRegister.summary.permanentRedirectsAllowed)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {ownerSignoffRegister.signoffRows.slice(0, 4).map((row) => (
                  <div key={row.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{row.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {row.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{row.signerRole} / {row.signoffArea}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{row.requiredEvidence[0]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-owner-signoff-register.md`, `.json`, and `.csv`. This register
                does not approve launch, enable checkout, collect signatures, publish public claims, remove noindex, or
                apply redirects.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Final Acceptance Matrix
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                The final acceptance matrix translates the original rebrand objective into evidence rows. It shows what
                is complete for the promoted brand and which items still need real production, backend, owner, legal,
                payment, league, facility, or launch evidence before Detroit Dynamo can unlock every live operation.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Rows', finalAcceptanceMatrix.summary.acceptanceRows],
                  ['Preview Done', finalAcceptanceMatrix.summary.previewCompleteRows],
                  ['External', finalAcceptanceMatrix.summary.externalEvidenceRequiredRows],
                  ['Live Gates', finalAcceptanceMatrix.summary.liveGatesCleared],
                  ['Signed', finalAcceptanceMatrix.summary.ownerSignedRows],
                  ['Root', String(finalAcceptanceMatrix.summary.rootPromotionAllowed)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {finalAcceptanceMatrix.rows.slice(0, 4).map((row) => (
                  <div key={row.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{row.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {row.completionStatus}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{row.ownerRole} / {row.acceptanceArea}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{row.currentEvidence[0]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-final-acceptance-matrix.md`, `.json`, and `.csv`. The matrix
                keeps completion, promotion, checkout, signatures, claims, noindex removal, and redirects blocked.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Production Preview Evidence Matrix
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                This matrix lists the production-preview proof that still has to be attached for public forms,
                authenticated admin actions, current-site/Dynamo route QA, Appwrite activation, and external
                confirmations. It stays evidence-required and preview-only until the owner review packet is approved.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Tracks', productionPreviewEvidence.summary.tracksTotal],
                  ['Public Forms', productionPreviewEvidence.summary.publicFormTracks],
                  ['Admin Actions', productionPreviewEvidence.summary.adminActionTracks],
                  ['Backend Steps', productionPreviewEvidence.summary.backendActivationTracks],
                  ['Live Gates', productionPreviewEvidence.summary.liveGatesCleared],
                  ['Publications', productionPreviewEvidence.summary.publicationsUnlocked],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {productionPreviewEvidence.tracks.slice(0, 4).map((track) => (
                  <div key={track.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{track.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {track.productionPreviewEvidenceId}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{track.ownerRole} / {track.trackType}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{track.requiredEvidence[0]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-production-preview-evidence.md` and `.json`. The matrix does
                not enable live backend, payment collection, waiver signatures, public claims, noindex removal,
                redirects, or root-route promotion.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Live Readiness Board
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                The live-readiness board is the final no-go/go surface. It rolls up owner review, evidence intake,
                production-preview proof, launch gates, external confirmations, and blocked live actions into phase
                rows that stay locked until the owner attaches real evidence.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Rows', liveReadinessBoard.summary.rowsTotal],
                  ['Blocked', liveReadinessBoard.summary.blockedRows],
                  ['Allowed', liveReadinessBoard.summary.goLiveAllowedRows],
                  ['Live Gates', liveReadinessBoard.summary.liveGatesCleared],
                  ['Root', String(liveReadinessBoard.summary.rootPromotionAllowed)],
                  ['Redirects', String(liveReadinessBoard.summary.permanentRedirectsAllowed)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {liveReadinessBoard.rows.slice(0, 4).map((row) => (
                  <div key={row.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{row.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {row.liveDecision}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{row.ownerRole} / {row.phase}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{row.requiredProof[0]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-live-readiness-board.md`, `.json`, and `.csv`. The board keeps
                root promotion, checkout, signatures, noindex removal, public claims, and permanent redirects blocked.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <Database className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Launch Artifact Index
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                The launch artifact index is the packet map for owners and operators. It groups every generated
                handoff by launch question, owner role, verify command, artifact path, and blocked live action.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Artifacts', launchArtifactIndex.summary.artifactsTotal],
                  ['Categories', launchArtifactIndex.summary.categories],
                  ['Owner Roles', launchArtifactIndex.summary.ownerRoles],
                  ['Markdown', launchArtifactIndex.summary.markdownArtifacts],
                  ['Live Gates', launchArtifactIndex.summary.liveGatesCleared],
                  ['Publications', launchArtifactIndex.summary.publicationsUnlocked],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {launchArtifactIndex.items.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{item.title}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {item.category}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{item.ownerRole} / {item.format}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{item.launchQuestion}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-launch-artifact-index.md`, `.json`, and `.csv`. The index is a
                navigation aid only and does not approve launch.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Owner Handoff Packet
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                The owner handoff packet gives the final review meeting one place to start. It ties the launch artifact
                index, evidence intake, signoff register, redaction scan, production-preview proof, deployment runbook,
                and blocked live actions into a single preview-only packet.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Sections', ownerHandoffPacket.summary.packetSections],
                  ['Evidence', ownerHandoffPacket.summary.evidenceRequiredSections],
                  ['Redaction', ownerHandoffPacket.summary.redactionReviewSections],
                  ['Unsigned', ownerHandoffPacket.summary.unsignedRows],
                  ['Live Gates', ownerHandoffPacket.summary.liveGatesCleared],
                  ['Publish', String(ownerHandoffPacket.summary.publishAllowed)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {ownerHandoffPacket.sections.slice(0, 4).map((section) => (
                  <div key={section.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{section.title}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {section.decisionStatus}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{section.ownerRole} / {section.signoffStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{section.primaryArtifact}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-owner-handoff-packet.md`, `.json`, and `.csv`. The packet is an
                owner meeting agenda only; it does not approve promotion or complete the goal.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                External Gate Closure Packet
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                The closure packet translates the remaining backend, payment, waiver, league/facility, proof,
                deployment, rollback, and owner-closeout gates into role-owned rows with required evidence,
                verification commands, and blocked live actions.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Rows', externalGateClosure.summary.rowsTotal],
                  ['External', externalGateClosure.summary.externalEvidenceRows],
                  ['Critical', externalGateClosure.summary.criticalRows],
                  ['Ready', externalGateClosure.summary.readyToCloseRows],
                  ['Live Gates', externalGateClosure.summary.liveGatesCleared],
                  ['Complete', String(externalGateClosure.summary.completionClaimAllowed)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {externalGateClosure.rows.slice(0, 4).map((row) => (
                  <div key={row.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{row.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {row.priority}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{row.ownerRole} / {row.status}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{row.closureQuestion}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-external-gate-closure.md`, `.json`, and `.csv`. This packet
                identifies required proof only; it does not close gates, approve launch, or complete the goal.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ExternalLink className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Vercel Preview Deployment Runbook
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                This runbook gives the owner a redacted Vercel preview-deployment workflow before any production
                promotion: CLI upgrade, linked-project check, preview env pull, prebuilt preview deployment, inspect
                and log review, route/form QA, current-site snapshot, rollback proof, and promotion hold.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Steps', vercelPreviewRunbook.summary.stepsTotal],
                  ['Evidence', vercelPreviewRunbook.summary.evidenceRequiredSteps],
                  ['CLI Upgrade', String(vercelPreviewRunbook.summary.cliUpgradeRecommended)],
                  ['Preview', vercelPreviewRunbook.summary.previewDeploymentRecorded],
                  ['Promote', String(vercelPreviewRunbook.summary.productionPromotionAllowed)],
                  ['Live Gates', vercelPreviewRunbook.summary.liveGatesCleared],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {vercelPreviewRunbook.steps.slice(0, 4).map((step) => (
                  <div key={step.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{step.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {step.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{step.ownerRole} / {step.phase}</p>
                    <p className="mt-2 break-words font-mono text-xs leading-5 text-[#AEBBD0]">{step.commands[0]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-vercel-preview-runbook.md`, `.json`, and `.csv`. The runbook
                records commands and evidence only; it does not deploy, promote, redirect, or expose Vercel ids.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Secret Redaction Contract
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                Before any owner handoff is shared, this contract verifies that generated launch artifacts, public docs,
                source files, scripts, and function scaffolds do not expose local API keys, Vercel project identifiers,
                payment provider secrets, deployment bypass tokens, or exact environment values.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Rules', secretRedaction.summary.rulesTotal],
                  ['Evidence', secretRedaction.summary.evidenceRequiredRules],
                  ['Leaks', secretRedaction.summary.leakagesDetected],
                  ['Values', String(secretRedaction.summary.exactSecretValuesWritten)],
                  ['Publish', String(secretRedaction.summary.publishAllowed)],
                  ['Live Gates', secretRedaction.summary.liveGatesCleared],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {secretRedaction.rules.slice(0, 4).map((rule) => (
                  <div key={rule.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{rule.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {rule.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{rule.ownerRole}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{rule.targetSurface}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-secret-redaction.md`, `.json`, `.csv`, and violation CSV. It
                records counts and file paths only, never exact secret values.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <ExternalLink className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Deployment Readiness Handoff
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C3D7]">
                Deployment readiness collects the hosting, environment, production-preview, domain, SEO, redirect,
                and rollback proof required before Detroit Dynamo can replace the current Detroit Dynamo root. It keeps
                production deployment evidence and production submissions at zero until real launch proof is attached.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {[
                  ['Tracks', deploymentReadiness.summary.tracksTotal],
                  ['Evidence', deploymentReadiness.summary.evidenceRequiredTracks],
                  ['Deployments', deploymentReadiness.summary.productionDeploymentsRecorded],
                  ['Submissions', deploymentReadiness.summary.productionSubmissionsRecorded],
                  ['Live Gates', deploymentReadiness.summary.liveGatesCleared],
                  ['Redirects', String(deploymentReadiness.summary.permanentRedirectsAllowed)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#AEBBD0]">{label}</span>
                    <span className="mt-2 block font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {deploymentReadiness.tracks.slice(0, 4).map((track) => (
                  <div key={track.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{track.label}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {track.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{track.ownerRole} / {track.phase}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{track.requiredEvidence[0]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Generated artifacts: `detroit-dynamo-deployment-readiness.md`, `.json`, and `.csv`. This handoff
                does not approve launch, enable the live backend, remove noindex, or apply redirects.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="External Approval Workflow"
            title="External Confirmation Action Queue"
            copy="External confirmations now have a preview-only action workflow for prices, waivers, league/facility facts, staff/roster proof, sponsor/media assets, and launch content. The queue rehearses owner routing without unlocking public claims, checkout, signatures, noindex removal, or redirects."
          />
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Confirmation Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Fixture Actions', externalConfirmationActionContract.actions.length],
                  ['Areas Touched', externalConfirmationActionContract.summary.confirmationAreasTouched],
                  ['Owner Signoffs', externalConfirmationActionContract.summary.ownerSignoffsRequested],
                  ['Publications Unlocked', externalConfirmationActionContract.summary.publicationsUnlocked],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Generated artifact: `detroit-dynamo-external-confirmation-actions.md`. It is an approval rehearsal,
                not permission to publish facts or activate live systems.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Confirmation Fixtures
              </h3>
              <div className="mt-5 grid gap-3">
                {externalConfirmationActionContract.actions.slice(0, 6).map((action) => (
                  <div key={action.id} className="grid gap-3 rounded-md border border-white/10 bg-[#020714] p-3 text-xs md:grid-cols-[0.9fr_0.55fr_0.6fr_0.45fr] md:items-start">
                    <div>
                      <p className="font-semibold text-white">{action.confirmation_area}</p>
                      <p className="mt-1 leading-5 text-[#AEBBD0]">{action.evidence_label}</p>
                    </div>
                    <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                      {action.action.replaceAll('_', ' ')}
                    </code>
                    <span className="leading-5 text-[#AEBBD0]">{action.status.replaceAll('_', ' ')}</span>
                    <span className={`font-oswald text-[10px] font-bold uppercase tracking-[0.1em] ${action.publication_unlocked ? 'text-red-300' : 'text-[var(--dynamo-blue-bright)]'}`}>
                      {action.publication_unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Each fixture keeps `live_gate_cleared` and `publication_unlocked` false, so preview evidence cannot
                become a public league claim, facility promise, sponsor proof, checkout path, waiver signature, SEO
                launch, or redirect approval.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Protected Writes"
            title="Admin Module Write Contract"
            copy="The future live dashboard needs a server-side write path for create, update, and archive actions. This contract keeps writes module-scoped, role-grant verified, external-gate aware, and audit-event backed."
          />
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <Database className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Write Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Modules', adminModuleWriteContract.supportedModules.length],
                  ['Mutations', adminModuleWriteContract.mutations.length],
                  ['Success Fixtures', adminModuleWriteContract.successFixtures.length],
                  ['Rejection Fixtures', adminModuleWriteContract.rejectionFixtures.length],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Function execution is planned as `{adminModuleWriteContract.functionExecutePermission}`. Successful
                writes require `{adminModuleWriteContract.roleAssignmentCollectionId}` and append audit evidence to
                `{adminModuleWriteContract.auditEventCollectionId}`.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Guarded Write Fixtures
              </h3>
              <div className="mt-5 grid gap-3">
                {adminModuleWriteContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-white/10 bg-[#020714] p-3 text-xs md:grid-cols-[0.75fr_0.55fr_0.65fr]">
                    <span className="font-semibold text-white">{fixture.label}</span>
                    <code className="break-all text-[var(--dynamo-blue-bright)]">{fixture.mutation}</code>
                    <span className="leading-5 text-[#AEBBD0]">{fixture.actorRole}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {adminModuleWriteContract.rejectionFixtures.map((fixture) => (
                  <div key={fixture.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <p className="font-oswald text-sm font-bold uppercase tracking-[0.035em] text-white">{fixture.label}</p>
                    <p className="mt-2 font-mono text-xs text-[var(--dynamo-blue-bright)]">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{fixture.reason}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Safeguarding"
            title="Safeguarding and Data Privacy Contract"
            copy="A serious youth club needs guardian consent, staff verification, communication boundaries, waiver control, data retention, and audit trails before live registration or sensitive admin workflows go online."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {safeguardingContract.safeguardingTracks.map((track) => (
              <article key={track.id} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
                <div className="flex items-start justify-between gap-4">
                  <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                    {track.activationStatus.replaceAll('_', ' ')}
                  </span>
                </div>
                <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                  {track.label}
                </h3>
                <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{track.ownerRole} / {track.protectionMode}</p>
                <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{track.blockedAction}</p>
                <div className="mt-5 rounded-md border border-white/10 bg-[#020714] p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                    Preview Handling
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{track.previewHandling}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Roles / Permissions"
            title="Who Should Control What"
            copy="The future admin dashboard should separate strategic, soccer, registration, team, coaching, payment, and media responsibilities instead of giving every staff member the same access."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {detroitDynamoAdminRoles.map((role) => (
              <article key={role} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
                <KeyRound className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                <h3 className="mt-4 font-oswald text-xl font-bold uppercase tracking-[0.035em] text-white">{role}</h3>
                <p className="mt-3 text-sm leading-6 text-[#B8C3D7]">
                  Role gate for the future Detroit Dynamo admin surface.
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
            <SectionKicker>Admin Menu Coverage</SectionKicker>
            <div className="mt-5 flex flex-wrap gap-2">
              {detroitDynamoAdminModules.map((module) => (
                <span
                  key={module}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-[#D7DEEA]"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <SectionHeader
              kicker="Module Registry"
              title="Management Areas Mapped to Data"
              copy="Each future dashboard area has an owner, collection target, source route, action plan, and blocker so the admin build can move module by module without touching the current Detroit Dynamo operations."
            />
            <div className="grid gap-4 lg:grid-cols-2">
              {detroitDynamoAdminModuleRegistry.map((item) => (
                <article key={item.module} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
                  {(() => {
                    const actionGuard = detroitDynamoModuleActionGuards.find((guard) => guard.module === item.module);
                    return (
                      <>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-oswald text-xl font-bold uppercase tracking-[0.035em] text-white">{item.module}</h3>
                            <p className="mt-2 text-sm leading-7 text-[#B8C3D7]">{item.purpose}</p>
                          </div>
                          <span className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                            {item.status.replaceAll('_', ' ')}
                          </span>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div>
                            <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">Owners</p>
                            <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{item.ownerRoles.join(', ')}</p>
                          </div>
                          <div>
                            <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">Collections</p>
                            <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{item.collectionIds.join(', ')}</p>
                          </div>
                        </div>
                        {actionGuard && (
                          <div className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-3">
                            <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">
                              First Action Guards
                            </p>
                            <div className="mt-2 grid gap-2">
                              {actionGuard.actions.slice(0, 3).map((action) => (
                                <div key={action.action} className="grid gap-1 text-xs leading-5 text-[#AEBBD0] sm:grid-cols-[0.35fr_1fr]">
                                  <span className="font-mono text-[var(--dynamo-blue-bright)]">{action.requiredAccess}</span>
                                  <span>{action.action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="mt-4 text-xs leading-5 text-[#8390A6]">{item.blockedUntil}</p>
                      </>
                    );
                  })()}
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <SectionHeader
              kicker="Permission Matrix"
              title="Role Scope by Admin Module"
              copy="The future dashboard needs different access for payment, waiver, roster, sponsor, media, team, and training operations. This matrix keeps sensitive controls scoped by role."
            />
            <div className="grid gap-5 lg:grid-cols-2">
              {detroitDynamoRoleAccessSummaries.map((role) => (
                <article key={role.role} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <KeyRound className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                      {role.controlModules.length} Controls
                    </span>
                  </div>
                  <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">{role.role}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{role.purpose}</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">
                        Manage / Approve
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{role.controlModules.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">
                        Contribute
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{role.contributeModules.join(', ') || 'None'}</p>
                    </div>
                  </div>
                  {role.sensitiveControls.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {role.sensitiveControls.map((control) => (
                        <span key={control} className="rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-semibold text-[#D7DEEA]">
                          {control}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Launch Readiness"
            title="Promotion Gates Before the Full Rebrand"
            copy="Detroit Dynamo should only replace the current public brand after the operational foundation is real: data, payments, waivers, facilities, verified competition facts, and owner-approved launch content."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {detroitDynamoLaunchReadiness.map((item) => (
              <article key={item.category} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
                <div className="flex items-start justify-between gap-4">
                  <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                    {item.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                  {item.category}
                </h3>
                <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{item.ownerRole}</p>
                <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{item.nextAction}</p>
                <div className="mt-5 grid gap-2">
                  {item.evidenceNeeded.slice(0, 3).map((evidence) => (
                    <div key={evidence} className="flex items-start gap-3 text-sm leading-6 text-[#D7DEEA]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                      {evidence}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#061225]">
            <div className="grid gap-3 border-b border-[var(--dynamo-line)] bg-white/[0.04] px-4 py-3 font-oswald text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)] md:grid-cols-[0.8fr_0.55fr_1.15fr_1fr]">
              <span>Gate</span>
              <span>Status</span>
              <span>Required Evidence</span>
              <span>Next Action</span>
            </div>
            <div className="divide-y divide-[var(--dynamo-line)]">
              {detroitDynamoPromotionGates.map((item) => (
                <article key={item.gate} className="grid gap-3 px-4 py-4 text-sm text-[#B8C3D7] md:grid-cols-[0.8fr_0.55fr_1.15fr_1fr]">
                  <p className="font-oswald text-base font-bold uppercase tracking-[0.035em] text-white">{item.gate}</p>
                  <code className="h-fit break-all rounded-md border border-white/10 bg-[#020714] px-2 py-1 text-xs text-[var(--dynamo-blue-bright)]">
                    {item.status}
                  </code>
                  <p className="leading-6">{item.requiredEvidence}</p>
                  <p className="leading-6">{item.nextAction}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Promotion Cutover"
            title="Promotion Cutover Control"
            copy="Detroit Dynamo should only replace the current public brand when route promotion, redirects, backend intake, payments, waivers, legal/support communications, proof publication, monitoring, and rollback evidence are ready."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {promotionCutoverContract.cutoverTracks.map((track) => (
              <article key={track.id} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
                <div className="flex items-start justify-between gap-4">
                  <RefreshCcw className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                    {track.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                  {track.label}
                </h3>
                <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{track.ownerRole} / {track.phase}</p>
                <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{track.blockedUntil}</p>
                <div className="mt-5 rounded-md border border-white/10 bg-[#020714] p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                    Rollback Path
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{track.rollbackAction}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Launch Evidence"
            title="Launch Evidence Checklist"
            copy="The external promotion gates become practical only when each one has proof. This checklist defines the artifact, owner, verification action, and blocked live actions for backend, payments, waivers, league/facility, SEO, redirect, and launch approval."
          />
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Evidence Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Evidence Items', launchEvidenceContract.summary.total],
                  ['Evidence Required', launchEvidenceContract.summary.evidenceRequired],
                  ['Pending Confirmations', launchEvidenceContract.summary.pendingConfirmation],
                  ['Preview Only', launchEvidenceContract.summary.previewOnly],
                  ['Blocked Actions', launchEvidenceContract.summary.blockedActions],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Generated artifact: `detroit-dynamo-launch-evidence-checklist.md`. It is proof planning, not launch
                approval.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Gate Proof Items
              </h3>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {launchEvidenceContract.checklistItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{item.confirmationArea}</p>
                      <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                        {item.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{item.ownerRole}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{item.requiredArtifact}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-white/10 bg-white/[0.035] p-3">
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                  Still Blocked
                </p>
                <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">
                  {launchEvidenceContract.blockedActions.slice(0, 8).join(', ')}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Preview Evidence Workflow"
            title="Launch Evidence Action Workflow"
            copy="The protected admin can rehearse attaching evidence, requesting owner review, requesting changes, and recording preview signoff. These actions create a local preview ledger only; live gates stay closed until real backend, payment, waiver, league, facility, SEO, redirect, and owner approval evidence is confirmed."
          />
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Preview Action Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Fixture Actions', launchEvidenceActionContract.actions.length],
                  ['Checklist Items Touched', launchEvidenceActionContract.summary.checklistItemsTouched],
                  ['Preview Signoffs', launchEvidenceActionContract.summary.previewSignoffs],
                  ['Live Gates Cleared', launchEvidenceActionContract.summary.liveGatesCleared],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Generated artifact: `detroit-dynamo-launch-evidence-actions.md`. It documents workflow rehearsal, not
                live promotion clearance.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Action Ledger Fixtures
              </h3>
              <div className="mt-5 grid gap-3">
                {launchEvidenceActionContract.actions.slice(0, 4).map((action) => (
                  <div key={action.id} className="grid gap-3 rounded-md border border-white/10 bg-[#020714] p-3 text-xs md:grid-cols-[0.88fr_0.55fr_0.65fr_0.4fr] md:items-start">
                    <div>
                      <p className="font-semibold text-white">{action.confirmation_area}</p>
                      <p className="mt-1 leading-5 text-[#AEBBD0]">{action.evidence_label}</p>
                    </div>
                    <code className="w-fit rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[var(--dynamo-blue-bright)]">
                      {action.action.replaceAll('_', ' ')}
                    </code>
                    <span className="leading-5 text-[#AEBBD0]">{action.status.replaceAll('_', ' ')}</span>
                    <span className={`font-oswald text-[10px] font-bold uppercase tracking-[0.1em] ${action.live_gate_cleared ? 'text-red-300' : 'text-[var(--dynamo-blue-bright)]'}`}>
                      {action.live_gate_cleared ? 'Live' : 'Preview'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#AEBBD0]">
                Each fixture keeps `live_gate_cleared` false so a preview signoff never becomes a backend cutover,
                checkout launch, waiver release, public league claim, noindex removal, or redirect approval.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Claim Safety"
            title="Public Claim Safety Contract"
            copy="The preview can look serious without pretending external facts are already confirmed. These guards keep league, facility, staff, roster, sponsor, fixture, outcome, and launch claims in future-pathway or approval-gated language."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {claimSafetyContract.claimSafetyTracks.map((track) => (
              <article key={track.id} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
                <div className="flex items-start justify-between gap-4">
                  <Flag className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                    {track.confirmationStatus.replaceAll('_', ' ')}
                  </span>
                </div>
                <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                  {track.label}
                </h3>
                <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{track.confirmationArea}</p>
                <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{track.blockedClaim}</p>
                <div className="mt-5 rounded-md border border-white/10 bg-[#020714] p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                    Safe Preview Language
                  </p>
                  <div className="mt-3 grid gap-2">
                    {track.safeLanguage.slice(0, 3).map((line) => (
                      <div key={line} className="flex items-start gap-3 text-sm leading-6 text-[#D7DEEA]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 font-mono text-xs text-[var(--dynamo-blue-bright)]">{track.publishMode}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="External Confirmations"
            title="Facts That Must Be Approved Before Publication"
            copy="The rebrand has room for payments, waivers, facilities, league goals, staff, rosters, sponsors, and proof content, but those facts stay gated until the club has evidence and owner approval."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {detroitDynamoExternalConfirmationRegister.map((item) => (
              <article key={item.area} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
                <div className="flex items-start justify-between gap-4">
                  <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                    {item.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">{item.area}</h3>
                <p className="mt-2 text-xs font-semibold text-[#AEBBD0]">{item.ownerRole}</p>
                <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{item.publishRule}</p>
                <div className="mt-5 grid gap-2">
                  {item.requiredFacts.slice(0, 3).map((fact) => (
                    <div key={fact} className="flex items-start gap-3 text-sm leading-6 text-[#D7DEEA]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                      {fact}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Payment / Waiver Gates"
            title="Checkout and Signature Safety Contract"
            copy="Detroit Dynamo can show serious package, camp, team, and waiver planning without pretending checkout or signatures are live. These tracks keep prices, provider products, refund rules, legal text, and signature collection approval-gated."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <CircleDollarSign className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                    Payment / Package Tracks
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#B8C3D7]">
                    All provider connections remain disabled until package approvals are complete.
                  </p>
                </div>
                <span className="font-oswald text-4xl font-bold text-[var(--dynamo-blue-bright)]">
                  {externalGateContract.paymentPackageTracks.length}
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {externalGateContract.paymentPackageTracks.map((track) => (
                  <div key={track.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{track.label}</p>
                      <code className="w-fit text-[10px] text-[var(--dynamo-blue-bright)]">{track.providerStatus}</code>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{track.blockedAction}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                    Waiver / Signature Tracks
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#B8C3D7]">
                    All signatures stay disabled until waiver versions and consent workflows are approved.
                  </p>
                </div>
                <span className="font-oswald text-4xl font-bold text-[var(--dynamo-blue-bright)]">
                  {externalGateContract.waiverTracks.length}
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {externalGateContract.waiverTracks.map((track) => (
                  <div key={track.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-white">{track.label}</p>
                      <code className="w-fit text-[10px] text-[var(--dynamo-blue-bright)]">{track.signatureMode}</code>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{track.blockedAction}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Collection Scaffold"
            title="Appwrite-Ready Data Model Map"
            copy="These collection IDs are intentionally prefixed and isolated so Detroit Dynamo data can be promoted or removed without mutating the current Detroit Dynamo collections first."
          />
          <div className="overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#061225]">
            <div className="grid grid-cols-[1fr_1fr_0.7fr_1fr] gap-3 border-b border-[var(--dynamo-line)] bg-white/[0.04] px-4 py-3 font-oswald text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">
              <span>Model</span>
              <span>Collection</span>
              <span>Phase</span>
              <span>Owner</span>
            </div>
            <div className="divide-y divide-[var(--dynamo-line)]">
              {detroitDynamoCollectionPlan.map((item) => (
                <article key={item.collectionId} className="grid gap-3 px-4 py-4 text-sm text-[#D7DEEA] md:grid-cols-[1fr_1fr_0.7fr_1fr]">
                  <div>
                    <p className="font-oswald text-base font-bold uppercase tracking-[0.035em] text-white">{item.model}</p>
                    <p className="mt-1 text-xs leading-5 text-[#AEBBD0]">{item.notes}</p>
                  </div>
                  <code className="break-all rounded-md border border-white/10 bg-[#020714] px-2 py-1 text-xs text-[var(--dynamo-blue-bright)]">
                    {item.collectionId}
                  </code>
                  <span>{item.phase}</span>
                  <span>{item.ownerRole}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Backend Activation"
            title="From Preview Queue to Appwrite Intake"
            copy="The backend activation path is ordered so Detroit Dynamo can turn on Appwrite lead intake only after local preflight, schema review, provisioning, function configuration, deployment, and production-preview form checks."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {detroitDynamoBackendActivationSteps.map((item) => (
              <article key={item.step} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] font-oswald text-lg font-bold text-[var(--dynamo-blue-bright)]">
                    {item.step}
                  </span>
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[#AEBBD0]">
                    {item.ownerRole}
                  </span>
                </div>
                <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">{item.title}</h3>
                <code className="mt-4 block break-all rounded-md border border-white/10 bg-[#020714] px-3 py-2 text-xs text-[var(--dynamo-blue-bright)]">
                  {item.command}
                </code>
                <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{item.evidence}</p>
                <p className="mt-3 text-xs leading-5 text-[#8390A6]">{item.nextAction}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Public Intake"
            title="Form Submission Handoff Contract"
            copy="Every public Detroit Dynamo form variant has a planned Appwrite destination before the live backend is enabled. The contract keeps accepted payloads, created records, source-route guards, and rejection cases visible to operators."
          />
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <Inbox className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Intake Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Variants', leadIntakeContract.variants.length],
                  ['Success Fixtures', leadIntakeContract.successFixtures.length],
                  ['Rejection Fixtures', leadIntakeContract.rejectionFixtures.length],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Function execution is planned as `{leadIntakeContract.functionExecutePermission}` because public forms
                should be able to submit without exposing admin credentials.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Accepted Payloads
              </h3>
              <div className="mt-5 grid gap-3">
                {leadIntakeContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-white/10 bg-[#020714] p-3 text-xs md:grid-cols-[0.35fr_0.55fr_1fr]">
                    <span className="font-semibold text-white">{fixture.leadType}</span>
                    <code className="break-all text-[var(--dynamo-blue-bright)]">{fixture.sourceRoute}</code>
                    <span className="leading-5 text-[#AEBBD0]">{fixture.functionCreatedModels.join(', ')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {leadIntakeContract.rejectionFixtures.map((fixture) => (
                  <div key={fixture.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <p className="font-oswald text-sm font-bold uppercase tracking-[0.035em] text-white">{fixture.label}</p>
                    <p className="mt-2 font-mono text-xs text-[var(--dynamo-blue-bright)]">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{fixture.reason}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Authenticated Actions"
            title="Pipeline Status Mutation Contract"
            copy="The live admin dashboard should only update lead status through the authenticated Appwrite function once the dd_* records exist. These fixtures show which records can move, what updates are expected, which audit event must be appended, and which requests must be rejected."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <Database className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Supported Models
              </h3>
              <p className="mt-3 font-oswald text-5xl font-bold text-[var(--dynamo-blue-bright)]">
                {pipelineActionContract.supportedModels.length}
              </p>
              <div className="mt-5 grid gap-2">
                {pipelineActionContract.supportedModels.map((item) => (
                  <div key={item.model} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <p className="font-semibold text-white">{item.model}</p>
                    <code className="mt-1 block break-all text-xs text-[var(--dynamo-blue-bright)]">{item.collectionId}</code>
                  </div>
                ))}
                <div className="rounded-md border border-[var(--dynamo-blue-bright)]/40 bg-[var(--dynamo-blue)]/10 p-3">
                  <p className="font-semibold text-white">AdminAuditEvent</p>
                  <code className="mt-1 block break-all text-xs text-[var(--dynamo-blue-bright)]">
                    {pipelineActionContract.auditEventCollectionId}
                  </code>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                    Fixture Coverage
                  </h3>
                </div>
                <span className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--dynamo-blue-bright)]">
                  {pipelineActionContract.functionExecutePermission} only
                </span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {pipelineActionContract.successFixtures.slice(0, 4).map((fixture) => (
                  <div key={fixture.id} className="rounded-md border border-white/10 bg-[#020714] p-3">
                    <p className="font-semibold text-white">{fixture.label}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">
                      <code className="text-[var(--dynamo-blue-bright)]">{fixture.currentStatus}</code>
                      {' '}to{' '}
                      <code className="text-[var(--dynamo-blue-bright)]">{fixture.nextStatus}</code>
                      {' '}on {fixture.model}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-3">
                {pipelineActionContract.rejectionFixtures.map((fixture) => (
                  <div key={fixture.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <p className="font-oswald text-sm font-bold uppercase tracking-[0.035em] text-white">{fixture.label}</p>
                    <p className="mt-2 font-mono text-xs text-[var(--dynamo-blue-bright)]">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{fixture.reason}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Protected Reads"
            title="Admin Module Read Contract"
            copy="The next live-admin layer is an authenticated Appwrite read function that scopes dashboard reads to a module slug, a valid Dynamo collection, a capped document limit, and an active role grant from the trusted admin assignment collection."
          />
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <Database className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Read Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Modules', adminModuleReadContract.supportedModules.length],
                  ['Success Fixtures', adminModuleReadContract.successFixtures.length],
                  ['Rejection Fixtures', adminModuleReadContract.rejectionFixtures.length],
                  ['Read Limit', adminModuleReadContract.defaultLimit],
                  ['Role Grants', 'Active'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                Function execution is planned as `{adminModuleReadContract.functionExecutePermission}` because admin
                records must stay behind protected dashboard sessions. Role grants are verified through
                `{adminModuleReadContract.roleAssignmentCollectionId}` before records are returned.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Role-Scoped Read Fixtures
              </h3>
              <div className="mt-5 grid gap-3">
                {adminModuleReadContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-white/10 bg-[#020714] p-3 text-xs md:grid-cols-[0.75fr_0.6fr_0.65fr]">
                    <span className="font-semibold text-white">{fixture.label}</span>
                    <code className="break-all text-[var(--dynamo-blue-bright)]">{fixture.collectionId}</code>
                    <span className="leading-5 text-[#AEBBD0]">{fixture.actorRole}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {adminModuleReadContract.rejectionFixtures.map((fixture) => (
                  <div key={fixture.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <p className="font-oswald text-sm font-bold uppercase tracking-[0.035em] text-white">{fixture.label}</p>
                    <p className="mt-2 font-mono text-xs text-[var(--dynamo-blue-bright)]">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-[#AEBBD0]">{fixture.reason}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Record Operations"
            title="Admin Record Workspace Contract"
            copy="Protected module detail pages need more than raw tables: operators need search-ready records, CSV export, required-field warnings, and safe write-prep payloads before any live Appwrite mutation is submitted."
          />
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <Database className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Workspace Coverage
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Fixture Records', adminRecordWorkspaceContract.flattenedRecords.length],
                  ['Collections', adminRecordWorkspaceContract.fixtureCollections.length],
                  ['Covered Helpers', adminRecordWorkspaceContract.coveredHelpers.length],
                  ['Complete Player Missing Fields', adminRecordWorkspaceContract.completePlayerProfile.missingRequiredFieldCount],
                  ['Prepared Archive Status', adminRecordWorkspaceContract.preparedArchive.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#020714] px-4 py-3">
                    <span className="text-sm font-semibold text-[#D7DEEA]">{label}</span>
                    <span className="font-oswald text-2xl font-bold text-[var(--dynamo-blue-bright)]">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#B8C3D7]">
                The fixture is verified by `npm run verify:dynamo-admin-record-workspace` and is also written into the
                generated launch evidence bundle.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
              <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                Schema Readiness Evidence
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['CSV Header', adminRecordWorkspaceContract.csvHeader],
                  ['Incomplete Required Fields', adminRecordWorkspaceContract.incompletePlayerProfile.missingRequiredFields.join(', ') || 'None'],
                  ['Prepared Update Source', adminRecordWorkspaceContract.preparedUpdate.source],
                  ['Previous Status Retained', adminRecordWorkspaceContract.preparedArchive.previous_status],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 rounded-md border border-white/10 bg-[#020714] p-3 text-xs md:grid-cols-[0.52fr_1fr]">
                    <span className="font-semibold text-white">{label}</span>
                    <code className="break-all text-[var(--dynamo-blue-bright)]">{value}</code>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {adminRecordWorkspaceContract.coveredHelpers.map((helper) => (
                  <code key={helper} className="rounded-md border border-white/10 bg-white/[0.035] p-3 text-xs text-[#D7DEEA]">
                    {helper}
                  </code>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            kicker="Lead Pipeline"
            title="Follow-Up Status Policy"
            copy="Every preview inquiry needs a clear owner, next status, and aging target before the Appwrite-backed admin dashboard starts sending live follow-up work."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {detroitDynamoLeadPipelineStages.map((stage) => (
              <article key={stage.status} className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5">
                <div className="flex items-start justify-between gap-4">
                  <ClipboardList className="h-5 w-5 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-[var(--dynamo-blue-bright)]">
                    {stage.maxAgeHours}h
                  </span>
                </div>
                <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">{stage.label}</h3>
                <code className="mt-2 block text-xs text-[var(--dynamo-blue-bright)]">{stage.status}</code>
                <p className="mt-4 text-sm leading-7 text-[#B8C3D7]">{stage.ownerAction}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {stage.appliesTo.map((leadType) => (
                    <span key={leadType} className="rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-semibold text-[#D7DEEA]">
                      {leadType}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <SectionHeader
              align="left"
              kicker="Schema Browser"
              title="Fields by Model"
              copy="This keeps the requested data models visible inside the preview instead of buried only in documentation."
            />
            <div className="grid gap-2">
              {modelEntries.map(([model, fields]) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => setSelectedModel(model)}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition ${
                    selectedModel === model
                      ? 'border-[var(--dynamo-blue)] bg-[rgba(0,120,255,0.14)]'
                      : 'border-white/10 bg-white/[0.035] hover:border-[var(--dynamo-blue-bright)]'
                  }`}
                >
                  <span>
                    <span className="block font-oswald text-sm font-bold uppercase tracking-[0.08em] text-white">{model}</span>
                    <span className="text-xs text-[#AEBBD0]">{fields.length} fields</span>
                  </span>
                  <Database className="h-4 w-4 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <article className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-6">
            <SectionKicker>{selectedModel}</SectionKicker>
            <h3 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-[0.035em] text-white">
              Proposed Fields
            </h3>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {selectedFields.map((field) => (
                <code
                  key={field}
                  className="rounded-md border border-white/10 bg-[#020714] px-3 py-2 text-xs text-[#D7DEEA]"
                >
                  {field}
                </code>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-[var(--dynamo-line)] bg-[#050B16] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              align="left"
              kicker="Preview Lead Inbox"
              title="Form Submissions Route Here First"
              copy="The public preview forms save locally so the workflow can be inspected without provisioning backend collections too early."
            />
            <button
              type="button"
              onClick={refreshLeads}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.045] px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-[var(--dynamo-blue-bright)] hover:text-[var(--dynamo-blue-bright)]"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Refresh Inbox
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={Inbox}
              title={`${leads.length} Dynamo Leads`}
              copy="Stored in browser localStorage until the Appwrite-backed admin queue is approved."
            />
            <InfoCard
              icon={ClipboardList}
              title={`${Object.keys(routeCounts).length} Lead Types`}
              copy="Shows whether forms are routing by contact, training, youth, tryout, senior teams, or sponsor."
            />
            <InfoCard
              icon={Database}
              title="Backend Destination"
              copy="Next step is Appwrite dd_contact_leads, dd_tryout_registrations, dd_sponsors, and linked player records."
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-[var(--dynamo-line)] bg-[#061225]">
            {leads.length === 0 ? (
              <div className="p-8 text-center">
                <Inbox className="mx-auto h-8 w-8 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
                <h3 className="mt-4 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">
                  No Preview Leads Yet
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#B8C3D7]">
                  Submit a training, tryout, youth, sponsor, or contact form on the preview site, then return here and refresh.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--dynamo-line)]">
                {leads.map((lead) => {
                  const routing = detroitDynamoLeadRouting[lead.lead_type] || detroitDynamoLeadRouting.contact;
                  const title = lead.player_name || lead.contact_name || lead.organization || 'Unnamed lead';
                  return (
                    <article key={lead.id} className="grid gap-4 p-5 lg:grid-cols-[0.8fr_1fr_1fr]">
                      <div>
                        <p className="font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[var(--dynamo-blue-bright)]">
                          {lead.lead_type || 'lead'}
                        </p>
                        <h3 className="mt-2 font-oswald text-xl font-bold uppercase tracking-[0.035em] text-white">
                          {title}
                        </h3>
                        <p className="mt-2 text-xs text-[#8390A6]">{lead.created_at}</p>
                      </div>
                      <div className="text-sm leading-6 text-[#D7DEEA]">
                        <p>{lead.email || 'No email'}</p>
                        <p>{lead.phone || 'No phone'}</p>
                        <p>{lead.team_interest || lead.program_interest || lead.package_interest || 'General inquiry'}</p>
                      </div>
                      <div className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-[#B8C3D7]">
                        <p className="font-semibold text-white">{routing.destinationModel}</p>
                        <p className="mt-1">{routing.ownerRole}</p>
                        <p className="mt-2">{routing.nextAction}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
