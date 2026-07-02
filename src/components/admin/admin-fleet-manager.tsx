'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Star, Check, Image as ImageIcon, ExternalLink, GripVertical } from 'lucide-react';
import { type Car, type Category, type Brand, api, parseFeatures, formatAED } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ImageUploader } from './image-uploader';

export function AdminFleetManager({
  cars, categories, brands, token, onChanged,
}: {
  cars: Car[];
  categories: Category[];
  brands: Brand[];
  token: string;
  onChanged: () => void;
}) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Car | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Car | null>(null);

  const filtered = cars.filter(c =>
    !search ||
    c.model.toLowerCase().includes(search.toLowerCase()) ||
    c.brand.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="gold-divider" />
            <span className="uppercase-luxe">Fleet Management</span>
          </div>
          <h1 className="font-serif text-4xl text-ink">{cars.length} Automobile{cars.length !== 1 ? 's' : ''}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-softer" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fleet…"
              className="bg-transparent border-rule text-ink placeholder:text-ink-softer rounded-none pl-10 w-64"
            />
          </div>
          <Button
            onClick={() => setCreating(true)}
            className="bg-brand text-white hover:bg-ivory rounded-none tracking-luxe uppercase text-xs"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Car
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/15 text-left">
                <th className="p-4 text-[0.65rem] uppercase-luxe">Vehicle</th>
                <th className="p-4 text-[0.65rem] uppercase-luxe">Category</th>
                <th className="p-4 text-[0.65rem] uppercase-luxe">Daily</th>
                <th className="p-4 text-[0.65rem] uppercase-luxe">Status</th>
                <th className="p-4 text-[0.65rem] uppercase-luxe">Featured</th>
                <th className="p-4 text-[0.65rem] uppercase-luxe text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(car => (
                <tr key={car.id} className="border-b border-rule hover:bg-brand/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 bg-muted flex-shrink-0 overflow-hidden">
                        <img src={car.heroImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-ink text-sm">{car.brand.name} {car.model}</div>
                        <div className="text-xs text-ink-softer">{car.year} · {car.power}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-ink/70">{car.category.name}</td>
                  <td className="p-4 text-sm text-brand">AED {formatAED(car.priceDaily)}</td>
                  <td className="p-4">
                    <select
                      value={car.status || 'available'}
                      onChange={async (e) => {
                        try {
                          await api.put(`/api/cars/${car.id}`, { status: e.target.value, available: e.target.value === 'available' }, token);
                          toast.success(`Status changed to ${e.target.value}`);
                          onChanged();
                        } catch (err: any) {
                          toast.error(err.message || 'Failed to update status');
                        }
                      }}
                      className={`text-xs px-2 py-1.5 rounded border-0 cursor-pointer font-semibold ${
                        (car.status || 'available') === 'available' ? 'bg-emerald-100 text-emerald-700'
                        : car.status === 'rented' ? 'bg-amber-100 text-amber-700'
                        : car.status === 'maintenance' ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="available">✓ Available</option>
                      <option value="rented">🚗 Rented</option>
                      <option value="maintenance">🔧 Maintenance (hidden)</option>
                      <option value="sold">💰 Sold</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {car.featured ? <Star className="w-4 h-4 text-brand fill-gold" /> : <Star className="w-4 h-4 text-ink/20" />}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`#/car/${car.slug}`}
                        target="_blank"
                        className="p-2 hover:bg-brand/10 text-ink-soft hover:text-brand transition-colors"
                        title="View on site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setEditing(car)}
                        className="p-2 hover:bg-brand/10 text-ink-soft hover:text-brand transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleting(car)}
                        className="p-2 hover:bg-red-100 text-ink-soft hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-ink-softer text-sm">No automobiles match your search.</div>
        )}
      </div>

      {/* Editor / Creator dialog */}
      <AnimatePresence>
        {(editing || creating) && (
          <CarEditor
            car={editing}
            categories={categories}
            brands={brands}
            token={token}
            onClose={() => { setEditing(null); setCreating(false); }}
            onSaved={() => { setEditing(null); setCreating(false); onChanged(); }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="bg-white border-brand/40 text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-2xl">Delete this automobile?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-soft">
              You are about to permanently remove <span className="text-brand">{deleting?.brand.name} {deleting?.model}</span> from the fleet. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-rule text-ink hover:bg-brand/10 rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return;
                try {
                  await api.del(`/api/cars/${deleting.id}`, token);
                  toast.success(`${deleting.brand.name} ${deleting.model} removed.`);
                  setDeleting(null);
                  onChanged();
                } catch (e: any) {
                  toast.error(e.message || 'Failed to delete');
                }
              }}
              className="bg-destructive text-ink hover:bg-destructive/80 rounded-none"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------- Car Editor (used for create & edit) ----------
function CarEditor({
  car, categories, brands, token, onClose, onSaved,
}: {
  car: Car | null;
  categories: Category[];
  brands: Brand[];
  token: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !car;
  const [form, setForm] = useState<any>(() => {
    if (car) {
      return {
        ...car,
        brandId: car.brandId,
        categoryId: car.categoryId,
        features: parseFeatures(car.features).join('\n'),
        images: car.images.map(i => ({ url: i.url, caption: i.caption || '' })),
      };
    }
    return {
      model: '', year: 2024, brandId: brands[0]?.id || '', categoryId: categories[0]?.id || '',
      priceDaily: 1000, priceWeekly: 6000, priceMonthly: 25000,
      engine: '', power: '', topSpeed: '', acceleration: '', transmission: '', seats: 2, fuelType: 'Petrol', drivetrain: 'AWD',
      tagline: '', description: '', features: '',
      color: '', available: true, status: 'available', featured: false,
      mileageLimit: '250 km/day', deposit: 'AED 5,000 refundable',
      heroImage: '', images: [{ url: '', caption: '' }],
    };
  });
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = async () => {
    setSaving(true);
    try {
      const featuresArr = (form.features as string).split('\n').map(s => s.trim()).filter(Boolean);
      const cleanImages = (form.images as any[]).filter(i => i.url);
      const payload: any = {
        ...form,
        features: featuresArr,
        images: cleanImages,
        year: Number(form.year),
        seats: Number(form.seats),
        priceDaily: Number(form.priceDaily),
        priceWeekly: Number(form.priceWeekly),
        priceMonthly: Number(form.priceMonthly),
        heroImage: cleanImages[0]?.url || form.heroImage || '',
      };
      delete payload.brand; delete payload.category; delete payload.createdAt; delete payload.updatedAt; delete payload.id; delete payload.slug;

      if (isNew) {
        await api.post('/api/cars', payload, token);
        toast.success('Automobile added to the fleet.');
      } else {
        await api.put(`/api/cars/${car!.id}`, payload, token);
        toast.success('Automobile updated.');
      }
      onSaved();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateImage = (i: number, k: string, v: string) => {
    const imgs = [...form.images];
    imgs[i] = { ...imgs[i], [k]: v };
    update('images', imgs);
    if (i === 0 && k === 'url') update('heroImage', v);
  };
  const addImage = () => update('images', [...form.images, { url: '', caption: '' }]);
  const removeImage = (i: number) => update('images', form.images.filter((_: any, idx: number) => idx !== i));

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-white border-brand/40 text-ink max-w-4xl max-h-[92vh] overflow-y-auto luxe-scroll rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl text-ink">
            {isNew ? 'Add to Fleet' : `Edit · ${car!.brand.name} ${car!.model}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basics */}
          <Section title="Basics">
            <Field label="Model">
              <Input value={form.model} onChange={e => update('model', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" />
            </Field>
            <Field label="Brand">
              <Select value={form.brandId} onValueChange={v => update('brandId', v)}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-brand/40">
                  {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Category">
              <Select value={form.categoryId} onValueChange={v => update('categoryId', v)}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-brand/40">
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Year">
              <Input type="number" value={form.year} onChange={e => update('year', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" />
            </Field>
          </Section>

          {/* Pricing */}
          <Section title="Pricing (AED)">
            <Field label="Daily"><Input type="number" value={form.priceDaily} onChange={e => update('priceDaily', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Weekly"><Input type="number" value={form.priceWeekly} onChange={e => update('priceWeekly', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Monthly"><Input type="number" value={form.priceMonthly} onChange={e => update('priceMonthly', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Deposit"><Input value={form.deposit} onChange={e => update('deposit', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Mileage Limit"><Input value={form.mileageLimit} onChange={e => update('mileageLimit', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" /></Field>
          </Section>

          {/* Specs */}
          <Section title="Specifications">
            <Field label="Engine"><Input value={form.engine} onChange={e => update('engine', e.target.value)} placeholder="e.g. 5.2L V10" className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Power"><Input value={form.power} onChange={e => update('power', e.target.value)} placeholder="e.g. 631 HP" className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Top Speed"><Input value={form.topSpeed} onChange={e => update('topSpeed', e.target.value)} placeholder="e.g. 325 km/h" className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="0-100"><Input value={form.acceleration} onChange={e => update('acceleration', e.target.value)} placeholder="e.g. 2.9s" className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Transmission"><Input value={form.transmission} onChange={e => update('transmission', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Drivetrain">
              <Select value={form.drivetrain} onValueChange={v => update('drivetrain', v)}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-brand/40">
                  <SelectItem value="AWD">AWD</SelectItem>
                  <SelectItem value="RWD">RWD</SelectItem>
                  <SelectItem value="FWD">FWD</SelectItem>
                  <SelectItem value="4WD">4WD</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Seats"><Input type="number" value={form.seats} onChange={e => update('seats', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" /></Field>
            <Field label="Fuel">
              <Select value={form.fuelType} onValueChange={v => update('fuelType', v)}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-brand/40">
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Section>

          {/* Description */}
          <Section title="Story">
            <div className="col-span-2">
              <Field label="Tagline (one line)">
                <Input value={form.tagline} onChange={e => update('tagline', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Description">
                <Textarea value={form.description} onChange={e => update('description', e.target.value)} className="bg-transparent border-rule text-ink rounded-none min-h-[120px]" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Features (one per line)">
                <Textarea value={form.features} onChange={e => update('features', e.target.value)} className="bg-transparent border-rule text-ink rounded-none min-h-[100px]" placeholder="Naturally Aspirated V10&#10;Rear-Wheel Steering&#10;…" />
              </Field>
            </div>
            <Field label="Color">
              <Input value={form.color} onChange={e => update('color', e.target.value)} className="bg-transparent border-rule text-ink rounded-none" />
            </Field>
          </Section>

          {/* Images — file upload from device only */}
          <Section title="Media (upload from your device)">
            <div className="col-span-2 space-y-3">
              {form.images.map((img: any, i: number) => (
                <ImageUploader
                  key={i}
                  value={img.url}
                  onChange={(url) => updateImage(i, 'url', url)}
                  caption={img.caption}
                  onCaptionChange={(c) => updateImage(i, 'caption', c)}
                  onRemove={() => removeImage(i)}
                  token={token}
                  label={i === 0 ? 'Hero Image (primary card photo)' : `Image ${i + 1}`}
                />
              ))}
              <Button onClick={addImage} variant="outline" className="border-brand/30 text-brand hover:bg-brand/10 rounded-md text-xs uppercase-luxe">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Another Image
              </Button>
              <p className="text-xs text-muted-foreground">Upload JPEG, PNG, or WebP from your device (max 8MB each). The first image becomes the card hero photo.</p>
            </div>
          </Section>

          {/* Status */}
          <Section title="Status & Display">
            <Field label="Car Status">
              <select
                value={form.status || 'available'}
                onChange={e => {
                  update('status', e.target.value);
                  update('available', e.target.value === 'available');
                }}
                className="w-full bg-white border border-rule rounded-md px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand"
              >
                <option value="available">✓ Available (visible & bookable)</option>
                <option value="rented">🚗 Rented (visible, not bookable)</option>
                <option value="maintenance">🔧 Maintenance (hidden from site)</option>
                <option value="sold">💰 Sold (delete when done)</option>
              </select>
            </Field>
            <div className="flex items-center gap-3 col-span-2 pt-2">
              <Switch checked={form.featured} onCheckedChange={v => update('featured', v)} />
              <Label className="text-sm text-ink">Featured on homepage</Label>
            </div>
          </Section>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-rule text-ink hover:bg-brand/10 rounded-none">Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-brand text-white hover:bg-ivory rounded-none tracking-luxe uppercase text-xs">
            {saving ? 'Saving…' : isNew ? 'Add to Fleet' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="uppercase-luxe mb-3 pb-2 border-b border-rule">{title}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[0.65rem] uppercase tracking-wide-2 text-ink-softer mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
