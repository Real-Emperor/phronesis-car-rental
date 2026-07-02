'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LayoutDashboard, Car as CarIcon, CalendarCheck, Settings, LogOut, Menu, X, Plus, ExternalLink } from 'lucide-react';
import { type Car, type Category, type Brand, type Booking, type SiteSettings, api } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AdminLogin } from './admin-login';
import { AdminDashboard } from './admin-dashboard';
import { AdminFleetManager } from './admin-fleet-manager';
import { AdminBookings } from './admin-bookings';
import { AdminSettings } from './admin-settings';

type Tab = 'dashboard' | 'fleet' | 'bookings' | 'settings';

export function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Restore token from session
  useEffect(() => {
    const t = sessionStorage.getItem('phronesis-admin-token');
    if (t) setToken(t);
  }, []);

  const loadData = useCallback(async (tok?: string) => {
    const t = tok || token;
    if (!t) return;
    setLoading(true);
    try {
      const [carsRes, catsRes, brandsRes, bookingsRes, settingsRes] = await Promise.all([
        api.get<{ cars: Car[] }>('/api/cars'),
        api.get<{ categories: Category[] }>('/api/categories'),
        api.get<{ brands: Brand[] }>('/api/brands'),
        fetch('/api/bookings', { headers: { 'x-admin-token': t } }).then(r => r.json()),
        api.get<{ settings: SiteSettings }>('/api/settings'),
      ]);
      setCars(carsRes.cars);
      setCategories(catsRes.categories);
      setBrands(brandsRes.brands);
      setBookings((bookingsRes as any).bookings || []);
      setSettings(settingsRes.settings || null);
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadData(token);
  }, [token, loadData]);

  const onLogin = (tok: string) => {
    sessionStorage.setItem('phronesis-admin-token', tok);
    setToken(tok);
  };

  const onLogout = () => {
    sessionStorage.removeItem('phronesis-admin-token');
    setToken(null);
    window.location.hash = '/';
  };

  const viewSite = () => {
    window.location.hash = '/';
    // Trigger refresh on the public site
    setTimeout(() => window.dispatchEvent(new Event('phronesis:refresh')), 100);
  };

  if (!token) return <AdminLogin onLogin={onLogin} />;

  const navItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet'     as Tab, label: 'Fleet',     icon: CarIcon,        badge: cars.length },
    { id: 'bookings'  as Tab, label: 'Bookings',  icon: CalendarCheck,  badge: bookings.filter(b => b.status === 'pending').length },
    { id: 'settings'  as Tab, label: 'Settings',  icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted text-ink flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-rule flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-rule">
          <div className="font-serif text-2xl text-ink">PHRONESIS</div>
          <div className="text-[0.6rem] uppercase-luxe mt-1">Management</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors ${
                  active ? 'bg-brand/10 text-brand border-l-2 border-gold' : 'text-ink-soft hover:text-ink hover:bg-brand/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="uppercase tracking-wide-2 text-xs">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[0.65rem] px-2 py-0.5 ${active ? 'bg-brand text-white' : 'bg-gold/20 text-brand'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-rule space-y-2">
          <button
            onClick={viewSite}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase-luxe text-ink-soft hover:text-brand transition-colors border border-rule hover:border-brand/40"
          >
            <ExternalLink className="w-3 h-3" /> View Site
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase-luxe text-ink-soft hover:text-red-600 transition-colors border border-rule hover:border-red-300"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-muted/80 z-30 md:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-rule p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-ink">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-serif text-lg text-ink">PHRONESIS Admin</div>
          <div className="w-5" />
        </div>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          {loading ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-brand uppercase-luxe animate-pulse">Loading console…</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {tab === 'dashboard' && (
                  <AdminDashboard cars={cars} bookings={bookings} settings={settings!} setTab={setTab} />
                )}
                {tab === 'fleet' && (
                  <AdminFleetManager
                    cars={cars}
                    categories={categories}
                    brands={brands}
                    token={token}
                    onChanged={() => loadData(token)}
                  />
                )}
                {tab === 'bookings' && (
                  <AdminBookings bookings={bookings} token={token} onChanged={() => loadData(token)} />
                )}
                {tab === 'settings' && (
                  <AdminSettings settings={settings!} token={token} onChanged={() => loadData(token)} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
