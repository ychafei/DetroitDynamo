import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, LayoutDashboard, Menu, Shield, UserCircle, X, Zap } from 'lucide-react';
import DetroitDynamoMark from './DetroitDynamoMark';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Training', to: '/detroit-dynamo/training' },
  { label: 'Coaches', to: '/detroit-dynamo#coaches' },
  { label: 'Youth', to: '/detroit-dynamo/youth-club' },
  { label: 'Men', to: '/detroit-dynamo/senior-men' },
  { label: 'Women', to: '/detroit-dynamo/senior-women' },
  { label: 'Tryouts', to: '/detroit-dynamo/tryouts' },
  { label: 'Camps', to: '/detroit-dynamo/camps-clinics' },
  { label: 'Sponsors', to: '/detroit-dynamo/sponsors' },
  { label: 'About', to: '/detroit-dynamo/about' },
  { label: 'Contact', to: '/detroit-dynamo/contact' },
];

const portalItems = [
  { label: 'Client Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Coach Portal', to: '/coach', icon: Briefcase },
  { label: 'Admin Portal', to: '/admin', icon: Shield },
  { label: 'Sign In', to: '/login', icon: UserCircle },
];

function isActive(location, item) {
  if (item.to === '/') {
    return (location.pathname === '/' || location.pathname === '/detroit-dynamo') && !location.hash;
  }

  if (!item.to.includes('#')) {
    return location.pathname === item.to;
  }

  const hash = item.to.split('#')[1];
  return location.pathname === '/detroit-dynamo' && location.hash === `#${hash}`;
}

export default function DetroitDynamoHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--dynamo-line)] bg-[#020714]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Detroit Dynamo home">
          <DetroitDynamoMark className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />
          <span className="block font-oswald text-lg font-bold uppercase leading-none tracking-[0.08em] text-white sm:text-xl">
            Detroit Dynamo
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Detroit Dynamo navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`rounded-md px-2.5 py-2 font-oswald text-[11px] font-semibold uppercase tracking-[0.09em] transition ${
                isActive(location, item)
                  ? 'bg-white/[0.045] text-[#E8EEF8]'
                  : 'text-[#B8C3D7] hover:bg-white/[0.045] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <div className="group relative">
            <Link
              to="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 font-oswald text-[11px] font-bold uppercase tracking-[0.11em] text-[#D7DEEA] transition hover:border-[var(--dynamo-blue-bright)] hover:text-white"
            >
              Portals
            </Link>
            <div className="invisible absolute right-0 top-full z-50 min-w-[230px] translate-y-2 pt-3 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="rounded-md border border-[rgba(98,216,255,0.24)] bg-[#020714] p-2 shadow-2xl shadow-black/40">
                {portalItems.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-[#D7DEEA] transition hover:bg-white/[0.055] hover:text-[var(--dynamo-blue-bright)]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/book"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[var(--dynamo-blue)] bg-[var(--dynamo-blue)] px-4 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#020714] shadow-[0_0_22px_rgba(0,120,255,0.24)] transition hover:bg-[var(--dynamo-blue-bright)]"
          >
            <Zap className="h-4 w-4" aria-hidden="true" />
            Book Training
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white transition hover:border-[var(--dynamo-blue-bright)] xl:hidden"
          aria-label="Toggle Detroit Dynamo menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--dynamo-line)] bg-[#020714] px-4 py-4 shadow-2xl xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Detroit Dynamo mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeMobile}
                className="rounded-md px-3 py-3 font-oswald text-sm font-semibold uppercase tracking-[0.12em] text-[#D7DEEA] transition hover:bg-white/[0.05] hover:text-[var(--dynamo-blue-bright)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2 border-t border-[var(--dynamo-line)] pt-4">
              <div className="grid gap-1 pb-2">
                <p className="px-3 font-oswald text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                  Portals
                </p>
                {portalItems.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[#D7DEEA] transition hover:bg-white/[0.05] hover:text-[var(--dynamo-blue-bright)]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                ))}
              </div>
              <Link
                to="/book"
                onClick={closeMobile}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[var(--dynamo-blue)] bg-[var(--dynamo-blue)] px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#020714]"
              >
                <Zap className="h-4 w-4" aria-hidden="true" />
                Book Training
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
