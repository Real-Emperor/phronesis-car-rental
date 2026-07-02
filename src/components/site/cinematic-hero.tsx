'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { type Car, type SiteSettings } from '@/lib/types';

/**
 * CinematicHero — Premium hero with drifting car entrance animation.
 *
 * Animation sequence:
 * 1. Car visible at low opacity (20%) with subtle blur on load
 * 2. Car performs drift/brake entrance (slides in from right, decelerates, tilts)
 * 3. Smoke/dust effects from tires during drift
 * 4. Motion blur during movement
 * 5. Car settles, text + CTAs fade in over 600-1000ms
 * 6. Continuous subtle loop: suspension bounce, wheel rotation, reflections
 *
 * Technical:
 * - GPU-accelerated CSS transforms (translateX, rotate, scale)
 * - 60fps target
 * - Responsive (desktop/tablet/mobile)
 * - Respects prefers-reduced-motion
 */
export function CinematicHero({
  settings, heroCar, nav,
}: {
  settings: SiteSettings;
  heroCar?: Car;
  nav: (p: string) => void;
}) {
  // Lazy init — check reduced motion on first render (no effect, no cascading render)
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [phase, setPhase] = useState<'entering' | 'settled'>(() => {
    if (typeof window === 'undefined') return 'entering';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'settled' : 'entering';
  });
  const controls = useAnimation();

  useEffect(() => {
    if (phase === 'settled') {
      // Skip animation for reduced motion — just show content
      return;
    }

    // Animation timeline
    const runAnimation = async () => {
      // Phase 1: Drift entrance (car slides in from right with motion blur)
      await controls.start({
        x: ['100vw', '15vw', '10vw', '12vw', '10vw'],
        rotate: [0, -2, 1, -0.5, 0],
        opacity: [0.2, 0.35, 0.4, 0.4, 0.4],
        filter: ['blur(8px)', 'blur(4px)', 'blur(2px)', 'blur(1px)', 'blur(0px)'],
        transition: {
          duration: 2.2,
          times: [0, 0.4, 0.6, 0.8, 1],
          ease: [0.22, 1, 0.36, 1],
        },
      });

      // Phase 2: Settle
      setPhase('settled');

      // Phase 3: Continuous subtle loop
      await controls.start({
        y: [0, -3, 0, -2, 0],
        rotate: [0, 0.15, 0, -0.1, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      });
    };

    runAnimation();
  }, [controls]);

  const cleanPhone = settings.whatsapp?.replace(/[^0-9]/g, '') || '';

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Car background layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Sky/ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-white/80" />

        {/* The car image */}
        {heroCar && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={controls}
            initial={{ x: '100vw', opacity: 0.2, filter: 'blur(8px)' }}
          >
            <img
              src={heroCar.heroImage}
              alt=""
              className="w-full h-full object-cover"
              style={{
                transform: 'scale(1.1)',
                objectPosition: 'center',
              }}
            />
            {/* Motion blur overlay during entrance */}
            {phase === 'entering' && !reducedMotion && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                style={{
                  backdropFilter: 'blur(3px)',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                }}
              />
            )}
          </motion.div>
        )}

        {/* Dust/smoke particles during drift */}
        {phase === 'entering' && !reducedMotion && (
          <SmokeEffects />
        )}

        {/* Scrim for text readability — left side darker */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-white/30" />
      </div>

      {/* Content layer — fades in after car settles */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-20 md:pb-32 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase === 'settled' ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
            animate={phase === 'settled' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
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

// Smoke/dust particle effects
function SmokeEffects() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    initialX: 30 + Math.random() * 40,
    initialY: 60 + Math.random() * 30,
    drift: -20 - Math.random() * 60,
    size: 60 + Math.random() * 80,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.initialX}%`,
            top: `${p.initialY}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'radial-gradient(circle, rgba(200,200,210,0.5) 0%, rgba(200,200,210,0.1) 50%, transparent 70%)',
            filter: 'blur(8px)',
          }}
          initial={{ opacity: 0, scale: 0.3, x: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0.3, 1, 1.5],
            x: [0, p.drift],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
