import React from 'react';
import { ApplicationForm } from '@/components/apply/ApplicationForm';

export default function ApplyTeamPlayer() {
  return (
    <ApplicationForm
      type="team_player"
      title="APPLY AS A TEAM PLAYER"
      subtitle="Looking to compete for LCFC? Tell us about yourself and we'll be in touch with tryout details."
      promptLabel="Why LCFC? *"
      promptPlaceholder="Tell us about your playing history, what you bring to the squad, and why you want to wear the badge."
    />
  );
}
