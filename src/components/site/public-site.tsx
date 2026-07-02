'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Instagram, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type Car, type Category, type Brand, type SiteSettings,
  api,
} from '@/lib/types';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import { HomePage } from './pages/home';
import { FleetPage } from './pages/fleet';
import { CarDetailPage } from './pages/car-detail';
import { AboutPage } from './pages/about';
import { ContactPage } from './pages/contact';
import { ScrollProgress } from './scroll-progress';
import { FloatingWhatsApp } from './floating-whatsapp';
import { BackToTop } from './back-to-top';
import { LanguageSwitcher } from './language-switcher';
import { CarIntro } from './car-intro';
import { DemoDisclaimerPopup } from './demo-disclaimer-popup';

export interface Route {
  name: 'home' | 'fleet' | 'car' | 'about' | 'contact' | 'admin';
  slug?: string;
  query?: string;
}

export function PublicSite({ route }: { route: Route }) {
  return (
    <LanguageProvider>
      <PublicSiteInner route={route} />
    </LanguageProvider>
  );
}

function PublicSiteInner({ route }: { route: Route }) {
  const { t, dir } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [carsRes, catsRes, brandsRes, settingsRes] = await Promise.all([
        api.get<{ cars: Car[] }>('/api/cars'),
        api.get<{ categories: Category[] }>('/api/categories'),
        api.get<{ brands: Brand[] }>('/api/brands'),
        api.get<{ settings: SiteSettings }>('/api/settings'),
      ]);
      setCars(carsRes.cars);
      setCategories(catsRes.categories);
      setBrands(brandsRes.brands);
      setSettings(settingsRes.settings || null);
    } catch (e: any) {
      console.error('Failed to load site data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const onShow = () => loadData();
    window.addEventListener('phronesis:refresh', onShow);
    return () => window.removeEventListener('phronesis:refresh', onShow);
  }, [loadData]);

  const nav = (path: string) => {
    window.location.hash = path;
    setMobileMenuOpen(false);
  };

  const settings_ = settings || {
    brandName: 'PHRONESIS', tagline: 'Luxury Car Atelier — Al Ain',
    phone: '+971561669766', whatsapp: '+971561669766',
    email: 'concierge@phronesis.ae', address: 'Al Ain, UAE',
    instagram: 'https://instagram.com', heroHeadline: 'The Art of Arrival',
    heroSubtext: '', aboutText: '', id: '',
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink" dir={dir}>
      <CarIntro />
      <DemoDisclaimerPopup />
      <ScrollProgress />
      <Header
        settings={settings_}
        route={route}
        nav={nav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name + (route.slug || '') + (route.query || '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {loading ? (
              <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                  <div className="text-gold uppercase-luxe animate-pulse">{t('home.loadingAtelier')}</div>
                </div>
              </div>
            ) : (
              <>
                {route.name === 'home' && (
                  <HomePage cars={cars} categories={categories} brands={brands} settings={settings_} nav={nav} />
                )}
                {route.name === 'fleet' && (
                  <FleetPage cars={cars} categories={categories} brands={brands} nav={nav} initialQuery={route.query} />
                )}
                {route.name === 'car' && route.slug && (
                  <CarDetailPage cars={cars} slug={route.slug} nav={nav} settings={settings_} />
                )}
                {route.name === 'about' && <AboutPage settings={settings_} nav={nav} />}
                {route.name === 'contact' && <ContactPage settings={settings_} />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer settings={settings_} nav={nav} />
      <FloatingWhatsApp phone={settings_.whatsapp} brand={settings_.brandName} />
      <BackToTop />
    </div>
  );
}

// ---------- Header ----------
function Header({
  settings, route, nav, mobileMenuOpen, setMobileMenuOpen,
}: {
  settings: any;
  route: Route;
  nav: (p: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: t('nav.home'),    path: '/',       route: 'home' },
    { label: t('nav.fleet'),   path: '/fleet',  route: 'fleet' },
    { label: t('nav.atelier'), path: '/about',  route: 'about' },
    { label: t('nav.contact'), path: '/contact',route: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-rule shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => nav('/')} className="group flex items-center gap-3 flex-shrink-0">
          <span className="font-serif text-2xl tracking-wide-2 text-ink group-hover:text-brand transition-colors">
            PHRONESIS
          </span>
          <span className="hidden md:block text-[0.6rem] uppercase-luxe">AL AIN</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item) => {
            const active = route.name === item.route;
            return (
              <button
                key={item.path}
                onClick={() => nav(item.path)}
                className={`text-sm tracking-wide-2 uppercase transition-colors relative py-1 ${
                  active ? 'text-gold' : 'text-soft hover:text-gold'
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gold"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side: Language + Phone + CTA */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <LanguageSwitcher />
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-2 text-sm text-soft hover:text-gold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline" dir="ltr">{settings.phone}</span>
          </a>
          <Button
            onClick={() => nav('/fleet')}
            variant="outline"
            className="border-gold/50 text-gold hover:bg-gold hover:text-obsidian rounded-none px-6 tracking-wide-2 uppercase text-xs"
          >
            {t('cta.reserve')}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-ink"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/97 backdrop-blur-xl border-t border-rule overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => nav(item.path)}
                  className="text-left text-sm tracking-wide-2 uppercase text-soft hover:text-gold py-3 border-b border-gold/5"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 pb-2 flex items-center justify-between">
                <span className="text-[0.65rem] uppercase-luxe">{t('nav.contact')}</span>
                <LanguageSwitcher />
              </div>
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-soft py-2">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span dir="ltr">{settings.phone}</span>
              </a>
              <Button
                onClick={() => nav('/fleet')}
                className="bg-gold text-obsidian hover:bg-gold-bright rounded-none mt-2 tracking-wide-2 uppercase text-xs"
              >
                {t('cta.reserveCar')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---------- Footer ----------
function Footer({ settings, nav }: { settings: any; nav: (p: string) => void }) {
  const { t } = useLanguage();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  return (
    <footer className="mt-auto bg-paper-cool border-t border-rule">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="font-serif text-3xl text-ink mb-3">PHRONESIS</div>
          <div className="uppercase-luxe mb-4">{settings.tagline}</div>
          <p className="text-sm text-ink-soft max-w-md leading-relaxed">
            {settings.aboutText?.slice(0, 200) || 'Al Ain\'s atelier of extraordinary automobiles, delivered with concierge care 24/7.'}{settings.aboutText?.length > 200 ? '…' : ''}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer"
               className="w-10 h-10 border border-rule flex items-center justify-center hover:bg-brand hover:border-brand transition-colors group">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand group-hover:text-white" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
            <a href={`tel:${settings.phone}`} className="w-10 h-10 border border-rule flex items-center justify-center hover:bg-brand hover:border-brand transition-colors group">
              <Phone className="w-4 h-4 text-brand group-hover:text-white" />
            </a>
            <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 border border-rule flex items-center justify-center hover:bg-brand hover:border-brand transition-colors group">
              <Instagram className="w-4 h-4 text-brand group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Explore — NO admin link (clients access /admin directly via URL) */}
        <div>
          <div className="uppercase-luxe mb-4">{t('footer.explore')}</div>
          <div className="flex flex-col gap-3 text-sm text-ink-soft">
            <button onClick={() => nav('/')} className="hover:text-brand text-left transition-colors">{t('nav.home')}</button>
            <button onClick={() => nav('/fleet')} className="hover:text-brand text-left transition-colors">{t('nav.fleet')}</button>
            <button onClick={() => nav('/about')} className="hover:text-brand text-left transition-colors">{t('nav.atelier')}</button>
            <button onClick={() => nav('/contact')} className="hover:text-brand text-left transition-colors">{t('nav.contact')}</button>
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="uppercase-luxe mb-4">{t('footer.concierge')}</div>
          <div className="flex flex-col gap-3 text-sm text-ink-soft">
            <a href={`tel:${settings.phone}`} className="hover:text-brand transition-colors" dir="ltr">{settings.phone}</a>
            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="hover:text-brand flex items-center gap-2 transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {t('contact.whatsapp')}
            </a>
            <a href={`mailto:${settings.email}`} className="hover:text-brand transition-colors">{settings.email}</a>
            <div className="text-ink-softer pt-2">{settings.address}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-softer">
          <div>© {new Date().getFullYear()} {settings.brandName}. {t('footer.rights')}</div>
          <div className="tracking-wide-2 uppercase">{t('footer.crafted')}</div>
          {/* Phronesis Studio attribution link — identical to al-ain-properties reference */}
          <a
            href="https://phronesis-studio.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-ink-softer hover:text-brand transition-colors group"
            title="Phronesis Studio — Studio of Practical Wisdom"
          >
            <img
              src="/phronesis-logo.png"
              alt="Phronesis Studio"
              className="h-6 w-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span>Website crafted by Phronesis Studio</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
