import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Briefcase, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/AuthContext';
import { getBrandLabel } from '@/lib/brand';

const TEAM_ITEMS = [
  { label: 'Team Directory', path: '/detroit-dynamo/teams' },
  { label: 'Schedule & Results', path: '/detroit-dynamo/schedule-results' },
  { label: 'Tryouts', path: '/detroit-dynamo/tryouts' },
  { label: 'Senior Men', path: '/detroit-dynamo/senior-men' },
  { label: 'Senior Women', path: '/detroit-dynamo/senior-women' },
  { label: 'Youth Club', path: '/detroit-dynamo/youth-club' },
  { label: 'Sponsors', path: '/detroit-dynamo/sponsors' },
];

function HoverLinkDropdown({ link, isActive }) {
  const active = isActive(link.path);
  return (
    <div className="relative group">
      <Link
        to={link.path}
        className={`px-4 py-2 text-sm font-oswald tracking-wide uppercase transition-colors border-b-2 flex items-center gap-1.5 outline-none ${
          active
            ? 'text-[var(--dynamo-blue-bright)] border-[var(--dynamo-blue-bright)]'
            : 'text-[#E8E8E8] border-transparent hover:text-white'
        }`}
      >
        {link.label}
        <ChevronDown className="w-3 h-3 opacity-70 transition-transform duration-150 group-hover:rotate-180" />
      </Link>
      {/* pt-2 keeps a hover bridge so the menu doesn't flicker closed */}
      <div className="absolute left-0 top-full pt-2 min-w-[230px] z-50 opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
        <div className="rounded-md border border-[rgba(98,216,255,0.32)] bg-[#020714] shadow-xl shadow-black/50 p-1">
          {link.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-3 py-2 text-sm font-oswald tracking-wide uppercase rounded-sm text-[#F7F7F5] outline-none hover:bg-[rgba(98,216,255,0.12)] hover:text-[var(--dynamo-blue-bright)] focus:bg-[rgba(98,216,255,0.12)] focus:text-[var(--dynamo-blue-bright)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({}); // { team: true, apply: false }
  const { user, isAuthenticated, isAdmin, isCoach, logout, navigateToLogin } = useAuth();
  const authenticated = isAuthenticated;
  const location = useLocation();

  const getNavLinks = () => {
    if (!authenticated || !user) {
      return [
        { label: 'Home', path: '/detroit-dynamo' },
        { label: 'Training', path: '/detroit-dynamo/training' },
        { label: 'Teams', path: '/detroit-dynamo/teams', items: TEAM_ITEMS, linkTrigger: true },
        { label: 'Camps', path: '/detroit-dynamo/camps-clinics' },
        { label: 'Sponsors', path: '/detroit-dynamo/sponsors' },
        { label: 'About', path: '/detroit-dynamo/about' },
      ];
    }

    // Admins: coach portal + admin only.
    if (isAdmin) {
      return [
        { label: 'Coaching Portal', path: '/coach', icon: Briefcase },
        { label: 'Admin', path: '/admin', icon: Shield },
      ];
    }

    // Coaches (non-admin): coach portal only.
    if (isCoach) {
      return [{ label: 'Coaching Portal', path: '/coach', icon: Briefcase }];
    }

    // Clients: account nav.
    return [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Book', path: '/book' },
      { label: 'Matching', path: '/matching' },
      { label: 'Messages', path: '/messages' },
    ];
  };

  const navLinks = getNavLinks();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleMobileExpand = (key) =>
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded({});
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/detroit-dynamo" className="flex items-center gap-3" aria-label="Detroit Dynamo home">
            <img
              src="/detroit-dynamo/logo-primary.png"
              alt="Detroit Dynamo"
              className="h-12 md:h-14 w-auto object-contain"
            />
            <span className="font-oswald text-2xl md:text-3xl font-bold tracking-wider text-accent whitespace-nowrap">
              {getBrandLabel(location.pathname)}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.items && link.linkTrigger ? (
                <HoverLinkDropdown key={link.path} link={link} isActive={isActive} />
              ) : link.items ? (
                <DropdownMenu key={link.path}>
                  <DropdownMenuTrigger
                    className={`px-4 py-2 text-sm font-oswald tracking-wide uppercase transition-colors outline-none focus:outline-none flex items-center gap-1.5 ${
                      isActive(link.path)
                        ? 'text-accent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.icon && <link.icon className="w-3.5 h-3.5" />}
                    {link.label}
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="bg-card border border-border min-w-[220px] p-1"
                  >
                    {link.items.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className={`px-3 py-2 text-sm font-oswald tracking-wide uppercase rounded-sm cursor-pointer w-full ${
                            isActive(item.path)
                              ? 'text-accent bg-accent/10'
                              : 'text-foreground hover:text-accent focus:text-accent'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-oswald tracking-wide uppercase transition-colors border-b-2 ${
                    link.subtle
                      ? isActive(link.path)
                        ? 'text-[#6FE7FF] border-[#6FE7FF]/70'
                        : 'text-muted-foreground/70 border-transparent hover:text-[#6FE7FF]'
                      : isActive(link.path)
                        ? 'text-accent border-accent'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon && <link.icon className="w-3.5 h-3.5" />}
                    {link.label}
                  </span>
                </Link>
              )
            )}
            <div className="ml-4">
              {authenticated ? (
                <div className="flex items-center gap-3">
                  {user?.first_name && (
                    <span className="font-oswald tracking-wide uppercase text-xs text-muted-foreground hidden lg:inline">
                      Hi, <span className="text-accent">{user.first_name}</span>
                    </span>
                  )}
                  <Link to="/settings">
                    <Button variant="ghost" size="sm" className="font-oswald tracking-wide uppercase text-xs">
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                    className="font-oswald tracking-wide uppercase text-xs border-border"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToLogin()}
                    className="font-oswald tracking-wide uppercase text-xs"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigateToLogin()}
                    className="bg-accent text-accent-foreground font-oswald tracking-wide uppercase text-xs hover:bg-accent/90"
                  >
                    Join Dynamo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.items ? (
                <div key={link.path}>
                  <button
                    onClick={() => toggleMobileExpand(link.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-oswald tracking-wide uppercase rounded-md transition-colors ${
                      isActive(link.path)
                        ? 'text-accent bg-secondary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${mobileExpanded[link.path] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {mobileExpanded[link.path] && (
                    <div className="ml-4 pl-3 border-l border-border space-y-0.5 mt-1 mb-2">
                      {link.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeMobile}
                          className={`block px-4 py-2.5 text-xs font-oswald tracking-wide uppercase rounded-md transition-colors ${
                            isActive(item.path)
                              ? 'text-accent bg-secondary'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobile}
                  className={`block px-4 py-3 text-sm font-oswald tracking-wide uppercase rounded-md transition-colors ${
                    link.subtle
                      ? isActive(link.path)
                        ? 'text-[#6FE7FF] bg-secondary'
                        : 'text-muted-foreground/70 hover:text-[#6FE7FF] hover:bg-secondary'
                      : isActive(link.path)
                        ? 'text-accent bg-secondary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </span>
                </Link>
              )
            )}
            <div className="pt-2 border-t border-border space-y-2">
              {authenticated ? (
                <>
                  <Link to="/settings" onClick={closeMobile}>
                    <Button variant="ghost" className="w-full justify-start font-oswald tracking-wide uppercase text-xs">
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full font-oswald tracking-wide uppercase text-xs"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-accent text-accent-foreground font-oswald tracking-wide uppercase text-xs"
                  onClick={() => navigateToLogin()}
                >
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
