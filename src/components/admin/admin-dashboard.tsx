'use client';

import { motion } from 'framer-motion';
import { Car as CarIcon, CalendarCheck, DollarSign, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { type Car, type Booking, type SiteSettings } from '@/lib/types';

export function AdminDashboard({
  cars, bookings, settings, setTab,
}: {
  cars: Car[];
  bookings: Booking[];
  settings: SiteSettings;
  setTab: (t: any) => void;
}) {
  const pending = bookings.filter(b => b.status === 'pending');
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => {
      const car = cars.find(c => c.id === b.carId);
      if (!car) return sum;
      const price = b.packageType === 'daily' ? car.priceDaily : b.packageType === 'weekly' ? car.priceWeekly : car.priceMonthly;
      return sum + price;
    }, 0);

  const recentBookings = bookings.slice(0, 5);
  const lowAvailCars = cars.filter(c => !c.available);

  const stats = [
    { label: 'Total Fleet',     value: cars.length,                icon: CarIcon,        color: 'text-brand' },
    { label: 'Pending Bookings', value: pending.length,             icon: Clock,          color: 'text-amber-400' },
    { label: 'Confirmed',        value: confirmed.length,           icon: CalendarCheck,  color: 'text-emerald-400' },
    { label: 'Pipeline (AED)',   value: new Intl.NumberFormat('en-AE').format(totalRevenue), icon: DollarSign, color: 'text-brand' },
  ];

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="gold-divider" />
          <span className="uppercase-luxe">Welcome back</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-ink">Atelier Overview</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className={`w-5 h-5 ${s.color}`} />
                <TrendingUp className="w-3 h-3 text-ink/30" />
              </div>
              <div className="font-serif text-3xl text-ink mb-1">{s.value}</div>
              <div className="text-[0.65rem] uppercase-luxe">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="uppercase-luxe">Recent Bookings</div>
            <button onClick={() => setTab('bookings')} className="text-xs text-brand hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <div className="py-12 text-center text-ink-softer text-sm">No bookings yet.</div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(b => {
                const car = cars.find(c => c.id === b.carId);
                return (
                  <div key={b.id} className="flex items-center gap-4 py-3 border-t border-gold/5 first:border-t-0">
                    <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                      <img src={car?.heroImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink truncate">{car?.brand.name} {car?.model}</div>
                      <div className="text-xs text-ink-soft">{b.customerName} · {b.startDate}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xs uppercase-luxe ${b.status === 'pending' ? 'text-amber-400' : b.status === 'confirmed' ? 'text-emerald-400' : 'text-ink-softer'}`}>
                        {b.status}
                      </div>
                      <div className="text-xs text-brand mt-0.5">{b.packageType}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <div className="uppercase-luxe mb-4">Quick Actions</div>
            <div className="space-y-2">
              <button
                onClick={() => setTab('fleet')}
                className="w-full text-left p-3 border border-rule hover:border-brand/40 hover:bg-brand/5 transition-colors text-sm text-ink"
              >
                <CarIcon className="w-4 h-4 inline mr-2 text-brand" />
                Manage Fleet
              </button>
              <button
                onClick={() => setTab('bookings')}
                className="w-full text-left p-3 border border-rule hover:border-brand/40 hover:bg-brand/5 transition-colors text-sm text-ink"
              >
                <CalendarCheck className="w-4 h-4 inline mr-2 text-brand" />
                Review Bookings
              </button>
              <button
                onClick={() => setTab('settings')}
                className="w-full text-left p-3 border border-rule hover:border-brand/40 hover:bg-brand/5 transition-colors text-sm text-ink"
              >
                <DollarSign className="w-4 h-4 inline mr-2 text-brand" />
                Edit Settings
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="uppercase-luxe mb-4">Currently Reserved</div>
            {lowAvailCars.length === 0 ? (
              <div className="text-sm text-ink-softer">All cars available.</div>
            ) : (
              <div className="space-y-2">
                {lowAvailCars.map(c => (
                  <div key={c.id} className="text-sm text-ink/70">
                    <span className="text-brand">●</span> {c.brand.name} {c.model}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
