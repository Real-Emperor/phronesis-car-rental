'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronDown, Gauge, Zap, Star, Shield, Clock, Car,
  Award, Sparkles, Quote, MapPin, Calendar, Search, CheckCircle2,
  PhoneCall, ThumbsUp,
} from 'lucide-react';
import { type Car, type Category, type Brand, type SiteSettings } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';
import { SectionReveal, TiltCard } from '../section-reveal';
import { AnimatedCounter } from '../animated-counter';
import { CinematicHero } from '../cinematic-hero';

export function HomePage({
  cars, categories, brands, settings, nav,
}: {
  cars: Car[];
  categories: Category[];
  brands: Brand[];
  settings: SiteSettings;
  nav: (p: string) => void;
}) {
  const { t } = useLanguage();
  const featuredCars = cars.filter(c => c.featured).slice(0, 6);
  const heroCar = cars.find(c => c.featured) || cars[0];

  return (
    <div>
      <CinematicHero settings={settings} heroCar={heroCar} nav={nav} />
      <TrustBadges />
      <BrandMarquee brands={brands} />
      <FeaturedFleet cars={featuredCars} nav={nav} />
      <WhyChooseUs />
      <StatsBand />
      <HowItWorks />
      <Testimonials />
      <FinalCTA settings={settings} nav={nav} />
    </div>
  );
}

// ============== HERO WITH BOOKING WIDGET ==============
function HeroWithBooking({
  settings, heroCar, nav, categories,
}: {
  settings: SiteSettings;
  heroCar?: Car;
  nav: (p: string) => void;
  categories: Category[];
}) {
  const { t } = useLanguage();
  const [pickupLocation, setPickupLocation] = useState('Al Ain');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [carType, setCarType] = useState('any');

  const search = () => {
    const params = new URLSearchParams();
    if (carType !== 'any') params.set('category', carType);
    nav(`/fleet${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-paper-warm">
      <div className="absolute inset-0 z-0">
        {heroCar && (
          <img
            src={heroCar.heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="gold-divider" />
            <span className="uppercase-luxe">{settings.tagline}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl text-ink leading-[1.05]"
          >
            {settings.heroHeadline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-5 text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed"
          >
            {settings.heroSubtext}
          </motion.p>
        </div>

        {/* BOOKING WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card rounded-xl p-5 md:p-7 max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="text-left">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand" /> {t('home.booking.pickupLocation')}
              </label>
              <select
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value)}
                className="w-full bg-white border border-rule rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              >
                <option>Al Ain</option>
                <option>Abu Dhabi</option>
                <option>Dubai</option>
                <option>Al Ain Airport (AAN)</option>
                <option>Abu Dhabi Airport (AUH)</option>
                <option>Dubai Airport (DXB)</option>
              </select>
            </div>
            <div className="text-left">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand" /> {t('home.booking.pickupDate')}
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                className="w-full bg-white border border-rule rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
            <div className="text-left">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand" /> {t('home.booking.returnDate')}
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                className="w-full bg-white border border-rule rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
            <div className="text-left">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1.5 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-brand" /> {t('home.booking.carType')}
              </label>
              <select
                value={carType}
                onChange={e => setCarType(e.target.value)}
                className="w-full bg-white border border-rule rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              >
                <option value="any">{t('home.booking.anyType')}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-soft">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> {t('home.booking.freeCancellation')}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> {t('home.booking.noHiddenFees')}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> {t('home.booking.support247')}</span>
            </div>
            <button
              onClick={search}
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase tracking-wide rounded-lg shine-on-hover relative"
            >
              <Search className="w-4 h-4" /> {t('home.booking.searchCars')}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl"
        >
          {[
            { value: '50+', label: t('home.booking.carsAvailable') },
            { value: '4.9★', label: t('home.booking.customerRating') },
            { value: '24/7', label: t('home.booking.support') },
            { value: '15min', label: t('home.booking.airportPickup') },
          ].map(s => (
            <div key={s.label}>
              <div className="font-serif text-3xl text-brand">{s.value}</div>
              <div className="text-xs text-ink-soft uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============== TRUST BADGES ==============
function TrustBadges() {
  const { t } = useLanguage();
  const badges = [
    { icon: Shield, title: t('home.fullyInsured2'), desc: t('home.fullyInsured2Text') },
    { icon: Clock, title: t('home.concierge247_2'), desc: t('home.concierge247_2Text') },
    { icon: ThumbsUp, title: t('home.noHiddenFeesShort'), desc: t('home.noHiddenFeesShortText') },
    { icon: Award, title: t('home.premiumCars'), desc: t('home.premiumCarsText') },
  ];
  return (
    <section className="py-10 bg-white border-y border-rule">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <SectionReveal key={b.title} delay={i * 0.08}>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-ink">{b.title}</div>
                  <div className="text-xs text-ink-soft mt-0.5">{b.desc}</div>
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}

// ============== BRAND MARQUEE ==============
function BrandMarquee({ brands }: { brands: Brand[] }) {
  const { t } = useLanguage();
  if (brands.length === 0) return null;
  const doubled = [...brands, ...brands];
  return (
    <section className="py-8 bg-paper-warm border-b border-rule overflow-hidden marquee-container">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-4">
        <div className="text-xs uppercase tracking-wide text-ink-soft text-center font-semibold">
          {t('home.trustBadges')}
        </div>
      </div>
      <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
        {doubled.map((b, i) => (
          <span
            key={i}
            className="font-serif text-2xl md:text-3xl text-ink-softer hover:text-brand transition-colors cursor-default flex-shrink-0"
          >
            {b.name}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============== FEATURED FLEET ==============
function FeaturedFleet({ cars, nav }: { cars: Car[]; nav: (p: string) => void }) {
  const { t } = useLanguage();
  if (cars.length === 0) return null;
  return (
    <section className="section-py">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="gold-divider" />
                <span className="uppercase-luxe">{t('home.featuredFleet')}</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-ink">
                {t('home.choosePremium')}
              </h2>
            </div>
            <button
              onClick={() => nav('/fleet')}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              {t('home.viewAllCars')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, i) => (
            <FeaturedCarCard key={car.id} car={car} nav={nav} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCarCard({ car, nav, index }: { car: Car; nav: (p: string) => void; index: number }) {
  const { t } = useLanguage();
  return (
    <SectionReveal delay={index * 0.08}>
      <TiltCard intensity={4} className="h-full">
        <motion.div
          onClick={() => nav(`/car/${car.slug}`)}
          className="group cursor-pointer glass-card glass-card-hover rounded-xl overflow-hidden h-full"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-warm">
            <img
              src={car.heroImage}
              alt={`${car.brand.name} ${car.model}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span className="bg-brand text-white px-2.5 py-1 text-[0.65rem] uppercase tracking-wide font-semibold rounded shadow-sm">
                {car.category.name}
              </span>
              {!car.available && (
                <span className="bg-ink text-white px-2.5 py-1 text-[0.65rem] uppercase tracking-wide font-semibold rounded shadow-sm">
                  {t('common.reserved')}
                </span>
              )}
            </div>
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-md shadow-md">
              <span className="text-xs text-ink-soft">{t('common.from')}</span>
              <span className="font-serif text-lg text-brand ml-1">AED {new Intl.NumberFormat('en-AE').format(car.priceDaily)}</span>
              <span className="text-xs text-ink-soft">{t('common.perDay')}</span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-ink-soft font-semibold">{car.brand.name}</div>
                <h3 className="font-serif text-xl text-ink mt-0.5 group-hover:text-brand transition-colors">{car.model}</h3>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
              </div>
            </div>
            <p className="text-sm text-ink-soft line-clamp-1 mb-3">{car.tagline}</p>

            <div className="flex items-center gap-4 text-xs text-ink-soft pt-3 border-t border-rule">
              <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-brand" /> {car.topSpeed}</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-brand" /> {car.acceleration}</span>
              <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5 text-brand" /> {car.year}</span>
            </div>
          </div>
        </motion.div>
      </TiltCard>
    </SectionReveal>
  );
}

// ============== WHY CHOOSE US ==============
function WhyChooseUs() {
  const { t } = useLanguage();
  const items = [
    { icon: Award, title: t('home.handSelected2'), text: t('home.handSelected2Text') },
    { icon: Shield, title: t('home.fullyInsured2'), text: t('home.fullyInsured2Text') },
    { icon: Clock, title: t('home.concierge247_2'), text: t('home.concierge247_2Text') },
    { icon: MapPin, title: t('home.freeDelivery'), text: t('home.freeDeliveryText') },
  ];
  return (
    <section className="section-py bg-paper-warm border-y border-rule">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionReveal>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="gold-divider-center" />
              <span className="uppercase-luxe">{t('home.whyPhronesis2')}</span>
              <span className="gold-divider-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">
              {t('home.phronesisDifference')}
            </h2>
            <p className="mt-4 text-ink-soft">{t('home.phronesisDifferenceDesc')}</p>
          </div>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p, i) => {
            const Icon = p.icon;
            return (
              <SectionReveal key={p.title} delay={i * 0.08}>
                <motion.div
                  className="glass-card glass-card-hover rounded-xl p-6 h-full group"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-brand flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-serif text-lg text-ink mb-2">{p.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{p.text}</p>
                </motion.div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============== STATS BAND ==============
function StatsBand() {
  const { t } = useLanguage();
  return (
    <section className="section-py">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 50, suffix: '+', label: t('home.stat.premiumCars') },
            { value: 500, suffix: '+', label: t('home.stat.happyCustomers') },
            { value: 24, suffix: '/7', label: t('home.stat.supportAvailable') },
            { value: 15, suffix: 'min', label: t('home.booking.airportPickup') },
          ].map((s, i) => (
            <SectionReveal key={s.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="font-serif text-5xl md:text-6xl text-gradient-gold mb-1">
                  <AnimatedCounter value={s.value} suffix={s.suffix} duration={2.2} />
                </div>
                <div className="text-sm text-ink-soft uppercase tracking-wide font-semibold">{s.label}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== HOW IT WORKS ==============
function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { n: '01', title: t('home.step1Title2'), text: t('home.step1Text2') },
    { n: '02', title: t('home.step2Title2'), text: t('home.step2Text2') },
    { n: '03', title: t('home.step3Title2'), text: t('home.step3Text2') },
    { n: '04', title: t('home.step4Title2'), text: t('home.step4Text2') },
  ];
  return (
    <section className="section-py bg-paper-warm border-y border-rule">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionReveal>
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="gold-divider-center" />
              <span className="uppercase-luxe">{t('home.howItWorks2')}</span>
              <span className="gold-divider-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">{t('home.rentIn4Steps')}</h2>
          </div>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <SectionReveal key={s.n} delay={i * 0.1}>
              <div className="relative group">
                <motion.div
                  className="font-serif text-5xl text-brand/20 mb-3 group-hover:text-brand/40 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {s.n}
                </motion.div>
                <h3 className="font-serif text-xl text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{s.text}</p>
                {i < 3 && (
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="hidden md:block absolute top-4 -right-3"
                  >
                    <ArrowRight className="w-5 h-5 text-brand/40" />
                  </motion.div>
                )}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== TESTIMONIALS ==============
function Testimonials() {
  const { t } = useLanguage();
  const items = [
    { quote: "The most seamless luxury experience I've had in the UAE. The car arrived at my hotel 20 minutes after landing. Flawless.", author: "James Whitmore", role: "Visiting from London" },
    { quote: "Phronesis understood exactly what I wanted before I did. The Rolls-Royce Ghost was immaculate, the service was invisible.", author: "Aisha Al-Mansoori", role: "Al Ain Resident" },
    { quote: "I've rented from every premium company in the UAE. Phronesis is in a different league entirely. No deposit, no hassle.", author: "Marcus Chen", role: "Entrepreneur, Singapore" },
  ];
  return (
    <section className="section-py">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionReveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="gold-divider-center" />
              <span className="uppercase-luxe">{t('home.testimonials2')}</span>
              <span className="gold-divider-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">{t('home.whatCustomersSay')}</h2>
          </div>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <SectionReveal key={item.author} delay={i * 0.1}>
              <div className="glass-card rounded-xl p-7 h-full flex flex-col">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-accent fill-accent" />)}
                </div>
                <Quote className="w-7 h-7 text-brand/30 mb-3" />
                <p className="text-ink text-base leading-relaxed flex-1 italic">"{item.quote}"</p>
                <div className="mt-5 pt-5 border-t border-rule">
                  <div className="font-semibold text-ink">{item.author}</div>
                  <div className="text-xs text-ink-soft mt-0.5">{item.role}</div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== FINAL CTA ==============
function FinalCTA({ settings, nav }: { settings: SiteSettings; nav: (p: string) => void }) {
  const { t } = useLanguage();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  return (
    <section className="section-py bg-brand relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-15">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <SectionReveal>
          <Sparkles className="w-10 h-10 text-white mx-auto mb-5" />
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-5 leading-tight">
            {t('home.readyToDrive2')}
          </h2>
          <p className="text-white/85 text-lg max-w-2xl mx-auto mb-8">
            {t('home.readyToDrive2Desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => nav('/fleet')}
              className="inline-flex items-center justify-center gap-2 bg-white text-brand px-7 py-3.5 text-sm font-semibold uppercase tracking-wide rounded-lg hover:bg-paper-warm transition-colors shine-on-hover"
            >
              {t('home.browseFleet')} <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide rounded-lg hover:bg-white hover:text-brand transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> {t('home.whatsappUs')}
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
