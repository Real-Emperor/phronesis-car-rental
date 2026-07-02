'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CarIntro — A sleek supercar speeds across the screen on first load.
 * Plays ONCE per browser session (sessionStorage).
 * Total duration: ~2.4 seconds.
 */
export function CarIntro() {
  // Lazy initializer — read sessionStorage ONCE on first render (no effect, no cascading render)
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    const seen = sessionStorage.getItem('phronesis-intro-seen');
    if (!seen) {
      sessionStorage.setItem('phronesis-intro-seen', '1');
      return true;
    }
    return false;
  });
  const [done, setDone] = useState(!show);

  useEffect(() => {
    if (!show) return;
    // Hide after animation completes
    const t = setTimeout(() => {
      setShow(false);
      setDone(true);
    }, 2600);
    return () => clearTimeout(t);
  }, [show]);

  // Once done, render nothing (releases the DOM)
  if (done && !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: '#ffffff' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Speed lines background — streaking past to convey motion */}
          <SpeedLines />

          {/* Headlight beam that sweeps with the car */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ left: '-30vw', opacity: 0 }}
            animate={{
              left: [' -30vw', '40vw', '40vw', '130vw'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.2,
              times: [0, 0.35, 0.55, 1],
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              width: '60vw',
              height: '40vh',
              background: 'radial-gradient(ellipse at left center, rgba(30, 64, 175,0.35), rgba(30, 64, 175,0.08) 40%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* The car — speeds in from left, brakes to a brief stop, then blasts off right */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            initial={{ left: '-25vw', opacity: 0 }}
            animate={{
              left: ['-25vw', '38vw', '42vw', '130vw'],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              duration: 2.2,
              times: [0, 0.32, 0.55, 1],
              ease: [0.4, 0, 0.2, 1], // fast in, brief hold, fast out
            }}
          >
            <SupercarSVG />
          </motion.div>

          {/* Brake-light flash when car stops in center */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 1, 0.6, 0, 0],
              left: ['38vw', '38vw', '38vw', '40vw', '50vw', '130vw'],
            }}
            transition={{
              duration: 2.2,
              times: [0, 0.3, 0.4, 0.5, 0.6, 1],
              ease: 'easeOut',
            }}
            style={{
              width: '120px',
              height: '60px',
              marginTop: '-10px',
              background: 'radial-gradient(ellipse at right center, rgba(255,40,60,0.9), rgba(255,40,60,0.2) 50%, transparent 80%)',
              filter: 'blur(8px)',
            }}
          />

          {/* Brand reveal — PHRONESIS fades in as car stops, fades out as car leaves */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, letterSpacing: '0.5em' }}
              animate={{
                opacity: [0, 0, 1, 1, 0],
                y: [20, 20, 0, 0, -10],
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.35, 0.5, 0.65, 0.85],
                ease: 'easeOut',
              }}
              className="font-serif text-5xl md:text-7xl text-ink tracking-luxe"
              style={{ textShadow: '0 0 40px rgba(30, 64, 175,0.5)' }}
            >
              PHRONESIS
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 0] }}
              transition={{
                duration: 2.2,
                times: [0, 0.4, 0.5, 0.65, 0.85],
              }}
              className="mt-4 text-xs tracking-luxe uppercase text-brand"
            >
              Luxury Car Atelier · Al Ain
            </motion.div>
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => { setShow(false); setDone(true); }}
            className="absolute bottom-8 right-8 text-xs uppercase tracking-luxe text-softer hover:text-brand transition-colors"
          >
            Skip →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Speed lines streaking past ----------
function SpeedLines() {
  // Generate 24 horizontal lines at varying heights, lengths, delays
  const lines = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    top: 10 + (i * 3.5) + Math.random() * 2,
    duration: 0.6 + Math.random() * 0.5,
    delay: Math.random() * 1.5,
    width: 80 + Math.random() * 200,
    opacity: 0.2 + Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {lines.map(l => (
        <motion.div
          key={l.id}
          className="absolute h-px"
          style={{
            top: `${l.top}%`,
            width: `${l.width}px`,
            background: 'linear-gradient(90deg, transparent, rgba(30, 64, 175,0.8), transparent)',
          }}
          initial={{ left: '-30vw', opacity: 0 }}
          animate={{
            left: ['-30vw', '130vw'],
            opacity: [0, l.opacity, 0],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// ---------- Sleek supercar SVG (side profile, modern hypercar silhouette) ----------
function SupercarSVG() {
  return (
    <svg
      width="380"
      height="140"
      viewBox="0 0 380 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 10px 30px rgba(30, 64, 175,0.3))' }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="40%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0066aa" />
        </linearGradient>
        <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#1a2840" />
        </linearGradient>
        <radialGradient id="headlightGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="rgba(30, 64, 175,0)" />
        </radialGradient>
        <radialGradient id="taillightGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4060" />
          <stop offset="60%" stopColor="rgba(255,40,60,0.5)" />
          <stop offset="100%" stopColor="rgba(255,40,60,0)" />
        </radialGradient>
      </defs>

      {/* Headlight glow (front, right side) */}
      <ellipse cx="358" cy="78" rx="28" ry="14" fill="url(#headlightGrad)" opacity="0.95" />

      {/* Taillight glow (back, left side) */}
      <ellipse cx="22" cy="78" rx="18" ry="10" fill="url(#taillightGrad)" opacity="0.95" />

      {/* Car body — low, wide, aggressive hypercar silhouette */}
      <path
        d="M 18 88
           L 30 78
           L 60 70
           L 90 58
           L 130 50
           L 175 46
           L 220 48
           L 260 56
           L 295 64
           L 330 72
           L 355 80
           L 362 88
           L 355 96
           L 320 98
           L 280 96
           L 240 98
           L 180 100
           L 120 98
           L 70 98
           L 30 96
           Z"
        fill="url(#bodyGrad)"
        stroke="#f59e0b"
        strokeWidth="0.5"
        opacity="0.95"
      />

      {/* Windshield + side windows (sleek cockpit) */}
      <path
        d="M 95 60
           L 130 52
           L 175 48
           L 215 50
           L 240 56
           L 230 64
           L 200 62
           L 165 60
           L 130 64
           Z"
        fill="url(#windowGrad)"
        opacity="0.95"
      />

      {/* Window divider line */}
      <line x1="180" y1="48" x2="178" y2="62" stroke="#1e40af" strokeWidth="0.6" opacity="0.6" />

      {/* Side air intake (aggressive side blade) */}
      <path
        d="M 245 70 L 285 78 L 280 88 L 250 84 Z"
        fill="#ffffff"
        opacity="0.85"
      />

      {/* Front splitter (aggressive front lip) */}
      <path
        d="M 340 88 L 362 90 L 360 96 L 335 94 Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Wheels — front (right) and rear (left), with motion blur rim */}
      <g>
        {/* Rear wheel */}
        <circle cx="90" cy="96" r="20" fill="#ffffff" />
        <circle cx="90" cy="96" r="14" fill="#e2e8f0" />
        <circle cx="90" cy="96" r="8" fill="#1e40af" opacity="0.4" />
        {/* Spokes (motion-blurred by transparency) */}
        <g opacity="0.6" stroke="#f59e0b" strokeWidth="1.2">
          <line x1="90" y1="82" x2="90" y2="110" />
          <line x1="76" y1="96" x2="104" y2="96" />
          <line x1="80" y1="86" x2="100" y2="106" />
          <line x1="80" y1="106" x2="100" y2="86" />
        </g>
        <circle cx="90" cy="96" r="3" fill="#f59e0b" />

        {/* Front wheel */}
        <circle cx="290" cy="96" r="20" fill="#ffffff" />
        <circle cx="290" cy="96" r="14" fill="#e2e8f0" />
        <circle cx="290" cy="96" r="8" fill="#1e40af" opacity="0.4" />
        <g opacity="0.6" stroke="#f59e0b" strokeWidth="1.2">
          <line x1="290" y1="82" x2="290" y2="110" />
          <line x1="276" y1="96" x2="304" y2="96" />
          <line x1="280" y1="86" x2="300" y2="106" />
          <line x1="280" y1="106" x2="300" y2="86" />
        </g>
        <circle cx="290" cy="96" r="3" fill="#f59e0b" />
      </g>

      {/* Highlight line along the top edge (catches the light) */}
      <path
        d="M 60 70 L 90 58 L 130 50 L 175 46 L 220 48 L 260 56 L 295 64 L 330 72"
        stroke="#ffffff"
        strokeWidth="0.8"
        opacity="0.5"
        fill="none"
      />

      {/* Underside glow (cyan underglow like a tuned supercar) */}
      <ellipse cx="190" cy="105" rx="160" ry="6" fill="#1e40af" opacity="0.3" filter="blur(4px)" />
    </svg>
  );
}
