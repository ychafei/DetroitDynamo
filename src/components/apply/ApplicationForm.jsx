import React, { useState } from 'react';
import { coachApplicationRepo } from '@/api/repo';
import { storage } from '@/lib/storage';
import {
  LIMITS, cleanPhone, formatPhone, normalizeEmail, validateForm,
} from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Upload, FileText } from 'lucide-react';

/**
 * Unified application form. `type` controls which fields render and the
 * `application_type` value stored on the submitted record so the admin panel
 * can route it to the right queue.
 *
 *   type = 'team_player' | 'team_coach' | 'private_training_coach' | 'general'
 */
export function ApplicationForm({
  type,
  title,
  subtitle,
  promptLabel,
  promptPlaceholder,
  fields = /** @type {Record<string, boolean>} */ ({}),
  successMessage = 'Thank you for your interest. We\'ll review your application and get back to you soon.',
}) {
  const {
    county = true,
    dob = true,
    resume = type !== 'team_player',
    backgroundCheck = type !== 'team_player',
    position = type === 'team_player',
    experience = type === 'team_player' || type === 'team_coach',
  } = fields;

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
    county: '',
    position: '',
    experience: '',
    coaching_background: '',
    background_check_consent: false,
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState(/** @type {Record<string, string | undefined>} */ ({}));

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone is optional on this form, but if provided it must be a real
    // 10-digit number. Names can't contain digits; the free-text answers are
    // capped so a paste-bomb can't get stored.
    const spec = {
      first_name: { label: 'First name', name: true, required: true },
      last_name: { label: 'Last name', name: true, required: true },
      email: { label: 'Email', email: true, required: true },
      phone: { label: 'Phone', phone: true },
      coaching_background: { label: 'This answer', required: true, maxLength: LIMITS.longText },
    };
    if (experience) {
      spec.experience = { label: 'Experience', required: true, maxLength: LIMITS.longText };
    }
    const { valid, errors: found } = validateForm(form, spec);
    if (!valid) {
      setErrors(/** @type {Record<string, string | undefined>} */ (found));
      return;
    }
    setErrors(/** @type {Record<string, string | undefined>} */ ({}));

    setSubmitting(true);
    try {
      let resume_url = '';
      if (resumeFile) {
        const { url } = await storage.uploadFile('coach-resumes', resumeFile);
        resume_url = url;
      }
      await coachApplicationRepo.create({
        ...form,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: normalizeEmail(form.email),
        phone: form.phone ? cleanPhone(form.phone) : '',
        coaching_background: form.coaching_background.trim(),
        experience: form.experience.trim(),
        resume_url,
        application_type: type,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const errText = 'text-xs text-destructive mt-1';

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-4">APPLICATION SUBMITTED</h1>
          <p className="text-muted-foreground">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-oswald text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">{title}</h1>
        {subtitle && <p className="text-muted-foreground mb-10 leading-relaxed">{subtitle}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">First Name *</Label>
              <Input required maxLength={LIMITS.name} value={form.first_name} onChange={e => setField('first_name', e.target.value)} className="bg-card border-border mt-1" />
              {errors.first_name && <p className={errText}>{errors.first_name}</p>}
            </div>
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Last Name *</Label>
              <Input required maxLength={LIMITS.name} value={form.last_name} onChange={e => setField('last_name', e.target.value)} className="bg-card border-border mt-1" />
              {errors.last_name && <p className={errText}>{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <Label className="font-oswald tracking-wider uppercase text-xs">Email *</Label>
            <Input required type="email" maxLength={LIMITS.email} value={form.email} onChange={e => setField('email', e.target.value)} className="bg-card border-border mt-1" />
            {errors.email && <p className={errText}>{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Phone</Label>
              <Input type="tel" inputMode="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e => setField('phone', formatPhone(e.target.value))} className="bg-card border-border mt-1" />
              {errors.phone && <p className={errText}>{errors.phone}</p>}
            </div>
            {dob && (
              <div>
                <Label className="font-oswald tracking-wider uppercase text-xs">Date of Birth</Label>
                <Input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="bg-card border-border mt-1" />
              </div>
            )}
          </div>

          {county && (
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">County</Label>
              <Select value={form.county} onValueChange={v => setForm({ ...form, county: v })}>
                <SelectTrigger className="bg-card border-border mt-1"><SelectValue placeholder="Select county" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oakland">Oakland</SelectItem>
                  <SelectItem value="Macomb">Macomb</SelectItem>
                  <SelectItem value="Wayne">Wayne</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {position && (
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Preferred Position *</Label>
              <Select value={form.position} onValueChange={v => setForm({ ...form, position: v })}>
                <SelectTrigger className="bg-card border-border mt-1"><SelectValue placeholder="Select position" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GK">Goalkeeper</SelectItem>
                  <SelectItem value="DEF">Defender</SelectItem>
                  <SelectItem value="MID">Midfielder</SelectItem>
                  <SelectItem value="FWD">Forward</SelectItem>
                  <SelectItem value="Any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {experience && (
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Playing / Experience Highlights *</Label>
              <Textarea
                required
                maxLength={LIMITS.longText}
                value={form.experience}
                onChange={e => setField('experience', e.target.value)}
                className="bg-card border-border mt-1"
                rows={4}
                placeholder="Clubs, leagues, levels, championships, college, semi-pro, etc."
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-destructive">{errors.experience || ''}</span>
                <span className="text-xs text-muted-foreground">{form.experience.length}/{LIMITS.longText}</span>
              </div>
            </div>
          )}

          <div>
            <Label className="font-oswald tracking-wider uppercase text-xs">{promptLabel || 'Tell us about yourself *'}</Label>
            <Textarea
              required
              maxLength={LIMITS.longText}
              value={form.coaching_background}
              onChange={e => setField('coaching_background', e.target.value)}
              className="bg-card border-border mt-1"
              rows={5}
              placeholder={promptPlaceholder || 'Background, what excites you, how you’d contribute…'}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-destructive">{errors.coaching_background || ''}</span>
              <span className="text-xs text-muted-foreground">{form.coaching_background.length}/{LIMITS.longText}</span>
            </div>
          </div>

          {resume && (
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Resume / CV (optional)</Label>
              <label className="mt-1 flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-md p-4 hover:border-accent/50 transition-colors">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
                {resumeFile ? (
                  <><FileText className="w-5 h-5 text-accent" /><span className="text-sm text-foreground">{resumeFile.name}</span></>
                ) : (
                  <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">Upload PDF, DOC, or DOCX</span></>
                )}
              </label>
            </div>
          )}

          {backgroundCheck && (
            <div className="flex items-start gap-3">
              <Checkbox
                checked={form.background_check_consent}
                onCheckedChange={v => setForm({ ...form, background_check_consent: v })}
              />
              <label className="text-sm text-muted-foreground">
                I consent to a background check as part of the application process.
              </label>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase hover:bg-accent/90 py-6"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    </div>
  );
}
