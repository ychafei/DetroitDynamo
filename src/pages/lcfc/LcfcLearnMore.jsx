import React, { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { loadLcfcSettings, toLines } from '@/lib/lcfcSettings';
import { LcfcPage, Card, CardTitle } from '@/components/lcfc/LcfcKit';

export default function LcfcLearnMore() {
  const [s, setS] = useState(null);
  useEffect(() => { loadLcfcSettings().then(setS); }, []);

  const aboutBody = s?.about_body
    || 'Detroit Dynamo FC is the competitive men’s team division of Detroit Dynamo. Detroit Dynamo develops players through private and small-group training, while Detroit Dynamo FC gives committed players a platform to compete in a serious team environment.';
  const quoteLines = toLines(
    s?.quote_text || 'Detroit Dynamo develops the player.\nDetroit Dynamo FC gives the player a platform to compete.',
  );

  return (
    <LcfcPage title="Learn More" subtitle="One club, two connected identities.">
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        <Card className="p-8 lg:p-10 flex flex-col">
          <CardTitle>About Detroit Dynamo FC</CardTitle>
          <p className="text-[#2A2A2A] leading-relaxed">{aboutBody}</p>
        </Card>

        <div className="relative rounded-2xl overflow-hidden bg-[#050505] p-10 flex flex-col justify-center min-h-[240px]">
          <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 85% 15%, rgba(0,120,255,0.18), transparent 55%)' }} />
          <div className="absolute top-5 left-5 right-5 h-px bg-[#0078FF]/40" />
          <div className="absolute bottom-5 left-5 right-5 h-px bg-[#0078FF]/40" />
          <Quote className="w-12 h-12 text-[#0078FF] mb-4" />
          {quoteLines.map((line, i) => (
            <p key={i} className="font-oswald text-2xl md:text-[28px] leading-snug tracking-wide text-[#0078FF]">{line}</p>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-6">
        <Card className="p-8">
          <CardTitle sub="Development">Detroit Dynamo</CardTitle>
          <p className="text-[#2A2A2A] leading-relaxed">
            Detroit Dynamo is for development - private and small-group sessions, coaching,
            and structured programs focused on building the individual player.
          </p>
        </Card>
        <Card className="p-8">
          <CardTitle sub="Competition">Detroit Dynamo FC</CardTitle>
          <p className="text-[#2A2A2A] leading-relaxed">
            Detroit Dynamo FC is for competition - a serious men's team environment for committed
            players who want to test their development in a real club setting.
          </p>
        </Card>
      </div>
    </LcfcPage>
  );
}
