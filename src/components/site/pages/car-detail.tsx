'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Gauge, Zap, Users, Cog, Fuel, Navigation, Calendar, Shield, Clock, Star, Share2, Heart, MessageCircle } from 'lucide-react';
import { type Car, type SiteSettings, api, parseFeatures } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SectionReveal } from '../section-reveal';
import { useLanguage } from '@/lib/language-context';

export function CarDetailPage({
  cars, slug, nav, settings,
}: {
  cars: Car[];
  slug: string;
  nav: (p: string) => void;
  settings: SiteSettings;
}) {
  const { t } = useLanguage();
  const car = cars.find(c => c.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [packageType, setPackageType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [days, setDays] = useState(1);
  const [booking, setBooking] = useState({ name: '', email: '', phone: '', startDate: '', endDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => { setActiveImage(0); setPackageType('daily'); setDays(1); }, [slug]);

  const related = useMemo(() => {
    if (!car) return [];
    return cars.filter(c => c.id !== car.id && c.categoryId === car.categoryId).slice(0, 3);
  }, [car, cars]);

  if (!car) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <div className="font-serif text-4xl text-ink mb-4">{t('car.notFound')}</div>
        <button onClick={() => nav('/fleet')} className="text-brand uppercase-luxe hover:underline">← {t('car.backToFleet')}</button>
      </div>
    );
  }

  const features = parseFeatures(car.features);
  const basePrice = packageType === 'daily' ? car.priceDaily : packageType === 'weekly' ? car.priceWeekly : car.priceMonthly;
  const totalPrice = packageType === 'daily' ? basePrice * days : basePrice;
  const images = car.images.length ? car.images.map(i => i.url) : [car.heroImage];
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const submit = async () => {
    if (!booking.name || !booking.phone || !booking.startDate || !booking.endDate) {
      toast.error('Please complete name, phone, and dates.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/bookings', {
        carId: car.id, customerName: booking.name, email: booking.email, phone: booking.phone,
        startDate: booking.startDate, endDate: booking.endDate, packageType, notes: booking.notes,
      });
      toast.success('Reservation request received. Our concierge will contact you shortly.');
      setBooking({ name: '', email: '', phone: '', startDate: '', endDate: '', notes: '' });
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `${car.brand.name} ${car.model}`, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard.');
    }
  };

  const specs = [
    { icon: Gauge,       labelKey: 'car.topSpeed' as const,     label: 'Top Speed',     value: car.topSpeed },
    { icon: Zap,         labelKey: 'car.acceleration' as const,   label: '0-100',         value: car.acceleration },
    { icon: Cog,         labelKey: 'car.specs' as const,          label: 'Engine',        value: car.engine },
    { icon: Star,        labelKey: 'car.power' as const,          label: 'Power',         value: car.power },
    { icon: Cog,         labelKey: 'car.specs' as const,          label: 'Transmission',  value: car.transmission },
    { icon: Navigation,  labelKey: 'car.specs' as const,          label: 'Drivetrain',    value: car.drivetrain },
    { icon: Users,       labelKey: 'car.specs' as const,          label: 'Seats',         value: `${car.seats}` },
    { icon: Fuel,        labelKey: 'car.specs' as const,          label: 'Fuel',          value: car.fuelType },
  ];

  return (
    <div className="pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => nav('/fleet')}
            className="flex items-center gap-2 text-xs uppercase-luxe text-ink hover:text-brand transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('car.backToFleet')}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFavorited(!favorited)}
              className="w-9 h-9 border border-rule flex items-center justify-center hover:bg-brand/10 transition-colors"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'text-brand fill-brand' : 'text-ink-soft'}`} />
            </button>
            <button
              onClick={share}
              className="w-9 h-9 border border-rule flex items-center justify-center hover:bg-brand/10 transition-colors"
            >
              <Share2 className="w-4 h-4 text-ink-soft hover:text-brand" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero gallery + info */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-5 gap-10 pb-16">
        <div className="lg:col-span-3">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] bg-paper-warm overflow-hidden cursor-zoom-in gradient-border"
            onClick={() => setZoomed(!zoomed)}
          >
            <img
              src={images[activeImage]}
              alt={`${car.brand.name} ${car.model}`}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${zoomed ? 'scale-150' : 'scale-100'}`}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-brand backdrop-blur px-3 py-1 text-[0.65rem] uppercase tracking-wide-2 text-white">{car.category.name}</span>
              {!car.available && (
                <span className="bg-slate-800/90 backdrop-blur px-3 py-1 text-[0.65rem] uppercase tracking-wide-2 text-white">{t('car.currentlyReserved')}</span>
              )}
            </div>
            <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur px-3 py-1 text-xs text-ink">
              {activeImage + 1} / {images.length}
            </div>
          </motion.div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setActiveImage(i); setZoomed(false); }}
                className={`relative aspect-[4/3] overflow-hidden border-2 transition-all ${
                  i === activeImage ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="uppercase-luxe mb-3">{car.brand.name} · {car.year}</div>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-3 leading-tight">{car.model}</h1>
          <p className="text-ink mb-6 leading-relaxed text-lg">{car.tagline}</p>

          {/* Quick specs row */}
          <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-rule">
            <div className="text-center">
              <Gauge className="w-5 h-5 text-brand mx-auto mb-1" />
              <div className="text-xs text-ink-soft uppercase tracking-wide-2">{t('car.topSpeed')}</div>
              <div className="text-ink font-serif">{car.topSpeed}</div>
            </div>
            <div className="text-center">
              <Zap className="w-5 h-5 text-brand mx-auto mb-1" />
              <div className="text-xs text-ink-soft uppercase tracking-wide-2">{t('car.acceleration')}</div>
              <div className="text-ink font-serif">{car.acceleration}</div>
            </div>
            <div className="text-center">
              <Star className="w-5 h-5 text-brand mx-auto mb-1" />
              <div className="text-xs text-ink-soft uppercase tracking-wide-2">{t('car.power')}</div>
              <div className="text-ink font-serif">{car.power}</div>
            </div>
          </div>

          {/* Package selector */}
          <div className="mb-6">
            <Label className="uppercase-luxe mb-3 block">{t('car.choosePackage')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => { setPackageType(p); setDays(p === 'daily' ? 1 : 1); }}
                  className={`p-4 border text-center transition-all ${
                    packageType === p
                      ? 'border-gold bg-rule text-brand'
                      : 'border-rule text-ink hover:border-brand/40'
                  }`}
                >
                  <div className="text-[0.65rem] uppercase tracking-wide-2 mb-1">{p === 'daily' ? t('car.daily') : p === 'weekly' ? t('car.weekly') : t('car.monthly')}</div>
                  <div className="font-serif text-base">
                    AED {new Intl.NumberFormat('en-AE').format(p === 'daily' ? car.priceDaily : p === 'weekly' ? car.priceWeekly : car.priceMonthly)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Days selector for daily */}
          {packageType === 'daily' && (
            <div className="mb-6 flex items-center gap-4">
              <Label className="uppercase-luxe">{t('car.days')}</Label>
              <div className="flex items-center gap-3">
                <button onClick={() => setDays(Math.max(1, days - 1))} className="w-8 h-8 border border-rule text-brand hover:bg-brand/10">−</button>
                <span className="font-serif text-2xl text-ink w-10 text-center">{days}</span>
                <button onClick={() => setDays(days + 1)} className="w-8 h-8 border border-rule text-brand hover:bg-brand/10">+</button>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs text-ink-soft uppercase tracking-wide-2">{t('car.total')}</div>
                <div className="font-serif text-2xl text-brand">AED {new Intl.NumberFormat('en-AE').format(totalPrice)}</div>
              </div>
            </div>
          )}

          {/* Booking form */}
          <div className="glass-card p-6 mb-4">
            <div className="uppercase-luxe mb-4">{t('car.reserveTitle')}</div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder={t('car.fullNameReq')}
                  value={booking.name}
                  onChange={e => setBooking({ ...booking, name: e.target.value })}
                  className="bg-transparent border-rule text-ink placeholder:text-ink-softer rounded-none"
                />
                <Input
                  placeholder={t('car.phoneReq')}
                  value={booking.phone}
                  onChange={e => setBooking({ ...booking, phone: e.target.value })}
                  className="bg-transparent border-rule text-ink placeholder:text-ink-softer rounded-none"
                />
              </div>
              <Input
                type="email"
                placeholder={t('car.emailOptional')}
                value={booking.email}
                onChange={e => setBooking({ ...booking, email: e.target.value })}
                className="bg-transparent border-rule text-ink placeholder:text-ink-softer rounded-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[0.65rem] uppercase tracking-wide-2 text-ink-soft mb-1 block">{t('car.pickup')}</Label>
                  <Input
                    type="date"
                    value={booking.startDate}
                    onChange={e => setBooking({ ...booking, startDate: e.target.value })}
                    className="bg-transparent border-rule text-ink rounded-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <Label className="text-[0.65rem] uppercase tracking-wide-2 text-ink-soft mb-1 block">{t('car.return')}</Label>
                  <Input
                    type="date"
                    value={booking.endDate}
                    onChange={e => setBooking({ ...booking, endDate: e.target.value })}
                    className="bg-transparent border-rule text-ink rounded-none [color-scheme:dark]"
                  />
                </div>
              </div>
              <Textarea
                placeholder={t('car.specialRequests')}
                value={booking.notes}
                onChange={e => setBooking({ ...booking, notes: e.target.value })}
                className="bg-transparent border-rule text-ink placeholder:text-ink-softer rounded-none min-h-[80px]"
              />
              <Button
                onClick={submit}
                disabled={submitting || !car.available}
                className="w-full bg-brand text-white hover:bg-brand-bright rounded-none tracking-luxe uppercase text-xs disabled:opacity-50 shine-on-hover"
              >
                {submitting ? t('car.submitting') : !car.available ? t('car.currentlyUnavailable') : `${t('car.requestReservation')} · AED ${new Intl.NumberFormat('en-AE').format(totalPrice)}`}
              </Button>
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello, I'd like to rent the ${car.brand.name} ${car.model}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-[#25D366]/40 text-[#25D366] px-4 py-3 text-xs tracking-luxe uppercase hover:bg-[#25D366]/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> {t('cta.whatsappDirect')}
              </a>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-ink"><Shield className="w-4 h-4 text-brand" /> {t('car.comprehensiveInsurance')}</div>
            <div className="flex items-center gap-2 text-ink"><Clock className="w-4 h-4 text-brand" /> {t('car.concierge247')}</div>
            <div className="flex items-center gap-2 text-ink"><Check className="w-4 h-4 text-brand" /> {car.deposit || 'No Deposit'}</div>
            <div className="flex items-center gap-2 text-ink"><Calendar className="w-4 h-4 text-brand" /> {car.mileageLimit || 'Unlimited km'}</div>
          </div>
        </div>
      </div>

      {/* Specs grid — redesigned with gradient cards, colored icons, visual depth */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-rule">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-10">
            <span className="gold-divider" />
            <span className="uppercase-luxe">{t('car.specs')}</span>
          </div>
        </SectionReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {specs.map((s, i) => {
            const Icon = s.icon;
            return (
              <SectionReveal key={s.label} delay={i * 0.05}>
                <div className="relative rounded-xl p-6 bg-gradient-to-br from-white to-slate-50 border border-rule hover:border-brand/40 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                  {/* Decorative gradient blob */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-colors" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-3 group-hover:bg-brand group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-[0.65rem] uppercase tracking-wide-2 text-ink-softer mb-1 font-semibold">{s.labelKey ? t(s.labelKey as any) : s.label}</div>
                    <div className="font-serif text-lg text-ink">{s.value}</div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>

      {/* Description — redesigned with elegant card, accent border, quote-style */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 border-t border-rule">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-10">
            <span className="gold-divider" />
            <span className="uppercase-luxe">{t('car.automobile')}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
            {car.tagline}
          </h2>
          <div className="relative bg-gradient-to-br from-slate-50 to-white border-l-4 border-brand rounded-r-xl p-8 shadow-sm">
            <p className="text-ink-soft text-lg leading-relaxed">
              {car.description}
            </p>
          </div>

          {features.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-12 mb-6">
                <span className="gold-divider" />
                <span className="uppercase-luxe">{t('car.notableFeatures')}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((f, idx) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-rule rounded-lg hover:border-brand/40 hover:shadow-sm hover:bg-brand/5 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors">
                      <Check className="w-4 h-4 text-brand group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-ink text-sm font-medium">{f}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </SectionReveal>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-rule">
          <SectionReveal>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <span className="gold-divider" />
                <span className="uppercase-luxe">{t('car.youMayDesire')}</span>
              </div>
              <button onClick={() => nav('/fleet')} className="text-xs uppercase-luxe text-brand hover:underline flex items-center gap-2">
                {t('cta.viewAll')} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((c, i) => (
              <SectionReveal key={c.id} delay={i * 0.1}>
                <button onClick={() => nav(`/car/${c.slug}`)} className="group text-left w-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-warm mb-3 gradient-border">
                    <img src={c.heroImage} alt={c.model} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  </div>
                  <div className="uppercase-luxe text-[0.65rem] mb-1">{c.brand.name}</div>
                  <div className="font-serif text-xl text-ink group-hover:text-brand transition-colors">{c.model}</div>
                  <div className="text-sm text-brand mt-1">AED {new Intl.NumberFormat('en-AE').format(c.priceDaily)} / day</div>
                </button>
              </SectionReveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
