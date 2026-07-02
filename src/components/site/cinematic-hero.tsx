'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { type Car, type SiteSettings } from '@/lib/types';

/**
 * CinematicHero — Video-based hero with auto-playing car video.
 *
 * - Video auto-plays on page load (muted, looped, no controls)
 * - Video plays behind content with scrims for readability
 * - Text + CTAs fade in over 800ms after video starts
 * - Respects prefers-reduced-motion (shows first frame as poster)
 * - Responsive: works on desktop/tablet/mobile
 */
export function CinematicHero({
  settings, heroCar, nav,
}: {
  settings: SiteSettings;
  heroCar?: Car;
  nav: (p: string) => void;
}) {
  // Track whether video has loaded — triggers text fade-in
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy init reduced motion check (no effect, no cascading render)
  const [reducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const cleanPhone = settings.whatsapp?.replace(/[^0-9]/g, '') || '';

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-slate-900">
      {/* Video background layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroCar?.heroImage}
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-60' : 'opacity-0'}`}
          style={{ filter: 'saturate(1.1) contrast(1.05)' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Fallback image while video loads (or if video fails) */}
        {!videoLoaded && heroCar && (
          <img
            src={heroCar.heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}

        {/* Scrim for text readability — left side brighter, bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-white/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-white/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/30" />
      </div>

      {/* Content layer — fades in after video loads */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-20 md:pb-32 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={videoLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-14 h-0.5 bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {settings.tagline}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] max-w-4xl">
            {settings.heroHeadline}
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed">
            {settings.heroSubtext}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => nav('/fleet')}
              className="group inline-flex items-center justify-center gap-2 bg-brand text-white px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded-lg hover:bg-brand-dark transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              Explore the Fleet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-brand/40 text-ink px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded-lg hover:bg-brand/10 hover:border-brand transition-colors"
            >
              <Phone className="w-4 h-4" /> Speak to Concierge
            </a>
          </div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={videoLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 flex flex-wrap gap-6 text-sm"
          >
            <div>
              <span className="font-serif text-2xl text-brand">40+</span>
              <span className="text-ink-soft ml-2">Cars Available</span>
            </div>
            <div className="hidden sm:block w-px bg-rule" />
            <div>
              <span className="font-serif text-2xl text-brand">4.9★</span>
              <span className="text-ink-soft ml-2">Customer Rating</span>
            </div>
            <div className="hidden sm:block w-px bg-rule" />
            <div>
              <span className="font-serif text-2xl text-brand">24/7</span>
              <span className="text-ink-soft ml-2">Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
