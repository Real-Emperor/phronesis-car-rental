'use client';

import { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { type SiteSettings, api } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function AdminSettings({
  settings, token, onChanged,
}: {
  settings: SiteSettings;
  token: string;
  onChanged: () => void;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const update = (k: keyof SiteSettings, v: string) => setForm({ ...form, [k]: v });

  const save = async () => {
    setSaving(true);
    try {
      const payload: any = { ...form };
      if (newPassword) payload.adminPassword = newPassword;
      delete payload.id;
      await api.put('/api/settings', payload, token);
      toast.success('Settings saved.');
      setNewPassword('');
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="gold-divider" />
          <span className="uppercase-luxe">Site Settings</span>
        </div>
        <h1 className="font-serif text-4xl text-ivory">Tune the Atelier</h1>
        <p className="text-soft text-sm mt-3">All changes are reflected on the public site in real-time.</p>
      </div>

      <div className="space-y-8">
        {/* Brand */}
        <Section title="Brand Identity">
          <Field label="Brand Name">
            <Input value={form.brandName} onChange={e => update('brandName', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" />
          </Field>
          <Field label="Tagline">
            <Input value={form.tagline} onChange={e => update('tagline', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" />
          </Field>
        </Section>

        {/* Hero */}
        <Section title="Homepage Hero">
          <div className="col-span-2">
            <Field label="Hero Headline">
              <Input value={form.heroHeadline} onChange={e => update('heroHeadline', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Hero Subtext">
              <Textarea value={form.heroSubtext} onChange={e => update('heroSubtext', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none min-h-[80px]" />
            </Field>
          </div>
        </Section>

        {/* About */}
        <Section title="About Page">
          <div className="col-span-2">
            <Field label="About Text">
              <Textarea value={form.aboutText} onChange={e => update('aboutText', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none min-h-[160px]" />
            </Field>
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Channels">
          <Field label="Phone"><Input value={form.phone} onChange={e => update('phone', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" /></Field>
          <Field label="WhatsApp"><Input value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" /></Field>
          <Field label="Email"><Input value={form.email} onChange={e => update('email', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" /></Field>
          <Field label="Instagram URL"><Input value={form.instagram} onChange={e => update('instagram', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" /></Field>
          <div className="col-span-2">
            <Field label="Atelier Address"><Input value={form.address} onChange={e => update('address', e.target.value)} className="bg-transparent border-gold/20 text-ivory rounded-none" /></Field>
          </div>
        </Section>

        {/* Security */}
        <Section title="Security">
          <div className="col-span-2">
            <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-1 block">Change Admin Password</Label>
            <div className="flex gap-2">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="bg-transparent border-gold/20 text-ivory rounded-none"
              />
              <Button onClick={() => setShowPassword(!showPassword)} variant="outline" className="border-gold/20 text-ivory rounded-none px-3">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Section>

        {/* Save */}
        <div className="pt-6 border-t border-gold/10 flex justify-end">
          <Button onClick={save} disabled={saving} className="bg-gold text-obsidian hover:bg-ivory rounded-none tracking-luxe uppercase text-xs">
            <Save className="w-3.5 h-3.5 mr-2" /> {saving ? 'Saving…' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <div className="uppercase-luxe mb-4 pb-2 border-b border-gold/10">{title}</div>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
