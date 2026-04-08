import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const emptyCoach = { first_name: '', last_name: '', email: '', phone: '', county: '', training_area: '', bio: '', quote: '', specializations: [], is_active: true, is_head_coach: false, venmo: '', zelle: '', cashapp: '', paypal: '', cash_accepted: false };

export default function AdminCoaches() {
  const { isAdmin } = useCurrentUser();
  const [coaches, setCoaches] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [specInput, setSpecInput] = useState('');

  useEffect(() => { loadCoaches(); }, []);
  const loadCoaches = () => base44.entities.Coach.list('display_order').then(setCoaches);

  const save = async () => {
    if (editing.id) {
      await base44.entities.Coach.update(editing.id, editing);
    } else {
      await base44.entities.Coach.create(editing);
    }
    toast.success('Coach saved');
    setOpen(false);
    loadCoaches();
  };

  const addSpec = () => {
    if (specInput.trim()) {
      setEditing({ ...editing, specializations: [...(editing.specializations || []), specInput.trim()] });
      setSpecInput('');
    }
  };

  if (!isAdmin) return <div className="py-24 text-center text-muted-foreground">Access denied.</div>;

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground">MANAGE COACHES</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({...emptyCoach})} className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase text-xs hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Add Coach
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto bg-card border-border">
              <DialogHeader><DialogTitle className="font-oswald tracking-wider">{editing?.id ? 'EDIT COACH' : 'ADD COACH'}</DialogTitle></DialogHeader>
              {editing && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-oswald tracking-wider uppercase text-xs">First Name</Label>
                      <Input value={editing.first_name} onChange={e => setEditing({...editing, first_name: e.target.value})} className="bg-secondary border-border mt-1" />
                    </div>
                    <div>
                      <Label className="font-oswald tracking-wider uppercase text-xs">Last Name</Label>
                      <Input value={editing.last_name} onChange={e => setEditing({...editing, last_name: e.target.value})} className="bg-secondary border-border mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-oswald tracking-wider uppercase text-xs">Email</Label>
                      <Input value={editing.email} onChange={e => setEditing({...editing, email: e.target.value})} className="bg-secondary border-border mt-1" />
                    </div>
                    <div>
                      <Label className="font-oswald tracking-wider uppercase text-xs">Phone</Label>
                      <Input value={editing.phone} onChange={e => setEditing({...editing, phone: e.target.value})} className="bg-secondary border-border mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="font-oswald tracking-wider uppercase text-xs">County</Label>
                    <Select value={editing.county} onValueChange={v => setEditing({...editing, county: v})}>
                      <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oakland">Oakland</SelectItem>
                        <SelectItem value="Macomb">Macomb</SelectItem>
                        <SelectItem value="Wayne">Wayne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-oswald tracking-wider uppercase text-xs">Training Area</Label>
                    <Input value={editing.training_area || ''} onChange={e => setEditing({...editing, training_area: e.target.value})} className="bg-secondary border-border mt-1" />
                  </div>
                  <div>
                    <Label className="font-oswald tracking-wider uppercase text-xs">Bio</Label>
                    <Textarea value={editing.bio || ''} onChange={e => setEditing({...editing, bio: e.target.value})} className="bg-secondary border-border mt-1" rows={3} />
                  </div>
                  <div>
                    <Label className="font-oswald tracking-wider uppercase text-xs">Quote</Label>
                    <Input value={editing.quote || ''} onChange={e => setEditing({...editing, quote: e.target.value})} className="bg-secondary border-border mt-1" />
                  </div>
                  <div>
                    <Label className="font-oswald tracking-wider uppercase text-xs">Specializations</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={specInput} onChange={e => setSpecInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())} className="bg-secondary border-border" placeholder="Add specialization" />
                      <Button type="button" onClick={addSpec} variant="outline" size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {editing.specializations?.map((s, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setEditing({...editing, specializations: editing.specializations.filter((_, idx) => idx !== i)})}>{s} ×</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-oswald tracking-wider uppercase text-xs">Venmo</Label>
                      <Input value={editing.venmo || ''} onChange={e => setEditing({...editing, venmo: e.target.value})} className="bg-secondary border-border mt-1" />
                    </div>
                    <div>
                      <Label className="font-oswald tracking-wider uppercase text-xs">Zelle</Label>
                      <Input value={editing.zelle || ''} onChange={e => setEditing({...editing, zelle: e.target.value})} className="bg-secondary border-border mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2"><Switch checked={editing.is_active} onCheckedChange={v => setEditing({...editing, is_active: v})} /><Label className="text-sm">Active</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={editing.is_head_coach} onCheckedChange={v => setEditing({...editing, is_head_coach: v})} /><Label className="text-sm">Head Coach</Label></div>
                  </div>
                  <Button onClick={save} className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase hover:bg-accent/90">Save Coach</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {coaches.map(coach => (
            <div key={coach.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-oswald text-sm text-muted-foreground">{coach.first_name?.[0]}{coach.last_name?.[0]}</span>
                </div>
                <div>
                  <p className="font-oswald tracking-wider text-foreground">{coach.first_name} {coach.last_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-accent flex items-center gap-1"><MapPin className="w-3 h-3" />{coach.county}</span>
                    {coach.is_head_coach && <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">Head Coach</Badge>}
                    {!coach.is_active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => { setEditing({...coach}); setOpen(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}