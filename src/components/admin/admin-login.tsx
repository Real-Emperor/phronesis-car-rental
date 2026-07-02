'use client';

import { useState } from 'react';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const r = await api.post<{ token: string }>('/api/admin', { password });
      toast.success('Welcome back to the atelier.');
      onLogin(r.token);
    } catch (e: any) {
      toast.error(e.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1583836863538-91e9f97a8d76?w=1920&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/90 via-obsidian/85 to-obsidian" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => window.location.hash = '/'}
          className="text-xs uppercase-luxe text-soft hover:text-gold mb-8 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Site
        </button>

        <div className="glass-card p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 border border-gold/30 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-gold" />
            </div>
            <div className="font-serif text-3xl text-ivory mb-2">PHRONESIS</div>
            <div className="uppercase-luxe">Management</div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-2 block">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="bg-transparent border-gold/20 text-ivory rounded-none text-center tracking-luxe"
                placeholder="••••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-obsidian hover:bg-ivory rounded-none tracking-luxe uppercase text-xs disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Enter Console'} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold/10 text-center text-xs text-softer">
            Demo password: <span className="text-gold">phronesis2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
