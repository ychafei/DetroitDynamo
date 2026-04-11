import React from 'react';

const testimonials = [
  {
    quote: "LC Training has completely transformed my son's confidence on the field. The one-on-one attention is unlike anything he's gotten from a team setting.",
    name: "Maria T.",
    child: "Parent of a 12-year-old midfielder",
    county: "Oakland County",
  },
  {
    quote: "My daughter went from barely touching the ball to starting on her varsity team — all within one season of training with LC. Worth every penny.",
    name: "James R.",
    child: "Parent of a 15-year-old forward",
    county: "Macomb County",
  },
  {
    quote: "The coach really listens to what your child needs. He tailored every session to address her weak spots and now she's one of the most technical players on her team.",
    name: "Sandra K.",
    child: "Parent of a 10-year-old goalkeeper",
    county: "Wayne County",
  },
  {
    quote: "We tried group camps and clinics before, but nothing compares to private 1-on-1 coaching. My son's touches and positioning improved dramatically in just 8 sessions.",
    name: "Derek M.",
    child: "Parent of a 13-year-old defender",
    county: "Oakland County",
  },
];

export default function ParentTestimonials() {
  return (
    <section className="py-20 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-accent font-oswald tracking-widest uppercase text-sm mb-2">Real Families. Real Results.</p>
          <h2 className="font-oswald text-4xl font-bold tracking-tight text-foreground">WHAT PARENTS ARE SAYING</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Hear from the families who have seen the LC Training difference firsthand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-background border border-border rounded-lg p-6 flex flex-col gap-4 hover:border-accent/30 transition-colors">
              <div className="flex-1">
                <p className="text-muted-foreground leading-relaxed text-sm italic">"{t.quote}"</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-oswald font-bold tracking-wider text-foreground">{t.name}</p>
                <p className="text-xs text-accent mt-0.5">{t.child}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.county}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}