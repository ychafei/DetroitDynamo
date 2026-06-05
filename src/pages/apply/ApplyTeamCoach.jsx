import React from 'react';
import { ApplicationForm } from '@/components/apply/ApplicationForm';

export default function ApplyTeamCoach() {
  return (
    <ApplicationForm
      type="team_coach"
      title="APPLY AS A TEAM COACH"
      subtitle="Coach the Detroit Dynamo FC competitive side - UPSL squad, age-group teams, and goalkeeper-specific roles."
      promptLabel="Coaching Background *"
      promptPlaceholder="Licenses, previous clubs, philosophy, and the role you're targeting (head coach, assistant, GK coach, etc.)."
    />
  );
}
