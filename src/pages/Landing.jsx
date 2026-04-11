import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import StatsRow from '@/components/landing/StatsRow';
import CountySelector from '@/components/landing/CountySelector';
import CoachShowcase from '@/components/landing/CoachShowcase';
import PricingSection from '@/components/landing/PricingSection';
import ParentTestimonials from '@/components/landing/ParentTestimonials';
import CTABanner from '@/components/landing/CTABanner';

export default function Landing() {
  return (
    <div>
      <HeroSection />
      <StatsRow />
      <CountySelector />
      <CoachShowcase />
      <PricingSection />
      <ParentTestimonials />
      <CTABanner />
    </div>
  );
}