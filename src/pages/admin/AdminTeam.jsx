import React, { useEffect, useState } from 'react';
import { playerRepo, teamMatchRepo, galleryItemRepo } from '@/api/repo';
import { storage } from '@/lib/storage';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useConfirm } from '@/components/ui/confirm-dialog';

const TABS = [
  { value: 'roster', label: 'Roster' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'gallery', label: 'Gallery' },
];

const EMPTY_PLAYER = {
  first_name: '', last_name: '', jersey_number: '', position: '',
  age: '', bio: '', photo_url: '', is_active: true,
};

const EMPTY_MATCH = {
  opponent: '', match_date: '', match_time: '', location: '',
  is_home: true, result: '', notes: '',
};

const EMPTY_GALLERY = { caption: '', media_url: '', media_type: 'image' };

export default function AdminTeam() {
  const { isAdmin } = useCurrentUser();
  const [tab, setTab] = useState('roster');

  if (!isAdmin) return <div className="py-24 text-center text-muted-foreground">Access denied.</div>;

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-6">MANAGE TEAM</h1>

        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 text-xs font-oswald tracking-wider uppercase transition-colors border-b-2 -mb-px ${
                tab === t.value ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'roster' && <RosterTab />}
        {tab === 'schedule' && <ScheduleTab />}
        {tab === 'gallery' && <GalleryTab />}
      </div>
    </div>
  );
}

function RosterTab() {
  const [players, setPlayers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = () => playerRepo.list('jersey_number').then(setPlayers);
  useEffect(() => { load(); }, []);

  const save = async () => {
    const data = { ...editing, jersey_number: editing.jersey_number === '' ? null : Number(editing.jersey_number), age: editing.age === '' ? null : Number(editing.age) };
    if (editing.id) await playerRepo.update(editing.id, data);
    else await playerRepo.create(data);
    toast.success('Player saved');
    setOpen(false);
    load();
  };

  const remove = async (p) => {
    const ok = await confirm({
      title: 'Delete player?',
      description: `This will remove ${p.first_name} ${p.last_name} from the roster.`,
      confirmLabel: 'Delete',
      variant: 'destructive',
    });
    if (!ok) return;
    await playerRepo.delete(p.id);
    toast.success('Player deleted');
    load();
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { url } = await storage.uploadFile('coach-photos', file);
    setEditing(prev => ({ ...prev, photo_url: url }));
    setUploading(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...EMPTY_PLAYER })} className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase text-xs">
              <Plus className="w-4 h-4 mr-2" />Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
            <DialogHeader><DialogTitle className="font-oswald tracking-wider">{editing?.id ? 'EDIT PLAYER' : 'ADD PLAYER'}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center">
                    {editing.photo_url ? (
                      <img src={editing.photo_url} alt="Player" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-oswald text-xl text-muted-foreground/40">{editing.first_name?.[0]}{editing.last_name?.[0]}</span>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
                    <Button type="button" variant="outline" size="sm" className="font-oswald tracking-wider uppercase text-xs pointer-events-none">
                      <Upload className="w-3 h-3 mr-1" />{uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" value={editing.first_name} onChange={v => setEditing({ ...editing, first_name: v })} />
                  <Field label="Last Name" value={editing.last_name} onChange={v => setEditing({ ...editing, last_name: v })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Jersey #" type="number" value={editing.jersey_number} onChange={v => setEditing({ ...editing, jersey_number: v })} />
                  <Field label="Age" type="number" value={editing.age} onChange={v => setEditing({ ...editing, age: v })} />
                  <div>
                    <Label className="font-oswald tracking-wider uppercase text-xs">Position</Label>
                    <Select value={editing.position || ''} onValueChange={v => setEditing({ ...editing, position: v })}>
                      <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GK">GK</SelectItem>
                        <SelectItem value="DEF">DEF</SelectItem>
                        <SelectItem value="MID">MID</SelectItem>
                        <SelectItem value="FWD">FWD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="font-oswald tracking-wider uppercase text-xs">Bio</Label>
                  <Textarea value={editing.bio || ''} onChange={e => setEditing({ ...editing, bio: e.target.value })} className="bg-secondary border-border mt-1" rows={3} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_active} onCheckedChange={v => setEditing({ ...editing, is_active: v })} />
                  <Label className="text-sm">Active on roster</Label>
                </div>
                <Button onClick={save} className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {players.length === 0 && <EmptyState message="No players on the roster yet." />}
        {players.map(p => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                {p.photo_url ? <img src={p.photo_url} alt="" className="w-full h-full object-cover" /> : <span className="font-oswald text-sm text-muted-foreground">#{p.jersey_number || '?'}</span>}
              </div>
              <div>
                <p className="font-oswald tracking-wider text-foreground">{p.first_name} {p.last_name}</p>
                <div className="flex gap-2 mt-0.5">
                  {p.position && <Badge variant="outline" className="text-[10px]">{p.position}</Badge>}
                  {p.jersey_number != null && <span className="text-xs text-accent">#{p.jersey_number}</span>}
                  {!p.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing({ ...p }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => remove(p)} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      {dialog}
    </div>
  );
}

function ScheduleTab() {
  const [matches, setMatches] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = () => teamMatchRepo.list('match_date').then(setMatches);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing.id) await teamMatchRepo.update(editing.id, editing);
    else await teamMatchRepo.create(editing);
    toast.success('Match saved');
    setOpen(false);
    load();
  };

  const remove = async (m) => {
    const ok = await confirm({ title: 'Delete match?', description: `vs ${m.opponent} on ${m.match_date}`, confirmLabel: 'Delete', variant: 'destructive' });
    if (!ok) return;
    await teamMatchRepo.delete(m.id);
    toast.success('Match deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...EMPTY_MATCH })} className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase text-xs">
              <Plus className="w-4 h-4 mr-2" />Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
            <DialogHeader><DialogTitle className="font-oswald tracking-wider">{editing?.id ? 'EDIT MATCH' : 'ADD MATCH'}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4 mt-4">
                <Field label="Opponent" value={editing.opponent} onChange={v => setEditing({ ...editing, opponent: v })} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date" type="date" value={editing.match_date} onChange={v => setEditing({ ...editing, match_date: v })} />
                  <Field label="Time" value={editing.match_time} onChange={v => setEditing({ ...editing, match_time: v })} placeholder="7:00 PM" />
                </div>
                <Field label="Location" value={editing.location} onChange={v => setEditing({ ...editing, location: v })} />
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_home} onCheckedChange={v => setEditing({ ...editing, is_home: v })} />
                  <Label className="text-sm">Home match</Label>
                </div>
                <div>
                  <Label className="font-oswald tracking-wider uppercase text-xs">Result</Label>
                  <Select value={editing.result || ''} onValueChange={v => setEditing({ ...editing, result: v })}>
                    <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="W">Win</SelectItem>
                      <SelectItem value="L">Loss</SelectItem>
                      <SelectItem value="D">Draw</SelectItem>
                      <SelectItem value="TBA">TBA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-oswald tracking-wider uppercase text-xs">Notes</Label>
                  <Textarea value={editing.notes || ''} onChange={e => setEditing({ ...editing, notes: e.target.value })} className="bg-secondary border-border mt-1" rows={2} />
                </div>
                <Button onClick={save} className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {matches.length === 0 && <EmptyState message="No matches scheduled yet." />}
        {matches.map(m => (
          <div key={m.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-oswald tracking-wider text-foreground">{m.is_home ? 'vs.' : 'at'} {m.opponent}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {m.match_date && format(new Date(m.match_date), 'MMM d, yyyy')} {m.match_time && `· ${m.match_time}`} {m.location && `· ${m.location}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {m.result && <Badge variant="outline" className="text-[10px]">{m.result}</Badge>}
              <Button size="sm" variant="ghost" onClick={() => { setEditing({ ...m }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => remove(m)} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      {dialog}
    </div>
  );
}

function GalleryTab() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = () => galleryItemRepo.list('-created_date').then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing.id) await galleryItemRepo.update(editing.id, editing);
    else await galleryItemRepo.create(editing);
    toast.success('Gallery item saved');
    setOpen(false);
    load();
  };

  const remove = async (item) => {
    const ok = await confirm({ title: 'Delete item?', confirmLabel: 'Delete', variant: 'destructive' });
    if (!ok) return;
    await galleryItemRepo.delete(item.id);
    toast.success('Item deleted');
    load();
  };

  const uploadMedia = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { url } = await storage.uploadFile('site-content', file);
    setEditing(prev => ({ ...prev, media_url: url }));
    setUploading(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...EMPTY_GALLERY })} className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase text-xs">
              <Plus className="w-4 h-4 mr-2" />Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-oswald tracking-wider">{editing?.id ? 'EDIT ITEM' : 'ADD GALLERY ITEM'}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="font-oswald tracking-wider uppercase text-xs">Media</Label>
                  <label className="mt-1 flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-md p-4 hover:border-accent/50">
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={uploadMedia} />
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{uploading ? 'Uploading…' : editing.media_url ? 'Replace media' : 'Upload image or video'}</span>
                  </label>
                  {editing.media_url && <img src={editing.media_url} alt="" className="mt-3 max-h-40 rounded-md" />}
                </div>
                <Field label="Caption" value={editing.caption} onChange={v => setEditing({ ...editing, caption: v })} />
                <Button onClick={save} className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <EmptyState message="No gallery items yet." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden group relative">
              <div className="aspect-square">
                {item.media_url && <img src={item.media_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing({ ...item }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => remove(item)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {dialog}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <Label className="font-oswald tracking-wider uppercase text-xs">{label}</Label>
      <Input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="bg-secondary border-border mt-1"
        placeholder={placeholder}
      />
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="border border-dashed border-border rounded-lg py-12 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
