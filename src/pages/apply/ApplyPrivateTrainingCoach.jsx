import React from 'react';
import { ApplicationForm } from '@/components/apply/ApplicationForm';

export default function ApplyPrivateTrainingCoach() {
  return (
    <ApplicationForm
      type="private_training_coach"
      title="APPLY AS A PRIVATE TRAINING COACH"
      subtitle="Offer 1-on-1 and small-group training to LC Training clients across Metro Detroit."
      promptLabel="Coaching Background *"
      promptPlaceholder="Years of experience, age groups, specialties, areas you cover, and what makes your training stand out."
    />
  );
}
