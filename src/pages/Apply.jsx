import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2 } from 'lucide-react';

export default function Apply() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', dob: '', county: '', coaching_background: '', background_check_consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.CoachApplication.create(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-4">APPLICATION SUBMITTED</h1>
          <p className="text-muted-foreground">Thank you for your interest. We'll review your application and get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-oswald text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">BECOME A COACH</h1>
        <p className="text-muted-foreground mb-10">Join the LC Training team and help develop the next generation of athletes.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">First Name *</Label>
              <Input required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="bg-card border-border mt-1" />
            </div>
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Last Name *</Label>
              <Input required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="bg-card border-border mt-1" />
            </div>
          </div>
          <div>
            <Label className="font-oswald tracking-wider uppercase text-xs">Email *</Label>
            <Input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-card border-border mt-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Phone</Label>
              <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-card border-border mt-1" />
            </div>
            <div>
              <Label className="font-oswald tracking-wider uppercase text-xs">Date of Birth</Label>
              <Input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="bg-card border-border mt-1" />
            </div>
          </div>
          <div>
            <Label className="font-oswald tracking-wider uppercase text-xs">Preferred County *</Label>
            <Select value={form.county} onValueChange={v => setForm({...form, county: v})}>
              <SelectTrigger className="bg-card border-border mt-1"><SelectValue placeholder="Select county" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Oakland">Oakland</SelectItem>
                <SelectItem value="Macomb">Macomb</SelectItem>
                <SelectItem value="Wayne">Wayne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-oswald tracking-wider uppercase text-xs">Coaching Background *</Label>
            <Textarea required value={form.coaching_background} onChange={e => setForm({...form, coaching_background: e.target.value})} className="bg-card border-border mt-1" rows={5} placeholder="Tell us about your coaching experience..." />
          </div>
          <div className="flex items-start gap-3">
            <Checkbox checked={form.background_check_consent} onCheckedChange={v => setForm({...form, background_check_consent: v})} />
            <label className="text-sm text-muted-foreground">I consent to a background check as part of the application process.</label>
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase hover:bg-accent/90 py-6">
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    </div>
  );
}