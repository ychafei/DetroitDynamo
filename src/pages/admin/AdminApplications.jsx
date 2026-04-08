import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusColor = {
  pending: 'bg-accent/10 text-accent border-accent/20',
  reviewed: 'bg-primary/10 text-primary border-primary/20',
  accepted: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function AdminApplications() {
  const { isAdmin } = useCurrentUser();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.CoachApplication.list('-created_date').then(data => { setApps(data); setLoading(false); });
  }, []);

  const update = async (id, status) => {
    await base44.entities.CoachApplication.update(id, { status });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success('Status updated');
  };

  if (!isAdmin) return <div className="py-24 text-center text-muted-foreground">Access denied.</div>;

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-8">COACH APPLICATIONS</h1>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="space-y-4">
            {apps.map(app => (
              <div key={app.id} className="bg-card border border-border rounded-lg p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-oswald tracking-wider text-foreground text-lg">{app.first_name} {app.last_name}</p>
                    <p className="text-xs text-muted-foreground">{app.email} · {app.phone} · {app.county}</p>
                    {app.dob && <p className="text-xs text-muted-foreground">DOB: {format(new Date(app.dob), 'MMM d, yyyy')}</p>}
                    {app.coaching_background && <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{app.coaching_background}</p>}
                    {app.resume_url && (
                      <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-xs text-accent underline mt-2 inline-block">View Resume</a>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Background check: {app.background_check_consent ? '✓ Consented' : '✗ Not consented'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusColor[app.status] || statusColor.pending} border text-xs`}>{app.status}</Badge>
                    <Select value={app.status} onValueChange={v => update(app.id, v)}>
                      <SelectTrigger className="w-32 h-7 text-xs bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            {apps.length === 0 && <p className="text-center text-muted-foreground py-8">No applications yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}