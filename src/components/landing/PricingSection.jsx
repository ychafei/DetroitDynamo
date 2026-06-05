import React, { useEffect, useState } from 'react';
import { pricingPackageRepo } from '@/api/repo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingSection() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    pricingPackageRepo
      .filter({ is_visible: true }, 'display_order')
      .then((nextPackages) => {
        if (!cancelled) setPackages(nextPackages);
      })
      .catch(() => {
        if (!cancelled) setPackages([]);
      });
    return () => { cancelled = true; };
  }, []);

  if (packages.length === 0) return null;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-oswald text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            TRAINING PACKAGES
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Invest in your development with flexible pricing options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isFeatured = pkg.badge?.toLowerCase().includes('popular');
            return (
              <div
                key={pkg.id}
                className={`relative rounded-lg border p-8 transition-all duration-300 ${
                  isFeatured
                    ? 'border-accent bg-accent/5 scale-[1.02]'
                    : 'border-border bg-card hover:border-accent/30'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-accent text-accent-foreground text-xs font-oswald tracking-wider uppercase px-3 py-1 rounded-full">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <h3 className="font-oswald text-lg font-bold tracking-wider text-foreground uppercase mb-2">
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>
                )}

                <div className="mb-6">
                  <span className="font-oswald text-4xl font-bold text-foreground">${pkg.price}</span>
                  {pkg.sessions && (
                    <span className="text-muted-foreground text-sm ml-2">/ {pkg.sessions} session{pkg.sessions > 1 ? 's' : ''}</span>
                  )}
                </div>

                {pkg.includes?.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <Link to="/book">
                  <Button
                    className={`w-full font-oswald tracking-wider uppercase ${
                      isFeatured
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
