import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Mail, Phone, ClipboardList } from 'lucide-react';
import { loadLcfcSettings, toLines } from '@/lib/lcfcSettings';
import { LcfcPage, Card, GoldButton } from '@/components/lcfc/LcfcKit';

export default function LcfcTryouts() {
  const [s, setS] = useState(null);
  useEffect(() => { loadLcfcSettings().then(setS); }, []);

  if (!s) {
    return (
      <LcfcPage title="Tryouts / ID Sessions" subtitle="Earn your place in the competitive side.">
        <div className="h-48 rounded-2xl bg-white border border-[#DDDAD2] animate-pulse" />
      </LcfcPage>
    );
  }

  const dates = toLines(s.tryouts_dates);
  const status = s.tryouts_status || 'coming_soon';
  const open = status === 'open' && dates.length > 0;
  const closed = status === 'closed';

  return (
    <LcfcPage title="Tryouts / ID Sessions" subtitle="Earn your place in the competitive side.">
      <Card className="p-8 md:p-12">
        {!open && !closed && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-[#0078FF]/10 flex items-center justify-center mx-auto mb-5">
              <Calendar className="w-8 h-8 text-[#0078FF]" />
            </div>
            <p className="font-oswald text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#0078FF]">Coming Soon</p>
            <p className="text-[#666666] mt-3">Dates, time, and location will be announced soon.</p>
          </div>
        )}

        {closed && (
          <div className="text-center py-10">
            <p className="font-oswald text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#0078FF]">Tryouts Closed</p>
            <p className="text-[#666666] mt-3">{s.tryouts_notes || 'Tryouts are currently closed. Check back for future opportunities.'}</p>
          </div>
        )}

        {open && (
          <div className="space-y-8">
            <div>
              <p className="font-oswald text-[11px] tracking-[0.25em] uppercase text-[#666666] mb-3">
                {dates.length === 1 ? 'Tryout Date' : 'Tryout Dates'}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dates.map((d, i) => (
                  <div key={i} className="rounded-xl border border-[#DDDAD2] bg-[#F7F7F5] p-5">
                    <p className="font-oswald text-lg font-bold text-[#111111]">{d}</p>
                    {(s.tryouts_start_time || s.tryouts_end_time) && (
                      <p className="text-sm text-[#666666] mt-1">
                        {s.tryouts_start_time}{s.tryouts_end_time ? ` – ${s.tryouts_end_time}` : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 text-sm">
              {s.tryouts_location && (
                <Detail icon={MapPin} label="Location">{s.tryouts_location}</Detail>
              )}
              {s.tryouts_what_to_bring && (
                <Detail icon={ClipboardList} label="What to Bring">{s.tryouts_what_to_bring}</Detail>
              )}
              {s.tryouts_notes && (
                <Detail icon={ClipboardList} label="Instructions">{s.tryouts_notes}</Detail>
              )}
              {s.tryouts_contact_email && (
                <Detail icon={Mail} label="Contact">
                  <a href={`mailto:${s.tryouts_contact_email}`} className="text-[#005DFF] hover:text-[#0078FF]">{s.tryouts_contact_email}</a>
                </Detail>
              )}
              {s.tryouts_contact_phone && (
                <Detail icon={Phone} label="Phone">{s.tryouts_contact_phone}</Detail>
              )}
            </div>

            {s.tryouts_registration_link && (
              <GoldButton href={s.tryouts_registration_link} target="_blank" rel="noreferrer">
                Register Now
              </GoldButton>
            )}
          </div>
        )}
      </Card>
    </LcfcPage>
  );
}

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <Icon className="w-5 h-5 text-[#0078FF] shrink-0 mt-0.5" />
      <div>
        <p className="font-oswald text-[11px] tracking-[0.2em] uppercase text-[#666666]">{label}</p>
        <div className="text-[#2A2A2A] mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
