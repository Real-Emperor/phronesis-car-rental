'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { type Language, LANGUAGES, getTranslation, type TranslationKey } from './i18n';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'phronesis-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Lazy initializer — read from localStorage on first render (no effect, no cascading render)
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved && LANGUAGES.some(l => l.code === saved) ? saved : 'en';
  });

  // Apply direction + lang attribute to <html> whenever lang changes
  useEffect(() => {
    const meta = LANGUAGES.find(l => l.code === lang)!;
    document.documentElement.dir = meta.dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: TranslationKey) => getTranslation(lang, key);
  const meta = LANGUAGES.find(l => l.code === lang)!;
  const dir = meta.dir;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Provide safe fallback so components don't crash if used outside provider
    return {
      lang: 'en' as Language,
      setLang: () => {},
      t: (key: TranslationKey) => getTranslation('en', key),
      dir: 'ltr' as const,
    };
  }
  return ctx;
}
