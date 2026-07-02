'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, X } from 'lucide-react';
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

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const select = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border border-rule text-ink hover:bg-brand/10 hover:border-brand/50 transition-colors text-xs uppercase tracking-wide-2 rounded-md bg-white"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe className="w-3.5 h-3.5 text-brand" />
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <span className="sm:hidden text-base">{current.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile: full-screen bottom sheet / Desktop: dropdown */}
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60] md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Mobile bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[61] md:hidden bg-white rounded-t-2xl shadow-2xl pb-[env(safe-area-inset-bottom)]"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-rule rounded-full" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
                <h3 className="font-serif text-lg text-ink">Select Language</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-ink-soft"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Language list */}
              <div className="px-3 py-3 max-h-[60vh] overflow-y-auto">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => select(l.code)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-colors text-left mb-1 ${
                      l.code === lang
                        ? 'bg-brand/10 text-brand border border-brand/30'
                        : 'text-ink hover:bg-muted border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{l.flag}</span>
                      <span>
                        <span className="block font-medium text-base">{l.nativeLabel}</span>
                        <span className="block text-xs text-ink-soft">{l.label}</span>
                      </span>
                    </span>
                    {l.code === lang && <Check className="w-4 h-4 text-brand" />}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Desktop dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="hidden md:block absolute top-full mt-2 right-0 min-w-[220px] bg-white border border-rule rounded-lg shadow-xl overflow-hidden z-50"
            >
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => select(l.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left border-b border-rule last:border-b-0 ${
                    l.code === lang
                      ? 'bg-brand/10 text-brand'
                      : 'text-ink hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{l.flag}</span>
                    <span>
                      <span className="block font-medium">{l.nativeLabel}</span>
                      <span className="block text-[0.65rem] text-ink-soft uppercase tracking-wide">{l.label}</span>
                    </span>
                  </span>
                  {l.code === lang && <Check className="w-4 h-4 text-brand" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
