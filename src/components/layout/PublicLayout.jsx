import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import OnboardingModal from '@/components/OnboardingModal.jsx';
import { base44 } from '@/api/base44Client';

export default function PublicLayout() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) return;
        const u = await base44.auth.me();
        setCurrentUser(u);
        if (!u?.profile_setup_complete && u?.role === 'user') {
          setShowOnboarding(true);
        }
      } catch {
        // unauthenticated — no-op
      }
    };
    loadUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      {showOnboarding && currentUser && (
        <OnboardingModal
          user={currentUser}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}