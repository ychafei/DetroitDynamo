import React from 'react';

const stats = [
  { label: 'Sessions Delivered', value: '500+' },
  { label: 'Expert Coaches', value: '3' },
  { label: 'Counties Served', value: '3' },
  { label: 'Success Rate', value: '100%' },
];

export default function StatsRow() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`py-8 px-6 text-center ${i < stats.length - 1 ? 'border-r border-border' : ''}`}>
              <div className="font-oswald text-3xl sm:text-4xl font-bold text-accent tracking-tight">{stat.value}</div>
              <div className="text-xs font-oswald tracking-widest uppercase text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}