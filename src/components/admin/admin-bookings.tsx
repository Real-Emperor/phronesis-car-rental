'use client';

import { useState } from 'react';
import { CalendarCheck, Mail, Phone, User, Calendar, MessageSquare } from 'lucide-react';
import { type Booking, type Car, api } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function AdminBookings({
  bookings, token, onChanged,
}: {
  bookings: Booking[];
  token: string;
  onChanged: () => void;
}) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch('/api/bookings', { id, status }, token);
      toast.success(`Booking ${status}.`);
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update');
    }
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="gold-divider" />
            <span className="uppercase-luxe">Reservations</span>
          </div>
          <h1 className="font-serif text-4xl text-ink">{bookings.length} Booking{bookings.length !== 1 ? 's' : ''}</h1>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="bg-transparent border-rule text-ink rounded-none w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-muted border-brand/40">
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card py-24 text-center">
          <CalendarCheck className="w-10 h-10 text-ink/20 mx-auto mb-4" />
          <div className="text-ink-soft">No bookings yet.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="glass-card p-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Car */}
                <div className="lg:col-span-4 flex items-center gap-3">
                  <div className="w-16 h-12 bg-muted overflow-hidden flex-shrink-0">
                    {b.car && <img src={b.car.heroImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <div className="text-ink text-sm">{b.car?.brand.name} {b.car?.model}</div>
                    <div className="text-xs text-brand capitalize">{b.packageType} · AED {b.car && new Intl.NumberFormat('en-AE').format(b.packageType === 'daily' ? b.car.priceDaily : b.packageType === 'weekly' ? b.car.priceWeekly : b.car.priceMonthly)}</div>
                  </div>
                </div>

                {/* Customer */}
                <div className="lg:col-span-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-ink/70"><User className="w-3 h-3 text-brand" /> {b.customerName}</div>
                  <div className="flex items-center gap-2 text-ink/70"><Phone className="w-3 h-3 text-brand" /> {b.phone}</div>
                  {b.email && <div className="flex items-center gap-2 text-ink/70"><Mail className="w-3 h-3 text-brand" /> {b.email}</div>}
                </div>

                {/* Dates */}
                <div className="lg:col-span-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-ink/70"><Calendar className="w-3 h-3 text-brand" /> {b.startDate}</div>
                  <div className="flex items-center gap-2 text-ink/70"><Calendar className="w-3 h-3 text-brand" /> {b.endDate}</div>
                </div>

                {/* Status */}
                <div className="lg:col-span-3 flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 border ${statusColor[b.status] || 'border-rule text-ink'}`}>
                    {b.status}
                  </span>
                  <Select value={b.status} onValueChange={v => updateStatus(b.id, v)}>
                    <SelectTrigger className="bg-transparent border-rule text-ink rounded-none w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-muted border-brand/40">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirm</SelectItem>
                      <SelectItem value="completed">Complete</SelectItem>
                      <SelectItem value="cancelled">Cancel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {b.notes && (
                <div className="mt-4 pt-4 border-t border-rule flex items-start gap-2 text-sm text-ink-soft">
                  <MessageSquare className="w-3.5 h-3.5 text-brand flex-shrink-0 mt-0.5" />
                  <span>{b.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
