import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig = {
  pending: { icon: Clock, color: 'bg-accent/10 text-accent border-accent/20' },
  confirmed: { icon: CheckCircle2, color: 'bg-primary/10 text-primary border-primary/20' },
  completed: { icon: CheckCircle2, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  cancelled: { icon: XCircle, color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function AdminBookings() {
  const { isAdmin } = useCurrentUser();
  const [sessions, setSessions] = useState([]);
  const [coaches, setCoaches] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await base44.entities.Session.list('-date');
      setSessions(s);
      const c = await base44.entities.Coach.list();
      const map = {};
      c.forEach(coach => { map[coach.id] = coach; });
      setCoaches(map);
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Session.update(id, { status });
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    toast.success('Status updated');
  };

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter);

  if (!isAdmin) return <div className="py-24 text-center text-muted-foreground">Access denied.</div>;

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground">ALL BOOKINGS</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="space-y-3">
            {filtered.map(session => {
              const coach = coaches[session.coach_id];
              const sc = statusConfig[session.status] || statusConfig.pending;
              const Icon = sc.icon;
              return (
                <div key={session.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-oswald tracking-wider text-foreground">
                        {format(new Date(session.date), 'MMM d, yyyy')} · {session.start_time} · {session.duration_minutes}min
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Client: {session.client_name} ({session.client_email}) · Coach: {coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown'} · {session.county}
                      </p>
                      {session.notes && <p className="text-xs text-muted-foreground mt-0.5 italic">"{session.notes}"</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${sc.color} border text-xs`}><Icon className="w-3 h-3 mr-1" />{session.status}</Badge>
                      <Badge className={session.payment_status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20 border text-xs' : 'bg-muted text-muted-foreground border text-xs'}>
                        {session.payment_status}
                      </Badge>
                      <Select value={session.status} onValueChange={v => updateStatus(session.id, v)}>
                        <SelectTrigger className="w-32 h-7 text-xs bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No bookings found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}