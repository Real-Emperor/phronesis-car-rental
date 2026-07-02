'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Gauge, Zap, ArrowRight, Calendar, Star, Filter } from 'lucide-react';
import { type Car, type Category, type Brand } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionReveal } from '../section-reveal';
import { useLanguage } from '@/lib/language-context';

export function FleetPage({
  cars, categories, brands, nav, initialQuery,
}: {
  cars: Car[];
  categories: Category[];
  brands: Brand[];
  nav: (p: string) => void;
  initialQuery?: string;
}) {
  const { t } = useLanguage();
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return { category: 'all', brand: 'all', search: '' };
    const hash = window.location.hash.split('?')[1];
    const params = new URLSearchParams(hash || '');
    return {
      category: params.get('category') || 'all',
      brand: params.get('brand') || 'all',
      search: initialQuery || '',
    };
  }, [initialQuery]);

  const [search, setSearch] = useState(initial.search);
  const [category, setCategory] = useState<string>(initial.category);
  const [brand, setBrand] = useState<string>(initial.brand);
  const [sort, setSort] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...cars];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.model.toLowerCase().includes(q) ||
        c.brand.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') list = list.filter(c => c.category.slug === category);
    if (brand !== 'all') list = list.filter(c => c.brand.slug === brand);
    if (priceRange !== 'all') {
      list = list.filter(c => {
        if (priceRange === 'lt2000') return c.priceDaily < 2000;
        if (priceRange === '2000-3000') return c.priceDaily >= 2000 && c.priceDaily < 3000;
        if (priceRange === '3000-4000') return c.priceDaily >= 3000 && c.priceDaily < 4000;
        if (priceRange === 'gt4000') return c.priceDaily >= 4000;
        return true;
      });
    }
    if (sort === 'price-asc')  list.sort((a, b) => a.priceDaily - b.priceDaily);
    if (sort === 'price-desc') list.sort((a, b) => b.priceDaily - a.priceDaily);
    if (sort === 'power')      list.sort((a, b) => (parseInt(b.power) || 0) - (parseInt(a.power) || 0));
    if (sort === 'newest')     list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [cars, search, category, brand, sort, priceRange]);

  const clearFilters = () => {
    setSearch(''); setCategory('all'); setBrand('all'); setSort('newest'); setPriceRange('all');
  };
  const hasFilters = search || category !== 'all' || brand !== 'all' || priceRange !== 'all';

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-12">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="gold-divider" />
            <span className="uppercase-luxe">{t('nav.fleet')}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-ink mb-4">
            {filtered.length} {filtered.length !== 1 ? t('fleet.headingPlural') : t('fleet.heading1')},<br/><span className="text-gradient-gold italic">{t('fleet.headingSuffix1')} {t('fleet.headingEmphasis')}</span>
          </h1>
          <p className="text-soft text-lg max-w-2xl leading-relaxed">
            {t('fleet.intro')}
          </p>
        </SectionReveal>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
        <div className="glass-card p-4 md:p-5">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-softer" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('fleet.searchPlaceholder')}
                className="w-full bg-transparent border border-rule pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-softer focus:outline-none focus:border-gold/60 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 border border-rule px-4 py-3 text-xs uppercase-luxe"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> {t('fleet.filters')} {hasFilters && <span className="w-1.5 h-1.5 bg-brand rounded-full" />}
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px] bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.allTypes")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="all">{t('fleet.allTypes')}</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="w-[160px] bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.allBrands")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="all">{t('fleet.allBrands')}</SelectItem>
                  {brands.map(b => <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[150px] bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.anyPrice")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="all">{t('fleet.anyPrice')}</SelectItem>
                  <SelectItem value="lt2000">{t('fleet.underPrice')}</SelectItem>
                  <SelectItem value="2000-3000">{t('fleet.priceRange1')}</SelectItem>
                  <SelectItem value="3000-4000">{t('fleet.priceRange2')}</SelectItem>
                  <SelectItem value="gt4000">{t('fleet.priceRange3')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[140px] bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.sortNewest")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="newest">{t('fleet.sortNewest')}</SelectItem>
                  <SelectItem value="price-asc">{t('fleet.sortPriceAsc')}</SelectItem>
                  <SelectItem value="price-desc">{t('fleet.sortPriceDesc')}</SelectItem>
                  <SelectItem value="power">{t('fleet.sortPower')}</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs uppercase-luxe text-softer hover:text-brand flex items-center gap-1">
                  <X className="w-3 h-3" /> {t('fleet.clear')}
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-rule grid grid-cols-2 gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.allTypes")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="all">All Types</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.allBrands")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(b => <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.anyPrice")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="lt2000">Under AED 2,000</SelectItem>
                  <SelectItem value="2000-3000">AED 2,000–3,000</SelectItem>
                  <SelectItem value="3000-4000">AED 3,000–4,000</SelectItem>
                  <SelectItem value="gt4000">AED 4,000+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="bg-transparent border-rule text-ink rounded-none"><SelectValue placeholder={t("fleet.sortNewest")} /></SelectTrigger>
                <SelectContent className="bg-paper-warm border-brand/30">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price ↑</SelectItem>
                  <SelectItem value="price-desc">Price ↓</SelectItem>
                  <SelectItem value="power">Most Powerful</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <button onClick={clearFilters} className="col-span-2 text-xs uppercase-luxe text-softer hover:text-brand flex items-center justify-center gap-1 py-2">
                  <X className="w-3 h-3" /> {t('fleet.clearFilters')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {category !== 'all' && (
              <button onClick={() => setCategory('all')} className="flex items-center gap-2 px-3 py-1 bg-rule border border-brand/30 text-brand text-xs">
                {categories.find(c => c.slug === category)?.name} <X className="w-3 h-3" />
              </button>
            )}
            {brand !== 'all' && (
              <button onClick={() => setBrand('all')} className="flex items-center gap-2 px-3 py-1 bg-rule border border-brand/30 text-brand text-xs">
                {brands.find(b => b.slug === brand)?.name} <X className="w-3 h-3" />
              </button>
            )}
            {search && (
              <button onClick={() => setSearch('')} className="flex items-center gap-2 px-3 py-1 bg-rule border border-brand/30 text-brand text-xs">
                "{search}" <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Filter className="w-12 h-12 text-softer mx-auto mb-4" />
            <div className="font-serif text-3xl text-ink mb-4">{t('fleet.noResults')}</div>
            <button onClick={clearFilters} className="text-brand uppercase-luxe hover:underline">{t('fleet.reset')}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((car, i) => (
              <FleetCarCard key={car.id} car={car} nav={nav} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FleetCarCard({ car, nav, index }: { car: Car; nav: (p: string) => void; index: number }) {
  const { t } = useLanguage();
  return (
    <SectionReveal delay={index * 0.05}>
      <motion.div
        onClick={() => nav(`/car/${car.slug}`)}
        className="group cursor-pointer shine-on-hover"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-warm mb-5 gradient-border">
          <img
            src={car.heroImage}
            alt={`${car.brand.name} ${car.model}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {!car.available && (
              <span className="bg-amber-500 px-2.5 py-1 text-[0.65rem] uppercase tracking-wide font-semibold rounded text-white shadow-md">{t('common.reserved')}</span>
            )}
            <span className="bg-brand px-2.5 py-1 text-[0.65rem] uppercase tracking-wide font-semibold rounded text-white shadow-md">
              {car.category.name}
            </span>
          </div>

          {/* Quick specs overlay on hover */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
            <div className="flex items-center gap-4 text-xs text-soft">
              <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-brand" /> {car.topSpeed}</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-brand" /> {car.acceleration}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="uppercase-luxe text-[0.65rem]">{car.brand.name}</div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-brand fill-brand" />)}
            </div>
          </div>
          <h3 className="font-serif text-2xl text-ink group-hover:text-brand transition-colors">{car.model}</h3>
          <p className="text-sm text-soft leading-relaxed line-clamp-1">{car.tagline}</p>

          <div className="flex items-center gap-4 text-xs text-softer pt-2">
            <span className="flex items-center gap-1"><Gauge className="w-3 h-3 text-brand" /> {car.topSpeed}</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-brand" /> {car.acceleration}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-brand" /> {car.year}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-rule">
            <div>
              <span className="text-softer text-xs uppercase tracking-wide-2">{t('common.from')}</span>
              <div className="font-serif text-xl text-brand">
                AED {new Intl.NumberFormat('en-AE').format(car.priceDaily)}<span className="text-xs text-softer ml-1">{t('common.perDay')}</span>
              </div>
            </div>
            <span className="text-xs uppercase-luxe text-brand flex items-center gap-1 group-hover:gap-2 transition-all">
              {t('cta.reserve_now')} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </SectionReveal>
  );
}
// cache-bust
