import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const counties = [
  { name: 'Oakland', description: 'North Metro Detroit', color: 'from-primary/20 to-primary/5' },
  { name: 'Macomb', description: 'East Metro Detroit', color: 'from-accent/20 to-accent/5' },
  { name: 'Wayne', description: 'Central Metro Detroit', color: 'from-primary/20 to-accent/5' },
];

export default function CountySelector() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-oswald text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            SELECT YOUR COUNTY
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Each county has a dedicated head coach ready to elevate your game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {counties.map((county) => (
            <Link
              key={county.name}
              to={`/book?county=${county.name}`}
              className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-accent/50 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${county.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-oswald text-2xl font-bold tracking-wider text-foreground mb-2">
                  {county.name.toUpperCase()}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">{county.description}</p>
                <div className="flex items-center justify-center gap-2 text-accent text-sm font-oswald tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Book Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}