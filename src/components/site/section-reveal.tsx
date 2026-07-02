'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

// 1. SectionReveal — fade up on scroll
export function SectionReveal({
  children,
  delay = 0,
  y = 30,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 2. TiltCard — 3D tilt on hover (subtle, premium feel)
export function TiltCard({
  children,
  className = '',
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateY(-4px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

// 3. StaggerChildren — staggered reveal of children
export function StaggerChildren({
  children,
  className = '',
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 4. Parallax — subtle parallax on scroll
export function Parallax({
  children,
  className = '',
  speed = 0.3,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// 5. AnimatedUnderline — link with growing underline on hover
export function AnimatedUnderline({ children, className = '', color = 'currentColor' }: { children: ReactNode; className?: string; color?: string }) {
  return (
    <span className={`relative inline-block group ${className}`}>
      {children}
      <span
        className="absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-300 ease-out"
        style={{ background: color }}
      />
    </span>
  );
}

// 6. PulseGlow — pulsing glow ring (for badges, CTA highlights)
export function PulseGlow({ children, className = '', color = 'rgba(30, 64, 175, 0.4)' }: { children: ReactNode; className?: string; color?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: color, animationDuration: '2s' }}
      />
      {children}
    </div>
  );
}
