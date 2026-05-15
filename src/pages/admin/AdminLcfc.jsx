import React, { useEffect, useState } from 'react';
import {
  playerRepo, teamMatchRepo, lcfcStaffRepo, lcfcNewsRepo, lcfcSponsorRepo,
} from '@/api/repo';
import { loadLcfcSettings, saveLcfcSettings, toLines } from '@/lib/lcfcSettings';
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
import { Plus, Pencil, Trash2, Upload, ChevronUp, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog';

const MODULES = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'about', label: 'About LCFC' },
  { value: 'overview', label: "Men's Team Overview" },
  { value: 'roster', label: 'Roster' },
  { value: 'schedule', label: 'Schedule / Results' },
  { value: 'tryouts', label: 'Tryouts Settings' },
  { value: 'staff', label: 'Staff' },
  { value: 'news', label: 'News / Matchday' },
  { value: 'sponsors', label: 'Sponsors' },
];

export default function AdminLcfc() {
  const { isAdmin } = useCurrentUser();
  const [tab, setTab] = useState('hero');
  const [settings, setSettings] = useState(null);

  useEffect(() => { loadLcfcSettings().then(setSettings); }, []);

  if (!isAdmin) return <div className="py-24 text-center text-muted-foreground">Access denied.</div>;

  const patchSettings = (next) => setSettings((prev) => ({ ...prev, ...next }));

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-oswald text-3xl font-bold tracking-tight text-foreground mb-1">LCFC PAGE</h1>
        <p className="text-muted-foreground mb-6">Control every section of the public /lcfc page.</p>

        <div className="flex flex-wrap items-center gap-1 mb-6 border-b border-border">
          {MODULES.map((m) => (
            <button
              key={m.value}
              onClick={() => setTab(m.value)}
              className={`px-4 py-2 text-xs font-oswald tracking-wider uppercase transition-colors border-b-2 -mb-px ${
                tab === m.value ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {!settings ? (
          <div className="h-40 bg-card border border-border rounded-lg animate-pulse" />
        ) : (
          <>
            {tab === 'hero' && <HeroModule settings={settings} onChange={patchSettings} />}
            {tab === 'about' && <AboutModule settings={settings} onChange={patchSettings} />}
            {tab === 'overview' && <OverviewModule settings={settings} onChange={patchSettings} />}
            {tab === 'roster' && <RosterModule settings={settings} onChange={patchSettings} />}
            {tab === 'schedule' && <ScheduleModule settings={settings} onChange={patchSettings} />}
            {tab === 'tryouts' && <TryoutsModule settings={settings} onChange={patchSettings} />}
            {tab === 'staff' && <StaffModule settings={settings} onChange={patchSettings} />}
            {tab === 'news' && <NewsModule settings={settings} onChange={patchSettings} />}
            {tab === 'sponsors' && <SponsorsModule settings={settings} onChange={patchSettings} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */

function ModuleCard({ title, enabled, onToggleEnabled, children }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-oswald text-lg tracking-wider uppercase text-foreground">{title}</h2>
        {onToggleEnabled && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-oswald tracking-widest uppercase text-muted-foreground">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch checked={!!enabled} onCheckedChange={onToggleEnabled} />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, hint }) {
  return (
    <div>
      <Label className="font-oswald tracking-wider uppercase text-xs">{label}</Label>
      <Input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="bg-secondary border-border mt-1"
        placeholder={placeholder}
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function Area({ label, value, onChange, rows = 3, hint }) {
  return (
    <div>
      <Label className="font-oswald tracking-wider uppercase text-xs">{label}</Label>
      <Textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="bg-secondary border-border mt-1"
        rows={rows}
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function ImageField({ label, value, onChange, hint }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await storage.uploadFile('site-content', file);
      onChange(url);
    } catch {
      toast.error('Upload failed. Try a smaller image.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <Label className="font-oswald tracking-wider uppercase text-xs">{label}</Label>
      <label className="mt-1 flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-md p-4 hover:border-accent/50">
        <input type="file" accept="image/*" className="hidden" onChange={upload} />
        <Upload className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </span>
      </label>
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
      {value && <img src={value} alt="" className="mt-3 max-h-40 rounded-md border border-border" />}
    </div>
  );
}

function useSettingsForm(settings, onChange) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(settings); }, [settings]);
  const set = (patch) => setForm((p) => ({ ...p, ...patch }));
  const save = async () => {
    setSaving(true);
    try {
      const id = await saveLcfcSettings(form, form.id);
      onChange({ ...form, id });
      toast.success('Saved');
    } catch (err) {
      toast.error(err?.message || 'Save failed — is the lcfc_settings collection created?');
    } finally {
      setSaving(false);
    }
  };
  return { form, set, save, saving };
}

function SaveBar({ saving, onSave }) {
  return (
    <Button onClick={onSave} disabled={saving} className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase mt-2">
      {saving ? 'Saving…' : 'Save / Update'}
    </Button>
  );
}

/* ---------- settings-backed modules ---------- */

function HeroModule({ settings, onChange }) {
  const { form, set, save, saving } = useSettingsForm(settings, onChange);
  return (
    <ModuleCard title="Hero Banner" enabled={form.hero_enabled} onToggleEnabled={(v) => set({ hero_enabled: v })}>
      <div className="space-y-4">
        <ImageField label="Hero Image" value={form.hero_image_url} onChange={(v) => set({ hero_image_url: v })} hint="Recommended 1920×720" />
        <Field label="Heading" value={form.hero_heading} onChange={(v) => set({ hero_heading: v })} />
        <Field label="Subheading" value={form.hero_subheading} onChange={(v) => set({ hero_subheading: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Button" value={form.hero_primary_text} onChange={(v) => set({ hero_primary_text: v })} />
          <Field label="Primary Link" value={form.hero_primary_link} onChange={(v) => set({ hero_primary_link: v })} />
          <Field label="Secondary Button" value={form.hero_secondary_text} onChange={(v) => set({ hero_secondary_text: v })} />
          <Field label="Secondary Link" value={form.hero_secondary_link} onChange={(v) => set({ hero_secondary_link: v })} />
        </div>
        <SaveBar saving={saving} onSave={save} />
      </div>
    </ModuleCard>
  );
}

function AboutModule({ settings, onChange }) {
  const { form, set, save, saving } = useSettingsForm(settings, onChange);
  return (
    <ModuleCard title="About LCFC" enabled={form.about_enabled} onToggleEnabled={(v) => set({ about_enabled: v })}>
      <div className="space-y-4">
        <Field label="Heading" value={form.about_heading} onChange={(v) => set({ about_heading: v })} />
        <Area label="Paragraph" value={form.about_body} onChange={(v) => set({ about_body: v })} rows={4} />
        <Area label="Quote Banner" value={form.quote_text} onChange={(v) => set({ quote_text: v })} rows={2} hint="One line per row." />
        <SaveBar saving={saving} onSave={save} />
      </div>
    </ModuleCard>
  );
}

function OverviewModule({ settings, onChange }) {
  const { form, set, save, saving } = useSettingsForm(settings, onChange);
  return (
    <ModuleCard title="Men's Team Overview" enabled={form.overview_enabled} onToggleEnabled={(v) => set({ overview_enabled: v })}>
      <div className="space-y-4">
        <Field label="Section Title" value={form.overview_title} onChange={(v) => set({ overview_title: v })} />
        <Area label="Bullet Points" value={form.overview_bullets} onChange={(v) => set({ overview_bullets: v })} rows={6} hint="One bullet per line." />
        <ImageField label="Optional Image" value={form.overview_image_url} onChange={(v) => set({ overview_image_url: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Button Text" value={form.overview_button_text} onChange={(v) => set({ overview_button_text: v })} />
          <Field label="Button Link" value={form.overview_button_link} onChange={(v) => set({ overview_button_link: v })} />
        </div>
        <SaveBar saving={saving} onSave={save} />
      </div>
    </ModuleCard>
  );
}

function TryoutsModule({ settings, onChange }) {
  const { form, set, save, saving } = useSettingsForm(settings, onChange);
  const dates = toLines(form.tryouts_dates);
  const setDate = (i, v) => {
    const next = [...dates];
    next[i] = v;
    set({ tryouts_dates: next.join('\n') });
  };
  const addDate = () => set({ tryouts_dates: [...dates, ''].join('\n') });
  const removeDate = (i) => set({ tryouts_dates: dates.filter((_, idx) => idx !== i).join('\n') });

  return (
    <ModuleCard title="Tryouts Settings" enabled={form.tryouts_published} onToggleEnabled={(v) => set({ tryouts_published: v })}>
      <div className="space-y-4">
        <div>
          <Label className="font-oswald tracking-wider uppercase text-xs">Status</Label>
          <Select value={form.tryouts_status || 'coming_soon'} onValueChange={(v) => set({ tryouts_status: v })}>
            <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="coming_soon">Coming Soon</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-oswald tracking-wider uppercase text-xs">Dates</Label>
          <div className="space-y-2 mt-1">
            {dates.length === 0 && <p className="text-[11px] text-muted-foreground">No dates — public page shows “Coming Soon”.</p>}
            {dates.map((d, i) => (
              <div key={i} className="flex gap-2">
                <Input value={d} onChange={(e) => setDate(i, e.target.value)} className="bg-secondary border-border" placeholder="May 17, 2025" />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeDate(i)}><X className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addDate} className="font-oswald tracking-wider uppercase text-xs">
              <Plus className="w-3 h-3 mr-1" />Add Another Date
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Time" value={form.tryouts_start_time} onChange={(v) => set({ tryouts_start_time: v })} placeholder="6:00 PM" />
          <Field label="End Time" value={form.tryouts_end_time} onChange={(v) => set({ tryouts_end_time: v })} placeholder="8:00 PM" />
        </div>
        <Field label="Location" value={form.tryouts_location} onChange={(v) => set({ tryouts_location: v })} />
        <Field label="Registration Link" value={form.tryouts_registration_link} onChange={(v) => set({ tryouts_registration_link: v })} />
        <Area label="Notes / Instructions" value={form.tryouts_notes} onChange={(v) => set({ tryouts_notes: v })} rows={2} />
        <Area label="What to Bring" value={form.tryouts_what_to_bring} onChange={(v) => set({ tryouts_what_to_bring: v })} rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact Email" value={form.tryouts_contact_email} onChange={(v) => set({ tryouts_contact_email: v })} />
          <Field label="Contact Phone" value={form.tryouts_contact_phone} onChange={(v) => set({ tryouts_contact_phone: v })} />
        </div>
        <div className="bg-accent/10 border border-accent/30 rounded-md p-3 text-[12px] text-muted-foreground">
          Public preview: with no dates entered, the site shows “Coming Soon”. Status “Closed” shows “Tryouts Closed”.
        </div>
        <SaveBar saving={saving} onSave={save} />
      </div>
    </ModuleCard>
  );
}

/* ---------- collection-backed manager ---------- */

function nextOrder(items) {
  return items.reduce((m, i) => Math.max(m, Number(i.display_order) || 0), 0) + 1;
}

function EntityManager({
  title, repo, fields, empty, primary, sectionToggleKey, settings, onChange,
}) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const { confirm, dialog } = useConfirm();

  const load = () =>
    repo.list('display_order').then(setItems).catch(() =>
      repo.list().then(setItems).catch(() => setItems([])),
    );
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const numericKeys = fields.filter((f) => f.type === 'number').map((f) => f.key);

  const save = async () => {
    const data = { ...editing };
    delete data.id; delete data.created_date; delete data.updated_date;
    delete data.$id; delete data.$createdAt; delete data.$updatedAt;
    delete data.$databaseId; delete data.$collectionId; delete data.$permissions;
    for (const k of numericKeys) data[k] = data[k] === '' || data[k] == null ? null : Number(data[k]);
    if (data.display_order == null || data.display_order === '') data.display_order = nextOrder(items);
    try {
      if (editing.id) await repo.update(editing.id, data);
      else await repo.create(data);
      toast.success(`${title} saved`);
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err?.message || 'Save failed — is the collection created in Appwrite?');
    }
  };

  const remove = async (it) => {
    const ok = await confirm({ title: `Delete?`, confirmLabel: 'Delete', variant: 'destructive' });
    if (!ok) return;
    await repo.delete(it.id);
    toast.success('Deleted');
    load();
  };

  const move = async (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx], b = items[target];
    const ao = Number(a.display_order) || idx;
    const bo = Number(b.display_order) || target;
    await repo.update(a.id, { display_order: bo });
    await repo.update(b.id, { display_order: ao });
    load();
  };

  return (
    <ModuleCard
      title={title}
      enabled={sectionToggleKey ? settings[sectionToggleKey] : undefined}
      onToggleEnabled={
        sectionToggleKey
          ? async (v) => {
              onChange({ [sectionToggleKey]: v });
              try { await saveLcfcSettings({ ...settings, [sectionToggleKey]: v }, settings.id); }
              catch { toast.error('Could not save section visibility'); }
            }
          : undefined
      }
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs text-muted-foreground">Use the arrows to set public display order.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...empty })} className="bg-accent text-accent-foreground font-oswald tracking-wider uppercase text-xs">
              <Plus className="w-4 h-4 mr-2" />Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
            <DialogHeader><DialogTitle className="font-oswald tracking-wider">{editing?.id ? `EDIT ${title.toUpperCase()}` : `ADD ${title.toUpperCase()}`}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4 mt-4">
                {fields.map((f) => {
                  const v = editing[f.key];
                  const onV = (val) => setEditing({ ...editing, [f.key]: val });
                  if (f.type === 'image') return <ImageField key={f.key} label={f.label} value={v} onChange={onV} hint={f.hint} />;
                  if (f.type === 'textarea') return <Area key={f.key} label={f.label} value={v} onChange={onV} rows={f.rows || 3} />;
                  if (f.type === 'switch') return (
                    <div key={f.key} className="flex items-center gap-2">
                      <Switch checked={!!v} onCheckedChange={onV} />
                      <Label className="text-sm">{f.label}</Label>
                    </div>
                  );
                  if (f.type === 'select') return (
                    <div key={f.key}>
                      <Label className="font-oswald tracking-wider uppercase text-xs">{f.label}</Label>
                      <Select value={v || ''} onValueChange={onV}>
                        <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          {f.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                  return <Field key={f.key} label={f.label} value={v} onChange={onV} type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} placeholder={f.placeholder} />;
                })}
                <Button onClick={save} className="w-full bg-accent text-accent-foreground font-oswald tracking-wider uppercase">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <div className="border border-dashed border-border rounded-lg py-10 text-center text-sm text-muted-foreground">
            Nothing here yet.
          </div>
        )}
        {items.map((it, idx) => (
          <div key={it.id} className="bg-secondary/40 border border-border rounded-lg p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex flex-col">
                <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-muted-foreground hover:text-accent disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="text-muted-foreground hover:text-accent disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
              </div>
              {(it.photo_url || it.image_url || it.logo_url) && (
                <img src={it.photo_url || it.image_url || it.logo_url} alt="" className="w-10 h-10 rounded object-cover bg-secondary" />
              )}
              <div className="min-w-0">
                <p className="font-oswald tracking-wider text-foreground truncate">{primary(it)}</p>
                <div className="flex gap-1.5 mt-0.5 flex-wrap">
                  {it.is_active === false && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                  {it.is_published === false && it.is_published !== undefined && <Badge variant="secondary" className="text-[10px]">Unpublished</Badge>}
                  {it.is_featured && <Badge variant="outline" className="text-[10px] border-accent text-accent">Featured</Badge>}
                  {it.tier && <Badge variant="outline" className="text-[10px]">{it.tier}</Badge>}
                  {it.status && <Badge variant="outline" className="text-[10px]">{it.status}</Badge>}
                  {it.type && <Badge variant="outline" className="text-[10px]">{it.type}</Badge>}
                </div>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button size="sm" variant="ghost" onClick={() => { setEditing({ ...it }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => remove(it)} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      {dialog}
    </ModuleCard>
  );
}

const POSITIONS = [
  { value: 'GK', label: 'GK' }, { value: 'DEF', label: 'DEF' },
  { value: 'MID', label: 'MID' }, { value: 'FWD', label: 'FWD' },
];

function RosterModule({ settings, onChange }) {
  return (
    <EntityManager
      title="Roster"
      repo={playerRepo}
      settings={settings}
      onChange={onChange}
      sectionToggleKey="roster_enabled"
      empty={{ first_name: '', last_name: '', jersey_number: '', position: '', age: '', hometown: '', bio: '', photo_url: '', is_active: true, display_order: '' }}
      primary={(p) => `${p.first_name} ${p.last_name}`.trim() || 'Player'}
      fields={[
        { key: 'photo_url', label: 'Player Photo', type: 'image', hint: 'Square, ~600×600' },
        { key: 'first_name', label: 'First Name' },
        { key: 'last_name', label: 'Last Name' },
        { key: 'jersey_number', label: 'Jersey #', type: 'number' },
        { key: 'position', label: 'Position', type: 'select', options: POSITIONS },
        { key: 'age', label: 'Age', type: 'number' },
        { key: 'hometown', label: 'Hometown' },
        { key: 'bio', label: 'Bio', type: 'textarea' },
        { key: 'display_order', label: 'Display Order', type: 'number' },
        { key: 'is_active', label: 'Active on roster', type: 'switch' },
      ]}
    />
  );
}

function ScheduleModule({ settings, onChange }) {
  return (
    <EntityManager
      title="Schedule / Results"
      repo={teamMatchRepo}
      settings={settings}
      onChange={onChange}
      sectionToggleKey="schedule_enabled"
      empty={{ opponent: '', match_date: '', match_time: '', location: '', is_home: true, status: 'scheduled', result: '', score: '', ticket_link: '', notes: '', is_active: true, display_order: '' }}
      primary={(m) => `${m.is_home ? 'vs.' : '@'} ${m.opponent || 'Opponent'}`}
      fields={[
        { key: 'opponent', label: 'Opponent' },
        { key: 'match_date', label: 'Date', type: 'date' },
        { key: 'match_time', label: 'Time', placeholder: '7:00 PM' },
        { key: 'location', label: 'Location' },
        { key: 'is_home', label: 'Home match', type: 'switch' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'scheduled', label: 'Scheduled' }, { value: 'final', label: 'Final' },
          { value: 'cancelled', label: 'Cancelled' }, { value: 'postponed', label: 'Postponed' },
        ] },
        { key: 'score', label: 'Score', placeholder: '2-1' },
        { key: 'ticket_link', label: 'Ticket / Event Link' },
        { key: 'notes', label: 'Notes', type: 'textarea', rows: 2 },
        { key: 'display_order', label: 'Display Order', type: 'number' },
        { key: 'is_active', label: 'Active (show on /lcfc)', type: 'switch' },
      ]}
    />
  );
}

function StaffModule({ settings, onChange }) {
  return (
    <EntityManager
      title="Staff"
      repo={lcfcStaffRepo}
      settings={settings}
      onChange={onChange}
      sectionToggleKey="staff_enabled"
      empty={{ name: '', role: '', bio: '', image_url: '', email: '', phone: '', is_active: true, display_order: '' }}
      primary={(m) => m.name || 'Staff'}
      fields={[
        { key: 'image_url', label: 'Staff Photo', type: 'image', hint: 'Square, ~600×600' },
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role / Title' },
        { key: 'bio', label: 'Short Bio', type: 'textarea' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'display_order', label: 'Display Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'switch' },
      ]}
    />
  );
}

function NewsModule({ settings, onChange }) {
  return (
    <EntityManager
      title="News / Matchday"
      repo={lcfcNewsRepo}
      settings={settings}
      onChange={onChange}
      sectionToggleKey="news_enabled"
      empty={{ title: '', date: '', excerpt: '', content: '', image_url: '', button_text: '', button_url: '', type: 'news', is_featured: false, is_published: false, display_order: '' }}
      primary={(n) => n.title || 'Item'}
      fields={[
        { key: 'image_url', label: 'Image', type: 'image', hint: '~1200×675' },
        { key: 'title', label: 'Title' },
        { key: 'date', label: 'Date', placeholder: 'June 14, 2025' },
        { key: 'excerpt', label: 'Short Excerpt', type: 'textarea', rows: 2 },
        { key: 'content', label: 'Full Article', type: 'textarea', rows: 5 },
        { key: 'button_text', label: 'Button Text' },
        { key: 'button_url', label: 'Button / Link URL' },
        { key: 'type', label: 'Type', type: 'select', options: [
          { value: 'news', label: 'News' }, { value: 'matchday', label: 'Matchday' }, { value: 'update', label: 'Update' },
        ] },
        { key: 'is_featured', label: 'Featured (matchday card)', type: 'switch' },
        { key: 'is_published', label: 'Published', type: 'switch' },
        { key: 'display_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}

function SponsorsModule({ settings, onChange }) {
  return (
    <EntityManager
      title="Sponsors"
      repo={lcfcSponsorRepo}
      settings={settings}
      onChange={onChange}
      sectionToggleKey="sponsors_enabled"
      empty={{ name: '', logo_url: '', website_url: '', tier: 'partner', is_active: true, is_published: false, display_order: '' }}
      primary={(s) => s.name || 'Sponsor'}
      fields={[
        { key: 'logo_url', label: 'Sponsor Logo', type: 'image', hint: '~300×150, transparent PNG/SVG' },
        { key: 'name', label: 'Sponsor Name' },
        { key: 'website_url', label: 'Website URL' },
        { key: 'tier', label: 'Tier', type: 'select', options: [
          { value: 'gold', label: 'Gold' }, { value: 'silver', label: 'Silver' },
          { value: 'bronze', label: 'Bronze' }, { value: 'partner', label: 'Partner' },
          { value: 'other', label: 'Other' },
        ] },
        { key: 'display_order', label: 'Display Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'switch' },
        { key: 'is_published', label: 'Published', type: 'switch' },
      ]}
    />
  );
}
