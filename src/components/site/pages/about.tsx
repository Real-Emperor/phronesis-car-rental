'use client';

import { motion } from 'framer-motion';
import { Award, Shield, Clock, MapPin, Sparkles, Check, ArrowRight } from 'lucide-react';
import { type SiteSettings } from '@/lib/types';
import { SectionReveal } from '../section-reveal';
import { AnimatedCounter } from '../animated-counter';
import { useLanguage } from '@/lib/language-context';

export function AboutPage({ settings, nav }: { settings: SiteSettings; nav: (p: string) => void }) {
  const { t } = useLanguage();
  const pillars = [
    { icon: Award,    title: t('about.curatedSelection'),     text: t('about.curatedSelectionText') },
    { icon: Shield,   title: t('about.comprehensiveCover'),   text: t('about.comprehensiveCoverText') },
    { icon: Clock,    title: t('about.concierge247'),        text: t('about.concierge247Text') },
    { icon: MapPin,   title: t('about.doorToDoor'), text: t('about.doorToDoorText') },
  ];

  const steps = [
    { n: '01', t: 'Choose your automobile', d: 'Browse our curated fleet and select the car that speaks to the occasion.' },
    { n: '02', t: 'Reserve in seconds',    d: 'Pick your dates and package. Instant confirmation, no deposit for verified guests.' },
    { n: '03', t: 'We deliver to you',     d: 'Your car arrives at your hotel, residence, or the airport — cleaned, fuelled, ready.' },
    { n: '04', t: 'Drive. Return. Repeat.', d: 'Enjoy the experience. We collect when you\'re done. No paperwork, no hassle.' },
  ];

  return (
    <div className="pt-32 pb-24">
      {/* Intro */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-24">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="gold-divider" />
            <span className="uppercase-luxe">{t('about.atelier')}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-ink leading-[1.05] mb-8">
            {t('about.heading1')}<br/>{t('about.heading2')}<br/><span className="text-gradient-gold italic">{t('about.headingEmphasis')}</span>
          </h1>
          <p className="text-soft text-lg leading-relaxed max-w-3xl">
            {settings.aboutText || 'Phronesis was founded on a simple premise: that the experience of renting an extraordinary automobile should be as refined as the automobile itself.'}
          </p>
        </SectionReveal>
      </div>

      {/* Image strip with stats */}
      <div className="relative h-[60vh] overflow-hidden mb-24">
        <img
          src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1920&q=85"
          alt={t('about.atelier')}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/70" />
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-12 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { v: 2019, suffix: '', l: t('about.established') },
                { v: 500, suffix: '+', l: t('about.happyClients') },
                { v: 50, suffix: '+', l: t('about.curatedCars') },
                { v: 49, suffix: '★', l: t('about.averageRating') },
              ].map((s, i) => (
                <SectionReveal key={s.l} delay={i * 0.1}>
                  <div>
                    <div className="font-serif text-4xl md:text-5xl text-gradient-gold mb-1">
                      {s.suffix === '★' ? (
                        <>4.9<span className="text-2xl">★</span></>
                      ) : (
                        <AnimatedCounter value={s.v} suffix={s.suffix} duration={2.2} />
                      )}
                    </div>
                    <div className="text-[0.65rem] uppercase-luxe">{s.l}</div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
        <SectionReveal>
          <div className="mb-12 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="gold-divider" />
              <span className="uppercase-luxe">{t('about.principles')}</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">{t('about.fourStandards')}</h2>
          </div>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <SectionReveal key={p.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="glass-card glass-card-hover p-8 h-full group"
                >
                  <div className="w-12 h-12 border border-brand/30 flex items-center justify-center mb-5 group-hover:bg-brand group-hover:border-brand transition-colors">
                    <Icon className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink mb-3">{p.title}</h3>
                  <p className="text-soft leading-relaxed">{p.text}</p>
                </motion.div>
              </SectionReveal>
            );
          })}
        </div>
      </div>

      {/* Process */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-24">
        <SectionReveal>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="gold-divider" />
              <span className="uppercase-luxe">{t('about.process')}</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">{t('about.howItWorks')}</h2>
          </div>
        </SectionReveal>
        <div className="space-y-px">
          {steps.map((step, i) => (
            <SectionReveal key={step.n} delay={i * 0.08}>
              <div className="grid grid-cols-12 gap-6 py-8 border-t border-rule last:border-b">
                <div className="col-span-2 md:col-span-1 font-serif text-3xl text-gradient-gold">{step.n}</div>
                <div className="col-span-10 md:col-span-4">
                  <div className="font-serif text-xl text-ink">{step.t}</div>
                </div>
                <div className="col-span-12 md:col-span-7 text-soft leading-relaxed">{step.d}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-24">
        <SectionReveal>
          <div className="glass-card p-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="gold-divider-center" />
              <span className="uppercase-luxe">{t('about.peaceOfMind')}</span>
              <span className="gold-divider-center" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, label: t('about.fullyInsuredShort') },
                { icon: Check, label: t('about.noHiddenFees') },
                { icon: Clock, label: t('about.support247') },
                { icon: Award, label: t('about.premiumOnly') },
              ].map(b => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="flex flex-col items-center gap-2">
                    <Icon className="w-6 h-6 text-brand" />
                    <div className="text-xs uppercase-luxe">{b.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <SectionReveal>
          <Sparkles className="w-8 h-8 text-brand mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6">
            {t('about.readyToDrive')}
          </h2>
          <button
            onClick={() => nav('/fleet')}
            className="group inline-flex items-center gap-3 bg-brand text-white px-8 py-4 text-xs tracking-luxe uppercase font-medium hover:bg-brand-bright transition-all shine-on-hover"
          >
            {t('cta.viewFleet')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </SectionReveal>
      </div>
    </div>
  );
}
