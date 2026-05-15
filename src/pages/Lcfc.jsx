import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Quote, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { playerRepo, teamMatchRepo, lcfcStaffRepo, lcfcNewsRepo } from '@/api/repo';
import { loadLcfcSettings, toLines } from '@/lib/lcfcSettings';

// Try an ordered/filtered load, degrade to a plain list, then to []. Keeps
// /lcfc rendering even before the new schema/fields exist in Appwrite.
async function safeLoad(repo, where, sort, fallbackSort) {
  try {
    return await repo.filter(where, sort);
  } catch {
    try {
      return await repo.list(fallbackSort);
    } catch {
      return [];
    }
  }
}

export default function Lcfc() {
  const [s, setS] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    loadLcfcSettings().then(setS);
    safeLoad(playerRepo, { is_active: true }, 'display_order', 'jersey_number').then(setPlayers);
    safeLoad(teamMatchRepo, { is_active: true }, 'display_order', 'match_date').then(setMatches);
    safeLoad(lcfcStaffRepo, { is_active: true }, 'display_order', 'display_order').then(setStaff);
    safeLoad(lcfcNewsRepo, { is_published: true }, 'display_order', 'display_order').then(setNews);
  }, []);

  if (!s) {
    return <div className="min-h-screen bg-background" />;
  }

  const featured = news.find((n) => n.is_featured) || news[0] || null;
  const newsList = news.filter((n) => n !== featured).slice(0, 4);

  return (
    <div className="bg-zinc-100">
      {s.hero_enabled && <Hero s={s} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
        {s.about_enabled && <AboutRow s={s} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {s.overview_enabled && <OverviewCard s={s} />}
          {s.roster_enabled && <RosterCard players={players} />}
          {s.schedule_enabled && <ScheduleCard matches={matches} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TryoutsCard s={s} />
          {s.staff_enabled && <StaffCard staff={staff} />}
        </div>
      </div>

      {s.news_enabled && <NewsSection featured={featured} newsList={newsList} />}
    </div>
  );
}

function GoldButton({ as: As = 'a', className = '', children, ...props }) {
  return (
    <As
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-oswald tracking-wider uppercase text-sm rounded-md hover:bg-accent/90 transition-colors ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}

function OutlineButton({ as: As = 'a', className = '', children, ...props }) {
  return (
    <As
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-300 text-zinc-900 font-oswald tracking-wider uppercase text-sm rounded-md hover:border-accent hover:text-accent transition-colors ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <h2 className="font-oswald text-xl font-bold tracking-wider uppercase text-zinc-900">{children}</h2>
      {sub && <p className="text-sm text-zinc-500 mt-1">{sub}</p>}
      <div className="h-0.5 w-12 bg-accent mt-3" />
    </div>
  );
}

function Hero({ s }) {
  return (
    <section className="relative bg-zinc-950 overflow-hidden">
      {s.hero_image_url && (
        <img
          src={s.hero_image_url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 md:pb-24">
        <img
          src="/logo-shield.png"
          alt="LC"
          className="h-16 md:h-20 w-auto object-contain mb-6"
        />
        <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
          {s.hero_heading}
        </h1>
        <p className="font-oswald text-lg md:text-2xl tracking-wide text-accent mt-3">
          {s.hero_subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <GoldButton href={s.hero_primary_link || '#tryouts'}>{s.hero_primary_text}</GoldButton>
          <a
            href={s.hero_secondary_link || '#news'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/40 text-white font-oswald tracking-wider uppercase text-sm rounded-md hover:border-accent hover:text-accent transition-colors"
          >
            {s.hero_secondary_text}
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutRow({ s }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-7">
        <SectionTitle>{s.about_heading}</SectionTitle>
        <p className="text-zinc-600 leading-relaxed">{s.about_body}</p>
      </div>
      <div className="relative bg-zinc-950 rounded-xl p-8 flex flex-col justify-center overflow-hidden">
        <div className="absolute top-4 left-4 right-4 h-px bg-accent/40" />
        <div className="absolute bottom-4 left-4 right-4 h-px bg-accent/40" />
        <Quote className="w-8 h-8 text-accent mb-3" />
        {toLines(s.quote_text).map((line, i) => (
          <p key={i} className="font-oswald text-xl md:text-2xl tracking-wide text-accent">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function OverviewCard({ s }) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm p-7 overflow-hidden">
      {s.overview_image_url && (
        <img
          src={s.overview_image_url}
          alt=""
          aria-hidden="true"
          className="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-10"
        />
      )}
      <div className="relative">
        <SectionTitle>{s.overview_title}</SectionTitle>
        <ul className="space-y-2.5 mb-6">
          {toLines(s.overview_bullets).map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <OutlineButton href={s.overview_button_link || '#about'}>
          {s.overview_button_text}
        </OutlineButton>
      </div>
    </div>
  );
}

function PlayerThumb({ p }) {
  const initials = `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`;
  return (
    <div className="text-center">
      <div className="aspect-square rounded-lg bg-zinc-900 overflow-hidden flex items-center justify-center">
        {p.photo_url ? (
          <img src={p.photo_url} alt={`${p.first_name} ${p.last_name}`} className="w-full h-full object-cover" />
        ) : (
          <span className="font-oswald text-2xl text-zinc-600">{initials || '#'}</span>
        )}
      </div>
      <p className="font-oswald text-xs tracking-wider uppercase text-zinc-900 mt-1.5 truncate">
        {p.first_name} {p.last_name}
      </p>
      <p className="text-[11px] text-zinc-500">
        {p.jersey_number != null && p.jersey_number !== '' ? `#${p.jersey_number}` : ''}
        {p.position ? `${p.jersey_number != null && p.jersey_number !== '' ? ' · ' : ''}${p.position}` : ''}
      </p>
    </div>
  );
}

function RosterCard({ players }) {
  const shown = players.slice(0, 6);
  return (
    <div className="bg-white rounded-xl shadow-sm p-7 flex flex-col">
      <SectionTitle sub="Meet the Squad">Roster</SectionTitle>
      {shown.length === 0 ? (
        <EmptyState>Roster coming soon.</EmptyState>
      ) : (
        <div className="grid grid-cols-3 gap-3 flex-1">
          {shown.map((p) => (
            <PlayerThumb key={p.id} p={p} />
          ))}
        </div>
      )}
      <div className="mt-5">
        <OutlineButton as={Link} to="/team/roster" className="w-full">
          View Full Roster
        </OutlineButton>
      </div>
    </div>
  );
}

function ScheduleCard({ matches }) {
  const shown = matches.slice(0, 6);
  return (
    <div className="bg-white rounded-xl shadow-sm p-7 flex flex-col">
      <SectionTitle>Schedule / Results</SectionTitle>
      {shown.length === 0 ? (
        <EmptyState>Schedule coming soon.</EmptyState>
      ) : (
        <div className="flex-1">
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 text-[10px] font-oswald tracking-widest uppercase text-zinc-400 pb-2 border-b border-zinc-200">
            <span>Date</span>
            <span>Opponent</span>
            <span className="text-right">Time / Result</span>
          </div>
          {shown.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center py-2.5 border-b border-zinc-100 text-sm"
            >
              <span className="text-zinc-500 whitespace-nowrap">
                {m.match_date ? format(new Date(m.match_date), 'EEE, MMM d') : '—'}
              </span>
              <span className="text-zinc-900 truncate">
                {m.is_home ? 'vs.' : '@'} {m.opponent}
              </span>
              <span className="text-right font-medium text-zinc-700 whitespace-nowrap">
                {m.score || m.result || m.match_time || 'TBD'}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5">
        <OutlineButton as={Link} to="/team/schedule" className="w-full">
          View Full Schedule
        </OutlineButton>
      </div>
    </div>
  );
}

function TryoutsCard({ s }) {
  const dates = toLines(s.tryouts_dates);
  const status = s.tryouts_status || 'coming_soon';

  let heading = 'Coming Soon';
  let body = 'Dates, time, and location will be announced soon.';

  if (status === 'closed') {
    heading = 'Tryouts Closed';
    body = s.tryouts_notes || 'Tryouts are currently closed. Check back for future opportunities.';
  } else if (status === 'open' && dates.length > 0) {
    heading = dates.length === 1 ? 'Tryout Date' : 'Tryout Dates';
  }

  const showDetails = status === 'open' && dates.length > 0;

  return (
    <div id="tryouts" className="bg-white rounded-xl shadow-sm p-7">
      <SectionTitle>Tryouts / ID Sessions</SectionTitle>
      <div className="flex items-start gap-5">
        <div className="shrink-0 w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center">
          <Calendar className="w-7 h-7 text-accent" />
        </div>
        <div className="flex-1">
          <p className="font-oswald text-2xl md:text-3xl font-bold tracking-wide uppercase text-accent">
            {heading}
          </p>
          {!showDetails && <p className="text-sm text-zinc-600 mt-1">{body}</p>}
          {showDetails && (
            <ul className="mt-2 space-y-1.5">
              {dates.map((d, i) => (
                <li key={i} className="text-sm text-zinc-700 flex flex-wrap gap-x-2">
                  <span className="font-medium">{d}</span>
                  {(s.tryouts_start_time || s.tryouts_end_time) && (
                    <span className="text-zinc-500">
                      {s.tryouts_start_time}
                      {s.tryouts_end_time ? `–${s.tryouts_end_time}` : ''}
                    </span>
                  )}
                  {s.tryouts_location && <span className="text-zinc-500">· {s.tryouts_location}</span>}
                </li>
              ))}
              {s.tryouts_registration_link && (
                <li className="pt-2">
                  <GoldButton href={s.tryouts_registration_link} target="_blank" rel="noreferrer">
                    Register
                  </GoldButton>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StaffCard({ staff }) {
  const shown = staff.slice(0, 3);
  return (
    <div className="bg-white rounded-xl shadow-sm p-7 flex flex-col">
      <SectionTitle>Staff</SectionTitle>
      {shown.length === 0 ? (
        <EmptyState>Staff coming soon.</EmptyState>
      ) : (
        <div className="grid grid-cols-3 gap-4 flex-1">
          {shown.map((m) => (
            <div key={m.id} className="text-center">
              <div className="aspect-square rounded-lg bg-zinc-900 overflow-hidden flex items-center justify-center">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-oswald text-xl text-zinc-600">{m.name?.[0]}</span>
                )}
              </div>
              <p className="font-oswald text-xs tracking-wider uppercase text-zinc-900 mt-2 truncate">
                {m.name}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">{m.role}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5">
        <OutlineButton as={Link} to="/team/coaches" className="w-full">
          Meet the Staff
        </OutlineButton>
      </div>
    </div>
  );
}

function NewsSection({ featured, newsList }) {
  if (!featured && newsList.length === 0) {
    return (
      <section id="news" className="bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-dashed border-white/15 rounded-xl py-12 text-center text-sm text-zinc-500">
            News coming soon.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="bg-zinc-950 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featured && (
          <div className="rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
            {featured.image_url && (
              <img src={featured.image_url} alt="" className="w-full h-56 object-cover" />
            )}
            <div className="p-6">
              <p className="font-oswald text-xs tracking-widest uppercase text-accent mb-2">
                {featured.type || 'Matchday'}
              </p>
              <h3 className="font-oswald text-2xl font-bold tracking-wide text-white">
                {featured.title}
              </h3>
              {featured.date && <p className="text-sm text-zinc-400 mt-1">{featured.date}</p>}
              {featured.excerpt && (
                <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{featured.excerpt}</p>
              )}
              {featured.button_url && (
                <a
                  href={featured.button_url}
                  className="inline-flex items-center gap-2 mt-4 text-accent font-oswald tracking-wider uppercase text-sm hover:gap-3 transition-all"
                >
                  {featured.button_text || 'Read More'} <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-oswald text-xl font-bold tracking-widest uppercase text-white">
              Latest News
            </h3>
            <div className="h-0.5 flex-1 mx-4 bg-white/10" />
          </div>
          <div className="divide-y divide-white/10">
            {newsList.map((n) => (
              <div key={n.id} className="py-4">
                <div className="flex gap-4">
                  {n.image_url && (
                    <img src={n.image_url} alt="" className="w-20 h-16 object-cover rounded-md shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-oswald tracking-wide text-white truncate">{n.title}</p>
                    {n.date && <p className="text-xs text-zinc-500 mt-0.5">{n.date}</p>}
                    {n.excerpt && (
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{n.excerpt}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ children }) {
  return (
    <div className="flex-1 border border-dashed border-zinc-200 rounded-lg py-10 text-center text-sm text-zinc-400 flex items-center justify-center">
      {children}
    </div>
  );
}
