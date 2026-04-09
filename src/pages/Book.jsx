import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, ArrowRight, MapPin, User, Clock, Timer, CheckCircle2, Package, Zap, Star } from 'lucide-react';
import { format, isBefore, startOfDay, parseISO, isWithinInterval } from 'date-fns';
import useCurrentUser from '@/hooks/useCurrentUser';

// Duration options with discount multipliers relative to 1hr base
const DURATIONS = [
  { label: '1 Hour',    minutes: 60,  hours: 1,   discount: 0 },
  { label: '1.5 Hours', minutes: 90,  hours: 1.5, discount: 0.10 },
  { label: '2 Hours',   minutes: 120, hours: 2,   discount: 0.15 },
  { label: '2.5 Hours', minutes: 150, hours: 2.5, discount: 0.18 },
  { label: '3 Hours',   minutes: 180, hours: 3,   discount: 0.20 },
];

const GOAL_TAGS = ['Ball Control', 'Shooting', 'Passing', 'Speed & Agility', 'Positioning', 'Game IQ', 'Fitness', 'Defending'];

const TIME_SLOTS = [];
for (let h = 8; h <= 20; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 20) TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}

// Steps: 0=County, 1=Coach, 2=Package, 3=Date, 4=Time, 5=Duration, 6=Goals, 7=Review
const STEPS = ['County', 'Coach', 'Package', 'Date', 'Time', 'Duration', 'Goals', 'Review'];

// Calculate session price: base is per-session price from package (1hr), scale up with discount for longer
function calcPrice(pkg, dur) {
  if (!pkg || !dur) return null;
  const perSessionBase = pkg.price / (pkg.sessions || 1);
  const raw = perSessionBase * dur.hours;
  const discounted = raw * (1 - dur.discount);
  return Math.round(discounted);
}

export default function Book() {
  const urlParams = new URLSearchParams(window.location.search);
  const preCounty = urlParams.get('county');
  const { user } = useCurrentUser();

  const saved = (() => { try { return JSON.parse(sessionStorage.getItem('lc_booking') || 'null'); } catch { return null; } })();

  const [step, setStep]                   = useState(saved?.step ?? (preCounty ? 1 : 0));
  const [county, setCounty]               = useState(saved?.county || preCounty || '');
  const [coach, setCoach]                 = useState(saved?.coach || null);
  const [coaches, setCoaches]             = useState([]);
  const [packages, setPackages]           = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(saved?.selectedPackage || null);
  const [existingCredit, setExistingCredit]   = useState(null); // SessionCredit record user already owns
  const [useExistingCredit, setUseExistingCredit] = useState(false);
  const [selectedDate, setSelectedDate]   = useState(saved?.selectedDate ? new Date(saved.selectedDate) : null);
  const [selectedTime, setSelectedTime]   = useState(saved?.selectedTime || '');
  const [duration, setDuration]           = useState(saved?.duration || null);
  const [goals, setGoals]                 = useState(saved?.goals || '');
  const [selectedTags, setSelectedTags]   = useState(saved?.selectedTags || []);
  const [blocks, setBlocks]               = useState([]);
  const [existingSessions, setExistingSessions] = useState([]);
  const [submitting, setSubmitting]       = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookedSession, setBookedSession] = useState(null);

  useEffect(() => {
    base44.functions.invoke('getPublicCoaches', {}).then(res => setCoaches(res.data.coaches || []));
    base44.entities.PricingPackage.filter({ is_visible: true }, 'display_order').then(setPackages);
  }, []);

  useEffect(() => {
    if (county && coaches.length > 0) {
      const headCoach = coaches.find(c => c.county === county && c.is_head_coach);
      if (headCoach) {
        setCoach(headCoach);
        if (preCounty) setStep(2);
      } else {
        setCoach(null);
      }
    }
  }, [county, coaches, preCounty]);

  useEffect(() => {
    if (coach) {
      base44.functions.invoke('getCoachAvailability', { coach_id: coach.id }).then(res => {
        setBlocks(res.data.blocks || []);
        setExistingSessions(res.data.sessions || []);
      });
    }
  }, [coach]);

  // Check for existing unused credits when user + package selected
  useEffect(() => {
    if (user && selectedPackage) {
      base44.entities.SessionCredit.filter({ client_email: user.email, package_id: selectedPackage.id }).then(credits => {
        const active = credits.find(c => c.used_credits < c.total_credits);
        setExistingCredit(active || null);
        setUseExistingCredit(!!active);
      });
    }
  }, [user, selectedPackage]);

  const isDateBlocked = (date) => {
    const d = startOfDay(date);
    return blocks.some(b => {
      if (!b.block_all_day) return false;
      const start = startOfDay(parseISO(b.start_date));
      const end   = startOfDay(parseISO(b.end_date));
      return isWithinInterval(d, { start, end });
    });
  };

  const timeToMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  const isTimeSlotTaken = (time) => {
    if (!selectedDate) return false;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const slotStart = timeToMinutes(time);
    const slotEnd = slotStart + 30;
    return existingSessions.some(s => {
      if (s.date !== dateStr) return false;
      const sStart = timeToMinutes(s.start_time);
      const sEnd   = sStart + (s.duration_minutes || 60);
      return slotStart < sEnd && slotEnd > sStart;
    });
  };

  const isTimeSlotOutsideAvailability = (time) => {
    if (!selectedDate || !coach?.availability) return false;
    const dayAvail = coach.availability[format(selectedDate, 'EEEE')];
    if (!dayAvail || !dayAvail.enabled) return true;
    const slotMins  = timeToMinutes(time);
    const startMins = timeToMinutes(dayAvail.start);
    const endMins   = timeToMinutes(dayAvail.end);
    return slotMins < startMins || slotMins >= endMins;
  };

  const sessionPrice = calcPrice(selectedPackage, duration);

  const handleSubmit = async () => {
    if (!user) {
      sessionStorage.setItem('lc_booking', JSON.stringify({
        step, county, coach, selectedPackage, selectedDate, selectedTime, duration, goals, selectedTags
      }));
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    sessionStorage.removeItem('lc_booking');
    setSubmitting(true);

    const sessionGoals = [...selectedTags, goals].filter(Boolean).join(', ');
    const session = {
      coach_id: coach.id,
      client_email: user.email,
      client_name: user.full_name || user.email,
      date: format(selectedDate, 'yyyy-MM-dd'),
      start_time: selectedTime,
      duration_minutes: duration.minutes,
      status: 'pending',
      payment_status: 'unpaid',
      county,
      session_goals: sessionGoals,
      total_price: sessionPrice,
    };

    const newSession = await base44.entities.Session.create(session);

    // Handle credits
    if (useExistingCredit && existingCredit) {
      await base44.entities.SessionCredit.update(existingCredit.id, {
        used_credits: existingCredit.used_credits + 1
      });
    } else if (selectedPackage) {
      // New package purchase — create credit record (remaining sessions = total - 1 used)
      await base44.entities.SessionCredit.create({
        client_email: user.email,
        client_name: user.full_name || user.email,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        total_credits: selectedPackage.sessions || 1,
        used_credits: 1,
        per_session_base_price: Math.round(selectedPackage.price / (selectedPackage.sessions || 1)),
      });
    }

    const coachName = `${coach.first_name} ${coach.last_name}`;
    const dateStr = format(selectedDate, 'EEEE, MMMM d, yyyy');

    await base44.functions.invoke('sendBookingEmails', {
      clientEmail: user.email,
      clientName: user.full_name || user.email,
      coachEmail: coach.email,
      coachName,
      dateStr,
      time: selectedTime,
      durationLabel: duration.label,
      county,
      sessionGoals,
      origin: window.location.origin,
    });

    setBookedSession(newSession);
    setSubmitting(false);
    setBookingComplete(true);
  };

  if (bookingComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-4">BOOKING CONFIRMED</h1>
          <p className="text-muted-foreground mb-2">
            Your session with {coach.first_name} {coach.last_name} on {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime} is booked.
          </p>
          {sessionPrice && (
            <p className="text-accent font-oswald text-xl font-bold mb-2">Session Total: ${sessionPrice}</p>
          )}
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent. Please complete payment directly with your coach.
          </p>
          <PaymentHandlesDisplay coach={coach} price={sessionPrice} />
          <div className="flex gap-3 justify-center mt-8">
            <Button onClick={() => window.location.href = '/dashboard'} className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase">
              Go to Dashboard
            </Button>
            <Button onClick={() => window.location.href = '/pay'} variant="outline" className="font-oswald tracking-wider uppercase">
              View Receipt
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canProceed = () => {
    switch (step) {
      case 0: return !!county;
      case 1: return !!coach;
      case 2: return !!selectedPackage;
      case 3: return !!selectedDate;
      case 4: return !!selectedTime;
      case 5: return !!duration;
      case 6: return true;
      case 7: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-oswald tracking-widest uppercase text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
            <span className="text-xs font-oswald tracking-widest uppercase text-accent">{STEPS[step]}</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* Step 0: County */}
        {step === 0 && (
          <div>
            <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">SELECT YOUR COUNTY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Oakland', 'Macomb', 'Wayne'].map((c) => (
                <button key={c} onClick={() => setCounty(c)}
                  className={`p-8 rounded-lg border text-center transition-all ${county === c ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/30'}`}>
                  <MapPin className={`w-6 h-6 mx-auto mb-3 ${county === c ? 'text-accent' : 'text-muted-foreground'}`} />
                  <span className="font-oswald text-lg font-bold tracking-wider">{c.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Coach */}
        {step === 1 && (() => {
          const countyCoaches = coaches.filter(c => c.county === county);
          if (countyCoaches.length === 0) return (
            <div>
              <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">YOUR COACH</h2>
              <p className="text-muted-foreground">No coaches available in {county} County at this time.</p>
            </div>
          );
          if (countyCoaches.length === 1 || coach) {
            const displayCoach = coach || countyCoaches[0];
            if (!coach) setCoach(displayCoach);
            return (
              <div>
                <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">YOUR COACH</h2>
                <div className="bg-card border border-accent/30 rounded-lg p-6 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {displayCoach.photo_url ? <img src={displayCoach.photo_url} alt={displayCoach.first_name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wider">{displayCoach.first_name} {displayCoach.last_name}</h3>
                    <p className="text-sm text-accent font-oswald tracking-wider uppercase">{county} County — {displayCoach.is_head_coach ? 'Head Coach' : 'Coach'}</p>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div>
              <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">SELECT YOUR COACH</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {countyCoaches.map((c) => (
                  <button key={c.id} onClick={() => setCoach(c)}
                    className={`p-6 rounded-lg border text-left transition-all flex items-center gap-4 ${coach?.id === c.id ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/30'}`}>
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                      {c.photo_url ? <img src={c.photo_url} alt={c.first_name} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="font-oswald text-lg font-bold tracking-wider">{c.first_name} {c.last_name}</p>
                      {c.is_head_coach && <p className="text-xs text-accent font-oswald tracking-wider uppercase">Head Coach</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Step 2: Package */}
        {step === 2 && (
          <div>
            <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-2">SELECT A PACKAGE</h2>
            <p className="text-muted-foreground text-sm mb-8">Base price is for 1 hour. Longer sessions scale up with a discount applied.</p>

            {/* Existing credits notice */}
            {existingCredit && (
              <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-primary font-oswald tracking-wider text-sm uppercase mb-1">You have existing credits!</p>
                <p className="text-xs text-muted-foreground">
                  You have {existingCredit.total_credits - existingCredit.used_credits} session(s) remaining on your <strong>{existingCredit.package_name}</strong> package.
                </p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => setUseExistingCredit(true)}
                    className={`px-4 py-2 rounded-md border text-xs font-oswald tracking-wide uppercase transition-all ${useExistingCredit ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:border-accent/30'}`}>
                    Use Existing Credits
                  </button>
                  <button onClick={() => setUseExistingCredit(false)}
                    className={`px-4 py-2 rounded-md border text-xs font-oswald tracking-wide uppercase transition-all ${!useExistingCredit ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:border-accent/30'}`}>
                    Buy New Package
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => {
                const perSession = Math.round(pkg.price / (pkg.sessions || 1));
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <button key={pkg.id} onClick={() => setSelectedPackage(pkg)}
                    className={`p-6 rounded-lg border text-left transition-all relative ${isSelected ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/30'}`}>
                    {pkg.badge && (
                      <span className="absolute top-3 right-3 text-xs font-oswald tracking-wide bg-accent text-accent-foreground px-2 py-0.5 rounded">{pkg.badge}</span>
                    )}
                    <Package className={`w-5 h-5 mb-3 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                    <p className="font-oswald text-xl font-bold tracking-wider">{pkg.name.toUpperCase()}</p>
                    <p className="text-2xl font-oswald font-bold text-accent mt-1">${pkg.price}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pkg.sessions > 1 ? `${pkg.sessions} sessions · $${perSession}/session` : '1 session · $' + perSession + '/hr base'}
                    </p>
                    {pkg.description && <p className="text-sm text-muted-foreground mt-3">{pkg.description}</p>}
                    {pkg.includes?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {pkg.includes.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-accent inline-block" />{item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Date */}
        {step === 3 && (
          <div>
            <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">PICK A DATE</h2>
            <div className="flex justify-center">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate}
                disabled={(date) => isBefore(date, startOfDay(new Date())) || isDateBlocked(date)}
                className="rounded-lg border border-border bg-card p-4" />
            </div>
          </div>
        )}

        {/* Step 4: Time */}
        {step === 4 && (
          <div>
            <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">CHOOSE A TIME</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {TIME_SLOTS.map((time) => {
                const taken    = isTimeSlotTaken(time);
                const outside  = isTimeSlotOutsideAvailability(time);
                const disabled = taken || outside;
                return (
                  <button key={time} onClick={() => !disabled && setSelectedTime(time)} disabled={disabled}
                    className={`p-3 rounded-md border text-sm font-oswald tracking-wide transition-all ${disabled ? 'border-border bg-secondary/50 text-muted-foreground/40 line-through cursor-not-allowed' : selectedTime === time ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-card text-foreground hover:border-accent/30'}`}>
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Duration */}
        {step === 5 && (
          <div>
            <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-2">SESSION DURATION</h2>
            <p className="text-muted-foreground text-sm mb-8">Longer sessions get a discount off the hourly base rate.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DURATIONS.map((d) => {
                const price = calcPrice(selectedPackage, d);
                const isSelected = duration?.minutes === d.minutes;
                return (
                  <button key={d.minutes} onClick={() => setDuration(d)}
                    className={`p-6 rounded-lg border text-center transition-all relative ${isSelected ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/30'}`}>
                    {d.discount > 0 && (
                      <span className="absolute top-2 right-2 text-xs font-oswald bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                        -{Math.round(d.discount * 100)}%
                      </span>
                    )}
                    <Timer className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                    <span className="font-oswald text-lg font-bold tracking-wider block">{d.label}</span>
                    {price !== null && (
                      <span className={`text-sm font-oswald font-bold mt-1 block ${isSelected ? 'text-accent' : 'text-muted-foreground'}`}>
                        ${price}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Goals */}
        {step === 6 && (
          <div>
            <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">SESSION GOALS</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {GOAL_TAGS.map((tag) => (
                <button key={tag}
                  onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`px-4 py-2 rounded-full border text-sm font-oswald tracking-wide uppercase transition-all ${selectedTags.includes(tag) ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:border-accent/30'}`}>
                  {tag}
                </button>
              ))}
            </div>
            <Textarea placeholder="Any additional goals or notes for your session..."
              value={goals} onChange={(e) => setGoals(e.target.value)}
              className="bg-card border-border" rows={4} />
          </div>
        )}

        {/* Step 7: Review */}
        {step === 7 && (
          <div>
            <h2 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">REVIEW & CONFIRM</h2>
            <div className="bg-card border border-border rounded-lg p-6 space-y-1">
              {[
                ['County', county],
                ['Coach', `${coach?.first_name} ${coach?.last_name}`],
                ['Package', selectedPackage?.name + (useExistingCredit && existingCredit ? ` (using credit — ${existingCredit.total_credits - existingCredit.used_credits} remaining)` : ' (new purchase)')],
                ['Date', selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')],
                ['Time', selectedTime],
                ['Duration', duration?.label],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground text-sm">{label}</span>
                  <span className="font-oswald tracking-wider text-sm text-right max-w-[60%]">{val}</span>
                </div>
              ))}
              {(selectedTags.length > 0 || goals) && (
                <div className="py-3 border-b border-border">
                  <span className="text-muted-foreground text-sm block mb-2">Goals</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map(t => <Badge key={t} className="bg-accent/10 text-accent border-accent/20">{t}</Badge>)}
                  </div>
                  {goals && <p className="text-sm text-foreground mt-2">{goals}</p>}
                </div>
              )}
              {/* Price Summary */}
              {sessionPrice !== null && (
                <div className="flex justify-between items-center py-4">
                  <span className="font-oswald text-lg font-bold tracking-wider">SESSION TOTAL</span>
                  <span className="font-oswald text-2xl font-bold text-accent">${sessionPrice}</span>
                </div>
              )}
            </div>

            {duration?.discount > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-400 font-oswald tracking-wide">
                  {Math.round(duration.discount * 100)}% multi-hour discount applied
                </p>
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-sm text-accent font-oswald tracking-wide uppercase mb-1">Cancellation Policy</p>
              <p className="text-xs text-muted-foreground">
                Sessions cancelled with less than 24 hours notice may incur a late-cancellation fee at the coach's discretion.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className="font-oswald tracking-wider uppercase">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}
              className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase hover:bg-accent/90">
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            user ? (
              <Button onClick={handleSubmit} disabled={submitting}
                className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase hover:bg-accent/90">
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <Button onClick={handleSubmit} className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase hover:bg-accent/90">
                  Sign In to Confirm
                </Button>
                <p className="text-xs text-muted-foreground">You'll be signed in and returned to confirm</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentHandlesDisplay({ coach, price }) {
  if (!coach) return null;
  const paypalHandle = coach.paypal?.replace(/^(https?:\/\/)?(www\.)?paypal\.me\//, '');
  const paypalUrl = paypalHandle ? `https://paypal.me/${paypalHandle}${price ? '/' + price : ''}` : null;

  const handles = [];
  if (coach.venmo)         handles.push({ name: 'Venmo',    value: coach.venmo,                                link: null });
  if (coach.zelle)         handles.push({ name: 'Zelle',    value: coach.zelle,                                link: null });
  if (coach.cashapp)       handles.push({ name: 'Cash App', value: coach.cashapp,                              link: null });
  if (paypalUrl)           handles.push({ name: 'PayPal',   value: price ? `Pay $${price} via PayPal` : 'Pay via PayPal', link: paypalUrl });
  if (coach.cash_accepted) handles.push({ name: 'Cash',     value: 'Accepted',                                link: null });
  if (handles.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 text-left">
      <p className="text-xs font-oswald tracking-widest uppercase text-muted-foreground mb-3">Payment Methods</p>
      <div className="space-y-2">
        {handles.map(h => (
          <div key={h.name} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{h.name}</span>
            {h.link ? (
              <a href={h.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 font-medium">{h.value}</a>
            ) : (
              <span className="text-foreground font-medium">{h.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}