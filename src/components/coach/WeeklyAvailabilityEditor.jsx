import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultDay = () => ({ enabled: false, start: '08:00', end: '20:00' });

export default function WeeklyAvailabilityEditor({ availability = {}, onChange }) {
  const getDay = (day) => availability[day] || defaultDay();

  const updateDay = (day, field, value) => {
    onChange({
      ...availability,
      [day]: { ...getDay(day), [field]: value },
    });
  };

  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const d = getDay(day);
        return (
          <div key={day} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 border border-border">
            <Switch
              checked={d.enabled}
              onCheckedChange={(v) => updateDay(day, 'enabled', v)}
            />
            <span className={`font-oswald tracking-wider text-sm w-24 ${d.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
              {day.toUpperCase()}
            </span>
            {d.enabled ? (
              <div className="flex items-center gap-2 ml-auto">
                <Input
                  type="time"
                  value={d.start}
                  onChange={(e) => updateDay(day, 'start', e.target.value)}
                  className="bg-secondary border-border w-32 text-sm"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  type="time"
                  value={d.end}
                  onChange={(e) => updateDay(day, 'end', e.target.value)}
                  className="bg-secondary border-border w-32 text-sm"
                />
              </div>
            ) : (
              <span className="ml-auto text-xs text-muted-foreground">Unavailable</span>
            )}
          </div>
        );
      })}
    </div>
  );
}