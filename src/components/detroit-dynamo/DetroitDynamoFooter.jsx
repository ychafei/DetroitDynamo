import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DetroitDynamoMark from './DetroitDynamoMark';

const footerColumns = [
  {
    title: 'Training',
    links: [
      { label: 'Programs', to: '/detroit-dynamo/training' },
      { label: 'Camps & Clinics', to: '/detroit-dynamo/camps-clinics' },
      { label: 'Live Booking', to: '/book' },
      { label: 'Training Inquiry', to: '/detroit-dynamo/book' },
    ],
  },
  {
    title: 'Youth Club',
    links: [
      { label: 'Youth Club', to: '/detroit-dynamo/youth-club' },
      { label: 'Academy Development', to: '/detroit-dynamo/academy' },
      { label: 'Tryouts', to: '/detroit-dynamo/tryouts' },
    ],
  },
  {
    title: 'Senior Teams',
    links: [
      { label: "Men's Team", to: '/detroit-dynamo/senior-men' },
      { label: "Women's Team", to: '/detroit-dynamo/senior-women' },
      { label: 'Teams Directory', to: '/detroit-dynamo/teams' },
    ],
  },
  {
    title: 'Club Ops',
    links: [
      { label: 'About', to: '/detroit-dynamo/about' },
      { label: 'Coaches', to: '/detroit-dynamo#coaches' },
      { label: 'Schedule & Results', to: '/detroit-dynamo/schedule-results' },
      { label: 'Sponsors', to: '/detroit-dynamo/sponsors' },
      { label: 'Contact', to: '/detroit-dynamo/contact' },
    ],
  },
  {
    title: 'Portals',
    links: [
      { label: 'Client Dashboard', to: '/dashboard' },
      { label: 'Coach Portal', to: '/coach' },
      { label: 'Admin Portal', to: '/admin' },
      { label: 'Sign In', to: '/login' },
    ],
  },
];

export default function DetroitDynamoFooter() {
  return (
    <footer className="border-t border-[var(--dynamo-line)] bg-[#020714] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Detroit Dynamo home">
              <DetroitDynamoMark className="h-14 w-14 shrink-0" />
              <span>
                <span className="block font-oswald text-2xl font-bold uppercase tracking-[0.08em] text-white">
                  Detroit Dynamo
                </span>
                <span className="mt-1 block text-sm text-[#B8C3D7]">
                  Built in Detroit. Driven by development.
                </span>
              </span>
            </Link>
            <Link
              to="/detroit-dynamo/tryouts"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[var(--dynamo-blue)] bg-[var(--dynamo-blue)] px-5 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#020714] transition hover:bg-[var(--dynamo-blue-bright)]"
            >
              Register Interest
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="font-oswald text-xs font-bold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
                  {column.title}
                </h3>
                <div className="mt-4 grid gap-2">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-sm text-[#B8C3D7] transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--dynamo-line)] pt-6 text-xs text-[#8390A6] sm:flex-row sm:items-center sm:justify-between">
          <p>Detroit Dynamo player development pathway.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/detroit-dynamo/brand" className="transition hover:text-white">
              Brand System
            </Link>
            <Link to="/detroit-dynamo/admin-foundation" className="transition hover:text-white">
              Admin Foundation
            </Link>
            <span>Detroit Dynamo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
