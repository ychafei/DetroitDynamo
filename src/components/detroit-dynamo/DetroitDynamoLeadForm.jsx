// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { LIMITS, cleanPhone, formatPhone, normalizeEmail, validateForm } from '@/lib/validation';
import { saveDetroitDynamoLead } from '@/lib/detroitDynamoLeads';

const formConfigs = {
  contact: {
    eyebrow: 'Contact',
    title: 'Start the Conversation',
    submit: 'Send Inquiry',
    success: 'Inquiry captured. Detroit Dynamo has stored this lead for staff review and follow-up planning.',
    note: 'Preview handler: saved locally for admin/data-model planning until Appwrite collections are provisioned.',
  },
  training: {
    eyebrow: 'Training Inquiry',
    title: 'Request Training Info',
    submit: 'Request Training Info',
    success: 'Training inquiry captured. The future admin queue will route this to the Training Director.',
    note: 'Training leads map to the future ContactLead and Booking pipeline.',
  },
  youth: {
    eyebrow: 'Youth Club Interest',
    title: 'Join the Youth Pathway List',
    submit: 'Register Youth Interest',
    success: 'Youth club interest captured. The future registrar queue will use this for age-group planning.',
    note: 'Youth interest maps to the future Player, ParentGuardian, Team, and TryoutRegistration records.',
  },
  tryout: {
    eyebrow: 'Tryout Registration',
    title: 'Register Tryout Interest',
    submit: 'Submit Tryout Interest',
    success: 'Tryout interest captured. The future registrar queue will review the player profile and team interest.',
    note: 'Tryout records are stored for staff review while the Appwrite TryoutRegistration workflow is provisioned.',
  },
  men: {
    eyebrow: "Men's Team Interest",
    title: "Men's Team Player Interest",
    submit: "Submit Men's Interest",
    success: "Men's team interest captured for the future senior-team pathway queue.",
    note: "This does not claim current league membership. It captures interest for the men's pro-development roadmap.",
  },
  women: {
    eyebrow: "Women's Team Interest",
    title: "Women's Team Player Interest",
    submit: "Submit Women's Interest",
    success: "Women's team interest captured for the future senior-team pathway queue.",
    note: "This does not claim current league membership. It captures interest for the women's pro-development roadmap.",
  },
  sponsor: {
    eyebrow: 'Sponsor Inquiry',
    title: 'Partner with Detroit Dynamo',
    submit: 'Send Sponsor Inquiry',
    success: 'Sponsor inquiry captured. The future partnerships queue will use this for follow-up.',
    note: 'Sponsor leads map to the future Sponsor and ContactLead records.',
  },
};

const initialForm = {
  contact_name: '',
  player_name: '',
  parent_guardian_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  team_interest: '',
  position: '',
  current_club: '',
  experience_level: '',
  program_interest: '',
  age_group: '',
  organization: '',
  package_interest: '',
  notes: '',
};

const teamOptions = ['Youth Club', "Senior Men's Team", "Senior Women's Team", 'Training Evaluation'];
const positionOptions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Multiple / Unsure'];
const experienceOptions = ['Beginner', 'Developing', 'Club', 'High school', 'College', 'Semi-pro / pro-development'];
const ageGroupOptions = ['U7-U8 Foundation', 'U9-U12 Pre-Academy', 'U13-U19 Competitive Pathway', 'Senior / adult'];
const programOptions = ['Private training', 'Small-group training', 'Team training', 'Tryout preparation', 'Camps / clinics', 'Goalkeeper training'];
const sponsorOptions = ['Community Partner', 'Training Partner', 'Kit / Apparel Partner', 'Matchday / Event Partner', 'Founding Sponsor'];

function isMinor(dateString) {
  if (!dateString) return false;
  const dob = new Date(dateString);
  if (Number.isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age < 18;
}

function SelectField({ id, label, value, onChange, options, required = false, error = '' }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="font-oswald text-xs uppercase tracking-[0.12em] text-[#D7DEEA]">
        {label}{required ? ' *' : ''}
      </label>
      <select
        id={id}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 flex h-11 w-full rounded-md border border-[var(--dynamo-line)] bg-[#020714] px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-[var(--dynamo-blue-bright)] focus:ring-1 focus:ring-[var(--dynamo-blue-bright)]"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p id={errorId} role="alert" className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function TextField({ id, label, value, onChange, required = false, type = 'text', error = '', placeholder = '' }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="font-oswald text-xs uppercase tracking-[0.12em] text-[#D7DEEA]">
        {label}{required ? ' *' : ''}
      </label>
      <input
        id={id}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 flex h-11 w-full rounded-md border border-[var(--dynamo-line)] bg-[#020714] px-3 py-2 text-sm text-white placeholder:text-[#6D7C94] shadow-sm outline-none transition focus:border-[var(--dynamo-blue-bright)] focus:ring-1 focus:ring-[var(--dynamo-blue-bright)]"
      />
      {error && <p id={errorId} role="alert" className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

export default function DetroitDynamoLeadForm({
  variant = 'contact',
  source = 'detroit-dynamo',
  compact = false,
  defaultTeamInterest = '',
  defaultProgramInterest = '',
  defaultPackageInterest = '',
  defaultAgeGroupInterest = '',
  defaultNotes = '',
}) {
  const config = formConfigs[variant] || formConfigs.contact;
  /** @type {[typeof initialForm, Function]} */
  const [form, setForm] = useState({
    ...initialForm,
    team_interest: defaultTeamInterest,
    program_interest: defaultProgramInterest,
    package_interest: defaultPackageInterest,
    age_group: defaultAgeGroupInterest,
    notes: defaultNotes,
  });
  /** @type {[Record<string, string>, Function]} */
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const previousDefaults = useRef({ defaultTeamInterest, defaultProgramInterest, defaultPackageInterest, defaultAgeGroupInterest, defaultNotes });

  const showPlayerFields = ['tryout', 'youth', 'men', 'women'].includes(variant);
  const showSponsorFields = variant === 'sponsor';
  const showProgramFields = ['contact', 'training'].includes(variant);
  const showYouthFields = variant === 'youth';
  const showTryoutFields = ['tryout', 'men', 'women'].includes(variant);
  const playerIsMinor = useMemo(() => isMinor(form.date_of_birth), [form.date_of_birth]);

  useEffect(() => {
    const previous = previousDefaults.current;
    setForm((current) => ({
      ...current,
      team_interest: current.team_interest === previous.defaultTeamInterest ? defaultTeamInterest : current.team_interest,
      program_interest: current.program_interest === previous.defaultProgramInterest ? defaultProgramInterest : current.program_interest,
      package_interest: current.package_interest === previous.defaultPackageInterest ? defaultPackageInterest : current.package_interest,
      age_group: current.age_group === previous.defaultAgeGroupInterest ? defaultAgeGroupInterest : current.age_group,
      notes: current.notes === previous.defaultNotes ? defaultNotes : current.notes,
    }));
    previousDefaults.current = { defaultTeamInterest, defaultProgramInterest, defaultPackageInterest, defaultAgeGroupInterest, defaultNotes };
  }, [defaultTeamInterest, defaultProgramInterest, defaultPackageInterest, defaultAgeGroupInterest, defaultNotes]);

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const spec = {
      email: { label: 'Email', email: true, required: true },
      phone: { label: 'Phone', phone: true, required: showTryoutFields || showYouthFields },
      notes: { label: 'Notes', maxLength: LIMITS.longText, required: !compact && variant === 'contact' },
    };

    if (showPlayerFields) {
      spec.player_name = { label: 'Player name', required: true, maxLength: LIMITS.shortText };
      spec.date_of_birth = { label: 'Date of birth', required: true };
      spec.team_interest = { label: 'Team interest', required: true };
      spec.position = { label: 'Position', required: true };
      spec.experience_level = { label: 'Experience level', required: true };
    } else {
      spec.contact_name = { label: 'Contact name', required: true, maxLength: LIMITS.shortText };
    }

    if (showSponsorFields) {
      spec.organization = { label: 'Business / organization', required: true, maxLength: LIMITS.shortText };
      spec.package_interest = { label: 'Package interest', required: true };
    }

    if (showProgramFields) {
      spec.program_interest = { label: 'Program interest', required: variant === 'training' };
    }

    if (playerIsMinor) {
      spec.parent_guardian_name = { label: 'Parent/guardian name', required: true, maxLength: LIMITS.shortText };
    }

    const { valid, errors: foundErrors } = validateForm(form, spec);
    if (!valid) {
      setErrors(foundErrors);
      return;
    }

    setSubmitting(true);
    try {
      const lead = await saveDetroitDynamoLead({
        lead_type: variant,
        source_route: source,
        contact_name: form.contact_name.trim(),
        player_name: form.player_name.trim(),
        parent_guardian_name: form.parent_guardian_name.trim(),
        email: normalizeEmail(form.email),
        phone: form.phone ? cleanPhone(form.phone) : '',
        date_of_birth: form.date_of_birth,
        team_interest: form.team_interest,
        position: form.position,
        current_club: form.current_club.trim(),
        experience_level: form.experience_level,
        program_interest: form.program_interest,
        age_group: form.age_group,
        organization: form.organization.trim(),
        package_interest: form.package_interest,
        notes: form.notes.trim(),
      });
      setSubmittedLead(lead);
      setForm({
        ...initialForm,
        team_interest: defaultTeamInterest,
        program_interest: defaultProgramInterest,
        package_interest: defaultPackageInterest,
        age_group: defaultAgeGroupInterest,
        notes: defaultNotes,
      });
    } catch (_error) {
      setSubmitError('Detroit Dynamo could not store the submission locally. Please use the contact form or email the staff while the backend queue is provisioned.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedLead) {
    return (
      <div role="status" aria-live="polite" className="rounded-lg border border-[rgba(98,216,255,0.34)] bg-[#061225] p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(98,216,255,0.42)] bg-[rgba(0,120,255,0.14)]">
          <CheckCircle2 className="h-7 w-7 text-[var(--dynamo-blue-bright)]" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white">Submission Captured</h3>
        <p className="mt-3 text-sm leading-7 text-[#B8C3D7]">{config.success}</p>
        <p className="mt-4 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-xs text-[#AEBBD0]">
          Reference: {submittedLead.id}
        </p>
        <button
          type="button"
          onClick={() => setSubmittedLead(null)}
          className="mt-5 rounded-md border border-white/15 bg-white/[0.045] px-4 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-[var(--dynamo-blue-bright)] hover:text-[var(--dynamo-blue-bright)]"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={submitting}
      className="rounded-lg border border-[var(--dynamo-line)] bg-[#061225] p-5 sm:p-6"
    >
      <p className="font-oswald text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dynamo-blue-bright)]">
        {config.eyebrow}
      </p>
      <h2 className="mt-3 font-oswald text-2xl font-bold uppercase tracking-[0.035em] text-white sm:text-3xl">
        {config.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#AEBBD0]">{config.note}</p>

      <div className="mt-6 grid gap-4">
        {showPlayerFields ? (
          <>
            <TextField
              id={`${variant}-player-name`}
              label="Player name"
              required
              value={form.player_name}
              onChange={(value) => setField('player_name', value)}
              error={errors.player_name}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id={`${variant}-dob`}
                label="Date of birth"
                required
                type="date"
                value={form.date_of_birth}
                onChange={(value) => setField('date_of_birth', value)}
                error={errors.date_of_birth}
              />
              <TextField
                id={`${variant}-guardian`}
                label="Parent/guardian name if minor"
                required={playerIsMinor}
                value={form.parent_guardian_name}
                onChange={(value) => setField('parent_guardian_name', value)}
                error={errors.parent_guardian_name}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id={`${variant}-team-interest`}
                label="Gender/team interest"
                required
                value={form.team_interest}
                onChange={(value) => setField('team_interest', value)}
                options={teamOptions}
                error={errors.team_interest}
              />
              <SelectField
                id={`${variant}-position`}
                label="Position"
                required
                value={form.position}
                onChange={(value) => setField('position', value)}
                options={positionOptions}
                error={errors.position}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id={`${variant}-club`}
                label="Current / previous club"
                value={form.current_club}
                onChange={(value) => setField('current_club', value)}
                error={errors.current_club}
              />
              <SelectField
                id={`${variant}-experience`}
                label="Level of experience"
                required
                value={form.experience_level}
                onChange={(value) => setField('experience_level', value)}
                options={experienceOptions}
                error={errors.experience_level}
              />
            </div>
          </>
        ) : (
          <TextField
            id={`${variant}-contact-name`}
            label="Contact name"
            required
            value={form.contact_name}
            onChange={(value) => setField('contact_name', value)}
            error={errors.contact_name}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id={`${variant}-email`}
            label="Email"
            required
            type="email"
            value={form.email}
            onChange={(value) => setField('email', value)}
            error={errors.email}
            placeholder="you@example.com"
          />
          <TextField
            id={`${variant}-phone`}
            label={showTryoutFields || showYouthFields ? 'Phone' : 'Phone optional'}
            required={showTryoutFields || showYouthFields}
            type="tel"
            value={form.phone}
            onChange={(value) => setField('phone', formatPhone(value))}
            error={errors.phone}
            placeholder="(555) 000-0000"
          />
        </div>

        {showYouthFields && (
          <SelectField
            id={`${variant}-age-group`}
            label="Age group"
            value={form.age_group}
            onChange={(value) => setField('age_group', value)}
            options={ageGroupOptions}
          />
        )}

        {showProgramFields && (
          <SelectField
            id={`${variant}-program`}
            label="Program interest"
            required={variant === 'training'}
            value={form.program_interest}
            onChange={(value) => setField('program_interest', value)}
            options={programOptions}
            error={errors.program_interest}
          />
        )}

        {showSponsorFields && (
          <>
            <TextField
              id={`${variant}-organization`}
              label="Business / organization"
              required
              value={form.organization}
              onChange={(value) => setField('organization', value)}
              error={errors.organization}
            />
            <SelectField
              id={`${variant}-package`}
              label="Package interest"
              required
              value={form.package_interest}
              onChange={(value) => setField('package_interest', value)}
              options={sponsorOptions}
              error={errors.package_interest}
            />
          </>
        )}

        <div>
          <label htmlFor={`${variant}-notes`} className="font-oswald text-xs uppercase tracking-[0.12em] text-[#D7DEEA]">
            Notes{!compact && variant === 'contact' ? ' *' : ''}
          </label>
          <textarea
            id={`${variant}-notes`}
            required={!compact && variant === 'contact'}
            maxLength={LIMITS.longText}
            value={form.notes}
            onChange={(event) => setField('notes', event.target.value)}
            placeholder="Goals, questions, team interest, player background, or sponsor details."
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={[errors.notes ? `${variant}-notes-error` : null, `${variant}-notes-count`].filter(Boolean).join(' ') || undefined}
            className="mt-2 flex min-h-28 w-full rounded-md border border-[var(--dynamo-line)] bg-[#020714] px-3 py-2 text-sm text-white placeholder:text-[#6D7C94] shadow-sm outline-none transition focus:border-[var(--dynamo-blue-bright)] focus:ring-1 focus:ring-[var(--dynamo-blue-bright)]"
          />
          <div className="mt-1 flex justify-between gap-3">
            <span id={`${variant}-notes-error`} role={errors.notes ? 'alert' : undefined} className="text-xs text-red-300">{errors.notes || ''}</span>
            <span id={`${variant}-notes-count`} className="text-xs text-[#8390A6]">{form.notes.length}/{LIMITS.longText}</span>
          </div>
        </div>
      </div>

      {submitError && (
        <div role="alert" aria-live="assertive" className="mt-5 flex gap-3 rounded-md border border-red-300/20 bg-red-500/10 p-3 text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        aria-disabled={submitting}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[var(--dynamo-blue)] bg-[var(--dynamo-blue)] px-5 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-[#020714] transition hover:bg-[var(--dynamo-blue-bright)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? 'Submitting...' : config.submit}
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
