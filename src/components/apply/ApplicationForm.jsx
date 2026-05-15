import React, { useState } from 'react';
import { coachApplicationRepo } from '@/api/repo';
import { storage } from '@/lib/storage';
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
  fields = {},
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let resume_url = '';
      if (resumeFile) {
        const { url } = await storage.uploadFile('coach-resumes', resumeFile);
        resume_url = url;
      }
      await coachApplicationRepo.create({
        ...form,
        resume_url,
        application_type: type,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

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
              <Input required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="bg-card border-border mt-1" />
            </div>
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Last Name *</Label>
              <Input required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="bg-card border-border mt-1" />
            </div>
          </div>

          <div>
            <Label className="font-oswald tracking-wider uppercase text-xs">Email *</Label>
            <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-card border-border mt-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-card border-border mt-1" />
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
                value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })}
                className="bg-card border-border mt-1"
                rows={4}
                placeholder="Clubs, leagues, levels, championships, college, semi-pro, etc."
              />
            </div>
          )}

          <div>
            <Label className="font-oswald tracking-wider uppercase text-xs">{promptLabel || 'Tell us about yourself *'}</Label>
            <Textarea
              required
              value={form.coaching_background}
              onChange={e => setForm({ ...form, coaching_background: e.target.value })}
              className="bg-card border-border mt-1"
              rows={5}
              placeholder={promptPlaceholder || 'Background, what excites you, how you’d contribute…'}
            />
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
