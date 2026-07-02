'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { LANGUAGES, type Language } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const select = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border border-gold/25 text-ink hover:bg-gold/10 hover:border-gold/50 transition-colors text-xs uppercase tracking-wide-2"
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-gold" />
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <span className="sm:hidden text-base">{current.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full mt-2 right-0 min-w-[180px] glass-card border border-gold/30 overflow-hidden z-50"
          >
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => select(l.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left ${
                  l.code === lang ? 'bg-gold/15 text-gold' : 'text-soft hover:bg-gold/8 hover:text-gold'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">{l.flag}</span>
                  <span className="font-medium">{l.nativeLabel}</span>
                </span>
                {l.code === lang && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
